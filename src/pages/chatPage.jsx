import React, { useState, useEffect, useRef } from 'react';
import "../stylings/styles.css";
import { useParams, useNavigate } from 'react-router-dom';
// import { useAppContext } from './appContext.jsx';
import AnimatedMessage from './AnimatedMessage'; // Import the AnimatedMessage component
import Cookies from 'js-cookie';
import Header from './header';
import Loader from './loader';
import io from 'socket.io-client'; // Import socket.io-client


const BouncingSpinner = () => {
  return (
    <div className="bouncing-spinner">
      <div className="bounce1"></div>
      <div className="bounce2"></div>
      <div className="bounce3"></div>
    </div>
  );
}; 


export default function ChatPage() {
  const [data, setData]=useState({})
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [requestCount, setRequestCount] = useState(0);
  const [showAnimatedMessage, setShowAnimatedMessage] = useState(false);
  const innerContRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const firstMessageCalled = useRef(false); // To track if the first message has been called
  const socket = useRef(null); // Reference for the socket connection
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedRawFiles, setSelectedRawFiles] = useState([]);
  const [isVisible, setIsVisible] = useState(false); // Track visibility for transition

  useEffect(() => {
    if (selectedRawFiles.length > 0) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300); // Wait for transition to finish before setting display: none
    }
  }, [selectedRawFiles]);
 

  // const handleFileChange = (event) => {
  //   if (event.target.files) {
  //     const files = Array.from(event.target.files);
  
  //     // Create an array of promises to handle the base64 conversion for each file
  //     const promises = files.map((file) => {
  //       return new Promise((resolve) => {
  //         setFileToBase(file, (dataURI) => {
  //           resolve({ file, base64: dataURI });
  //         });
  //       });
  //     });
  
  //     // Once all the promises are resolved, update the state
  //     Promise.all(promises).then((base64Files) => {
  //       console.log(base64Files);
  //       setSelectedFiles(base64Files); // Update your state with the file objects and their base64 representation
  //     });
  //   }
  // };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10 MB in bytes
    const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif']; // Allowed image MIME types
  
    // Check if the number of files exceeds the limit (5 files in this case)
    if (files.length > 5) {
      alert("You can only upload up to 5 files.");
      return; // Stop further processing if more than 5 files are selected
    }
  
    // Calculate the total size of all selected files
    let totalSize = 0;
    for (let i = 0; i < files.length; i++) {
      totalSize += files[i].size;
  
      // Check if the file is a video
      if (files[i].type.startsWith('video/')) {
        alert("Videos are not allowed. Please select only images.");
        return; // Stop further processing if any file is a video
      }
  
      // Check if the file type is allowed (image)
      if (!ALLOWED_FILE_TYPES.includes(files[i].type)) {
        alert(`The file "${files[i].name}" is not a valid image type. Please select only images.`);
        return; // Stop further processing if file is not an allowed image type
      }
    }
  
    // Check if the total file size exceeds the 10 MB limit
    if (totalSize > MAX_TOTAL_SIZE) {
      alert("The total file size exceeds the 10 MB limit. Please select smaller files.");
      return; // Stop further processing if the total size exceeds the limit
    }
  
    console.log(files);
  
    // If the files are valid, proceed with further handling
    setSelectedRawFiles(Array.from(files));
  
    // Create an array to hold the image data URIs
    const imageArray = [];
  
    // Process each file and convert it to a data URI
    Array.from(files).forEach((file, i) => {
      setFileToBase(file, (dataURI) => {
        // Add the data URI to the image array
        imageArray.push(dataURI);
  
        // If all files have been processed, update the state
        if (imageArray.length === files.length) {
          setSelectedFiles(imageArray); // Update selected files in state
        }
      });
    });
  };
  
//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//   setSelectedRawFiles(files)
//   // console.log(files)
//     if (files.length > 5) {
//       return;
//     }else{
// const imageArray = [];
// files.forEach((file, i) => {
//   setFileToBase(file, (dataURI) => {
//     // Add the data URI to the image array
//     imageArray.push(dataURI);

