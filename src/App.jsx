import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './user/Home'
import Auth from './pages/Auth'

import AdminDashboard from './admin/AdminDashboard'
// import BugDetails from './user/BugDetails'
// import ReportBug from './user/ReportBug'

import Seat from './user/Seat'
import BookingAndPayment from './user/BookingAndPayment'
import UserProfile from './user/UserProfile'
import Pnf from './pages/Pnf'
import Review from './user/Review'
import CoordinatorDashboard from './user/CoordinatorDashboard'
import Events from './pages/Events'


function App() {
  

  return (
    <>
     <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Auth/>}/>
      <Route path='/register' element={<Auth insideRegister={true}/>}/>
      <Route path='/userprofile' element={<UserProfile/>}/>

      {/* <Route path='/seatbook' element={<Seat />} /> */}
      <Route path='/bookingandpay' element={<BookingAndPayment/>}/>
      <Route path='/book-seats/:id' element={<Seat />} />
      <Route path='/review' element={<Review/>}/>

      <Route path='/coordinatordashboard' element={<CoordinatorDashboard />} />
       <Route path='/events' element={<Events/>}/>
     
      <Route path='/admindashboard' element={<AdminDashboard/>}/>
      <Route path='/pnf' element={<Pnf/>}/>
     </Routes>
    </>
  )
}

export default App
