// import { useState } from 'react'
import { useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Footer, Header } from './components';
import { ToastContainer } from 'react-toastify';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import 'react-toastify/dist/ReactToastify.css';

import {
  AdminDashboard,
  AgentDashboard,
  AgentCreationSuccess,
  LoginAdmin,
  LoginNonAdmins,
  CheckOut,
  GetAQuote,
  PaymentCallback,
  Homepage,
  AllServicesDisplay,
  CreateShipment,
  TrackShipment,
  ShipmentCreationSuccess,
  RegisterUser,
  RegisterSuperAdmin,
  SuperAdminDashboard,
  UserDashboard,
  UpdateShipmentLocation,
  Four04
} from './screens';
// import { theme } from './theme';

import './App.css'

function App() {

  const currentUser = useSelector(state => state.user.currentUser);
  const mode = useSelector(state => state.global.mode);
  // const theme = useMemo(() => createTheme(theme(mode)), [mode])
  console.log('Current user in app: ', currentUser);

  // let currentRole = null;

  // if (currentUser) {
  //   console.log('Data found in currentUser:', currentUser.data);
  //   if (currentUser.data && currentUser.data.role === 'SuperAdmin') {
  //     currentRole = 'SuperAdmin';
  //   } 
  //   else if (currentUser.data && currentUser.data.role === 'User') {
  //     currentRole = 'User';
  //   }
  //   else if (currentUser.data && currentUser.data.role === 'Agent') {
  //     currentRole = 'Agent';
  //   }
  //   else {
  //     currentRole = 'Admin';
  //   }
  // }

  // console.log('Current role in app: ', currentRole);

  // useEffect(() => {
  //   if (currentRole) {
  //     localStorage.setItem('currentRole', currentRole)
  //   }
  // }, [currentRole])

  useEffect(() => {
    if (currentUser && currentUser.data && currentUser.data.role) {
      localStorage.setItem('currentRole', currentUser.data.role);
    }
  }, [currentUser]);

  return (
    <>
      <div className='app'>
      <ToastContainer
          position='top-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss={true}
          draggable={true}
          pauseOnHover={true}
          theme='colored'
        />

        {/* <ThemeProvider theme={theme}>
          <CssBaseline /> */}

          <Header />
        
        <Routes>
          {currentUser?.data?.role === 'SuperAdmin' && (
            <>
              <Route path="/superadmin-dashboard/*" element={<SuperAdminDashboard />} />
              <Route path="/" element={<Homepage />} />
              <Route path="/home" element={<Homepage />} />
              <Route path='/*' element={<Four04 />} />
            </>
          )}

          {currentUser?.data?.role === 'User' && (
            <>
              <Route path="/user-dashboard/*" element={<UserDashboard />} />
              <Route path="/" element={<Homepage />} />
              <Route path="/home" element={<Homepage />} />
              <Route path='/*' element={<Four04 />} />
            </>
          )}

          {currentUser?.data?.role === 'Admin' && (
            <>
              <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
              <Route path="/" element={<Homepage />} />
              <Route path="/home" element={<Homepage />} />
              <Route path='/*' element={<Four04 />} />
            </>
          )}

          {currentUser?.data?.role === 'Agent' && (
            <>
              <Route path="/agent-dashboard/*" element={<AgentDashboard />} />
              <Route path="/" element={<Homepage />} />
              <Route path="/home" element={<Homepage />} />
              <Route path='/*' element={<Four04 />} />
            </>
          )}
          
          <Route path="/" element={<Homepage />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/all-services-display" element={<AllServicesDisplay />} />
          <Route path="/track-shipment" element={<TrackShipment />} />
          <Route path="/create-shipment" element={<CreateShipment />} />
          <Route path="/agent-creation-success" element={<AgentCreationSuccess />} />
          <Route path="/shipment-creation-success" element={<ShipmentCreationSuccess />} />
          <Route path="/user-register" element={<RegisterUser />} />
          <Route path="/login-admin" element={<LoginAdmin />} />
          <Route path="/login-users" element={<LoginNonAdmins />} />
          <Route path="/register-super-admin" element={<RegisterSuperAdmin />} />
          <Route path="/update-current-location" element={<UpdateShipmentLocation />} />
          <Route path="/checkout/:shipmentId" element={<CheckOut />} />
          <Route path="/payment-callback" element={<PaymentCallback />} />
          <Route path="/get-a-quote" element={<GetAQuote />} />
          <Route path="/*" element={<Four04 />} />
        </Routes>

        <Footer />
        {/* </ThemeProvider> */}
      </div>
    </>
  )
}

export default App;
