import {test} from 'node:test'
import assert from 'node:assert/strict'
import {matter,safeHtml,validateProject} from '../site/scripts/lib/content.mjs'
import {metadataFor} from '../site/shared/metadata.mjs'
test('frontmatter must be a valid, unique mapping',()=>{assert.throws(()=>matter('no header'));assert.throws(()=>matter('---\n- invalid\n---\nbody'));assert.throws(()=>matter('---\na: 1\na: 2\n---\nbody'));assert.equal(matter('---\ntitulo: Test\n---\nBody').data.titulo,'Test')})
test('content HTML strips executable markup and dangerous URLs',()=>{const html=safeHtml('<script>alert(1)</script><p onclick="bad()">Texto <a href="javascript:alert(1)">link</a></p>');assert.ok(!html.includes('<script'));assert.ok(!html.includes('onclick'));assert.ok(!html.includes('javascript:'));assert.ok(html.includes('Texto'))})
test('project schema rejects incomplete data and unsafe links',()=>{assert.throws(()=>validateProject({},'test'));assert.throws(()=>validateProject({titulo:'T',categoria:'C',rol:'R',resumen:'S',año:2026,numero:1,enlace:'javascript:alert(1)'},'test'))})
test('metadata follows the route and project',()=>{const projects=[{title:'ASH',short:'Descripción',slug:'ash',link:'/projects/ash'}];assert.equal(metadataFor('/projects/ash',projects,'https://example.test').canonical,'https://example.test/projects/ash');assert.match(metadataFor('/projects/ash/moodboard',projects,'https://example.test').title,/Moodboard/);assert.equal(metadataFor('/missing',projects,'https://example.test').known,false)})
