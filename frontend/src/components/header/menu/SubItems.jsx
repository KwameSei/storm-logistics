/* eslint-disable react/prop-types */
import { useState } from "react";
import { Dropdown } from '../../index';
import { Link } from 'react-router-dom';

import classes from './Menu.module.scss';

const SubItems = ({ items }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className={classes.sub_container}>
      <div className={classes.sub_items}>
        {items.submenu ? (
          <>
            <button
              type="button"
              className={classes.buttons}
              aria-haspopup="menu"
              aria-expanded={showDropdown ? "true" : "false"}
              onClick={handleDropdownToggle}
            >
              {items.title}
            </button>
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