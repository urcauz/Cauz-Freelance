// ================= CUSTOM CURSOR =================
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

// ================= PARTICLES =================
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
    pCtx.fillStyle = 'rgba(102,126,234,0.5)';
    pCtx.fill();
  }
}

for (let i = 0; i < particleCount; i++) particles.push(new Particle());

function animateParticles() {
  pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });

  particles.forEach((p1, i) => {
    particles.slice(i + 1).forEach(p2 => {
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        pCtx.beginPath();
        pCtx.moveTo(p1.x, p1.y);
        pCtx.lineTo(p2.x, p2.y);
        pCtx.strokeStyle = `rgba(102,126,234,${0.2 * (1 - dist / 150)})`;
        pCtx.stroke();
      }
    });
  });

  requestAnimationFrame(animateParticles);
}
animateParticles();

// ================= MATRIX EFFECT =================
const matrixCanvas = document.getElementById('matrix-canvas');
const mCtx = matrixCanvas.getContext('2d');
matrixCanvas.width = window.innerWidth;
matrixCanvas.height = window.innerHeight;

const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const fontSize = 16;
const columns = matrixCanvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

let matrixEnabled = false;

function drawMatrix() {
  if (!matrixEnabled) return;
  
  mCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
  
  mCtx.fillStyle = '#0f0';
  mCtx.font = fontSize + 'px monospace';
  
  for (let i = 0; i < drops.length; i++) {
    const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
    mCtx.fillText(text, i * fontSize, drops[i] * fontSize);
    
    if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

let matrixInterval;

function toggleMatrix() {
  matrixEnabled = !matrixEnabled;
  const canvas = document.getElementById('matrix-canvas');
  
  if (matrixEnabled) {
    canvas.classList.add('active');
    matrixInterval = setInterval(drawMatrix, 33);
  } else {
    canvas.classList.remove('active');
    clearInterval(matrixInterval);
    mCtx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
  }
  playSound();
}

// ================= THEME TOGGLE =================
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  playSound();
}

// ================= SOUND TOGGLE =================
let soundEnabled = true;

function toggleSound() {
  soundEnabled = !soundEnabled;
  const btn = document.getElementById('sound-btn');
  btn.textContent = soundEnabled ? '🔊' : '🔇';
  playSound();
}

function playSound() {
  if (!soundEnabled) return;
  
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 800;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
}

// ================= MOBILE MENU =================
function toggleMenu() {
  const mobileNav = document.getElementById('mobileNav');
  mobileNav.classList.toggle('active');
  playSound();
}

// ================= SERVICE FILTER =================
function filterServices(category) {
  const cards = document.querySelectorAll('.service-card');
  const buttons = document.querySelectorAll('.filter-buttons .filter-btn');
  
  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  cards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'block';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 10);
    } else {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.display = 'none';
      }, 300);
    }
  });
  
  playSound();
}

// ================= SERVICE CARD FLIP =================
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('click', function(e) {
    // Don't flip if clicking on a link or button
    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
    
    this.classList.toggle('flipped');
    playSound();
  });
});

// ================= PORTFOLIO FILTER =================
function filterPortfolio(category) {
  const cards = document.querySelectorAll('.portfolio-card');
  const buttons = document.querySelectorAll('.portfolio-filters .filter-btn');
  
  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  cards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.classList.remove('hidden');
      card.style.display = 'block';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      }, 10);
    } else {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.8)';
      setTimeout(() => {
        card.classList.add('hidden');
      }, 300);
    }
  });
  
  playSound();
}

