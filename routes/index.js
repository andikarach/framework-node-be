const express = require('express');
const router = express.Router();
const tokenMiddleware = require('..//middleware/tokenMiddleware')

// Controller Section
const AuthController = require('../controllers/AuthController');

const upload = require('../config/multerConfig');

// Auth Route
router.post("/auth/login", AuthController.login)
router.post("/auth/register", AuthController.register)
router.post("/auth/verify-email", AuthController.verifyEmail)
router.get("/auth/refresh-token", AuthController.refreshToken)

router.get("/auth/test-email", AuthController.testSendEmail)

// Route Section
router.get('/', (req, res) => {
    res.json({ message: "Welcome to Grosirin API" });
});

// Add more routes as needed
module.exports = router;
