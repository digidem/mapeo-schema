// This file exports a function for converting each supported schema type (all
// known versions) to the latest JSONSchema type
import {
  type TagValue_1,
  type TagValue_1_PrimitiveValue,
} from '../proto/tags/v1.js'

import {
  type Icon_1_IconVariant,
  Icon_1_IconVariantPng_PixelDensity,
} from '../proto/icon/v1.js'

import {
  type MapeoDoc,
  type ProtoTypesWithSchemaInfo,
  type SchemaName,
  type FilterBySchemaName,
  type MapeoCommon,
  type TagValuePrimitive,
  type JsonTagValue,
  type MapeoDocInternal,
} from '../types.js'
import { ExhaustivenessError, VersionIdObject, getVersionId } from './utils.js'
import type { Observation, Track } from '../index.js'
import type { Observation_1_Attachment } from '../proto/observation/v1.js'
import type { Track_1_Position } from '../proto/track/v1.js'

/** Function type for converting a protobuf type of any version for a particular
 * schema name, and returning the most recent JSONSchema type */
type ConvertFunction<TSchemaName extends SchemaName> = (
  message: Extract<ProtoTypesWithSchemaInfo, { schemaName: TSchemaName }>,
  versionObj: VersionIdObject
) => FilterBySchemaName<MapeoDocInternal, TSchemaName>

export const convertProjectSettings: ConvertFunction<'projectSettings'> = (
  message,
  versionObj
) => {
  const { common, schemaVersion, defaultPresets, ...rest } = message
  const jsonSchemaCommon = convertCommon(common, versionObj)
  return {
    ...jsonSchemaCommon,
    ...rest,
    defaultPresets: defaultPresets
      ? {
          point: defaultPresets.point.map((p) => p.toString('hex')),
          area: defaultPresets.area.map((a) => a.toString('hex')),
          vertex: defaultPresets.vertex.map((v) => v.toString('hex')),
          line: defaultPresets.line.map((l) => l.toString('hex')),
          relation: defaultPresets.relation.map((r) => r.toString('hex')),
        }
      : undefined,
  }
}

export const convertObservation: ConvertFunction<'observation'> = (
  message,
  versionObj
) => {
  const { common, schemaVersion, ...rest } = message
  const jsonSchemaCommon = convertCommon(common, versionObj)

  const obs: Observation = {
    ...jsonSchemaCommon,
    ...rest,
    refs: message.refs?.map(({ id }) => ({ id: id.toString('hex') })),
    attachments: message.attachments.map(convertAttachment),
    tags: convertTags(message.tags),
    metadata: message.metadata || {},
  }
  return obs
}

type FieldOptions = FilterBySchemaName<MapeoDoc, 'field'>['options']

export const convertField: ConvertFunction<'field'> = (message, versionObj) => {
  const { common, schemaVersion, ...rest } = message
  const jsonSchemaCommon = convertCommon(common, versionObj)
  if (!message.tagKey) {
    // We can't do anything with a field without a tag key, so we ignore these
    throw new Error('Missing tagKey on field')
  } else {
    return {
      ...jsonSchemaCommon,
      ...rest,
      tagKey: message.tagKey,
      label: message.label || message.tagKey,
      appearance:
        message.appearance === 'UNRECOGNIZED' ? undefined : message.appearance,
      options:
        message.options.length > 0
          ? message.options.reduce<Exclude<FieldOptions, undefined>>(
              (acc, { label, value }) => {
                // Filter out any options where value is undefined (this would still be valid protobuf, but not valid for our code)
                if (!value) return acc
                const convertedValue = convertTagPrimitive(value)
                if (typeof convertedValue === 'undefined') return acc
                acc.push({ label, value: convertedValue })
                return acc
              },
              []
            )
          : undefined,
    }
  }
}

type JsonSchemaPresetGeomItem = FilterBySchemaName<
  MapeoDoc,
  'preset'
>['geometry'][number]

