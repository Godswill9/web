import React, { useState } from 'react';
import '../stylings/styles.css'; // Import your SCSS file
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import { useNavigate } from 'react-router-dom';

const Verification = () => {
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'code') {
      setCode(value);
    } 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { code };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/verifyCode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const res = await response.json();

      console.log(res)

      if (res.message === 'success') {
        toast.success('successful!', {
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
          navigate('/login'); // Change this to your desired route
        }, 1000);
      } else {
        toast.error(res.message || 'verification failed. Please try again.', {
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
      toast.error('Error during verification!', {
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
    <>
      <ToastContainer />
      <div className="login-container">
        <div className="inner">
          <h2>Verification</h2>
          <span>Check email for verification code</span>
          {errorMessage && <div className="error">{errorMessage}</div>}
          {successMessage && <div className="success">{successMessage}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Code:</label>
              <input 
                type="code" 
                name="code" 
                value={code} 
                onChange={handleChange} 
                required 
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Verification;
