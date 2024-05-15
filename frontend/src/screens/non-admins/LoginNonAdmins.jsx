import React from 'react';
import { RegisterUser, RegisterAgent } from '../../screens'

import classes from './non-admins.module.scss';

const LoginNonAdmins = () => {
  return (
    <div className={classes.non_admins_main}>
      <div className={classes.non_admins_container}>
        <div className={classes.left}>
          <h1 className={classes.heading}>Register or Login as a user</h1>
          <RegisterUser className={classes.components} />
        </div>
        <div className={classes.right}>
          <h1 className={classes.heading}>Register or Login as an agent</h1>
          <RegisterAgent className={classes.components} />
        </div>
      </div>
    </div>
  )
}

export default LoginNonAdmins;