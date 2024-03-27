import React from 'react'

const Profile = () => {

  const _user = localStorage.getItem("user");
  const user = JSON.parse(_user);

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