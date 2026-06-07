import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'
import API_URL from '../api/api';


const TypeWriterText =({ text, delay = 0}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); 

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setStarted(true);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if(!started) return;

    if (!isDeleting && currentIndex < text.length) {
     const timeout = setTimeout(() => {
       setDisplayText(prev => prev + text[currentIndex]);
       setCurrentIndex(prev => prev + 1);
     }, 80);
     return () => clearTimeout(timeout);
    }

    if (!isDeleting && currentIndex === text.length) {
     const timeout = setTimeout(() => {
       setIsDeleting(true);
      }, 2000);
     return () => clearTimeout(timeout);
    }


    if (isDeleting && displayText.length > 0) {
      const timeout = setTimeout(() => {
       setDisplayText(prev => prev.slice(0, -1));
      }, 50);
      return () => clearTimeout(timeout);
    }


    if (isDeleting && displayText.length === 0) {
     setIsDeleting(false);
     setCurrentIndex(0);
    }
  }, [currentIndex, text, started, isDeleting, displayText]);

    return (
      <span>
        {displayText} 
     </span>
   );
};

const Login = () => {

 const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

 const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value
    });
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    try{

      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: 'POST',
          
          headers: {
            'Content-Type': 'application/json' 
          },

          body: JSON.stringify(formData)
        }
      );
      
      const data = await response.json();
    
      
      localStorage.setItem('token', data.token);
      navigate('/Dashboard')

    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
  <div className='flex flex-col lg:flex-row min-h-screen'>

    {/* tablet & phone — top banner*/}
      <div 
        className="lg:hidden w-full md:h-56 flex-1 flex flex-col items-center justify-center"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(135deg, #25334A 10%, #2E4059 50%, #1B263B 80%, #25334A 100%)',
          backgroundSize: '24px 24px, 100% 100%'
        }}
      >
        <div className='flex flex-col items-center justify-center'>
          <h1 className='app-title text-4xl text-[#fafafa] font-bold mb-4'>Smarty<span className='text-[#778DA9]'>N</span>
           <TypeWriterText text="otes" delay={60} />
          </h1>
          <motion.p 
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2  }}
             className='text-[#fafafa] text-sm'
          >Your intelligent note-taking 
           <span className='text-[#778DA9]'> companion</span>
          </motion.p>
        </div>
     </div>
    

    {/* left side - dark gradient */}
    <div 
      className="flex-1 hidden lg:block"
      style={{
        background: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(135deg, #25334A 10%, #2E4059 50%, #1B263B 80%, #25334A 100%)',
        backgroundSize: '24px 24px, 100% 100%'
      }}
    >
      <div className='flex flex-col items-center justify-center py-83'>
         <h1 className='app-title text-5xl text-[#fafafa] font-bold mb-2'>Smarty<span className='text-[#778DA9]'>N</span>
           <TypeWriterText text="otes" delay={60} />
          </h1>
        <motion.p 
         initial={{ opacity: 0, y: 60 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6, delay: 0.2  }}
          className='text-[#fafafa] text-sm'
        >Your intelligent note-taking 
         <span className='text-[#778DA9]'> companion</span>
        </motion.p>
      </div>
      
    </div>

    {/* right side - white with dots */}
    <div 
      className='flex-1 flex items-center justify-center'
      style={{
        background: 'radial-gradient(circle, rgba(0,0,0,0.12) 1px, transparent 1px), radial-gradient(circle at top left, rgba(65, 90, 119, 0.25), transparent 60%)',
        backgroundSize: '24px 24px, 100% 100%'
      }}
    >
      <div className="bg-white px-15 py-12 shadow-lg w-80 md:w-160 max-auto rounded-md">
        <h1 className='text-4xl text-center mt-2 font-semibold'>Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className='flex flex-col gap-2 mt-6'>
            <label htmlFor='email'>Email:</label>
            <input 
              type="email"
              name='email'
              placeholder="your_email@example.com"
              value={formData.email}
              onChange={handleChange}
              className="border p-3 rounded-md"
            />
            <label htmlFor='password'>Password:</label>
            <input
              type="password"
              name='password'
              placeholder="your_password"
              value={formData.password}
              onChange={handleChange}
              className="border p-3 rounded-md"
            />
            <button type="submit" className='mt-4 bg-[#1A1B25] text-white p-3 rounded-md'>Login</button>
            <p className='text-[15px] mt-1'>Don't have an account? <Link to="/register" className="text-blue-500 underline">Register</Link></p>
          </div>
        </form>
      </div>
    </div>
  </div>
    
  )
}

export default Login
