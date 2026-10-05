

// ══════════════════════════════════════════════════════
//  SUPABASE + SISTEMA COMPLETO
// ══════════════════════════════════════════════════════
const SUPA_URL  = 'https://aqeahkwedkjwdvtpfaqm.supabase.co';
const SUPA_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZWFoa3dlZGtqd2R2dHBmYXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4OTU3NDIsImV4cCI6MjA5MjQ3MTc0Mn0.TU-awshpvPml6QX8jM8lw_BBXWiZM8V6olRPVaIH8Gg';
const supa = supabase.createClient(SUPA_URL, SUPA_ANON);

var USUARIO_ACTUAL = null;
var GRUPO_ID_ACTUAL = 'c2f27bab-a1a5-4e92-aed9-536b4f39fb4a';

var SIMS_INFO = {
  'sim-prestamos':    {nombre:'Préstamos e Hipotecas',  bloque:'B2', ra:'RA2'},
  'sim-pb':           {nombre:'Productos Bancarios',    bloque:'B2', ra:'RA2'},
  'sim-presupuestos': {nombre:'Presupuestos',           bloque:'B2', ra:'RA2'},
  'sim-inversiones':  {nombre:'Inversiones',            bloque:'B3', ra:'RA3'},
  'sim-aef':          {nombre:'Estados Financieros',    bloque:'B1', ra:'RA1'},
  'sim-seguros':      {nombre:'Seguros',                bloque:'B4', ra:'RA4'},
};

// ── Cargador de simuladores ───────────────────────────
function loadSim(id){
  var root=document.getElementById(id+'-root');
  if(!root)return;
  if(root.querySelector('iframe'))return;
  root.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:300px;gap:12px;color:#6b6560;font-size:13px">'+
    '<div style="width:22px;height:22px;border:2px solid #ccc;border-top-color:#1a2744;border-radius:50%;animation:spin .7s linear infinite"></div>'+
    'Cargando simulador\u2026</div>';
  setTimeout(function(){
    var html=SIM_HTML[id];
    if(!html){root.innerHTML='<div style="padding:2rem;color:red">Simulador no encontrado: '+id+'</div>';return;}
    var blob=new Blob([html],{type:'text/html;charset=utf-8'});
    var url=URL.createObjectURL(blob);
    var ifr=document.createElement('iframe');
    ifr.src=url;
    ifr.style.cssText='width:100%;height:calc(100vh - 58px);border:none;display:block';
    ifr.onload=function(){
      URL.revokeObjectURL(url);
      // Check if this load was triggered from Mis Actividades panel
      var pending = window._pendingActividad;
      if(pending && pending.simCod === id){
        window._pendingActividad = null;
        setTimeout(function(){
          // Send actividad info directly (no need to check, we know it's active)
          ifr.contentWindow.postMessage({
            tipo:      'actividad_info_'+id.replace('sim-',''),
            actividad: {id: pending.actId, nivel: pending.nivel},
            entregaId: pending.entregaId
          },'*');
          // Go to ejercicio mode and generate new case - wait longer for DOM ready
          setTimeout(function(){
            ifr.contentWindow.postMessage({tipo:'ir_a_ejercicio'},'*');
          },800);
        },1000);
      } else {
        // Normal load - check for active activity and send current level
        setTimeout(async function(){
          ifr.contentWindow.postMessage({tipo:'check_actividad', simulador:id},'*');
          // Send current adaptive level for this simulator
          if(USUARIO_ACTUAL){
            var {data:sim} = await supa.from('simuladores').select('id').eq('codigo',id).single();
            if(sim){
              var {data:ult} = await supa.from('ejercicios_realizados').select('nivel')
                .eq('alumno_id',USUARIO_ACTUAL.id).eq('simulador_id',sim.id).eq('completado',true)
                .order('created_at',{ascending:false}).limit(1);
              if(ult&&ult.length>0){
                ifr.contentWindow.postMessage({
                  tipo:'set_nivel_'+id.replace('sim-',''),
                  nivel:ult[0].nivel
                },'*');
              }
            }
          }
        },600);
      }
    };
    root.innerHTML='';
    root.appendChild(ifr);
  },80);
}

// ── Auth ──────────────────────────────────────────────
async function loginConGoogle(){
  var btn=document.getElementById('btn-google-login');
  if(btn){btn.disabled=true;btn.textContent='Conectando...';}
  var {error}=await supa.auth.signInWithOAuth({
    provider:'google',
    options:{redirectTo:window.location.href, queryParams:{hd:'g.educaand.es'}}
  });
  if(error){
    var e=document.getElementById('login-error');
    if(e){e.style.display='block';e.textContent='Error: '+error.message;}
    if(btn){btn.disabled=false;btn.textContent='Entrar con Google';}
  }
}

// ─── Login / Registro por email ──────────────────────────
var _DOMINIO_CENTRO = '@g.educaand.es';

function loginShowTab(tab){
  var isLogin = tab === 'login';
  document.getElementById('form-login').style.display    = isLogin ? '' : 'none';
  document.getElementById('form-registro').style.display = isLogin ? 'none' : '';
  var tL = document.getElementById('tab-login');
  var tR = document.getElementById('tab-registro');
  tL.style.background   = isLogin ? '#fff' : 'transparent';
  tL.style.color        = isLogin ? '#1a2744' : '#9ca3af';
  tL.style.boxShadow    = isLogin ? '0 1px 3px rgba(0,0,0,.1)' : 'none';
  tR.style.background   = !isLogin ? '#fff' : 'transparent';
  tR.style.color        = !isLogin ? '#1a2744' : '#9ca3af';
  tR.style.boxShadow    = !isLogin ? '0 1px 3px rgba(0,0,0,.1)' : 'none';
  // Limpiar mensajes
  ['login-error','login-ok'].forEach(function(id){
    var el = document.getElementById(id);
    if(el){ el.style.display='none'; el.textContent=''; }
  });
}

function _loginMsg(msg, tipo){
  var err = document.getElementById('login-error');
  var ok  = document.getElementById('login-ok');
  if(tipo === 'ok'){ if(err) err.style.display='none'; if(ok){ok.textContent=msg;ok.style.display='block';} }
  else             { if(ok)  ok.style.display='none';  if(err){err.textContent=msg;err.style.display='block';} }
}

async function loginConEmail(){
  var email = (document.getElementById('login-email')||{}).value.trim().toLowerCase();
  var pass  = (document.getElementById('login-password')||{}).value;
  if(!email||!pass){ _loginMsg('Introduce correo y contraseña','err'); return; }
  if(!email.endsWith(_DOMINIO_CENTRO)){ _loginMsg('Solo se permiten cuentas '+_DOMINIO_CENTRO,'err'); return; }
  var btn = document.querySelector('#form-login button');
  if(btn){ btn.disabled=true; btn.textContent='Entrando…'; }
  var {error} = await supa.auth.signInWithPassword({email, password:pass});
  if(error){
    _loginMsg(error.message.includes('Invalid')||error.message.includes('credentials')
      ? 'Correo o contraseña incorrectos'
      : error.message.includes('Email not confirmed')
        ? 'Confirma tu correo antes de entrar (revisa la bandeja de entrada)'
        : 'Error: '+error.message, 'err');
    if(btn){ btn.disabled=false; btn.textContent='Entrar'; }
  }
}

async function registrarConEmail(){
  var nombre   = (document.getElementById('reg-nombre')||{}).value.trim();
  var apellidos= (document.getElementById('reg-apellidos')||{}).value.trim();
  var email    = (document.getElementById('reg-email')||{}).value.trim().toLowerCase();
  var pass     = (document.getElementById('reg-password')||{}).value;
  var pass2    = (document.getElementById('reg-password2')||{}).value;
  if(!nombre)                              { _loginMsg('Introduce tu nombre','err'); return; }
  if(!email)                               { _loginMsg('Introduce tu correo','err'); return; }
  if(!email.endsWith(_DOMINIO_CENTRO))     { _loginMsg('Solo se permiten cuentas '+_DOMINIO_CENTRO,'err'); return; }
  if(pass.length < 8)                      { _loginMsg('La contraseña debe tener al menos 8 caracteres','err'); return; }
  if(pass !== pass2)                       { _loginMsg('Las contraseñas no coinciden','err'); return; }
  var btn = document.querySelector('#form-registro button');
  if(btn){ btn.disabled=true; btn.textContent='Creando cuenta…'; }
  var {error} = await supa.auth.signUp({
    email, password: pass,
    options:{ data:{ nombre, apellidos } }
  });
  if(error){
    _loginMsg(error.message.includes('already registered')
      ? 'Este correo ya está registrado. Usa la pestaña Entrar.'
      : 'Error: '+error.message, 'err');
    if(btn){ btn.disabled=false; btn.textContent='Crear cuenta'; }
  } else {
    _loginMsg('✅ Cuenta creada. Revisa tu bandeja de '+email+' y confirma el enlace antes de entrar.','ok');
    if(btn){ btn.disabled=false; btn.textContent='Crear cuenta'; }
    // Limpiar campos
    ['reg-nombre','reg-apellidos','reg-email','reg-password','reg-password2'].forEach(function(id){
      var el=document.getElementById(id); if(el) el.value='';
    });
  }
}

async function logout(){
  await supa.auth.signOut();
  USUARIO_ACTUAL=null;
  mostrarLogin();
}

function mostrarLogin(){
  document.getElementById('loading-screen').style.display='none';
  document.getElementById('login-screen').style.display='flex';
  document.getElementById('app-shell').style.display='none';
}
function mostrarApp(){
  document.getElementById('loading-screen').style.display='none';
  document.getElementById('login-screen').style.display='none';
  document.getElementById('app-shell').style.display='';
}
function mostrarCargando(){
  document.getElementById('loading-screen').style.display='flex';
  document.getElementById('login-screen').style.display='none';
  document.getElementById('app-shell').style.display='none';
}

async function cargarPerfil(uid){
  var {data}=await supa.from('perfiles').select('*').eq('id',uid).single();
  return data;
}

function actualizarUIConPerfil(perfil){
  USUARIO_ACTUAL=perfil;
  // Aplicar rol verificado desde Supabase (fuente de verdad)
  _aplicarRolVerificado(perfil.rol);
  requestAnimationFrame(function(){
    setTimeout(function(){
      var uName=document.getElementById('u-name');
      var uRole=document.getElementById('u-role');
      var uAvatar=document.getElementById('u-avatar');
      if(uName) uName.textContent=perfil.nombre||perfil.email.split('@')[0];
      if(uRole) uRole.textContent=perfil.rol==='docente'?'Docente · Gestión Financiera':'Alumno · Gestión Financiera';
      if(uAvatar&&perfil.avatar_url&&!uAvatar.querySelector('img'))
        uAvatar.innerHTML='<img src="'+perfil.avatar_url+'" style="width:100%;height:100%;border-radius:50%;object-fit:cover">';
      if(perfil.rol==='docente'){
        setTimeout(function(){
          if(window.cargarConfigProfesor) cargarConfigProfesor();
          // Mantener al día la copia que lee el alumnado
          syncProfesorConfig('gf_cont_publico', contenidoPublico());
        }, 800);
      } else {
        cargarContenidoAlumno();
      }
      // Add logout button
      var sf=document.querySelector('.s-footer');
      if(sf&&!document.getElementById('btn-logout')){
        var b=document.createElement('button');
        b.id='btn-logout';b.textContent='\u23FB Cerrar sesión';
        b.style.cssText='width:calc(100% - 1rem);margin:6px 8px 4px;padding:7px;border-radius:8px;border:1px solid rgba(255,255,255,.15);background:transparent;color:rgba(255,255,255,.5);font-size:11px;cursor:pointer;text-align:left;font-family:inherit';
        b.addEventListener('click',logout);
        sf.appendChild(b);
        // Botón relanzar tour
        var bt=document.createElement('button');
        bt.id='btn-tour';
        bt.innerHTML='&#x1F9ED; Ver tour de la plataforma';
        bt.style.cssText='width:calc(100% - 1rem);margin:0 8px 8px;padding:7px;border-radius:8px;border:1px solid rgba(201,168,76,.3);background:transparent;color:rgba(240,217,138,.6);font-size:11px;cursor:pointer;text-align:left;font-family:inherit';
        bt.addEventListener('click',function(){ localStorage.removeItem('gf_ob_done_v1'); obStart(); });
        sf.appendChild(bt);
        // Boton modo oscuro
        var bd=document.createElement('button');
        bd.id='btn-dark';
        if(localStorage.getItem('gf_dark')==='1') document.body.classList.add('dark');
        bd.textContent=document.body.classList.contains('dark')? 'Sol Modo claro' : 'Luna Modo oscuro';
        bd.addEventListener('click',toggleDark);
        sf.appendChild(bd);
      }
      // Hide prof items for alumno
      if(perfil.rol==='alumno'){
        var hide=[
          'sec-prof','nav-nuevo-bloque','nav-banco','nav-alumnos',
          'nav-eval','nav-actividades','nav-materiales','btn-add-evento',
          'rb-prof','rb-alu','grp-herr'
        ];
        hide.forEach(function(id){var el=document.getElementById(id);if(el)el.style.display='none';});
        // Hide rol-btns container
        var rolBtns=document.querySelector('.rol-btns');
        if(rolBtns) rolBtns.style.display='none';
        // Also hide individually
        var rbProf=document.getElementById('rb-prof');
        var rbAlu=document.getElementById('rb-alu');
        if(rbProf) rbProf.style.display='none';
        if(rbAlu) rbAlu.style.display='none';
        // Hide edit buttons in content pages
        document.querySelectorAll('.btn-edit-bloque,.btn-add-ud,.btn-nuevo-contenido,[onclick*="abrirModal"],[onclick*="editarBloque"],[onclick*="nuevoContenido"]').forEach(function(el){
          el.style.display='none';
        });
        // Lanzar onboarding si es la primera vez
        setTimeout(function(){ if(window.obStart) obStart(); }, 600);
        // Mostrar nav mis-actividades y lanzar notificaciones
        var navMisAct = document.getElementById('nav-mis-actividades');
        if(navMisAct) navMisAct.style.display = '';
        setTimeout(function(){ checkNotificaciones(); }, 1200);
        // Polling cada 3 minutos para nuevas actividades
        if(_notifInterval) clearInterval(_notifInterval);
        _notifInterval = setInterval(function(){ checkNotificaciones(); }, 3*60*1000);
      }
    },50);
  });
}

async function registrarAcceso(){
  if(!USUARIO_ACTUAL)return;
  try{await supa.from('accesos').insert({usuario_id:USUARIO_ACTUAL.id,email:USUARIO_ACTUAL.email,rol:USUARIO_ACTUAL.rol});}catch(e){}
}

async function registrarEjercicio(simCod,nivel,punt,datos,resp,tiempo){
  if(!USUARIO_ACTUAL)return;
  var {data:sim}=await supa.from('simuladores').select('id').eq('codigo',simCod).single();
  if(!sim)return;
  await supa.from('ejercicios_realizados').insert({
    alumno_id:USUARIO_ACTUAL.id,simulador_id:sim.id,nivel,puntuacion:punt,
    datos_caso:datos||{},respuestas:resp||{},tiempo_segundos:tiempo||0,completado:true
  });
}

async function calcularNivelAdaptativo(simCod){
  if(!USUARIO_ACTUAL)return;
  var {data:sim}=await supa.from('simuladores').select('id').eq('codigo',simCod).single();
  if(!sim)return;
  var {data:ult}=await supa.from('ejercicios_realizados').select('nivel,puntuacion')
    .eq('alumno_id',USUARIO_ACTUAL.id).eq('simulador_id',sim.id).eq('completado',true)
    .order('created_at',{ascending:false}).limit(3);
  if(!ult||ult.length<3)return;
  var media=ult.reduce(function(s,e){return s+(e.puntuacion||0);},0)/ult.length;
  var niv=ult[0].nivel;
  var nivs=['basico','medio','avanzado'];
  var idx=nivs.indexOf(niv);
  var nuevoNiv=niv;
  if(media>=80&&idx<2) nuevoNiv=nivs[idx+1];
  else if(media<50&&idx>0) nuevoNiv=nivs[idx-1];
  if(nuevoNiv!==niv){
    var root=document.getElementById(simCod+'-root');
    if(root){var ifr=root.querySelector('iframe');if(ifr&&ifr.contentWindow)
      ifr.contentWindow.postMessage({tipo:'set_nivel_'+simCod.replace('sim-',''),nivel:nuevoNiv},'*');}
    mostrarNotificacionNivel(nuevoNiv,media);
  }
}

function mostrarNotificacionNivel(niv,media){
  var labels={basico:'Básico',medio:'Medio',avanzado:'Avanzado'};
  var msg=document.createElement('div');
  msg.style.cssText='position:fixed;bottom:80px;right:24px;background:#1a2744;color:#fff;padding:14px 18px;border-radius:12px;font-size:13px;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,.3);max-width:280px;border-left:3px solid #c9a84c';
  msg.innerHTML='<div style="font-weight:700;margin-bottom:4px">\uD83C\uDFAF Nivel actualizado</div>'+
    '<div style="opacity:.8">Media: <strong>'+media.toFixed(0)+'%</strong></div>'+
    '<div style="margin-top:6px">Nuevo nivel: <strong>'+labels[niv]+'</strong></div>';
  document.body.appendChild(msg);
  setTimeout(function(){msg.remove();},5000);
}

// ── Actividades evaluables ────────────────────────────
async function comprobarActividadActiva(simCod){
  if(!USUARIO_ACTUAL)return null;
  var {data:sim}=await supa.from('simuladores').select('id').eq('codigo',simCod).single();
  if(!sim)return null;
  var ahora=new Date().toISOString();
  var {data:acts}=await supa.from('actividades').select('*').eq('simulador_id',sim.id).eq('activa',true)
    .or('fecha_limite.is.null,fecha_limite.gt.'+ahora).limit(1);
  if(!acts||!acts.length)return null;
  var act=acts[0];
  var {data:entrega}=await supa.from('entregas').select('*')
    .eq('actividad_id',act.id).eq('alumno_id',USUARIO_ACTUAL.id).maybeSingle();
  // Si ya fue entregada (completada), no mostrar el botón
  if(entrega && entrega.entregada_at) return null;
  return {actividad:act,entrega:entrega||null};
}

