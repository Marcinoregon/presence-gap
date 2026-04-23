// ── Page registry ─────────────────────────────────────────────────────────────
var PAGES = ['home','problem','dimensions','ehc','toolkit','assess','research'];
var PAGE_NAMES = {
  home:'Home', problem:'The Problem', dimensions:'Dimensions',
  ehc:'Essential Human Core', toolkit:'Toolkit',
  assess:'Self-Check', research:'Research'
};

var currentPage = 'home';
var countersRun = false;

// ── Navigate to page ──────────────────────────────────────────────────────────
function goTo(pageId) {
  if (PAGES.indexOf(pageId) === -1 || pageId === currentPage) return;

  // Exit current page
  var outEl = document.getElementById('page-' + currentPage);
  outEl.style.opacity = '0';
  outEl.style.transform = 'translateY(-10px)';
  setTimeout(function() {
    outEl.classList.remove('active');
    outEl.style.opacity = '';
    outEl.style.transform = '';
  }, 380);

  // Enter new page
  var inEl = document.getElementById('page-' + pageId);
  inEl.scrollTop = 0;
  setTimeout(function() {
    inEl.classList.add('active');
  }, 60);

  currentPage = pageId;
  updateNav(pageId);

  // Trigger counter animation on home visit
  if (pageId === 'home' && !countersRun) {
    countersRun = true;
    setTimeout(animateCounters, 300);
  }
}

// ── Update nav active state + dot indicator ───────────────────────────────────
function updateNav(pageId) {
  var navLinks = document.querySelectorAll('.nav-links a');
  for (var i = 0; i < navLinks.length; i++) {
    if (navLinks[i].dataset.page === pageId) {
      navLinks[i].classList.add('active');
    } else {
      navLinks[i].classList.remove('active');
    }
  }
  var dots = document.querySelectorAll('.dot');
  for (var j = 0; j < dots.length; j++) {
    if (dots[j].dataset.page === pageId) {
      dots[j].classList.add('active');
    } else {
      dots[j].classList.remove('active');
    }
  }
  var label = document.getElementById('pageLabel');
  if (label) label.textContent = PAGE_NAMES[pageId] || '';
}

// ── Wire all [data-page] clicks ───────────────────────────────────────────────
function wirePageLinks() {
  var els = document.querySelectorAll('[data-page]');
  for (var i = 0; i < els.length; i++) {
    (function(el) {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        var target = el.dataset.page;
        goTo(target);
        var navLinks = document.getElementById('navLinks');
        if (navLinks) navLinks.classList.remove('open');
      });
    })(els[i]);
  }
}

// ── Stat counter animation ────────────────────────────────────────────────────
function animateCounters() {
  var counters = document.querySelectorAll('.stat-num');
  for (var i = 0; i < counters.length; i++) {
    (function(el) {
      var target = parseInt(el.dataset.target, 10);
      var current = 0;
      var step = Math.max(1, Math.floor(target / 40));
      var timer = setInterval(function() {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(timer);
      }, 28);
    })(counters[i]);
  }
}

// ── Mobile nav toggle ─────────────────────────────────────────────────────────
var navToggle = document.getElementById('navToggle');
if (navToggle) {
  navToggle.addEventListener('click', function() {
    var navLinks = document.getElementById('navLinks');
    if (navLinks) navLinks.classList.toggle('open');
  });
}

// ── Self-Assessment logic ─────────────────────────────────────────────────────
var questions   = document.querySelectorAll('.q-block');
var assessBar   = document.getElementById('assessBar');
var assessResult = document.getElementById('assessResult');
var scores = [];
var currentQ = 0;

function showQ(index) {
  for (var i = 0; i < questions.length; i++) {
    questions[i].classList.remove('active');
  }
  if (index < questions.length) {
    questions[index].classList.add('active');
    if (assessBar) assessBar.style.width = ((index / questions.length) * 100) + '%';
  }
}

