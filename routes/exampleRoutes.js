
const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/ExampleController');
const { verifyToken } = require("../middleware/tokenMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Middleware untuk melindungi semua route
router.use(verifyToken);

router.get('/', exampleController.getData);
router.get('/:id', exampleController.getDataById);
router.post("/",
    upload.uploadMultipleImageFields([
        { name: 'thumbnail', prefix: 'example-thumbnails' },
        { name: 'icon', prefix: 'example-icons' }
    ]),
    exampleController.postProperty
);
router.put('/:id', exampleController.updateData);
router.put("/:id/restore", exampleController.restoreData);
router.delete('/:id', exampleController.softDeleteCategory);
router.delete('/:id/hard-delete', exampleController.hardDeleteCategory);

module.exports = router;
