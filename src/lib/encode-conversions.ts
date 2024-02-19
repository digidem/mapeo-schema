import { CurrentProtoTypes } from '../proto/types.js'
import {
  ProtoTypesWithSchemaInfo,
  SchemaName,
  MapeoCommon,
  TagValuePrimitive,
  JsonTagValue,
  OmitUnion,
  CoreOwnershipSignatures,
  MapeoDocInternal,
} from '../types.js'
import { TagValue_1, type TagValue_1_PrimitiveValue } from '../proto/tags/v1.js'
import { Icon } from '../schema/icon.js'
import { type Icon_1_IconVariant } from '../proto/icon/v1.js'
import { Observation_5_Metadata } from '../proto/observation/v5.js'
import { parseVersionId } from './utils.js'
import { CoreOwnership } from '../index.js'

/** Function type for converting a protobuf type of any version for a particular
 * schema name, and returning the most recent JSONSchema type */
type ConvertFunction<TSchemaName extends SchemaName> = (
  mapeoDoc: Extract<
    OmitUnion<MapeoDocInternal, 'versionId'>,
    { schemaName: TSchemaName }
  >
) => CurrentProtoTypes[TSchemaName]

export const convertProjectSettings: ConvertFunction<'projectSettings'> = (
  mapeoDoc
) => {
  const { defaultPresets } = mapeoDoc
  return {
    common: convertCommon(mapeoDoc),
    ...mapeoDoc,
    defaultPresets: defaultPresets
      ? {
          point: defaultPresets.point.map((p) => Buffer.from(p, 'hex')),
          area: defaultPresets.area.map((a) => Buffer.from(a, 'hex')),
          vertex: defaultPresets.vertex.map((v) => Buffer.from(v, 'hex')),
          line: defaultPresets.line.map((l) => Buffer.from(l, 'hex')),
          relation: defaultPresets.relation.map((r) => Buffer.from(r, 'hex')),
        }
      : undefined,
  }
}

export const convertField: ConvertFunction<'field'> = (mapeoDoc) => {
  return {
    common: convertCommon(mapeoDoc),
    // Spread to ensure that we do not miss any fields (otherwise optional
    // fields on the protoObj that exist on mapeoDoc will be missed)
    ...mapeoDoc,
    // Set defaults for optional fields
    options: mapeoDoc.options
      ? mapeoDoc.options.map((opt) => {
          return {
            label: opt.label,
            value: convertTagPrimitive(opt.value),
          }
        })
      : [],
  }
}

export const convertPreset: ConvertFunction<'preset'> = (mapeoDoc) => {
  return {
    common: convertCommon(mapeoDoc),
    ...mapeoDoc,
    tags: convertTags(mapeoDoc.tags),
    addTags: convertTags(mapeoDoc.addTags),
    removeTags: convertTags(mapeoDoc.removeTags),
    fieldIds: mapeoDoc.fieldIds.map((field) => Buffer.from(field, 'hex')),
    iconId: mapeoDoc.iconId ? Buffer.from(mapeoDoc.iconId, 'hex') : undefined,
  }
}

export const convertObservation: ConvertFunction<'observation'> = (
  mapeoDoc
) => {
  const refs = mapeoDoc.refs.map((ref) => {
    return { id: Buffer.from(ref.id, 'hex') }
  })
  const attachments = mapeoDoc.attachments.map((attachment) => {
    return {
      driveDiscoveryId: Buffer.from(attachment.driveDiscoveryId, 'hex'),
      name: attachment.name,
      type: attachment.type,
      hash: Buffer.from(attachment.hash, 'hex'),
    }
  })

  return {
    common: convertCommon(mapeoDoc),
    ...mapeoDoc,
    refs,
    attachments,
    tags: convertTags(mapeoDoc.tags),
    metadata:
      mapeoDoc.metadata &&
      Observation_5_Metadata.fromPartial(mapeoDoc.metadata),
  }
}

export const convertMembership: ConvertFunction<'membership'> = (mapeoDoc) => {
  const roleId = Buffer.from(mapeoDoc.roleId, 'hex')
  if (roleId.length === 0) {
    throw new Error('Invalid roleId')
  }
  return {
    common: convertCommon(mapeoDoc),
    ...mapeoDoc,
    roleId: Buffer.from(mapeoDoc.roleId, 'hex'),
  }
}

export const convertDeviceInfo: ConvertFunction<'deviceInfo'> = (mapeoDoc) => {
  return {
    common: convertCommon(mapeoDoc),
    ...mapeoDoc,
  }
}

