/**
 * href(path) — the one way to build a URL for anything inside this site.
 *
 *   href('/')                      -> '/compel2027-website/'
 *   href('/venues/')               -> '/compel2027-website/venues/'
 *   href('/images/venue-eer.jpg')  -> '/compel2027-website/images/venue-eer.jpg'
 *   href('https://…'), href('mailto:…'), href('#main') -> returned unchanged
 *
 * Every internal link and every asset URL in .astro files must go through it so the
 * site works under any BASE_PATH. (Links inside Markdown content are prefixed
 * automatically by the rehype plugin in astro.config.mjs.)
 */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

export function isExternal(path: string): boolean {
  return /^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(path);
}

export function href(path: string): string {
  if (isExternal(path)) return path;
  return `${BASE}/${path.replace(/^\/+/, '')}`;
}

/** Path of the current page without the base, always with leading and trailing slash. */
export function routeOf(pathname: string): string {
  let p = pathname;
  if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length);
  p = '/' + p.replace(/^\/+|\/+$/g, '');
  return p === '/' ? '/' : p + '/';
}
