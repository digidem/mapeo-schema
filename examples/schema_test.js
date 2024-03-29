// @ts-check
import { encode, decode, validate } from '../index.js'
import Hypercore from 'hypercore'
import ram from 'random-access-memory'
import { docs } from '../test/docs.js'

const objs = docs.good

Object.keys(objs).forEach(test)

async function test(key) {
  const obj = objs[key]
  const record = encode(obj)
  const k = obj.schemaType || obj.type
  const core = new Hypercore(ram, { valueEncoding: 'binary' })
  await core.ready()
  core.append(record)

  try {
    const index = 0
    const data = await core.get(index)
    console.log(`trying ${k}`)
    const decodedData = decode(data, { coreKey: core.key, index })
    console.log('data', decodedData)
    console.log(`VALID? `, validate(decodedData), '\n')
    if (Buffer.compare(data, record) !== 0) {
      throw new Error(`data doesn't match: ${data} != ${record}`)
    } else {
      console.log('data matches <3')
    }
  } catch (err) {
    console.log(err)
  }
}
