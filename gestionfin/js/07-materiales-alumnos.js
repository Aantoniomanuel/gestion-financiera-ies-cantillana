// ── MATERIALES ─────────────────────────────────────────
// ── ALUMNOS ─────────────────────────────────────────────
function renderAlumnos(){
  var sub = document.getElementById('alumnos-sub');
  if(sub) sub.textContent = DB.alumnos.length + ' alumnos';
  var grid = document.getElementById('alumnos-grid');
  if(!grid) return;
  if(!DB.alumnos.length){
    grid.innerHTML = '<div class="card"><p style="color:var(--muted);font-size:13px;text-align:center;padding:1.5rem">'+
      (ROL==='profesor'?'Sin alumnos. Añade el primero pulsando el botón.':'No hay alumnos registrados.')+'</p></div>';
    return;
  }
  grid.innerHTML = DB.alumnos.map(function(al){
    return '<div class="card" style="padding:1rem">'+
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">'+
        '<div style="width:38px;height:38px;border-radius:50%;background:var(--navy);color:var(--gold-light);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0">'+
          (al.nombre?al.nombre[0].toUpperCase():'?')+
        '</div>'+
        '<div style="flex:1;min-width:0">'+
          '<div style="font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+al.nombre+' '+al.apellidos+'</div>'+
          (al.email?'<div style="font-size:11px;color:var(--muted)">'+al.email+'</div>':'')+
        '</div>'+
      '</div>'+
      (ROL==='profesor'?
        '<button class="btn btn-d btn-sm" style="font-size:11px;width:100%" onclick="borrarAlumno(\"'+al.id+'\")">✕ Eliminar</button>':'')+
    '</div>';
  }).join('');
}

function abrirModalAlumno(){
  abrirModal('+ Añadir alumno',
    '<div class="g2">'+
      '<div class="fg"><label class="fl">Nombre <span style="color:var(--red)">*</span></label>'+
      '<input class="fi" id="al-nombre" placeholder="Nombre"></div>'+
      '<div class="fg"><label class="fl">Apellidos <span style="color:var(--red)">*</span></label>'+
      '<input class="fi" id="al-apellidos" placeholder="Apellidos"></div>'+
    '</div>'+
    '<div class="fg"><label class="fl">Email</label>'+
    '<input class="fi" id="al-email" type="email" placeholder="alumno@iescantillana.es"></div>',
    '<button class="btn btn-g" onclick="cerrarModal()">Cancelar</button>'+
    '<button class="btn btn-p" onclick="guardarAlumno()">Añadir alumno</button>'
  );
}

function guardarAlumno(){
  var n = (document.getElementById('al-nombre')||{value:''}).value.trim();
  var a = (document.getElementById('al-apellidos')||{value:''}).value.trim();
  if(!n||!a){ flash('Introduce nombre y apellidos','#dc2626'); return; }
  DB.alumnos.push({id:uid(), nombre:n, apellidos:a, email:(document.getElementById('al-email')||{value:''}).value.trim()});
  save(); cerrarModal(); renderAlumnos(); renderDashboard();
  flash('Alumno añadido','#16a34a');
}

function borrarAlumno(id){
  if(!confirm('¿Eliminar este alumno?')) return;
  DB.alumnos = DB.alumnos.filter(function(a){ return a.id!==id; });
  save(); renderAlumnos(); renderDashboard();
}


