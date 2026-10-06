import { test } from 'node:test'
import assert from 'node:assert/strict'
import { DatabaseSync } from 'node:sqlite'
import { onRequestGet, onRequestPost, onRequestDelete } from '../functions/api/notas.js'
function database() {
 const sql = new DatabaseSync(':memory:')
 const db = { prepare(query) { let args = []; return { bind(...values) { args = values; return this }, async run() { const r = sql.prepare(query).run(...args); return { meta: { changes: r.changes, last_row_id: Number(r.lastInsertRowid) } } }, async all() { return { results: sql.prepare(query).all(...args) } } } }, async batch(statements) { return Promise.all(statements.map(s => s.run())) } }
 return { db, sql }
}
const request = (body, ip='192.0.2.1') => new Request('https://example.test/api/notas', { method:'POST',headers:{'cf-connecting-ip':ip},body:JSON.stringify(body) })
const valid = { nombre:'Prueba', texto:'Una nota de prueba', color:'rosa' }
test('rejects malformed JSON shapes and fields without throwing', async () => {
 const {db}=database()
 for (const body of [null,[],true,{...valid,nombre:{}},{...valid,texto:[]}]) assert.equal((await onRequestPost({env:{DB:db},request:request(body)})).status,400)
})
test('limits streamed request size', async () => { const {db}=database(); assert.equal((await onRequestPost({env:{DB:db},request:request({...valid,texto:'x'.repeat(9000)})})).status,413) })
test('creates and lists a note; simultaneous submissions respect the quota', async () => {
 const {db,sql}=database(),env={DB:db}
 const responses=await Promise.all(Array.from({length:12},()=>onRequestPost({env,request:request(valid)})))
 assert.equal(responses.filter(r=>r.status===201).length,1)
 assert.equal(responses.filter(r=>r.status===429).length,11)
 assert.equal(sql.prepare('SELECT COUNT(*) n FROM notas').get().n,1)
 const listed=await (await onRequestGet({env})).json();assert.equal(listed.notas[0].nombre,'Prueba');assert.equal('ip' in listed.notas[0],false)
})
test('daily quota remains enforced after the cooldown', async () => {
 const {db,sql}=database(),env={DB:db}
 for(let i=0;i<5;i++) { assert.equal((await onRequestPost({env,request:request(valid)})).status,201);sql.prepare('UPDATE notas SET creado=creado-31000').run() }
 assert.equal((await onRequestPost({env,request:request(valid)})).status,429)
})
test('moderation requires authentication, validates ids and hides notes', async () => {
 const {db}=database(),env={DB:db,ADMIN_KEY:'test-only-key'}
 await onRequestPost({env,request:request(valid)})
 assert.equal((await onRequestDelete({env,request:new Request('https://example.test/api/notas?id=1',{method:'DELETE'})})).status,401)
 const del=id=>new Request(`https://example.test/api/notas?id=${id}`,{method:'DELETE',headers:{'x-clave':'test-only-key'}})
 assert.equal((await onRequestDelete({env,request:del('bad')})).status,400)
 assert.equal((await onRequestDelete({env,request:del(1)})).status,200)
 assert.equal((await (await onRequestGet({env})).json()).notas.length,0)
})
test('reports missing storage cleanly', async () => {assert.equal((await onRequestGet({env:{}})).status,503)})
