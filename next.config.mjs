// Static export for GitHub Pages. Local development keeps ordinary root paths.
const isPages = process.env.GITHUB_PAGES === 'true';

// Repository name is detected from GITHUB_REPOSITORY ("owner/repo") on GitHub Actions.
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const rawBase = process.env.NEXT_PUBLIC_BASE_PATH ?? (repoName ? `/${repoName}` : '');

/** "" for local dev; "/mobile-store" on GitHub Pages. */
const basePath = isPages ? `/${rawBase.replace(/^\/+|\/+$/g, '')}`.replace(/^\/$/, '') : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'export',
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  // Makes the (possibly empty) base path available to client code: see src/lib/utils/base-path.ts
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // Redirects are not supported by static export, so this exists for `next dev` only.
  // In production the same job is done by public/index.html.
  ...(process.env.NODE_ENV === 'development'
    ? { async redirects() { return [{ source: '/', destination: '/fa/', permanent: false }]; } }
    : {}),
};

export default nextConfig;
