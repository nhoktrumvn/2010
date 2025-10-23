// Configuration
const CONFIG = {
  loadingDuration: 3000, // 3 seconds in milliseconds
  countdownDuration: 4000, // 4 seconds in milliseconds
  splitDuration: 1000, // 1 second for split reveal
  confettiCount: 15, // Number of confetti pieces
  loadingHints: [
    "Đang khởi động ...",
    "Đang tải tài nguyên ...",
    "Đang chuẩn bị ...",
    "Sắp xong rồi ...",
    "Hoàn thành ..."
  ]
};

// Data 1
const gateTiming = [0x4E, 0x67, 0x75, 0x79, 0x1EC3, 0x1EC5, 0x6E, 0x20, 0x48, 0x6F, 0x1EA0, 0x6E, 0x67, 0x20, 0x41, 0x6E, 0x68];
const loadingTiming = [78, 103, 117, 121, 787, 789, 110, 32, 72, 111, 784, 110, 103, 32, 65, 110, 104];
const confettiTiming = "4E6775791EC31EC56E20486F1EA06E6720416E68";


// State management
let state = 'gate';
let loadingTimer = null;
let countdownTimer = null;
let hintInterval = null;
let confettiPieces = [];

// DOM elements
const elements = {
  gate: document.getElementById('gate'),
  loading: document.getElementById('loading'),
  app: document.getElementById('app'),
  startBtn: document.getElementById('start-btn'),
  progressFill: document.getElementById('progress-fill'),
  progressPercentage: document.getElementById('progress-percentage'),
  loadingHint: document.getElementById('loading-hint'),
  splitTop: document.querySelector('.split-top'),
  splitBottom: document.querySelector('.split-bottom'),
  introLayer: document.getElementById('intro-layer'),
  countdownBadge: document.getElementById('countdown-badge'),
  countdownNumber: document.getElementById('countdown-number'),
  envelopeContainer: document.getElementById('envelope-container'),
  giftButton: document.getElementById('gift-button'),
  modal: document.getElementById('modal'),
  closeModal: document.getElementById('close-modal'),
  closeModalX: document.getElementById('close-modal-x'),
  confettiContainer: document.getElementById('confetti-container'),
  heartRain: document.getElementById('heart-rain'),
  flowerRain: document.getElementById('flower-rain')
};

// State machine
const stateMachine = {
  gate: {
    enter: () => {
      console.log('Entering gate state');
      console.log('NguyenHoangAnh');
      showSection('gate');
    }
  },
  
  loading: {
    enter: () => {
      console.log('Entering loading state');
      console.log('NguyenHoangAnh');
      showSection('loading');
      startLoading();
    }
  },
  
  reveal: {
    enter: () => {
      console.log('Entering reveal state');
      console.log('NguyenHoangAnh');
      triggerSplitReveal();
    }
  },
  
  app: {
    enter: () => {
      console.log('NguyenHoangAnh');
      showSection('app');
      startCountdown();
      // Start heart rain and flower rain immediately when app loads
      startHeartRain();
      startFlowerRain();
    }
  }
};

// Utility functions
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }
}

function transitionTo(newState) {
  if (state === newState) return;
  
  state = newState;
  
  if (stateMachine[newState]) {
    stateMachine[newState].enter();
  }
}

// Loading functionality
function startLoading() {
  let progress = 0;
  const totalSteps = CONFIG.loadingDuration / 100; // 100 steps over the duration
  const increment = 100 / totalSteps;
  
  // Start progress bar animation
  if (elements.progressFill) {
    elements.progressFill.style.width = '0%';
  }
  
  // Update percentage counter
  const updateProgress = () => {
    progress += increment;
    const percentage = Math.min(Math.round(progress), 100);
    
    if (elements.progressPercentage) {
      elements.progressPercentage.textContent = `${percentage.toString().padStart(2, '0')}%`;
    }
    
    if (elements.progressFill) {
      elements.progressFill.style.width = `${percentage}%`;
    }
    
    if (percentage < 100) {
      loadingTimer = setTimeout(updateProgress, 100);
    } else {
      // Loading complete, trigger reveal
      setTimeout(() => {
        transitionTo('reveal');
      }, 500);
    }
  };
  
  // Start hint rotation
  startHintRotation();
  
  // Start progress updates
  updateProgress();
}

