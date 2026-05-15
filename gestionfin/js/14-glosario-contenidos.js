// ── Glosario block ───────────────────────────────────
var ESTRELLAS = { 1:'⭐ Básico', 2:'⭐⭐ Importante', 3:'⭐⭐⭐ Fundamental' };

function renderGlosarioBlock(u){
  var terminos = GLOSARIO_DATA[u.id] || [];
  var card = document.createElement('div'); card.className='card'; card.style.marginBottom='1.25rem';

  // Cabecera
  var hdr = document.createElement('div');
  hdr.style.cssText='display:flex;align-items:center;justify-content:space-between;margin-bottom:10px';
  var tit = document.createElement('h3'); tit.style.cssText='font-size:14px;font-weight:600';
  tit.textContent='📚 Glosario'; hdr.appendChild(tit);
  var btnWrap = document.createElement('div'); btnWrap.style.cssText='display:flex;gap:6px';
  if(ROL==='profesor'){
    var btnP = document.createElement('button'); btnP.className='btn btn-p btn-sm';
    btnP.textContent='+ Añadir término';
    btnP.onclick=(function(uid){ return function(){ abrirModalGlosarioProf(uid); }; })(u.id);
    btnWrap.appendChild(btnP);
  } else {
    var btnA = document.createElement('button'); btnA.className='btn btn-g btn-sm';
    btnA.textContent='✎ Mi aportación';
    btnA.onclick=(function(uid){ return function(){ abrirModalGlosarioAlumno(uid); }; })(u.id);
    btnWrap.appendChild(btnA);
  }
  hdr.appendChild(btnWrap); card.appendChild(hdr);

  if(!terminos.length){
    var empty=document.createElement('p'); empty.style.cssText='font-size:13px;color:var(--muted);text-align:center;padding:1rem 0';
    empty.textContent=ROL==='profesor'?'Sin términos. Pulsa "Añadir término" para crear el primero.':'Sin términos definidos todavía.';
    card.appendChild(empty); return card;
  }

  terminos.forEach(function(t){
    var row = document.createElement('div');
    row.style.cssText='padding:9px 0;border-bottom:1px solid var(--border)';

    // Cabecera término: nombre + estrella de importancia + badge autor
    var rowHdr = document.createElement('div');
    rowHdr.style.cssText='display:flex;align-items:center;gap:6px;margin-bottom:4px';
    var termEl = document.createElement('div');
    termEl.style.cssText='font-size:13px;font-weight:600;color:var(--navy);flex:1';
    termEl.textContent=t.termino;
    var stars = document.createElement('span');
    stars.style.cssText='font-size:10px;color:var(--muted);flex-shrink:0';
    stars.textContent = ESTRELLAS[t.estrellas||1] || '⭐ Básico';
    rowHdr.appendChild(termEl); rowHdr.appendChild(stars);

    // Badge autor
    if(t.autor && t.autor!=='profesor'){
      var autorBadge = document.createElement('span');
      autorBadge.style.cssText='font-size:10px;background:var(--blue-bg);color:var(--blue);padding:1px 6px;border-radius:10px;flex-shrink:0';
      autorBadge.textContent='Alumno'; rowHdr.appendChild(autorBadge);
    }

    // Acciones profesor (editar/borrar)
    if(ROL==='profesor'){
      var actDiv = document.createElement('div'); actDiv.style.cssText='display:flex;gap:4px;flex-shrink:0';
      var btnEdit = document.createElement('button'); btnEdit.className='btn btn-g btn-sm'; btnEdit.style.fontSize='10px'; btnEdit.textContent='✎';
      btnEdit.onclick=(function(uid, tid){ return function(){ abrirModalEditarTermino(uid,tid); }; })(u.id,t.id);
      var btnDel = document.createElement('button'); btnDel.className='btn btn-d btn-sm'; btnDel.style.fontSize='10px'; btnDel.textContent='✕';
      btnDel.onclick=(function(uid, tid){ return function(){
        if(!confirm('¿Eliminar este término?')) return;
        GLOSARIO_DATA[uid]=(GLOSARIO_DATA[uid]||[]).filter(function(x){ return x.id!==tid; });
        saveGlosario(); renderUD(UNIDADES.find(function(u){ return u.id===uid; }));
      }; })(u.id,t.id);
      actDiv.appendChild(btnEdit); actDiv.appendChild(btnDel); rowHdr.appendChild(actDiv);
    }

    row.appendChild(rowHdr);

    // Definición
    var defEl = document.createElement('div');
    if(t.editable && ROL==='alumno'){
      defEl.style.cssText='margin-top:4px';
      var ta = document.createElement('textarea'); ta.className='fta'; ta.rows=2;
      ta.style.cssText='font-size:12px;resize:none';
      ta.placeholder='Escribe tu definición aquí…';
      ta.value=t.definicion||'';
      ta.onchange=function(){ t.definicion=this.value; saveGlosario(); };
      defEl.appendChild(ta);
    } else {
      defEl.style.cssText='font-size:12.5px;color:var(--muted);line-height:1.6';
      defEl.textContent = t.definicion ||
        (ROL==='alumno'?'— (sin definición aún)':'— (el alumno debe completar)');
    }
    row.appendChild(defEl);
    card.appendChild(row);
  });

  return card;
}

