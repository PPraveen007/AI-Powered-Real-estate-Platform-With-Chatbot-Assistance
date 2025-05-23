import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;  //extracting user data
    const hashedPassword = bcryptjs.hashSync(password, 10); //salt no.
    const newUser = new User({ username, email, password: hashedPassword });
    try {
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password, captchaToken } = req.body;

  if (!captchaToken) {
    return res.status(400).json({ message: "Missing CAPTCHA token" });
  }

  try {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;

    const response = await fetch(verifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secret}&response=${captchaToken}`,
    });

    const data = await response.json();

    if (!data.success) {
      return res.status(400).json({ message: "reCAPTCHA verification failed" });
    }

    const validUser = await User.findOne({ email }); //checking email
    if (!validUser) return next(errorHandler(404, "User not found!"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));

    //creating token (authentication)
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET); //id, secret key
    const { password: pass, ...rest } = validUser._doc; //we don't to see password so destructuring it
    res
      .cookie("access_token", token, { httpOnly: true }) //save token as a cookie
      .status(200)
      .json(rest); // return all things except password
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ token, user }); 
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


export const adminLogin = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Check if credentials match admin credentials
    if (username !== 'admin' || password !== 'admin') {
      return next(errorHandler(401, "Invalid admin credentials"));
    }

    // Create admin token with role included in payload
    const token = jwt.sign(
      { 
        id: 'admin',
        role: 'admin' 
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ 
        message: "Admin login successful",
        token: token 
      });
      
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      //sign in the user
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest); //send back the user data
      // console.log('Google Sign-In Route Hit');
      // console.log(req.body);
    } else {
      //create the new user
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8); //16 char password
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10); //salt no.
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest); //send back the user data
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out");
  } catch (error) {
    next(error);
  }
};