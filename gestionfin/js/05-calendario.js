// ── CALENDARIO ─────────────────────────────────────────
// ══════════════════════════════════════════════════════
//  CALENDARIO — Mes + Semana + Lista
// ══════════════════════════════════════════════════════
var CAL = {
  vista: 'mes',   // 'mes' | 'semana' | 'lista'
  hoy: new Date(),
  cursor: new Date()  // mes/semana navegado
};

var TIPO_COLORS = {
  examen:    {bg:'#fef3c7',border:'#f59e0b',text:'#92400e',dot:'#f59e0b'},
  entrega:   {bg:'#dcfce7',border:'#22c55e',text:'#166534',dot:'#22c55e'},
  clase:     {bg:'#dbeafe',border:'#3b82f6',text:'#1e40af',dot:'#3b82f6'},
  festivo:   {bg:'#fee2e2',border:'#ef4444',text:'#991b1b',dot:'#ef4444'},
  actividad: {bg:'#f3e8ff',border:'#a855f7',text:'#6b21a8',dot:'#a855f7'},
  otro:      {bg:'#f1f5f9',border:'#94a3b8',text:'#475569',dot:'#94a3b8'}
};

function getEventos(){
  // Eventos manuales
  var evs = DB.eventos.map(function(e){ return {id:e.id,titulo:e.titulo,fecha:e.fecha,hora:e.hora||'',tipo:e.tipo||'otro',desc:e.desc||'',manual:true}; });
  // Actividades evaluables con fecha
  UNIDADES.forEach(function(u){
    (ACT_EVAL[u.id]||[]).forEach(function(ae){
      if(ae.fecha){
        evs.push({id:'ae_'+ae.id,titulo:ae.titulo,fecha:ae.fecha,hora:'',tipo:'entrega',
          desc:'B'+u.n+' · '+u.titulo+' · '+ae.tipo+(ae.peso?' ('+ae.peso+'%)':''),
          manual:false, aeId:ae.id, udId:u.id});
      }
    });
  });
  return evs.sort(function(a,b){ return a.fecha.localeCompare(b.fecha); });
}

function renderCalendario(){
  var root = document.getElementById('cal-root');
  if(!root) return;
  root.innerHTML='';

  // ── Cabecera ─────────────────────────────────────────
  var ph = document.createElement('div'); ph.className='ph';
  var phLeft=document.createElement('div');
  phLeft.innerHTML='<h1 class="pt">Calendario</h1>'+
    '<p class="ps">Planificación de clases, exámenes y entregas · Gestión Financiera</p>';
  var phRight=document.createElement('div'); phRight.style.cssText='display:flex;gap:8px;align-items:center';
  if(ROL==='profesor'){
    var btnNew=document.createElement('button'); btnNew.className='btn btn-p';
    btnNew.innerHTML='+ Evento'; btnNew.onclick=abrirModalEvento;
    phRight.appendChild(btnNew);
  }
  ph.appendChild(phLeft); ph.appendChild(phRight);
  root.appendChild(ph);

  // ── Selector de vista ─────────────────────────────────
  var vistaBar=document.createElement('div');
  vistaBar.style.cssText='display:flex;gap:4px;background:var(--surface2);border-radius:10px;padding:4px;width:fit-content;margin-bottom:16px';
  [{id:'mes',label:'📅 Mes'},{id:'semana',label:'📆 Semana'},{id:'lista',label:'📋 Lista'}].forEach(function(v){
    var btn=document.createElement('button');
    btn.style.cssText='padding:6px 14px;border-radius:7px;border:none;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;'+
      (CAL.vista===v.id?'background:var(--navy);color:#fff;':'background:transparent;color:var(--muted);');
    btn.textContent=v.label;
    btn.onclick=(function(vid){ return function(){
      CAL.vista=vid; renderCalendario();
    }; })(v.id);
    vistaBar.appendChild(btn);
  });
  root.appendChild(vistaBar);

  if(CAL.vista==='mes') renderMes(root);
  else if(CAL.vista==='semana') renderSemana(root);
  else renderLista(root);
}