async function iniciarEntrega(actId,datos){
  if(!USUARIO_ACTUAL)return null;
  var {data:ex}=await supa.from('entregas').select('*').eq('actividad_id',actId).eq('alumno_id',USUARIO_ACTUAL.id).maybeSingle();
  if(ex){
    // Si ya existe y tiene tiempo límite, relanzar el temporizador
    if(ex.iniciada_at){
      var {data:act}=await supa.from('actividades').select('tiempo_limite_minutos').eq('id',actId).single();
      if(act&&act.tiempo_limite_minutos) iniciarTemporizador(ex.iniciada_at, act.tiempo_limite_minutos, actId);
    }
    return ex;
  }
  var ahora=new Date().toISOString();
  var {data:nueva}=await supa.from('entregas').insert({actividad_id:actId,alumno_id:USUARIO_ACTUAL.id,datos_caso:datos||{},respuestas:{},iniciada_at:ahora}).select().single();
  // Lanzar temporizador si la actividad tiene tiempo límite
  if(nueva){
    var {data:act}=await supa.from('actividades').select('tiempo_limite_minutos').eq('id',actId).single();
    if(act&&act.tiempo_limite_minutos) iniciarTemporizador(ahora, act.tiempo_limite_minutos, actId);
  }
  return nueva;
}

// ── Temporizador para actividades con tiempo límite ───────────
var _timerInterval = null;
var _timerEntregaId = null;

function iniciarTemporizador(iniciadaAt, minutos, actId){
  if(_timerInterval) clearInterval(_timerInterval);
  // Crear o reusar el widget del temporizador
  var existing = document.getElementById('gf-timer');
  if(!existing){
    var t = document.createElement('div');
    t.id = 'gf-timer';
    t.style.cssText = 'position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:8500;background:#1a2744;color:#fff;border-radius:12px;padding:10px 28px;font-family:IBM Plex Mono,monospace;font-size:1.3rem;font-weight:700;letter-spacing:2px;box-shadow:0 4px 20px rgba(0,0,0,.35);display:flex;align-items:center;gap:12px;min-width:160px;justify-content:center';
    t.innerHTML = '<span style="font-size:1rem">⏱</span><span id="gf-timer-display">--:--</span>';
    document.body.appendChild(t);
  }
  var fin = new Date(iniciadaAt).getTime() + minutos * 60 * 1000;
  function tick(){
    var resto = fin - Date.now();
    if(resto <= 0){
      clearInterval(_timerInterval);
      _timerInterval = null;
      document.getElementById('gf-timer-display').textContent = '00:00';
      document.getElementById('gf-timer').style.background = '#b91c1c';
      // Entregar automáticamente
      entregarPorTiempo(actId);
      return;
    }
    var mins = Math.floor(resto/60000);
    var secs = Math.floor((resto%60000)/1000);
    var display = String(mins).padStart(2,'0')+':'+String(secs).padStart(2,'0');
    document.getElementById('gf-timer-display').textContent = display;
    // Avisos visuales
    var el = document.getElementById('gf-timer');
    if(resto < 60000) el.style.background = '#b91c1c'; // rojo último minuto
    else if(resto < 300000) el.style.background = '#92400e'; // ámbar 5 min
    else el.style.background = '#1a2744';
  }
  tick();
  _timerInterval = setInterval(tick, 1000);
}

async function entregarPorTiempo(actId){
  // Buscar la entrega activa del alumno
  if(!USUARIO_ACTUAL) return;
  var {data:ent} = await supa.from('entregas').select('id').eq('actividad_id',actId).eq('alumno_id',USUARIO_ACTUAL.id).maybeSingle();
  if(!ent) return;
  // Marcar como entregada automáticamente
  await supa.from('entregas').update({entregada_at: new Date().toISOString(), respuestas: {auto_entregada: true}}).eq('id',ent.id);
  // Ocultar temporizador
  var t = document.getElementById('gf-timer');
  if(t) t.remove();
  // Avisar al alumno
  flash('⏱ Tiempo agotado — actividad entregada automáticamente', '#b91c1c');
  // Notificar al simulador activo para que se bloquee
  document.querySelectorAll('.page.active iframe').forEach(function(ifr){
    try{ ifr.contentWindow.postMessage({tipo:'tiempo_agotado'},'*'); }catch(e){}
  });
}

// ── Receptor de mensajes de simuladores ──────────────
window.addEventListener('message',async function(e){
  if(!e.data)return;
  var msg=e.data;

  if(msg.tipo==='check_actividad'&&USUARIO_ACTUAL){
    var info=await comprobarActividadActiva(msg.simulador);
    var root=document.getElementById(msg.simulador+'-root');
    var ifr=root?root.querySelector('iframe'):null;
    if(ifr&&ifr.contentWindow){
      ifr.contentWindow.postMessage({
        tipo:'actividad_info_'+msg.simulador.replace('sim-',''),
        actividad:info?info.actividad:null,
        entregaId:info&&info.entrega?info.entrega.id:null
      },'*');
    }
    return;
  }

  if(msg.tipo==='iniciar_entrega_evaluable'&&USUARIO_ACTUAL){
    var ent=await iniciarEntrega(msg.actividadId,msg.datosCaso||{});
    var root2=document.getElementById(msg.simulador+'-root');
    var ifr2=root2?root2.querySelector('iframe'):null;
    if(ifr2&&ifr2.contentWindow&&ent)
      ifr2.contentWindow.postMessage({tipo:'entrega_iniciada_'+msg.simulador.replace('sim-',''),entregaId:ent.id},'*');
    return;
  }

  if(msg.tipo==='ejercicio_completado'&&USUARIO_ACTUAL){
    await registrarEjercicio(msg.simulador,msg.nivel,msg.puntuacion,msg.caso||{},{},0);
    if(msg.entregaId&&msg.entregaId!=='pendiente'){
      await supa.from('entregas').update({
        respuestas:     msg.respuestas  || {},
        datos_caso:     msg.datosCaso   || {},
        puntuacion_automatica: msg.puntuacion,
        entregada_at:   new Date().toISOString()
      }).eq('id',msg.entregaId).eq('alumno_id',USUARIO_ACTUAL.id);
    }
    await calcularNivelAdaptativo(msg.simulador);
  }
});

// ── Panel alumnos ─────────────────────────────────────
function renderAlumnos(){
  var grid=document.getElementById('alumnos-grid');
  if(!grid)return;
  // Switch to single column for detail view
  grid.style.cssText = 'max-width:900px;margin:0 auto;';
  grid.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:200px;color:#9ca3af;gap:10px"><div style="width:20px;height:20px;border:2px solid #ccc;border-top-color:#1a2744;border-radius:50%;animation:spin .7s linear infinite"></div>Cargando…</div>';
  if(!USUARIO_ACTUAL||USUARIO_ACTUAL.rol!=='docente'){
    grid.innerHTML='<div class="card"><div class="card-body" style="text-align:center;color:#9ca3af;padding:2rem">Solo el docente puede ver esta sección.</div></div>';
    return;
  }
  cargarPanelAlumnos(grid);
}

async function cargarPanelAlumnos(grid){
  try{
    var [{data:perfs},{data:ejercicios},{data:accesos},{data:sims}]=await Promise.all([
      supa.from('perfiles').select('*').eq('rol','alumno').order('nombre'),
      supa.from('ejercicios_realizados').select('alumno_id,simulador_id,nivel,puntuacion,created_at').eq('completado',true),
      supa.from('accesos').select('usuario_id,created_at').order('created_at',{ascending:false}),
      supa.from('simuladores').select('id,nombre,codigo,bloque'),
    ]);
    var simMap={};(sims||[]).forEach(function(s){simMap[s.id]=s;});
    var sub=document.getElementById('alumnos-sub');
    if(sub)sub.textContent=(perfs||[]).length+' alumno'+(perfs&&perfs.length!==1?'s':'')+' registrado'+(perfs&&perfs.length!==1?'s':'');
    if(!perfs||!perfs.length){
      grid.innerHTML='<div class="card"><div class="card-body" style="text-align:center;padding:2rem;color:#9ca3af"><div style="font-size:2.5rem;margin-bottom:1rem">👥</div><div>Sin alumnos registrados todavía.</div></div></div>';
      return;
    }
    var totalEj=(ejercicios||[]).length;
    var mediaG=totalEj>0?Math.round((ejercicios||[]).reduce(function(s,e){return s+(e.puntuacion||0);},0)/totalEj):0;
    var activos=new Set((ejercicios||[]).map(function(e){return e.alumno_id;})).size;
    var html='<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:1.5rem">';
    html+=mkSC('👥',perfs.length,'Alumnos registrados','');
    html+=mkSC('✅',activos,'Con ejercicios','pos');
    html+=mkSC('📊',mediaG+'%','Media global',mediaG>=70?'pos':mediaG>=50?'':'neg');
    html+='</div>';
    html+='<div class="card"><div class="card-header"><div class="card-title">📋 Seguimiento</div></div><div class="card-body" style="padding:0"><div style="overflow-x:auto"><table class="dt" style="width:100%"><thead><tr><th style="text-align:left;padding:10px 14px">Alumno</th><th>Grupo</th><th>Ejercicios</th><th>Media</th><th>Nivel máx.</th><th>Último acceso</th><th></th></tr></thead><tbody>';
    perfs.forEach(function(p){
      var ej=(ejercicios||[]).filter(function(e){return e.alumno_id===p.id;});
      var ac=(accesos||[]).filter(function(a){return a.usuario_id===p.id;});
      var n=ej.length;
      var med=n>0?Math.round(ej.reduce(function(s,e){return s+(e.puntuacion||0);},0)/n):null;
      var uAc=ac.length>0?new Date(ac[0].created_at):null;
      var uEj=n>0?new Date(Math.max.apply(null,ej.map(function(e){return new Date(e.created_at);}))):null;
      var nivMax=ej.some(function(e){return e.nivel==='avanzado';})?'⭐⭐⭐':ej.some(function(e){return e.nivel==='medio';})?'⭐⭐':n>0?'⭐':'—';
      var mc=med===null?'#9ca3af':med>=70?'var(--green)':med>=50?'var(--amber)':'var(--red)';
      var av=p.avatar_url?'<img src="'+p.avatar_url+'" style="width:32px;height:32px;border-radius:50%;object-fit:cover">':'<div style="width:32px;height:32px;border-radius:50%;background:#1a2744;color:#c9a84c;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700">'+(p.nombre||'?')[0].toUpperCase()+'</div>';
      var grupoCell='<td style="text-align:center"><div id="grp-sel-'+p.id+'"></div></td>'; html+='<tr style="cursor:pointer" onclick="verDetalleAlumno(\''+p.id+'\')"><td style="padding:10px 14px"><div style="display:flex;align-items:center;gap:10px">'+av+'<div><div style="font-size:13px;font-weight:600">'+p.nombre+'</div><div style="font-size:11px;color:#9ca3af">'+p.email+'</div></div></div></td>'+grupoCell+'<td style="text-align:center;font-weight:700;color:#1a2744">'+n+'</td><td style="text-align:center"><span style="font-weight:700;color:'+mc+'">'+(med!==null?med+'%':'—')+'</span></td><td style="text-align:center;font-size:12px">'+nivMax+'</td><td style="text-align:center;font-size:12px;color:#9ca3af">'+(uAc?fmtF(uAc):'Nunca')+'</td><td style="text-align:center;font-size:12px;color:#9ca3af">'+(uEj?fmtF(uEj):'—')+'</td><td><button class="btn-sm" onclick="event.stopPropagation();verDetalleAlumno(\''+p.id+'\')" style="font-size:11px">Ver →</button></td></tr>';
    });
    html+='</tbody></table></div></div></div>';
    grid.innerHTML=html;
    setTimeout(function(){
      (perfs||[]).forEach(function(p){
        var c=document.getElementById('grp-sel-'+p.id);
        if(c && window.crearSelectorGrupo) c.appendChild(crearSelectorGrupo(p.id,p.grupo||''));
      });
    },50);
  }catch(err){grid.innerHTML='<p style="color:red;padding:1rem">Error: '+err.message+'</p>';}
}

function mkSC(ico,val,lbl,tipo){
  var c=tipo==='pos'?'var(--green)':tipo==='neg'?'var(--red)':'#1a2744';
  return '<div class="card" style="padding:1rem;text-align:center"><div style="font-size:1.8rem;margin-bottom:4px">'+ico+'</div><div style="font-size:1.6rem;font-weight:700;color:'+c+'">'+val+'</div><div style="font-size:11px;color:#9ca3af;margin-top:2px">'+lbl+'</div></div>';
}

function fmtF(d){
  var diff=new Date()-d,mins=Math.floor(diff/60000),h=Math.floor(diff/3600000),days=Math.floor(diff/86400000);
  if(mins<60)return 'Hace '+mins+'min';
  if(h<24)return 'Hace '+h+'h';
  if(days===1)return 'Ayer';
  if(days<7)return 'Hace '+days+'d';
  return d.toLocaleDateString('es-ES',{day:'2-digit',month:'2-digit',year:'2-digit'});
}

