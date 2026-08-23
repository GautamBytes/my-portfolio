import { spawn } from 'node:child_process';
import net from 'node:net';

function getPort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

async function waitForServer(baseUrl, server) {
  const deadline = Date.now() + 15_000;

  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Next.js server exited with code ${server.exitCode}`);
    }

    try {
      const response = await fetch(baseUrl);
      if (response.ok) {
        return;
      }
    } catch {
      // The server can refuse connections while it starts.
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error('Timed out waiting for the Next.js server');
}

const port = await getPort();
const baseUrl = `http://127.0.0.1:${port}`;
const server = spawn(
  process.execPath,
  [
    'node_modules/next/dist/bin/next',
    'start',
    '-H',
    '127.0.0.1',
    '-p',
    String(port),
  ],
  { stdio: ['ignore', 'inherit', 'inherit'] }
);

try {
  await waitForServer(baseUrl, server);

  const tests = spawn(
    process.execPath,
    ['--test', 'tests/http-agent-readiness.test.mjs'],
    {
      env: { ...process.env, TEST_BASE_URL: baseUrl },
      stdio: 'inherit',
    }
  );
  const exitCode = await new Promise((resolve) => tests.once('exit', resolve));
  process.exitCode = exitCode ?? 1;
} finally {
  server.kill('SIGTERM');
}