function renderMateriales(){
  var lista = document.getElementById('materiales-lista');
  if(!lista) return;
  lista.innerHTML = '';

  if(!DB.materiales.length){
    lista.innerHTML = '<div class="card"><p style="color:var(--muted);font-size:13px;text-align:center;padding:1.5rem">Sin materiales. '+(ROL==='profesor'?'Añade el primero.':'El profesor aún no ha subido materiales.')+'</p></div>';
    return;
  }

  // Agrupar por unidad
  var grupos = {};
  DB.materiales.forEach(function(m){
    var key = m.unidad||'General';
    if(!grupos[key]) grupos[key]=[];
    grupos[key].push(m);
  });

  var iconTipo = {apunte:'📄',ejercicio:'✏️',examen:'📋',normativa:'⚖️',plantilla:'📊',video:'🎬',otro:'📎'};

  Object.keys(grupos).sort().forEach(function(unidad){
    var secEl = document.createElement('div'); secEl.style.marginBottom='1.25rem';
    var secHdr = document.createElement('div');
    secHdr.style.cssText='font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);margin-bottom:8px;padding-left:2px';
    secHdr.textContent=unidad;
    secEl.appendChild(secHdr);

    var grid = document.createElement('div');
    grid.style.cssText='display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px';

    grupos[unidad].forEach(function(m){
      var card = document.createElement('div');
      card.style.cssText='border:1px solid var(--border);border-radius:var(--rl);overflow:hidden;background:var(--surface);cursor:pointer;transition:box-shadow .15s';
      card.onmouseenter=function(){ this.style.boxShadow='0 4px 16px rgba(0,0,0,.1)'; };
      card.onmouseleave=function(){ this.style.boxShadow=''; };

      // Zona de previsualización
      var prev = document.createElement('div');
      prev.style.cssText='height:130px;background:var(--surface2);display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative';

      var files = null;
      try{ files = JSON.parse(localStorage.getItem('gf_mat_files')||'{}'); }catch(e){ files={}; }
      var b64 = files[m.id];
      var isImg = m.fileType && m.fileType.startsWith('image/');
      var isPDF = m.fileType && m.fileType==='application/pdf';
      var isVid = m.fileType && m.fileType.startsWith('video/');
      var isYT  = m.url && /youtu\.?be/.test(m.url);
      var isVimeo = m.url && /vimeo\.com/.test(m.url);

      if(b64 && isImg){
        var img = document.createElement('img');
        img.src=b64; img.style.cssText='width:100%;height:100%;object-fit:cover';
        prev.appendChild(img);
      } else if(b64 && isPDF){
        var ifrPDF = document.createElement('iframe');
        ifrPDF.src=b64+'#toolbar=0&navpanes=0&scrollbar=0';
        ifrPDF.style.cssText='width:100%;height:200%;border:none;transform:scale(.5);transform-origin:top left;pointer-events:none';
        ifrPDF.loading='lazy';
        prev.appendChild(ifrPDF);
        // PDF badge
        var pdfBadge=document.createElement('div');
        pdfBadge.style.cssText='position:absolute;bottom:6px;right:6px;background:#e53e3e;color:#fff;font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;letter-spacing:.05em';
        pdfBadge.textContent='PDF'; prev.appendChild(pdfBadge);
      } else if(b64 && isVid){
        var vid = document.createElement('video');
        vid.src=b64; vid.style.cssText='width:100%;height:100%;object-fit:cover';
        vid.muted=true; vid.preload='metadata';
        // Seek to 1s for thumbnail
        vid.addEventListener('loadedmetadata',function(){ vid.currentTime=1; });
        prev.appendChild(vid);
        var playIcon=document.createElement('div');
        playIcon.style.cssText='position:absolute;font-size:2rem;opacity:.8';
        playIcon.textContent='▶'; prev.appendChild(playIcon);
      } else if(isYT){
        var yId=''; var ym=m.url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
        if(ym) yId=ym[1];
        if(yId){
          var yImg=document.createElement('img');
          yImg.src='https://img.youtube.com/vi/'+yId+'/mqdefault.jpg';
          yImg.style.cssText='width:100%;height:100%;object-fit:cover';
          yImg.onerror=function(){ prev.innerHTML='<span style="font-size:2.5rem">▶️</span>'; };
          prev.appendChild(yImg);
          var ytBadge=document.createElement('div');
          ytBadge.style.cssText='position:absolute;bottom:6px;right:6px;background:#ff0000;color:#fff;font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px';
          ytBadge.textContent='YouTube'; prev.appendChild(ytBadge);
        } else {
          prev.innerHTML='<span style="font-size:2.5rem">▶️</span>';
        }
      } else {
        // Icono genérico
        var ico=document.createElement('div');
        ico.style.cssText='font-size:3rem;opacity:.5';
        ico.textContent=iconTipo[m.tipo]||'📎';
        prev.appendChild(ico);
        if(m.fileType){
          var extBadge=document.createElement('div');
          extBadge.style.cssText='position:absolute;bottom:6px;right:6px;background:var(--navy);color:#fff;font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;letter-spacing:.05em';
          var ext=(m.fileName||'').split('.').pop().toUpperCase().slice(0,5);
          extBadge.textContent=ext||m.tipo.toUpperCase(); prev.appendChild(extBadge);
        }
      }
      card.appendChild(prev);

      // Info
      var info = document.createElement('div'); info.style.cssText='padding:10px 12px';
      var titulo = document.createElement('div'); titulo.style.cssText='font-size:13px;font-weight:600;margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
      titulo.textContent=m.titulo; titulo.title=m.titulo; info.appendChild(titulo);
      var meta = document.createElement('div'); meta.style.cssText='display:flex;align-items:center;gap:6px;flex-wrap:wrap';
      var badgeTipo=document.createElement('span'); badgeTipo.className='badge b-blue'; badgeTipo.style.fontSize='10px'; badgeTipo.textContent=m.tipo; meta.appendChild(badgeTipo);
      if(m.fileSize){ var sz=document.createElement('span'); sz.style.cssText='font-size:10px;color:var(--muted)'; sz.textContent=Math.round(m.fileSize/1024)+'KB'; meta.appendChild(sz); }
      info.appendChild(meta);

      // Acciones
      var acts = document.createElement('div'); acts.style.cssText='display:flex;gap:6px;margin-top:8px';
      if(b64){
        var btnDl=document.createElement('button'); btnDl.className='btn btn-g btn-sm'; btnDl.style.cssText='flex:1;font-size:11px';
        btnDl.textContent='⬇ Descargar';
        btnDl.onclick=(function(mid,mname){ return function(e){ e.stopPropagation(); descargarArchivoMat(mid,mname); }; })(m.id,m.fileName);
        acts.appendChild(btnDl);
        // Vista previa en modal para imagen y PDF
        if(isImg||isPDF){
          var btnPrev=document.createElement('button'); btnPrev.className='btn btn-g btn-sm'; btnPrev.style.cssText='font-size:11px';
          btnPrev.textContent='👁 Ver';
          btnPrev.onclick=(function(b, tipo, nombre){ return function(e){
            e.stopPropagation();
            var overlay=document.createElement('div'); overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:3000;display:flex;align-items:center;justify-content:center;padding:20px';
            overlay.onclick=function(){ overlay.remove(); };
            var inner=document.createElement('div'); inner.style.cssText='max-width:900px;max-height:90vh;width:100%;display:flex;flex-direction:column;gap:10px';
            inner.onclick=function(e){ e.stopPropagation(); };
            var closeBtn=document.createElement('button'); closeBtn.style.cssText='align-self:flex-end;background:rgba(255,255,255,.15);border:none;color:#fff;border-radius:8px;padding:6px 14px;cursor:pointer;font-size:13px';
            closeBtn.textContent='✕ Cerrar'; closeBtn.onclick=function(){ overlay.remove(); };
            inner.appendChild(closeBtn);
            if(tipo.startsWith('image/')){
              var bigImg=document.createElement('img'); bigImg.src=b; bigImg.style.cssText='max-width:100%;max-height:80vh;border-radius:8px;object-fit:contain';
              inner.appendChild(bigImg);
            } else {
              var pdfFrame=document.createElement('iframe'); pdfFrame.src=b; pdfFrame.style.cssText='width:100%;height:80vh;border:none;border-radius:8px';
              inner.appendChild(pdfFrame);
            }
            var lbl=document.createElement('div'); lbl.style.cssText='color:rgba(255,255,255,.6);font-size:12px;text-align:center'; lbl.textContent=nombre;
            inner.appendChild(lbl);
            overlay.appendChild(inner); document.body.appendChild(overlay);
          }; })(b64, m.fileType, m.fileName||m.titulo);
          acts.appendChild(btnPrev);
        }
      } else if(m.url){
        var btnOpen=document.createElement('button'); btnOpen.className='btn btn-g btn-sm'; btnOpen.style.cssText='flex:1;font-size:11px';
        btnOpen.textContent='↗ Abrir';
        btnOpen.onclick=(function(url){ return function(e){ e.stopPropagation(); window.open(url,'_blank','noopener'); }; })(m.url);
        acts.appendChild(btnOpen);
      }
      if(ROL==='profesor'){
        var btnDel=document.createElement('button'); btnDel.className='btn btn-d btn-sm'; btnDel.style.fontSize='11px';
        btnDel.textContent='✕';
        btnDel.onclick=(function(mid){ return function(e){ e.stopPropagation(); borrarMaterial(mid); }; })(m.id);
        acts.appendChild(btnDel);
      }
      info.appendChild(acts);
      card.appendChild(info);
      grid.appendChild(card);
    });
    secEl.appendChild(grid);
    lista.appendChild(secEl);
  });
}
// ── Archivo pendiente de subir (temporal) ─────────────
var _matFilePending = null;