async function verDetalleAlumno(aid){
  var grid=document.getElementById('alumnos-grid');
  if(!grid)return;
  grid.style.cssText='';
  grid.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:200px;color:#9ca3af;gap:10px"><div style="width:20px;height:20px;border:2px solid #ccc;border-top-color:#1a2744;border-radius:50%;animation:spin .7s linear infinite"></div>Cargando…</div>';

  var [{data:p},{data:ej},{data:ac},{data:sims},{data:entregas}]=await Promise.all([
    supa.from('perfiles').select('*').eq('id',aid).single(),
    supa.from('ejercicios_realizados').select('*').eq('alumno_id',aid).eq('completado',true).order('created_at',{ascending:false}),
    supa.from('accesos').select('*').eq('usuario_id',aid).order('created_at',{ascending:false}).limit(20),
    supa.from('simuladores').select('*'),
    supa.from('entregas').select('*, actividades(titulo,nivel,peso_calculo,peso_interpretacion,peso_teoria,simuladores(nombre))').eq('alumno_id',aid).order('entregada_at',{ascending:false}),
  ]);

  var sm={};(sims||[]).forEach(function(s){sm[s.id]=s;});
  var n=(ej||[]).length;
  var med=n>0?Math.round((ej||[]).reduce(function(s,e){return s+(e.puntuacion||0);},0)/n):null;
  var mc=med===null?'#9ca3af':med>=70?'var(--green)':med>=50?'var(--amber)':'var(--red)';
  var av=p&&p.avatar_url?'<img src="'+p.avatar_url+'" style="width:48px;height:48px;border-radius:50%;object-fit:cover;flex-shrink:0">'
    :'<div style="width:48px;height:48px;border-radius:50%;background:#1a2744;color:#c9a84c;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;flex-shrink:0">'+((p&&p.nombre)||'?')[0].toUpperCase()+'</div>';

  var html='<button class="btn-sm" onclick="renderAlumnos()" style="margin-bottom:1rem">← Volver</button>';

  // Cabecera
  html+='<div class="card" style="margin-bottom:1rem"><div class="card-body" style="padding:1rem">'+
    '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px">'+
      av+
      '<div><div style="font-weight:700;color:#1a2744;font-size:15px">'+(p?p.nombre:'')+'</div>'+
      '<div style="font-size:12px;color:#9ca3af">'+(p?p.email:'')+'</div></div>'+
    '</div>'+
    '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center">'+
      '<div style="background:#f9f8f5;padding:10px;border-radius:8px"><div style="font-size:1.4rem;font-weight:700;color:'+mc+'">'+(med!==null?med+'%':'—')+'</div><div style="font-size:11px;color:#9ca3af">Media</div></div>'+
      '<div style="background:#f9f8f5;padding:10px;border-radius:8px"><div style="font-size:1.4rem;font-weight:700;color:#1a2744">'+n+'</div><div style="font-size:11px;color:#9ca3af">Ejercicios</div></div>'+
      '<div style="background:#f9f8f5;padding:10px;border-radius:8px"><div style="font-size:1.4rem;font-weight:700;color:#1a2744">'+(ac?ac.length:0)+'</div><div style="font-size:11px;color:#9ca3af">Accesos</div></div>'+
      '<div style="background:#f9f8f5;padding:10px;border-radius:8px"><div style="font-size:1.4rem;font-weight:700;color:#1a2744">'+(entregas?entregas.length:0)+'</div><div style="font-size:11px;color:#9ca3af">Entregas</div></div>'+
    '</div>'+
  '</div></div>';

  // Actividades evaluables
  html+='<div class="card" style="margin-bottom:1rem"><div class="card-header"><div class="card-title">📝 Actividades evaluables</div></div>'+
    '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:13px">'+
    '<thead><tr style="background:#f9f8f5;border-bottom:2px solid #e2ddd4">'+
    '<th style="padding:10px 12px;text-align:left;font-weight:700;color:#1a2744">Actividad</th>'+
    '<th style="padding:10px 8px;text-align:left;font-weight:700;color:#1a2744">Simulador</th>'+
    '<th style="padding:10px 8px;text-align:center;font-weight:700;color:#1a2744">Niv.</th>'+
    '<th style="padding:10px 8px;text-align:center;font-weight:700;color:#1a2744">Auto.</th>'+
    '<th style="padding:10px 8px;text-align:center;font-weight:700;color:#1a2744">Nota</th>'+
    '<th style="padding:10px 8px;font-weight:700;color:#1a2744">Comentario</th>'+
    '<th style="padding:10px 8px;text-align:center;font-weight:700;color:#1a2744"></th>'+
    '</tr></thead><tbody>';

  if(!entregas||!entregas.length){
    html+='<tr><td colspan="7" style="padding:1.5rem;text-align:center;color:#9ca3af">Sin entregas.</td></tr>';
  } else {
    entregas.forEach(function(ent){
      var act=ent.actividades||{};var sim=act.simuladores||{};
      var pAuto=ent.puntuacion_automatica;var pDoc=ent.puntuacion_docente;
      var autoCol=pAuto===null?'#9ca3af':pAuto>=70?'#16a34a':pAuto>=50?'#d97706':'#dc2626';
      var nivelLabel={basico:'⭐',medio:'⭐⭐',avanzado:'⭐⭐⭐'}[act.nivel]||'—';
      var entregada=ent.entregada_at?new Date(ent.entregada_at).toLocaleDateString('es-ES',{day:'2-digit',month:'2-digit',year:'2-digit'}):'—';
      html+='<tr style="border-bottom:1px solid #f2f0eb">'+
        '<td style="padding:8px 12px;font-weight:600">'+(act.titulo||'—')+'<br><span style="font-weight:400;font-size:11px;color:#9ca3af">'+entregada+'</span></td>'+
        '<td style="padding:8px;font-size:12px;color:#9ca3af">'+(sim.nombre||'—')+'</td>'+
        '<td style="padding:8px;text-align:center">'+nivelLabel+'</td>'+
        '<td style="padding:8px;text-align:center;font-weight:700;color:'+autoCol+'">'+(pAuto!==null?pAuto+'%':'—')+'</td>'+
        '<td style="padding:8px;text-align:center"><input type="number" min="0" max="10" step="0.1" placeholder="—" value="'+(pDoc!==null?pDoc:'')+'" id="nota-'+ent.id+'" style="width:55px;text-align:center;padding:3px;border:1px solid #d1ccc6;border-radius:6px;font-size:12px"></td>'+
        '<td style="padding:8px"><input type="text" placeholder="Comentario..." value="'+(ent.comentario_docente||'')+'" id="com-'+ent.id+'" style="width:100%;min-width:120px;padding:3px 6px;border:1px solid #d1ccc6;border-radius:6px;font-size:12px"></td>'+
        '<td style="padding:8px;text-align:center;white-space:nowrap">'+
          '<button class="btn-sm btn-navy" data-id="'+ent.id+'" onclick="guardarNota(this.dataset.id)" style="font-size:11px;display:block;width:100%;margin-bottom:3px">💾</button>'+
          '<button class="btn-sm" data-id="'+ent.id+'" onclick="verDetalleEntrega(this.dataset.id)" style="font-size:11px;display:block;width:100%">📄</button>'+
        '</td>'+
      '</tr>';
    });
  }
  html+='</tbody></table></div></div>';

  // ── Ejercicios por simulador ──────────────────────────
  var porSim={};(ej||[]).forEach(function(e){if(!porSim[e.simulador_id])porSim[e.simulador_id]=[];porSim[e.simulador_id].push(e);});

  var NIV_COL={basico:'#6366f1',medio:'#f59e0b',avanzado:'#16a34a'};
  var NIV_LBL={basico:'Básico',medio:'Medio',avanzado:'Avanzado'};
  var NIV_STEP={basico:1,medio:2,avanzado:3};

  function nivelBadge(niv){
    var col=NIV_COL[niv]||'#9ca3af';
    var lbl=NIV_LBL[niv]||niv;
    var paso=NIV_STEP[niv]||0;
    var dots=[1,2,3].map(function(i){
      return '<span style="width:8px;height:8px;border-radius:50%;background:'+(i<=paso?col:'rgba(0,0,0,.12)')+';display:inline-block"></span>';
    }).join('');
    return '<div style="display:inline-flex;align-items:center;gap:6px">'
      +'<div style="display:flex;gap:3px">'+dots+'</div>'
      +'<span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:99px;background:'+col+'1a;color:'+col+'">'+lbl+'</span>'
      +'</div>';
  }

  // Tarjetas de nivel adaptativo por simulador
  if(Object.keys(porSim).length){
    html+='<div class="card" style="margin-bottom:1rem">'
      +'<div class="card-header"><div class="card-title">🎯 Nivel adaptativo por simulador</div>'
      +'<div style="font-size:12px;color:#9ca3af">Nivel actual según los últimos ejercicios completados</div></div>'
      +'<div class="card-body">'
      +'<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:12px">';

    Object.keys(porSim).forEach(function(sid){
      var lista=porSim[sid];
      var s=sm[sid]||{nombre:'—'};
      var nivelActual=lista[0].nivel; // más reciente (desc)
      var col=NIV_COL[nivelActual]||'#9ca3af';
      var paso=NIV_STEP[nivelActual]||0;

      // Distribución por nivel
      var dist={basico:0,medio:0,avanzado:0};
      lista.forEach(function(e){ if(dist[e.nivel]!==undefined) dist[e.nivel]++; });
      var total=lista.length;

      // Últimos 3 ejercicios para tendencia
      var ult3=lista.slice(0,3);
      var mediaUlt3=ult3.length?Math.round(ult3.reduce(function(s,e){return s+(e.puntuacion||0);},0)/ult3.length):null;
      var tendencia='';
      if(mediaUlt3!==null){
        if(mediaUlt3>=80&&paso<3) tendencia='<span style="font-size:11px;color:#16a34a">↑ Subiendo</span>';
        else if(mediaUlt3<50&&paso>1) tendencia='<span style="font-size:11px;color:#dc2626">↓ Bajando</span>';
        else tendencia='<span style="font-size:11px;color:#9ca3af">→ Estable</span>';
      }

      html+='<div style="border:1.5px solid '+col+'33;border-radius:12px;padding:14px;background:'+col+'08">'
        +'<div style="font-size:12px;font-weight:700;color:#1a2744;margin-bottom:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="'+s.nombre+'">'+s.nombre+'</div>'
        +'<div style="display:flex;gap:4px;margin-bottom:8px">'
        +[1,2,3].map(function(i){
          return '<div style="flex:1;height:6px;border-radius:3px;background:'+(i<=paso?col:'rgba(0,0,0,.1)')+'"></div>';
        }).join('')
        +'</div>'
        +'<div style="font-size:13px;font-weight:700;color:'+col+';margin-bottom:6px">'+NIV_LBL[nivelActual]+'</div>'
        +'<div style="font-size:11px;color:#9ca3af;margin-bottom:6px">'+total+' ejercicio'+(total!==1?'s':'')+' · med. '+(lista.length?Math.round(lista.reduce(function(s,e){return s+(e.puntuacion||0);},0)/lista.length)+'%':'—')+'</div>'
        +'<div style="display:flex;gap:4px;flex-wrap:wrap">'
        +['basico','medio','avanzado'].filter(function(n){return dist[n]>0;}).map(function(n){
          return '<span style="font-size:10px;padding:1px 6px;border-radius:99px;background:'+NIV_COL[n]+'18;color:'+NIV_COL[n]+';font-weight:600">'+NIV_LBL[n]+' ×'+dist[n]+'</span>';
        }).join('')
        +'</div>'
        +(tendencia?'<div style="margin-top:8px;font-size:11px">'+tendencia+'</div>':'')
        +'</div>';
    });

    html+='</div></div></div>';
  }

  // Tabla detallada de ejercicios por simulador
  html+='<div class="card" style="margin-bottom:1rem"><div class="card-header"><div class="card-title">📊 Ejercicios por simulador</div></div>'+
    '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:13px">'+
    '<thead><tr style="background:#f9f8f5;border-bottom:2px solid #e2ddd4">'+
    '<th style="padding:10px 12px;text-align:left;font-weight:700;color:#1a2744">Simulador</th>'+
    '<th style="padding:10px 8px;text-align:center;font-weight:700;color:#1a2744">Ejers.</th>'+
    '<th style="padding:10px 8px;text-align:center;font-weight:700;color:#1a2744">Media</th>'+
    '<th style="padding:10px 8px;text-align:center;font-weight:700;color:#1a2744">Nivel actual</th>'+
    '<th style="padding:10px 8px;text-align:center;font-weight:700;color:#1a2744">Distribución</th>'+
    '<th style="padding:10px 8px;text-align:center;font-weight:700;color:#1a2744">Último</th>'+
    '</tr></thead><tbody>';

  if(!Object.keys(porSim).length){
    html+='<tr><td colspan="6" style="padding:1.5rem;text-align:center;color:#9ca3af">Sin ejercicios.</td></tr>';
  } else {
    Object.keys(porSim).forEach(function(sid){
      var lista=porSim[sid];var s=sm[sid]||{nombre:'—'};
      var med2=Math.round(lista.reduce(function(a,e){return a+(e.puntuacion||0);},0)/lista.length);
      var mc2=med2>=70?'#16a34a':med2>=50?'#d97706':'#dc2626';
      var dist2={basico:0,medio:0,avanzado:0};
      lista.forEach(function(e){ if(dist2[e.nivel]!==undefined) dist2[e.nivel]++; });
      var distHtml=['basico','medio','avanzado'].map(function(n){
        if(!dist2[n]) return '';
        return '<span style="font-size:10px;padding:1px 5px;border-radius:99px;background:'+NIV_COL[n]+'18;color:'+NIV_COL[n]+';font-weight:600;white-space:nowrap">'+NIV_LBL[n]+' ×'+dist2[n]+'</span>';
      }).filter(Boolean).join(' ');
      html+='<tr style="border-bottom:1px solid #f2f0eb">'+
        '<td style="padding:8px 12px;font-weight:600">'+s.nombre+'</td>'+
        '<td style="padding:8px;text-align:center">'+lista.length+'</td>'+
        '<td style="padding:8px;text-align:center;font-weight:700;color:'+mc2+'">'+med2+'%</td>'+
        '<td style="padding:8px;text-align:center">'+nivelBadge(lista[0].nivel)+'</td>'+
        '<td style="padding:8px;text-align:center"><div style="display:flex;gap:3px;justify-content:center;flex-wrap:wrap">'+distHtml+'</div></td>'+
        '<td style="padding:8px;text-align:center;font-size:12px;color:#9ca3af">'+fmtF(new Date(lista[0].created_at))+'</td>'+
      '</tr>';
    });
  }
  html+='</tbody></table></div></div>';

  // Accesos
  html+='<div class="card"><div class="card-header"><div class="card-title">🔑 Accesos recientes</div></div>'+
    '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:13px">'+
    '<thead><tr style="background:#f9f8f5;border-bottom:2px solid #e2ddd4">'+
    '<th style="padding:10px 12px;text-align:left;font-weight:700;color:#1a2744">Fecha y hora</th>'+
    '<th style="padding:10px 8px;text-align:center;font-weight:700;color:#1a2744">Hace</th>'+
    '</tr></thead><tbody>';

  if(!ac||!ac.length){
    html+='<tr><td colspan="2" style="padding:1.5rem;text-align:center;color:#9ca3af">Sin accesos.</td></tr>';
  } else {
    ac.forEach(function(a){
      var d=new Date(a.created_at);
      html+='<tr style="border-bottom:1px solid #f2f0eb">'+
        '<td style="padding:8px 12px">'+d.toLocaleDateString('es-ES',{weekday:'short',day:'2-digit',month:'2-digit',year:'2-digit'})+' '+d.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'})+'</td>'+
        '<td style="padding:8px;text-align:center;color:#9ca3af">'+fmtF(d)+'</td>'+
      '</tr>';
    });
  }
  html+='</tbody></table></div></div>';

  grid.innerHTML=html;
}

