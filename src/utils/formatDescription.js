/**
 * Utility to parse and format product descriptions and extract clean short descriptions.
 */

// Known spec keys commonly present in Sui Dhaga / Indian ethnic wear product details
const SPEC_KEYS = [
  'Product Colour',
  'Colour',
  'Color',
  'Kurta Style',
  'Style',
  'Neckline',
  'Neck',
  'Pattern',
  'Detailing',
  'Details',
  'Bottom Type',
  'Bottom',
  'Pants',
  'Dupatta',
  'Fabric',
  'Care',
  'Wash Care',
  'Fit',
  'Fit Type',
  'Occasion',
  'Sleeves',
  'Sleeve Length',
  'Length',
  'Package Contains',
  'Lining',
];

const SPEC_REGEX = new RegExp(`(${SPEC_KEYS.join('|')}):`, 'gi');

/**
 * Extracts a concise, elegant 1-2 sentence short description.
 */
export function getShortDescription(product) {
  if (!product) return '';

  let raw = (product.shortDescription || product.description || '').trim();
  if (!raw) {
    return 'Impeccably tailored with intricate artisanal needlework, blending traditional Indian aesthetics with effortless modern comfort.';
  }

  // Convert HTML line breaks to spaces & strip HTML
  let clean = raw
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // If shortDescription is already concise (under 240 chars)
  if (product.shortDescription && clean.length <= 240) {
    return clean;
  }

  // Strip spec block if it starts immediately
  const specIndex = clean.search(SPEC_REGEX);
  if (specIndex !== -1) {
    clean = clean.substring(0, specIndex).trim();
  }

  // Strip duplicate title from the start of description if present
  if (product.title && clean.toLowerCase().startsWith(product.title.toLowerCase().trim())) {
    clean = clean.substring(product.title.trim().length).trim();
    clean = clean.replace(/^[-:–—,\s]+/, '');
  }

  // Extract first 1 or 2 sentences
  const sentences = clean.match(/[^.!?]+[.!?]+(\s|$)/g);
  if (sentences && sentences.length > 0) {
    let summary = sentences[0].trim();
    if (summary.length < 110 && sentences.length > 1) {
      summary += ' ' + sentences[1].trim();
    }
    if (summary.length <= 260) {
      return summary;
    }
  }

  // Fallback: cut cleanly at word boundary under 180 chars
  if (clean.length > 180) {
    const cut = clean.substring(0, 180).trim();
    const lastSpace = cut.lastIndexOf(' ');
    return (lastSpace > 0 ? cut.substring(0, lastSpace) : cut) + '...';
  }

  return clean;
}

/**
 * Parses full description into formatted paragraphs and structured specifications.
 */
export function parseProductDescription(rawText, title = '') {
  if (!rawText) return { paragraphs: [], specs: [] };

  // Convert HTML line breaks and paragraphs to newlines
  let clean = rawText
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]*>?/gm, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .trim();

  let narrativeText = clean;
  let specsText = '';

  const firstSpecMatch = clean.search(SPEC_REGEX);
  if (firstSpecMatch !== -1) {
    narrativeText = clean.substring(0, firstSpecMatch).trim();
    specsText = clean.substring(firstSpecMatch).trim();
  }

  // Parse specifications into key-value pairs
  const specs = [];
  if (specsText) {
    const parts = specsText.split(SPEC_REGEX).filter(Boolean);
    for (let i = 0; i < parts.length; i += 2) {
      const key = parts[i]?.trim();
      const value = parts[i + 1]?.trim().replace(/^[,\s;.-]+|[,\s;.-]+$/g, '');
      if (key && value) {
        specs.push({ key, value });
      }
    }
  }

  // Strip duplicate title from the start of narrative if present
  if (title && narrativeText.toLowerCase().startsWith(title.toLowerCase().trim())) {
    narrativeText = narrativeText.substring(title.trim().length).trim();
    narrativeText = narrativeText.replace(/^[-:–—,\s]+/, '');
  }

  // Break narrative into clean paragraphs
  let paragraphs = narrativeText
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  // If there were no line breaks, group sentences into comfortable paragraphs (2-3 sentences each)
  if (paragraphs.length <= 1 && narrativeText.length > 200) {
    const sentences = narrativeText.match(/[^.!?]+[.!?]+(\s|$)/g) || [narrativeText];
    paragraphs = [];
    let currentPara = '';
    let count = 0;

    for (const sentence of sentences) {
      currentPara += (currentPara ? ' ' : '') + sentence.trim();
      count++;
      if (count >= 2 && currentPara.length > 170) {
        paragraphs.push(currentPara);
        currentPara = '';
        count = 0;
      }
    }
    if (currentPara) {
      paragraphs.push(currentPara);
    }
  }

  return { paragraphs, specs };
}
