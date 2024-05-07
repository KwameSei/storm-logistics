import SuperAdmin from "../models/superadminSchema.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Super Admin Registration
export const registerSuperAdmin = async (req, res) => {
  try {
    const getPass = req.body.password
    const salt = await bcrypt.genSalt(10);

    // Hash the password
    const hashedPassword = await bcrypt.hash(getPass, salt)

    const { name, email, phone, image, password, image_mimetype, role, city, state, country, transactions } = req.body;

    // Validate admin input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Super admin email, password and name are required'
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

    console.error('Admin input validated', JSON.stringify(req.body, null, 2));

    // Convert email to lowercase
    const  emailToLower = email.toLowerCase();

    //  Check if user exists
    const adminExists = await SuperAdmin.findOne({ email: emailToLower });
    if (adminExists) {
      res.status(400).json({
        success: false,
        status: 400,
        message: 'Super admin already exists'
      })
    }

    // Generate token
    const token = jwt.sign(
      { name, email, role },
      process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    // Create new user
    const newAdmin = new SuperAdmin({
      name,
      email: emailToLower,
      password: hashedPassword,
      image,
      image_mimetype,
      role,
      phone,
      city,
      state,
      country,
      transactions
    });

    let savedAdmin = await newAdmin.save();

    res.status(201).json({
      success: true,
      status: 201,
      message: 'Super admin successfully created',
      data: savedAdmin,
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

// Login super admin
export const loginSuperAdmin = async (req, res) => {
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
    const admin = await SuperAdmin.findOne({ email: emailToLower }).select('+password');

    // Check if user is null (no user found)
    if (!admin) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Super admin does not exists'
      })
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(
      password,
      admin.password
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
        name: admin.name, email: admin.email, role: admin.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN
      }
    );

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Super Admin successfully logged in',
      token: token,
      data: admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Get all super admins
export const getAllSuperAdmins = async (req, res) => {
  try {
    const superAdmins = await SuperAdmin.find();

    if (!superAdmins) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'No super admin found'
      })
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: 'All super admins',
      data: superAdmins
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Get single super admin
export const getSingleSuperAdmin = async (req, res) => {
  try {
    const superAdmin = await SuperAdmin.findById(req.params.id);

    if (!superAdmin) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'Super admin not found'
      })
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Super admin found',
      data: superAdmin
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}