export const convertPreset: ConvertFunction<'preset'> = (
  message,
  versionObj
) => {
  const { common, schemaVersion, ...rest } = message
  const jsonSchemaCommon = convertCommon(common, versionObj)
  const geometry = rest.geometry.filter(
    (geomType): geomType is JsonSchemaPresetGeomItem =>
      geomType !== 'UNRECOGNIZED'
  )

  return {
    ...jsonSchemaCommon,
    ...rest,
    geometry,
    iconId: rest.iconId ? rest.iconId.toString('hex') : undefined,
    tags: convertTags(rest.tags),
    addTags: convertTags(rest.addTags),
    removeTags: convertTags(rest.removeTags),
    fieldIds: rest.fieldIds.map((id) => id.toString('hex')),
  }
}

export const convertRole: ConvertFunction<'role'> = (message, versionObj) => {
  if (message.roleId.length === 0) {
    throw new Error('Invalid roleId')
  }
  const { common, schemaVersion, ...rest } = message
  const jsonSchemaCommon = convertCommon(common, versionObj)
  return {
    ...jsonSchemaCommon,
    ...rest,
    roleId: message.roleId.toString('hex'),
  }
}

export const convertDeviceInfo: ConvertFunction<'deviceInfo'> = (
  message,
  versionObj
) => {
  const { common, schemaVersion, ...rest } = message
  const jsonSchemaCommon = convertCommon(common, versionObj)
  return {
    ...jsonSchemaCommon,
    ...rest,
  }
}

export const convertCoreOwnership: ConvertFunction<'coreOwnership'> = (
  message,
  versionObj
) => {
  if (!message.coreSignatures) {
    throw new Error('Invalid message: missing core signatures')
  }
  const {
    common,
    schemaVersion,
    authCoreId,
    configCoreId,
    dataCoreId,
    blobCoreId,
    blobIndexCoreId,
    ...rest
  } = message
  const jsonSchemaCommon = convertCommon(common, versionObj)
  return {
    ...jsonSchemaCommon,
    ...rest,
    authCoreId: authCoreId.toString('hex'),
    configCoreId: configCoreId.toString('hex'),
    dataCoreId: dataCoreId.toString('hex'),
    blobCoreId: blobCoreId.toString('hex'),
    blobIndexCoreId: blobIndexCoreId.toString('hex'),
    coreSignatures: message.coreSignatures,
  }
}

export const convertIcon: ConvertFunction<'icon'> = (message, versionObj) => {
  const { common, schemaVersion, ...rest } = message
  const jsonSchemaCommon = convertCommon(common, versionObj)
  return {
    ...jsonSchemaCommon,
    ...rest,
    variants: message.variants.map((variant) => convertIconVariant(variant)),
  }
}

export const convertTranslation: ConvertFunction<'translation'> = (
  message,
  versionObj
) => {
  const { common, schemaVersion, ...rest } = message
  const jsonSchemaCommon = convertCommon(common, versionObj)
  return {
    ...jsonSchemaCommon,
    ...rest,
    docIdRef: message.docIdRef.toString('hex'),
  }
}

export const convertTrack: ConvertFunction<'track'> = (message, versionObj) => {
  const { common, schemaVersion, ...rest } = message
  const jsonSchemaCommon = convertCommon(common, versionObj)
  const locations = message.locations.map(convertTrackPosition)
  const refs = message.refs.map(({ id, type }) => ({
    id: id.toString('hex'),
    type,
  }))
  return {
    ...jsonSchemaCommon,
    ...rest,
    refs,
    locations,
    attachments: message.attachments.map(convertAttachment),
    tags: convertTags(message.tags),
  }
}

function convertIconVariant(variant: Icon_1_IconVariant) {
  if (variant.variant?.$case === 'pngIcon') {
    const { pixelDensity } = variant.variant.pngIcon
    return convertIconVariantPng({ ...variant, pixelDensity })
  } else if (variant.variant?.$case === 'svgIcon') {
    return convertIconVariantSvg(variant)
  } else {
    throw new Error('invalid icon variant type')
  }
}

