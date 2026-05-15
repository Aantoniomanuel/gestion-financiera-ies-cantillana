
// ── DASHBOARD ──────────────────────────────────────────
function renderDashboard(){
  var hora = new Date().getHours();
  var saludo = hora < 13 ? 'Buenos días' : hora < 20 ? 'Buenas tardes' : 'Buenas noches';
  document.getElementById('dash-saludo').textContent = saludo+(ROL==='profesor'?', Profesor':''+(typeof USUARIO_ACTUAL!=='undefined'&&USUARIO_ACTUAL?', '+(USUARIO_ACTUAL.nombre||USUARIO_ACTUAL.email.split('@')[0]):''))+'  —  Gestión Financiera · Curso 26-27';
  var elAct = document.getElementById('dash-act'); if(elAct) elAct.textContent = DB.ejercicios.length;
  var elAlum = document.getElementById('dash-alum'); if(elAlum) elAlum.textContent = DB.alumnos.length;

  // Mostrar/ocultar secciones según rol
  var resumen = document.getElementById('dash-resumen-alumno');
  var stats = document.getElementById('dash-stats');
  if(ROL === 'alumno'){
    if(stats) stats.style.display = 'none';
    if(resumen) resumen.style.display = 'grid';
    renderProgresoAlumno();
  } else {
    if(stats) stats.style.display = '';
    if(resumen) resumen.style.display = 'none';
  }

  var udsHtml = UNIDADES.map(function(u){
    return '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">'+
      '<div class="ud-num">'+u.n+'</div>'+
      '<div style="flex:1"><div style="font-size:13px;font-weight:500">'+u.titulo+'</div>'+
      '<div style="font-size:11px;color:var(--muted);margin-top:2px">'+u.horas+'h</div></div>'+
      '<div><div class="prog-w"><div class="prog-f" style="width:'+u.prog+'%"></div></div>'+
      '<div style="font-size:10px;color:var(--muted);text-align:right;margin-top:2px">'+u.prog+'%</div></div>'+
    '</div>';
  }).join('');
  document.getElementById('dash-uds').innerHTML = udsHtml;
  var prox = DB.eventos.filter(function(e){return new Date(e.fecha)>=new Date();}).sort(function(a,b){return new Date(a.fecha)-new Date(b.fecha);}).slice(0,4);
  document.getElementById('dash-eventos').innerHTML = prox.length ? prox.map(function(ev){
    var d=new Date(ev.fecha); var tipos={examen:'b-amber',entrega:'b-green',clase:'b-blue',festivo:'b-red'};
    return '<div style="display:flex;align-items:flex-start;gap:10px;padding:9px 0;border-bottom:1px solid var(--border)">'+
      '<div style="text-align:center;min-width:32px"><div style="font-family:\'Playfair Display\',serif;font-size:18px;font-weight:700;line-height:1">'+d.getDate()+'</div>'+
      '<div style="font-size:10px;color:var(--muted);text-transform:uppercase">'+['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][d.getMonth()]+'</div></div>'+
      '<div style="flex:1"><div style="font-size:13px;font-weight:500">'+ev.titulo+'</div>'+
      (ev.desc?'<div style="font-size:12px;color:var(--muted);margin-top:2px">'+ev.desc+'</div>':'')+
      '</div><span class="badge '+(tipos[ev.tipo]||'b-gray')+'">'+ev.tipo+'</span></div>';
  }).join('') : '<p style="color:var(--muted);font-size:13px">Sin eventos próximos</p>';
}

// ── PROGRESO ALUMNO ──────────────────────────────────────
async function renderProgresoAlumno(){
  if(!USUARIO_ACTUAL) return;
  var draEl = document.getElementById('dash-resumen-alumno');
  if(!draEl || draEl.style.display === 'none') return;

  try{
    // Ejercicios completados por simulador
    var [{data:ejercicios},{data:entregas},{data:actsActivas}] = await Promise.all([
      supa.from('ejercicios_realizados').select('simulador_id,nivel,puntuacion').eq('alumno_id',USUARIO_ACTUAL.id).eq('completado',true),
      supa.from('entregas').select('actividad_id,entregada_at,calificacion').eq('alumno_id',USUARIO_ACTUAL.id),
      supa.from('actividades').select('id,simulador_id,titulo').eq('activa',true)
    ]);
    ejercicios = ejercicios||[]; entregas = entregas||[]; actsActivas = actsActivas||[];

    var entregadas = entregas.filter(function(e){ return e.entregada_at; });
    var totalSims = ejercicios.length;
    var totalEntregas = entregadas.length;

    // Progreso por bloque: se basa en ejercicios realizados del simulador de ese bloque
    // Mapeamos simuladores a unidades por nombre/código
    var simIds = {}; // simulador_id -> set de ejercicios
    ejercicios.forEach(function(e){
      if(!simIds[e.simulador_id]) simIds[e.simulador_id] = [];
      simIds[e.simulador_id].push(e);
    });

    // Calcular progreso global basado en actividades entregadas vs activas
    var totalActsAlumno = actsActivas.length;
    var entregaMap = {};
    entregas.forEach(function(e){ entregaMap[e.actividad_id] = e; });
    var completadasCount = actsActivas.filter(function(a){ var e=entregaMap[a.id]; return e&&e.entregada_at; }).length;
    var pctGlobal = totalActsAlumno > 0 ? Math.round(completadasCount/totalActsAlumno*100) : 0;

    // Actualizar tarjetas resumen
    var elSims = document.getElementById('dra-sims'); if(elSims) elSims.textContent = totalSims;
    var elEntr = document.getElementById('dra-entregas'); if(elEntr) elEntr.textContent = totalEntregas;
    var elPct  = document.getElementById('dra-pct'); if(elPct) elPct.textContent = pctGlobal+'%';
    var elRacha = document.getElementById('dra-racha');
    if(elRacha){
      var ultima = entregas.filter(function(e){return e.entregada_at;}).sort(function(a,b){return new Date(b.entregada_at)-new Date(a.entregada_at);});
      if(ultima.length){
        var d = new Date(ultima[0].entregada_at);
        elRacha.textContent = d.getDate()+'/'+(d.getMonth()+1);
      } else {
        elRacha.textContent = '—';
      }
    }

    // Progreso por bloques — mapa simulador → bloque
    var SIM_BLOQUE = {
      'sim-prestamos':'ud2','sim-pb':'ud2','sim-seguros':'ud3',
      'sim-inversiones':'ud4','sim-bolsa':'ud4','sim-presupuestos':'ud5','sim-aef':'ud5'
    };
    var progPorUD = {};
    UNIDADES.forEach(function(u){ progPorUD[u.id] = {ejs:0, acts:0, actsTotal:0}; });

    // Contar ejercicios por bloque
    var {data:sims} = await supa.from('simuladores').select('id,codigo');
    var simCodigoMap = {};
    (sims||[]).forEach(function(s){ simCodigoMap[s.id] = s.codigo; });
    ejercicios.forEach(function(e){
      var cod = simCodigoMap[e.simulador_id];
      var udId = cod ? SIM_BLOQUE[cod] : null;
      if(udId && progPorUD[udId]) progPorUD[udId].ejs++;
    });

    // Contar actividades por bloque
    actsActivas.forEach(function(a){
      var cod = simCodigoMap[a.simulador_id];
      var udId = cod ? SIM_BLOQUE[cod] : null;
      if(udId && progPorUD[udId]){
        progPorUD[udId].actsTotal++;
        var e = entregaMap[a.id];
        if(e && e.entregada_at) progPorUD[udId].acts++;
      }
    });

    // Render bloques con progreso
    var udsEl = document.getElementById('dash-uds');
    if(!udsEl) return;
    udsEl.innerHTML = UNIDADES.map(function(u){
      var p = progPorUD[u.id]||{ejs:0,acts:0,actsTotal:0};
      // Progreso: si hay actividades, pesa 70%; ejercicios el 30% (cap 10 = 100%)
      var pctActs = p.actsTotal>0 ? (p.acts/p.actsTotal) : 0;
      var pctEjs  = Math.min(p.ejs/5, 1); // 5 ejercicios = 100% en esa componente
      var pct = p.actsTotal>0 ? Math.round(pctActs*70 + pctEjs*30) : Math.round(pctEjs*100);
      var done = pct >= 100;
      return '<div class="prog-bloque">'+
        '<div class="pb-num">'+u.n+'</div>'+
        '<div class="pb-info">'+
          '<div class="pb-titulo">'+u.titulo+'</div>'+
          '<div class="pb-sub">'+(p.ejs||0)+' ejercicios'+(p.actsTotal>0?' · '+p.acts+'/'+p.actsTotal+' actividades':'')+'</div>'+
        '</div>'+
        '<div class="pb-right">'+
          '<div class="pb-pct" style="color:'+(done?'#16a34a':'var(--navy)')+'">'+pct+'%</div>'+
          '<div class="pb-bar"><div class="pb-fill'+(done?' done':'')+'" style="width:'+pct+'%"></div></div>'+
        '</div>'+
      '</div>';
    }).join('');

  } catch(err){
    console.error('[Progreso alumno]', err);
  }
}

