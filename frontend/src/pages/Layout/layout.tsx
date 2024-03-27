import { Outlet, Link } from "react-router-dom";

const handleLogout = () => {
  localStorage.removeItem("user");
}

const Layout = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/administration">Administration</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li style={{cursor:"pointer"}} onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;