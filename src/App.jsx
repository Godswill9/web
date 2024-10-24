import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChatPage from './pages/chatPage';
import Signup from './pages/signup';
import Verification from './pages/verification';
import Login from './pages/login';


function App() {
  return (
    <div>
    <BrowserRouter>
     <Routes>
     <Route path={"/signup"} element={<Signup/>}></Route>
     <Route path={"/verification"} element={<Verification/>}></Route>
     <Route path={"/login"} element={<Login/>}></Route>
     <Route path={"/chat"} element={<ChatPage/>}></Route>
    </Routes>
    </BrowserRouter>
  </div>
  )
}

export default App