// ── Modales glosario ─────────────────────────────────
function abrirModalGlosarioProf(udId){
  var u = UNIDADES.find(function(x){ return x.id===udId; });
  abrirModal('Añadir término al glosario — '+u.titulo,
    '<div class="fg"><label class="fl">Término <span style="color:var(--red)">*</span></label>'+
      '<input class="fi" id="gl-termino" placeholder="Nombre del concepto o término"></div>'+
    '<div class="fg"><label class="fl">Definición (opcional — déjala vacía para que el alumno la complete)</label>'+
      '<textarea class="fta" id="gl-def" rows="3" placeholder="Definición del término…"></textarea></div>'+
    '<div class="g2">'+
      '<div class="fg"><label class="fl" style="display:flex;align-items:center;gap:8px">'+
        '<input type="checkbox" id="gl-editable" checked> Alumno puede completar/editar</label></div>'+
      '<div class="fg"><label class="fl">Importancia del concepto</label>'+
        '<select class="fs" id="gl-estrellas">'+
          '<option value="1">⭐ Básico</option>'+
          '<option value="2">⭐⭐ Importante</option>'+
          '<option value="3">⭐⭐⭐ Fundamental</option>'+
        '</select></div>'+
    '</div>',
    '<button class="btn btn-g" onclick="cerrarModal()">Cancelar</button>'+
    '<button class="btn btn-p" id="btn-gl-guardar-prof">Añadir término</button>'
  );
  setTimeout(function(){
    var b=document.getElementById('btn-gl-guardar-prof');
    if(b) b.onclick=function(){ guardarGlosarioProf(udId); };
  },50);
}

function guardarGlosarioProf(udId){
  var t=document.getElementById('gl-termino').value.trim();
  if(!t){ flash('Introduce un término','#dc2626'); return; }
  if(!GLOSARIO_DATA[udId]) GLOSARIO_DATA[udId]=[];
  GLOSARIO_DATA[udId].push({
    id:uid(), termino:t,
    definicion:document.getElementById('gl-def').value.trim(),
    autor:'profesor',
    editable:document.getElementById('gl-editable').checked,
    estrellas:parseInt(document.getElementById('gl-estrellas').value)||1
  });
  saveGlosario(); cerrarModal();
  renderUD(UNIDADES.find(function(u){ return u.id===udId; }));
  flash('Término añadido al glosario','#16a34a');
}

function abrirModalGlosarioAlumno(udId){
  var u = UNIDADES.find(function(x){ return x.id===udId; });
  abrirModal('Mi aportación al glosario — '+u.titulo,
    '<div class="fg"><label class="fl">Término <span style="color:var(--red)">*</span></label>'+
      '<input class="fi" id="gl-al-termino" placeholder="Concepto que quieres añadir"></div>'+
    '<div class="fg"><label class="fl">Definición</label>'+
      '<textarea class="fta" id="gl-al-def" rows="3" placeholder="Tu definición del concepto…"></textarea></div>',
    '<button class="btn btn-g" onclick="cerrarModal()">Cancelar</button>'+
    '<button class="btn btn-p" id="btn-gl-guardar-al">Añadir</button>'
  );
  setTimeout(function(){
    var b=document.getElementById('btn-gl-guardar-al');
    if(b) b.onclick=function(){ guardarGlosarioAlumno(udId); };
  },50);
}

function guardarGlosarioAlumno(udId){
  var t=document.getElementById('gl-al-termino').value.trim();
  if(!t){ flash('Introduce un término','#dc2626'); return; }
  if(!GLOSARIO_DATA[udId]) GLOSARIO_DATA[udId]=[];
  GLOSARIO_DATA[udId].push({
    id:uid(), termino:t,
    definicion:document.getElementById('gl-al-def').value.trim(),
    autor:'alumno', editable:true, estrellas:1
  });
  saveGlosario(); cerrarModal();
  renderUD(UNIDADES.find(function(u){ return u.id===udId; }));
  flash('Término añadido','#16a34a');
}

