import React, { useRef, useEffect } from 'react';
import './BlackHole.css';

const BlackHole = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let time = 0;

        let width, height, centerX, centerY;

        // Configuration
        const STAR_COUNT = 400;
        const DISK_PARTICLE_COUNT = 1200;
        const EVENT_HORIZON_RADIUS_RATIO = 0.12;
        const ROTATION_SPEED = 0.0008; // Slow, majestic rotation

        // Color palette - Dark Blues, Azures, Blacks, Whites
        const colors = {
            deepSpace: 'rgb(2, 3, 8)',
            eventHorizon: '#000000',
            innerGlow: 'rgba(100, 180, 255, 0.8)',      // Bright azure
            hotCore: 'rgba(200, 230, 255, 0.9)',        // White-blue
            midDisk: 'rgba(50, 120, 200, 0.7)',         // Deep blue
            outerDisk: 'rgba(20, 60, 120, 0.5)',        // Dark blue
            lensingLight: 'rgba(150, 200, 255, 0.4)',   // Soft azure
            photonRing: 'rgba(180, 220, 255, 0.9)',     // Brilliant white-blue
        };

        class Star {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 1.5 + 0.5;
                this.baseOpacity = Math.random() * 0.6 + 0.2;
                this.twinkleSpeed = Math.random() * 0.02 + 0.01;
                this.twinkleOffset = Math.random() * Math.PI * 2;
                // Some stars have a blue tint
                this.isBlue = Math.random() > 0.7;
            }

            draw(t) {
                const twinkle = Math.sin(t * this.twinkleSpeed + this.twinkleOffset) * 0.3 + 0.7;
                const opacity = this.baseOpacity * twinkle;

                if (this.isBlue) {
                    ctx.fillStyle = `rgba(180, 210, 255, ${opacity})`;
                } else {
                    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                }
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
                this.radiusMult = 1.15 + Math.pow(Math.random(), 0.7) * 2.8;
                this.baseSpeed = ROTATION_SPEED * (3.5 / Math.pow(this.radiusMult, 1.5));
                this.verticalWobble = (Math.random() - 0.5) * 0.15;
                this.sizeVariation = Math.random();

                // Color based on distance - closer is hotter (white-blue), farther is darker blue
                if (this.radiusMult < 1.4) {
                    // Innermost - brilliant white-blue
                    const alpha = 0.6 + Math.random() * 0.4;
                    this.color = `rgba(220, 240, 255, ${alpha})`;
                    this.size = 1.5 + this.sizeVariation * 2.5;
                    this.glowIntensity = 1.5;
                } else if (this.radiusMult < 1.8) {
                    // Inner - bright azure
                    const alpha = 0.5 + Math.random() * 0.4;
                    this.color = `rgba(100, 180, 255, ${alpha})`;
                    this.size = 1 + this.sizeVariation * 2;
                    this.glowIntensity = 1.2;
                } else if (this.radiusMult < 2.4) {
                    // Middle - deep blue
                    const alpha = 0.3 + Math.random() * 0.4;
                    this.color = `rgba(50, 120, 200, ${alpha})`;
                    this.size = 0.8 + this.sizeVariation * 1.5;
                    this.glowIntensity = 0.8;
                } else {
                    // Outer - dark blue, sparse
                    const alpha = 0.2 + Math.random() * 0.3;
                    this.color = `rgba(30, 70, 140, ${alpha})`;
                    this.size = 0.5 + this.sizeVariation * 1;
                    this.glowIntensity = 0.5;
                }
            }

            update() {
                this.angle += this.baseSpeed;
            }

            draw(horizonRadius, phase, globalTime) {
                const tilt = 0.22; // Viewing angle of the disk
                const r = horizonRadius * this.radiusMult;

                const x = Math.cos(this.angle) * r;
                const y = Math.sin(this.angle) * r * tilt;
                const z = Math.sin(this.angle);

                // Pulsing glow effect
                const pulse = 1 + Math.sin(globalTime * 0.003 + this.angle) * 0.1;
                const currentSize = this.size * pulse;

                // Back of disk (behind black hole)
                if (phase === 'back' && z < 0) {
                    this.drawParticle(centerX + x, centerY + y, currentSize);
                }

                // Gravitational lensing - the signature Interstellar halo
                if (phase === 'lensing' && z < 0.3) {
                    const lensingStrength = 0.7 - Math.abs(z) * 0.5;
                    if (lensingStrength > 0 && this.radiusMult < 2.2) {
                        const lensingAlpha = lensingStrength * 0.25 * this.glowIntensity;

                        // Top lensing arc
                        const topY = centerY - horizonRadius * (0.8 + this.radiusMult * 0.3);
                        const topX = centerX + x * 0.6;
                        this.drawLensingParticle(topX, topY, currentSize * 1.5, lensingAlpha);

                        // Bottom lensing arc
                        const bottomY = centerY + horizonRadius * (0.8 + this.radiusMult * 0.3);
                        const bottomX = centerX + x * 0.6;
                        this.drawLensingParticle(bottomX, bottomY, currentSize * 1.5, lensingAlpha);
                    }
                }

                // Front of disk (in front of black hole)
                if (phase === 'front' && z >= 0) {
                    this.drawParticle(centerX + x, centerY + y, currentSize);
                }
            }

            drawParticle(x, y, size) {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }

            drawLensingParticle(x, y, size, alpha) {
                ctx.fillStyle = `rgba(150, 200, 255, ${alpha})`;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Streaking particles being pulled into the black hole
        class FallingParticle {
            constructor() {
                this.reset();
            }

            reset() {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.min(width, height) * (0.4 + Math.random() * 0.3);
                this.x = centerX + Math.cos(angle) * distance;
                this.y = centerY + Math.sin(angle) * distance;
                this.speed = 0.3 + Math.random() * 0.5;
                this.size = Math.random() * 2 + 1;
                this.trail = [];
                this.maxTrailLength = 15 + Math.floor(Math.random() * 10);
                this.opacity = 0.3 + Math.random() * 0.5;
            }

            update() {
                const dx = centerX - this.x;
                const dy = centerY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const horizonRadius = Math.min(width, height) * EVENT_HORIZON_RADIUS_RATIO;

                if (dist < horizonRadius * 1.1) {
                    this.reset();
                    return;
                }

                // Add current position to trail
                this.trail.push({ x: this.x, y: this.y });
                if (this.trail.length > this.maxTrailLength) {
                    this.trail.shift();
                }

                // Accelerate towards center
                const acceleration = 1 + (horizonRadius * 3) / dist;
                const angle = Math.atan2(dy, dx);

                // Add slight spiral motion
                const spiralAngle = angle + 0.3;

                this.x += Math.cos(spiralAngle) * this.speed * acceleration;
                this.y += Math.sin(spiralAngle) * this.speed * acceleration;
            }

            draw() {
                // Draw trail
                for (let i = 0; i < this.trail.length; i++) {
                    const t = this.trail[i];
                    const alpha = (i / this.trail.length) * this.opacity * 0.5;
                    const size = this.size * (i / this.trail.length);
                    ctx.fillStyle = `rgba(100, 170, 255, ${alpha})`;
                    ctx.beginPath();
                    ctx.arc(t.x, t.y, size, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Draw particle
                ctx.fillStyle = `rgba(180, 220, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const stars = [];
        const diskParticles = [];
        const fallingParticles = [];
        const FALLING_PARTICLE_COUNT = 30;

        const init = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            centerX = width / 2;
            centerY = height / 2;

            stars.length = 0;
            diskParticles.length = 0;
            fallingParticles.length = 0;

            for (let i = 0; i < STAR_COUNT; i++) stars.push(new Star());
            for (let i = 0; i < DISK_PARTICLE_COUNT; i++) diskParticles.push(new DiskParticle());
            for (let i = 0; i < FALLING_PARTICLE_COUNT; i++) fallingParticles.push(new FallingParticle());
        };

        const drawEventHorizon = (horizonRadius) => {
            // Outer glow - multiple layers for depth
            const glowLayers = [
                { radius: 1.8, alpha: 0.03, color: '50, 100, 180' },
                { radius: 1.5, alpha: 0.05, color: '70, 130, 200' },
                { radius: 1.3, alpha: 0.08, color: '90, 160, 220' },
                { radius: 1.15, alpha: 0.12, color: '120, 180, 240' },
                { radius: 1.08, alpha: 0.2, color: '150, 200, 255' },
            ];

            glowLayers.forEach(layer => {
                const gradient = ctx.createRadialGradient(
                    centerX, centerY, horizonRadius,
                    centerX, centerY, horizonRadius * layer.radius
                );
                gradient.addColorStop(0, `rgba(${layer.color}, ${layer.alpha})`);
                gradient.addColorStop(1, `rgba(${layer.color}, 0)`);
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(centerX, centerY, horizonRadius * layer.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            // The event horizon itself - pure black
            ctx.beginPath();
            ctx.arc(centerX, centerY, horizonRadius, 0, Math.PI * 2);
            ctx.fillStyle = colors.eventHorizon;
            ctx.fill();

            // Photon sphere - the bright ring at the edge
            ctx.beginPath();
            ctx.arc(centerX, centerY, horizonRadius * 1.02, 0, Math.PI * 2);
            ctx.lineWidth = 2;
            ctx.strokeStyle = colors.photonRing;
            ctx.stroke();

            // Inner photon ring glow
            ctx.beginPath();
            ctx.arc(centerX, centerY, horizonRadius * 1.01, 0, Math.PI * 2);
            ctx.lineWidth = 4;
            ctx.strokeStyle = 'rgba(200, 230, 255, 0.3)';
            ctx.stroke();
        };

        const draw = () => {
            time++;

            // Clear with deep space color and slight trail for smoothness
            ctx.fillStyle = 'rgba(2, 3, 8, 0.4)';
            ctx.fillRect(0, 0, width, height);

            const horizonRadius = Math.min(width, height) * EVENT_HORIZON_RADIUS_RATIO;

            // 1. Draw stars (background)
            stars.forEach(star => star.draw(time));

            // 2. Draw falling particles (being pulled in)
            fallingParticles.forEach(p => {
                p.update();
                p.draw();
            });

            // 3. Draw accretion disk (back)
            diskParticles.forEach(p => {
                p.update();
                p.draw(horizonRadius, 'back', time);
            });

            // 4. Draw gravitational lensing effect
            diskParticles.forEach(p => {
                p.draw(horizonRadius, 'lensing', time);
            });

            // 5. Draw event horizon with glow
            drawEventHorizon(horizonRadius);

            // 6. Draw accretion disk (front)
            diskParticles.forEach(p => {
                p.draw(horizonRadius, 'front', time);
            });

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
