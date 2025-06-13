// Header.js
import React, { useEffect, useState } from 'react';
import '../stylings/styles.css'; // Import your SCSS file
import { useNavigate } from 'react-router-dom';


const Header = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const [unreadMessages, setUnreadMessages]= useState(0)
 const navigate = useNavigate();


  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/verifyAUser`, {
        method: "GET",
        credentials: "include"
      });
      const usersData = await response.json();
      // console.log(usersData)
     
      if (!usersData || (usersData && usersData.message === "Please log in again.")) {
       navigate("/login")
        // setData(null); // Clear data if not logged in
        return;
      } else{
      // setData({ users: usersData });
      fetchMessages(usersData.id)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  useEffect(()=>{
    fetchData()
  },[])
  

  const fetchMessages = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/fetchMessages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ myId: id, friend: "admin" }),
      });
  
      if (!response.ok) throw new Error('Failed to fetch messages');
  
      const data = await response.json();
      const separatedData = separateByMyId(data.result);
  
      // Assuming separatedData[0] is the array of messages
      const messages = separatedData[0];
  
      // Sort messages based on a timestamp (adjust the key according to your data structure)
      messages.sort((a, b) => new Date(a.timeRecieved) - new Date(b.timeRecieved));
  // console.log(messages)
  const unreadMessages=[]
  messages.map((item, i)=>{
    if(item.seen_by_user !== "SEEN"){
      unreadMessages.push(item)
    }
    return unreadMessages
  })

  // console.log(unreadMessages)
  setUnreadMessages(unreadMessages.length)
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
            <img src="image_asoroauto.webp" alt="" />
            <span>Leave us a <span className="message">Message😉</span></span>
        </div>
        <div className="menu-icon" onClick={toggleSidebar}>
          <i className={`bi ${sidebarVisible ? 'bi-x-lg' : 'bi-list'}`}></i>
        </div>
        <nav className={`nav ${sidebarVisible ? 'active' : ''}`}>
          <ul>
            <li className='chat'>
              <a href="/chat">Chat</a>
              {unreadMessages !==0?<span>{unreadMessages}</span>:"" }
            </li>
            <li><a href="/about">About Us</a></li>
            {/* <li><a href="/user-information">User Information</a></li> */}
          </ul>
        </nav>
      </div>
    </header>
  );
};


function separateByMyId(arr) {
  const result = {};

  arr.forEach(item => {
    const { myId, otherId } = item;

    // Create a key that considers both myId and otherId
    const key = [myId, otherId].sort().join('-');

    // Initialize an array for this key if it doesn't exist
    if (!result[key]) {
      result[key] = [];
    }

    // Push the current item into the appropriate array
    result[key].push(item);
  });

  // Convert the result object into an array of arrays
  return Object.values(result);
}


export default Header;