function abrirModalEditarTermino(udId, terminoId){
  var terminos = GLOSARIO_DATA[udId]||[];
  var t = terminos.find(function(x){ return x.id===terminoId; });
  if(!t) return;
  abrirModal('Editar término',
    '<div class="fg"><label class="fl">Término</label>'+
      '<input class="fi" id="gl-edit-termino" value="'+t.termino+'"></div>'+
    '<div class="fg"><label class="fl">Definición</label>'+
      '<textarea class="fta" id="gl-edit-def" rows="3">'+t.definicion+'</textarea></div>'+
    '<div class="g2">'+
      '<div class="fg"><label class="fl" style="display:flex;align-items:center;gap:8px">'+
        '<input type="checkbox" id="gl-edit-editable"'+(t.editable?' checked':'')+'>  Alumno puede editar</label></div>'+
      '<div class="fg"><label class="fl">Importancia</label>'+
        '<select class="fs" id="gl-edit-estrellas">'+
          '<option value="1"'+(t.estrellas===1?' selected':'')+'>⭐ Básico</option>'+
          '<option value="2"'+(t.estrellas===2?' selected':'')+'>⭐⭐ Importante</option>'+
          '<option value="3"'+(t.estrellas===3?' selected':'')+'>⭐⭐⭐ Fundamental</option>'+
        '</select></div>'+
    '</div>',
    '<button class="btn btn-g" onclick="cerrarModal()">Cancelar</button>'+
    '<button class="btn btn-p" id="btn-gl-edit-save">Guardar</button>'
  );
  setTimeout(function(){
    var b=document.getElementById('btn-gl-edit-save');
    if(b) b.onclick=function(){
      t.termino=document.getElementById('gl-edit-termino').value.trim();
      t.definicion=document.getElementById('gl-edit-def').value.trim();
      t.editable=document.getElementById('gl-edit-editable').checked;
      t.estrellas=parseInt(document.getElementById('gl-edit-estrellas').value)||1;
      saveGlosario(); cerrarModal();
      renderUD(UNIDADES.find(function(u){ return u.id===udId; }));
      flash('Término actualizado','#16a34a');
    };
  },50);
}

// ── Editar descripción de UD ─────────────────────────
function editarDescUD(udId){
  var u = UNIDADES.find(function(x){ return x.id===udId; });
  if(!u) return;
  abrirModal('Editar descripción — '+u.titulo,
    '<div class="fg"><label class="fl">Descripción</label>'+
    '<textarea class="fta" id="edit-desc" rows="4">'+u.desc+'</textarea></div>',
    '<button class="btn btn-g" onclick="cerrarModal()">Cancelar</button>'+
    '<button class="btn btn-p" id="btn-guardar-desc">Guardar</button>'
  );
  setTimeout(function(){ var b=document.getElementById('btn-guardar-desc'); if(b) b.onclick=function(){ guardarDescUD(udId); }; },50);
}

function guardarDescUD(udId){
  var u = UNIDADES.find(function(x){ return x.id===udId; });
  if(!u) return;
  u.desc=(document.getElementById('edit-desc')||{value:''}).value.trim();
  saveUNIDADES(); cerrarModal(); renderUD(u);
  flash('Descripción guardada','#16a34a');
}


// ══════════════════════════════════════════════════════
//  SISTEMA DE CONTENIDOS INTERACTIVOS
// ══════════════════════════════════════════════════════


function abrirTemaEnContenido(temaTexto, udId){
  var ciCont = document.getElementById('ci-cont-'+udId);
  if(!ciCont) return;
  var found = null;
  ciCont.querySelectorAll('div').forEach(function(el){
    if(el.dataset && el.dataset.tema === temaTexto) found = el;
  });
  if(!found){
    ciCont.querySelectorAll('div[style*="background:var(--navy)"]').forEach(function(hdr){
      var titEl = hdr.querySelector('div');
      if(titEl && titEl.textContent.trim() === temaTexto.trim()) found = hdr;
    });
  }
  if(found){
    found.click();
    setTimeout(function(){ found.scrollIntoView({behavior:'smooth',block:'start'}); }, 100);
  } else {
    ciCont.scrollIntoView({behavior:'smooth',block:'start'});
    flash('No hay contenido todavía para "'+temaTexto.slice(0,30)+'"','#f59e0b');
  }
}


