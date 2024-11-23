import { useEffect, useState } from 'react';

const About = () => {
  const [user, setUser] = useState<{ role: string } | null>(null);

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
      if (data.user.role !== 'ADMIN') {
        alert('Access denied');
        window.location.href = '/dashboard';
        return;
      }

      setUser(data.user);
    };

    fetchUser();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <h1>About Page (Admin Only)</h1>
      <p>Only admins can see this page.</p>
    </div>
  );
};

export default About;