var qBtns = document.querySelectorAll('.q-btn');
for (var qi = 0; qi < qBtns.length; qi++) {
  (function(btn) {
    btn.addEventListener('click', function() {
      scores[currentQ] = parseInt(btn.dataset.score, 10);
      currentQ++;
      if (currentQ < questions.length) {
        showQ(currentQ);
      } else {
        showResult();
      }
    });
  })(qBtns[qi]);
}

function showResult() {
  for (var i = 0; i < questions.length; i++) {
    questions[i].classList.remove('active');
  }
  if (assessResult) assessResult.classList.remove('hidden');
  if (assessBar) assessBar.style.width = '100%';

  var total = 0;
  for (var j = 0; j < scores.length; j++) total += scores[j];
  var pct = total / (scores.length * 4);

  var icon  = document.getElementById('resultIcon');
  var title = document.getElementById('resultTitle');
  var text  = document.getElementById('resultText');
  var dims  = document.getElementById('resultDims');

  var dimNames = ['Self','Others','Purpose'];
  var dimsHtml = '';
  for (var k = 0; k < scores.length; k++) {
    var s = scores[k];
    var level = s<=1?'Narrow':s<=2?'Moderate':s<=3?'Wide':'Chronic Risk';
    var color = s<=2?'#4ac56e':s<=3?'#c9a84c':'#e64a4a';
    var bg    = s<=2?'rgba(74,197,110,0.12)':s<=3?'rgba(201,168,76,0.12)':'rgba(230,74,74,0.12)';
    dimsHtml += '<span class="result-dim-badge" style="background:' + bg + ';color:' + color + ';border:1px solid ' + color + '30">' + dimNames[k] + ': ' + level + '</span>';
  }
  if (dims) dims.innerHTML = dimsHtml;

  if (pct <= 0.35) {
    if (icon) icon.textContent = '\u2726';
    if (title) title.textContent = 'A Narrow Gap';
    if (text) text.textContent = 'Your responses suggest strong connection across self, others, and purpose. The framework still offers tools to deepen those capacities — and to protect them as AI adoption accelerates.';
  } else if (pct <= 0.6) {
    if (icon) icon.textContent = '\u25c8';
    if (title) title.textContent = 'A Moderate Presence Gap';
    if (text) text.textContent = 'You show meaningful connection in some dimensions and real disconnection in others. Targeted work — particularly the Values Audit Protocol or Relational Stakeholder Map — could narrow the gap considerably.';
  } else if (pct <= 0.8) {
    if (icon) icon.textContent = '\u25c7';
    if (title) title.textContent = 'A Widening Presence Gap';
    if (text) text.textContent = 'Your pattern suggests the Presence Gap is active across multiple dimensions. This is the environment AI creates — and it is addressable through deliberate developmental work with a skilled career counselor.';
  } else {
    if (icon) icon.textContent = '\u25cb';
    if (title) title.textContent = 'Chronic Presence Gap Risk';
    if (text) text.textContent = 'The disconnection you describe across all three dimensions places your Essential Human Core under strain. This is not a personal failure — it is a structural signal. The framework in the paper is designed precisely for this moment.';
  }
}

var retakeBtn = document.getElementById('retakeBtn');
if (retakeBtn) {
  retakeBtn.addEventListener('click', function() {
    scores = []; currentQ = 0;
    if (assessResult) assessResult.classList.add('hidden');
    showQ(0);
    if (assessBar) assessBar.style.width = '0%';
  });
}

// ── Keyboard navigation ───────────────────────────────────────────────────────
document.addEventListener('keydown', function(e) {
  var idx = PAGES.indexOf(currentPage);
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(PAGES[Math.min(idx+1, PAGES.length-1)]);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goTo(PAGES[Math.max(idx-1, 0)]);
});

// ── Init ──────────────────────────────────────────────────────────────────────
wirePageLinks();
showQ(0);
updateNav('home');
setTimeout(animateCounters, 500);
