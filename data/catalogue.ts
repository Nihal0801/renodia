export const collections = [
  { slug: 'blush', name: 'Blush', line: 'A study in softness.', description: 'Pale pink and warm light meet in silhouettes that feel quietly expressive.', image: '/images/1-1.webp', colour: '#e9d2ca' },
  { slug: 'van-gogh', name: 'Van Gogh', line: 'Colour, in motion.', description: 'Painterly contrasts and expressive curves give familiar forms a sense of movement.', image: '/images/2-1.webp', colour: '#e6d7b8' },
  { slug: 'romanticise', name: 'Romanticise', line: 'The poetry of the everyday.', description: 'Intimate shapes and gentle glints for moments worth keeping close.', image: '/images/5-3.webp', colour: '#eedbd4' },
  { slug: 'renodia-special', name: 'Renodia Special', line: 'The distinctively Renodia edit.', description: 'Clean lines, tactile forms and pieces that invite a second look.', image: '/images/6-4.webp', colour: '#e8decd' },
  { slug: 'rare-red', name: 'Rare Red', line: 'The intensity of red.', description: 'Deep crimson and sculptural profiles compose a striking study in contrast.', image: '/images/3-1.webp', colour: '#e4ccc6' },
  { slug: 'signature-renodia-blue', name: 'Signature Renodia Blue', line: 'Into the depths of blue.', description: 'An exploration of blue at its most expressive, from the first glint of twilight to midnight.', image: '/images/hero.webp', colour: '#10172b' },
  { slug: 'royal-high-jewellery', name: 'Royal High Jewellery', line: 'An evening in full colour.', description: 'Dramatic proportions and layered light give these compositions their presence.', image: '/images/7-3.webp', colour: '#d5ddd2' },
] as const;

export const categories = ['Rings', 'Earrings', 'Necklaces', 'Bracelets'] as const;
export type Collection = (typeof collections)[number];
export type Product = {
  slug: string;
  name: string;
  collectionSlug: Collection['slug'];
  category: (typeof categories)[number];
  price: number;
  currency: 'INR';
  images: [string, string];
  description: string;
};

const edits = [
  ['Rosette Ring', 'Petal Earrings', 'First Light Pendant', 'Rose Arc Bracelet'],
  ['Sunflower Ring', 'Gilded Muse Earrings', 'Arles Pendant', 'Atelier Bracelet'],
  ['Tender Light Ring', 'Lovelorn Earrings', 'Love Letter Pendant', 'Silken Arc Bracelet'],
  ['Contour Ring', 'Folio Earrings', 'Solstice Pendant', 'Form Bracelet'],
  ['Ember Ring', 'Scarlet Drop Earrings', 'Crimson Veil Pendant', 'Rouge Line Bracelet'],
  ['Nocturne Ring', 'Celeste Earrings', 'Midnight Pendant', 'Blue Hour Bracelet'],
  ['Regalia Ring', 'Crownlight Earrings', 'Sovereign Pendant', 'Palace Bracelet'],
];
const imageRows = [1, 2, 5, 6, 3, 4, 7];
const prices = [18900, 24400, 16400, 20900, 28400, 32400, 48600];
const descriptions = [
  'A sculptural ring with a softly rounded profile and a bright focal point.',
  'A pair of earrings with a balanced silhouette and small points of light.',
  'A pendant with an elongated line that draws the eye to its centre.',
  'A close-fitting bracelet with a rhythmic arrangement of details.',
];

export const products: Product[] = collections.flatMap((collection, row) =>
  edits[row].map((name, column) => {
    const stem = '/images/' + imageRows[row] + '-' + (column + 1);
    return {
      slug: name.toLowerCase().replaceAll(' ', '-'), name, collectionSlug: collection.slug,
      category: categories[column], price: prices[row] + [0, -3200, 5100, 8600][column],
      currency: 'INR', images: [stem + '.webp', stem + '-detail.webp'],
      description: descriptions[column] + ' ' + collection.line,
    };
  }),
);

export const collectionPath = (slug: string) => '/collections/' + slug;
export const productPath = (slug: string) => '/products/' + slug;
export const money = (value: number) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 0,
}).format(value);
export const productsFor = (slug: string) => products.filter(product => product.collectionSlug === slug);
export const productBySlug = (slug: string) => products.find(product => product.slug === slug);
export const articles = [
  { slug: 'the-blue-hour', title: 'A study in midnight', image: '/images/hero.webp', label: 'Colour notes', text: 'Blue can hold the stillness of an evening sky and the movement of reflected light. In Signature Renodia Blue, a dark palette brings the small flashes along a silhouette into focus. The pleasure is in seeing how much changes when a piece turns.' },
  { slug: 'the-art-of-detail', title: 'The art of looking closer', image: '/images/maison.webp', label: 'The design notebook', text: 'A line, an edge, a moment of symmetry. Jewellery invites us to notice small decisions. In this editorial study, the space around each piece matters as much as the piece itself. Shadows trace its contours and draw attention to details that are easy to miss.' },
];