// ── Render bloque en modo LECTURA ─────────────────────
function renderBloqueLectura(bloque, media){
  var info = BLOQUE_INFO[bloque.tipo] || BLOQUE_INFO.texto;
  var wrap = document.createElement('div');
  wrap.style.cssText = 'border-radius:var(--r);margin-bottom:10px;overflow:hidden;border:1px solid var(--border)';

  if(bloque.titulo){
    var bHdr = document.createElement('div');
    bHdr.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px 12px;background:'+info.color;
    bHdr.innerHTML = '<span style="font-size:1rem">'+info.ico+'</span>'+
      '<span style="font-size:13px;font-weight:600;color:'+info.ctxt+'">'+bloque.titulo+'</span>';
    wrap.appendChild(bHdr);
  }

  var body = document.createElement('div');
  body.style.cssText = 'padding:12px 14px';

  if(bloque.tipo==='texto'||bloque.tipo==='concepto'||bloque.tipo==='actividad'){
    body.style.cssText += ';font-size:13.5px;line-height:1.7;color:var(--text);white-space:pre-wrap';
    body.textContent = bloque.contenido||'';
  } else if(bloque.tipo==='imagen'){
    if(media && media[bloque.id]){
      var img = document.createElement('img');
      img.src = media[bloque.id]; img.style.cssText='max-width:100%;border-radius:var(--r)';
      body.appendChild(img);
    }
    if(bloque.contenido){ var cap=document.createElement('p'); cap.style.cssText='font-size:12px;color:var(--muted);margin-top:6px;font-style:italic'; cap.textContent=bloque.contenido; body.appendChild(cap); }
  } else if(bloque.tipo==='video'){
    if(media && media[bloque.id]){
      var vid = document.createElement('video');
      vid.src = media[bloque.id]; vid.controls=true; vid.style.cssText='max-width:100%;border-radius:var(--r)';
      body.appendChild(vid);
    }
  } else if(bloque.tipo==='youtube'){
    if(bloque.contenido){
      var url = bloque.contenido.trim();
      var videoId = '';
      var m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
      if(m) videoId=m[1];
      if(videoId){
        var ifr=document.createElement('iframe');
        ifr.src='https://www.youtube.com/embed/'+videoId;
        ifr.style.cssText='width:100%;aspect-ratio:16/9;border:none;border-radius:var(--r)';
        ifr.allowFullscreen=true; body.appendChild(ifr);
      } else {
        body.innerHTML='<a href="'+url+'" target="_blank" class="btn btn-g" style="font-size:13px">▶ Ver vídeo ↗</a>';
      }
    }
  }
  wrap.appendChild(body);
  return wrap;
}

// ── Render contenidos en la UD (sección colLeft) ──────
function renderContenidosInteractivos(udId, container){
  var bloques = CONT_DATA[udId] || [];
  var media = getContMedia();
  container.innerHTML = '';

  if(!bloques.length){
    var empty=document.createElement('div'); empty.style.cssText='text-align:center;padding:2rem;color:var(--muted)';
    empty.innerHTML='<div style="font-size:2.5rem;margin-bottom:10px">📖</div>'+
      '<div style="font-size:14px;font-weight:500;margin-bottom:6px">Sin contenidos interactivos todavía</div>'+
      '<div style="font-size:13px">'+(ROL==='profesor'?'Pulsa <strong>✎ Editar contenidos</strong> para añadir bloques interactivos.':'El profesor aún no ha añadido contenidos interactivos para esta unidad.')+'</div>';
    container.appendChild(empty); return;
  }

  // Filtrar borradores para alumnos
  var bloquesVisibles = ROL === 'profesor'
    ? bloques
    : bloques.filter(function(b){ return b.publicado; });

  if(!bloquesVisibles.length && ROL !== 'profesor'){
    container.innerHTML = '<div style="text-align:center;padding:1.5rem;color:var(--muted);font-size:13px">Sin contenido publicado todavía.</div>';
    return;
  }

  // Agrupar por temaRef
  var grupos = []; var sinTema = [];
  bloquesVisibles.forEach(function(b){
    if(b.temaRef){
      var g = grupos.find(function(x){ return x.tema===b.temaRef; });
      if(!g){ g={tema:b.temaRef, bloques:[]}; grupos.push(g); }
      g.bloques.push(b);
    } else { sinTema.push(b); }
  });

  // Filtrar borradores para alumnos
  var bloquesVisibles = ROL==='profesor' ? bloques : bloques.filter(function(b){ return b.publicado; });
  if(!bloquesVisibles.length && ROL!=='profesor'){
    container.innerHTML='<div style="text-align:center;padding:1.5rem;color:var(--muted);font-size:13px">Sin contenido disponible todavía.</div>';
    return;
  }
  // Rehacer grupos con bloques filtrados
  grupos=[]; sinTema=[];
  bloquesVisibles.forEach(function(bloque){
    if(bloque.temaRef){ var g=grupos.find(function(x){ return x.tema===bloque.temaRef; }); if(!g){ g={tema:bloque.temaRef,bloques:[]}; grupos.push(g); } g.bloques.push(bloque); }
    else { sinTema.push(bloque); }
  });

  grupos.forEach(function(g, gi){
    var wrap=document.createElement('div');
    wrap.style.cssText='border:1px solid var(--border);border-radius:var(--rl);margin-bottom:10px;overflow:hidden';
    var hdr=document.createElement('div');
    hdr.dataset.tema=g.tema;
    hdr.style.cssText='display:flex;align-items:center;gap:10px;padding:12px 16px;background:var(--navy);cursor:pointer;user-select:none';
    var numEl=document.createElement('div');
    numEl.style.cssText='width:26px;height:26px;border-radius:6px;background:var(--gold);color:var(--navy);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0';
    numEl.textContent=gi+1;
    var titEl=document.createElement('div'); titEl.style.cssText='flex:1;font-size:14px;font-weight:700;color:#fff'; titEl.textContent=g.tema;
    var cntEl=document.createElement('div'); cntEl.style.cssText='font-size:11px;color:rgba(255,255,255,.5);flex-shrink:0';
    cntEl.textContent=g.bloques.length+' bloque'+(g.bloques.length!==1?'s':'');
    var arrEl=document.createElement('span'); arrEl.style.cssText='color:rgba(255,255,255,.6);font-size:11px;transition:transform .25s;flex-shrink:0'; arrEl.textContent='▼';
    hdr.appendChild(numEl); hdr.appendChild(titEl); hdr.appendChild(cntEl); hdr.appendChild(arrEl);
    var body=document.createElement('div'); body.style.cssText='overflow:hidden;max-height:0;transition:max-height .3s ease';
    var bInner=document.createElement('div'); bInner.style.cssText='padding:12px 16px';
    g.bloques.forEach(function(b){
      var bWrap=document.createElement('div'); bWrap.style.position='relative';
      if(ROL==='profesor' && !b.publicado){
        var draftBadge=document.createElement('div');
        draftBadge.style.cssText='position:absolute;top:6px;right:6px;background:#fef3c7;color:#92400e;font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;z-index:1;pointer-events:none';
        draftBadge.textContent='⚠️ Borrador'; bWrap.appendChild(draftBadge);
      }
      bWrap.appendChild(renderBloqueLectura(b,media)); bInner.appendChild(bWrap);
    });
    body.appendChild(bInner);
    var isOpen=false;
    hdr.dataset.tema=g.tema;
    hdr.onclick=(function(bd,ar){ return function(){
      isOpen=!isOpen; bd.style.maxHeight=isOpen?bd.scrollHeight+'px':'0px';
      ar.style.transform=isOpen?'rotate(180deg)':'';
      if(isOpen) setTimeout(function(){ bd.style.maxHeight=bd.scrollHeight+'px'; },310);
    };})(body,arrEl);
    wrap.appendChild(hdr); wrap.appendChild(body); container.appendChild(wrap);
  });
  sinTema.forEach(function(b){ container.appendChild(renderBloqueLectura(b,media)); });
}

