import { Route, Routes } from 'react-router-dom'
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


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/quality-profile" element={<QualityProfile />} />
          <Route path="/quality-gates" element={<QualityGates />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
