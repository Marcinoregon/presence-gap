const PAGES = ['hero', 'framework', 'dimensions', 'theory', 'ai-modes', 'equity-culture', 'assessment', 'screening', 'vignette', 'practitioner', 'research'];

function showPage(id) {
  if (!PAGES.includes(id)) id = 'hero';
  PAGES.forEach(p => {
    let el = document.getElementById(p);
    if (el) el.classList.remove('active');
  });
  let target = document.getElementById(id);
  if (target) {
    if (id === 'hero') {
      target.classList.add('active');
      target.style.display = 'flex';
    } else {
      target.classList.add('active');
      target.style.display = 'block';
    }
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

// ── Mobile Menu Navigation ──
function toggleMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    navLinks.classList.toggle('open');
  }
}

// ── Self-Assessment Radar Chart and Diagnosis Logic ──
function updateAssessment() {
  const sSelf = parseInt(document.getElementById('slider-self').value, 10);
  const sOther = parseInt(document.getElementById('slider-other').value, 10);
  const sPurpose = parseInt(document.getElementById('slider-purpose').value, 10);

  document.getElementById('val-self').innerText = sSelf;
  document.getElementById('val-other').innerText = sOther;
  document.getElementById('val-purpose').innerText = sPurpose;

  // Radar chart rendering parameters
  const cx = 100;
  const cy = 123.33;

  // Vector scaling from center (100, 123.33) to the vertices of the triangle:
  // Peak (Identity): y goes from cy (123.33) at 0 to 30 at 10. Vector is (0, -93.33)
  const ySelf = cy - (sSelf / 10) * 93.33;

  // Bottom-Right (Relatedness): Vector is (90, 46.67)
  const xOther = cx + (sOther / 10) * 90;
  const yOther = cy + (sOther / 10) * 46.67;

  // Bottom-Left (Purpose): Vector is (-90, 46.67)
  const xPurpose = cx - (sPurpose / 10) * 90;
  const yPurpose = cy + (sPurpose / 10) * 46.67;

  const fillPolygon = document.getElementById('triangle-fill');
  if (fillPolygon) {
    fillPolygon.setAttribute('points', `100,${ySelf} ${xOther},${yOther} ${xPurpose},${yPurpose}`);
  }

  // Diagnostic logic based on the threshold (score >= 6 on all three is PG)
  const resultBadge = document.getElementById('result-badge');
  const resultDesc = document.getElementById('result-desc');

  if (sSelf >= 6 && sOther >= 6 && sPurpose >= 6) {
    resultBadge.className = 'assess-badge badge-active';
    resultBadge.innerText = 'Active Presence Gap Profile';
    resultDesc.innerHTML = `<strong>Presence Gap Configuration Detected:</strong> Your scores indicate elevated deficits across all three core dimensions. Because this is a configural condition, the combined impact is self-reinforcing: your transactional networks and market-oriented values choices make it difficult to build the authentic self-concept needed to back up your polished AI-generated materials. Moving your AI use from <strong>Mode 1 (Substitutive)</strong> to <strong>Mode 3 (Dialogic Scaffolding)</strong> is strongly recommended.`;
  } else if (sSelf >= 6 || sOther >= 6 || sPurpose >= 6) {
    let deficits = [];
    if (sSelf >= 6) deficits.push('Career Identity');
    if (sOther >= 6) deficits.push('Developmental Relatedness');
    if (sPurpose >= 6) deficits.push('Work-Purpose Clarity');
    resultBadge.className = 'assess-badge badge-targeted';
    resultBadge.innerText = 'Targeted Developmental Gaps';
    resultDesc.innerHTML = `<strong>Asymmetric Profile:</strong> You show a deficit in: <em>${deficits.join(', ')}</em>, but you do not meet the tripartite threshold for the full Presence Gap. You have healthy developmental assets in other areas that you can leverage to address these specific gaps before they consolidate.`;
  } else {
    resultBadge.className = 'assess-badge badge-aligned';
    resultBadge.innerText = 'Developmentally Aligned';
    resultDesc.innerHTML = `<strong>Healthy Developmental Baseline:</strong> You have strong, active ownership over your professional narrative, reciprocal mentoring relationships, and clear internal values. AI tools present a low risk of developmental bypass for you. Continue using AI dialogically to scaffold your work.`;
  }
}

