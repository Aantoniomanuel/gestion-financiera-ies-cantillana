// ══════════════════════════════════════════════════════
//  CREAR EXAMEN A PAPEL — Modal + Export PDF/HTML
// ══════════════════════════════════════════════════════
function abrirModalCrearExamen(bancoPrincipal){
  var banco = bancoPrincipal || getBanco();
  var seleccionExamen = {};
  var configExamen = {
    titulo: 'Examen · Gestión Financiera',
    subtitulo: 'CFGS Administración y Finanzas · IES Cantillana',
    fecha: new Date().toLocaleDateString('es-ES'),
    instrucciones: 'Lee atentamente cada pregunta antes de responder. Justifica tus respuestas cuando se indique.',
    mostrarPuntuacion: true,
    aleatorio: false
  };

  var overlay = document.createElement('div');
  overlay.id = 'modal-examen-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:2000;display:flex;align-items:stretch;justify-content:flex-end';

  var panel = document.createElement('div');
  panel.style.cssText = 'width:min(820px,100vw);height:100%;background:var(--surface);display:flex;flex-direction:column;box-shadow:-8px 0 32px rgba(0,0,0,.15);overflow:hidden';

  // Header
  var ph = document.createElement('div');
  ph.style.cssText = 'display:flex;align-items:center;gap:12px;padding:16px 20px;background:var(--navy);flex-shrink:0';
  ph.innerHTML = '<div style="flex:1"><div style="font-family:\'Playfair Display\',serif;font-size:16px;font-weight:600;color:#fff">📄 Crear examen a papel</div>'+
    '<div style="font-size:12px;color:rgba(255,255,255,.5);margin-top:2px">Selecciona preguntas y configura el examen</div></div>'+
    '<button onclick="document.getElementById(\'modal-examen-overlay\').remove();document.body.style.overflow=\'\'" style="background:rgba(255,255,255,.15);border:none;color:#fff;border-radius:8px;padding:7px 14px;cursor:pointer;font-size:13px">✕ Cerrar</button>';
  panel.appendChild(ph);

  // Layout: dos columnas (config + lista)
  var body = document.createElement('div');
  body.style.cssText = 'flex:1;overflow:hidden;display:grid;grid-template-columns:300px 1fr';

  // ── Columna izquierda: configuración ──
  var colConf = document.createElement('div');
  colConf.style.cssText = 'overflow-y:auto;padding:16px;border-right:1px solid var(--border);background:var(--surface2);display:flex;flex-direction:column;gap:10px';

  colConf.innerHTML =
    '<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:4px">Configuración del examen</div>'+
    '<div class="fg"><label class="fl">Título</label><input class="fi" id="ex-titulo" value="'+configExamen.titulo+'"></div>'+
    '<div class="fg"><label class="fl">Subtítulo / Grupo</label><input class="fi" id="ex-subtitulo" value="'+configExamen.subtitulo+'"></div>'+
    '<div class="fg"><label class="fl">Fecha</label><input class="fi" id="ex-fecha" value="'+configExamen.fecha+'"></div>'+
    '<div class="fg"><label class="fl">Instrucciones</label><textarea class="fta" id="ex-instrucciones" rows="3">'+configExamen.instrucciones+'</textarea></div>'+
    '<div style="display:flex;align-items:center;gap:8px"><input type="checkbox" id="ex-puntuacion" checked style="width:15px;height:15px">'+
    '<label for="ex-puntuacion" style="font-size:13px;cursor:pointer">Mostrar puntuación por pregunta</label></div>'+
    '<div style="display:flex;align-items:center;gap:8px"><input type="checkbox" id="ex-aleatorio" style="width:15px;height:15px">'+
    '<label for="ex-aleatorio" style="font-size:13px;cursor:pointer">Orden aleatorio</label></div>'+
    '<hr style="border:none;border-top:1px solid var(--border)">'+
    '<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:4px">Filtrar por bloque</div>'+
    '<select class="fs" id="ex-filtro-ud" style="font-size:13px">'+
      '<option value="todas">Todos los bloques</option>'+
      UNIDADES.map(function(u){ return '<option value="'+u.id+'">B'+u.n+' · '+u.titulo.slice(0,22)+'</option>'; }).join('')+
    '</select>'+
    '<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-top:8px;margin-bottom:4px">Filtrar por tipo</div>'+
    '<select class="fs" id="ex-filtro-tipo" style="font-size:13px">'+
      '<option value="todas">Todos los tipos</option>'+
      Object.keys(TIPOS_PREGUNTA).map(function(t){ var i=TIPOS_PREGUNTA[t]; return '<option value="'+t+'">'+i.ico+' '+i.label+'</option>'; }).join('')+
    '</select>'+
    '<button class="btn btn-g btn-sm" style="margin-top:4px" onclick="examenSeleccionarTodosVisibles()">☑ Seleccionar todos los visibles</button>'+
    '<div id="ex-resumen" style="background:var(--navy);color:#fff;border-radius:var(--r);padding:10px 12px;font-size:13px;margin-top:4px">'+
      '<div style="font-weight:700" id="ex-res-num">0 preguntas seleccionadas</div>'+
      '<div style="font-size:11px;color:rgba(255,255,255,.6);margin-top:2px" id="ex-res-pts">0 puntos totales</div>'+
    '</div>';

  // ── Columna derecha: lista de preguntas ──
  var colLista = document.createElement('div');
  colLista.style.cssText = 'overflow-y:auto;padding:16px';
  colLista.id = 'ex-lista-preguntas';

  body.appendChild(colConf);
  body.appendChild(colLista);
  panel.appendChild(body);

  // Footer
  var footer = document.createElement('div');
  footer.style.cssText = 'padding:14px 20px;border-top:1px solid var(--border);background:var(--surface2);flex-shrink:0;display:flex;justify-content:flex-end;gap:8px';
  footer.innerHTML =
    '<button class="btn btn-g" onclick="document.getElementById(\'modal-examen-overlay\').remove();document.body.style.overflow=\'\'">Cancelar</button>'+
    '<button class="btn btn-p" onclick="exportarExamenHTML()">📄 Exportar examen</button>';
  panel.appendChild(footer);

  overlay.appendChild(panel);
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  // Guardar estado global para acceder desde funciones
  window._exSeleccion = seleccionExamen;
  window._exBanco = banco;

  // Renderizar lista + filtros
  function renderExLista(){
    var ud = document.getElementById('ex-filtro-ud');
    var tipo = document.getElementById('ex-filtro-tipo');
    var udVal = ud ? ud.value : 'todas';
    var tipoVal = tipo ? tipo.value : 'todas';
    var filtrado = banco.filter(function(p){
      var udOk = udVal==='todas' || p.ud===udVal;
      var tipoOk = tipoVal==='todas' || p.tipo===tipoVal;
      return udOk && tipoOk && p.tipo!=='mapa'; // mapas no van en examen papel
    });
    var lista = document.getElementById('ex-lista-preguntas');
    if(!lista) return;
    lista.innerHTML = '';
    if(!filtrado.length){
      lista.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--muted)">No hay preguntas con estos filtros.</div>';
      return;
    }
    filtrado.forEach(function(p){
      var info = TIPOS_PREGUNTA[p.tipo]||TIPOS_PREGUNTA.test;
      var udObj = UNIDADES.find(function(u){return u.id===p.ud;})||{n:'?'};
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)';
      var chk = document.createElement('input'); chk.type='checkbox';
      chk.style.cssText = 'width:16px;height:16px;margin-top:3px;flex-shrink:0;cursor:pointer';
      chk.checked = !!seleccionExamen[p.id];
      chk.onchange = function(){
        seleccionExamen[p.id] = this.checked ? {p:p, pts:1} : null;
        actualizarResumen();
      };
      var txt = document.createElement('div'); txt.style.flex='1';
      txt.innerHTML =
        '<div style="display:flex;gap:5px;margin-bottom:4px;flex-wrap:wrap">'+
          '<span style="background:'+info.color+';color:'+info.ctxt+';font-size:10px;padding:2px 7px;border-radius:20px;font-weight:600">'+info.ico+' '+info.label+'</span>'+
          '<span class="badge b-blue" style="font-size:10px">B'+udObj.n+'</span>'+
          (p.ra?'<span class="badge b-purple" style="font-size:10px">'+p.ra+'</span>':'')+
        '</div>'+
        '<div style="font-size:13px;line-height:1.5">'+p.enunciado+'</div>';
      // Input puntuación
      var ptsWrap = document.createElement('div'); ptsWrap.style.cssText='display:flex;flex-direction:column;align-items:center;gap:2px;flex-shrink:0';
      var ptsInp = document.createElement('input'); ptsInp.type='number'; ptsInp.min='0.5'; ptsInp.max='10'; ptsInp.step='0.5'; ptsInp.value='1';
      ptsInp.style.cssText='width:52px;padding:4px;border:1px solid var(--border-md);border-radius:6px;font-size:13px;font-weight:700;text-align:center;font-family:IBM Plex Mono,monospace';
      ptsInp.title='Puntuación de esta pregunta';
      ptsInp.onchange=(function(pid){ return function(){
        if(seleccionExamen[pid]) seleccionExamen[pid].pts=parseFloat(this.value)||1;
        actualizarResumen();
      };})(p.id);
      var ptsLabel=document.createElement('div'); ptsLabel.style.cssText='font-size:9px;color:var(--muted);text-transform:uppercase';
      ptsLabel.textContent='pts';
      ptsWrap.appendChild(ptsInp); ptsWrap.appendChild(ptsLabel);
      row.appendChild(chk); row.appendChild(txt); row.appendChild(ptsWrap);
      lista.appendChild(row);
    });
  }

  function actualizarResumen(){
    var sel = Object.values(seleccionExamen).filter(Boolean);
    var nSel = sel.length;
    var totalPts = sel.reduce(function(s,e){ return s+(e.pts||1); }, 0);
    var el1=document.getElementById('ex-res-num'), el2=document.getElementById('ex-res-pts');
    if(el1) el1.textContent = nSel+' pregunta'+(nSel!==1?'s':'')+' seleccionada'+(nSel!==1?'s':'');
    if(el2) el2.textContent = totalPts.toFixed(1)+' puntos totales';
  }

  window.examenSeleccionarTodosVisibles = function(){
    var lista=document.getElementById('ex-lista-preguntas');
    if(!lista) return;
    lista.querySelectorAll('input[type=checkbox]').forEach(function(c){
      c.checked=true; c.dispatchEvent(new Event('change'));
    });
  };

  // Bind filtros
  setTimeout(function(){
    var selUd=document.getElementById('ex-filtro-ud');
    var selTipo=document.getElementById('ex-filtro-tipo');
    if(selUd) selUd.onchange=renderExLista;
    if(selTipo) selTipo.onchange=renderExLista;
    renderExLista();
  },30);
}

