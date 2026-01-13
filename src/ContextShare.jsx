import React, { createContext, useState } from 'react'

export const bookingContext=createContext()

function ContextShare({children}) {

    const [bookingDetails,setBookingDetails]=useState({
        selectedSeats:[],
        userEmail:""
    })

  return (
    <>
    <bookingContext.Provider value={{bookingDetails,setBookingDetails}}>
        {children}
    </bookingContext.Provider>
    </>
  )
}

export default ContextShare