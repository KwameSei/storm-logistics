import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AdminPanelSettingsOutlined, Apps, ArrowDownward, ArrowDropDown, BarChart, Chat, Folder, LocalShipping, Logout, Menu, Numbers, Payment, People, Search, Settings, ShoppingBag } from '@mui/icons-material';
import { Input, Typography } from '@mui/material';
import Logo from '../../assets/storm-logo.jpg';
import { authLogout } from '../../state-management/userState/userSlice';
import classes from './sidebar.module.scss';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [active, setActive] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const currentUser = useSelector(state => state.user.currentUser);
  const currentRole = useSelector(state => state.user.currentUser.data.role);

  // State for managing dropdown menus
  const [showDropdown, setShowDropdown] = useState(false);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [shipmentDropdown, setShipmentDropdown] = useState(false);
  const [paymentDropdown, setPaymentDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [adminDropdown, setAdminDropdown] = useState(false);
  const [icumsDropdown, setIcumsDropdown] = useState(false);
  const [analyticsDropdown, setAnalyticsDropdown] = useState(false);

  useEffect(() => {
    setActive(pathname.substring(1)); // Remove the first character from the pathname
  }, [pathname]);

  // Logout user
  const handleLogout = () => {
    dispatch(authLogout())
    navigate('/');
  }

  // Role-based permissions definition
  const rolePermissions = {
    SuperAdmin: [
      'SuperAdmin', 'Users', 'Admin', 'create-admin', 'create-shipment',
      'track-shipment', 'approve-shipments', 'get-all-shipments', 'daily-shipment-chart', 'users', 'messages',
      'shipment-piechart', 'analytics', 'users-geography', 'file-manager', 'orders', 'settings', 'get-all-payments',
      'create-hs-codes'
    ],
    Admin: ['Users', 'Admin'],
    User: ['create-shipment', 'track-shipment']
  };

  // Function to check if the user's role has permission for a specific menu item
  const hasPermission = (permission) => {
    if (currentUser.data && currentRole) {
      return rolePermissions[currentRole]?.includes(permission);
    }
    return false;
  }

  return (
    <div className={`${classes.sidebar} ${collapsed ? classes.collapsed : ''}`}>
      <div className={classes.logo_content}>
        <div className={classes.logo}>
          <img src={Logo} alt='storm logistics logo' />
          <div className={classes.logo_name}>Storm Logistics</div>
        </div>
      </div>
      <Menu className={classes.menu_icon}
        onClick={() => setCollapsed(!collapsed)}
      />
      <div className={classes.nav_list}>
        <div className={classes.nav_item}>
          <Search className={classes.icon} />
          <Input type='text' placeholder='Search...' className={classes.search} />
          <span className={classes.tool_tip}>Search</span>
        </div>
        <div className={classes.nav_item}>
          <Link to={`/${currentRole.toLowerCase()}-dashboard/dashboard`} className={classes.link}>
            <AdminPanelSettingsOutlined className={classes.icon} />
            <span className={classes.dashboard}>Dashboard</span>
          </Link>
          <span className={classes.tool_tip}>Dashboard</span>
        </div>

        {/* Add a dropdown menu for shipment */}
        <div className={classes.nav_item}>
          <div className={classes.link} onClick={() => setShipmentDropdown(!shipmentDropdown)}>
            <LocalShipping className={classes.icon} />
            <span className={classes.dashboard}>Shipment</span>
            <ArrowDropDown className={`${classes.dropdown_icon} ${shipmentDropdown ? classes.rotate : ''}`} />
          </div>
          {shipmentDropdown && (
            <div className={classes.dropdown}>
              {hasPermission('create-shipment') && (
                <Link to={`/${currentRole.toLowerCase()}-dashboard/create-shipment`} className={classes.link}>
                  <span className={classes.dashboard}>Create Shipment</span>
                </Link>
              )}
              {hasPermission('get-all-shipments') && (
                <Link to={`/${currentRole.toLowerCase()}-dashboard/get-all-shipments`} className={classes.link}>
                  <span className={classes.dashboard}>Get All Shipments</span>
                </Link>
              )}
              {hasPermission('track-shipment') && (
                <Link to={`/${currentRole.toLowerCase()}-dashboard/track-shipment`} className={classes.link}>
                  <span className={classes.dashboard}>Track Shipment</span>
                </Link>
              )}
              {hasPermission('approve-shipments') && (
                <Link to={`/${currentRole.toLowerCase()}-dashboard/approve-pending-shipments`} className={classes.link}>
                  <span className={classes.dashboard}>Approve Shipments</span>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Add a dropdown menu for users */}
        {hasPermission('Users') && (
          <div className={classes.nav_item}>
            <div className={classes.link} onClick={() => setUserDropdown(!userDropdown)}>
              <People className={classes.icon} />
              <span className={classes.dashboard}>User Management</span>
              <ArrowDropDown className={`${classes.dropdown_icon} ${userDropdown ? classes.rotate : ''}`} />
            </div>
            {userDropdown && (
              <div className={classes.dropdown}>
                <Link to='/super-admin' className={classes.link}>
                  <span className={classes.dashboard}>Super Admin</span>
                </Link>
                <div className={classes.link} onClick={() => setAdminDropdown(!adminDropdown)}>
                  <span className={classes.dashboard}>Admins</span>
                  <ArrowDropDown className={`${classes.dropdown_icon} ${adminDropdown ? classes.rotate : ''}`} />
                </div>
                {adminDropdown && (
                  <div className={classes.dropdown}>
                    {hasPermission('create-admin') && (
                      <Link to={`/${currentRole.toLowerCase()}-dashboard/register-admin`} className={classes.link}>
                        <span className={classes.dashboard}>Create Admin</span>
                      </Link>
                    )}
                  </div>
                )}
                <div className={classes.link} onClick={() => setShowDropdown(!showDropdown)}>
                  {/* <People className={classes.icon} /> */}
                  <span className={classes.dashboard}>Users</span>
                  <ArrowDropDown className={`${classes.dropdown_icon} ${showDropdown ? classes.rotate : ''}`} />
                </div>
                {showDropdown && (
                  <div className={classes.dropdown}>
                    <Link to={`/${currentRole.toLowerCase()}-dashboard/get-all-users`} className={classes.link}>
                      <span className={classes.dashboard}>Get All Users</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Add a dropdown menu for payments */}
        <div className={classes.nav_item}>
          <div className={classes.link} onClick={() => setPaymentDropdown(!paymentDropdown)}>
            <Payment className={classes.icon} />
            <span className={classes.dashboard}>Payments</span>
            <ArrowDropDown className={`${classes.dropdown_icon} ${paymentDropdown ? classes.rotate : ''}`} />
          </div>
          {paymentDropdown && (
            <div className={classes.dropdown}>
              {hasPermission('get-all-payments') && (
                <Link to={`/${currentRole.toLowerCase()}-dashboard/get-all-payments`} className={classes.link}>
                  <span className={classes.dashboard}>Get All Payments</span>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Add a dropdown menu for ICUMS HS CODES*/}
        <div className={classes.nav_item}>
          <div className={classes.link} onClick={() => setIcumsDropdown(!icumsDropdown)}>
            <Numbers className={classes.icon} />
            <span className={classes.dashboard}>ICUMS</span>
            <ArrowDropDown className={`${classes.dropdown_icon} ${icumsDropdown ? classes.rotate : ''}`} />
          </div>
          {icumsDropdown && (
            <div className={classes.dropdown}>
              {hasPermission('create-hs-codes') && (
                <Link to={`/${currentRole.toLowerCase()}-dashboard/create-icums`} className={classes.link}>
                  <span className={classes.dashboard}>Create HS Codes</span>
                </Link>
              )}
            </div>
          )}
        </div>

        <div className={classes.nav_item}>
          <Link to='/' className={classes.link}>
            <Chat className={classes.icon} />
            <span className={classes.dashboard}>Messages</span>
          </Link>
          <span className={classes.tool_tip}>Messages</span>
        </div>
        <div className={classes.nav_item}>
          <div className={classes.link} onClick={() => setAnalyticsDropdown(!analyticsDropdown)}>
            <BarChart className={classes.icon} />
            <span className={classes.dashboard}>Analytics</span>
            <ArrowDropDown className={`${classes.dropdown_icon} ${analyticsDropdown ? classes.rotate : ''}`} />
          <span className={classes.tool_tip}>Analytics</span>
          </div>
          {analyticsDropdown && (
            <div className={classes.dropdown}>
              {hasPermission('users-geography') && (
                <Link to={`/${currentRole.toLowerCase()}-dashboard/user-geography`} className={classes.link}>
                  <span className={classes.dashboard}>Users Geography</span>
                </Link>
              )}
              {hasPermission('daily-shipment-chart') && (
                <Link to={`/${currentRole.toLowerCase()}-dashboard/daily-shipment-chart`} className={classes.link}>
                  <span className={classes.dashboard}>Daily Shipment Chart</span>
                </Link>
              )}
              {hasPermission('shipment-piechart') && (
                <Link to={`/${currentRole.toLowerCase()}-dashboard/pie-chart-shipment`} className={classes.link}>
                  <span className={classes.dashboard}>Pie Chart</span>
                </Link>
              )}
              <Link to='/' className={classes.link}>
                <span className={classes.dashboard}>Reports</span>
              </Link>
              <Link to='/' className={classes.link}>
                <span className={classes.dashboard}>Charts</span>
              </Link>
            </div>
          )}
        </div>
        <div className={classes.nav_item}>
          <Link to='/' className={classes.link}>
            <Folder className={classes.icon} />
            <span className={classes.dashboard}>File Manager</span>
          </Link>
          <span className={classes.tool_tip}>File Manager</span>
        </div>
        <div className={classes.nav_item}>
          <Link to='/' className={classes.link}>
            <ShoppingBag className={classes.icon} />
            <span className={classes.dashboard}>Orders</span>
          </Link>
          <span className={classes.tool_tip}>Orders</span>
        </div>
        <div className={classes.nav_item}>
          <Link to='/' className={classes.link}>
            <Settings className={classes.icon} />
            <span className={classes.dashboard}>Settings</span>
          </Link>
          <span className={classes.tool_tip}>Settings</span>
        </div>
      </div>
      <div className={classes.profile_content}>
        <div className={classes.profile}>
          <div className={classes.profile_details}>
            <Typography variant='h6'>{currentUser.data.name}</Typography>
            <Typography variant='caption'>{currentUser.data.role}</Typography>
          </div>
          {/* Logout user */}
          <Logout className={classes.logout} onClick={handleLogout} />
        </div>
      </div>
    </div>
  )
}

export default Sidebar;