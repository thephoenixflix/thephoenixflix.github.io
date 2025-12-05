// Global variables
let satelliteAnimationId = null;
let drawSatellite = null; // Will be assigned later

// Navigation
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetSection = btn.dataset.section;
        
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        sections.forEach(s => s.classList.remove('active'));
        const activeSection = document.getElementById(targetSection);
        activeSection.classList.add('active');
        
        // Start satellite animation if satellite section is active
        if (targetSection === 'satellite') {
            setTimeout(() => {
                if (window.startSatelliteAnimation) {
                    window.startSatelliteAnimation();
                } else if (drawSatellite) {
                    drawSatellite();
                }
            }, 150);
        } else {
            // Stop animation when leaving satellite section
            if (window.stopSatelliteAnimation) {
                window.stopSatelliteAnimation();
            }
        }
    });
});

// Filter functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const timelineItems = document.querySelectorAll('.timeline-item');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        
        timelineItems.forEach(item => {
            const category = item.dataset.category;
            if (filter === 'all' || category.includes(filter)) {
                item.style.display = 'block';
                setTimeout(() => item.style.opacity = '1', 10);
            } else {
                item.style.opacity = '0';
                setTimeout(() => item.style.display = 'none', 300);
            }
        });
    });
});

// Radar Canvas
const radarCanvas = document.getElementById('radarCanvas');
const radarCtx = radarCanvas.getContext('2d');

function resizeCanvas(canvas) {
    const rect = canvas.parentElement.getBoundingClientRect();
    // Ensure minimum dimensions
    const width = Math.max(rect.width || 600, 400);
    const height = Math.max(rect.height || 600, 400);
    canvas.width = width;
    canvas.height = height;
}

resizeCanvas(radarCanvas);
window.addEventListener('resize', () => resizeCanvas(radarCanvas));

let radarAngle = 0;

// Career data points on radar
const careerPoints = [
    { angle: 45, distance: 0.3, label: 'Research (U.Ark)', color: '#00ff41' },
    { angle: 90, distance: 0.5, label: 'Research (BYU)', color: '#00d4ff' },
    { angle: 180, distance: 0.4, label: 'Operations', color: '#ffaa00' },
    { angle: 270, distance: 0.6, label: 'Quality', color: '#00ff41' },
    { angle: 315, distance: 0.7, label: 'Support', color: '#00d4ff' }
];

