import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import CountUp from 'react-countup';
import { Container, Grid, Typography, Box, Paper, FormControl, MenuItem, InputLabel, Select } from '@mui/material';
import { setPayments } from '../../../state-management/payment/paymentSlice';
import { getShipments } from '../../../state-management/shipmentState/shipmentSlice';
import { getUsers } from '../../../state-management/userState/userSlice';
import BankNotes from '../../../assets/images/bank-notes.png';
import { OverviewChart } from '../../../components';
import UsersIcon from '../../../assets/images/users-icon.png';
import SuperAdmin from '../../../assets/images/super-admin-icon.png';
import ApprovedShipment from '../../../assets/images/approved-shipment-icon.png';
import PendingPayment from '../../../assets/images/pending-payment-icon.png';
import PaymentSuccess from '../../../assets/images/payment-success-icon.png';
import PendingShipment from '../../../assets/images/pending-shipment-icon.png';
import ShipIcon from '../../../assets/images/ship-icon.png';
import MoneyBag from '../../../assets/images/money-bag-icon.png';
// import useStyles from './dashboard.styles';

import classes from './dashboard.module.scss';

const Dashboard = () => {
  // const classes = useStyles();
  const dispatch = useDispatch();
  const [view, setView] = useState('shipments');
  const payments = useSelector((state) => state.payment.payments);
  const shipments = useSelector((state) => state.shipment.shipments);
  console.log('Shipments: ', shipments);
  const users = useSelector((state) => state.user.users);
  const token = useSelector((state) => state.user.token);
  const currentUser = useSelector((state) => state.user.currentUser);
  const username = currentUser?.data?.name;
  const URL = import.meta.env.VITE_SERVER_URL;

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`${URL}/api/payments/get-all-payments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const paymentData = response.data;
      if (paymentData) {
        dispatch(setPayments(paymentData));
      }
    } catch (error) {
      console.error('Error fetching payments: ', error);
      toast.error(error.message);
    }
  };

  // const fetchShipments = async () => {
  //   try {
  //     const response = await axios.get(`${URL}/api/shipment/get-all-shipments`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     const shipmentData = response.data.data;
  //     if (shipmentData) {
  //       dispatch(getShipments(shipmentData));
  //     }
  //   } catch (error) {
  //     console.error('Error fetching shipments: ', error);
  //     toast.error(error.message);
  //   }
  // };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(`${URL}/api/users/get-all-users`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const userData = response.data.data;
      if (userData) {
        dispatch(getUsers(userData));
      }
    } catch (error) {
      console.error('Error fetching users: ', error);
      toast.error(error.message);
    }
  };

  const fetchAllSuperAdmins = async () => {
    try {
      const response = await axios.get(`${URL}/api/superadmin/get-all-superadmins`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      });

      const superAdminData = response.data.data;

      if (superAdminData) {
        dispatch(getUsers(superAdminData));
      }
    } catch (error) {
      console.error('Error fetching super admins: ', error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (currentUser) {
      fetchPayments();
      // fetchShipments();
      fetchAllUsers();
      fetchAllSuperAdmins();
    }
  }, [currentUser]);

  const paymentData = payments.data || [];
  const shipmentData = shipments?.data || [];
  const totalAmount = Array.isArray(paymentData) ? paymentData.reduce((acc, payment) => acc + payment.amount, 0) : 0;
  const paymentCount = paymentData.length;
  const pendingPayments = paymentData.filter((payment) => payment.status === 'pending').length;
  const successfulPayments = paymentData.filter((payment) => payment.status === 'success').length;
  const shipmentCount = shipmentData.length;
  const approvedShipments = shipmentData.filter((shipment) => shipment.approvedByAdmin === true).length;
  const pendingShipments = shipmentData.filter((shipment) => shipment.approvedByAdmin === false).length;
  console.log('pendingShipments: ', pendingShipments);
  const userCount = users.length;
  const superAdminCount = users.filter((user) => user.role === 'SuperAdmin').length;

  return (
    <div className={classes.dashboard}>
      <Container className={classes.container}>
        <FormControl className={classes.formControl}>
          <InputLabel id="view">View</InputLabel>
          <Select
            labelId="view"
            id="view"
            value={view}
            label="View"
            onChange={(e) => setView(e.target.value)}
          >
            <MenuItem value="shipments">Shipments</MenuItem>
            <MenuItem value="payments">Payments</MenuItem>
            <MenuItem value="users">Users</MenuItem>
          </Select>
        </FormControl>
        {view === 'shipments' && <OverviewChart isDashboard view={view} shipments={shipments} />}
        {view === 'payments' && <OverviewChart isDashboard view={view} payments={payments} />}
        {view === 'users' && <OverviewChart isDashboard view={view} users={users} />}
        <Box sx={{ flexGrow: 1 }} className={classes.main_box}>
          <Typography variant="h3" className={classes.username}>Welcome to your Dashboard, <span>{username}</span></Typography>
        <Grid container spacing={3} className={classes.main_grid}>
          <Grid item xs={12} sm={6} md={4} className={classes.sub_grid}>
            <Paper elevation={3} className={classes.paper}>
              <Box className={classes.sub_box}>
                <img src={ApprovedShipment} alt="Approved Shipment" className={classes.icon} />
                <Typography variant="h6" className={classes.title}>Approved Shipments</Typography>
                <Typography variant="h4" className={classes.amount}>
                  <CountUp start={0} end={approvedShipments} duration={2.75} separator="," />
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4} className={classes.sub_grid}>
            <Paper elevation={3} className={classes.paper}>
              <Box className={classes.sub_box}>
                <img src={PendingShipment} alt="Pending Shipment" className={classes.icon} />
                <Typography variant="h6" className={classes.title}>Pending Shipment Approval</Typography>
                <Typography variant="h4" className={classes.amount}>
                  <CountUp start={0} end={pendingShipments} duration={2.75} separator="," />
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4} className={classes.sub_grid}>
            <Paper elevation={3} className={classes.paper}>
              <Box className={classes.sub_box}>
                <img src={ShipIcon} alt="Ship Icon" className={classes.icon} />
                <Typography variant="h6" className={classes.title}>Total Shipments</Typography>
                <Typography variant="h4" className={classes.amount}>
                  <CountUp start={0} end={shipmentCount} duration={2.75} separator="," />
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4} className={classes.sub_grid}>
            <Paper elevation={3} className={classes.paper}>
              <Box className={classes.sub_box}>
                <img src={BankNotes} alt="Bank Notes" className={classes.icon} />
                <Typography variant="h6" className={classes.title}>Total Amount</Typography>
                <Typography variant="h4" className={classes.amount}>
                  <CountUp start={0} end={totalAmount} duration={2.75} separator="," />
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4} className={classes.sub_grid}>
            <Paper elevation={3} className={classes.paper}>
              <Box className={classes.sub_box}>
                <img src={MoneyBag} alt="Money Bag" className={classes.icon} />
                <Typography variant="h6" className={classes.title}>Total Payments</Typography>
                <Typography variant="h4" className={classes.amount}>
                  <CountUp start={0} end={paymentCount} duration={2.75} separator="," />
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4} className={classes.sub_grid}>
            <Paper elevation={3} className={classes.paper}>
              <Box className={classes.sub_box}>
                <img src={PendingPayment} alt="Pending Payment" className={classes.icon} />
                <Typography variant="h6" className={classes.title}>Pending Payments</Typography>
                <Typography variant="h4" className={classes.amount}>
                  <CountUp start={0} end={pendingPayments} duration={2.75} separator="," />
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4} className={classes.sub_grid}>
            <Paper elevation={3} className={classes.paper}>
              <Box className={classes.sub_box}>
                <img src={PaymentSuccess} alt="Payment Success" className={classes.icon} />
                <Typography variant="h6" className={classes.title}>Successful Payments</Typography>
                <Typography variant="h4" className={classes.amount}>
                  <CountUp start={0} end={successfulPayments} duration={2.75} separator="," />
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4} className={classes.sub_grid}>
            <Paper elevation={3} className={classes.paper}>
              <Box className={classes.sub_box}>
                <img src={UsersIcon} alt="Users Icon" className={classes.icon} />
                <Typography variant="h6" className={classes.title}>Total Users</Typography>
                <Typography variant="h4" className={classes.amount}>
                  <CountUp start={0} end={userCount} duration={2.75} separator="," />
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4} className={classes.sub_grid}>
            <Paper elevation={3} className={classes.paper}>
              <Box className={classes.sub_box}>
                <img src={SuperAdmin} alt="Super Admin" className={classes.icon} />
                <Typography variant="h6" className={classes.title}>Total Super Admins</Typography>
                <Typography variant="h4" className={classes.amount}>
                  <CountUp start={0} end={superAdminCount} duration={2.75} separator="," />
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default Dashboard;
