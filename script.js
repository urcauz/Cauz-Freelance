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

// ================= PORTFOLIO DATA =================
const portfolioProjects = {
  1: {
    title: "Gaming Community Server",
    category: "Discord Server",
    image: "https://i.ibb.co/DfSMJ44X/image.png",
    description: "Built a comprehensive Discord server for a rapidly growing gaming community with custom moderation and automation.",
    details: [
      "Custom welcome & verification system",
      "Advanced moderation bots",
      "Leveling & rewards",
      "Event scheduling",
      "Reaction roles",
      "Admin analytics"
    ],
    results: "500 → 5,000+ members in 3 months",
    tech: ["Discord.js", "Node.js", "SQLite"],
    duration: "2 weeks"
  },

  2: {
    title: "E-commerce Storefront",
    category: "Web Development",
    image: "https://i.ibb.co/QFzX5hR/ecommerce.png",
    description: "Full-stack e-commerce platform with payments and admin panel.",
    details: [
      "Stripe integration",
      "Product filtering",
      "Cart system",
      "Admin dashboard",
      "Email notifications"
    ],
    results: "40% sales increase",
    tech: ["React", "Node.js", "MongoDB"],
    duration: "2 weeks"
  }
};

// ================= PORTFOLIO MODAL =================
function openPortfolioModal(projectId) {
  const modal = document.getElementById('portfolioModal');
  const content = document.getElementById('portfolioModalContent');
  const project = portfolioProjects[projectId];
  if (!project) return;

  content.innerHTML = `
    <div style="display:flex;justify-content:center;margin-bottom:1.5rem;">
      <img 
        src="${project.image}" 
        alt="${project.title}"
        style="
          max-width:100%;
          border-radius:12px;
          box-shadow:0 15px 40px rgba(0,0,0,0.45);
        "
      />
    </div>

    <div style="color:#667eea;text-align:center;text-transform:uppercase;font-size:.85rem;">
      ${project.category}
    </div>

    <h2 style="text-align:center;color:#fff;margin:1rem 0;">
      ${project.title}
    </h2>

    <p style="color:#aaa;line-height:1.7;">
      ${project.description}
    </p>

    <h3 style="color:#667eea;margin-top:1.5rem;">Key Features</h3>
    <ul style="color:#ddd;line-height:1.9;">
      ${project.details.map(d => `<li>${d}</li>`).join('')}
    </ul>

    <div style="margin-top:1.5rem;padding:1rem;border:1px solid rgba(102,126,234,.3);border-radius:8px;">
      <strong style="color:#27c93f;">Results:</strong>
      <p>${project.results}</p>
    </div>

    <p style="margin-top:1rem;"><strong>Tech:</strong> ${project.tech.join(', ')}</p>
    <p><strong>Duration:</strong> ${project.duration}</p>
  `;

  modal.classList.add('active');
}

function closePortfolioModal() {
  document.getElementById('portfolioModal').classList.remove('active');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePortfolioModal();
});

// ================= RESIZE =================
window.addEventListener('resize', () => {
  particlesCanvas.width = window.innerWidth;
  particlesCanvas.height = window.innerHeight;
});