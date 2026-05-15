// ══════════════════════════════════════════════════════
//  SECCIÓN CONTENIDOS — Estructura del Módulo
//  Gestiona: bloques, unidades por bloque, temas y RA
//  NO toca la sección de Evaluación (RA_CE_DATA)
// ══════════════════════════════════════════════════════

// Estructura de bloques: cada bloque agrupa una o varias UDs
// Los bloques se derivan de UNIDADES pero con agrupación manual
// Guardamos la agrupación en localStorage
var BLOQUES_KEY = 'gf_bloques_estructura';

function getBloques(){
  try{ return JSON.parse(localStorage.getItem(BLOQUES_KEY)||'null'); } catch(e){ return null; }
}
function saveBloques(b){ localStorage.setItem(BLOQUES_KEY, JSON.stringify(b)); }

function initBloques(){
  // Si no hay estructura guardada, o está desactualizada, regenerarla
  var saved = getBloques();
  if(saved){
    // Validar que los udIds del primer bloque siguen existiendo en UNIDADES
    var primerUdId = saved[0] && saved[0].udIds && saved[0].udIds[0];
    if(primerUdId && UNIDADES.find(function(u){ return u.id===primerUdId; })){
      return saved; // datos válidos
    }
    // Datos obsoletos — regenerar
  }
  // Estructura por defecto: cada UNIDAD es un bloque, excepto ud2 que agrupa ud2+ud3
  // (refleja la distribución real del módulo)
  var bloques = [
    { id:'bloque1', titulo:'Bloque 1 · Necesidades de Financiación', color:'#1a2744', udIds:['ud1'] },
    { id:'bloque2', titulo:'Bloque 2-3 · Clasifica y Evalúa Productos Financieros', color:'#1e3a5f', udIds:['ud2'] },
    { id:'bloque3', titulo:'Bloque 4 · Los Seguros', color:'#2d4a7a', udIds:['ud3'] },
    { id:'bloque4', titulo:'Bloque 5 · Inversiones', color:'#1a6b4a', udIds:['ud4'] },
    { id:'bloque5', titulo:'Bloque 6 · Presupuestos', color:'#7c3200', udIds:['ud5'] },
  ];
  saveBloques(bloques);
  return bloques;
}

function initContenidos(){
  var root = document.getElementById('contenidos-root');
  if(!root) return;
  root.innerHTML = '';
  renderContenidos(root);
}

function renderContenidos(root){
  root.innerHTML = '';
  var bloques = initBloques();

  // ── Cabecera ──────────────────────────────────────────
  var ph = document.createElement('div'); ph.className='ph';
  var phLeft = document.createElement('div');
  phLeft.innerHTML =
    '<h1 class="pt">Estructura del Módulo</h1>'+
    '<p class="ps">Gestiona bloques, unidades didácticas, temas y vinculación con RA · El contenido de cada tema se edita desde los Bloques del módulo</p>';
  var phBtns = document.createElement('div'); phBtns.style.cssText='display:flex;gap:8px';
  var btnNuevoBloque = document.createElement('button'); btnNuevoBloque.className='btn btn-p';
  btnNuevoBloque.innerHTML='+ Nuevo bloque';
  btnNuevoBloque.onclick=function(){ abrirModalNuevoBloque(bloques, root); };
  phBtns.appendChild(btnNuevoBloque);
  ph.appendChild(phLeft); ph.appendChild(phBtns);
  root.appendChild(ph);

  // ── Stats ─────────────────────────────────────────────
  var totalUDs = UNIDADES.length;
  var totalHoras = UNIDADES.reduce(function(s,u){ return s+u.horas; },0);
  var allRA = getAllRA();
  var totalTemas = UNIDADES.reduce(function(s,u){ return s+(u.temas||[]).length; },0);

  var statsWrap = document.createElement('div'); statsWrap.className='grid-s'; statsWrap.style.marginBottom='1.5rem';
  [{ico:'🗂',label:'Bloques',val:bloques.length},{ico:'📚',label:'Unidades didácticas',val:totalUDs},
   {ico:'⏱',label:'Horas totales',val:totalHoras},{ico:'📝',label:'Temas',val:totalTemas},
   {ico:'🎯',label:'RA vinculados',val:allRA.length}
  ].forEach(function(s){
    var sc=document.createElement('div'); sc.className='sc';
    sc.innerHTML='<div class="sl">'+s.ico+' '+s.label+'</div><div class="sn" style="font-size:20px">'+s.val+'</div>';
    statsWrap.appendChild(sc);
  });
  root.appendChild(statsWrap);

  // ── Aviso pedagógico ──────────────────────────────────
  var aviso = document.createElement('div');
  aviso.style.cssText='padding:10px 14px;background:#f0f4ff;border-radius:var(--r);border-left:3px solid #3730a3;font-size:13px;color:#3730a3;margin-bottom:1.5rem';
  aviso.innerHTML='<strong>ℹ️ Recuerda:</strong> Aquí gestionas la estructura (bloques, unidades, temas y RA). Para añadir apuntes, fórmulas o vídeos a cada tema, ve a <strong>Bloques del módulo</strong> en el menú lateral.';
  root.appendChild(aviso);

  // ── Lista de bloques ──────────────────────────────────
  bloques.forEach(function(bloque, bIdx){
    root.appendChild(renderBloqueCard(bloque, bIdx, bloques, root));
  });
}

