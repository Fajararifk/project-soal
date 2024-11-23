import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(to bottom right, #6A5ACD, #48D1CC)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Welcome to the App</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
        Ujian Tengah Semester Pendidikan Olahraga
      </p>
      <div>
        <Link
          href="/signin"
          style={{
            marginRight: "1rem",
            padding: "0.5rem 1rem",
            textDecoration: "none",
            backgroundColor: "#4CAF50",
            color: "white",
            borderRadius: "5px",
          }}
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          style={{
            padding: "0.5rem 1rem",
            textDecoration: "none",
            backgroundColor: "#2196F3",
            color: "white",
            borderRadius: "5px",
          }}
        >
          Sign Up
        </Link>
      </div>
    </main>
  );
}
