import React, { useState, useEffect, useRef } from 'react';
import MetallicPaint from './Metallic_Paint';
import momoLogo from '../assets/momo-logo.svg';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

const LoadingScreen = ({ onComplete }) => {
    const [phase, setPhase] = useState('logo'); // 'logo' -> 'text' -> 'exit'
    const [isVisible, setIsVisible] = useState(true);
    const [logoScale, setLogoScale] = useState(0);
    const [textReveal, setTextReveal] = useState(0);
    const [exitTransition, setExitTransition] = useState(false);
    const [progress, setProgress] = useState(0);
    const hasStarted = useRef(false);

    const brandText = "MoMo Pro";
    const tagline = "Premium Gaming Experience";

    useEffect(() => {
        if (hasStarted.current) return;
        hasStarted.current = true;

        document.body.classList.remove('content-loaded');

        // Animate progress bar smoothly using requestAnimationFrame
        const startTime = performance.now();
        const duration = 3500; // 3.5 seconds for progress

        const animateProgress = (currentTime) => {
            const elapsed = currentTime - startTime;
            const newProgress = Math.min((elapsed / duration) * 100, 100);
            setProgress(newProgress);

            if (newProgress < 100) {
                requestAnimationFrame(animateProgress);
            }
        };

        requestAnimationFrame(animateProgress);

        // Phase 1: Logo animation (0.3s)
        setTimeout(() => {
            setLogoScale(1);
        }, 300);

        // Phase 2: Text reveal starts (1.5s)
        setTimeout(() => {
            setPhase('text');
            let charIndex = 0;
            const textInterval = setInterval(() => {
                charIndex++;
                setTextReveal(charIndex);
                if (charIndex >= brandText.length) {
                    clearInterval(textInterval);
                }
            }, 120);
        }, 1500);

        // Phase 3: Exit transition (4s total display)
        setTimeout(() => {
            setPhase('exit');
            setExitTransition(true);
            document.body.classList.add('content-loaded');

            setTimeout(() => {
                setIsVisible(false);
                if (onComplete) onComplete();
            }, 1000);
        }, 4000);

    }, [onComplete]);

    if (!isVisible) return null;

    return (
        <div
            className="loading-screen"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(145deg, #0d0d0d 0%, #1a1a2e 40%, #16213e 100%)',
                overflow: 'hidden',
                transform: exitTransition ? 'scale(1.2)' : 'scale(1)',
                opacity: exitTransition ? 0 : 1,
                transition: 'transform 1.2s cubic-bezier(0.76, 0, 0.24, 1), opacity 1s ease-out',
            }}
        >
            {/* Luxury ambient glow effects */}
            <div
                style={{
                    position: 'absolute',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 60%)',
                    borderRadius: '50%',
                    filter: 'blur(100px)',
                    top: '10%',
                    left: '20%',
                    animation: 'float 8s ease-in-out infinite',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(239, 68, 68, 0.04) 0%, transparent 60%)',
                    borderRadius: '50%',
                    filter: 'blur(80px)',
                    bottom: '10%',
                    right: '15%',
                    animation: 'float 10s ease-in-out infinite reverse',
                }}
            />

            {/* Subtle gold accent lines */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '1px',
                height: '60px',
                background: 'linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.3), transparent)',
                opacity: phase !== 'logo' ? 1 : 0,
                transition: 'opacity 1s ease',
            }} />

            {/* Main Content */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2.5rem',
            }}>
                {/* MetallicPaint Logo */}
                <div
                    style={{
                        position: 'relative',
                        width: '180px',
                        height: '180px',
                        transform: `scale(${logoScale})`,
                        opacity: logoScale,
                        transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 1s ease-out',
                    }}
                >
                    <MetallicPaint
                        imageSrc={momoLogo}
                        seed={42}
                        scale={4}
                        patternSharpness={1}
                        noiseScale={0.5}
                        speed={0.2}
                        liquid={0.8}
                        mouseAnimation={false}
                        brightness={2.2}
                        contrast={0.6}
                        refraction={0.01}
                        blur={0.012}
                        chromaticSpread={2}
                        fresnel={1.2}
                        angle={0}
                        waveAmplitude={1}
                        distortion={0.8}
                        contour={0.15}
                        lightColor="#ffffff"
                        darkColor="#1a1a1a"
                        tintColor="#ef4444"
                    />
                </div>

                {/* Brand Text with luxury styling */}
                <div style={{ overflow: 'hidden', height: '70px' }}>
                    <h1
                        style={{
                            fontSize: '3.5rem',
                            fontWeight: '700',
                            // letterSpacing: '0.1em',
                            margin: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '0',
                            transform: phase === 'logo' ? 'translateY(70px)' : 'translateY(0)',
                            transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            fontFamily: "'Montserrat', sans-serif",
                        }}
                    >
                        {brandText.split('').map((char, index) => (
                            <span
                                key={index}
                                style={{
                                    display: 'inline-block',
                                    color: char === ' ' ? 'transparent' : (index >= 5 ? '#ef4444' : '#ffffff'),
                                    opacity: textReveal > index ? 1 : 0,
                                    transform: textReveal > index ? 'translateY(0)' : 'translateY(30px)',
                                    transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.08}s`,
                                    width: char === ' ' ? '20px' : 'auto',
                                    textShadow: index >= 5 ? '0 0 30px rgba(239, 68, 68, 0.4)' : 'none',
                                }}
                            >
                                {char}
                            </span>
                        ))}
                    </h1>
                </div>

                {/* Tagline */}
                <p
                    style={{
                        fontSize: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.4)',
                        letterSpacing: '0.4em',
                        textTransform: 'uppercase',
                        margin: 0,
                        fontWeight: '300',
                        opacity: textReveal >= brandText.length ? 1 : 0,
                        transform: textReveal >= brandText.length ? 'translateY(0)' : 'translateY(15px)',
                        transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s',
                    }}
                >
                    {tagline}
                </p>

                {/* MUI Linear Progress Bar with Label */}
                <Box sx={{ width: '350px', marginTop: '2rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 3,
                                        background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.7), #ef4444)',
                                        boxShadow: '0 0 15px rgba(239, 68, 68, 0.5)',
                                    },
                                }}
                            />
                        </Box>
                        <Box sx={{ minWidth: 40 }}>
                            <span style={{
                                fontSize: '0.75rem',
                                color: 'rgba(255, 255, 255, 0.5)',
                                fontFamily: "'Montserrat', sans-serif",
                            }}>
                                {`${Math.round(progress)}%`}
                            </span>
                        </Box>
                    </Box>
                </Box>
            </div>

            {/* Bottom accent line */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: phase !== 'logo' ? '100px' : '0px',
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent)',
                    transition: 'width 1s ease',
                }}
            />

            {/* CSS Animations */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }

                .loading-screen {
                    will-change: transform, opacity;
                }

                body:not(.content-loaded) {
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default LoadingScreen;
