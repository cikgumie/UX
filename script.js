// ===== UI LABS PORTAL — CENTRAL JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', () => {
  // Glow effect cursor tracker
  const cards = document.querySelectorAll('.lab-card:not(.locked)');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // Animated Numbers Counter
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

  // ===== THEME DOTS PREVIEW (index page) =====
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
      
      showNotification(`Applied Theme: ${theme ? theme.replace('-', ' ').toUpperCase() : 'DEFAULT'}`);
    });
  });

  // ===== DARK/LIGHT MODE TOGGLE =====
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (toggleBtn) {
    // Load saved mode
    const savedMode = localStorage.getItem('ui-craft-mode') || 'dark';
    if (savedMode === 'light') {
      document.body.setAttribute('data-mode', 'light');
      document.getElementById('theme-icon-sun').classList.add('hidden');
      document.getElementById('theme-icon-moon').classList.remove('hidden');
    }
    
    toggleBtn.addEventListener('click', () => {
      const isLight = document.body.getAttribute('data-mode') === 'light';
      if (isLight) {
        document.body.removeAttribute('data-mode');
        document.getElementById('theme-icon-sun').classList.remove('hidden');
        document.getElementById('theme-icon-moon').classList.add('hidden');
        localStorage.setItem('ui-craft-mode', 'dark');
        showNotification('Dark Mode Activated');
      } else {
        document.body.setAttribute('data-mode', 'light');
        document.getElementById('theme-icon-sun').classList.add('hidden');
        document.getElementById('theme-icon-moon').classList.remove('hidden');
        localStorage.setItem('ui-craft-mode', 'light');
        showNotification('Light Mode Activated');
      }
    });
  }

  // ===== LAB SEARCH & FILTER =====
  const searchInput = document.getElementById('lab-search-input');
  const catPills = document.querySelectorAll('.cat-pill');
  const labCards = document.querySelectorAll('.lab-card');
  let activeCategory = 'all';

  function filterLabs() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    labCards.forEach(card => {
      const title = card.querySelector('.lab-title')?.textContent?.toLowerCase() || '';
      const desc = card.querySelector('.lab-desc')?.textContent?.toLowerCase() || '';
      const cat = card.dataset.category || '';
      
      const matchesSearch = !query || title.includes(query) || desc.includes(query);
      const matchesCategory = activeCategory === 'all' || cat === activeCategory;
      
      if (matchesSearch && matchesCategory) {
        card.style.display = '';
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

  // ===== DYNAMIC TOAST NOTIFICATIONS =====
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

  // ===== RESTORE SAVED THEME =====
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
});
