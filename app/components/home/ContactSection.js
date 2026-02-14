'use client';

import { useState } from 'react';
import { track } from '@vercel/analytics';
import { Calendar, Github, Linkedin, Send, Twitter } from 'lucide-react';

const INITIAL_FIELD_ERRORS = {
  name: '',
  email: '',
  message: '',
};

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState(INITIAL_FIELD_ERRORS);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setFieldErrors(INITIAL_FIELD_ERRORS);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      message: String(formData.get('message') || '').trim(),
      website: String(formData.get('website') || '').trim(),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && result.success) {
        track('contact_submit_success');
        setIsSent(true);
        event.currentTarget.reset();
        return;
      }

      if (result.fieldErrors) {
        setFieldErrors({
          name: result.fieldErrors.name || '',
          email: result.fieldErrors.email || '',
          message: result.fieldErrors.message || '',
        });
      }

      setErrorMessage(result.error || 'Something went wrong. Please try again.');
    } catch {
      setErrorMessage('Unable to submit right now. Please try again in a bit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-shell max-w-3xl">
      <h2 className="section-title">Contact Me</h2>

      {isSent ? (
        <div className="surface rounded-xl border border-emerald-500/30 bg-emerald-900/10 p-5 text-center" role="status" aria-live="polite">
          <p className="text-lg font-semibold text-emerald-300">Your message has been sent.</p>
          <p className="mt-2 text-sm text-zinc-300">I will get back to you soon. Thanks for reaching out.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="surface space-y-5 p-6" noValidate>
          <div className="sr-only" aria-hidden="true">
            <label htmlFor="website">Leave this field blank</label>
            <input id="website" name="website" type="text" autoComplete="off" tabIndex={-1} />
          </div>

          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-zinc-300">
              Name
            </label>
            <input id="name" name="name" type="text" required className="input-field" />
            {fieldErrors.name && <p className="mt-1 text-xs text-red-300">{fieldErrors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-zinc-300">
              Email
            </label>
            <input id="email" name="email" type="email" required className="input-field" />
            {fieldErrors.email && <p className="mt-1 text-xs text-red-300">{fieldErrors.email}</p>}
          </div>

          <div>
            <label htmlFor="message" className="mb-1 block text-sm font-medium text-zinc-300">
              Message
            </label>
            <textarea id="message" name="message" rows={4} required className="textarea-field" />
            {fieldErrors.message && <p className="mt-1 text-xs text-red-300">{fieldErrors.message}</p>}
          </div>

          {errorMessage && (
            <p className="rounded-md border border-red-500/30 bg-red-950/30 px-3 py-2 text-sm text-red-200" role="alert">
              {errorMessage}
            </p>
          )}

          <button type="submit" className="btn-primary inline-flex w-full items-center justify-center gap-2 px-4 py-2.5" disabled={isSubmitting}>
            <Send size={18} />
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}

      <div className="mt-8 text-center">
        <p className="mb-3 text-sm text-zinc-400">Or schedule a meeting directly:</p>
        <a
          href="https://cal.com/gautam-manchandani"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary inline-flex items-center justify-center gap-2 px-5 py-3"
        >
          <Calendar size={18} />
          Book a Call on Cal.com
        </a>

        <div className="mt-6 flex items-center justify-center gap-6">
          <a
            href="https://www.linkedin.com/in/gautam-manchandani/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 transition-colors hover:text-zinc-200"
            aria-label="LinkedIn"
          >
            <Linkedin size={22} />
          </a>
          <a
            href="https://github.com/GautamBytes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 transition-colors hover:text-zinc-200"
            aria-label="GitHub"
          >
            <Github size={22} />
          </a>
          <a
            href="https://x.com/GautamM96"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 transition-colors hover:text-zinc-200"
            aria-label="X"
          >
            <Twitter size={22} />
          </a>
        </div>
      </div>
    </section>
  );
}
