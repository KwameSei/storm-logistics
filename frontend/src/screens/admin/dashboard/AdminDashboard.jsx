import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { DashboardAdmin } from '../../../screens';
import { Sidebar } from '../../../components';

import classes from './admindashboard.module.scss';

const AdminDashboard = () => {

  return (
    <div className={classes.container} style={{ display: 'flex' }}>
      <Sidebar />
      <div className={classes.content} style={{ flex: 1 }}>
        <Routes>
          <Route path="/dashboard" element={<DashboardAdmin />} />
        </Routes>
      </div>
    </div>
  )
}

export default AdminDashboard;