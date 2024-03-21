import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageDisplay from './ImageDisplay';
import MultipleChoiceAnswers from './MultipleChoiceAnswers';
//import fetchQuestions from './fetchAnswers';
import fetchImage from './fetchImage';
import './MultiChoicenew.css';

const languageFlags = {
  French: '🇫🇷',
  Czech: '🇨🇿',
  Turkish: '🇹🇷'
};

const imageAPIKey = 'g6UXY6FAX2jvOSVhDEvO4HSHmZCyZ3XQ';
const textToSpeechAPIKey = 'ccf851b8ae8a422c8c780fcce21b6f66';

const MultiChoice = () => {
  const [image, setImage] = useState('');
  const [answers, setAnswers] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('French');
  const [activityStarted, setActivityStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [message, setMessage] = useState('');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [words, setWords] = useState([]);
  const navigate = useNavigate();

  const isAuthenticated = sessionStorage.getItem("isAuthenticated");
    console.log(isAuthenticated);

    useEffect(() => {
      // Checking if user is not loggedIn
      if (!isAuthenticated) {
        navigate("/users/login");
      } else {
        navigate("/multi-choice");
      }
    }, [navigate, isAuthenticated]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/words/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setWords(data);
      } catch (error) {
        console.error('Error fetching words:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (activityStarted) {
      const timer = setInterval(() => {
        setTimeLeft(prevTimeLeft => {
          if (prevTimeLeft === 0 || (difficulty === 'Beginner' && score >= 30) || (difficulty === 'Learner' && score >= 65) || (difficulty === 'Expert' && score >= 100)) {
            clearInterval(timer);
            if (difficulty === 'Beginner' && score >= 30) {
              setMessage('You won!');
            } else if (difficulty === 'Learner' && score >= 65) {
              setMessage('You won!');
            } else if (difficulty === 'Expert' && score >= 100) {
              setMessage('You won!');
            } else {
              setMessage('Time\'s up!');
              if (score < 30 && difficulty === 'Beginner') {
                setMessage('You lose! Your lingo score: ' + score);
              } else if (score < 65 && difficulty === 'Learner') {
                setMessage('You lose! Your lingo score: ' + score);
              } else if (score < 100 && difficulty === 'Expert') {
                setMessage('You lose! Your lingo score: ' + score);
              }
            }
          } else {
            if (prevTimeLeft === 45) {
              setMessage('Halfway, hurry!');
              setTimeout(() => {
                setMessage('');
              }, 2000);
            }
            return prevTimeLeft - 1;
          }
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [activityStarted, score, difficulty]);

  useEffect(() => {
    if (activityStarted) {
      fetchData();
    }
  }, [selectedLanguage, activityStarted]);

  const fetchData = async () => {
    try {
      const fetchedQuestions = words;
      if (fetchedQuestions.length > 0) {
        const selectedQuestion = fetchedQuestions[Math.floor(Math.random() * fetchedQuestions.length)];
        const imageUrl = await fetchImage(selectedQuestion.english_search_term, imageAPIKey);
        setImage(imageUrl);

        const allAnswers = [...selectedQuestion.incorrect_answers[selectedLanguage.toLowerCase()], selectedQuestion.correct_answer[selectedLanguage.toLowerCase()]];
        setAnswers(shuffleArray(allAnswers));
        setCorrectAnswer(selectedQuestion.correct_answer[selectedLanguage.toLowerCase()]);
      } else {
        console.error('No questions found');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAnswerClick = async (selectedAnswer) => {
    if (selectedAnswer === correctAnswer) {
      if (score === null) {
        setScore(1);
      } else {
        setScore(score + 1);
      }
      setMessage('CORRECT! +1');

      // Text-to-speech integration
      speakAnswer(selectedLanguage, correctAnswer);
    } else {
      setScore(Math.max(0, score - 1));
      setMessage('INCORRECT! -1');
    }

    // Clear the message after a delay
    setTimeout(() => {
      setMessage('');
    }, 1000);

    fetchData(); // Fetch new question
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
      case 'Czech':
        return 'cs-CZ';
      case 'French':
        return 'fr-FR';
      case 'Turkish':
        return 'tr-TR';
      default:
        return null;
    }
  };

  const getVoiceForLanguage = (language) => {
    switch (language) {
      case 'Czech':
        return 'Josef';
      case 'French':
        return 'Bette';
      case 'Turkish':
        return 'Omer';
      default:
        return null;
    }
  };

  const getVoiceByName = (name) => {
    const voices = window.speechSynthesis.getVoices();
    return voices.find(voice => voice.name === name);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleStartActivity = (difficulty) => {
    setActivityStarted(true);
    setDifficulty(difficulty);

    // Say "Congratulations" when the user wins
    if ((difficulty === 'Beginner' && score >= 30) || (difficulty === 'Learner' && score >= 65) || (difficulty === 'Expert' && score >= 100)) {
      speakCongratulations(selectedLanguage);
    }
  };

  const speakCongratulations = (language) => {
    const languageCode = getLanguageCode(language);
    const voiceName = getVoiceForLanguage(language);

    if (!languageCode || !voiceName) {
      console.error('Unsupported language:', language);
      return;
    }

    const congratulationsMessage = getCongratulationsMessage(language);

    const utterance = new SpeechSynthesisUtterance(congratulationsMessage);
    utterance.lang = languageCode;
    utterance.voice = getVoiceByName(voiceName);

    try {
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getCongratulationsMessage = (language) => {
    switch (language) {
      case 'Czech':
        return 'Gratulujeme!';
      case 'French':
        return 'Félicitations!';
      case 'Turkish':
        return 'Tebrikler!';
      default:
        return 'Congratulations!';
    }
  };  

  const handleRestartGame = () => {
    setScore(0);
    setTimeLeft(90);
    setMessage('');
  };

  const handleExitGame = () => {
    setActivityStarted(false);
    setScore(0);
    setTimeLeft(90);
    setMessage('');
  };

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const handleExit = () => {

    navigate("/users/dashboard");

  };

  return (
    <div className="app-container">
      {!activityStarted ? (
        <div>
          <img src="../public/flamingo-logo.svg" alt="Fluolingo Logo" className="logo" />
          <h1 className="heading">Fluolingo</h1>
          <h3 className="tagline">Fly through the MultiChoice quiz</h3>
          <button onClick={() => handleStartActivity('Beginner')}>Get Ready to Soar!</button>
          <button onClick={() => handleExit()}>Exit</button>

        </div>
      ) : (
        <>
          <div className="language-selector">
            <button className={`language-button ${selectedLanguage === 'French' ? 'selected' : ''}`} onClick={() => handleLanguageChange('French')}>French</button>
            <button className={`language-button ${selectedLanguage === 'Czech' ? 'selected' : ''}`} onClick={() => handleLanguageChange('Czech')}>Czech</button>
            <button className={`language-button ${selectedLanguage === 'Turkish' ? 'selected' : ''}`} onClick={() => handleLanguageChange('Turkish')}>Turkish</button>
          </div>
          <div className="difficulty-selector">
            <button className={`difficulty-button Beginner ${difficulty === 'Beginner' ? 'selected' : ''}`} onClick={() => handleStartActivity('Beginner')}>
              🐥 Beginner
            </button>
            <button className={`difficulty-button Learner ${difficulty === 'Learner' ? 'selected' : ''}`} onClick={() => handleStartActivity('Learner')}>
              🦜 Learner
            </button>
            <button className={`difficulty-button expert ${difficulty === 'Expert' ? 'selected' : ''}`} onClick={() => handleStartActivity('Expert')}>
              🦩 Expert
            </button>
          </div>
          <div className="flag-display">
            {languageFlags[selectedLanguage]} 
            <span>{difficulty === 'Beginner' ? '🐥' : difficulty === 'Learner' ? '🦜' : '🦩'}</span>
          </div>
          {message === 'You won!' || message.startsWith('You lose!') ? (
            <>
              <h2>{message}</h2>
              {message.startsWith('You lose!') && (
                <p>Better luck next time: {score}/{difficulty === 'Beginner' ? 30 : difficulty === 'Learner' ? 65 : 100}</p>
              )}
              {message === 'You won!' && (
                <p>Congratulations! You scored: {score}/{difficulty === 'Beginner' ? 30 : difficulty === 'Learner' ? 65 : 100}</p>
              )}
              <button onClick={handleRestartGame}>Restart Game</button>
              <button onClick={handleExitGame}>Exit Game</button>
            </>
          ) : (
            <>
              <ImageDisplay imageUrl={image} size="400px" />
              <MultipleChoiceAnswers className="answer-button" answers={answers} handleAnswerClick={handleAnswerClick} />
              <div className="score-container">
                Score: {score} / {difficulty === 'Beginner' ? 30 : difficulty === 'Learner' ? 65 : 100}
              </div>
              <div className="timer-container">Time Left: {timeLeft <= 10 ? <span className="hot-pink">{timeLeft}</span> : timeLeft}</div>
              <div className="message-container">{message}</div>
              <button onClick={handleRestartGame}>Restart Game</button>
              <button onClick={handleExitGame}>Exit Game</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MultiChoice;
