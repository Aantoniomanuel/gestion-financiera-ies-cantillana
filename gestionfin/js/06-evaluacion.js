// ── EJERCICIOS ─────────────────────────────────────────

// ── EVALUACIÓN ─────────────────────────────────────────
// ══════════════════════════════════════════════════════
//  SECCIÓN EVALUACIÓN — RA/CE + Import/Export Excel
// ══════════════════════════════════════════════════════

// Almacenamiento de ponderaciones editadas (separado de RA_CE_DATA)
var POND_KEY = 'gf_ponderaciones';
var POND = JSON.parse(localStorage.getItem(POND_KEY) || 'null') || null;
// Si no hay ponderaciones guardadas las generamos desde RA_CE_DATA
function initPond(){
  if(!POND) POND = {};
  // Añadir entradas que falten (ej: RA6 si el localStorage es antiguo)
  UNIDADES.forEach(function(u){
    var raList = (RA_CE_DATA[u.id]||{ra:[]}).ra;
    raList.forEach(function(ra){
      if(!POND[ra.id]){
        POND[ra.id] = { pct: ra.ponderacion || 0, ce:{} };
        (ra.ce||[]).forEach(function(ce){
          POND[ra.id].ce[ce.id] = ce.peso || 0;
        });
      }
    });
  });
  savePond();
}
function savePond(){ localStorage.setItem(POND_KEY, JSON.stringify(POND)); }

// Recoge todos los RA/CE en lista plana
function getAllRA(){
  var out = [];
  var seen = {}; // evitar duplicados por ID de RA
  UNIDADES.forEach(function(u){
    (RA_CE_DATA[u.id]||{ra:[]}).ra.forEach(function(ra){
      if(!seen[ra.id]){
        seen[ra.id] = true;
        out.push({ ud: u, ra: ra });
      }
    });
  });
  return out;
}

// Devuelve los RA que evalúan una UD concreta (propios + vinculados)
function getRADeUD(udId){
  var propios = (RA_CE_DATA[udId]||{ra:[]}).ra;
  var ud = UNIDADES.find(function(u){ return u.id===udId; });
  var vinculados = (ud && ud.raVinculados) ? ud.raVinculados : [];
  var out = propios.slice(); // copia de los propios
  var seen = {};
  propios.forEach(function(r){ seen[r.id]=true; });
  // Añadir los vinculados (buscándolos en su bloque de origen)
  vinculados.forEach(function(raId){
    if(seen[raId]) return;
    var allRA = [];
    UNIDADES.forEach(function(u){
      (RA_CE_DATA[u.id]||{ra:[]}).ra.forEach(function(ra){
        allRA.push(ra);
      });
    });
    var raObj = allRA.find(function(r){ return r.id===raId; });
    if(raObj){ out.push(raObj); seen[raId]=true; }
  });
  return out;
}

// ── Render principal de Evaluación ───────────────────
function renderEvaluacion(){
  var cont = document.getElementById('eval-cont');
  if(!cont) return;

  if(ROL !== 'profesor'){
    // Vista alumno — solo sus notas
    renderEvaluacionAlumno(cont);
    return;
  }

  initPond();
  cont.innerHTML = '';
  var wrap = document.createElement('div');

  // ── Pestañas ──
  var tabs = ['ra-ce','calificaciones'];
  var tabLabels = {'ra-ce':'📐 RA / CE y Ponderaciones', 'calificaciones':'📊 Libro de Calificaciones'};
  var tabBar = document.createElement('div');
  tabBar.className = 'bolsa-tabs';
  tabBar.style.marginBottom = '20px';
  tabs.forEach(function(t){
    var btn = document.createElement('button');
    btn.className = 'bolsa-tab' + (t==='ra-ce'?' active':'');
    btn.id = 'eval-tab-'+t;
    btn.textContent = tabLabels[t];
    btn.onclick = function(){
      document.querySelectorAll('.bolsa-tab[id^="eval-tab"]').forEach(function(b){ b.classList.remove('active'); });
      document.querySelectorAll('.eval-sec').forEach(function(s){ s.style.display='none'; });
      btn.classList.add('active');
      document.getElementById('eval-sec-'+t).style.display = 'block';
    };
    tabBar.appendChild(btn);
  });
  wrap.appendChild(tabBar);

  // ── SECCIÓN RA/CE ──
  var secRA = document.createElement('div');
  secRA.id = 'eval-sec-ra-ce';
  secRA.className = 'eval-sec';
  renderSeccionRACE(secRA);
  wrap.appendChild(secRA);

  // ── SECCIÓN CALIFICACIONES ──
  var secCal = document.createElement('div');
  secCal.id = 'eval-sec-calificaciones';
  secCal.className = 'eval-sec';
  secCal.style.display = 'none';
  renderSeccionCalificaciones(secCal);
  wrap.appendChild(secCal);

  cont.appendChild(wrap);
}

// ── Sección RA/CE ─────────────────────────────────────
function renderSeccionRACE(sec){
  sec.innerHTML = '';
  initPond();

  // Cabecera con botones import/export
  var hdr = document.createElement('div');
  hdr.style.cssText = 'display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:16px';
  hdr.innerHTML =
    '<div><div style="font-size:15px;font-weight:600">Resultados de Aprendizaje y Criterios de Evaluación</div>'+
    '<div style="font-size:12px;color:var(--muted);margin-top:2px">Configura los porcentajes. La suma de RA debe ser 100% del módulo. Cada CE debe sumar 100% dentro de su RA.</div></div>';
  var btnGroup = document.createElement('div');
  btnGroup.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap';

  // Botón importar — usa el input permanente del body
  var btnImport = document.createElement('button');
  btnImport.className = 'btn btn-g';
  btnImport.innerHTML = '⬆ Importar Excel';
  btnImport.onclick = function(){
    var inp = document.getElementById('excel-import-input');
    // Resetear para que dispare onchange aunque sea el mismo fichero
    inp.value = '';
    // Guardar referencia al sec actual en el input
    inp._sec = sec;
    inp.onchange = function(e){
      if(e.target.files && e.target.files[0]){
        importarRACEExcel(e.target.files[0], inp._sec);
      }
    };
    inp.click();
  };

  // Botón exportar Excel
  var btnExport = document.createElement('button');
  btnExport.className = 'btn btn-g';
  btnExport.innerHTML = '⬇ Exportar Excel';
  btnExport.onclick = exportarRACEExcel;

  // Botón descargar plantilla
  var btnPlantilla = document.createElement('button');
  btnPlantilla.className = 'btn btn-g';
  btnPlantilla.innerHTML = '📋 Descargar plantilla';
  btnPlantilla.onclick = descargarPlantillaExcel;

  btnGroup.appendChild(btnImport);
  btnGroup.appendChild(btnExport);
  btnGroup.appendChild(btnPlantilla);
  hdr.appendChild(btnGroup);
  sec.appendChild(hdr);

  // Validación global
  var allRA = getAllRA();
  var totalPctRA = allRA.reduce(function(s,item){
    return s + (parseFloat((POND[item.ra.id]||{pct:0}).pct)||0);
  }, 0);
  var validRA = Math.abs(totalPctRA - 100) < 0.01;

  var validBar = document.createElement('div');
  validBar.style.cssText = 'display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:var(--r);margin-bottom:16px;' +
    'background:'+(validRA?'var(--green-bg)':'var(--amber-bg)')+';color:'+(validRA?'var(--green)':'var(--amber)');
  validBar.innerHTML =
    '<span style="font-size:1.2rem">'+(validRA?'✅':'⚠️')+'</span>'+
    '<div style="flex:1;font-size:13px;font-weight:500">'+
      'Suma total de RA: <strong>'+totalPctRA.toFixed(1)+'%</strong> '+
      (validRA ? '— Correcto, suma 100%' : '— Debe sumar exactamente 100%')+
    '</div>'+
    '<button class="btn btn-p btn-sm" onclick="ponderacionAutomaticaRA()" style="font-size:12px">⚡ Ponderación automática</button>';
  sec.appendChild(validBar);

  // Tabla de RA y CE
  allRA.forEach(function(item){
    sec.appendChild(renderRACard(item.ud, item.ra, sec));
  });

  // ── Botón añadir nuevo RA ──────────────────────────
  var addSection = document.createElement('div');
  addSection.style.cssText = 'margin-top:16px;padding:16px;background:var(--surface2);border:2px dashed var(--border-md);border-radius:var(--rl);text-align:center';
  addSection.innerHTML =
    '<div style="font-size:13px;color:var(--muted);margin-bottom:10px">¿Necesitas añadir un nuevo Resultado de Aprendizaje con sus Criterios de Evaluación?</div>';
  var btnNuevoRA = document.createElement('button');
  btnNuevoRA.className = 'btn btn-p';
  btnNuevoRA.innerHTML = '+ Nuevo RA y CE';
  btnNuevoRA.onclick = function(){ abrirModalNuevoRA(sec); };
  addSection.appendChild(btnNuevoRA);
  sec.appendChild(addSection);
}

