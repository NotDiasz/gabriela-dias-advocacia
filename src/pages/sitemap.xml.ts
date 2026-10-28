import type { APIRoute } from 'astro';
import { areas } from '../data/areas';
export const GET: APIRoute = ({ site, url }) => {
  const base = site ?? url.origin;
  const routes = ['/', ...areas.map(area => `/atuacao/${area.slug}/`)];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(route => `<url><loc>${new URL(route, base).href}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
};
