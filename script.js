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
    const speed = 20; // smaller = faster
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

  // Interactive Theme Selector Customizer
  const themeDots = document.querySelectorAll('.preview-dot');
  
  themeDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent card click navigation
      
      // Toggle active states
      themeDots.forEach(d => d.classList.remove('active', 'ring-2', 'ring-white'));
      dot.classList.add('active', 'ring-2', 'ring-white');
      
      const theme = dot.dataset.theme;
      
      // Apply theme class to document body
      document.body.removeAttribute('data-theme');
      if (theme !== 'default') {
        document.body.setAttribute('data-theme', theme);
      }
      
      // Show dynamic notification feedback
      showNotification(`Applied Theme: ${theme.replace('-', ' ').toUpperCase()}`);
    });
  });

  // Dynamic Toast Notifications
  function showNotification(msg) {
    // Remove existing
    const existing = document.querySelector('.theme-toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'theme-toast fixed bottom-6 right-6 bg-slate-900 border border-violet-500/30 text-white font-semibold text-xs px-4 py-3 rounded-xl shadow-2xl z-50 transition-all transform translate-y-10 opacity-0';
    toast.style.fontFamily = "'Plus Jakarta Sans', sans-serif";
    toast.textContent = msg;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-y-10', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    }, 100);
    
    // Animate out
    setTimeout(() => {
      toast.classList.add('translate-y-10', 'opacity-0');
      setTimeout(() => toast.remove(), 400);
    }, 2500);
  }
});
