import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        'http://localhost:8080/api/auth/login',
        {
          method: 'POST',
          
          headers: {
            'Content-Type': 'application/json' 
          },

          body: JSON.stringify(formData)
        }
      );
      
      const data = await response.json();
      
      console.log(data);
      
      localStorage.setItem('token', data.token);
      navigate('/Dashboard')

    } catch (error) {
      console.error('Error logging in:', error);
    }
  };
  
  

  return (
    <div className="flex justify-center items-center h-screen">
      <div className='bg-white p-8 shadow-md w-200 h-100 rounded-md'>
        <h1 className='text-4xl text-center mt-2'>Login</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className='flex flex-col gap-2 mt-6'>
            <label htmlFor='email'>Email:</label>
            <input 
              type="email"
              name='email'
              placeholder="email"
              value={formData.email}
              onChange={handleChange}
              className="border p-3 rounded-md"
            />
            <label htmlFor='password'>Password:</label>
            <input
              type="password"
              name='password'
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="border p-3 rounded-md"
            />
            <button type="submit" className='mt-4 bg-[#1A1B25] text-white p-3 rounded-md'>Login</button>
            <p className='text-[15px] mt-1'>Dont have an account? <a href="/register" className="text-blue-500 underline">Register</a></p>
         </div>
       </form>
      </div>
    </div>
  )
}

export default Login;
