/**
 * SEO-friendly slug utilities for Sui Dhaga
 */

export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getProductSlug(product) {
  if (!product) return '';
  if (typeof product === 'string') return product;
  if (product.slug && product.slug.trim()) return product.slug.trim();
  if (product.title) return slugify(product.title);
  return product._id || '';
}
