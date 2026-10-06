import { test, expect } from '@playwright/test'
// Las pruebas saltan el arranque (máquina de coser) y la pantalla de bloqueo del iPhone, que salen una vez por visita
test.beforeEach(async ({ page }) => {
 await page.addInitScript(() => { sessionStorage.setItem('ag-booted-v3', '1'); sessionStorage.setItem('ag-unlocked', '1') })
})
for (const width of [390, 768, 1440]) {
 test(`project book by default and continuous reading at ${width}px`, async ({ page }) => {
  await page.setViewportSize({width,height:900}); await page.goto('/projects/ash-archive')
  await expect(page.getByRole('button',{name:'Lectura continua'})).toBeVisible()
  if(width<=700){const status=page.locator('[aria-live="polite"]');const before=await status.textContent(); await page.getByRole('group',{name:'Libro editorial'}).focus();await page.keyboard.press('ArrowRight');await expect(status).not.toHaveText(before!)}
  await page.getByRole('button',{name:'Lectura continua'}).click()
  await expect(page).toHaveURL(/view=lectura/)
  await expect(page.locator('.ag-project-summary h1')).toContainText('ASH ARCHIVE')
  await expect(page.getByRole('heading',{name:'Concepto',exact:true})).toBeVisible()
  expect(await page.locator('.ag-project-summary').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true)
  await page.getByRole('button',{name:'Abrir libro editorial'}).click()
  await expect(page.getByRole('button',{name:'Lectura continua'})).toBeVisible()
 })
}
test('SPA navigation updates canonical and sharing metadata',async({page})=>{
 await page.goto('/');await page.getByRole('link',{name:'Ver proyectos',exact:true}).click();await expect(page).toHaveURL(/\/projects$/)
 await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',/\/projects$/)
 await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content',/\/projects$/)
 await expect(page.locator('meta[name="description"]')).toHaveAttribute('content',/Proyectos de moda/)
})
test('Spotlight confines keyboard focus and closes with Escape',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:/Buscar en el archivo/}).focus();await page.keyboard.press('Control+k');const dialog=page.getByRole('dialog',{name:'Buscar en el archivo'});await expect(dialog).toBeVisible()
 await page.getByRole('textbox',{name:'Buscar',exact:true}).focus();await page.keyboard.press('Shift+Tab');expect(await dialog.evaluate(el=>el.contains(document.activeElement))).toBe(true)
 await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0)
})
test('comparison slider keyboard and accessible value',async({page})=>{
 await page.goto('/projects/ash-archive/probador');const slider=page.getByRole('slider');await expect(slider).toBeVisible();await slider.focus();await page.keyboard.press('Home');await expect(slider).toHaveAttribute('aria-valuenow','0')
 await page.keyboard.press('ArrowRight');await expect(slider).toHaveAttribute('aria-valuenow','5');await page.keyboard.press('End');await expect(slider).toHaveAttribute('aria-valuenow','100')
})
test('guestbook validation and local persistence',async({request})=>{
 const invalid=await request.post('/api/notas',{data:'null',headers:{'content-type':'application/json'}});expect(invalid.status()).toBe(400)
 const created=await request.post('/api/notas',{data:{nombre:'Prueba',texto:'Nota de regresión',color:'rosa'},headers:{'cf-connecting-ip':`192.0.2.${Math.floor(Math.random()*200)+1}`}});expect(created.status()).toBe(201)
 const notes=await request.get('/api/notas');expect((await notes.json()).notas.some(n=>n.texto==='Nota de regresión')).toBe(true)
})

for (const width of [768, 1440]) {
 test(`home opens the Mac desktop without a CV window at ${width}px`, async ({page}) => {
  await page.setViewportSize({width,height:1024});await page.goto('/')
  await expect(page.getByRole('main',{name:'Escritorio'})).toBeVisible()
  await expect(page.getByRole('link',{name:'Ver proyectos',exact:true})).toBeVisible()
  await expect(page.locator('[data-ag-frame]')).toHaveCount(0)
  const dock=page.getByRole('navigation',{name:'Dock'})
  expect(await dock.evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=0 && r.right<=innerWidth})).toBe(true)
  await page.getByRole('link',{name:'CV — Currículum',exact:true}).click()
  await expect(page).toHaveURL(/\/cv$/)
  await expect(page.locator('[data-ag-frame]')).toHaveCount(1)
 })
}
