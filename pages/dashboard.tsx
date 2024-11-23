import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const [user, setUser] = useState<{ id: any; role: string; name: string } | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false); // To track if the quiz is submitted
  const [submissionMessage, setSubmissionMessage] = useState(''); // To store the submission message
  const [message, setMessage] = useState('');
  const [isTabActive, setIsTabActive] = useState(true);
  const [notificationMessage, setNotificationMessage] = useState('');


  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in!');
      window.location.href = '/signin';
      return;
    }

    const fetchUser = async () => {
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        localStorage.removeItem('token');
        alert('Session expired. Please log in again.');
        window.location.href = '/signin';
        return;
      }

      const data = await response.json();      
      setUser(data.user);
    };

    const fetchQuestions = async () => {
      const response = await fetch('/api/questions'); // Adjust with your API
      const data = await response.json();
      if (data && Array.isArray(data.questions)) {
        setQuestions(data.questions);
      } else {
        console.error('Questions data is not an array', data);
        setQuestions([]);  // Default to empty array if data is not valid
      }
    };

    fetchUser();
    fetchQuestions();

  }, []);

  
 


  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/signin';
  };

  const handleLeaderboard = () => {
    //localStorage.removeItem('token');
    window.location.href = '/leaderboards';
  };

  const handleQuestion = () => {
    // Logic to open question management, visible only for admins
    console.log('Opening question management interface...');
    window.location.href = '/question';  // Adjust URL as necessary
  };

  const handleAnswerChange = (answer: string) => {
    if (!isSubmitted) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = answer;
      setAnswers(newAnswers);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1 && !isSubmitted) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0 && !isSubmitted) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    let score = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;

    // Calculate the score and count the correct and wrong answers
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score += 5;
        correctAnswers += 1;
      } else {
        wrongAnswers += 1;
      }
    });

    setScore(score);
    setIsSubmitted(true);
    setSubmissionMessage('Your answers have been submitted successfully!');
    // data: {
    //   userId: user?.id || 0, // Assuming user is logged in and has an id
    //   correctAnswers,
    //   wrongAnswers,
    //   quizScore: score,
    //   counterInsert: 0, // Set counterInsert to your desired value or logic
    // },
    // After calculating the score, create the QuizResult in the database
    const payload = {
      userId: user?.id, // Make sure to assign the correct property
      correctAnswers,
      wrongAnswers,
      quizScore: score,
      counterInsert: 1
    };

    console.log(payload);
    const response = await fetch('/api/admin/quizresult', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const responseData = await response.json();
      if(responseData == "Tidak bisa mengulang 3x"){
        setMessage("You have taken the exam 3 times. Please contact your teacher for further assistance.");
      }else{
        setMessage('The school exam has been successfully submitted!!');
      }
      
    } else {
      setMessage('Something went wrong.');
    }
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in!');
      window.location.href = '/signin';
      return;
    }
    let role = null;
    const fetchUser = async () => {
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        localStorage.removeItem('token');
        alert('Session expired. Please log in again.');
        window.location.href = '/signin';
        return;
      }

      const data = await response.json();      
      role = data.user.role;
      
    }
    fetchUser();
    const handleVisibilityChange = () => {
      
      if (!document.hidden && role === 'SISWA') {
        // User switched to another tab
        router.push('/signin');
        setIsTabActive(false);
      } else {
        // User returned to this tab
        setIsTabActive(true);
        setNotificationMessage('Welcome back to the tab!');
      }
    };

    // Add event listener for visibility change
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  if (user === null) {
    return <p>Loading...</p>;
  }
  

  return (
    <div>
      <style jsx>{`
        .dashboard-container {
          width: 80%;
          margin: 0 auto;
          text-align: center;
          background: linear-gradient(to right, #0072ff, #00c6ff); /* Blue gradient */
          padding: 50px 20px;
          border-radius: 15px;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .questions-container {
          margin-bottom: 20px;
          text-align: left;
          width: 100%;
          max-width: 600px;
        }

        .answer-option {
          margin: 10px 0;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 12px 25px;
          background-color: #0072ff;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease;
          font-size: 1rem;
          width: 100%;
          max-width: 500px;
        }

        .answer-option:hover {
          background-color: #005bb5;
          transform: scale(1.05);
        }

        .answer-option.selected {
          background-color: #005bb5;
          transform: scale(1.05);
        }

        .navigation-buttons {
          display: flex;
          justify-content: space-between;
          margin: 20px 0;
          width: 100%;
          max-width: 500px;
        }

        button {
          padding: 12px 25px;
          margin: 0 10px;
          cursor: pointer;
          background-color: #0072ff;
          border: none;
          border-radius: 5px;
          font-size: 1rem;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }

        button:hover {
          background-color: #005bb5;
          transform: scale(1.05);
        }

        button:disabled {
          background-color: grey;
          cursor: not-allowed;
        }

        .welcome-container {
          margin-top: 30px;
          font-size: 1.2rem;
        }

        h2, h3 {
          font-family: Arial, sans-serif;
          font-size: 1.2rem;
          margin: 10px 0;
        }

        label {
          margin-left: 10px; /* Space between the radio button and label */
          font-size: 1rem;
        }

        input[type="radio"] {
          accent-color: #0072ff; /* Change radio button color to blue */
        }

        .answer-option .answer-text {
          font-weight: bold;
        }

        img {
          width: 550px;  /* Set a specific width */
          height: 250px; /* Set a specific height */
          object-fit: cover; /* Ensures the image covers the area without distorting */
        }

        .notification {
          margin-top: 20px;
          padding: 15px;
          background-color: #28a745;
          color: white;
          font-size: 1.1rem;
          border-radius: 5px;
        }
        .notification-2 {
          margin-top: 20px;
          padding: 15px;
          color: white;
          font-size: 1.1rem;
          border-radius: 5px;
        }

        .notification-2.success {
          background-color: #28a745; /* Green for success */
        }

        .notification-2.error {
          background-color: #dc3545; /* Red for error */
        }
        .dashboard-container {
          width: 80%;
          margin: 0 auto;
          text-align: center;
          background: linear-gradient(to right, #0072ff, #00c6ff); /* Blue gradient */
          padding: 50px 20px;
          border-radius: 15px;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .buttons-container {
          display: flex;
          justify-content: space-between;
          width: 100%;
          max-width: 500px;
          margin-top: 20px;
        }

        .logout-button {
          background-color: #dc3545; /* Red color */
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s ease;
        }

        .logout-button:hover {
          background-color: #c82333; /* Darker red on hover */
        }

        .leaderboard-button {
          background-color: #007bff; /* Blue color */
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s ease;
        }

        .leaderboard-button:hover {
          background-color: #0056b3; /* Darker blue on hover */
        }
        .question-button {
          background-color: #28a745; /* Green color */
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s ease;
        }

        .question-button:hover {
          background-color: #218838; /* Darker green on hover */
        }
      `}</style>
      <div className="buttons-container">
        <button className="logout-button" onClick={handleLogout}>Logout</button>
        <button className="leaderboard-button" onClick={handleLeaderboard}>Leaderboard</button>
        {user?.role === 'ADMIN' && (
          <button className="question-button" onClick={handleQuestion}>Manage Questions</button>
        )}
      </div>
      <div className="dashboard-container">
        <div className="questions-container">
          <h2>Question {currentQuestionIndex + 1} of {questions.length}</h2>
          <h3>{questions[currentQuestionIndex]?.question}</h3>
          {questions[currentQuestionIndex]?.image && (
            <img src={questions[currentQuestionIndex]?.image} alt="Question Image" />
          )}
          {questions[currentQuestionIndex]?.answers.map((answer: string, index: number) => (
            <div
              key={index}
              className={`answer-option ${answers[currentQuestionIndex] === answer ? 'selected' : ''}`}
              onClick={() => handleAnswerChange(answer)}
              style={{ pointerEvents: isSubmitted ? 'none' : 'auto' }} // Disable answering after submission
            >
              <div className="answer-text">{answer}</div>
            </div>
          ))}
        </div>

        <div className="navigation-buttons">
          <button onClick={handleBack} disabled={currentQuestionIndex === 0 || isSubmitted}>
            Back
          </button>
          <button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1 || isSubmitted}>
            Next
          </button>
        </div>

        {currentQuestionIndex === questions.length - 1 && (
          <div>
            <button onClick={handleSubmit} disabled={isSubmitted}>Submit</button>
          </div>
        )}

        {submissionMessage && (
          <div className="notification">{submissionMessage}</div>
        )}
        {message && (
          <div className={`notification-2 ${message.includes("You have taken the exam 3 times. Please contact your teacher for further assistance.") 
          ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
        <div className="welcome-container">
          <h1>Welcome, {user.name}</h1>
          {score !== null ? (
            <div>
              <h2>Your Score: {score}</h2>
            </div>
          ) : (
            <p>Answer the questions above to submit</p>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default Dashboard;
