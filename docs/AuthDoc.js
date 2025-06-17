/**
 * POST /auth/login
 * @tags Auth
 * @security BearerAuth
 * @param {object} request.body.required - application/json
 * @example request - login
 * {
 *    "email": "alpha@grosirin.com",
 *    "password": "@Aa12345"
 * }
 * @return {object} 200 - success response - application/json
 * @example response - 200 - success response
 * {
 *    "status": true,
 *    "result": {
 * :      "id": "4d57562a-4e87-413c-8a4a-79680d04077f",
 *        "name": "Alpha User",
 *        "email": "alpha@grosirin.com",
 *        "url_foto": null,
 *        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRkNTc1NjJhLTRlODctNDEzYy04YTRhLTc5NjgwZDA0MDc3ZiIsImVtYWlsIjoiYWFtYXVsYW5heXVzdWZAYWdyaW5vdmEuY29tIiwiaWF0IjoxNzI2MjE2MzkzLCJleHAiOjE3MjYyNTk1OTN9.ggeKDdwSKviG4MPBJnJpMLneeDmLz4uAR3NPERtR97w"
 *    },
 *    "message": "Successfully login"
 * }
 * 
 * @return {object} 400 - error response - application/json
 * @example response - 400 - error response
 * {
 *    "message": "Invalid email or password"
 * }
 */

/**
 * POST /auth/register
 * @tags Auth
 * @security BearerAuth
 * @param {object} request.body.required - application/json
 * @example request - register
 * {
 *    "name": "Alpha User",
 *    "email": "alpha@grosirin.com",
 *    "business_name": "Soft Pro One Grosirin",
 *    "password": "@Aa12345"
 * }
 * @return {object} 200 - success response - application/json
 * @example response - 200 - success response
 * {
 *    "status": true,
 *    "result": {
 *          "name": "Alpha User",
 *          "email": "alpha@grosirin.com",
 *          "code": "$2b$12$lflKdEl.FgniBJIT4mr1vuRDGrjsNYpA5RFxLmpgsVybJ5gIbkbf."
 *    },
 *    "message": "Successfully registered"
 * }
 * 
 * @return {object} 400 - error response - application/json
 * @example response - 400 - error response
 * {
 *    "message": "Registration failed"
 * }
 */

/**
 * POST /auth/verify-email
 * @tags Auth
 * @param {object} request.body.required - application/json
 * @example request - verify email
 * {
 *    "code": "123456"
 * }
 * @return {object} 200 - success response - application/json
 * @example response - 200 - success response
 * {
 *    "status": true,
 *    "message": "Email successfully verified"
 * }
 * 
 * @return {object} 404 - error response - application/json
 * @example response - 404 - error response
 * {
 *    "message": "Invalid verification code"
 * }
 */

/**
 * POST /auth/refresh-token
 * @tags Auth
 * @security BearerAuth
 * @return {object} 200 - success response - application/json
 * @example response - 200 - success response
 * {
 *    "status": true,
 *    "result": {
 *        "status": "active",
 *        "token": "new_access_token"
 *    },
 *    "message": "Token successfully refreshed"
 * }
 * 
 * @return {object} 401 - error response - application/json
 * @example response - 401 - error response
 * {
 *    "status": false,
 *    "message": "Unauthorized (no token provided)"
 * }
 * 
 * @return {object} 422 - error response - application/json
 * @example response - 422 - error response
 * {
 *    "status": false,
 *    "message": "Cannot refresh token"
 * }
 */
