import React, { useState } from 'react';
import '../stylings/styles.css'; // Import your SCSS file
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import { useNavigate } from 'react-router-dom';
import Loader from './loader';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';


const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const code = generateRandomString(13);
   const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'username':
        setUsername(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'phoneNumber':
        setPhoneNumber(value);
        break;
      default:
        break;
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  gsap.registerPlugin(useGSAP); // register the hook to avoid React version discrepancies 

  const container = useRef();

  useGSAP(() => {
    gsap.fromTo(
      ".imgWrapper",
      { 
        y: 350,  
        x:0,       // Start off-screen (bottom)
        opacity: 0,     // Start fully hidden
        rotate: -270     // Start rotated -90 degrees
      },
      { 
        y: 0, 
        x:0,          // Move to normal position
        opacity: 0.5,     // Fade in
        rotate: 0,      // Rotate to 0 degrees (normal)
        duration: 1.5,  // Animation duration
        delay: 1,       // Delay before animation starts
        ease: "power2.out"
      }
    );
    gsap.fromTo(
      ".signup-container .inner",
      { 
        // y: 350,         // Start off-screen (bottom)
        opacity: 0,     // Start fully hidden
        // rotate: 270     // Start rotated -90 degrees
      },
      { 
        y: 0,           // Move to normal position
        opacity: 1,     // Fade in
        // rotate: 0,      // Rotate to 0 degrees (normal)
        duration: 1.5,  // Animation duration
        delay: 1,       // Delay before animation starts
        ease: "power2.out"
      }
    );
  }, { scope: container });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = { username, email, password, phoneNumber, code };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const res = await response.json();

      if (res.status === 'success' ) {
        setLoading(false);
        toast.success('Signup success!', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
        });

        setTimeout(() => {
          navigate('/verification');
        }, 1000);
      } 
      else if (res.message === 'Admin already exists' ) {
        setLoading(false);
        toast.success('Admin already exist...proceeding to login!', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
        });

        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } 
      else {
        setLoading(false);
        toast.error(res.message || 'Signup failed. Please try again.', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
        });
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error('Error during Signup!', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });
    }
  };

  function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
    return randomString;
  }

  return (
    <div className='allCover'  ref={container}>
      <ToastContainer />
      {loading ? (
            <Loader />
          ) : (
            <div>
              {/* Add any additional content you want to show when data is loaded */}
            </div>
          )}
      <div className="signup-container">
        <div className="inner">
          <h2>Signup</h2>
          {errorMessage && <div className="error">{errorMessage}</div>}
          {successMessage && <div className="success">{successMessage}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username:</label>
              <input type="text" name="username" value={username} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input type="email" name="email" value={email} onChange={handleChange} required />
            </div>
            <div className="form-group">
      <label>Password:</label>
      <div className="passwordDiv">
        <input 
          type={isPasswordVisible ? 'text' : 'password'} 
          name="password" 
          value={password} 
          onChange={handleChange} 
          required 
        />
        <i 
          className={`bi ${isPasswordVisible ? 'bi-eye-fill' : 'bi-eye-slash-fill'}`} 
          onClick={togglePasswordVisibility} 
          style={{ cursor: 'pointer' }}
        ></i>
      </div>
    </div>
            <div className="form-group">
              <label>Phone Number:</label>
              <input type="tel" name="phoneNumber" value={phoneNumber} onChange={handleChange} required />
            </div>
            <button type="submit">Sign Up</button>
          </form>
          <span><a href="/login">login</a> your account</span>
        </div>
      </div>
      <img className='imgWrapper' src="pexels-pixabay-210881-removebg-preview.png" alt="" />
     
    </div>
  );
};

export default Signup;
