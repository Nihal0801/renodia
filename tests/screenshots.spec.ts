import { expect, test, type Page } from '@playwright/test';

async function capture(page: Page, name: string, fullPage = false) {
  if (fullPage) {
    for (const photo of await page.locator('main img:visible').all()) await photo.evaluate(element => element.scrollIntoView({ block: 'nearest' }));
    await page.evaluate(() => window.scrollTo(0, 0));
  }
  await page.evaluate(async () => {
    await document.fonts.ready;
    const visibleImages = [...document.images].filter(image => {
      const bounds = image.getBoundingClientRect();
      return bounds.width && bounds.height && bounds.top < innerHeight && bounds.bottom > 0 && !image.closest('[inert]');
    });
    await Promise.all(visibleImages.map(image => image.decode()));
  });
  await page.screenshot({ path: 'artifacts/' + name + '.png', fullPage, animations: 'disabled' });
}

test('capture desktop art direction and navigation states', async ({ page }) => {
  await page.goto('/');
  await capture(page, '01-desktop-home');
  await capture(page, '02-desktop-home-full', true);
  await page.locator('#collections').evaluate(element => element.scrollIntoView({ block: 'start' }));
  await capture(page, '10-desktop-collection-index');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.getByRole('button', { name: 'Collections', exact: true }).hover();
  const menu = page.locator('#collections-menu');
  await expect(menu).toHaveCSS('opacity', '1');
  await capture(page, '03-desktop-collections-menu');
  await menu.getByRole('link', { name: 'Rare Red', exact: true }).hover();
  const tile = menu.getByRole('link', { name: /Ember Ring/ });
  await tile.hover();
  await expect(tile.locator('.mega-price')).toHaveCSS('opacity', '1');
  await capture(page, '04-desktop-product-hover');
  await menu.locator('.mega-products[data-active=true]').getByRole('button', { name: 'Next products' }).click();
  await expect(menu.getByRole('link', { name: /Rouge Line Bracelet/ })).toBeVisible();
  await menu.locator('.mega-products[data-active=true]').getByRole('button', { name: 'Previous products' }).click();
  await expect(tile).toBeVisible();
  await menu.getByRole('link', { name: 'View all Rare Red' }).click();
  await expect(page).toHaveURL('/collections/rare-red');
  await expect(page.getByRole('heading', { name: 'Rare Red', level: 1 })).toBeVisible();
  await capture(page, '05-desktop-collection');
  await page.getByRole('link', { name: 'Ember Ring', exact: true }).first().click();
  await expect(page.getByRole('heading', { name: 'Ember Ring' })).toBeVisible();
  await capture(page, '06-desktop-product');
});

test('capture mobile homepage, open navigation and product', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  try {
    await page.goto('/');
    await capture(page, '07-mobile-home');
    await page.getByRole('button', { name: 'Open menu' }).tap();
    await page.getByRole('navigation', { name: 'Mobile navigation' }).getByText('Collections', { exact: true }).tap();
    await capture(page, '08-mobile-navigation');
    await page.goto('/products/nocturne-ring');
    await capture(page, '09-mobile-product', true);
  } finally {
    await page.close();
  }
});
