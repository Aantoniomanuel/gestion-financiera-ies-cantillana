// ── PERSISTENCIA PROFESOR EN SUPABASE ─────────────────────────────
// Requiere tabla: profesor_config (docente_id uuid, clave text, valor jsonb)
// PRIMARY KEY (docente_id, clave) — RLS: solo el docente puede leer/escribir su config

var _syncDebounces = {};

function syncProfesorConfig(clave, valor){
  if(!USUARIO_ACTUAL || USUARIO_ACTUAL.rol !== 'docente') return;
  clearTimeout(_syncDebounces[clave]);
  _syncDebounces[clave] = setTimeout(function(){
    supa.from('profesor_config')
      .upsert({docente_id: USUARIO_ACTUAL.id, clave: clave, valor: valor},
              {onConflict: 'docente_id,clave'})
      .then(function(r){
        if(r.error) console.warn('[Sync cfg]', clave, r.error.message);
      });
  }, 1500);
}

async function cargarConfigProfesor(){
  if(!USUARIO_ACTUAL || USUARIO_ACTUAL.rol !== 'docente') return;
  try{
    var {data, error} = await supa.from('profesor_config')
      .select('clave,valor').eq('docente_id', USUARIO_ACTUAL.id);
    if(error || !data || !data.length) return;

    var claveMap = {};
    data.forEach(function(r){ claveMap[r.clave] = r.valor; });

    var restaurados = [];
    var claves = [
      ['gf_unidades','UNIDADES restaurado'],
      ['gf_ra_ce','RA/CE restaurado'],
      ['gf_act_eval','Actividades evaluables'],
      ['gf_act_aprend','Actividades aprendizaje'],
      ['gf_glosario','Glosario'],
      ['gf_cont_data','Contenidos'],
      ['gf_bloques_estructura','Estructura bloques'],
      ['gf_banco_preguntas','Banco preguntas']
    ];
    claves.forEach(function(par){
      var k = par[0], lbl = par[1];
      if(!localStorage.getItem(k) && claveMap[k]){
        localStorage.setItem(k, JSON.stringify(claveMap[k]));
        restaurados.push(lbl);
      }
    });

    if(restaurados.length){
      try{ UNIDADES = JSON.parse(localStorage.getItem('gf_unidades')||'null') || UNIDADES; }catch(e){}
      try{ RA_CE_DATA = JSON.parse(localStorage.getItem('gf_ra_ce')||'null') || RA_CE_DATA; }catch(e){}
      try{ ACT_EVAL = JSON.parse(localStorage.getItem('gf_act_eval')||'null') || ACT_EVAL; }catch(e){}
      try{ ACT_APRENDIZAJE = JSON.parse(localStorage.getItem('gf_act_aprend')||'null') || ACT_APRENDIZAJE; }catch(e){}
      try{ GLOSARIO_DATA = JSON.parse(localStorage.getItem('gf_glosario')||'null') || GLOSARIO_DATA; }catch(e){}
      try{ CONT_DATA = JSON.parse(localStorage.getItem('gf_cont_data')||'{}'); }catch(e){}
      flash('\u2601\ufe0f Contenido restaurado desde la nube (' + restaurados.length + ' secciones)', '#16a34a');
      renderDashboard();
    }
  } catch(e){ console.warn('[cargarConfigProfesor]', e); }
}

// Wrappear las funciones save para que tambien sincronicen en Supabase
(function(){
  var orig = {
    saveUNIDADES: saveUNIDADES, saveRACE: saveRACE,
    saveActEval: saveActEval, saveActAprend: saveActAprend,
    saveGlosario: saveGlosario, saveCont: saveCont,
    saveBloques: saveBloques, saveBanco: saveBanco
  };
  saveUNIDADES = function(){ orig.saveUNIDADES(); syncProfesorConfig('gf_unidades', UNIDADES); };
  saveRACE     = function(){ orig.saveRACE();     syncProfesorConfig('gf_ra_ce', RA_CE_DATA); };
  saveActEval  = function(){ orig.saveActEval();  syncProfesorConfig('gf_act_eval', ACT_EVAL); };
  saveActAprend= function(){ orig.saveActAprend();syncProfesorConfig('gf_act_aprend', ACT_APRENDIZAJE); };
  saveGlosario = function(){ orig.saveGlosario(); syncProfesorConfig('gf_glosario', GLOSARIO_DATA); };
  saveCont     = function(){ orig.saveCont();     syncProfesorConfig('gf_cont_data', CONT_DATA); };
  saveBloques  = function(b){ orig.saveBloques(b); syncProfesorConfig('gf_bloques_estructura', b); };
  saveBanco    = function(arr){ orig.saveBanco(arr); syncProfesorConfig('gf_banco_preguntas', arr); };
})();

