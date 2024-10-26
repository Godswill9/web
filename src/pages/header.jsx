// Header.js
import React, { useState } from 'react';
import '../stylings/styles.css'; // Import your SCSS file

const Header = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
            <img src="vite.svg" alt="" />
            <span>Leave us a <span className="message">Message😉</span></span>
        </div>
        <div className="menu-icon" onClick={toggleSidebar}>
          <i className={`bi ${sidebarVisible ? 'bi-x-lg' : 'bi-list'}`}></i>
        </div>
        <nav className={`nav ${sidebarVisible ? 'active' : ''}`}>
          <ul>
            <li><a href="/chat">Chat</a></li>
            <li><a href="/about">About Us</a></li>
            {/* <li><a href="/user-information">User Information</a></li> */}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