function renderBloqueCard(bloque, bIdx, bloques, root){
  var card = document.createElement('div'); card.className='card';
  card.style.cssText='margin-bottom:16px;border-left:5px solid '+bloque.color+';padding:0;overflow:visible';

  // ── Cabecera del bloque ───────────────────────────────
  var bHdr = document.createElement('div');
  bHdr.style.cssText='display:flex;align-items:center;gap:12px;padding:14px 16px;background:'+bloque.color+';border-radius:calc(var(--rl) - 1px) calc(var(--rl) - 1px) 0 0';

  var bTit = document.createElement('div'); bTit.style.cssText='flex:1;font-family:"Playfair Display",serif;font-size:15px;font-weight:700;color:#fff';
  bTit.textContent = bloque.titulo;

  var bBtns = document.createElement('div'); bBtns.style.cssText='display:flex;gap:6px';

  var btnEditBloque = document.createElement('button');
  btnEditBloque.style.cssText='background:rgba(255,255,255,.15);border:none;color:#fff;border-radius:7px;padding:5px 12px;cursor:pointer;font-size:12px;font-weight:600';
  btnEditBloque.textContent='✎ Editar bloque';
  btnEditBloque.onclick=(function(b,bi){ return function(){ abrirModalEditarBloque(b, bi, bloques, root); }; })(bloque, bIdx);

  var btnAddUD = document.createElement('button');
  btnAddUD.style.cssText='background:rgba(255,255,255,.2);border:none;color:#fff;border-radius:7px;padding:5px 12px;cursor:pointer;font-size:12px;font-weight:600';
  btnAddUD.textContent='+ UD';
  btnAddUD.onclick=(function(b,bi){ return function(){ abrirModalNuevaUD(b, bi, bloques, root); }; })(bloque, bIdx);

  var btnDelBloque = document.createElement('button');
  btnDelBloque.style.cssText='background:rgba(220,38,38,.4);border:none;color:#fff;border-radius:7px;padding:5px 10px;cursor:pointer;font-size:12px';
  btnDelBloque.textContent='✕';
  btnDelBloque.onclick=(function(bi){ return function(){
    if(!confirm('¿Eliminar este bloque? Las unidades didácticas que contiene permanecerán en el módulo pero sin bloque asignado.')) return;
    bloques.splice(bi, 1);
    saveBloques(bloques);
    renderContenidos(root);
  }; })(bIdx);

  bBtns.appendChild(btnEditBloque); bBtns.appendChild(btnAddUD); bBtns.appendChild(btnDelBloque);
  bHdr.appendChild(bTit); bHdr.appendChild(bBtns);
  card.appendChild(bHdr);

  // ── Unidades del bloque ───────────────────────────────
  var udsWrap = document.createElement('div'); udsWrap.style.cssText='padding:12px 16px';

  var udIds = bloque.udIds || [];
  if(!udIds.length){
    var empty = document.createElement('div');
    empty.style.cssText='font-size:13px;color:var(--muted);padding:12px 0;text-align:center';
    empty.textContent='Sin unidades didácticas. Pulsa "+ UD" para añadir una.';
    udsWrap.appendChild(empty);
  }

  udIds.forEach(function(udId, udIdx){
    var u = UNIDADES.find(function(x){ return x.id===udId; });
    if(!u) return;
    udsWrap.appendChild(renderUDEnBloque(u, udIdx, bloque, bIdx, bloques, root));
  });

  card.appendChild(udsWrap);
  return card;
}