// ── Actividades evaluables ────────────────────────────
async function renderActividades(){
  var cont=document.getElementById('actividades-cont');
  if(!cont)return;
  if(!USUARIO_ACTUAL||USUARIO_ACTUAL.rol!=='docente'){
    cont.innerHTML='<div class="card"><div class="card-body" style="text-align:center;color:#9ca3af;padding:2rem">Solo el docente puede gestionar actividades.</div></div>';
    return;
  }
  cont.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:200px;color:#9ca3af;gap:10px"><div style="width:20px;height:20px;border:2px solid #ccc;border-top-color:#1a2744;border-radius:50%;animation:spin .7s linear infinite"></div>Cargando…</div>';
  var [{data:acts},{data:sims},{data:entregas}]=await Promise.all([
    supa.from('actividades').select('*').eq('docente_id',USUARIO_ACTUAL.id).order('created_at',{ascending:false}),
    supa.from('simuladores').select('*'),
    supa.from('entregas').select('actividad_id,alumno_id,puntuacion_automatica,puntuacion_docente'),
  ]);
  var sm={};(sims||[]).forEach(function(s){sm[s.id]=s;});
  // ── Helper: genera HTML del selector RA/CE ──────────
  var html='<div class="card" style="margin-bottom:1.25rem"><div class="card-header"><div class="card-title">➕ Nueva actividad</div></div><div class="card-body">';
  html+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">';
  html+='<div><div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#9ca3af;margin-bottom:4px">Simulador</div><select id="act-sim" style="width:100%;padding:7px 10px;border:1.5px solid #d1ccc6;border-radius:6px;font-size:13px">';
  Object.keys(SIMS_INFO).forEach(function(k){html+='<option value="'+k+'">'+SIMS_INFO[k].nombre+'</option>';});
  html+='</select></div>';
  html+='<div><div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#9ca3af;margin-bottom:4px">Nivel</div><select id="act-nivel" style="width:100%;padding:7px 10px;border:1.5px solid #d1ccc6;border-radius:6px;font-size:13px"><option value="basico">⭐ Básico</option><option value="medio" selected>⭐⭐ Medio</option><option value="avanzado">⭐⭐⭐ Avanzado</option></select></div>';
  html+='</div><div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;margin-bottom:12px">';
  html+='<div><div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#9ca3af;margin-bottom:4px">Título</div><input id="act-titulo" style="width:100%;padding:7px 10px;border:1.5px solid #d1ccc6;border-radius:6px;font-size:13px" type="text" placeholder="Ej: AE1 — Préstamos"></div>';
  html+='<div><div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#9ca3af;margin-bottom:4px">Fecha límite</div><input id="act-fecha" style="width:100%;padding:7px 10px;border:1.5px solid #d1ccc6;border-radius:6px;font-size:13px" type="datetime-local"></div>';
  html+='<div><div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#9ca3af;margin-bottom:4px">⏱ Tiempo (min)</div><input id="act-tiempo" style="width:100%;padding:7px 10px;border:1.5px solid #d1ccc6;border-radius:6px;font-size:13px;text-align:center" type="number" min="1" max="300" placeholder="Sin límite"></div>';
  html+='<div><div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#9ca3af;margin-bottom:4px">Pesos Cálc/Int/Teo</div><div style="display:flex;gap:6px"><input id="act-p-calc" style="width:55px;padding:7px 8px;border:1.5px solid #d1ccc6;border-radius:6px;font-size:13px;text-align:center" type="number" value="60"><input id="act-p-int" style="width:55px;padding:7px 8px;border:1.5px solid #d1ccc6;border-radius:6px;font-size:13px;text-align:center" type="number" value="30"><input id="act-p-teo" style="width:55px;padding:7px 8px;border:1.5px solid #d1ccc6;border-radius:6px;font-size:13px;text-align:center" type="number" value="10"></div></div>';
  html+='</div>';
  html+=buildSelectorRACE('act-race', []);
  html+='<button class="btn-calc" onclick="crearActividad()" style="padding:10px 28px;font-size:14px;margin-top:4px">Crear actividad</button></div></div>';

  if(!acts||!acts.length){
    html+='<div class="card"><div class="card-body" style="text-align:center;color:#9ca3af;padding:2rem"><div style="font-size:2rem;margin-bottom:8px">📝</div>No hay actividades creadas.</div></div>';
  } else {
    html+='<div class="card"><div class="card-header"><div class="card-title">📋 Actividades creadas</div></div><div class="card-body" style="padding:0"><div style="overflow-x:auto"><table class="dt" style="width:100%"><thead><tr><th style="text-align:left;padding:10px 14px">Actividad</th><th>Simulador</th><th>Nivel</th><th style="min-width:160px">RA / CE vinculados</th><th>Fecha límite</th><th>Entregas</th><th>Estado</th><th></th></tr></thead><tbody>';
    acts.forEach(function(act){
      var s=sm[act.simulador_id]||{};
      var ea=(entregas||[]).filter(function(e){return e.actividad_id===act.id;});
      var ahora=new Date();var lim=act.fecha_limite?new Date(act.fecha_limite):null;
      var activa=act.activa&&(!lim||lim>ahora);
      var slbl=!act.activa?'⏸ Pausada':(!lim||lim>ahora)?'✅ Activa':'🔒 Cerrada';
      var sc=!act.activa?'#9ca3af':(!lim||lim>ahora)?'var(--green)':'var(--red)';
      var nlbl={basico:'⭐ Básico',medio:'⭐⭐ Medio',avanzado:'⭐⭐⭐ Avanzado'}[act.nivel]||act.nivel;
      var actId=act.id;
      // Chips RA/CE
      var ceVinc=act.ce_vinculados||[];
      var chipsHtml='';
      if(ceVinc.length){
        var byRA={};
        ceVinc.forEach(function(cv){ if(!byRA[cv.raId])byRA[cv.raId]=[]; byRA[cv.raId].push(cv.ceId); });
        Object.keys(byRA).forEach(function(raId){
          chipsHtml+='<div style="margin-bottom:2px"><span style="font-size:10px;font-weight:700;color:#1a2744;font-family:\'IBM Plex Mono\',monospace">'+raId+':</span> ';
          chipsHtml+=byRA[raId].map(function(ceId){ return '<span style="display:inline-block;background:#dbeafe;color:#1e40af;border-radius:4px;padding:1px 5px;font-size:10px;font-family:\'IBM Plex Mono\',monospace;margin:1px">'+ceId+'</span>'; }).join('');
          chipsHtml+='</div>';
        });
      } else { chipsHtml='<span style="font-size:11px;color:#d1ccc6">—</span>'; }
      html+='<tr><td style="padding:10px 14px"><div style="font-weight:600;font-size:13px">'+act.titulo+'</div><div style="font-size:11px;color:#9ca3af">'+act.peso_calculo+'% calc · '+act.peso_interpretacion+'% int · '+act.peso_teoria+'% teo</div></td><td style="text-align:center;font-size:12px">'+(s.nombre||'—')+'</td><td style="text-align:center;font-size:12px">'+nlbl+'</td><td style="padding:8px 12px">'+chipsHtml+'</td><td style="text-align:center;font-size:12px;color:#9ca3af">'+(lim?lim.toLocaleDateString('es-ES',{day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'}):'Sin límite')+(act.tiempo_limite_minutos?' · ⏱'+act.tiempo_limite_minutos+'min':'')+'</td><td style="text-align:center;font-weight:700;color:#1a2744">'+ea.length+'</td><td style="text-align:center"><span style="font-size:12px;font-weight:700;color:'+sc+'">'+slbl+'</span></td>';
      html+='<td style="text-align:center;white-space:nowrap"><button class="btn-sm" data-id="'+actId+'" onclick="verEntregas(this.getAttribute(\'data-id\'))" style="font-size:11px;margin-right:2px">Ver</button><button class="btn-sm" data-id="'+actId+'" data-activa="'+act.activa+'" onclick="toggleActividad(this.getAttribute(\'data-id\'),this.getAttribute(\'data-activa\')===\'true\')" style="font-size:11px;color:'+(act.activa?'var(--red)':'var(--green)')+';margin-right:2px">'+(act.activa?'⏸':'▶')+'</button><button class="btn-sm" data-id="'+actId+'" onclick="editarActividad(this.getAttribute(\'data-id\'))" style="font-size:11px;margin-right:2px">✏️</button><button class="btn-sm" data-id="'+actId+'" onclick="eliminarActividad(this.getAttribute(\'data-id\'))" style="font-size:11px;color:var(--red)">🗑</button></td></tr>';
    });
    html+='</tbody></table></div></div></div>';
  }
  cont.innerHTML=html;
}

// ── Construye el panel de checkboxes RA/CE ─────────────────────────────
function buildSelectorRACE(prefixId, selectedCE) {
  var allRA = getAllRA();
  if(!allRA||!allRA.length) return '';
  var html='<div style="margin-bottom:12px">';
  html+='<div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#9ca3af;margin-bottom:6px">📐 RA y CE vinculados <span style="font-weight:400;color:#d1ccc6">(instrumentos de evaluación)</span></div>';
  html+='<div style="border:1.5px solid #d1ccc6;border-radius:8px;padding:10px;background:#faf8f4;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:8px">';
  allRA.forEach(function(item){
    var ra=item.ra;
    var ceList=ra.ce||[];
    html+='<div style="background:#fff;border:1px solid #e8e4dc;border-radius:7px;padding:8px 10px">';
    html+='<div style="font-size:11px;font-weight:700;color:#1a2744;margin-bottom:4px;font-family:\'IBM Plex Mono\',monospace">'+ra.id+'</div>';
    html+='<div style="font-size:10px;color:#9ca3af;margin-bottom:6px;line-height:1.4">'+ra.nombre.replace(/^RA\d+\s*[—\-]\s*/,'').substring(0,80)+'…</div>';
    ceList.forEach(function(ce){
      var isChecked=(selectedCE||[]).some(function(s){return s.raId===ra.id&&s.ceId===ce.id;});
      html+='<label style="display:flex;align-items:flex-start;gap:6px;margin-bottom:4px;cursor:pointer;font-size:11px;color:#374151;line-height:1.4">';
      html+='<input type="checkbox" class="race-ce-chk" data-prefix="'+prefixId+'" data-raid="'+ra.id+'" data-ceid="'+ce.id+'" '+(isChecked?'checked':'')+' style="margin-top:2px;flex-shrink:0;accent-color:#1a2744">';
      html+='<span><span style="font-family:\'IBM Plex Mono\',monospace;font-weight:600;color:#1e40af;font-size:10px">'+ce.id+'</span> '+(ce.desc||ce.descripcion||'')+'</span>';
      html+='</label>';
    });
    html+='</div>';
  });
  html+='</div></div>';
  return html;
}

// ── Recoge los checkboxes marcados del selector ────────────────────────
function recogerCEVinculados(prefixId){
  var checks=document.querySelectorAll('.race-ce-chk[data-prefix="'+prefixId+'"]');
  var result=[];
  checks.forEach(function(ch){ if(ch.checked) result.push({raId:ch.dataset.raid, ceId:ch.dataset.ceid}); });
  return result;
}

async function crearActividad(){
  var simCod=document.getElementById('act-sim').value;
  var nivel=document.getElementById('act-nivel').value;
  var titulo=document.getElementById('act-titulo').value.trim();
  var fecha=document.getElementById('act-fecha').value;
  var pC=parseInt(document.getElementById('act-p-calc').value)||60;
  var pI=parseInt(document.getElementById('act-p-int').value)||30;
  var pT=parseInt(document.getElementById('act-p-teo').value)||10;
  var tLim=parseInt(document.getElementById('act-tiempo').value)||null;
  if(!titulo){flash('Introduce un título','#dc2626');return;}
  if(pC+pI+pT!==100){flash('Los pesos deben sumar 100%','#dc2626');return;}
  var ceVinc=recogerCEVinculados('act-race');
  var {data:sim}=await supa.from('simuladores').select('id').eq('codigo',simCod).single();
  if(!sim){flash('Simulador no encontrado','#dc2626');return;}
  var {error}=await supa.from('actividades').insert({
    docente_id:USUARIO_ACTUAL.id,grupo_id:GRUPO_ID_ACTUAL,simulador_id:sim.id,
    titulo,nivel,fecha_limite:fecha||null,tiempo_limite_minutos:tLim,peso_calculo:pC,peso_interpretacion:pI,peso_teoria:pT,
    activa:true,ce_vinculados:ceVinc,
    ra:'',ce:'',descripcion:'',modo_examen:false
  });
  if(error){flash('Error: '+error.message,'#dc2626');return;}
  flash('✅ Actividad creada'+(ceVinc.length?' con '+ceVinc.length+' CE vinculados':''),'#16a34a');
  renderActividades();
}

async function toggleActividad(actId,estaActiva){
  await supa.from('actividades').update({activa:!estaActiva}).eq('id',actId);
  renderActividades();
}

async function eliminarActividad(actId){
  if(!confirm('¿Eliminar esta actividad? Se eliminarán también todas las entregas.'))return;
  await supa.from('actividades').delete().eq('id',actId);
  flash('✅ Actividad eliminada','#16a34a');
  renderActividades();
}

async function editarActividad(actId){
  var {data:act}=await supa.from('actividades').select('*').eq('id',actId).single();
  if(!act)return;
  var m=document.createElement('div');
  m.id='edit-modal';
  m.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem';
  var fv=act.fecha_limite?new Date(act.fecha_limite).toISOString().slice(0,16):'';
  var ceActuales=act.ce_vinculados||[];
  m.innerHTML='<div style="background:#fff;border-radius:12px;padding:1.5rem;max-width:680px;width:100%;max-height:88vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.3)">'+
    '<div style="font-size:1.1rem;font-weight:700;color:#1a2744;margin-bottom:1rem">✏️ Editar actividad</div>'+
    '<div style="margin-bottom:10px"><div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#9ca3af;margin-bottom:4px">Título</div><input id="edit-titulo" style="width:100%;padding:7px 10px;border:1.5px solid #d1ccc6;border-radius:6px;font-size:13px" value="'+act.titulo+'"></div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:10px">'+
    '<div><div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#9ca3af;margin-bottom:4px">Nivel</div><select id="edit-nivel" style="width:100%;padding:7px 10px;border:1.5px solid #d1ccc6;border-radius:6px;font-size:13px"><option value="basico"'+(act.nivel==='basico'?' selected':'')+'>⭐ Básico</option><option value="medio"'+(act.nivel==='medio'?' selected':'')+'>⭐⭐ Medio</option><option value="avanzado"'+(act.nivel==='avanzado'?' selected':'')+'>⭐⭐⭐ Avanzado</option></select></div>'+
    '<div><div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#9ca3af;margin-bottom:4px">Fecha límite</div><input id="edit-fecha" type="datetime-local" style="width:100%;padding:7px 10px;border:1.5px solid #d1ccc6;border-radius:6px;font-size:13px" value="'+fv+'"></div>'+
    '<div><div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#9ca3af;margin-bottom:4px">⏱ Tiempo (min)</div><input id="edit-tiempo" type="number" min="1" max="300" placeholder="Sin límite" style="width:100%;padding:7px 10px;border:1.5px solid #d1ccc6;border-radius:6px;font-size:13px;text-align:center" value="'+(act.tiempo_limite_minutos||'')+'"></div></div>'+
    '<div style="margin-bottom:10px"><div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#9ca3af;margin-bottom:4px">Pesos Cálculo/Interpretación/Teoría</div><div style="display:flex;gap:8px"><input id="edit-pc" type="number" value="'+act.peso_calculo+'" style="width:70px;padding:7px 8px;border:1.5px solid #d1ccc6;border-radius:6px;font-size:13px;text-align:center"><input id="edit-pi" type="number" value="'+act.peso_interpretacion+'" style="width:70px;padding:7px 8px;border:1.5px solid #d1ccc6;border-radius:6px;font-size:13px;text-align:center"><input id="edit-pt" type="number" value="'+act.peso_teoria+'" style="width:70px;padding:7px 8px;border:1.5px solid #d1ccc6;border-radius:6px;font-size:13px;text-align:center"></div></div>'+
    buildSelectorRACE('edit-race', ceActuales)+
    '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px">'+
    '<button class="btn-sm" onclick="document.getElementById(\'edit-modal\').remove()">Cancelar</button>'+
    '<button class="btn-calc" data-id="'+actId+'" onclick="guardarEdicion(this.getAttribute(\'data-id\'))" style="padding:8px 20px">💾 Guardar</button>'+
    '</div></div>';
  document.body.appendChild(m);
}

async function guardarEdicion(actId){
  var titulo=document.getElementById('edit-titulo').value.trim();
  var nivel=document.getElementById('edit-nivel').value;
  var fecha=document.getElementById('edit-fecha').value;
  var pC=parseInt(document.getElementById('edit-pc').value)||60;
  var pI=parseInt(document.getElementById('edit-pi').value)||30;
  var pT=parseInt(document.getElementById('edit-pt').value)||10;
  var tLim=parseInt(document.getElementById('edit-tiempo').value)||null;
  if(!titulo){flash('El título no puede estar vacío','#dc2626');return;}
  if(pC+pI+pT!==100){flash('Los pesos deben sumar 100%','#dc2626');return;}
  var ceVinc=recogerCEVinculados('edit-race');
  var {error}=await supa.from('actividades').update({titulo,nivel,fecha_limite:fecha||null,tiempo_limite_minutos:tLim,peso_calculo:pC,peso_interpretacion:pI,peso_teoria:pT,ce_vinculados:ceVinc}).eq('id',actId);
  if(error){flash('Error: '+error.message,'#dc2626');return;}
  document.getElementById('edit-modal').remove();
  flash('✅ Actividad actualizada'+(ceVinc.length?' · '+ceVinc.length+' CE vinculados':''),'#16a34a');
  renderActividades();
}

async function verEntregas(actId){
  var cont=document.getElementById('actividades-cont');
  if(!cont)return;
  cont.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:200px;color:#9ca3af;gap:10px"><div style="width:20px;height:20px;border:2px solid #ccc;border-top-color:#1a2744;border-radius:50%;animation:spin .7s linear infinite"></div>Cargando…</div>';
  var [{data:act},{data:ents},{data:perfs}]=await Promise.all([
    supa.from('actividades').select('*').eq('id',actId).single(),
    supa.from('entregas').select('*').eq('actividad_id',actId).order('entregada_at',{ascending:false}),
    supa.from('perfiles').select('id,nombre,email,avatar_url').eq('rol','alumno'),
  ]);
  var pm={};(perfs||[]).forEach(function(p){pm[p.id]=p;});
  var html='<button class="btn-sm" onclick="renderActividades()" style="margin-bottom:1rem">← Volver</button>';
  html+='<div class="card" style="margin-bottom:1rem"><div class="card-body"><div style="font-size:1rem;font-weight:700;color:#1a2744">'+act.titulo+'</div><div style="font-size:12px;color:#9ca3af">'+act.nivel+' · '+act.peso_calculo+'% cálculo / '+act.peso_interpretacion+'% interpretación / '+act.peso_teoria+'% teoría</div></div></div>';
  html+='<div class="card"><div class="card-header"><div class="card-title">📬 Entregas</div><div style="font-size:12px;color:#9ca3af">'+(ents?ents.length:0)+' entrega'+(ents&&ents.length!==1?'s':'')+'</div></div><div class="card-body" style="padding:0"><table class="dt" style="width:100%"><thead><tr><th style="text-align:left;padding:10px 14px">Alumno</th><th>Entregado</th><th>Puntuación auto.</th><th>Nota docente</th><th>Comentario</th><th></th></tr></thead><tbody>';
  if(!ents||!ents.length){html+='<tr><td colspan="6" style="text-align:center;padding:2rem;color:#9ca3af">Ningún alumno ha entregado todavía.</td></tr>';}
  else{ents.forEach(function(ent){
    var p=pm[ent.alumno_id]||{nombre:'Alumno',email:''};
    var av=p.avatar_url?'<img src="'+p.avatar_url+'" style="width:28px;height:28px;border-radius:50%;object-fit:cover">':'<div style="width:28px;height:28px;border-radius:50%;background:#1a2744;color:#c9a84c;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700">'+(p.nombre[0]||'?')+'</div>';
    var pa=ent.puntuacion_automatica;
    var mc2=pa===null?'#9ca3af':pa>=70?'var(--green)':pa>=50?'var(--amber)':'var(--red)';
    html+='<tr><td style="padding:10px 14px"><div style="display:flex;align-items:center;gap:8px">'+av+'<div><div style="font-size:13px;font-weight:600">'+p.nombre+'</div><div style="font-size:11px;color:#9ca3af">'+p.email+'</div></div></div></td><td style="text-align:center;font-size:12px;color:#9ca3af">'+(ent.entregada_at?new Date(ent.entregada_at).toLocaleDateString('es-ES',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}):'—')+'</td><td style="text-align:center;font-weight:700;color:'+mc2+'">'+(pa!==null?pa+'%':'—')+'</td>';
    html+='<td style="text-align:center"><input type="number" min="0" max="10" step="0.1" placeholder="—" value="'+(ent.puntuacion_docente||'')+'" id="nota-'+ent.id+'" style="width:60px;text-align:center;padding:4px;border:1px solid #d1ccc6;border-radius:6px;font-size:13px"></td>';
    html+='<td><input type="text" placeholder="Comentario..." value="'+(ent.comentario_docente||'')+'" id="com-'+ent.id+'" style="width:100%;padding:4px 8px;border:1px solid #d1ccc6;border-radius:6px;font-size:12px"></td>';
    html+='<td style="text-align:center"><button class="btn-sm btn-navy" data-id="'+ent.id+'" onclick="guardarNota(this.getAttribute(\'data-id\'))" style="font-size:11px">💾 Guardar</button>'+
        '<button class="btn-sm" data-id="'+ent.id+'" onclick="verDetalleEntrega(this.getAttribute(\'data-id\'))" style="font-size:11px;display:block;margin-top:2px">📄 Ver</button>'+
      '</td></tr>';
  });}
  html+='</tbody></table></div></div>';
  cont.innerHTML=html;
}

async function guardarNota(entId){
  var nota=parseFloat(document.getElementById('nota-'+entId).value);
  var com=document.getElementById('com-'+entId).value.trim();
  if(isNaN(nota)||nota<0||nota>10){flash('Nota entre 0 y 10','#dc2626');return;}
  var {error}=await supa.from('entregas').update({puntuacion_docente:nota,comentario_docente:com,calificada_at:new Date().toISOString()}).eq('id',entId);
  if(error){flash('Error: '+error.message,'#dc2626');return;}
  flash('✅ Nota guardada','#16a34a');
}

// ── Mis actividades (vista alumno) ───────────────────
async function renderMisActividades(){
  var cont = document.getElementById('mis-actividades-cont');
  if(!cont) return;
  if(!USUARIO_ACTUAL){
    cont.innerHTML = '<div class="card"><div class="card-body" style="text-align:center;color:#9ca3af;padding:2rem">Debes iniciar sesión.</div></div>';
    return;
  }
  cont.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:200px;color:#9ca3af;gap:10px"><div style="width:20px;height:20px;border:2px solid #ccc;border-top-color:#1a2744;border-radius:50%;animation:spin .7s linear infinite"></div>Cargando…</div>';

  try{
    // Load all active activities for the student's group
    var ahora = new Date().toISOString();
    var {data:acts} = await supa.from('actividades').select('*, simuladores(nombre,codigo)')
      .eq('activa', true);
    // Filter client-side to avoid Supabase OR query issues
    acts = (acts||[]).filter(function(a){
      if(!a.fecha_limite) return true;
      return new Date(a.fecha_limite) > new Date();
    });

    // Load student's entregas
    var {data:entregas} = await supa.from('entregas').select('*').eq('alumno_id', USUARIO_ACTUAL.id);
    var entregaMap = {};
    (entregas||[]).forEach(function(e){ entregaMap[e.actividad_id] = e; });

    var pendientes = (acts||[]).filter(function(a){ 
      var e = entregaMap[a.id];
      var isPending = !e || !e.entregada_at;
      return isPending;
    });
    var completadas = (entregas||[]).filter(function(e){ return e.entregada_at; });

    var grid2 = document.getElementById('alumnos-grid');
    if(grid2) grid2.style.cssText = '';
    var html = '';

    // ── Pendientes ────────────────────────────────────
    html += '<div class="card" style="margin-bottom:1.25rem"><div class="card-header">'+
      '<div class="card-title">📬 Actividades pendientes</div></div><div class="card-body">';

    if(!pendientes.length){
      html += '<div style="text-align:center;padding:1.5rem;color:#9ca3af;font-size:13px">'+
        '✅ No tienes actividades pendientes en este momento.</div>';
    } else {
      pendientes.forEach(function(act){
        var sim = act.simuladores || {};
        var lim = act.fecha_limite ? new Date(act.fecha_limite) : null;
        var nivelLabel = {basico:'⭐ Básico',medio:'⭐⭐ Medio',avanzado:'⭐⭐⭐ Avanzado'}[act.nivel]||act.nivel;
        var entrega = entregaMap[act.id];
        var iniciada = entrega && !entrega.entregada_at;

        html += '<div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:12px 0;border-bottom:1px solid #f2f0eb;flex-wrap:wrap">'+
          '<div>'+
            '<div style="font-weight:600;color:#1a2744;font-size:14px">'+act.titulo+'</div>'+
            '<div style="font-size:12px;color:#9ca3af;margin-top:2px">'+sim.nombre+' · '+nivelLabel+
              (lim?' · Límite: '+lim.toLocaleDateString('es-ES',{day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'}):'')+'</div>'+
            (iniciada?'<div style="font-size:11px;color:var(--amber);margin-top:4px">⚠️ Iniciada pero sin entregar</div>':'')+
          '</div>'+
          '<button class="btn-calc" data-actid="'+act.id+'" data-simcod="'+sim.codigo+'" data-nivel="'+act.nivel+'"'+
            ' onclick="iniciarDesdePanel(this)" style="padding:8px 20px;font-size:13px;white-space:nowrap">'+
            (iniciada?'▶ Continuar':'▶ Realizar actividad')+
          '</button>'+
        '</div>';
      });
    }
    html += '</div></div>';

    // ── Completadas ───────────────────────────────────
    if(completadas.length){
      var actIds = completadas.map(function(e){ return e.actividad_id; });
      var {data:actsComp} = await supa.from('actividades').select('*, simuladores(nombre,codigo)').in('id', actIds);
      var actMap = {};
      (actsComp||[]).forEach(function(a){ actMap[a.id] = a; });

      html += '<div><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:12px">&#x2705; Completadas ('+completadas.length+')</div>';
      completadas.sort(function(a,b){ return new Date(b.entregada_at)-new Date(a.entregada_at); }).forEach(function(ent){
        var act = actMap[ent.actividad_id] || {};
        var sim = act.simuladores || {};
        var entregada = new Date(ent.entregada_at);
        var pAuto = ent.puntuacion_automatica;
        var pDoc  = ent.puntuacion_docente;
        var autoC = pAuto===null?'gris':pAuto>=70?'verde':pAuto>=50?'amber':'rojo';
        var docC  = pDoc===null?'gris':pDoc>=7?'verde':pDoc>=5?'amber':'rojo';
        var nivelIco = {basico:'&#x2B50;',medio:'&#x2B50;&#x2B50;',avanzado:'&#x2B50;&#x2B50;&#x2B50;'}[act.nivel]||'';
        html += '<div class="res-card">'+
          '<div class="rc-head">'+
            '<div class="rc-ico" style="background:var(--surface2)">&#x1F3AF;</div>'+
            '<div class="rc-info">'+
              '<div class="rc-titulo">'+(act.titulo||'Actividad')+'</div>'+
              '<div class="rc-sim">'+(sim.nombre||'')+(nivelIco?' &middot; '+nivelIco:'')+'</div>'+
              '<div class="rc-fecha">Entregada '+entregada.toLocaleDateString('es-ES',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})+'</div>'+
            '</div>'+
          '</div>'+
          '<div class="rc-notas">'+
            '<div class="nota-chip '+autoC+'"><div class="nc-num">'+(pAuto!==null?pAuto+'%':'&#x2013;')+'</div><div class="nc-lbl">Puntuaci&#xF3;n auto</div></div>'+
            '<div class="nota-chip '+docC+'"><div class="nc-num">'+(pDoc!==null?pDoc+'/10':'&#x2013;')+'</div><div class="nc-lbl">Nota docente</div></div>'+
          '</div>'+
          (ent.comentario_docente?'<div class="rc-comentario">&#x1F4AC; <strong>Comentario del profesor:</strong> '+ent.comentario_docente+'</div>':'')+
        '</div>';
      });
      html += '</div>';
    }

    cont.innerHTML = html;
  }catch(err){
    cont.innerHTML = '<div class="card"><p style="color:red;padding:1rem">Error: '+err.message+'</p></div>';
  }
}

async function iniciarDesdePanel(btn){
  var actId  = btn.getAttribute('data-actid');
  var simCod = btn.getAttribute('data-simcod');
  var nivel  = btn.getAttribute('data-nivel');
  if(!actId || !simCod) return;

  btn.disabled = true;
  btn.textContent = 'Abriendo…';

  // Create or get entrega
  var entrega = await iniciarEntrega(actId, {});
  if(!entrega){
    btn.disabled = false;
    btn.textContent = '▶ Realizar actividad';
    flash('Error al iniciar la actividad','#dc2626');
    return;
  }

  // Store pending actividad info so loadSim can pick it up
  window._pendingActividad = {
    actId:     actId,
    simCod:    simCod,
    nivel:     nivel,
    entregaId: entrega.id
  };

  // Navigate to simulator — loadSim will detect _pendingActividad
  var navBtn = document.getElementById('ns-'+simCod);
  if(navBtn) navBtn.click();
}


// ── Ver detalle de entrega + PDF ──────────────────────
async function verDetalleEntrega(entregaId){
  console.log('verDetalleEntrega called with:', entregaId);
  try{
  var {data:ent, error:entErr} = await supa.from('entregas').select('*, actividades(titulo,nivel,peso_calculo,peso_interpretacion,peso_teoria,simuladores(nombre,codigo))').eq('id',entregaId).single();
  console.log('query done, ent:', ent ? 'OK id='+ent.id : 'NULL', 'err:', entErr);
  console.log('verDetalleEntrega query result:', ent ? 'OK' : 'NULL', entErr ? entErr.message : 'no error');
  console.log('step1: getting profile for', ent ? ent.alumno_id : 'null');
  // Get alumno profile separately
  var alumnoNome = '—'; var alumnoEmail = '';
  if(ent && ent.alumno_id){
    var {data:alumnoPerf} = await supa.from('perfiles').select('nombre,email').eq('id',ent.alumno_id).single();
    console.log('step2: profile=', alumnoPerf ? alumnoPerf.nombre : 'null');
    if(alumnoPerf){ alumnoNome=alumnoPerf.nombre; alumnoEmail=alumnoPerf.email; }
  }
  console.log('step3: building HTML');
  if(!ent){ flash('No se encontró la entrega: '+(entErr?entErr.message:'unknown'),'#dc2626'); return; }

  var act   = ent.actividades || {};
  var sim   = act.simuladores || {};
  var datos = ent.datos_caso || {};
  var resp  = ent.respuestas || {};
  var pAuto = ent.puntuacion_automatica;
  var pDoc  = ent.puntuacion_docente;
  var entregada = ent.entregada_at ? new Date(ent.entregada_at) : null;
  var nivelLabel = {basico:'Básico',medio:'Medio',avanzado:'Avanzado'}[act.nivel]||act.nivel||'—';

  // Build HTML for modal
  var html = '<div style="max-height:80vh;overflow-y:auto">';

  // Header
  html += '<div style="background:#1a2744;color:#fff;padding:1.25rem 1.5rem;border-radius:10px;margin-bottom:1rem">'+
    '<div style="font-size:1rem;font-weight:700;margin-bottom:4px">'+act.titulo+'</div>'+
    '<div style="font-size:12px;opacity:.7">'+alumnoNome+' · '+alumnoEmail+'</div>'+
    '<div style="font-size:12px;opacity:.7;margin-top:2px">'+sim.nombre+' · Nivel '+nivelLabel+
      (entregada?' · Entregado: '+entregada.toLocaleDateString('es-ES',{day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'}):'')+
    '</div>'+
  '</div>';

  // Datos del caso
  if(datos && datos.nombre){
    html += '<div style="background:#f9f8f5;border-radius:8px;padding:1rem;margin-bottom:1rem">'+
      '<div style="font-weight:700;color:#1a2744;margin-bottom:8px">📋 Empresa: '+datos.nombre+'</div>'+
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;font-size:12px">';
    var campos = {
      'Activo Total':'AT','Activo Corriente':'AC','Existencias':'exis',
      'Realizable':'real','Disponible':'disp','Activo No Corriente':'ANC',
      'Patrimonio Neto':'PN','Pasivo Total':'PT','Pasivo Corriente':'PC',
      'Pasivo No Corriente':'PNC','Proveedores':'proveed','INCN':'INCN',
      'Aprovisionamiento':'aprovision','BAIT':'bait','Resultado Neto':'rn'
    };
    Object.keys(campos).forEach(function(label){
      var key = campos[label];
      if(datos[key]!==undefined){
        html += '<div style="background:#fff;padding:6px 8px;border-radius:6px;border:1px solid #e2ddd4">'+
          '<div style="color:#9ca3af;font-size:10px;text-transform:uppercase">'+label+'</div>'+
          '<div style="font-weight:600;color:#1a2744">'+datos[key].toLocaleString('es-ES')+'€</div>'+
        '</div>';
      }
    });
    html += '</div></div>';
  }

  // Respuestas
  if(Object.keys(resp).length > 0){
    html += '<div style="margin-bottom:1rem">'+
      '<div style="font-weight:700;color:#1a2744;margin-bottom:8px">📝 Respuestas del alumno</div>'+
      '<table style="width:100%;border-collapse:collapse;font-size:13px">'+
      '<thead><tr style="background:#f2f0eb">'+
      '<th style="padding:8px;text-align:left;border:1px solid #e2ddd4">Ratio</th>'+
      '<th style="padding:8px;text-align:center;border:1px solid #e2ddd4">Respuesta alumno</th>'+
      '<th style="padding:8px;text-align:center;border:1px solid #e2ddd4">Valor correcto</th>'+
      '<th style="padding:8px;text-align:center;border:1px solid #e2ddd4">Resultado</th>'+
      '</tr></thead><tbody>';
    Object.keys(resp).forEach(function(id){
      var r = resp[id];
      var ok = r.ok;
      html += '<tr style="background:'+(ok?'#dcfce7':'#fee2e2')+'">'+
        '<td style="padding:7px 8px;border:1px solid #e2ddd4;font-weight:600">'+id+'</td>'+
        '<td style="padding:7px 8px;border:1px solid #e2ddd4;text-align:center">'+(r.respuesta!==null&&r.respuesta!==undefined?r.respuesta.toFixed(2):'—')+(r.unidad?' '+r.unidad:'')+'</td>'+
        '<td style="padding:7px 8px;border:1px solid #e2ddd4;text-align:center">'+(r.correcto!==null&&r.correcto!==undefined?r.correcto.toFixed(2):'—')+(r.unidad?' '+r.unidad:'')+'</td>'+
        '<td style="padding:7px 8px;border:1px solid #e2ddd4;text-align:center;font-weight:700;color:'+(ok?'#16a34a':'#dc2626')+'">'+(ok?'✓ Correcto':'✗ Incorrecto')+'</td>'+
      '</tr>';
    });
    html += '</tbody></table></div>';
  } else {
    html += '<div style="color:#9ca3af;font-size:13px;padding:1rem;text-align:center;background:#f9f8f5;border-radius:8px;margin-bottom:1rem">Sin detalle de respuestas disponible (entrega anterior al sistema de registro).</div>';
  }

  // Calificación
  html += '<div style="background:#f9f8f5;border-radius:8px;padding:1rem">'+
    '<div style="display:flex;gap:2rem;align-items:center;flex-wrap:wrap">'+
      '<div><div style="font-size:11px;color:#9ca3af;text-transform:uppercase;font-weight:700">Puntuación automática</div>'+
        '<div style="font-size:1.5rem;font-weight:700;color:'+(pAuto===null?'#9ca3af':pAuto>=70?'#16a34a':pAuto>=50?'#d97706':'#dc2626')+'">'+(pAuto!==null?pAuto+'%':'—')+'</div></div>'+
      '<div><div style="font-size:11px;color:#9ca3af;text-transform:uppercase;font-weight:700">Nota docente</div>'+
        '<div style="font-size:1.5rem;font-weight:700;color:'+(pDoc===null?'#9ca3af':pDoc>=7?'#16a34a':pDoc>=5?'#d97706':'#dc2626')+'">'+(pDoc!==null?pDoc+'/10':'Sin calificar')+'</div></div>'+
      (ent.comentario_docente?'<div style="flex:1"><div style="font-size:11px;color:#9ca3af;text-transform:uppercase;font-weight:700">Comentario</div><div style="font-size:13px">'+ent.comentario_docente+'</div></div>':'')+
    '</div>'+
  '</div>';

  html += '</div>';

  // Show modal
  var modal = document.createElement('div');
  modal.id = 'detalle-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem';
  modal.innerHTML = '<div style="background:#fff;border-radius:14px;padding:1.5rem;max-width:800px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.3)">'+
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">'+
      '<div style="font-weight:700;color:#1a2744;font-size:1rem">📄 Detalle de entrega</div>'+
      '<div style="display:flex;gap:8px">'+
        '<button class="btn-calc" data-eid="'+entregaId+'" onclick="descargarPDFEntrega(this.dataset.eid)" style="padding:7px 16px;font-size:12px">⬇️ Descargar PDF</button>'+
        '<button class="btn-sm" onclick="cerrarDetalleModal()" style="font-size:12px">✕ Cerrar</button>'+
      '</div>'+
    '</div>'+
    html+
  '</div>';
  document.body.appendChild(modal);
  }catch(err){
    console.error('verDetalleEntrega error:', err);
    flash('Error: '+err.message,'#dc2626');
  }
}

function cerrarDetalleModal(){ var m=document.getElementById('detalle-modal'); if(m)m.remove(); }

async function descargarPDFEntrega(entregaId){
  var modal = document.getElementById('detalle-modal');
  if(!modal) return;
  var content = modal.querySelector('[style*="max-height"]');
  if(!content) return;

  // Get alumno and actividad info for filename
  var {data:ent} = await supa.from('entregas').select('*, actividades(titulo)').eq('id',entregaId).single();
  var alumno = 'alumno';
  if(ent&&ent.alumno_id){var {data:aP}=await supa.from('perfiles').select('nombre').eq('id',ent.alumno_id).single();if(aP)alumno=aP.nombre.replace(/\s+/g,'_');}
  var titulo = ent && ent.actividades ? ent.actividades.titulo.replace(/\s+/g,'_') : 'actividad';
  var fecha = new Date().toLocaleDateString('es-ES',{day:'2-digit',month:'2-digit',year:'2-digit'}).replace(/\//g,'-');

  // Build print-ready HTML
  var printHtml = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">'+
    '<title>'+titulo+' - '+alumno+'</title>'+
    '<style>body{font-family:Arial,sans-serif;font-size:12px;color:#1a2744;padding:20px;max-width:800px;margin:0 auto}'+
    'table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:6px 8px}'+
    'th{background:#f2f0eb;font-weight:700}h1{font-size:16px;color:#1a2744}h2{font-size:14px;color:#1a2744;margin-top:16px}'+
    '.verde{background:#dcfce7}.rojo{background:#fee2e2}.header{background:#1a2744;color:#fff;padding:12px;border-radius:6px;margin-bottom:16px}'+
    '.datos-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:12px}'+
    '.dato{background:#f9f8f5;padding:6px;border-radius:4px;border:1px solid #e2ddd4}'+
    '.dato .label{color:#9ca3af;font-size:10px;text-transform:uppercase}.dato .valor{font-weight:700}'+
    '@media print{body{padding:10px}}</style></head><body>'+
    content.innerHTML+
    '</body></html>';

  var blob = new Blob([printHtml], {type:'text/html'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = alumno+'_'+titulo+'_'+fecha+'.html';
  a.click();
  URL.revokeObjectURL(url);
  flash('✅ Archivo descargado','#16a34a');
}

// ── initAuth ──────────────────────────────────────────
async function initAuth(){
  mostrarCargando();
  var {data:{session}}=await supa.auth.getSession();
  if(session){
    var perfil=await cargarPerfil(session.user.id);
    if(perfil){mostrarApp();actualizarUIConPerfil(perfil);registrarAcceso();}
    else{setTimeout(async function(){var p=await cargarPerfil(session.user.id);if(p){mostrarApp();actualizarUIConPerfil(p);registrarAcceso();}else mostrarLogin();},1500);}
  } else {mostrarLogin();}
  supa.auth.onAuthStateChange(async function(event,session){
    if(event==='SIGNED_IN'&&session){
      mostrarCargando();
      setTimeout(async function(){var p=await cargarPerfil(session.user.id);if(p){mostrarApp();actualizarUIConPerfil(p);registrarAcceso();}else mostrarLogin();},1000);
    } else if(event==='SIGNED_OUT'){USUARIO_ACTUAL=null;mostrarLogin();}
  });
}

// ── Bind button + start ───────────────────────────────
// Direct execution - script is at end of body, DOM already ready
(function(){
  var btn=document.getElementById('btn-google-login');
  if(btn)btn.addEventListener('click',loginConGoogle);
  initAuth();
})();


// ── ONBOARDING ALUMNO ────────────────────────────────
(function(){

var OB_STEPS = [
  {
    target: null, // pantalla de bienvenida, sin spotlight
    emoji: '👋',
    title: '¡Bienvenido a GestiónFin!',
    body: 'Esta es tu plataforma de Gestión Financiera del IES Cantillana. En un par de minutos te enseñamos todo lo que necesitas saber para empezar.',
    pos: 'center'
  },
  {
    target: 'ni-dashboard',
    emoji: '🏠',
    title: 'Inicio',
    body: 'Desde aquí tienes un resumen de todo: calendario próximo, acceso rápido a los bloques y tu progreso en los simuladores.',
    pos: 'right'
  },
  {
    target: 'ni-calendario',
    emoji: '📅',
    title: 'Calendario',
    body: 'Aquí aparecen los eventos del módulo: entregas, exámenes y actividades. Tu profesor los publicará con antelación.',
    pos: 'right'
  },
  {
    target: 'grp-ud',
    emoji: '📖',
    title: 'Bloques del módulo',
    body: 'Aquí están los 6 bloques de contenido del módulo. Cada uno incluye teoría, conceptos clave, vídeos y actividades. Pulsa para desplegar.',
    pos: 'right'
  },
  {
    target: 'grp-sims',
    emoji: '🧮',
    title: 'Simuladores',
    body: 'Practica de forma interactiva con simuladores de bolsa, préstamos, productos bancarios, presupuestos e inversiones. Cuanto más practiques, mejor.',
    pos: 'right'
  },
  {
    target: 'ns-bolsa',
    emoji: '📊',
    title: 'Simulador de Bolsa',
    body: 'Compra y vende acciones reales del IBEX 35 con dinero virtual. Aprende a interpretar cotizaciones, rentabilidades y el riesgo de mercado.',
    pos: 'right',
    openGroup: 'sims'
  },
  {
    target: 'nav-actividades',
    emoji: '📝',
    title: 'Actividades evaluables',
    body: 'Aquí aparecen las actividades que tu profesor ha activado para entrega. Tendrás un plazo y se calificarán dentro del módulo.',
    pos: 'right',
    showForRol: 'alumno'  // solo si el nav está visible
  },
  {
    target: null,
    emoji: '🚀',
    title: '¡Todo listo!',
    body: 'Ya conoces la plataforma. Empieza por el bloque que te indique tu profesor. ¡Buena suerte con Gestión Financiera!',
    pos: 'center'
  }
];

var obStep = 0;
var obActive = false;

function obStart(){
  if(localStorage.getItem('gf_ob_done_v1')) return;
  obActive = true;
  obStep = 0;
  document.getElementById('ob-overlay').style.display = 'block';
  setTimeout(function(){
    document.getElementById('ob-overlay').style.opacity = '1';
    obRender();
  }, 80);
}

function obEnd(){
  obActive = false;
  localStorage.setItem('gf_ob_done_v1','1');
  var ov = document.getElementById('ob-overlay');
  var sp = document.getElementById('ob-spotlight');
  var card = document.getElementById('ob-card');
  ov.style.opacity = '0';
  setTimeout(function(){
    ov.style.display = 'none';
    sp.style.display = 'none';
    card.style.display = 'none';
  }, 350);
}

function obGetVisibleStep(dir){
  var idx = obStep;
  while(true){
    var s = OB_STEPS[idx];
    if(!s) return -1;
    // Si tiene target, comprobar que el elemento existe y es visible
    if(s.target){
      var el = document.getElementById(s.target);
      if(!el || el.offsetParent === null || el.style.display === 'none'){
        idx += dir;
        if(idx < 0) idx = 0;
        if(idx >= OB_STEPS.length) return OB_STEPS.length - 1;
        continue;
      }
    }
    return idx;
  }
}

function obRender(){
  var s = OB_STEPS[obStep];
  if(!s){ obEnd(); return; }

  // Abrir grupo si hace falta
  if(s.openGroup){
    var btn = document.getElementById('grp-'+s.openGroup);
    var sub = document.getElementById('sub-'+s.openGroup);
    if(btn && sub && !btn.classList.contains('open')){
      btn.classList.add('open'); sub.classList.add('open');
    }
  }

  var card = document.getElementById('ob-card');
  var sp   = document.getElementById('ob-spotlight');
  card.style.display = 'block';

  // Dots
  var dotsHtml = '<div class="ob-dots">';
  OB_STEPS.forEach(function(_, i){ dotsHtml += '<div class="ob-dot'+(i===obStep?' active':'')+'"></div>'; });
  dotsHtml += '</div>';

  var isLast = obStep === OB_STEPS.length - 1;
  var isFirst = obStep === 0;

  card.innerHTML =
    '<span class="ob-emoji">'+s.emoji+'</span>'+
    '<div class="ob-step">Paso '+(obStep+1)+' de '+OB_STEPS.length+'</div>'+
    '<div class="ob-title">'+s.title+'</div>'+
    '<div class="ob-body">'+s.body+'</div>'+
    '<div class="ob-btns">'+
      '<button class="ob-skip" onclick="obSkip()">Saltar tour</button>'+
      dotsHtml+
      (!isFirst ? '<button class="ob-prev" onclick="obPrev()">← Atrás</button>' : '')+
      '<button class="ob-next" onclick="obNext()">'+(isLast ? '¡Empezar! 🎉' : 'Siguiente →')+'</button>'+
    '</div>';

  if(s.pos === 'center' || !s.target){
    // Centrado en pantalla, sin spotlight
    sp.style.display = 'none';
    card.style.cssText = 'display:block;position:fixed;z-index:8002;background:#fff;border-radius:14px;padding:22px 24px 18px;max-width:340px;min-width:260px;box-shadow:0 8px 40px rgba(0,0,0,.28);font-family:sans-serif;transition:all .4s cubic-bezier(.4,0,.2,1);top:50%;left:50%;transform:translate(-50%,-50%)';
  } else {
    var el = document.getElementById(s.target);
    if(!el || el.style.display === 'none'){
      obStep += 1; obRender(); return;
    }
    var r = el.getBoundingClientRect();
    var pad = 6;
    sp.style.cssText = 'display:block;position:fixed;z-index:8001;border-radius:10px;box-shadow:0 0 0 9999px rgba(10,16,34,.72);transition:all .4s cubic-bezier(.4,0,.2,1);'+
      'left:'+(r.left-pad)+'px;top:'+(r.top-pad)+'px;width:'+(r.width+pad*2)+'px;height:'+(r.height+pad*2)+'px;pointer-events:none';

    // Posicionar card a la derecha o debajo del spotlight
    var cw = 300, ch = 200;
    var vw = window.innerWidth, vh = window.innerHeight;
    var cx, cy;
    if(s.pos === 'right' && r.right + cw + 20 < vw){
      cx = r.right + 16;
      cy = Math.min(r.top, vh - ch - 20);
    } else {
      cx = Math.min(r.left, vw - cw - 20);
      cy = r.bottom + 12;
      if(cy + ch > vh) cy = r.top - ch - 12;
    }
    cy = Math.max(10, cy);
    card.style.cssText = 'display:block;position:fixed;z-index:8002;background:#fff;border-radius:14px;padding:22px 24px 18px;max-width:300px;min-width:240px;box-shadow:0 8px 40px rgba(0,0,0,.28);font-family:sans-serif;transition:all .4s cubic-bezier(.4,0,.2,1);left:'+cx+'px;top:'+cy+'px';
  }
}

function obNext(){
  if(obStep >= OB_STEPS.length - 1){ obEnd(); return; }
  obStep++;
  obRender();
}
function obPrev(){
  if(obStep <= 0) return;
  obStep--;
  obRender();
}
function obSkip(){ obEnd(); }

// Exponer globalmente
window.obNext = obNext;
window.obPrev = obPrev;
window.obSkip = obSkip;
window.obStart = obStart;

// Lanzar el tour cuando el alumno hace login
var _origActualizar = window.actualizarUIConPerfil;
// El hook se instala después de que la función esté definida

})();


// ── CHAT IA (Pollinations · sin registro) ────────────────
(function(){

// Recuperar historial de sesión si existe
var CHAT_HISTORY = (function(){
  try{ var h=JSON.parse(sessionStorage.getItem('gf_chat_history')||'[]'); return Array.isArray(h)?h:[]; }catch(e){ return []; }
})();
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
  try{ sessionStorage.removeItem('gf_chat_history'); }catch(e){}
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

  // Guardar historial en sessionStorage
  try{ sessionStorage.setItem('gf_chat_history', JSON.stringify(CHAT_HISTORY.slice(-30))); }catch(e){}

  // Construir mensajes para la API (máx 12 turnos de contexto)
  var messages = CHAT_HISTORY.slice(-12);

  var payload = {
    model: 'openai',
    messages: [{role:'system', content: SYSTEM_PROMPT}].concat(messages),
    seed: Math.floor(Math.random()*9999)
  };

  // Función de llamada con reintento automático
  function llamarAPI(intentos){
    return fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    }).then(function(r){
      if(!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).catch(function(err){
      if(intentos > 0){
        return new Promise(function(res){ setTimeout(res, 1800); }).then(function(){ return llamarAPI(intentos-1); });
      }
      throw err;
    });
  }

  llamarAPI(1)
  .then(function(data){
    chatTypingEnd();
    var reply = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content)
      ? data.choices[0].message.content.trim()
      : 'Lo siento, no he podido generar una respuesta. Inténtalo de nuevo.';
    CHAT_HISTORY.push({role:'assistant', content: reply});
    try{ sessionStorage.setItem('gf_chat_history', JSON.stringify(CHAT_HISTORY.slice(-30))); }catch(e){}
    chatAddMsg('ai', reply);
    chatSugerenciasContexto(text);
  })
  .catch(function(err){
    chatTypingEnd();
    chatAddMsg('ai', '⚠️ No se pudo conectar con el asistente. Comprueba tu conexión e inténtalo de nuevo.');
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

  // Contenidos interactivos (bloques texto, concepto, actividad)
  if(typeof CONT_DATA !== 'undefined'){
    Object.keys(CONT_DATA).forEach(function(udId){
      var ud = UNIDADES.find(function(u){ return u.id===udId; });
      (CONT_DATA[udId]||[]).forEach(function(b){
        if(!b.publicado && ROL !== 'profesor') return;
        var hayMatch = (b.titulo && b.titulo.toLowerCase().indexOf(ql)>=0) ||
                       (b.contenido && b.contenido.toLowerCase().indexOf(ql)>=0);
        if(hayMatch){
          var udId2=udId;
          items.push({type:'bloque', ico:'&#x1F4C4;', tag:'Contenido &middot; B'+(ud?ud.n:''),
            title: b.titulo || b.tipo,
            sub: b.contenido ? b.contenido.slice(0,90)+'&#x2026;' : '',
            action: function(){ goTo(udId2, null); }});
        }
      });
    });
  }

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


// ── PERSISTENCIA PROFESOR EN SUPABASE ─────────────────────────────
// Requiere tabla: profesor_config (docente_id uuid, clave text, valor jsonb)
// PRIMARY KEY (docente_id, clave) — RLS: solo el docente puede leer/escribir su config

var _syncDebounces = {};

function syncProfesorConfig(clave, valor){
  if(!USUARIO_ACTUAL) return;
  if(!USUARIO_ACTUAL.rol){
    console.warn('[GestiónFin] syncProfesorConfig: USUARIO_ACTUAL.rol no definido. Verifica que la columna "rol" existe en la tabla perfiles de Supabase.');
    return;
  }
  if(USUARIO_ACTUAL.rol !== 'docente') return;
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

// ── CONTENIDO PUBLICADO → ALUMNADO ────────────────────────────────
// El alumnado no puede leer gf_cont_data (incluye borradores). El docente sube
// además 'gf_cont_publico': los bloques en borrador van vacíos (solo id/tipo,
// para que data.js no los regenere con el contenido por defecto).
// RLS: los alumnos solo pueden leer las claves de CLAVES_ALUMNO.
var CLAVES_ALUMNO = {
  gf_unidades: 'gf_unidades',
  gf_bloques_estructura: 'gf_bloques_estructura',
  gf_glosario: 'gf_glosario',
  gf_cont_publico: 'gf_cont_data'
};

function contenidoPublico(){
  var out = {};
  Object.keys(CONT_DATA).forEach(function(udId){
    out[udId] = (CONT_DATA[udId]||[]).map(function(b){
      return b.publicado ? b : { id:b.id, tipo:b.tipo, publicado:false };
    });
  });
  return out;
}

function _huella(str){
  var h = 0;
  for(var i = 0; i < str.length; i++){ h = ((h<<5) - h + str.charCodeAt(i)) | 0; }
  return String(h);
}

// Alumno: descarga el contenido publicado por el docente y recarga una vez si ha cambiado
async function cargarContenidoAlumno(){
  if(!USUARIO_ACTUAL || USUARIO_ACTUAL.rol !== 'alumno') return;
  try{
    var {data, error} = await supa.from('profesor_config')
      .select('clave,valor').in('clave', Object.keys(CLAVES_ALUMNO));
    if(error){ console.warn('[Contenido alumno]', error.message); return; }
    if(!data || !data.length) return;

    var cambios = false, todo = '';
    data.forEach(function(r){
      var k = CLAVES_ALUMNO[r.clave];
      var v = JSON.stringify(r.valor);
      todo += r.clave + v;
      if(localStorage.getItem(k) !== v){ localStorage.setItem(k, v); cambios = true; }
    });
    if(!cambios) return;

    // data.js lee estas claves al cargar: recargar una sola vez por versión del contenido
    var huella = _huella(todo);
    if(sessionStorage.getItem('gf_cont_sync') === huella) return;
    sessionStorage.setItem('gf_cont_sync', huella);
    location.reload();
  } catch(e){ console.warn('[cargarContenidoAlumno]', e); }
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
  saveCont     = function(){ orig.saveCont();     syncProfesorConfig('gf_cont_data', CONT_DATA); syncProfesorConfig('gf_cont_publico', contenidoPublico()); };
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



// ═══════════════════════════════════════════════════════
// MÓDULO DE PERFILES — Profesor y Alumno
// ═══════════════════════════════════════════════════════

var GF_CURSO_KEY = 'gf_curso_actual';

function getCursoActual(){
  return localStorage.getItem(GF_CURSO_KEY) || '2026-27';
}
function setCursoActual(v){
  localStorage.setItem(GF_CURSO_KEY, v);
  var el = document.getElementById('dash-curso-txt');
  if(el) el.textContent = 'CFGS Administración y Finanzas · IES Cantillana · Curso ' + v;
}
(function(){ setCursoActual(getCursoActual()); })();

function renderPerfil(){
  var root = document.getElementById('perfil-root');
  if(!root) return;
  root.innerHTML = '<div style="display:flex;justify-content:center;padding:3rem"><div style="color:var(--muted)">Cargando perfil...</div></div>';
  if(!USUARIO_ACTUAL){ root.innerHTML = '<div style="padding:2rem;color:var(--muted)">No hay sesión activa.</div>'; return; }
  if(USUARIO_ACTUAL.rol === 'docente') renderPerfilProfesor(root);
  else renderPerfilAlumno(root);
}

// ─── PERFIL PROFESOR ──────────────────────────────────
async function renderPerfilProfesor(root){
  var u = USUARIO_ACTUAL;
  var nombre = u.nombre || u.email.split('@')[0];
  var cursoActual = getCursoActual();
  var {data: usuarios} = await supa.from('perfiles').select('id,nombre,apellidos,email,rol,grupo,created_at').order('rol').order('nombre');

  var cursosOpts = ['2024-25','2025-26','2026-27','2027-28','2028-29'].map(function(y){
    return '<option value="'+y+'"'+(y===cursoActual?' selected':'')+'>'+y+'</option>';
  }).join('');

  var avatarHtml = u.avatar_url
    ? '<img src="'+u.avatar_url+'" style="width:100%;height:100%;object-fit:cover">'
    : nombre.charAt(0).toUpperCase();

  var usrRows = (usuarios||[]).map(function(usr){
    var alta = usr.created_at ? new Date(usr.created_at).toLocaleDateString('es-ES',{day:'2-digit',month:'2-digit',year:'2-digit'}) : '—';
    var badgeStyle = usr.rol==='docente'
      ? 'background:rgba(212,175,55,.15);color:var(--gold)'
      : 'background:rgba(99,102,241,.12);color:#6366f1';
    var badgeLabel = usr.rol==='docente' ? 'DOCENTE' : 'ALUMNO';
    var esSelf = usr.id === u.id;
    var nombreCompleto = (usr.nombre||'—') + (usr.apellidos ? ' '+usr.apellidos : '');
    var acciones = '<div style="display:flex;gap:5px;justify-content:flex-end;align-items:center">'
      + (esSelf ? '<span style="font-size:11px;color:var(--muted);margin-right:4px">(tú)</span>' : '')
      + '<button class="btn-sm" title="Editar perfil" onclick="adminEditarPerfil('
        + '\''+usr.id+'\','
        + '\''+encodeURIComponent(usr.nombre||'')+'\','
        + '\''+encodeURIComponent(usr.apellidos||'')+'\','
        + '\''+encodeURIComponent(usr.grupo||'')+'\','
        + '\''+usr.rol+'\''
        + ')">✏️</button>'
      + (!esSelf ? '<button class="btn-sm" style="background:rgba(239,68,68,.12);color:#ef4444" title="Eliminar datos" onclick="eliminarDatosUsuario(\''+usr.id+'\',\''+encodeURIComponent(usr.nombre||usr.email)+'\')">🗑</button>' : '')
      + '</div>';
    return '<tr>'
      +'<td style="padding:10px 14px;font-weight:600;font-size:13px">'+nombreCompleto+'</td>'
      +'<td style="font-size:12px;color:var(--muted)">'+(usr.email||'—')+'</td>'
      +'<td style="text-align:center"><span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px;'+badgeStyle+'">'+badgeLabel+'</span></td>'
      +'<td style="font-size:12px;color:var(--muted);text-align:center">'+(usr.grupo||'—')+'</td>'
      +'<td style="font-size:12px;color:var(--muted);text-align:center">'+alta+'</td>'
      +'<td style="padding:6px 10px;text-align:right">'+acciones+'</td>'
      +'</tr>';
  }).join('');

  root.innerHTML =
    '<div class="ph"><div><h1 class="pt">Mi Perfil</h1><p class="ps">Configuración y administración de la plataforma</p></div></div>'
    +'<div style="display:grid;grid-template-columns:300px 1fr;gap:1.25rem;align-items:start">'

    // ── Columna izquierda ──
    +'<div style="display:flex;flex-direction:column;gap:1.25rem">'
    +'<div class="card" style="text-align:center;padding:2rem">'
    +'<div style="margin:0 auto 1rem;width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--navy),var(--gold));display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;color:#fff;overflow:hidden">'+avatarHtml+'</div>'
    +'<div style="font-size:1rem;font-weight:700;margin-bottom:4px" id="prf-nombre-display">'+nombre+'</div>'
    +'<div style="font-size:12px;color:var(--muted);margin-bottom:6px">'+u.email+'</div>'
    +'<span style="display:inline-block;background:rgba(212,175,55,.15);color:var(--gold);font-size:11px;font-weight:700;padding:3px 10px;border-radius:99px">DOCENTE</span>'
    +'</div>'
    // Editar nombre
    +'<div class="card">'
    +'<div class="card-header"><div class="card-title">✏️ Editar nombre</div></div>'
    +'<div class="card-body">'
    +'<input id="prf-nombre-inp" class="fs" value="'+nombre+'" placeholder="Tu nombre" style="margin-bottom:10px">'
    +'<button class="btn btn-p" style="width:100%" onclick="guardarNombrePerfil()">Guardar nombre</button>'
    +'</div></div>'
    // Cambiar contraseña
    +'<div class="card">'
    +'<div class="card-header"><div class="card-title">🔑 Cambiar contraseña</div></div>'
    +'<div class="card-body">'
    +'<input id="prf-pass1" type="password" class="fs" placeholder="Nueva contraseña (mín. 8 car.)" style="margin-bottom:8px">'
    +'<input id="prf-pass2" type="password" class="fs" placeholder="Repetir contraseña" style="margin-bottom:10px">'
    +'<button class="btn btn-g" style="width:100%" onclick="cambiarPasswordPerfil()">Cambiar contraseña</button>'
    +'</div></div>'
    // Año de curso
    +'<div class="card">'
    +'<div class="card-header"><div class="card-title">📅 Año de curso</div></div>'
    +'<div class="card-body">'
    +'<p style="font-size:13px;color:var(--muted);margin-bottom:12px">Selecciona el año académico que aparece en el dashboard y en los informes exportados.</p>'
    +'<div style="display:flex;gap:10px">'
    +'<select id="prf-curso-sel" class="fs" style="flex:1">'+cursosOpts+'</select>'
    +'<button class="btn btn-p" onclick="guardarAnoCurso()">Aplicar</button>'
    +'</div></div></div>'
    +'</div>'

    // ── Columna derecha ──
    +'<div style="display:flex;flex-direction:column;gap:1.25rem">'
    // Gestión usuarios
    +'<div class="card">'
    +'<div class="card-header"><div class="card-title">👥 Gestión de usuarios</div><div style="font-size:12px;color:var(--muted)">'+(usuarios||[]).length+' registrados</div></div>'
    +'<div class="card-body" style="padding:0"><div style="overflow-x:auto">'
    +'<table class="dt" style="width:100%"><thead><tr>'
    +'<th style="text-align:left;padding:10px 14px">Nombre completo</th><th>Email</th><th>Rol</th><th>Grupo</th><th>Alta</th><th></th>'
    +'</tr></thead><tbody>'+usrRows+'</tbody></table>'
    +'</div></div></div>'
    // Mantenimiento
    +'<div class="card" style="border:1px solid rgba(239,68,68,.25)">'
    +'<div class="card-header"><div class="card-title">🛠️ Mantenimiento del curso</div></div>'
    +'<div class="card-body" style="display:flex;flex-direction:column;gap:14px">'
    // Backup
    +'<div style="background:var(--surface-2,rgba(0,0,0,.03));border-radius:10px;padding:14px">'
    +'<div style="font-weight:600;font-size:13px;margin-bottom:4px">💾 Copia de seguridad</div>'
    +'<div style="font-size:12px;color:var(--muted);margin-bottom:10px">Descarga todos los ejercicios, entregas y notas del curso en un archivo Excel antes de pasar al siguiente año.</div>'
    +'<div style="display:flex;gap:8px;flex-wrap:wrap">'
    +'<button class="btn btn-p" onclick="generarBackupPlataforma()">⬇ Descargar backup Excel</button>'
    +'<button class="btn btn-g" onclick="document.getElementById(\'backup-restore-inp\').click()">📥 Restaurar backup</button>'
    +'<input type="file" id="backup-restore-inp" accept=".xlsx" style="display:none" onchange="restaurarBackupPlataforma(this)">'
    +'</div></div>'
    // Limpieza
    +'<div style="background:rgba(239,68,68,.05);border:1px solid rgba(239,68,68,.2);border-radius:10px;padding:14px">'
    +'<div style="font-weight:600;font-size:13px;margin-bottom:4px;color:#ef4444">⚠️ Puesta a punto para nuevo curso</div>'
    +'<div style="font-size:12px;color:var(--muted);margin-bottom:10px">Elimina todos los ejercicios realizados y entregas. <strong>Haz antes la copia de seguridad.</strong> Los usuarios y actividades se conservan.</div>'
    +'<button class="btn" style="background:#ef4444;color:#fff" onclick="confirmarLimpiezaPlataforma()">Limpiar plataforma</button>'
    +'</div>'
    +'</div></div>'
    +'</div></div>';
}

// ─── PERFIL ALUMNO ────────────────────────────────────
async function renderPerfilAlumno(root){
  var u = USUARIO_ACTUAL;
  var nombre = u.nombre || u.email.split('@')[0];

  var [resEj, resEnt] = await Promise.all([
    supa.from('ejercicios_realizados').select('simulador_id,nivel,puntuacion,created_at,simuladores(nombre)')
        .eq('alumno_id',u.id).eq('completado',true).order('created_at',{ascending:false}),
    supa.from('entregas').select('id,entregada_at,puntuacion_automatica,puntuacion_docente,actividades(titulo,simuladores(nombre))')
        .eq('alumno_id',u.id).order('entregada_at',{ascending:false})
  ]);
  var ejercicios = resEj.data || [];
  var entregas   = (resEnt.data || []).filter(function(e){ return e.entregada_at; });

  var totalEj = ejercicios.length;
  var mediaGlobal = totalEj ? Math.round(ejercicios.reduce(function(s,e){return s+(e.puntuacion||0);},0)/totalEj) : 0;
  var niveles = ['basico','medio','avanzado'];
  var nivelMax = 'basico';
  ejercicios.forEach(function(e){ if(niveles.indexOf(e.nivel)>niveles.indexOf(nivelMax)) nivelMax=e.nivel; });

  var porSim = {};
  ejercicios.forEach(function(e){
    var sn = (e.simuladores&&e.simuladores.nombre)||e.simulador_id;
    if(!porSim[sn]) porSim[sn]={total:0,suma:0,nivMax:'basico'};
    porSim[sn].total++;
    porSim[sn].suma+=(e.puntuacion||0);
    if(niveles.indexOf(e.nivel)>niveles.indexOf(porSim[sn].nivMax)) porSim[sn].nivMax=e.nivel;
  });

  var nivelLabel = {basico:'Básico',medio:'Medio',avanzado:'Avanzado'};
  var nivelColor = {basico:'#6366f1',medio:'#f59e0b',avanzado:'#16a34a'};

  var avatarHtml = u.avatar_url
    ? '<img src="'+u.avatar_url+'" style="width:100%;height:100%;object-fit:cover">'
    : nombre.charAt(0).toUpperCase();

  var simRows = Object.keys(porSim).length === 0
    ? '<div style="padding:2rem;text-align:center;color:var(--muted);font-size:13px">Aún no has completado ejercicios en los simuladores.</div>'
    : '<table class="dt" style="width:100%"><thead><tr>'
      +'<th style="text-align:left;padding:10px 14px">Simulador</th><th>Ejercicios</th><th>Media</th><th>Nivel máx.</th>'
      +'</tr></thead><tbody>'
      + Object.keys(porSim).map(function(sn){
          var s = porSim[sn];
          var media = Math.round(s.suma/s.total);
          var col = nivelColor[s.nivMax]||'#6366f1';
          return '<tr>'
            +'<td style="padding:10px 14px;font-weight:600;font-size:13px">'+sn+'</td>'
            +'<td style="text-align:center">'+s.total+'</td>'
            +'<td style="text-align:center">'
              +'<div style="display:flex;align-items:center;gap:8px;justify-content:center">'
              +'<div style="flex:1;max-width:80px;height:6px;background:rgba(0,0,0,.08);border-radius:3px">'
              +'<div style="height:100%;width:'+Math.min(100,media)+'%;background:'+col+';border-radius:3px"></div></div>'
              +'<span style="font-size:12px;font-weight:600">'+media+'%</span></div></td>'
            +'<td style="text-align:center"><span style="font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;background:'+col+'22;color:'+col+'">'+nivelLabel[s.nivMax]+'</span></td>'
            +'</tr>';
        }).join('')
      +'</tbody></table>';

  var entRows = entregas.length === 0
    ? '<div style="padding:2rem;text-align:center;color:var(--muted);font-size:13px">Aún no has entregado ninguna actividad.</div>'
    : '<table class="dt" style="width:100%"><thead><tr>'
      +'<th style="text-align:left;padding:10px 14px">Actividad</th><th>Simulador</th><th>Entregada</th><th>Nota auto.</th><th>Nota docente</th>'
      +'</tr></thead><tbody>'
      + entregas.map(function(e){
          var tit = (e.actividades&&e.actividades.titulo)||'Actividad';
          var sim = (e.actividades&&e.actividades.simuladores&&e.actividades.simuladores.nombre)||'—';
          var fecha = e.entregada_at ? new Date(e.entregada_at).toLocaleDateString('es-ES',{day:'2-digit',month:'2-digit',year:'2-digit'}) : '—';
          var nota  = e.puntuacion_automatica!=null ? Math.round(e.puntuacion_automatica)+'%' : '—';
          var notaD = e.puntuacion_docente!=null ? e.puntuacion_docente : '—';
          return '<tr>'
            +'<td style="padding:10px 14px;font-weight:600;font-size:13px">'+tit+'</td>'
            +'<td style="font-size:12px;color:var(--muted)">'+sim+'</td>'
            +'<td style="font-size:12px;text-align:center">'+fecha+'</td>'
            +'<td style="text-align:center;font-weight:600">'+nota+'</td>'
            +'<td style="text-align:center;font-weight:600;color:var(--gold)">'+notaD+'</td>'
            +'</tr>';
        }).join('')
      +'</tbody></table>';

  root.innerHTML =
    '<div class="ph"><div><h1 class="pt">Mi Perfil</h1><p class="ps">Tu información y progreso en Gestión Financiera</p></div></div>'
    +'<div style="display:grid;grid-template-columns:290px 1fr;gap:1.25rem;align-items:start">'

    // ── Columna izquierda ──
    +'<div style="display:flex;flex-direction:column;gap:1.25rem">'
    // Avatar
    +'<div class="card" style="text-align:center;padding:2rem">'
    +'<div style="position:relative;width:90px;height:90px;margin:0 auto 1rem">'
    +'<div id="prf-alu-avatar" style="width:90px;height:90px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#a78bfa);display:flex;align-items:center;justify-content:center;font-size:2.2rem;font-weight:700;color:#fff;overflow:hidden">'+avatarHtml+'</div>'
    +'<button onclick="document.getElementById(\'prf-foto-inp\').click()" title="Cambiar foto" style="position:absolute;bottom:0;right:0;width:28px;height:28px;border-radius:50%;background:var(--gold);border:none;cursor:pointer;font-size:14px;line-height:1;box-shadow:0 2px 6px rgba(0,0,0,.25)">📷</button>'
    +'</div>'
    +'<input type="file" id="prf-foto-inp" accept="image/*" style="display:none" onchange="subirFotoAlumno(this)">'
    +'<div style="font-size:1rem;font-weight:700;margin-bottom:2px" id="prf-alu-nombre">'+nombre+'</div>'
    +((u.apellidos)?'<div style="font-size:13px;font-weight:600;color:var(--navy);margin-bottom:4px">'+u.apellidos+'</div>':'')
    +'<div style="font-size:12px;color:var(--muted)">'+u.email+'</div>'
    +'</div>'
    // Editar nombre y apellidos
    +'<div class="card">'
    +'<div class="card-header"><div class="card-title">✏️ Datos personales</div></div>'
    +'<div class="card-body">'
    +'<label style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);display:block;margin-bottom:4px">Nombre</label>'
    +'<input id="prf-nombre-inp" class="fs" value="'+nombre+'" placeholder="Tu nombre" style="margin-bottom:10px">'
    +'<label style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);display:block;margin-bottom:4px">Apellidos</label>'
    +'<input id="prf-apellidos-inp" class="fs" value="'+(u.apellidos||'')+'" placeholder="Tus apellidos" style="margin-bottom:10px">'
    +'<button class="btn btn-p" style="width:100%" onclick="guardarNombrePerfil()">Guardar</button>'
    +'</div></div>'
    // Cambiar contraseña
    +'<div class="card">'
    +'<div class="card-header"><div class="card-title">🔑 Cambiar contraseña</div></div>'
    +'<div class="card-body">'
    +'<input id="prf-pass1" type="password" class="fs" placeholder="Nueva contraseña (mín. 8 car.)" style="margin-bottom:8px">'
    +'<input id="prf-pass2" type="password" class="fs" placeholder="Repetir contraseña" style="margin-bottom:10px">'
    +'<button class="btn btn-g" style="width:100%" onclick="cambiarPasswordPerfil()">Cambiar contraseña</button>'
    +'</div></div>'
    // Stats
    +'<div class="card">'
    +'<div class="card-header"><div class="card-title">📊 Resumen</div></div>'
    +'<div class="card-body" style="display:flex;flex-direction:column;gap:0">'
    +'<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border-lt,rgba(0,0,0,.06))"><span style="font-size:13px;color:var(--muted)">Ejercicios completados</span><span style="font-size:16px;font-weight:700">'+totalEj+'</span></div>'
    +'<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border-lt,rgba(0,0,0,.06))"><span style="font-size:13px;color:var(--muted)">Actividades entregadas</span><span style="font-size:16px;font-weight:700">'+entregas.length+'</span></div>'
    +'<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border-lt,rgba(0,0,0,.06))"><span style="font-size:13px;color:var(--muted)">Puntuación media</span><span style="font-size:16px;font-weight:700">'+mediaGlobal+'%</span></div>'
    +'<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0"><span style="font-size:13px;color:var(--muted)">Nivel alcanzado</span>'
    +'<span style="font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;background:'+nivelColor[nivelMax]+'22;color:'+nivelColor[nivelMax]+'">'+nivelLabel[nivelMax]+'</span></div>'
    +'</div></div>'
    +'</div>'

    // ── Columna derecha ──
    +'<div style="display:flex;flex-direction:column;gap:1.25rem">'
    +'<div class="card"><div class="card-header"><div class="card-title">🧮 Progreso en simuladores</div></div><div class="card-body" style="padding:0">'+simRows+'</div></div>'
    +'<div class="card"><div class="card-header"><div class="card-title">📋 Actividades entregadas</div><div style="font-size:12px;color:var(--muted)">'+entregas.length+' entregas</div></div><div class="card-body" style="padding:0">'+entRows+'</div></div>'
    +'</div></div>';
}

// ─── Funciones comunes ────────────────────────────────
async function guardarNombrePerfil(){
  var inp = document.getElementById('prf-nombre-inp');
  var inpAp = document.getElementById('prf-apellidos-inp');
  if(!inp) return;
  var nuevo = inp.value.trim();
  var nuevosAp = inpAp ? inpAp.value.trim() : null;
  if(!nuevo){ flash('Introduce un nombre válido','#ef4444'); return; }
  var update = {nombre:nuevo};
  if(nuevosAp !== null) update.apellidos = nuevosAp;
  var {error} = await supa.from('perfiles').update(update).eq('id',USUARIO_ACTUAL.id);
  if(error){ flash('Error al guardar: '+error.message,'#ef4444'); return; }
  USUARIO_ACTUAL.nombre = nuevo;
  if(nuevosAp !== null) USUARIO_ACTUAL.apellidos = nuevosAp;
  var nd = document.getElementById('prf-nombre-display')||document.getElementById('prf-alu-nombre');
  if(nd) nd.textContent = nuevo;
  var un = document.getElementById('u-name');
  if(un) un.textContent = nuevo;
  flash('✅ Datos actualizados','#16a34a');
}

async function cambiarPasswordPerfil(){
  var p1 = (document.getElementById('prf-pass1')||{}).value;
  var p2 = (document.getElementById('prf-pass2')||{}).value;
  if(!p1){ flash('Introduce la nueva contraseña','#ef4444'); return; }
  if(p1.length < 8){ flash('La contraseña debe tener al menos 8 caracteres','#ef4444'); return; }
  if(p1 !== p2){ flash('Las contraseñas no coinciden','#ef4444'); return; }
  var {error} = await supa.auth.updateUser({password: p1});
  if(error){
    flash(error.message.includes('same password')
      ? 'La nueva contraseña no puede ser igual a la actual'
      : 'Error: '+error.message, '#ef4444');
    return;
  }
  var i1=document.getElementById('prf-pass1'), i2=document.getElementById('prf-pass2');
  if(i1) i1.value=''; if(i2) i2.value='';
  flash('✅ Contraseña actualizada','#16a34a');
}

function guardarAnoCurso(){
  var sel = document.getElementById('prf-curso-sel');
  if(!sel) return;
  setCursoActual(sel.value);
  flash('✅ Curso ' + sel.value + ' activado','#16a34a');
}

// ─── Admin: editar perfil de cualquier usuario (solo docente) ────────
function adminEditarPerfil(uid, nombreEnc, apellidosEnc, grupoEnc, rolActual){
  if(!USUARIO_ACTUAL || USUARIO_ACTUAL.rol !== 'docente'){ flash('Sin permisos','#ef4444'); return; }
  var nombre   = decodeURIComponent(nombreEnc);
  var apellidos= decodeURIComponent(apellidosEnc);
  var grupo    = decodeURIComponent(grupoEnc);

  var overlay = document.createElement('div');
  overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem';

  var grupos = ['','1ºA','1ºB','2ºA','2ºB'];
  var grupoOpts = grupos.map(function(g){
    return '<option value="'+g+'"'+(g===grupo?' selected':'')+'>'+( g||'Sin grupo')+'</option>';
  }).join('');
  var rolOpts = ['alumno','docente'].map(function(r){
    return '<option value="'+r+'"'+(r===rolActual?' selected':'')+'>'+r.charAt(0).toUpperCase()+r.slice(1)+'</option>';
  }).join('');

  var lbl = 'style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);display:block;margin-bottom:4px"';
  overlay.innerHTML=
    '<div style="background:#fff;border-radius:14px;padding:1.5rem;max-width:440px;width:100%;box-shadow:0 8px 40px rgba(0,0,0,.25);max-height:90vh;overflow-y:auto">'
    +'<div style="font-weight:700;font-size:1rem;color:var(--navy);margin-bottom:1.2rem">✏️ Editar perfil de usuario</div>'
    +'<label '+lbl+'>Nombre</label>'
    +'<input id="adm-nombre" class="fs" value="'+nombre+'" style="margin-bottom:10px">'
    +'<label '+lbl+'>Apellidos</label>'
    +'<input id="adm-apellidos" class="fs" value="'+apellidos+'" style="margin-bottom:10px">'
    +'<label '+lbl+'>Grupo</label>'
    +'<select id="adm-grupo" class="fs" style="margin-bottom:10px">'+grupoOpts+'</select>'
    +'<label '+lbl+'>Rol</label>'
    +'<select id="adm-rol" class="fs" style="margin-bottom:1.2rem">'+rolOpts+'</select>'
    // Sección contraseña
    +'<div style="border-top:1px solid #e5e7eb;padding-top:1rem;margin-bottom:1.2rem">'
    +'<div style="font-size:12px;font-weight:600;color:var(--navy);margin-bottom:8px">🔑 Contraseña</div>'
    +'<div style="font-size:12px;color:var(--muted);margin-bottom:10px">Envía un enlace de restablecimiento al correo del alumno, o establece una nueva contraseña directamente.</div>'
    +'<div style="display:flex;gap:8px;margin-bottom:10px">'
    +'<button id="adm-send-reset" class="btn btn-g" style="font-size:12px">📧 Enviar enlace de reset</button>'
    +'</div>'
    +'<label '+lbl+'>Nueva contraseña (dejar vacío para no cambiar)</label>'
    +'<input id="adm-newpass" type="password" class="fs" placeholder="Mín. 8 caracteres" style="margin-bottom:6px">'
    +'<input id="adm-newpass2" type="password" class="fs" placeholder="Repetir contraseña" style="margin-bottom:0">'
    +'<div id="adm-pass-msg" style="font-size:12px;margin-top:6px;display:none"></div>'
    +'</div>'
    +'<div style="display:flex;gap:8px;justify-content:flex-end">'
    +'<button id="adm-cancel" class="btn btn-g">Cancelar</button>'
    +'<button id="adm-save" class="btn btn-p">Guardar cambios</button>'
    +'</div></div>';

  document.body.appendChild(overlay);
  overlay.querySelector('#adm-cancel').onclick = function(){ document.body.removeChild(overlay); };
  overlay.onclick = function(e){ if(e.target===overlay) document.body.removeChild(overlay); };

  // Enviar enlace de reset de contraseña
  overlay.querySelector('#adm-send-reset').onclick = async function(){
    var btn = this; btn.disabled=true; btn.textContent='Enviando…';
    // Obtener email del usuario
    var {data:perf} = await supa.from('perfiles').select('email').eq('id',uid).single();
    if(!perf||!perf.email){ flash('No se encontró el email del usuario','#ef4444'); btn.disabled=false; btn.textContent='📧 Enviar enlace de reset'; return; }
    var {error} = await supa.auth.resetPasswordForEmail(perf.email, {redirectTo: window.location.href});
    if(error){ flash('Error: '+error.message,'#ef4444'); }
    else { flash('✅ Enlace enviado a '+perf.email,'#16a34a'); }
    btn.disabled=false; btn.textContent='📧 Enviar enlace de reset';
  };

  overlay.querySelector('#adm-save').onclick = async function(){
    var btn = this; btn.disabled=true; btn.textContent='Guardando…';
    var nuevoNombre   = overlay.querySelector('#adm-nombre').value.trim();
    var nuevoApellidos= overlay.querySelector('#adm-apellidos').value.trim();
    var nuevoGrupo    = overlay.querySelector('#adm-grupo').value;
    var nuevoRol      = overlay.querySelector('#adm-rol').value;
    var newPass       = overlay.querySelector('#adm-newpass').value;
    var newPass2      = overlay.querySelector('#adm-newpass2').value;
    var passMsg       = overlay.querySelector('#adm-pass-msg');

    if(!nuevoNombre){ flash('El nombre no puede estar vacío','#ef4444'); btn.disabled=false; btn.textContent='Guardar cambios'; return; }

    // Validar contraseña si se rellenó
    if(newPass){
      if(newPass.length < 8){
        passMsg.style.display='block'; passMsg.style.color='#ef4444'; passMsg.textContent='La contraseña debe tener al menos 8 caracteres';
        btn.disabled=false; btn.textContent='Guardar cambios'; return;
      }
      if(newPass !== newPass2){
        passMsg.style.display='block'; passMsg.style.color='#ef4444'; passMsg.textContent='Las contraseñas no coinciden';
        btn.disabled=false; btn.textContent='Guardar cambios'; return;
      }
    }

    // Guardar datos del perfil
    var {error} = await supa.from('perfiles').update({
      nombre:nuevoNombre, apellidos:nuevoApellidos,
      grupo:nuevoGrupo||null, rol:nuevoRol
    }).eq('id', uid);
    if(error){ flash('Error: '+error.message,'#ef4444'); btn.disabled=false; btn.textContent='Guardar cambios'; return; }

    // Cambiar contraseña si se indicó (solo funciona si el usuario tiene sesión activa;
    // para otros usuarios se recomienda el enlace de reset)
    if(newPass){
      passMsg.style.display='block'; passMsg.style.color='#6366f1';
      passMsg.textContent='⚠️ El cambio de contraseña directo requiere que el usuario use el enlace de reset. Se ha enviado automáticamente.';
      var {data:perf} = await supa.from('perfiles').select('email').eq('id',uid).single();
      if(perf&&perf.email) await supa.auth.resetPasswordForEmail(perf.email, {redirectTo: window.location.href});
    }

    document.body.removeChild(overlay);
    flash('✅ Perfil actualizado','#16a34a');
    setTimeout(function(){ renderPerfil(); }, 500);
  };
}

async function cambiarRolUsuario(uid, rolActual){
  var nuevoRol = rolActual === 'docente' ? 'alumno' : 'docente';
  if(!confirm('¿Cambiar el rol de este usuario a ' + nuevoRol.toUpperCase() + '?')) return;
  var {error} = await supa.from('perfiles').update({rol:nuevoRol}).eq('id',uid);
  if(error){ flash('Error: '+error.message,'#ef4444'); return; }
  flash('✅ Rol cambiado a ' + nuevoRol,'#16a34a');
  setTimeout(function(){ renderPerfil(); }, 700);
}

async function eliminarDatosUsuario(uid, nombreEnc){
  var nombre = decodeURIComponent(nombreEnc);
  if(!confirm('⚠️ ¿Eliminar TODOS los datos de ' + nombre + '?\n\nSe borrarán sus ejercicios y entregas. El usuario podrá volver a entrar desde cero.\n\nEsta acción no se puede deshacer.')) return;
  await Promise.all([
    supa.from('ejercicios_realizados').delete().eq('alumno_id',uid),
    supa.from('entregas').delete().eq('alumno_id',uid)
  ]);
  flash('✅ Datos de ' + nombre + ' eliminados','#16a34a');
  setTimeout(function(){ renderPerfil(); }, 800);
}

async function generarBackupPlataforma(){
  if(!window.XLSX){ flash('Librería Excel no disponible','#ef4444'); return; }
  flash('Generando backup...','#6366f1');
  try{
    var [rP,rE,rEnt,rA,rAc] = await Promise.all([
      supa.from('perfiles').select('*').eq('rol','alumno').order('nombre'),
      supa.from('ejercicios_realizados').select('*').order('created_at',{ascending:false}),
      supa.from('entregas').select('*').order('entregada_at',{ascending:false}),
      supa.from('actividades').select('*').order('created_at'),
      supa.from('accesos').select('*').order('created_at',{ascending:false}).limit(2000)
    ]);
    var wb = XLSX.utils.book_new();
    function addSheet(data, name){
      var ws = data&&data.length ? XLSX.utils.json_to_sheet(data) : XLSX.utils.aoa_to_sheet([['Sin datos']]);
      XLSX.utils.book_append_sheet(wb, ws, name);
    }
    addSheet(rP.data,   'Alumnos');
    addSheet(rE.data,   'Ejercicios');
    addSheet(rEnt.data, 'Entregas');
    addSheet(rA.data,   'Actividades');
    addSheet(rAc.data,  'Accesos');
    XLSX.writeFile(wb, 'GestionFin_Backup_' + getCursoActual().replace('-','_') + '.xlsx');
    flash('✅ Backup descargado','#16a34a');
  }catch(e){ flash('Error: '+e.message,'#ef4444'); }
}

async function restaurarBackupPlataforma(input){
  var file = input.files[0]; input.value = '';
  if(!file) return;
  if(!window.XLSX){ flash('Librería Excel no disponible','#ef4444'); return; }

  flash('Leyendo archivo...','#6366f1');
  var reader = new FileReader();
  reader.onload = async function(e){
    try{
      var wb = XLSX.read(e.target.result, {type:'array'});

      // Leer hojas relevantes (Ejercicios, Entregas, Actividades)
      // Se omiten Alumnos y Accesos para no sobreescribir datos de sesión activa
      var hojas = {
        ejercicios_realizados: XLSX.utils.sheet_to_json(wb.Sheets['Ejercicios']||{}),
        entregas:              XLSX.utils.sheet_to_json(wb.Sheets['Entregas']||{}),
        actividades:           XLSX.utils.sheet_to_json(wb.Sheets['Actividades']||{})
      };

      var totalEj  = hojas.ejercicios_realizados.length;
      var totalEnt = hojas.entregas.length;
      var totalAct = hojas.actividades.length;

      if(!totalEj && !totalEnt && !totalAct){
        flash('El archivo no contiene datos reconocibles','#ef4444'); return;
      }

      // Modal de confirmación con resumen
      var overlay = document.createElement('div');
      overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem';
      overlay.innerHTML=
        '<div style="background:#fff;border-radius:14px;padding:1.5rem;max-width:440px;width:100%;box-shadow:0 8px 40px rgba(0,0,0,.3)">'
        +'<div style="font-weight:700;font-size:1rem;color:var(--navy);margin-bottom:.5rem">📥 Restaurar copia de seguridad</div>'
        +'<div style="font-size:13px;color:var(--muted);margin-bottom:1.2rem">Se restaurarán los siguientes datos. Los registros existentes con el mismo ID se actualizarán.</div>'
        +'<div style="background:var(--surface2,#f9f9f9);border-radius:10px;padding:12px;margin-bottom:1.2rem;display:flex;flex-direction:column;gap:8px">'
        +'<div style="display:flex;justify-content:space-between;font-size:13px"><span>🏃 Ejercicios realizados</span><strong>'+totalEj+'</strong></div>'
        +'<div style="display:flex;justify-content:space-between;font-size:13px"><span>📋 Entregas</span><strong>'+totalEnt+'</strong></div>'
        +'<div style="display:flex;justify-content:space-between;font-size:13px"><span>🎯 Actividades</span><strong>'+totalAct+'</strong></div>'
        +'</div>'
        +'<div style="background:rgba(239,68,68,.07);border:1px solid rgba(239,68,68,.2);border-radius:8px;padding:10px;font-size:12px;color:#b91c1c;margin-bottom:1.2rem">'
        +'⚠️ Esta acción no puede deshacerse. Los datos actuales con el mismo ID serán sobreescritos.'
        +'</div>'
        +'<div style="display:flex;gap:8px;justify-content:flex-end">'
        +'<button id="rst-cancel" class="btn btn-g">Cancelar</button>'
        +'<button id="rst-ok" class="btn" style="background:#1a2744;color:#fff">Restaurar ahora</button>'
        +'</div></div>';
      document.body.appendChild(overlay);
      overlay.querySelector('#rst-cancel').onclick = function(){ document.body.removeChild(overlay); };
      overlay.onclick = function(ev){ if(ev.target===overlay) document.body.removeChild(overlay); };

      overlay.querySelector('#rst-ok').onclick = async function(){
        var btn = this; btn.disabled=true; btn.textContent='Restaurando…';
        try{
          var errores = [];
          // Upsert por lotes para no superar límites de Supabase
          async function upsertLotes(tabla, filas){
            var lote = 200;
            for(var i=0; i<filas.length; i+=lote){
              var {error} = await supa.from(tabla).upsert(filas.slice(i,i+lote), {onConflict:'id'});
              if(error) errores.push(tabla+': '+error.message);
            }
          }
          if(totalEj)  await upsertLotes('ejercicios_realizados', hojas.ejercicios_realizados);
          if(totalEnt) await upsertLotes('entregas',              hojas.entregas);
          if(totalAct) await upsertLotes('actividades',           hojas.actividades);

          document.body.removeChild(overlay);
          if(errores.length){
            flash('Restaurado con errores: '+errores[0],'#f59e0b');
          } else {
            flash('✅ Backup restaurado correctamente','#16a34a');
          }
        }catch(err){ flash('Error al restaurar: '+err.message,'#ef4444'); btn.disabled=false; btn.textContent='Restaurar ahora'; }
      };
    }catch(err){ flash('Error leyendo el archivo: '+err.message,'#ef4444'); }
  };
  reader.readAsArrayBuffer(file);
}

async function confirmarLimpiezaPlataforma(){
  if(!confirm('⚠️ LIMPIEZA DE PLATAFORMA\n\n¿Borrar TODO el progreso de los alumnos?\n\n• Ejercicios realizados → eliminados\n• Entregas → eliminadas\n• Usuarios y actividades → conservados\n\nHaz primero la copia de seguridad.\n\nPulsa OK para continuar.')) return;
  var curso = getCursoActual();
  var txt = prompt('Para confirmar, escribe el año de curso actual (' + curso + '):');
  if(txt !== curso){ flash('Limpieza cancelada','#ef4444'); return; }
  flash('Limpiando plataforma...','#6366f1');
  try{
    await Promise.all([
      supa.from('ejercicios_realizados').delete().neq('id','00000000-0000-0000-0000-000000000000'),
      supa.from('entregas').delete().neq('id','00000000-0000-0000-0000-000000000000')
    ]);
    flash('✅ Plataforma limpiada. Lista para el curso ' + curso,'#16a34a');
  }catch(e){ flash('Error: '+e.message,'#ef4444'); }
}

async function subirFotoAlumno(input){
  var file = input.files[0]; input.value='';
  if(!file) return;
  if(file.size > 2*1024*1024){ flash('La foto no puede superar 2 MB','#ef4444'); return; }
  flash('Subiendo foto...','#6366f1');
  try{
    var ext = file.name.split('.').pop();
    var path = USUARIO_ACTUAL.id + '/avatar.' + ext;
    var {error:upErr} = await supa.storage.from('avatares').upload(path, file, {upsert:true, contentType:file.type});
    if(upErr) throw upErr;
    var {data:urlData} = supa.storage.from('avatares').getPublicUrl(path);
    var pub = urlData.publicUrl;
    await supa.from('perfiles').update({avatar_url:pub}).eq('id',USUARIO_ACTUAL.id);
    USUARIO_ACTUAL.avatar_url = pub;
    var av = document.getElementById('prf-alu-avatar');
    if(av) av.innerHTML = '<img src="'+pub+'" style="width:100%;height:100%;object-fit:cover">';
    var sa = document.getElementById('u-avatar');
    if(sa) sa.innerHTML = '<img src="'+pub+'" style="width:100%;height:100%;border-radius:50%;object-fit:cover">';
    flash('✅ Foto actualizada','#16a34a');
  }catch(e){ flash('Error al subir: '+(e.message||e),'#ef4444'); }
}

window.cambiarPasswordPerfil         = cambiarPasswordPerfil;
window.loginShowTab                  = loginShowTab;
window.loginConEmail                 = loginConEmail;
window.registrarConEmail             = registrarConEmail;
window.renderPerfil                  = renderPerfil;
window.guardarNombrePerfil           = guardarNombrePerfil;
window.guardarAnoCurso               = guardarAnoCurso;
window.cambiarRolUsuario             = cambiarRolUsuario;
window.adminEditarPerfil             = adminEditarPerfil;
window.eliminarDatosUsuario          = eliminarDatosUsuario;
window.generarBackupPlataforma       = generarBackupPlataforma;
window.restaurarBackupPlataforma     = restaurarBackupPlataforma;
window.confirmarLimpiezaPlataforma   = confirmarLimpiezaPlataforma;
window.subirFotoAlumno               = subirFotoAlumno;
