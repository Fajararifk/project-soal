// pages/leaderboard.tsx
import { prisma } from "@/lib/prisma";
import { FaCrown } from "react-icons/fa";
import { useState, useEffect } from 'react';


const Leaderboard = ({ resultsWithUserInfo }: any) => {
  const [user, setUser] = useState<{ id: any; role: string; name: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredResults, setFilteredResults] = useState(resultsWithUserInfo);
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/signin';
  };
  
  const handleQuestion = () => {
    // Logic to open question management, visible only for admins
    window.location.href = '/question';  // Adjust URL as necessary
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
  
  useEffect(() => {
    if (selectedCategory === "") {
      setFilteredResults(resultsWithUserInfo);
    } else {
      const filtered = resultsWithUserInfo.filter(
        (result: any) => result.category === selectedCategory
      );
      setFilteredResults(filtered);
    }
  }, [selectedCategory, resultsWithUserInfo]);

  const uniqueCategories = Array.from(
    new Set(resultsWithUserInfo.map((result: any) => result.category))
  );

  return (
    <div>
      <style jsx>{`/* leaderboard.css */
.leaderboard-container {
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
}

.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.leaderboard-table th,
.leaderboard-table td {
  padding: 10px;
  text-align: center;
  border: 1px solid #ddd;
}

.leaderboard-table th {
  background-color: #4caf50;
  color: white;
  font-weight: bold;
}

.leaderboard-table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.leaderboard-table tbody tr:hover {
  background-color: #ddd;
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
`}

      </style>
      <div className="buttons-container">
        <button className="logout-button" onClick={handleLogout}>Logout</button>
        {user?.role === 'ADMIN' && (
          <button className="question-button" onClick={handleQuestion}>Manage Questions</button>
        )}
      </div>
        <div className="leaderboard-container">
          <h1 className="font-bold mb-4 text-center text-2xl uppercase">
            Leaderboards 🏆
          </h1>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {uniqueCategories.map((category:any) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Category Soal</th>
                <th>Total Quiz Score</th>
                <th>Correct Answers</th>
                <th>Wrong Answers</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((user, index) => (
                <tr key={user.userId} className={index < 3 ? "top-three" : ""}>
                  <td className="rank">{index + 1}</td>
                  <td className="name">
                    {user.name} {index === 0 && <FaCrown className="crown-icon" />}
                  </td>
                  <td>{user.category}</td>
                  <td>{user.quizScore}</td>
                  <td>{user.correctAnswers}</td>
                  <td>{user.wrongAnswers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
};

export async function getServerSideProps() {
  
  const users = await prisma.user.findMany();
  const quizResults  = await prisma.quizResult.findMany({
    where: {
      counterInsert: {
        lt: 2, // 'lt' stands for "less than"
      },
    },  
    orderBy: { createdAt: 'desc' },
  });
  const latestResults : any = [];
  const seenUserIds = new Set();
  
  for (const result of quizResults) {
    if (!seenUserIds.has(result.userId)) {
      latestResults.push(result);
      seenUserIds.add(result.userId);
    }
  }

  const resultsWithUserInfo = latestResults.map((quiz) => {
    const user = users.find((user) => user.id === quiz.userId);
    return {
      userId: quiz.userId,
      name: user?.name,
      email: user?.email,
      quizScore: quiz.quizScore,
      correctAnswers: quiz.correctAnswers,
      wrongAnswers: quiz.wrongAnswers,
      category: quiz.category,
    };
  }).sort((a, b) => b.quizScore - a.quizScore); ;

  return {
    props: { resultsWithUserInfo },
  };
}

export default Leaderboard;