// ── Exercise 1: Classify Statement Logic ──
const ex1Data = [
  { text: "I used AI to write my cover letter, but I can't explain the projects it mentions.", ans: 'self' },
  { text: "I have 500 LinkedIn connections but nobody I'd call for actual career advice.", ans: 'other' },
  { text: "I chose this field purely because it pays well and the AI tool said it has job growth.", ans: 'purpose' },
  { text: "My resume bullet points look amazing, but I struggle to narrate the lived details in interviews.", ans: 'self' },
  { text: "I talk to my AI career coach daily, but I don't talk to professors or industry mentors.", ans: 'other' },
  { text: "I don't know what kind of contribution feels worthwhile to me; I just want a title.", ans: 'purpose' }
];
let ex1Index = 0;

function renderClassify() {
  if(ex1Index >= ex1Data.length) ex1Index = 0;
  document.getElementById('classify-stmt').innerText = `"${ex1Data[ex1Index].text}"`;
  document.getElementById('classify-feedback').innerText = "";
  document.getElementById('classify-next').style.display = "none";
  document.getElementById('classify-progress').innerText = `Statement ${ex1Index + 1} of ${ex1Data.length}`;
}

function classifyAnswer(ans) {
  const correct = ex1Data[ex1Index].ans;
  const fb = document.getElementById('classify-feedback');
  if(ans === correct) {
      fb.innerHTML = "<span style='color: #34d399; font-weight:600;'>✓ Correct!</span> That is the right dimension mapping.";
      document.getElementById('classify-next').style.display = "block";
  } else {
      fb.innerHTML = "<span style='color: #ef4444; font-weight:600;'>✗ Incorrect.</span> Think about whether this speaks to self-authorship, social network ties, or vocational values.";
  }
}
function nextClassify() { ex1Index++; renderClassify(); }

// ── Exercise 2: Build the Formulation Logic ──
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
      fb.innerHTML = "<span style='color: #34d399; font-weight: 600;'>✓ Correct!</span> Jordan's identity is intact (he can explain projects perfectly, representing low identity risk), but relatedness and purpose are highly transactional/market-optimized. This is a partial configuration, not the full Presence Gap configuration which requires deficits in all three.";
  } else {
      fb.innerHTML = "<span style='color: #ef4444; font-weight: 600;'>✗ Incorrect.</span> Review the configural threshold rule: Jordan's career identity is not in deficit because he can narrate his projects perfectly. Thus, he doesn't meet the tripartite deficit threshold.";
  }
}

// ── Exercise 3: Match the Recovery Strategy ──
let selectedCard = null;
const ex3Answers = { 0: 'self', 1: 'other', 2: 'purpose' };
let ex3Placements = {};

