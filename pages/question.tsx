import { useState } from 'react';

const AdminQuestions = () => {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the first selected file
    if (!file){
      setImage(null);
      return;

    } 
  
    const reader = new FileReader();
    
    reader.onload = () => {
      // Set the image as a Base64 string
      setImage(reader.result);
    };
  
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };
    reader.readAsDataURL(file); // Read the file as a Base64 string
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/signin';
  };

  const handleLeaderboard = () => {
    //localStorage.removeItem('token');
    window.location.href = '/leaderboards';
  };
  
  const handleSubmit = async () => {
    const payload: {
      question: string;
      answers: string[];
      correctAnswer: string;
      image?: String; // Optional because the image might not always exist
    } = {
      question,
      answers,
      correctAnswer,
    };
  
    // Handle the image
    if (image) {
      // Convert the image file to a Base64 string
      //contain the Base64 string including the data type prefix
        
        // Prepare the JSON payload
        const payload = {
          question,
          answers,
          correctAnswer,
          image, // Send the Base64 string
        };
        // Send the JSON payload to the backend
        const response = await fetch('/api/admin/question', {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          setMessage('Question added successfully!');
        } else {
          setMessage('Failed to add question.');
        }
    } else {
      // Send request without an image
      const response = await fetch('/api/admin/question', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        setMessage('Question added successfully!');
      } else {
        setMessage('Failed to add question.');
      }
    }
  };

  return (
    <div>
      <style jsx>{`
        .admin-question-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
          background: linear-gradient(45deg, #1e3a8a, #3b82f6, #60a5fa);
          background-size: 400% 400%;
          animation: gradient-shift 10s ease infinite;
          font-family: Arial, sans-serif;
          color: white;
        }

        .admin-question-container h1 {
          margin-bottom: 20px;
          font-size: 2rem;
        }

        .admin-question-container input {
          margin: 10px 0;
          padding: 10px;
          width: 80%;
          max-width: 400px;
          border: none;
          border-radius: 5px;
          outline: none;
          font-size: 16px;
          background-color: rgba(255, 255, 255, 0.8);
        }

        .admin-question-container input:focus {
          box-shadow: 0 0 10px #60a5fa;
        }

        .admin-question-container button {
          margin-top: 20px;
          padding: 10px 20px;
          font-size: 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          background-color: #2563eb;
          color: white;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }

        .admin-question-container button:hover {
          background-color: #1d4ed8;
          transform: scale(1.05);
        }

        .admin-question-container p {
          margin-top: 20px;
          font-size: 14px;
          font-weight: bold;
        }

        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
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
      `}</style>
      <div className="buttons-container">
        <button className="logout-button" onClick={handleLogout}>Logout</button>
        <button className="leaderboard-button" onClick={handleLeaderboard}>Leaderboard</button>
      </div>
      <div className="admin-question-container">
        <h1>Create New Question</h1>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter question"
        /><p>Question</p>
        {answers.map((answer, index) => (
          <input
            key={index}
            type="text"
            value={answer}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            placeholder={`Answer ${index + 1}`}
          />
        ))}
        <p>Answer</p>
        <input
          type="text"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          placeholder="Correct Answer"
        />
        <p>Correct Answer</p>
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          placeholder="Upload an image"
        />
        <p>Input Image</p>
        <button onClick={handleSubmit}>Submit</button>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default AdminQuestions;