// ── Modal Nuevo RA/CE ──────────────────────────────────
function abrirModalNuevoRA(sec){
  // Seleccionar a qué bloque asignar el nuevo RA
  var udOpts = UNIDADES.map(function(u){
    return '<option value="'+u.id+'">B'+u.n+' — '+u.titulo+'</option>';
  }).join('');

  abrirModal('➕ Nuevo Resultado de Aprendizaje',
    '<div class="fg"><label class="fl">Bloque al que pertenece</label>'+
    '<select class="fs" id="nra-bloque">'+udOpts+'</select></div>'+
    '<div class="fg"><label class="fl">ID del RA <span style="color:var(--red)">*</span></label>'+
    '<input class="fi" id="nra-id" placeholder="Ej: RA7" maxlength="10"></div>'+
    '<div class="fg"><label class="fl">Nombre / descripción del RA <span style="color:var(--red)">*</span></label>'+
    '<input class="fi" id="nra-nombre" placeholder="Ej: RA7 — Realiza..."></div>'+
    '<div class="fg"><label class="fl">Ponderación en el módulo (%)</label>'+
    '<input class="fi" id="nra-pct" type="number" min="0" max="100" value="10"></div>'+
    '<hr style="border:none;border-top:1px solid var(--border);margin:14px 0">'+
    '<div style="font-size:13px;font-weight:600;margin-bottom:10px">Criterios de Evaluación</div>'+
    '<div id="nra-ce-lista"></div>'+
    '<button class="btn btn-g btn-sm" style="width:100%;margin-top:8px" onclick="addCERow()">+ Añadir CE</button>',
    '<button class="btn btn-g" onclick="cerrarModal()">Cancelar</button>'+
    '<button class="btn btn-p" onclick="guardarNuevoRA()">Guardar RA</button>'
  );
  // Añadir primer CE por defecto
  setTimeout(addCERow, 50);
  // Guardar referencia al sec para re-renderizar
  window._raSec = sec;
}

function addCERow(){
  var lista = document.getElementById('nra-ce-lista');
  if(!lista) return;
  var idx = lista.children.length + 1;
  var raId = (document.getElementById('nra-id')||{value:'RA?'}).value.trim() || 'RA?';
  var row = document.createElement('div');
  row.style.cssText = 'display:grid;grid-template-columns:100px 1fr 80px 30px;gap:7px;margin-bottom:7px;align-items:center';
  row.innerHTML =
    '<input class="fi nra-ce-id" placeholder="CE'+idx+'" value="'+raId+'.'+String.fromCharCode(96+idx)+'" style="font-family:IBM Plex Mono,monospace;font-size:12px">'+
    '<input class="fi nra-ce-desc" placeholder="Descripción del criterio...">'+
    '<input class="fi nra-ce-peso" type="number" min="0" max="100" value="'+(Math.round(100/Math.max(idx,1)))+'" placeholder="%">'+
    '<button onclick="this.parentElement.remove()" style="background:var(--red-bg);color:var(--red);border:none;border-radius:6px;padding:5px 8px;cursor:pointer;font-size:13px">✕</button>';
  lista.appendChild(row);
}

function guardarNuevoRA(){
  var udId = (document.getElementById('nra-bloque')||{value:'ud1'}).value;
  var raId = (document.getElementById('nra-id')||{value:''}).value.trim();
  var nombre = (document.getElementById('nra-nombre')||{value:''}).value.trim();
  var pct = parseFloat((document.getElementById('nra-pct')||{value:'10'}).value)||10;

  if(!raId){ flash('Introduce un ID para el RA','#dc2626'); return; }
  if(!nombre){ flash('Introduce un nombre para el RA','#dc2626'); return; }

  // Recoger CE
  var ceRows = document.querySelectorAll('#nra-ce-lista > div');
  var ceList = [];
  ceRows.forEach(function(row){
    var ceId = row.querySelector('.nra-ce-id').value.trim();
    var ceDesc = row.querySelector('.nra-ce-desc').value.trim();
    var cePeso = parseFloat(row.querySelector('.nra-ce-peso').value)||0;
    if(ceId && ceDesc) ceList.push({ id:ceId, desc:ceDesc, peso:cePeso });
  });
  if(!ceList.length){ flash('Añade al menos un Criterio de Evaluación','#dc2626'); return; }

  // Guardar en RA_CE_DATA
  if(!RA_CE_DATA[udId]) RA_CE_DATA[udId] = { ra: [] };
  RA_CE_DATA[udId].ra.push({ id:raId, nombre:nombre, ponderacion:pct, ce:ceList });
  saveRACE();

  // Guardar ponderación
  initPond();
  POND[raId] = { pct:pct, ce:{} };
  ceList.forEach(function(ce){ POND[raId].ce[ce.id] = ce.peso; });
  savePond();

  cerrarModal();
  flash('RA '+raId+' creado con '+ceList.length+' CE','#16a34a');

  // Re-renderizar sección
  if(window._raSec) renderSeccionRACE(window._raSec);
}