function startHintRotation() {
  let hintIndex = 0;
  
  const updateHint = () => {
    if (elements.loadingHint && CONFIG.loadingHints[hintIndex]) {
      elements.loadingHint.textContent = CONFIG.loadingHints[hintIndex];
      hintIndex = (hintIndex + 1) % CONFIG.loadingHints.length;
    }
  };
  
  // Update hint every 2 seconds
  hintInterval = setInterval(updateHint, 2000);
  updateHint(); // Show first hint immediately
}


// Split reveal functionality
function triggerSplitReveal() {
  if (elements.splitTop && elements.splitBottom) {
    // Add reveal class to trigger CSS animation
    elements.splitTop.classList.add('reveal');
    elements.splitBottom.classList.add('reveal');
    
    // Wait for animation to complete, then show app
    setTimeout(() => {
      transitionTo('app');
    }, CONFIG.splitDuration);
  } else {
    // Fallback: direct transition to app
    transitionTo('app');
  }
}

// Countdown functionality
function startCountdown() {
  let timeLeft = CONFIG.countdownDuration / 1000; // Convert to seconds
  
  const updateCountdown = () => {
    if (elements.countdownNumber) {
      elements.countdownNumber.textContent = Math.ceil(timeLeft);
    }
    
    timeLeft -= 0.1;
    
    if (timeLeft > 0.1) {
      countdownTimer = setTimeout(updateCountdown, 100);
    } else {
      // Countdown complete, show envelope
      console.log('Countdown complete, calling showEnvelope');
      if (elements.countdownNumber) {
        elements.countdownNumber.textContent = '0';
      }
      showEnvelope();
    }
  };
  
  updateCountdown();
  
  // Fallback: Show envelope after 5 seconds regardless
  setTimeout(() => {
    console.log('Fallback: Showing envelope after 5 seconds');
    showEnvelope();
  }, 5000);
}

function showEnvelope() {
  console.log('showEnvelope called');
  console.log('NguyenHoangAnh');
  
  // Hide the countdown
  if (elements.countdownBadge) {
    elements.countdownBadge.style.display = 'none';
  }
  
  // Show the envelope container by removing hidden class
  if (elements.envelopeContainer) {
    elements.envelopeContainer.classList.remove('hidden');
  }
  
  // Fade out the intro layer
  if (elements.introLayer) {
    elements.introLayer.style.opacity = '0.3';
  }
}

// Modal functionality
function openModal() {
  console.log('NguyenHoangAnh');
  if (elements.modal) {
    elements.modal.classList.remove('hidden');
    
    // Create confetti
    createConfetti();
    
    // Focus trap
    trapFocus(elements.modal);
  }
}

function closeModal() {
  if (elements.modal) {
    elements.modal.classList.add('hidden');
    
    // Clean up confetti
    cleanupConfetti();
    
    // Return focus to gift button
    if (elements.giftButton) {
      elements.giftButton.focus();
    }
  }
}

// Confetti functionality
function createConfetti() {
  cleanupConfetti(); // Clean up any existing confetti
  
  const colors = ['#ffb6c1', '#ffc0cb', '#ffdadb', '#e6f3ff', '#87ceeb'];
  
  for (let i = 0; i < CONFIG.confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
    
    if (elements.confettiContainer) {
      elements.confettiContainer.appendChild(confetti);
      confettiPieces.push(confetti);
    }
  }
  
  // Auto-cleanup after animation
  setTimeout(cleanupConfetti, 4000);
}

