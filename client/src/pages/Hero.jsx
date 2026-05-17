import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import avatar from '../assets/undraw_taking-notes_oyqz.svg';

const Hero = () => {
  return (
    <div>
      <Navbar />
      <div>
        <h1 className="text-center text-[45px] mt-8"><span className="font-bold text-[#01A1B25]">Create</span>, Manage and Organize<br></br> Notes <span className="font-bold text-[#778DA9]">Effeciently.</span></h1>
        <p className="text-center mt-4">A simple and a fast way to organize your all your note in one place.</p>
      </div>
      <div className="flex items-center justify-center gap-4 mt-4">
        <button className='border border-[#1A1B25] px-[18px] py-[8px] rounded-[5px] shadow-lg'>
         <Link to="#" className=' text-[#1A1B25]'>Learn more</Link>
       </button>

       <button className='bg-[#1A1B25] px-[18px] py-[10px] rounded-[5px]'>
        <Link to="/register" className='text-white'>Get Started</Link>
       </button>
      </div>
      <div className="flex justify-center">
        <img src={avatar} alt="Avatar" width="700" height="500" className="mt-8 p-4" />
      </div>
     
    </div>
      
  )
}

export default Hero