//     // If all images have been processed, update state
//     if (imageArray.length === files.length) {
//       // console.log(imageArray)
//      setSelectedFiles(imageArray);
//     }
//   });
// });
//     }
//   };
  
  // Base64 conversion function for displaying images
  const setFileToBase = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const dataURI = reader.result;
      callback(dataURI); // Call the callback with the base64 encoded string
    };
  };
  
  const handleUpload = async () => {
    try {
      const formData = new FormData();
  
      // Loop through selected files and append them to FormData
      selectedFiles.forEach(( file ) => {
        formData.append('files', file); // Only append the actual file objects here, not the base64 encoded string
      });
  
      // Append additional data like senderId and receiverId
      formData.append('senderId', data.users.id);
      formData.append('receiverId', 'admin');
  
      // Perform the fetch request to upload files
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData, // `formData` is already in the correct format
      });
  
      const result = await response.json(); // Parse the JSON response
  
      if (!response.ok) {
        throw new Error(result.message || 'Upload failed');
      }
  
      console.log(result); // Handle the successful response
  
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Error uploading files');
    }
  };
  

  const renderFilePreview = (file) => {
    const isImage = file.type.startsWith('image');
    const isVideo = file.type.startsWith('video');

    if (isImage) {
      const imageUrl = URL.createObjectURL(file);
      // console.log(imageUrl)
      return <span className="file img" key={file.name}>
        <img className="img" key={file.name} src={imageUrl} alt="thumbnail" />
      </span>;  // Only render img span for image files
    }

    if (isVideo) {
      const videoUrl = URL.createObjectURL(file);
      console.log(videoUrl)
      return <span className="file vid" key={file.name}>
          <video className="vid" key={file.name} width="120" height="90" controls poster={videoUrl}>
          <source src={videoUrl} type={file.type} />
        </video>
      </span>;  // Only render vid span for video files
    }

    return null;  // Optionally handle unsupported file types
  };

  // Loading Indicator component
const LoadingIndicator = ({ isLoading }) => {
  return (
    <div className="loading-indicator" style={{ display: isLoading ? 'flex' : 'none', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex:2 }}>
    <BouncingSpinner />
  </div>
  );
};

const handleButtonClick = () => {
  const inputRef = document.createElement('input');
  inputRef.type = 'file';
  inputRef.multiple = true;

  // Set the file size limit (10 MB)
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes

  inputRef.addEventListener('change', (event) => handleFileChange(event, MAX_FILE_SIZE));
  inputRef.click();
};

const fetchData = async () => {
  // setLoading(true);
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
      console.log(usersData)
    setData({ users: usersData });
    fetchMessages(usersData.id)
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  } 
};