// ── Exportar examen como HTML imprimible ──────────────
function exportarExamenHTML(){
  var seleccionados = Object.values(window._exSeleccion||{}).filter(Boolean);
  if(!seleccionados.length){ flash('Selecciona al menos una pregunta','#dc2626'); return; }

  var titulo    = (document.getElementById('ex-titulo')||{value:'Examen'}).value;
  var subtitulo = (document.getElementById('ex-subtitulo')||{value:''}).value;
  var fecha     = (document.getElementById('ex-fecha')||{value:''}).value;
  var instruc   = (document.getElementById('ex-instrucciones')||{value:''}).value;
  var mostrarPts= (document.getElementById('ex-puntuacion')||{checked:true}).checked;
  var aleatorio = (document.getElementById('ex-aleatorio')||{checked:false}).checked;
  var totalPts  = seleccionados.reduce(function(s,e){ return s+(e.pts||1); },0);

  if(aleatorio) seleccionados.sort(function(){ return Math.random()-.5; });

  var letters = ['A','B','C','D'];

  var preguntasHTML = seleccionados.map(function(entry, idx){
    var p = entry.p;
    var pts = entry.pts||1;
    var info = TIPOS_PREGUNTA[p.tipo]||TIPOS_PREGUNTA.test;
    var n = idx+1;
    var ptsBadge = mostrarPts ? '<span style="float:right;font-size:11px;color:#666;font-weight:600;background:#f0f4ff;padding:2px 8px;border-radius:12px">'+pts+' pt'+(pts!==1?'s':'')+'</span>' : '';

    var cuerpo = '';
    if(p.tipo==='test'){
      cuerpo = '<ol type="A" style="margin:8px 0 0 20px;font-size:13px">'+(p.opciones||[]).map(function(op){
        return '<li style="margin-bottom:6px;padding:4px 0">'+op+'</li>';
      }).join('')+'</ol>';
    } else if(p.tipo==='vf'){
      cuerpo = '<div style="display:flex;gap:20px;margin-top:10px;font-size:13px">'+
        '<label style="display:flex;align-items:center;gap:6px"><span style="width:16px;height:16px;border:2px solid #333;border-radius:50%;display:inline-block"></span> Verdadero</label>'+
        '<label style="display:flex;align-items:center;gap:6px"><span style="width:16px;height:16px;border:2px solid #333;border-radius:50%;display:inline-block"></span> Falso</label>'+
      '</div>';
    } else if(p.tipo==='corta'){
      cuerpo = '<div style="margin-top:10px;border-bottom:1px solid #ccc;height:28px"></div>'+
               '<div style="border-bottom:1px solid #ccc;height:28px;margin-top:4px"></div>';
    } else if(p.tipo==='desarrollo'){
      cuerpo = Array(5).fill('<div style="border-bottom:1px solid #ccc;height:24px;margin-top:6px"></div>').join('');
    } else if(p.tipo==='calculo'){
      cuerpo =
        '<table style="width:100%;border-collapse:collapse;margin-top:10px;font-size:12px">'+
          '<tr><th style="text-align:left;padding:6px 8px;background:#f5f5f5;border:1px solid #ddd;width:30%">Datos identificados</th>'+
            '<td style="padding:6px 8px;border:1px solid #ddd;height:50px"></td></tr>'+
          '<tr><th style="text-align:left;padding:6px 8px;background:#f5f5f5;border:1px solid #ddd">Fórmula aplicada</th>'+
            '<td style="padding:6px 8px;border:1px solid #ddd;height:40px"></td></tr>'+
          '<tr><th style="text-align:left;padding:6px 8px;background:#f5f5f5;border:1px solid #ddd">Desarrollo del cálculo</th>'+
            '<td style="padding:6px 8px;border:1px solid #ddd;height:80px"></td></tr>'+
          '<tr><th style="text-align:left;padding:6px 8px;background:#f5f5f5;border:1px solid #ddd">Interpretación del resultado</th>'+
            '<td style="padding:6px 8px;border:1px solid #ddd;height:50px"></td></tr>'+
        '</table>';
    }

    return '<div style="margin-bottom:22px;padding-bottom:18px;border-bottom:1px solid #eee">'+
      '<div style="font-size:14px;font-weight:700;color:#1a2744;margin-bottom:6px">'+
        n+'. '+p.enunciado+' '+ptsBadge+
      '</div>'+
      cuerpo+
    '</div>';
  }).join('');

  var html = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">'+
    '<title>'+titulo+'</title>'+
    '<style>'+
      'body{font-family:Georgia,serif;max-width:820px;margin:0 auto;padding:30px 40px;color:#1a1a1a}'+
      'h1{font-size:22px;margin-bottom:4px}'+
      '.subtitulo{font-size:14px;color:#555;margin-bottom:4px}'+
      '.meta{font-size:13px;color:#777;margin-bottom:16px}'+
      '.instruc{background:#f8f8f8;border-left:4px solid #1a2744;padding:10px 14px;font-size:13px;margin-bottom:24px;line-height:1.6}'+
      '.datos-alumno{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;border:1px solid #ccc;padding:12px;border-radius:4px}'+
      '.campo{border-bottom:1px solid #999;padding-bottom:4px;font-size:13px}'+
      '.campo label{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#888;display:block;margin-bottom:8px}'+
      '@media print{body{padding:15px 20px}.no-print{display:none}}'+
    '</style>'+
    '</head><body>'+
    '<div style="text-align:center;border-bottom:3px solid #1a2744;padding-bottom:16px;margin-bottom:20px">'+
      '<h1>'+titulo+'</h1>'+
      '<div class="subtitulo">'+subtitulo+'</div>'+
      '<div class="meta">Fecha: '+fecha+' · Total: '+totalPts.toFixed(1)+' puntos · '+seleccionados.length+' preguntas</div>'+
    '</div>'+
    '<div class="datos-alumno">'+
      '<div class="campo"><label>Nombre y apellidos</label>&nbsp;</div>'+
      '<div class="campo"><label>Curso / Grupo</label>&nbsp;</div>'+
    '</div>'+
    (instruc?'<div class="instruc"><strong>Instrucciones:</strong> '+instruc+'</div>':'')+
    preguntasHTML+
    '<button class="no-print" onclick="window.print()" style="position:fixed;bottom:20px;right:20px;background:#1a2744;color:#fff;border:none;padding:12px 20px;border-radius:8px;font-size:14px;cursor:pointer;font-weight:700;box-shadow:0 4px 12px rgba(0,0,0,.2)">🖨️ Imprimir / Guardar PDF</button>'+
    '</body></html>';

  var blob = new Blob([html], {type:'text/html'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a'); a.href=url; a.download=titulo.replace(/\s+/g,'_')+'.html';
  a.click(); URL.revokeObjectURL(url);
  flash('Examen exportado — ábrelo y usa Imprimir para obtener el PDF','#16a34a');
}

// ══════════════════════════════════════════════════════
//  IMPORTAR PREGUNTAS DESDE EXCEL
// ══════════════════════════════════════════════════════
function descargarPlantillaPreguntas(){
  if(typeof XLSX==='undefined'||!XLSX){ flash('Librería Excel cargando, espera un momento…','#dc2626'); return; }

  var cab = ['id','ud','tipo','dificultad','enunciado','opcionA','opcionB','opcionC','opcionD','correcto(0-3)','respuestaModelo','explicacion','ra','ce'];
  var ejemplo1 = ['','ud1','test','basica','¿Cuál es una fuente de financiación propia?','Capital social','Préstamo bancario','Descubierto en cuenta','Pagaré','0','','Las fuentes propias no generan deuda','RA1','CE1.b'];
  var ejemplo2 = ['','ud2','vf','basica','La TAE incluye todos los gastos del producto financiero.','','','','','0','Verdadero','La TAE homogeneiza el coste real','RA3','CE3.c'];
  var ejemplo3 = ['','ud3','corta','media','¿Qué es una prima de seguro?','','','','','','Precio que paga el tomador a cambio de la cobertura del seguro','','RA4','CE4.g'];
  var ejemplo4 = ['','ud4','desarrollo','avanzada','Explica el método VAN y cómo se interpreta su resultado.','','','','','','VAN positivo = proyecto rentable. VAN negativo = no rentable.','','RA5','CE5.g'];

  var wsData = [cab, ejemplo1, ejemplo2, ejemplo3, ejemplo4];

  // Hoja de instrucciones
  var instrData = [
    ['INSTRUCCIONES DE IMPORTACIÓN'],
    [''],
    ['Columna','Descripción','Valores válidos'],
    ['id','Dejar vacío (se genera automáticamente)',''],
    ['ud','Código del bloque al que pertenece','ud1, ud2, ud3, ud4, ud5'],
    ['tipo','Tipo de pregunta','test, vf, corta, desarrollo, calculo'],
    ['dificultad','Nivel de dificultad','basica, media, avanzada'],
    ['enunciado','Texto de la pregunta (obligatorio)','Texto libre'],
    ['opcionA-D','Solo para tipo=test. Las 4 opciones','Texto libre'],
    ['correcto(0-3)','Para test: índice (0=A,1=B,2=C,3=D). Para vf: 0=Verdadero,1=Falso','0, 1, 2 o 3'],
    ['respuestaModelo','Para corta/desarrollo: respuesta modelo','Texto libre'],
    ['explicacion','Feedback que ve el alumno al corregir','Texto libre'],
    ['ra','Código del RA vinculado (opcional)','RA1, RA2...'],
    ['ce','Código del CE vinculado (opcional)','CE1.a, CE2.b...'],
  ];

  var wb = XLSX.utils.book_new();
  var ws1 = XLSX.utils.aoa_to_sheet(wsData);
  ws1['!cols'] = cab.map(function(_,i){ return {wch:[4,6,12,10,50,20,20,20,20,12,30,30,6,8][i]||15}; });
  var ws2 = XLSX.utils.aoa_to_sheet(instrData);
  ws2['!cols'] = [{wch:20},{wch:50},{wch:30}];
  XLSX.utils.book_append_sheet(wb, ws1, 'Preguntas');
  XLSX.utils.book_append_sheet(wb, ws2, 'Instrucciones');
  XLSX.writeFile(wb, 'Plantilla_Banco_Preguntas.xlsx');
  flash('Plantilla descargada — rellena y vuelve a importar','#16a34a');
}

function abrirImportarPreguntas(){
  var inp = document.createElement('input');
  inp.type='file'; inp.accept='.xlsx,.xls';
  inp.onchange = function(e){
    var file = e.target.files[0]; if(!file) return;
    var reader = new FileReader();
    reader.onload = function(ev){
      try{
        if(typeof XLSX==='undefined'||!XLSX){ flash('Librería Excel no disponible','#dc2626'); return; }
        var wb = XLSX.read(ev.target.result, {type:'binary'});
        var ws = wb.Sheets[wb.SheetNames[0]];
        var rows = XLSX.utils.sheet_to_json(ws, {header:1});
        if(rows.length<2){ flash('El archivo está vacío o no tiene el formato correcto','#dc2626'); return; }

        var header = rows[0].map(function(h){ return String(h||'').toLowerCase().replace(/[^a-z0-9]/g,''); });
        var getCol = function(row, name){
          var clean = name.replace(/[^a-z0-9]/g,'');
          var idx = header.indexOf(clean);
          return idx>=0 ? String(row[idx]||'').trim() : '';
        };

        var bancActual = getBanco();
        var importadas = 0; var errores = 0;
        var idsExistentes = {};
        bancActual.forEach(function(p){ idsExistentes[p.enunciado.slice(0,40)] = true; });

        rows.slice(1).forEach(function(row){
          if(!row || !row.length) return;
          var enun = getCol(row, 'enunciado');
          if(!enun){ errores++; return; }
          if(idsExistentes[enun.slice(0,40)]){ return; } // evitar duplicados

          var tipo = getCol(row,'tipo')||'test';
          if(!TIPOS_PREGUNTA[tipo]) tipo='test';

          var nueva = {
            id: uid2(),
            ud: getCol(row,'ud')||'ud1',
            tipo: tipo,
            dificultad: getCol(row,'dificultad')||'basica',
            enunciado: enun,
            ra: getCol(row,'ra'),
            ce: getCol(row,'ce'),
            explicacion: getCol(row,'explicacion'),
          };

          if(tipo==='test'||tipo==='vf'){
            if(tipo==='test'){
              nueva.opciones = [getCol(row,'opciona'),getCol(row,'opcionb'),getCol(row,'opcionc'),getCol(row,'opciond')];
              nueva.correcto = parseInt(getCol(row,'correcto03'))||0;
            } else {
              nueva.opciones=['Verdadero','Falso'];
              nueva.correcto=parseInt(getCol(row,'correcto03'))||0;
            }
          } else {
            nueva.respuestaModelo = getCol(row,'respuestamodelo');
          }

          bancActual.push(nueva);
          idsExistentes[enun.slice(0,40)] = true;
          importadas++;
        });

        saveBanco(bancActual);
        flash('✅ '+importadas+' preguntas importadas'+(errores?' ('+errores+' filas con error)':''),'#16a34a');
        // Recargar banco
        var root=document.getElementById('banco-root');
        if(root){ root.innerHTML=''; renderBancoVistaExtendida(root, getBanco()); }
      } catch(err){
        flash('Error al leer el archivo: '+err.message,'#dc2626');
      }
    };
    reader.readAsBinaryString(file);
  };
  inp.click();
}


// ══════════════════════════════════════════════════════
//  2. DUPLICAR PREGUNTA
// ══════════════════════════════════════════════════════
function duplicarPregunta(id){
  var banco = getBanco();
  var original = banco.find(function(p){ return p.id===id; });
  if(!original){ flash('Pregunta no encontrada','#dc2626'); return; }
  var copia = JSON.parse(JSON.stringify(original));
  copia.id = uid2();
  copia.enunciado = '[COPIA] ' + copia.enunciado;
  banco.push(copia);
  saveBanco(banco);
  flash('Pregunta duplicada — búscala al final de la lista','#16a34a');
  var root = document.getElementById('banco-root');
  if(root){ root.innerHTML=''; renderBancoVistaExtendida(root, getBanco()); }
}

// ══════════════════════════════════════════════════════
//  3. EXPORTAR SOLUCIÓN DEL EXAMEN
// ══════════════════════════════════════════════════════
function exportarSolucionHTML(){
  var seleccionados = Object.values(window._exSeleccion||{}).filter(Boolean);
  if(!seleccionados.length){ flash('Selecciona al menos una pregunta primero','#dc2626'); return; }

  var titulo    = (document.getElementById('ex-titulo')||{value:'Examen'}).value;
  var subtitulo = (document.getElementById('ex-subtitulo')||{value:''}).value;
  var fecha     = (document.getElementById('ex-fecha')||{value:''}).value;
  var totalPts  = seleccionados.reduce(function(s,e){ return s+(e.pts||1); }, 0);
  var letters   = ['A','B','C','D'];

  var filasHTML = seleccionados.map(function(entry, idx){
    var p = entry.p; var pts = entry.pts||1; var n = idx+1;
    var info = TIPOS_PREGUNTA[p.tipo]||TIPOS_PREGUNTA.test;
    var respuesta = '';

    if(p.tipo==='test'){
      var letra = letters[p.correcto]||'A';
      var texto = (p.opciones||[])[p.correcto]||'';
      respuesta = '<strong>'+letra+')</strong> '+texto;
    } else if(p.tipo==='vf'){
      respuesta = '<strong>'+(p.correcto===0?'✅ Verdadero':'❌ Falso')+'</strong>';
    } else if(p.tipo==='corta'){
      respuesta = p.respuestaModelo||'(ver criterios de corrección)';
    } else if(p.tipo==='desarrollo'){
      respuesta = p.respuestaModelo||'(ver rúbrica)';
      if(p.rubrica&&p.rubrica.length){
        respuesta += '<ul style="margin:6px 0 0 16px;font-size:12px;color:#555">'
          +p.rubrica.map(function(r){ return '<li>'+r+'</li>'; }).join('')+'</ul>';
      }
    } else if(p.tipo==='calculo'){
      var pasos = (p.solPasos||[]).map(function(pa,i){
        return '<tr><td style="padding:5px 8px;border:1px solid #ddd;font-size:12px;color:#555">'+pa.desc+'</td>'+
          '<td style="padding:5px 8px;border:1px solid #ddd;font-weight:700;font-family:monospace;color:#1a2744">'+pa.resultado+' '+(pa.unidad||'')+'</td></tr>';
      }).join('');
      respuesta = (p.solFormula?'<div style="font-family:monospace;background:#f0f4ff;padding:6px 10px;border-radius:4px;margin-bottom:8px;font-size:13px">'+p.solFormula+'</div>':'')
        +(pasos?'<table style="width:100%;border-collapse:collapse"><tr><th style="padding:5px 8px;background:#f5f5f5;border:1px solid #ddd;text-align:left;font-size:11px">Paso</th><th style="padding:5px 8px;background:#f5f5f5;border:1px solid #ddd;text-align:left;font-size:11px">Resultado</th></tr>'+pasos+'</table>':'')
        +(p.solInterp?'<div style="margin-top:8px;font-size:12px;color:#555;font-style:italic">📌 '+p.solInterp+'</div>':'');
    }

    var explic = p.explicacion ? '<div style="margin-top:6px;font-size:12px;color:#555;font-style:italic">💡 '+p.explicacion+'</div>' : '';

    return '<tr>'+
      '<td style="padding:10px 8px;border:1px solid #ddd;font-size:13px;font-weight:600;color:#1a2744;vertical-align:top;width:30px">'+n+'</td>'+
      '<td style="padding:10px 8px;border:1px solid #ddd;font-size:12px;color:#555;vertical-align:top;width:80px">'+
        '<span style="background:'+info.color+';color:'+info.ctxt+';padding:2px 6px;border-radius:10px;font-size:10px;font-weight:600">'+info.ico+' '+info.label+'</span><br>'+
        '<span style="font-size:11px;color:#888;margin-top:3px;display:block">'+pts+' pt'+(pts!==1?'s':'')+'</span>'+
      '</td>'+
      '<td style="padding:10px 8px;border:1px solid #ddd;font-size:13px;vertical-align:top">'+p.enunciado+'</td>'+
      '<td style="padding:10px 8px;border:1px solid #ddd;font-size:13px;vertical-align:top">'+respuesta+explic+'</td>'+
    '</tr>';
  }).join('');

  var html = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">'+
    '<title>SOLUCIÓN — '+titulo+'</title>'+
    '<style>'+
      'body{font-family:Arial,sans-serif;max-width:900px;margin:0 auto;padding:30px 40px;color:#1a1a1a}'+
      'h1{font-size:20px;margin-bottom:4px;color:#1a2744}'+
      '.conf{color:#dc2626;font-size:13px;font-weight:700;letter-spacing:.05em;margin-bottom:16px}'+
      'table{width:100%;border-collapse:collapse;margin-top:16px}'+
      'th{background:#1a2744;color:#fff;padding:9px 10px;text-align:left;font-size:12px}'+
      '@media print{body{padding:15px 20px}.no-print{display:none}}'+
    '</style></head><body>'+
    '<div class="conf">⚠ DOCUMENTO CONFIDENCIAL — USO EXCLUSIVO DEL PROFESOR</div>'+
    '<div style="border-bottom:3px solid #dc2626;padding-bottom:12px;margin-bottom:16px">'+
      '<h1>🔑 SOLUCIÓN — '+titulo+'</h1>'+
      '<div style="font-size:13px;color:#555">'+subtitulo+' · '+fecha+' · '+totalPts.toFixed(1)+' puntos totales</div>'+
    '</div>'+
    '<table>'+
      '<thead><tr>'+
        '<th style="width:35px">Nº</th>'+
        '<th style="width:90px">Tipo / Pts</th>'+
        '<th>Enunciado</th>'+
        '<th>Respuesta correcta</th>'+
      '</tr></thead>'+
      '<tbody>'+filasHTML+'</tbody>'+
    '</table>'+
    '<button class="no-print" onclick="window.print()" style="position:fixed;bottom:20px;right:20px;background:#dc2626;color:#fff;border:none;padding:12px 20px;border-radius:8px;font-size:14px;cursor:pointer;font-weight:700;box-shadow:0 4px 12px rgba(0,0,0,.2)">🖨️ Imprimir / PDF</button>'+
    '</body></html>';

  var blob = new Blob([html], {type:'text/html'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href=url; a.download='SOLUCION_'+titulo.replace(/\s+/g,'_')+'.html';
  a.click(); URL.revokeObjectURL(url);
  flash('Solución exportada','#16a34a');
}

// ══════════════════════════════════════════════════════
//  4. EXPORTAR BANCO COMPLETO A EXCEL
// ══════════════════════════════════════════════════════
function exportarBancoExcel(bancoPrincipal){
  if(typeof XLSX==='undefined'||!XLSX){ flash('Librería Excel cargando, espera un momento…','#dc2626'); return; }
  var banco = bancoPrincipal || getBanco();
  if(!banco.length){ flash('El banco está vacío','#dc2626'); return; }

  var cab = ['id','ud','tipo','dificultad','enunciado','opcionA','opcionB','opcionC','opcionD','correcto(0-3)','respuestaModelo','explicacion','ra','ce','etiquetas'];
  var rows = [cab];

  banco.forEach(function(p){
    var letters=['A','B','C','D'];
    rows.push([
      p.id||'',
      p.ud||'',
      p.tipo||'',
      p.dificultad||'',
      p.enunciado||'',
      (p.opciones&&p.opciones[0])||'',
      (p.opciones&&p.opciones[1])||'',
      (p.opciones&&p.opciones[2])||'',
      (p.opciones&&p.opciones[3])||'',
      p.correcto!=null?p.correcto:'',
      p.respuestaModelo||'',
      p.explicacion||'',
      p.ra||'',
      p.ce||'',
      (p.etiquetas||[]).join(', '),
    ]);
  });

  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [6,6,12,10,60,25,25,25,25,10,40,40,6,8,20].map(function(w){ return {wch:w}; });
  XLSX.utils.book_append_sheet(wb, ws, 'Banco de preguntas');

  // Hoja de estadísticas
  var stats = {}; Object.keys(TIPOS_PREGUNTA).forEach(function(t){ stats[t]=0; });
  banco.forEach(function(p){ if(stats[p.tipo]!==undefined) stats[p.tipo]++; });
  var statsData = [['Resumen del banco'],[''],['Tipo','Nº preguntas']];
  statsData.push(['TOTAL', banco.length]);
  Object.keys(stats).forEach(function(t){ statsData.push([TIPOS_PREGUNTA[t].label, stats[t]]); });
  statsData.push([''],['Bloque','Nº preguntas']);
  UNIDADES.forEach(function(u){
    var n = banco.filter(function(p){ return p.ud===u.id; }).length;
    statsData.push(['B'+u.n+' · '+u.titulo, n]);
  });
  var ws2 = XLSX.utils.aoa_to_sheet(statsData);
  ws2['!cols'] = [{wch:40},{wch:15}];
  XLSX.utils.book_append_sheet(wb, ws2, 'Estadísticas');

  var fecha = new Date().toISOString().slice(0,10);
  XLSX.writeFile(wb, 'BancoPreguntas_GestionFinanciera_'+fecha+'.xlsx');
  flash('Banco exportado — '+banco.length+' preguntas','#16a34a');
}

// ══════════════════════════════════════════════════════
//  5. ETIQUETAS LIBRES — gestión en cada pregunta
// ══════════════════════════════════════════════════════
function abrirModalEtiquetas(pregId){
  var banco = getBanco();
  var p = banco.find(function(x){ return x.id===pregId; });
  if(!p) return;
  if(!p.etiquetas) p.etiquetas = [];

  // Recoger etiquetas existentes en todo el banco para sugerir
  var todasEtiquetas = {};
  banco.forEach(function(q){ (q.etiquetas||[]).forEach(function(e){ todasEtiquetas[e]=true; }); });
  var sugerencias = Object.keys(todasEtiquetas).filter(function(e){ return !p.etiquetas.includes(e); });

  abrirModal('🏷 Etiquetas — '+p.enunciado.slice(0,40)+'…',
    '<div class="fg">'+
      '<label class="fl">Etiquetas actuales</label>'+
      '<div id="etiq-current" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;min-height:28px">'+
        p.etiquetas.map(function(e){
          return '<span style="background:var(--navy);color:#fff;padding:3px 10px;border-radius:20px;font-size:12px;display:flex;align-items:center;gap:5px">'+
            e+'<button onclick="etiquetaEliminar(\''+pregId+'\',\''+e+'\')" style="background:none;border:none;color:rgba(255,255,255,.7);cursor:pointer;font-size:13px;padding:0;line-height:1">×</button></span>';
        }).join('')+
      '</div>'+
      '<label class="fl">Añadir etiqueta</label>'+
      '<div style="display:flex;gap:7px">'+
        '<input class="fi" id="etiq-nueva" placeholder="Ej: parcial1, recuperación, ampliación…" style="flex:1">'+
        '<button class="btn btn-p btn-sm" onclick="etiquetaAnadir(\''+pregId+'\')">Añadir</button>'+
      '</div>'+
      (sugerencias.length?
        '<div style="margin-top:10px"><div style="font-size:11px;color:var(--muted);margin-bottom:6px">Sugerencias del banco:</div>'+
        '<div style="display:flex;flex-wrap:wrap;gap:5px">'+
          sugerencias.map(function(s){
            return '<button class="chip" onclick="document.getElementById(\'etiq-nueva\').value=\''+s+'\'">'+s+'</button>';
          }).join('')+
        '</div></div>':'')+
    '</div>',
    '<button class="btn btn-g" onclick="cerrarModal()">Cerrar</button>'
  );
  window._etiqPregId = pregId;
}

function etiquetaAnadir(pregId){
  var inp = document.getElementById('etiq-nueva');
  var val = inp ? inp.value.trim() : '';
  if(!val) return;
  var banco = getBanco();
  var p = banco.find(function(x){ return x.id===pregId; });
  if(!p) return;
  if(!p.etiquetas) p.etiquetas=[];
  val.split(',').map(function(s){ return s.trim(); }).filter(Boolean).forEach(function(e){
    if(!p.etiquetas.includes(e)) p.etiquetas.push(e);
  });
  saveBanco(banco);
  cerrarModal();
  abrirModalEtiquetas(pregId);
}

function etiquetaEliminar(pregId, etiqueta){
  var banco=getBanco();
  var p=banco.find(function(x){ return x.id===pregId; });
  if(!p||!p.etiquetas) return;
  p.etiquetas=p.etiquetas.filter(function(e){ return e!==etiqueta; });
  saveBanco(banco);
  cerrarModal();
  abrirModalEtiquetas(pregId);
}


function guardarPreguntaExt(tipo, editId){
  var enun=(document.getElementById('bqe-enun')||{value:''}).value.trim();
  if(!enun){ flash('Escribe el enunciado','#dc2626'); return; }

  var nueva={
    id: editId||uid2(),
    ud:          (document.getElementById('bqe-ud')||{value:'ud1'}).value,
    tipo:        tipo,
    dificultad:  (document.getElementById('bqe-dif')||{value:'basica'}).value,
    enunciado:   enun,
    ra:          (document.getElementById('bqe-ra')||{value:''}).value.trim(),
    ce:          (document.getElementById('bqe-ce')||{value:''}).value.trim(),
    explicacion: (document.getElementById('bqe-exp')||{value:''}).value.trim(),
  };

  if(tipo==='test'){
    var radio=document.querySelector('input[name="bqe-correct"]:checked');
    if(!radio){ flash('Selecciona la respuesta correcta','#dc2626'); return; }
    var opts=[]; document.querySelectorAll('#editor-form-area input[data-idx]').forEach(function(i){ opts[parseInt(i.dataset.idx)]=i.value.trim(); });
    if(opts.some(function(o){return !o;})){ flash('Rellena todas las opciones','#dc2626'); return; }
    nueva.opciones=opts; nueva.correcto=parseInt(radio.value);

  } else if(tipo==='vf'){
    var radio2=document.querySelector('input[name="bqe-correct"]:checked');
    if(!radio2){ flash('Selecciona Verdadero o Falso','#dc2626'); return; }
    nueva.opciones=['Verdadero','Falso']; nueva.correcto=parseInt(radio2.value);

  } else if(tipo==='corta'){
    var rm=(document.getElementById('bqe-resp-modelo')||{value:''}).value.trim();
    if(!rm){ flash('Escribe la respuesta modelo','#dc2626'); return; }
    nueva.respuestaModelo=rm;
    var pc=(document.getElementById('bqe-palabras')||{value:''}).value;
    nueva.palabrasClave=pc.split(',').map(function(s){return s.trim();}).filter(Boolean);

  } else if(tipo==='desarrollo'){
    var rubrica=[];
    document.querySelectorAll('#bqe-rubrica-cont input').forEach(function(i){ if(i.value.trim()) rubrica.push(i.value.trim()); });
    nueva.rubrica=rubrica;
    nueva.respuestaModelo=(document.getElementById('bqe-resp-modelo')||{value:''}).value.trim();

  } else if(tipo==='calculo'||tipo==='formulario'){
    var ok = guardarCalculoPregunta(tipo, editId, nueva);
    if(!ok) return;
  } else if(tipo==='mapa'){
    var fa=document.getElementById('editor-form-area');
    nueva.nodos      = fa && fa._getNodos      ? fa._getNodos()      : [];
    nueva.conexiones = fa && fa._getConexiones ? fa._getConexiones() : [];
    if(!nueva.nodos.length){ flash('Añade al menos un nodo al mapa','#dc2626'); return; }
  }

  var banco=getBanco();
  if(editId){
    var idx=banco.findIndex(function(p){return p.id===editId;});
    if(idx>=0) banco[idx]=nueva; else banco.push(nueva);
  } else {
    banco.push(nueva);
  }
  saveBanco(banco);

  var ov=document.getElementById('editor-pregunta-overlay');
  if(ov){ ov.remove(); document.body.style.overflow=''; }

  var root=document.getElementById('banco-root'); if(root) initBanco();
  flash((editId?'Pregunta actualizada':'Pregunta añadida al banco'),'#16a34a');
}


// ══════════════════════════════════════════════════════
//  ACTIVIDADES UD — integradas con Banco de Preguntas
// ══════════════════════════════════════════════════════

