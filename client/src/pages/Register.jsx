import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
  

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      console.log(data);


      localStorage.setItem('token', data.token);
     
      navigate('/Dashboard');

    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className='bg-white p-8 shadow-md w-200 h-125 rounded-md'>
        <h1 className='text-4xl text-center mt-2'>Register</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className='flex flex-col gap-2 mt-4'>
            <label htmlFor='name'>Name:</label>
            <input 
              type='text'
              name='name' 
              placeholder='name'
              value={formData.name}
              onChange={handleChange}
              className="border p-3 rounded-md"
            />
            <label htmlFor='email'>Email:</label>
            <input
              type="email"
              name='email' 
              placeholder="Email"
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
            <button type="submit" className='mt-4 bg-[#1A1B25] text-white p-3 rounded-md'>Register</button>
            <p className='text-[15px] mt-1'>Already have an account? <a href="/login" className="text-blue-500 underline">Login</a></p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register;
  