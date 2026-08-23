import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container--wide flex min-h-[calc(100vh-8rem)] items-center justify-center py-20">
      <section className="surface max-w-2xl p-8 text-center sm:p-10">
        <p className="text-sm uppercase tracking-[0.22em] text-amber-300">
          HTTP 404
        </p>
        <h1 className="mt-3 text-3xl font-bold text-zinc-100 sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 leading-relaxed text-zinc-300">
          This portfolio path does not exist. Use the homepage, sitemap, or
          agent instructions to find the right content.
        </p>
        <nav
          className="mt-7 flex flex-wrap justify-center gap-3"
          aria-label="404 recovery links"
        >
          <Link href="/" className="btn-primary px-4 py-2.5">
            Portfolio home
          </Link>
          <a href="/sitemap.xml" className="btn-secondary px-4 py-2.5">
            Sitemap
          </a>
          <a href="/llms.txt" className="btn-secondary px-4 py-2.5">
            Agent instructions
          </a>
        </nav>
      </section>
    </main>
  );
}
