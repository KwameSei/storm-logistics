import classes from './Header.module.scss';
import { Navbar } from '../index';

const Header = () => {

  return (
    <div>
      <header className={classes.header}>
        <div className={classes.nav_container}>
          <Navbar />
        </div>
      </header>
    </div>
  )
}

export default Header;