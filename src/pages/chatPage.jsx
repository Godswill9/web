import React, { useState, useEffect, useRef } from 'react';
import "../stylings/styles.css";
import { useParams, useNavigate } from 'react-router-dom';
// import { useAppContext } from './appContext.jsx';
import AnimatedMessage from './AnimatedMessage'; // Import the AnimatedMessage component
import Cookies from 'js-cookie';
import Header from './header';


export default function ChatPage() {
  const [data, setData]=useState({})
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [requestCount, setRequestCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const innerContRef = useRef(null);
  const navigate = useNavigate();
  const firstMessageCalled = useRef(false); // To track if the first message has been called

const fetchData = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/verifyAUser`, {
      method: "GET",
      credentials: "include"
    });
    const usersData = await response.json();
    console.log(usersData)
   
    if (!usersData || (usersData && usersData.message === "Please log in again.")) {
     navigate("/login")
      setData(null); // Clear data if not logged in
      return;
    } else{
    setData({ users: usersData });
    fetchMessages(usersData.id)
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

useEffect(()=>{
  fetchData()
},[])


  // const displayOnScreen = (elem, role) => {
  //   console.log(elem, role)
  //   setMessages([...messages, { elem, role }]);
  //   console.log(messages);
  //   if (innerContRef.current) {
  //     innerContRef.current.scrollTop = innerContRef.current.scrollHeight;
  //   }
  // };

  const replyMessage = async (message) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          id: data.users.id,
          time: new Date().toISOString().slice(0, 19).replace('T', ' '), // Format to 'YYYY-MM-DD HH:MM:SS'
        }),
      });
      const dataRes = await res.json();
      console.log(dataRes)
      setRequestCount(count => count + 1);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    setInputMessage('');
    if (innerContRef.current) {
      innerContRef.current.scrollTop = innerContRef.current.scrollHeight;
    }
    replyMessage(`${inputMessage}`);

    console.log(data)
    fetchMessages(data.users.id)
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };

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
  console.log(messages)
      const newArr = messages.map(item => {
        if (item.otherId === "admin") {
          return { elem: item.message, role: "sender" };
        } else {
          return { elem: item.message, role: "receiver" };
        }
      });
  // console.log(newArr)
      setMessages(newArr);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  
  

  useEffect(() => {
    if (!firstMessageCalled.current) {
      firstMessageCalled.current = true; // Mark as called
    }
  }, []);

  useEffect(() => {
    if (innerContRef.current) {
      innerContRef.current.scrollTop = innerContRef.current.scrollHeight;
    }
  }, []);

  return (
    <>
        <Header/>
    <div className="container">
      {/* <div className="cont_header">
        Header
      </div> */}
      <div className="innerCont" ref={innerContRef}>
        {messages.map((msg, index) => {
          const isError = msg.elem.includes("An error occurred");
          const messageClass = isError ? 'errorMessage' : msg.role;

          // Show AnimatedMessage if loading

          return (
            <div key={index} className={messageClass}>
              <div className={`${messageClass}Inner`} dangerouslySetInnerHTML={{ __html: msg.elem }} />
            </div>
          );
        })}
        {loading && !messages.some(msg => msg.role === 'reciever' && loading) && (
          <AnimatedMessage role="reciever" />
        )}
      </div>
      <div className="inputSection">
        <input
          type="text"
          placeholder="Enter your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
          Send
        </button>
      </div>
    </div>
    </>
  );
}
function formatStringAndWrapDivs(inputString) {
  const urlPattern = /(\bhttps?:\/\/[^\s]+\.[a-z]{2,6}\b)/gi;
  const emailPattern = /[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,6}/gi;

  const urls = [];
  let urlMap = {};

  // Replace URLs with placeholders
  let placeholderText = inputString.replace(urlPattern, (url, offset) => {
      const beforeText = inputString.slice(0, offset);
      const afterText = inputString.slice(offset + url.length);
      const isEmail = emailPattern.test(beforeText) || emailPattern.test(afterText);

      if (!isEmail) {
          const placeholder = `__URL_PLACEHOLDER_${urls.length}__`;
          urls.push(url);
          urlMap[placeholder] = url;
          return placeholder;
      }
      return url;
  });

  // Split the text into sentences
  const sentences = placeholderText.split('.');

  let modifiedText = "";
  sentences.forEach((sentence) => {
      const trimmedSentence = sentence.trim();
      if (trimmedSentence) {
          // Make the bold formatting changes
          const formattedSentence = trimmedSentence.replace(/\*\*(.*?)\*\*/, '<div style="display: block; text-decoration: underline;"><b>$1</b></div>');
          modifiedText += `<div style="margin-bottom: 10px;">${formattedSentence}.</div>`;
      }
  });

  // Replace URL placeholders with the original URLs
  modifiedText = modifiedText.replace(/__URL_PLACEHOLDER_\d+__/g, (placeholder) => {
      return urlMap[placeholder] || placeholder;
  });

  return modifiedText;
}


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
