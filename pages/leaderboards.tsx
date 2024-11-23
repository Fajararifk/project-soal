// pages/leaderboard.tsx
import { prisma } from "@/lib/prisma";
import { FaCrown } from "react-icons/fa";

const Leaderboard = ({ resultsWithUserInfo }: any) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/signin';
  };
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
`}

      </style>
      <div className="buttons-container">
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
        <div className="leaderboard-container">
          <h1 className="font-bold mb-4 text-center text-2xl uppercase">
            Leaderboards 🏆
          </h1>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Total Quiz Score</th>
                <th>Correct Answers</th>
                <th>Wrong Answers</th>
              </tr>
            </thead>
            <tbody>
              {resultsWithUserInfo.map((user: any, index: any) => (
                <tr key={user.userId} className={index < 3 ? "top-three" : ""}>
                  <td className="rank">{index + 1}</td>
                  <td className="name">
                    {user.name} {index === 0 && <FaCrown className="crown-icon" />}
                  </td>
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
  const quizResults = await prisma.quizResult.findMany({
    orderBy: { createdAt: 'desc' },
  });
console.log(quizResults);
  const latestResults = [];
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
    };
  });

  return {
    props: { resultsWithUserInfo },
  };
}

export default Leaderboard;
