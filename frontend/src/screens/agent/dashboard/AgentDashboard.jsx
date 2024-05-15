import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Sidebar } from '../../../components';
import { AgentCreationSuccess } from '../../../screens';

import classes from './dashboard.module.scss';

const AgentDashboard = () => {

  return (
    <div className={classes.container} style={{ display: 'flex' }}>
      <Sidebar />
      <div className={classes.content} style={{ flex: 1 }}>
        <Routes>
          <Route path="/agent-creation-success" element={<AgentCreationSuccess />} />
        </Routes>
      </div>
    </div>
  )
}

export default AgentDashboard;