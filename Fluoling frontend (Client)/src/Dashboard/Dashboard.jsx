import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import App from "../MultiChoiceGame/MultiChoice";
import { useParams,useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Card, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboardnew.css';
import ImageGuessMode from '../ImageGuessGame/imageguessmode';
import { useAuthentication } from '../Authentication/AuthenticationContext';

function Dashboard() {
    const [selectedGame, setSelectedGame] = useState(null);
    const [showMessage, setShowMessage] = useState(true);
    const location = useLocation();
    const { state } = location;
    const userName = state?.userName;
    const [count, setCount] = useState(0);
    const { email } = useParams();
    const { logout, getUserData } = useAuthentication();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // console.log(user);
    
    const isAuthenticated = sessionStorage.getItem("isAuthenticated");
    // console.log(isAuthenticated);

    useEffect(() => {
      // Define an async function inside useEffect
      const fetchData = async () => {
        // Checking if user is not loggedIn
        if (!isAuthenticated) {
          navigate("/users/login");
        } else {
          navigate("/users/dashboard");
          
          const userObj = await getUserData();

          setUser(userObj);

        }
      };
    
      // Call the async function
      fetchData();
    }, [navigate, isAuthenticated]);

    // const handleGameSelection = (game) => {
    //     setSelectedGame(game);
    //     setShowMessage(false);
    // };

    const handleGameSelection = (game) => {
      setShowMessage(false);
      if (game === 'Image Guess') {
          navigate('/image-guess-mode'); // Use navigate function to redirect
      } else if (game === 'MultiChoice Quiz') {
          navigate('/multi-choice'); // Use navigate function to redirect
      }
  };



  const handleLogout = async () => {
    await logout();
    // Redirect to the login page or any other page after logout
    navigate('/users/login');
  };


    return (
        <div>

            <div className="dashboardContainer">

              <img className="dashboardLogo" src="../public/FluoLogoHome.svg" alt="Logo" />

              {showMessage && <div><h1 className='dashboardWelcome'>Welcome back {user?.name}!</h1></div>}


                <p className='dashboardQuestion'>What do you want to play?</p>

                <div className='dashboardGameContainer'>
                  <div className='dashboardCloud1'>
                    <button className="g-button" onClick={() => handleGameSelection('Image Guess')}>Image Guess</button>
                  </div>
                  <div className='dashboardCloud2'>
                    <button className="g-button" onClick={() => handleGameSelection('MultiChoice Quiz')}>MultiChoice Quiz</button>
                  </div>
                </div>

                <a href="#" onClick={handleLogout}>Logout</a>
              

            </div>
        </div>
    );
}

export default Dashboard;
