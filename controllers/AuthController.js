require("dotenv").config();
const express = require("express"); // Pastikan express di-import
const cors = require("cors"); // Import cors
const logger = require("../helper/logger");
const passwordHelper = require("../helper/passwordHelper.js");
const verifyEmailHelper = require("./../helper/verifyEmailHelper");
const jwt = require("jsonwebtoken");
const db = require("../models/db");
const { Op } = require("sequelize");
const { verifyToken } = require("../helper/tokenHelper");
const { UserModel, BusinessAccountModel } = require("../models")
const { sendEmail } = require("../helper/verifyEmailHelper");

// Middleware CORS
const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware untuk parsing JSON dan URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

module.exports.register = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const businessName = req.body.business_name;

    // Validasi data input
    if (!email || !password || !name || !businessName) {
      const resData = {
        status: false,
        result: null,
        message: "Please check the data",
      };
      logger.info(
        `(${req.method}) url: ${req.originalUrl}, req: ${JSON.stringify(
          req.body
        )}, status:400, res: ${JSON.stringify(resData)}`
      );
      return res.status(400).json(resData);
    }

    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%#*?&]{8,}$/;
    const isValidPassword = regex.test(password);
    if (!isValidPassword) {
      const resInvalidPassword = {
        status: false,
        result: {},
        message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      };
      logger.debug(`(${req.method}) url: ${req.originalUrl}, req: ${JSON.stringify(req.body)}, status:409, res: ${JSON.stringify(resInvalidPassword)}`);
      return res.status(409).json(resInvalidPassword);
    }

    const passwordEncrypt = await passwordHelper.encryptPassword(password);
    const generatedCode = await verifyEmailHelper.encryptEmail(email);

    const checkUser = await UserModel.findOne({
      where: { email: email },
    });

    // Check User Exist
    if (checkUser) {
      const resInvalidEmail = {
        status: false,
        result: {},
        message: "User with this email is already registered.",
      };
      logger.debug(
        `(${req.method}) url: ${req.originalUrl}, req: ${JSON.stringify(
          req.body
        )}, status:409, res: ${JSON.stringify(resInvalidEmail)}`
      );
      return res.status(409).json(resInvalidEmail);
    }

    let newUser;
    await db.sequelize.transaction(async (transaction) => {
      // Create new user
      newUser = await UserModel.create(
        {
          name: name,
          email: email,
          password: passwordEncrypt,
          verification_status: 0,
          verification_code: generatedCode,
        },
        { transaction }
      );

      // Create business account
      await BusinessAccountModel.create(
        {
          owner_id: newUser.id,
          name: businessName,
        },
        { transaction }
      );
    });

    await verifyEmailHelper.sendEmail(
      email,
      generatedCode
    )

    const resData = {
      status: true,
      result: {
        name: req.body.name,
        email: req.body.email,
        business_name: businessName,
        code: generatedCode,
      },
      message: "Successfully registered",
    };
    logger.info(
      `(${req.method}) url: ${req.originalUrl}, req: ${JSON.stringify(
        req.body
      )}, status:200, res: ${JSON.stringify(resData)}`
    );
    return res.status(200).json(resData);
  } catch (error) {
    const resData = {
      status: false,
      result: null,
      message: error.message,
    };
    logger.error(
      `(${req.method}) url: ${req.originalUrl}, req: ${JSON.stringify(
        req.body
      )}, Error: ${error}}`
    );
    return res.status(500).json(resData);
  }
};

