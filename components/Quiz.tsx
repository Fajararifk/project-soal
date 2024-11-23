"use client";
import { useState, useEffect } from "react";
import StatCard from "./StatCard";
import { urlFor } from '../sanity/lib/client'; 

interface QuizProps {
  questions: {
    question: string;
    answers: string[];
    correctAnswer: string;
    questionImage?: {
      asset: {
        _ref: string; // Reference to the image asset in Sanity
        _type: string; // Type of the asset (usually "reference")
      };
    }; 
  }[];
  userId: string | undefined;
}

const Quiz = ({ questions, userId }: QuizProps) => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] =
    useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });
  const [timeRemaining, setTimeRemaining] = useState(25);
  const [timerRunning, setTimerRunning] = useState(false);
  const { question, answers, correctAnswer, questionImage } =
    questions[activeQuestion];
    //console.log(questions);
    // const resetQuiz = () => {
    //   setActiveQuestion(0);
    //   setSelectedAnswer("");
    //   setChecked(false);
    //   setSelectedAnswerIndex(null);
    //   setShowResults(false);
    //   setResults({
    //     score: 0,
    //     correctAnswers: 0,
    //     wrongAnswers: 0,
    //   });
    //   setTimeRemaining(25);
    //   setTimerRunning(false);
    // };
    useEffect(() => {
      if (timerRunning && timeRemaining > 0) {
        const timer = setTimeout(() => {
          setTimeRemaining((prevTime) => prevTime - 1);
        }, 1000);
        return () => clearTimeout(timer); // Cleanup timeout on rerender
      } 
      else if (timeRemaining === 0) {
        stopTimer();
        if(timerRunning == false){
          handleTimeUp();
        }
      }
    }, [timeRemaining, timerRunning]);
  


  const imageUrl = questionImage ? urlFor(questionImage).url() : null;
  const startTimer = () => {
    setTimerRunning(true);
  };

  const stopTimer = () => {
    setTimerRunning(false);
  };

  const resetTimer = () => {
    setTimeRemaining(25);
  };

  const handleTimeUp = () => {
    // stopTimer();
    // resetTimer();
    nextQuestion();
  };

  useEffect(() => {
    startTimer();

    return () => {
      stopTimer();
    };
  }, []);

  const onAnswerSelected = (
    answer: string,
    idx: number
  ) => {
    setChecked(true);
    setSelectedAnswerIndex(idx);
    if (answer === correctAnswer) {
      setSelectedAnswer(answer);
    } else {
      setSelectedAnswer("");
    }
  };

  const nextQuestion = () => {
    setSelectedAnswerIndex(null);
    const updatedResults = selectedAnswer
    ? {
        ...results,
        score: results.score + 5,
        correctAnswers: results.correctAnswers + 1,
      }
    : {
        ...results,
        wrongAnswers: results.wrongAnswers + 1,
      };

  // Update the state
  setResults(updatedResults);
  var test = results;
    if (activeQuestion !== questions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
    } else {
      setShowResults(true);
      stopTimer();
      fetch("/api/quizResults", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          quizScore: updatedResults.score,
          correctAnswers: updatedResults.correctAnswers,
          wrongAnswers: updatedResults.wrongAnswers,
          counterInsert: 1
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Network response was not working fam"
            );
          }
          return response.json();
        })
        .then((data) => {
          console.log(
            "Quiz results saved successfully:",
            data
          );
        })
        .catch((error) => {
          console.error(
            "Error saving quiz results:",
            error
          );
        });
    }
    setChecked(false);
    // resetTimer();
    // startTimer();
    if (updatedResults.correctAnswers + updatedResults.wrongAnswers === questions.length){
      stopTimer();
    }
    else {
      resetTimer();
      startTimer();
    }
    
  };

  return (
    <div className="min-h-[500px]">
      <div className="max-w-[1500px] mx-auto w-[90%] flex justify-center py-10 flex-col">
        {!showResults ? (
          <>
            <div className="flex justify-between mb-10 items-center">
              <div className="bg-primary text-white px-4 rounded-md py-1">
                <h2>
                  Question: {activeQuestion + 1}
                  <span>/{questions.length}</span>
                </h2>
              </div>

              <div className="bg-primary text-white px-4 rounded-md py-1">
                {timeRemaining} seconds to answer
              </div>
            </div>

            <div>
            {questionImage && imageUrl ? (
              <img src={imageUrl} alt={question} />
            ) : ( <p></p>
            )}
            <h3 className="mb-5 text-2xl font-bold">{question}</h3>
              <ul>
                {answers.map(
                  (answer: string, idx: number) => (
                    <li
                      key={idx}
                      onClick={() =>
                        onAnswerSelected(answer, idx)
                      }
                      className={`cursor-pointer mb-5 py-3 rounded-md hover:bg-primary hover:text-white px-3
                      ${
                        selectedAnswerIndex === idx &&
                        "bg-primary text-white"
                      }
                      `}
                    >
                      <span>{answer}</span>
                    </li>
                  )
                )}
              </ul>
              <button
                onClick={nextQuestion}
                disabled={!checked}
                className="font-bold"
              >
                {activeQuestion === questions.length - 1
                  ? "Finish"
                  : "Next Question →"}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-2xl uppercase mb-10">
              Results 📈
            </h3>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-10">
              <StatCard
                title="Percentage"
                value={`${(results.score / 50) * 100}%`}
              />
              <StatCard
                title="Total Questions"
                value={questions.length}
              />
              <StatCard
                title=" Total Score"
                value={results.score}
              />
              <StatCard
                title="Correct Answers"
                value={results.correctAnswers}
              />
              <StatCard
                title="Wrong Answers"
                value={results.wrongAnswers}
              />
            </div>
            {/* <button
              onClick={resetQuiz}
              className="mt-10 font-bold uppercase"
            >
              Restart Quiz
            </button> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
