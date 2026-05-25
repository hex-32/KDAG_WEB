import React, { useRef, useEffect, useState } from 'react';
import TypewriterText from '../components/typewriter';
import Header from '../components/Header';
// import Footer from '../components/footer';

const Home = () => {
    const getInitial = () => {
        if (typeof window === 'undefined') return 'light'
        return (
            localStorage.getItem('theme') ||
            (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        )
    }
    const [theme, setTheme] = useState(getInitial)
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [scrollY, setScrollY] = useState(window.scrollY);
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // 1. Setup & Resize
        const setSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setSize();
        window.addEventListener('resize', setSize);

        // 2. Configuration
        const spacing = 35;
        const baseRadius = 1.5;
        const interactionRadius = 300;

        let mouse = { x: -1000, y: -1000, isActive: false };
        let rippleStrength = 0;
        let lastClientX = -1000;
        let lastClientY = -1000;

        // NEW: Time variable to drive the continuous organic movement
        let time = 0;

        // 3. Coordinate Math 
        const updateMousePosition = () => {
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();

            const localX = lastClientX - rect.left;
            const localY = lastClientY - rect.top;

            if (
                localX >= 0 &&
                localX <= rect.width &&
                localY >= 0 &&
                localY <= rect.height
            ) {
                mouse.x = localX;
                mouse.y = localY;
                mouse.isActive = true;
            } else {
                mouse.isActive = false;
            }
        };

        const handleMouseMove = (e) => {
            lastClientX = e.clientX;
            lastClientY = e.clientY;
            updateMousePosition();
        };

        const handleScroll = () => {
            if (lastClientX !== -1000) {
                updateMousePosition();
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll, { passive: true });

        // 4. Render Loop
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Increment time for the animation (higher number = faster movement)
            time += 0.03;

            const targetStrength = mouse.isActive ? 1 : 0;
            rippleStrength += (targetStrength - rippleStrength) * 0.05;

            const cols = Math.floor(canvas.width / spacing);
            const rows = Math.floor(canvas.height / spacing);

            for (let i = 0; i <= cols; i++) {
                for (let j = 0; j <= rows; j++) {
                    let x = i * spacing;
                    let y = j * spacing;

                    let dx = mouse.x - x;
                    let dy = mouse.y - y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    let currentRadius = baseRadius;
                    let offsetX = 0;
                    let offsetY = 0;

                    if (distance < interactionRadius && rippleStrength > 0.01) {
                        let rawForce = (interactionRadius - distance) / interactionRadius;
                        let force = rawForce * rippleStrength;

                        // NEW: Organic continuous movement calculation
                        // We multiply x and y by a small number (0.05) to offset the phase, 
                        // so the dots don't all move in the exact same direction at the same time.
                        const jiggleAmount = force * 3; // Max 3px drift
                        const organicX = Math.sin(time + (x * 0.05)) * jiggleAmount;
                        const organicY = Math.cos(time + (y * 0.05)) * jiggleAmount;

                        // Repel calculation
                        const angle = Math.atan2(dy, dx);
                        const pushDistance = force * 15;

                        // Combine repel distance with the organic drift
                        offsetX = (-Math.cos(angle) * pushDistance) + organicX;
                        offsetY = (-Math.sin(angle) * pushDistance) + organicY;

                        currentRadius = baseRadius + (force * 2.5);
                        ctx.fillStyle = theme === 'dark' ? `rgba(255, 255, 255, ${0.15 + force * 0.8})` : `rgba(255, 0, 0, ${0.15 + force * 0.8})`;

                        ctx.shadowBlur = force * 12;
                        ctx.shadowColor = theme === 'dark' ? `rgba(255, 255, 255, ${force})` : `rgba(255, 0, 0, ${force})`;

                    } else {
                        ctx.fillStyle = 'rgba(255, 0, 0, 0.55)';
                        ctx.shadowBlur = 0;
                    }

                    ctx.beginPath();
                    ctx.arc(x + offsetX, y + offsetY, currentRadius, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        // 5. Cleanup
        return () => {
            window.removeEventListener('resize', setSize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (<>
        <Header show={true} small={scrollY > 150} home={true} />
        <div ref={containerRef} className="relative w-full h-screen bg-neutral-950 overflow-hidden">

            {/* Background Canvas: pointer-events-none so it doesn't intercept or block anything */}
            <canvas
                ref={canvasRef}
                className={`absolute inset-0 w-full h-full z-0 pointer-events-none ${theme === 'dark' ? 'bg-neutral-950' : 'bg-white'}`}
            />

            {/* Hero Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
                <div className={`relative z-10 flex flex-col items-center justify-center h-full px-4 text-center ${theme === 'dark' ? 'text-white' : 'text-black'}`}>

                    {/* Replace the old static <h1> with this */}
                    <TypewriterText theme={theme} />

                    <p className={`mt-6 text-lg md:text-2xl font-semibold max-w-2xl mx-auto text-center select-none cursor-default ${theme === 'dark' ? 'text-white/70' : 'text-black/70'}`}>
                        Explore the latest in tech, data science, and development.
                    </p>

                    <button className={`mt-10 px-8 py-4 rounded-full font-semibold tracking-wide hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer
                                        ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}`}
                        onClick={() => window.location.href = "/blog"}
                    >
                        Explore Blogs
                    </button>
                </div>
            </div>
        </div>
    </>
    );
};

export default Home;