/* eslint-disable react/prop-types */
import { useState } from "react";
import { Dropdown } from '../../index';
import { Link } from 'react-router-dom';

import classes from './Menu.module.scss';
import { ArrowDropDown } from "@mui/icons-material";

const SubItems = ({ items }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDropdownToggle = () => {
    setShowDropdown(prevState => !prevState);
    console.log('showDropdown clicked:', showDropdown);
  };

  // Menu dropdown when mouse hovers over menu item
  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

  return (
    <div className={classes.sub_container}>
      <div className={classes.sub_items}>
        {items.submenu ? (
          <>
            {/* <button
              type="button"
              className={classes.buttons}
              aria-haspopup="menu"
              aria-expanded={showDropdown ? "true" : "false"}
              onClick={handleDropdownToggle}
            >
              {items.title}
            </button> */}
            <div
              className={classes.title_dropdown}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <h3 onClick={handleDropdownToggle} className={classes.title}>{items.title}</h3>
              <ArrowDropDown className={`${classes.arrow_icon} ${showDropdown ? classes.rotate : ''}`} onClick={handleDropdownToggle} />
            </div>
            <Dropdown submenus={items.submenu} showDropdown={showDropdown} />
          </>
        ) : (
          // Use link for navigation if there's a URL
          items.url ? (
            <Link to={items.url} className={classes.sub_items_btn}>
              {items.title}
            </Link>
          ) : (
            <span className={classes.sub_items_btn}>
              {items.title}
            </span>
          )
        )}
      </div>
    </div>
  )
}

export default SubItems;