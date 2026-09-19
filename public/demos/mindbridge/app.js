const $ = s => document.querySelector(s);
let session = null;
let sessionKey;
let profile;
let csrf;
const welcomeMarkup = $('#messages').innerHTML;
let busy = false;
let noticeTimer;
const labels = {NORMAL:'No rule matched', ANXIETY:'Stress / anxiety signal', LOW_MOOD:'Low mood signal', HIGH_RISK:'Safety concern'};
async function api(path, options = {}) {
  const response = await window.demoFetch('/api' + path, {...options,headers:{'Content-Type':'application/json',...(csrf?{[csrf.headerName]:csrf.token}:{}),...options.headers}});
  if(response.status===401){location.assign('index.html');throw new Error('Please sign in again.');}
  if (!response.ok) throw new Error(response.status === 404 ? 'Session not found. Start a new conversation.' : `Request failed (${response.status}). Please try again.`);
  return response.json();
}
function notice(message) {
  $('#notice').textContent = message; $('#notice').hidden = false;
  clearTimeout(noticeTimer); noticeTimer = setTimeout(() => $('#notice').hidden = true, 6500);
}
function bubble(role, text) {
  $('.welcome')?.remove();
  const node = document.createElement('div'); node.className = 'message ' + role;
  const label = document.createElement('span'); label.className = 'message-label'; label.textContent = role === 'user' ? 'YOU' : 'MINDBRIDGE';
  const content = document.createElement('span'); content.textContent = text;
  node.append(label, content); $('#messages').append(node); scrollChat();
  return {node, content};
}
function scrollChat() { $('#messages').scrollTop = $('#messages').scrollHeight; }
async function ensureSession() {
  if (!session) { session = (await api('/conversations', {method:'POST'})).id; sessionStorage.setItem(sessionKey,session); }
  return session;
}
function showInsight(data) {
  $('#insight-placeholder').hidden=true;$('#insight').hidden=false;
  $('#route-note').textContent=data.intent==='CHAT'?'Just a conversation. No screening report is created.':(data.sources.length?'We are drawing on support resources for this conversation.':'We can take this one step at a time.');
  $('#sources').replaceChildren();
  for(const source of data.sources){const node=document.createElement('div');node.className='source';node.textContent=source.title;$('#sources').append(node);}
}
async function send(text) {
  if(busy || !text.trim()) return;
  busy = true; $('#send').disabled = true; $('#new-session').disabled = true;
  let reply, complete = false;
  try {
    await ensureSession();
    bubble('user', text); $('#message').value = '';
    reply = bubble('assistant', 'Listening…');
    const response = await window.demoFetch(`/api/conversations/${session}/messages`, {method:'POST', headers:{'Content-Type':'application/json','Accept':'text/event-stream',[csrf.headerName]:csrf.token},body:JSON.stringify({message:text})});
    if(!response.ok) throw new Error(`Message could not be sent (${response.status}). Please try again.`);
    const reader = response.body.getReader(); const decoder = new TextDecoder(); let pending = '', content = '';
    function processFrame(frame) {
      const lines = frame.split('\n'); const type = lines.find(l => l.startsWith('event:'))?.slice(6).trim();
      const raw = lines.filter(l=>l.startsWith('data:')).map(l=>l.slice(5).trimStart()).join('\n');
      if(!raw) return;
      const data = JSON.parse(raw);
      if(type === 'meta') showInsight(data);
      if(type === 'token') { content += data.text; reply.content.textContent = content; scrollChat(); }
      if(type === 'done') complete = true;
      if(type === 'error') throw new Error(data.message);
    }
    try {
      while(true) {
        const {value,done} = await reader.read();
        pending += decoder.decode(value || new Uint8Array(), {stream:!done}).replace(/\r\n/g,'\n');
        let split;
        while((split = pending.indexOf('\n\n')) >= 0) {processFrame(pending.slice(0,split));pending=pending.slice(split+2);}
        if(done) break;
      }
      if(!complete) throw new Error('The connection ended before the reply was saved. Please try again.');
    } finally { await reader.cancel().catch(()=>{}); }
  } catch(e) {
    if(reply) {reply.node.classList.add('failed'); reply.content.textContent += '\n\n' + e.message;}
    notice(e.message);
  } finally {
    busy=false; $('#send').disabled=false; $('#new-session').disabled=false; $('#message').focus(); refreshStatus().catch(()=>{});loadSessions().catch(()=>{});
  }
}
$('#chat-form').addEventListener('submit', e=>{e.preventDefault();send($('#message').value.trim());});
$('#message').addEventListener('keydown', e=>{if(e.key==='Enter' && !e.shiftKey && !e.isComposing){e.preventDefault();$('#chat-form').requestSubmit();}});
$('#messages').addEventListener('click',e=>{const b=e.target.closest('[data-prompt]');if(b)send(b.dataset.prompt);});
$('#new-session').addEventListener('click',()=>{if(!busy){sessionStorage.removeItem(sessionKey);location.reload();}});
$('#download-report').addEventListener('click',async()=>{
  try {
    if(!session) return notice('Start a conversation to create a report.');
    if(busy) return notice('Wait for the current reply to finish before exporting.');
    const report = await api(`/conversations/${session}/report`);
    const url = URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));
    const link = document.createElement('a');link.href=url;link.download=`mindbridge-${session.slice(0,8)}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }catch(e){notice(e.message);}
});
async function refreshStatus() {
  const data = await api('/status');
  $('#provider-label').textContent = data.provider === 'demo' ? 'Demo mode · no AI connection' : data.provider + ' · no model';
  $('.demo-pill').textContent = 'MVP · ' + data.provider.toUpperCase();
  $('#alert-count').textContent = data.stats.openAlerts ?? '';
  $('#stats').replaceChildren();
  for(const [key,label] of [['conversations','Conversations'],['messages','Check-in messages'],['openAlerts','Open local alerts']]) {
    const node=document.createElement('div');node.className='stat';if(data.stats[key]===undefined)continue;const n=document.createElement('strong');n.textContent=data.stats[key];const l=document.createElement('span');l.textContent=label;node.append(n,l);$('#stats').append(node);
  }
}
async function loadKnowledge() {
  const docs=await api('/knowledge');$('#knowledge-grid').replaceChildren();
  docs.forEach((doc,index)=>{
    const node=document.createElement('article');node.className='resource';
    const num=document.createElement('span');num.className='resource-number';num.textContent='0'+(index+1);
    const title=document.createElement('h2');title.textContent=doc.title;
    const body=document.createElement('p');body.textContent=doc.content;
    const source=document.createElement('small');source.textContent=doc.source;
    node.append(num,title,body,source);
    if(profile.role==='ADMIN' && doc.id.length===36){
      const edit=document.createElement('button');edit.className='subtle-button';edit.textContent='Edit card';
      edit.addEventListener('click',()=>{const form=$('#knowledge-form');for(const field of ['id','title','source','tags','content'])form.elements[field].value=doc[field];$('#knowledge-form-title').textContent='Edit knowledge card';$('#cancel-card-edit').hidden=false;form.scrollIntoView({behavior:'smooth'});});node.append(edit);
      const remove=document.createElement('button');remove.className='subtle-button';remove.textContent='Delete card';
      remove.addEventListener('click',async()=>{try{await api('/admin/knowledge/'+doc.id,{method:'DELETE'});await loadKnowledge();}catch(e){notice(e.message);}});node.append(remove);
    }
    $('#knowledge-grid').append(node);
  });
}
async function loadAlerts() {
  await refreshStatus();await loadReports();const alerts=await api('/alerts');$('#alerts-list').replaceChildren();
  if(!alerts.length){const empty=document.createElement('div');empty.className='empty-state';empty.textContent='No local alerts to review.';$('#alerts-list').append(empty);return;}
  for(const alert of alerts){
    const row=document.createElement('article');row.className='alert-row';
    const detail=document.createElement('div');const state=document.createElement('small');state.textContent=alert.status==='OPEN'?'NEEDS REVIEW':'ACKNOWLEDGED';
    const title=document.createElement('h3');title.textContent=alert.reason;
    const time=document.createElement('p');time.textContent=`Session ${alert.conversation_id.slice(0,8)} · ${new Date(alert.created_at).toLocaleString()} · Local record only`;
    detail.append(state,title,time);row.append(detail);
    if(alert.status==='OPEN'){const button=document.createElement('button');button.className='subtle-button';button.textContent='Acknowledge';button.addEventListener('click',async()=>{button.disabled=true;try{await api(`/alerts/${alert.id}/acknowledge`,{method:'POST'});await loadAlerts();}catch(e){notice(e.message);button.disabled=false;}});row.append(button);}
    $('#alerts-list').append(row);
  }
}
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',async()=>{
  document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('selected',b===button));
  document.querySelectorAll('.view').forEach(v=>v.hidden=v.id!==button.dataset.view+'-view');
  $('#page-label').textContent={chat:'DAILY CHECK-IN',knowledge:'RESOURCE LIBRARY',alerts:'SUPPORT DESK'}[button.dataset.view];
  try{if(button.dataset.view==='knowledge') await loadKnowledge();if(button.dataset.view==='alerts') await loadAlerts();}catch(e){notice(e.message);}
}));
$('#refresh-alerts').addEventListener('click',()=>loadAlerts().catch(e=>notice(e.message)));

async function loadSessions(){
  if(profile.role!=='STUDENT') return;
  const sessions=await api('/conversations');$('#session-list').replaceChildren();
  for(const item of sessions){
    const b=document.createElement('button');b.textContent=new Date(item.created_at).toLocaleString();
    b.addEventListener('click',async()=>{if(busy)return;try{session=item.id;sessionStorage.setItem(sessionKey,session);await restore();}catch(e){notice(e.message);}});$('#session-list').append(b);
  }
}
async function restore(){
  $('#messages').innerHTML=welcomeMarkup;$('#insight').hidden=true;$('#insight-placeholder').hidden=false;
  if(session){const history=await api(`/conversations/${session}/messages`);history.forEach(m=>bubble(m.role,m.content));}
}
async function loadReports(){
  const reports=await api('/admin/reports');$('#reports-list').replaceChildren();
  if(!reports.length){const empty=document.createElement('p');empty.className='empty-state';empty.textContent='No consultation or safety reports yet. Ordinary chats do not generate reports.';$('#reports-list').append(empty);}
  for(const report of reports){
    const card=document.createElement('article');card.className='report-card';
    const title=document.createElement('h3');title.textContent=`${report.intent} · ${labels[report.risk]} · ${report.username}`;
    const body=document.createElement('p');body.textContent=report.summary;
    const details=document.createElement('small');details.textContent=`${new Date(report.created_at).toLocaleString()} · Response: ${report.response_status} · Rule-based, not a diagnosis`;
    card.append(title,body,details);
    if(report.tool_status){
      const tool=document.createElement('small');tool.textContent=`Job: ${report.tool_status} | Excel: ${report.excel_status} → Notification: ${report.notification_status} | Attempts: ${report.attempts}`;card.append(tool);
      const history=document.createElement('button');history.className='subtle-button';history.textContent='View tool history';
      history.addEventListener('click',async()=>{try{const detail=await api('/admin/reports/'+report.id);let log=card.querySelector('.tool-history');if(!log){log=document.createElement('p');log.className='tool-history';card.append(log);}log.textContent=detail.events.length?detail.events.map(event=>`${new Date(event.created_at).toLocaleString()} · ${event.stage}: ${event.outcome}`).join('\n'):'No tool steps have executed yet.';}catch(e){notice(e.message);}});card.append(history);
      if(report.last_error){const error=document.createElement('p');error.className='error';error.textContent=report.last_error;card.append(error);}
      if(['FAILED','RETRY'].includes(report.tool_status)) {const retry=document.createElement('button');retry.className='subtle-button';retry.textContent='Retry tools';retry.addEventListener('click',async()=>{retry.disabled=true;try{await api('/admin/reports/'+report.id+'/retry',{method:'POST'});await loadReports();}catch(e){notice(e.message);retry.disabled=false;}});card.append(retry);}
    }
    $('#reports-list').append(card);
  }
}
$('#knowledge-form').addEventListener('submit',async e=>{
  e.preventDefault();const button=e.target.querySelector('button');button.disabled=true;
  try{const data=Object.fromEntries(new FormData(e.target));const id=data.id;delete data.id;await api('/admin/knowledge'+(id?'/'+id:''),{method:id?'PUT':'POST',body:JSON.stringify(data)});e.target.reset();$('#knowledge-form-title').textContent='Add a knowledge card';$('#cancel-card-edit').hidden=true;await loadKnowledge();notice('Knowledge card saved.');}catch(error){notice(error.message);}finally{button.disabled=false;}
});
$('#cancel-card-edit').addEventListener('click',()=>{$('#knowledge-form').reset();$('#knowledge-form-title').textContent='Add a knowledge card';$('#cancel-card-edit').hidden=true;});
$('#logout').addEventListener('click',async()=>{
  if(busy) return notice('Please wait for the current reply to finish.');
  try{const response=await window.demoFetch('/logout',{method:'POST',headers:{[csrf.headerName]:csrf.token}});if(!response.ok)throw new Error('Sign-out failed. Please refresh.');location.assign('index.html');}catch(error){notice(error.message);}
});
$('#download-excel').addEventListener('click',async()=>{
  try{const response=await window.demoFetch('/api/admin/excel');if(!response.ok)throw new Error(response.status===404?'The ledger is not ready. A safety report must complete its Excel step first.':'Download failed.');const url=URL.createObjectURL(await response.blob());const a=document.createElement('a');a.href=url;a.download='mindbridge-reports.xlsx';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch(e){notice(e.message);}
});
(async()=>{
  try{
    csrf=await api('/csrf');profile=await api('/profile');
    sessionKey='mindbridge-session-'+profile.username;session=sessionStorage.getItem(sessionKey);
    $('#account-name').textContent=profile.username+' · '+profile.role.toLowerCase();
    $('[data-view="alerts"]').hidden=profile.role!=='ADMIN';
    $('[data-view="chat"]').hidden=profile.role!=='STUDENT';
    $('#session-list').hidden=profile.role!=='STUDENT';
    $('#knowledge-form').hidden=profile.role!=='ADMIN';
    if(profile.role==='ADMIN') $('[data-view="alerts"]').click();
    else {try{await restore();}catch(e){session=null;sessionStorage.removeItem(sessionKey);notice(e.message);}await loadSessions();}
    await refreshStatus();document.body.classList.remove('loading-profile');
  }catch(e){document.body.classList.remove('loading-profile');notice(e.message);}
})();

document.querySelector('#reset-demo').addEventListener('click',()=>{if(busy)return notice('Wait for the current reply to finish.');window.demoReset();location.assign('index.html');});
document.querySelector('#fail-next').addEventListener('click',()=>{window.demoFailNext();document.querySelector('#failure-note').textContent='The next simulated safety ledger step will fail. Generate a safety example, then use Retry tools.';});