// ── Editor de contenidos ──────────────────────────────
function editarContenidosUD(udId){
  var u=UNIDADES.find(function(x){ return x.id===udId; }); if(!u) return;
  if(!CONT_DATA[udId]) CONT_DATA[udId]=[];
  var overlay=document.createElement('div'); overlay.id='editor-cont-overlay';
  overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:2000;display:flex;align-items:stretch;justify-content:flex-end';
  var panel=document.createElement('div');
  panel.style.cssText='width:min(700px,100vw);background:var(--surface);display:flex;flex-direction:column;box-shadow:-8px 0 32px rgba(0,0,0,.15)';
  var edHdr=document.createElement('div'); edHdr.style.cssText='display:flex;align-items:center;gap:12px;padding:16px 20px;background:var(--navy);flex-shrink:0';
  edHdr.innerHTML='<div style="flex:1"><div style="font-family:\'Playfair Display\',serif;font-size:16px;font-weight:600;color:#fff">Editor de contenidos interactivos</div>'+
    '<div style="font-size:12px;color:rgba(255,255,255,.5);margin-top:2px">B'+u.n+' · '+u.titulo+'</div></div>';
  var btnCerrar=document.createElement('button'); btnCerrar.style.cssText='background:rgba(255,255,255,.15);border:none;color:#fff;border-radius:8px;padding:7px 14px;cursor:pointer;font-size:13px';
  btnCerrar.textContent='✕ Cerrar'; btnCerrar.onclick=function(){ cerrarEditorCont(udId); };
  edHdr.appendChild(btnCerrar); panel.appendChild(edHdr);
  var addBar=document.createElement('div'); addBar.style.cssText='padding:12px 20px;border-bottom:1px solid var(--border);background:var(--surface2);flex-shrink:0';
  var addLabel=document.createElement('div'); addLabel.style.cssText='font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);margin-bottom:8px';
  addLabel.textContent='Añadir bloque'; addBar.appendChild(addLabel);
  var addBtns=document.createElement('div'); addBtns.style.cssText='display:flex;gap:6px;flex-wrap:wrap';
  Object.keys(BLOQUE_INFO).forEach(function(tipo){
    var info=BLOQUE_INFO[tipo]; var btn=document.createElement('button');
    btn.style.cssText='display:flex;align-items:center;gap:5px;padding:6px 11px;border-radius:8px;border:1px solid var(--border);background:var(--surface);font-size:12px;font-weight:500;cursor:pointer;color:var(--text)';
    btn.innerHTML=info.ico+' '+info.label;
    btn.onclick=(function(t){ return function(){ addBloqueEditor(udId,t,lista); }; })(tipo);
    addBtns.appendChild(btn);
  });
  addBar.appendChild(addBtns); panel.appendChild(addBar);
  var lista=document.createElement('div'); lista.id='ed-bloques-lista';
  lista.style.cssText='flex:1;overflow-y:auto;padding:14px 20px';
  panel.appendChild(lista);
  overlay.appendChild(panel); document.body.appendChild(overlay);
  document.body.style.overflow='hidden';
  renderEditorBloques(udId, lista);
}

