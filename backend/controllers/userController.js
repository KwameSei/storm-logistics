import User from '../models/userSchema.js';
import cloudinary from 'cloudinary';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import jsonwebtoken from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';

export const registerUser = async (req, res) => {
  try {
    const getPass = req.body.password
    const salt = await bcrypt.genSalt(10);

    // Hash the password
    const hashedPassword = await bcrypt.hash(getPass, salt)

    const { username, email, phone, address, image, password, image_mimetype, role } = req.body;

    // Validate user input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'User email, password and name are required'
      })
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Password must be at least 6 characters long'
      })
    }

    console.error('User input validated', JSON.stringify(req.body, null, 2));

    // Convert email to lowercase
    const  emailToLower = email.toLowerCase();

    //  Check if user exists
    const userExists = await User.findOne({ email: emailToLower });
    if (userExists) {
      res.status(400).json({
        success: false,
        status: 400,
        message: 'User already exists'
      })
    }

    // Generate token
    const token = jwt.sign(
      { username, email },
      process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    // Create new user
    const newUser = new User({
      username,
      email: emailToLower,
      password: hashedPassword,
      image,
      image_mimetype,
      role,
      address,
      phone
    });

    let savedUser = await newUser.save();

    res.status(201).json({
      success: true,
      status: 201,
      message: 'User successfully created',
      data: savedUser,
      token: token
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'All fields are required'
      })
    }

    // Convert email to lower case
    const emailToLower = email.toLowerCase();

    // Check if user exists
    const user = await User.findOne({ email: emailToLower }).select('+password');

    // Check if user is null (no user found)
    if (!user) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'User does not exists'
      })
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    )

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Invalid credentials'
      })
    }

    // Generate token
    const token = jwt.sign(
      {
        username: user.username, email: user.email, role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN
      }
    );

    res.status(200).json({
      success: true,
      status: 200,
      message: 'User successfully logged in',
      token: token,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}