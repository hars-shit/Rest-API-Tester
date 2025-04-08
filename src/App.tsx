import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";



const App = () => {
 const [hasUSer,setHasUser]=useState<boolean>(false)

 useEffect(()=>{
 const user= localStorage.getItem('user')
  setHasUser(!!user)
 },[localStorage])

  return (
   <BrowserRouter>
   <Routes>
    <Route path="/" element={ hasUSer ? <Home setHasUser={setHasUser}/> : <Login setHasUser={setHasUser}/>}/>

    <Route path="/signup" element={<SignUp />}/>
   </Routes>
   <ToastContainer position="top-right" autoClose={3000}/>
   </BrowserRouter>
  )
}

export default App