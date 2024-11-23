import React from 'react';

const GradientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #00c6ff, #0072ff)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
      }}
    >
      {children}
    </div>
  );
};

export default GradientLayout;
