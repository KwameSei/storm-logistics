/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import classes from './Menu.module.scss';

const Dropdown = ({ submenus, showDropdown }) => {

  return (
    <div className={classes.dropdown_container}>
      <ul className={`${classes.dropdown} ${showDropdown ? classes.active : ''}`}>
        {submenus.map((submenu, index) => (
          <li key={index} className={classes.sub_items}>
            <Link to={submenu.url} className={classes.link}>{submenu.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Dropdown;