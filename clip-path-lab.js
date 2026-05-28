// ===== CLIP PATH LAB — VISUAL CSS MASKING JS =====

document.addEventListener('DOMContentLoaded', () => {
  const stage = document.getElementById('cpl-stage');
  const object = document.getElementById('cpl-object');
  const handlesContainer = document.getElementById('handles-container');
  const coordinatesList = document.getElementById('coordinates-list');
  const codeBlock = document.getElementById('code-block');
  const svgCodeBlock = document.getElementById('svg-code-block');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const addAnchorBtn = document.getElementById('add-anchor-btn');
  const removeAnchorBtn = document.getElementById('remove-anchor-btn');
  const bgSelector = document.getElementById('bg-selector');
  const toggleGrid = document.getElementById('toggle-grid');
  const toggleCoordinates = document.getElementById('toggle-coordinates');
  const copyCssBtn = document.getElementById('copy-css-btn');
  const copySvgBtn = document.getElementById('copy-svg-btn');

  // ===== Preset Shapes Coordinate Maps =====
  const PRESETS = {
    triangle: [[50, 0], [100, 100], [0, 100]],
    star: [[50, 0], [61, 35], [98, 35], [68, 57], [79, 91], [50, 70], [21, 91], [32, 57], [2, 35], [39, 35]],
    message: [[0, 0], [100, 0], [100, 75], [75, 75], [75, 100], [50, 75], [0, 75]],
    chevron: [[0, 0], [75, 0], [100, 50], [75, 100], [0, 100], [25, 50]],
    pentagon: [[50, 0], [100, 38], [82, 100], [18, 100], [0, 38]],
    diamond: [[50, 0], [100, 50], [50, 100], [0, 50]],
    cross: [[35, 0], [65, 0], [65, 35], [100, 35], [100, 65], [65, 65], [65, 100], [35, 100], [35, 65], [0, 65], [0, 35], [35, 35]],
    frame: [[0, 0], [100, 0], [100, 100], [0, 100], [0, 10], [10, 10], [10, 90], [90, 90], [90, 10], [0, 10]]
  };

  let activeCoordinates = JSON.parse(JSON.stringify(PRESETS.triangle));
  let currentPreset = 'triangle';

  // ===== Initialize Background Classes =====
  function updateBackground() {
    // Remove all background classes
    object.className = 'cpl-object';
    const selectedBg = bgSelector.value;
    object.classList.add(`bg-${selectedBg}`);
  }

  // ===== Render Handles & Setup Drag Actions =====
  function renderHandles() {
    handlesContainer.innerHTML = '';
    
    activeCoordinates.forEach((coord, index) => {
      const handle = document.createElement('div');
      handle.className = 'clip-handle';
      handle.style.left = `${coord[0]}%`;
      handle.style.top = `${coord[1]}%`;
      handle.dataset.index = index;

      // Handle numbering
      if (toggleCoordinates.checked) {
        handle.innerHTML = `<span style="font-size:0.5rem;font-weight:800;color:inherit;pointer-events:none">${index + 1}</span>`;
      }

      // Drag tooltip
      const tooltip = document.createElement('span');
      tooltip.className = 'handle-tooltip';
      tooltip.textContent = `${coord[0]}%, ${coord[1]}%`;
      handle.appendChild(tooltip);

      // Mouse drag logic
      handle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        handle.classList.add('dragging');
        
        function onMouseMove(moveEvent) {
          const rect = stage.getBoundingClientRect();
          let x = ((moveEvent.clientX - rect.left) / rect.width) * 100;
          let y = ((moveEvent.clientY - rect.top) / rect.height) * 100;

          // Constraints
          x = Math.max(0, Math.min(100, Math.round(x)));
          y = Math.max(0, Math.min(100, Math.round(y)));

          // Update state
          activeCoordinates[index] = [x, y];
          handle.style.left = `${x}%`;
          handle.style.top = `${y}%`;
          tooltip.textContent = `${x}%, ${y}%`;

          // Custom presets are no longer active when dragged
          presetBtns.forEach(b => b.classList.remove('active'));

          update();
        }

        function onMouseUp() {
          handle.classList.remove('dragging');
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });

      handlesContainer.appendChild(handle);
    });
  }

  // ===== Update Stage & Exporter Output =====
  function update() {
    // Generate clip-path string
    const pointsStr = activeCoordinates.map(c => `${c[0]}% ${c[1]}%`).join(', ');
    const clipPathVal = `polygon(${pointsStr})`;
    
    // Apply to object
    object.style.clipPath = clipPathVal;
    object.style.webkitClipPath = clipPathVal;

    // Render coordinate list badges
    coordinatesList.innerHTML = '';
    activeCoordinates.forEach((coord, i) => {
      const badge = document.createElement('span');
      badge.className = 'coord-badge';
      badge.textContent = `#${i + 1}: [${coord[0]}%, ${coord[1]}%]`;
      coordinatesList.appendChild(badge);
    });

    // Update CSS Block
    codeBlock.innerHTML = `<span class="cmt">/* CSS Clip-Path Polygon */</span>\n`
      + `<span class="prop">clip-path</span>: <span class="val">polygon</span>`
      + `(<span class="num">${activeCoordinates.map(c => `${c[0]}% ${c[1]}%`).join(',\n        ')}</span>);`;

    // Update SVG Block
    const svgPaths = activeCoordinates.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c[0]} ${c[1]}`).join(' ') + ' Z';
    const svgMarkup = `<svg viewBox="0 0 100 100" width="0" height="0">\n`
      + `  <defs>\n`
      + `    <clipPath id="custom-clip" clipPathUnits="objectBoundingBox">\n`
      + `      <!-- coordinates scaled to 0-1 range -->\n`
      + `      <path d="${activeCoordinates.map((c, i) => `${i === 0 ? 'M' : 'L'} ${(c[0]/100).toFixed(2)} ${(c[1]/100).toFixed(2)}`).join(' ')} Z" />\n`
      + `    </clipPath>\n`
      + `  </defs>\n`
      + `</svg>`;

    svgCodeBlock.innerHTML = `<span class="cmt">&lt;!-- SVG clipPath markup --&gt;</span>\n`
      + escapeHtml(svgMarkup);
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ===== Load Presets =====
  function loadPreset(name) {
    activeCoordinates = JSON.parse(JSON.stringify(PRESETS[name]));
    currentPreset = name;
    renderHandles();
    update();
  }

  // ===== Event Listeners =====

  // Presets selector
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadPreset(btn.dataset.preset);
    });
  });

  // Background selector
  bgSelector.addEventListener('change', updateBackground);

  // Toggle Grid
  toggleGrid.addEventListener('change', () => {
    const grid = document.getElementById('stage-grid');
    grid.style.display = toggleGrid.checked ? 'block' : 'none';
  });

  // Toggle Node Labels
  toggleCoordinates.addEventListener('change', renderHandles);

  // Add Point
  addAnchorBtn.addEventListener('click', () => {
    // Inject at center or between first/last
    const count = activeCoordinates.length;
    if (count >= 15) {
      showNotification('⚠️ Limit of 15 coordinate points reached!');
      return;
    }
    const last = activeCoordinates[count - 1];
    const first = activeCoordinates[0];
    const newX = Math.round((last[0] + first[0]) / 2);
    const newY = Math.round((last[1] + first[1]) / 2);
    activeCoordinates.push([newX, newY]);
    
    // Deactivate active preset
    presetBtns.forEach(b => b.classList.remove('active'));

    renderHandles();
    update();
    showNotification('＋ Point added successfully');
  });

  // Remove Point
  removeAnchorBtn.addEventListener('click', () => {
    if (activeCoordinates.length <= 3) {
      showNotification('⚠️ Polygons must have at least 3 points!');
      return;
    }
    activeCoordinates.pop();

    // Deactivate active preset
    presetBtns.forEach(b => b.classList.remove('active'));

    renderHandles();
    update();
    showNotification('－ Point removed successfully');
  });

  // Clipboard Copiers
  copyCssBtn.addEventListener('click', () => {
    const raw = codeBlock.textContent || codeBlock.innerText;
    // Strip HTML/comments
    const clean = raw.replace(/\/\*[\s\S]*?\*\//g, '').trim();
    navigator.clipboard.writeText(clean).then(() => {
      copyCssBtn.textContent = '✅ Copied!';
      setTimeout(() => { copyCssBtn.textContent = '📋 Copy Code'; }, 2000);
    });
  });

  copySvgBtn.addEventListener('click', () => {
    const raw = svgCodeBlock.textContent || svgCodeBlock.innerText;
    const clean = raw.replace(/<!--[\s\S]*?-->/g, '').trim();
    navigator.clipboard.writeText(clean).then(() => {
      copySvgBtn.textContent = '✅ Copied!';
      setTimeout(() => { copySvgBtn.textContent = '📋 Copy SVG'; }, 2000);
    });
  });

  // Toast Notification
  function showNotification(msg) {
    const existing = document.querySelector('.cpl-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'cpl-toast fixed bottom-6 right-6 bg-slate-900 border border-violet-500/30 text-white font-semibold text-xs px-4 py-3 rounded-xl shadow-2xl z-50 transition-all transform translate-y-10 opacity-0';
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

  // ===== Initialize =====
  updateBackground();
  loadPreset('triangle');
});
