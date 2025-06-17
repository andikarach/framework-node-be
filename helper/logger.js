const { configure, getLogger } = require("log4js")
require('dotenv').config();

configure({
    appenders: {
        out: { type: "stdout" },
        app: { type: "file", filename: "app.log" }
    },
    categories: {
        default: {
            appenders: ['app', "out"],
            level: process.env.LOG4JS_LEVEL || "off"
        }
    }
})
const logger = getLogger()

module.exports = logger