function renderUDEnBloque(u, udIdx, bloque, bIdx, bloques, root){
  var raData = getRADeUD(u.id);
  var wrap = document.createElement('div');
  wrap.style.cssText='border:1px solid var(--border);border-radius:var(--r);padding:12px 14px;margin-bottom:10px;background:var(--surface)';

  // Cabecera UD
  var udHdr = document.createElement('div'); udHdr.style.cssText='display:flex;align-items:flex-start;gap:10px;margin-bottom:10px';

  var udNum = document.createElement('div');
  udNum.style.cssText='width:34px;height:34px;border-radius:8px;background:var(--navy);color:var(--gold-light);display:flex;align-items:center;justify-content:center;font-family:"Playfair Display",serif;font-size:15px;font-weight:700;flex-shrink:0';
  udNum.textContent = u.n;

  var udInfo = document.createElement('div'); udInfo.style.flex='1';
  udInfo.innerHTML=
    '<div style="font-size:14px;font-weight:700;color:var(--text)">'+u.titulo+'</div>'+
    '<div style="font-size:12px;color:var(--muted);margin-top:2px">'+u.horas+' horas · '+
      (raData.length ? raData.map(function(r){ return '<span style="background:#f0f4ff;color:#3730a3;padding:1px 6px;border-radius:10px;font-size:10px;font-weight:600;margin-right:3px">'+r.id+'</span>'; }).join('') : '<span style="color:var(--muted);font-size:11px">Sin RA vinculados</span>')+
    '</div>';

  var udBtns = document.createElement('div'); udBtns.style.cssText='display:flex;gap:5px;flex-shrink:0';

  var btnEditUD = document.createElement('button'); btnEditUD.className='btn btn-g btn-sm';
  btnEditUD.textContent='✎ Editar UD';
  btnEditUD.onclick=(function(uid){ return function(){ abrirModalEditarUDContenidos(uid, bloques, root); }; })(u.id);

  var btnRA = document.createElement('button'); btnRA.className='btn btn-g btn-sm';
  btnRA.style.cssText='background:'+(raData.length?'var(--green-bg)':'var(--amber-bg)')+';color:'+(raData.length?'var(--green)':'var(--amber)')+';border-color:'+(raData.length?'#bbf7d0':'#fde68a');
  btnRA.innerHTML='🎯 RA ('+raData.length+')';
  btnRA.onclick=(function(uid){ return function(){ abrirModalVincularRA(uid, bloques, root); }; })(u.id);

  var btnVerUD = document.createElement('button'); btnVerUD.className='btn btn-p btn-sm';
  btnVerUD.textContent='→ Ver bloque';
  btnVerUD.onclick=(function(uid){ return function(){ goTo(uid, null); }; })(u.id);

  var btnQuitarUD = document.createElement('button'); btnQuitarUD.className='btn btn-d btn-sm';
  btnQuitarUD.title='Quitar del bloque';
  btnQuitarUD.textContent='✕';
  btnQuitarUD.onclick=(function(bi,uidToRemove){ return function(){
    if(!confirm('¿Quitar esta UD del bloque? La UD no se elimina, solo se desvincula del bloque.')) return;
    bloques[bi].udIds = bloques[bi].udIds.filter(function(id){ return id!==uidToRemove; });
    saveBloques(bloques);
    renderContenidos(root);
  }; })(bIdx, u.id);

  [btnEditUD, btnRA, btnVerUD, btnQuitarUD].forEach(function(b){ udBtns.appendChild(b); });
  udHdr.appendChild(udNum); udHdr.appendChild(udInfo); udHdr.appendChild(udBtns);
  wrap.appendChild(udHdr);

  // Descripción
  if(u.desc){
    var descEl = document.createElement('div');
    descEl.style.cssText='font-size:12.5px;color:var(--muted);line-height:1.6;margin-bottom:10px;padding:8px 10px;background:var(--surface2);border-radius:var(--r)';
    descEl.textContent = u.desc;
    wrap.appendChild(descEl);
  }

  // Temas
  var temasHdr = document.createElement('div');
  temasHdr.style.cssText='display:flex;align-items:center;justify-content:space-between;margin-bottom:6px';
  temasHdr.innerHTML='<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)">📝 Temas ('+((u.temas||[]).length)+')</div>';

  var btnEditTemas = document.createElement('button'); btnEditTemas.className='btn btn-g btn-sm';
  btnEditTemas.style.fontSize='11px'; btnEditTemas.textContent='✎ Editar temas';
  btnEditTemas.onclick=(function(uid){ return function(){ abrirModalEditarTemas(uid, bloques, root); }; })(u.id);
  temasHdr.appendChild(btnEditTemas);
  wrap.appendChild(temasHdr);

  if(u.temas && u.temas.length){
    var temasWrap = document.createElement('div'); temasWrap.style.cssText='display:flex;flex-wrap:wrap;gap:5px';
    u.temas.forEach(function(t, i){
      var chip = document.createElement('span');
      chip.style.cssText='background:var(--surface2);border:1px solid var(--border);border-radius:20px;padding:3px 10px;font-size:11.5px;color:var(--muted)';
      chip.textContent=(i+1)+'. '+t;
      temasWrap.appendChild(chip);
    });
    wrap.appendChild(temasWrap);
  } else {
    var noTemas = document.createElement('div');
    noTemas.style.cssText='font-size:12px;color:var(--dim);font-style:italic';
    noTemas.textContent='Sin temas definidos. Pulsa "Editar temas" para añadir.';
    wrap.appendChild(noTemas);
  }

  return wrap;
}

