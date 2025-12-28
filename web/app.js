const apiBase = '';

function el(tag, attrs = {}, children = []){
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{ if(k==='text') e.textContent=v; else e.setAttribute(k,v); });
  (Array.isArray(children)?children:[children]).forEach(c=>{ if(typeof c === 'string') e.insertAdjacentHTML('beforeend', c); else if(c) e.appendChild(c); });
  return e;
}

let questionnaire = null;
let state = { index:0, answers: {} };

function showToast(msg, timeout=2500){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.remove('hidden');
  clearTimeout(t._tm);
  t._tm = setTimeout(()=> t.classList.add('hidden'), timeout);
}

function saveProgress(){
  localStorage.setItem('orish53_progress', JSON.stringify(state));
}

function loadProgress(){
  try{ const s = JSON.parse(localStorage.getItem('orish53_progress')); if(s) state = s; }catch(e){}
}

function renderProgress(){
  const prog = document.getElementById('prog');
  if(!questionnaire) return;
  const pct = Math.round(((state.index) / questionnaire.questions.length) * 100);
  prog.style.width = pct + '%';
}

function renderStep(){
  const stepper = document.getElementById('stepper');
  stepper.innerHTML = '';
  const q = questionnaire.questions[state.index];
  const step = el('div',{class:'step active', id:'step-'+state.index});
  const label = el('label',{text:q.label});
  step.appendChild(label);
  if(q.type==='text'){
    const input = el('input',{id:q.id,name:q.id,type:'text'});
    input.value = state.answers[q.id] || '';
    input.addEventListener('input', e=>{ state.answers[q.id]=e.target.value; saveProgress(); });
    step.appendChild(input);
  } else if(q.type==='choice'){
    const list = el('div');
    q.options.forEach(opt=>{
      const btn = el('button',{type:'button',class:'ghost',text:opt});
      btn.addEventListener('click', ()=>{
        state.answers[q.id]=opt; saveProgress();
        // mark selection visually
        Array.from(list.children).forEach(c=>c.classList.remove('selected'));
        btn.classList.add('selected');
      });
      if(state.answers[q.id]===opt) btn.classList.add('selected');
      list.appendChild(btn);
    });
    step.appendChild(list);
  }
  stepper.appendChild(step);

  // buttons
  const btns = document.getElementById('buttons'); btns.innerHTML='';
  if(state.index>0){
    const back = el('button',{type:'button',text:'חזור'});
    back.addEventListener('click', ()=>{ state.index--; renderStep(); renderProgress(); saveProgress(); });
    btns.appendChild(back);
  }
  if(state.index < questionnaire.questions.length -1){
    const next = el('button',{type:'button',text:'הבא'});
    next.addEventListener('click', ()=>{ state.index++; renderStep(); renderProgress(); saveProgress(); });
    btns.appendChild(next);
  } else {
    const submit = el('button',{type:'button',text:'סיים וקבל תוכנית'});
    submit.addEventListener('click', submitForm);
    btns.appendChild(submit);
  }
}

async function load(){
  loadProgress();
  const app = document.getElementById('app');
  app.classList.add('loading');
  try{
    const res = await fetch('/questionnaire');
    questionnaire = await res.json();
    document.getElementById('title').textContent = questionnaire.title;
    document.getElementById('intro').textContent = questionnaire.intro;
    if(!state || !('index' in state)) state = {index:0, answers:{}};
    renderStep(); renderProgress();
  }catch(e){
    document.getElementById('title').textContent = 'שגיאה בטעינת השאלון';
    console.error(e);
  } finally{ app.classList.remove('loading'); }
}

async function submitForm(){
  // build data from state.answers
  const data = Object.assign({}, state.answers);
  const submitBtn = document.querySelector('#buttons button[type="button"]') || null;
  if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = 'שולח...'; }
  try{
    // basic required check
    const required = ['goal','time','commitment'];
    for(const k of required) if(!data[k]){ showToast('מלא/י את השאלות החסרות'); if(submitBtn){ submitBtn.disabled=false; submitBtn.textContent='סיים וקבל תוכנית'; } return; }

    const res = await fetch('/answers', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
    const j = await res.json();
    // clear saved progress
    localStorage.removeItem('orish53_progress');
    showResult(j.plan);
    showToast('התוכנית נוצרה בהצלחה!');
  }catch(e){ showToast('שגיאה בשליחה'); console.error(e); }
  finally{ if(submitBtn){ submitBtn.disabled=false; submitBtn.textContent='סיים וקבל תוכנית'; } }
}

function showResult(plan){
  const r = document.getElementById('result');
  r.classList.remove('hidden');
  r.innerHTML = `<h2>${plan.title}</h2><p>${plan.summary}</p><ul>${plan.habits.map(h=>`<li>${h}</li>`).join('')}</ul><p><em>${plan.tip}</em></p>`;
  r.scrollIntoView({behavior:'smooth'});
}

// basic validation: ensure goal/time/commitment chosen
function validateForm(){
  const required = ['goal','time','commitment'];
  for(const k of required){
    const v = document.getElementById(k).value;
    if(!v){ return false; }
  }
  return true;
}

load().catch(err=>{ document.getElementById('title').textContent = 'שגיאה בטעינת השאלון'; console.error(err); });
