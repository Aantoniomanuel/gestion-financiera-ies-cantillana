// ── NAVEGACIÓN ─────────────────────────────────────────
function goTo(id, btn){
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
  document.querySelectorAll('.nav-item,.nav-subitem,.nav-sub2').forEach(function(b){b.classList.remove('active');});
  var pg = document.getElementById('page-'+id);
  if(pg) pg.classList.add('active');
  if(btn) btn.classList.add('active');
  var renders = {
    dashboard:renderDashboard, calendario:renderCalendario,
    alumnos:renderAlumnos, evaluacion:renderEvaluacion, materiales:renderMateriales,
    banco:function(){setTimeout(initBanco,20);},
    test:function(){setTimeout(initTest,20);},
    bolsa:function(){setTimeout(initBolsa,20);}, 'conceptos-bolsa':function(){setTimeout(initConceptosBolsa,20);},
    kiosco:function(){setTimeout(initKiosco,20);},
    'sim-prestamos':   function(){loadSim('sim-prestamos');},
    'sim-pb':          function(){loadSim('sim-pb');},
    'sim-presupuestos':function(){loadSim('sim-presupuestos');},
    'sim-inversiones': function(){loadSim('sim-inversiones');},
    'sim-aef':         function(){loadSim('sim-aef');},
    'sim-seguros':     function(){loadSim('sim-seguros');},
    'actividades':     function(){renderActividades();},
    'mis-actividades': function(){renderMisActividades();}
  };
  UNIDADES.forEach(function(u){ renders[u.id]=function(){renderUD(u);}; });
  if(renders[id]) renders[id]();
}
function toggleGroup(id){
  var btn=document.getElementById('grp-'+id), sub=document.getElementById('sub-'+id);
  if(!btn||!sub)return;
  btn.classList.toggle('open'); sub.classList.toggle('open');
}
function showBolsaTab(tab){
  // If bolsa already init, just switch tab
  if(document.getElementById('bs-'+tab)) switchBTab(tab);
  else { setTimeout(function(){ switchBTab(tab); }, 80); }
}
function abrirIndicesBME(){
  window.open('https://www.bolsasymercados.es/es/bme-exchange/indices/resumen.html','_blank','noopener');
}

// ── ROL ────────────────────────────────────────────────
// ── getRol(): fuente de verdad del rol actual ─────────────────
function getRol(){
  if(typeof USUARIO_ACTUAL !== 'undefined' && USUARIO_ACTUAL && USUARIO_ACTUAL.rol)
    return USUARIO_ACTUAL.rol === 'docente' ? 'profesor' : 'alumno';
  return 'alumno';
}

// ── _aplicarRolVerificado(): llamada solo por actualizarUIConPerfil ──
function _aplicarRolVerificado(rolSupabase){
  var esDocente = (rolSupabase === 'docente');
  ROL = esDocente ? 'profesor' : 'alumno';
  var rbProf=document.getElementById('rb-prof'), rbAlu=document.getElementById('rb-alu');
  if(rbProf) rbProf.classList.toggle('active', esDocente);
  if(rbAlu)  rbAlu.classList.toggle('active', !esDocente);
  if(typeof USUARIO_ACTUAL !== 'undefined' && USUARIO_ACTUAL){
    var uName=document.getElementById('u-name'), uRole=document.getElementById('u-role'), uAvatar=document.getElementById('u-avatar');
    if(uName)   uName.textContent = USUARIO_ACTUAL.nombre || USUARIO_ACTUAL.email.split('@')[0];
    if(uRole)   uRole.textContent = esDocente ? 'Docente · Gestión Financiera' : 'Alumno · Gestión Financiera';
    if(uAvatar && USUARIO_ACTUAL.avatar_url && !uAvatar.querySelector('img'))
      uAvatar.innerHTML = '<img src="'+USUARIO_ACTUAL.avatar_url+'" style="width:100%;height:100%;border-radius:50%;object-fit:cover">';
  }
  ['sec-prof','nav-nuevo-bloque','nav-banco','nav-alumnos','nav-eval','nav-actividades','nav-materiales','btn-add-evento'].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.style.display = esDocente ? (el.tagName==='BUTTON'?'flex':'block') : 'none';
  });
  if(!esDocente){
    var rb=document.querySelector('.rol-btns');
    if(rb) rb.style.display='none';
    if(rbProf) rbProf.style.display='none';
    if(rbAlu)  rbAlu.style.display='none';
  }
  renderDashboard();
}

// ── setRol(): solo el docente puede usarla (previsualizar vista alumno) ──
function setRol(rolSolicitado){
  var rolReal = (typeof USUARIO_ACTUAL !== 'undefined' && USUARIO_ACTUAL) ? USUARIO_ACTUAL.rol : null;
  if(rolReal !== 'docente'){
    console.warn('[GF-Seguridad] setRol() denegado: solo el docente puede cambiar la vista.');
    return; // alumno no puede escalar rol desde consola ni desde UI
  }
  ROL = rolSolicitado;
  var rbProf=document.getElementById('rb-prof'), rbAlu=document.getElementById('rb-alu');
  if(rbProf) rbProf.classList.toggle('active', rolSolicitado==='profesor');
  if(rbAlu)  rbAlu.classList.toggle('active', rolSolicitado==='alumno');
  renderDashboard();
}

// ── MODAL ──────────────────────────────────────────────
function abrirModal(titulo, cuerpo, pie){ document.getElementById('modal-titulo').textContent=titulo; document.getElementById('modal-cuerpo').innerHTML=cuerpo; document.getElementById('modal-pie').innerHTML=pie; document.getElementById('modal').classList.add('open'); }
function cerrarModal(){ document.getElementById('modal').classList.remove('open'); }
