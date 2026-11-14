import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';

// SITE_URL  — origin the site is served from, e.g. https://owner.github.io or https://compel2027.org
// BASE_PATH — path the site lives under. Project pages: /compel2027-website. Custom domain: /
const site = process.env.SITE_URL || undefined;
const rawBase = process.env.BASE_PATH ?? '/compel2027-website';
const base = '/' + rawBase.replace(/^\/+|\/+$/g, '');

const isExternal = (url) => /^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(url);

// Markdown content is written with root-relative links (/tutorials/, /files/x.pdf, /images/y.jpg).
// This prefixes them with the base path at build time so content authors never think about it.
function rehypeBasePath() {
  const prefix = base === '/' ? '' : base;
  const visit = (node) => {
    if (node.type === 'element' && node.properties) {
      for (const attr of ['href', 'src']) {
        const value = node.properties[attr];
        if (typeof value === 'string' && value.startsWith('/') && !isExternal(value)) {
          node.properties[attr] = prefix + value;
        }
      }
    }
    if (node.children) node.children.forEach(visit);
  };
  return (tree) => visit(tree);
}

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: { processor: unified({ rehypePlugins: [rehypeBasePath] }) },
});