// ================= PORTFOLIO DATA =================
const portfolioProjects = {
  1: {
    title: "Gaming Community Server",
    category: "Discord Server",
    image: "https://i.ibb.co/DfSMJ44X/image.png",
    description: "Built a comprehensive Discord server for a rapidly growing gaming community with custom moderation and automation.",
    details: [
      "Custom welcome & verification system",
      "Advanced moderation bots with auto-mod features",
      "Leveling system & rewards program",
      "Event scheduling & announcements",
      "Reaction roles for self-assignment",
      "Admin analytics dashboard"
    ],
    results: "Grew from 500 to 5,000+ active members in just 3 months",
    tech: ["Discord.js", "Node.js", "SQLite", "Redis"],
    duration: "2 weeks",
    link: null
  },
  2: {
    title: "E-commerce Storefront",
    category: "Web Development",
    image: "https://i.ibb.co/dJKqZ2MR/image.png",
    description: "Full-stack e-commerce platform with payment processing, inventory management, and admin dashboard.",
    details: [
      "Stripe payment integration",
      "Advanced product filtering & search",
      "Shopping cart with persistent storage",
      "Admin dashboard with analytics",
      "Email notifications for orders",
      "Responsive design for all devices"
    ],
    results: "40% increase in sales, 60% faster checkout process",
    tech: ["React", "Node.js", "Express", "MongoDB", "Stripe API"],
    duration: "2 weeks",
    link: null
  },
  3: {
    title: "Instagram Reels Campaign",
    category: "Video Editing",
    image: "https://i.ibb.co/VpBQqgR4/image.png",
    description: "Created a viral video series for a fitness brand that dramatically increased their social media presence.",
    details: [
      "15 high-quality reels with trending formats",
      "Professional color grading & effects",
      "Dynamic captions and subtitles",
      "Trending music selection",
      "Platform-optimized exports",
      "Content strategy consulting"
    ],
    results: "2M+ views, 50K new followers, 300% engagement increase",
    tech: ["Adobe Premiere Pro", "After Effects", "DaVinci Resolve"],
    duration: "3 weeks",
    link: null
  },
  4: {
    title: "Brand Identity Package",
    category: "Graphic Design",
    image: "https://i.ibb.co/QvChvsyk/image.png",
    description: "Complete brand overhaul for a tech startup, from logo to full style guide and marketing materials.",
    details: [
      "3 logo design concepts with revisions",
      "Comprehensive brand guidelines",
      "Color palette & typography system",
      "Social media template pack",
      "Business card & letterhead designs",
      "Icon set & UI elements"
    ],
    results: "300% increase in brand recognition, successful Series A funding",
    tech: ["Adobe Illustrator", "Photoshop", "Figma"],
    duration: "4 weeks",
    link: null
  },
  5: {
    title: "Custom Ticketing Bot",
    category: "Discord Bot",
    image: "https://i.ibb.co/v4f31WDC/image.png",
    description: "Advanced support ticket system for a customer service Discord server with automation and analytics.",
    details: [
      "Custom ticket creation with categories",
      "Automated response system",
      "Role assignment & permissions",
      "Ticket logging & analytics",
      "Multi-language support",
      "Integration with external CRM"
    ],
    results: "500+ tickets handled monthly, 70% faster response time",
    tech: ["Node.js", "Discord.js", "PostgreSQL", "Docker"],
    duration: "3 weeks",
    link: null
  },
  6: {
    title: "SaaS Landing Page",
    category: "Web Development",
    image: "https://i.ibb.co/TDPfKxmb/image.png",
    description: "High-converting landing page with animations, email capture, and A/B testing for a B2B SaaS company.",
    details: [
      "Conversion-optimized layout",
      "Smooth scroll animations",
      "Email capture with validation",
      "A/B testing setup",
      "SEO optimization",
      "Analytics integration"
    ],
    results: "45% conversion rate, 200% increase in sign-ups",
    tech: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
    duration: "1 week",
    link: null
  }
};

