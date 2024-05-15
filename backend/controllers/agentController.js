import Agent from '../models/agentSchema.js';
import agentApprovalMail from '../utils/agentApprovalMail.js';
import notifyAdminAboutAgent from '../utils/notifyAdminAboutAgent.js';
import cloudinary from 'cloudinary';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import jsonwebtoken from 'jsonwebtoken';
import crypto from 'crypto';
import getCountryIso3 from 'country-iso-2-to-3';

export const registerAgent = async (req, res) => {
  try {
    const getPass = req.body.password
    const salt = await bcrypt.genSalt(10);

    // Hash the password
    const hashedPassword = await bcrypt.hash(getPass, salt)

    const {
      username,
      email,
      phone,
      address,
      image,
      password,
      image_mimetype,
      role,
      country,
      transactions,
      status
    } = req.body;

    // Validate agent input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Agent email, password and name are required'
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

    console.error('Agent input validated', JSON.stringify(req.body, null, 2));

    // Convert email to lowercase
    const  emailToLower = email.toLowerCase();

    //  Check if agent exists
    const agentExists = await Agent.findOne({ email: emailToLower });
    if (agentExists) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'agent already exists'
      })
    }

    // Generate token
    const token = jwt.sign(
      { username, email },
      process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    // Create new agent
    const newAgent = new Agent({
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

    let savedAgent = await newAgent.save();

    // Notify admin of new agent
    await notifyAdminAboutAgent(savedAgent);

    res.status(201).json({
      success: true,
      status: 201,
      message: 'agent successfully created',
      data: savedAgent,
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

// Approve agent
export const approveAgent = async (req, res) => {
  try {
    const id = req.params.id;
    const email = req.body.email;

    const agent = await Agent.findById(id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'agent not found'
      })
    }

    // Update the approvedByAdmin field to true
    agent.approvedByAdmin = true;

    // Update the status to approved
    agent.status = 'Approved';

    const updatedAgent = await agent.save();

    // Send email to agent
    await agentApprovalMail(agent, email);

    res.status(200).json({
      success: true,
      status: 200,
      message: 'agent approved successfully',
      data: updatedAgent
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Fetch all pending agents
export const getPendingAgents = async (req, res) => {
  try {
    const agents = await Agent.find({ status: 'Pending' });

    if (!agents) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'No agents found'
      })
    }

    res.status(200).json({
      success: true,
      status: 200,
      data: agents
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Login agent
export const loginAgent = async (req, res) => {
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

    // Check if agent exists
    const agent = await Agent.findOne({ email: emailToLower }).select('+password');

    // Check if agent is null (no agent found)
    if (!agent) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'agent does not exists'
      })
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(
      password,
      agent.password
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
        username: agent.username, email: agent.email, role: agent.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN
      }
    );

    res.status(200).json({
      success: true,
      status: 200,
      message: 'agent successfully logged in',
      token: token,
      data: agent
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

    // Check if agent exists
    const agent = await Agent.findOne({ email: emailToLower });

    if (!agent) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'agent not found'
      })
    }

    // Generate reset token
    const resetToken = agent.getResetPasswordToken();

    await agent.save();

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: agent.email,
        subject: 'Password reset token',
        message
      });

      res.status(200).json({
        success: true,
        status: 200,
        message: `Email sent to: ${agent.email}`
      })
    } catch (error) {
      agent.resetPasswordToken = undefined;
      agent.resetPasswordExpire = undefined;

      await agent.save();

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

    const agent = await Agent.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!agent) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Invalid token'
      })
    }

    // Set new password
    agent.password = req.body.password;
    agent.resetPasswordToken = undefined;
    agent.resetPasswordExpire = undefined;

    await agent.save();

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

// Get the geographical locations of agents
export const getAgentGeographicalLocations = async (req, res) => {
  try {
    const agents = await Agent.find();
    console.log('Agents: ', agents);

    if (!agents) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'No agents found'
      })
    }

    const mappedLocations = agents.reduce((acc, { country }) => {
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

// Update Agent details
export const updateAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.agent.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'agent not found'
      })
    }

    agent.username = req.body.username || agent.username;
    agent.email = req.body.email || agent.email;
    agent.phone = req.body.phone || agent.phone;
    agent.address = req.body.address || agent.address;
    agent.city = req.body.city || agent.city;
    agent.state = req.body.country || agent.country;
    agent.transactions = req.body.transactions || agent.transactions

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      agent.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedagent = await agent.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: 'agent updated successfully',
      data: updatedagent
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Get agent profile
export const getAgentProfile = async (req, res) => {
  try {
    const agent = await Agent.findById(req.agent.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'agent not found'
      })
    }

    res.status(200).json({
      success: true,
      status: 200,
      data: agent
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Update agent profile image
export const updateAgentProfileImage = async (req, res) => {
  try {
    const agent = await Agent.findById(req.agent.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'agent not found'
      })
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);

      agent.image = result.secure_url;
      agent.image_mimetype = req.file.mimetype;
    }

    const updatedagent = await agent.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: 'agent image updated successfully',
      data: updatedagent
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Get all agents
export const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find();

    if (!agents) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'No agents found'
      })
    }

    res.status(200).json({
      success: true,
      status: 200,
      data: agents
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Get agent by ID
export const getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'agent not found'
      })
    }

    res.status(200).json({
      success: true,
      status: 200,
      data: agent
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Delete agent
export const deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'agent not found'
      })
    }

    await agent.remove();

    res.status(200).json({
      success: true,
      status: 200,
      message: 'agent deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Update agent role
export const updateAgentRole = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'agent not found'
      })
    }

    agent.role = req.body.role || agent.role;

    const updatedagent = await agent.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: 'agent role updated successfully',
      data: updatedagent
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}

// Delete agent profile image
export const deleteAgentProfileImage = async (req, res) => {
  try {
    const agent = await Agent.findById(req.agent.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'agent not found'
      })
    }

    agent.image = undefined;
    agent.image_mimetype = undefined;

    const updatedagent = await agent.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: 'agent image deleted successfully',
      data: updatedagent
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    })
  }
}