function drawRadar() {
    // Resize if needed
    resizeCanvas(radarCanvas);
    
    // Ensure canvas has valid dimensions
    if (radarCanvas.width === 0 || radarCanvas.height === 0) {
        radarCanvas.width = 600;
        radarCanvas.height = 600;
    }
    
    // Recalculate center and radius on each frame
    const radarCenter = { 
        x: radarCanvas.width / 2, 
        y: radarCanvas.height / 2 
    };
    const calculatedRadius = Math.min(radarCanvas.width, radarCanvas.height) / 2 - 20;
    const radarRadius = Math.max(calculatedRadius, 50); // Ensure minimum radius of 50
    
    radarCtx.clearRect(0, 0, radarCanvas.width, radarCanvas.height);
    
    // Draw concentric circles
    for (let i = 1; i <= 5; i++) {
        const circleRadius = (radarRadius / 5) * i;
        if (circleRadius > 0) {
            radarCtx.strokeStyle = 'rgba(0, 255, 65, 0.3)';
            radarCtx.lineWidth = 1;
            radarCtx.beginPath();
            radarCtx.arc(radarCenter.x, radarCenter.y, circleRadius, 0, Math.PI * 2);
            radarCtx.stroke();
        }
    }
    
    // Draw grid lines
    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        radarCtx.strokeStyle = 'rgba(0, 255, 65, 0.2)';
        radarCtx.lineWidth = 1;
        radarCtx.beginPath();
        radarCtx.moveTo(radarCenter.x, radarCenter.y);
        radarCtx.lineTo(
            radarCenter.x + Math.cos(angle) * radarRadius,
            radarCenter.y + Math.sin(angle) * radarRadius
        );
        radarCtx.stroke();
    }
    
    // Draw career points
    careerPoints.forEach(point => {
        const x = radarCenter.x + Math.cos((point.angle * Math.PI) / 180) * radarRadius * point.distance;
        const y = radarCenter.y + Math.sin((point.angle * Math.PI) / 180) * radarRadius * point.distance;
        
        // Glow effect
        const gradient = radarCtx.createRadialGradient(x, y, 0, x, y, 15);
        gradient.addColorStop(0, point.color);
        gradient.addColorStop(1, 'transparent');
        radarCtx.fillStyle = gradient;
        radarCtx.fillRect(x - 15, y - 15, 30, 30);
        
        // Point
        radarCtx.fillStyle = point.color;
        radarCtx.beginPath();
        radarCtx.arc(x, y, 5, 0, Math.PI * 2);
        radarCtx.fill();
        
        // Label
        radarCtx.fillStyle = '#e0f2fe';
        radarCtx.font = '12px Orbitron';
        radarCtx.fillText(point.label, x + 10, y - 10);
    });
    
    // Draw sweeping line
    radarAngle += 0.02;
    const sweepAngle = radarAngle;
    radarCtx.strokeStyle = 'rgba(0, 255, 65, 0.8)';
    radarCtx.lineWidth = 2;
    radarCtx.beginPath();
    radarCtx.moveTo(radarCenter.x, radarCenter.y);
    radarCtx.lineTo(
        radarCenter.x + Math.cos(sweepAngle) * radarRadius,
        radarCenter.y + Math.sin(sweepAngle) * radarRadius
    );
    radarCtx.stroke();
    
    // Sweep gradient
    if (radarRadius > 0) {
        const sweepGradient = radarCtx.createLinearGradient(
            radarCenter.x, radarCenter.y,
            radarCenter.x + Math.cos(sweepAngle) * radarRadius,
            radarCenter.y + Math.sin(sweepAngle) * radarRadius
        );
        sweepGradient.addColorStop(0, 'rgba(0, 255, 65, 0.3)');
        sweepGradient.addColorStop(1, 'transparent');
        radarCtx.fillStyle = sweepGradient;
        radarCtx.beginPath();
        radarCtx.moveTo(radarCenter.x, radarCenter.y);
        radarCtx.arc(radarCenter.x, radarCenter.y, radarRadius, sweepAngle - 0.1, sweepAngle + 0.1);
        radarCtx.closePath();
        radarCtx.fill();
    }
    
    requestAnimationFrame(drawRadar);
}

drawRadar();

// Satellite Canvas
const satelliteCanvas = document.getElementById('satelliteCanvas');
const satelliteCtx = satelliteCanvas.getContext('2d');

let satelliteAngle = 0;

function resizeSatelliteCanvas() {
    const rect = satelliteCanvas.parentElement.getBoundingClientRect();
    // Ensure minimum dimensions
    const width = Math.max(rect.width || 800, 400);
    const height = Math.max(rect.height || 400, 300);
    satelliteCanvas.width = width;
    satelliteCanvas.height = height;
}

// Initialize canvas with default size
resizeSatelliteCanvas();

// Draw initial frame immediately
function drawInitialFrame() {
    if (satelliteCanvas.width === 0 || satelliteCanvas.height === 0) {
        satelliteCanvas.width = 800;
        satelliteCanvas.height = 400;
    }
    
    const satCenter = { 
        x: satelliteCanvas.width / 2, 
        y: satelliteCanvas.height / 2 
    };
    const orbitRadius = Math.min(satelliteCanvas.width, satelliteCanvas.height) / 3;
    const earthRadius = Math.min(80, orbitRadius * 0.3);
    
    satelliteCtx.clearRect(0, 0, satelliteCanvas.width, satelliteCanvas.height);
    
    // Draw Earth
    const earthGradient = satelliteCtx.createRadialGradient(
        satCenter.x, satCenter.y, 0, 
        satCenter.x, satCenter.y, earthRadius
    );
    earthGradient.addColorStop(0, '#2a5a6c');
    earthGradient.addColorStop(0.5, '#1a4a5c');
    earthGradient.addColorStop(1, '#0a2e3a');
    satelliteCtx.fillStyle = earthGradient;
    satelliteCtx.beginPath();
    satelliteCtx.arc(satCenter.x, satCenter.y, earthRadius, 0, Math.PI * 2);
    satelliteCtx.fill();
    
    // Draw orbit path
    satelliteCtx.strokeStyle = 'rgba(0, 255, 65, 0.4)';
    satelliteCtx.lineWidth = 2;
    satelliteCtx.setLineDash([8, 8]);
    satelliteCtx.beginPath();
    satelliteCtx.ellipse(
        satCenter.x, satCenter.y, 
        orbitRadius, orbitRadius * 0.6, 
        0, 0, Math.PI * 2
    );
    satelliteCtx.stroke();
    satelliteCtx.setLineDash([]);
}