// ── Modal: Nuevo bloque ───────────────────────────────
function abrirModalNuevoBloque(bloques, root){
  abrirModal('Nuevo bloque',
    '<div class="fg"><label class="fl">Título del bloque</label>'+
    '<input class="fi" id="nb-titulo" placeholder="Ej: Bloque 7 · Análisis Financiero"></div>'+
    '<div class="fg"><label class="fl">Color identificativo</label>'+
    '<input type="color" id="nb-color" value="#1a2744" style="width:60px;height:36px;border:none;border-radius:6px;cursor:pointer"></div>',
    '<button class="btn btn-g" onclick="cerrarModal()">Cancelar</button>'+
    '<button class="btn btn-p" onclick="guardarNuevoBloque()">Crear bloque</button>'
  );
  window._bloquesRef = bloques;
  window._contenidosRoot = root;
}

function guardarNuevoBloque(){
  var titulo = (document.getElementById('nb-titulo')||{value:''}).value.trim();
  var color  = (document.getElementById('nb-color')||{value:'#1a2744'}).value;
  if(!titulo){ flash('Introduce un título para el bloque','#dc2626'); return; }
  var bloques = window._bloquesRef;
  bloques.push({ id:'bloque'+Date.now(), titulo:titulo, color:color, udIds:[] });
  saveBloques(bloques);
  cerrarModal();
  renderContenidos(window._contenidosRoot);
  flash('Bloque creado','#16a34a');
}

