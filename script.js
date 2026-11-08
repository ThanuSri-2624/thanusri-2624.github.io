/* ============================================================
   THANU SRI KHANDESH — PORTFOLIO JS
   Particles, scroll animations, stats counter, 
   modal system, cursor glow, navigation
   ============================================================ */

// ============ PARTICLE CANVAS ============
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.mouse = { x: 0, y: 0 };
        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const count = Math.min(80, Math.floor(window.innerWidth / 15));
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.5 + 0.1,
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        for (const p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;

            // Mouse repulsion
            const dx = p.x - this.mouse.x;
            const dy = p.y - this.mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                const force = (150 - dist) / 150;
                p.vx += (dx / dist) * force * 0.02;
                p.vy += (dy / dist) * force * 0.02;
            }

            // Speed limit
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (speed > 1) {
                p.vx = (p.vx / speed) * 1;
                p.vy = (p.vy / speed) * 1;
            }

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
            this.ctx.fill();
        }

        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const opacity = (1 - dist / 120) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

// ============ CURSOR GLOW ============
const cursorGlow = document.getElementById('cursorGlow');
let glowX = 0, glowY = 0, currentGlowX = 0, currentGlowY = 0;

document.addEventListener('mousemove', (e) => {
    glowX = e.clientX;
    glowY = e.clientY;
});

function updateGlow() {
    currentGlowX += (glowX - currentGlowX) * 0.08;
    currentGlowY += (glowY - currentGlowY) * 0.08;
    if (cursorGlow) {
        cursorGlow.style.left = currentGlowX + 'px';
        cursorGlow.style.top = currentGlowY + 'px';
    }
    requestAnimationFrame(updateGlow);
}
updateGlow();

// ============ NAVIGATION ============
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

// Scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    nav.classList.toggle('nav--scrolled', currentScroll > 50);
    lastScroll = currentScroll;
});

// Hamburger menu
if (hamburger) {
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav__link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = 'var(--accent)';
        }
    });
});

// ============ SCROLL REVEAL ============
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Stagger animation for sibling elements
            const siblings = entry.target.parentElement.querySelectorAll('.reveal');
            let delay = 0;
            siblings.forEach((sibling, i) => {
                if (sibling === entry.target) delay = i * 100;
            });
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, Math.min(delay, 400));
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ============ STATS COUNTER ============
const statNumbers = document.querySelectorAll('.stat__number');
let statsCounted = false;

function animateStats() {
    if (statsCounted) return;
    statNumbers.forEach(stat => {
        const target = parseFloat(stat.dataset.target);
        const isFloat = target % 1 !== 0;
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;

            if (isFloat) {
                stat.textContent = current.toFixed(1);
            } else {
                stat.textContent = Math.floor(current);
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (isFloat) {
                    stat.textContent = target.toFixed(1);
                } else {
                    stat.textContent = target;
                }
            }
        }
        requestAnimationFrame(update);
    });
    statsCounted = true;
}

// Trigger stats animation when hero stats are visible
const statsSection = document.querySelector('.hero__stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateStats();
            statsObserver.unobserve(entries[0].target);
        }
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
}

