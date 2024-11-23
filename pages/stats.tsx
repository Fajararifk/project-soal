// import StatCard from "@/components/StatCard";
// import { useEffect, useState } from "react";

// const Stats = async () => {
//     const [user, setUser] = useState<any>(null);  // State for user data
//   const [loading, setLoading] = useState<boolean>(true);  // State for loading
//   const [error, setError] = useState<string | null>(null);  // State for error
//   useEffect(() => {
//         const fetchUserData = async () => {
//           try {
//             const response = await fetch('/api/auth/fetchUser');
//             if (!response.ok) {
//               throw new Error('Failed to fetch user');
//             }
    
//             const data = await response.json();
//             setUser(data.user);  // Set the user data to state
//           } catch (err: any) {
//             setError(err.message);  // Set the error message
//           } finally {
//             setLoading(false);  // Set loading to false when done
//           }
//         };
    
//         fetchUserData();  // Call the function to fetch user data
//       }, []);  // Empty dependency array to run this effect only once when the component mounts
    
//   return (
//     <div className="py-20">
//       <div className="text-center mb-10 text-2xl uppercase">
//         <h1>{user?.data?.user.username} Stats 📊</h1>
//       </div>
//       <div className="max-w-[1500px] mx-auto w-[90%] grid sm:grid-cols-3 gap-10 justify-center">
//         <StatCard
//           title="Total Points"
//           value={
//             user?.data?.quizResults[0].quizScore
//           }
//         />
//         <StatCard
//           title="Correct Answers"
//           value={
//             user?.data?.quizResults[0].correctAnswers
//           }
//         />
//         <StatCard
//           title="Wrong Answers"
//           value={
//             user?.data?.quizResults[0].wrongAnswers
//           }
//         />
//       </div>
//     </div>
//   );
// };

// export default Stats;

