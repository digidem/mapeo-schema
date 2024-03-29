// @ts-check
import fs from 'fs'
import path from 'path'
import { mkdirp } from 'mkdirp'

import { parseConfig } from './lib/parse-config.js'
import { generateProtoTypes } from './lib/generate-proto-types.js'
import { PROJECT_ROOT } from './lib/utils.js'
import { generateConfig } from './lib/generate-config.js'
import { readJSONSchema } from './lib/read-json-schema.js'
import { validateJsonSchema } from './lib/validate-json-schema.js'
import { generateValidations } from './lib/generate-validations.js'
import { generateJSONSchemaTS } from './lib/generate-jsonschema-ts.js'
import { generateEncodeDecode } from './lib/generate-encode-decode.js'
import { generateJSONSchemaExports } from './lib/generate-jsonschema-exports.js'

const DIST_DIRNAME = path.join(PROJECT_ROOT, 'dist')
const GENERATED_DIRNAME = path.join(PROJECT_ROOT, 'generated')

mkdirp.sync(DIST_DIRNAME)
mkdirp.sync(path.join(GENERATED_DIRNAME, 'proto'))
mkdirp.sync(path.join(GENERATED_DIRNAME, 'schema'))

const config = parseConfig()

const protoTypesFile = generateProtoTypes(config)
fs.writeFileSync(path.join(GENERATED_DIRNAME, 'proto/types.ts'), protoTypesFile)

const encodeDecodeFile = generateEncodeDecode(config)
fs.writeFileSync(
  path.join(GENERATED_DIRNAME, 'proto/index.ts'),
  encodeDecodeFile
)

const configFile = generateConfig(config)
fs.writeFileSync(path.join(GENERATED_DIRNAME, 'config.ts'), configFile)

const jsonSchemas = readJSONSchema(config)

// Check the schemas meet our specific criteria - currently no top-level null
for (const schema of Object.values(jsonSchemas.merged)) {
  validateJsonSchema(schema)
}

const validationCode = generateValidations(config, jsonSchemas)
fs.writeFileSync(path.join(GENERATED_DIRNAME, 'validations.ts'), validationCode)

const jsonSchemaTSDefs = await generateJSONSchemaTS(config, jsonSchemas)
for (const [filenameBase, ts] of Object.entries(jsonSchemaTSDefs)) {
  const filepath = path.join(GENERATED_DIRNAME, 'schema', filenameBase + '.ts')
  fs.writeFileSync(filepath, ts)
}

const jsonSchemaExports = await generateJSONSchemaExports(jsonSchemas)
fs.writeFileSync(path.join(GENERATED_DIRNAME, 'schemas.ts'), jsonSchemaExports)
