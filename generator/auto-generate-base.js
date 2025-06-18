/* 
    This script generates controllers, models, and routes for specified entities in a Node.js application using Sequelize ORM.
*/

const fs = require('fs');
const path = require('path');

const entities = require('./entities.json');

const toPascalCase = (str) =>
    str
        .split(/[-_]/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');

// Helper: kebab-case to snake_case
const toSnakeCase = (str) => str.replace(/-/g, '_');

const controllerTemplate = (name) => `
require("dotenv").config();
const db = require("../models/db.js");
const { Op } = require("sequelize");
const { parsePaginationQuery, formatPaginationResponse, buildWhereClause } = require("../helper/pagination.js");
const ${toPascalCase(name)}Model = require('../models/${toPascalCase(name)}Model.js');


exports.getData = async (req, res) => {
    try {
        const pagination = parsePaginationQuery(req.query);

        const where = buildWhereClause({
            search: pagination.search,
            fields: ["id"], // kolom yang bisa dicari
            extra: { deletedAt: null },
        });

        const options = {
            where,
            order: pagination.order
        };

        if (!pagination.all) {
            options.offset = pagination.offset;
            options.limit = pagination.pageSize;
        }

        const { rows, count } = await ${toPascalCase(name)}Model.findAndCountAll(options);

        const response = formatPaginationResponse(
            { rows, count },
            pagination
        );

        return res.status(200).json({
            status: true,
            message: "Successfully retrieved ${toPascalCase(name)}s",
            ...response,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            result: null,
            message: error.message,
        });
    }
};

exports.getDataById = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await ${toPascalCase(name)}Model.findByPk(id);

        if (!data) {
            return res.status(404).json({
                status: false,
                result: null,
                message: "${toPascalCase(name)} not found",
            });
        }

        return res.status(200).json({
            status: true,
            result: data,
            message: "Successfully retrieved ${toPascalCase(name)}",
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            result: null,
            message: error.message,
        });
    }
};

exports.postData = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                status: false,
                result: null,
                message: "Invalid input data",
            });
        }

        let newData;
        await db.sequelize.transaction(async (transaction) => {
            newData = await ${toPascalCase(name)}Model.create(
                { name },
                { transaction }
            );
        });

        return res.status(201).json({
            status: true,
            result: { name },
            message: "Successfully created ${toPascalCase(name)}",
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            result: null,
            message: error.message,
        });
    }
};

exports.softDeleteData = async (req, res) => {
    try {
        const { id } = req.params;

        // Check is data exist
        const data = await ${toPascalCase(name)}Model.findByPk(id);
        if (!data) {
            return res.status(404).json({ message: '${toPascalCase(name)} not found' });
        }

        // Soft delete
        await data.destroy(); // Soft delete (paranoid aktif)
        res.status(200).json({ message: '${toPascalCase(name)} has been soft deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.hardDeleteData = async (req, res) => {
    try {
        const { id } = req.params;

        // Check is data exist
        const data = await ${toPascalCase(name)}Model.findByPk(id, {paranoid: false});
        if (!data) {
            return res.status(404).json({ message: '${toPascalCase(name)} not found' });
        }

        // Soft delete
        await data.destroy({ force: true}); // Soft delete (paranoid aktif)
        res.status(200).json({ message: '${toPascalCase(name)} has been soft deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.restoreData = async (req, res) => {
    try {
        const { id } = req.params;

        // Check is data exist
        const data = await ${toPascalCase(name)}Model.findByPk(id, { paranoid: false }); // Termasuk data yang sudah soft delete
        if (!data) {
            return res.status(404).json({ message: '${toPascalCase(name)} not found' });
        }

        // Restore data
        await data.restore(); // Mengembalikan soft delete
        res.status(200).json({ message: '${toPascalCase(name)} has been restored' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Example for uploading images
exports.uploadImage = async (req, res) => {
  try {
    const { name, ...otherFields } = req.body;

    const thumbnailFile = req.files?.['thumbnail']?.[0];
    const iconFile = req.files?.['icon']?.[0];

    const thumbnailPath = thumbnailFile?.path;
    const iconPath = iconFile?.path;

    // Simpan ke DB atau proses lebih lanjut
    return res.status(201).json({
      status: true,
      message: "Property uploaded successfully",
      result: {
        name,
        thumbnail: thumbnailPath,
        icon: iconPath,
        ...otherFields,
      },
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
`;

const modelTemplate = (name) => `
const db = require("./db")
const { DataTypes, Model, ENUM } = require('sequelize');

class ${toPascalCase(name)}Model extends Model { }
${toPascalCase(name)}Model.init({
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
}, {
  indexes: [{
    unique: true,
    fields: ['id']
  }],
  sequelize: db.sequelize,
  modelName: '${toSnakeCase(name)}',
  freezeTableName: true,
  timestamps: true,
  paranoid: true, // Enable soft delete
});


module.exports = ${toPascalCase(name)}Model;
`;

const routeTemplate = (name) => `
const express = require('express');
const router = express.Router();
const ${toSnakeCase(name)}Controller = require('../controllers/${toPascalCase(name)}Controller');
const { verifyToken } = require("../middleware/tokenMiddleware");

// Middleware untuk melindungi semua route
router.use(verifyToken);

router.get('/', ${toSnakeCase(name)}Controller.getData);
router.get('/:id', ${toSnakeCase(name)}Controller.getDataById);
router.post('/', ${toSnakeCase(name)}Controller.postData);
router.put('/:id', ${toSnakeCase(name)}Controller.updateData);
router.put("/:id/restore", ${toSnakeCase(name)}Controller.restoreData);
router.delete('/:id', ${toSnakeCase(name)}Controller.softDeleteCategory);
router.delete('/:id/hard-delete', ${toSnakeCase(name)}Controller.hardDeleteCategory);

module.exports = router;
`;

const ensureDir = (dir) => {
    const fullPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath);
    }
};

const generateFiles = () => {
    ensureDir('controllers');
    ensureDir('models');
    ensureDir('routes');

    entities.forEach((entity) => {
        const className = toPascalCase(entity);

        const controllerPath = path.join(__dirname, '..', 'controllers', `${className}Controller.js`);
        const modelPath = path.join(__dirname, '..', 'models', `${className}Model.js`);
        const routePath = path.join(__dirname, '..', 'routes', `${entity}Routes.js`);

        if (!fs.existsSync(controllerPath)) {
            fs.writeFileSync(controllerPath, controllerTemplate(entity));
            console.log(`✅ Controller generated: ${controllerPath}`);
        } else {
            console.log(`⚠️  Controller already exists: ${controllerPath}`);
        }

        if (!fs.existsSync(modelPath)) {
            fs.writeFileSync(modelPath, modelTemplate(entity));
            console.log(`✅ Model generated: ${modelPath}`);
        } else {
            console.log(`⚠️  Model already exists: ${modelPath}`);
        }

        if (!fs.existsSync(routePath)) {
            fs.writeFileSync(routePath, routeTemplate(entity));
            console.log(`✅ Route generated: ${routePath}`);
        } else {
            console.log(`⚠️  Route already exists: ${routePath}`);
        }
    });
};


generateFiles();
