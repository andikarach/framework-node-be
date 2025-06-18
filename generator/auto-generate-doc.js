const fs = require('fs');
const path = require('path');

const entities = require('./entities.json');

const capitalize = (str) =>
  str
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');

const generateDocsContent = (entity) => {
  const tag = capitalize(entity);
  const route = `/${entity}`;

  return `/**
 * GET ${route}
 * @tags ${tag}
 * @summary Get all ${entity}
 * @return {object} 200 - success response - application/json
 * @example response - 200 - success response
 * {
 *    "status": true,
 *    "result": [{ "id": "123", "name": "Sample ${tag}" }],
 *    "message": "Successfully retrieved ${entity}"
 * }
 */

/**
 * POST ${route}
 * @tags ${tag}
 * @summary Create a new ${entity}
 * @param {object} request.body.required - application/json
 * @example request - create ${entity}
 * {
 *    "name": "Sample ${tag}"
 * }
 * @return {object} 201 - success response - application/json
 * @example response - 201 - success response
 * {
 *    "status": true,
 *    "result": { "id": "123", "name": "Sample ${tag}" },
 *    "message": "Successfully created ${entity}"
 * }
 * @return {object} 400 - error response - application/json
 * @example response - 400 - error response
 * {
 *    "message": "${tag} creation failed"
 * }
 */

/**
 * PUT ${route}/{id}
 * @tags ${tag}
 * @summary Update a ${entity}
 * @param {string} id.path.required - ${tag} ID
 * @param {object} request.body.required - application/json
 * @example request - update ${entity}
 * {
 *    "name": "Updated ${tag}"
 * }
 * @return {object} 200 - success response - application/json
 * @example response - 200 - success response
 * {
 *    "status": true,
 *    "result": { "id": "123", "name": "Updated ${tag}" },
 *    "message": "Successfully updated ${entity}"
 * }
 * @return {object} 404 - error response - application/json
 * @example response - 404 - error response
 * {
 *    "message": "${tag} not found"
 * }
 */

/**
 * DELETE ${route}/{id}
 * @tags ${tag}
 * @summary Delete a ${entity}
 * @param {string} id.path.required - ${tag} ID
 * @return {object} 200 - success response - application/json
 * @example response - 200 - success response
 * {
 *    "status": true,
 *    "message": "Successfully deleted ${entity}"
 * }
 * @return {object} 404 - error response - application/json
 * @example response - 404 - error response
 * {
 *    "message": "${tag} not found"
 * }
 */

/**
 * DELETE ${route}/{id}/hard-delete
 * @tags ${tag}
 * @summary Hard delete a ${entity}}
 * @param {string} id.path.required - ${tag} ID
 * @return {object} 200 - Success response - application/json
 * @example response - 200 - success response
 * {
 *   "message": "${entity} has been permanently deleted"
 * }
 * @return {object} 404 - Error response - application/json
 * @example response - 404 - error response
 * {
 *   "message": "${tag} not found"
 * }
 */

/**
 * PATCH ${route}/{id}/restore
 * @tags ${tag}
 * @summary Restore a soft-deleted ${entity}
 * @param {string} id.path.required - ${tag} ID
 * @return {object} 200 - Success response - application/json
 * @example response - 200 - success response
 * {
 *   "message": "${entity} has been restored"
 * }
 * @return {object} 404 - Error response - application/json
 * @example response - 404 - error response
 * {
 *   "message": "${tag} not found"
 * }s
 */
`;
};

const generateDocs = () => {
  const docsDir = path.join(__dirname, '..', 'docs');
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir);

  entities.forEach((entity) => {
    const tag = capitalize(entity);
    const filePath = path.join(docsDir, `${tag}Doc.js`);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, generateDocsContent(entity));
      console.log(`📘 Generated: ${filePath}`);
    } else {
      console.log(`⚠️  Skipped (exists): ${filePath}`);
    }
  });
};


generateDocs();
