import React, { useState } from 'react';
import '../stylings/styles.css'; // Import your SCSS file
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import { useNavigate } from 'react-router-dom';
import Loader from './loader';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
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
        x:0,// Start off-screen (bottom)
        opacity: 0,     // Start fully hidden
        rotate: 270     // Start rotated -90 degrees
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
      ".login-container .inner",
      { 
        // y: 350,         // Start off-screen (bottom)
        opacity: 0,     // Start fully hidden
        // rotate: 270     // Start rotated -90 degrees
      },
      { 
        y: 0,    
        x:0,       // Move to normal position
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
    const data = { email, password };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const res = await response.json();

      console.log(res)

      if (res.status === 'success') {
        setLoading(false);
        toast.success('Login successful!', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
        });

        // Redirect to another page after successful login
        setTimeout(() => {
          navigate('/chat'); // Change this to your desired route
        }, 1000);
      } else {
        setLoading(false);
        toast.error(res.message || 'Login failed. Please try again.', {
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
      setLoading(false);
      console.error(error);
      toast.error('Error during login!', {
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

  return (
    <div className='allCover'ref={container}>
      <ToastContainer />
      {loading ? (
            <Loader />
          ) : (
            <div>
              {/* Add any additional content you want to show when data is loaded */}
            </div>
          )}
      <div className="login-container">
        <div className="inner">
          <h2>Login</h2>
          {errorMessage && <div className="error">{errorMessage}</div>}
          {successMessage && <div className="success">{successMessage}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email:</label>
              <input 
                type="email" 
                name="email" 
                value={email} 
                onChange={handleChange} 
                required 
              />
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
            <button type="submit">Log In</button>
          </form>
          <span><a href="/signup">Signup</a> for an account</span>
        </div>
      </div>
      {/* <div className="imgWrapper"> */}
      <img className='imgWrapper' src="pexels-pixabay-210881-removebg-preview.png" alt="" />
      {/* <img className='imgWrapper2' src="pexels-pixabay-210881-removebg-preview.png" alt="" /> */}
        {/* <img className='mid' src="pexels-pixabay-210881-removebg-preview.png" alt="" />
        <img className='leftt' src="pexels-pixabay-210881-removebg-preview.png" alt="" /> */}
      {/* </div> */}
    </div>
  );
};

export default Login;
