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
        const EVENT_HORIZON_RADIUS_RATIO = 0.15; // Increased from 0.12 (25% larger)
        const ROTATION_SPEED = 0.0003; // Very slow rotation for sense of scale

        // Color palette - Deep Blues and Purples
        const colors = {
            deepSpace: 'rgb(2, 3, 8)',
            eventHorizon: '#000000',
            innerGlow: 'rgba(180, 220, 255, 0.8)',      // Bright cyan/white-blue
            hotCore: 'rgba(220, 240, 255, 0.9)',        // White-blue
            midDisk: 'rgba(120, 80, 200, 0.7)',         // Purple transition
            outerDisk: 'rgba(255, 255, 255, 0.5)',        // Deep purple
            lensingLight: 'rgba(180, 140, 255, 0.4)',   // Purple-tinted lensing
            photonRing: 'rgba(200, 180, 255, 0.9)',     // Bright with subtle purple
        };

        class Star {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 0.8 + 0.2; // Smaller stars for scale
                this.baseOpacity = Math.random() * 0.5 + 0.15;
                this.twinkleSpeed = Math.random() * 0.015 + 0.005; // Slower twinkle
                this.twinkleOffset = Math.random() * Math.PI * 2;
                // Some stars have a blue or purple tint
                const tintRoll = Math.random();
                this.tint = tintRoll > 0.8 ? 'purple' : (tintRoll > 0.5 ? 'blue' : 'white');
            }

            draw(t) {
                const twinkle = Math.sin(t * this.twinkleSpeed + this.twinkleOffset) * 0.3 + 0.7;
                const opacity = this.baseOpacity * twinkle;

                if (this.tint === 'purple') {
                    ctx.fillStyle = `rgba(200, 180, 255, ${opacity})`;
                } else if (this.tint === 'blue') {
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

                // Lensing-specific properties for organic variation
                this.lensingWobblePhase = Math.random() * Math.PI * 2;
                this.lensingWobbleSpeed = 0.001 + Math.random() * 0.002;
                this.lensingWobbleAmp = 0.1 + Math.random() * 0.2;
                this.lensingSizeVar = 0.5 + Math.random() * 1.5;
                this.lensingOpacityVar = 0.5 + Math.random() * 0.5;

                // Color based on distance - blue-purple gradient (smaller particles for scale)
                if (this.radiusMult < 1.4) {
                    // Innermost - brilliant cyan/white-blue
                    const alpha = 0.6 + Math.random() * 0.4;
                    this.color = `rgba(200, 240, 255, ${alpha})`;
                    this.size = 0.8 + this.sizeVariation * 1.2;
                    this.glowIntensity = 1.5;
                } else if (this.radiusMult < 1.8) {
                    // Inner - azure to purple transition
                    const alpha = 0.5 + Math.random() * 0.4;
                    const purpleBlend = (this.radiusMult - 1.4) / 0.4;
                    const r = Math.floor(100 + purpleBlend * 80);
                    const g = Math.floor(180 - purpleBlend * 60);
                    const b = Math.floor(255);
                    this.color = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                    this.size = 0.6 + this.sizeVariation * 1.0;
                    this.glowIntensity = 1.2;
                } else if (this.radiusMult < 2.4) {
                    // Middle - purple transition
                    const alpha = 0.3 + Math.random() * 0.4;
                    const purpleBlend = (this.radiusMult - 1.8) / 0.6;
                    const r = Math.floor(180 - purpleBlend * 60);
                    const g = Math.floor(120 - purpleBlend * 50);
                    const b = Math.floor(255 - purpleBlend * 35);
                    this.color = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                    this.size = 0.4 + this.sizeVariation * 0.8;
                    this.glowIntensity = 0.8;
                } else {
                    // Outer - deep purple fading to dark blue
                    const alpha = 0.2 + Math.random() * 0.3;
                    this.color = `rgba(80, 40, 140, ${alpha})`;
                    this.size = 0.3 + this.sizeVariation * 0.5;
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

                // Gravitational lensing - improved organic effect
                if (phase === 'lensing' && z < 0.3) {
                    const lensingStrength = 0.7 - Math.abs(z) * 0.5;
                    if (lensingStrength > 0 && this.radiusMult < 2.2) {
                        // Wave/wobble animation for organic feel
                        const wobble = Math.sin(globalTime * this.lensingWobbleSpeed + this.lensingWobblePhase) * this.lensingWobbleAmp;

                        // Fade out particles near the outer edge (radiusMult approaching 2.2)
                        const edgeFade = this.radiusMult > 1.6 ? 1 - ((this.radiusMult - 1.6) / 0.6) : 1;

                        // Fade out particles on horizontal edges (based on x position)
                        const xNormalized = Math.abs(x) / (horizonRadius * this.radiusMult);
                        const horizontalFade = xNormalized > 0.7 ? 1 - ((xNormalized - 0.7) / 0.3) : 1;

                        // Varying alpha for organic opacity with edge fade
                        const baseAlpha = lensingStrength * 0.25 * this.glowIntensity * this.lensingOpacityVar;
                        const waveAlpha = baseAlpha * (0.8 + Math.sin(globalTime * 0.002 + this.angle * 2) * 0.2);
                        const finalAlpha = waveAlpha * Math.max(0, edgeFade) * Math.max(0, horizontalFade);

                        // Skip nearly invisible particles
                        if (finalAlpha < 0.01) return;

                        // Varying size for organic thickness (smaller at edges)
                        const lensingSize = currentSize * this.lensingSizeVar * (1 + wobble * 0.3) * (0.5 + edgeFade * 0.5);

                        // Top lensing arc with wave distortion
                        const topYBase = centerY - horizonRadius * (0.8 + this.radiusMult * 0.3);
                        const topY = topYBase + wobble * horizonRadius * 0.15;
                        const topX = centerX + x * 0.6 + Math.sin(globalTime * 0.001 + this.angle) * 3;
                        this.drawLensingParticle(topX, topY, lensingSize, finalAlpha, globalTime);

                        // Bottom lensing arc with wave distortion (slightly different phase)
                        const bottomYBase = centerY + horizonRadius * (0.8 + this.radiusMult * 0.3);
                        const bottomY = bottomYBase - wobble * horizonRadius * 0.15;
                        const bottomX = centerX + x * 0.6 + Math.sin(globalTime * 0.001 + this.angle + Math.PI) * 3;
                        this.drawLensingParticle(bottomX, bottomY, lensingSize, finalAlpha, globalTime);
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

            drawLensingParticle(x, y, size, alpha, globalTime) {
                // Purple-tinted lensing with color variation
                const purpleShift = Math.sin(globalTime * 0.001 + this.angle) * 30;
                const r = Math.floor(160 + purpleShift);
                const g = Math.floor(140 + purpleShift * 0.5);
                const b = 255;
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
                this.speed = 0.1 + Math.random() * 0.2; // Slower for sense of scale
                this.size = Math.random() * 1 + 0.5; // Smaller particles
                this.trail = [];
                this.maxTrailLength = 20 + Math.floor(Math.random() * 15); // Longer trails
                this.opacity = 0.25 + Math.random() * 0.4;
                // Add purple tint variation
                this.isPurple = Math.random() > 0.5;
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

                // Accelerate towards center (slower for sense of scale)
                const acceleration = 1 + (horizonRadius * 1.5) / dist;
                const angle = Math.atan2(dy, dx);

                // Add slight spiral motion
                const spiralAngle = angle + 0.3;

                this.x += Math.cos(spiralAngle) * this.speed * acceleration;
                this.y += Math.sin(spiralAngle) * this.speed * acceleration;
            }

            draw() {
                // Draw trail with blue-purple gradient
                for (let i = 0; i < this.trail.length; i++) {
                    const t = this.trail[i];
                    const alpha = (i / this.trail.length) * this.opacity * 0.5;
                    const size = this.size * (i / this.trail.length);
                    if (this.isPurple) {
                        ctx.fillStyle = `rgba(150, 100, 255, ${alpha})`;
                    } else {
                        ctx.fillStyle = `rgba(100, 170, 255, ${alpha})`;
                    }
                    ctx.beginPath();
                    ctx.arc(t.x, t.y, size, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Draw particle
                if (this.isPurple) {
                    ctx.fillStyle = `rgba(200, 160, 255, ${this.opacity})`;
                } else {
                    ctx.fillStyle = `rgba(180, 220, 255, ${this.opacity})`;
                }
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

        const drawEventHorizon = (horizonRadius, globalTime) => {
            // Outer glow - multiple layers for depth with purple tints
            const glowLayers = [
                { radius: 1.8, alpha: 0.03, color: '80, 50, 140' },      // Deep purple
                { radius: 1.5, alpha: 0.05, color: '100, 70, 180' },     // Purple
                { radius: 1.3, alpha: 0.08, color: '120, 100, 200' },    // Purple-blue
                { radius: 1.15, alpha: 0.12, color: '140, 140, 220' },   // Light purple-blue
                { radius: 1.08, alpha: 0.2, color: '180, 180, 255' },    // Bright purple-white
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

            // Photon sphere - bright ring with subtle purple tint
            const purplePulse = Math.sin(globalTime * 0.002) * 20;
            ctx.beginPath();
            ctx.arc(centerX, centerY, horizonRadius * 1.02, 0, Math.PI * 2);
            ctx.lineWidth = 2;
            ctx.strokeStyle = `rgba(${200 + purplePulse}, ${180 + purplePulse}, 255, 0.9)`;
            ctx.stroke();

            // Inner photon ring glow with purple
            ctx.beginPath();
            ctx.arc(centerX, centerY, horizonRadius * 1.01, 0, Math.PI * 2);
            ctx.lineWidth = 4;
            ctx.strokeStyle = 'rgba(220, 200, 255, 0.3)';
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

            // 4. Draw gravitational lensing effect (particles)
            diskParticles.forEach(p => {
                p.draw(horizonRadius, 'lensing', time);
            });

            // 5. Draw event horizon with glow
            drawEventHorizon(horizonRadius, time);

            // 7. Draw accretion disk (front)
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
