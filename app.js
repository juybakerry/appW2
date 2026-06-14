/* ============ DATA ============ */
const CATS = {
  'บ้าน':     {label:'🏠 บ้าน',     color:'teal'},
  'ลูกเล็ก':  {label:'👧 ลูกเล็ก',  color:'green'},
  'ลูกโต':    {label:'👦 ลูกโต',    color:'blue'},
  'การเงิน':  {label:'💰 การเงิน',  color:'amber'},
  'สุขภาพ':   {label:'🏥 สุขภาพ',   color:'purple'},
  'เรื่องด่วน':{label:'🔴 เรื่องด่วน',color:'red'}
};
const CAT_ORDER = Object.keys(CATS);
const DOW = ['อา','จ','อ','พ','พฤ','ศ','ส'];
const MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
const MONTH_ABBR = {'ม.ค.':0,'ก.พ.':1,'มี.ค.':2,'เม.ย.':3,'พ.ค.':4,'มิ.ย.':5,'ก.ค.':6,'ส.ค.':7,'ก.ย.':8,'ต.ค.':9,'พ.ย.':10,'ธ.ค.':11};
const WEEKDAY_NAMES = {'วันอาทิตย์':0,'วันจันทร์':1,'วันอังคาร':2,'วันพุธ':3,'วันพฤหัสบดี':4,'วันพฤหัส':4,'วันศุกร์':5,'วันเสาร์':6};

