const multer = require("multer");
const path = require("path");
const fs = require('fs');

let upload = {}

const createUploadsDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

const storageImage = (prefixName) => multer.diskStorage({
    destination: function (req, file, cb) {
        const dirPath = path.join('uploads', req.body.path || '');
        createUploadsDir(dirPath);
        cb(null, dirPath);
    },
    filename: function (req, file, cb) {
        cb(null, prefixName + "-" + Date.now() + path.extname(file.originalname));
    }
});

const uploadImage = (prefixName) => multer({
    storage: storageImage(prefixName),
    limits: {
        fileSize: 10048576
    },
    fileFilter: function (req, file, callback) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'));
        }
        callback(null, true);
    },
});

const uploadMultipleImageFields = (fieldsConfig) => {
    return (req, res, next) => {
        const uploaders = fieldsConfig.map(({ name, prefix }) => {
            return new Promise((resolve, reject) => {
                const uploader = upload.uploadImage(prefix).single(name);
                uploader(req, res, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        });

        Promise.all(uploaders)
            .then(() => next())
            .catch((err) => next(err));
    };
};

const storageExcel = (prefixName) => multer.diskStorage({
    destination: function (req, file, cb) {
        const dirPath = path.join('uploads', req.body.path || '');
        createUploadsDir(dirPath);
        cb(null, dirPath);
    },
    filename: function (req, file, cb) {
        // cb(null, prefixName + "-" + Date.now() + path.extname(file.originalname));
        cb(null, prefixName + Date.now() + "-" + file.originalname);
    }
});

const uploadExcel = (prefixName) => multer({
    storage: storageExcel(prefixName),
    limits: {
        fileSize: 10048576
    },
    fileFilter: function (req, file, callback) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.xls' && ext !== '.xlsx') {
            return callback(new Error('Only Excel are allowed'));
        }
        callback(null, true);
    },
});

var storagePdf = multer.diskStorage({
    destination: function (req, file, cb) {
        const dirPath = path.join(__dirname, '../uploads', req.body.path || '');
        createUploadsDir(dirPath);
        cb(null, dirPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

var uploadPdf = multer({
    storage: storagePdf,
    limits: {
        fileSize: 10048576 // 10 MB
    },
    fileFilter: function (req, file, callback) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.pdf') {
            return callback(new Error('Only pdf are allowed'));
        }
        callback(null, true);
    },
});

const storageFile = (prefixName) => multer.diskStorage({
    destination: function (req, file, cb) {
        const dirPath = path.join('uploads', req.body.path || '');
        createUploadsDir(dirPath);
        cb(null, dirPath);
    },
    filename: function (req, file, cb) {
        // cb(null, prefixName + "-" + Date.now() + path.extname(file.originalname));
        cb(null, prefixName + Date.now() + "-" + file.originalname.replace(/ /g, '_').replace(/\(/g, '_').replace(/\)/g, '_'));
    }
});


const uploadFile = (prefixName) => multer({
    storage: storageFile(prefixName),
    limits: {
        fileSize: 10048576
    },
    fileFilter: function (req, file, callback) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.mp4' &&
            ext !== '.xlsx' && ext !== '.xls' && ext !== '.doc' && ext !== '.docx' && ext !== '.pdf') {
            return callback(new Error('Only specific file types are allowed'));
        }
        callback(null, true);
    },
});

upload.uploadImage = uploadImage;
upload.uploadExcel = uploadExcel;
upload.uploadPdf = uploadPdf;
upload.uploadFile = uploadFile;
upload.uploadMultipleImageFields = uploadMultipleImageFields;


module.exports.upload = upload;