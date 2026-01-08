import React, { useRef, useEffect } from 'react';
import './BlackHole.css';

const BlackHole = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        let width, height, centerX, centerY;

        // Configuration
        const STAR_COUNT = 300;
        const DISK_PARTICLE_COUNT = 800; // Accretion disk particles
        const EVENT_HORIZON_RADIUS_RATIO = 0.15; // Size relative to screen min dimension

        class Star {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.z = Math.random() * 2; // Depth
                this.size = Math.random() * 1.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            draw() {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        class DiskParticle {
            constructor() {
                this.reset();
            }

            reset() {
                this.angle = Math.random() * Math.PI * 2;
                // Distribute particles in a ring (disk)
                // We want more particles closer to the center for the intense glow
                const rBase = Math.random();
                this.radiusMult = 1.2 + rBase * 2.5; // Distance from center (1.0 = event horizon)

                this.speed = 0.005 + (1 / this.radiusMult) * 0.01; // Closer = faster

                // Color based on heat/distance. Closer = Blue/White, Farther = Orange/Red
                if (this.radiusMult < 1.4) {
                    this.color = `rgba(200, 240, 255, ${Math.random() * 0.8})`; // Hot white-blue
                    this.size = Math.random() * 2.5 + 1;
                } else if (this.radiusMult < 2.0) {
                    this.color = `rgba(255, 200, 100, ${Math.random() * 0.6})`; // Warm yellow-orange
                    this.size = Math.random() * 2 + 0.5;
                } else {
                    this.color = `rgba(200, 50, 0, ${Math.random() * 0.4})`; // Reddish outer
                    this.size = Math.random() * 1.5 + 0.5;
                }

                // Vertical randomness for volume
                this.verticalOffset = (Math.random() - 0.5) * 0.2;
            }

            update() {
                this.angle += this.speed;
            }

            draw(horizonRadius, phase) {
                // Isometric transformation for the disk
                // We squash the Y axis to simulate viewing a disk at an angle
                const tilt = 0.25; // 0 = flat, 1 = round

                const r = horizonRadius * this.radiusMult;

                // Calculate 3D-ish coordinates
                const x = Math.cos(this.angle) * r;
                const y = Math.sin(this.angle) * r * tilt;
                const z = Math.sin(this.angle); // Z-index proxy: +1 is front, -1 is back

                // Lensing effect (The "Halo")
                // Simulated by drawing a second ring that is vertical-ish behind/above
                const lensingY = Math.sin(this.angle) * r * 0.8; // Vertical stretch
                const lensingX = Math.cos(this.angle) * r * 0.9;

                // PHASE 1: Draw specific particles (Back or Front)

                // BACK of the disk (behind the black hole)
                if (phase === 'back' && z < 0) {
                    // Draw normal disk particle
                    this.drawDot(centerX + x, centerY + y, this.size, this.color);
                }

                // LENSING (The top/bottom hump)
                // This represents light from behind the disk being bent up/down
                // We only draw this if it appears "behind" the event horizon or just around it
                if (phase === 'lensing' && z < 0) {
                    // Fade out lensing based on distance
                    const lensingAlpha = 0.3 / this.radiusMult;
                    const lenseColor = this.color.replace(/, [0-9.]+\)/, `, ${lensingAlpha})`);

                    // Top Halo
                    this.drawDot(centerX + x * 0.7, centerY - Math.abs(lensingY) - horizonRadius * 0.5, this.size * 2, lenseColor);

                }

                // FRONT of the disk (in front of the black hole)
                if (phase === 'front' && z >= 0) {
                    this.drawDot(centerX + x, centerY + y, this.size, this.color);
                }
            }

            drawDot(x, y, s, c) {
                ctx.fillStyle = c;
                ctx.beginPath();
                ctx.arc(x, y, s, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const stars = [];
        const diskParticles = [];

        const init = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            centerX = width / 2;
            centerY = height / 2;

            stars.length = 0;
            diskParticles.length = 0;

            for (let i = 0; i < STAR_COUNT; i++) stars.push(new Star());
            for (let i = 0; i < DISK_PARTICLE_COUNT; i++) diskParticles.push(new DiskParticle());
        };

        const draw = () => {
            // Clear with slight trail effect for smoothness
            ctx.fillStyle = 'rgba(5, 5, 10, 0.5)'; // Not fully clearing creates a trail/glow
            ctx.fillRect(0, 0, width, height);

            const horizonRadius = Math.min(width, height) * EVENT_HORIZON_RADIUS_RATIO;

            // 1. Draw Stars (Background)
            stars.forEach(star => star.draw());

            // 2. Draw Accretion Disk (BACK)
            diskParticles.forEach(p => {
                p.update();
                p.draw(horizonRadius, 'back');
            });

            // 3. Draw Lensing (The Halo - simulates light bending from back to top/bottom)
            diskParticles.forEach(p => {
                p.draw(horizonRadius, 'lensing');
            });

            // 4. Draw Event Horizon (The Black Whole)
            // Main black sphere
            ctx.beginPath();
            ctx.arc(centerX, centerY, horizonRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#000000';
            ctx.fill();

            // Photon Sphere / Inner Glow ring (Subtle)
            ctx.beginPath();
            ctx.arc(centerX, centerY, horizonRadius * 1.02, 0, Math.PI * 2);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.stroke();

            // 5. Draw Accretion Disk (FRONT)
            diskParticles.forEach(p => {
                p.draw(horizonRadius, 'front');
            });

            // Center "Singularity" glare (optional, keeps it subtle)

            animationFrameId = requestAnimationFrame(draw);
        };

        init();
        window.addEventListener('resize', init);
        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', init);
        };
    }, []);

    return <canvas ref={canvasRef} className="black-hole-canvas" />;
};

export default BlackHole;
