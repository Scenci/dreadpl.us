import React, { useRef, useEffect } from 'react';
import './VoidParticles.css';

const VoidParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
    }));


    const supernovaParticles = [];

    const supernovaChance = 0.005;

    const draw = () => {
      ctx.fillStyle = 'rgba(11,11,22,0.6)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(128,0,255,0.8)';
        ctx.shadowColor = '#5500aa';
        ctx.shadowBlur = 8;
        ctx.fill();
      });

      if (Math.random() < supernovaChance) {
        const p = particles[Math.floor(Math.random() * particles.length)];

        const fragments = 8 + Math.floor(Math.random() * 8);
        for (let i = 0; i < fragments; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 0.5;
          supernovaParticles.push({
            x: p.x,
            y: p.y,
            originX: p.x,
            originY: p.y,
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            radius: Math.random() * 1 + 0.5,
          });
        }
        p.x = Math.random() * canvas.width;
        p.y = Math.random() * canvas.height;
      }

      for (let i = supernovaParticles.length - 1; i >= 0; i--) {
        const s = supernovaParticles[i];
        s.x += s.dx;
        s.y += s.dy;
        const dist = Math.hypot(s.x - s.originX, s.y - s.originY);
        const alpha = 1 - dist / 20;
        if (alpha <= 0) {
          supernovaParticles.splice(i, 1);

          continue;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(128,0,255,${alpha * 0.3})`;

        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="void-canvas" />;
};

export default VoidParticles;