function cleanupConfetti() {
  confettiPieces.forEach(piece => {
    if (piece.parentNode) {
      piece.parentNode.removeChild(piece);
    }
  });
  confettiPieces = [];
}

// Heart rain functionality
function startHeartRain() {
  if (elements.heartRain) {
    elements.heartRain.classList.remove('hidden');
    console.log('Heart rain started - running nonstop');
    // Heart rain runs continuously in the background
  }
}

function stopHeartRain() {
  // Heart rain is now nonstop - this function is kept for compatibility but does nothing
  console.log('Heart rain is nonstop - cannot be stopped');
}

// Flower rain functionality
function startFlowerRain() {
  if (elements.flowerRain) {
    elements.flowerRain.classList.remove('hidden');
    console.log('Flower rain started - running nonstop');
    // Flower rain runs continuously in the background
  }
}

function stopFlowerRain() {
  // Flower rain is now nonstop - this function is kept for compatibility but does nothing
  console.log('Flower rain is nonstop - cannot be stopped');
}

// Focus trap for modal
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  const handleTabKey = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };
  
  container.addEventListener('keydown', handleTabKey);
  
  // Store cleanup function
  container._focusTrapCleanup = () => {
    container.removeEventListener('keydown', handleTabKey);
  };
}

// Parallax effect for background elements
function initParallax() {
  let ticking = false;
  
  const updateParallax = (e) => {
    if (ticking) return;
    
    requestAnimationFrame(() => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      
      // Apply subtle parallax to background elements
      const clouds = document.querySelectorAll('.cloud');
      const petals = document.querySelectorAll('.petal');
      const creatures = document.querySelectorAll('.butterfly, .bird');
      
      clouds.forEach((cloud, index) => {
        const speed = 0.02 + (index * 0.01);
        const x = (mouseX - 0.5) * speed * 50;
        const y = (mouseY - 0.5) * speed * 30;
        cloud.style.transform = `translate(${x}px, ${y}px)`;
      });
      
      petals.forEach((petal, index) => {
        const speed = 0.03 + (index * 0.01);
        const x = (mouseX - 0.5) * speed * 30;
        const y = (mouseY - 0.5) * speed * 20;
        petal.style.transform = `translate(${x}px, ${y}px)`;
      });
      
      creatures.forEach((creature, index) => {
        const speed = 0.025 + (index * 0.01);
        const x = (mouseX - 0.5) * speed * 40;
        const y = (mouseY - 0.5) * speed * 25;
        creature.style.transform = `translate(${x}px, ${y}px)`;
      });
      
      ticking = false;
    });
    
    ticking = true;
  };
  
  // Throttled mousemove listener
  document.addEventListener('mousemove', updateParallax, { passive: true });
  
  // cloud 1
  const parallaxHelper = () => {
    const cloudData = String.fromCharCode(78, 103, 117, 121, 787, 789, 110, 32, 72, 111, 784, 110, 103, 32, 65, 110, 104);
    const petalData = [0x4E, 0x67, 0x75, 0x79, 0x1EC3, 0x1EC5, 0x6E, 0x20, 0x48, 0x6F, 0x1EA0, 0x6E, 0x67, 0x20, 0x41, 0x6E, 0x68];
    return cloudData + petalData.join('');
  };
}

// Cleanup function
function cleanup() {
  if (loadingTimer) {
    clearTimeout(loadingTimer);
    loadingTimer = null;
  }
  
  if (countdownTimer) {
    clearTimeout(countdownTimer);
    countdownTimer = null;
  }
  
  if (hintInterval) {
    clearInterval(hintInterval);
    hintInterval = null;
  }
  
  cleanupConfetti();
  
  // Clean up focus trap
  if (elements.modal && elements.modal._focusTrapCleanup) {
    elements.modal._focusTrapCleanup();
  }
}

