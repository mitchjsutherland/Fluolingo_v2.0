// External import
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import Countdown from 'react-countdown';

// Local import
import './imageguessnew.css'
import ImageGuess from './imageguess';
import ImageGuess2p from './imageguess2p';


function ImageGuessMode() {

    // const [selectedMode, setSelectedMode] = useState(null);
    const [showMessage, setShowMessage] = useState(true);
    const navigate = useNavigate();

    const isAuthenticated = sessionStorage.getItem("isAuthenticated");
    // console.log(isAuthenticated);

    useEffect(() => {
      // Checking if user is not loggedIn
      if (!isAuthenticated) {
        navigate("/users/login");
      } else {
        navigate("/image-guess-mode");
      }
    }, [navigate, isAuthenticated]);
  
    // const handleGameMode = (mode) => {
    //   setSelectedMode(mode);
    //   setShowMessage(false); // Hide the message after game selection
    // };



    const handleGameMode = (mode) => {
        // setSelectedMode(mode);
        if (mode === 'Single Player') {
            navigate ("/image-guess-1p")
        } else if (mode = 'Two Player') {
            navigate ("/image-guess-2p")
        }
        setShowMessage(false); // Hide the message after game selection
    };

    const handleExit = () => {
       
        navigate("/users/dashboard");
    };


    return (

        <div className="gameMain">

            {/* {showMessage &&  */}
            
            <div>
                <h1>Let the games begin...</h1>
                <p>Please select a game mode:</p>

                <div>
                    <button onClick={() => handleGameMode('Single Player')} className="mt-5" >Single Player</button>
                    <button onClick={() => handleGameMode('Two Player')} className="mt-5" >Two Player</button>
                    <button onClick={handleExit} className="mt-5">Exit Game</button>
                </div>
            </div>
            
            {/* } */}

            {/* {selectedMode === 'Single Player' && <ImageGuess />}
            {selectedMode === 'Two Player' && <ImageGuess2p />} */}

        </div>
    );
}

export default ImageGuessMode;