function abrirModalMaterial(udPresel){
  var d = document.createElement('div');

  // Título + tipo + unidad
  var row1 = document.createElement('div'); row1.className='fg';
  row1.innerHTML = '<label class="fl">Título <span style="color:var(--red)">*</span></label>'+
    '<input class="fi" id="mat-titulo" placeholder="Ej: Apuntes UD1 Patrimonio">';
  d.appendChild(row1);

  var row2 = document.createElement('div'); row2.className='g2';
  row2.innerHTML =
    '<div class="fg"><label class="fl">Tipo</label>'+
      '<select class="fs" id="mat-tipo">'+
        '<option>apunte</option><option>ejercicio</option><option>examen</option>'+
        '<option>normativa</option><option>plantilla</option><option>video</option><option>otro</option>'+
      '</select></div>'+
    '<div class="fg"><label class="fl">Unidad</label>'+
      '<select class="fs" id="mat-unidad">'+
        UNIDADES.map(function(u){
          var s = udPresel && 'UD'+u.n===udPresel ? ' selected':'';
          return '<option value="UD'+u.n+'"'+s+'>UD'+u.n+' · '+u.titulo+'</option>';
        }).join('')+
        '<option value="General">General</option>'+
      '</select></div>';
  d.appendChild(row2);

  // Zona de subida
  var rowF = document.createElement('div'); rowF.className='fg';
  rowF.innerHTML = '<label class="fl">Subir archivo (PDF, Word, Excel, imagen… máx 5 MB)</label>';
  var zone = document.createElement('div');
  zone.id = 'mat-dropzone';
  zone.style.cssText = 'border:2px dashed var(--border-md);border-radius:var(--r);padding:1.1rem;text-align:center;cursor:pointer;color:var(--muted);font-size:13px;transition:border-color .2s';
  zone.innerHTML = '<div style="font-size:1.6rem;margin-bottom:5px">📎</div>Arrastra aquí o <strong>pulsa para seleccionar</strong>'+
    '<br><span style="font-size:11px">PDF, DOC, XLS, PPT, JPG, PNG, MP4… (máx 5 MB)</span>'+
    '<div id="mat-file-info" style="margin-top:8px;font-size:12px;color:var(--navy);font-weight:500;min-height:16px"></div>';
  var inpF = document.createElement('input');
  inpF.type='file'; inpF.id='mat-file-inp'; inpF.style.display='none';
  inpF.accept='.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.jpg,.jpeg,.png,.gif,.webp,.mp4,.mov,.webm';
  rowF.appendChild(zone); rowF.appendChild(inpF);
  d.appendChild(rowF);

  // Enlace externo
  var rowU = document.createElement('div'); rowU.className='fg';
  rowU.innerHTML = '<label class="fl">O pega un enlace externo (Drive, YouTube, web…)</label>'+
    '<input class="fi" id="mat-url" placeholder="https://...">';
  d.appendChild(rowU);

  _matFilePending = null;
  document.getElementById('modal-titulo').textContent = 'Añadir recurso al Cuaderno';
  document.getElementById('modal-cuerpo').innerHTML = '';
  document.getElementById('modal-cuerpo').appendChild(d);
  document.getElementById('modal-pie').innerHTML =
    '<button class="btn btn-g" onclick="cerrarModal()">Cancelar</button>'+
    '<button class="btn btn-p" onclick="guardarMaterial()">Añadir recurso</button>';
  document.getElementById('modal').classList.add('open');

  // Eventos drag & drop y click
  setTimeout(function(){
    var z = document.getElementById('mat-dropzone');
    var i = document.getElementById('mat-file-inp');
    if(!z||!i) return;
    z.addEventListener('click', function(){ i.click(); });
    z.addEventListener('dragover', function(e){ e.preventDefault(); z.style.borderColor='var(--navy)'; });
    z.addEventListener('dragleave', function(){ z.style.borderColor=''; });
    z.addEventListener('drop', function(e){
      e.preventDefault(); z.style.borderColor='';
      if(e.dataTransfer.files[0]) leerArchivoMat(e.dataTransfer.files[0]);
    });
    i.addEventListener('change', function(){ if(i.files[0]) leerArchivoMat(i.files[0]); });
  }, 50);
}

