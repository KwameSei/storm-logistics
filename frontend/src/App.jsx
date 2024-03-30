// import { useState } from 'react'
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Footer, Header } from './components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Homepage,
  AllServicesDisplay,
  CreateShipment,
  TrackShipment,
  RegisterUser,
  RegisterSuperAdmin,
  SuperAdminDashboard,
  UpdateShipmentLocation
} from './screens';

import './App.css'

function App() {

  const currentUser = useSelector(state => state.user.currentUser);
  console.log('Current user in app: ', currentUser);

  let currentRole = null;

  if (currentUser) {
    console.log('Data found in currentUser:', currentUser.data);
    console.log('Admin found in currentUser:', currentUser.admin);
    
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
      <div>
        <Header />

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
        
        <Routes>
          {currentRole == null && (
            <>
              <Route path="/" element={<Homepage />} />
              <Route path="/all-services-display" element={<AllServicesDisplay />} />
              <Route path="/track-shipment" element={<TrackShipment />} />
              <Route path="/create-shipment" element={<CreateShipment />} />
              <Route path="/user-register" element={<RegisterUser />} />
              <Route path="/register-super-admin" element={<RegisterSuperAdmin />} />
              <Route path="/update-current-location" element={<UpdateShipmentLocation />} />
            </>
          )}

          {currentRole === 'SuperAdmin' && (
            <>
              <Route path="/superadmin-dashboard/*" element={<SuperAdminDashboard />} />
            </>
          )}

          {currentRole === 'Admin' && (
            <>
            </>
          )}

          {currentRole === 'Admin' && (
            <>
            </>
          )}
          
        </Routes>

        <Footer />
      </div>
    </>
  )
}

export default App
