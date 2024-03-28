import React, { useEffect } from 'react'
import { isAuthenticated, needsReset } from '../utils/authUtils';
import { useNavigate } from 'react-router-dom';

const Profile = () => {

  const _user = localStorage.getItem("user");
  const user = JSON.parse(_user);

  const navigate = useNavigate();
  useEffect(()=>{
    if(isAuthenticated() && needsReset()) navigate("/reset-password")
  },[])

  return (
    <>
    <div>Profile</div>
    <h1>{user.username}</h1>
    <p>{user.email}</p>
    {
      user.roles.map((role:any)=> (
        <p>{role}</p>
      ))
    }
    </>
  )
}

export default Profile