// ── GESTION DE GRUPOS ─────────────────────────────────────────────
var _filtroGrupoCalif = '';

function obtenerGruposDisponibles(){
  var usados = new Set(DB.alumnos.map(function(a){ return a.grupo; }).filter(Boolean));
  ['1AF-A','1AF-B','2AF-A','2AF-B'].forEach(function(g){ usados.add(g); });
  return Array.from(usados).sort();
}

async function asignarGrupoAlumno(alumnoId, nuevoGrupo){
  var {error} = await supa.from('perfiles').update({grupo: nuevoGrupo||null}).eq('id', alumnoId);
  if(error){ flash('Error al asignar grupo: '+error.message, '#dc2626'); return false; }
  flash('Grupo actualizado', '#16a34a');
  var al = DB.alumnos.find(function(a){ return a.id===alumnoId; });
  if(al) al.grupo = nuevoGrupo;
  return true;
}

function crearSelectorGrupo(alumnoId, grupoActual){
  var grupos = obtenerGruposDisponibles();
  var sel = document.createElement('select');
  sel.className = 'fs';
  sel.style.cssText = 'font-size:11px;padding:3px 8px;border-radius:6px;border:1px solid var(--border-md);background:var(--surface);color:var(--text);cursor:pointer;font-family:inherit;width:auto';
  var opt0 = document.createElement('option'); opt0.value=''; opt0.textContent='Sin grupo';
  sel.appendChild(opt0);
  grupos.forEach(function(g){
    var opt = document.createElement('option'); opt.value=g; opt.textContent=g;
    if(g===grupoActual) opt.selected=true;
    sel.appendChild(opt);
  });
  if(!grupoActual) sel.value='';
  sel.onchange = function(){
    var val = sel.value;
    asignarGrupoAlumno(alumnoId, val||null);
  };
  return sel;
}

function renderFiltroGrupoCalif(container, onchange){
  if(document.getElementById('filtro-grupo-calif')) return;
  var grupos = obtenerGruposDisponibles();
  var div = document.createElement('div');
  div.id = 'filtro-grupo-calif';
  div.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap';
  var lbl = document.createElement('span');
  lbl.style.cssText = 'font-size:12px;color:var(--muted);font-weight:600';
  lbl.textContent = 'Filtrar por grupo:';
  div.appendChild(lbl);
  var sel = document.createElement('select');
  sel.style.cssText = 'font-size:13px;padding:5px 10px;border-radius:8px;border:1px solid var(--border-md);background:var(--surface);color:var(--text);font-family:inherit';
  var optAll = document.createElement('option'); optAll.value=''; optAll.textContent='Todos los grupos';
  sel.appendChild(optAll);
  grupos.forEach(function(g){
    var opt = document.createElement('option'); opt.value=g; opt.textContent=g;
    if(g===_filtroGrupoCalif) opt.selected=true;
    sel.appendChild(opt);
  });
  sel.onchange = function(){
    _filtroGrupoCalif = sel.value;
    if(onchange) onchange(sel.value);
  };
  div.appendChild(sel);
  container.insertBefore(div, container.firstChild);
}

window.asignarGrupoAlumno = asignarGrupoAlumno;
window.crearSelectorGrupo = crearSelectorGrupo;
window.renderFiltroGrupoCalif = renderFiltroGrupoCalif;
window.cargarConfigProfesor = cargarConfigProfesor;