function navCalendario(delta){
  if(CAL.vista==='mes'){
    CAL.cursor=new Date(CAL.cursor.getFullYear(), CAL.cursor.getMonth()+delta, 1);
  } else if(CAL.vista==='semana'){
    CAL.cursor=new Date(CAL.cursor.getTime()+delta*7*24*3600*1000);
  }
  renderCalendario();
}

function mkNavBar(titulo){
  var nav=document.createElement('div');
  nav.style.cssText='display:flex;align-items:center;gap:12px;margin-bottom:12px';
  var btnPrev=document.createElement('button'); btnPrev.className='btn btn-g btn-sm'; btnPrev.textContent='◀';
  btnPrev.onclick=function(){ navCalendario(-1); };
  var titEl=document.createElement('div'); titEl.style.cssText='flex:1;text-align:center;font-size:16px;font-weight:700;color:var(--navy)';
  titEl.textContent=titulo;
  var btnNext=document.createElement('button'); btnNext.className='btn btn-g btn-sm'; btnNext.textContent='▶';
  btnNext.onclick=function(){ navCalendario(1); };
  var btnHoy=document.createElement('button'); btnHoy.className='btn btn-g btn-sm'; btnHoy.textContent='Hoy';
  btnHoy.onclick=function(){ CAL.cursor=new Date(); renderCalendario(); };
  nav.appendChild(btnPrev); nav.appendChild(titEl); nav.appendChild(btnNext); nav.appendChild(btnHoy);
  return nav;
}

// ── VISTA MES ─────────────────────────────────────────
function renderMes(root){
  var y=CAL.cursor.getFullYear(), m=CAL.cursor.getMonth();
  var meses=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  root.appendChild(mkNavBar(meses[m]+' '+y));

  var eventos=getEventos();
  var grid=document.createElement('div');
  grid.style.cssText='display:grid;grid-template-columns:repeat(7,1fr);gap:1px;background:var(--border);border:1px solid var(--border);border-radius:var(--rl);overflow:hidden';

  // Cabecera días
  ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].forEach(function(d){
    var dh=document.createElement('div');
    dh.style.cssText='padding:8px 4px;text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);background:var(--surface2)';
    dh.textContent=d; grid.appendChild(dh);
  });

  // Primer día del mes (lunes=0)
  var firstDay=new Date(y,m,1).getDay(); // 0=dom
  var startOffset=(firstDay===0)?6:firstDay-1;
  var daysInMonth=new Date(y,m+1,0).getDate();
  var prevDays=new Date(y,m,0).getDate();

  for(var cell=0; cell<42; cell++){
    var day, isCurrentMonth=true, isFuture=false;
    if(cell<startOffset){ day=prevDays-startOffset+cell+1; isCurrentMonth=false; }
    else if(cell-startOffset>=daysInMonth){ day=cell-startOffset-daysInMonth+1; isCurrentMonth=false; }
    else { day=cell-startOffset+1; }

    var dateStr=y+'-'+String(isCurrentMonth?m+1:(cell<startOffset?(m===0?12:m):(m+2>12?1:m+2))).padStart(2,'0')+'-'+String(day).padStart(2,'0');
    var esHoy=isCurrentMonth&&day===CAL.hoy.getDate()&&m===CAL.hoy.getMonth()&&y===CAL.hoy.getFullYear();
    var esDomingo=(cell%7===6);

    var cellEl=document.createElement('div');
    cellEl.style.cssText='background:'+(isCurrentMonth?'var(--surface)':'var(--surface2)')+';padding:6px 5px;min-height:80px;cursor:pointer;transition:background .1s';
    cellEl.onmouseenter=function(){ this.style.background='var(--surface2)'; };
    cellEl.onmouseleave=function(){ this.style.background=isCurrentMonth?'var(--surface)':'#f8f9fb'; };
    if(ROL==='profesor') cellEl.onclick=(function(ds){ return function(){ abrirModalEvento(ds); }; })(dateStr);

    var dayNum=document.createElement('div');
    dayNum.style.cssText='font-size:13px;font-weight:'+(esHoy?'800':'500')+';color:'+(esHoy?'#fff':(esDomingo?'var(--red)':isCurrentMonth?'var(--text)':'var(--muted)'))+
      ';width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:3px;'+
      (esHoy?'background:var(--navy);':'');
    dayNum.textContent=day;
    cellEl.appendChild(dayNum);

    // Eventos del día
    var dayEvs=eventos.filter(function(e){ return e.fecha===dateStr; });
    dayEvs.slice(0,3).forEach(function(ev){
      var col=TIPO_COLORS[ev.tipo]||TIPO_COLORS.otro;
      var chip=document.createElement('div');
      chip.style.cssText='font-size:10px;padding:2px 5px;border-radius:4px;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:'+col.bg+';color:'+col.text+';border-left:2px solid '+col.border+';cursor:pointer';
      chip.textContent=(ev.hora?ev.hora.slice(0,5)+' ':'')+ev.titulo;
      chip.title=ev.titulo+(ev.desc?'\n'+ev.desc:'');
      chip.onclick=function(e){ e.stopPropagation(); mostrarDetalleEvento(ev); };
      cellEl.appendChild(chip);
    });
    if(dayEvs.length>3){
      var more=document.createElement('div'); more.style.cssText='font-size:10px;color:var(--muted);padding-left:3px';
      more.textContent='+'+( dayEvs.length-3)+' más'; cellEl.appendChild(more);
    }
    grid.appendChild(cellEl);
  }
  root.appendChild(grid);
  renderLeyenda(root);
}

