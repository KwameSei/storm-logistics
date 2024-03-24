/* eslint-disable react/prop-types */
import classes from './Menu.module.scss';

const Dropdown = ({ submenus, showDropdown }) => {

  return (
    <div className={classes.dropdown_container}>
      <ul className={`dropdown ${showDropdown ? 'active' : ''}`}>
        {submenus.map((submenu, index) => (
          <li key={index} className='sub-items'>
            <a href={submenu.url}>{submenu.title}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Dropdown;