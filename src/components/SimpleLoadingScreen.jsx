import { useState, useEffect } from 'react';

const SimpleLoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      color: 'white',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        fontSize: '3rem',
        fontWeight: 'bold',
        marginBottom: '2rem',
        textShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        LYNC
      </div>
      
      <div style={{
        width: '300px',
        height: '6px',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '10px',
        overflow: 'hidden',
        marginBottom: '1rem'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #fff, #f093fb)',
          borderRadius: '10px',
          transition: 'width 0.3s ease'
        }} />
      </div>
      
      <div style={{
        fontSize: '1.2rem',
        opacity: 0.9
      }}>
        Loading amazing experience... {progress}%
      </div>
    </div>
  );
};

export default SimpleLoadingScreen;
