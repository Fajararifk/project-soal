// import Quizz from "../components/Quiz";
// import { client } from "@/sanity/lib/client";
// import { useEffect, useState } from "react";

// export const dynamic = "force-dynamic";

// async function getData() {
//   const query = `*[_type == "questions"]{
//     question,
//     answers,
//     correctAnswer,
//     questionImage,
//   }`;

//   const data = await client.fetch(query);
//   //console.log(data);
//   return data;
// }

// const Quiz = async () => {
//   //const questions = await getData();
//   const [user, setUser] = useState<any>(null);  // State for user data
//   const [loading, setLoading] = useState<boolean>(true);  // Loading state
//   const [error, setError] = useState<string | null>(null);  // Error state
//   const [questions, setQuestions] = useState<any>([]);  // State for questions

//   useEffect(() => {
//     // Fetch user data from the API route
//     const fetchUser = async () => {
//       try {
//         const response = await fetch('/api/auth/fetchUser');
//         if (!response.ok) {
//           throw new Error('Failed to fetch user');
//         }

//         const data = await response.json();
//         setUser(data.user);  // Set the user data to state
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();  // Call the function to fetch user data
//     getData().then(setQuestions);  // Fetch questions data
//   }, []);
//   const userId = user?.data.user.id;
//   return (
//     <>
//       <Quizz questions={questions} userId={userId} />
//     </>
//   );
// };

// export default Quiz;
