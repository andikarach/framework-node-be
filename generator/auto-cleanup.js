/* 
    This script cleans up controllers, models, and routes for specified entities in a Node.js application using Sequelize ORM.
*/

const fs = require('fs');
const path = require('path');

const entities = require('./entities.json');

const toPascalCase = (str) =>
  str
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');


const deleteIfExists = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`🗑️  Deleted: ${filePath}`);
  } else {
    console.log(`⚠️  Not found (skip): ${filePath}`);
  }
};

const destroyGeneratedFiles = () => {
  entities.forEach((entity) => {
    const className = toPascalCase(entity);

    const controllerPath = path.join(__dirname, '..', 'controllers', `${className}Controller.js`);
    const modelPath = path.join(__dirname, '..', 'models', `${className}Model.js`);
    const routePath = path.join(__dirname, '..', 'routes', `${entity}Routes.js`);
    const docPath = path.join(__dirname, '..', 'docs', `${entity}Doc.js`);

    deleteIfExists(controllerPath);
    deleteIfExists(modelPath);
    deleteIfExists(routePath);
    deleteIfExists(docPath);
  });
};

destroyGeneratedFiles();
