import { useState } from 'react';
import { Items, SubItems } from '../../index';
import Logo from '../../../assets/storm-logo.jpg';
import { LocationOn, Mail, Menu, Phone } from '@mui/icons-material';

import classes from './Navbar.module.scss';
import { BlackButton, RedButton } from '../../ButtonStyled';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
    console.log("showMenu:", showMenu);
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
      <div className={classes.nav_buttons}>
        <Link to='/track-shipment'>
          <RedButton className={`${classes.button_items} ${classes.blink_animation}`}>Track your shipment</RedButton>
        </Link>
        <Link to='/user-register'>
          <BlackButton className={classes.button_items}>Portal Login</BlackButton>
        </Link>
      </div>
    </div>
  )
}

export default Navbar;