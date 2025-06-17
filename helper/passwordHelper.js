const bcrypt = require('bcrypt');
const saltRounds = 12

module.exports.encryptPassword = async (password) => {
    return await bcrypt.hash(password, saltRounds);
}

module.exports.comparePassword = async (password, hashPassword) => {
    return await bcrypt.compare(password, hashPassword);
}