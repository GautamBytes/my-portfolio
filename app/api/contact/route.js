import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MAIL_TIMEOUT_MS = 15000;

const globalStore = globalThis;
const requestStore = globalStore.__contactRateLimitStore || new Map();
globalStore.__contactRateLimitStore = requestStore;

function getClientIp(request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  return realIp || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const entry = requestStore.get(ip);

  if (!entry) {
    requestStore.set(ip, { count: 1, startedAt: now });
    return false;
  }

  if (now - entry.startedAt > RATE_LIMIT_WINDOW_MS) {
    requestStore.set(ip, { count: 1, startedAt: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  entry.count += 1;
  requestStore.set(ip, entry);
  return false;
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function validatePayload(payload) {
  const fieldErrors = {};

  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';

  if (!name || name.length < 2 || name.length > 120) {
    fieldErrors.name = 'Please enter a valid name (2-120 chars).';
  }

  if (!email || !EMAIL_REGEX.test(email) || email.length > 180) {
    fieldErrors.email = 'Please enter a valid email address.';
  }

  if (!message || message.length < 10 || message.length > 3000) {
    fieldErrors.message = 'Please enter a message between 10 and 3000 characters.';
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
    values: { name, email, message },
  };
}

function getTransporter() {
  if (globalStore.__portfolioMailer) {
    return globalStore.__portfolioMailer;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    pool: true,
    connectionTimeout: MAIL_TIMEOUT_MS,
    greetingTimeout: MAIL_TIMEOUT_MS,
    socketTimeout: MAIL_TIMEOUT_MS,
  });

  globalStore.__portfolioMailer = transporter;
  return transporter;
}

function json(body, status = 200) {
  return NextResponse.json(body, { status });
}

async function sendWithTimeout(transporter, options) {
  let timeoutId;

  try {
    await Promise.race([
      transporter.sendMail(options),
      new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error('MAIL_TIMEOUT'));
        }, MAIL_TIMEOUT_MS);
      }),
    ]);
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(request) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return json({ success: false, error: 'Failed to send email' }, 500);
  }

  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return json({ success: false, error: 'Too many requests' }, 429);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: 'Invalid input' }, 400);
  }

  const honeypot = typeof body.website === 'string' ? body.website.trim() : '';
  if (honeypot) {
    return json({ success: true });
  }

  const validation = validatePayload(body);
  if (!validation.isValid) {
    return json(
      {
        success: false,
        error: 'Invalid input',
        fieldErrors: validation.fieldErrors,
      },
      400
    );
  }

  const safeName = escapeHtml(validation.values.name);
  const safeEmail = escapeHtml(validation.values.email);
  const safeMessage = escapeHtml(validation.values.message).replaceAll('\n', '<br />');

  const transporter = getTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    replyTo: validation.values.email,
    subject: `New Portfolio Message from ${validation.values.name}`,
    text: `Name: ${validation.values.name}\nEmail: ${validation.values.email}\nMessage: ${validation.values.message}`,
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
    `,
  };

  try {
    await sendWithTimeout(transporter, mailOptions);
    return json({ success: true });
  } catch (error) {
    console.error('Contact API send failure', { name: error?.name, message: error?.message });
    return json({ success: false, error: 'Failed to send email' }, 500);
  }
}

