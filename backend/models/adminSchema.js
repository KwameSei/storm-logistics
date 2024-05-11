import mongoose from 'mongoose';
import OverallStats from './overallStats.js';

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please enter your adminname'],
    unique: true,
    minlength: [3, 'adminname should be at least 3 characters']
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
  },
  country: {
    country: { type: String },
    state: { type: String },
  },
  transactions: {
    type: String
  },
  role: {
    type: String,
    default: 'admin'
  },
  image: {
    url: String,
    public_id: String
  },
  image_mimetype: String
}, {
  timestamps: true
})

// Middleware to update overall statistics after saving a admin
adminSchema.post('save', async function(admin) {
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
        totalAdmins: 1,
        totalAdminsPerYear: 1,
        totalAdminsPerMonth: 1,
        totalAdminsPerDay: 1,

        // Create an array of monthly admins data
        monthlyAdminsData: [
          {
            month: getMonthName(new Date().getMonth()),
            totalAdmins: admin.length,
          }
        ],

        // Create an array of daily admins data
        dailyAdminsData: [
          {
            day: formatDate(new Date()),
            totalAdmins: admin.length,
          }
        ]
      })
    } else {
      // Update the total number of admins
      overallStats.totalAdmins += 1

      // Update the total number of admins for the current year
      overallStats.totalAdminsPerYear += 1

      // Update the total number of admins for the current month
      overallStats.totalAdminsPerMonth += 1

      // Update the total number of admins for the current day
      overallStats.totalAdminsPerDay += 1

      // Check if there is a monthly admins data entry for the current month
      const monthlyAdminsData = overallStats.monthlyAdminsData.find(data => data.month === getMonthName(new Date().getMonth()))

      // If there is no monthly admins data entry for the current month, create one
      if (!monthlyAdminsData) {
        overallStats.monthlyAdminsData.push({
          month: getMonthName(new Date().getMonth()),
          totalAdmins: 1
        })
      } else {
        // Update the total number of admins for the current month
        monthlyAdminsData.totalAdmins += 1
      }

      // Check if there is a daily admins data entry for the current day
      const dailyAdminsData = overallStats.dailyAdminsData.find(data => data.day === formatDate(new Date()))

      // If there is no daily admins data entry for the current day, create one
      if (!dailyAdminsData) {
        overallStats.dailyAdminsData.push({
          day: formatDate(new Date()),
          totalAdmins: 1
        })
      } else {
        // Update the total number of admins for the current day
        dailyAdminssData.totalAdmins += 1
      }
    }

    // Save the updated overall statistics
    await overallStats.save()
  } catch (error) {
    console.error('Error saving admin: ', error)
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

// Middleware to update overall statistics after deleting a admin
adminSchema.post('remove', async function(admin) {
  try {
    // Get the current year
    const currentYear = new Date().getFullYear()

    // Find the overall statistics for the current year
    const overallStats = await OverallStats.findOne({ year: currentYear })

    // If there are overall statistics for the current year, update them
    if (overallStats) {
      // Update the total number of admins
      overallStats.totalAdmins -= 1

      // Update the total number of admins for the current year
      overallStats.totalAdminsPerYear -= 1

      // Update the total number of admins for the current month
      overallStats.totalAdminsPerMonth -= 1

      // Update the total number of admins for the current day
      overallStats.totalAdminsPerDay -= 1

      // Check if there is a monthly admins data entry for the current month
      const monthlyAdminsData = overallStats.monthlyAdminsData.find(data => data.month === getMonthName(new Date().getMonth()))

      // If there is a monthly admins data entry for the current month, update it
      if (monthlyAdminsData) {
        // Update the total number of admins for the current month
        monthlyAdminsData.totalAdmins -= 1
      }

      // Check if there is a daily admins data entry for the current day
      const dailyAdminsData = overallStats.dailyAdminsData.find(data => data.day === formatDate(new Date()))

      // If there is a daily admins data entry for the current day, update it
      if (dailyAdminsData) {
        // Update the total number of admins for the current day
        dailyAdminsData.totalAdmins -= 1
      }

      // Save the updated overall statistics
      await overallStats.save()
    }
  } catch (error) {
    console.error('Error deleting admin: ', error)
    error.status(500).json({
      success: false,
      status: 500,
      message: error.message
    });
  }
})

const Admin = mongoose.model('Admin', adminSchema)

export default Admin;