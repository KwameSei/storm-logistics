import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BlueButton, RedButton } from '../../components/ButtonStyled';
import { ButtonGroup, ClickAwayListener, Grow, IconButton, MenuItem, MenuList, Paper, Popper, SpeedDialAction } from '@mui/material';
import { ArrowDropDownRounded, ArrowDropUpOutlined, PersonAddAlt } from '@mui/icons-material';
import { setPayments, setPaymentError, setPaymentStatus } from '../../state-management/payment/paymentSlice';
import { CustomTable } from '../../components';

import classes from './payment.module.scss';

const GetAllPayments = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const payment = useSelector(state => state.payment.payment);
  const payments = useSelector(state => state.payment.payments);
  const paymentId = useSelector(state => state.payment.paymentId);
  const paymentError = useSelector(state => state.payment.paymentError);
  const paymentStatus = useSelector(state => state.payment.paymentStatus);
  const paymentStatusError = useSelector(state => state.payment.paymentStatusError);
  const paymentCallback = useSelector(state => state.payment.paymentCallback);
  const paymentCallbackError = useSelector(state => state.payment.paymentCallbackError);
  const currentUser = useSelector(state => state.user.currentUser);
  const currentRole = useSelector(state => state.user.currentUser.data.role);
  const token = useSelector(state => state.user.token);

  console.log('Payments: ', payments);
  console.log('Payment ID: ', paymentId);
  console.log('Payment Callback: ', paymentCallback);

  const URL = import.meta.env.VITE_SERVER_URL;

  // Get all payments
  const fetchAllPayments = async () => {
    try {
      const response = await axios.get(`${URL}/api/payments/get-all-payments`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('All payments: ', response.data);

      if (response.data.data) {
        toast.success(response.data.message);
        dispatch(setPayments(response.data.data));
      } else {
        toast.error('No payments found');
      }
    } catch (error) {
      console.error('Error fetching all payments: ', error);
      toast.error(error.response.data.message);
      dispatch(setPaymentError(error.response.data.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchAllPayments();
    }
  }, [currentUser]);

  const paymentColumns = [
    { id: 'transactionId', label: 'ID', minWidth: 50 },
    { id: 'reference', label: 'Reference', minWidth: 100},
    { id: 'paymentDate', label: 'Payment Date', minWidth: 100},
    { id: 'amount', label: 'Amount', minWidth: 100 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'user', label: 'User', minWidth: 100 },
  ];

  const paymentRows = payments && payments.length > 0 && payments.map((payment) => {
    return {
      id: payment._id,
      transactionId: payment.transactionId,
      reference: payment.reference,
      paymentDate: new Date(payment.paymentDate).toLocaleDateString(),
      amount: payment.amount,
      status: payment.status,
      user: payment.user,
    };
  });

  const handleAction = (action, id) => {
    console.log('Action: ', action);
    console.log('ID: ', id);

    if (action === 'view') {
      const navigationURL = `/${currentRole.toLowerCase()}-dashboard/get-single-payment/${id}`;
      console.log('Navigation URL: ', navigationURL);
      navigate(navigationURL);
    } else if (action === 'delete') {
      console.log('Delete payment with ID: ', id);
    }
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleAllPayments = () => {
    console.log('All payments selected');
    fetchAllPayments();
  }

  const handlePendingPayments = () => {
    console.log('Pending payments selected');

    const status = 'Pending';
    const data = { status };

    console.log('Data: ', data);

    dispatch(setPaymentStatus(data));
  }

  const handleApprovedPayments = () => {
    console.log('Approved payments selected');

    const status = 'Approved';
    const data = { status };

    console.log('Data: ', data);

    dispatch(setPaymentStatus(data));
  }

  const handleDeclinedPayments = () => {
    console.log('Declined payments selected');

    const status = 'Declined';
    const data = { status };

    console.log('Data: ', data);

    dispatch(setPaymentStatus(data));
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const PaymentButtonHaver = ({ row }) => {
    const options = ['All', 'Pending', 'Approved', 'Declined'];

    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleClick = () => {
      console.info(`You clicked ${options[selectedIndex]}`);

      if (selectedIndex === 0) {
        handleAllPayments();
      } else if (selectedIndex === 1) {
        handlePendingPayments();
      } else if (selectedIndex === 2) {
        handleApprovedPayments();
      } else if (selectedIndex === 3) {
        handleDeclinedPayments();
      }
    };

    return (
      <div className={classes.get_payments}>
        <ButtonGroup variant='contained' ref={anchorRef} aria-label='split button'>
          <BlueButton onClick={handleClick}>{options[selectedIndex]}</BlueButton>
          <BlueButton
            size='small'
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label='select merge strategy'
            aria-haspopup='menu'
            onClick={() => {
              setOpen((prevOpen) => !prevOpen);
            }}
          >
            {open ? <ArrowDropUpOutlined /> : <ArrowDropDownRounded />}
          </BlueButton>
        </ButtonGroup>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id='split-button-menu'>
                    {options.map((option, index) => (
                      <MenuItem
                        key={option}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
  }

  return (
    <>
      {loading && <h2>Loading...</h2>}
      {paymentError && <h2>{paymentError}</h2>}
      {paymentStatusError && <h2>{paymentStatusError}</h2>}
      {paymentCallbackError && <h2>{paymentCallbackError}</h2>}
      {paymentCallback && <h2>{paymentCallback.message}</h2>}
      {payments && payments.length > 0 && (
        <>
          <h2>All Payments</h2>
          <PaymentButtonHaver />
          <CustomTable columns={paymentColumns} rows={paymentRows} handleAction={handleAction} />
        </>
      )}

      {payments && payments.length === 0 && <h2>No payments found</h2>}

      {paymentStatus && paymentStatus.status === 'Pending' && (
        <>
          <h2>Pending Payments</h2>
          <CustomTable columns={paymentColumns} rows={paymentRows} handleAction={handleAction} />
        </>
      )}

      {paymentStatus && paymentStatus.status === 'Approved' && (
        <>
          <h2>Approved Payments</h2>
          <CustomTable columns={paymentColumns} rows={paymentRows} handleAction={handleAction} />
        </>
      )}

      {paymentStatus && paymentStatus.status === 'Declined' && (
        <>
          <h2>Declined Payments</h2>
          <CustomTable columns={paymentColumns} rows={paymentRows} handleAction={handleAction} />
        </>
      )}

      {paymentStatus && paymentStatus.status === 'Pending' && (
        <h2>No pending payments found</h2>
      )}

      {paymentStatus && paymentStatus.status === 'Approved' && (
        <h2>No approved payments found</h2>
      )}

      {paymentStatus && paymentStatus.status === 'Declined' && (
        <h2>No declined payments found</h2>
      )}
    </>
  )
};

export default GetAllPayments;