import { useEffect, useState } from "react";
import { getUserLogin } from "../api/api";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/authUtils";

const Login = () => {

  const [userData, setUserData] = useState({ email: "", password: "" });
  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value })
  }


  const navigate = useNavigate();

  useEffect(() => {
      const isAuth = isAuthenticated();
      if(isAuth) navigate("/")
  },[])

  const handleLogin = async(e:any) => {
    e.preventDefault();
    const response:any = await getUserLogin(userData);
    const {user,accessToken} = response.data;
    Object.assign(user,{accessToken:accessToken});
    localStorage.setItem("user", JSON.stringify(user));


    setUserData({ email: "", password: "" });
    console.log(user);
    if(user.roles.includes('admin'))
     navigate("/administration");
    else
      navigate("/")
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input type="email" name="email" placeholder="email" onChange={(e) => handleChange(e)} value={userData.email} />
        <input type="password" name="password" placeholder="Password" value={userData.password} onChange={(e) => handleChange(e)} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
