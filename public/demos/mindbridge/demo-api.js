/* Standalone browser simulation. No server, model calls, authentication, or external notifications. */
(() => {
  const KEY = 'mindbridge-public-demo-v1';
  const role = sessionStorage.getItem('mindbridge-demo-role');
  const initial = () => ({sessions:[], messages:[], reports:[], alerts:[], cards:[], failNext:false});
  let state;
  try { state=JSON.parse(sessionStorage.getItem(KEY)) || initial(); } catch { state=initial(); }
  const save=()=>sessionStorage.setItem(KEY,JSON.stringify(state));
  const uid=()=>crypto.randomUUID();
  const now=()=>new Date().toISOString();
  const admin=()=>role==='admin';
  const response=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}});
  const builtins=[
    {id:'stress',title:'One small step at a time',content:'Choose one task that needs your attention and break it into a small next step. You can also reach out to a classmate, teacher, or campus support service.',source:'Illustrative demo reference',tags:'stress anxious anxiety exam exams overwhelmed pressure 焦虑 压力 考试'},
    {id:'connection',title:'You do not have to carry it alone',content:'If you feel lonely or low, consider sharing how things have been with someone you trust. Your campus counseling service can explain the support available to you.',source:'Illustrative demo reference',tags:'lonely sad low hopeless depress 孤独 难过 低落'},
    {id:'sleep',title:'Make room for rest',content:'Notice your recent routine and what is getting in the way of rest. If sleep difficulties keep affecting daily life, consider speaking with a qualified professional.',source:'Illustrative demo reference',tags:'sleep insomnia tired 失眠 睡不着'}
  ];
  function screen(text,session) {
    const t=text.toLowerCase();
    if(/suicid|kill myself|hurt myself|end my life|self.harm|want to die|自杀|自残|不想活|想死/.test(t)||state.alerts.some(a=>a.conversation_id===session && a.status==='OPEN'))return 'HIGH_RISK';
    if(/lonely|sad|depress|hopeless|低落|难过|孤独/.test(t))return 'LOW_MOOD';
    if(/stress|anxi|panic|worr|sleep|overwhelm|焦虑|压力|失眠/.test(t))return 'ANXIETY';
    return 'NORMAL';
  }
  function references(text){
    const t=text.toLowerCase();
    return [...builtins,...state.cards].filter(c=>c.tags.toLowerCase().split(/\s+/).some(term=>term.length>2&&t.includes(term))).slice(0,2);
  }
  function runTools(report){
    report.attempts++;report.events ||= [];
    if(state.failNext){state.failNext=false;report.tool_status='FAILED';report.last_error='Simulated ledger failure. Notification was not recorded. Select Retry tools.';report.events.push({stage:'EXCEL (simulated)',outcome:'FAILED',created_at:now()});save();return;}
    report.excel_status='SIMULATED_SUCCESS';report.events.push({stage:'EXCEL (simulated)',outcome:'SUCCEEDED',created_at:now()});
    report.notification_status='SIMULATED_RECORD';report.events.push({stage:'NOTIFICATION (simulated)',outcome:'RECORDED',created_at:now()});
    report.tool_status='COMPLETE';report.last_error='';save();
  }
  for(const report of state.reports.filter(r=>r.response_status==='PENDING')) { report.response_status='INCOMPLETE';if(report.intent==='RISK')runTools(report); }
  save();
  const owned=id=>state.sessions.some(s=>s.id===id&&s.owner===role);
  window.demoFailNext=()=>{state.failNext=true;save();};
  window.demoReset=()=>{sessionStorage.removeItem(KEY);for(const user of ['student','student2','admin'])sessionStorage.removeItem('mindbridge-session-'+user);};
  window.demoFetch=async function(path,options={}) {
    const method=options.method||'GET';
    const body=typeof options.body==='string'?JSON.parse(options.body):{};
    if(path==='/api/csrf')return response({headerName:'X-DEMO-TOKEN',token:'browser-simulation'});
    if(path==='/logout')return new Response(null,{status:204});
    if(!['student','student2','admin'].includes(role))return response({error:'Choose a demo role'},401);
    if(path==='/api/profile')return response({username:role,role:admin()?'ADMIN':'STUDENT'});
    if(path==='/api/status')return response({provider:'browser simulation',stats:{conversations:state.sessions.filter(s=>admin()||s.owner===role).length,messages:state.messages.filter(m=>m.role==='user'&&(admin()||owned(m.session))).length,...(admin()?{openAlerts:state.alerts.filter(a=>a.status==='OPEN').length}:{})}});
    if((path.startsWith('/api/admin/')||path.startsWith('/api/alerts'))&&!admin())return response({error:'Switch to admin to explore this view'},403);
    if(path==='/api/knowledge')return response([...builtins,...state.cards]);
    if(path==='/api/alerts')return response([...state.alerts].reverse());
    let match=path.match(/^\/api\/alerts\/([^/]+)\/acknowledge$/);
    if(match&&method==='POST'){const a=state.alerts.find(a=>a.id===match[1]);if(!a)return response({},404);a.status='ACKNOWLEDGED';save();return response({status:a.status});}
    if(path==='/api/admin/reports')return response([...state.reports].reverse());
    match=path.match(/^\/api\/admin\/reports\/([^/]+)(\/retry)?$/);
    if(match){const report=state.reports.find(r=>r.id===match[1]);if(!report)return response({},404);if(match[2]&&method==='POST'){if(report.tool_status!=='FAILED')return response({},409);runTools(report);return response({status:report.tool_status});}return response({report,events:report.events||[]});}
    if(path==='/api/admin/excel'){
      const reports=state.reports.filter(r=>r.excel_status==='SIMULATED_SUCCESS');
      if(!reports.length)return response({},404);
      return new Response(window.demoWorkbook(reports),{headers:{'Content-Type':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}});
    }
    match=path.match(/^\/api\/admin\/knowledge(?:\/([^/]+))?$/);
    if(match){
      if(method==='POST'||method==='PUT'){
        if(!body.title?.trim()||!body.content?.trim()||!body.source?.trim()||body.title.length>160||body.content.length>12000)return response({},400);
        if(method==='PUT'){const c=state.cards.find(c=>c.id===match[1]);if(!c)return response({},404);Object.assign(c,body);}else state.cards.push({...body,id:uid()});save();return response({saved:true});
      }
      if(method==='DELETE'){state.cards=state.cards.filter(c=>c.id!==match[1]);save();return response({deleted:true});}
    }
    if(path==='/api/conversations'){
      if(admin())return response({},403);
      if(method==='POST'){const s={id:uid(),owner:role,created_at:now()};state.sessions.push(s);save();return response({id:s.id});}
      return response(state.sessions.filter(s=>s.owner===role).slice().reverse());
    }
    match=path.match(/^\/api\/conversations\/([^/]+)\/(messages|report)$/);
    if(match){
      const id=match[1];if(!owned(id)||admin())return response({},404);
      const history=()=>state.messages.filter(m=>m.session===id).map(({role,content,created_at})=>({role,content,created_at}));
      if(method==='GET')return response(match[2]==='report'?{conversationId:id,mode:'BROWSER SIMULATION',messages:history()}:history());
      if(method!=='POST'||match[2]!=='messages'||!body.message?.trim()||body.message.length>4000)return response({},400);
      const text=body.message;const risk=screen(text,id);
      const intent=risk==='HIGH_RISK'?'RISK':risk!=='NORMAL'||/help me|advice|coping|counsel|咨询|建议/i.test(text)?'CONSULT':'CHAT';
      const sources=intent==='CHAT'?[]:references(text);
      state.messages.push({session:id,role:'user',content:text,created_at:now()});
      let report;
      if(intent!=='CHAT'){
        report={id:uid(),conversation_id:id,username:role,intent,risk,summary:'SIMULATED rule screening. Example input: '+text,created_at:now(),response_status:'PENDING',events:[]};state.reports.push(report);
        if(intent==='RISK'){Object.assign(report,{tool_status:'WAITING_RESPONSE',excel_status:'PENDING',notification_status:'PENDING',attempts:0,last_error:''});state.alerts.push({id:uid(),conversation_id:id,reason:'Simulated safety flag — no real notification',status:'OPEN',created_at:now()});}
      }
      save();
      let reply=intent==='CHAT'?'I am here to help you reflect on how today has felt. What has been on your mind?':risk==='LOW_MOOD'?'That sounds difficult. Thank you for sharing. You do not need to work everything out at once.':'It sounds like a lot has been weighing on you. We can slow down and look at one thing that feels most pressing.';
      if(sources.length)reply+='\n\n'+sources[0].content;
      if(intent==='RISK')reply='Thank you for telling me. Your safety matters. Are you hurt now, or at risk of hurting yourself soon? If there is immediate danger, contact local emergency services and ask someone you trust to stay with you. This browser demo only simulates an alert; it has not contacted anyone.';
      const encoder=new TextEncoder();let timer;let offset=0;let canceled=false;
      const event=(type,data)=>encoder.encode(`event:${type}\ndata:${JSON.stringify(data)}\n\n`);
      return new Response(new ReadableStream({
        start(controller){
          controller.enqueue(event('meta',{intent,sources,provider:'browser simulation'}));
          const tick=()=>{
            if(canceled)return;
            if(offset<reply.length){controller.enqueue(event('token',{text:reply.slice(offset,offset+9)}));offset+=9;timer=setTimeout(tick,18);}
            else {
              state.messages.push({session:id,role:'assistant',content:reply,created_at:now()});
              if(report){report.response_status='COMPLETE';if(intent==='RISK')runTools(report);}save();
              controller.enqueue(event('done',{persisted:true}));controller.close();
            }
          };timer=setTimeout(tick,18);
        },
        cancel(){canceled=true;clearTimeout(timer);if(report){report.response_status='INCOMPLETE';if(intent==='RISK')runTools(report);save();}}
      }),{headers:{'Content-Type':'text/event-stream'}});
    }
    return response({error:'Unsupported demo operation'},404);
  };
})();
