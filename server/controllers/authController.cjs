const User = require("../models/User.cjs");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

// GENERATE JWT

const generateToken = (id) => {

  return jwt.sign(

    { id },

    process.env.JWT_SECRET,

    {

      expiresIn: "30d",

    }

  );

};

// REGISTER USER

const registerUser = async (

  req,
  res

) => {

  try {

    const {

      name,
      email,
      password,
      phone,

    } = req.body;

    // CHECK USER EXISTS

    const userExists = await User.findOne({

      email,

    });

    if (userExists) {

      return res.status(400).json({

        message: "User already exists",

      });

    }

    // HASH PASSWORD

    const salt = await bcrypt.genSalt(10);

    const hashedPassword =

      await bcrypt.hash(

        password,

        salt

      );

    // CREATE USER

    const user = await User.create({

      name,
      email,
      password: hashedPassword,
      phone,

    });

    // RESPONSE

    res.status(201).json({

      _id: user._id,

      name: user.name,

      email: user.email,

      phone: user.phone,

      token: generateToken(user._id),

    });

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

// LOGIN USER

const loginUser = async (

  req,
  res

) => {

  try {

    const {

      email,
      password,

    } = req.body;

    // FIND USER

    const user = await User.findOne({

      email,

    });

    // CHECK PASSWORD

    if (

      user &&

      (await bcrypt.compare(

        password,

        user.password

      ))

    ) {

      res.status(200).json({

        _id: user._id,

        name: user.name,

        email: user.email,

        phone: user.phone,

        token: generateToken(user._id),

      });

    } else {

      res.status(401).json({

        message: "Invalid email or password",

      });

    }

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

module.exports = {

  registerUser,

  loginUser,

};