// ── Modal: Editar bloque ──────────────────────────────
function abrirModalEditarBloque(bloque, bIdx, bloques, root){
  // Unidades disponibles para añadir al bloque
  var udsEnBloque = bloque.udIds || [];
  var udsDisponibles = UNIDADES.filter(function(u){
    return !bloques.some(function(b){ return b.udIds && b.udIds.includes(u.id) && b.id!==bloque.id; });
  });
  var udsLibres = UNIDADES.filter(function(u){
    return !bloques.some(function(b){ return b.udIds && b.udIds.includes(u.id); });
  });

  var checkUDs = UNIDADES.map(function(u){
    var enEsteBloque = udsEnBloque.includes(u.id);
    var enOtroBloque = !enEsteBloque && bloques.some(function(b){ return b.id!==bloque.id && b.udIds && b.udIds.includes(u.id); });
    return '<label style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);cursor:'+(enOtroBloque?'not-allowed':'pointer')+'">'+
      '<input type="checkbox" class="eb-ud-chk" value="'+u.id+'"'+(enEsteBloque?' checked':'')+(enOtroBloque?' disabled':'')+' style="width:15px;height:15px">'+
      '<div><div style="font-size:13px;font-weight:600'+(enOtroBloque?';color:var(--dim)':'')+'">'+'B'+u.n+' · '+u.titulo+'</div>'+
      '<div style="font-size:11px;color:var(--muted)">'+u.horas+'h'+(enOtroBloque?' · <em>En otro bloque</em>':'')+'</div></div>'+
    '</label>';
  }).join('');

  abrirModal('Editar bloque',
    '<div class="fg"><label class="fl">Título</label>'+
    '<input class="fi" id="eb-titulo" value="'+bloque.titulo+'"></div>'+
    '<div class="fg"><label class="fl">Color</label>'+
    '<input type="color" id="eb-color" value="'+bloque.color+'" style="width:60px;height:36px;border:none;border-radius:6px;cursor:pointer"></div>'+
    '<div class="fg"><label class="fl" style="margin-bottom:8px">Unidades didácticas incluidas</label>'+
    '<div style="max-height:220px;overflow-y:auto;border:1px solid var(--border);border-radius:var(--r);padding:4px 12px">'+checkUDs+'</div>'+
    '<div style="font-size:11.5px;color:var(--muted);margin-top:5px">Las UDs en otro bloque aparecen desactivadas.</div></div>',
    '<button class="btn btn-g" onclick="cerrarModal()">Cancelar</button>'+
    '<button class="btn btn-p" onclick="guardarEditarBloque()">Guardar</button>'
  );
  document.getElementById('modal').querySelector('.modal').style.maxWidth='600px';
  window._bloqueEditIdx = bIdx;
  window._bloquesRef = bloques;
  window._contenidosRoot = root;
}

function guardarEditarBloque(){
  var titulo = (document.getElementById('eb-titulo')||{value:''}).value.trim();
  var color  = (document.getElementById('eb-color')||{value:'#1a2744'}).value;
  if(!titulo){ flash('El bloque necesita un título','#dc2626'); return; }
  var udIds = [];
  document.querySelectorAll('.eb-ud-chk:checked').forEach(function(c){ udIds.push(c.value); });
  var bloques = window._bloquesRef;
  var bIdx = window._bloqueEditIdx;
  bloques[bIdx].titulo = titulo;
  bloques[bIdx].color  = color;
  bloques[bIdx].udIds  = udIds;
  saveBloques(bloques);
  cerrarModal();
  renderContenidos(window._contenidosRoot);
  flash('Bloque actualizado','#16a34a');
}

// ── Modal: Nueva UD dentro de un bloque ──────────────
function abrirModalNuevaUD(bloque, bIdx, bloques, root){
  // Mostrar UDs libres (no asignadas a ningún bloque)
  var udsLibres = UNIDADES.filter(function(u){
    return !bloques.some(function(b){ return b.udIds && b.udIds.includes(u.id); });
  });

  var optsLibres = udsLibres.length ?
    '<div style="font-size:12px;font-weight:600;color:var(--muted);margin-bottom:8px">Añadir UD existente (sin bloque asignado):</div>'+
    '<div style="max-height:150px;overflow-y:auto;border:1px solid var(--border);border-radius:var(--r);padding:4px 10px;margin-bottom:14px">'+
      udsLibres.map(function(u){
        return '<label style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);cursor:pointer">'+
          '<input type="radio" name="nud-existente" value="'+u.id+'" style="width:14px;height:14px">'+
          '<div><div style="font-size:13px;font-weight:600">B'+u.n+' · '+u.titulo+'</div>'+
          '<div style="font-size:11px;color:var(--muted)">'+u.horas+'h</div></div></label>';
      }).join('')+
    '</div>' : '';

  abrirModal('Añadir Unidad Didáctica al bloque',
    '<div style="font-size:13px;color:var(--muted);margin-bottom:14px">Bloque destino: <strong>'+bloque.titulo+'</strong></div>'+
    optsLibres+
    '<div style="font-size:12px;font-weight:600;color:var(--muted);margin-bottom:8px">O crear nueva UD:</div>'+
    '<div class="g2"><div class="fg"><label class="fl">Número</label>'+
    '<input class="fi" id="nud-n" type="number" min="1" max="30" placeholder="6"></div>'+
    '<div class="fg"><label class="fl">Horas</label>'+
    '<input class="fi" id="nud-horas" type="number" min="1" value="14"></div></div>'+
    '<div class="fg"><label class="fl">Título <span style="color:var(--red)">*</span></label>'+
    '<input class="fi" id="nud-titulo" placeholder="Ej: Análisis de inversiones"></div>'+
    '<div class="fg"><label class="fl">Descripción</label>'+
    '<textarea class="fta" id="nud-desc" rows="2" placeholder="Descripción breve..."></textarea></div>'+
    '<div class="fg"><label class="fl">Temas (uno por línea)</label>'+
    '<textarea class="fta" id="nud-temas" rows="4" placeholder="Concepto 1&#10;Concepto 2"></textarea></div>',
    '<button class="btn btn-g" onclick="cerrarModal()">Cancelar</button>'+
    '<button class="btn btn-p" onclick="guardarNuevaUDEnBloque()">Añadir al bloque</button>'
  );
  document.getElementById('modal').querySelector('.modal').style.maxWidth='600px';
  window._bloqueEditIdx = bIdx;
  window._bloquesRef = bloques;
  window._contenidosRoot = root;
}

