import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion"
import avatar from '../assets/undraw_taking-notes_oyqz.svg';

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


const Hero = () => {

  return (
    <div>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2  }}
      >
        <h1 className="text-center text-[32px] lg:text-5xl md:text-[40px] mt-15 p-2"><span className="font-bold text-[#01A1B25]">Your</span> thoughts. Organised<span className="font-bold text-[#778DA9]"><TypeWriterText text=" Beautifully." delay={160} /></span></h1>
        <p className="text-center md:mt-2 mt-0 md:text-xl text-sm p-2">SmartyNote helps students, creators, and professionals organize ideas, tasks, and notes without clutter.</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
         className="flex items-center justify-center gap-4 md:mt-12 mt-3">
       <motion.button
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
        className='border border-[#1A1B25] px-4.5 py-3 rounded-[5px] shadow-lg'
        >
         <Link to="#" className='text-[#1A1B25]'>Learn more</Link>
       </motion.button>

       <motion.button
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
        className='bg-[#1A1B25] px-4.5 py-3.5 rounded-[5px]'
        >
         <Link to="/register" className='text-white'>Get Started</Link>
       </motion.button>
      </motion.div>
      <div className="flex justify-center">
        <img src={avatar} alt="Avatar" width="700" height="500" className="mt-8 p-4" />
      </div>
    </div>
      
  )
}

export default Hero
