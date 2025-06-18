const fs = require('fs');
const path = require('path');

const ROUTES_DIR = path.join(__dirname, '..', 'routes');
const OUTPUT_FILE = path.join(ROUTES_DIR, 'indexRoutes.js');
const entities = require('./entities.json'); // langsung require karena JSON

// Static import bagian atas
const staticImports = `const express = require('express');
const router = express.Router();

// Static Controllers
const AuthController = require('../controllers/AuthController');
const RegionController = require('../controllers/RegionController');`;

// Static route yang tetap ada
const staticRoutes = `
// ---------- Auth Routes ----------
router.post("/auth/login", AuthController.login);
router.post("/auth/register", AuthController.register);
router.post("/auth/verify-email", AuthController.verifyEmail);
router.get("/auth/refresh-token", AuthController.refreshToken);

// ---------- Region ----------
router.get("/region/provincies", RegionController.getProvinces);
router.get("/region/regencies/:id", RegionController.getRegencies);
router.get("/region/districts/:id", RegionController.getDistricts);
router.get("/region/villages/:id", RegionController.getVillages);
`;

// Footer bagian bawah
const footer = `
// ---------- Default ----------
router.get('/', (req, res) => {
  res.json({ message: "Welcome to Grosirin API" });
});

module.exports = router;
`;

// Auto generate import dan use() dari entities
const autoRouterLines = entities.map(name => {
    const safeName = name.replace(/-/g, '');
    const routePath = name.toLowerCase();
    const fileName = `${safeName}Router.js`;
    return `router.use('/${routePath}', require('./${fileName}'));`;
});

// Gabungkan semua bagian
const finalOutput = [
    staticImports,
    '',
    staticRoutes,
    '',
    '// ---------- Auto Registered Routers from entities.json ----------',
    '// ---------- Start Line ----------',
    ...autoRouterLines,
    '// ---------- End Line ----------',
    '',
    footer
];

// Simpan hasil
if (!fs.existsSync(OUTPUT_FILE)) {
    fs.writeFileSync(OUTPUT_FILE, finalOutput.join('\n'));
    console.log(`✅ Routes generated: ${OUTPUT_FILE}`);
} else {
    console.log(`⚠️  indexRoutes.js already exists: ${OUTPUT_FILE}`);
}