function renderRACard(u, ra, parentSec){
  initPond();
  var pond = POND[ra.id] || { pct: ra.ponderacion || 0, ce: {} };
  var ceList = ra.ce || [];

  // Suma CE
  var totalCE = ceList.reduce(function(s,ce){
    return s + (parseFloat((pond.ce||{})[ce.id])||0);
  }, 0);
  var validCE = ceList.length === 0 || Math.abs(totalCE - 100) < 0.01;

  var card = document.createElement('div');
  card.className = 'card';
  card.style.marginBottom = '12px';

  // Cabecera RA
  var raHdr = document.createElement('div');
  raHdr.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--navy);border-radius:var(--r);margin-bottom:10px';

  var raInfo = document.createElement('div');
  raInfo.style.cssText = 'flex:1;color:#fff;font-size:13px;font-weight:600';
  raInfo.textContent = ra.nombre + ' — UD' + u.n;

  var udBadge = document.createElement('span');
  udBadge.style.cssText = 'font-size:11px;background:rgba(255,255,255,.15);color:#fff;padding:2px 8px;border-radius:20px;flex-shrink:0';
  udBadge.textContent = u.titulo;

  // Input % del módulo
  var pctWrap = document.createElement('div');
  pctWrap.style.cssText = 'display:flex;align-items:center;gap:6px;flex-shrink:0';
  var pctLabel = document.createElement('span');
  pctLabel.style.cssText = 'font-size:11px;color:rgba(255,255,255,.6)';
  pctLabel.textContent = '% módulo:';
  var pctInput = document.createElement('input');
  pctInput.type = 'number';
  pctInput.min = '0'; pctInput.max = '100'; pctInput.step = '0.1';
  pctInput.value = pond.pct;
  pctInput.style.cssText = 'width:65px;padding:4px 7px;border-radius:6px;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.1);color:#fff;font-family:"DM Sans",sans-serif;font-size:13px;font-weight:700;text-align:center;outline:none';
  pctInput.oninput = function(){
    if(!POND[ra.id]) POND[ra.id]={pct:0,ce:{}};
    POND[ra.id].pct = parseFloat(this.value)||0;
    savePond();
    renderSeccionRACE(parentSec);
  };
  pctWrap.appendChild(pctLabel);
  pctWrap.appendChild(pctInput);

  // Botón editar nombre RA
  var btnEditRA = document.createElement('button');
  btnEditRA.style.cssText = 'background:rgba(255,255,255,.15);border:none;color:#fff;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:11px;flex-shrink:0';
  btnEditRA.textContent = '✎ Editar';
  btnEditRA.onclick = (function(udId, raId){ return function(){ abrirModalEditarRA(udId, raId, parentSec); }; })(u.id, ra.id);

  // Botón borrar RA
  var btnDelRA = document.createElement('button');
  btnDelRA.style.cssText = 'background:rgba(220,38,38,.4);border:none;color:#fff;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:11px;flex-shrink:0';
  btnDelRA.textContent = '✕ Borrar';
  btnDelRA.onclick = (function(udId, raId){ return function(){
    if(!confirm('¿Eliminar el RA '+raId+' y todos sus CE? Esta acción no se puede deshacer.')) return;
    RA_CE_DATA[udId].ra = RA_CE_DATA[udId].ra.filter(function(r){ return r.id !== raId; });
    saveRACE();
    delete POND[raId]; savePond();
    flash('RA '+raId+' eliminado','#16a34a');
    renderSeccionRACE(parentSec);
  }; })(u.id, ra.id);

  raHdr.appendChild(raInfo);
  raHdr.appendChild(udBadge);
  raHdr.appendChild(pctWrap);
  raHdr.appendChild(btnEditRA);
  raHdr.appendChild(btnDelRA);
  card.appendChild(raHdr);

  if(!ceList.length){
    var noCE = document.createElement('p');
    noCE.style.cssText = 'font-size:13px;color:var(--muted);padding:4px 0';
    noCE.textContent = 'Sin criterios de evaluación configurados.';
    card.appendChild(noCE);
    return card;
  }

  // Barra validación CE
  var ceBar = document.createElement('div');
  ceBar.style.cssText = 'display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:var(--r);margin-bottom:8px;font-size:12px;'+
    'background:'+(validCE?'var(--green-bg)':'var(--amber-bg)')+';color:'+(validCE?'var(--green)':'var(--amber)');
  ceBar.innerHTML =
    '<span>'+(validCE?'✅':'⚠️')+'</span>'+
    '<span style="flex:1">Suma CE: <strong>'+totalCE.toFixed(1)+'%</strong> '+(validCE?'— Correcto':'— Debe sumar 100%')+'</span>'+
    '<button class="btn btn-sm" style="font-size:11px;padding:4px 10px;background:var(--navy);color:#fff;border:none;border-radius:6px;cursor:pointer" onclick="ponderacionAutomaticaCE(\''+ra.id+'\')">⚡ Auto CE</button>';
  card.appendChild(ceBar);

  // Tabla CE
  var table = document.createElement('table');
  table.style.cssText = 'width:100%;border-collapse:collapse';
  var thead = document.createElement('thead');
  thead.innerHTML = '<tr>'+
    '<th style="width:80px">Criterio</th>'+
    '<th>Descripción</th>'+
    '<th style="width:110px;text-align:center">% dentro del RA</th>'+
  '</tr>';
  table.appendChild(thead);
  var tbody = document.createElement('tbody');
  ceList.forEach(function(ce){
    var cePct = (pond.ce||{})[ce.id] || 0;
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td style="font-family:\'IBM Plex Mono\',monospace;font-size:12px;font-weight:700;color:var(--navy)">'+ce.id+'</td>'+
      '<td style="font-size:13px;color:var(--muted)">'+ce.desc+'</td>'+
      '<td style="text-align:center;padding:6px 8px">';
    var ceInput = document.createElement('input');
    ceInput.type = 'number';
    ceInput.min = '0'; ceInput.max = '100'; ceInput.step = '0.1';
    ceInput.value = cePct;
    ceInput.style.cssText = 'width:70px;padding:5px 7px;border:1px solid var(--border-md);border-radius:6px;font-family:"DM Sans",sans-serif;font-size:13px;font-weight:600;text-align:center;outline:none;background:var(--surface)';
    ceInput.oninput = (function(raId, ceId){ return function(){
      if(!POND[raId]) POND[raId]={pct:0,ce:{}};
      if(!POND[raId].ce) POND[raId].ce={};
      POND[raId].ce[ceId] = parseFloat(this.value)||0;
      savePond();
      renderSeccionRACE(parentSec);
    }; })(ra.id, ce.id);
    var lastTd = tr.querySelector('td:last-child');
    lastTd.appendChild(ceInput);

    // Botones editar desc y borrar CE
    var tdAcc = document.createElement('td');
    tdAcc.style.cssText = 'text-align:center;padding:4px 6px;white-space:nowrap';
    var btnEditCE = document.createElement('button');
    btnEditCE.className = 'btn btn-g btn-sm';
    btnEditCE.style.fontSize = '11px';
    btnEditCE.textContent = '✎';
    btnEditCE.title = 'Editar descripción';
    btnEditCE.onclick = (function(udId, raId, ceId){ return function(){
      var nueva = prompt('Nueva descripción para '+ceId+':', ce.desc);
      if(nueva === null) return;
      var raObj = RA_CE_DATA[udId].ra.find(function(r){ return r.id===raId; });
      var ceObj = raObj && raObj.ce.find(function(c){ return c.id===ceId; });
      if(ceObj){ ceObj.desc = nueva.trim(); saveRACE(); renderSeccionRACE(parentSec); flash('CE actualizado','#16a34a'); }
    }; })(u.id, ra.id, ce.id);

    var btnDelCE = document.createElement('button');
    btnDelCE.className = 'btn btn-d btn-sm';
    btnDelCE.style.fontSize = '11px';
    btnDelCE.textContent = '✕';
    btnDelCE.title = 'Eliminar CE';
    btnDelCE.onclick = (function(udId, raId, ceId){ return function(){
      if(!confirm('¿Eliminar el criterio '+ceId+'?')) return;
      var raObj = RA_CE_DATA[udId].ra.find(function(r){ return r.id===raId; });
      if(raObj){ raObj.ce = raObj.ce.filter(function(c){ return c.id!==ceId; }); saveRACE(); renderSeccionRACE(parentSec); flash('CE eliminado','#16a34a'); }
    }; })(u.id, ra.id, ce.id);

    tdAcc.appendChild(btnEditCE);
    tdAcc.appendChild(btnDelCE);
    tr.appendChild(tdAcc);
    tbody.appendChild(tr);
  });

  // Botón añadir CE a este RA
  var trAdd = document.createElement('tr');
  var tdAdd = document.createElement('td');
  tdAdd.colSpan = 4;
  tdAdd.style.cssText = 'padding:8px 4px';
  var btnAddCE = document.createElement('button');
  btnAddCE.className = 'btn btn-g btn-sm';
  btnAddCE.style.cssText = 'width:100%;font-size:12px';
  btnAddCE.textContent = '+ Añadir CE a este RA';
  btnAddCE.onclick = (function(udId, raId){ return function(){
    var ceId = prompt('ID del nuevo CE (ej: CE'+raId.replace('RA','')+'.x):');
    if(!ceId) return;
    var ceDesc = prompt('Descripción del CE:');
    if(!ceDesc) return;
    var cePeso = parseFloat(prompt('Peso dentro del RA (%):', '0'))||0;
    var raObj = RA_CE_DATA[udId].ra.find(function(r){ return r.id===raId; });
    if(raObj){ raObj.ce.push({id:ceId.trim(), desc:ceDesc.trim(), peso:cePeso}); saveRACE(); renderSeccionRACE(parentSec); flash('CE '+ceId+' añadido','#16a34a'); }
  }; })(u.id, ra.id);
  tdAdd.appendChild(btnAddCE);
  trAdd.appendChild(tdAdd);
  tbody.appendChild(trAdd);

  table.appendChild(tbody);
  card.appendChild(table);
  return card;
}

