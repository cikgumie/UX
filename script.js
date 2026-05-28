// ===== UI LABS PORTAL — CENTRAL JAVASCRIPT =====
// Enhanced with: Adaptive Light/Dark (Trend #3), Micro-Interactions (#4),
// Emotionally Intelligent Design (#8), Accessibility (#10), Personalization (#11)

document.addEventListener('DOMContentLoaded', () => {
  // ===== 1. ADAPTIVE LIGHT/DARK MODE (Trend #3) =====
  // Auto-switch based on system preference, with manual override
  function getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyMode(mode, animate = true) {
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');

    if (mode === 'light') {
      document.body.setAttribute('data-mode', 'light');
      if (sunIcon) sunIcon.classList.add('hidden');
      if (moonIcon) moonIcon.classList.remove('hidden');
    } else {
      document.body.removeAttribute('data-mode');
      if (sunIcon) sunIcon.classList.remove('hidden');
      if (moonIcon) moonIcon.classList.add('hidden');
    }
    localStorage.setItem('ui-craft-mode', mode);
  }

  // Load saved mode, fallback to system preference
  const savedMode = localStorage.getItem('ui-craft-mode');
  if (savedMode) {
    applyMode(savedMode);
  } else {
    applyMode(getSystemPreference());
  }

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    // Only auto-switch if user hasn't manually set a preference
    if (!localStorage.getItem('ui-craft-mode')) {
      applyMode(e.matches ? 'light' : 'dark');
    }
  });

  // Manual toggle
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isLight = document.body.getAttribute('data-mode') === 'light';
      applyMode(isLight ? 'dark' : 'light');
      showNotification(isLight ? '🌙 Dark Mode Activated' : '☀️ Light Mode Activated');
    });
  }

  // ===== 2. GLOW EFFECT CURSOR TRACKER (Micro-Interaction) =====
  const cards = document.querySelectorAll('.lab-card:not(.locked)');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    // Micro-interaction: subtle tilt on hover
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });

  // ===== 3. ANIMATED NUMBERS COUNTER =====
  const counters = document.querySelectorAll('.metric-value');

  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    let count = 0;
    const speed = 20;
    const increment = Math.ceil(target / speed);

    const updateCount = () => {
      count += increment;
      if (count >= target) {
        counter.textContent = target;
      } else {
        counter.textContent = count;
        setTimeout(updateCount, 40);
      }
    };

    updateCount();
  });

  // ===== 4. THEME DOTS PREVIEW (index page) =====
  const themeDots = document.querySelectorAll('.preview-dot');

  themeDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();

      // Toggle active states
      themeDots.forEach(d => d.classList.remove('active', 'ring-2', 'ring-white'));
      dot.classList.add('active', 'ring-2', 'ring-white');

      const theme = dot.dataset.theme;

      // Apply theme class to document body
      document.body.removeAttribute('data-theme');
      if (theme && theme !== 'default') {
        document.body.setAttribute('data-theme', theme);
      }

      // Save to localStorage
      localStorage.setItem('ui-craft-theme', theme || 'default');

      showNotification(`🎨 Applied Theme: ${theme ? theme.replace('-', ' ').toUpperCase() : 'DEFAULT'}`);
    });
  });

  // ===== 5. RESTORE SAVED THEME =====
  const savedTheme = localStorage.getItem('ui-craft-theme');
  if (savedTheme && savedTheme !== 'default') {
    document.body.setAttribute('data-theme', savedTheme);
    // Highlight matching dot
    themeDots.forEach(d => {
      d.classList.remove('active', 'ring-2', 'ring-white');
      if (d.dataset.theme === savedTheme) {
        d.classList.add('active', 'ring-2', 'ring-white');
      }
    });
  }

  // ===== 6. LAB SEARCH & FILTER =====
  const searchInput = document.getElementById('lab-search-input');
  const catPills = document.querySelectorAll('.cat-pill');
  const labCards = document.querySelectorAll('.lab-card');
  let activeCategory = 'all';

  // Restore last search from localStorage
  if (searchInput) {
    const savedSearch = localStorage.getItem('ui-craft-search');
    if (savedSearch) {
      searchInput.value = savedSearch;
    }
  }

  function filterLabs() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    // Save search query for personalization
    if (query) {
      localStorage.setItem('ui-craft-search', query);
    } else {
      localStorage.removeItem('ui-craft-search');
    }

    labCards.forEach(card => {
      const title = card.querySelector('.lab-title')?.textContent?.toLowerCase() || '';
      const desc = card.querySelector('.lab-desc')?.textContent?.toLowerCase() || '';
      const cat = card.dataset.category || '';

      const matchesSearch = !query || title.includes(query) || desc.includes(query);
      const matchesCategory = activeCategory === 'all' || cat === activeCategory;

      if (matchesSearch && matchesCategory) {
        card.style.display = '';
        // Micro-interaction: stagger reveal
        card.style.animation = 'none';
        card.offsetHeight; // force reflow
        card.style.animation = 'fadeInUp 0.3s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterLabs);
  }

  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.dataset.cat;
      filterLabs();
    });
  });

  // ===== 7. MICRO-INTERACTION: Card click ripple =====
  labCards.forEach(card => {
    card.addEventListener('click', function (e) {
      // Don't add ripple if it's a locked card
      if (this.classList.contains('locked')) return;

      const ripple = document.createElement('span');
      ripple.className = 'card-ripple';
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ===== 8. ACCESSIBILITY: Focus indicators & keyboard nav (Trend #10) =====
  // Add visible focus rings for keyboard users
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });

  // ===== 9. PERSONALIZATION: Restore last visited lab (Trend #11) =====
  const lastVisited = localStorage.getItem('ui-craft-last-visited');
  if (lastVisited) {
    const lastVisitedEl = document.querySelector(`[onclick*="${lastVisited}"]`);
    if (lastVisitedEl) {
      // Subtle indicator
      lastVisitedEl.style.setProperty('--accent-purple', '265, 89%, 75%');
    }
  }

  // Save last visited lab on click
  labCards.forEach(card => {
    const onclick = card.getAttribute('onclick');
    if (onclick) {
      card.addEventListener('click', () => {
        const match = onclick.match(/href='([^']+)'/);
        if (match) {
          localStorage.setItem('ui-craft-last-visited', match[1].replace('.html', ''));
        }
      });
    }
  });

  // ===== 10. EMOTIONALLY INTELLIGENT: Time-based greeting (Trend #8) =====
  const headerTitle = document.querySelector('.glow-title');
  if (headerTitle) {
    const hour = new Date().getHours();
    let greeting;
    let emoji;
    if (hour < 12) { greeting = 'Morning'; emoji = '🌅'; }
    else if (hour < 17) { greeting = 'Afternoon'; emoji = '☀️'; }
    else if (hour < 21) { greeting = 'Evening'; emoji = '🌆'; }
    else { greeting = 'Night'; emoji = '🌙'; }

    // Add subtle time-based greeting
    const greetingEl = document.createElement('span');
    greetingEl.className = 'time-greeting';
    greetingEl.textContent = `${emoji} Good ${greeting}`;
    greetingEl.style.cssText = 'display:block;font-size:0.75rem;font-weight:600;color:var(--text-muted);margin-top:4px;letter-spacing:2px;text-transform:uppercase;';

    const headerDesc = headerTitle.nextElementSibling?.nextElementSibling;
    if (headerDesc) {
      headerDesc.parentNode.insertBefore(greetingEl, headerDesc);
    }
  }

  // ===== 11. DYNAMIC TOAST NOTIFICATIONS =====
  window.showNotification = showNotification;
  function showNotification(msg) {
    const existing = document.querySelector('.theme-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'theme-toast fixed bottom-6 right-6 bg-slate-900 border border-violet-500/30 text-white font-semibold text-xs px-4 py-3 rounded-xl shadow-2xl z-50 transition-all transform translate-y-10 opacity-0';
    toast.style.fontFamily = "'Plus Jakarta Sans', sans-serif";
    toast.textContent = msg;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('translate-y-10', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    }, 100);

    setTimeout(() => {
      toast.classList.add('translate-y-10', 'opacity-0');
      setTimeout(() => toast.remove(), 400);
    }, 2500);
  }

  // Trigger initial filter to apply any saved search
  filterLabs();
});