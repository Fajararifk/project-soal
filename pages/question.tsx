import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { prisma } from '@/lib/prisma';

const AdminQuestions = () => {
  const [user, setUser] = useState<{ id: any; role: string; name: string } | null>(null);
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);

  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Redirect to login page if no token is found
      router.push('/signin');
      return;
    }

    const fetchUserRole = async () => {
      // Example API call to fetch user role
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem('token');
        router.push('/signin'); // Redirect to login if session is invalid
        return;
      }
      
      const data = await response.json();
      setUserRole(data.user.role);
      setUser(data.user)

      if (data.user.role === 'SISWA') {
        // Redirect to another page if the user is 'siswa'
        router.push('/signin');
      }
    };

    fetchUserRole();
  }, [router]);

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

  const handleDashboard = () => {
    //localStorage.removeItem('token');
    window.location.href = '/dashboard';
  };

  const handleLisQuestion = () => {
    //localStorage.removeItem('token');
    setIsModalOpen(true); // Open the modal when clicking "List Question"
    //window.location.href = '/listquestion';
  };

  const handleSubmit = async () => {
    const payload: {
      userId : number;
      question: string;
      answers: string[];
      correctAnswer: string;
      category: String;
    } = {
      userId: user?.id,
      question,
      answers,
      correctAnswer,
      category
    };
  
    // Handle the image
    if (image) {
      // Convert the image file to a Base64 string
      //contain the Base64 string including the data type prefix
        
        // Prepare the JSON payload
        const payload = {
          userId: user?.id,
          question,
          answers,
          correctAnswer,
          category,
          image // Send the Base64 string
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
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('/api/admin/categories');
      const categoryOptions = await response.json();
      console.log("categorynya adalah" + categoryOptions)
      setCategories(categoryOptions);
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal
  };
  const handleCategorySelect = () => {
    // Redirect to /listquestion with the selected category
    window.location.href = `/listquestion?category=${selectedCategory}&userId=${user?.id}`;
  };
  if (userRole === null) {
    return <p>Loading...</p>; // Loading state until user role is fetched
  }

  return (
    <div>
      <style jsx>{`
      .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Dark background with some transparency */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

/* Modal Container */
.modal {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  color: #333;
}

/* Modal Title */
.modal h2 {
  text-align: center;
  font-size: 1.5em;
  margin-bottom: 20px;
  color: #007BFF;
}

/* Form Elements */
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
}

/* Buttons */
button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type="button"] {
  background-color: #dc3545; /* Red color for cancel */
  color: white;
}

button[type="button"]:hover {
  background-color: #c82333;
}

button[type="submit"] {
  background-color: #28a745; /* Green color for submit */
  color: white;
}

button[type="submit"]:hover {
  background-color: #218838; /* Darker green on hover */
}
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


        .dashboard-button {
          background-color: #007bff; /* Blue color */
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s ease;
        }

        .dashboard-button:hover {
          background-color: lightblue; /* Darker blue on hover */
        }


        .listquestion-button {
          background-color: #007bff; /* Blue color */
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s ease;
        }

        .listquestion-button:hover {
          background-color: lightblue; /* Darker blue on hover */
        } 

        .admin-question-container textarea {
          margin: 10px 0;
          padding: 10px;
          width: 80%;
          max-width: 400px;
          border: none;
          border-radius: 5px;
          outline: none;
          font-size: 16px;
          background-color: rgba(255, 255, 255, 0.8);
          resize: none; /* Prevents resizing if you want to keep it fixed */
        }

        .admin-question-container textarea:focus {
          box-shadow: 0 0 10px #60a5fa;
        }
      `}</style>
      <div className="buttons-container">
        <button className="logout-button" onClick={handleLogout}>Logout</button>
        <button className="leaderboard-button" onClick={handleLeaderboard}>Leaderboard</button>
        <button className="dashboard-button" onClick={handleDashboard}>Dashboard</button>
        <button className="listquestion-button" onClick={handleLisQuestion}>List Question</button>
        {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Select Category</h2>
            <select value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">Select a category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button onClick={handleCategorySelect}>Go to List of Questions</button>
            <button onClick={handleModalClose}>Cancel</button>
          </div>
        </div>
      )}
      </div>
      <div className="admin-question-container">
        <h1>Create New Question</h1>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter question"
          rows={4} // Adjust the rows based on the desired height
          style={{ width: '100%', resize: 'both', minHeight: '100px' }} // Style for flexibility
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
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
        />
        <p>Category</p>
        <button onClick={handleSubmit}>Submit</button>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default AdminQuestions;

