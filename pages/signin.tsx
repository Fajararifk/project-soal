import { useState } from 'react';
import GradientLayout from '../components/GradientLayout';

export default function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      alert('Login successful');
      window.location.href = '/dashboard';
    } else {
      alert(data.message || 'Login failed');
    }
  };

  return (
    <GradientLayout>
      <div className="signin-container">
        <form onSubmit={handleSubmit} className="signin-form">
          <h1 className="signin-title">Sign In</h1>
          
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="signin-input"
          />
          
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="signin-input"
          />
          
          <button type="submit" className="signin-button">Sign In</button>
          
          <div className="signup-container">
            <button 
              type="button" 
              className="signup-link"
              onClick={() => window.location.href = '/signup'}
            >
              Don't have an account? <span className="signup-link-text">Sign Up</span>
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .signin-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #00c6ff, #0072ff); /* Gradient background */
        }

        .signin-form {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .signin-title {
          text-align: center;
          font-size: 1.8rem;
          color: #0072ff;
          margin-bottom: 20px;
        }

        .signin-input {
          padding: 12px;
          font-size: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .signin-input:focus {
          border-color: #0072ff;
        }

        .signin-button {
          padding: 12px;
          background-color: #0072ff;
          color: white;
          font-size: 1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .signin-button:hover {
          background-color: #005bb5;
        }

        .signup-container {
          text-align: center;
          margin-top: 15px;
        }

        .signup-link {
          background: none;
          border: none;
          color: #0072ff;
          font-size: 1rem;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .signup-link:hover {
          color: #005bb5;
        }

        .signup-link-text {
          font-weight: bold;
        }
      `}</style>
    </GradientLayout>
  );
}
