import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col items-center px-5 py-32 text-center sm:px-8">
      <p className="mono-label">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 text-muted-foreground">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background"
      >
        Back home
      </Link>
    </div>
  );
}
