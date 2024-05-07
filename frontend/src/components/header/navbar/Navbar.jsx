import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, useTheme } from '@mui/material';
import { LocationOn, Mail, Menu, Phone, LightModeOutlined, DarkModeOutlined, Search, SettingsOutlined } from '@mui/icons-material';
import { BlackButton, RedButton } from '../../ButtonStyled';
import { ProfileModal } from '../../../screens';
import { Items, SubItems } from '../../index';
import Logo from '../../../assets/storm-logo.jpg';
import { setMode } from '../../../state-management/global';
import classes from './Navbar.module.scss';

const Navbar = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState('false');

  const currentUser = useSelector((state) => state.user.currentUser);
  const currentRole = useSelector((state) => state.user?.currentUser?.data?.role);
  const id = useSelector((state) => state.user.currentUser?.data?._id);
  console.log('User Id: ', id)
  console.log('Navbar current role', currentRole);
  console.log('Navbar current user', currentUser);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
    console.log("showMenu:", showMenu);
  };

  // Toggle the visibility of the profile modal
  const toggleProfileModal = () => {
    setShowProfileModal(!showProfileModal);
  };

  console.log("Rendering Navbar. showMenu:", showMenu);

  return (
    <div className={classes.main_menus}>
      <div className={classes.contact_info}>
        <div className={classes.contacts}>
          <span className={classes.phone}><Phone /> +233303956032</span>
          <span className={classes.mail}><Mail /> support@stormlogistics.com</span>
          <span className={classes.location}><LocationOn />Mile 7 Road, Behind Ecobank, Achimota</span>
        </div>
        
      </div>
      <nav className={`${classes.menus_container} ${showMenu ? classes.show_menu : ''}`}>
        <div className={classes.logo_container}>
          <img src={Logo} alt='Logo' className={classes.img} />
        </div>

        <ul className={classes.menus}>
          {Items.map((item, index) => (
            <li key={index} className={classes.item}>
              <SubItems items={item} />
            </li>
          ))}
        </ul>
        <div className={classes.burger_menu} onClick={toggleMenu}>
          <Menu className={classes.menu_icon} />
        </div>
      </nav>
      <div className={classes.mode}>
        <IconButton onClick={() => dispatch(setMode())} className={classes.icon}>
          {theme.palette.mode === 'dark' ? (
            <LightModeOutlined />
           ) : (
           <DarkModeOutlined />
           )}
        </IconButton>
      </div>
      <div className={classes.nav_buttons}>
        <Link to='/track-shipment'>
          <RedButton className={`${classes.button_items} ${classes.blink_animation}`}>Track your shipment</RedButton>
        </Link>
        <Link to='/user-register'>
          <BlackButton className={classes.button_items}>Portal Login</BlackButton>
        </Link>
         {/* Conditionally render profile link if currentUser exists */}
         {currentUser && currentUser.data && id ? (
          <>
          <div className={classes.profile} onClick={toggleProfileModal}>
          {/* <Link to={`${currentRole.toLowerCase()}-dashboard/get-user/${id}`} className={classes.profile}> */}
            {/* Render user image or username */}
            {currentUser.data.image ? (
              <img src={currentUser.data.image} alt='User' className={classes.user_image} />
            ) : (
              // <img src='https://www.w3schools.com/howto/img_avatar.png' alt='User' className={classes.user_image}/>
              <div className={classes.username}>
                {currentUser.data.name ? currentUser.data.name[0].toUpperCase() : currentUser.data.username[0]}
              </div>
            )}
          {/* </Link> */}
          <ProfileModal show={!showProfileModal} onHide={toggleProfileModal} profile={currentUser.data} className={classes.modal} />
          </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default Navbar;