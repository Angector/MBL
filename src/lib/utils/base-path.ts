/**
 * Single place that knows about the GitHub Pages base path.
 * "" in local development, "/mobile-store" on GitHub Pages (set in next.config.mjs).
 *
 * next/link and router calls add the base path automatically. Plain asset URLs
 * (images, fonts, files in /public) do NOT, so they must go through withBasePath().
 */
export const BASE_PATH: string = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function withBasePath(path: string): string {
  if (!path || !path.startsWith('/') || path.startsWith('//')) return path; // absolute URL, data URI, relative path
  if (BASE_PATH && (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`))) return path; // already prefixed
  return `${BASE_PATH}${path}`;
}
