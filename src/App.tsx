import { useState } from 'react';
import IMAGES from './images';

const answerOptions = [
  { value: "definitely_human", label: "Definitely Human" },
  { value: "probably_human", label: "Probably Human" },
  { value: "no_idea", label: "No Idea" },
  { value: "probably_ai", label: "Probably AI" },
  { value: "definitely_ai", label: "Definitely AI" },
];

type Answer = { value: string };

function isAnswerCorrect(answer: string, correctAnswer: string) {
  return answer.endsWith(correctAnswer);
}

export default function AIHumanImageQuiz() {
  const [currentImage, setCurrentImage] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleNext = (answer: string) => {
    setAnswers([...answers, { value: answer }]);
    if (currentImage < IMAGES.length - 1) {
      setCurrentImage(currentImage + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      const correctAnswer = IMAGES[index].answer;
      if (answer.value === "no_idea") {
        return score;
      }
      const points = answer.value.startsWith("definitely") ? 1 : 0.5;
      if (isAnswerCorrect(answer.value, correctAnswer)) {
        return score + points;
      } else {
        return score - points;
      }
    }, 0);
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="quiz-container results">
        <h2>Quiz Results</h2>
        <p>Your score: {score} out of {IMAGES.length}</p>
        <div className="result-summary">
          {answers.map((answer, index) => {
            const noAnswer = answer.value === "no_idea";
            const correct = isAnswerCorrect(answer.value, IMAGES[index].answer);
            return (
              <div key={index} className={`result-item ${noAnswer ? 'neutral' : correct ? 'correct' : 'incorrect'}`}>
                <img
                  src={`/images/${IMAGES[index].name}.${IMAGES[index].ext}`}
                  alt={`${IMAGES[index].name}`}
                  className="result-image"
                />
                <div className="result-details">
                  <p>{IMAGES[index].name}</p>
                  <p>Correct: {IMAGES[index].answer}</p>
                  <p>Your answer: {answerOptions.find(option => option.value === answer.value)!.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2>Is this image AI or Human created?</h2>
      <h3>{IMAGES[currentImage].name}</h3>
      <img
        src={`/images/${IMAGES[currentImage].name}.${IMAGES[currentImage].ext}`}
        alt={`Image ${currentImage + 1}`}
        className="quiz-image"
      />
      <div className="answer-buttons">
        {answerOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleNext(option.value)}
            className="next-button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