function guardarNuevaUDEnBloque(){
  var bloques = window._bloquesRef;
  var bIdx    = window._bloqueEditIdx;
  var root    = window._contenidosRoot;

  // Opción A: añadir UD existente
  var existenteChk = document.querySelector('input[name="nud-existente"]:checked');
  if(existenteChk){
    var udId = existenteChk.value;
    if(!bloques[bIdx].udIds.includes(udId)){
      bloques[bIdx].udIds.push(udId);
      saveBloques(bloques);
    }
    cerrarModal();
    renderContenidos(root);
    flash('UD añadida al bloque','#16a34a');
    return;
  }

  // Opción B: crear nueva UD
  var n     = parseInt((document.getElementById('nud-n')||{value:''}).value);
  var horas = parseInt((document.getElementById('nud-horas')||{value:'14'}).value)||14;
  var titulo= (document.getElementById('nud-titulo')||{value:''}).value.trim();
  var desc  = (document.getElementById('nud-desc')||{value:''}).value.trim();
  var temas = (document.getElementById('nud-temas')||{value:''}).value.split('\n').map(function(t){ return t.trim(); }).filter(Boolean);

  if(!titulo){ flash('Introduce el título de la UD','#dc2626'); return; }
  if(!n||n<1){ flash('Introduce el número de la UD','#dc2626'); return; }
  if(UNIDADES.find(function(u){ return u.n===n; })){ flash('Ya existe una UD'+n,'#dc2626'); return; }

  var id = 'ud'+n;
  var newUD = { id:id, n:n, titulo:titulo, horas:horas, prog:0, desc:desc, temas:temas };
  UNIDADES.push(newUD);
  UNIDADES.sort(function(a,b){ return a.n-b.n; });

  // Añadir al bloque
  if(!bloques[bIdx].udIds) bloques[bIdx].udIds=[];
  bloques[bIdx].udIds.push(id);
  saveBloques(bloques);

  // Crear page div
  if(!document.getElementById('page-'+id)){
    var pageDiv=document.createElement('div'); pageDiv.className='page'; pageDiv.id='page-'+id;
    var inner=document.createElement('div'); inner.id='cont-'+id;
    pageDiv.appendChild(inner);
    var bolsaPage=document.getElementById('page-bolsa');
    if(bolsaPage) bolsaPage.parentNode.insertBefore(pageDiv, bolsaPage);
  }

  actualizarNavUnidades();
  cerrarModal();
  renderContenidos(root);
  renderDashboard();
  flash('UD'+n+' creada y añadida al bloque','#16a34a');
}

// ── Modal: Editar UD (título, horas, desc) ────────────
function abrirModalEditarUDContenidos(udId, bloques, root){
  var u = UNIDADES.find(function(x){ return x.id===udId; });
  if(!u) return;
  abrirModal('Editar UD'+u.n+' · '+u.titulo,
    '<div class="g2"><div class="fg"><label class="fl">Número</label>'+
    '<input class="fi" id="eud-n" type="number" value="'+u.n+'" disabled></div>'+
    '<div class="fg"><label class="fl">Horas</label>'+
    '<input class="fi" id="eud-horas" type="number" value="'+u.horas+'"></div></div>'+
    '<div class="fg"><label class="fl">Título</label>'+
    '<input class="fi" id="eud-titulo" value="'+u.titulo+'"></div>'+
    '<div class="fg"><label class="fl">Descripción</label>'+
    '<textarea class="fta" id="eud-desc" rows="3">'+u.desc+'</textarea></div>'+
    '<div class="fg"><label class="fl">Progreso (%)</label>'+
    '<input class="fi" id="eud-prog" type="number" min="0" max="100" value="'+u.prog+'"></div>',
    '<button class="btn btn-d btn-sm" style="margin-right:auto" onclick="eliminarUD(\''+udId+'\')">🗑 Eliminar UD</button>'+
    '<button class="btn btn-g" onclick="cerrarModal()">Cancelar</button>'+
    '<button class="btn btn-p" onclick="guardarEditarUDCont(\''+udId+'\')">Guardar</button>'
  );
  document.getElementById('modal').querySelector('.modal').style.maxWidth='560px';
  window._bloquesRef = bloques;
  window._contenidosRoot = root;
}