// Draw initial frame
drawInitialFrame();

drawSatellite = function() {
    // Resize if needed
    resizeSatelliteCanvas();
    
    // Ensure canvas has valid dimensions
    if (satelliteCanvas.width === 0 || satelliteCanvas.height === 0) {
        satelliteCanvas.width = 800;
        satelliteCanvas.height = 400;
    }
    
    const satCenter = { 
        x: satelliteCanvas.width / 2, 
        y: satelliteCanvas.height / 2 
    };
    const orbitRadius = Math.min(satelliteCanvas.width, satelliteCanvas.height) / 3;
    const earthRadius = Math.min(80, orbitRadius * 0.3);
    
    satelliteCtx.clearRect(0, 0, satelliteCanvas.width, satelliteCanvas.height);
    
    // Draw Earth
    const earthGradient = satelliteCtx.createRadialGradient(
        satCenter.x, satCenter.y, 0, 
        satCenter.x, satCenter.y, earthRadius
    );
    earthGradient.addColorStop(0, '#2a5a6c');
    earthGradient.addColorStop(0.5, '#1a4a5c');
    earthGradient.addColorStop(1, '#0a2e3a');
    satelliteCtx.fillStyle = earthGradient;
    satelliteCtx.beginPath();
    satelliteCtx.arc(satCenter.x, satCenter.y, earthRadius, 0, Math.PI * 2);
    satelliteCtx.fill();
    
    // Earth outline
    satelliteCtx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
    satelliteCtx.lineWidth = 1;
    satelliteCtx.beginPath();
    satelliteCtx.arc(satCenter.x, satCenter.y, earthRadius, 0, Math.PI * 2);
    satelliteCtx.stroke();
    
    // Draw orbit path
    satelliteCtx.strokeStyle = 'rgba(0, 255, 65, 0.4)';
    satelliteCtx.lineWidth = 2;
    satelliteCtx.setLineDash([8, 8]);
    satelliteCtx.beginPath();
    satelliteCtx.ellipse(
        satCenter.x, satCenter.y, 
        orbitRadius, orbitRadius * 0.6, 
        0, 0, Math.PI * 2
    );
    satelliteCtx.stroke();
    satelliteCtx.setLineDash([]);
    
    // Draw satellite
    // Satellite variables  for speed
    // satelliteAngle += 0.005;
    satelliteAngle += 0.01;
    const satX = satCenter.x + Math.cos(satelliteAngle) * orbitRadius;
    const satY = satCenter.y + Math.sin(satelliteAngle) * orbitRadius * 0.6;
    
    // Communication link (pulsing)
    const linkOpacity = 0.3 + Math.sin(satelliteAngle * 3) * 0.2;
    satelliteCtx.strokeStyle = `rgba(0, 212, 255, ${linkOpacity})`;
    satelliteCtx.lineWidth = 2;
    satelliteCtx.beginPath();
    satelliteCtx.moveTo(satCenter.x, satCenter.y);
    satelliteCtx.lineTo(satX, satY);
    satelliteCtx.stroke();
    
    // Communication link glow
    const linkGradient = satelliteCtx.createLinearGradient(
        satCenter.x, satCenter.y, satX, satY
    );
    linkGradient.addColorStop(0, 'rgba(0, 212, 255, 0.1)');
    linkGradient.addColorStop(0.5, 'rgba(0, 212, 255, 0.3)');
    linkGradient.addColorStop(1, 'rgba(0, 212, 255, 0.1)');
    satelliteCtx.strokeStyle = linkGradient;
    satelliteCtx.lineWidth = 4;
    satelliteCtx.beginPath();
    satelliteCtx.moveTo(satCenter.x, satCenter.y);
    satelliteCtx.lineTo(satX, satY);
    satelliteCtx.stroke();
    
    // Satellite glow
    const satGradient = satelliteCtx.createRadialGradient(satX, satY, 0, satX, satY, 25);
    satGradient.addColorStop(0, 'rgba(0, 212, 255, 0.8)');
    satGradient.addColorStop(0.5, 'rgba(0, 212, 255, 0.3)');
    satGradient.addColorStop(1, 'transparent');
    satelliteCtx.fillStyle = satGradient;
    satelliteCtx.fillRect(satX - 25, satY - 25, 50, 50);
    
    // Satellite body (main)
    satelliteCtx.fillStyle = '#00d4ff';
    satelliteCtx.fillRect(satX - 10, satY - 5, 20, 10);
    
    // Satellite solar panels
    satelliteCtx.fillStyle = '#00aacc';
    satelliteCtx.fillRect(satX - 15, satY - 3, 30, 6);
    
    // Satellite details
    satelliteCtx.fillStyle = '#00ff41';
    satelliteCtx.fillRect(satX - 2, satY - 2, 4, 4);
    
    // Signal waves (expanding)
    const waveTime = Date.now() * 0.001;
    for (let i = 1; i <= 4; i++) {
        const waveRadius = 20 + (i * 15) + Math.sin(waveTime * 2) * 5;
        const waveOpacity = (0.6 / i) * (0.5 + Math.sin(waveTime * 3) * 0.5);
        satelliteCtx.strokeStyle = `rgba(0, 255, 65, ${waveOpacity})`;
        satelliteCtx.lineWidth = 2;
        satelliteCtx.beginPath();
        satelliteCtx.arc(satX, satY, waveRadius, 0, Math.PI * 2);
        satelliteCtx.stroke();
    }
    
    // Orbit trail
    const trailPoints = 20;
    for (let i = 0; i < trailPoints; i++) {
        const trailAngle = satelliteAngle - (i * 0.05);
        const trailX = satCenter.x + Math.cos(trailAngle) * orbitRadius;
        const trailY = satCenter.y + Math.sin(trailAngle) * orbitRadius * 0.6;
        const trailOpacity = (trailPoints - i) / trailPoints * 0.3;
        satelliteCtx.fillStyle = `rgba(0, 212, 255, ${trailOpacity})`;
        satelliteCtx.beginPath();
        satelliteCtx.arc(trailX, trailY, 2, 0, Math.PI * 2);
        satelliteCtx.fill();
    }
    
    // Check if section is visible before continuing animation
    const satelliteSection = document.getElementById('satellite');
    if (satelliteSection && satelliteSection.classList.contains('active')) {
        satelliteAnimationId = requestAnimationFrame(drawSatellite);
    }
}

