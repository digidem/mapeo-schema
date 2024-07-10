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
      originalVersionId: cachedValues.versionId,
      schemaName: 'observOtion',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      links: [],
      refs: [],
      attachments: [],
      tags: {},
      metadata: {},
      deleted: false,
    },
  },
  {
    text: 'missing expected originalVersionId',
    /** @type Omit<import('../../dist/index.js').Observation, 'originalVersionId'> */
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'observation',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      links: [
        JSON.stringify({
          coreDiscoveryKey: Buffer.from('abc123'),
          index: 123,
        }),
      ],
      refs: [],
      attachments: [],
      tags: {},
      metadata: {},
      deleted: false,
    },
  },
  {
    text: 'role doc with empty roleId',
    /** @type {import('../../dist/index.js').Role} */
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      originalVersionId: cachedValues.versionId,
      schemaName: 'role',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
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
      originalVersionId: cachedValues.versionId,
      schemaName: 'icon',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
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
  {
    text: 'preset with invalid color string',
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      originalVersionId: cachedValues.versionId,
      schemaName: 'preset',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      links: [],
      name: 'myPreset',
      geometry: ['point'],
      tags: {},
      addTags: {},
      removeTags: {},
      fieldIds: [],
      terms: [],
      deleted: false,
      color: '#ff00g1',
    },
  },
]
