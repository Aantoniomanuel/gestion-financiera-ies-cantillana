// ── CHAT IA (Pollinations · sin registro) ────────────────
(function(){

var CHAT_HISTORY = [];  // {role:'user'|'assistant', content:'...'}
var chatOpen = false;
var chatTyping = false;

var SYSTEM_PROMPT = 'Eres un asistente de estudio para el módulo profesional de Gestión Financiera del CFGS de Administración y Finanzas del IES Cantillana (Sevilla). ' +
  'Tu misión es ayudar a los alumnos a entender los contenidos del módulo: necesidades de financiación, productos financieros (préstamos, hipotecas, leasing, renting, factoring), ' +
  'seguros, inversiones (renta fija, variable, fondos), análisis bursátil, presupuestos, estados financieros y planificación económica empresarial. ' +
  'También puedes responder dudas generales de economía, administración y finanzas. ' +
  'Responde siempre en español, de forma clara y didáctica, con ejemplos prácticos cuando sea útil. ' +
  'Si la pregunta no tiene relación con el estudio o las finanzas, indícalo amablemente y redirige hacia el temario. ' +
  'Usa un tono cercano y motivador, apropiado para estudiantes de FP.';

var SUGERENCIAS_INICIO = [
  '¿Qué es el leasing?',
  '¿Cómo funciona la bolsa?',
  'Explícame el VAN y el TIR',
  '¿Qué diferencia hay entre renta fija y variable?'
];

function chatInit(){
  var msgs = document.getElementById('chat-msgs');
  if(!msgs) return;
  if(msgs.children.length === 0){
    // Mensaje de bienvenida
    var who = (typeof USUARIO_ACTUAL !== 'undefined' && USUARIO_ACTUAL)
      ? (USUARIO_ACTUAL.nombre || USUARIO_ACTUAL.email.split('@')[0])
      : '';
    var saludo = who ? '¡Hola, ' + who + '! ' : '¡Hola! ';
    chatAddMsg('ai', saludo + 'Soy tu asistente de Gestión Financiera. Puedo ayudarte con dudas del módulo, conceptos financieros o ejercicios. ¿En qué estás trabajando?');
    chatSugerencias(SUGERENCIAS_INICIO);
  }
}

function chatToggle(){
  chatOpen = !chatOpen;
  var panel = document.getElementById('chat-panel');
  var badge = document.getElementById('chat-badge');
  if(chatOpen){
    panel.classList.add('open');
    badge.style.display = 'none';
    chatInit();
    setTimeout(function(){
      var inp = document.getElementById('chat-input');
      if(inp) inp.focus();
      chatScrollBottom();
    }, 60);
  } else {
    panel.classList.remove('open');
  }
}

function chatScrollBottom(){
  var msgs = document.getElementById('chat-msgs');
  if(msgs) msgs.scrollTop = msgs.scrollHeight;
}

function chatAddMsg(role, text){
  var msgs = document.getElementById('chat-msgs');
  if(!msgs) return null;
  var div = document.createElement('div');
  div.className = 'cm ' + role;
  if(role === 'ai'){
    div.innerHTML = '<div class="cm-label">Asistente</div>' + chatFormatText(text);
  } else {
    div.textContent = text;
  }
  msgs.appendChild(div);
  chatScrollBottom();
  return div;
}

function chatFormatText(text){
  // Negrita **texto**, código `code`, saltos de línea
  return text
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/`([^`]+)`/g,'<code style="background:#f3f4f6;padding:1px 4px;border-radius:4px;font-size:12px;font-family:monospace">$1</code>')
    .replace(/\n/g,'<br>');
}

function chatTypingStart(){
  var msgs = document.getElementById('chat-msgs');
  if(!msgs) return null;
  var div = document.createElement('div');
  div.className = 'cm ai typing';
  div.id = 'chat-typing-indicator';
  div.innerHTML = '<div class="cm-label">Asistente</div><span><i></i><i></i><i></i></span>';
  msgs.appendChild(div);
  chatScrollBottom();
  return div;
}

function chatTypingEnd(){
  var el = document.getElementById('chat-typing-indicator');
  if(el) el.remove();
}

function chatSugerencias(list){
  var sug = document.getElementById('chat-suggest');
  if(!sug) return;
  sug.innerHTML = '';
  list.slice(0,4).forEach(function(s){
    var btn = document.createElement('button');
    btn.className = 'cs-btn';
    btn.textContent = s;
    btn.onclick = function(){ chatEnviarTexto(s); };
    sug.appendChild(btn);
  });
}

function chatClear(){
  CHAT_HISTORY = [];
  var msgs = document.getElementById('chat-msgs');
  var sug = document.getElementById('chat-suggest');
  if(msgs) msgs.innerHTML = '';
  if(sug) sug.innerHTML = '';
  chatInit();
}

function chatKey(e){
  if(e.key === 'Enter' && !e.shiftKey){
    e.preventDefault();
    chatSend();
  }
}

function chatResize(el){
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 90) + 'px';
}

function chatSend(){
  var inp = document.getElementById('chat-input');
  if(!inp) return;
  var text = inp.value.trim();
  if(!text || chatTyping) return;
  inp.value = '';
  inp.style.height = 'auto';
  chatEnviarTexto(text);
}

function chatEnviarTexto(text){
  if(chatTyping) return;
  // Limpiar sugerencias
  var sug = document.getElementById('chat-suggest');
  if(sug) sug.innerHTML = '';

  chatAddMsg('user', text);
  CHAT_HISTORY.push({role:'user', content: text});

  chatTyping = true;
  document.getElementById('chat-send').disabled = true;
  chatTypingStart();

  // Construir mensajes para la API
  var messages = CHAT_HISTORY.slice(-12); // máximo 12 turnos de contexto

  // Pollinations AI — modelo mistral, sin auth
  var payload = {
    model: 'openai',
    messages: [{role:'system', content: SYSTEM_PROMPT}].concat(messages),
    seed: Math.floor(Math.random()*9999)
  };

  fetch('https://text.pollinations.ai/openai', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  })
  .then(function(r){
    if(!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  })
  .then(function(data){
    chatTypingEnd();
    var reply = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content)
      ? data.choices[0].message.content.trim()
      : 'Lo siento, no he podido generar una respuesta. Inténtalo de nuevo.';
    CHAT_HISTORY.push({role:'assistant', content: reply});
    chatAddMsg('ai', reply);
    // Sugerencias de seguimiento
    chatSugerenciasContexto(text);
  })
  .catch(function(err){
    chatTypingEnd();
    chatAddMsg('ai', 'Ha habido un problema de conexión. Comprueba tu internet e inténtalo de nuevo.');
    console.error('[Chat IA]', err);
  })
  .finally(function(){
    chatTyping = false;
    var sendBtn = document.getElementById('chat-send');
    if(sendBtn) sendBtn.disabled = false;
    var inp = document.getElementById('chat-input');
    if(inp) inp.focus();
  });
}

function chatSugerenciasContexto(pregunta){
  var p = pregunta.toLowerCase();
  var sug = [];
  if(p.includes('préstam') || p.includes('hipotec') || p.includes('cuota')){
    sug = ['¿Qué es el TAE?','Diferencia préstamo vs hipoteca','¿Cómo se calcula la cuota mensual?','¿Qué es el período de carencia?'];
  } else if(p.includes('bolsa') || p.includes('accion') || p.includes('bursátil')){
    sug = ['¿Qué es el PER?','¿Cómo se lee una vela japonesa?','¿Qué es el IBEX 35?','Diferencia entre OPA y OPV'];
  } else if(p.includes('seguro')){
    sug = ['¿Qué es la prima de seguro?','Tipos de seguros empresariales','¿Qué cubre el seguro de vida?','¿Qué es la franquicia?'];
  } else if(p.includes('van') || p.includes('tir') || p.includes('inversion') || p.includes('inversión')){
    sug = ['¿Cuándo es rentable una inversión?','Diferencia VAN vs TIR','¿Qué es el payback?','¿Qué es el coste de capital?'];
  } else if(p.includes('presupuest')){
    sug = ['¿Qué es el presupuesto de tesorería?','Tipos de presupuestos empresariales','¿Cómo se hace una previsión de ventas?'];
  } else {
    sug = ['Dame un ejemplo práctico','¿Puedes resumirlo?','¿Cómo cae esto en el examen?','¿Qué más debo saber sobre esto?'];
  }
  chatSugerencias(sug);
}

// Exponer globalmente
window.chatToggle = chatToggle;
window.chatSend = chatSend;
window.chatClear = chatClear;
window.chatKey = chatKey;
window.chatResize = chatResize;

})();


// == MODO OSCURO ==============================================
function toggleDark(){
  var isDark = document.body.classList.toggle('dark');
  localStorage.setItem('gf_dark', isDark ? '1' : '0');
  var btn = document.getElementById('btn-dark');
  if(btn) btn.textContent = isDark ? 'Sol Modo claro' : 'Luna Modo oscuro';
}
// Aplicar al cargar
(function(){
  if(localStorage.getItem('gf_dark')==='1') document.body.classList.add('dark');
})();

// == BUSCADOR ==================================================
function searchOpen(){
  document.getElementById('search-modal').classList.add('open');
  setTimeout(function(){ document.getElementById('search-q').focus(); }, 60);
}
function searchClose(){
  document.getElementById('search-modal').classList.remove('open');
  document.getElementById('search-q').value = '';
  document.getElementById('search-results').innerHTML = '<div class="sr-empty">Empieza a escribir para buscar&#x2026;</div>';
}
function searchKey(e){
  if(e.key === 'Escape') searchClose();
}

function searchHighlight(text, q){
  if(!q) return text;
  var re = new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi');
  return text.replace(re,'<mark>$1</mark>');
}

function searchRun(q){
  var res = document.getElementById('search-results');
  q = (q||'').trim();
  if(q.length < 2){
    res.innerHTML = '<div class="sr-empty">Empieza a escribir para buscar&#x2026;</div>';
    return;
  }
  var ql = q.toLowerCase();
  var items = [];

  // Bloques/Unidades
  UNIDADES.forEach(function(u){
    if(u.titulo.toLowerCase().indexOf(ql)>=0){
      items.push({type:'bloque', ico:'&#x1F4D6;', tag:'Bloque B'+u.n,
        title: u.titulo, sub: u.horas+'h &middot; '+u.n+' bloque',
        action: function(){ goTo(u.id, null); }});
    }
  });

  // Glosario
  Object.keys(GLOSARIO_DATA).forEach(function(udId){
    var ud = UNIDADES.find(function(u){ return u.id===udId; });
    (GLOSARIO_DATA[udId]||[]).forEach(function(g){
      if(!g.termino) return;
      if(g.termino.toLowerCase().indexOf(ql)>=0 || (g.definicion||'').toLowerCase().indexOf(ql)>=0){
        items.push({type:'glosario', ico:'&#x1F4DA;', tag:'Glosario &middot; B'+(ud?ud.n:''),
          title: g.termino, sub: g.definicion ? g.definicion.slice(0,90)+'&#x2026;' : 'Sin definici&#xF3;n',
          action: function(){ goTo(udId, null); }});
      }
    });
  });

  // Actividades de aprendizaje
  Object.keys(ACT_APRENDIZAJE).forEach(function(udId){
    var ud = UNIDADES.find(function(u){ return u.id===udId; });
    (ACT_APRENDIZAJE[udId]||[]).forEach(function(a){
      if(a.titulo.toLowerCase().indexOf(ql)>=0 || (a.desc||'').toLowerCase().indexOf(ql)>=0){
        items.push({type:'actividad', ico:'&#x1F4DD;', tag:'Actividad &middot; B'+(ud?ud.n:''),
          title: a.titulo, sub: a.desc||'',
          action: function(){ goTo(udId, null); }});
      }
    });
  });

  // Actividades evaluables
  Object.keys(ACT_EVAL).forEach(function(udId){
    var ud = UNIDADES.find(function(u){ return u.id===udId; });
    (ACT_EVAL[udId]||[]).forEach(function(a){
      if(a.titulo.toLowerCase().indexOf(ql)>=0){
        items.push({type:'evaluable', ico:'&#x1F3AF;', tag:'Evaluable &middot; B'+(ud?ud.n:''),
          title: a.titulo, sub: a.peso ? a.peso+'% ponderaci&#xF3;n' : '',
          action: function(){ goTo('evaluacion', null); }});
      }
    });
  });

  if(!items.length){
    res.innerHTML = '<div class="sr-empty">Sin resultados para <strong>'+q+'</strong></div>';
    return;
  }

  res.innerHTML = items.slice(0,12).map(function(it, idx){
    return '<div class="sr-item" data-idx="'+idx+'">'+
      '<div class="sr-ico '+it.type+'">'+it.ico+'</div>'+
      '<div>'+
        '<div class="sr-tag">'+it.tag+'</div>'+
        '<div class="sr-title">'+searchHighlight(it.title, q)+'</div>'+
        (it.sub?'<div class="sr-sub">'+searchHighlight(it.sub.slice(0,80), q)+'</div>':'')+
      '</div>'+
    '</div>';
  }).join('');

  // Bind clicks
  res.querySelectorAll('.sr-item').forEach(function(el){
    var idx = parseInt(el.getAttribute('data-idx'));
    el.addEventListener('click', function(){
      searchClose();
      items[idx].action();
    });
  });
}

window.searchOpen  = searchOpen;
window.searchClose = searchClose;
window.searchKey   = searchKey;
window.searchRun   = searchRun;
window.toggleDark  = toggleDark;


