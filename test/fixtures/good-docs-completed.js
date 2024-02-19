// @ts-check

import { cachedValues } from './cached.js'
import { randomBytes } from 'node:crypto'

/**
 * @type {Array<{
 *   expected: Partial<import('../../dist/types').MapeoDoc>,
 *   doc: import('../../dist/types').MapeoDocInternal
 * }>}
 */
export const goodDocsCompleted = [
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'observation',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      createdBy: cachedValues.createdBy,
      links: [],
      lat: 24.0424,
      lon: 21.0214,
      refs: [],
      attachments: [
        {
          name: 'myFile',
          type: 'photo',
          driveDiscoveryId: cachedValues.attachments.driveDiscoveryId,
          hash: cachedValues.attachments.hash,
        },
      ],
      tags: {
        someKeyForSingleVal: 'someVal',
        someKeyForArrVal: ['arr', 'of', 'strings'],
      },
      metadata: {
        manualLocation: true,
        position: {
          timestamp: cachedValues.metadata.position.timestamp,
          mocked: false,
          coords: {
            latitude: 0.5,
            longitude: -0.2,
            altitude: 0.8,
            heading: 1.2,
            speed: 0.7,
            accuracy: 1.3,
          },
        },
        lastSavedPosition: {
          timestamp: cachedValues.metadata.position.timestamp,
          mocked: true,
          coords: {
            latitude: 1.5,
            longitude: -2.3,
            altitude: 1000.1,
            heading: 0.2,
            speed: 0.1,
            accuracy: 8.3,
          },
        },
        positionProvider: {
          gpsAvailable: true,
          passiveAvailable: false,
          locationServicesEnabled: true,
          networkAvailable: false,
        },
      },
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
      defaultPresets: {
        point: cachedValues.defaultPresets.point,
        area: cachedValues.defaultPresets.point,
        vertex: cachedValues.defaultPresets.point,
        line: cachedValues.defaultPresets.point,
        relation: cachedValues.defaultPresets.point,
      },
      name: 'myProject',
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
      tagKey: 'otherTagKey',
      type: 'number',
      label: 'differentLabel',
      appearance: 'singleline',
      snakeCase: true,
      universal: true,
      options: [
        {
          label: 'someOtherLabel',
          value: 'somePrimitiveTagValue',
        },
      ],
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
      geometry: ['point', 'vertex', 'line'],
      tags: {
        someKeyForArrVal: ['arr', 'of', 'strings'],
      },
      addTags: {
        heyAddThisTag: 'pleease',
        orMaybeThis: ['right?', '', 'that was empty'],
      },
      removeTags: {
        deleteInmeditaly: ['this list', 'of things'],
      },
      fieldIds: cachedValues.fieldIds,
      iconId: cachedValues.iconId,
      terms: ['imastring'],
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
      roleId: '6fd029a78243',
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
      deviceType: 'desktop',
      deleted: true,
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
      // @ts-expect-error
      deviceType: 'motorbike',
      deleted: true,
    },
    expected: {
      deviceType: 'UNRECOGNIZED',
    },
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
        {
          size: 'large',
          pixelDensity: 3,
          blobVersionId: randomBytes(32).toString('hex') + '/0',
          mimeType: 'image/svg+xml',
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
      schemaNameRef: 'preset',
      docIdRef: cachedValues.docIdRef,
      fieldRef: 'terms[0]',
      languageCode: 'es',
      regionCode: 'AR',
      message: 'agroforestación',
    },
    expected: {},
  },
]