// ── VISTA SEMANA ──────────────────────────────────────
function renderSemana(root){
  // Lunes de la semana del cursor
  var d=new Date(CAL.cursor);
  var dow=d.getDay(); var diff=dow===0?-6:1-dow;
  d.setDate(d.getDate()+diff);
  var lunes=new Date(d);
  var dias=[]; for(var i=0;i<7;i++){ var dd=new Date(lunes); dd.setDate(lunes.getDate()+i); dias.push(dd); }
  var meses=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  var titulo=dias[0].getDate()+' '+meses[dias[0].getMonth()]+' – '+dias[6].getDate()+' '+meses[dias[6].getMonth()]+' '+dias[6].getFullYear();
  root.appendChild(mkNavBar(titulo));

  var eventos=getEventos();
  var grid=document.createElement('div');
  grid.style.cssText='display:grid;grid-template-columns:repeat(7,1fr);gap:8px';

  var diaNombres=['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
  dias.forEach(function(dia,i){
    var dateStr=dia.getFullYear()+'-'+String(dia.getMonth()+1).padStart(2,'0')+'-'+String(dia.getDate()).padStart(2,'0');
    var esHoy=dia.toDateString()===CAL.hoy.toDateString();
    var esFinde=(i>=5);
    var col=document.createElement('div');
    col.style.cssText='border:1px solid var(--border);border-radius:var(--r);overflow:hidden'+(esHoy?';border-color:var(--navy);':'');

    var colHdr=document.createElement('div');
    colHdr.style.cssText='padding:8px;text-align:center;background:'+(esHoy?'var(--navy)':'var(--surface2)')+';border-bottom:1px solid var(--border)';
    colHdr.innerHTML='<div style="font-size:11px;font-weight:700;color:'+(esHoy?'rgba(255,255,255,.6)':'var(--muted)')+'">'+diaNombres[i]+'</div>'+
      '<div style="font-size:18px;font-weight:800;color:'+(esHoy?'var(--gold-light)':esFinde?'var(--red)':'var(--navy)')+'">'+dia.getDate()+'</div>';
    col.appendChild(colHdr);

    var colBody=document.createElement('div'); colBody.style.cssText='padding:6px;min-height:120px';
    var dayEvs=eventos.filter(function(e){ return e.fecha===dateStr; });
    if(!dayEvs.length){
      var noEv=document.createElement('div'); noEv.style.cssText='font-size:11px;color:var(--dim);text-align:center;padding:10px 0'; noEv.textContent='—';
      colBody.appendChild(noEv);
    }
    dayEvs.forEach(function(ev){
      var col2=TIPO_COLORS[ev.tipo]||TIPO_COLORS.otro;
      var chip=document.createElement('div');
      chip.style.cssText='font-size:11px;padding:4px 6px;border-radius:5px;margin-bottom:4px;background:'+col2.bg+';color:'+col2.text+';border-left:3px solid '+col2.border+';cursor:pointer;line-height:1.3';
      chip.innerHTML=(ev.hora?'<div style="font-size:10px;font-weight:700;margin-bottom:1px">'+ev.hora.slice(0,5)+'</div>':'')+
        '<div style="font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+ev.titulo+'</div>';
      chip.onclick=function(){ mostrarDetalleEvento(ev); };
      colBody.appendChild(chip);
    });
    if(ROL==='profesor'){
      var btnAdd2=document.createElement('button'); btnAdd2.className='btn btn-g btn-sm';
      btnAdd2.style.cssText='width:100%;margin-top:4px;font-size:10px;opacity:.6';
      btnAdd2.textContent='+ Evento'; btnAdd2.onclick=(function(ds){ return function(){ abrirModalEvento(ds); }; })(dateStr);
      colBody.appendChild(btnAdd2);
    }
    col.appendChild(colBody);
    grid.appendChild(col);
  });
  root.appendChild(grid);
  renderLeyenda(root);
}

// ── VISTA LISTA ───────────────────────────────────────
function renderLista(root){
  var navL=document.createElement('div'); navL.style.cssText='display:flex;align-items:center;gap:8px;margin-bottom:12px';
  var titL=document.createElement('div'); titL.style.cssText='font-size:16px;font-weight:700;color:var(--navy);flex:1';
  titL.textContent='Próximos eventos';
  navL.appendChild(titL);
  root.appendChild(navL);

  var eventos=getEventos();
  var hoyStr=CAL.hoy.toISOString().slice(0,10);

  // Separar: pasados, hoy, futuros
  var pasados=eventos.filter(function(e){ return e.fecha<hoyStr; });
  var hoyEvs=eventos.filter(function(e){ return e.fecha===hoyStr; });
  var futuros=eventos.filter(function(e){ return e.fecha>hoyStr; });

  function mkSeccion(titulo, evs, collapsed){
    if(!evs.length) return;
    var sec=document.createElement('div'); sec.style.marginBottom='16px';
    var hdr=document.createElement('div');
    hdr.style.cssText='display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--surface2);border-radius:var(--r);cursor:pointer;margin-bottom:6px';
    hdr.innerHTML='<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);flex:1">'+titulo+' ('+evs.length+')</div>'+
      '<span style="font-size:10px;color:var(--muted)">'+(!collapsed?'▲':'▼')+'</span>';
    sec.appendChild(hdr);
    var body=document.createElement('div');
    body.style.display=collapsed?'none':'block';
    hdr.onclick=function(){ body.style.display=body.style.display==='none'?'block':'none'; };

    evs.forEach(function(ev){
      var col2=TIPO_COLORS[ev.tipo]||TIPO_COLORS.otro;
      var d=new Date(ev.fecha+'T12:00:00');
      var meses=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
      var dias=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
      var card=document.createElement('div');
      card.style.cssText='display:flex;align-items:center;gap:14px;padding:10px 12px;border:1px solid var(--border);border-radius:var(--r);margin-bottom:6px;border-left:4px solid '+col2.border+';background:var(--surface);cursor:pointer;transition:background .15s';
      card.onmouseenter=function(){ this.style.background='var(--surface2)'; };
      card.onmouseleave=function(){ this.style.background='var(--surface)'; };
      card.onclick=function(){ mostrarDetalleEvento(ev); };
      var dateBox=document.createElement('div');
      dateBox.style.cssText='text-align:center;min-width:44px';
      dateBox.innerHTML='<div style="font-size:10px;font-weight:600;color:var(--muted);text-transform:uppercase">'+dias[d.getDay()]+'</div>'+
        '<div style="font-family:serif;font-size:22px;font-weight:800;line-height:1;color:'+col2.text+'">'+d.getDate()+'</div>'+
        '<div style="font-size:10px;color:var(--muted)">'+meses[d.getMonth()]+'</div>';
      var sep=document.createElement('div'); sep.style.cssText='width:1px;height:40px;background:var(--border);flex-shrink:0';
      var info=document.createElement('div'); info.style.flex='1';
      info.innerHTML='<div style="font-size:14px;font-weight:600">'+ev.titulo+'</div>'+
        (ev.hora?'<div style="font-size:12px;color:var(--muted);margin-top:1px">🕐 '+ev.hora+'</div>':'')+
        (ev.desc?'<div style="font-size:12px;color:var(--muted);margin-top:1px">'+ev.desc+'</div>':'');
      var typeBadge=document.createElement('span'); typeBadge.className='badge';
      typeBadge.style.cssText='background:'+col2.bg+';color:'+col2.text+';border:1px solid '+col2.border;
      typeBadge.textContent=ev.tipo;
      var actions=document.createElement('div'); actions.style.cssText='display:flex;gap:4px;flex-shrink:0';
      actions.appendChild(typeBadge);
      if(ROL==='profesor' && ev.manual){
        var btnDel2=document.createElement('button'); btnDel2.className='btn btn-d btn-sm'; btnDel2.style.fontSize='11px'; btnDel2.textContent='✕';
        btnDel2.onclick=(function(eid){ return function(e){ e.stopPropagation(); borrarEvento(eid); }; })(ev.id);
        actions.appendChild(btnDel2);
      }
      card.appendChild(dateBox); card.appendChild(sep); card.appendChild(info); card.appendChild(actions);
      body.appendChild(card);
    });
    sec.appendChild(body);
    root.appendChild(sec);
  }

  if(!eventos.length){
    var empty=document.createElement('div'); empty.className='card';
    empty.innerHTML='<p style="text-align:center;padding:2rem;color:var(--muted)">No hay eventos.</p>';
    root.appendChild(empty); return;
  }
  if(hoyEvs.length) mkSeccion('📍 Hoy', hoyEvs, false);
  mkSeccion('📅 Próximos', futuros.slice(0,20), false);
  mkSeccion('📁 Pasados', pasados.slice(-10).reverse(), true);
  renderLeyenda(root);
}

// ── Leyenda ───────────────────────────────────────────
function renderLeyenda(root){
  var leg=document.createElement('div'); leg.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin-top:12px';
  Object.keys(TIPO_COLORS).forEach(function(t){
    var c=TIPO_COLORS[t];
    var s=document.createElement('span'); s.style.cssText='display:flex;align-items:center;gap:4px;font-size:11px;color:'+c.text;
    s.innerHTML='<span style="width:8px;height:8px;border-radius:50%;background:'+c.dot+';flex-shrink:0"></span>'+t;
    leg.appendChild(s);
  });
  root.appendChild(leg);
}

// ── Modal detalle evento ──────────────────────────────
function mostrarDetalleEvento(ev){
  var col2=TIPO_COLORS[ev.tipo]||TIPO_COLORS.otro;
  var d=new Date(ev.fecha+'T12:00:00');
  var meses=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  abrirModal(ev.titulo,
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">'+
      '<span class="badge" style="background:'+col2.bg+';color:'+col2.text+';border:1px solid '+col2.border+'">'+ev.tipo+'</span>'+
      '<span style="font-size:13px;color:var(--muted)">'+d.getDate()+' de '+meses[d.getMonth()]+' '+d.getFullYear()+(ev.hora?' · 🕐 '+ev.hora:'')+'</span>'+
    '</div>'+
    (ev.desc?'<div style="font-size:13.5px;line-height:1.7;color:var(--muted)">'+ev.desc+'</div>':'<div style="color:var(--dim);font-size:13px">Sin descripción.</div>'),
    (ROL==='profesor'&&ev.manual?'<button class="btn btn-d btn-sm" onclick="borrarEvento(\''+ev.id+'\');cerrarModal()">🗑 Eliminar</button>':'')+
    '<button class="btn btn-g" onclick="cerrarModal()">Cerrar</button>'
  );
}

// ── Modal nuevo evento ────────────────────────────────
function abrirModalEvento(fechaPresel){
  abrirModal('➕ Nuevo evento',
    '<div class="fg"><label class="fl">Título <span style="color:var(--red)">*</span></label>'+
    '<input class="fi" id="ev-titulo" placeholder="Ej: Examen Bloque 1"></div>'+
    '<div class="g2">'+
      '<div class="fg"><label class="fl">Tipo</label>'+
      '<select class="fs" id="ev-tipo">'+
        '<option value="clase">🏫 Clase</option>'+
        '<option value="examen">📋 Examen</option>'+
        '<option value="entrega">📬 Entrega</option>'+
        '<option value="festivo">🔴 Festivo</option>'+
        '<option value="otro">📌 Otro</option>'+
      '</select></div>'+
      '<div class="fg"><label class="fl">Bloque</label>'+
      '<select class="fs" id="ev-ud">'+
        '<option value="">— General —</option>'+
        UNIDADES.map(function(u){ return '<option value="'+u.id+'">B'+u.n+' · '+u.titulo.slice(0,20)+'</option>'; }).join('')+
      '</select></div>'+
    '</div>'+
    '<div class="g2">'+
      '<div class="fg"><label class="fl">Fecha <span style="color:var(--red)">*</span></label>'+
      '<input class="fi" id="ev-fecha" type="date" value="'+(typeof fechaPresel==='string'?fechaPresel:'')+'"></div>'+
      '<div class="fg"><label class="fl">Hora</label>'+
      '<input class="fi" id="ev-hora" type="time"></div>'+
    '</div>'+
    '<div class="fg"><label class="fl">Descripción</label>'+
    '<textarea class="fta" id="ev-desc" rows="2" placeholder="Detalles del evento…"></textarea></div>',
    '<button class="btn btn-g" onclick="cerrarModal()">Cancelar</button>'+
    '<button class="btn btn-p" onclick="guardarEvento()">Guardar evento</button>'
  );
  document.getElementById('modal').querySelector('.modal').style.maxWidth='560px';
}

function guardarEvento(){
  var t=(document.getElementById('ev-titulo')||{value:''}).value.trim();
  var f=(document.getElementById('ev-fecha')||{value:''}).value;
  if(!t){ flash('Introduce un título','#dc2626'); return; }
  if(!f){ flash('Selecciona una fecha','#dc2626'); return; }
  var ud=(document.getElementById('ev-ud')||{value:''}).value;
  DB.eventos.push({id:uid(), titulo:t, fecha:f,
    hora:(document.getElementById('ev-hora')||{value:''}).value,
    tipo:(document.getElementById('ev-tipo')||{value:'otro'}).value,
    desc:(document.getElementById('ev-desc')||{value:''}).value.trim(),
    udId:ud||null
  });
  save(); cerrarModal(); renderCalendario(); renderDashboard();
  flash('Evento guardado','#16a34a');
}

function borrarEvento(id){
  if(!confirm('¿Eliminar este evento?')) return;
  DB.eventos=DB.eventos.filter(function(e){ return e.id!==id; });
  save(); renderCalendario(); renderDashboard();
}