function convertIconVariantPng(
  variant: Icon_1_IconVariant & {
    pixelDensity: Icon_1_IconVariantPng_PixelDensity
  }
) {
  const { blobVersionId, size, pixelDensity } = variant
  if (!blobVersionId) {
    throw new Error('Missing required property `blobVersionId`')
  }
  return {
    blobVersionId: getVersionId(blobVersionId),
    mimeType: 'image/png' as const,
    size: size === 'UNRECOGNIZED' ? 'medium' : size,
    pixelDensity: convertIconPixelDensity(pixelDensity),
  }
}

function convertIconVariantSvg(variant: Icon_1_IconVariant) {
  const { blobVersionId, size } = variant
  if (!blobVersionId) {
    throw new Error('Missing required property `blobVersionId`')
  }
  return {
    blobVersionId: getVersionId(blobVersionId),
    mimeType: 'image/svg+xml' as const,
    size: size === 'UNRECOGNIZED' ? 'medium' : size,
  }
}

function convertIconPixelDensity(
  pixelDensity: Icon_1_IconVariantPng_PixelDensity
): 1 | 2 | 3 {
  switch (pixelDensity) {
    case 'x1':
      return 1
    case 'x2':
      return 2
    case 'x3':
      return 3
    default:
      return 1
  }
}

function convertTags(tags: { [key: string]: TagValue_1 } | undefined): {
  [key: string]: Exclude<JsonTagValue, undefined>
} {
  if (!tags) return {}
  return Object.keys(tags).reduce<{
    [key: string]: Exclude<JsonTagValue, undefined>
  }>((acc, key) => {
    // Ignore (filter out) undefined entries in an array
    const convertedValue = tags[key] && convertTagValue(tags[key])
    if (typeof convertedValue !== 'undefined') {
      acc[key] = convertedValue
    }
    return acc
  }, {})
}

function convertTagValue({ kind }: TagValue_1): JsonTagValue {
  if (!kind) return undefined
  switch (kind.$case) {
    case 'list_value':
      return kind.list_value.list_value.reduce<
        Exclude<TagValuePrimitive, undefined>[]
      >((acc, value) => {
        const convertedValue = convertTagPrimitive(value)
        if (typeof convertedValue !== 'undefined') {
          acc.push(convertedValue)
        }
        return acc
      }, [])
    case 'primitive_value':
      return convertTagPrimitive(kind.primitive_value)
    default:
      throw new ExhaustivenessError(kind)
  }
}

function convertTagPrimitive({
  kind,
}: TagValue_1_PrimitiveValue): TagValuePrimitive {
  if (!kind) return undefined
  switch (kind.$case) {
    case 'null_value':
      return null
    case 'boolean_value':
      return kind.boolean_value
    case 'number_value':
      return kind.number_value
    case 'string_value':
      return kind.string_value
    default:
      throw new ExhaustivenessError(kind)
  }
}

function convertCommon(
  common: ProtoTypesWithSchemaInfo['common'],
  versionObj: VersionIdObject
): Omit<MapeoCommon, 'schemaName'> {
  if (!common || !common.docId || !common.createdAt || !common.updatedAt) {
    throw new Error('Missing required common properties')
  }

  return {
    docId: common.docId.toString('hex'),
    versionId: getVersionId(versionObj),
    links: common.links.map((link) => getVersionId(link)),
    createdAt: common.createdAt,
    updatedAt: common.updatedAt,
    createdBy: common.createdBy.toString('hex'),
    deleted: common.deleted,
  }
}

function convertAttachment({
  driveDiscoveryId,
  name,
  type,
  hash,
}: Observation_1_Attachment): Observation['attachments'][number] {
  return {
    driveDiscoveryId: driveDiscoveryId.toString('hex'),
    name,
    type,
    hash: hash.toString('hex'),
  }
}

function convertTrackPosition(
  position: Track_1_Position
): Track['locations'][number] {
  if (!position.timestamp) {
    throw new Error('Missing required property `timestamp`')
  }
  if (!position.coords) {
    throw new Error('Missing required property `coords`')
  }
  return {
    ...position,
    coords: position.coords,
    timestamp: position.timestamp,
  }
}
