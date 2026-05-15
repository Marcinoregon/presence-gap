const PAGES = ['hero','framework','dimensions','theory','ai-modes','assessment','screening','vignette','practitioner','research'];

function showPage(id) {
  if (!PAGES.includes(id)) id = 'hero';
  PAGES.forEach(p => {
    let el = document.getElementById(p);
    if (el) el.classList.remove('active');
  });
  let target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    window.scrollTo(0, 0);
  }
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-page') === id);
  });
}

function toggleDim(id) {
  const detail = document.getElementById('detail-' + id);
  const btn = detail.nextElementSibling;
  if(detail.classList.contains('open')) {
      detail.classList.remove('open');
      btn.innerText = "Learn more ↓";
  } else {
      detail.classList.add('open');
      btn.innerText = "Show less ↑";
  }
}

function setMode(idx) {
  document.querySelectorAll('.mode-tab').forEach((t,i) => t.classList.toggle('active', i===idx));
  document.querySelectorAll('.mode-content').forEach((c,i) => c.classList.toggle('active', i===idx));
}

function setVign(idx) {
  document.querySelectorAll('.vign-step').forEach((s,i) => s.classList.toggle('active', i===idx));
  document.querySelectorAll('.vign-content').forEach((c,i) => c.classList.toggle('active', i===idx));
}

function toggleFalsify(id) {
  const el = document.getElementById(id);
  el.style.display = el.style.display === 'block' ? 'none' : 'block';
}

function setExercise(idx) {
  document.querySelectorAll('.ex-tab').forEach((t,i) => t.classList.toggle('active', i===idx));
  document.querySelectorAll('.exercise').forEach((e,i) => e.classList.toggle('active', i===idx));
}

// Exercise 1 Logic
const ex1Data = [
  { text: "I used AI to write my cover letter, but I can't explain the projects it mentions.", ans: 'self' },
  { text: "I have 500 LinkedIn connections but nobody I'd call for actual advice.", ans: 'other' },
  { text: "I chose this field purely because it pays well.", ans: 'purpose' }
];
let ex1Index = 0;

function renderClassify() {
    if(ex1Index >= ex1Data.length) ex1Index = 0;
    document.getElementById('classify-stmt').innerText = ex1Data[ex1Index].text;
    document.getElementById('classify-feedback').innerText = "";
    document.getElementById('classify-next').style.display = "none";
}

function classifyAnswer(ans) {
    const correct = ex1Data[ex1Index].ans;
    const fb = document.getElementById('classify-feedback');
    if(ans === correct) {
        fb.innerHTML = "<span style='color: #34d399;'>Correct!</span>";
        document.getElementById('classify-next').style.display = "block";
    } else {
        fb.innerHTML = "<span style='color: #ef4444;'>Incorrect. Try again.</span>";
    }
}
function nextClassify() { ex1Index++; renderClassify(); }

// Exercise 2 Logic
function checkFormulation() {
    const s = document.getElementById('form-self').value;
    const o = document.getElementById('form-other').value;
    const p = document.getElementById('form-purpose').value;
    if(s && o && p) {
        document.getElementById('formulation-choices').style.display = 'block';
    }
}

function selectFormulation(val) {
    const fb = document.getElementById('form-feedback');
    if(val === 1) {
        fb.innerHTML = "<span style='color: #34d399;'>Correct! Jordan's identity is intact (low self score), but relatedness and purpose are high-risk. This is a partial configuration, not full Presence Gap.</span>";
    } else {
        fb.innerHTML = "<span style='color: #ef4444;'>Incorrect. Review the configural threshold rule.</span>";
    }
}

// Exercise 3 Logic
let selectedCard = null;
const ex3Answers = { 0: 'self', 1: 'other', 2: 'purpose' };
const ex3Placements = {};

function selectCard(id) {
    document.querySelectorAll('.match-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('mc-'+id).classList.add('selected');
    selectedCard = id;
}

function dropToZone(zone) {
    if(selectedCard !== null) {
        ex3Placements[selectedCard] = zone;
        document.querySelector('.zone-'+zone).innerHTML += `<div>Card ${selectedCard+1} placed</div>`;
        document.getElementById('mc-'+selectedCard).style.display = 'none';
        selectedCard = null;
    }
}

function checkMatching() {
    let correct = 0;
    for(let i=0; i<3; i++) {
        if(ex3Placements[i] === ex3Answers[i]) correct++;
    }
    document.getElementById('match-feedback').innerHTML = `You got ${correct}/3 correct!`;
}

// Exercise 4 Logic
function checkModeEx(ans) {
    const fb = document.getElementById('mode-feedback');
    if(ans === 3) {
        fb.innerHTML = "<span style='color: #34d399;'>Correct! This is Mode 3: Dialogic. The user retains authorship.</span>";
    } else {
        fb.innerHTML = "<span style='color: #ef4444;'>Incorrect. Notice the user writes the final document themselves.</span>";
    }
}

// Init nav and exercises
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showPage(link.getAttribute('data-page'));
  });
});

window.onload = () => {
    showPage('hero');
    renderClassify();
};
