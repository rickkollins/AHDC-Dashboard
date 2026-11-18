
(function(){
  'use strict';

  /* ============================= CONSTANTS ============================= */
  var PAGE_TITLE = 'AHDC Engagements';
  var FONT_LINK = 'https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap';

  var ENG_STATUS = {
    'on-track':   {label:'On Track',    icon:'check'},
    'at-risk':    {label:'At Risk',     icon:'alert'},
    'delayed':    {label:'Delayed',     icon:'xcirc'},
    'complete':   {label:'Complete',    icon:'check'},
    'not-started':{label:'Not Started', icon:'circ'}
  };
  var STATUS_ORDER = ['on-track','at-risk','delayed','complete','not-started'];
  var ENG_TYPES = ['Implementation','Advisory','Audit & Compliance','Support & Maintenance','Strategy','Custom'];
  var WRAP_UP_WINDOW_DAYS = 14;
  var OWNER_PALETTE = ['#6C63C9','#2E9E97','#C77A2E','#B8548A','#3E7FCF','#3F9E63','#B65A34','#7568B8','#4F9CB0','#A8622F'];

  var ACTION_TYPES = {
    meeting: {label:'Meeting',        icon:'users'},
    call:    {label:'Call',           icon:'phone'},
    email:   {label:'Email follow-up',icon:'mail'},
    trip:    {label:'Trip',           icon:'trip'}
  };
  var ACTION_TYPE_ORDER = ['meeting','call','email','trip'];

  var ICONS = {
    chev:'<path d="M6 9l6 6 6-6"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    x:'<path d="M6 6l12 12M18 6L6 18"/>',
    check:'<path d="M5 13l4 4L19 7"/>',
    alert:'<path d="M12 3.5l9.5 16.5H2.5L12 3.5z"/><path d="M12 10v4.2M12 17.2h.01"/>',
    xcirc:'<circle cx="12" cy="12" r="9"/><path d="M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6"/>',
    circ:'<circle cx="12" cy="12" r="8.5"/>',
    dl:'<path d="M12 3v12.5M7 11l5 5 5-5"/><path d="M4.5 20.5h15"/>',
    search:'<circle cx="11" cy="11" r="7.2"/><path d="M21 21l-4.4-4.4"/>',
    trash:'<path d="M4.5 7h15M9.5 7V4.3h5V7"/><path d="M6.3 7l1 13.2h9.4l1-13.2"/>',
    users:'<circle cx="9" cy="8" r="3"/><path d="M2.3 20c0-3.6 3-6 6.7-6s6.7 2.4 6.7 6"/><circle cx="17.3" cy="9" r="2.2"/><path d="M15.6 14.2c2.7.4 4.7 2.4 4.7 5.8"/>',
    mail:'<rect x="3" y="5.5" width="18" height="13" rx="2.2"/><path d="M4 7l8 6.2L20 7"/>',
    phone:'<path d="M6.6 3.5l3 .3 1.3 3.7-2 1.8a13.4 13.4 0 0 0 5.8 5.8l1.8-2 3.7 1.3.3 3a2 2 0 0 1-2.1 2.1C10.6 19 5 13.4 4.6 5.6a2 2 0 0 1 2-2.1z"/>',
    building:'<rect x="4" y="3.5" width="16" height="17" rx="1.4"/><path d="M8 8h1.4M8 12h1.4M8 16h1.4M14.6 8H16M14.6 12H16M14.6 16H16"/>',
    calendar:'<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M8 3v4M16 3v4M3.5 9.5h17"/>',
    close:'<path d="M6 6l12 12M18 6L6 18"/>',
    edit:'<path d="M4.5 19.5l.8-3.5L15.8 5.5a1.4 1.4 0 0 1 2 0l.9.9a1.4 1.4 0 0 1 0 2L8.1 18.9l-3.6.6z"/><path d="M13.9 7.4l2.9 2.9"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7.2v5l3.4 2"/>',
    flag:'<path d="M5.5 21V3.5"/><path d="M5.5 4.5l14 5-14 5"/>',
    trip:'<path d="M21.5 3.5L11 13.2"/><path d="M21.5 3.5l-6.4 18-3.4-8-8-3.4 17.8-6.6z"/>',
    sun:'<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.6M12 18.9v2.6M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12h2.6M18.9 12h2.6M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8"/>',
    folder:'<path d="M3.5 7.3c0-1 .8-1.8 1.8-1.8h3.8l1.9 2.1h7.7c1 0 1.8.8 1.8 1.8v7.9c0 1-.8 1.8-1.8 1.8H5.3c-1 0-1.8-.8-1.8-1.8z"/>',
    external:'<path d="M9.5 6H6.8A2.3 2.3 0 0 0 4.5 8.3v9A2.3 2.3 0 0 0 6.8 19.6h9a2.3 2.3 0 0 0 2.3-2.3v-2.7"/><path d="M14 4h6v6"/><path d="M20 4l-9.5 9.5"/>',
    note:'<path d="M7 3.5h7l4 4V19a1.3 1.3 0 0 1-1.3 1.3H7A1.3 1.3 0 0 1 5.7 19V4.8A1.3 1.3 0 0 1 7 3.5z"/><path d="M14 3.5V7.3a.7.7 0 0 0 .7.7H18"/><path d="M8.3 12h7.4M8.3 15.3h7.4"/>',
    upload:'<path d="M12 15.5V4.5"/><path d="M7.5 9L12 4.5 16.5 9"/><path d="M4.5 15.5v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3"/>',
    inbox:'<path d="M4 12.5l2.7-7.6A1.6 1.6 0 0 1 8.2 3.8h7.6a1.6 1.6 0 0 1 1.5 1.1l2.7 7.6"/><path d="M4 12.5h4.8l1 2.3h4.4l1-2.3H20V18a1.7 1.7 0 0 1-1.7 1.7H5.7A1.7 1.7 0 0 1 4 18z"/>',
    copy:'<rect x="8.5" y="8.5" width="11" height="11" rx="1.8"/><path d="M4.5 15.5V6.3A1.8 1.8 0 0 1 6.3 4.5H15.5"/>',
    moon:'<path d="M20.5 14.4A8.5 8.5 0 1 1 9.6 3.5a7 7 0 0 0 10.9 10.9z"/>',
    monitor:'<rect x="3" y="4.5" width="18" height="12.5" rx="2"/><path d="M8 20h8M12 17v3"/>',
    tag:'<path d="M12.5 3.5h6a2 2 0 0 1 2 2v6a2 2 0 0 1-.6 1.4l-8 8a2 2 0 0 1-2.8 0l-6-6a2 2 0 0 1 0-2.8l8-8a2 2 0 0 1 1.4-.6z"/><circle cx="16.5" cy="7.5" r="1.3"/>'
  };
  function icon(name, cls, size){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="' + (cls||'') + '"' + (size?' style="width:'+size+'px;height:'+size+'px"':'') + '>' + (ICONS[name]||'') + '</svg>';
  }

  /* ============================= THEME (light/dark/system) ============================= */
  var THEME_KEY = 'ahdc-theme';
  function loadTheme(){
    try{
      var t = localStorage.getItem(THEME_KEY);
      if(t==='light'||t==='dark'||t==='system') return t;
    }catch(e){}
    return 'system';
  }
  function applyTheme(t){
    var root = document.documentElement;
    if(t==='light'||t==='dark'){ root.setAttribute('data-theme', t); }
    else{ root.removeAttribute('data-theme'); }
  }
  var uiTheme = loadTheme();
  applyTheme(uiTheme);
  function setTheme(t){
    uiTheme = (t==='light'||t==='dark') ? t : 'system';
    applyTheme(uiTheme);
    try{ localStorage.setItem(THEME_KEY, uiTheme); }catch(e){}
  }

  var TODAY = new Date(); TODAY.setHours(0,0,0,0);

  /* ============================= DATE HELPERS ============================= */
  function parseDate(s){ if(!s) return null; var p=s.split('-'); return new Date(parseInt(p[0],10), parseInt(p[1],10)-1, parseInt(p[2],10)); }
  function toISO(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
  function addDays(d,n){ var r=new Date(d); r.setDate(r.getDate()+n); return r; }
  function addMonths(d,n){ var r=new Date(d); r.setMonth(r.getMonth()+n); return r; }
  function startOfMonth(d){ return new Date(d.getFullYear(), d.getMonth(), 1); }
  function fmtDate(d){ if(!d) return '—'; return d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}); }
  function fmtDateShort(d){ if(!d) return '—'; return d.toLocaleDateString('en-US',{month:'short',day:'numeric'}); }
  function fmtBytes(n){
    if(n==null) return '';
    if(n<1024) return n+' B';
    if(n<1024*1024) return (n/1024).toFixed(1)+' KB';
    return (n/1024/1024).toFixed(1)+' MB';
  }
  function portalUrlFor(eng){ return window.location.origin + '/portal/' + eng.portalToken; }
  function fmtMMDDYYYY(d){ return String(d.getMonth()+1).padStart(2,'0')+'/'+String(d.getDate()).padStart(2,'0')+'/'+d.getFullYear(); }
  function daysBetween(a,b){ return Math.round((b-a)/86400000); }

  function esc(s){
    return String(s==null?'':s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function initials(name){
    var parts = String(name||'').trim().split(/\s+/).filter(Boolean);
    if(!parts.length) return '?';
    if(parts.length===1) return parts[0].slice(0,2).toUpperCase();
    return (parts[0][0]+parts[parts.length-1][0]).toUpperCase();
  }
  function uid(prefix){ return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

  /* ============================= STATE ============================= */
  var data = { clients:[], engagements:[], actionItems:[] };

  var ui = {
    view:'timeline',
    zoom:'6m',
    search:'',
    statusFilter:{},
    ownerFilter:'',
    expanded:{},
    drawerEngId:null,
    modal:null,
    confirmDeleteEng:null,
    confirmDeleteClient:null,
    confirmDeleteAction:null,
    readOnly:false,
    dataLoaded:false,
    loadError:false,
    roundupCollapsed:false,
    kpiPopover:null,
    notesPopup:null
  };

  /* ============================= DERIVED HELPERS ============================= */
  function engagementsForClient(cid){ return data.engagements.filter(function(e){ return e.clientId===cid; }); }
  function clientById(cid){ for(var i=0;i<data.clients.length;i++){ if(data.clients[i].id===cid) return data.clients[i]; } return null; }
  function primaryContact(client){
    if(!client || !client.contacts || !client.contacts.length) return null;
    var p = client.contacts.filter(function(c){return c.primary;})[0];
    return p || client.contacts[0];
  }
  function msStatus(ms){
    if(ms.done) return 'done';
    var d = parseDate(ms.date);
    return (d && d < TODAY) ? 'overdue' : 'upcoming';
  }
  function allOwners(){
    var set = {};
    data.engagements.forEach(function(e){ if(e.owner) set[e.owner]=true; });
    return Object.keys(set).sort();
  }
  function ownerColor(name){
    var s = String(name||'—'), h = 0;
    for(var i=0;i<s.length;i++){ h = (h*31 + s.charCodeAt(i)) >>> 0; }
    return OWNER_PALETTE[h % OWNER_PALETTE.length];
  }
  function missedMilestonesCount(eng){
    var n = 0;
    (eng.milestones||[]).forEach(function(m){ if(msStatus(m)==='overdue') n++; });
    return n;
  }
  function isOverdueEnd(eng){
    if(eng.status==='complete') return false;
    var end = parseDate(eng.end);
    return !!end && end < TODAY;
  }
  function isWrappingUp(eng){
    if(eng.status==='complete') return false;
    var end = parseDate(eng.end);
    if(!end) return false;
    var diff = daysBetween(TODAY, end);
    return diff>=0 && diff<=WRAP_UP_WINDOW_DAYS;
  }
  /** Single highest-priority alert badge for an engagement, or null. */
  function engagementAlert(eng){
    var missed = missedMilestonesCount(eng);
    if(missed>0) return {kind:'missed', label: missed+' missed milestone'+(missed===1?'':'s'), icon:'alert', colorVar:'--crit'};
    if(isOverdueEnd(eng)) return {kind:'overdue', label:'Past target end date', icon:'clock', colorVar:'--crit'};
    if(isWrappingUp(eng)){
      var d = daysBetween(TODAY, parseDate(eng.end));
      return {kind:'wrapup', label: d===0?'Wraps up today':'Wraps up in '+d+' day'+(d===1?'':'s'), icon:'clock', colorVar:'--warn'};
    }
    return null;
  }
  /** Display priority tier: 0 = at risk / delayed (needs attention), 1 = everything else in progress, 2 = complete. */
  function riskRank(status){
    if(status==='at-risk' || status==='delayed') return 0;
    if(status==='complete') return 2;
    return 1;
  }
  function engEndTime(eng){
    var d = parseDate(eng.end);
    return d ? d.getTime() : Infinity;
  }
  /** At-risk/delayed engagements first, then everything else soonest-completion-first, complete last. */
  function sortEngagementsForDisplay(list){
    return list.slice().sort(function(a,b){
      var ra = riskRank(a.status), rb = riskRank(b.status);
      if(ra!==rb) return ra-rb;
      return engEndTime(a)-engEndTime(b);
    });
  }
  /** [tier, endTime] of a group's most urgent engagement — used to order client groups the same way. */
  function groupUrgencyKey(engs){
    var best = null;
    engs.forEach(function(e){
      var tier = riskRank(e.status), end = engEndTime(e);
      if(best===null || tier<best[0] || (tier===best[0] && end<best[1])) best = [tier, end];
    });
    return best || [3, Infinity];
  }

  /** Gathers everything actionable "today": manual action items, milestones due, and engagements
   *  needing attention — bucketed into overdue / due today / needs attention, each date-sorted.
   *  Anything already surfaced via a milestone or overdue end date is not duplicated into "attention". */
  function computeRoundup(){
    var overdue = [], today = [], attention = [], docs = [];
    var engFlagged = {};

    data.engagements.forEach(function(eng){
      if(!eng.newDocsAt) return;
      var client = clientById(eng.clientId);
      docs.push({kind:'docs', engId:eng.id, title:eng.title, engTitle:eng.title, client:client, date:new Date(eng.newDocsAt)});
    });

    data.actionItems.forEach(function(a){
      if(a.done) return;
      var d = parseDate(a.date);
      if(!d) return;
      var entry = {kind:'action', sub:a.type, id:a.id, title:a.title, client: a.clientId?clientById(a.clientId):null, date:d, notes:a.notes||''};
      if(d.getTime() < TODAY.getTime()) overdue.push(entry);
      else if(d.getTime()===TODAY.getTime()) today.push(entry);
    });

    data.engagements.forEach(function(eng){
      var client = clientById(eng.clientId);
      (eng.milestones||[]).forEach(function(m){
        if(m.done) return;
        var d = parseDate(m.date);
        if(!d) return;
        var entry = {kind:'milestone', sub:'milestone', engId:eng.id, msId:m.id, title:m.name, engTitle:eng.title, client:client, date:d};
        if(d.getTime() < TODAY.getTime()){ overdue.push(entry); engFlagged[eng.id]=true; }
        else if(d.getTime()===TODAY.getTime()){ today.push(entry); engFlagged[eng.id]=true; }
      });
      if(isOverdueEnd(eng)){
        overdue.push({kind:'engagement', sub:'overdue-end', engId:eng.id, title:eng.title, client:client, date:parseDate(eng.end)});
        engFlagged[eng.id]=true;
      }
    });

    data.engagements.forEach(function(eng){
      if(eng.status==='complete' || engFlagged[eng.id]) return;
      var client = clientById(eng.clientId);
      if(eng.status==='at-risk' || eng.status==='delayed'){
        attention.push({kind:'engagement', sub:eng.status, engId:eng.id, title:eng.title, client:client, date:parseDate(eng.end)});
      } else if(isWrappingUp(eng)){
        attention.push({kind:'engagement', sub:'wrapup', engId:eng.id, title:eng.title, client:client, date:parseDate(eng.end)});
      }
    });

    function byDate(a,b){ return (a.date?a.date.getTime():0) - (b.date?b.date.getTime():0); }
    overdue.sort(byDate); today.sort(byDate); attention.sort(byDate); docs.sort(byDate);
    return {overdue:overdue, today:today, attention:attention, docs:docs, total:overdue.length+today.length+attention.length+docs.length};
  }

  function engRef(e){
    var client = clientById(e.clientId);
    return {id:e.id, title:e.title, clientName: client?client.name:''};
  }

  function computeKPIs(){
    var active = data.engagements.filter(function(e){ return e.status!=='complete'; });
    var onTrackList = active.filter(function(e){ return e.status==='on-track'; });
    var attentionList = active.filter(function(e){ return e.status==='at-risk'||e.status==='delayed'; });
    var msIn30 = 0, wrappingUpList = [], missedList = [];
    data.engagements.forEach(function(e){
      (e.milestones||[]).forEach(function(m){
        var st = msStatus(m);
        if(st==='overdue') missedList.push({engId:e.id, engTitle:e.title, clientName:(clientById(e.clientId)||{}).name||'', msName:m.name, date:m.date});
        if(!m.done){
          var d = parseDate(m.date);
          if(d){ var diff = daysBetween(TODAY,d); if(diff>=0 && diff<=30) msIn30++; }
        }
      });
      if(isWrappingUp(e)) wrappingUpList.push(e);
    });
    missedList.sort(function(a,b){ return a.date<b.date?-1:1; });
    return {
      activeCount: active.length,
      activeList: active.map(engRef),
      onTrackPct: active.length ? Math.round(onTrackList.length/active.length*100) : 0,
      onTrackList: onTrackList.map(engRef),
      attentionCount: attentionList.length,
      attentionList: attentionList.map(engRef),
      msIn30: msIn30,
      missedTotal: missedList.length,
      missedList: missedList,
      wrappingUpTotal: wrappingUpList.length,
      wrappingUpList: wrappingUpList.map(engRef),
      clientCount: data.clients.length,
      clientsList: data.clients.map(function(c){ return {id:c.id, name:c.name}; })
    };
  }

  function matchesFilters(eng){
    var client = clientById(eng.clientId);
    if(ui.search){
      var q = ui.search.toLowerCase();
      var hay = (eng.title+' '+(client?client.name:'')+' '+eng.owner+' '+eng.type+' '+customFieldsText(eng)).toLowerCase();
      if(hay.indexOf(q)===-1) return false;
    }
    var activeStatuses = Object.keys(ui.statusFilter).filter(function(k){return ui.statusFilter[k];});
    if(activeStatuses.length && activeStatuses.indexOf(eng.status)===-1) return false;
    if(ui.ownerFilter && eng.owner!==ui.ownerFilter) return false;
    return true;
  }

  function getRange(){
    if(ui.zoom==='all'){
      if(!data.engagements.length) return {start:addMonths(TODAY,-1), end:addMonths(TODAY,4)};
      var min=null,max=null;
      data.engagements.forEach(function(e){
        var s=parseDate(e.start), en=parseDate(e.end);
        if(s && (!min || s<min)) min=s;
        if(en && (!max || en>max)) max=en;
      });
      if(!min||!max) return {start:addMonths(TODAY,-1), end:addMonths(TODAY,4)};
      return {start:addDays(min,-10), end:addDays(max,10)};
    }
    var months = ui.zoom==='3m'?3:(ui.zoom==='12m'?12:6);
    var before = Math.max(1,Math.round(months*0.2));
    var start = addMonths(startOfMonth(TODAY), -before);
    var end = addMonths(start, months);
    return {start:start, end:end};
  }
  function pct(date, range){
    var total = range.end - range.start;
    if(total<=0) return 0;
    var p = (date - range.start) / total * 100;
    return Math.max(-2, Math.min(102, p));
  }

  /* ============================= PERSISTENCE ============================= */
  function showToast(msg){
    var root = document.getElementById('toast-root');
    root.innerHTML = '<div class="toast">'+esc(msg)+'</div>';
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(function(){ root.innerHTML=''; }, 3600);
  }

  var saveChain = Promise.resolve();
  function persist(){
    renderApp();
    renderDrawer();
    renderNotesPopup();
    var payload = JSON.stringify({clients:data.clients, engagements:data.engagements, actionItems:data.actionItems});
    // Queue saves so overlapping edits can't race each other out of order.
    saveChain = saveChain.then(function(){
      return fetch('/api/data', {
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body: payload
      }).then(function(res){
        if(res.status===401){ window.location.href = '/login'; return; }
        if(!res.ok){ showToast('Could not save that change. Please try again.'); return; }
        return res.json().then(function(){ /* saved */ });
      }).catch(function(){
        showToast('Could not reach the server to save. Check your connection.');
      });
    });
  }

  function initApp(){
    fetch('/api/data').then(function(res){
      if(res.status===401){ window.location.href = '/login'; return null; }
      if(!res.ok) throw new Error('load_failed');
      return res.json();
    }).then(function(loaded){
      if(!loaded) return;
      data.clients = Array.isArray(loaded.clients) ? loaded.clients : [];
      data.engagements = Array.isArray(loaded.engagements) ? loaded.engagements : [];
      data.actionItems = Array.isArray(loaded.actionItems) ? loaded.actionItems : [];
      data.clients.forEach(function(c){ ui.expanded[c.id] = true; });
      ui.dataLoaded = true;
      renderApp();
    }).catch(function(){
      ui.dataLoaded = true;
      ui.loadError = true;
      renderApp();
    });
  }

  function logout(){
    fetch('/api/logout', {method:'POST'}).then(function(){ window.location.href = '/login'; });
  }

  /* ============================= FOCUS-PRESERVING RENDER ============================= */
  function preserveFocus(fn){
    var active = document.activeElement;
    var id = active && active.id;
    var selStart=null, selEnd=null;
    if(active && typeof active.selectionStart==='number'){ selStart=active.selectionStart; selEnd=active.selectionEnd; }
    fn();
    if(id){
      var el = document.getElementById(id);
      if(el){
        el.focus();
        if(selStart!=null && el.setSelectionRange){ try{ el.setSelectionRange(selStart, selEnd); }catch(e){} }
      }
    }
  }

  /* ============================= CRUD ============================= */
  function addClient(obj){
    data.clients.push(obj);
    ui.expanded[obj.id] = true;
    persist();
  }
  function addEngagement(obj){
    data.engagements.push(obj);
    persist();
  }
  function deleteClient(cid){
    data.clients = data.clients.filter(function(c){ return c.id!==cid; });
    data.engagements = data.engagements.filter(function(e){ return e.clientId!==cid; });
    persist();
  }
  function deleteEngagement(eid){
    data.engagements = data.engagements.filter(function(e){ return e.id!==eid; });
    persist();
  }
  function toggleMilestone(eid, mid){
    var eng = data.engagements.filter(function(e){return e.id===eid;})[0];
    if(!eng) return;
    var ms = eng.milestones.filter(function(m){return m.id===mid;})[0];
    if(!ms) return;
    ms.done = !ms.done;
    persist();
  }
  function deleteMilestone(eid, mid){
    var eng = data.engagements.filter(function(e){return e.id===eid;})[0];
    if(!eng) return;
    eng.milestones = eng.milestones.filter(function(m){return m.id!==mid;});
    persist();
  }
  function addMilestoneToEngagement(eid, name, dateStr){
    var eng = data.engagements.filter(function(e){return e.id===eid;})[0];
    if(!eng) return;
    eng.milestones.push({id:uid('m'), name:name, date:dateStr, done:false});
    eng.milestones.sort(function(a,b){ return a.date<b.date?-1:1; });
    persist();
  }
  function setEngagementStatus(eid, status){
    var eng = data.engagements.filter(function(e){return e.id===eid;})[0];
    if(!eng) return;
    eng.status = status;
    persist();
  }
  function setEngagementNotes(eid, text){
    var eng = data.engagements.filter(function(e){return e.id===eid;})[0];
    if(!eng) return;
    eng.notes = (text||'').trim();
    persist();
  }
  function setEngagementProgress(eid, val){
    var eng = data.engagements.filter(function(e){return e.id===eid;})[0];
    if(!eng) return;
    eng.progress = val;
    persist();
  }
  function setEngagementNewDocs(eid, flagged){
    var eng = data.engagements.filter(function(e){return e.id===eid;})[0];
    if(!eng) return;
    eng.newDocsAt = flagged ? new Date().toISOString() : null;
    persist();
    showToast(flagged ? 'Flagged — new files received.' : 'Marked reviewed.');
  }
  function copyPortalLink(eid){
    var eng = data.engagements.filter(function(e){return e.id===eid;})[0];
    if(!eng) return;
    var url = portalUrlFor(eng);
    var done = function(){ showToast('Portal link copied.'); };
    var fail = function(){ showToast('Could not copy — select and copy the link manually.'); };
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(url).then(done).catch(fail);
    } else {
      try{
        var ta = document.createElement('textarea');
        ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        done();
      }catch(e){ fail(); }
    }
  }
  function regeneratePortalLink(eid){
    if(!window.confirm('This invalidates the current upload link — anyone still using the old link will no longer be able to send files. Continue?')) return;
    fetch('/api/engagements/'+eid+'/regenerate-portal-token', {method:'POST'}).then(function(res){
      if(res.status===401){ window.location.href = '/login'; return null; }
      if(!res.ok) throw new Error('failed');
      return res.json();
    }).then(function(body){
      if(!body) return;
      var eng = data.engagements.filter(function(e){return e.id===eid;})[0];
      if(eng) eng.portalToken = body.portalToken;
      renderApp(); renderDrawer();
      showToast('Upload link reset.');
    }).catch(function(){
      showToast('Could not reset the link. Please try again.');
    });
  }
  function toggleFileReviewed(eid, fileId, reviewed){
    var eng = data.engagements.filter(function(e){return e.id===eid;})[0];
    var file = eng && (eng.portalFiles||[]).filter(function(f){return f.id===fileId;})[0];
    if(!file) return;
    var prev = !!file.reviewed;
    file.reviewed = reviewed;
    renderApp();
    renderDrawer();
    fetch('/api/engagements/'+eid+'/files/'+fileId+'/reviewed', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({reviewed: reviewed})
    }).then(function(res){
      if(res.status===401){ window.location.href = '/login'; return null; }
      if(!res.ok) throw new Error('failed');
      return res.json();
    }).catch(function(){
      file.reviewed = prev;
      renderApp();
      renderDrawer();
      showToast('Could not update — please try again.');
    });
  }
  function addActionItem(obj){
    data.actionItems.push(obj);
    persist();
  }
  function toggleActionItemDone(aid){
    var a = data.actionItems.filter(function(x){return x.id===aid;})[0];
    if(!a) return;
    a.done = !a.done;
    persist();
  }
  function deleteActionItem(aid){
    data.actionItems = data.actionItems.filter(function(x){return x.id!==aid;});
    persist();
  }

  /* ============================= EXPORTS ============================= */
  function csvField(v){
    var s = (v==null?'':String(v));
    if(/[",\n]/.test(s)) return '"'+s.replace(/"/g,'""')+'"';
    return s;
  }
  function toCSV(rows){ return rows.map(function(r){ return r.map(csvField).join(','); }).join('\r\n'); }

  function downloadCSV(filename, csvString){
    try{
      var blob = new Blob([csvString], {type:'text/csv;charset=utf-8;'});
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      window.setTimeout(function(){ URL.revokeObjectURL(url); }, 2000);
      showToast('Download ready — check your downloads.');
    }catch(e){
      showToast('Could not prepare that download.');
    }
  }

  function exportOutlookCSV(engagementFilter){
    var rows = [['Subject','Start Date','Start Time','End Date','End Time','All Day Event','Description','Location']];
    data.engagements.forEach(function(eng){
      if(engagementFilter && eng.id!==engagementFilter) return;
      var client = clientById(eng.clientId);
      (eng.milestones||[]).forEach(function(m){
        var d = parseDate(m.date);
        if(!d) return;
        rows.push([
          (client?client.name+' — ':'') + eng.title + ': ' + m.name,
          fmtMMDDYYYY(d), '', fmtMMDDYYYY(d), '', 'True',
          'AHDC engagement milestone. Owner: ' + (eng.owner||'—') + '. Status: ' + (ENG_STATUS[eng.status]?ENG_STATUS[eng.status].label:eng.status) + '.',
          client ? client.name : ''
        ]);
      });
    });
    if(rows.length===1){ showToast('No milestones to export yet.'); return; }
    downloadCSV('ahdc-milestones-outlook.csv', toCSV(rows));
  }

  function exportRosterCSV(){
    var rows = [['Client','Industry','Client Status','Secure Files Link','Primary Contact','Contact Title','Contact Email','Contact Phone','Engagement','Type','Owner','Start Date','End Date','Status','Progress %','Milestones Remaining','Upload Portal Link','New Documents Since']];
    data.clients.forEach(function(client){
      var pc = primaryContact(client);
      var engs = engagementsForClient(client.id);
      if(!engs.length){
        rows.push([client.name, client.industry||'', client.status||'', client.filesUrl||'', pc?pc.name:'', pc?pc.title:'', pc?pc.email:'', pc?pc.phone:'', '', '', '', '', '', '', '', '', '', '']);
      }
      engs.forEach(function(eng){
        var remaining = (eng.milestones||[]).filter(function(m){return !m.done;}).length;
        rows.push([
          client.name, client.industry||'', client.status||'', client.filesUrl||'',
          pc?pc.name:'', pc?pc.title:'', pc?pc.email:'', pc?pc.phone:'',
          eng.title, eng.type||'', eng.owner||'',
          eng.start||'', eng.end||'',
          ENG_STATUS[eng.status]?ENG_STATUS[eng.status].label:eng.status,
          eng.progress!=null?eng.progress:'', remaining,
          portalUrlFor(eng), eng.newDocsAt?fmtMMDDYYYY(new Date(eng.newDocsAt)):''
        ]);
      });
    });
    if(rows.length===1){ showToast('Add a client to export data.'); return; }
    downloadCSV('ahdc-engagements-excel.csv', toCSV(rows));
  }

  /* ============================= TEMPLATES: HEADER / KPI / TOOLBAR ============================= */
  function tplHeader(){
    return (
      '<div class="topbar"><div class="topbar-inner">' +
        '<div class="brand">' +
          '<div class="brand-mark">AH</div>' +
          '<div class="brand-text"><h1>AHDC Engagements</h1><p>Client delivery timeline &amp; milestone tracker</p></div>' +
        '</div>' +
        '<div class="top-actions">' +
          (ui.readOnly ? '' :
          '<button class="btn btn-secondary" data-action="open-add-client">'+icon('plus')+'Add Client</button>' +
          '<button class="btn btn-primary" data-action="open-add-engagement"'+(data.clients.length?'':' disabled title="Add a client first"')+'>'+icon('plus')+'New Engagement</button>'
          ) +
          '<div class="seg" role="group" aria-label="Export">' +
            '<button data-action="export-outlook" title="Outlook-compatible calendar CSV">'+icon('calendar')+' Outlook</button>' +
            '<button data-action="export-excel" title="Excel-compatible roster CSV">'+icon('dl')+' Excel</button>' +
          '</div>' +
          '<div class="seg seg-icon" role="group" aria-label="Theme">' +
            '<button data-action="set-theme" data-mode="system" class="'+(uiTheme==='system'?'active':'')+'" aria-pressed="'+(uiTheme==='system')+'" title="Match system theme">'+icon('monitor','',14)+'</button>' +
            '<button data-action="set-theme" data-mode="light" class="'+(uiTheme==='light'?'active':'')+'" aria-pressed="'+(uiTheme==='light')+'" title="Light theme">'+icon('sun','',14)+'</button>' +
            '<button data-action="set-theme" data-mode="dark" class="'+(uiTheme==='dark'?'active':'')+'" aria-pressed="'+(uiTheme==='dark')+'" title="Dark theme">'+icon('moon','',14)+'</button>' +
          '</div>' +
          '<button class="btn btn-ghost" data-action="logout" title="Sign out">'+icon('close','',14)+' Sign out</button>' +
        '</div>' +
      '</div></div>'
    );
  }

  function tplBanner(){
    if(!ui.loadError) return '';
    return '<div class="wrap"><div class="banner">'+icon('alert')+'<span>Could not load the dashboard data from the server. Try refreshing the page.</span></div></div>';
  }

  function roundupRowTpl(entry){
    var clientName = entry.client ? esc(entry.client.name) : '';
    if(entry.kind==='action'){
      var meta = ACTION_TYPES[entry.sub] || ACTION_TYPES.meeting;
      return '<div class="roundup-row">' +
        (ui.readOnly?'':'<button class="roundup-check" data-action="toggle-action-item" data-action-id="'+entry.id+'" title="Mark done">'+icon('check')+'</button>') +
        '<span class="roundup-type-icon" title="'+esc(meta.label)+'">'+icon(meta.icon,'',13)+'</span>' +
        '<span class="roundup-text"><span class="roundup-title">'+esc(entry.title)+'</span>'+(clientName?'<span class="roundup-sub">'+clientName+'</span>':'')+'</span>' +
        '<span class="roundup-date">'+fmtDateShort(entry.date)+'</span>' +
        (ui.readOnly?'':'<button class="icon-btn roundup-del" data-action="delete-action-item" data-action-id="'+entry.id+'" title="Remove">'+icon('close','',13)+'</button>') +
      '</div>';
    }
    var label, iconName, tone;
    if(entry.kind==='docs'){
      label = esc(entry.title) + ' — New documents uploaded';
      iconName = 'inbox'; tone = '--warn';
    } else if(entry.kind==='milestone'){
      label = esc(entry.title) + ' — ' + esc(entry.engTitle);
      iconName = 'flag'; tone = '--crit';
    } else {
      if(entry.sub==='overdue-end'){ label='Past target end date'; iconName='clock'; tone='--crit'; }
      else if(entry.sub==='at-risk'){ label='At risk'; iconName='alert'; tone='--warn'; }
      else if(entry.sub==='delayed'){ label='Delayed'; iconName='xcirc'; tone='--crit'; }
      else { label='Wrapping up soon'; iconName='clock'; tone='--warn'; }
      label = esc(entry.title) + ' — ' + label;
    }
    return '<div class="roundup-row roundup-row-link" data-action="open-drawer" data-eng="'+entry.engId+'">' +
      '<span class="roundup-type-icon" style="color:var('+tone+')">'+icon(iconName,'',13)+'</span>' +
      '<span class="roundup-text"><span class="roundup-title">'+label+'</span>'+(clientName?'<span class="roundup-sub">'+clientName+'</span>':'')+'</span>' +
      (entry.date?'<span class="roundup-date">'+fmtDateShort(entry.date)+'</span>':'') +
    '</div>';
  }
  function roundupSection(title, tone, items){
    if(!items.length) return '';
    return '<div class="roundup-section"><div class="roundup-section-title tone-'+tone+'">'+esc(title)+'<span class="roundup-count">'+items.length+'</span></div>' +
      items.map(roundupRowTpl).join('') +
    '</div>';
  }
  function tplRoundup(){
    var r = computeRoundup();
    var todayLabel = TODAY.toLocaleDateString('en-US',{weekday:'long', month:'long', day:'numeric'});
    var collapsed = ui.roundupCollapsed;
    var bodyHtml = '';
    if(!collapsed){
      if(!r.total){
        bodyHtml = '<div class="roundup-empty">'+icon('check','',15)+'Nothing due today. Add a meeting, call, or follow-up to plan ahead.</div>';
      } else {
        bodyHtml = roundupSection('Overdue','crit',r.overdue) + roundupSection('Today','accent',r.today) + roundupSection('New documents','warn',r.docs) + roundupSection('Needs attention','warn',r.attention);
      }
      if(!ui.readOnly){
        bodyHtml += '<form class="roundup-quickadd" data-action-submit="quick-add-action">' +
          '<select name="qa-type">'+ACTION_TYPE_ORDER.map(function(t){return '<option value="'+t+'">'+esc(ACTION_TYPES[t].label)+'</option>';}).join('')+'</select>' +
          '<input type="text" name="qa-title" placeholder="e.g. Call Priya Nandan about rollout" required>' +
          (data.clients.length?'<select name="qa-client"><option value="">No specific client</option>'+data.clients.map(function(c){return '<option value="'+c.id+'">'+esc(c.name)+'</option>';}).join('')+'</select>':'') +
          '<input type="date" name="qa-date" value="'+toISO(TODAY)+'">' +
          '<button class="btn btn-secondary btn-sm" type="submit">'+icon('plus')+'Add</button>' +
        '</form>';
      }
    }
    return '<div class="panel roundup-panel">' +
      '<div class="roundup-head" data-action="toggle-roundup">' +
        '<span class="roundup-head-icon">'+icon('sun')+'</span>' +
        '<div class="roundup-head-text"><h2>Morning Roundup</h2><p>'+esc(todayLabel)+(r.total?' · '+r.total+' item'+(r.total===1?'':'s')+' need'+(r.total===1?'s':'')+' your attention':' · all clear')+'</p></div>' +
        icon('chev','chev roundup-chev'+(collapsed?' collapsed':'')) +
      '</div>' +
      (collapsed?'':'<div class="roundup-body">'+bodyHtml+'</div>') +
    '</div>';
  }

  function kpiPopoverRow(action, dataAttrs, primary, secondary, dateStr){
    var attrs = Object.keys(dataAttrs).map(function(k){ return ' data-'+k+'="'+esc(String(dataAttrs[k]))+'"'; }).join('');
    return '<button class="kpi-popover-row" data-action="'+action+'"'+attrs+'>' +
      '<span class="kpi-popover-row-text"><span class="kpi-popover-row-primary">'+esc(primary)+'</span>'+(secondary?'<span class="kpi-popover-row-secondary">'+esc(secondary)+'</span>':'')+'</span>' +
      (dateStr?'<span class="kpi-popover-row-date">'+esc(dateStr)+'</span>':'') +
    '</button>';
  }
  function kpiEngRows(list){
    return list.map(function(r){
      return kpiPopoverRow('open-drawer', {eng:r.id}, r.title, r.clientName);
    }).join('');
  }
  function kpiPopoverBody(kind, k){
    var rows = '', empty = 'Nothing here right now.';
    if(kind==='active'){ rows = kpiEngRows(k.activeList); empty = 'No active engagements.'; }
    else if(kind==='onTrack'){ rows = kpiEngRows(k.onTrackList); empty = 'Nothing on track right now.'; }
    else if(kind==='attention'){ rows = kpiEngRows(k.attentionList); empty = 'Nothing at risk or delayed.'; }
    else if(kind==='wrapping'){ rows = kpiEngRows(k.wrappingUpList); empty = 'Nothing wrapping up soon.'; }
    else if(kind==='missed'){
      rows = k.missedList.map(function(m){
        return kpiPopoverRow('open-drawer', {eng:m.engId}, m.msName, m.engTitle+(m.clientName?' — '+m.clientName:''), fmtDateShort(parseDate(m.date)));
      }).join('');
      empty = 'No missed milestones.';
    }
    else if(kind==='clients'){
      rows = k.clientsList.map(function(c){
        return kpiPopoverRow('edit-client', {client:c.id}, c.name);
      }).join('');
      empty = 'No clients yet.';
    }
    return rows || '<div class="kpi-popover-empty">'+icon('check','',13)+esc(empty)+'</div>';
  }
  function tplKPIs(){
    var k = computeKPIs();
    function tile(kind, label, value, ctx, tone){
      var open = ui.kpiPopover===kind;
      return '<div class="kpi-tile'+(tone?' tone-'+tone:'')+(open?' open':'')+'">' +
        '<button class="kpi-tile-trigger" type="button" data-action="toggle-kpi-popover" data-kpi="'+kind+'" aria-expanded="'+(open?'true':'false')+'">' +
          '<div class="kpi-label">'+esc(label)+icon('chev','kpi-chev'+(open?' open':''),11)+'</div>' +
          '<div class="kpi-value num">'+value+'</div>' +
          '<div class="kpi-context">'+esc(ctx)+'</div>' +
        '</button>' +
        (open ? '<div class="kpi-popover"><div class="kpi-popover-list">'+kpiPopoverBody(kind,k)+'</div></div>' : '') +
      '</div>';
    }
    return '<div class="kpi-strip">' +
      tile('active', 'Active Engagements', k.activeCount, k.clientCount+' client'+(k.clientCount===1?'':'s'), 'accent') +
      tile('onTrack', 'On Track', k.onTrackPct+'%', 'of active engagements', k.onTrackPct>=70?'good':(k.onTrackPct>=40?'':'warn')) +
      tile('attention', 'Needs Attention', k.attentionCount, 'at risk or delayed', k.attentionCount>0?'warn':'good') +
      tile('missed', 'Missed Milestones', k.missedTotal, 'past due, not complete', k.missedTotal>0?'crit':'good') +
      tile('wrapping', 'Wrapping Up', k.wrappingUpTotal, 'ending within '+WRAP_UP_WINDOW_DAYS+' days', k.wrappingUpTotal>0?'warn':'') +
      tile('clients', 'Clients', k.clientCount, 'in the roster', '') +
    '</div>';
  }

  function formatClockNow(){
    var d = new Date();
    var h = d.getHours();
    var ampm = h>=12 ? 'PM' : 'AM';
    var h12 = h%12; if(h12===0) h12=12;
    var hh = String(h12).padStart(2,'0');
    var mm = String(d.getMinutes()).padStart(2,'0');
    var ss = String(d.getSeconds()).padStart(2,'0');
    return {
      time: hh+':'+mm+':'+ss+' '+ampm,
      weekday: d.toLocaleDateString('en-US',{weekday:'long'}),
      date: d.toLocaleDateString('en-US',{month:'long', day:'numeric', year:'numeric'})
    };
  }
  function tplClockWidget(){
    var c = formatClockNow();
    return '<div class="clock-card" id="clock-widget">' +
      icon('clock','clock-card-icon',15) +
      '<div class="clock-time num" id="clock-time">'+c.time+'</div>' +
      '<div class="clock-meta"><span id="clock-weekday">'+esc(c.weekday)+'</span><span class="clock-dot">·</span><span id="clock-date">'+esc(c.date)+'</span></div>' +
    '</div>';
  }
  function tickClock(){
    if(!document.getElementById('clock-widget')) return;
    var c = formatClockNow();
    var t = document.getElementById('clock-time'); if(t) t.textContent = c.time;
    var w = document.getElementById('clock-weekday'); if(w) w.textContent = c.weekday;
    var dt = document.getElementById('clock-date'); if(dt) dt.textContent = c.date;
  }

  function computeUnreviewedDocs(){
    var list = [];
    data.engagements.forEach(function(eng){
      var client = clientById(eng.clientId);
      (eng.portalFiles||[]).forEach(function(f){
        if(f.reviewed) return;
        list.push({
          engId: eng.id,
          fileId: f.id,
          name: f.originalName,
          uploadedAt: new Date(f.uploadedAt),
          engTitle: eng.title,
          clientName: client ? client.name : ''
        });
      });
    });
    list.sort(function(a,b){ return b.uploadedAt - a.uploadedAt; });
    return list;
  }
  function tplUnreviewedDocs(){
    var list = computeUnreviewedDocs();
    var bodyHtml;
    if(!list.length){
      bodyHtml = '<div class="unreviewed-empty">'+icon('check','',15)+'All caught up — no unreviewed documents.</div>';
    } else {
      bodyHtml = list.map(function(d){
        return '<div class="unreviewed-doc-row">' +
          '<label class="portal-file-reviewed" title="Mark this document as reviewed">' +
            '<input type="checkbox" data-action="toggle-file-reviewed" data-eng="'+d.engId+'" data-file="'+d.fileId+'"'+(ui.readOnly?' disabled':'')+'>' +
            '<span>Reviewed</span>' +
          '</label>' +
          '<button type="button" class="unreviewed-doc-link" data-action="open-drawer" data-eng="'+d.engId+'">' +
            '<span class="unreviewed-doc-name">'+icon('note','',13)+esc(d.name)+'</span>' +
            '<span class="unreviewed-doc-sub">'+esc(d.clientName)+' — '+esc(d.engTitle)+'</span>' +
          '</button>' +
          '<span class="unreviewed-doc-date">'+fmtDateShort(d.uploadedAt)+'</span>' +
        '</div>';
      }).join('');
    }
    return '<div class="panel unreviewed-panel">' +
      '<div class="unreviewed-head">' +
        '<span class="unreviewed-head-icon">'+icon('inbox')+'</span>' +
        '<div class="unreviewed-head-text"><h2>Unreviewed Documents</h2><p>'+(list.length?(list.length+' file'+(list.length===1?'':'s')+' waiting on review'):'All caught up')+'</p></div>' +
      '</div>' +
      '<div class="unreviewed-body">'+bodyHtml+'</div>' +
    '</div>';
  }

  function tplToolbar(){
    var owners = allOwners();
    var statusChips = STATUS_ORDER.map(function(s){
      var meta = ENG_STATUS[s];
      var active = !!ui.statusFilter[s];
      return '<button class="chip-filter'+(active?' active':'')+'" data-action="toggle-status-filter" data-status="'+s+'"><span class="dot st-'+s+'" style="background:currentColor"></span>'+esc(meta.label)+'</button>';
    }).join('');
    return '<div class="wrap"><div class="toolbar">' +
      '<div class="seg" role="tablist">' +
        '<button data-action="set-view" data-view="timeline" class="'+(ui.view==='timeline'?'active':'')+'">Timeline</button>' +
        '<button data-action="set-view" data-view="roster" class="'+(ui.view==='roster'?'active':'')+'">Roster</button>' +
      '</div>' +
      '<div class="search-box">'+icon('search')+'<input id="search-input" type="text" placeholder="Search clients or engagements…" value="'+esc(ui.search)+'" data-action="search-input"></div>' +
      '<div class="filter-group">'+statusChips+'</div>' +
      (owners.length ? '<select data-action="owner-filter"><option value="">All owners</option>'+owners.map(function(o){return '<option value="'+esc(o)+'"'+(ui.ownerFilter===o?' selected':'')+'>'+esc(o)+'</option>';}).join('')+'</select>' : '') +
      '<div class="toolbar-spacer"></div>' +
      (ui.view==='timeline' ? '<div class="seg">' +
        ['3m','6m','12m','all'].map(function(z){
          var lbl = z==='all'?'All':z.replace('m',' Mo');
          return '<button data-action="set-zoom" data-zoom="'+z+'" class="'+(ui.zoom===z?'active':'')+'">'+lbl+'</button>';
        }).join('') +
      '</div>' : '') +
    '</div></div>';
  }

  /* ============================= TEMPLATES: TIMELINE ============================= */
  function monthTicks(range){
    var ticks = [];
    var cur = startOfMonth(range.start);
    if(cur < range.start) cur = addMonths(cur,1);
    while(cur <= range.end){
      ticks.push(cur);
      cur = addMonths(cur,1);
    }
    return ticks;
  }

  function barTitleColorVar(status){
    return {'on-track':'--good','at-risk':'--warn','delayed':'--crit','complete':'--complete','not-started':'--notstarted'}[status] || '--notstarted';
  }

  function tplLegend(){
    var swatches = STATUS_ORDER.map(function(s){
      return '<span class="tl-legend-item"><span class="tl-legend-swatch" style="background:var('+barTitleColorVar(s)+')"></span>'+esc(ENG_STATUS[s].label)+'</span>';
    }).join('');
    return '<div class="tl-legend">' + swatches +
      '<span class="tl-legend-sep"></span>' +
      '<span class="tl-legend-item"><span class="tl-legend-icon" style="background:var(--crit)">'+icon('alert')+'</span>Missed milestone</span>' +
      '<span class="tl-legend-item"><span class="tl-legend-icon" style="background:var(--warn)">'+icon('clock')+'</span>Wrapping up soon</span>' +
      '<span class="tl-legend-sep"></span>' +
      '<span class="tl-legend-item"><span class="tl-legend-swatch" style="background:var(--good); transform:rotate(45deg); border-radius:1px"></span>Milestone hit</span>' +
      '<span class="tl-legend-item"><span class="tl-legend-swatch" style="background:var(--crit); transform:rotate(45deg); border-radius:1px"></span>Milestone missed</span>' +
    '</div>';
  }

  function tplTimeline(){
    var range = getRange();
    var filtered = data.engagements.filter(matchesFilters);
    var filteredIds = {}; filtered.forEach(function(e){ filteredIds[e.id]=true; });
    var clientsWithMatches = data.clients.filter(function(c){
      return engagementsForClient(c.id).some(function(e){ return filteredIds[e.id]; });
    });
    // Clients whose most urgent engagement is at risk / delayed sort to the top; within that,
    // whichever client has something ending soonest comes first. Same rule cascades to the
    // engagement rows inside each group (see below).
    clientsWithMatches = clientsWithMatches.slice().sort(function(ca,cb){
      var ea = engagementsForClient(ca.id).filter(function(e){ return filteredIds[e.id]; });
      var eb = engagementsForClient(cb.id).filter(function(e){ return filteredIds[e.id]; });
      var ka = groupUrgencyKey(ea), kb = groupUrgencyKey(eb);
      return ka[0]!==kb[0] ? ka[0]-kb[0] : ka[1]-kb[1];
    });

    if(!data.clients.length){
      return '<div class="panel"><div class="tl-empty">' +
        '<h3>No clients yet</h3><p>Add your first client to start mapping engagement timelines and milestone dates.</p>' +
        (ui.readOnly?'':'<button class="btn btn-primary" data-action="open-add-client">'+icon('plus')+'Add your first client</button>') +
      '</div></div>';
    }
    if(!clientsWithMatches.length){
      return '<div class="panel">'+tplLegend()+'<div class="tl-empty"><h3>No matching engagements</h3><p>Try clearing your search or status filters.</p></div></div>';
    }

    var ticks = monthTicks(range);
    var todayPct = pct(TODAY, range);
    var monthsHtml = ticks.map(function(m,i){
      var next = i+1<ticks.length ? ticks[i+1] : range.end;
      var left = pct(m, range), right = pct(next, range);
      return '<div class="tl-month" style="left:'+left+'%; width:'+(right-left)+'%">'+m.toLocaleDateString('en-US',{month:'short',year:'2-digit'})+'</div>';
    }).join('');
    var gridHtml = ticks.map(function(m){ return '<div class="tl-gridline" style="left:'+pct(m,range)+'%"></div>'; }).join('');

    var groupsHtml = clientsWithMatches.map(function(client){
      var engs = sortEngagementsForDisplay(engagementsForClient(client.id).filter(function(e){ return filteredIds[e.id]; }));
      var expanded = ui.expanded[client.id] !== false;
      var rowsHtml = engs.map(function(eng){
        var s = parseDate(eng.start), en = parseDate(eng.end);
        var left = pct(s, range), right = pct(en, range);
        var width = Math.max(right-left, 0.6);
        var colorVar = barTitleColorVar(eng.status);
        var msHtml = (eng.milestones||[]).map(function(m){
          var d = parseDate(m.date);
          if(!d) return '';
          var mp = pct(d, range);
          var stat = msStatus(m);
          var col = stat==='done' ? 'var(--good)' : (stat==='overdue' ? 'var(--crit)' : 'var(--ink-faint)');
          return '<div class="ms-marker'+(stat==='overdue'?' overdue':'')+'" style="left:'+mp+'%; background:'+col+'" data-action="hover-ms" data-eng="'+eng.id+'" data-ms="'+m.id+'"></div>';
        }).join('');
        var alert = engagementAlert(eng);
        var alertHtml = alert ? '<div class="bar-alert" style="background:var('+alert.colorVar+')" data-tooltip-alert="'+eng.id+'">'+icon(alert.icon)+'</div>' : '';
        var ownerHtml = eng.owner ? '<span class="owner-avatar" style="background:'+ownerColor(eng.owner)+'" title="'+esc(eng.owner)+'">'+esc(initials(eng.owner))+'</span><span>'+esc(eng.owner)+'</span>' : '';
        return '<div class="tl-row">' +
          '<div class="tl-row-label">' +
            '<div class="tl-row-title" data-action="open-drawer" data-eng="'+eng.id+'">'+esc(eng.title)+(eng.newDocsAt?'<span class="eng-alert-badge" style="color:var(--warn); margin-left:6px" title="New documents uploaded '+fmtDate(new Date(eng.newDocsAt))+'">'+icon('inbox','',12)+'</span>':'')+'</div>' +
            '<div class="tl-row-sub"><span class="status-pill st-'+eng.status+'">'+icon(ENG_STATUS[eng.status].icon,'',11)+esc(ENG_STATUS[eng.status].label)+'</span>'+ownerHtml+'</div>' +
          '</div>' +
          '<div class="tl-row-track">' + gridHtml +
            '<div class="bar" style="left:'+left+'%; width:'+width+'%; color:var('+colorVar+')" data-action="open-drawer" data-eng="'+eng.id+'" data-tooltip-eng="'+eng.id+'">' +
              '<div class="bar-inner">' +
                '<div class="bar-fill" style="background:currentColor"></div>' +
                '<div class="bar-progress" style="width:'+(eng.progress||0)+'%; background:currentColor"></div>' +
                '<div class="bar-border" style="color:var('+colorVar+')"></div>' +
                '<div class="bar-label">'+esc(eng.title)+'</div>' +
              '</div>' +
              alertHtml +
            '</div>' +
            msHtml +
            (todayPct>=0&&todayPct<=100?'<div class="tl-today" style="left:'+todayPct+'%"></div>':'') +
          '</div>' +
        '</div>';
      }).join('');
      var pc = primaryContact(client);
      return '<div class="tl-group'+(expanded?'':' collapsed')+'">' +
        '<div class="tl-group-header" data-action="toggle-group" data-client="'+client.id+'">' +
          icon('chev','chev') +
          '<span class="tl-group-name">'+esc(client.name)+'</span>' +
          (client.industry?'<span class="industry-chip">'+esc(client.industry)+'</span>':'') +
          '<span class="tl-group-meta">' + (pc?esc(pc.name):'No contact on file') + ' · ' + engs.length + ' engagement'+(engs.length===1?'':'s') + '</span>' +
        '</div>' +
        '<div class="tl-rows">'+rowsHtml+'</div>' +
      '</div>';
    }).join('');

    return '<div class="panel">' + tplLegend() + '<div class="tl-scroll"><div class="tl-inner">' +
      '<div class="tl-header"><div class="tl-header-label">Client / Engagement</div><div class="tl-header-track">'+monthsHtml+
        (todayPct>=0&&todayPct<=100?'<div class="tl-today" style="left:'+todayPct+'%"><span class="tl-today-tag">TODAY</span></div>':'')+
      '</div></div>' +
      '<div class="tl-body">'+groupsHtml+'</div>' +
    '</div></div></div>';
  }

  /* ============================= TEMPLATES: ROSTER ============================= */
  function tplRoster(){
    if(!data.clients.length){
      return '<div class="panel"><div class="tl-empty">' +
        '<h3>No clients yet</h3><p>Add a client to start building your AHDC roster with contact details and engagements.</p>' +
        (ui.readOnly?'':'<button class="btn btn-primary" data-action="open-add-client">'+icon('plus')+'Add your first client</button>') +
      '</div></div>';
    }
    var filtered = data.clients.filter(function(c){
      if(!ui.search) return true;
      var q = ui.search.toLowerCase();
      return (c.name+' '+(c.industry||'')).toLowerCase().indexOf(q)!==-1 || engagementsForClient(c.id).some(function(e){return (e.title+' '+customFieldsText(e)).toLowerCase().indexOf(q)!==-1;});
    });
    if(!filtered.length){
      return '<div class="panel"><div class="tl-empty"><h3>No matching clients</h3><p>Try a different search.</p></div></div>';
    }
    filtered = filtered.slice().sort(function(ca,cb){
      var ka = groupUrgencyKey(engagementsForClient(ca.id)), kb = groupUrgencyKey(engagementsForClient(cb.id));
      return ka[0]!==kb[0] ? ka[0]-kb[0] : ka[1]-kb[1];
    });
    var cardsHtml = filtered.map(function(client){
      var engs = sortEngagementsForDisplay(engagementsForClient(client.id));
      var attention = engs.filter(function(e){return e.status==='at-risk'||e.status==='delayed';}).length;
      var expanded = ui.expanded['roster_'+client.id] === true;
      var contactsHtml = (client.contacts&&client.contacts.length) ? client.contacts.map(function(c){
        return '<div class="contact-item"><div class="ci-icon">'+icon('users','',14)+'</div><div>' +
          '<div class="contact-name">'+esc(c.name)+(c.primary?'<span class="primary-badge">PRIMARY</span>':'')+'</div>' +
          (c.title?'<div class="contact-title">'+esc(c.title)+'</div>':'') +
          '<div class="contact-links">' +
            (c.email?'<a href="mailto:'+esc(c.email)+'">'+icon('mail','',11)+' '+esc(c.email)+'</a>':'') +
            (c.phone?'<a href="tel:'+esc(c.phone)+'">'+icon('phone','',11)+' '+esc(c.phone)+'</a>':'') +
          '</div>' +
        '</div></div>';
      }).join('') : '<p class="empty-note">No contacts on file yet.</p>';
      var engsHtml = engs.length ? engs.map(function(e){
        var al = engagementAlert(e);
        return '<div class="eng-item" data-action="open-drawer" data-eng="'+e.id+'">' +
          '<span class="status-pill st-'+e.status+'">'+icon(ENG_STATUS[e.status].icon,'',11)+'</span>' +
          '<span class="eng-title">'+esc(e.title)+'</span>' +
          (al?'<span class="eng-alert-badge" style="color:var('+al.colorVar+')" title="'+esc(al.label)+'">'+icon(al.icon,'',12)+'</span>':'') +
          (e.newDocsAt?'<span class="eng-alert-badge" style="color:var(--warn)" title="New documents uploaded '+fmtDate(new Date(e.newDocsAt))+'">'+icon('inbox','',12)+'</span>':'') +
          ((e.links&&e.links.length)?'<span class="eng-alert-badge" style="color:var(--ink-faint)" title="'+e.links.length+' linked file'+(e.links.length===1?'':'s')+'">'+icon('folder','',12)+'</span>':'') +
          ((e.customFields&&e.customFields.length)?'<span class="eng-alert-badge" style="color:var(--ink-faint)" title="'+esc(e.customFields.map(function(f){return (f.key||'—')+': '+(f.value||'—');}).join(', '))+'">'+icon('tag','',12)+'</span>':'') +
          (e.notes&&e.notes.trim()?'<span class="eng-alert-badge" style="color:var(--ink-faint); cursor:pointer" data-action="open-notes-popup" data-eng="'+e.id+'" title="Notes on file — click to view">'+icon('note','',12)+'</span>':'') +
          '<span class="eng-dates">'+fmtDateShort(parseDate(e.start))+' – '+fmtDateShort(parseDate(e.end))+'</span>' +
        '</div>';
      }).join('') : '<p class="empty-note">No engagements yet.</p>';

      return '<div class="roster-card'+(expanded?'':' collapsed')+'">' +
        '<div class="roster-head" data-action="toggle-roster" data-client="'+client.id+'">' +
          '<div class="roster-avatar">'+esc(initials(client.name))+'</div>' +
          '<div class="roster-info"><h3>'+esc(client.name)+'</h3>' +
            '<div class="meta-row">' +
              (client.industry?'<span>'+esc(client.industry)+'</span>':'') +
              (client.status?'<span>· '+esc(client.status)+'</span>':'') +
              (attention?'<span class="status-pill st-at-risk">'+attention+' need'+(attention===1?'s':'')+' attention</span>':'') +
            '</div>' +
          '</div>' +
          '<div class="roster-stats">' +
            '<div class="roster-stat"><div class="n num">'+engs.length+'</div><div class="l">Engagements</div></div>' +
            '<div class="roster-stat"><div class="n num">'+(client.contacts?client.contacts.length:0)+'</div><div class="l">Contacts</div></div>' +
          '</div>' +
          (client.filesUrl?'<a class="icon-btn files-quicklink" data-action="open-files-link" href="'+esc(client.filesUrl)+'" target="_blank" rel="noopener noreferrer" title="Open secure file location">'+icon('folder','',15)+'</a>':'') +
          (ui.readOnly?'':'<button class="icon-btn" data-action="edit-client" data-client="'+client.id+'" title="Edit client">'+icon('edit','',15)+'</button>') +
          icon('chev','chev') +
        '</div>' +
        '<div class="roster-detail">' +
          '<div class="contact-block"><h4>Contacts</h4>'+contactsHtml+
            '<div class="files-block"><h4>Secure Files</h4>' +
            (client.filesUrl?
              '<a class="files-link" data-action="open-files-link" href="'+esc(client.filesUrl)+'" target="_blank" rel="noopener noreferrer">'+icon('folder','',13)+'Open client file portal'+icon('external','',11)+'</a>'
              : '<p class="empty-note">No secure file location on file yet'+(ui.readOnly?'.':' — edit the client to add one.')+'</p>') +
            '</div>' +
          '</div>' +
          '<div class="eng-block"><h4>Engagements</h4>'+engsHtml +
            (ui.readOnly?'':'<button class="add-row-btn" style="margin-top:10px" data-action="open-add-engagement" data-preset-client="'+client.id+'">'+icon('plus')+'Add engagement</button>') +
          '</div>' +
        '</div>' +
        (ui.readOnly?'':'<div class="roster-detail" style="grid-template-columns:1fr; padding-top:0">' +
          '<button class="btn '+(ui.confirmDeleteClient===client.id?'btn-danger':'btn-ghost')+' btn-sm" style="justify-self:start" data-action="delete-client" data-client="'+client.id+'">'+icon('trash','',13)+(ui.confirmDeleteClient===client.id?'Confirm delete client':'Delete client')+'</button>' +
        '</div>') +
      '</div>';
    }).join('');
    return '<div class="panel"><div class="roster-list">'+cardsHtml+'</div></div>';
  }

  /* ============================= RENDER ROOT ============================= */
  function renderApp(){
    var root = document.getElementById('app');
    if(!ui.dataLoaded){
      root.innerHTML = tplHeader() + '<div class="wrap"><p class="empty-note" style="padding:40px 0; text-align:center">Loading…</p></div>';
      return;
    }
    root.innerHTML = tplHeader() + tplBanner() +
      '<div class="wrap"><div class="top-split">' +
        '<div class="top-split-left">' + tplRoundup() + '</div>' +
        '<div class="top-split-right">' + tplKPIs() + tplClockWidget() + tplUnreviewedDocs() + '</div>' +
      '</div></div>' +
      tplToolbar() + '<div class="wrap">' + (ui.view==='timeline'?tplTimeline():tplRoster()) + '</div>';
  }

  /* ============================= DRAWER ============================= */
  function tplDrawer(eng){
    var client = clientById(eng.clientId);
    var s = parseDate(eng.start), en = parseDate(eng.end);
    var msHtml = (eng.milestones||[]).slice().sort(function(a,b){return a.date<b.date?-1:1;}).map(function(m){
      var stat = msStatus(m);
      return '<div class="ms-row '+(m.done?'done':'')+' '+(stat==='overdue'?'overdue':'')+'">' +
        '<button class="ms-check" data-action="toggle-ms" data-eng="'+eng.id+'" data-ms="'+m.id+'">'+icon('check')+'</button>' +
        '<span class="ms-name">'+esc(m.name)+'</span>' +
        '<span class="ms-date">'+fmtDateShort(parseDate(m.date))+'</span>' +
        (ui.readOnly?'':'<button class="icon-btn ms-del" data-action="delete-ms" data-eng="'+eng.id+'" data-ms="'+m.id+'">'+icon('close','',13)+'</button>') +
      '</div>';
    }).join('') || '<p class="empty-note">No milestones yet.</p>';

    var statusChips = STATUS_ORDER.map(function(s2){
      return '<button class="'+(eng.status===s2?'sel opt-'+s2:'')+'" data-action="set-status" data-eng="'+eng.id+'" data-status="'+s2+'">'+icon(ENG_STATUS[s2].icon,'',11)+esc(ENG_STATUS[s2].label)+'</button>';
    }).join('');

    var confirming = ui.confirmDeleteEng === eng.id;
    var alert = engagementAlert(eng);

    return '<div class="overlay" data-action="close-drawer"></div>' +
    '<div class="drawer" role="dialog" aria-label="Engagement detail">' +
      '<div class="drawer-head">' +
        '<div><h2>'+esc(eng.title)+'</h2><div class="sub">'+(client?esc(client.name):'')+' · '+esc(eng.type||'Engagement')+'</div></div>' +
        '<div style="display:flex; gap:4px; flex-shrink:0">' +
          (ui.readOnly?'':'<button class="icon-btn" data-action="edit-engagement" data-eng="'+eng.id+'" title="Edit engagement">'+icon('edit','',15)+'</button>') +
          '<button class="icon-btn" data-action="close-drawer">'+icon('close')+'</button>' +
        '</div>' +
      '</div>' +
      (alert?'<div class="drawer-callout" style="background:var('+alert.colorVar+'-soft,var(--surface-2)); color:var('+alert.colorVar+')"><span class="drawer-callout-icon" style="background:var('+alert.colorVar+')">'+icon(alert.icon)+'</span>'+esc(alert.label)+'</div>':'') +
      (eng.newDocsAt?'<div class="drawer-callout" style="background:var(--warn-soft); color:var(--warn)"><span class="drawer-callout-icon" style="background:var(--warn)">'+icon('inbox')+'</span>New documents uploaded via the client portal — '+fmtDate(new Date(eng.newDocsAt))+'</div>':'') +
      '<div class="drawer-body">' +
        '<div class="field-group"><span class="field-label">Status</span><div class="status-chip-row">'+(ui.readOnly?statusChips.replace(/data-action="set-status"/g,''):statusChips)+'</div></div>' +
        '<div class="field-group"><span class="field-label">Progress</span><div class="progress-row">' +
          '<input type="range" min="0" max="100" step="5" value="'+(eng.progress||0)+'" id="progress-range" '+(ui.readOnly?'disabled':'')+'>' +
          '<span class="pv num" id="progress-live-label">'+(eng.progress||0)+'%</span>' +
        '</div></div>' +
        '<div class="field-group">' +
          '<div class="meta-line"><span class="k">Owner</span><span class="v">'+(eng.owner?('<span class="owner-avatar" style="background:'+ownerColor(eng.owner)+'; margin-right:6px; vertical-align:-4px">'+esc(initials(eng.owner))+'</span>'+esc(eng.owner)):'—')+'</span></div>' +
          '<div class="meta-line"><span class="k">Start</span><span class="v">'+fmtDate(s)+'</span></div>' +
          '<div class="meta-line"><span class="k">Target end</span><span class="v">'+fmtDate(en)+'</span></div>' +
          '<div class="meta-line"><span class="k">Duration</span><span class="v">'+(s&&en?daysBetween(s,en)+' days':'—')+'</span></div>' +
        '</div>' +
        '<div class="field-group"><span class="field-label">Milestones</span><div class="ms-list">'+msHtml+'</div>' +
          (ui.readOnly?'':'<form class="add-ms-form" data-action-submit="add-ms" data-eng="'+eng.id+'">' +
            '<input type="text" name="ms-name" placeholder="Milestone name" required>' +
            '<input type="date" name="ms-date" required>' +
            '<button class="btn btn-secondary btn-sm" type="submit">'+icon('plus')+'</button>' +
          '</form>') +
        '</div>' +
        '<div class="field-group"><span class="field-label">Links</span><div class="eng-links-list">' +
          ((eng.links&&eng.links.length) ? eng.links.map(function(l){
            return '<a class="files-link" href="'+esc(l.url)+'" target="_blank" rel="noopener noreferrer">'+icon(linkIcon(l.url),'',13)+(l.label?esc(l.label):'Open link')+icon('external','',11)+'</a>';
          }).join('') : '<p class="empty-note">No linked folders or pages yet'+(ui.readOnly?'.':' — edit the engagement to add one.')+'</p>') +
        '</div></div>' +
        (eng.customFields&&eng.customFields.length?'<div class="field-group"><span class="field-label">Custom Fields</span>' +
          eng.customFields.map(function(f){
            return '<div class="meta-line"><span class="k">'+esc(f.key||'—')+'</span><span class="v">'+esc(f.value||'—')+'</span></div>';
          }).join('') +
        '</div>':'') +
        '<div class="field-group"><span class="field-label" style="display:flex; align-items:center; justify-content:space-between">Notes' +
          (ui.readOnly?'':'<button class="icon-btn" data-action="open-notes-popup" data-eng="'+eng.id+'" data-notes-edit="'+(eng.notes&&eng.notes.trim()?'0':'1')+'" title="Open notes in floating window" style="width:22px; height:22px">'+icon('external','',13)+'</button>') +
        '</span>' +
          (eng.notes&&eng.notes.trim() ?
            '<p class="drawer-notes-text" data-action="open-notes-popup" data-eng="'+eng.id+'" style="cursor:pointer">'+esc(eng.notes)+'</p>'
            : '<p class="empty-note" '+(ui.readOnly?'':'style="cursor:pointer" data-action="open-notes-popup" data-eng="'+eng.id+'" data-notes-edit="1"')+'>'+(ui.readOnly?'No notes on file.':'No notes yet — click to add one.')+'</p>') +
        '</div>' +
        '<div class="field-group"><span class="field-label">Client Upload Portal</span>' +
          '<div class="portal-url-row">' +
            '<input type="text" class="portal-url-field" readonly value="'+esc(portalUrlFor(eng))+'" onclick="this.select()">' +
          '</div>' +
          '<div class="newdocs-actions">' +
            '<a class="btn btn-secondary btn-sm" href="'+esc(portalUrlFor(eng))+'" target="_blank" rel="noopener noreferrer">'+icon('upload','',13)+'Open portal</a>' +
            '<button class="btn btn-secondary btn-sm" data-action="copy-portal-link" data-eng="'+eng.id+'">'+icon('copy','',13)+'Copy link</button>' +
            (ui.readOnly?'':'<button class="btn btn-ghost btn-sm" data-action="regenerate-portal-link" data-eng="'+eng.id+'" title="Invalidates the current link">'+icon('close','',13)+'Reset link</button>') +
            (eng.newDocsAt&&!ui.readOnly?'<button class="btn btn-secondary btn-sm" data-action="clear-new-docs" data-eng="'+eng.id+'">'+icon('check','',13)+'Mark reviewed</button>':'') +
          '</div>' +
          '<div class="form-hint">Share this link with the client to collect documents — no account needed on their end, and files land here automatically with no manual flagging required.</div>' +
          '<div class="portal-files-list">' +
            ((eng.portalFiles&&eng.portalFiles.length) ? eng.portalFiles.slice().reverse().map(function(f){
              return '<div class="portal-file-row'+(f.reviewed?' is-reviewed':'')+'">' +
                '<label class="portal-file-reviewed" title="Mark this document as reviewed">' +
                  '<input type="checkbox" data-action="toggle-file-reviewed" data-eng="'+eng.id+'" data-file="'+f.id+'"'+(f.reviewed?' checked':'')+(ui.readOnly?' disabled':'')+'>' +
                  '<span>Reviewed</span>' +
                '</label>' +
                '<a class="portal-file-name" href="/api/download/'+eng.id+'/'+f.id+'" download>'+icon('dl','',13)+esc(f.originalName)+'</a>' +
                '<span class="portal-file-meta">'+fmtBytes(f.size)+' · '+fmtDateShort(new Date(f.uploadedAt))+'</span>' +
                (f.note?'<span class="portal-file-note">'+esc(f.note)+'</span>':'') +
              '</div>';
            }).join('') : '<p class="empty-note">No files received through the portal yet.</p>') +
          '</div>' +
        '</div>' +
        (ui.readOnly?'':'<button class="btn btn-secondary btn-sm" data-action="export-eng-ics" data-eng="'+eng.id+'">'+icon('calendar','',13)+'Export milestones for Outlook</button>') +
      '</div>' +
      (ui.readOnly?'':'<div class="drawer-foot">' +
        '<button class="btn '+(confirming?'btn-danger':'btn-ghost')+' btn-sm" data-action="delete-engagement" data-eng="'+eng.id+'">'+icon('trash','',13)+(confirming?'Confirm delete':'Delete engagement')+'</button>' +
      '</div>') +
    '</div>';
  }
  function renderDrawer(){
    var root = document.getElementById('drawer-root');
    if(!ui.drawerEngId){ root.innerHTML=''; return; }
    var eng = data.engagements.filter(function(e){return e.id===ui.drawerEngId;})[0];
    if(!eng){ ui.drawerEngId=null; root.innerHTML=''; return; }
    root.innerHTML = tplDrawer(eng);
  }
  function openDrawer(eid){
    ui.drawerEngId = eid;
    ui.confirmDeleteEng=null;
    renderApp();
    renderDrawer();
    openNotesPopup(eid, false);
  }
  function closeDrawer(){
    ui.drawerEngId = null;
    ui.confirmDeleteEng=null;
    document.getElementById('drawer-root').innerHTML='';
    renderApp();
    closeNotesPopup();
  }

  /* ============================= FLOATING NOTES WINDOW ============================= */
  function notesPopupDefaultPos(){
    var w = window.innerWidth, h = window.innerHeight;
    var y = Math.max(84, Math.min(h - 280, 104));
    if(ui.drawerEngId){
      var drawerW = Math.min(440, w * 0.92);
      var popupW = 320;
      return { x: Math.max(16, w - drawerW - popupW - 16), y: y };
    }
    return { x: Math.max(16, w - 356), y: y };
  }
  function openNotesPopup(eid, editing){
    var pos = (ui.notesPopup) ? {x:ui.notesPopup.x, y:ui.notesPopup.y} : notesPopupDefaultPos();
    ui.notesPopup = {engId:eid, x:pos.x, y:pos.y, editing:!!editing};
    renderNotesPopup();
  }
  function closeNotesPopup(){ ui.notesPopup = null; document.getElementById('notes-popup-root').innerHTML=''; }

  function tplNotesPopup(eng){
    var client = clientById(eng.clientId);
    var editing = ui.notesPopup.editing;
    var hasNotes = eng.notes && eng.notes.trim();
    return '<div class="notes-float" style="left:'+ui.notesPopup.x+'px; top:'+ui.notesPopup.y+'px" role="dialog" aria-label="Engagement notes">' +
      '<div class="notes-float-head">' +
        '<div class="notes-float-title">'+icon('note','',14)+'<span>'+esc(eng.title)+(client?'<span class="notes-float-sub"> · '+esc(client.name)+'</span>':'')+'</span></div>' +
        '<div class="notes-float-actions">' +
          (ui.readOnly||editing?'':'<button class="icon-btn" data-action="notes-float-edit" title="Edit notes">'+icon('edit','',13)+'</button>') +
          '<button class="icon-btn" data-action="notes-float-close" title="Close">'+icon('close','',14)+'</button>' +
        '</div>' +
      '</div>' +
      '<div class="notes-float-body">' +
        (editing ?
          '<textarea id="notes-float-textarea" placeholder="Anything worth remembering about this engagement">'+esc(eng.notes||'')+'</textarea>'
          : (hasNotes ? '<p class="notes-float-text">'+esc(eng.notes)+'</p>' : '<p class="empty-note">No notes yet'+(ui.readOnly?'.':' — click the pencil to add one.')+'</p>')
        ) +
      '</div>' +
      (editing?'<div class="notes-float-foot"><button class="btn btn-ghost btn-sm" data-action="notes-float-cancel">Cancel</button><button class="btn btn-primary btn-sm" data-action="notes-float-save">Save notes</button></div>':'') +
    '</div>';
  }
  function renderNotesPopup(){
    var root = document.getElementById('notes-popup-root');
    if(!ui.notesPopup){ root.innerHTML=''; return; }
    var eng = data.engagements.filter(function(e){return e.id===ui.notesPopup.engId;})[0];
    if(!eng){ ui.notesPopup=null; root.innerHTML=''; return; }
    root.innerHTML = tplNotesPopup(eng);
    if(ui.notesPopup.editing){
      var ta = document.getElementById('notes-float-textarea');
      if(ta){ ta.focus(); var l=ta.value.length; try{ ta.setSelectionRange(l,l); }catch(er){} }
    }
    setupNotesDrag();
  }
  function saveNotesFromPopup(){
    if(!ui.notesPopup) return;
    var ta = document.getElementById('notes-float-textarea');
    var val = ta ? ta.value : '';
    ui.notesPopup.editing = false;
    setEngagementNotes(ui.notesPopup.engId, val);
  }
  function setupNotesDrag(){
    var root = document.getElementById('notes-popup-root');
    var floatEl = root.querySelector('.notes-float');
    var handle = root.querySelector('.notes-float-head');
    if(!floatEl || !handle) return;
    var dragging=false, startX=0, startY=0, origX=0, origY=0;
    function point(ev){ return ev.touches && ev.touches.length ? ev.touches[0] : ev; }
    function onDown(ev){
      if(ev.target.closest('.icon-btn')) return;
      dragging = true;
      var pt = point(ev);
      startX = pt.clientX; startY = pt.clientY;
      origX = ui.notesPopup.x; origY = ui.notesPopup.y;
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      document.addEventListener('touchmove', onMove, {passive:false});
      document.addEventListener('touchend', onUp);
      ev.preventDefault();
    }
    function onMove(ev){
      if(!dragging) return;
      var pt = point(ev);
      var nx = origX + (pt.clientX-startX);
      var ny = origY + (pt.clientY-startY);
      nx = Math.max(8, Math.min(window.innerWidth-60, nx));
      ny = Math.max(8, Math.min(window.innerHeight-40, ny));
      floatEl.style.left = nx+'px';
      floatEl.style.top = ny+'px';
      if(ui.notesPopup){ ui.notesPopup.x = nx; ui.notesPopup.y = ny; }
      if(ev.cancelable) ev.preventDefault();
    }
    function onUp(){
      dragging = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    }
    handle.addEventListener('mousedown', onDown);
    handle.addEventListener('touchstart', onDown, {passive:false});
  }

  /* ============================= MODALS ============================= */
  function contactRowTpl(idx, vals){
    vals = vals || {};
    return '<div class="dyn-row" data-contact-row>' +
      (idx>0?'<button type="button" class="icon-btn dyn-remove" data-action="remove-row">'+icon('close','',13)+'</button>':'') +
      '<div class="dyn-row-title">Contact '+(idx+1)+(idx===0?' · Primary':'')+'</div>' +
      '<div class="form-grid">' +
        '<div class="form-row"><label>Name</label><input type="text" name="contact-name[]" value="'+esc(vals.name||'')+'"></div>' +
        '<div class="form-row"><label>Title</label><input type="text" name="contact-title[]" value="'+esc(vals.title||'')+'"></div>' +
        '<div class="form-row"><label>Email</label><input type="email" name="contact-email[]" value="'+esc(vals.email||'')+'"></div>' +
        '<div class="form-row"><label>Phone</label><input type="tel" name="contact-phone[]" value="'+esc(vals.phone||'')+'"></div>' +
      '</div>' +
    '</div>';
  }

  function statusOptionsFor(list, current){
    return list.map(function(s){ return '<option'+(current===s?' selected':'')+'>'+esc(s)+'</option>'; }).join('');
  }

  function tplClientModal(existing){
    var isEdit = !!existing;
    var contactsSeed = (isEdit && existing.contacts && existing.contacts.length) ? existing.contacts : [{}];
    var contactRows = contactsSeed.map(function(c,i){ return contactRowTpl(i, c); }).join('');
    return '<div class="modal-overlay" data-action="close-modal">' +
      '<div class="modal" role="dialog" aria-label="'+(isEdit?'Edit client':'Add client')+'">' +
        '<div class="modal-head"><div><h2>'+(isEdit?'Edit client':'Add a new client')+'</h2><p>'+(isEdit?'Update their profile and contact information.':'Set up their profile and key contact information.')+'</p></div><button class="icon-btn" data-action="close-modal">'+icon('close')+'</button></div>' +
        '<form id="client-form" data-action-submit="'+(isEdit?'edit-client':'add-client')+'"'+(isEdit?' data-client-id="'+existing.id+'"':'')+'>' +
        '<div class="modal-body">' +
          '<div class="form-row"><label>Client / company name <span class="req">*</span></label><input type="text" name="client-name" id="ac-name" required autofocus value="'+esc(isEdit?existing.name:'')+'"></div>' +
          '<div class="form-grid">' +
            '<div class="form-row"><label>Industry</label><input type="text" name="client-industry" placeholder="e.g. Healthcare, Manufacturing" value="'+esc(isEdit?existing.industry:'')+'"></div>' +
            '<div class="form-row"><label>Relationship status</label><select name="client-status">'+statusOptionsFor(['Active','Prospect','On Hold'], isEdit?existing.status:'Active')+'</select></div>' +
          '</div>' +
          '<div id="contact-rows">'+contactRows+'</div>' +
          '<button type="button" class="add-row-btn" data-action="add-contact-row">'+icon('plus')+'Add another contact</button>' +
          '<div class="form-row" style="margin-top:16px"><label>Secure file location (URL)</label><input type="url" name="client-files-url" placeholder="https://yourorg-my.sharepoint.com/:f:/g/personal/..." value="'+esc(isEdit?(existing.filesUrl||''):'')+'">' +
            '<div class="form-hint">Paste the link to this client\'s OneDrive/SharePoint folder once it exists — it\'ll show as a quick-open link on their roster card.</div>' +
          '</div>' +
          '<div class="form-row" style="margin-top:16px"><label>Notes</label><textarea name="client-notes" placeholder="Anything worth remembering about this relationship">'+esc(isEdit?existing.notes:'')+'</textarea></div>' +
        '</div>' +
        '<div class="modal-foot"><button type="button" class="btn btn-ghost" data-action="close-modal">Cancel</button><button type="submit" class="btn btn-primary">'+icon(isEdit?'check':'plus')+(isEdit?'Save changes':'Add client')+'</button></div>' +
        '</form>' +
      '</div>' +
    '</div>';
  }

  function msRowTpl(idx){
    return '<div class="ms-inline-row" data-ms-row>' +
      '<input type="text" name="ms-name[]" placeholder="Milestone name">' +
      '<input type="date" name="ms-date[]">' +
      (idx>0?'<button type="button" class="icon-btn" data-action="remove-row">'+icon('close','',13)+'</button>':'<span></span>') +
    '</div>';
  }

  function linkRowTpl(idx, vals){
    vals = vals || {};
    return '<div class="link-inline-row" data-link-row>' +
      '<input type="text" name="link-label[]" placeholder="e.g. Contracts, Kickoff notes" value="'+esc(vals.label||'')+'">' +
      '<input type="url" name="link-url[]" placeholder="SharePoint, OneDrive, or OneNote link" value="'+esc(vals.url||'')+'">' +
      (idx>0?'<button type="button" class="icon-btn" data-action="remove-row">'+icon('close','',13)+'</button>':'<span></span>') +
    '</div>';
  }
  function linkIcon(url){
    var u = (url||'').toLowerCase();
    if(u.indexOf('onenote.com')!==-1 || u.indexOf('onenote:')===0) return 'note';
    if(u.indexOf('sharepoint.com')!==-1 || u.indexOf('onedrive')!==-1 || u.indexOf('1drv.ms')!==-1) return 'folder';
    return 'external';
  }
  function readLinksFromForm(fd){
    var labels = fd.getAll('link-label[]'), urls = fd.getAll('link-url[]');
    var links = [];
    urls.forEach(function(u,i){
      u = (u||'').trim();
      if(!u) return;
      links.push({id: uid('lnk'), label: (labels[i]||'').trim(), url: u});
    });
    return links;
  }

  function customFieldRowTpl(idx, vals){
    vals = vals || {};
    return '<div class="cf-inline-row" data-cf-row>' +
      '<input type="text" name="cf-key[]" placeholder="Field name" value="'+esc(vals.key||'')+'">' +
      '<input type="text" name="cf-value[]" placeholder="Value" value="'+esc(vals.value||'')+'">' +
      '<button type="button" class="icon-btn" data-action="remove-row">'+icon('close','',13)+'</button>' +
    '</div>';
  }
  function readCustomFieldsFromForm(fd){
    var keys = fd.getAll('cf-key[]'), vals = fd.getAll('cf-value[]');
    var fields = [];
    keys.forEach(function(k,i){
      k = (k||'').trim();
      var v = (vals[i]||'').trim();
      if(!k && !v) return;
      fields.push({id: uid('cf'), key:k, value:v});
    });
    return fields;
  }
  function customFieldsText(eng){
    return (eng.customFields||[]).map(function(f){ return (f.key||'')+' '+(f.value||''); }).join(' ');
  }

  function tplEngagementModal(existing, presetClient){
    var isEdit = !!existing;
    var clientOptions = data.clients.map(function(c){ return '<option value="'+c.id+'"'+((isEdit?existing.clientId:presetClient)===c.id?' selected':'')+'>'+esc(c.name)+'</option>'; }).join('');
    var typeOptions = ENG_TYPES.map(function(t){ return '<option'+(isEdit&&existing.type===t?' selected':'')+'>'+esc(t)+'</option>'; }).join('');
    var statusOptions = STATUS_ORDER.map(function(s){ return '<option value="'+s+'"'+((isEdit?existing.status:'not-started')===s?' selected':'')+'>'+esc(ENG_STATUS[s].label)+'</option>'; }).join('');
    var linksSeed = (isEdit && existing.links && existing.links.length) ? existing.links : [{}];
    var linkRows = linksSeed.map(function(l,i){ return linkRowTpl(i, l); }).join('');
    var cfSeed = (isEdit && existing.customFields && existing.customFields.length) ? existing.customFields : [];
    var cfRows = cfSeed.map(function(f,i){ return customFieldRowTpl(i, f); }).join('');
    return '<div class="modal-overlay" data-action="close-modal">' +
      '<div class="modal" role="dialog" aria-label="'+(isEdit?'Edit engagement':'Add engagement')+'">' +
        '<div class="modal-head"><div><h2>'+(isEdit?'Edit engagement':'New engagement')+'</h2><p>'+(isEdit?'Update the timeline, owner, and shared file links.':'Map out the timeline and initial milestone dates.')+'</p></div><button class="icon-btn" data-action="close-modal">'+icon('close')+'</button></div>' +
        '<form id="engagement-form" data-action-submit="'+(isEdit?'edit-engagement':'add-engagement')+'"'+(isEdit?' data-eng-id="'+existing.id+'"':'')+'>' +
        '<div class="modal-body">' +
          '<div class="form-row"><label>Client <span class="req">*</span></label><select name="eng-client" required>'+clientOptions+'</select></div>' +
          '<div class="form-row"><label>Engagement title <span class="req">*</span></label><input type="text" name="eng-title" required placeholder="e.g. ERP Rollout — Phase 2" value="'+esc(isEdit?existing.title:'')+'"></div>' +
          '<div class="form-grid">' +
            '<div class="form-row"><label>Type</label><select name="eng-type">'+typeOptions+'</select></div>' +
            '<div class="form-row"><label>Engagement owner <span class="req">*</span></label><input type="text" name="eng-owner" required placeholder="Lead consultant" value="'+esc(isEdit?existing.owner:'')+'"></div>' +
            '<div class="form-row"><label>Start date <span class="req">*</span></label><input type="date" name="eng-start" required value="'+esc(isEdit?existing.start:'')+'"></div>' +
            '<div class="form-row"><label>Target end date <span class="req">*</span></label><input type="date" name="eng-end" required value="'+esc(isEdit?existing.end:'')+'"></div>' +
            '<div class="form-row"><label>Status</label><select name="eng-status">'+statusOptions+'</select></div>' +
            '<div class="form-row"><label>Progress %</label><input type="number" name="eng-progress" min="0" max="100" step="5" value="'+(isEdit?(existing.progress||0):0)+'"></div>' +
          '</div>' +
          (isEdit?'':'<div class="form-row"><label>Milestones</label><div id="ms-rows">'+msRowTpl(0)+'</div>' +
            '<button type="button" class="add-row-btn" data-action="add-ms-row">'+icon('plus')+'Add another milestone</button>' +
          '</div>') +
          (isEdit?'<p class="form-hint" style="margin-bottom:16px">Milestones are added, checked off, or removed from the engagement drawer.</p>':'') +
          '<div class="form-row"><label>Links (SharePoint, OneDrive, OneNote, etc.)</label><div id="link-rows">'+linkRows+'</div>' +
            '<button type="button" class="add-row-btn" data-action="add-link-row">'+icon('plus')+'Add another link</button>' +
            '<div class="form-hint">Add one link per shared folder or OneNote page for this engagement — e.g. a Contracts folder, Kickoff meeting notes. Label is optional.</div>' +
          '</div>' +
          '<div class="form-row"><label>Custom fields</label><div id="cf-rows">'+cfRows+'</div>' +
            '<button type="button" class="add-row-btn" data-action="add-cf-row">'+icon('plus')+'Add field</button>' +
            '<div class="form-hint">Add any number of extra fields — e.g. Contract #, Renewal date, PO number. Field names and values are searchable from the top search box.</div>' +
          '</div>' +
          '<div class="form-row"><label>Notes</label><textarea name="eng-notes" rows="4" placeholder="Anything worth remembering about this engagement">'+esc(isEdit?(existing.notes||''):'')+'</textarea>' +
            '<div class="form-hint">No length limit. When this engagement has notes, they show in the engagement drawer and in a Notes panel under the KPI tiles.</div>' +
          '</div>' +
          (isEdit?'<p class="form-hint">The client upload portal link is generated automatically and managed from the engagement drawer.</p>':'') +
        '</div>' +
        '<div class="modal-foot"><button type="button" class="btn btn-ghost" data-action="close-modal">Cancel</button><button type="submit" class="btn btn-primary">'+icon(isEdit?'check':'plus')+(isEdit?'Save changes':'Create engagement')+'</button></div>' +
        '</form>' +
      '</div>' +
    '</div>';
  }

  function openAddClientModal(){
    ui.modal = 'add-client';
    document.getElementById('modal-root').innerHTML = tplClientModal(null);
    var f = document.getElementById('ac-name'); if(f) f.focus();
  }
  function openEditClientModal(cid){
    var client = clientById(cid);
    if(!client) return;
    ui.modal = 'edit-client';
    document.getElementById('modal-root').innerHTML = tplClientModal(client);
    var f = document.getElementById('ac-name'); if(f) f.focus();
  }
  function openAddEngagementModal(presetClient){
    if(!data.clients.length){ showToast('Add a client first.'); return; }
    ui.modal = 'add-engagement';
    document.getElementById('modal-root').innerHTML = tplEngagementModal(null, presetClient);
  }
  function openEditEngagementModal(eid){
    var eng = data.engagements.filter(function(e){return e.id===eid;})[0];
    if(!eng) return;
    ui.modal = 'edit-engagement';
    document.getElementById('modal-root').innerHTML = tplEngagementModal(eng, null);
  }
  function closeModal(){ ui.modal = null; document.getElementById('modal-root').innerHTML=''; }

  /* ============================= EVENT HANDLING ============================= */
  function onClick(e){
    if(ui.kpiPopover && !e.target.closest('.kpi-tile')){ ui.kpiPopover=null; renderApp(); }

    var el = e.target.closest('[data-action]');
    if(!el) return;
    var action = el.getAttribute('data-action');

    if(action==='toggle-kpi-popover'){
      var kpiKey = el.getAttribute('data-kpi');
      ui.kpiPopover = (ui.kpiPopover===kpiKey) ? null : kpiKey;
      renderApp();
      return;
    }
    if(action==='set-theme'){ setTheme(el.getAttribute('data-mode')); renderApp(); return; }
    if(action==='logout'){ logout(); return; }
    if(action==='open-add-client'){ openAddClientModal(); return; }
    if(action==='edit-client'){ if(ui.kpiPopover){ ui.kpiPopover=null; } openEditClientModal(el.getAttribute('data-client')); return; }
    if(action==='open-files-link'){ return; }
    if(action==='clear-new-docs'){ setEngagementNewDocs(el.getAttribute('data-eng'), false); return; }
    if(action==='copy-portal-link'){ copyPortalLink(el.getAttribute('data-eng')); return; }
    if(action==='regenerate-portal-link'){ regeneratePortalLink(el.getAttribute('data-eng')); return; }
    if(action==='open-add-engagement'){ openAddEngagementModal(el.getAttribute('data-preset-client')||null); return; }
    if(action==='edit-engagement'){ openEditEngagementModal(el.getAttribute('data-eng')); return; }
    if(action==='close-modal'){
      if(el.classList.contains('modal-overlay')){ if(e.target===el) closeModal(); }
      else { closeModal(); }
      return;
    }
    if(action==='add-contact-row'){
      var wrap = document.getElementById('contact-rows');
      var div = document.createElement('div');
      div.innerHTML = contactRowTpl(wrap.children.length);
      wrap.appendChild(div.firstChild);
      return;
    }
    if(action==='add-ms-row'){
      var mwrap = document.getElementById('ms-rows');
      var mdiv = document.createElement('div');
      mdiv.innerHTML = msRowTpl(mwrap.children.length);
      mwrap.appendChild(mdiv.firstChild);
      return;
    }
    if(action==='add-link-row'){
      var lwrap = document.getElementById('link-rows');
      var ldiv = document.createElement('div');
      ldiv.innerHTML = linkRowTpl(lwrap.children.length);
      lwrap.appendChild(ldiv.firstChild);
      return;
    }
    if(action==='add-cf-row'){
      var cfwrap = document.getElementById('cf-rows');
      var cfdiv = document.createElement('div');
      cfdiv.innerHTML = customFieldRowTpl(cfwrap.children.length);
      cfwrap.appendChild(cfdiv.firstChild);
      return;
    }
    if(action==='remove-row'){
      var row = el.closest('[data-contact-row],[data-ms-row],[data-link-row],[data-cf-row]');
      if(row) row.remove();
      return;
    }
    if(action==='set-view'){ ui.view = el.getAttribute('data-view'); renderApp(); return; }
    if(action==='set-zoom'){ ui.zoom = el.getAttribute('data-zoom'); renderApp(); return; }
    if(action==='toggle-status-filter'){
      var st = el.getAttribute('data-status');
      ui.statusFilter[st] = !ui.statusFilter[st];
      renderApp(); return;
    }
    if(action==='toggle-group'){
      var cid = el.getAttribute('data-client');
      ui.expanded[cid] = ui.expanded[cid]===false ? true : false;
      renderApp(); return;
    }
    if(action==='toggle-roster'){
      var rcid = 'roster_'+el.getAttribute('data-client');
      ui.expanded[rcid] = !ui.expanded[rcid];
      renderApp(); return;
    }
    if(action==='open-drawer'){
      ui.kpiPopover=null;
      openDrawer(el.getAttribute('data-eng')); return;
    }
    if(action==='close-drawer'){
      if(el.classList.contains('overlay')){ if(e.target===el) closeDrawer(); }
      else { closeDrawer(); }
      return;
    }
    if(action==='open-notes-popup'){
      if(ui.kpiPopover){ ui.kpiPopover=null; }
      var wantEdit = el.getAttribute('data-notes-edit')==='1';
      openNotesPopup(el.getAttribute('data-eng'), wantEdit);
      return;
    }
    if(action==='notes-float-close'){ closeNotesPopup(); return; }
    if(action==='notes-float-edit'){ if(ui.notesPopup){ ui.notesPopup.editing=true; renderNotesPopup(); } return; }
    if(action==='notes-float-cancel'){ if(ui.notesPopup){ ui.notesPopup.editing=false; renderNotesPopup(); } return; }
    if(action==='notes-float-save'){ saveNotesFromPopup(); return; }
    if(action==='toggle-ms'){ toggleMilestone(el.getAttribute('data-eng'), el.getAttribute('data-ms')); return; }
    if(action==='delete-ms'){ deleteMilestone(el.getAttribute('data-eng'), el.getAttribute('data-ms')); return; }
    if(action==='set-status'){ setEngagementStatus(el.getAttribute('data-eng'), el.getAttribute('data-status')); return; }
    if(action==='delete-engagement'){
      var eid = el.getAttribute('data-eng');
      if(ui.confirmDeleteEng===eid){ deleteEngagement(eid); closeDrawer(); ui.confirmDeleteEng=null; }
      else { ui.confirmDeleteEng = eid; renderDrawer(); }
      return;
    }
    if(action==='delete-client'){
      var ccid = el.getAttribute('data-client');
      if(ui.confirmDeleteClient===ccid){ deleteClient(ccid); ui.confirmDeleteClient=null; }
      else { ui.confirmDeleteClient = ccid; renderApp(); }
      return;
    }
    if(action==='export-outlook'){ exportOutlookCSV(null); return; }
    if(action==='export-eng-ics'){ exportOutlookCSV(el.getAttribute('data-eng')); return; }
    if(action==='export-excel'){ exportRosterCSV(); return; }
    if(action==='toggle-roundup'){ ui.roundupCollapsed = !ui.roundupCollapsed; renderApp(); return; }
    if(action==='toggle-action-item'){ toggleActionItemDone(el.getAttribute('data-action-id')); return; }
    if(action==='delete-action-item'){ deleteActionItem(el.getAttribute('data-action-id')); return; }
  }

  function onSubmit(e){
    var form = e.target.closest('[data-action-submit]');
    if(!form) return;
    e.preventDefault();
    var action = form.getAttribute('data-action-submit');
    var fd = new FormData(form);

    if(action==='add-client' || action==='edit-client'){
      var names = fd.getAll('contact-name[]'), titles = fd.getAll('contact-title[]'), emails = fd.getAll('contact-email[]'), phones = fd.getAll('contact-phone[]');
      var contacts = [];
      names.forEach(function(n,i){
        if(!n && !titles[i] && !emails[i] && !phones[i]) return;
        contacts.push({id:uid('ct'), name:n||'(Unnamed contact)', title:titles[i]||'', email:emails[i]||'', phone:phones[i]||'', primary: i===0});
      });
      if(action==='add-client'){
        var client = {
          id: uid('c'),
          name: fd.get('client-name'),
          industry: fd.get('client-industry')||'',
          status: fd.get('client-status')||'Active',
          notes: fd.get('client-notes')||'',
          filesUrl: (fd.get('client-files-url')||'').trim(),
          contacts: contacts
        };
        addClient(client);
        closeModal();
        showToast('Client added.');
      } else {
        var cid = form.getAttribute('data-client-id');
        var existing = clientById(cid);
        if(existing){
          existing.name = fd.get('client-name');
          existing.industry = fd.get('client-industry')||'';
          existing.status = fd.get('client-status')||'Active';
          existing.notes = fd.get('client-notes')||'';
          existing.filesUrl = (fd.get('client-files-url')||'').trim();
          existing.contacts = contacts;
          persist();
        }
        closeModal();
        showToast('Client updated.');
      }
      return;
    }
    if(action==='add-engagement'){
      var mnames = fd.getAll('ms-name[]'), mdates = fd.getAll('ms-date[]');
      var milestones = [];
      mnames.forEach(function(n,i){
        if(n && mdates[i]) milestones.push({id:uid('m'), name:n, date:mdates[i], done:false});
      });
      milestones.sort(function(a,b){ return a.date<b.date?-1:1; });
      var eng = {
        id: uid('e'),
        clientId: fd.get('eng-client'),
        title: fd.get('eng-title'),
        type: fd.get('eng-type')||'Implementation',
        owner: fd.get('eng-owner'),
        start: fd.get('eng-start'),
        end: fd.get('eng-end'),
        status: fd.get('eng-status')||'not-started',
        progress: parseInt(fd.get('eng-progress'),10)||0,
        milestones: milestones,
        links: readLinksFromForm(fd),
        customFields: readCustomFieldsFromForm(fd),
        notes: (fd.get('eng-notes')||'').trim(),
        newDocsAt: null
      };
      if(eng.end < eng.start){ showToast('End date must be after the start date.'); return; }
      addEngagement(eng);
      closeModal();
      showToast('Engagement created.');
      return;
    }
    if(action==='edit-engagement'){
      var eeid = form.getAttribute('data-eng-id');
      var existingEng = data.engagements.filter(function(e){return e.id===eeid;})[0];
      if(existingEng){
        var newStart = fd.get('eng-start'), newEnd = fd.get('eng-end');
        if(newEnd < newStart){ showToast('End date must be after the start date.'); return; }
        existingEng.clientId = fd.get('eng-client');
        existingEng.title = fd.get('eng-title');
        existingEng.type = fd.get('eng-type')||'Implementation';
        existingEng.owner = fd.get('eng-owner');
        existingEng.start = newStart;
        existingEng.end = newEnd;
        existingEng.status = fd.get('eng-status')||existingEng.status;
        existingEng.progress = parseInt(fd.get('eng-progress'),10)||0;
        existingEng.links = readLinksFromForm(fd);
        existingEng.customFields = readCustomFieldsFromForm(fd);
        existingEng.notes = (fd.get('eng-notes')||'').trim();
        persist();
      }
      closeModal();
      showToast('Engagement updated.');
      return;
    }
    if(action==='add-ms'){
      var eid = form.getAttribute('data-eng');
      var name = fd.get('ms-name'), dt = fd.get('ms-date');
      if(name && dt){ addMilestoneToEngagement(eid, name, dt); form.reset(); }
      return;
    }
    if(action==='quick-add-action'){
      var qaTitle = (fd.get('qa-title')||'').trim();
      var qaDate = fd.get('qa-date') || toISO(TODAY);
      if(!qaTitle) return;
      addActionItem({
        id: uid('a'),
        type: fd.get('qa-type') || 'meeting',
        title: qaTitle,
        clientId: fd.get('qa-client') || null,
        date: qaDate,
        notes: '',
        done: false
      });
      showToast('Added to your roundup.');
      return;
    }
  }

  function onInput(e){
    if(e.target.id==='search-input'){
      ui.search = e.target.value;
      preserveFocus(renderApp);
      return;
    }
    if(e.target.id==='progress-range'){
      var lbl = document.getElementById('progress-live-label');
      if(lbl) lbl.textContent = e.target.value + '%';
      return;
    }
  }
  function onChange(e){
    if(e.target.id==='progress-range'){
      var eid = ui.drawerEngId;
      if(eid) setEngagementProgress(eid, parseInt(e.target.value,10));
      return;
    }
    if(e.target.getAttribute && e.target.getAttribute('data-action')==='owner-filter'){
      ui.ownerFilter = e.target.value; renderApp(); return;
    }
    if(e.target.getAttribute && e.target.getAttribute('data-action')==='toggle-file-reviewed'){
      toggleFileReviewed(e.target.getAttribute('data-eng'), e.target.getAttribute('data-file'), e.target.checked);
      return;
    }
  }

  /* ---- tooltips for bars / milestones ---- */
  function onMouseOver(e){
    var alertBadge = e.target.closest('[data-tooltip-alert]');
    var bar = e.target.closest('[data-tooltip-eng]');
    var marker = e.target.closest('.ms-marker');
    var tip = document.getElementById('tooltip');
    if(alertBadge){
      var engA = data.engagements.filter(function(x){return x.id===alertBadge.getAttribute('data-tooltip-alert');})[0];
      if(!engA) return;
      var a = engagementAlert(engA);
      if(!a) return;
      tip.innerHTML = '<b style="color:var('+a.colorVar+')">'+esc(a.label)+'</b>'+esc(engA.title);
      tip.hidden = false;
      positionTooltip(e);
    } else if(bar){
      var eng = data.engagements.filter(function(x){return x.id===bar.getAttribute('data-tooltip-eng');})[0];
      if(!eng) return;
      var client = clientById(eng.clientId);
      var alertLine = '';
      var al = engagementAlert(eng);
      if(al) alertLine = '<br><span style="color:var('+al.colorVar+')">'+icon(al.icon,'',10)+' '+esc(al.label)+'</span>';
      tip.innerHTML = '<b>'+esc(eng.title)+'</b>' + esc(client?client.name:'') + ' · ' + esc(eng.owner||'') + '<br>' + fmtDateShort(parseDate(eng.start)) + ' – ' + fmtDateShort(parseDate(eng.end)) + ' · ' + (eng.progress||0) + '% complete' + alertLine;
      tip.hidden = false;
      positionTooltip(e);
    } else if(marker){
      var eid2 = marker.getAttribute('data-eng'), mid2 = marker.getAttribute('data-ms');
      var eng2 = data.engagements.filter(function(x){return x.id===eid2;})[0];
      if(!eng2) return;
      var ms = (eng2.milestones||[]).filter(function(m){return m.id===mid2;})[0];
      if(!ms) return;
      var stat = msStatus(ms);
      tip.innerHTML = '<b>'+esc(ms.name)+'</b>' + fmtDate(parseDate(ms.date)) + ' · ' + (stat==='done'?'Completed':(stat==='overdue'?'Missed — overdue':'Upcoming'));
      tip.hidden = false;
      positionTooltip(e);
    }
  }
  function onMouseMove(e){
    var tip = document.getElementById('tooltip');
    if(!tip.hidden) positionTooltip(e);
  }
  function onMouseOut(e){
    if(e.target.closest('[data-tooltip-eng]') || e.target.closest('.ms-marker') || e.target.closest('[data-tooltip-alert]')){
      document.getElementById('tooltip').hidden = true;
    }
  }
  function positionTooltip(e){
    var tip = document.getElementById('tooltip');
    var x = e.clientX + 14, y = e.clientY + 16;
    var vw = window.innerWidth, vh = window.innerHeight;
    tip.style.left = Math.min(x, vw-270) + 'px';
    tip.style.top = Math.min(y, vh-80) + 'px';
  }

  function onKeydown(e){
    if(e.key==='Escape'){
      if(ui.modal){ closeModal(); }
      else if(ui.notesPopup){ closeNotesPopup(); }
      else if(ui.drawerEngId){ closeDrawer(); }
    }
  }

  /* ============================= INIT ============================= */
  document.addEventListener('click', onClick);
  document.addEventListener('submit', onSubmit);
  document.addEventListener('input', onInput);
  document.addEventListener('change', onChange);
  document.addEventListener('mouseover', onMouseOver);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseout', onMouseOut);
  document.addEventListener('keydown', onKeydown);

  renderApp();
  initApp();
  setInterval(tickClock, 1000);
})();