function cerrarEditorCont(udId){
  var ov=document.getElementById('editor-cont-overlay'); if(ov){ ov.remove(); document.body.style.overflow=''; }
  var u=UNIDADES.find(function(x){ return x.id===udId; }); if(u) renderUD(u);
}

function renderEditorBloques(udId, lista){
  lista.innerHTML='';
  var bloques=CONT_DATA[udId]||[]; var media=getContMedia();
  if(!bloques.length){ lista.innerHTML='<div style="text-align:center;padding:2rem;color:var(--muted);font-size:13px">Pulsa un botón arriba para añadir el primer bloque de contenido.</div>'; return; }
  bloques.forEach(function(bloque,idx){
    var info=BLOQUE_INFO[bloque.tipo]||BLOQUE_INFO.texto;
    var card=document.createElement('div'); card.style.cssText='border:1px solid var(--border);border-radius:var(--rl);margin-bottom:10px;overflow:hidden';
    var cHdr=document.createElement('div'); cHdr.style.cssText='display:flex;align-items:center;gap:8px;padding:9px 12px;background:'+info.color;
    var estadoBadge = bloque.publicado
      ? '<span style="background:#dcfce7;color:#16a34a;font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px">✅ Publicado</span>'
      : '<span style="background:#fef3c7;color:#92400e;font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px">⚠️ Borrador</span>';
    cHdr.innerHTML='<span style="font-size:1.1rem">'+info.ico+'</span><span style="font-size:12px;font-weight:600;color:'+info.ctxt+';flex:1">'+info.label+'</span>'+estadoBadge;
    var ctls=document.createElement('div'); ctls.style.cssText='display:flex;gap:4px';
    if(idx>0){ var btnUp=document.createElement('button'); btnUp.innerHTML='↑'; btnUp.title='Subir'; btnUp.style.cssText='background:rgba(255,255,255,.6);border:none;border-radius:5px;padding:3px 7px;cursor:pointer;font-size:12px'; btnUp.onclick=(function(i){ return function(){ moverBloque(udId,i,-1,lista); }; })(idx); ctls.appendChild(btnUp); }
    if(idx<bloques.length-1){ var btnDn=document.createElement('button'); btnDn.innerHTML='↓'; btnDn.title='Bajar'; btnDn.style.cssText='background:rgba(255,255,255,.6);border:none;border-radius:5px;padding:3px 7px;cursor:pointer;font-size:12px'; btnDn.onclick=(function(i){ return function(){ moverBloque(udId,i,1,lista); }; })(idx); ctls.appendChild(btnDn); }
    var btnDel=document.createElement('button'); btnDel.innerHTML='🗑'; btnDel.title='Eliminar'; btnDel.style.cssText='background:var(--red-bg);color:var(--red);border:none;border-radius:5px;padding:3px 8px;cursor:pointer;font-size:12px';
    btnDel.onclick=(function(bid){ return function(){ if(!confirm('¿Eliminar este bloque?')) return; CONT_DATA[udId]=(CONT_DATA[udId]||[]).filter(function(b){ return b.id!==bid; }); delContMedia(bid); saveCont(); renderEditorBloques(udId,lista); }; })(bloque.id);
    ctls.appendChild(btnDel); cHdr.appendChild(ctls); card.appendChild(cHdr);
    var form=document.createElement('div'); form.style.cssText='padding:12px 14px;background:var(--surface)';
    form.appendChild(campoEditorBloque(bloque,udId,lista,media)); card.appendChild(form);
    lista.appendChild(card);
  });
}

