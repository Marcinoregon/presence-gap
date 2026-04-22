// == Page registry =============================================================
const PAGES = ['home','problem','dimensions','ehc','toolkit','assess','research'];
const PAGE_NAMES = {
    home:'Home', problem:'The Problem', dimensions:'Dimensions',
    ehc:'Essential Human Core', toolkit:'Toolkit',
    assess:'Self-Check', research:'Research'
};

let currentPage = 'home';
let countersRun = false;

// == Navigate to page ==========================================================
function goTo(pageId) {
    if (!PAGES.includes(pageId) || pageId === currentPage) return;

  // Exit current - fade out then hide
  const outEl = document.getElementById('page-' + currentPage);
    outEl.style.opacity = '0';
    outEl.style.transform = 'translateY(-10px)';
    setTimeout(() => {
          outEl.classList.remove('active');
          outEl.style.opacity = '';
          outEl.style.transform = '';
    }, 380);

  // Enter new - brief delay so pages don't overlap
  const inEl = document.getElementById('page-' + pageId);
    inEl.scrollTop = 0;
    setTimeout(() => {
          inEl.classList.add('active');
    }, 60);

  currentPage = pageId;
    updateNav(pageId);
    // Trigger counter animation on first home visit
  if (pageId === 'home' && !countersRun) {
        countersRun = true;
        setTimeout(animateCounters, 300);
  }
}

// == Update nav active state + dot indicator ===================================
function updateNav(pageId) {
    // Nav links
  document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.toggle('active', a.dataset.page === pageId);
  });
    // Dots
  document.querySelectorAll('.dot').forEach(d => {
        d.classList.toggle('active', d.dataset.page === pageId);
  });
    // Label
  const label = document.getElementById('pageLabel');
    if (label) label.textContent = PAGE_NAMES[pageId] || '';
}

// == Wire all [data-page] clicks ===============================================
function wirePageLinks() {
    document.querySelectorAll('[data-page]').forEach(el => {
          el.addEventListener('click', e => {
                  e.preventDefault();
                  const target = el.dataset.page;
                  goTo(target);
                  // Close mobile nav if open
                                    document.getElementById('navLinks').classList.remove('open');
          });
    });
}

// == Stat counter animation ====================================================
function animateCounters() {
    document.querySelectorAll('.stat-num').forEach(el => {
          const target = parseInt(el.dataset.target, 10);
          let current = 0;
          const step = Math.max(1, Math.floor(target / 40));
          const timer = setInterval(() => {
                  current = Math.min(current + step, target);
                  el.textContent = current;
                  if (current >= target) clearInterval(timer);
          }, 28);
    });
}

// == Mobile nav toggle =========================================================
document.getElementById('navToggle').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
});
// == Self-Assessment logic =====================================================
const questions   = document.querySelectorAll('.q-block');
const assessBar   = document.getElementById('assessBar');
const assessResult = document.getElementById('assessResult');
let scores = [];
let currentQ = 0;

function showQ(index) {
    questions.forEach(q => q.classList.remove('active'));
    if (index < questions.length) {
          questions[index].classList.add('active');
          assessBar.style.width = `${(index / questions.length) * 100}%`;
    }
}

document.querySelectorAll('.q-btn').forEach(btn => {
    btn.addEventListener('click', () => {
          scores[currentQ] = parseInt(btn.dataset.score, 10);
          currentQ++;
          if (currentQ < questions.length) {
                  showQ(currentQ);
          } else {
                  showResult();
          }
    });
});

function showResult() {
    questions.forEach(q => q.classList.remove('active'));
    assessResult.classList.remove('hidden');
    assessBar.style.width = '100%';

  const total = scores.reduce((a, b) => a + b, 0);
    const pct   = total / (scores.length * 4);
    const icon  = document.getElementById('resultIcon');
    const title = document.getElementById('resultTitle');
    const text  = document.getElementById('resultText');
    const dims  = document.getElementById('resultDims');

  const dimNames = ['Self','Others','Purpose'];
    dims.innerHTML = scores.map((s, i) => {
          const level = s<=1?'Narrow':s<=2?'Moderate':s<=3?'Wide':'Chronic Risk';
          const color = s<=2?'#4ac56e':s<=3?'#c9a84c':'#e64a4a';
          const bg    = s<=2?'rgba(74,197,110,0.12)':s<=3?'rgba(201,168,76,0.12)':'rgba(230,74,74,0.12)';
          return `<span class="result-dim-badge" style="background:${bg};color:${color};border:1px solid ${color}30">${dimNames[i]}: ${level}</span>`;
    }).join('');

  if (pct <= 0.35) {
        icon.textContent = '*';
        title.textContent = 'A Narrow Gap';
        text.textContent = 'Your responses suggest strong connection across self, others, and purpose. The framework still offers tools to deepen those capacities     text.textContent = 'Your responses suggest strong connection across self, others, and purpose. The framework still offers tools to deepen those capacities - and to protect them as AI adoption accelerates.';
  } else if (pct <= 0.6) {
        icon.textContent = '*';
        title.textContent = 'A Moderate Presence Gap';
        text.textContent = 'You show meaningful connection in some dimensions and real disconnection in others. Targeted work - particularly the Values Audit Protocol or Relational Stakeholder Map - could narrow the gap considerably.';
  } else if (pct <= 0.8) {
        icon.textContent = '*';
        title.textContent = 'A Widening Presence Gap';
        text.textContent = 'Your pattern suggests the Presence Gap is active across multiple dimensions. This is the environment AI creates - and it is addressable through deliberate developmental work with a skilled career counselor.';
  } else {
        icon.textContent = '*';
        title.textContent = 'Chronic Presence Gap Risk';
        text.textContent = 'The disconnection you describe across all three dimensions places your Essential Human Core under strain. This is not a personal failure - it is a structural signal. The framework in the paper is designed precisely for this moment.';
  }
}

document.getElementById('retakeBtn').addEventListener('click', () => {
    scores = []; currentQ = 0;
    assessResult.classList.add('hidden');
    showQ(0);
    assessBar.style.width = '0%';
});

// == Keyboard navigation =======================================================
document.addEventListener('keydown', e => {
    const idx = PAGES.indexOf(currentPage);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(PAGES[Math.min(idx+1, PAGES.length-1)]);
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goTo(PAGES[Math.max(idx-1, 0)]);
});

// == Init ======================================================================
wirePageLinks();
showQ(0);
updateNav('home');
setTimeout(animateCounters, 500); // run counters on first load
