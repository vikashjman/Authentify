import { Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import Home from './pages/home.page'
import Layout from './pages/Layout/layout'
import Login from './pages/login.page'
import Admin from './pages/admin.page'
import NotFound from './pages/not-found.page'
import { isAuthenticated } from './utils/authUtils'
import Profile from './pages/profile.page'
import ResetPassword from './pages/reset-password.page'

interface PrivateRouteProps {
  element: JSX.Element;
  role?: string | null;
}

// @ts-ignore
const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, role, ...rest }) => {
  const isAuthorized = role ? isAuthenticated(role) : isAuthenticated();
  return isAuthorized ? element : <Navigate to="/" />;
};

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/administration" element={<PrivateRoute element={<Admin />} role="admin" />} />
          <Route path="login" element={<Login />} />
          <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
