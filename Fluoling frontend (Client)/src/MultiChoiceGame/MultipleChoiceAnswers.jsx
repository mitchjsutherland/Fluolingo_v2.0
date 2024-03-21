import React from 'react';

const MultipleChoiceAnswers = ({ answers, handleAnswerClick }) => {
  return (
    <div className="answer-container">
      {answers.map((answer, index) => (
        <button key={index} className="answer-button" onClick={() => handleAnswerClick(answer)}>
          {answer}
        </button>
      ))}
    </div>
  );
};

export default MultipleChoiceAnswers;
