/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * These properties are shared by all objects in the Mapeo database.
 */
export interface Common {
  /**
   * Unique value that identifies this element
   */
  id: string;
  /**
   * Unique value that identifies this particular version of this element
   */
  version: string;
  /**
   * RFC3339-formatted datetime of when the first version of the element was created
   */
  created_at: string;
  /**
   * RFC3339-formatted datetime of when this version of the element was created
   */
  timestamp?: string;
  /**
   * ID of the user who made this edit
   */
  userId?: string;
  /**
   * ID of the device that made this edit
   */
  deviceId?: string;
  /**
   * enum that defines the type of document in the database (defines which schema should be used)
   */
  type: string;
  /**
   * Version ids of the previous document versions this one is replacing
   */
  links?: string[];
  /**
   * Version of schema. Should increment for breaking changes to the schema
   */
  schemaVersion?: number;
}
