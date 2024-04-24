import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BlueButton, RedButton } from '../../../components/ButtonStyled';
import { ButtonGroup, ClickAwayListener, Grow, IconButton, MenuItem, MenuList, Paper, Popper, SpeedDialAction } from '@mui/material';
import { ArrowDropDownRounded, ArrowDropUpOutlined, PersonAddAlt } from '@mui/icons-material';
import { getUsers, getError, getFailure } from '../../../state-management/userState/userSlice';
import { CustomTable } from '../../../components/';

import classes from './displayusers.module.scss';

const GetAllUsers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const user = useSelector(state => state.user.user);
  const users = useSelector(state => state.user.users);
  const userError = useSelector(state => state.user.error);
  const currentUser = useSelector(state => state.user.currentUser);
  const currentRole = useSelector(state => state.user.currentUser.data.role);
  const token = useSelector(state => state.user.token);

  console.log('Users: ', users);

  const URL = import.meta.env.VITE_SERVER_URL;

  // Get all payments
  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(`${URL}/api/users/get-all-users`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('All users: ', response.data.data);

      const userData = response.data.data;

      if (userData) {
        toast.success(response.data.message);
        dispatch(getUsers(userData));
      } else {
        toast.error('No users found');
      }
    } catch (error) {
      console.error('Error fetching all users: ', error);
      toast.error(error.response.data.message);
      dispatch(setPaymentError(error.response.data.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchAllUsers();
    }
  }, [currentUser]);

  const userColumns = [
    { id: 'username', label: 'Username', minWidth: 50 },
    { id: 'email', label: 'Email', minWidth: 100},
    { id: 'address', label: 'Address', minWidth: 100},
    { id: 'phone', label: 'Phone', minWidth: 100 },
    { id: 'role', label: 'Role', minWidth: 100 },
    { id: 'image', label: 'Image', minWidth: 100 },
  ];

  const userRows = users && users.length > 0 && users.map((user) => {
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      address: user.address,
      phone: user.phone,
      role: user.role,
      image: user.image,
    };
  });

  const handleAction = (action, id) => {
    console.log('Action: ', action);
    console.log('ID: ', id);

    if (action === 'view') {
      const navigationURL = `/${currentRole.toLowerCase()}-dashboard/get-single-user/${id}`;
      console.log('Navigation URL: ', navigationURL);
      navigate(navigationURL);
    } else if (action === 'delete') {
      console.log('Delete User with ID: ', id);
    }
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleAUsers = () => {
    console.log('All users selected');
    fetchAllUsers();
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const UserButtonHaver = ({ row }) => {
    // const options = ['All', 'Pending', 'Approved', 'Declined'];]
    const options = ['All']

    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleClick = () => {
      console.info(`You clicked ${options[selectedIndex]}`);

      if (selectedIndex === 0) {
        handleAUsers();
      // } else if (selectedIndex === 1) {
      //   handlePendingPayments();
      // } else if (selectedIndex === 2) {
      //   handleApprovedPayments();
      // } else if (selectedIndex === 3) {
      //   handleDeclinedPayments();
      }
    };

    return (
      <div className={classes.get_users}>
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
      {userError && <h2>{userError}</h2>}
      {users && users.length > 0 && (
        <>
          <h2>All Users</h2>
          <UserButtonHaver />
          <CustomTable columns={userColumns} rows={userRows} handleAction={handleAction} />
        </>
      )}

      {users && users.length === 0 && <h2>No payments found</h2>}
    </>
  )
};

export default GetAllUsers;