function guardarEditarUDCont(udId){
  var u = UNIDADES.find(function(x){ return x.id===udId; });
  if(!u){ flash('UD no encontrada','#dc2626'); return; }
  u.horas  = parseInt((document.getElementById('eud-horas')||{value:u.horas}).value)||u.horas;
  u.titulo = (document.getElementById('eud-titulo')||{value:u.titulo}).value.trim()||u.titulo;
  u.desc   = (document.getElementById('eud-desc')||{value:''}).value.trim();
  u.prog   = parseInt((document.getElementById('eud-prog')||{value:'0'}).value)||0;
  actualizarNavUnidades();
  cerrarModal();
  renderContenidos(window._contenidosRoot);
  renderDashboard();
  flash('UD actualizada','#16a34a');
}

function eliminarUD(udId){
  if(!confirm('¿Eliminar esta UD? Se eliminará del módulo y de todos los bloques.')) return;
  UNIDADES = UNIDADES.filter(function(u){ return u.id!==udId; });
  var bloques = window._bloquesRef;
  bloques.forEach(function(b){ b.udIds=(b.udIds||[]).filter(function(id){ return id!==udId; }); });
  saveBloques(bloques);
  delete RA_CE_DATA[udId]; saveRACE();
  actualizarNavUnidades();
  cerrarModal();
  renderContenidos(window._contenidosRoot);
  renderDashboard();
  flash('UD eliminada','#16a34a');
}

// ── Modal: Editar temas de una UD ─────────────────────
function abrirModalEditarTemas(udId, bloques, root){
  var u = UNIDADES.find(function(x){ return x.id===udId; });
  if(!u) return;
  var temasActuales = (u.temas||[]).join('\n');
  abrirModal('📋 Índice de contenidos · '+u.titulo,
    '<div style="font-size:12.5px;color:var(--muted);margin-bottom:8px">'+
    '<strong>Formato:</strong> Un tema por línea. Para añadir subapartados, empieza la línea con <code style="background:var(--surface2);padding:1px 5px;border-radius:4px">-</code> o con dos espacios.<br>'+
    '<span style="color:var(--dim)">Ejemplo: <em>1. Fuentes de financiación → - Propias → - Ajenas</em></span></div>'+
    '<textarea class="fta" id="eud-temas-txt" rows="12" style="font-size:13px;font-family:monospace">'+temasActuales+'</textarea>',
    '<button class="btn btn-g" onclick="cerrarModal()">Cancelar</button>'+
    '<button class="btn btn-p" onclick="guardarTemas(\''+udId+'\')">Guardar temas</button>'
  );
  document.getElementById('modal').querySelector('.modal').style.maxWidth='560px';
  window._bloquesRef = bloques;
  window._contenidosRoot = root;
}

function guardarTemas(udId){
  var u = UNIDADES.find(function(x){ return x.id===udId; });
  if(!u) return;
  var txt = (document.getElementById('eud-temas-txt')||{value:''}).value;
  u.temas = txt.split('\n').map(function(t){ return t.trim(); }).filter(Boolean);
  cerrarModal();
  saveUNIDADES();
  if(window._contenidosRoot) renderContenidos(window._contenidosRoot);
  renderUD(u);
  flash('Temas guardados ('+u.temas.length+')','#16a34a');
}

