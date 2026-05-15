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
  var ls=document.getElementById('loading-screen'); if(ls)ls.style.display='none';
  var li=document.getElementById('login-screen'); if(li)li.style.display='none';
  var as=document.getElementById('app-shell'); if(as)as.style.display='';
}
function mostrarCargando(){
  var ls=document.getElementById('loading-screen'); if(ls)ls.style.display='flex';
  var li=document.getElementById('login-screen'); if(li)li.style.display='none';
  var as=document.getElementById('app-shell'); if(as)as.style.display='none';
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
        setTimeout(function(){ if(window.cargarConfigProfesor) cargarConfigProfesor(); }, 800);
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

  // Ejercicios por simulador
  var porSim={};(ej||[]).forEach(function(e){if(!porSim[e.simulador_id])porSim[e.simulador_id]=[];porSim[e.simulador_id].push(e);});
  html+='<div class="card" style="margin-bottom:1rem"><div class="card-header"><div class="card-title">📊 Ejercicios por simulador</div></div>'+
    '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:13px">'+
    '<thead><tr style="background:#f9f8f5;border-bottom:2px solid #e2ddd4">'+
    '<th style="padding:10px 12px;text-align:left;font-weight:700;color:#1a2744">Simulador</th>'+
    '<th style="padding:10px 8px;text-align:center;font-weight:700;color:#1a2744">Ejers.</th>'+
    '<th style="padding:10px 8px;text-align:center;font-weight:700;color:#1a2744">Media</th>'+
    '<th style="padding:10px 8px;text-align:center;font-weight:700;color:#1a2744">Nivel</th>'+
    '<th style="padding:10px 8px;text-align:center;font-weight:700;color:#1a2744">Último</th>'+
    '</tr></thead><tbody>';

  if(!Object.keys(porSim).length){
    html+='<tr><td colspan="5" style="padding:1.5rem;text-align:center;color:#9ca3af">Sin ejercicios.</td></tr>';
  } else {
    Object.keys(porSim).forEach(function(sid){
      var lista=porSim[sid];var s=sm[sid]||{nombre:'—'};
      var med2=Math.round(lista.reduce(function(a,e){return a+(e.puntuacion||0);},0)/lista.length);
      var mc2=med2>=70?'#16a34a':med2>=50?'#d97706':'#dc2626';
      html+='<tr style="border-bottom:1px solid #f2f0eb">'+
        '<td style="padding:8px 12px;font-weight:600">'+s.nombre+'</td>'+
        '<td style="padding:8px;text-align:center">'+lista.length+'</td>'+
        '<td style="padding:8px;text-align:center;font-weight:700;color:'+mc2+'">'+med2+'%</td>'+
        '<td style="padding:8px;text-align:center;font-size:12px">'+lista[0].nivel+'</td>'+
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
