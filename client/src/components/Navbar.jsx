import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='flex items-center justify-between p-4'>
      <div className='flex tems-center justify-center gap-7'>
        <h1 className='app-title text-xl font-semibold text-[#0D1B2A]'>SmartyNote</h1>
        <nav className='flex gap-5 p-1'>
          <Link to="/" className='font-semibold text-[#1A1B25]'>Home</Link>
          <Link to="#" className='text-[#1A1B25]/45 '>Features</Link>
          <Link to="#" className='text-[#1A1B25]/45'>About us</Link>
        </nav>
      </div>
      <button className='bg-[#415A77] px-[18px] py-[5px] rounded-[5px]'>
        <Link to="/login" className='font-semibold text-[#1A1B25]'>Login</Link>
      </button>
    </div>
  )
}

export default Navbar