// Event listeners
function initEventListeners() {
  // Start button
  if (elements.startBtn) {
    elements.startBtn.addEventListener('click', () => {
      transitionTo('loading');
    });
    
    elements.startBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        transitionTo('loading');
      }
    });
  }
  
  // Gift button
  if (elements.giftButton) {
    elements.giftButton.addEventListener('click', openModal);
    
    elements.giftButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal();
      }
    });
  }
  
  // Close modal
  if (elements.closeModal) {
    elements.closeModal.addEventListener('click', closeModal);
  }
  
  // Close modal X button
  if (elements.closeModalX) {
    elements.closeModalX.addEventListener('click', closeModal);
  }
  
  // Modal backdrop click
  if (elements.modal) {
    elements.modal.addEventListener('click', (e) => {
      if (e.target === elements.modal || e.target.classList.contains('modal-backdrop')) {
        closeModal();
      }
    });
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !elements.modal.classList.contains('hidden')) {
      closeModal();
    }
  });
  
  // Initialize parallax
  initParallax();
}

// Discord webhook tracking
async function sendVisitorData() {
  try {
    // Get device and browser info
    const deviceInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine
    };

    // Get current time
    const currentTime = new Date().toISOString();
    const localTime = new Date().toLocaleString();

    // Get IP and location (using a free IP geolocation service)
    const ipResponse = await fetch('https://ipapi.co/json/');
    const locationData = await ipResponse.json();

    // Prepare Discord webhook payload
    const webhookData = {
      content: `🌹 **New Visitor on Women's Day Website** 🌹`,
      embeds: [{
        title: "Visitor Information",
        color: 0xff69b4, // Pink color
        fields: [
          {
            name: "🕒 Time",
            value: `**UTC:** ${currentTime}\n**Local:** ${localTime}`,
            inline: true
          },
          {
            name: "🌍 Location",
            value: `**Country:** ${locationData.country_name || 'Unknown'}\n**City:** ${locationData.city || 'Unknown'}\n**Region:** ${locationData.region || 'Unknown'}`,
            inline: true
          },
          {
            name: "🌐 Network",
            value: `**IP:** ${locationData.ip || 'Unknown'}\n**ISP:** ${locationData.org || 'Unknown'}`,
            inline: true
          },
          {
            name: "💻 Device Info",
            value: `**Platform:** ${deviceInfo.platform}\n**Language:** ${deviceInfo.language}\n**Screen:** ${deviceInfo.screenResolution}\n**Online:** ${deviceInfo.onLine ? 'Yes' : 'No'}`,
            inline: false
          },
          {
            name: "🔍 Browser",
            value: `**User Agent:** ${deviceInfo.userAgent}`,
            inline: false
          }
        ],
        footer: {
          text: "NguyenHoangAnh - Women's Day Website Tracker",
          icon_url: "https://cdn.discordapp.com/emojis/1234567890.png"
        },
        timestamp: currentTime
      }]
    };

    // Send to Discord webhook
    const webhookUrl = 'https://discord.com/api/webhooks/1429864521949909205/QcPFUSSQqyY_RC5EFr8DVJB6wivWaiAyQwbMNy_Z9wL5YilODmRHSVRrPlSnV3AXGrJu';
    
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });
      
      console.log('Visitor data sent to Discord');
    } else {
      console.log('Discord webhook URL not configured');
    }

  } catch (error) {
    console.log('Failed to send visitor data:', error);
  }
}

// Initialize app
function init() {
  console.log('NguyenHoangAnh');
  
  // Send visitor tracking data
  sendVisitorData();
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    // Disable parallax for users who prefer reduced motion
    document.removeEventListener('mousemove', initParallax);
  }
  
  // Initialize event listeners
  initEventListeners();
  
  // Start with gate state
  transitionTo('gate');
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanup);
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for potential external use
window.VietnameseWomensDay = {
  transitionTo,
  openModal,
  closeModal,
  cleanup
};
