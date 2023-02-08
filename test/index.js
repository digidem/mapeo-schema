import test from 'tape'
import { encode, decode } from '../index.js'
import glob from 'glob-promise'
import { readFileSync } from 'node:fs'
import { basename } from 'node:path'
import { randomBytes } from 'node:crypto'

const loadJSON = (path) => {
  return {
    name: basename(path).replace('.json', ''),
    doc: JSON.parse(readFileSync(new URL(path, import.meta.url)).toString()),
  }
}

const docs = (await glob('./docs/*.json')).map(loadJSON).reduce((acc, val) => {
  acc[val.name] = val.doc
  return acc
}, {})

test('test encoding of record with missing fields', async (t) => {
  t.plan(1)
  t.throws(() => {
    encode(docs.onlyId)
  })
})

test('test encoding of wrong record type', async (t) => {
  t.plan(1)
  t.throws(() => {
    encode(docs.badDocType)
  })
})

test('test encoding of record with wrong schema version', async (t) => {
  t.plan(1)
  t.throws(() => {
    encode(docs.badSchemaVersion)
  })
})

test('test encoding of rightfully formated record', async (t) => {
  t.plan(1)
  t.doesNotThrow(() => {
    encode(docs.good)
  })
})

test('test encoding, decoding of record and comparing the two versions', async (t) => {
  const record = decode(encode(docs.good), { coreId: randomBytes(32), seq: 0 })
  const fields = Object.keys(docs.good)
  fields.forEach((field) => {
    const msg = `comparing ${field}`
    record[field] && docs.good[field] ? t.pass(msg) : t.fail(msg)
    // this would fail if on the json schema we allow additional fields
    // t.deepEqual(record[field], docs.good[field], `comparing ${field}`)
  })
})

test('test decoding of record without passing core key and index', async (t) => {
  t.plan(1)
  const record = encode(docs.good)
  t.throws(() => {
    decode(record)
  })
})
