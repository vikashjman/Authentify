import { useEffect, useState } from "react"
import { createNewUser, fetchAllUsers } from "../api/api";

const Admin = () => {

  const [allUsers, setAllUsers] = useState([])
  const [user, setUser] = useState({
    username: "",
    email: ""
  });

  useEffect(() => {
    const getAllUser = async () => {
      const res = await fetchAllUsers();
      setAllUsers(res.data)
    }
    getAllUser();
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value })
  }
  // getall user
  // handle submit 

  const handleClick = async () => {
    const newUser:any = await createNewUser(user);
    // setAllUsers([...allUsers,newUser])
    console.log(newUser)
  }

  return (
    <>
      <div>Admin</div>
      <h1>Create Users</h1>

      <input type="text" name="username" value={user.username} onChange={(e) => handleChange(e)}></input>
      <input type="email" name="email" value={user.email} onChange={(e) => handleChange(e)}></input>
      {/* <input type="password" name="password" value={user.password} onChange={(e) => handleChange(e)}></input> */}
      <button onClick={handleClick}>Submit</button>

      {allUsers.map((user: any) => {
        return (
          <>
            <h1>{user.username}</h1>
            <p>{user.email}</p>
            {/* <p>{user.roles[0]}</p> */}
          </>
        )
      })}
    </>
  )
}

export default Admin