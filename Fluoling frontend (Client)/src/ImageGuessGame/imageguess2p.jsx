// External import
import React, { useState, useEffect } from 'react';
import { Link , useNavigate } from 'react-router-dom';
// import Countdown from 'react-countdown';

// Local import
import './imageguessnew.css'
import LetterTile from './lettertiles'; 

//import enWordArr from '../words(en)';


// GIPHY API Key
const APIkey = 'caailYVBDQ7hpb4Ls9S49MSR0NrCdykg';


// Bug notes:
// 'Beer' as a query term has shown a picture of a deer 


function ImageGuess2p() {


    const navigate = useNavigate();

    const isAuthenticated = sessionStorage.getItem("isAuthenticated");
    // console.log(isAuthenticated);

    useEffect(() => {
      // Checking if user is not loggedIn
      if (!isAuthenticated) {
        navigate("/users/login");
      } else {
        navigate("/image-guess-2p");
      }
    }, [navigate, isAuthenticated]);


    const [currentWord, setCurrentWord] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [playerControl, setPlayerControl] = useState('hidden');
    const [startButton, setStartButton] = useState('Start');
    const [gameFeedback, setGameFeedback] = useState('');
    const [words, setWords] = useState([]);
    const [gameClock, setGameClock] = useState('hidden');
    const [timer, setTimer] = useState(120); 
    const [letterTiles, setLetterTiles] = useState([]);
    const [gameComment, setGameComment] = useState('');
    const [gameCommentText, setGameCommentText] = useState('Are you both ready?');
    
    // const [scoreBoard, setScoreBoard] = useState(0);
    const [scoreBoardBox, setScoreBoardBox] = useState('hidden');
    const [scoreBoardPlayer1, setScoreBoardPlayer1] = useState(0);
    const [scoreBoardPlayer2, setScoreBoardPlayer2] = useState(0);
    const [currentPlayer, setCurrentPlayer] = useState(1);
    const [scoreStyle1, setScoreStyle1] = useState('active');
    const [scoreStyle2, setScoreStyle2] = useState('inactive');

    const [frenchWords, setFrenchWords] = useState([]);
    const [czechWords, setCzechWords] = useState([]);
    const [turkishWords, setTurkishWords] = useState([]);
    const [gameAlert, setGameAlert] = useState('hidden');

    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [gameWords, setGameWords] = useState([]);
    const [correctAnswer, setCorrectAnswer] = useState('');



    useEffect(() => {
        
        fetch('http://localhost:4000/api/words/english')
          .then(response => response.json())
          .then(data => {
            setWords(data);
          })
          .catch(error => {
            console.error('Error fetching words:', error);
          });
    }, []);

    useEffect(() => {
        
        fetch('http://localhost:4000/api/words/french')
          .then(response => response.json())
          .then(data => {
            setFrenchWords(data);
          })
          .catch(error => {
            console.error('Error fetching words:', error);
          });
    }, []);

    useEffect(() => {
        
        fetch('http://localhost:4000/api/words/czech')
          .then(response => response.json())
          .then(data => {
            setCzechWords(data);
          })
          .catch(error => {
            console.error('Error fetching words:', error);
          });
    }, []);

    useEffect(() => {
        
        fetch('http://localhost:4000/api/words/turkish')
          .then(response => response.json())
          .then(data => {
            setTurkishWords(data);
          })
          .catch(error => {
            console.error('Error fetching words:', error);
          });
    }, []);

    useEffect(() => {

        chooseNewWord();

    }, [startButton, scoreBoardPlayer1, scoreBoardPlayer2]);
    
    useEffect(() => {

        showImage();

    }, [startButton, currentWord]); 


    useEffect(() => {

        if (selectedLanguage === 'french' && frenchWords.length > 0) {
            setGameWords(frenchWords);
        } else if (selectedLanguage === 'czech' && czechWords.length > 0) {
            setGameWords(czechWords);
        } else if (selectedLanguage === 'turkish' && turkishWords.length > 0) {
            setGameWords(turkishWords);
        } else if (selectedLanguage === 'english' && words.length > 0) {
            setGameWords(words);
        }
    }, [selectedLanguage, words, frenchWords, czechWords, turkishWords]);



    // Game functions ---------------------------------------------*


    const handleLanguageChange = (language) => {
      
        setSelectedLanguage(language);

    };


    const startGame = () => {

        if (selectedLanguage === '') {

            setGameAlert('visible');

        } else {

            setGameAlert('hidden');
            setPlayerControl('visible');
            setGameClock('visible');
            setGameCommentText("Let's Lingo")
            setStartButton('Restart');
            setTimer(60);
            setScoreBoardPlayer1(0);
            setScoreBoardPlayer2(0);
            setScoreBoardBox('visible');
            setCurrentPlayer(1);
            startTimer();

        }
        
    };


    const chooseNewWord = () => {

        if (gameWords.length > 0) {

            const randomIndex = Math.floor(Math.random() * gameWords.length);
            const currentWord = words[randomIndex];
            
            setCurrentWord(currentWord);
            console.log(currentWord)

            const correctAnswer = gameWords[randomIndex]; // or the appropriate array
            setCorrectAnswer(correctAnswer);
            console.log(correctAnswer)

        }
        
    };


    const showImage = () => {

        // console.log(words);
        // console.log(gameWords);
        // console.log(currentWord);
        // console.log(correctAnswer);

        let queryURL = `https://api.giphy.com/v1/gifs/search?api_key=${APIkey}&q=${currentWord}&limit=1&offset=0&rating=g&lang=en&bundle=messaging_non_clips`;

        fetch(queryURL)

        .then((response) => 
            response.json())
            .then((data) => {
                if (data.data && data.data.length > 0 && data.data[0].images && data.data[0].images.original && data.data[0].images.original.url) {
                    setImageURL(data.data[0].images.original.url);
                } else {
                    console.error('Invalid Giphy API response:', data);
                }
            })
            .catch((error) => {
                console.error('Error fetching Giphy API:', error);
            });

        createLetterTiles();
        
    }


    const startTimer = () => {
        
        const intervalId = setInterval(() => {

            setTimer(prevTimer => {

                if (prevTimer > 0) {
                    return prevTimer - 1

                } else {
                    clearInterval(intervalId);
                    setPlayerControl('hidden');
                    setGameCommentText("Game Over")
                    // gameOver();
                }       
            });
        }, 1000);

    };

    const speakAnswer = (language, answer) => {
        const languageCode = getLanguageCode(language);
        const voiceName = getVoiceForLanguage(language);
    
        if (!languageCode || !voiceName) {
          console.error('Unsupported language:', language);
          return;
        }
    
        const utterance = new SpeechSynthesisUtterance(answer.toLowerCase());
        utterance.lang = languageCode;
        utterance.voice = getVoiceByName(voiceName);
    
        try {
          window.speechSynthesis.speak(utterance);
        } catch (error) {
          console.error('Error:', error);
        }
    };

    const getLanguageCode = (language) => {
        switch (language) {
          case 'czech':
            return 'cs-CZ';
          case 'french':
            return 'fr-FR';
          case 'turkish':
            return 'tr-TR';
          default:
            return null;
        }
    };
    
    const getVoiceForLanguage = (language) => {
        switch (language) {
          case 'czech':
            return 'Josef';
          case 'french':
            return 'Bette';
          case 'turkish':
            return 'Omer';
          default:
            return null;
        }
    };
    
    const getVoiceByName = (name) => {
        const voices = window.speechSynthesis.getVoices();
        return voices.find(voice => voice.name === name);
    };


    const checkWord = () => {

        // Action for Mitch - Review syntax on line below for verifying input in React
        const userAnswer = document.getElementById('playerInput').value;
        const newUserAnswer = userAnswer.charAt(0).toUpperCase() + userAnswer.slice(1);
        // console.log(newUserAnswer);
        console.log(correctAnswer);

        if (newUserAnswer === correctAnswer) {

            successfulGuess();

            // chooseNewWord();
            // showImage();

            setTimeout(() => {
                setGameFeedback('');
            }, "2000");

        }   else {

            setGameFeedback('Try again! ')
            updateLetterTiles(newUserAnswer);
            switchTurn();
        };

    };

    const successfulGuess = () => {

        setGameFeedback(correctAnswer + ' is correct!');
        speakAnswer(selectedLanguage, correctAnswer);
        setScoreBoardBox('visible');
        updateScore();

        const updatedTiles = letterTiles.map(tile => ({...tile, isGuessed: true }));
        setLetterTiles(updatedTiles);
    }


    const updateScore = () => {

        if (currentPlayer === 1) {
            setScoreBoardPlayer1(score => score + 1);
        }   else {
            setScoreBoardPlayer2(score => score + 1);
        }

    };

    const switchTurn = () => {

        setCurrentPlayer(prevPlayer => (prevPlayer === 1 ? 2 : 1));
        playerIndicator();
        
        setGameCommentText(() => {
            if (currentPlayer === 1) {
                return "Player 2"
            } else {
                return "Player 1"
            }
        })

    };

    const playerIndicator = () => {

        if (currentPlayer === 2) {
            setScoreStyle1('active')
            setScoreStyle2('inactive')
        } else if (currentPlayer === 1) {
            setScoreStyle2('active')
            setScoreStyle1('inactive')
        } else {
            setScoreStyle1('inactive')
            setScoreStyle2('inactive')
        }
    };


    const createLetterTiles = () => {

        // console.log(currentWord);

        const newTiles = correctAnswer.split('').map((letter, index) => ({

            id: index,
            letter,
            isGuessed: false,

        }));

        console.log(newTiles);
        setLetterTiles(newTiles);
 
    };


    const updateLetterTiles = (userAnswer) => {

        const updatedTiles = letterTiles.map(tile => ({...tile, isGuessed: userAnswer.charAt(tile.id) === tile.letter}));

        setLetterTiles(updatedTiles);

    };


    const handleExit = () => {
   
        navigate("/image-guess-mode");
    };


    return (

        <div className="gameMain">

            <h1 className={gameComment}>{gameCommentText}</h1>

            <div className="mt-5">
                <h3 className="mb-3">Choose your language:</h3>
                <button className={`language-button ${selectedLanguage === 'french' ? 'selected' : ''}`} onClick={() => handleLanguageChange('french')}>French</button>
                <button className={`language-button ${selectedLanguage === 'czech' ? 'selected' : ''}`} onClick={() => handleLanguageChange('czech')}>Czech</button>
                <button className={`language-button ${selectedLanguage === 'turkish' ? 'selected' : ''}`} onClick={() => handleLanguageChange('turkish')}>Turkish</button>
            </div>

            <div id="gameBox" className="mt-3">

                <div id="gameClock" className={gameClock}>
                    {/* <Countdown date={Date.now() + 10000} renderer={countDown} /> */}
                    {timer} 
                </div>

                <div id="imageBox" className="mt-3">
                    {imageURL && <img src={imageURL} alt="Giphy" />}
                </div>

                {/* <div id="wordBox">{currentWord}</div> */}

                <div id="letterTiles" className="letterTiles">

                    {letterTiles.map(({ id, letter, isGuessed }) => (
                        <LetterTile key={id} letter={isGuessed ? letter : ' '} isGuessed={isGuessed} />
                    ))}
                    
                </div>

                <div id="guessBox" className="mt-3">

                    <div className="gameFeedback my-3">

                        {gameFeedback}
                        <br />

                        <div className={scoreBoardBox}>

                            <div className={scoreStyle1}>Player 1 Score: {scoreBoardPlayer1}</div>
                            <div className={scoreStyle2}>Player 2 Score: {scoreBoardPlayer2}</div>

                        </div>


                    </div>

                    <div id="playerControl" className={playerControl}>

                        <input id="playerInput" type="type" />
                        <button onClick={checkWord} id="answerSubmit">Enter</button>

                    </div>

                </div>
                
            </div>

            <div className="mb-2">
                <p className={gameAlert}>Please select a language to play...</p>
            </div>

            <button onClick={startGame} className="mt-5" >{startButton}</button>
            <button onClick={handleExit} className="mt-5">Exit Game</button>
        </div>
    );
}

export default ImageGuess2p;