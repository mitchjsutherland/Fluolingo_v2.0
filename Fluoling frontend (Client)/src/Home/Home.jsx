import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap'; 
import { motion } from "framer-motion"
import "./Homenew.css";

function Home() {

  return (

    <div className="body">
      <div className='homeContainer'>
        <motion.img initial={{scale: 0}} animate={{scale: 1, rotate: [0, 1082, 1079, 1080]}} transition={{duration: 1, times: [0, 0.87, 0.92, 0.95], scale: {duration: 1.5}}} whileHover={{scale: [null, 1.03]}} className="homeLogo" src="../public/FluoLogoHome.svg" alt="Logo" />
        <div>
        <Link to="/users/login">
          {/* Orchestration may be used here to delay the animation of start button to follow logo entry? */}
          <motion.Button initial={{opacity: 0}} animate={{opacity: [0, 0, 0.5 ,1]}} transition={{duration: 4, times: [0, 0.5, 0.7, 1]}} variant="primary" className="g-button homeStartButton">Click to start</motion.Button>  
        </Link>
        </div>
      </div>
    </div>

  );
}

export default Home;
