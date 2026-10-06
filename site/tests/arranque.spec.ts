import { test, expect } from '@playwright/test'

// El arranque con máquina de coser sale una vez por visita en el escritorio y se salta con un clic
test('desktop sewing boot shows once and can be skipped', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    const boot = page.locator('[data-ag-boot]')
    await expect(boot).toBeVisible()
    await boot.click()
    await expect(boot).toHaveCount(0)
    await page.reload()
    await expect(page.getByRole('main', { name: 'Escritorio' })).toBeVisible()
    await expect(boot).toHaveCount(0)
})

// En el iPhone, la portada empieza con la pantalla de bloqueo; tocar la notificación desbloquea
test('phone lock screen unlocks into the home screen', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    const lock = page.getByRole('dialog', { name: /Pantalla de bloqueo/ })
    await expect(lock).toBeVisible()
    await lock.getByRole('button').click()
    await expect(lock).toHaveCount(0)
    await expect(page.getByRole('navigation', { name: 'Dock' })).toBeVisible()
    await page.reload()
    await expect(lock).toHaveCount(0)
})