function fmt(d){ // Date -> YYYY-MM-DD
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function todayDate(){ const d=new Date(); d.setHours(0,0,0,0); return d; }
function addDays(d,n){ const r=new Date(d); r.setDate(r.getDate()+n); return r; }
function thaiDate(d){ return d.getDate()+' '+MONTHS[d.getMonth()]+' '+(d.getFullYear()+543); }

const TODAY = todayDate();

let state = {
  tasks: [],
  events: [],
  money: [],
  chat: []
};

function seedData(){
  const t = TODAY;
  state.tasks = [
    {id:1, text:'ส่งลูกไปโรงเรียน', done:false, cat:'ลูกเล็ก', date:fmt(t)},
    {id:2, text:'จ่ายค่าไฟ', done:false, cat:'การเงิน', date:fmt(t)},
    {id:3, text:'ซื้ออุปกรณ์การเรียน', done:true, cat:'ลูกโต', date:fmt(t)},
    {id:4, text:'รับลูกจากโรงเรียน', done:false, cat:'ลูกเล็ก', date:fmt(t)},
    {id:5, text:'ส่งลูกคนเล็กไปทัศนศึกษา', done:false, cat:'ลูกเล็ก', date:fmt(addDays(t,1))},
    {id:6, text:'จ่ายค่าอินเทอร์เน็ต', done:false, cat:'การเงิน', date:fmt(addDays(t,1))}
  ];
  state.events = [
    {id:1, date:fmt(t), time:'08:00', text:'ส่งลูกไปโรงเรียน', cat:'ลูกเล็ก'},
    {id:2, date:fmt(t), time:'09:15', text:'จ่ายค่าไฟ 620 บาท', cat:'การเงิน'},
    {id:3, date:fmt(t), time:'14:00', text:'ประชุมผู้ปกครอง', cat:'ลูกโต'},
    {id:4, date:fmt(t), time:'18:00', text:'ซื้อของเข้าบ้าน', cat:'บ้าน'},
    {id:5, date:fmt(addDays(t,1)), time:'16:00', text:'นัดประชุมผู้ปกครอง', cat:'ลูกโต'},
    {id:6, date:fmt(addDays(t,31)), time:'09:00', text:'ค่าเทอม 4,500 บาท', cat:'การเงิน'},
    {id:7, date:fmt(addDays(t,24)), time:'09:00', text:'เตือน: ค่าเทอมใกล้ถึงกำหนด (7 วัน)', cat:'เรื่องด่วน'},
    {id:8, date:fmt(addDays(t,30)), time:'09:00', text:'เตือน: ค่าเทอมพรุ่งนี้!', cat:'เรื่องด่วน'}
  ];
  state.money = [
    {id:1, date:fmt(addDays(t,-3)), text:'เงินเดือน', amt:18000, type:'in'},
    {id:2, date:fmt(addDays(t,-2)), text:'ค่าอาหาร', amt:1200, type:'out'},
    {id:3, date:fmt(addDays(t,-2)), text:'ค่าน้ำ/ไฟ', amt:850, type:'out'},
    {id:4, date:fmt(addDays(t,-1)), text:'ค่าอินเทอร์เน็ต', amt:600, type:'out'},
    {id:5, date:fmt(t), text:'ของใช้ในบ้าน', amt:3600, type:'out'},
    {id:6, date:fmt(t), text:'ค่าไฟ', amt:620, type:'out'},
    {id:7, date:fmt(t), text:'ค่าอาหารกลางวัน', amt:120, type:'out'}
  ];
  state.chat = [];
}

function loadData(){
  try{
    const raw = localStorage.getItem('momflow-data');
    if(raw){ state = JSON.parse(raw); }
    else { seedData(); saveData(); }
  }catch(e){ seedData(); }
}
function saveData(){ localStorage.setItem('momflow-data', JSON.stringify(state)); }
function nextId(arr){ return arr.length ? Math.max(...arr.map(x=>x.id))+1 : 1; }

/* ============ NAVIGATION ============ */
function switchTab(tab){
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('tab-'+tab).classList.add('active');
  document.querySelector(`.nav-item[data-tab="${tab}"]`).classList.add('active');
  document.body.classList.toggle('chat-active', tab==='chat');
  if(tab==='chat' && state.chat.length===0){
    pushBotMessage('สวัสดีครับ จุ้ยเองนะครับ 😊 จุ้ยพร้อมช่วยดูแลงาน นัดหมาย และเงินของวิไลลักษณ์ทุกวันเลยครับ ลองถาม "พรุ่งนี้มีอะไรบ้าง" หรือพิมพ์ "ค่าเทอม 4500 บาท วันศุกร์" ให้จุ้ยจัดการให้ได้เลยนะครับ ถ้าใส่ Anthropic API key ไว้ในตั้งค่า จุ้ยจะคุยได้ทุกเรื่องแบบ AI เต็มรูปแบบเลยครับ');
  }
  if(tab==='home') renderHome();
  if(tab==='todo') renderTodo();
  if(tab==='cal') renderCalendar();
  if(tab==='money') renderMoney();
}

/* ============ HOME ============ */
function renderHome(){
  const todayTasks = state.tasks.filter(t=>t.date===fmt(TODAY));
  document.getElementById('home-task-count').textContent = todayTasks.length;
  document.getElementById('home-task-done').textContent = `เสร็จแล้ว ${todayTasks.filter(t=>t.done).length} งาน`;

  const todayEvents = state.events.filter(e=>e.date===fmt(TODAY)).sort((a,b)=>a.time.localeCompare(b.time));
  const now = new Date();
  const nowStr = String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
  const next = todayEvents.find(e=>e.time >= nowStr) || todayEvents[0];
  document.getElementById('home-next-time').textContent = next ? next.time : '--:--';
  document.getElementById('home-next-text').textContent = next ? next.text : 'ไม่มีนัดวันนี้';

  const inc = state.money.filter(m=>m.type==='in').reduce((s,m)=>s+m.amt,0);
  const exp = state.money.filter(m=>m.type==='out').reduce((s,m)=>s+m.amt,0);
  document.getElementById('home-balance').textContent = (inc-exp).toLocaleString();

  const homeTasksEl = document.getElementById('home-tasks');
  if(todayTasks.length===0){ homeTasksEl.innerHTML = '<div class="empty">ไม่มีงานวันนี้</div>'; }
  else{
    homeTasksEl.innerHTML = todayTasks.slice(0,5).map(t=>`
      <div class="task-row">
        <div class="task-check ${t.done?'done':''}" onclick="toggleTask(${t.id})">${t.done?'<i class="ti ti-check"></i>':''}</div>
        <div class="task-text ${t.done?'done':''}">${esc(t.text)}</div>
      </div>`).join('');
  }

  const tlEl = document.getElementById('home-timeline');
  if(todayEvents.length===0){ tlEl.innerHTML = '<div class="empty">ไม่มีนัดหมายวันนี้</div>'; }
  else{
    tlEl.innerHTML = todayEvents.map(e=>`
      <div class="tl-row">
        <div class="tl-time" style="color:var(--${CATS[e.cat].color});">${e.time}</div>
        <div class="tl-text">${esc(e.text)}</div>
      </div>`).join('');
  }
}

/* ============ TODO ============ */
let currentCatFilter = 'all';
function renderCatFilters(){
  const el = document.getElementById('cat-filters');
  let html = `<button class="chip ${currentCatFilter==='all'?'active':''}" onclick="setCatFilter('all')">ทั้งหมด</button>`;
  CAT_ORDER.forEach(c=>{
    html += `<button class="chip ${currentCatFilter===c?'active':''}" onclick="setCatFilter('${c}')">${CATS[c].label}</button>`;
  });
  el.innerHTML = html;
}
function setCatFilter(c){ currentCatFilter = c; renderTodo(); }

function renderTodo(){
  renderCatFilters();
  const list = currentCatFilter==='all' ? state.tasks : state.tasks.filter(t=>t.cat===currentCatFilter);
  const sorted = [...list].sort((a,b)=> (a.date||'').localeCompare(b.date||'') || (a.done - b.done));
  const el = document.getElementById('todo-list');
  if(sorted.length===0){ el.innerHTML = '<div class="empty">ไม่มีงานในหมวดนี้</div>'; return; }
  el.innerHTML = sorted.map(t=>`
    <div class="task-row">
      <div class="task-check ${t.done?'done':''}" onclick="toggleTask(${t.id})">${t.done?'<i class="ti ti-check"></i>':''}</div>
      <div style="flex:1;">
        <div class="task-text ${t.done?'done':''}">${esc(t.text)}</div>
        <div class="task-date">${dateLabel(t.date)}</div>
      </div>
      <span class="tag cat-${t.cat}">${CATS[t.cat].label}</span>
      <button class="trash-btn" onclick="removeTask(${t.id})" aria-label="ลบ"><i class="ti ti-trash"></i></button>
    </div>`).join('');
}
function dateLabel(dateStr){
  if(!dateStr) return '';
  if(dateStr===fmt(TODAY)) return 'วันนี้';
  if(dateStr===fmt(addDays(TODAY,1))) return 'พรุ่งนี้';
  const d = new Date(dateStr+'T00:00:00');
  return DOW[d.getDay()]+' '+thaiDate(d);
}
function toggleTask(id){
  const t = state.tasks.find(x=>x.id===id);
  if(t){ t.done = !t.done; saveData(); renderTodo(); renderHome(); }
}
function removeTask(id){
  state.tasks = state.tasks.filter(x=>x.id!==id);
  saveData(); renderTodo(); renderHome();
}

/* ============ CALENDAR ============ */
let calView = 'day';
let calSelected = new Date(TODAY);

function renderCalendar(){
  document.querySelectorAll('.seg-btn').forEach(b=>b.classList.toggle('active', b.dataset.view===calView));
  const titleEl = document.getElementById('cal-title');
  const gridEl = document.getElementById('cal-grid');
  const listTitleEl = document.getElementById('cal-list-title');
  const listEl = document.getElementById('events-list');

  if(calView==='month'){
    titleEl.textContent = MONTHS[calSelected.getMonth()]+' '+(calSelected.getFullYear()+543);
    gridEl.style.display='grid';
    let html = DOW.map(d=>`<div class="cal-dow">${d}</div>`).join('');
    const first = new Date(calSelected.getFullYear(), calSelected.getMonth(), 1);
    const daysInMonth = new Date(calSelected.getFullYear(), calSelected.getMonth()+1, 0).getDate();
    for(let i=0;i<first.getDay();i++) html += '<div class="cal-day empty"></div>';
    for(let d=1; d<=daysInMonth; d++){
      const dt = new Date(calSelected.getFullYear(), calSelected.getMonth(), d);
      const dStr = fmt(dt);
      const isToday = dStr===fmt(TODAY);
      const isSel = dStr===fmt(calSelected) && !isToday;
      const hasEv = state.events.some(e=>e.date===dStr);
      html += `<div class="cal-day ${isToday?'today':''} ${isSel?'selected':''}" onclick="selectCalDay('${dStr}')">${d}${hasEv?'<span class="ev-dot"></span>':''}</div>`;
    }
    gridEl.innerHTML = html;
    listTitleEl.textContent = 'นัดหมายวัน '+thaiDate(calSelected);
    renderEventList(fmt(calSelected), listEl);
  }
  else if(calView==='week'){
    titleEl.textContent = 'สัปดาห์นี้';
    gridEl.style.display='none';
    const startOfWeek = addDays(calSelected, -calSelected.getDay());
    let html = '<div class="cal-week-row">';
    for(let i=0;i<7;i++){
      const dt = addDays(startOfWeek, i);
      const dStr = fmt(dt);
      const evs = state.events.filter(e=>e.date===dStr);
      const isToday = dStr===fmt(TODAY);
      html += `<div class="cal-week-item ${isToday?'today':''}" onclick="selectCalDay('${dStr}')">
        <div class="cal-week-day">${DOW[dt.getDay()]} ${dt.getDate()}</div>
        <div class="cal-week-events">${evs.length ? evs.map(e=>e.time+' '+esc(e.text)).join(', ') : 'ไม่มีนัดหมาย'}</div>
      </div>`;
    }
    html += '</div>';
    gridEl.style.display='block';
    gridEl.innerHTML = html;
    listTitleEl.textContent = 'นัดหมายวัน '+thaiDate(calSelected);
    renderEventList(fmt(calSelected), listEl);
  }
  else{ // day
    titleEl.textContent = thaiDate(calSelected);
    gridEl.style.display='none';
    listTitleEl.textContent = fmt(calSelected)===fmt(TODAY) ? 'นัดหมายวันนี้' : 'นัดหมายวัน '+thaiDate(calSelected);
    renderEventList(fmt(calSelected), listEl);
  }
}
function renderEventList(dateStr, el){
  const evs = state.events.filter(e=>e.date===dateStr).sort((a,b)=>a.time.localeCompare(b.time));
  if(evs.length===0){ el.innerHTML = '<div class="empty">ไม่มีนัดหมาย</div>'; return; }
  el.innerHTML = evs.map(e=>`
    <div class="event-card">
      <div class="event-bar" style="background:var(--${CATS[e.cat].color});"></div>
      <div class="event-meta">
        <div class="event-time">${e.time}</div>
        <div class="event-text">${esc(e.text)}</div>
      </div>
      <button class="trash-btn" onclick="removeEvent(${e.id})" aria-label="ลบ"><i class="ti ti-trash"></i></button>
    </div>`).join('');
}
function selectCalDay(dStr){ calSelected = new Date(dStr+'T00:00:00'); renderCalendar(); }
function removeEvent(id){ state.events = state.events.filter(x=>x.id!==id); saveData(); renderCalendar(); renderHome(); }

document.getElementById('cal-views').addEventListener('click', e=>{
  const btn = e.target.closest('.seg-btn');
  if(!btn) return;
  calView = btn.dataset.view;
  renderCalendar();
});
document.getElementById('cal-prev').addEventListener('click', ()=>{
  if(calView==='month') calSelected = new Date(calSelected.getFullYear(), calSelected.getMonth()-1, 1);
  else if(calView==='week') calSelected = addDays(calSelected, -7);
  else calSelected = addDays(calSelected, -1);
  renderCalendar();
});
document.getElementById('cal-next').addEventListener('click', ()=>{
  if(calView==='month') calSelected = new Date(calSelected.getFullYear(), calSelected.getMonth()+1, 1);
  else if(calView==='week') calSelected = addDays(calSelected, 7);
  else calSelected = addDays(calSelected, 1);
  renderCalendar();
});

/* ============ MONEY ============ */
function renderMoney(){
  const inc = state.money.filter(m=>m.type==='in').reduce((s,m)=>s+m.amt,0);
  const exp = state.money.filter(m=>m.type==='out').reduce((s,m)=>s+m.amt,0);
  document.getElementById('total-income').textContent = inc.toLocaleString();
  document.getElementById('total-expense').textContent = exp.toLocaleString();
  document.getElementById('balance-amt').textContent = (inc-exp).toLocaleString()+' บาท';

  const el = document.getElementById('money-list');
  if(state.money.length===0){ el.innerHTML = '<div class="empty">ยังไม่มีรายการ</div>'; return; }
  const sorted = [...state.money].sort((a,b)=> (b.date||'').localeCompare(a.date||'') || b.id-a.id);
  el.innerHTML = sorted.slice(0,20).map(m=>`
    <div class="money-row">
      <div class="money-icon ${m.type}"><i class="ti ti-arrow-${m.type==='in'?'down-left':'up-right'}"></i></div>
      <div class="money-text">${esc(m.text)}<div class="money-date">${dateLabel(m.date)}</div></div>
      <div class="money-amt ${m.type}">${m.type==='in'?'+':'-'}${m.amt.toLocaleString()}</div>
      <button class="trash-btn" onclick="removeMoney(${m.id})" aria-label="ลบ"><i class="ti ti-trash"></i></button>
    </div>`).join('');
}
function removeMoney(id){ state.money = state.money.filter(x=>x.id!==id); saveData(); renderMoney(); renderHome(); }

/* ============ NATURAL-LANGUAGE PARSER ============ */
// Try to detect amount in baht
function detectAmount(text){
  const m = text.match(/([\d,]+(?:\.\d+)?)\s*บาท/) || text.match(/([\d,]+(?:\.\d+)?)\s*฿/);
  if(m) return parseFloat(m[1].replace(/,/g,''));
  return null;
}
// Try to detect a date, returns {date: 'YYYY-MM-DD', label: matchedString} or null
function detectDate(text){
  if(text.includes('วันนี้')) return {date: fmt(TODAY), match:'วันนี้'};
  if(text.includes('พรุ่งนี้')) return {date: fmt(addDays(TODAY,1)), match:'พรุ่งนี้'};
  if(text.includes('มะรืนนี้')) return {date: fmt(addDays(TODAY,2)), match:'มะรืนนี้'};
  // weekday names -> next occurrence (including today if same day mentioned but default to next)
  for(const wd in WEEKDAY_NAMES){
    if(text.includes(wd)){
      const target = WEEKDAY_NAMES[wd];
      let diff = (target - TODAY.getDay() + 7) % 7;
      if(diff===0) diff = 7;
      return {date: fmt(addDays(TODAY, diff)), match: wd};
    }
  }
  // dd ต.ค. or dd/mm format
  for(const abbr in MONTH_ABBR){
    const re = new RegExp('(\\d{1,2})\\s*'+abbr.replace('.','\\.'));
    const m = text.match(re);
    if(m){
      let day = parseInt(m[1]);
      let month = MONTH_ABBR[abbr];
      let year = TODAY.getFullYear();
      let dt = new Date(year, month, day);
      if(dt < TODAY) dt.setFullYear(year+1);
      return {date: fmt(dt), match: m[0]};
    }
  }
  const slashMatch = text.match(/(\d{1,2})\/(\d{1,2})/);
  if(slashMatch){
    let day = parseInt(slashMatch[1]), month = parseInt(slashMatch[2])-1;
    let year = TODAY.getFullYear();
    let dt = new Date(year, month, day);
    if(dt < TODAY) dt.setFullYear(year+1);
    return {date: fmt(dt), match: slashMatch[0]};
  }
  return null;
}
// Try to detect a time HH:MM
function detectTime(text){
  const m = text.match(/(\d{1,2}):(\d{2})/);
  if(m) return m[0].padStart(5,'0');
  return null;
}
// Guess category from keywords
function detectCategory(text){
  if(/ด่วน|เร่งด่วน|รีบ|ฉุกเฉิน/.test(text)) return 'เรื่องด่วน';
  if(/หมอ|ยา|สุขภาพ|ฉีดวัคซีน|ป่วย|คลินิก/.test(text)) return 'สุขภาพ';
  if(/เทอม|เงินเดือน|ค่าไฟ|ค่าน้ำ|ค่าเช่า|จ่าย|บิล|ผ่อน|อินเทอร์เน็ต|เงิน/.test(text)) return 'การเงิน';
  if(/อนุบาล|ลูกเล็ก|ทัศนศึกษา/.test(text)) return 'ลูกเล็ก';
  if(/ม\.3|ม\.ปลาย|ลูกโต|มัธยม|การบ้าน|สอบ/.test(text)) return 'ลูกโต';
  if(/ลูก/.test(text)) return 'ลูกเล็ก';
  return 'บ้าน';
}
// Strip detected pieces from text to make a clean task label
function cleanLabel(text, pieces){
  let out = text;
  pieces.forEach(p=>{ if(p) out = out.replace(p, ''); });
  return out.replace(/\s{2,}/g,' ').trim() || text.trim();
}

// Core "quick add" — returns a summary of what was created
function quickAdd(rawText){
  const text = rawText.trim();
  if(!text) return null;
  const amount = detectAmount(text);
  const dateInfo = detectDate(text);
  const time = detectTime(text);
  const cat = detectCategory(text);
  const stripPieces = [];
  if(dateInfo) stripPieces.push(dateInfo.match);
  if(time) stripPieces.push(time);
  if(amount!==null) stripPieces.push(amount.toLocaleString()+' บาท', String(amount)+' บาท');
  const label = cleanLabel(text, stripPieces);

  const created = {task:false, event:false, expense:false, reminders:0};

  // Always create a task
  state.tasks.push({
    id: nextId(state.tasks),
    text: label,
    done: false,
    cat: cat,
    date: dateInfo ? dateInfo.date : fmt(TODAY)
  });
  created.task = true;

  // Create calendar event if date or time present
  if(dateInfo || time){
    state.events.push({
      id: nextId(state.events),
      date: dateInfo ? dateInfo.date : fmt(TODAY),
      time: time || '09:00',
      text: label + (amount!==null ? ` ${amount.toLocaleString()} บาท` : ''),
      cat: cat
    });
    created.event = true;
  }

  // Create expense if amount present
  if(amount!==null){
    state.money.push({
      id: nextId(state.money),
      date: dateInfo ? dateInfo.date : fmt(TODAY),
      text: label,
      amt: amount,
      type: 'out'
    });
    created.expense = true;

    // Smart reminders for future-dated bills (30/7/1 days before)
    if(dateInfo){
      const target = new Date(dateInfo.date+'T00:00:00');
      [[30,'30 วัน'], [7,'7 วัน'], [1,'1 วัน']].forEach(([days,label2])=>{
        const remindDate = addDays(target, -days);
        if(remindDate >= TODAY){
          state.events.push({
            id: nextId(state.events),
            date: fmt(remindDate),
            time: '09:00',
            text: `เตือน: ${label} ใกล้ถึงกำหนด (เหลือ ${label2})`,
            cat: 'เรื่องด่วน'
          });
          created.reminders++;
        }
      });
    }
  }

  saveData();
  return {label, amount, dateInfo, cat, created};
}

function summarizeCreation(result){
  if(!result) return '';
  const parts = [];
  if(result.created.task) parts.push('✅ To-Do');
  if(result.created.event) parts.push('✅ Calendar');
  if(result.created.expense) parts.push('✅ รายจ่าย');
  let msg = `จัดการให้แล้วครับ — "${result.label}"`;
  if(result.dateInfo) msg += ` (${dateLabel(result.dateInfo.date)})`;
  if(result.amount!==null) msg += ` จำนวน ${result.amount.toLocaleString()} บาท`;
  msg += '\n' + parts.join('  ');
  if(result.created.reminders) msg += `\n🔔 ตั้งเตือนล่วงหน้าให้แล้ว ${result.created.reminders} ครั้ง`;
  return msg;
}

/* ============ HOME QUICK ADD ============ */
document.getElementById('quick-add-btn').addEventListener('click', runQuickAdd);
document.getElementById('quick-add-input').addEventListener('keydown', e=>{ if(e.key==='Enter') runQuickAdd(); });
function runQuickAdd(){
  const input = document.getElementById('quick-add-input');
  const val = input.value.trim();
  if(!val) return;
  const result = quickAdd(val);
  input.value = '';
  renderHome(); renderTodo(); renderCalendar(); renderMoney();
  toast(summarizeCreation(result));
}

/* ============ TASK / EVENT / MONEY ADD FORMS ============ */
document.getElementById('task-add-btn').addEventListener('click', ()=>{
  const input = document.getElementById('task-input');
  const val = input.value.trim();
  if(!val) return;
  const dateInfo = detectDate(val);
  const cat = detectCategory(val);
  const label = cleanLabel(val, dateInfo ? [dateInfo.match] : []);
  state.tasks.push({id:nextId(state.tasks), text:label, done:false, cat:cat, date: dateInfo?dateInfo.date:fmt(TODAY)});
  saveData(); input.value=''; renderTodo(); renderHome();
});
document.getElementById('task-input').addEventListener('keydown', e=>{ if(e.key==='Enter') document.getElementById('task-add-btn').click(); });

document.getElementById('event-add-btn').addEventListener('click', ()=>{
  const input = document.getElementById('event-input');
  const val = input.value.trim();
  if(!val) return;
  const result = quickAdd(val);
  input.value='';
  renderCalendar(); renderHome(); renderTodo(); renderMoney();
  toast(summarizeCreation(result));
});
document.getElementById('event-input').addEventListener('keydown', e=>{ if(e.key==='Enter') document.getElementById('event-add-btn').click(); });

document.getElementById('money-add-btn').addEventListener('click', ()=>{
  const input = document.getElementById('money-input');
  let val = input.value.trim();
  if(!val) return;
  let type = 'out';
  if(val.startsWith('+')){ type='in'; val = val.slice(1).trim(); }
  else if(val.startsWith('-')){ type='out'; val = val.slice(1).trim(); }
  const amount = detectAmount(val) ?? parseFloat((val.match(/[\d,]+(\.\d+)?/)||[])[0]?.replace(/,/g,''));
  const label = cleanLabel(val, [amount!==null && !isNaN(amount) ? (amount.toLocaleString()+' บาท') : null, amount!==null && !isNaN(amount) ? String(amount) : null]);
  if(amount===null || isNaN(amount)){ toast('จุ้ยไม่เจอจำนวนเงินครับ ลองพิมพ์ตัวเลขด้วยนะครับ'); return; }
  state.money.push({id:nextId(state.money), date:fmt(TODAY), text:label||(type==='in'?'รายรับ':'รายจ่าย'), amt:amount, type});
  saveData(); input.value=''; renderMoney(); renderHome();
});
document.getElementById('money-input').addEventListener('keydown', e=>{ if(e.key==='Enter') document.getElementById('money-add-btn').click(); });

/* ============ TOAST ============ */
let toastTimer;
function toast(msg){
  let el = document.getElementById('toast');
  if(!el){
    el = document.createElement('div');
    el.id = 'toast';
    el.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);max-width:90%;background:var(--text);color:var(--bg);font-size:12.5px;padding:10px 16px;border-radius:12px;z-index:60;white-space:pre-line;text-align:center;line-height:1.6;box-shadow:0 4px 16px rgba(0,0,0,0.2);';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = '1';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>{ el.style.transition='opacity .3s'; el.style.opacity='0'; }, 3200);
}

/* ============ AI ASSISTANT — CONFIG ============ */
function getApiKey(){ return localStorage.getItem('momflow-api-key') || ''; }
function setApiKey(key){ localStorage.setItem('momflow-api-key', key); }

function buildDataContext(){
  const todayTasks = state.tasks.filter(t=>t.date===fmt(TODAY));
  const tomorrowTasks = state.tasks.filter(t=>t.date===fmt(addDays(TODAY,1)));
  const todayEvents = state.events.filter(e=>e.date===fmt(TODAY)).sort((a,b)=>a.time.localeCompare(b.time));
  const tomorrowEvents = state.events.filter(e=>e.date===fmt(addDays(TODAY,1))).sort((a,b)=>a.time.localeCompare(b.time));
  const inc = state.money.filter(m=>m.type==='in').reduce((s,m)=>s+m.amt,0);
  const exp = state.money.filter(m=>m.type==='out').reduce((s,m)=>s+m.amt,0);
  return `วันนี้คือ ${thaiDate(TODAY)} (${fmt(TODAY)})
งานวันนี้: ${todayTasks.map(t=>`${t.done?'[เสร็จแล้ว]':'[ยังไม่เสร็จ]'} ${t.text} (${t.cat})`).join(', ') || 'ไม่มี'}
นัดหมายวันนี้: ${todayEvents.map(e=>`${e.time} ${e.text}`).join(', ') || 'ไม่มี'}
งานพรุ่งนี้: ${tomorrowTasks.map(t=>t.text).join(', ') || 'ไม่มี'}
นัดหมายพรุ่งนี้: ${tomorrowEvents.map(e=>`${e.time} ${e.text}`).join(', ') || 'ไม่มี'}
การเงินเดือนนี้: รายรับ ${inc.toLocaleString()} บาท, รายจ่าย ${exp.toLocaleString()} บาท, เหลือ ${(inc-exp).toLocaleString()} บาท`;
}

const JUEY_SYSTEM_PROMPT = `คุณคือ "จุ้ย" ผู้ช่วย AI เพศชายประจำแอป MomFlow Wilailak ซึ่งเป็นแอปจัดการงาน นัดหมาย และเงินสำหรับ "วิไลลักษณ์" คุณแม่เลี้ยงเดี่ยว

กฎสำคัญ:
- แทนตัวเองว่า "จุ้ย" เสมอ ห้ามใช้ "ผม" หรือ "ฉัน" แทนตัวเอง (ใช้ "จุ้ย" แทน)
- ใช้คำลงท้ายแบบผู้ชาย เช่น "ครับ", "นะครับ", "ใช่ไหมครับ"
- น้ำเสียงเป็นกันเอง อบอุ่น ใส่ใจ เหมือนเพื่อนที่ช่วยดูแลเรื่องในบ้าน
- ตอบได้ทุกเรื่อง ทั้งเรื่องในแอป (งาน นัดหมาย เงิน) และเรื่องทั่วไปอื่น ๆ ที่วิไลลักษณ์อยากคุยหรือถาม
- ถ้าวิไลลักษณ์พูดถึงงาน นัดหมาย หรือรายจ่ายใหม่ ระบบของแอปจะบันทึกให้อัตโนมัติอยู่แล้วในเบื้องหลัง คุณไม่ต้องทำหน้าที่บันทึกเอง แค่ตอบรับและให้กำลังใจ
- ตอบกระชับ ไม่ยาวเกินจำเป็น

ข้อมูลปัจจุบันในแอป:
${buildDataContext()}`;

/* ============ CHAT — "จุ้ย" AI ASSISTANT ============ */
function esc(s){ return String(s).replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

function pushBotMessage(text){
  state.chat.push({role:'bot', text});
  renderChatMessage('bot', text);
  saveData();
}
function pushUserMessage(text){
  state.chat.push({role:'user', text});
  renderChatMessage('user', text);
  saveData();
}
function renderChatMessage(role, text){
  const el = document.getElementById('chat-messages');
  const wrap = document.createElement('div');
  wrap.className = 'msg '+role;
  if(role==='bot'){
    wrap.innerHTML = `<div class="msg-avatar"><i class="ti ti-robot"></i></div><div class="msg-bubble">${esc(text)}</div>`;
  }else{
    wrap.innerHTML = `<div class="msg-bubble">${esc(text)}</div>`;
  }
  el.appendChild(wrap);
  el.scrollTop = el.scrollHeight;
}
function showTyping(){
  const el = document.getElementById('chat-messages');
  const wrap = document.createElement('div');
  wrap.className = 'msg bot';
  wrap.id = 'typing-indicator';
  wrap.innerHTML = `<div class="msg-avatar"><i class="ti ti-robot"></i></div><div class="msg-bubble typing-dots"><span></span><span></span><span></span></div>`;
  el.appendChild(wrap);
  el.scrollTop = el.scrollHeight;
}
function hideTyping(){ document.getElementById('typing-indicator')?.remove(); }

// Restore chat history on load
function restoreChat(){
  state.chat.forEach(m=>renderChatMessage(m.role, m.text));
}

document.getElementById('chat-send-btn').addEventListener('click', sendChat);
document.getElementById('chat-input').addEventListener('keydown', e=>{ if(e.key==='Enter') sendChat(); });

async function sendChat(){
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if(!msg) return;
  pushUserMessage(msg);
  input.value = '';
  showTyping();

  // Run background quick-add for messages that look like reminders / dated expenses
  let savedNote = '';
  if(/เตือน/.test(msg)){
    const cleaned = msg.replace(/^เตือน(ให้)?/, '').trim() || msg;
    const result = quickAdd(cleaned);
    savedNote = '\n\n🔔 ' + summarizeCreation(result);
  } else if(detectAmount(msg) && (detectDate(msg) || detectTime(msg))){
    const result = quickAdd(msg);
    savedNote = '\n\n📝 ' + summarizeCreation(result);
  }

  const apiKey = getApiKey();
  let reply;
  if(apiKey){
    try{
      // refresh system context each call by rebuilding history with latest data
      const history = state.chat.slice(-12).map(m=>({role: m.role==='bot' ? 'assistant':'user', content: m.text}));
      reply = await callClaudeWithFreshContext(history);
    }catch(e){
      reply = 'จุ้ยเชื่อมต่อ AI ไม่ได้ครับ (' + e.message + ') จุ้ยจะช่วยแบบพื้นฐานไปก่อนนะครับ\n\n' + jueyLocalReply(msg);
    }
  }else{
    reply = jueyLocalReply(msg);
  }

  hideTyping();
  pushBotMessage(reply + savedNote);
  renderHome(); renderTodo(); renderCalendar(); renderMoney();
}

async function callClaudeWithFreshContext(history){
  const apiKey = getApiKey();
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: JUEY_SYSTEM_PROMPT.replace(/ข้อมูลปัจจุบันในแอป:[\s\S]*$/, 'ข้อมูลปัจจุบันในแอป:\n'+buildDataContext()),
      messages: history
    })
  });
  if(!res.ok){
    const errText = await res.text().catch(()=> '');
    let detail = '';
    try{ detail = JSON.parse(errText)?.error?.message || ''; }catch(_){ detail = errText.slice(0,100); }
    throw new Error('สถานะ '+res.status+(detail?' - '+detail:''));
  }
  const data = await res.json();
  const textBlock = (data.content || []).find(b=>b.type==='text');
  return textBlock ? textBlock.text : 'จุ้ยตอบไม่ได้ตอนนี้ครับ ลองใหม่อีกครั้งนะครับ';
}

