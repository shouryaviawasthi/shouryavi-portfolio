// ==========================================================================
// Portfolio Interactivity & Event Handlers
// Shouryavi Awasthi — Full Stack Software Engineer & AI Developer
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCopyEmail();
  initProjectModals();
  initDownloadCV();
  initScrollSpy();
});

/* --- 1. Mobile Navigation Toggle --- */
function initNavigation() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuToggle || !mobileDrawer) return;

  const toggleMenu = () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    mobileDrawer.classList.toggle('open');
  };

  menuToggle.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileDrawer.classList.remove('open');
    });
  });

  // Close when clicking outside header
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#header') && mobileDrawer.classList.contains('open')) {
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileDrawer.classList.remove('open');
    }
  });
}

/* --- 2. Copy Email to Clipboard & Toast Feedback --- */
function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const copyTooltip = document.getElementById('copyTooltip');
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  const emailToCopy = '524410028@nitkkr.ac.in';
  let toastTimer = null;

  const showToast = (message) => {
    if (toastTimer) clearTimeout(toastTimer);
    toastMessage.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  };

  const copyEmail = async (e) => {
    e.preventDefault();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailToCopy);
      } else {
        // Fallback for non-https/legacy
        const textArea = document.createElement('textarea');
        textArea.value = emailToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      if (copyTooltip) copyTooltip.textContent = 'Copied!';
      showToast('Copied email: 524410028@nitkkr.ac.in');

      setTimeout(() => {
        if (copyTooltip) copyTooltip.textContent = 'Copy';
      }, 2000);
    } catch (err) {
      showToast('Copied: 524410028@nitkkr.ac.in');
    }
  };

  if (copyBtn) copyBtn.addEventListener('click', copyEmail);
}

/* --- 3. Interactive Project Preview Modal --- */
function initProjectModals() {
  const projectCards = document.querySelectorAll('.project-card');
  const modal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDismissBtn = document.getElementById('modalDismissBtn');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTag = document.getElementById('modalTag');
  const modalActionBtn = document.getElementById('modalActionBtn');
  const modalHighlights = document.getElementById('modalHighlights');

  if (!modal) return;

  const projectDetails = {
    'social-scheduler': {
      title: 'AI Social Media Scheduler',
      tag: 'GENERATIVE AI & WORKFLOW AUTOMATION',
      img: 'assets/project-social-scheduler.jpg',
      desc: 'An AI-powered social media management and scheduling platform that simplifies multi-platform content creation, scheduling, and publishing across LinkedIn, Instagram, X, and YouTube.',
      highlights: [
        'Built an AI Content Composer that generates customized social media captions and post content from user prompts.',
        'Integrated Generative AI APIs for text generation, AI-powered image creation, and YouTube thumbnail generation.',
        'Engineered RESTful APIs, JWT-based authentication, and MongoDB persistence for scheduling and workflow analytics.'
      ],
      url: 'https://github.com'
    },
    'interview-platform': {
      title: 'AI Interview Platform',
      tag: 'WEBRTC & REAL-TIME LLM ASSESSMENT',
      img: 'assets/project-interview-platform.jpg',
      desc: 'An AI-driven mock interview simulation platform providing real-time audio-video communication, speech-to-text live transcription, and LLM-powered candidate evaluations.',
      highlights: [
        'Engineered real-time audio-video communication using React.js, Node.js, WebRTC, Socket.IO, and PostgreSQL.',
        'Integrated Deepgram speech-to-text transcription and Groq Llama-3.1-8B to analyze resumes, job descriptions, and interview answers.',
        'Implemented automated interview evaluation, radar scorecards, and downloadable PDF performance assessment reports.'
      ],
      url: 'https://github.com'
    }
  };

  const openModal = (projectKey) => {
    const data = projectDetails[projectKey];
    if (!data) return;

    modalImg.src = data.img;
    modalImg.alt = data.title;
    modalTitle.textContent = data.title;
    modalTag.textContent = data.tag;
    modalDesc.textContent = data.desc;
    modalActionBtn.href = data.url;

    // Render highlights
    if (modalHighlights) {
      modalHighlights.innerHTML = data.highlights.map(item => `
        <div class="modal-highlight-item">
          <span class="modal-highlight-bullet">▹</span>
          <span>${item}</span>
        </div>
      `).join('');
    }

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.hidden = true;
    document.body.style.overflow = '';
  };

  projectCards.forEach(card => {
    const key = card.getAttribute('data-project');
    card.addEventListener('click', () => openModal(key));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(key);
      }
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeModal);

  // Close modal when clicking outer backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) {
      closeModal();
    }
  });
}

/* --- 4. Download CV Feature (PDF Format) --- */
function initDownloadCV() {
  const downloadBtn = document.getElementById('btnDownloadCv');
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  if (!downloadBtn) return;

  downloadBtn.addEventListener('click', () => {
    // Show toast feedback for PDF download
    if (toast && toastMessage) {
      toastMessage.textContent = 'Shouryavi Awasthi Resume (PDF) downloading...';
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3500);
    }
  });
}

/* --- 5. ScrollSpy & Active Link Highlight --- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -40% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}