// ============ PROJECT MODALS ============
const projectData = {
    camera: {
        title: 'Camera Stream-Health Diagnostics',
        sections: [
            {
                heading: 'The Problem',
                content: 'The Camera troubleshooter could detect that a Camera exists but couldn\'t verify whether it was actually producing usable video. 15.7% of customer cases involved black screens where the device was detected but not working — and the flow would misroute toward driver fixes.'
            },
            {
                heading: 'What I Did',
                items: [
                    'Analyzed customer-support cases and mapped the existing troubleshooter flow',
                    'Defined 7 sub-scenarios: black screen (single app vs everywhere), stuck initialization, grey output, privacy denial, post-reset verification, poor quality',
                    'Implemented RC_CameraStreamHealth using MediaCapture to probe actual frame delivery',
                    'Added before/after remediation verification around Camera service resets',
                    'Fixed Camera-service reset crash (ManagementPath.EscapeString unavailable)',
                    'Presented analysis to team; direction validated by feature-team review'
                ]
            },
            {
                heading: 'Impact',
                content: 'Turned "device detected" into "device actually producing video" — before/after comparison gives measurable fix-effectiveness evidence. Validated on physical Camera hardware.'
            }
        ]
    },
    rollout: {
        title: 'Versioned Package Rollout System',
        sections: [
            {
                heading: 'The Problem',
                content: 'Publishing a new diagnostic package version required manual work. No UI for the team to see versions, choose a candidate, gradually shift traffic, or cancel safely.'
            },
            {
                heading: 'What I Built',
                items: [
                    'ASP.NET Core APIs: StartRollout, CompleteRollout, CancelRollout with CosmosDB state',
                    'ETag-based optimistic concurrency for concurrent-write protection',
                    'Per-request random traffic selection: random int in [0,99] routes to candidate or live blob',
                    'AngularJS UI: version list with Live/Rolling Out/Candidate status, percentage controls',
                    'Fixed StartRollout to allow percentage updates (was 409 Conflict)',
                    'Deletion safeguards, uploader attribution, version-specific downloads',
                    'Role-based authorization with server-side validation',
                    'Organized and presented feature demo to team'
                ]
            }
        ]
    },
    security: {
        title: 'Security Remediation at Scale',
        sections: [
            {
                heading: 'The Problem',
                content: 'Multiple diagnostic packages across Camera, Bluetooth, Printer, Display, Video Playback, and Windows Update had high-severity security findings that needed remediation without changing troubleshooting behavior.'
            },
            {
                heading: 'What I Fixed',
                items: [
                    'WQL query sanitization and input escaping',
                    'P/Invoke result validation and hardened calling patterns',
                    'Add-Type language pinning (preventing arbitrary code compilation)',
                    'Native exit-code verification (not assuming exceptions on failure)',
                    'Save/restore rollback for Registry and file modifications',
                    'Printer handle lifecycle and WinSpool call validation',
                    'Structured exception handling across all packages'
                ]
            },
            {
                heading: 'Impact',
                content: '25+ high-severity vulnerabilities remediated across 6 packages. All PRs passed DAF security validation, builds verified, no behavioral regressions. Shared utility hardening patterns adopted by broader team.'
            }
        ]
    },
    catalog: {
        title: 'Support Actions Catalog Recovery',
        sections: [
            {
                heading: 'The Problem',
                content: 'The internal portal had multiple simultaneous failures: dead telemetry endpoint, deleted Azure AD app registration, blocked CSP policies, broken localhost redirect, unavailable API endpoint.'
            },
            {
                heading: 'What I Fixed',
                items: [
                    'Updated telemetry configuration to working endpoints',
                    'Fixed Content Security Policy sources',
                    'Corrected browser security headers and clickjacking protection',
                    'Reconfigured local authentication (localhost redirect, app registration)',
                    'Updated API endpoint configuration and CSP allowlist',
                    'Implemented team-level authorization (replaced single-uploader ownership)'
                ]
            }
        ]
    },
    scheduler: {
        title: 'Distributed Job Scheduling Platform',
        sections: [
            {
                heading: 'Overview',
                content: 'Academic project — asynchronous job processing system designed for reliability and horizontal scaling.'
            },
            {
                heading: 'Architecture',
                items: [
                    'Worker pools for concurrent job execution',
                    'Redis queues for job distribution',
                    'PostgreSQL for job-state persistence and audit trail',
                    'Retry logic with exponential backoff',
                    'Dead-letter handling for failed jobs',
                    'Docker containerization for reproducible deployments'
                ]
            }
        ]
    },
    kafka: {
        title: 'Real-Time Event Processing Pipeline',
        sections: [
            {
                heading: 'Overview',
                content: 'Academic project — Kafka-based event pipeline for real-time data ingestion and processing.'
            },
            {
                heading: 'Features',
                items: [
                    'Fault-tolerant consumer groups',
                    'Real-time data ingestion pipeline',
                    'Monitoring and structured logging',
                    'Pipeline failure detection'
                ]
            }
        ]
    }
};

const modal = document.getElementById('projectModal');
const modalBody = document.getElementById('modalBody');

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        const projectKey = card.dataset.project;
        const data = projectData[projectKey];
        if (!data) return;

        let html = `<h3>${data.title}</h3>`;
        data.sections.forEach(section => {
            html += `<h4>${section.heading}</h4>`;
            if (section.content) {
                html += `<p>${section.content}</p>`;
            }
            if (section.items) {
                html += '<ul>';
                section.items.forEach(item => {
                    html += `<li>${item}</li>`;
                });
                html += '</ul>';
            }
        });

        modalBody.innerHTML = html;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Close modal
modal.querySelector('.modal__overlay').addEventListener('click', closeModal);
modal.querySelector('.modal__close').addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        new ParticleSystem(canvas);
    }
});