// ================= PORTFOLIO MODAL =================
function openPortfolioModal(projectId) {
  const modal = document.getElementById('portfolioModal');
  const content = document.getElementById('portfolioModalContent');
  const project = portfolioProjects[projectId];
  
  if (!project) return;

  content.innerHTML = `
    <div style="margin-bottom:2rem;">
      <img 
        src="${project.image}" 
        alt="${project.title}"
        style="
          width:100%;
          max-height:400px;
          object-fit:cover;
          border-radius:12px;
          box-shadow:0 15px 40px rgba(0,0,0,0.45);
        "
      />
    </div>

    <div style="color:#667eea;text-transform:uppercase;font-size:.85rem;font-family:'Space Mono',monospace;margin-bottom:0.5rem;">
      ${project.category}
    </div>

    <h2 style="color:#fff;margin:0 0 1rem 0;font-size:2rem;">
      ${project.title}
    </h2>

    <p style="color:#c0c0d0;line-height:1.8;font-size:1.05rem;margin-bottom:2rem;">
      ${project.description}
    </p>

    <h3 style="color:#667eea;margin:2rem 0 1rem 0;font-size:1.3rem;">Key Features</h3>
    <ul style="color:#ddd;line-height:2;padding-left:1.5rem;">
      ${project.details.map(d => `<li style="margin-bottom:0.5rem;">${d}</li>`).join('')}
    </ul>

    <div style="margin-top:2rem;padding:1.5rem;border:2px solid rgba(102,126,234,.4);border-radius:12px;background:rgba(102,126,234,0.05);">
      <strong style="color:#27c93f;font-size:1.1rem;">🎯 Results:</strong>
      <p style="color:#e0e0e0;margin-top:0.5rem;font-size:1.05rem;">${project.results}</p>
    </div>

    <div style="margin-top:2rem;display:flex;gap:2rem;flex-wrap:wrap;">
      <div>
        <strong style="color:#667eea;">Tech Stack:</strong>
        <p style="color:#c0c0d0;margin-top:0.5rem;">${project.tech.join(', ')}</p>
      </div>
      <div>
        <strong style="color:#667eea;">Duration:</strong>
        <p style="color:#c0c0d0;margin-top:0.5rem;">${project.duration}</p>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  playSound();
}

function closePortfolioModal() {
  const modal = document.getElementById('portfolioModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
  playSound();
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePortfolioModal();
    if (document.getElementById('terminalPopup').classList.contains('active')) {
      closeTerminal();
    }
  }
});

// ================= TERMINAL FUNCTIONALITY =================
const terminalPopup = document.getElementById('terminalPopup');
const terminalOverlay = document.getElementById('terminalOverlay');
const terminalInput = document.getElementById('terminalInput');
const terminalOutput = document.getElementById('terminalOutput');

const commands = {
  help: {
    description: 'Show available commands',
    action: () => {
      return `<div class="command-list">
Available commands: <br>
  <span style="color: #27c93f;">help</span>       - Show this help message <br>
  <span style="color: #27c93f;">about</span>      - Learn more about me <br>
  <span style="color: #27c93f;">services</span>   - View my services <br>
  <span style="color: #27c93f;">contact</span>    - Get my contact info <br>
  <span style="color: #27c93f;">skills</span>     - See my skillset <br>
  <span style="color: #27c93f;">projects</span>   - View project stats <br>
  <span style="color: #27c93f;">social</span>     - My social media links <br>
  <span style="color: #27c93f;">clear</span>      - Clear terminal </br>
  <span style="color: #27c93f;">matrix</span>     - Toggle matrix effect <br>
  <span style="color: #27c93f;">theme</span>      - Toggle light/dark mode <br>
  <span style="color: #27c93f;">whoami</span>     - Display current user <br>
</div>`;
    }
  },
  about: {
    description: 'Learn more about Cauz',
    action: () => {
      return `<div class="command-result">
👋 Hey! I'm Cauz - a freelancer who loves building cool stuff! </br>
</br>
I specialize in: </br>
- Discord server setups & custom bots </br>
- Web development (HTML, CSS, JS, React) </br>
- Social media management & content creation </br>
- Video editing & graphic design </br>
- Lead generation & marketing </br>
</br>
Always available for hire and ready to bring your ideas to life! 🚀 </br>
</div>`;
    }
  },
  services: {
    description: 'View available services',
    action: () => {
      setTimeout(() => {
        closeTerminal();
        document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
      }, 500);
      return `<div class="command-result success">
✓ Navigating to services section...

Quick overview: <br>
- Discord Server Setup ($$) <br>
- Web Development ($$$$) <br>
- Reels Editing ($$) <br>
- Social Media Management ($$$) <br>
- Lead Generation ($$$) <br>
...and 11 more services! <br>
</div>`;
    }
  },
  contact: {
    description: 'Get contact information',
    action: () => {
      setTimeout(() => {
        closeTerminal();
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
      }, 500);
      return `<div class="command-result success">
✓ Contact information: <br> 

📨 Email: urcauzz@gmail.com <br>
💬 Discord: @ur_cauz <br>
💻 GitHub: github.com/urcauz <br>
🌐 Server: discord.gg/na94uFcJPM <br>

Response time: Usually within 24 hours! <br>
</div>`;
    }
  },
  skills: {
    description: 'Display skill set',
    action: () => {
      return `<div class="command-result">
💻 Technical Skills: <br>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ <br>
HTML/CSS/JS        ████████████ 95% <br>
React              ██████████░░ 85% <br>
Discord Bots       ████████████ 98% <br>
Video Editing      ████████░░░░ 75% <br>
Graphic Design     ██████████░░ 80% <br>
SEO/Marketing      ████████░░░░ 70% <br>
API Integration    ██████████░░ 85% <br>
</div>`;
    }
  },
  projects: {
    description: 'View project statistics',
    action: () => {
      return `<div class="command-result">
📊 Project Statistics: <br>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ <br>
Total Projects:      50+  <br>
Client Satisfaction: 98% <br>
Avg Response Time:   24 hours <br>
Active Since:        2021 <br>
Repeat Clients:      35+ <br>
</div>`;
    }
  },
  social: {
    description: 'Social media links',
    action: () => {
      return `<div class="command-result">
🔗 Find me on: <br>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ <br>
- Discord: @ur_cauz <br>
- GitHub: github.com/urcauz <br>
- Email: urcauzz@gmail.com <br>
- Server: discord.gg/na94uFcJPM <br>

Let's connect! 🤝
</div>`;
    }
  },
  clear: {
    description: 'Clear terminal screen',
    action: () => {
      terminalOutput.innerHTML = `
        <div class="terminal-line">
          <span style="color: #667eea;">╔═══════════════════════════════════════╗</span>
        </div>
        <div class="terminal-line">
          <span style="color: #667eea;">║</span> <span style="color: #0f0;">CAUZ INTERACTIVE TERMINAL v1.0</span>      <span style="color: #667eea;">║</span>
        </div>
        <div class="terminal-line">
          <span style="color: #667eea;">╚═══════════════════════════════════════╝</span>
        </div>
        <div class="terminal-line"></div>
        <div class="terminal-line">Type <span style="color: #27c93f;">help</span> to see available commands.</div>
        <div class="terminal-line"></div>
      `;
      return '';
    }
  },
  matrix: {
    description: 'Toggle matrix effect',
    action: () => {
      toggleMatrix();
      return `<div class="command-result success">✓ Matrix effect toggled!</div>`;
    }
  },
  theme: {
    description: 'Toggle theme',
    action: () => {
      toggleTheme();
      return `<div class="command-result success">✓ Theme switched!</div>`;
    }
  },
  whoami: {
    description: 'Display current user',
    action: () => {
      return `<div class="command-result">cauz@portfolio</div>`;
    }
  }
};

function openTerminal() {
  terminalPopup.classList.add('active');
  terminalOverlay.classList.add('active');
  terminalInput.focus();
  document.body.style.overflow = 'hidden';
  playSound();
}

function closeTerminal() {
  terminalPopup.classList.remove('active');
  terminalOverlay.classList.remove('active');
  document.body.style.overflow = '';
  playSound();
}

terminalOverlay.addEventListener('click', closeTerminal);

terminalInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const command = terminalInput.value.trim().toLowerCase();
    terminalInput.value = '';
    
    // Add command to output
    const commandLine = document.createElement('div');
    commandLine.className = 'terminal-line';
    commandLine.innerHTML = `<span class="terminal-prompt">$</span> ${command}`;
    terminalOutput.appendChild(commandLine);
    
    // Execute command
    if (commands[command]) {
      const result = commands[command].action();
      if (result) {
        const resultLine = document.createElement('div');
        resultLine.className = 'terminal-line';
        resultLine.innerHTML = result;
        terminalOutput.appendChild(resultLine);
      }
    } else if (command) {
      const errorLine = document.createElement('div');
      errorLine.className = 'terminal-line';
      errorLine.innerHTML = `<div class="command-result error">Command not found: ${command}<br>Type <span style="color: #27c93f;">help</span> for available commands.</div>`;
      terminalOutput.appendChild(errorLine);
    }
    
    // Add empty line
    const emptyLine = document.createElement('div');
    emptyLine.className = 'terminal-line';
    terminalOutput.appendChild(emptyLine);
    
    // Scroll to bottom
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    
    playSound();
  }
});

// Keyboard shortcut to open terminal (Ctrl+`)
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === '`') {
    e.preventDefault();
    if (terminalPopup.classList.contains('active')) {
      closeTerminal();
    } else {
      openTerminal();
    }
  }
});

// ================= SMOOTH SCROLL =================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      playSound();
    }
  });
});

// ================= SCROLL ANIMATIONS =================
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

document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});

// ================= RESIZE HANDLER =================
window.addEventListener('resize', () => {
  particlesCanvas.width = window.innerWidth;
  particlesCanvas.height = window.innerHeight;
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
});

// ================= LOADING ANIMATION =================
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s';
    document.body.style.opacity = '1';
  }, 100);
});

console.log('%c⚡ CAUZ PORTFOLIO ⚡', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cLooking to hire? Contact: urcauzz@gmail.com', 'color: #27c93f; font-size: 14px;');