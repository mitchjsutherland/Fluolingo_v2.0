import React, { useState } from 'react';
//import reactLogo from './assets/react.svg';
import './Appnew.css';
import ImageGuessMode from '../ImageGuessGame/imageguessmode';
import Register from '../Register/Register';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../Login/Login';
import Dashboard from '../Dashboard/Dashboard';
import Home from '../Home/Home';
import MultiChoice from '../MultiChoiceGame/MultiChoice';
import { AuthenticationProvider } from '../Authentication/AuthenticationContext';
import ImageGuess from '../ImageGuessGame/imageguess';
import ImageGuess2p from '../ImageGuessGame/imageguess2p';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  
  return (
    <Router>
      <div className={darkMode ? 'dark' : ''}>
        {/* <div className="flex justify-end p-4">
          <button
            className="px-4 py-2 rounded-md bg-gray-700 text-white"
            onClick={toggleDarkMode}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div> */}
        <AuthenticationProvider> 
        <Routes>
          <Route exact path="/" element={<Home />} />
          {/* <Route path="/multichoice" element={<MultiChoice />} /> */}

          <Route path="/users/register" element={<Register />} />
          <Route path="/users/login" element={<Login />} />
          <Route path="/users/dashboard/:email?" element={<Dashboard />} />
          <Route path="/image-guess-mode" element={<ImageGuessMode />} /> {/* Route for ImageGuessMode */}
          <Route path="/image-guess-1p" element={<ImageGuess />} /> {/* Route for ImageGuessMode */}
          <Route path="/image-guess-2p" element={<ImageGuess2p />} /> {/* Route for ImageGuessMode */}

          <Route path="/multi-choice" element={<MultiChoice />} /> {/* Route for MultiChoice */}
        </Routes>
        </AuthenticationProvider>
      </div>
    </Router>
  );
}

export default App;
