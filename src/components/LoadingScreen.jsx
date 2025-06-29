import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LoadingScreen.css';

const LoadingScreen = ({ onComplete }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing LYNC Experience...');
  const [showMainAnimation, setShowMainAnimation] = useState(true);
  const [particles, setParticles] = useState([]);
  const [typedText, setTypedText] = useState('');
  const [currentPhase, setCurrentPhase] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [soundWaves, setSoundWaves] = useState([]);

  const loadingSteps = [
    { progress: 15, text: 'Initializing quantum processors...', phase: 0 },
    { progress: 30, text: 'Connecting to neural networks...', phase: 1 },
    { progress: 45, text: 'Loading AI commerce engine...', phase: 2 },
    { progress: 60, text: 'Synchronizing real-time data...', phase: 3 },
    { progress: 75, text: 'Optimizing user experience...', phase: 4 },
    { progress: 90, text: 'Activating premium features...', phase: 5 },
    { progress: 100, text: 'Welcome to the future of shopping!', phase: 6 }
  ];

  const typewriterText = "L Y N C";
  const taglines = [
    "The Future of E-Commerce",
    "AI-Powered Shopping Experience", 
    "Premium • Intelligent • Seamless",
    "Your Digital Shopping Revolution"
  ];

  useEffect(() => {
    // Generate dynamic particle system
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 2,
      color: i % 4 === 0 ? '#fff' : i % 4 === 1 ? '#667eea' : i % 4 === 2 ? '#764ba2' : '#f093fb'
    }));
    setParticles(newParticles);

    // Generate sound wave visualization
    const waves = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      height: Math.random() * 40 + 10,
      delay: i * 0.1,
      duration: Math.random() * 1.5 + 1
    }));
    setSoundWaves(waves);

    // Show logo after initial delay
    setTimeout(() => setShowLogo(true), 500);
    setTimeout(() => setShowParticles(true), 1000);
  }, []);

  // Typewriter effect for LYNC text
  useEffect(() => {
    if (!showLogo) return;
    
    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex <= typewriterText.length) {
        setTypedText(typewriterText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 200);

    return () => clearInterval(typeInterval);
  }, [showLogo]);

  // Loading progress simulation with phases
  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];
        setLoadingProgress(step.progress);
        setLoadingText(step.text);
        setCurrentPhase(step.phase);
        currentStep++;
      } else {
        clearInterval(interval);
        // Enhanced exit sequence
        setTimeout(() => {
          setShowMainAnimation(false);
          setTimeout(onComplete, 1200); // Wait for elaborate exit animation
        }, 1500);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {showMainAnimation && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.2, 
            rotateX: 90,
            filter: "blur(20px)"
          }}
          transition={{ 
            duration: 1.2, 
            ease: "easeInOut",
            exit: { duration: 1.2, ease: "easeInOut" }
          }}
        >
          {/* Enhanced Animated Background with Multiple Layers */}
          <div className="loading-background">
            <motion.div 
              className="gradient-orb orb-1"
              animate={{
                x: [0, 100, -50, 0],
                y: [0, -100, 50, 0],
                scale: [1, 1.3, 0.8, 1]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="gradient-orb orb-2"
              animate={{
                x: [0, -120, 80, 0],
                y: [0, 80, -60, 0],
                scale: [1, 0.7, 1.4, 1]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
            <motion.div 
              className="gradient-orb orb-3"
              animate={{
                x: [0, 60, -90, 0],
                y: [0, -80, 40, 0],
                scale: [1, 1.2, 0.9, 1]
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 4
              }}
            />

            {/* New Neural Network Pattern */}
            <div className="neural-network">
              {Array.from({ length: 15 }, (_, i) => (
                <motion.div
                  key={i}
                  className="neural-node"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [0.5, 1.5, 0.5],
                    opacity: [0.3, 0.9, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </div>

          {/* Enhanced Floating Particles System */}
          <AnimatePresence>
            {showParticles && (
              <div className="particles-container">
                {particles.map((particle) => (
                  <motion.div
                    key={particle.id}
                    className="particle"
                    style={{
                      left: `${particle.x}%`,
                      top: `${particle.y}%`,
                      width: `${particle.size}px`,
                      height: `${particle.size}px`,
                      backgroundColor: particle.color,
                      boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, particle.opacity, 0],
                      y: [0, -50, -100],
                      x: [0, Math.random() * 40 - 20, Math.random() * 80 - 40],
                      scale: [0, 1, 0],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: particle.duration,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: particle.delay
                    }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Sound Wave Visualization */}
          <div className="sound-waves">
            {soundWaves.map((wave) => (
              <motion.div
                key={wave.id}
                className="sound-bar"
                style={{ height: `${wave.height}px` }}
                animate={{
                  scaleY: [1, 2, 0.5, 1.5, 1],
                  opacity: [0.4, 1, 0.6, 0.9, 0.4]
                }}
                transition={{
                  duration: wave.duration,
                  repeat: Infinity,
                  delay: wave.delay,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Main Content Container */}
          <div className="loading-content">
            {/* Logo with Advanced Animation */}
            <AnimatePresence>
              {showLogo && (
                <motion.div
                  className="logo-container"
                  initial={{ 
                    scale: 0, 
                    rotateX: -90, 
                    opacity: 0,
                    filter: "blur(20px)"
                  }}
                  animate={{ 
                    scale: 1, 
                    rotateX: 0, 
                    opacity: 1,
                    filter: "blur(0px)"
                  }}
                  transition={{ 
                    duration: 1.5, 
                    ease: [0.34, 1.56, 0.64, 1], // Custom cubic-bezier for back effect
                    delay: 0.3
                  }}
                >
                  <div className="logo-wrapper">
                    <motion.div
                      className="logo-text"
                      animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                        textShadow: [
                          '0 0 10px rgba(255,255,255,0.5)',
                          '0 0 20px rgba(102,126,234,0.8)',
                          '0 0 30px rgba(118,75,162,0.8)',
                          '0 0 20px rgba(102,126,234,0.8)',
                          '0 0 10px rgba(255,255,255,0.5)'
                        ]
                      }}
                      transition={{
                        backgroundPosition: {
                          duration: 4,
                          repeat: Infinity,
                          ease: "linear"
                        },
                        textShadow: {
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      }}
                    >
                      {typedText}
                      <motion.span
                        className="cursor"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        |
                      </motion.span>
                    </motion.div>
                    
                    <motion.div
                      className="logo-glow"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.2, 0.8, 0.2],
                        rotate: [0, 180, 360]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />

                    {/* Orbiting Elements */}
                    <div className="orbiting-elements">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="orbit-item"
                          animate={{
                            rotate: [0, 360]
                          }}
                          transition={{
                            duration: 8 + i * 2,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 1
                          }}
                        >
                          <div className="orbit-dot" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dynamic Tagline */}
            <motion.div
              className="tagline-container"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2 }}
            >
              <motion.p
                className="tagline"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {taglines[currentPhase % taglines.length]}
              </motion.p>
            </motion.div>

            {/* Enhanced Loading Progress */}
            <motion.div
              className="progress-container"
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 2.5 }}
            >
              <div className="progress-bar-container">
                <div className="progress-bar-bg">
                  <motion.div
                    className="progress-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${loadingProgress}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                  <motion.div
                    className="progress-shimmer"
                    animate={{
                      x: ['-100%', '200%']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Progress Particles */}
                  <motion.div
                    className="progress-particles"
                    style={{ width: `${loadingProgress}%` }}
                  >
                    {Array.from({ length: 8 }, (_, i) => (
                      <motion.div
                        key={i}
                        className="progress-particle"
                        animate={{
                          y: [0, -10, 0],
                          opacity: [0.3, 1, 0.3]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </motion.div>
                </div>
              </div>
              
              <div className="progress-info">
                <motion.span
                  className="progress-text"
                  key={loadingText}
                  initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  {loadingText}
                </motion.span>
                <motion.span 
                  className="progress-percentage"
                  animate={{
                    scale: loadingProgress === 100 ? [1, 1.2, 1] : 1,
                    color: loadingProgress === 100 ? ['#fff', '#4ade80', '#fff'] : '#fff'
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: loadingProgress === 100 ? 3 : 0
                  }}
                >
                  {loadingProgress}%
                </motion.span>
              </div>
            </motion.div>

            {/* Enhanced Feature Icons with 3D Effects */}
            <motion.div
              className="features-preview"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 3 }}
            >
              {[
                { icon: '🛍️', label: 'AI Shopping', color: '#667eea' },
                { icon: '⚡', label: 'Ultra Fast', color: '#f093fb' },
                { icon: '🔒', label: 'Quantum Secure', color: '#4ade80' },
                { icon: '🌐', label: 'Global Network', color: '#fbbf24' },
                { icon: '🤖', label: 'Smart AI', color: '#8b5cf6' },
                { icon: '📱', label: 'Omnichannel', color: '#06b6d4' }
              ].map((feature, index) => (
                <motion.div
                  key={feature.label}
                  className="feature-item"
                  initial={{ 
                    scale: 0, 
                    opacity: 0,
                    rotateX: -90
                  }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    rotateX: 0
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 3.5 + index * 0.15,
                    ease: [0.34, 1.56, 0.64, 1] // Custom cubic-bezier for back effect
                  }}
                  whileHover={{ 
                    scale: 1.15,
                    rotateY: 15,
                    z: 50
                  }}
                  style={{
                    background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}40)`
                  }}
                >
                  <motion.div 
                    className="feature-icon"
                    animate={{
                      rotateY: [0, 360]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                      delay: index * 0.5
                    }}
                  >
                    {feature.icon}
                  </motion.div>
                  <div className="feature-label">{feature.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Enhanced Loading Spinner with Multiple Rings */}
          <motion.div
            className="loading-spinner-container"
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <motion.div
              className="spinner-ring ring-1"
              animate={{ 
                rotate: -360,
                scale: [1, 1.1, 1]
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            <motion.div
              className="spinner-ring ring-2"
              animate={{ 
                rotate: 360,
                scale: [1, 0.9, 1]
              }}
              transition={{
                rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
                scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            <motion.div
              className="spinner-ring ring-3"
              animate={{ 
                rotate: -360,
                scale: [1, 1.2, 1]
              }}
              transition={{
                rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            
            {/* Central Core */}
            <motion.div
              className="spinner-core"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* Enhanced Version Info with Floating Effect */}
          <motion.div
            className="version-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: [20, 15, 20],
            }}
            transition={{
              opacity: { duration: 1, delay: 4 },
              y: { 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 4
              }
            }}
          >
            <motion.span
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              LYNC v3.0 • Neural Commerce Engine • Enterprise Edition
            </motion.span>
          </motion.div>

          {/* Achievement Badges */}
          <motion.div
            className="achievement-badges"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 4.5 }}
          >
            {['🏆 #1 Platform', '⭐ 5.0 Rating', '🚀 10M+ Users'].map((badge, i) => (
              <motion.div
                key={i}
                className="badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 5 + i * 0.2,
                  ease: [0.34, 1.56, 0.64, 1] // Custom cubic-bezier for back effect
                }}
              >
                {badge}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