useEffect(() => {
  fetchData();
  
  // Initialize the WebSocket connection
  socket.current = io(`${import.meta.env.VITE_API_URL}`, { 
    withCredentials: true,
    transports: ['websocket', 'polling'], // Try both WebSocket and Polling

  });

  // Listen for incoming messages from the server
  socket.current.on('receive_message', (newMessage) => {
    setMessages(prevMessages => [...prevMessages, newMessage]);
  });

  // Clean up the socket connection when the component unmounts
  return () => {
    if (socket.current) {
      socket.current.disconnect();
    }
  };
}, []);


  const replyMessage = async (message) => {
    setShowAnimatedMessage(true);
    // setIsLoading(true)
          // Emit the message to the WebSocket server
          socket.current.emit('send_message', message);
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
      // setIsLoading(false)
      // console.log(dataRes)
      setRequestCount(count => count + 1);
    } catch (error) {
      // setIsLoading(false)
      console.error('Error:', error);
    }
  };
  const whatsappMessage = async (message) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/sendWhatsapp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message:`You have a message from ${data.users.id}`,
        }),
      });
      const dataRes = await res.json();
      // setIsLoading(false)
      console.log(dataRes)
    } catch (error) {
      // setIsLoading(false)
      console.error('Error:', error);
    }
  };



  // const handleSendMessage = () => {
  //   if (!inputMessage.trim()) return;
  
  //   // Clear the input field
  //   setInputMessage('');
  
  //   // Scroll to the bottom of the message container
  //   if (innerContRef.current) {
  //     innerContRef.current.scrollTop = innerContRef.current.scrollHeight;
  //   }
  //   replyMessage(`${inputMessage}`);
  
  //   // console.log(data);
  
  //   fetchMessages(data.users.id);

  //   //removed this for the mean time...
  //   // sendMail(inputMessage, data.users.username);
  
  // };


  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
  
    // Clear the input field
    setInputMessage('');
  
    // Scroll to the bottom of the message container
    if (innerContRef.current) {
      innerContRef.current.scrollTop = innerContRef.current.scrollHeight;
    }
  
    setShowAnimatedMessage(true); // Show the loading message animation
    try {
      await replyMessage(`${inputMessage}`); // Send the message
      await fetchMessages(data.users.id); // Fetch the messages after the reply
      await whatsappMessage(`${inputMessage}`); // Fetch the messages after the reply
      // await sendMail(inputMessage, data.users.username);
    } catch (error) {
      console.error('Error during sending or fetching messages:', error);
    } finally {
      setShowAnimatedMessage(false); // Hide the animated message after all is done
    }
  };
  
  

  const sendMail=async (message, sender)=>{
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/sendReplyMailAdmin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message:message,
          sender:sender
         }),
      });
      const dataRes = await res.json();
      console.log(dataRes)
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // const fetchMessages = async (id) => {
  //   try {
  //     const response = await fetch(`${import.meta.env.VITE_API_URL}/fetchMessages`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ myId: id, friend: "admin" }),
  //     });
  
  //     if (!response.ok) throw new Error('Failed to fetch messages');
  
  //     const data = await response.json();
  //     const separatedData = separateByMyId(data.result);
  
  //     // Assuming separatedData[0] is the array of messages
  //     const messages = separatedData[0];
  
  //     // Sort messages based on a timestamp (adjust the key according to your data structure)
  //     messages.sort((a, b) => new Date(a.timeRecieved) - new Date(b.timeRecieved));
  // console.log(messages)
  //     const newArr = messages.map(item => {
  //       if (item.otherId === "admin") {
  //         return { elem: item.message, role: "sender" };
  //       } else {
  //         return { elem: item.message, role: "receiver" };
  //       }
  //     });
  //     const unreadMessages=[]
  // messages.map((item, i)=>{
  //   if(item.seen_by_user !== "SEEN"){
  //     unreadMessages.push(item)
  //   }
  //   return unreadMessages
  // })

  // unreadMessages.forEach(async(item, i)=>{
  //   var obj = {
  //     messageId:item.id,
  //     userId:item.myId
  //   }
  //   console.log(obj)
  //   const response2 =  await fetch(`${import.meta.env.VITE_API_URL}/messageSeenByUser`, {
  //     method:"PUT",
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(obj),   
  //   })
  //   if (!response2.ok) throw new Error('Failed to fetch messages');
  
  //   const data2 = await response2.json();

  //   // console.log(data2)
  // })
  // // console.log(newArr)
  //     setMessages(newArr);
  //   } catch (error) {
  //     console.error('Error fetching messages:', error);
  //   } finally {
  //     setShowAnimatedMessage(false);
  //   }
  // };
  

  const fetchMessages = async (id) => {
    // setIsLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/fetchMessages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ myId: id, friend: "admin" }),
      });
  
      if (!response.ok) throw new Error('Failed to fetch messages');
  
      const data = await response.json();
      const separatedData = separateByMyId(data.result);
      console.log(data)
      // setIsLoading(false)
  
      // Assuming separatedData[0] is the array of messages
      const messages = separatedData[0];
  
      // Sort messages based on a timestamp (adjust the key according to your data structure)
      messages.sort((a, b) => new Date(a.timeRecieved) - new Date(b.timeRecieved));
  
      const newArr = messages.map(item => {
        if (item.otherId === "admin") {
          return { elem: item.message, role: "sender" };
        } else {
          return { elem: item.message, role: "receiver" };
        }
      });
  
      // Filter unread messages
      const unreadMessages = messages.filter(item => item.seen_by_user !== "SEEN");
  
      // Async function to mark all unread messages as seen
      const markMessagesAsSeen = async () => {
        try {
          // Use a loop to wait for each async operation
          for (const item of unreadMessages) {
            const obj = {
              messageId: item.id,
              userId: item.myId,
            };
            console.log(obj);
  
            const response2 = await fetch(`${import.meta.env.VITE_API_URL}/messageSeenByUser`, {
              method: "PUT",
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(obj),
            });
  
            if (!response2.ok) throw new Error('Failed to update message status');
            const data2 = await response2.json();
            // You can log data2 if necessary
          }
        } catch (error) {
          // setIsLoading(false)
          console.error('Error updating message status:', error);
        }
      };
  
      // Mark unread messages as seen before updating the messages state
      await markMessagesAsSeen();
  
      // Now update the messages and hide the animated message
      setMessages(newArr);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setShowAnimatedMessage(false); // Hide animated message after everything is done
    }
  };
  
  

  useEffect(() => {
    if (!firstMessageCalled.current) {
      firstMessageCalled.current = true; // Mark as called
    }
  }, []);

  useEffect(() => {
    if (innerContRef.current) {
      // Ensure scrolling happens after messages or animated message change
      setTimeout(() => {
        innerContRef.current.scrollTop = innerContRef.current.scrollHeight;
      }, 0);
    }
  }, [messages, showAnimatedMessage]); // Scroll when messages or the animated message changes
  
  return (
    <>
      <Header />
      <div className="container">
      <LoadingIndicator isLoading={isLoading} />
        <div className="innerCont" ref={innerContRef}>
          {messages.map((msg, index) => {
            const isError = msg.elem.includes("An error occurred");
            const messageClass = isError ? 'errorMessage' : msg.role;

            return (
              <div key={index} className={messageClass}>
                <div 
                  className={`${messageClass}Inner`} 
                  dangerouslySetInnerHTML={{ __html: msg.elem }} 
                />
              </div>
            );
          })}
         {showAnimatedMessage? <AnimatedMessage role={'sender'} />: ""}
         <div
        className="image-preview sender"
        style={{
          opacity: isVisible ? 1 : 0,
          visibility: isVisible ? 'visible' : 'hidden',
          display: isVisible ? 'flex' : 'none',
          transition: 'opacity 0.3s ease, visibility 0s 0.3s', // Ensure visibility change happens after opacity
        }}
      >
        <span className="senderInner">
          <div className="files">
            {selectedRawFiles.map((file) => renderFilePreview(file))}
          </div>
          <button className="sendBut" onClick={handleUpload}>Send</button>
        </span>
      </div>
         {/* <div className="image-preview receiver">
          <span className='receiverInner'>
            <div className="files">
              <span className='file img'></span>
              <span className='file'></span>
              <span className='file'></span>
              <span className='file'></span>
              <span className='file'></span>
              <span className='file'></span>
              <span className='file'></span>
              <span className='file'></span>
              <span className='file'></span>
              <span className='file vid'></span>
            </div>
         <button>Send</button> 
          </span>
        </div> */}
        </div>
        <div className="inputSection">
          <input
            type="text"
            placeholder="Enter your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        <button id="images" onClick={handleButtonClick}></button>
          <button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
            Send
          </button>
        </div>
        <div className="biggerPic">
          <div className="biggerPicWrapper"></div>
          <div className="img"><img src="image_asoroauto.webp" alt="" /></div>
        </div>
      </div>
    </>
  );
};
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
