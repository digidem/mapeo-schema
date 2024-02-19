// @ts-check
import { cachedValues } from './cached.js'
import { randomBytes } from 'node:crypto'

/**
 * The `expected` is a partial doc of the extra fields that we expect to be set
 * by the encode/decode round-trip
 *
 * @type {Array<{
 *   expected: Partial<import('../../dist/types').MapeoDoc>,
 *   doc: import('../../dist/types').MapeoDocInternal
 * }>}
 */
export const goodDocsMinimal = [
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'observation',
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
    expected: {},
  },
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'projectSettings',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      createdBy: cachedValues.createdBy,
      links: [],
      deleted: false,
    },
    expected: {},
  },
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'field',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      createdBy: cachedValues.createdBy,
      links: [],
      tagKey: 'myTagKey',
      label: 'my label',
      type: 'text',
      deleted: false,
    },
    expected: {},
  },
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'preset',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      createdBy: cachedValues.createdBy,
      links: [],
      name: 'myPreset',
      geometry: ['point'],
      tags: {},
      addTags: {},
      removeTags: {},
      fieldIds: [],
      terms: [],
      deleted: false,
    },
    expected: {},
  },
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'membership',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      createdBy: cachedValues.createdBy,
      links: [],
      roleId: '3b0104e370f9',
      fromIndex: 5,
      deleted: false,
    },
    expected: {},
  },
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'deviceInfo',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      createdBy: cachedValues.createdBy,
      links: [],
      name: 'my device name',
      deleted: false,
    },
    expected: {},
  },
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'coreOwnership',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      createdBy: cachedValues.createdBy,
      links: [],
      authCoreId: Buffer.from('authCoreId').toString('hex'),
      configCoreId: Buffer.from('configCoreId').toString('hex'),
      dataCoreId: Buffer.from('dataCoreId').toString('hex'),
      blobCoreId: Buffer.from('blobCoreId').toString('hex'),
      blobIndexCoreId: Buffer.from('blobIndexCoreId').toString('hex'),
      coreSignatures: {
        auth: Buffer.from('auth'),
        config: Buffer.from('config'),
        data: Buffer.from('data'),
        blob: Buffer.from('blob'),
        blobIndex: Buffer.from('blobIndex'),
      },
      identitySignature: Buffer.from('identity'),
      deleted: true,
    },
    expected: {},
  },
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'icon',
      name: 'tree',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      createdBy: cachedValues.createdBy,
      links: [],
      deleted: false,
      variants: [
        {
          size: 'small',
          pixelDensity: 1,
          blobVersionId: randomBytes(32).toString('hex') + '/0',
          mimeType: 'image/png',
        },
      ],
    },
    expected: {},
  },
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'translation',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      createdBy: cachedValues.createdBy,
      links: [],
      deleted: false,
      schemaNameRef: 'field',
      docIdRef: cachedValues.docIdRef,
      fieldRef: 'label',
      languageCode: 'qu',
      regionCode: 'PE',
      message: `sach'a`,
    },
    expected: {},
  },
]