function campoEditorBloque(bloque, udId, lista, media){
  var wrap=document.createElement('div');
  // Campo temaRef — vincular al índice
  var temas=(UNIDADES.find(function(x){ return x.id===udId; })||{}).temas||[];
  if(temas.length){
    var fgT=document.createElement('div'); fgT.className='fg'; fgT.style.marginBottom='8px';
    var lblT=document.createElement('label'); lblT.className='fl'; lblT.textContent='Tema del índice';
    var selT=document.createElement('select'); selT.className='fs';
    selT.innerHTML='<option value="">— Sin tema —</option>'+temas.filter(function(t){ return !/^(\t| {2,}|- |\* )/.test(t); }).map(function(t){ return '<option value="'+t+'"'+(bloque.temaRef===t?' selected':'')+'>'+t+'</option>'; }).join('');
    selT.onchange=function(){ bloque.temaRef=this.value; saveCont(); };
    fgT.appendChild(lblT); fgT.appendChild(selT); wrap.appendChild(fgT);
  }
  // Estado borrador / publicado
  var fgEstado=document.createElement('div');
  fgEstado.style.cssText='display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:var(--r);margin-bottom:8px;background:'+(bloque.publicado?'var(--green-bg)':'var(--amber-bg)');
  var estadoLabel=document.createElement('div');
  estadoLabel.style.cssText='font-size:12px;font-weight:600;flex:1;color:'+(bloque.publicado?'var(--green)':'var(--amber)');
  estadoLabel.textContent=bloque.publicado?'✅ Publicado — visible para alumnos':'⚠️ Borrador — solo visible para el profesor';
  var toggleEstado=document.createElement('button'); toggleEstado.className='btn btn-sm';
  toggleEstado.style.cssText='font-size:11px;background:'+(bloque.publicado?'var(--amber-bg)':'var(--green-bg)')+';color:'+(bloque.publicado?'var(--amber)':'var(--green)')+';border:1px solid '+(bloque.publicado?'#fde68a':'#bbf7d0');
  toggleEstado.textContent=bloque.publicado?'→ Pasar a borrador':'→ Publicar';
  toggleEstado.onclick=(function(b,fg,lbl,btn){ return function(){
    b.publicado=!b.publicado; saveCont();
    fg.style.background=b.publicado?'var(--green-bg)':'var(--amber-bg)';
    lbl.style.color=b.publicado?'var(--green)':'var(--amber)';
    lbl.textContent=b.publicado?'✅ Publicado — visible para alumnos':'⚠️ Borrador — solo visible para el profesor';
    btn.style.background=b.publicado?'var(--amber-bg)':'var(--green-bg)';
    btn.style.color=b.publicado?'var(--amber)':'var(--green)';
    btn.style.borderColor=b.publicado?'#fde68a':'#bbf7d0';
    btn.textContent=b.publicado?'→ Pasar a borrador':'→ Publicar';
  };})(bloque,fgEstado,estadoLabel,toggleEstado);
  fgEstado.appendChild(estadoLabel); fgEstado.appendChild(toggleEstado);
  wrap.appendChild(fgEstado);

  // ── Estado borrador / publicado ──────────────────────
  var fgEstado = document.createElement('div');
  fgEstado.style.cssText = 'display:flex;align-items:center;gap:10px;margin-bottom:8px;padding:8px 10px;border-radius:var(--r);background:'+(bloque.publicado?'var(--green-bg)':'var(--amber-bg)');
  var estadoLabel = document.createElement('div');
  estadoLabel.style.cssText = 'font-size:12px;font-weight:600;flex:1;color:'+(bloque.publicado?'var(--green)':'var(--amber)');
  estadoLabel.textContent = bloque.publicado ? '✅ Publicado — visible para alumnos' : '⚠️ Borrador — solo visible para el profesor';
  var toggleEstado = document.createElement('button');
  toggleEstado.className = 'btn btn-sm';
  toggleEstado.style.cssText = 'font-size:11px;background:'+(bloque.publicado?'var(--amber-bg)':'var(--green-bg)')+';color:'+(bloque.publicado?'var(--amber)':'var(--green)')+';border:1px solid '+(bloque.publicado?'#fde68a':'#bbf7d0');
  toggleEstado.textContent = bloque.publicado ? '→ Pasar a borrador' : '→ Publicar';
  toggleEstado.onclick = (function(b, fg, lbl, btn){ return function(){
    b.publicado = !b.publicado; saveCont();
    fg.style.background = b.publicado?'var(--green-bg)':'var(--amber-bg)';
    lbl.style.color = b.publicado?'var(--green)':'var(--amber)';
    lbl.textContent = b.publicado?'✅ Publicado — visible para alumnos':'⚠️ Borrador — solo visible para el profesor';
    btn.style.background = b.publicado?'var(--amber-bg)':'var(--green-bg)';
    btn.style.color = b.publicado?'var(--amber)':'var(--green)';
    btn.style.borderColor = b.publicado?'#fde68a':'#bbf7d0';
    btn.textContent = b.publicado?'→ Pasar a borrador':'→ Publicar';
  }; })(bloque, fgEstado, estadoLabel, toggleEstado);
  fgEstado.appendChild(estadoLabel); fgEstado.appendChild(toggleEstado);
  wrap.appendChild(fgEstado);

  // Título
  if(bloque.tipo!=='video'&&bloque.tipo!=='youtube'){
    var fg1=document.createElement('div'); fg1.className='fg'; fg1.style.marginBottom='8px';
    var lbl1=document.createElement('label'); lbl1.className='fl'; lbl1.textContent='Título del bloque';
    var inp1=document.createElement('input'); inp1.className='fi'; inp1.value=bloque.titulo||''; inp1.placeholder='Ej: ¿Qué es la financiación?';
    inp1.oninput=function(){ bloque.titulo=this.value; saveCont(); };
    fg1.appendChild(lbl1); fg1.appendChild(inp1); wrap.appendChild(fg1);
  }
  // Contenido según tipo
  if(bloque.tipo==='texto'||bloque.tipo==='concepto'||bloque.tipo==='actividad'){
    var fg2=document.createElement('div'); fg2.className='fg';
    var lbl2=document.createElement('label'); lbl2.className='fl'; lbl2.textContent='Contenido';
    var ta2=document.createElement('textarea'); ta2.className='fta'; ta2.rows=5; ta2.value=bloque.contenido||''; ta2.placeholder='Escribe aquí el contenido…';
    ta2.oninput=function(){ bloque.contenido=this.value; saveCont(); };
    fg2.appendChild(lbl2); fg2.appendChild(ta2); wrap.appendChild(fg2);
  } else if(bloque.tipo==='imagen'){
    if(media&&media[bloque.id]){ var prevImg=document.createElement('img'); prevImg.src=media[bloque.id]; prevImg.style.cssText='max-width:100%;max-height:160px;border-radius:var(--r);margin-bottom:8px;display:block'; wrap.appendChild(prevImg); }
    var btnImg=document.createElement('button'); btnImg.className='btn btn-g btn-sm'; btnImg.textContent='📎 Subir imagen';
    btnImg.onclick=function(){ var inp=document.createElement('input'); inp.type='file'; inp.accept='image/*'; inp.onchange=function(e){ var f=e.target.files[0]; if(!f) return; var rd=new FileReader(); rd.onload=function(ev){ saveContMedia(bloque.id,ev.target.result); saveCont(); renderEditorBloques(udId,lista); }; rd.readAsDataURL(f); }; inp.click(); };
    wrap.appendChild(btnImg);
    var fg3=document.createElement('div'); fg3.className='fg'; fg3.style.marginTop='8px';
    var lbl3=document.createElement('label'); lbl3.className='fl'; lbl3.textContent='Pie de imagen (opcional)';
    var ta3=document.createElement('input'); ta3.className='fi'; ta3.value=bloque.contenido||''; ta3.oninput=function(){ bloque.contenido=this.value; saveCont(); };
    fg3.appendChild(lbl3); fg3.appendChild(ta3); wrap.appendChild(fg3);
  } else if(bloque.tipo==='video'){
    if(media&&media[bloque.id]){ var prevVid=document.createElement('video'); prevVid.src=media[bloque.id]; prevVid.controls=true; prevVid.style.cssText='max-width:100%;max-height:160px;border-radius:var(--r);margin-bottom:8px;display:block'; wrap.appendChild(prevVid); }
    var btnVid=document.createElement('button'); btnVid.className='btn btn-g btn-sm'; btnVid.textContent='🎬 Subir vídeo';
    btnVid.onclick=function(){ var inp=document.createElement('input'); inp.type='file'; inp.accept='video/*'; inp.onchange=function(e){ var f=e.target.files[0]; if(!f) return; var rd=new FileReader(); rd.onload=function(ev){ bloque.mediaName=f.name; saveContMedia(bloque.id,ev.target.result); saveCont(); renderEditorBloques(udId,lista); }; rd.readAsDataURL(f); }; inp.click(); };
    wrap.appendChild(btnVid);
  } else if(bloque.tipo==='youtube'){
    var fg4=document.createElement('div'); fg4.className='fg';
    var lbl4=document.createElement('label'); lbl4.className='fl'; lbl4.textContent='URL de YouTube o Vimeo';
    var inp4=document.createElement('input'); inp4.className='fi'; inp4.value=bloque.contenido||''; inp4.placeholder='https://www.youtube.com/watch?v=...';
    inp4.oninput=function(){ bloque.contenido=this.value; saveCont(); };
    fg4.appendChild(lbl4); fg4.appendChild(inp4); wrap.appendChild(fg4);
  }
  return wrap;
}

function addBloqueEditor(udId, tipo, lista){
  if(!CONT_DATA[udId]) CONT_DATA[udId]=[];
  CONT_DATA[udId].push({ id:'blq_'+Date.now(), tipo:tipo, titulo:'', contenido:'', temaRef:'', publicado:false });
  saveCont(); renderEditorBloques(udId, lista);
}

function moverBloque(udId, idx, dir, lista){
  var arr=CONT_DATA[udId]||[]; var newIdx=idx+dir;
  if(newIdx<0||newIdx>=arr.length) return;
  var tmp=arr[idx]; arr[idx]=arr[newIdx]; arr[newIdx]=tmp;
  saveCont(); renderEditorBloques(udId, lista);
}


// ── INIT ───────────────────────────────────────────────
window.addEventListener('load', function(){
