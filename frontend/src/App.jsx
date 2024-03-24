// import { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import { Footer, Header } from './components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Homepage, AllServicesDisplay, TrackShipment, RegisterUser } from './screens';

import './App.css'
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

function App() {

  const currentUser = useSelector(state => state.user.currentUser);

  let currentRole = null;

  if (currentUser) {
    if (currentUser.user) {
      currentRole = currentUser.user.role;
    } else if (currentUser.admin) {
      currentRole = currentUser.admin.role;
    }
  }

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
              <Route path="/user-register" element={<RegisterUser />} />
            </>
          )}

          {currentRole == 'Admin' && (
            <>
            </>
          )}

          {currentRole == 'Admin' && (
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