// Local rule-based brain (fallback when no API key) — speaks as "จุ้ย" (male)
function jueyLocalReply(msg){
  const text = msg.trim();

  // Tomorrow / today summaries
  if(/พรุ่งนี้/.test(text) && /(มีอะไร|มีนัด|มีงาน|ตาราง)/.test(text) || (/พรุ่งนี้/.test(text) && text.length < 12)){
    return summarizeDay(addDays(TODAY,1), 'พรุ่งนี้');
  }
  if(/วันนี้/.test(text) && /(มีอะไร|มีนัด|มีงาน|ตาราง)/.test(text) || (/วันนี้/.test(text) && text.length < 10)){
    return summarizeDay(TODAY, 'วันนี้');
  }

  // Money summary
  if(/(ค่าใช้จ่าย|ใช้ไป|เหลือ|งบ|เงินคงเหลือ|สรุปเงิน)/.test(text)){
    const inc = state.money.filter(m=>m.type==='in').reduce((s,m)=>s+m.amt,0);
    const exp = state.money.filter(m=>m.type==='out').reduce((s,m)=>s+m.amt,0);
    return `เดือนนี้วิไลลักษณ์ใช้ไป ${exp.toLocaleString()} บาทครับ\nรายรับรวม ${inc.toLocaleString()} บาท\nเหลืองบประมาณอีก ${(inc-exp).toLocaleString()} บาท\nจุ้ยช่วยจดให้ตลอดนะครับ ถ้ามีรายจ่ายเพิ่มบอกจุ้ยได้เลยครับ`;
  }

  // Greetings / about juey
  if(/^(สวัสดี|หวัดดี|ดีจ้า|ดีครับ|ดีค่ะ|hi|hello)/i.test(text)){
    return 'สวัสดีครับ จุ้ยเองนะครับ 😊 วันนี้มีอะไรให้จุ้ยช่วยบ้างครับ';
  }
  if(/(เธอชื่อ|คุณชื่อ|ชื่ออะไร|เป็นใคร)/.test(text)){
    return 'จุ้ยเป็นผู้ช่วย AI ของ MomFlow ครับ คอยช่วยจดงาน นัดหมาย และเงินให้วิไลลักษณ์ทุกวันเลยครับ มีอะไรให้จุ้ยช่วยบอกได้เลยนะครับ';
  }
  if(/(ขอบใจ|ขอบคุณ|thank)/i.test(text)){
    return 'ด้วยความยินดีครับ จุ้ยอยู่ตรงนี้เสมอนะครับ 🙂';
  }

  // Reminder request
  if(/เตือน/.test(text)){
    const result = quickAdd(text.replace(/^เตือน/, '').replace(/^ให้/,'').trim() || text);
    return 'จุ้ยตั้งเตือนให้แล้วครับ ✅\n' + summarizeCreation(result);
  }

  // Anything with a number / date / amount → treat as quick add
  if(detectAmount(text) || detectDate(text) || detectTime(text)){
    const result = quickAdd(text);
    return summarizeCreation(result);
  }

  // Fallback — try to add as a task anyway, but invite general chat too
  const result = quickAdd(text);
  return `จุ้ยบันทึก "${result.label}" ไว้ในรายการงานให้แล้วครับ ✅\n\n(ถ้าอยากให้จุ้ยคุยเรื่องทั่วไปได้แบบ AI เต็มรูปแบบ ลองไปตั้งค่า > ใส่ Anthropic API key ดูนะครับ จุ้ยจะคุยได้ทุกเรื่องเลยครับ)`;
}

