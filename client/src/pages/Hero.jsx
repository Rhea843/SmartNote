import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion"
import landingImage from '../assets/landingpage_image.jpg';

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
    <div style={{ background: 'radial-gradient(circle at top left, rgba(65, 90, 119, 0.25), transparent 60%)' }}>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2  }}
      >
        <h1 className="text-center text-[30px] lg:text-5xl md:text-[30px] md:mt-22 lg:mt-12 mt-12"><span className="font-bold text-[#01A1B25]">Your</span> thoughts. Organised<span className="font-bold text-[#778DA9]"> Beauti<TypeWriterText text="fully." delay={260} /></span></h1>
        <p className="text-center md:mt-2 mt-0 md:text-sm text-sm">SmartyNote helps students, creators, and professionals organize ideas, tasks, and notes without clutter.</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
         className="flex items-center justify-center gap-4 md:mt-10 mt-8">
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
      <div className="flex justify-center mt-10 md:mt-30ß shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
        <img src={landingImage} alt="Landing" width="1200" height="300"  />
      </div>
    </div>
      
  )
}

export default Hero
