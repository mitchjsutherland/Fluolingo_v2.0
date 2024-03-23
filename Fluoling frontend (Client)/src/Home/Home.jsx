import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap'; 
import { motion } from "framer-motion"
import "./Homenew.css";

function Home() {

  return (

    <div className="body">
      <div className='homeContainer'>
        <motion.img animate={{rotate: [null, 720]}} whileHover={{scale: [null, 1.2]}} className="homeLogo" src="../public/FluoLogoHome.svg" alt="Logo" />
        <div>
        <Link to="/users/login">
          <Button variant="primary" className="g-button homeStartButton">Click to start</Button>  
        </Link>
        </div>
      </div>
    </div>

  );
}

export default Home;
