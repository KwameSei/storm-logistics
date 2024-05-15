import mongoose from 'mongoose';
import OverallStats from './overallStats.js';

const agentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please enter your agentname'],
    unique: true,
    minlength: [3, 'agentname should be at least 3 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email address'],
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters']
  },
  address: {
    type: String
  },
  phone: {
    type: String,
    // required: [true, 'Please enter your phone number'],
    unique: true,
  },
  country: {
    country: { type: String },
    state: { type: String },
  },
  // phoneOtp: String,
  // country: {
  //   country: { type: String },
  //   state: { type: String },
  // },
  transactions: {
    type: String
  },
  role: {
    type: String,
    default: 'agent'
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Approved', 'In Transit', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  approvedByAdmin: { 
    type: Boolean, 
    default: false 
  },
  image: {
    url: String,
    public_id: String
  },
  image_mimetype: String,
}, {
  timestamps: true
})

// Middleware to update overall statistics after saving a agent
agentSchema.post('save', async function(agent) {
  try {
    // Get the current year
    const currentYear = new Date().getFullYear()

    // Find the overall statistics for the current year
    const overallStats = await OverallStats.findOne({ year: currentYear })

    // If there are no overall statistics for the current year, create them
    if (!overallStats) {
      // Create the document if it doesn't exist
      overallStats = new OverallStats({
        year: currentYear,
        totalAgents: 1,
        totalAgentsPerYear: 1,
        totalAgentsPerMonth: 1,
        totalAgentsPerDay: 1,

        // Create an array of monthly agents data
        monthlyAgentsData: [
          {
            month: getMonthName(new Date().getMonth()),
            totalAgents: agent.length,
          }
        ],

        // Create an array of daily agents data
        dailyAgentsData: [
          {
            day: formatDate(new Date()),
            totalAgents: agent.length,
          }
        ]
      })
    } else {
      // Update the total number of agents
      overallStats.totalAgents += 1

      // Update the total number of agents for the current year
      overallStats.totalAgentsPerYear += 1

      // Update the total number of agents for the current month
      overallStats.totalAgentsPerMonth += 1

      // Update the total number of agents for the current day
      overallStats.totalAgentsPerDay += 1

      // Check if there is a monthly agents data entry for the current month
      const monthlyAgentsData = overallStats.monthlyAgentsData.find(data => data.month === getMonthName(new Date().getMonth()))

      // If there is no monthly agents data entry for the current month, create one
      if (!monthlyAgentsData) {
        overallStats.monthlyAgentsData.push({
          month: getMonthName(new Date().getMonth()),
          totalAgents: 1
        })
      } else {
        // Update the total number of agents for the current month
        monthlyAgentsData.totalAgents += 1
      }

      // Check if there is a daily agents data entry for the current day
      const dailyAgentsData = overallStats.dailyAgentsData.find(data => data.day === formatDate(new Date()))

      // If there is no daily agents data entry for the current day, create one
      if (!dailyAgentsData) {
        overallStats.dailyAgentsData.push({
          day: formatDate(new Date()),
          totalAgents: 1
        })
      } else {
        // Update the total number of agents for the current day
        dailyAgentsData.totalAgents += 1
      }
    }

    // Save the updated overall statistics
    await overallStats.save()
  } catch (error) {
    console.error('Error saving agent: ', error)
    error.status(500).json({
      success: false,
      status: 500,
      message: error.message
    });
  }
})

// Function to get the name of a month
function getMonthName(month) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return months[month]
}

// Function to format a date
function formatDate(date) {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

// Middleware to update overall statistics after deleting a agent
agentSchema.post('remove', async function(agent) {
  try {
    // Get the current year
    const currentYear = new Date().getFullYear()

    // Find the overall statistics for the current year
    const overallStats = await OverallStats.findOne({ year: currentYear })

    // If there are overall statistics for the current year, update them
    if (overallStats) {
      // Update the total number of agents
      overallStats.totalAgents -= 1

      // Update the total number of agents for the current year
      overallStats.totalAgentsPerYear -= 1

      // Update the total number of agents for the current month
      overallStats.totalAgentsPerMonth -= 1

      // Update the total number of agents for the current day
      overallStats.totalAgentsPerDay -= 1

      // Check if there is a monthly agents data entry for the current month
      const monthlyAgentsData = overallStats.monthlyAgentsData.find(data => data.month === getMonthName(new Date().getMonth()))

      // If there is a monthly agents data entry for the current month, update it
      if (monthlyAgentsData) {
        // Update the total number of agents for the current month
        monthlyAgentsData.totalAgents -= 1
      }

      // Check if there is a daily agents data entry for the current day
      const dailyAgentsData = overallStats.dailyAgentsData.find(data => data.day === formatDate(new Date()))

      // If there is a daily agents data entry for the current day, update it
      if (dailyAgentsData) {
        // Update the total number of agents for the current day
        dailyAgentsData.totalAgents -= 1
      }

      // Save the updated overall statistics
      await overallStats.save()
    }
  } catch (error) {
    console.error('Error deleting agent: ', error)
    error.status(500).json({
      success: false,
      status: 500,
      message: error.message
    });
  }
})

const Agent = mongoose.model('Agent', agentSchema)

export default Agent;