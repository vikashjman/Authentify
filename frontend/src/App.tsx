import { Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import Home from './pages/home.page'
import Layout from './pages/Layout/layout'
import Login from './pages/login.page'
import QualityProfile from './pages/quality-profile.page'
import QualityGates from './pages/quality-gates.page'
import Projects from './pages/projects.page'
import Issues from './pages/issues.page'
import Admin from './pages/admin.page'
import NotFound from './pages/not-found.page'
import { isAuthenticated } from './utils/authUtils'

const PrivateRoute = ({ element, ...rest }: { element: JSX.Element }) => {
  return isAuthenticated('admin') ? element : <Navigate to="/" />;
};

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          
          <Route path="/administration" element={<PrivateRoute element={<Admin />} />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
