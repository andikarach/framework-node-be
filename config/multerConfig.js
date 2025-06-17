const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Mapping folder berdasarkan fieldname
const folderMap = {
    product_image: 'uploads/product-images/',
    rep_image: 'uploads/products/',
    watermark_logo: 'uploads/logos/',
    struk_logo: 'uploads/logos/',
    text_logo: 'uploads/logos/',
    payment_image: 'uploads/payment-images/',
    profile_picture: 'uploads/profile-pictures/',
    shipping_provider_image: 'uploads/shipping-provider-images/',
    shipping_method_image: 'uploads/shipping-method-images/',
};
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = folderMap[file.fieldname] || 'uploads/others/';

        // Create the directory if it doesn't exist
        if(!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        } 
        
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${fileExtension}`);
    }
});

// Create the multer instance
const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedFileTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type, only JPEG, JPG, and PNG are allowed.'), false);
        }
        cb(null, true); 
    }
});

module.exports = upload;
