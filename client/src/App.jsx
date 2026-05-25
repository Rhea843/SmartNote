import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Hero from './pages/Hero';
import Dashboard from './pages/Dashboard'; 



function App() {
  return (
    <div className='bg-[#fafafa] min-h-screen'>
      
     <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
     </Routes>
     
    </div>

    
  )
}

export default App