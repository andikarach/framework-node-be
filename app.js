const express = require("express");
const moment = require("moment");
require("moment-timezone"); // Import moment-timezone
const cors = require("cors");
const Relationship = require("./models/Relationship");
const app = express();
const expressJSDocSwagger = require('express-jsdoc-swagger');
const fs = require('fs');
require('dotenv').config();  // Load environment variables

const models = require('./models');
models.associateModels();

/* Read models */
fs.readdir('./models', async (err, files) => {
    files.forEach((file, i) => {
        import('./models/' + file);
    });
});
Relationship();


// Cors Middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

global.moment = moment;
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta'); // Set the default timezone

// API DOCS SWAGGER
if (process.env.NODE_ENV === "development") {
    const options = {
        info: {
            version: '1.0.0',
            title: 'Grosirin',
            license: {
                name: 'PT. Next Corp',
            },
        },
        security: {
            BearerAuth: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header',
            },
        },
        filesPattern: ['./docs/**/*.js'], // Glob pattern to find your jsdoc files
        swaggerUIPath: '/api-web', // SwaggerUI will be render in this url. Default: '/api-docs'
        baseDir: __dirname,
    };

    expressJSDocSwagger(app)(options);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/uploads'));
app.use('/uploads', express.static('uploads'));

const router = require('./router');
app.use(router);

app.set("view engine", "ejs");

const PORT = process.env.PORT || 8765;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
