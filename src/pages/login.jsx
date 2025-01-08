import React, { useState } from 'react';
import '../stylings/styles.css'; // Import your SCSS file
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import { useNavigate } from 'react-router-dom';
import Loader from './loader';

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
    <>
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
    </>
  );
};

export default Login;
