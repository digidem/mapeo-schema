// @ts-check
import { randomBytes } from 'node:crypto'
import { cachedValues } from './cached.js'

export const badDocs = [
  {
    text: 'test encoding of record with missing fields',
    doc: { docId: randomBytes(32).toString('hex') },
  },
  {
    text: 'test encoding of wrong schema name',
    /** @type Omit<import('../../dist/index.js').Observation, 'schemaName'> & { schemaName: string }} */
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'observOtion',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      createdBy: cachedValues.createdBy,
      links: [],
      refs: [],
      attachments: [],
      tags: {},
      metadata: {},
      deleted: false,
    },
  },
  {
    text: 'membership doc with empty roleId',
    /** @type {import('../../dist/index.js').Membership} */
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'membership',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      createdBy: cachedValues.createdBy,
      links: [],
      roleId: '',
      fromIndex: 4,
      deleted: false,
    },
  },
  {
    text: 'icon without name',
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'icon',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      createdBy: cachedValues.createdBy,
      links: [],
      deleted: false,
      variants: [
        {
          size: 'large',
          pixelDensity: 3,
          mimeType: 'image/png',
          blobVersionId: 'someRandomString',
        },
      ],
    },
  },
]
