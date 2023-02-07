// @ts-check
import { encode, decode, validate } from '../index.js'
import Hypercore from 'hypercore'
import ram from 'random-access-memory'
import { randomBytes } from 'node:crypto'

const obj = {
  id: randomBytes(32).toString('hex'),
  type: 'Observation',
  schemaVersion: 5,
  links: [],
  created_at: new Date().toJSON(),
  refs: [],
  attachments: [],
  metadata: {
    manual_location: true,
  },
}
const record = encode(obj)

const core = new Hypercore(ram, { valueEncoding: 'binary' })
await core.ready()
core.append(record)

try {
  const index = 0
  const data = await core.get(index)
  const decodedData = decode(data, { coreId: core.key, seq: index })
  console.log('decoded data', decodedData)
  console.log('VALID?', validate(decodedData))
  if (Buffer.compare(data, record) !== 0) {
    throw new Error(`data doesn't match: ${data} != ${record}`)
  } else {
    console.log('data matches <3')
  }
} catch (err) {
  console.log(err)
}
