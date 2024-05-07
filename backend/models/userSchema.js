import mongoose from 'mongoose';
import OverallStats from './overallStats.js';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please enter your username'],
    unique: true,
    minlength: [3, 'Username should be at least 3 characters']
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
    default: 'User'
  },
  image: {
    url: String,
    public_id: String
  },
  image_mimetype: String
}, {
  timestamps: true
})

// Middleware to update overall statistics after saving a user
userSchema.post('save', async function(user) {
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
        totalUsers: 1,
        totalUsersPerYear: 1,
        totalUsersPerMonth: 1,
        totalUsersPerDay: 1,

        // Create an array of monthly users data
        monthlyUsersData: [
          {
            month: getMonthName(new Date().getMonth()),
            totalUsers: user.length,
          }
        ],

        // Create an array of daily users data
        dailyUsersData: [
          {
            day: formatDate(new Date()),
            totalUsers: user.length,
          }
        ]
      })
    } else {
      // Update the total number of users
      overallStats.totalUsers += 1

      // Update the total number of users for the current year
      overallStats.totalUsersPerYear += 1

      // Update the total number of users for the current month
      overallStats.totalUsersPerMonth += 1

      // Update the total number of users for the current day
      overallStats.totalUsersPerDay += 1

      // Check if there is a monthly users data entry for the current month
      const monthlyUsersData = overallStats.monthlyUsersData.find(data => data.month === getMonthName(new Date().getMonth()))

      // If there is no monthly users data entry for the current month, create one
      if (!monthlyUsersData) {
        overallStats.monthlyUsersData.push({
          month: getMonthName(new Date().getMonth()),
          totalUsers: 1
        })
      } else {
        // Update the total number of users for the current month
        monthlyUsersData.totalUsers += 1
      }

      // Check if there is a daily users data entry for the current day
      const dailyUsersData = overallStats.dailyUsersData.find(data => data.day === formatDate(new Date()))

      // If there is no daily users data entry for the current day, create one
      if (!dailyUsersData) {
        overallStats.dailyUsersData.push({
          day: formatDate(new Date()),
          totalUsers: 1
        })
      } else {
        // Update the total number of users for the current day
        dailyUsersData.totalUsers += 1
      }
    }

    // Save the updated overall statistics
    await overallStats.save()
  } catch (error) {
    console.error('Error saving user: ', error)
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

// Middleware to update overall statistics after deleting a user
userSchema.post('remove', async function(user) {
  try {
    // Get the current year
    const currentYear = new Date().getFullYear()

    // Find the overall statistics for the current year
    const overallStats = await OverallStats.findOne({ year: currentYear })

    // If there are overall statistics for the current year, update them
    if (overallStats) {
      // Update the total number of users
      overallStats.totalUsers -= 1

      // Update the total number of users for the current year
      overallStats.totalUsersPerYear -= 1

      // Update the total number of users for the current month
      overallStats.totalUsersPerMonth -= 1

      // Update the total number of users for the current day
      overallStats.totalUsersPerDay -= 1

      // Check if there is a monthly users data entry for the current month
      const monthlyUsersData = overallStats.monthlyUsersData.find(data => data.month === getMonthName(new Date().getMonth()))

      // If there is a monthly users data entry for the current month, update it
      if (monthlyUsersData) {
        // Update the total number of users for the current month
        monthlyUsersData.totalUsers -= 1
      }

      // Check if there is a daily users data entry for the current day
      const dailyUsersData = overallStats.dailyUsersData.find(data => data.day === formatDate(new Date()))

      // If there is a daily users data entry for the current day, update it
      if (dailyUsersData) {
        // Update the total number of users for the current day
        dailyUsersData.totalUsers -= 1
      }

      // Save the updated overall statistics
      await overallStats.save()
    }
  } catch (error) {
    console.error('Error deleting user: ', error)
    error.status(500).json({
      success: false,
      status: 500,
      message: error.message
    });
  }
})

const User = mongoose.model('User', userSchema)

export default User;