// ── Modal editar nombre/ponderación de un RA ──────────
function abrirModalEditarRA(udId, raId, sec){
  var raObj = (RA_CE_DATA[udId]||{ra:[]}).ra.find(function(r){ return r.id===raId; });
  if(!raObj) return;
  abrirModal('✎ Editar RA: '+raId,
    '<div class="fg"><label class="fl">ID del RA</label>'+
    '<input class="fi" id="era-id" value="'+raObj.id+'" maxlength="10"></div>'+
    '<div class="fg"><label class="fl">Nombre / descripción</label>'+
    '<input class="fi" id="era-nombre" value="'+raObj.nombre.replace(/"/g,"&quot;")+'"></div>'+
    '<div class="fg"><label class="fl">Ponderación en el módulo (%)</label>'+
    '<input class="fi" id="era-pct" type="number" min="0" max="100" value="'+(raObj.ponderacion||0)+'"></div>',
    '<button class="btn btn-g" onclick="cerrarModal()">Cancelar</button>'+
    '<button class="btn btn-p" id="btn-era-save">Guardar cambios</button>'
  );
  window._raSec = sec;
  window._raEditUdId = udId;
  window._raEditRaId = raId;
  setTimeout(function(){
    var b=document.getElementById('btn-era-save');
    if(b) b.onclick=function(){ guardarEditarRA(window._raEditUdId, window._raEditRaId); };
  },30);
}

function guardarEditarRA(udId, raId){
  var nuevoId   = (document.getElementById('era-id')||{value:raId}).value.trim();
  var nuevoNom  = (document.getElementById('era-nombre')||{value:''}).value.trim();
  var nuevoPct  = parseFloat((document.getElementById('era-pct')||{value:'0'}).value)||0;
  if(!nuevoId || !nuevoNom){ flash('Rellena todos los campos','#dc2626'); return; }
  var raObj = RA_CE_DATA[udId].ra.find(function(r){ return r.id===raId; });
  if(!raObj) return;
  // Actualizar POND si cambia el ID
  if(nuevoId !== raId){
    POND[nuevoId] = POND[raId]; delete POND[raId]; savePond();
  }
  raObj.id = nuevoId; raObj.nombre = nuevoNom; raObj.ponderacion = nuevoPct;
  POND[nuevoId] = POND[nuevoId] || {}; POND[nuevoId].pct = nuevoPct;
  saveRACE(); savePond();
  cerrarModal();
  flash('RA actualizado','#16a34a');
  if(window._raSec) renderSeccionRACE(window._raSec);
}

// ── Ponderación automática aritmética ─────────────────
function ponderacionAutomaticaRA(){
  if(!confirm('¿Aplicar ponderación automática a todos los RA? Se repartirá el 100% de forma equitativa entre todos los RA del módulo.')) return;
  initPond();
  var allRA = getAllRA();
  var n = allRA.length;
  if(!n) return;
  var basePct = parseFloat((100/n).toFixed(1));
  var resto = parseFloat((100 - basePct*(n-1)).toFixed(1));
  allRA.forEach(function(item, i){
    if(!POND[item.ra.id]) POND[item.ra.id]={pct:0,ce:{}};
    POND[item.ra.id].pct = i === n-1 ? resto : basePct;
  });
  savePond();
  var sec = document.getElementById('eval-sec-ra-ce');
  if(sec) renderSeccionRACE(sec);
  flash('Ponderación aritmética aplicada — puedes modificarla manualmente','#16a34a');
}

function ponderacionAutomaticaCE(raId){
  initPond();
  var allRA = getAllRA();
  var item = allRA.find(function(x){ return x.ra.id===raId; });
  if(!item) return;
  var ceList = item.ra.ce || [];
  var n = ceList.length;
  if(!n) return;
  if(!confirm('¿Ponderación automática para los CE de '+raId+'? Se repartirá 100% de forma equitativa.')) return;
  if(!POND[raId]) POND[raId]={pct:0,ce:{}};
  if(!POND[raId].ce) POND[raId].ce={};
  var basePct = parseFloat((100/n).toFixed(1));
  var resto = parseFloat((100 - basePct*(n-1)).toFixed(1));
  ceList.forEach(function(ce,i){
    POND[raId].ce[ce.id] = i===n-1 ? resto : basePct;
  });
  savePond();
  var sec = document.getElementById('eval-sec-ra-ce');
  if(sec) renderSeccionRACE(sec);
  flash('CE de '+raId+' ponderados automáticamente','#16a34a');
}

// ── EXPORT EXCEL ──────────────────────────────────────
function exportarRACEExcel(){
  if(typeof XLSX === 'undefined'){ flash('Librería Excel no cargada aún, espera unos segundos','#dc2626'); return; }
  initPond();
  var allRA = getAllRA();
  var wsData = [
    ['UD','UD_Titulo','RA_ID','RA_Nombre','RA_%_Modulo','CE_ID','CE_Descripcion','CE_%_RA'],
    ['','','','','','','',''],
    ['== INSTRUCCIONES ==','','','','','','',''],
    ['• La suma de todos los RA_%_Modulo debe ser 100','','','','','','',''],
    ['• La suma de CE_%_RA dentro de cada RA debe ser 100','','','','','','',''],
    ['• No modificar las columnas UD, RA_ID, CE_ID','','','','','','',''],
    ['','','','','','','',''],
  ];

  allRA.forEach(function(item){
    var pond = POND[item.ra.id] || {pct:0,ce:{}};
    var ceList = item.ra.ce || [];
    if(!ceList.length){
      wsData.push([
        'UD'+item.ud.n, item.ud.titulo,
        item.ra.id, item.ra.nombre, pond.pct,
        '','',''
      ]);
    } else {
      ceList.forEach(function(ce,i){
        wsData.push([
          'UD'+item.ud.n, item.ud.titulo,
          item.ra.id, item.ra.nombre, i===0 ? pond.pct : '',
          ce.id, ce.desc, (pond.ce||{})[ce.id]||0
        ]);
      });
    }
  });

  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.aoa_to_sheet(wsData);

  // Estilos de ancho de columna
  ws['!cols'] = [
    {wch:6},{wch:28},{wch:8},{wch:40},{wch:14},{wch:8},{wch:50},{wch:12}
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'RA y CE');
  XLSX.writeFile(wb, 'RA_CE_GestionFinanciera.xlsx');
  flash('Excel exportado correctamente','#16a34a');
}

// ── PLANTILLA EXCEL ───────────────────────────────────
function descargarPlantillaExcel(){
  if(typeof XLSX === 'undefined'){ flash('Librería Excel no cargada aún, espera unos segundos','#dc2626'); return; }

  var wsData = [
    // Cabecera — 4 columnas simples
    ['RA_ID', 'RA_Descripcion', 'CE_ID', 'CE_Descripcion'],
    // Fila de ejemplo RA1
    ['RA1', 'Identifica la estructura y función del patrimonio empresarial', 'CE1.1', 'Identifica los elementos patrimoniales clasificándolos en activo, pasivo y neto patrimonial'],
    ['RA1', '',                                                              'CE1.2', 'Elabora inventarios ordenados y completos de los elementos patrimoniales'],
    ['RA1', '',                                                              'CE1.3', 'Formula la ecuación fundamental del patrimonio verificando su equilibrio'],
    ['RA1', '',                                                              'CE1.4', 'Construye el balance de situación a partir de los datos del inventario'],
    // Fila de ejemplo RA2
    ['RA2', 'Aplica el Plan General de Contabilidad en el registro de operaciones', 'CE2.1', 'Identifica la estructura y contenido del PGC 2007'],
    ['RA2', '', 'CE2.2', 'Clasifica las cuentas del PGC según sus grupos y subgrupos'],
    ['RA2', '', 'CE2.3', 'Aplica los principios contables en el registro de operaciones'],
    ['RA2', '', 'CE2.4', 'Utiliza el cuadro de cuentas para codificar operaciones económicas'],
  ];

  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.aoa_to_sheet(wsData);
  ws['!cols'] = [{wch:8}, {wch:55}, {wch:8}, {wch:65}];
  XLSX.utils.book_append_sheet(wb, ws, 'RA y CE');
  XLSX.writeFile(wb, 'Plantilla_RA_CE.xlsx');
  flash('Plantilla descargada — rellena y vuelve a importar','#16a34a');
}

// ── IMPORT EXCEL ──────────────────────────────────────
function importarRACEExcel(file, sec){
  if(!file) return;

  // Esperar hasta 5 segundos a que SheetJS cargue
  function intentar(intentos){
    if(typeof XLSX !== 'undefined'){
      procesarExcel(file, sec);
    } else if(intentos > 0){
      flash('Cargando librería Excel…','#92400e');
      setTimeout(function(){ intentar(intentos-1); }, 800);
    } else {
      flash('No se pudo cargar la librería Excel. Recarga la página e inténtalo de nuevo.','#dc2626');
    }
  }
  intentar(6);
}

function procesarExcel(file, sec){
  var reader = new FileReader();
  reader.onload = function(e){
    try{
      var wb   = XLSX.read(e.target.result, {type:'array'});
      var ws   = wb.Sheets[wb.SheetNames[0]];
      var rows = XLSX.utils.sheet_to_json(ws, {header:1, defval:''});

      // Localizar fila de cabecera buscando RA_ID
      var headerRow = -1;
      for(var i = 0; i < Math.min(rows.length, 10); i++){
        var first = String(rows[i][0]||'').trim().toUpperCase();
        if(first === 'RA_ID' || first === 'RA'){
          headerRow = i; break;
        }
      }
      if(headerRow < 0){
        flash('No se encontró la cabecera RA_ID. Usa la plantilla proporcionada.','#dc2626');
        return;
      }

      // Filtrar filas de datos (ignorar vacías y la cabecera)
      var dataRows = rows.slice(headerRow + 1).filter(function(r){
        return String(r[0]||'').trim() !== '' || String(r[2]||'').trim() !== '';
      });

      if(!dataRows.length){
        flash('El archivo no contiene datos de RA/CE.','#dc2626');
        return;
      }

      // Construir estructura RA → CE
      // La plantilla NO tiene unidad — asignamos todos los RA al primer UD
      // y luego el profesor los vincula desde Contenidos
      var raMap   = {};   // raId → { nombre, ceList }
      var raOrder = [];   // mantener orden de aparición

      dataRows.forEach(function(row){
        var raId   = String(row[0]||'').trim();
        var raNom  = String(row[1]||'').trim();
        var ceId   = String(row[2]||'').trim();
        var ceDesc = String(row[3]||'').trim();

        if(!raId && !ceId) return; // fila completamente vacía

        // Si el raId está vacío en esta fila, hereda el último raId conocido
        if(!raId){
          raId = raOrder.length ? raOrder[raOrder.length-1] : 'RA?';
        }

        if(!raMap[raId]){
          raMap[raId]   = { nombre: raNom || raId, ce: [] };
          raOrder.push(raId);
        } else if(raNom){
          raMap[raId].nombre = raNom; // actualizar si hay descripción más adelante
        }

        if(ceId){
          raMap[raId].ce.push({ id: ceId, desc: ceDesc || ceId, peso: 0 });
        }
      });

      if(!raOrder.length){
        flash('No se encontraron RA válidos en el archivo.','#dc2626');
        return;
      }

      // Resumen antes de confirmar
      var resumen = 'Resumen de la importación:\n\n';
      raOrder.forEach(function(raId){
        resumen += '• '+raId+': '+raMap[raId].nombre+'\n';
        resumen += '  '+raMap[raId].ce.length+' criterios de evaluación\n';
      });
      resumen += '\nTotal: '+raOrder.length+' RA y '+raOrder.reduce(function(s,id){ return s+raMap[id].ce.length; },0)+' CE\n\n';
      resumen += 'NOTA: Las ponderaciones se establecerán desde la web una vez importados.\n\n';
      resumen += '¿Importar y reemplazar la configuración actual de RA/CE?';

      if(!confirm(resumen)) return;

      // Distribuir RA a las unidades:
      // Asignamos cada RA a la unidad cuyo número coincida con el sufijo numérico del RA
      // (RA1 → UD1, RA2 → UD2...). Si no hay match, van a un UD "general" (ud1 como fallback).
      var newRACE = {};
      var newPOND = {};

      raOrder.forEach(function(raId){
        var numMatch = raId.match(/(\d+)/);
        var udNum    = numMatch ? parseInt(numMatch[1]) : 1;
        var udObj    = UNIDADES.find(function(u){ return u.n === udNum; }) || UNIDADES[0];
        var udId     = udObj ? udObj.id : 'ud1';

        if(!newRACE[udId]) newRACE[udId] = {ra:[]};

        var raObj = {
          id: raId,
          nombre: raMap[raId].nombre,
          ponderacion: 0,
          ce: raMap[raId].ce.map(function(ce){ return { id:ce.id, desc:ce.desc, peso:0 }; })
        };
        newRACE[udId].ra.push(raObj);

        // Ponderaciones a 0 — el profesor las fija desde la web
        newPOND[raId] = { pct: 0, ce: {} };
        raMap[raId].ce.forEach(function(ce){ newPOND[raId].ce[ce.id] = 0; });
      });

      // Aplicar
      Object.assign(RA_CE_DATA, newRACE);
      POND = newPOND;
      saveRACE(); savePond();
      renderSeccionRACE(sec);
      flash('✓ Importados '+raOrder.length+' RA y '+raOrder.reduce(function(s,id){ return s+raMap[id].ce.length; },0)+' CE — ahora establece las ponderaciones','#16a34a');

    } catch(err){
      flash('Error al leer el archivo: '+err.message,'#dc2626');
    }
  };
  reader.readAsArrayBuffer(file);
}

// ── LIBRO DE CALIFICACIONES ───────────────────────────
function renderSeccionCalificaciones(sec){
  // Mostrar spinner mientras se cargan alumnos desde Supabase
  sec.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:180px;color:#9ca3af;gap:10px">'+
    '<div style="width:20px;height:20px;border:2px solid #ccc;border-top-color:#1a2744;border-radius:50%;animation:spin .7s linear infinite"></div>'+
    'Cargando alumnos…</div>';

  supa.from('perfiles').select('id,nombre,email,avatar_url,grupo').eq('rol','alumno').order('nombre')
    .then(function(result){
      console.log('[GF-Calif] Supabase perfiles result:', result);
      console.log('[GF-Calif] error:', result.error, '| data:', result.data);
      var perfs = result.data || [];
      if(perfs.length){
        var mapaLocal = {};
        DB.alumnos.forEach(function(al){ mapaLocal[al.id]=al; });
        DB.alumnos = perfs.map(function(p){
          var local = mapaLocal[p.id] || {};
          return {
            id: p.id,
            nombre: p.nombre || local.nombre || '',
            apellidos: '',
            email: p.email || local.email || '',
            avatar_url: p.avatar_url || '',
            grupo: p.grupo || local.grupo || ''
          };
        });
        save();
      }
      console.log('[GF-Calif] DB.alumnos tras sync:', DB.alumnos.length, DB.alumnos);
      _renderCalifInner(sec);
    })
    .catch(function(err){
      console.error('[GF-Calif] catch error:', err);
      _renderCalifInner(sec);
    });
}

function _renderCalifInner(sec){
  sec.innerHTML='';
  initPond();

  if(!DB.alumnos.length){
    sec.innerHTML='<div class="card"><p style="color:var(--muted);font-size:14px;text-align:center;padding:2rem">Sin alumnos registrados. Los alumnos aparecen aquí cuando acceden a la app con su cuenta educativa (@g.educaand.es).</p></div>';
    return;
  }

  // Filtro de grupo
  var tieneGrp=DB.alumnos.some(function(a){return a.grupo;});
  if(tieneGrp && !document.getElementById('filtro-grupo-calif')){
    renderFiltroGrupoCalif(sec,function(){
      var s=document.getElementById('eval-sec-calificaciones');
      if(s) _renderCalifInner(s);
    });
  }
  // Recoger todas las actividades evaluables del módulo
  var todasActs=[];
  UNIDADES.forEach(function(u){
    (ACT_EVAL[u.id]||[]).forEach(function(ae){
      todasActs.push({ae:ae, ud:u});
    });
  });

  if(!todasActs.length){
    sec.innerHTML='<div class="card"><p style="color:var(--muted);font-size:14px;text-align:center;padding:2rem">No hay actividades evaluables configuradas. Crea actividades evaluables en los bloques del módulo.</p></div>';
    return;
  }

  var udTests = getUDTests(); // {udId:[{actId,nota,alumnoId,alumnoNombre,fecha,...}]}

  // Obtener última nota de un alumno para una actividad
  function getNotaAlumno(udId, actId, alId){
    var entries = (udTests[udId]||[]).filter(function(t){
      return t.actId===actId && (t.alumnoId===alId || (!t.alumnoId && !alId));
    });
    if(!entries.length) return null;
    // Devolver la más reciente
    return entries[entries.length-1].nota;
  }

  // Notas manuales del DB antiguo (compatibilidad)
  function getNotaManual(alId, ejId){
    return (DB.notas[alId]||{})[ejId]!=null ? (DB.notas[alId]||{})[ejId] : null;
  }

  // ── Cabecera con controles ──────────────────────────
  var ph = document.createElement('div'); ph.className='ph';
  var phLeft=document.createElement('div');
  phLeft.innerHTML='<h1 class="pt">Libro de Calificaciones</h1>'+
    '<p class="ps">Notas por actividad evaluable · Gestión Financiera</p>';
  var phBtns=document.createElement('div'); phBtns.style.cssText='display:flex;gap:8px;flex-wrap:wrap';

  // Filtro por bloque
  var selUD=document.createElement('select'); selUD.className='fs'; selUD.style.cssText='width:auto;font-size:13px';
  selUD.innerHTML='<option value="todas">Todos los bloques</option>'+
    UNIDADES.map(function(u){ return '<option value="'+u.id+'">B'+u.n+' · '+u.titulo.slice(0,20)+'</option>'; }).join('');

  var btnExcel=document.createElement('button'); btnExcel.className='btn btn-g';
  btnExcel.innerHTML='⬇ Exportar Excel'; btnExcel.onclick=function(){ exportarLibroExcel(todasActs, udTests); };

  var btnSeneca=document.createElement('button'); btnSeneca.className='btn btn-p';
  btnSeneca.style.cssText='background:#d4380d;border-color:#d4380d;color:#fff';
  btnSeneca.innerHTML='📤 Exportar Séneca (CSV)'; btnSeneca.onclick=function(){ exportarSeneca(todasActs, udTests); };

  phBtns.appendChild(selUD); phBtns.appendChild(btnExcel); phBtns.appendChild(btnSeneca);
  ph.appendChild(phLeft); ph.appendChild(phBtns);
  sec.appendChild(ph);

  // ── Stats rápidas ────────────────────────────────────
  var statsRow=document.createElement('div'); statsRow.className='grid-s'; statsRow.style.marginBottom='1.25rem';
  var totalActs=todasActs.length;
  var totalAlumnos=DB.alumnos.length;
  var notasRegistradas=0;
  DB.alumnos.forEach(function(al){
    todasActs.forEach(function(item){
      var n=getNotaAlumno(item.ud.id,item.ae.id,al.id); if(n!==null) notasRegistradas++;
    });
  });
  var totalCeldas=totalActs*totalAlumnos;
  var pctCompletado=totalCeldas?Math.round(notasRegistradas/totalCeldas*100):0;
  [{ico:'👥',label:'Alumnos',val:totalAlumnos},{ico:'📋',label:'Actividades',val:totalActs},
   {ico:'✅',label:'Notas registradas',val:notasRegistradas+'/'+totalCeldas},{ico:'📊',label:'Completado',val:pctCompletado+'%'}
  ].forEach(function(s){
    var sc=document.createElement('div'); sc.className='sc';
    sc.innerHTML='<div class="sl">'+s.ico+' '+s.label+'</div><div class="sn" style="font-size:18px">'+s.val+'</div>';
    statsRow.appendChild(sc);
  });
  sec.appendChild(statsRow);

  // ── Tabla principal ──────────────────────────────────
  var tableWrap=document.createElement('div'); tableWrap.className='card'; tableWrap.style.padding='0';
  var tw=document.createElement('div'); tw.className='tw';
  var table=document.createElement('table');

  function renderTabla(filtroUD){
    table.innerHTML='';
    var actsFiltradas = filtroUD==='todas' ? todasActs : todasActs.filter(function(item){ return item.ud.id===filtroUD; });
    if(!actsFiltradas.length){
      table.innerHTML='<tr><td style="text-align:center;padding:2rem;color:var(--muted)">Sin actividades evaluables en este bloque.</td></tr>';
      return;
    }

    // ── Thead ─────────────────────────────────────────
    var thead=document.createElement('thead');
    // Fila 1: bloques agrupados
    var trBloque=document.createElement('tr');
    var thEmpty=document.createElement('th');
    thEmpty.style.cssText='min-width:180px;position:sticky;left:0;background:var(--navy);z-index:3;color:#fff';
    thEmpty.textContent='Alumno/a';
    trBloque.appendChild(thEmpty);
    // Agrupar actividades por bloque
    var bloqueActual=null; var bloqueCount=0; var thBloqueEl=null;
    actsFiltradas.forEach(function(item,i){
      if(item.ud.id!==bloqueActual){
        if(thBloqueEl) thBloqueEl.colSpan=bloqueCount;
        bloqueActual=item.ud.id; bloqueCount=1;
        thBloqueEl=document.createElement('th');
        thBloqueEl.style.cssText='text-align:center;background:var(--navy);color:var(--gold-light);font-size:11px;padding:6px 8px;border-left:2px solid rgba(255,255,255,.2)';
        thBloqueEl.textContent='B'+item.ud.n+' · '+item.ud.titulo.slice(0,22);
        trBloque.appendChild(thBloqueEl);
      } else { bloqueCount++; }
      if(i===actsFiltradas.length-1 && thBloqueEl) thBloqueEl.colSpan=bloqueCount;
    });
    var thMediaBloque=document.createElement('th');
    thMediaBloque.style.cssText='text-align:center;background:var(--navy);color:var(--gold-light);font-size:11px;padding:6px 8px';
    thMediaBloque.textContent='Media';
    trBloque.appendChild(thMediaBloque);
    thead.appendChild(trBloque);

    // Fila 2: actividades
    var trActs=document.createElement('tr');
    var thAlumno=document.createElement('th');
    thAlumno.style.cssText='position:sticky;left:0;background:var(--surface2);z-index:2;font-size:11px;padding:6px 10px';
    thAlumno.textContent='';
    trActs.appendChild(thAlumno);
    actsFiltradas.forEach(function(item){
      var th=document.createElement('th');
      th.style.cssText='text-align:center;min-width:90px;font-size:10px;font-weight:600;padding:5px 6px;line-height:1.3;border-left:1px solid var(--border)';
      var tipoBadge={examen:'b-amber',caso:'b-blue',practica:'b-green',test:'b-purple',trabajo:'b-blue',otro:'b-gray'}[item.ae.tipo]||'b-gray';
      th.innerHTML='<span class="badge '+tipoBadge+'" style="font-size:9px;margin-bottom:2px;display:block">'+item.ae.tipo+'</span>'+
        '<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:85px;margin:0 auto">'+item.ae.titulo.slice(0,30)+'</div>'+
        '<div style="color:var(--muted);font-weight:400;margin-top:2px">'+item.ae.peso+'%</div>';
      trActs.appendChild(th);
    });
    var thMedia=document.createElement('th');
    thMedia.style.cssText='text-align:center;font-size:11px;padding:5px 8px;background:var(--surface2)';
    thMedia.textContent='Ponderada';
    trActs.appendChild(thMedia);
    thead.appendChild(trActs);
    table.appendChild(thead);

    // ── Tbody ─────────────────────────────────────────
    var tbody=document.createElement('tbody');
    var _ag=(typeof _filtroGrupoCalif!=='undefined'&&_filtroGrupoCalif)?
    DB.alumnos.filter(function(a){return (a.grupo||'')===_filtroGrupoCalif;}):DB.alumnos;
  _ag.forEach(function(al, ai){
      var tr=document.createElement('tr');
      tr.style.background=ai%2===0?'':'var(--surface2)';
      var tdNom=document.createElement('td');
      tdNom.style.cssText='font-weight:500;font-size:13px;position:sticky;left:0;background:'+(ai%2===0?'var(--surface)':'var(--surface2)')+';z-index:1;padding:7px 10px;white-space:nowrap';
      tdNom.innerHTML='<div>'+al.nombre+' '+al.apellidos+'</div>'+
        (al.email?'<div style="font-size:11px;color:var(--muted)">'+al.email+'</div>':'');
      tr.appendChild(tdNom);

      var sumPeso=0, sumNota=0;
      actsFiltradas.forEach(function(item){
        var nota=getNotaAlumno(item.ud.id, item.ae.id, al.id);
        if(nota===null) nota=getNotaManual(al.id, item.ae.id);
        var td=document.createElement('td');
        td.style.cssText='text-align:center;padding:5px 6px;border-left:1px solid var(--border)';

        if(nota!==null){
          var color=nota>=7?'var(--green)':nota>=5?'var(--navy)':'var(--red)';
          var bg=nota>=7?'var(--green-bg)':nota>=5?'':nota>=0?'var(--red-bg)':'';
          td.innerHTML='<span style="font-size:14px;font-weight:700;color:'+color+';background:'+bg+
            ';padding:2px 7px;border-radius:8px;font-family:IBM Plex Mono,monospace">'+nota.toFixed(1)+'</span>';
          sumPeso+=parseFloat(item.ae.peso)||0;
          sumNota+=nota*(parseFloat(item.ae.peso)||0);
        } else {
          // Campo editable para nota manual
          var inp=document.createElement('input');
          inp.type='number'; inp.min='0'; inp.max='10'; inp.step='0.1'; inp.value='';
          inp.placeholder='—';
          inp.style.cssText='width:56px;padding:3px 5px;border:1px solid var(--border);border-radius:6px;font-size:13px;text-align:center;background:var(--surface);font-family:IBM Plex Mono,monospace';
          inp.title='Introduce nota manual';
          inp.onchange=(function(udId,actId,alId,peso,sumP,sumN,tdMedia,al){
            return function(){
              var v=parseFloat(this.value);
              if(isNaN(v)||v<0||v>10){ this.value=''; return; }
              // Guardar en udTests
              var tests=getUDTests(); if(!tests[udId]) tests[udId]=[];
              tests[udId].push({actId:actId,nota:v,fecha:new Date().toLocaleDateString('es-ES'),alumnoId:alId,alumnoNombre:al.nombre+' '+al.apellidos,manual:true});
              saveUDTests(tests);
              // Actualizar visualización
              this.parentElement.innerHTML='<span style="font-size:14px;font-weight:700;color:'+(v>=7?'var(--green)':v>=5?'var(--navy)':'var(--red)')+';font-family:IBM Plex Mono,monospace;background:'+(v>=7?'var(--green-bg)':v>=5?'':'var(--red-bg)')+';padding:2px 7px;border-radius:8px">'+v.toFixed(1)+'</span>';
              flash('Nota guardada','#16a34a');
              renderTabla(selUD.value); // rerender para actualizar media
            };
          })(item.ud.id, item.ae.id, al.id, item.ae.peso, sumPeso, sumNota, null, al);
          td.appendChild(inp);
        }
        tr.appendChild(td);
      });

      // Media ponderada
      var tdMedia=document.createElement('td');
      tdMedia.style.cssText='text-align:center;font-weight:700;padding:5px 8px;background:'+(ai%2===0?'var(--surface2)':'var(--surface)');
      if(sumPeso>0){
        var media=sumNota/sumPeso;
        tdMedia.innerHTML='<span style="font-size:15px;font-weight:800;color:'+(media>=7?'var(--green)':media>=5?'var(--navy)':'var(--red)')+'">'+media.toFixed(2)+'</span>';
      } else {
        tdMedia.innerHTML='<span style="color:var(--muted)">—</span>';
      }
      tr.appendChild(tdMedia);
      tbody.appendChild(tr);
    });

    // Fila de medias por actividad
    var trMediaAct=document.createElement('tr');
    trMediaAct.style.cssText='background:var(--surface2);border-top:2px solid var(--border)';
    var tdLbl=document.createElement('td');
    tdLbl.style.cssText='font-weight:700;font-size:12px;padding:7px 10px;position:sticky;left:0;background:var(--surface2)';
    tdLbl.textContent='Media de la clase';
    trMediaAct.appendChild(tdLbl);
    actsFiltradas.forEach(function(item){
      var notas=[]; DB.alumnos.forEach(function(al){
        var n=getNotaAlumno(item.ud.id,item.ae.id,al.id)||getNotaManual(al.id,item.ae.id);
        if(n!==null) notas.push(n);
      });
      var td=document.createElement('td'); td.style.cssText='text-align:center;border-left:1px solid var(--border);padding:7px 6px';
      if(notas.length){
        var avg=notas.reduce(function(s,n){return s+n;},0)/notas.length;
        td.innerHTML='<div style="font-size:12px;font-weight:700;color:'+(avg>=7?'var(--green)':avg>=5?'var(--navy)':'var(--red)')+'">'+avg.toFixed(1)+'</div>'+
          '<div style="font-size:10px;color:var(--muted)">'+notas.length+'/'+DB.alumnos.length+'</div>';
      } else { td.innerHTML='<span style="color:var(--muted)">—</span>'; }
      trMediaAct.appendChild(td);
    });
    var tdMediaTotal=document.createElement('td'); tdMediaTotal.style.cssText='text-align:center;padding:7px 8px';
    trMediaAct.appendChild(tdMediaTotal);
    tbody.appendChild(trMediaAct);
    table.appendChild(tbody);
  }

  selUD.onchange=function(){ renderTabla(this.value); };
  renderTabla('todas');
  tw.appendChild(table); tableWrap.appendChild(tw); sec.appendChild(tableWrap);

  // ── Leyenda ──────────────────────────────────────────
  var leyenda=document.createElement('div');
  leyenda.style.cssText='display:flex;gap:12px;flex-wrap:wrap;margin-top:10px;font-size:12px;color:var(--muted)';
  leyenda.innerHTML=
    '<span style="background:var(--green-bg);color:var(--green);padding:2px 8px;border-radius:6px;font-weight:600">≥7 Notable/Sobresaliente</span>'+
    '<span style="background:var(--surface2);color:var(--navy);padding:2px 8px;border-radius:6px;font-weight:600">5–6.9 Aprobado</span>'+
    '<span style="background:var(--red-bg);color:var(--red);padding:2px 8px;border-radius:6px;font-weight:600">&lt;5 Suspenso</span>'+
    '<span style="color:var(--muted)">· Los campos vacíos permiten introducir nota manual</span>';
  sec.appendChild(leyenda);
}

function exportarLibroExcel(todasActs, udTests){
  if(typeof XLSX==='undefined'){ flash('Librería Excel no disponible','#dc2626'); return; }
  function getNotaAlumno(udId,actId,alId){
    var entries=(udTests[udId]||[]).filter(function(t){ return t.actId===actId&&(t.alumnoId===alId||!t.alumnoId); });
    return entries.length?entries[entries.length-1].nota:null;
  }
  var headers=['Alumno/a','Email'].concat(todasActs.map(function(item){ return item.ae.titulo+' ('+item.ae.peso+'%)'; })).concat(['Media ponderada']);
  var rows=[headers];
  DB.alumnos.forEach(function(al){
    var sumP=0,sumN=0;
    var row=[al.nombre+' '+al.apellidos, al.email||''];
    todasActs.forEach(function(item){
      var n=getNotaAlumno(item.ud.id,item.ae.id,al.id);
      row.push(n!==null?n:'');
      if(n!==null){ sumP+=parseFloat(item.ae.peso)||0; sumN+=n*(parseFloat(item.ae.peso)||0); }
    });
    row.push(sumP>0?parseFloat((sumN/sumP).toFixed(2)):'');
    rows.push(row);
  });
  // Fila media clase
  var mediaRow=['Media de la clase',''];
  todasActs.forEach(function(item){
    var notas=[]; DB.alumnos.forEach(function(al){ var n=getNotaAlumno(item.ud.id,item.ae.id,al.id); if(n!==null) notas.push(n); });
    mediaRow.push(notas.length?parseFloat((notas.reduce(function(s,n){return s+n;},0)/notas.length).toFixed(2)):'');
  });
  mediaRow.push(''); rows.push(mediaRow);

  var wb=XLSX.utils.book_new();
  var ws=XLSX.utils.aoa_to_sheet(rows);
  ws['!cols']=[{wch:24},{wch:24}].concat(todasActs.map(function(){return {wch:16};})).concat([{wch:14}]);
  XLSX.utils.book_append_sheet(wb,ws,'Calificaciones');

  // Hoja por RA
  var allRA=getAllRA();
  allRA.forEach(function(item){
    var actsRA=todasActs.filter(function(a){ return a.ae.ceVinculados&&a.ae.ceVinculados.some(function(cv){return cv.raId===item.ra.id;}); });
    if(!actsRA.length) return;
    var hRA=['Alumno/a'].concat(actsRA.map(function(a){return a.ae.titulo.slice(0,30);})).concat(['Media '+item.ra.id]);
    var rowsRA=[hRA];
    DB.alumnos.forEach(function(al){
      var sumP=0,sumN=0;
      var r=[al.nombre+' '+al.apellidos];
      actsRA.forEach(function(a){
        var n=getNotaAlumno(a.ud.id,a.ae.id,al.id);
        r.push(n!==null?n:'');
        if(n!==null){sumP+=parseFloat(a.ae.peso)||0;sumN+=n*(parseFloat(a.ae.peso)||0);}
      });
      r.push(sumP>0?parseFloat((sumN/sumP).toFixed(2)):'');
      rowsRA.push(r);
    });
    var wsRA=XLSX.utils.aoa_to_sheet(rowsRA);
    XLSX.utils.book_append_sheet(wb,wsRA,item.ra.id.slice(0,31));
  });

  var fecha=new Date().toISOString().slice(0,10);
  XLSX.writeFile(wb,'LibroCalificaciones_GestionFinanciera_'+fecha+'.xlsx');
  flash('Libro de calificaciones exportado','#16a34a');
}

// Mantener compatibilidad
function exportarCalificacionesExcel(){ exportarLibroExcel([], getUDTests()); }
function actualizarMediaFila(){}
function actualizarMediaCelda(){}

// ── EXPORTACIÓN SÉNECA ────────────────────────────────
// Genera un CSV compatible con la importación de calificaciones de Séneca (Junta de Andalucía)
// Formato: NIF;Apellidos;Nombre;Calificacion
// La calificación es la nota media ponderada del módulo redondeada al entero más cercano
// según la escala de Séneca para FP (1-10, o "PE" para pendiente, "NE" para no evaluado)
function exportarSeneca(todasActs, udTests){
  if(!DB.alumnos.length){
    flash('No hay alumnos registrados', '#dc2626');
    return;
  }

  // ── Diálogo de configuración ──────────────────────────
  var modal = document.createElement('div');
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem';

  var box = document.createElement('div');
  box.style.cssText='background:#fff;border-radius:14px;padding:1.5rem;max-width:520px;width:100%;box-shadow:0 8px 40px rgba(0,0,0,.25)';
  box.innerHTML=
    '<div style="font-family:Georgia,serif;font-size:1.1rem;font-weight:700;color:#1a2744;margin-bottom:.3rem">📤 Exportar a Séneca</div>'+
    '<div style="font-size:13px;color:#6b7280;margin-bottom:1.2rem">Genera el CSV para importar calificaciones en Séneca · Junta de Andalucía</div>'+

    // Módulo
    '<div style="margin-bottom:1rem">'+
      '<label style="display:block;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;margin-bottom:4px">Módulo profesional</label>'+
      '<input id="sen-modulo" type="text" value="Gestión Financiera" '+
        'style="width:100%;padding:8px 10px;border:1.5px solid #d1d5db;border-radius:8px;font-size:14px;outline:none" '+
        'placeholder="Nombre del módulo">'+
    '</div>'+

    // Convocatoria
    '<div style="margin-bottom:1rem">'+
      '<label style="display:block;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;margin-bottom:4px">Convocatoria</label>'+
      '<select id="sen-conv" style="width:100%;padding:8px 10px;border:1.5px solid #d1d5db;border-radius:8px;font-size:13px;background:#fff;outline:none">'+
        '<option value="OC">Ordinaria (junio)</option>'+
        '<option value="EX">Extraordinaria (septiembre)</option>'+
      '</select>'+
    '</div>'+

    // Redondeo
    '<div style="margin-bottom:1rem">'+
      '<label style="display:block;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;margin-bottom:4px">Redondeo de la nota final</label>'+
      '<select id="sen-redondeo" style="width:100%;padding:8px 10px;border:1.5px solid #d1d5db;border-radius:8px;font-size:13px;background:#fff;outline:none">'+
        '<option value="redondeo">Redondeo matemático (0.5 → sube)</option>'+
        '<option value="floor">Siempre truncar (2.9 → 2)</option>'+
        '<option value="ceil">Siempre subir (2.1 → 3)</option>'+
        '<option value="decimal">Dejar con 1 decimal (solo CSV interno)</option>'+
      '</select>'+
    '</div>'+

    // Sin nota
    '<div style="margin-bottom:1.2rem">'+
      '<label style="display:block;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;margin-bottom:4px">Alumnos sin nota</label>'+
      '<select id="sen-sinnota" style="width:100%;padding:8px 10px;border:1.5px solid #d1d5db;border-radius:8px;font-size:13px;background:#fff;outline:none">'+
        '<option value="PE">PE — Pendiente de evaluación</option>'+
        '<option value="NE">NE — No evaluado</option>'+
        '<option value="dejar">Dejar en blanco</option>'+
      '</select>'+
    '</div>'+

    // Info
    '<div style="background:#eff6ff;border-radius:8px;padding:10px 12px;font-size:12px;color:#1e40af;margin-bottom:1.2rem;line-height:1.6">'+
      '💡 <strong>Formato generado:</strong> <code>NIF;Apellidos;Nombre;Calificacion</code><br>'+
      'El separador es <strong>punto y coma (;)</strong>. Codificación <strong>UTF-8</strong>.<br>'+
      'Los alumnos sin NIF/NIE figurarán con el campo vacío — cúbrelos antes de importar.'+
    '</div>'+

    '<div style="display:flex;gap:8px;justify-content:flex-end">'+
      '<button id="sen-cancel" style="padding:8px 18px;border:1.5px solid #d1d5db;border-radius:8px;background:#fff;font-size:13px;font-weight:600;cursor:pointer;color:#374151">Cancelar</button>'+
      '<button id="sen-ok" style="padding:8px 22px;border:none;border-radius:8px;background:#d4380d;color:#fff;font-size:13px;font-weight:700;cursor:pointer">Generar CSV</button>'+
    '</div>';

  modal.appendChild(box);
  document.body.appendChild(modal);

  document.getElementById('sen-cancel').onclick = function(){ document.body.removeChild(modal); };
  modal.onclick = function(e){ if(e.target===modal) document.body.removeChild(modal); };

  document.getElementById('sen-ok').onclick = function(){
    var modulo   = document.getElementById('sen-modulo').value || 'Gestion Financiera';
    var conv     = document.getElementById('sen-conv').value;
    var redondeo = document.getElementById('sen-redondeo').value;
    var sinNota  = document.getElementById('sen-sinnota').value;

    // Calcular nota media ponderada por alumno
    function getNotaAlumnoSen(udId, actId, alId){
      var entries=(udTests[udId]||[]).filter(function(t){ return t.actId===actId&&(t.alumnoId===alId||!t.alumnoId); });
      if(!entries.length) return null;
      return entries[entries.length-1].nota;
    }

    function aplicarRedondeo(v){
      if(redondeo==='floor')   return Math.floor(v);
      if(redondeo==='ceil')    return Math.ceil(v);
      if(redondeo==='decimal') return parseFloat(v.toFixed(1));
      return Math.round(v); // redondeo matemático
    }

    // Cabecera CSV
    var lineas = [
      '# Séneca · Junta de Andalucía · Importación de calificaciones',
      '# Módulo: '+modulo,
      '# Convocatoria: '+(conv==='OC'?'Ordinaria':'Extraordinaria'),
      '# Generado: '+new Date().toLocaleDateString('es-ES'),
      '# Formato: NIF;Apellidos;Nombre;Calificacion',
      'NIF;Apellidos;Nombre;Calificacion'
    ];

    DB.alumnos.forEach(function(al){
      var sumPeso=0, sumNota=0;
      todasActs.forEach(function(item){
        var n = getNotaAlumnoSen(item.ud.id, item.ae.id, al.id);
        if(n===null) n = (DB.notas[al.id]||{})[item.ae.id]!=null ? (DB.notas[al.id]||{})[item.ae.id] : null;
        if(n!==null){
          sumPeso += parseFloat(item.ae.peso)||0;
          sumNota += n*(parseFloat(item.ae.peso)||0);
        }
      });

      var calificacion;
      if(sumPeso > 0){
        calificacion = String(aplicarRedondeo(sumNota/sumPeso));
      } else {
        calificacion = sinNota==='dejar' ? '' : sinNota;
      }

      // Escapar campos para CSV (punto y coma como separador)
      var nif       = (al.nif||al.dni||'').replace(/;/g,'');
      var apellidos = (al.apellidos||'').replace(/;/g,'');
      var nombre    = (al.nombre||'').replace(/;/g,'');

      lineas.push([nif, apellidos, nombre, calificacion].join(';'));
    });

    // Descargar CSV
    var csvContent = lineas.join('\r\n');
    var blob = new Blob(['\uFEFF'+csvContent], {type:'text/csv;charset=utf-8'});
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    var fecha= new Date().toISOString().slice(0,10);
    a.href   = url;
    a.download = 'Seneca_'+modulo.replace(/\s+/g,'_')+'_'+conv+'_'+fecha+'.csv';
    a.click();
    URL.revokeObjectURL(url);

    document.body.removeChild(modal);
    flash('✅ CSV Séneca generado · '+DB.alumnos.length+' alumnos','#16a34a');
  };
}
function setNota(alId,ejId,val){ if(!DB.notas[alId]) DB.notas[alId]={}; DB.notas[alId][ejId]=val===''?null:parseFloat(val); save(); }


// ── Vista alumno ──────────────────────────────────────
function renderEvaluacionAlumno(cont){
  cont.innerHTML = '<div class="card"><p style="color:var(--muted);font-size:14px;text-align:center;padding:2rem">Las calificaciones son visibles solo para el profesor. Consulta tus notas en cada unidad didáctica.</p></div>';
}



