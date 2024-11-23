// pages/leaderboard.tsx
import { prisma } from "@/lib/prisma";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';


const ListQuestion = ({ quizResults ,categoryOptions,category, userId}: any) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(category || '');
  const [user, setUser] = useState<{ id: any; role: string; name: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [message, setMessage] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userIds, setUserIds] = useState<number | null>(userId || 0);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    debugger;
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    // Reload the page with the selected category
    window.location.href = `/listquestion?category=${newCategory}&userId=${userIds}`;
  };
  type Quiz = {
    id: string;
    question: string;
    answers: string[];
    correctAnswer: string;
  };
const handleEdit = (quiz) => {
  setCurrentQuiz(quiz);
  setIsEditing(true);
};

const handleSave = async (e) => {
  e.preventDefault();
  

  const response = await fetch('/api/admin/quizupdate', {
    method: 'POST',
    body: JSON.stringify(currentQuiz),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
      setMessage('The question has been successfully updated!!');
      window.location.reload();
  } else {
    setMessage('Something went wrong.');
  }
  // Save the updated quiz to the server/database
  console.log("Updated Quiz:", currentQuiz);
  setIsEditing(false);
};

const handleCancel = () => {
  setIsEditing(false);
};


  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/signin';
  };
  
  const handleQuestion = () => {
    // Logic to open question management, visible only for admins
    window.location.href = '/question';  // Adjust URL as necessary
  };
  const handleLeaderboard = () => {
    // Logic to open question management, visible only for admins
    window.location.href = '/leaderboards';  // Adjust URL as necessary
  };

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


    fetchUser();
  }, []);

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
      debugger;
      setUserRole(data.user.role);
      setUserIds(data.user.id);

      if (data.user.role === 'SISWA') {
        // Redirect to another page if the user is 'siswa'
        router.push('/signin');
      }
    };

    fetchUserRole();
  }, [router]);
  
  if (userRole === null) {
    return <p>Loading...</p>; // Loading state until user role is fetched
  }
  return (
    <div>
      <style jsx>{`/* leaderboard.css */

      select {
  width: 100%; /* Adjust to fit your layout */
  max-width: 300px; /* Limit the maximum width */
  padding: 10px 15px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s, box-shadow 0.3s;
  cursor: pointer;
  appearance: none; /* Remove default browser styles */
}

/* Add a dropdown arrow icon */
select::-ms-expand {
  display: none;
}

/* Hover and focus styles */
select:hover {
  border-color: #007bff; /* Add a blue border on hover */
}

select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

/* Option styles */
select option {
  padding: 8px;
  background-color: #ffffff;
  color: #333;
  font-size: 16px;
  font-weight: 400;
}

/* Disabled state for the dropdown */
select:disabled {
  background-color: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}
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
  color: #007BFF; /* Blue color */
}

/* Form Elements */
form div {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  color: #444;
}

input[type="text"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
}

input[type="text"]:focus {
  border-color: #007BFF; /* Highlight border on focus */
  outline: none;
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

button[type="submit"] {
  background-color: #28a745; /* Green color for submit */
  color: white;
}

button[type="submit"]:hover {
  background-color: #218838; /* Darker green on hover */
}

button[type="button"] {
  background-color: #dc3545; /* Red color for cancel */
  color: white;
}

button[type="button"]:hover {
  background-color: #c82333; /* Darker red on hover */
}


.listquestion-container {
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  background-color: #e6f7ff; /* Light blue */
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #0056b3; /* Darker blue */
}

.listquestion-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

.listquestion-table th,
.listquestion-table td {
  padding: 10px;
  text-align: center;
  border: 1px solid #ddd;
}

.listquestion-table th {
  background-color: #007bff; /* Medium blue */
  color: white;
  font-weight: bold;
}

.listquestion-table tbody tr:nth-child(even) {
  background-color: #f0f8ff; /* Very light blue */
}

.listquestion-table tbody tr:hover {
  background-color: #cce7ff; /* Hover effect light blue */
}

.rank {
  font-size: 1.2em;
  font-weight: bold;
}

.name {
  font-size: 1.1em;
  font-weight: normal;
  position: relative;
}

.top-three {
  background-color: #ffd700;
}

.crown-icon {
  position: absolute;
  top: -5px;
  right: -25px;
  color: #ffcc00;
  font-size: 1.3em;
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

.listquestion-button {
  background-color: #007bff; /* Blue */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.listquestion-button:hover {
  background-color: #0056b3; /* Darker blue on hover */
}
`}</style>
 {/* Modal */}
   
      {message && <div className="message">{message}</div>}
      {isEditing && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Question</h2>
            <form onSubmit={handleSave}>
              <div>
                <label>Question:</label>
                <input
                  type="text"
                  value={currentQuiz?.question || ""}
                  onChange={(e) =>
                    currentQuiz &&
                    setCurrentQuiz({
                      ...currentQuiz,
                      question: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label>Answers (comma-separated):</label>
                <input
                  type="text"
                  value={currentQuiz?.answers?.join(", ") || ""}
                  onChange={(e) =>
                    currentQuiz &&
                    setCurrentQuiz({
                      ...currentQuiz, // Spread existing properties
                      answers: e.target.value.split(",").map((answer) => answer.trim()), // Update `answers` as an array
                    })
                  }
                />
              </div>
              <div>
                <label>Correct Answer:</label>
                <input
                  type="text"
                  value={currentQuiz?.correctAnswer || ""}
                  onChange={(e) =>
                    currentQuiz &&
                    setCurrentQuiz({ ...currentQuiz, correctAnswer: e.target.value })
                  }
                />
              </div>
              <button type="submit">Save</button>
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="buttons-container">
        <button className="logout-button" onClick={handleLogout}>Logout</button>
        {user?.role === 'ADMIN' && (
          <button className="question-button" onClick={handleQuestion}>Manage Questions</button>
        )}
        {user?.role === 'ADMIN' && (
          <button className="listquestion-button" onClick={handleLeaderboard}>Leaderboard</button>
        )}
        
      </div>
      
        <div className="listquestion-container">
          <h1 className="font-bold mb-4 text-center text-2xl uppercase">
            List Of Questions 
          </h1>
          <div className="category-filter">
        {/* <label htmlFor="category">Category : </label> */}
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">Select a category</option>
          {categoryOptions.map((cat: string, index: number) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
          <table className="listquestion-table">
            <thead>
              <tr>
                <th>Edit</th> 
                <th>No</th>
                <th>Question</th>
                <th>Answers</th>
                <th>Correct Answers</th>
              </tr>
            </thead>
            <tbody>
              {quizResults.map((quiz, index) => (
                <tr key={quiz.id}>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(quiz)}
                    >
                      Edit
                    </button>
                  </td>
                  <td className="rank">{index + 1}</td>
                  <td>{quiz.question}</td>
                  <td>{quiz.answers.join(", ")}</td>
                  <td>{quiz.correctAnswer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
};

type QuizResult = {
  userId: number;
  quizScore: number;
  correctAnswers: number;
  wrongAnswers: number;
  createdAt: Date;
};
export async function getServerSideProps(context) {
  debugger;
  const { category, userId } = context.query;
  const categories = await prisma.question.findMany({
    select: { category: true },
    distinct: ['category'], // Ensure categories are distinct
  });

  console.log("cariuserId")
  console.log(category)
  const categoryOptions = categories.map((item) => item.category);
  const quizResults  = await prisma.question.findMany({
    where: {
      AND: [
        ...(category ? [{ category }] : []), // Filter by category if category exists
        ...(userId ? [{ userId: parseInt(userId) }] : []), // Filter by userId if userId exists
      ],
    },

    select: {
      id: true,
      userId: true,
      question: true,
      answers: true,
      correctAnswer: true,
      category: true
    },
  });
  console.log(userId)
console.log(quizResults);
  return {
    props: { quizResults , categoryOptions , category: category || '', userId: userId || ''},
  };
}



export default ListQuestion;
