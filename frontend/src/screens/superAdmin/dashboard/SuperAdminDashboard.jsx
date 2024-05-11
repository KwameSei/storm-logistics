import { Route, Routes } from 'react-router-dom';
import {
  ApprovePendingShipments,
  CreateShipment,
  CreateIcums,
  DailyShipment,
  Dashboard,
  GetAllPayments,
  GetSinglePayment,
  GetAllUsers,
  GetAllShipments,
  GetSingleUser,
  UserGeography,
  PaymentSuccess,
  PieChartShipment,
  RegisterSuperAdmin, 
  RegisterUser,
  RegisterAdmin,
  ShipmentCreationSuccess, 
  TrackShipment,
  UpdateShipmentLocation,
  UserProfile,
  Waybill
} from '../../../screens';

import { Sidebar } from '../../../components';
import { useSelector } from 'react-redux';

const SuperAdminDashboard = () => {
  const currentUser = useSelector(state => state.currentUser);
  
  return (
    <div style={{ display: 'flex' }}> {/* Use flexbox to layout components */}
      <Sidebar />
      <div style={{ flex: 1 }}> {/* Allow the main content to take remaining space */}
        <Routes>
          <Route path="/approve-pending-shipments" element={<ApprovePendingShipments />} />
          <Route path="/create-shipment" element={<CreateShipment />} />
          <Route path="/create-icums" element={<CreateIcums />} />
          <Route path="/track-shipment" element={<TrackShipment />} />
          <Route path="/get-all-shipments" element={<GetAllShipments />} />
          <Route path="/update-shipment-location" element={<UpdateShipmentLocation />} />
          <Route path="/shipment-creation-success" element={<ShipmentCreationSuccess />} />
          <Route path="/waybill/:id" element={<Waybill />} />
          <Route path="/register-user" element={<RegisterUser />} />
          <Route path="/get-all-users" element={<GetAllUsers />} />
          <Route path="/get-user/:id" element={<UserProfile />} />
          <Route path="/user-geography" element={<UserGeography />} />
          <Route path="/get-single-user/:userId" element={<GetSingleUser />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register-super-admin" element={<RegisterSuperAdmin />} />
          <Route path="/register-admin" element={<RegisterAdmin />} />
          <Route path="/payment-success/:shipmentId" element={<PaymentSuccess />} />
          <Route path="/get-all-payments" element={<GetAllPayments />} />
          <Route path="/get-single-payment/:paymentId" element={<GetSinglePayment />} />
          <Route path="/daily-shipment-chart" element={<DailyShipment />} />
          <Route path="/pie-chart-shipment" element={<PieChartShipment />} />
          {/* Add your other routes here */}
        </Routes>
      </div>
    </div>
  )
}

export default SuperAdminDashboard;