// Function to start satellite animation (defined globally)
window.startSatelliteAnimation = function() {
    if (!satelliteAnimationId) {
        resizeSatelliteCanvas();
        drawSatellite();
    }
};

// Function to stop satellite animation (defined globally)
window.stopSatelliteAnimation = function() {
    if (satelliteAnimationId) {
        cancelAnimationFrame(satelliteAnimationId);
        satelliteAnimationId = null;
    }
};

// Initialize satellite canvas on window load
window.addEventListener('resize', () => {
    resizeSatelliteCanvas();
    if (satelliteAnimationId) {
        // Redraw immediately on resize
        drawSatellite();
    }
});

// Start animation when section becomes visible
const satelliteSection = document.getElementById('satellite');
if (satelliteSection) {
    // Use MutationObserver to watch for class changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (satelliteSection.classList.contains('active')) {
                    setTimeout(() => {
                        if (window.startSatelliteAnimation) {
                            window.startSatelliteAnimation();
                        }
                    }, 50);
                } else {
                    if (window.stopSatelliteAnimation) {
                        window.stopSatelliteAnimation();
                    }
                }
            }
        });
    });
    
    observer.observe(satelliteSection, {
        attributes: true,
        attributeFilter: ['class']
    });
    
    // Start if already visible
    if (satelliteSection.classList.contains('active')) {
        setTimeout(() => {
            if (window.startSatelliteAnimation) {
                window.startSatelliteAnimation();
            }
        }, 100);
    }
}

// RF Signal Waveforms
function drawSignal(canvasId, frequency = 1, amplitude = 1) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    
    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    
    resize();
    window.addEventListener('resize', resize);
    
    let time = 0;
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const centerY = canvas.height / 2;
        const samples = canvas.width;
        
        for (let x = 0; x < samples; x++) {
            const t = (x / samples) * Math.PI * 4 + time;
            const y = centerY + Math.sin(t * frequency) * amplitude * 30;
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        // Add noise/signal modulation
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        for (let x = 0; x < samples; x++) {
            const t = (x / samples) * Math.PI * 8 + time * 2;
            const y = centerY + Math.sin(t * frequency * 2) * amplitude * 15;
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        time += 0.05;
        requestAnimationFrame(animate);
    }
    
    animate();
}

drawSignal('overviewSignal', 1, 1);
drawSignal('skillsSignal', 1.5, 0.8);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .stat-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s, transform 0.5s';
    observer.observe(card);
});