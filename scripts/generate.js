// @ts-check
// This script is use to generate various files to be used at runtime:
// * dist/schemas.js - all the validating functions for jsonSchema
// * types/schema/index.d.ts - Union type for all the JsonSchemas
// * types/proto/index.d.ts - Union type for all the ProtobufSchemas
// * types/proto/index.js - Exports all protobufs from one file
// * types/index.d.ts - re-exports JSONSchema and ProtobufSchema types for better importing

import fs from 'node:fs'
import path from 'path'
import { URL } from 'url'
import Ajv from 'ajv'
import standaloneCode from 'ajv/dist/standalone/index.js'
import glob from 'glob-promise'
import { formatSchemaKey, formatSchemaType } from '../utils.js'

const __dirname = new URL('.', import.meta.url).pathname

const readJSON = (f) =>
  JSON.parse(fs.readFileSync(new URL(f, import.meta.url)).toString())
/**
 * @param {string} p
 * @returns {{schemaType: String, schemaVersion: Number, schema:Object}}
 */
const loadSchema = (p) => {
  const { dir, name } = path.parse(p)
  return {
    // we get the type of the schema from the directory
    schemaType: dir.replace('/tmp/schema/', ''),
    // we get the version from the filename
    schemaVersion: parseInt(name.replace('v', '')),
    schema: readJSON(p),
  }
}

const schemas = glob
  .sync('/tmp/schema/*/*.json', { cwd: 'scripts' })
  .map(loadSchema)
// // avoid having common in loaded schemas since we are embeding it
// .filter(({ schemaType }) => schemaType !== 'common')

// const common = readJSON('../schema/common/v1.json')

// const schemaExports = schemas.reduce((acc, { schema, schemaType }) => {
//   const key = formatSchemaKey(schemaType)
//   acc[key] = schema['$id']
//   return acc
// }, {})

// const mergeCommon = ({ schema }) => {
//   schema.properties = { ...common.properties, ...schema.properties }
//   return schema
// }

// compile schemas
// const ajv = new Ajv({
//   schemas: schemas.map(({schema}) => schema),
//   code: { source: true, esm: true },
//   formats: { 'date-time': true },
// })
// ajv.addKeyword('meta:enum')

// // generate validation code
// let schemaValidations = standaloneCode(ajv, schemaExports)

// const dist = path.join(__dirname, '../dist')
// if (!fs.existsSync(dist)) {
//   fs.mkdirSync(dist)
// }

// // write to -> dist/schemas.js
// fs.writeFileSync(
//   path.join(__dirname, '../dist', 'schemas.js'),
//   schemaValidations
// )

const latestSchemaVersions = schemas.reduce(
  (acc, { schemaVersion, schemaType }) => {
    if (!acc[schemaType]) {
      acc[schemaType] = schemaVersion
    } else {
      if (acc[schemaType] < schemaVersion) {
        acc[schemaType] = schemaVersion
      }
    }
    return acc
  },
  {}
)

// types/schema/index.d.ts
const jsonSchemaType = `
${schemas
  .map(
    /** @param {Object} schema */
    ({ schemaVersion, schemaType }) => {
      const varName = `${formatSchemaType(schemaType)}_${schemaVersion}`
      return `import { ${formatSchemaType(
        schemaType
      )} as ${varName} } from './${schemaType}/v${schemaVersion}'`
    }
  )
  .join('\n')}

export type JSONSchema = (${schemas
  .map(
    /** @param {Object} schema */
    ({ schemaVersion, schemaType }) =>
      `${formatSchemaType(schemaType)}_${schemaVersion}`
  )
  .join(' | ')})
${schemas
  .map(({ schemaType, schemaVersion }) => {
    const as =
      latestSchemaVersions[schemaType] !== schemaVersion
        ? `as ${formatSchemaType(schemaType)}_${schemaVersion}`
        : ''
    return `export { ${formatSchemaType(
      schemaType
    )} ${as} } from './${schemaType}/v${latestSchemaVersions[schemaType]}'`
  })
  .join('\n')}`
fs.writeFileSync(
  path.join(__dirname, '../types/schema/index.d.ts'),
  jsonSchemaType
)

// types/proto/index.d.ts and types/proto/index.js
const protobufFiles = glob.sync('../types/proto/*/*.ts', { cwd: 'scripts' })
const obj = protobufFiles
  .filter((f) => !f.match(/.d.ts/))
  .filter((f) => !f.match(/common/))
  .map((p) => {
    const { name, dir } = path.parse(p)
    return {
      schemaType: dir.replace('../types/proto/', ''),
      schemaVersion: name,
    }
  })

const linesjs = []
const linesdts = []
const union = obj
  .map(
    ({ schemaType, schemaVersion }) =>
      `${formatSchemaType(schemaType)}_${schemaVersion.replace('v', '')}`
  )
  .join(' | ')

const individualExports = schemas
  .map(
    ({ schemaType, schemaVersion }) =>
      `export { ${formatSchemaType(schemaType)}_${schemaVersion} ${
        latestSchemaVersions[schemaType] === schemaVersion
          ? `as ${formatSchemaType(schemaType)}`
          : ''
      }} from './${schemaType}/v${schemaVersion}'`
  )
  .join('\n')

obj.forEach(({ schemaType, schemaVersion }) => {
  const linejs = `export { ${formatSchemaType(
    schemaType
  )}_${schemaVersion.replace(
    'v',
    ''
  )} } from './${schemaType}/${schemaVersion}.js'`

  const linedts = `import { ${formatSchemaType(
    schemaType
  )}_${schemaVersion.replace(
    'v',
    ''
  )} } from './${schemaType}/${schemaVersion}'`
  linesdts.push(linedts)
  linesjs.push(linejs)
})

fs.writeFileSync(
  path.join(__dirname, '../types/proto/index.js'),
  linesjs.join('\n')
)
fs.writeFileSync(
  path.join(__dirname, '../types/proto/index.d.ts'),
  `${linesdts.join('\n')}
export type ProtobufSchema = ${union}
${individualExports}`
)

// types/index.d.ts
fs.writeFileSync(
  path.join(__dirname, '../types/index.d.ts'),
  `export { ProtobufSchema } from './proto'
export { JSONSchema } from './schema'`
)
