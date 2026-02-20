import React from 'react'
import { Link } from 'react-router-dom'
import { FaBackward } from 'react-icons/fa'

function PaymentFailed() {
  return (
    
    <>
    
    <div className='min-h-screen flex justify-center items-center md:px-20 px-5'>
        <div className='md:grid grid-cols-2 gap-10 items-center'>
            <div>
                <h1 className='md:text-4xl text-red-600'>Sorry!!! Payment Failed</h1>
                <h1 className='my-10 md:text-xl'>We apologize for the inconvience caused and appreciate your visit to BookStore</h1>
                <Link to={'/books'} className='flex items-center bg-red-600 p-2 w-60 text-white'><FaBackward className='me-2'/>Explore More Books!!!</Link>
            </div>
            <div>
                <img src="https://i0.wp.com/nrifuture.com/wp-content/uploads/2022/05/comp_3.gif?fit=800%2C600&ssl=1" alt="payment failed" />
            </div>
        </div>

    </div>
    
    </>
  )
}

export default PaymentFailed