function summarizeDay(date, label){
  const dStr = fmt(date);
  const tasks = state.tasks.filter(t=>t.date===dStr && !t.done);
  const events = state.events.filter(e=>e.date===dStr).sort((a,b)=>a.time.localeCompare(b.time));
  if(tasks.length===0 && events.length===0){
    return `${label}ยังไม่มีงานหรือนัดหมายเลยครับ จุ้ยจะรีบบอกถ้ามีอะไรเพิ่มนะครับ`;
  }
  let out = `${label}มีดังนี้ครับ\n`;
  events.forEach(e=> out += `• ${e.time} ${e.text}\n`);
  tasks.forEach(t=> out += `• ${t.text}\n`);
  out += '\nจุ้ยจะคอยเตือนให้นะครับ 😊';
  return out;
}

/* ============ NAV / SETTINGS WIRING ============ */
document.querySelectorAll('.nav-item').forEach(btn=>{
  btn.addEventListener('click', ()=>switchTab(btn.dataset.tab));
});
document.querySelectorAll('[data-goto]').forEach(btn=>{
  btn.addEventListener('click', ()=>switchTab(btn.dataset.goto));
});
document.querySelector('.ai-card').addEventListener('click', ()=>switchTab('chat'));

const settingsOverlay = document.getElementById('settings-overlay');
document.getElementById('settings-btn').addEventListener('click', ()=>settingsOverlay.classList.add('open'));
document.getElementById('settings-close').addEventListener('click', ()=>settingsOverlay.classList.remove('open'));
settingsOverlay.addEventListener('click', e=>{ if(e.target===settingsOverlay) settingsOverlay.classList.remove('open'); });
document.getElementById('premium-btn').addEventListener('click', ()=>{
  toast('เร็ว ๆ นี้! ระบบสมาชิก Premium กำลังจะมาให้ใช้งานนะครับ');
});
document.getElementById('reset-btn').addEventListener('click', ()=>{
  if(confirm('รีเซ็ตข้อมูลทั้งหมดเป็นข้อมูลตัวอย่าง?')){
    seedData(); saveData();
    document.getElementById('chat-messages').innerHTML='';
    renderHome(); renderTodo(); renderCalendar(); renderMoney();
    settingsOverlay.classList.remove('open');
    toast('รีเซ็ตข้อมูลเรียบร้อยครับ');
  }
});

