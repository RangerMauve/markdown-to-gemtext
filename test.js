import assert from 'node:assert'
import { test } from 'node:test'
import { readFile } from 'node:fs/promises'
import { fromMarkdown } from './index.js'

test('parse and render basic example', async (t) => {
  const markdown = await readFile('./fixtures/basic.md', 'utf8')
  const expectedGemtext = await readFile('./fixtures/basic.gmi', 'utf8')
  const gemtext = fromMarkdown(markdown)

  assert.equal(gemtext, expectedGemtext, 'Rendered expected gemtext')
})