export const convertCoreOwnership = (
  mapeoDoc: Omit<CoreOwnership, 'versionId'> & CoreOwnershipSignatures
): CurrentProtoTypes['coreOwnership'] => {
  return {
    common: convertCommon(mapeoDoc),
    ...mapeoDoc,
    authCoreId: Buffer.from(mapeoDoc.authCoreId, 'hex'),
    configCoreId: Buffer.from(mapeoDoc.configCoreId, 'hex'),
    dataCoreId: Buffer.from(mapeoDoc.dataCoreId, 'hex'),
    blobCoreId: Buffer.from(mapeoDoc.blobCoreId, 'hex'),
    blobIndexCoreId: Buffer.from(mapeoDoc.blobIndexCoreId, 'hex'),
  }
}

export const convertIcon: ConvertFunction<'icon'> = (mapeoDoc) => {
  const { variants, ...rest } = mapeoDoc
  return {
    common: convertCommon(mapeoDoc),
    ...rest,
    variants: convertIconVariants(variants),
  }
}

export const convertTranslation: ConvertFunction<'translation'> = (
  mapeoDoc
) => {
  return {
    common: convertCommon(mapeoDoc),
    ...mapeoDoc,
    docIdRef: Buffer.from(mapeoDoc.docIdRef, 'hex'),
  }
}

function convertIconVariants(variants: Icon['variants']): Icon_1_IconVariant[] {
  return variants.map((variant) => {
    const { blobVersionId, mimeType, size, pixelDensity } = variant
    return {
      blobVersionId: parseVersionId(blobVersionId),
      mimeType: convertIconMimeType(mimeType),
      size,
      pixelDensity: convertIconPixelDensity(pixelDensity),
    }
  })
}
function convertIconMimeType(mimeType: 'image/svg+xml' | 'image/png') {
  switch (mimeType) {
    case 'image/svg+xml':
      return 'svg'
    case 'image/png':
      return 'png'
    default:
      return 'svg'
  }
}

function convertIconPixelDensity(pixelDensity: 1 | 2 | 3) {
  switch (pixelDensity) {
    case 1:
      return 'x1'
    case 2:
      return 'x2'
    case 3:
      return 'x3'
  }
}

function convertCommon(
  common: Omit<MapeoCommon, 'versionId'>
): ProtoTypesWithSchemaInfo['common'] {
  return {
    docId: Buffer.from(common.docId, 'hex'),
    createdAt: common.createdAt,
    updatedAt: common.updatedAt,
    createdBy: Buffer.from(common.createdBy, 'hex'),
    links: common.links.map((link) => parseVersionId(link)),
    deleted: common.deleted,
  }
}

function convertTags(tags: {
  [key: string]: Exclude<JsonTagValue, undefined>
}): {
  [key: string]: TagValue_1
} {
  return Object.keys(tags).reduce<{ [key: string]: TagValue_1 }>((acc, k) => {
    acc[k] = convertTagValue(tags[k])
    return acc
  }, {})
}

function convertTagValue(tagValue: JsonTagValue): TagValue_1 {
  let kind: TagValue_1['kind']
  if (Array.isArray(tagValue)) {
    kind = {
      $case: 'list_value',
      list_value: {
        list_value: tagValue
          .filter((v) => typeof v !== 'undefined')
          .map((v) => convertTagPrimitive(v)),
      },
    }
  } else {
    kind = {
      $case: 'primitive_value',
      primitive_value: convertTagPrimitive(tagValue),
    }
  }
  return { kind }
}

function convertTagPrimitive(
  tagPrimitive: TagValuePrimitive
): TagValue_1_PrimitiveValue {
  let kind: TagValue_1_PrimitiveValue['kind']
  switch (typeof tagPrimitive) {
    case 'boolean':
      kind = {
        $case: 'boolean_value',
        boolean_value: tagPrimitive,
      }
      break
    case 'string':
      kind = {
        $case: 'string_value',
        string_value: tagPrimitive,
      }
      break
    case 'number':
      kind = {
        $case: 'number_value',
        number_value: tagPrimitive,
      }
      break
    case 'undefined':
      kind = undefined
      break
    case 'object': // null
      kind = {
        $case: 'null_value',
        null_value: 'NULL_VALUE',
      }
      break
    default:
      const _exhaustiveCheck: never = tagPrimitive
  }
  return { kind }
}