// ── Modal: Vincular RA a una UD ───────────────────────
function abrirModalVincularRA(udId, bloques, root){
  var u = UNIDADES.find(function(x){ return x.id===udId; });
  if(!u) return;
  initPond();
  var raActuales = getRADeUD(udId).map(function(r){ return r.id; });

  // Todos los RA del módulo con su bloque de origen
  var allRA = getAllRA();
  if(!allRA.length){
    abrirModal('Vincular RA',
      '<div class="alert al-w">No hay RA configurados en el módulo. Ve a <strong>Evaluación → RA/CE</strong> para crearlos primero.</div>',
      '<button class="btn btn-g" onclick="cerrarModal()">Cerrar</button>'
    );
    return;
  }

  var checkRA = allRA.map(function(item){
    var checked = raActuales.includes(item.ra.id);
    var pond = (POND[item.ra.id]||{pct:item.ra.ponderacion||0}).pct;
    return '<label style="display:flex;align-items:flex-start;gap:8px;padding:8px 0;border-bottom:1px solid var(--border);cursor:pointer">'+
      '<input type="checkbox" class="vra-chk" value="'+item.ra.id+'"'+(checked?' checked':'')+' style="margin-top:3px;width:15px;height:15px;flex-shrink:0">'+
      '<div>'+
        '<div style="font-size:13px;font-weight:600">'+item.ra.id+'</div>'+
        '<div style="font-size:12px;color:var(--muted);line-height:1.4">'+item.ra.nombre+'</div>'+
        '<div style="font-size:11px;color:var(--dim);margin-top:2px">'+item.ra.ce.length+' CE · '+pond+'% del módulo · definido en B'+item.ud.n+'</div>'+
      '</div>'+
    '</label>';
  }).join('');

  abrirModal('🎯 Vincular RA · '+u.titulo,
    '<div style="font-size:12.5px;color:var(--muted);margin-bottom:10px">Selecciona los RA que se trabajan en esta unidad. Los RA siguen gestionándose desde <strong>Evaluación</strong>.</div>'+
    '<div style="max-height:300px;overflow-y:auto;border:1px solid var(--border);border-radius:var(--r);padding:4px 12px">'+checkRA+'</div>',
    '<button class="btn btn-g" onclick="cerrarModal()">Cancelar</button>'+
    '<button class="btn btn-p" onclick="guardarVincularRA(\''+udId+'\')">Guardar vinculación</button>'
  );
  document.getElementById('modal').querySelector('.modal').style.maxWidth='580px';
  window._bloquesRef = bloques;
  window._contenidosRoot = root;
}

function guardarVincularRA(udId){
  var u = UNIDADES.find(function(x){ return x.id===udId; });
  if(!u) return;
  var seleccionados = [];
  document.querySelectorAll('.vra-chk:checked').forEach(function(c){ seleccionados.push(c.value); });

  // Separar: RA propios (definidos en RA_CE_DATA[udId]) vs vinculados
  var propios = (RA_CE_DATA[udId]||{ra:[]}).ra.map(function(r){ return r.id; });
  var vinculados = seleccionados.filter(function(id){ return !propios.includes(id); });
  u.raVinculados = vinculados;

  cerrarModal();
  saveUNIDADES();
  if(window._contenidosRoot) renderContenidos(window._contenidosRoot);
  renderUD(u);
  flash('Vinculación de RA actualizada','#16a34a');
}

function actualizarNavUnidades(){
  var subUd = document.getElementById('sub-ud');
  if(!subUd) return;

  // Asegurar page-divs para todas las UDs
  UNIDADES.forEach(function(u){
    if(!document.getElementById('page-'+u.id)){
      var pageDiv = document.createElement('div');
      pageDiv.className = 'page'; pageDiv.id = 'page-'+u.id;
      var inner = document.createElement('div'); inner.id = 'cont-'+u.id;
      pageDiv.appendChild(inner);
      var ref = document.getElementById('page-bolsa');
      if(ref) ref.parentNode.insertBefore(pageDiv, ref);
    }
  });

  // Reconstruir menú completo siempre desde UNIDADES
  subUd.innerHTML = '';
  UNIDADES.forEach(function(u){
    var btn = document.createElement('button');
    btn.className = 'nav-subitem';
    btn.dataset.ud = u.id;
    btn.textContent = 'B'+u.n+' · '+u.titulo.slice(0,26);
    btn.onclick = (function(uid){ return function(){ goTo(uid, this); }; })(u.id);
    subUd.appendChild(btn);
  });
}


