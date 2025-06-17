require('dotenv').config();
const jwt = require("jsonwebtoken");

module.exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
        jwt.verify(
            token.replace(/^Bearer\s/, ''), // Hapus prefix 'Bearer ' jika ada
            process.env.JWT_SECRET,
            (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        status: false,
                        message: "Invalid or expired token",
                    });
                } else {
                    req.user = decoded; // Simpan data token yang valid ke req.user
                    next(); // Lanjutkan ke handler berikutnya
                }
            }
        );
    } else {
        return res.status(401).json({
            status: false,
            message: "Token is required",
        });
    }
};
