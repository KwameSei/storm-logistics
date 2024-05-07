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

  let currentRole = null;

  if (currentUser) {
    console.log('Data found in currentUser:', currentUser.data);
    
    // Check if the user is a Super Admin
    if (currentUser.data && currentUser.data.role === 'SuperAdmin') {
      currentRole = 'SuperAdmin';
    } 
    // Check if the user is an admin (if admin property exists)
    else if (currentUser.data && currentUser.data.role === 'User') {
      currentRole = 'User';
    } 
    // If the user is neither Super Admin nor admin, consider them a regular user
    else {
      currentRole = 'Admin';
    }
  }

  console.log('Current role in app: ', currentRole);

  useEffect(() => {
    if (currentRole) {
      localStorage.setItem('currentRole', currentRole)
    }
  }, [currentRole])

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
          {currentRole === null && (
            <>
              <Route path="/" element={<Homepage />} />
              <Route path="/home" element={<Homepage />} />
              <Route path="/all-services-display" element={<AllServicesDisplay />} />
              <Route path="/track-shipment" element={<TrackShipment />} />
              <Route path="/create-shipment" element={<CreateShipment />} />
              <Route path="/shipment-creation-success" element={<ShipmentCreationSuccess />} />;
              <Route path="/user-register" element={<RegisterUser />} />
              <Route path="/register-super-admin" element={<RegisterSuperAdmin />} />
              <Route path="/update-current-location" element={<UpdateShipmentLocation />} />
              {/* <Route path="/checkout" element={<CheckOut />} /> */}
              <Route path="/checkout/:shipmentId" element={<CheckOut />} />
              <Route path="/payment-callback" element={<PaymentCallback />} />
              <Route path="/get-a-quote" element={<GetAQuote />} />
              <Route path='/*' element={<Four04 />} />
            </>
          )}

          {currentRole === 'SuperAdmin' && (
            <>
              <Route path="/superadmin-dashboard/*" element={<SuperAdminDashboard />} />
              <Route path="/" element={<Homepage />} />
              <Route path="/home" element={<Homepage />} />
              <Route path='/*' element={<Four04 />} />
            </>
          )}

          {currentRole === 'User' && (
            <>
              <Route path="/user-dashboard/*" element={<UserDashboard />} />
              <Route path="/" element={<Homepage />} />
              <Route path="/home" element={<Homepage />} />
              <Route path='/*' element={<Four04 />} />
            </>
          )}

          {currentRole === 'Admin' && (
            <>
            </>
          )}
          
        </Routes>

        <Footer />
        {/* </ThemeProvider> */}
      </div>
    </>
  )
}

export default App