function leerArchivoMat(file){
  var info = document.getElementById('mat-file-info');
  if(file.size > 5*1024*1024){
    if(info) info.innerHTML = '<span style="color:var(--red)">Archivo demasiado grande (máx 5 MB). Usa un enlace externo.</span>';
    _matFilePending = null; return;
  }
  var reader = new FileReader();
  reader.onload = function(e){
    _matFilePending = { name:file.name, size:file.size, type:file.type, b64:e.target.result };
    if(info) info.innerHTML = '✅ <strong>'+file.name+'</strong> ('+Math.round(file.size/1024)+' KB)';
    var tit = document.getElementById('mat-titulo');
    if(tit && !tit.value.trim()) tit.value = file.name.replace(/\.[^.]+$/, '');
  };
  reader.readAsDataURL(file);
}

function guardarMaterial(){
  var t = document.getElementById('mat-titulo').value.trim();
  if(!t){ flash('Introduce un título','#dc2626'); return; }
  var mat = {
    id:uid(), titulo:t,
    tipo:   document.getElementById('mat-tipo').value,
    unidad: document.getElementById('mat-unidad').value,
    url: '', fileName:null, fileType:null, fileSize:null
  };
  if(_matFilePending){
    mat.fileName = _matFilePending.name;
    mat.fileType = _matFilePending.type;
    mat.fileSize = _matFilePending.size;
    try{
      var files = JSON.parse(localStorage.getItem('gf_mat_files')||'{}');
      files[mat.id] = _matFilePending.b64;
      localStorage.setItem('gf_mat_files', JSON.stringify(files));
    }catch(e){ flash('Archivo demasiado grande para almacenamiento local','#dc2626'); return; }
    _matFilePending = null;
  } else {
    mat.url = (document.getElementById('mat-url')||{value:''}).value.trim();
  }
  DB.materiales.push(mat);
  save(); cerrarModal(); renderMateriales();
  flash('Recurso añadido al cuaderno','#16a34a');
}

function borrarMaterial(id){
  if(!confirm('¿Eliminar este recurso?')) return;
  DB.materiales = DB.materiales.filter(function(m){ return m.id!==id; });
  try{ var f=JSON.parse(localStorage.getItem('gf_mat_files')||'{}'); delete f[id]; localStorage.setItem('gf_mat_files',JSON.stringify(f)); }catch(e){}
  save(); renderMateriales();
}

function descargarArchivoMat(matId, name){
  try{
    var f = JSON.parse(localStorage.getItem('gf_mat_files')||'{}');
    if(!f[matId]){ flash('Archivo no encontrado','#dc2626'); return; }
    var a = document.createElement('a');
    a.href = f[matId]; a.download = name||'archivo';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }catch(e){ flash('Error al descargar','#dc2626'); }
}

