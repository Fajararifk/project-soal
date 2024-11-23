import { useState } from 'react';
import GradientLayout from '../components/GradientLayout';

export default function SignUp() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'SISWA' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      alert('All fields are required');
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      alert(data.message || 'User created successfully');
      window.location.href = '/signin'; // Redirect to sign-in page after successful signup
    } catch (error) {
      console.error('Error during sign up:', error);
      alert('An error occurred during sign up. Please try again.');
    }
  };

  return (
    <GradientLayout>
      <div className="signup-container">
        <form onSubmit={handleSubmit} className="signup-form">
          <h1 className="signup-title">Sign Up</h1>
          
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="signup-input"
          />
          
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="signup-input"
          />
          
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="signup-input"
          />
          
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="signup-input"
          >
            <option value="SISWA">Siswa</option>
          </select>
          
          <button type="submit" className="signup-button">Sign Up</button>
          
          <div className="signin-container">
            <button 
              type="button" 
              className="signin-link"
              onClick={() => window.location.href = '/signin'}
            >
              Already have an account? <span className="signin-link-text">Sign In</span>
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .signup-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #00c6ff, #0072ff); /* Gradient background */
        }

        .signup-form {
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

        .signup-title {
          text-align: center;
          font-size: 1.8rem;
          color: #0072ff;
          margin-bottom: 20px;
        }

        .signup-input {
          padding: 12px;
          font-size: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .signup-input:focus {
          border-color: #0072ff;
        }

        .signup-button {
          padding: 12px;
          background-color: #0072ff;
          color: white;
          font-size: 1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .signup-button:hover {
          background-color: #005bb5;
        }

        .signin-container {
          text-align: center;
          margin-top: 15px;
        }

        .signin-link {
          background: none;
          border: none;
          color: #0072ff;
          font-size: 1rem;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .signin-link:hover {
          color: #005bb5;
        }

        .signin-link-text {
          font-weight: bold;
        }
      `}</style>
    </GradientLayout>
  );
}
