import React, { useState } from 'react'
import { FaEye, FaEyeSlash, FaUser } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import { googleloginAPI, loginAPI, registerAPI } from '../services/allAPI';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

function Auth({ insideRegister }) {

  // useEffect(() => {
  // if (sessionStorage.getItem("user")) {
  //   navigate("/seatbook");
  // }
  // }, [navigate]);


  const navigate = useNavigate()
  const [viewPassword, setViewPassword] = useState(false)
  const [userDetails, setUserDetails] = useState({
    username: "", email: "", password: ""
  })
  // console.log(userDetails);
  
  const handleRegister=async(e)=>{
    e.preventDefault()
    const {username,email,password}=userDetails
    if (email && password && username) {
      // toast.success("api call")
      try {
        const result=await registerAPI(userDetails)
        console.log(result);
        if (result.status==200) {
          toast.success("Register Successfully.. Please Login")
          setUserDetails({username: "", email: "", password: ""})
          navigate('/login')
        }
        else if (result.status==409){
          toast.warning(result.response.data)
           setUserDetails({username: "", email: "", password: ""})
          navigate('/login')
        }else{
          console.log(result);
          toast.error("Something went wrong")
          setUserDetails({username: "", email: "", password: ""})
        }
      } catch (err) {
        console.log(err);
        
      }
    }else{
      toast.info("please fill form completely")
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = userDetails;
    if (email && password) {
      try {
        const result = await loginAPI(userDetails);
        if (result.status == 200) {
          toast.success("Login Successful");
          sessionStorage.setItem("token", result.data.token);
          sessionStorage.setItem("user", JSON.stringify(result.data.user));

          // CHECK FOR REDIRECT MEMORY
          const redirectURL = sessionStorage.getItem("redirectURL");

          setTimeout(() => {
            if (result.data.user.role === "admin") {
              navigate('/admindashboard');
            } else if (result.data.user.role === "coordinator") {
              navigate('/coordinatordashboard');
            } else if (redirectURL) {
              // If there's a saved booking URL, go there!
              sessionStorage.removeItem("redirectURL");
              navigate(redirectURL);
            } else {
              navigate('/');
            }
          }, 2000);

        } else if (result.status == 401 || result.status == 404) {
          toast.warning(result.response.data);
          setUserDetails({ ...userDetails, password: "" });
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      toast.info("Please fill form completely");
    }
  };
 
  const handleGoogleLogin = async (credentialResponse) => {
    const decode = jwtDecode(credentialResponse.credential);
    const result = await googleloginAPI({ 
      username: decode.name, 
      email: decode.email, 
      password: 'googlePassword', 
      picture: decode.picture 
    });

    if (result.status == 200) {
      toast.success("Login Successful");
      sessionStorage.setItem("token", result.data.token);
      sessionStorage.setItem("user", JSON.stringify(result.data.user));

      // CHECK FOR REDIRECT MEMORY
      const redirectURL = sessionStorage.getItem("redirectURL");

      setTimeout(() => {
        if (result.data.user.role == "admin") {
          navigate('/admindashboard');
        } else if (redirectURL) {
          sessionStorage.removeItem("redirectURL");
          navigate(redirectURL);
        } else {
          // If the user came from nowhere, go to the generic seat page or home
          navigate('/seatbook'); 
        }
      }, 2000);

    } else {
      toast.error("Something went Wrong");
    }
  };
  return (
    <div className='w-full min-h-screen flex justify-center items-center flex-col bg-[#0b0e14] relative overflow-hidden font-sans'>
      
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_#4f46e5_0%,_transparent_70%)] opacity-20 pointer-events-none"></div>

      <div className="z-10 w-full flex flex-col items-center">
        <h1 className='text-4xl font-black text-white text-center tracking-[0.3em] mb-8 uppercase'>
          Auditorium
        </h1>

        {/* Glassmorphism Card */}
        <div 
          style={{ width: '420px' }} 
          className="bg-white/5 backdrop-blur-xl border border-white/10 text-white p-8 rounded-[2rem] shadow-2xl flex flex-col justify-center items-center"
        >
          <div 
            style={{ width: '80px', height: '80px', borderRadius: '50%' }} 
            className="bg-indigo-600/20 border border-indigo-500/30 mb-6 flex justify-center items-center shadow-lg shadow-indigo-500/10"
          >
            <FaUser className='text-2xl text-indigo-400' />
          </div>

          <h2 className='text-2xl font-bold tracking-tight mb-2'>
            {insideRegister ? "Create Account" : "Welcome Back"}
          </h2>
          <p className='text-slate-400 text-sm mb-8 text-center'>
            {insideRegister ? "Join us for exclusive event access" : "Sign in to manage your bookings"}
          </p>

          <form className='w-full'>
            {/* username */}
            {insideRegister &&
              <input 
                value={userDetails.username} 
                onChange={(e) => setUserDetails({ ...userDetails, username: e.target.value })} 
                type="text" 
                placeholder='Username' 
                className='bg-white/5 border border-white/10 text-white placeholder-gray-500 w-full p-3 rounded-xl mb-4 focus:border-indigo-500 focus:outline-none transition-all' 
              />
            }

            {/* email */}
            <input 
              value={userDetails.email} 
              onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })} 
              type="text" 
              placeholder='Email Address' 
              className='bg-white/5 border border-white/10 text-white placeholder-gray-500 w-full p-3 rounded-xl mb-4 focus:border-indigo-500 focus:outline-none transition-all' 
            />

            {/* password */}
            <div className='relative w-full mb-4'>
              <input 
                value={userDetails.password} 
                onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })} 
                type={viewPassword ? "text" : "password"} 
                placeholder='Password' 
                className='bg-white/5 border border-white/10 text-white placeholder-gray-500 w-full p-3 rounded-xl focus:border-indigo-500 focus:outline-none transition-all' 
              />
              <div 
                className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-white transition-colors'
                onClick={() => setViewPassword(!viewPassword)}
              >
                {viewPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            {/* forgot password */}
            {!insideRegister &&
              <div className='flex justify-between items-center mb-6 px-1'>
                <p className='text-[10px] text-slate-500 uppercase font-bold tracking-wider'>Keep it secret</p>
                <button type='button' className='text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors'>Forgot Password?</button>
              </div>
            }

            {/* login/register btn */}
            <div className='text-center mt-4'>
              {insideRegister ?
                <button onClick={handleRegister} type='button' className='bg-indigo-600 hover:bg-indigo-500 text-white font-bold p-3 w-full rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95'>Register</button>
                :
                <button onClick={handleLogin}  type='button' className='bg-indigo-600 hover:bg-indigo-500 text-white font-bold p-3 w-full rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95'>Login</button>
              }
            </div>

            {/* google authentication */}
            <div className="text-center my-6">
              {!insideRegister && (
                <>
                  <p className='text-slate-600 text-xs mb-6 uppercase tracking-widest font-bold'>Or continue with</p>
                  <div className='flex justify-center items-center w-full transform hover:scale-[1.02] transition-transform'>
                    <GoogleLogin
                      onSuccess={credentialResponse => handleGoogleLogin(credentialResponse)}
                      onError={() => console.log('Login Failed')}
                      theme="filled_black"
                      shape="pill"
                    />
                  </div>
                </>
              )}
            </div>

            <div className='mt-8 text-center'>
              {insideRegister ?
                <p className='text-slate-400 text-sm'>Already a user? <Link to={'/login'} className='text-indigo-400 font-bold ms-2 hover:underline'>Login</Link></p>
                :
                <p className='text-slate-400 text-sm'>New here? <Link to={'/register'} className='text-indigo-400 font-bold ms-2 hover:underline'>Create Account</Link></p>
              }
            </div>
          </form>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={2000} theme="colored" />
    </div>
  )
}

export default Auth