/* ============ API KEY SETTINGS ============ */
const apiKeyInput = document.getElementById('api-key-input');
apiKeyInput.value = getApiKey();
document.getElementById('api-key-save').addEventListener('click', ()=>{
  const val = apiKeyInput.value.trim();
  setApiKey(val);
  if(val){
    toast('บันทึก API key แล้วครับ จุ้ยพร้อมคุยได้ทุกเรื่องแล้วครับ 🎉');
  }else{
    toast('ลบ API key แล้วครับ จุ้ยจะใช้โหมดพื้นฐานแทนครับ');
  }
});

/* ============ INSTALL APP (PWA) ============ */
let deferredInstallPrompt = null;
const installCard = document.getElementById('install-card');
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault();
  deferredInstallPrompt = e;
  installCard.style.display = 'block';
});
installBtn.addEventListener('click', async ()=>{
  if(!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  const choice = await deferredInstallPrompt.userChoice;
  if(choice.outcome === 'accepted'){
    toast('ติดตั้งแอปเรียบร้อยครับ 🎉');
    installCard.style.display = 'none';
  }
  deferredInstallPrompt = null;
});
window.addEventListener('appinstalled', ()=>{
  installCard.style.display = 'none';
  deferredInstallPrompt = null;
});

/* ============ GREETING BY TIME OF DAY ============ */
function setGreeting(){
  const h = new Date().getHours();
  let g = 'สวัสดี';
  if(h < 12) g = 'อรุณสวัสดิ์';
  else if(h < 18) g = 'สวัสดีตอนบ่าย';
  else g = 'สวัสดีตอนเย็น';
  document.getElementById('greeting').textContent = `${g} วิไลลักษณ์ 👋`;
}

/* ============ INIT ============ */
loadData();
setGreeting();
renderHome();
restoreChat();

/* ============ SERVICE WORKER ============ */
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  });
}
