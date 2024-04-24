import { Route, Routes } from 'react-router-dom';

import {
  CreateShipment,
  DashboardUser, 
  TrackShipment 
} from '../../../screens';
import { Sidebar } from '../../../components';

const UserDashboard = () => {

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/dashboard" element={<DashboardUser />} />
          <Route path="/create-shipment" element={<CreateShipment />} />
          <Route path="/track-shipment" element={<TrackShipment />} />
        </Routes>
      </div>
    </div>
  )
}

export default UserDashboard;