module.exports.verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;
    const checkCode = await UserModel.findOne({
      where: { verification_code: code },
    });

    if (checkCode) {
      await db.sequelize.transaction(async (transaction) => {
        await UserModel.update(
          {
            verification_status: 1,
            verification_code: null,
          },
          { where: { verification_code: code }, transaction }
        );
      });

      const resData = {
        status: true,
        result: null,
        message: "Email successfully verified",
      };

      logger.info(
        `(${req.method}) url: ${req.originalUrl}, req: ${JSON.stringify(
          req.body
        )}, status:200, res: ${JSON.stringify(resData)}`
      );
      return res.status(200).json(resData);
    } else {
      const resData = {
        status: false,
        result: null,
        message: "Invalid verification code",
      };
      logger.error(
        `(${req.method}) url: ${req.originalUrl}, req: ${JSON.stringify(
          req.body
        )}, status:404, res: ${JSON.stringify(resData)}`
      );
      return res.status(404).json(resData);
    }
  } catch (error) {
    const resData = {
      status: false,
      result: null,
      message: error.message,
    };
    logger.error(
      `(${req.method}) url: ${req.originalUrl}, req: ${JSON.stringify(
        req.body
      )}, Error: ${error}}`
    );
    return res.status(500).json(resData);
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({
      where: {
        email,
        verification_status: 1,
      },
      include: [
        {
          model: BusinessAccountModel,
          as: 'businessAccount',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!user) {
      const resInvalid = {
        status: false,
        result: {},
        message: "User not found.",
      };

      logger.info(
        `(${req.method}) url: ${req.originalUrl}, req: ${JSON.stringify(req.body)}, status:401, res: ${JSON.stringify(resInvalid)}`
      );
      return res.status(401).json(resInvalid);
    }

    const isPasswordValid = await passwordHelper.comparePassword(password, user.password);
    if (!isPasswordValid) {
      const resInvalidPassword = {
        status: false,
        result: [],
        message: "Email / Password is wrong.",
      };

      logger.debug(
        `(${req.method}) url: ${req.originalUrl}, req: ${JSON.stringify(req.body)}, status:422, res: ${JSON.stringify(resInvalidPassword)}`
      );
      return res.status(422).json(resInvalidPassword);
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        business_id: user.businessAccount?.id || null,
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    const resData = {
      status: true,
      result: {
        id: user.id,
        name: user.name,
        email: user.email,
        business_id: user.businessAccount?.id || null,
        token,
      },
      message: "Successfully login",
    };

    logger.info(
      `(${req.method}) url: ${req.originalUrl}, req: ${JSON.stringify(req.body)}, status:200, res: ${JSON.stringify(resData)}`
    );
    return res.status(200).json(resData);
  } catch (error) {
    const resData = {
      status: false,
      result: null,
      message: error.message,
    };
    logger.error(
      `(${req.method}) url: ${req.originalUrl}, req: ${JSON.stringify(req.body)}, Error: ${error}`
    );
    return res.status(500).json(resData);
  }
};


module.exports.refreshToken = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.sendStatus(401);

    const decoded = jwt.decode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    let newToken;
    let checkUser;

    if (decoded.role_hospital_user_id) {
      checkUser = await RoleHospitalUserModel.findByPk(
        decoded.role_hospital_user_id,
        {
          include: [
            {
              association: "user",
            },
          ],
        }
      );
    } else if (decoded.role_remun_user_id) {
      checkUser = await RoleRemunUserModel.findByPk(
        decoded.role_remun_user_id,
        {
          include: [
            {
              association: "user",
            },
          ],
        }
      );
    }

    if (decoded.exp < currentTime) {
      if (decoded.role_hospital_user_id) {
        newToken = jwt.sign(
          {
            id: checkUser.user_id,
            role_hospital_user_id: decoded.role_hospital_user_id,
            access_type: decoded.access_type,
          },
          process.env.JWT_SECRET,
          { expiresIn: "12h" }
        );

        const resData = {
          status: true,
          result: {
            status: "expired",
            token: newToken,
          },
          message: "New token has been generated",
        };

        logger.info(
          `(${req.method}) url: ${req.originalUrl}, req: ${JSON.stringify(
            req.body
          )}, status:200, res: ${JSON.stringify(resData)}`
        );
        return res.status(200).json(resData);
      } else if (decoded.role_remun_user_id) {
        newToken = jwt.sign(
          {
            id: checkUser.user_id,
            role_remun_user_id: decoded.role_remun_user_id,
            access_type: decoded.access_type,
          },
          process.env.JWT_SECRET,
          { expiresIn: "12h" }
        );

        const resData = {
          status: true,
          result: {
            status: "expired",
            token: newToken,
          },
          message: "New token has been generated",
        };

        logger.info(
          `(${req.method}) url: ${req.originalUrl}, req: ${JSON.stringify(
            req.body
          )}, status:200, res: ${JSON.stringify(resData)}`
        );
        return res.status(200).json(resData);
      }
    } else {
      const resData = {
        status: true,
        result: {
          status: "active",
          token: token,
        },
        message: "Token still available",
      };

      logger.info(
        `(${req.method}) url: ${req.originalUrl}, req: ${JSON.stringify(
          req.body
        )}, status:200, res: ${JSON.stringify(resData)}`
      );
      return res.status(200).json(resData);
    }
  } catch (error) {
    const resInvalidToken = {
      status: false,
      result: [],
      message: "cannot refresh token",
    };

    logger.debug(
      `(${req.method}) url: ${req.originalUrl}, req: ${JSON.stringify(
        req.body
      )}, status:422, res: ${JSON.stringify(resInvalidToken)}`
    );
    return res.status(422).json(resInvalidToken);
  }
};

module.exports.testSendEmail = async (req, res) => {
  const { email, subject, message } = req.body;

  try {
    // Panggil fungsi sendEmail untuk mengirim email
    await sendEmail('andika.rach4@gmail.com', '1231231231231');

    return res.status(200).json({
      status: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
