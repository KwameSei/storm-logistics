import Admin from '../models/adminSchema.js';
import cloudinary from 'cloudinary';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import jsonwebtoken from 'jsonwebtoken';
import crypto from 'crypto';
import getCountryIso3 from 'country-iso-2-to-3';

export const registerAdmin = async (req, res) => {
  try {
    const getPass = req.body.password
    const salt = await bcrypt.genSalt(10);

    // Hash the password
    const hashedPassword = await bcrypt.hash(getPass, salt)

    const { username, email, phone, address, image, password, image_mimetype, role, country, transactions } = req.body;

    // Validate admin input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Admin email, password and name are required'
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

    //  Check if admin exists
    const adminExists = await Admin.findOne({ email: emailToLower });
    if (adminExists) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'admin already exists'
      })
    }

    // Generate token
    const token = jwt.sign(
      { username, email },
      process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    // Create new admin
    const newAdmin = new Admin({
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

    let savedAdmin = await newAdmin.save();

    res.status(201).json({
      success: true,
      status: 201,
      message: 'admin successfully created',
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

// Login admin
export const loginAdmin = async (req, res) => {
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

    // Check if admin exists
    const admin = await Admin.findOne({ email: emailToLower }).select('+password');

    // Check if admin is null (no admin found)
    if (!admin) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'admin does not exists'
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
        username: admin.username, email: admin.email, role: admin.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN
      }
    );

    res.status(200).json({
      success: true,
      status: 200,
      message: 'admin successfully logged in',
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

    // Check if admin exists
    const admin = await Admin.findOne({ email: emailToLower });

    if (!admin) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'admin not found'
      })
    }

    // Generate reset token
    const resetToken = admin.getResetPasswordToken();

    await admin.save();

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: admin.email,
        subject: 'Password reset token',
        message
      });

      res.status(200).json({
        success: true,
        status: 200,
        message: `Email sent to: ${admin.email}`
      })
    } catch (error) {
      admin.resetPasswordToken = undefined;
      admin.resetPasswordExpire = undefined;

      await admin.save();

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

    const admin = await Admin.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!admin) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Invalid token'
      })
    }

    // Set new password
    admin.password = req.body.password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;

    await admin.save();

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

// Get the geographical locations of admins
export const getAdminGeographicalLocations = async (req, res) => {
  try {
    const admins = await Admin.find();
    console.log('Admins: ', admins);

    if (!admins) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'No admins found'
      })
    }

    const mappedLocations = admins.reduce((acc, { country }) => {
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

// Update Admin details
export const updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'admin not found'
      })
    }

    admin.username = req.body.username || admin.username;
    admin.email = req.body.email || admin.email;
    admin.phone = req.body.phone || admin.phone;
    admin.address = req.body.address || admin.address;
    admin.city = req.body.city || admin.city;
    admin.state = req.body.country || admin.country;
    admin.transactions = req.body.transactions || admin.transactions

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedadmin = await admin.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: 'admin updated successfully',
      data: updatedadmin
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Get admin profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'admin not found'
      })
    }

    res.status(200).json({
      success: true,
      status: 200,
      data: admin
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Update admin profile image
export const updateAdminProfileImage = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'admin not found'
      })
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);

      admin.image = result.secure_url;
      admin.image_mimetype = req.file.mimetype;
    }

    const updatedadmin = await admin.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: 'admin image updated successfully',
      data: updatedadmin
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Get all admins
export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();

    if (!admins) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'No admins found'
      })
    }

    res.status(200).json({
      success: true,
      status: 200,
      data: admins
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Get admin by ID
export const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'admin not found'
      })
    }

    res.status(200).json({
      success: true,
      status: 200,
      data: admin
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Delete admin
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'admin not found'
      })
    }

    await admin.remove();

    res.status(200).json({
      success: true,
      status: 200,
      message: 'admin deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Update admin role
export const updateAdminRole = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'admin not found'
      })
    }

    admin.role = req.body.role || admin.role;

    const updatedadmin = await admin.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: 'admin role updated successfully',
      data: updatedadmin
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Delete admin profile image
export const deleteAdminProfileImage = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'admin not found'
      })
    }

    admin.image = undefined;
    admin.image_mimetype = undefined;

    const updatedadmin = await admin.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: 'admin image deleted successfully',
      data: updatedadmin
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}