import { expect, test, type Page } from '@playwright/test';

const trigger = (page: Page) => page.getByRole('button', { name: 'Collections', exact: true });
const menu = (page: Page) => page.locator('#collections-menu');

test('hover opens, keeps the menu stable, switches edits and reveals the price', async ({ page }) => {
  await page.goto('/');
  await trigger(page).hover();
  await expect(menu(page)).toHaveCSS('opacity', '1');
  await menu(page).getByRole('link', { name: 'Van Gogh', exact: true }).hover();
  await expect(menu(page).getByRole('link', { name: /Sunflower Ring/ })).toBeVisible();
  await menu(page).getByRole('link', { name: 'Rare Red', exact: true }).hover();
  await expect(menu(page)).toHaveAttribute('data-open', 'true');
  const tile = menu(page).getByRole('link', { name: /Ember Ring/ });
  const price = tile.locator('.mega-price');
  await expect(price).toHaveCSS('opacity', '0');
  await tile.hover();
  await expect(price).toHaveCSS('opacity', '1');
  await expect(price).toContainText('₹28,400');
  await page.mouse.move(800, 800);
  await expect(menu(page)).toHaveAttribute('data-open', 'true');
  await expect(menu(page)).toHaveAttribute('data-open', 'false');
});

test('keyboard can enter Collections and Escape restores trigger focus', async ({ page }) => {
  await page.goto('/');
  await trigger(page).focus();
  await expect(trigger(page)).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(trigger(page)).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Enter');
  await expect(menu(page).getByRole('link', { name: 'Blush', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(menu(page).getByRole('link', { name: 'Van Gogh', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger(page)).toBeFocused();
  await expect(trigger(page)).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Space');
  await expect(trigger(page)).toHaveAttribute('aria-expanded', 'true');
});

test('sticky menu aligns below the header and outside click closes it', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 600));
  const header = page.locator('.site-header');
  await expect(header).toHaveClass(/compact/);
  await trigger(page).hover();
  await expect(menu(page)).toHaveAttribute('data-open', 'true');
  await expect.poll(async () => {
    const bounds = await header.boundingBox();
    const dropdown = await menu(page).boundingBox();
    return Math.abs(dropdown!.y - bounds!.height);
  }).toBeLessThan(2);
  await page.locator('.mega-shade').click({ position: { x: 500, y: 720 } });
  await expect(trigger(page)).toHaveAttribute('aria-expanded', 'false');
});

test('collection listing filters and sorts, then opens the product gallery', async ({ page }) => {
  await page.goto('/');
  await trigger(page).hover();
  await expect(menu(page)).toHaveCSS('opacity', '1');
  await menu(page).getByRole('link', { name: 'Van Gogh', exact: true }).click();
  await expect(page).toHaveURL('/collections/van-gogh');
  await page.getByLabel('Sort by').selectOption('high');
  await expect(page.locator('.product-card').first()).toContainText('Atelier Bracelet');
  await page.locator('.desktop-filters').getByRole('combobox', { name: 'Type', exact: true }).selectOption('Rings');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Remove filter: Rings' }).click();
  await expect(page.locator('.product-card')).toHaveCount(4);
  await page.getByRole('link', { name: 'Sunflower Ring', exact: true }).first().click();
  await expect(page.getByRole('heading', { name: 'Sunflower Ring' })).toBeVisible();
  await page.getByRole('button', { name: 'Zoom product image' }).press('ArrowRight');
  await expect(page.getByRole('button', { name: 'Product detail crop' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Zoom product image' }).click();
  await expect(page.getByRole('dialog', { name: /Enlarged image/ })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: /Enlarged image/ })).toHaveCount(0);
});

test('shopping bag updates quantities and survives refresh through checkout preview', async ({ page }) => {
  await page.goto('/products/ember-ring');
  await page.getByRole('button', { name: 'Add to Bag' }).click();
  const drawer = page.getByRole('dialog', { name: 'Shopping bag' });
  await drawer.getByRole('button', { name: 'Increase quantity' }).click();
  await expect(drawer.getByTestId('subtotal')).toHaveText('₹56,800');
  await drawer.getByRole('link', { name: 'View Bag' }).click();
  await expect(page).toHaveURL('/cart');
  await page.reload();
  await expect(page.getByTestId('subtotal')).toHaveText('₹56,800');
  await page.getByRole('link', { name: 'Preview Checkout' }).click();
  await expect(page.getByRole('heading', { name: 'Checkout preview.' })).toBeVisible();
  await expect(page.getByTestId('subtotal')).toHaveText('₹56,800');
});

test('wishlist survives refresh and allows removing saved pieces', async ({ page }) => {
  await page.goto('/products/nocturne-ring');
  await page.getByRole('button', { name: 'Save Nocturne Ring to wishlist' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Wishlist', exact: true }).click();
  const wishlist = page.getByRole('dialog', { name: 'Wishlist' });
  await expect(wishlist.getByRole('link', { name: 'Nocturne Ring' }).first()).toBeVisible();
  await wishlist.getByRole('button', { name: 'Remove Nocturne Ring from wishlist' }).click();
  await expect(wishlist.getByText('Save the pieces you want to come back to.')).toBeVisible();
});

test('search has autofocus, matching products and collections, and an empty state', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  const search = page.getByRole('searchbox');
  await expect(search).toBeFocused();
  await search.fill('Rare Red');
  await expect(page.getByRole('dialog').getByRole('link', { name: /Ember Ring/ })).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('link', { name: 'Rare Red' })).toBeVisible();
  await search.fill('nonexistent');
  await expect(page.getByText(/No results for/)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('mobile drawer supports touch, scroll locking, collection links and filters', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  try {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).tap();
    const navigation = page.getByRole('navigation', { name: 'Mobile navigation' });
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
    await navigation.getByText('Collections', { exact: true }).tap();
    await navigation.getByRole('link', { name: 'Rare Red' }).tap();
    await expect(page).toHaveURL('/collections/rare-red');
    await expect(page.getByRole('dialog', { name: 'Menu' })).toHaveCount(0);
    await page.getByRole('button', { name: 'Filters' }).tap();
    const filters = page.getByRole('dialog', { name: 'Catalogue filters' });
    await filters.getByRole('combobox', { name: 'Type', exact: true }).selectOption('Rings');
    await filters.getByRole('button', { name: 'Show 1 piece' }).tap();
    await expect(page.locator('.product-card')).toHaveCount(1);
  } finally {
    await page.close();
  }
});

for (const [width, height] of [[1920, 1080], [1440, 900], [1024, 768], [768, 1024], [390, 844], [375, 812]]) {
  test('viewport ' + width + ' × ' + height + ' fits and renders its images', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    for (const image of await page.locator('main img:visible').all()) {
      await image.evaluate(element => element.scrollIntoView({ block: 'nearest' }));
      await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
    }
    expect(errors).toEqual([]);
  });
}

test('campaign flips the original headline and can pause or reduce motion', async ({ page }) => {
  await page.goto('/');
  const campaign = page.locator('.campaign');
  await expect(page.getByRole('heading', { name: 'Renodia signifies luxury, grace and brilliance' })).toBeVisible();
  const luxury = campaign.locator('.campaign-words').getByText('Luxury', { exact: true });
  const grace = campaign.locator('.campaign-words').getByText('Grace', { exact: true });
  await expect(luxury).toHaveCSS('opacity', '1');
  await expect(grace).toHaveCSS('opacity', '1');
  await page.getByRole('button', { name: 'Pause hero motion' }).click();
  await expect(grace).toHaveCSS('animation-play-state', 'paused');
  await expect(campaign.locator('.ring-blue img')).toHaveCSS('animation-play-state', 'paused');
  await page.getByRole('button', { name: 'Resume hero motion' }).click();
  await expect(grace).toHaveCSS('animation-play-state', 'running');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(luxury).toBeHidden();
  await expect(grace).toHaveCSS('animation-name', 'none');
  await expect(page.getByRole('button', { name: 'Pause hero motion' })).toBeHidden();
});

test('homepage collection index previews and opens a selected collection', async ({ page }) => {
  await page.goto('/');
  const index = page.getByRole('group', { name: 'Choose a collection' });
  await index.getByRole('button', { name: 'Royal High Jewellery' }).click();
  await expect(index.getByRole('button', { name: 'Royal High Jewellery' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('link', { name: 'Explore Royal High Jewellery' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Royal High Jewellery' })).toBeVisible();
});
