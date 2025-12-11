// Custom Cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  
  setTimeout(() => {
    cursorFollower.style.left = e.clientX + 'px';
    cursorFollower.style.top = e.clientY + 'px';
  }, 100);
});

// Particles Animation
const particlesCanvas = document.getElementById('particles-canvas');
const pCtx = particlesCanvas.getContext('2d');
particlesCanvas.width = window.innerWidth;
particlesCanvas.height = window.innerHeight;

const particles = [];
const particleCount = 50;

class Particle {
  constructor() {
    this.x = Math.random() * particlesCanvas.width;
    this.y = Math.random() * particlesCanvas.height;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.radius = Math.random() * 2 + 1;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    
    if (this.x < 0 || this.x > particlesCanvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > particlesCanvas.height) this.vy *= -1;
  }
  
  draw() {
    pCtx.beginPath();
    pCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    pCtx.fillStyle = 'rgba(102, 126, 234, 0.5)';
    pCtx.fill();
  }
}

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
  
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  
  // Draw connections
  particles.forEach((p1, i) => {
    particles.slice(i + 1).forEach(p2 => {
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 150) {
        pCtx.beginPath();
        pCtx.moveTo(p1.x, p1.y);
        pCtx.lineTo(p2.x, p2.y);
        pCtx.strokeStyle = `rgba(102, 126, 234, ${0.2 * (1 - dist / 150)})`;
        pCtx.stroke();
      }
    });
  });
  
  requestAnimationFrame(animateParticles);
}

animateParticles();

// Matrix Rain Effect
const matrixCanvas = document.getElementById('matrix-canvas');
const mCtx = matrixCanvas.getContext('2d');
matrixCanvas.width = window.innerWidth;
matrixCanvas.height = window.innerHeight;

const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const fontSize = 14;
const columns = matrixCanvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
  mCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
  
  mCtx.fillStyle = '#0f0';
  mCtx.font = fontSize + 'px monospace';
  
  for (let i = 0; i < drops.length; i++) {
    const text = chars[Math.floor(Math.random() * chars.length)];
    mCtx.fillText(text, i * fontSize, drops[i] * fontSize);
    
    if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

let matrixInterval;
function toggleMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  canvas.classList.toggle('active');
  
  if (canvas.classList.contains('active')) {
    matrixInterval = setInterval(drawMatrix, 33);
  } else {
    clearInterval(matrixInterval);
  }
}

// Theme Toggle
let isDark = true;
function toggleTheme() {
  isDark = !isDark;
  document.body.classList.toggle('light-mode');
  playSound();
}

// Sound Effects
let soundEnabled = true;
function toggleSound() {
  soundEnabled = !soundEnabled;
  document.getElementById('sound-btn').textContent = soundEnabled ? '🔊' : '🔇';
}

function playSound() {
  if (!soundEnabled) return;
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const o = audioContext.createOscillator();
  const g = audioContext.createGain();
  o.connect(g);
  g.connect(audioContext.destination);
  o.frequency.value = 800;
  g.gain.value = 0.1;
  o.start(0);
  g.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.1);
  o.stop(audioContext.currentTime + 0.1);
}

// Click sound for buttons
document.querySelectorAll('button, .btn, .service-card').forEach(el => {
  el.addEventListener('click', playSound);
});

// Flip Cards
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('click', function() {
    this.classList.toggle('flipped');
  });
});

// Achievement System
let achievements = {
  firstVisit: false,
  scrolled: false,
  clicked5: false,
  stayed5min: false
};

let clickCount = 0;

function showAchievement(text, icon) {
  const achievement = document.createElement('div');
  achievement.className = 'achievement';
  achievement.innerHTML = `<span style="font-size: 2rem;">${icon}</span><div><strong>Achievement Unlocked!</strong><br>${text}</div>`;
  document.body.appendChild(achievement);
  
  setTimeout(() => {
    achievement.classList.add('hide');
    setTimeout(() => achievement.remove(), 500);
  }, 3000);
}

// First visit achievement
if (!achievements.firstVisit) {
  setTimeout(() => {
    showAchievement('Welcome to my portfolio!', '👋');
    achievements.firstVisit = true;
  }, 2000);
}

// Scroll achievement
window.addEventListener('scroll', () => {
  if (!achievements.scrolled && window.scrollY > 500) {
    showAchievement('You\'re exploring! Keep going!', '🚀');
    achievements.scrolled = true;
  }
});

// Click achievement
document.addEventListener('click', () => {
  clickCount++;
  if (!achievements.clicked5 && clickCount >= 5) {
    showAchievement('You clicked 5 times!', '🖱️');
    achievements.clicked5 = true;
  }
});

// 5 minute achievement
setTimeout(() => {
  if (!achievements.stayed5min) {
    showAchievement('You\'ve been here 5 minutes!', '⏰');
    achievements.stayed5min = true;
  }
}, 300000);

// Konami Code Easter Egg
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      showAchievement('KONAMI CODE ACTIVATED! 🎮', '🏆');
      document.body.style.animation = 'rainbow 2s linear infinite';
      konamiIndex = 0;
      setTimeout(() => {
        document.body.style.animation = '';
      }, 5000);
    }
  } else {
    konamiIndex = 0;
  }
});

// Parallax Scrolling
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll('.bg-animation, .grid-overlay');
  parallaxElements.forEach(el => {
    el.style.transform = `translateY(${scrolled * 0.5}px)`;
  });
});

// Scroll Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('section, .service-card').forEach(el => {
  observer.observe(el);
});

// Resize handlers
window.addEventListener('resize', () => {
  particlesCanvas.width = window.innerWidth;
  particlesCanvas.height = window.innerHeight;
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
});

// Menu Toggle
function toggleMenu() {
  const mobileNav = document.getElementById('mobileNav');
  mobileNav.classList.toggle('active');
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 60;
      const targetPosition = target.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
  const mobileNav = document.getElementById('mobileNav');
  const menuBtn = document.querySelector('.mobile-menu-btn');
  if (!mobileNav.contains(e.target) && !menuBtn.contains(e.target)) {
    mobileNav.classList.remove('active');
  }
});

// Filter Services
function filterServices(category) {
  const cards = document.querySelectorAll('.service-card');
  const buttons = document.querySelectorAll('.filter-btn');
  
  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  cards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}