function selectCard(id) {
  if (ex3Placements[id]) return;
  document.querySelectorAll('.match-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('mc-'+id).classList.add('selected');
  selectedCard = id;
}

function dropToZone(zone) {
  if(selectedCard !== null) {
      if (ex3Placements[selectedCard]) return;
      ex3Placements[selectedCard] = zone;

      const cardText = document.getElementById('mc-'+selectedCard).innerText;
      const zoneEl = document.querySelector('.zone-'+zone);
      const badge = document.createElement('div');
      badge.className = 'matched-badge';
      badge.id = 'matched-badge-' + selectedCard;
      badge.innerHTML = `✓ ${cardText}`;
      zoneEl.appendChild(badge);

      document.getElementById('mc-'+selectedCard).classList.remove('selected');
      document.getElementById('mc-'+selectedCard).style.display = 'none';
      selectedCard = null;
  }
}

function checkMatching() {
  let correct = 0;
  let totalPlacements = Object.keys(ex3Placements).length;
  if (totalPlacements < 3) {
      document.getElementById('match-feedback').innerHTML = "<span style='color: #f59e0b;'>Please place all 3 cards in their zones first!</span>";
      return;
  }
  for(let i=0; i<3; i++) {
      if(ex3Placements[i] === ex3Answers[i]) correct++;
  }

  const fb = document.getElementById('match-feedback');
  if (correct === 3) {
      fb.innerHTML = "<span style='color: #34d399; font-weight:600;'>✓ Excellent! 3/3 Correct.</span> You mapped the recovery strategies to their corresponding dimensions successfully.";
  } else {
      fb.innerHTML = `<span style='color: #ef4444; font-weight:600;'>You got ${correct}/3 correct.</span> Click 'Reset' to try again and map them correctly.`;
  }
}

function resetMatching() {
  ex3Placements = {};
  selectedCard = null;
  document.querySelectorAll('.match-card').forEach(c => {
      c.style.display = 'block';
      c.classList.remove('selected');
  });
  document.querySelectorAll('.matched-badge').forEach(b => b.remove());
  document.getElementById('match-feedback').innerHTML = '';
}

// ── Exercise 4: Mode Assessment ──
const ex4Data = [
  { text: "I have a conversation with ChatGPT about my accomplishments, then I write the resume myself based on that dialogue.", mode: 3, fb: "This is Mode 3 (Dialogic Scaffolding): AI structures the reflection while the user retains authorship." },
  { text: "I paste the job posting and my experience into AI and ask it to write the cover letter. I review it and fix a few typos.", mode: 1, fb: "This is Mode 1 (Substitutive): AI authors the document, and the user offloads the cognitive work of writing." },
  { text: "I draft a cover letter myself, ask AI to identify parts that sound weak or unclear, and then revise those parts using my own words.", mode: 2, fb: "This is Mode 2 (Iterative Feedback): The user drafts, AI critiques, and the user revises. Authorship is retained." }
];
let ex4Index = 0;

function renderModeEx() {
  if (ex4Index >= ex4Data.length) ex4Index = 0;
  document.getElementById('mode-stmt').innerText = `"${ex4Data[ex4Index].text}"`;
  document.getElementById('mode-feedback').innerText = '';
  document.getElementById('mode-progress').innerText = `Statement ${ex4Index + 1} of ${ex4Data.length}`;
}

function checkModeEx(mode) {
  const correctMode = ex4Data[ex4Index].mode;
  const fb = document.getElementById('mode-feedback');
  if (mode === correctMode) {
      fb.innerHTML = `<span style='color: #34d399; font-weight:600;'>✓ Correct!</span> ${ex4Data[ex4Index].fb}`;
      document.getElementById('mode-next').style.display = "block";
  } else {
      fb.innerHTML = `<span style='color: #ef4444; font-weight:600;'>✗ Incorrect.</span> Read the statement carefully to see who holds the core authorship and cognitive labor.`;
  }
}

function nextModeEx() {
  ex4Index++;
  renderModeEx();
  document.getElementById('mode-next').style.display = "none";
}

function setResearchTab(idx) {
  document.querySelectorAll('.res-tab').forEach((t,i) => t.classList.toggle('active', i===idx));
  document.querySelectorAll('.res-panel').forEach((p,i) => p.classList.toggle('active', i===idx));
}

// ── Navigation wiring and load execution ──
document.querySelectorAll('.nav-link, .nav-logo').forEach(link => {
  link.addEventListener('click', e => {
    const pageId = link.getAttribute('data-page') || 'hero';
    e.preventDefault();
    showPage(pageId);
    
    // Close mobile nav drawer if open
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) navLinks.classList.remove('open');
  });
});

window.onload = () => {
  showPage('hero');
  updateAssessment();
  renderClassify();
  renderModeEx();
  setResearchTab(0);
};
