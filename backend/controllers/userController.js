import User from '../models/userSchema.js';
import cloudinary from 'cloudinary';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import jsonwebtoken from 'jsonwebtoken';
import crypto from 'crypto';
import getCountryIso3 from 'country-iso-2-to-3';
import dotenv from 'dotenv';

export const registerUser = async (req, res) => {
  try {
    const getPass = req.body.password
    const salt = await bcrypt.genSalt(10);

    // Hash the password
    const hashedPassword = await bcrypt.hash(getPass, salt)

    const { username, email, phone, address, image, password, image_mimetype, role, country, transactions } = req.body;

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
      return res.status(400).json({
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
      phone,
      country,
      transactions
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

// Forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Please provide an email'
      })
    }

    // Convert email to lower case
    const emailToLower = email.toLowerCase();

    // Check if user exists
    const user = await User.findOne({ email: emailToLower });

    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'User not found'
      })
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();

    await user.save();

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message
      });

      res.status(200).json({
        success: true,
        status: 200,
        message: `Email sent to: ${user.email}`
      })
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return res.status(500).json({
        success: false,
        status: 500,
        message: 'Email could not be sent'
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Reset password
export const resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Invalid token'
      })
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      status: 201,
      message: 'Password reset successful'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Get the geographical locations of users
export const getUserGeographicalLocations = async (req, res) => {
  try {
    const users = await User.find();
    console.log('Users: ', users);

    if (!users) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'No users found'
      })
    }

    const mappedLocations = users.reduce((acc, { country }) => {
      const countryISO3 = getCountryIso3(country.country);
      if (!acc[countryISO3]) {
        acc[countryISO3] = 0;
      }
      acc[countryISO3]++;
      return acc;
    }, {});

    const locations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count }
      }
    );

    res.status(200).json({
      success: true,
      status: 200,
      data: locations
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Update user details
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'User not found'
      })
    }

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    user.city = req.body.city || user.city;
    user.state = req.body.country || user.country;
    user.transactions = req.body.transactions || user.transactions

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: 'User updated successfully',
      data: updatedUser
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'User not found'
      })
    }

    res.status(200).json({
      success: true,
      status: 200,
      data: user
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Update user profile image
export const updateUserProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'User not found'
      })
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);

      user.image = result.secure_url;
      user.image_mimetype = req.file.mimetype;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: 'User image updated successfully',
      data: updatedUser
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (!users) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'No users found'
      })
    }

    res.status(200).json({
      success: true,
      status: 200,
      data: users
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'User not found'
      })
    }

    res.status(200).json({
      success: true,
      status: 200,
      data: user
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'User not found'
      })
    }

    await user.remove();

    res.status(200).json({
      success: true,
      status: 200,
      message: 'User deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'User not found'
      })
    }

    user.role = req.body.role || user.role;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: 'User role updated successfully',
      data: updatedUser
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Delete user profile image
export const deleteUserProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'User not found'
      })
    }

    user.image = undefined;
    user.image_mimetype = undefined;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: 'User image deleted successfully',
      data: updatedUser
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}