// ── CSS para el editor de fórmulas y cálculo ──────────
var CALC_CSS = `
.formula-render{font-family:'IBM Plex Mono',monospace;font-size:1.1rem;background:var(--surface2);border-left:4px solid var(--navy);border-radius:0 var(--r) var(--r) 0;padding:12px 16px;margin:8px 0;line-height:1.8;overflow-x:auto;white-space:nowrap}
.formula-render sup{font-size:.65em;vertical-align:super}
.formula-render sub{font-size:.65em;vertical-align:sub}
.sym-btn{background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:5px 9px;font-size:13px;cursor:pointer;font-family:'IBM Plex Mono',monospace;transition:background .1s}
.sym-btn:hover{background:var(--navy);color:#fff}
.paso-box{border:1px solid var(--border);border-radius:var(--r);padding:12px 14px;margin-bottom:10px;background:var(--surface)}
.paso-num{width:26px;height:26px;border-radius:50%;background:var(--navy);color:var(--gold-light);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0}
.calc-input{padding:8px 12px;border:2px solid var(--border-md);border-radius:var(--r);font-family:'IBM Plex Mono',monospace;font-size:1rem;font-weight:600;text-align:center;outline:none;background:var(--surface);width:140px;transition:border-color .2s}
.calc-input:focus{border-color:var(--navy)}
.calc-input.ok{border-color:var(--green);background:var(--green-bg)}
.calc-input.ko{border-color:var(--red);background:var(--red-bg)}
.var-chip{display:inline-flex;align-items:center;gap:5px;background:var(--navy);color:var(--gold-light);border-radius:20px;padding:3px 11px;font-size:12px;font-family:'IBM Plex Mono',monospace;margin:3px}
`;

// Inyectar CSS en el head si no está
(function(){
  if(document.getElementById('banco-extended-css')) return;
  var s = document.createElement('style');
  s.id = 'banco-extended-css';
  s.textContent = CALC_CSS;
  document.head.appendChild(s);
})();

// ── Preguntas de ejemplo ampliadas ────────────────────
function addEjemplosExtendidos(){
  var banco = getBanco();
  // Solo añadir si no hay preguntas de tipo calculo/formulario
  var yaHay = banco.some(function(p){ return p.tipo==='calculo'||p.tipo==='formulario'||p.tipo==='corta'||p.tipo==='desarrollo'; });
  if(yaHay) return;

  var nuevas = [
    // ── RESPUESTA CORTA ──
    {id:uid2(),ud:'ud1',tipo:'corta',dificultad:'basica',
     enunciado:'¿Qué diferencia existe entre el Balance de Situación y el Inventario patrimonial?',
     respuestaModelo:'El inventario es un listado detallado de todos los elementos patrimoniales con su descripción y valor. El Balance de Situación es un estado contable que agrupa esos elementos en Activo, Pasivo y Neto mostrando el equilibrio patrimonial en un formato estructurado.',
     palabrasClave:['inventario','balance','activo','pasivo','neto','agrupación'],
     explicacion:'Ambos documentos recogen el patrimonio, pero el balance organiza los elementos en masa patrimoniales y muestra visualmente la ecuación fundamental.',
     ra:'RA1',ce:'CE1.2'},

    {id:uid2(),ud:'ud4',tipo:'corta',dificultad:'media',
     enunciado:'Explica qué es un rappel sobre ventas y cómo se contabiliza.',
     respuestaModelo:'Un rappel sobre ventas es un descuento adicional concedido al cliente por superar un volumen de compras acordado. Se contabiliza en la cuenta (709) "Rappels sobre ventas" con cargo, reduciendo el ingreso neto por ventas.',
     palabrasClave:['rappel','descuento','volumen','709','ventas'],
     explicacion:'Los rappels son descuentos por volumen acumulado, distintos de los descuentos en factura (que van en cuenta 706).',
     ra:'RA4',ce:'CE4.3'},

    // ── DESARROLLO ──
    {id:uid2(),ud:'ud7',tipo:'desarrollo',dificultad:'avanzada',
     enunciado:'Una empresa presenta los siguientes datos: Activo Corriente 45.000€, Pasivo Corriente 30.000€, Existencias 12.000€, Total Activo 120.000€, Recursos Propios 60.000€, Deuda Total 60.000€. Analiza la situación financiera calculando los ratios de liquidez general, liquidez inmediata y endeudamiento. Interpreta los resultados.',
     rubrica:[
       'Cálculo correcto ratio liquidez general (AC/PC): 1,5 pts',
       'Cálculo correcto ratio liquidez inmediata ((AC-Exist)/PC): 1,5 pts',
       'Cálculo correcto ratio endeudamiento (Deuda/RP): 1,5 pts',
       'Interpretación de los tres ratios: 3 pts',
       'Conclusión global sobre la salud financiera: 2,5 pts',
     ],
     respuestaModelo:'Liquidez general=45.000/30.000=1,5 (correcto, >1). Liquidez inmediata=(45.000-12.000)/30.000=1,1 (buena, >1). Endeudamiento=60.000/60.000=1 (equilibrado). La empresa tiene buena liquidez a corto plazo pero conviene vigilar el nivel de endeudamiento.',
     explicacion:'Un ratio de liquidez entre 1,5 y 2 es óptimo. Un endeudamiento =1 significa igual deuda que recursos propios, lo que es una situación de equilibrio aunque podría mejorarse.',
     ra:'RA7',ce:'CE7.3'},

    // ── CÁLCULO FINANCIERO ──
    {id:uid2(),ud:'ud6',tipo:'calculo',dificultad:'media',
     enunciado:'Calcula el Valor Actual Neto (VAN) de una inversión con los siguientes datos: Inversión inicial (I₀) = 10.000€, Flujo de caja año 1 = 4.000€, Flujo de caja año 2 = 5.000€, Flujo de caja año 3 = 4.500€, Tasa de descuento (k) = 8%.',
     formula:'VAN = −I₀ + FC₁/(1+k)¹ + FC₂/(1+k)² + FC₃/(1+k)³',
     variables:[
       {simbolo:'I₀', descripcion:'Inversión inicial', valor:10000, unidad:'€'},
       {simbolo:'FC₁', descripcion:'Flujo de caja año 1', valor:4000, unidad:'€'},
       {simbolo:'FC₂', descripcion:'Flujo de caja año 2', valor:5000, unidad:'€'},
       {simbolo:'FC₃', descripcion:'Flujo de caja año 3', valor:4500, unidad:'€'},
       {simbolo:'k', descripcion:'Tasa de descuento', valor:0.08, unidad:'(8%)'},
     ],
     pasos:[
       {desc:'Valor actual FC año 1: FC₁ / (1+k)¹', resultado:3703.70, tolerancia:5, unidad:'€'},
       {desc:'Valor actual FC año 2: FC₂ / (1+k)²', resultado:4286.69, tolerancia:5, unidad:'€'},
       {desc:'Valor actual FC año 3: FC₃ / (1+k)³', resultado:3572.06, tolerancia:5, unidad:'€'},
       {desc:'VAN total: −I₀ + VA₁ + VA₂ + VA₃', resultado:1562.45, tolerancia:10, unidad:'€'},
     ],
     interpretacion:'Como el VAN es positivo (>0), la inversión ES RENTABLE y crea valor para la empresa. Se debería ACEPTAR.',
     explicacion:'El VAN descuenta los flujos futuros al momento presente. VAN>0 → aceptar; VAN<0 → rechazar; VAN=0 → indiferente.',
     ra:'RA6',ce:'CE6.4'},

    {id:uid2(),ud:'ud6',tipo:'calculo',dificultad:'media',
     enunciado:'Calcula la Tasa Interna de Rentabilidad (TIR) de una inversión. Inversión inicial = 5.000€. Flujo año 1 = 2.500€. Flujo año 2 = 2.500€. Flujo año 3 = 1.500€. Compara con el coste de capital k = 6%.',
     formula:'0 = −I₀ + FC₁/(1+TIR)¹ + FC₂/(1+TIR)² + FC₃/(1+TIR)³',
     variables:[
       {simbolo:'I₀', descripcion:'Inversión inicial', valor:5000, unidad:'€'},
       {simbolo:'FC₁', descripcion:'Flujo año 1', valor:2500, unidad:'€'},
       {simbolo:'FC₂', descripcion:'Flujo año 2', valor:2500, unidad:'€'},
       {simbolo:'FC₃', descripcion:'Flujo año 3', valor:1500, unidad:'€'},
       {simbolo:'k', descripcion:'Coste de capital', valor:0.06, unidad:'(6%)'},
     ],
     pasos:[
       {desc:'Suma de flujos sin descontar: FC₁ + FC₂ + FC₃', resultado:6500, tolerancia:1, unidad:'€'},
       {desc:'TIR aproximada (interpolación) — introduce el porcentaje', resultado:24.07, tolerancia:2, unidad:'%'},
       {desc:'¿TIR > k? Escribe 1 si SÍ es rentable, 0 si NO', resultado:1, tolerancia:0, unidad:''},
     ],
     interpretacion:'TIR ≈ 24% > k = 6%, por tanto la inversión es rentable y debe ACEPTARSE. Cuanto mayor sea la diferencia TIR−k, más rentable es el proyecto.',
     explicacion:'La TIR es el tipo de interés que hace el VAN=0. Si TIR>k se acepta; si TIR<k se rechaza.',
     ra:'RA6',ce:'CE6.4'},

    {id:uid2(),ud:'ud5',tipo:'calculo',dificultad:'basica',
     enunciado:'Calcula la cuota de amortización anual por el método lineal de una máquina con: Precio de adquisición = 24.000€, Valor residual = 4.000€, Vida útil = 5 años.',
     formula:'Cuota = (Valor adquisición − Valor residual) / Vida útil',
     variables:[
       {simbolo:'VA', descripcion:'Valor de adquisición', valor:24000, unidad:'€'},
       {simbolo:'VR', descripcion:'Valor residual', valor:4000, unidad:'€'},
       {simbolo:'n', descripcion:'Vida útil', valor:5, unidad:'años'},
     ],
     pasos:[
       {desc:'Base amortizable: VA − VR', resultado:20000, tolerancia:1, unidad:'€'},
       {desc:'Cuota anual: Base / n', resultado:4000, tolerancia:1, unidad:'€/año'},
       {desc:'Valor contable al final del año 3: VA − (Cuota × 3)', resultado:12000, tolerancia:1, unidad:'€'},
     ],
     interpretacion:'Cada año se amortiza 4.000€. Al final de los 5 años el valor neto contable será igual al valor residual (4.000€).',
     explicacion:'El método lineal reparte la base amortizable en partes iguales cada año. Es el método más sencillo y habitual.',
     ra:'RA5',ce:'CE5.2'},

    {id:uid2(),ud:'ud7',tipo:'calculo',dificultad:'media',
     enunciado:'Calcula el Umbral de Rentabilidad (punto muerto) de una empresa con: Costes fijos totales = 60.000€, Precio de venta unitario = 25€, Coste variable unitario = 10€.',
     formula:'Q* = Costes Fijos / (Precio − Coste Variable Unitario)',
     variables:[
       {simbolo:'CF', descripcion:'Costes fijos totales', valor:60000, unidad:'€'},
       {simbolo:'P', descripcion:'Precio de venta unitario', valor:25, unidad:'€/ud'},
       {simbolo:'CVu', descripcion:'Coste variable unitario', valor:10, unidad:'€/ud'},
     ],
     pasos:[
       {desc:'Margen de contribución unitario: P − CVu', resultado:15, tolerancia:0.1, unidad:'€/ud'},
       {desc:'Umbral de rentabilidad (unidades): CF / (P − CVu)', resultado:4000, tolerancia:1, unidad:'unidades'},
       {desc:'Umbral de rentabilidad en ventas: Q* × P', resultado:100000, tolerancia:10, unidad:'€'},
     ],
     interpretacion:'La empresa necesita vender 4.000 unidades (100.000€ en ventas) para cubrir todos sus costes. Por encima de esa cifra empieza a generar beneficios.',
     explicacion:'El punto muerto o umbral de rentabilidad indica el nivel mínimo de actividad para no tener pérdidas. El margen de contribución es la aportación de cada unidad a cubrir los costes fijos.',
     ra:'RA7',ce:'CE7.4'},

    // ── FORMULARIO PASO A PASO ──
    {id:uid2(),ud:'ud3',tipo:'formulario',dificultad:'media',
     enunciado:'Registra el siguiente asiento contable: La empresa compra mercaderías por 5.000€ más IVA al 21%, pagando el 40% al contado y el resto queda pendiente de pago.',
     pasos:[
       {desc:'¿Cuánto es el IVA soportado? (Base × 21%)', resultado:1050, tolerancia:1, unidad:'€'},
       {desc:'¿Cuánto se paga al contado? (Total × 40%)', resultado:2420, tolerancia:1, unidad:'€'},
       {desc:'¿Cuánto queda a deber a proveedores?', resultado:3630, tolerancia:1, unidad:'€'},
       {desc:'¿Cuál es el DEBE total del asiento?', resultado:6050, tolerancia:1, unidad:'€'},
     ],
     formula:'(600) Compras = 5.000€ | (472) IVA Soportado = 1.050€ || (572) Banco = 2.420€ | (400) Proveedores = 3.630€',
     interpretacion:'El total del asiento es 6.050€. Se recuerda: DEBE = Compras + IVA = HABER = Banco + Proveedores.',
     explicacion:'En compras a crédito parcial: el IVA siempre va al DEBE (472), las compras al DEBE (600) y el pago se divide entre efectivo (HABER 572) y deuda con proveedores (HABER 400).',
     ra:'RA4',ce:'CE4.2'},
  ];

  var banco2 = getBanco().concat(nuevas);
  saveBanco(banco2);
}

// ══════════════════════════════════════════════════════
//  OVERRIDE initBanco — añade tipos ampliados
// ══════════════════════════════════════════════════════
var _origInitBanco = initBanco;
function initBanco(){
  initBancoConEjemplos();
  addEjemplosExtendidos();
  var bancoDB = getBanco();
  var root = document.getElementById('banco-root');
  if(!root) return;
  root.innerHTML = '';
  renderBancoVistaExtendida(root, bancoDB);
}

// ── Render banco extendido ────────────────────────────
function renderBancoVistaExtendida(root, banco){
  // Estado de filtro activo (tipo o grupo)
  var filtroActivo = 'todas';
  var filtroUD = 'todas';
  var seleccion = {}; // id -> true para seleccionados

  // ── Cabecera ──────────────────────────────────────────
  var ph = document.createElement('div'); ph.className='ph';
  var phLeft = document.createElement('div');
  phLeft.innerHTML = '<h1 class="pt">Banco de Preguntas</h1>'+
    '<p class="ps">Preguntas teóricas y prácticas · Módulo Gestión Financiera · CFGS AF</p>';
  var phBtns = document.createElement('div');
  phBtns.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;align-items:center';

  var btnNueva = document.createElement('button'); btnNueva.className='btn btn-p';
  btnNueva.innerHTML='+ Nueva pregunta'; btnNueva.onclick=function(){ abrirModalNuevaPreguntaExt(); };

  var btnExamen = document.createElement('button'); btnExamen.className='btn btn-gold';
  btnExamen.style.cssText='background:var(--gold);color:var(--navy);font-weight:700';
  btnExamen.innerHTML='📄 Crear examen'; btnExamen.onclick=function(){ abrirModalCrearExamen(banco); };

  var btnImportar = document.createElement('button'); btnImportar.className='btn btn-g';
  btnImportar.innerHTML='⬆ Importar preguntas'; btnImportar.onclick=function(){ abrirImportarPreguntas(); };

  var btnPlantilla = document.createElement('button'); btnPlantilla.className='btn btn-g';
  btnPlantilla.innerHTML='📋 Plantilla Excel'; btnPlantilla.onclick=function(){ descargarPlantillaPreguntas(); };

  var btnExportBanco = document.createElement('button'); btnExportBanco.className='btn btn-g';
  btnExportBanco.innerHTML='⬇ Exportar banco'; btnExportBanco.onclick=function(){ exportarBancoExcel(banco); };

  phBtns.appendChild(btnNueva); phBtns.appendChild(btnExamen);
  phBtns.appendChild(btnImportar); phBtns.appendChild(btnPlantilla); phBtns.appendChild(btnExportBanco);
  ph.appendChild(phLeft); ph.appendChild(phBtns);
  root.appendChild(ph);

  // ── Estadísticas como botones de filtro ───────────────
  var stats = {todas: banco.length};
  Object.keys(TIPOS_PREGUNTA).forEach(function(t){ stats[t]=0; });
  banco.forEach(function(p){ if(stats[p.tipo]!==undefined) stats[p.tipo]++; });

  var statsRow = document.createElement('div');
  statsRow.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;margin-bottom:1.25rem';

  // Tarjeta "Todas"
  var scTodas = document.createElement('div');
  scTodas.className = 'sc';
  scTodas.style.cssText = 'border-left:3px solid var(--navy);cursor:pointer;transition:all .15s;border:2px solid var(--navy);background:var(--navy)';
  scTodas.id = 'stat-btn-todas';
  scTodas.innerHTML = '<div class="sl" style="color:rgba(255,255,255,.7)">📚 Todas</div>'+
    '<div class="sn" style="font-size:20px;color:#fff">'+banco.length+'</div>';
  scTodas.onclick = function(){ aplicarFiltro('todas'); };
  statsRow.appendChild(scTodas);

  // Tarjeta por tipo
  Object.keys(TIPOS_PREGUNTA).forEach(function(tipo){
    var info = TIPOS_PREGUNTA[tipo];
    var sc = document.createElement('div');
    sc.className = 'sc';
    sc.style.cssText = 'border-left:3px solid '+info.ctxt+';cursor:pointer;transition:all .15s';
    sc.id = 'stat-btn-'+tipo;
    sc.innerHTML = '<div class="sl">'+info.ico+' '+info.label+'</div>'+
      '<div class="sn" style="font-size:20px">'+stats[tipo]+'</div>';
    sc.onclick = (function(t){ return function(){ aplicarFiltro(t); }; })(tipo);
    statsRow.appendChild(sc);
  });
  root.appendChild(statsRow);

  // ── Barra de herramientas: filtro UD + borrado múltiple ─
  var toolbar = document.createElement('div');
  toolbar.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px';

  // Filtro por etiqueta
  var selEtiq = document.createElement('select'); selEtiq.className='fs'; selEtiq.style.cssText='width:auto;font-size:13px;padding:6px 10px';
  selEtiq.id = 'banco-filtro-etiq';
  function actualizarFiltroEtiquetas(){
    var todasEtiq = {};
    banco.forEach(function(p){ (p.etiquetas||[]).forEach(function(e){ todasEtiq[e]=true; }); });
    selEtiq.innerHTML = '<option value="todas">Todas las etiquetas</option>'+
      Object.keys(todasEtiq).sort().map(function(e){ return '<option value="'+e+'">🏷 '+e+'</option>'; }).join('');
  }
  actualizarFiltroEtiquetas();

  var selUD2 = document.createElement('select'); selUD2.className='fs'; selUD2.style.cssText='width:auto;font-size:13px;padding:6px 10px';
  selUD2.innerHTML = '<option value="todas">Todas las unidades</option>'+
    UNIDADES.map(function(u){ return '<option value="'+u.id+'">B'+u.n+' · '+u.titulo.slice(0,25)+'</option>'; }).join('');
  selUD2.onchange = function(){ filtroUD = this.value; renderLista(); };
  selEtiq.onchange = function(){ filtroEtiq = this.value; renderLista(); };

  // Botón seleccionar todo / deseleccionar
  var btnSelAll = document.createElement('button'); btnSelAll.className='btn btn-g btn-sm';
  btnSelAll.textContent = '☐ Seleccionar todo';
  btnSelAll.onclick = function(){
    var bancFilt = getBancoFiltrado();
    var todosSeleccionados = bancFilt.every(function(p){ return seleccion[p.id]; });
    if(todosSeleccionados){
      bancFilt.forEach(function(p){ delete seleccion[p.id]; });
      btnSelAll.textContent = '☐ Seleccionar todo';
    } else {
      bancFilt.forEach(function(p){ seleccion[p.id] = true; });
      btnSelAll.textContent = '☑ Deseleccionar todo';
    }
    actualizarBarraBorrado();
    renderLista();
  };

  toolbar.appendChild(selUD2);
  toolbar.appendChild(selEtiq);
  toolbar.appendChild(btnSelAll);
  root.appendChild(toolbar);

  // ── Barra de borrado múltiple (aparece al seleccionar) ──
  var barraBorrado = document.createElement('div');
  barraBorrado.id = 'banco-barra-borrado';
  barraBorrado.style.cssText = 'display:none;align-items:center;gap:10px;padding:10px 14px;background:var(--red-bg);border-radius:var(--r);margin-bottom:14px;border:1px solid #fecaca';
  barraBorrado.innerHTML = '<span id="banco-sel-count" style="font-size:13px;font-weight:600;color:var(--red);flex:1">0 seleccionadas</span>'+
    '<button class="btn btn-d btn-sm" id="banco-btn-borrar-sel">🗑 Eliminar seleccionadas</button>'+
    '<button class="btn btn-g btn-sm" id="banco-btn-cancelar-sel">✕ Cancelar</button>';
  root.appendChild(barraBorrado);

  // Contenedor de lista
  var listaCont = document.createElement('div');
  root.appendChild(listaCont);

  // ── Funciones internas ────────────────────────────────
  var filtroEtiq = 'todas';

  function getBancoFiltrado(){
    return banco.filter(function(p){
      var tipoOk  = filtroActivo==='todas' || p.tipo===filtroActivo;
      var udOk    = filtroUD==='todas' || p.ud===filtroUD;
      var etiqOk  = filtroEtiq==='todas' || (p.etiquetas&&p.etiquetas.includes(filtroEtiq));
      return tipoOk && udOk && etiqOk;
    });
  }

  function aplicarFiltro(tipo){
    filtroActivo = tipo;
    // Resaltar tarjeta activa
    statsRow.querySelectorAll('.sc').forEach(function(el){
      var esActivo = el.id === 'stat-btn-'+tipo;
      if(tipo==='todas') esActivo = el.id === 'stat-btn-todas';
      if(esActivo){
        el.style.border = '2px solid var(--navy)';
        el.style.background = 'var(--navy)';
        el.querySelectorAll('.sl,.sn').forEach(function(t){ t.style.color=t.className==='sn'?'#fff':'rgba(255,255,255,.7)'; });
      } else {
        el.style.border = '';
        el.style.background = '';
        el.querySelectorAll('.sl,.sn').forEach(function(t){ t.style.color=''; });
      }
    });
    seleccion = {};
    actualizarBarraBorrado();
    renderLista();
  }

  function actualizarBarraBorrado(){
    var nSel = Object.keys(seleccion).filter(function(id){ return seleccion[id]; }).length;
    var bar = document.getElementById('banco-barra-borrado');
    var cnt = document.getElementById('banco-sel-count');
    if(bar){ bar.style.display = nSel>0 ? 'flex' : 'none'; }
    if(cnt){ cnt.textContent = nSel+' pregunta'+(nSel!==1?'s':'')+' seleccionada'+(nSel!==1?'s':''); }
  }

  // Borrar seleccionadas
  document.getElementById('banco-btn-borrar-sel') && document.getElementById('banco-btn-borrar-sel').addEventListener('click', function(){});
  setTimeout(function(){
    var btnBorrar = document.getElementById('banco-btn-borrar-sel');
    var btnCancel = document.getElementById('banco-btn-cancelar-sel');
    if(btnBorrar) btnBorrar.onclick = function(){
      var ids = Object.keys(seleccion).filter(function(id){ return seleccion[id]; });
      if(!ids.length) return;
      if(!confirm('¿Eliminar las '+ids.length+' preguntas seleccionadas? Esta acción no se puede deshacer.')) return;
      var b = getBanco().filter(function(p){ return !seleccion[p.id]; });
      saveBanco(b);
      banco = b;
      seleccion = {};
      // Actualizar stats
      stats = {todas: banco.length};
      Object.keys(TIPOS_PREGUNTA).forEach(function(t){ stats[t]=0; });
      banco.forEach(function(p){ if(stats[p.tipo]!==undefined) stats[p.tipo]++; });
      statsRow.querySelectorAll('.sc').forEach(function(sc){
        var tipo = sc.id.replace('stat-btn-','');
        var numEl = sc.querySelector('.sn');
        if(numEl) numEl.textContent = tipo==='todas' ? banco.length : (stats[tipo]||0);
      });
      actualizarBarraBorrado();
      renderLista();
      flash('Preguntas eliminadas','#16a34a');
    };
    if(btnCancel) btnCancel.onclick = function(){
      seleccion = {};
      actualizarBarraBorrado();
      renderLista();
    };
  }, 50);

  function renderLista(){
    listaCont.innerHTML = '';
    var filtrado = getBancoFiltrado();
    if(!filtrado.length){
      listaCont.innerHTML = '<div class="card" style="text-align:center;padding:2rem;color:var(--muted)">'+
        '<div style="font-size:2rem;margin-bottom:8px">📭</div>'+
        '<div>No hay preguntas con estos filtros.</div></div>';
      return;
    }
    filtrado.forEach(function(p){
      var card = renderTarjetaPreguntaExt(p);
      // Añadir checkbox de selección
      var hdr = card.querySelector('div[style*="cursor:pointer"]');
      if(hdr){
        var chkWrap = document.createElement('div');
        chkWrap.style.cssText = 'display:flex;align-items:flex-start;padding:14px 0 14px 14px';
        var chk = document.createElement('input'); chk.type='checkbox';
        chk.style.cssText = 'width:16px;height:16px;cursor:pointer;margin-top:2px;flex-shrink:0';
        chk.checked = !!seleccion[p.id];
        chk.onclick = function(e){ e.stopPropagation(); seleccion[p.id] = this.checked; actualizarBarraBorrado(); };
        chkWrap.appendChild(chk);
        card.insertBefore(chkWrap, card.firstChild);
        card.style.display = 'flex';
        card.style.alignItems = 'flex-start';
        // Make the rest of the card fill remaining space
        var inner = card.children[1];
        if(inner) inner.style.flex = '1';
      }
      listaCont.appendChild(card);
    });
  }

  // Inicializar con filtro "todas" activo
  aplicarFiltro('todas');
}

function renderBancoListaExt(cont, banco){
  cont.innerHTML='';
  if(!banco.length){
    cont.innerHTML='<div class="card" style="text-align:center;padding:2rem;color:var(--muted)">'+
      '<div style="font-size:2rem;margin-bottom:8px">📭</div><div>No hay preguntas con estos filtros.</div></div>';
    return;
  }
  banco.forEach(function(p){
    cont.appendChild(renderTarjetaPreguntaExt(p));
  });
}

function renderTarjetaPreguntaExt(p){
  var info=TIPOS_PREGUNTA[p.tipo]||TIPOS_PREGUNTA.test;
  var udObj=UNIDADES.find(function(u){return u.id===p.ud;})||{n:'?',titulo:'?'};
  var difColor={basica:'b-green',media:'b-amber',avanzada:'b-red'};
  var difLabel={basica:'⭐ Básica',media:'⭐⭐ Media',avanzada:'⭐⭐⭐ Avanzada'};
  var letters=['A','B','C','D'];

  var card=document.createElement('div');
  card.className='card';
  card.style.cssText='margin-bottom:10px;border-left:4px solid '+info.ctxt+';padding:0;overflow:hidden';

  // ── CABECERA SIEMPRE VISIBLE ─────────────────────────
  var hdr=document.createElement('div');
  hdr.style.cssText='display:flex;align-items:flex-start;gap:10px;padding:14px 16px;cursor:pointer;user-select:none';

  var leftPart=document.createElement('div'); leftPart.style.flex='1';
  leftPart.innerHTML=
    '<div style="display:flex;align-items:center;gap:7px;margin-bottom:6px;flex-wrap:wrap">'+
      '<span style="background:'+info.color+';color:'+info.ctxt+';font-size:11px;padding:3px 9px;border-radius:20px;font-weight:600">'+info.ico+' '+info.label+'</span>'+
      '<span class="badge b-blue" style="font-size:10px">UD'+udObj.n+'</span>'+
      '<span class="badge '+(difColor[p.dificultad]||'b-gray')+'" style="font-size:10px">'+difLabel[p.dificultad]+'</span>'+
      (p.ra?'<span class="badge b-purple" style="font-size:10px">'+p.ra+(p.ce?' · '+p.ce:'')+'</span>':'')+
      ((p.etiquetas&&p.etiquetas.length)?p.etiquetas.map(function(e){ return '<span style="background:#fef3c7;color:#92400e;font-size:10px;padding:2px 7px;border-radius:20px;font-weight:600">🏷 '+e+'</span>'; }).join(''):'')+
    '</div>'+
    '<div style="font-size:14px;font-weight:500;line-height:1.5">'+p.enunciado+'</div>';

  // Botones + toggle
  var rightPart=document.createElement('div'); rightPart.style.cssText='display:flex;gap:5px;flex-shrink:0;align-items:flex-start';
  var btnPrev=document.createElement('button');
  btnPrev.className='btn btn-g btn-sm'; btnPrev.title='Previsualizar';
  btnPrev.innerHTML='👁 Vista previa';
  var btnE=document.createElement('button'); btnE.className='btn btn-g btn-sm'; btnE.title='Editar'; btnE.textContent='✎';
  btnE.onclick=function(e){ e.stopPropagation(); abrirModalNuevaPreguntaExt(p.id); };
  var btnTag=document.createElement('button'); btnTag.className='btn btn-g btn-sm'; btnTag.title='Gestionar etiquetas';
  btnTag.textContent='🏷';
  btnTag.onclick=(function(pid){ return function(e){ e.stopPropagation(); abrirModalEtiquetas(pid); }; })(p.id);
  var btnD=document.createElement('button'); btnD.className='btn btn-d btn-sm'; btnD.title='Eliminar'; btnD.textContent='✕';
  btnD.onclick=function(e){ e.stopPropagation(); borrarPregunta(p.id); };
  var btnCopy=document.createElement('button'); btnCopy.className='btn btn-g btn-sm'; btnCopy.title='Duplicar pregunta'; btnCopy.textContent='⧉';
  btnCopy.onclick=(function(pid){ return function(e){ e.stopPropagation(); duplicarPregunta(pid); }; })(p.id);
  rightPart.appendChild(btnPrev); rightPart.appendChild(btnE); rightPart.appendChild(btnTag); rightPart.appendChild(btnCopy); rightPart.appendChild(btnD);

  hdr.appendChild(leftPart); hdr.appendChild(rightPart);
  card.appendChild(hdr);

  // ── ZONA DE PREVISUALIZACIÓN (oculta por defecto) ───
  var prevZone=document.createElement('div');
  prevZone.style.cssText='display:none;border-top:1px solid var(--border);background:var(--surface2)';

  // Contenido de previsualización según tipo
  var innerPrev=document.createElement('div');
  innerPrev.style.cssText='padding:16px 18px';

  if(p.tipo==='test'){
    var optsList=document.createElement('div'); optsList.style.cssText='display:flex;flex-direction:column;gap:7px';
    (p.opciones||[]).forEach(function(op,i){
      var row=document.createElement('div');
      var esCorr=(i===p.correcto);
      row.style.cssText='display:flex;align-items:center;gap:10px;padding:9px 14px;border-radius:var(--r);'+
        (esCorr?'background:var(--green-bg);border:2px solid #bbf7d0':'background:var(--surface);border:2px solid var(--border)');
      var letra=document.createElement('span');
      letra.style.cssText='width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;'+
        (esCorr?'background:var(--green);color:#fff':'background:var(--border);color:var(--muted)');
      letra.textContent=letters[i];
      var txt=document.createElement('span');
      txt.style.cssText='font-size:13.5px;'+(esCorr?'font-weight:600;color:var(--green)':'color:var(--text)');
      txt.textContent=op;
      if(esCorr){ var tick=document.createElement('span'); tick.style.cssText='margin-left:auto;font-size:1rem'; tick.textContent='✓'; row.appendChild(letra); row.appendChild(txt); row.appendChild(tick); }
      else { row.appendChild(letra); row.appendChild(txt); }
      optsList.appendChild(row);
    });
    innerPrev.appendChild(optsList);

  } else if(p.tipo==='vf'){
    var vfRow=document.createElement('div'); vfRow.style.cssText='display:flex;gap:12px';
    ['Verdadero','Falso'].forEach(function(op,i){
      var esCorr=(i===p.correcto);
      var btn=document.createElement('div');
      btn.style.cssText='flex:1;padding:12px;border-radius:var(--r);text-align:center;font-size:14px;font-weight:600;'+
        (esCorr?'background:var(--green-bg);color:var(--green);border:2px solid #bbf7d0':'background:var(--surface);color:var(--muted);border:2px solid var(--border)');
      btn.textContent=(esCorr?'✓ ':'')+op;
      vfRow.appendChild(btn);
    });
    innerPrev.appendChild(vfRow);

  } else if(p.tipo==='corta'){
    var cortaDiv=document.createElement('div');
    cortaDiv.innerHTML=
      '<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:8px">Respuesta modelo</div>'+
      '<div style="font-size:13.5px;line-height:1.7;padding:12px 14px;background:var(--surface);border-radius:var(--r);border-left:3px solid var(--amber)">'+
        (p.respuestaModelo||'Sin respuesta modelo')+
      '</div>';
    if(p.palabrasClave&&p.palabrasClave.length){
      var kwDiv=document.createElement('div'); kwDiv.style.cssText='margin-top:10px;display:flex;flex-wrap:wrap;gap:5px;align-items:center';
      kwDiv.innerHTML='<span style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em">Palabras clave:</span>';
      p.palabrasClave.forEach(function(kw){
        var chip=document.createElement('span');
        chip.style.cssText='background:var(--navy);color:var(--gold-light);border-radius:20px;padding:2px 10px;font-size:12px;font-family:IBM Plex Mono,monospace';
        chip.textContent=kw; kwDiv.appendChild(chip);
      });
      cortaDiv.appendChild(kwDiv);
    }
    innerPrev.appendChild(cortaDiv);

  } else if(p.tipo==='desarrollo'){
    var desDiv=document.createElement('div');
    if(p.rubrica&&p.rubrica.length){
      desDiv.innerHTML='<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:8px">Rúbrica de corrección</div>';
      var rubList=document.createElement('div');
      p.rubrica.forEach(function(cr,i){
        var row=document.createElement('div');
        row.style.cssText='display:flex;align-items:flex-start;gap:8px;padding:7px 0;border-bottom:1px solid var(--border)';
        var num=document.createElement('span');
        num.style.cssText='width:22px;height:22px;border-radius:50%;background:var(--navy);color:var(--gold-light);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0';
        num.textContent=i+1;
        var txt=document.createElement('span'); txt.style.cssText='font-size:13px;line-height:1.4'; txt.textContent=cr;
        row.appendChild(num); row.appendChild(txt); rubList.appendChild(row);
      });
      desDiv.appendChild(rubList);
    }
    if(p.respuestaModelo){
      var rmDiv=document.createElement('div'); rmDiv.style.marginTop='12px';
      rmDiv.innerHTML='<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:6px">Solución modelo (solo profesor)</div>'+
        '<div style="font-size:13px;line-height:1.7;padding:10px 12px;background:var(--surface);border-radius:var(--r);border-left:3px solid var(--navy)">'+p.respuestaModelo+'</div>';
      desDiv.appendChild(rmDiv);
    }
    innerPrev.appendChild(desDiv);

  } else if(p.tipo==='calculo'||p.tipo==='formulario'){
    // Fórmula destacada
    var fmBlock=document.createElement('div');
    fmBlock.innerHTML='<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:6px">Fórmula</div>';
    var fmRender=document.createElement('div'); fmRender.className='formula-render';
    fmRender.style.cssText='font-family:IBM Plex Mono,monospace;font-size:1.05rem;background:var(--navy);color:var(--gold-light);border-left:none;border-radius:var(--r);padding:12px 16px;line-height:1.8';
    fmRender.textContent=p.solFormula||p.formula||'Sin fórmula definida';
    fmBlock.appendChild(fmRender);
    innerPrev.appendChild(fmBlock);

    // Variables
    if(p.variables&&p.variables.length){
      var varsBlock=document.createElement('div'); varsBlock.style.cssText='margin-top:12px';
      varsBlock.innerHTML='<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:8px">Datos del problema</div>';
      var varsGrid=document.createElement('div'); varsGrid.style.cssText='display:flex;flex-wrap:wrap;gap:7px';
      p.variables.forEach(function(v){
        var chip=document.createElement('div');
        chip.style.cssText='background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:8px 12px;min-width:100px';
        chip.innerHTML='<div style="font-family:IBM Plex Mono,monospace;font-size:12px;font-weight:700;color:var(--navy)">'+v.simbolo+'</div>'+
          '<div style="font-size:13px;font-weight:600">'+v.valor+' <span style="color:var(--muted);font-size:11px">'+v.unidad+'</span></div>'+
          '<div style="font-size:11px;color:var(--muted)">'+v.descripcion+'</div>';
        varsGrid.appendChild(chip);
      });
      varsBlock.appendChild(varsGrid);
      innerPrev.appendChild(varsBlock);
    }

    // Pasos con campos de alumno (simulación visual)
    if(p.pasos&&p.pasos.length){
      var pasosBlock=document.createElement('div'); pasosBlock.style.cssText='margin-top:14px';
      pasosBlock.innerHTML='<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:8px">Pasos de cálculo</div>';
      p.pasos.forEach(function(paso,i){
        var pasoRow=document.createElement('div');
        pasoRow.style.cssText='display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--surface);border-radius:var(--r);border:1px solid var(--border);margin-bottom:7px';
        var numEl=document.createElement('div'); numEl.className='paso-num'; numEl.textContent=i+1;
        var descEl=document.createElement('div'); descEl.style.cssText='flex:1;font-size:13px;color:var(--muted)'; descEl.textContent=paso.desc;
        var resultEl=document.createElement('div');
        resultEl.style.cssText='font-family:IBM Plex Mono,monospace;font-size:.9rem;font-weight:700;background:var(--green-bg);color:var(--green);padding:5px 12px;border-radius:var(--r);flex-shrink:0';
        resultEl.textContent='= '+paso.resultado+' '+(paso.unidad||'');
        pasoRow.appendChild(numEl); pasoRow.appendChild(descEl); pasoRow.appendChild(resultEl);
        pasosBlock.appendChild(pasoRow);
      });
      innerPrev.appendChild(pasosBlock);
    }

    // Interpretación
    if(p.interpretacion){
      var interpDiv=document.createElement('div'); interpDiv.style.cssText='margin-top:12px;padding:10px 14px;background:#f0fdf4;border-radius:var(--r);border-left:3px solid var(--green)';
      interpDiv.innerHTML='<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--green);margin-bottom:4px">Interpretación</div>'+
        '<div style="font-size:13px;line-height:1.6">'+p.interpretacion+'</div>';
      innerPrev.appendChild(interpDiv);
    }
  }

  // Explicación/feedback
  if(p.explicacion){
    var expDiv=document.createElement('div');
    expDiv.style.cssText='margin-top:12px;padding:9px 12px;background:var(--amber-bg);border-radius:var(--r);border-left:3px solid var(--amber);font-size:12.5px;color:var(--amber);line-height:1.5';
    expDiv.innerHTML='💡 <strong>Feedback:</strong> '+p.explicacion;
    innerPrev.appendChild(expDiv);
  }

  prevZone.appendChild(innerPrev);
  card.appendChild(prevZone);

  // Toggle previsualización
  var isOpen=false;
  function togglePrev(e){
    if(e) e.stopPropagation();
    isOpen=!isOpen;
    prevZone.style.display=isOpen?'block':'none';
    btnPrev.innerHTML=isOpen?'👁 Ocultar':'👁 Vista previa';
    btnPrev.style.background=isOpen?'var(--navy)':'';
    btnPrev.style.color=isOpen?'#fff':'';
    btnPrev.style.borderColor=isOpen?'var(--navy)':'';
  }
  btnPrev.onclick=togglePrev;
  hdr.addEventListener('click', togglePrev);

  return card;
}

// ══════════════════════════════════════════════════════
//  MODAL NUEVA PREGUNTA EXTENDIDA
// ══════════════════════════════════════════════════════
function abrirModalNuevaPreguntaExt(pregId){
  var p = pregId ? getBanco().find(function(x){return x.id===pregId;})||null : null;

  // Selector de tipo
  var tipoActual = p ? p.tipo : 'test';

  var overlay = document.createElement('div');
  overlay.id = 'editor-pregunta-overlay';
  overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:2000;display:flex;align-items:stretch;justify-content:flex-end';

  var panel = document.createElement('div');
  panel.style.cssText='width:min(720px,100vw);height:100%;background:var(--surface);display:flex;flex-direction:column;box-shadow:-8px 0 32px rgba(0,0,0,.15);overflow:hidden';

  // Header
  var ph=document.createElement('div');
  ph.style.cssText='display:flex;align-items:center;gap:12px;padding:16px 20px;background:var(--navy);flex-shrink:0';
  ph.innerHTML=
    '<div style="flex:1"><div style="font-family:\'Playfair Display\',serif;font-size:16px;font-weight:600;color:#fff">'+(pregId?'Editar pregunta':'Nueva pregunta')+'</div>'+
    '<div style="font-size:12px;color:rgba(255,255,255,.5);margin-top:2px">Banco de preguntas · Gestión Financiera</div></div>'+
    '<button onclick="document.getElementById(\'editor-pregunta-overlay\').remove();document.body.style.overflow=\'\'" style="background:rgba(255,255,255,.15);border:none;color:#fff;border-radius:8px;padding:7px 14px;cursor:pointer;font-size:13px">✕ Cerrar</button>';
  panel.appendChild(ph);

  // Selector de tipo
  var tipoBar=document.createElement('div');
  tipoBar.style.cssText='padding:12px 20px;border-bottom:1px solid var(--border);background:var(--surface2);flex-shrink:0';
  var tipoLabel=document.createElement('div');
  tipoLabel.style.cssText='font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);margin-bottom:8px';
  tipoLabel.textContent='Tipo de pregunta';
  tipoBar.appendChild(tipoLabel);
  var tipoBtns=document.createElement('div'); tipoBtns.style.cssText='display:flex;gap:6px;flex-wrap:wrap';

  Object.keys(TIPOS_PREGUNTA).forEach(function(tipo){
    var info=TIPOS_PREGUNTA[tipo];
    var btn=document.createElement('button');
    btn.style.cssText='display:flex;align-items:center;gap:5px;padding:6px 12px;border-radius:8px;border:2px solid '+(tipo===tipoActual?info.ctxt:'var(--border)')+';background:'+(tipo===tipoActual?info.color:'var(--surface)')+';font-size:12px;font-weight:600;cursor:pointer;color:'+(tipo===tipoActual?info.ctxt:'var(--muted)')+';transition:all .15s';
    btn.innerHTML=info.ico+' '+info.label;
    btn.onclick=function(){
      tipoActual=tipo;
      tipoBtns.querySelectorAll('button').forEach(function(b){ var t2=b.dataset.tipo; var i2=TIPOS_PREGUNTA[t2]; b.style.border='2px solid '+(t2===tipo?i2.ctxt:'var(--border)'); b.style.background=t2===tipo?i2.color:'var(--surface)'; b.style.color=t2===tipo?i2.ctxt:'var(--muted)'; });
      renderFormularioPregunta(formArea, tipoActual, p);
    };
    btn.dataset.tipo=tipo;
    tipoBtns.appendChild(btn);
  });
  tipoBar.appendChild(tipoBtns);
  panel.appendChild(tipoBar);

  // Área del formulario
  var formArea=document.createElement('div');
  formArea.id='editor-form-area';
  formArea.style.cssText='flex:1;overflow-y:auto;padding:20px';
  panel.appendChild(formArea);

  // Footer con botón guardar
  var footer=document.createElement('div');
  footer.style.cssText='padding:14px 20px;border-top:1px solid var(--border);background:var(--surface2);flex-shrink:0;display:flex;justify-content:flex-end;gap:8px';
  var btnCancelar=document.createElement('button'); btnCancelar.className='btn btn-g';
  btnCancelar.textContent='Cancelar';
  btnCancelar.onclick=function(){ overlay.remove(); document.body.style.overflow=''; };
  var btnGuardar=document.createElement('button'); btnGuardar.className='btn btn-p';
  btnGuardar.textContent=pregId?'Guardar cambios':'Añadir al banco';
  btnGuardar.onclick=function(){ guardarPreguntaExt(tipoActual, pregId); };
  footer.appendChild(btnCancelar); footer.appendChild(btnGuardar);
  panel.appendChild(footer);

  overlay.appendChild(panel);
  document.body.appendChild(overlay);
  document.body.style.overflow='hidden';

  renderFormularioPregunta(formArea, tipoActual, p);
}

// ── Renderiza el formulario según el tipo ─────────────
function renderFormularioPregunta(area, tipo, p){
  area.innerHTML='';

  // Campos comunes: enunciado, unidad, dificultad, RA, CE
  var comunDiv=document.createElement('div');
  comunDiv.innerHTML=
    '<div class="fg"><label class="fl">Enunciado <span style="color:var(--red)">*</span></label>'+
      '<textarea class="fta" id="bqe-enun" rows="3" placeholder="Escribe el enunciado de la pregunta…">'+(p&&p.enunciado?p.enunciado:'')+'</textarea></div>'+
    '<div class="g3">'+
      '<div class="fg"><label class="fl">Unidad</label>'+
        '<select class="fs" id="bqe-ud">'+
          UNIDADES.map(function(u){ return '<option value="'+u.id+'"'+(p&&p.ud===u.id?' selected':'')+'>UD'+u.n+' · '+u.titulo+'</option>'; }).join('')+
        '</select></div>'+
      '<div class="fg"><label class="fl">Dificultad</label>'+
        '<select class="fs" id="bqe-dif">'+
          '<option value="basica"'+(p&&p.dificultad==='basica'?' selected':'')+'>⭐ Básica</option>'+
          '<option value="media"'+(p&&p.dificultad==='media'?' selected':'')+'>⭐⭐ Media</option>'+
          '<option value="avanzada"'+(p&&p.dificultad==='avanzada'?' selected':'')+'>⭐⭐⭐ Avanzada</option>'+
        '</select></div>'+
      '<div class="fg"><label class="fl">RA / CE</label>'+
        '<div style="display:flex;gap:5px">'+
          '<input class="fi" id="bqe-ra" placeholder="RA1" style="flex:1" value="'+(p&&p.ra?p.ra:'')+'">'+
          '<input class="fi" id="bqe-ce" placeholder="CE1.1" style="flex:1" value="'+(p&&p.ce?p.ce:'')+'">'+
        '</div></div>'+
    '</div>';
  area.appendChild(comunDiv);

  var sep=document.createElement('div');
  sep.style.cssText='border-top:2px dashed var(--border);margin:14px 0;position:relative';
  sep.innerHTML='<span style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:var(--surface);padding:0 10px;font-size:11px;color:var(--muted);text-transform:uppercase;font-weight:700">Configuración del tipo</span>';
  area.appendChild(sep);

  // Formulario específico según tipo
  if(tipo==='test') renderFormTest(area, p);
  else if(tipo==='vf') renderFormVF(area, p);
  else if(tipo==='corta') renderFormCorta(area, p);
  else if(tipo==='desarrollo') renderFormDesarrollo(area, p);
  else if(tipo==='calculo') renderFormCalculo(area, p);
  else if(tipo==='formulario') renderFormFormulario(area, p);
  else if(tipo==='mapa') renderFormMapa(area, p);
}

// ── Formulario TEST opción múltiple ──────────────────
// ── Campo explicación reutilizable ───────────────────
function renderCampoExplicacion(div, p){
  var fg = document.createElement('div'); fg.className='fg'; fg.style.marginTop='12px';
  fg.innerHTML =
    '<label class="fl">Explicación / feedback (se muestra al alumno al corregir)</label>'+
    '<textarea class="fta" id="bqe-exp" rows="2" placeholder="Explica por qué la respuesta es correcta…">'+(p&&p.explicacion?p.explicacion:'')+'</textarea>';
  div.appendChild(fg);
}


function renderFormTest(area, p){
  var div=document.createElement('div');
  var letters=['A','B','C','D'];
  var opciones=p&&p.tipo==='test'?p.opciones:['','','',''];
  var correcto=p&&p.tipo==='test'?p.correcto:0;

  div.innerHTML='<div class="fg"><label class="fl">Opciones — marca el radio de la respuesta correcta <span style="color:var(--red)">*</span></label></div>';
  opciones.forEach(function(op,i){
    var row=document.createElement('div');
    row.style.cssText='display:flex;align-items:center;gap:9px;padding:6px 0;border-bottom:1px solid var(--border)';
    var radio=document.createElement('input'); radio.type='radio'; radio.name='bqe-correct'; radio.value=i;
    if(i===correcto) radio.checked=true;
    radio.style.cssText='width:16px;height:16px;cursor:pointer;flex-shrink:0';
    var letra=document.createElement('span');
    letra.style.cssText='width:24px;height:24px;border-radius:50%;background:var(--navy);color:var(--gold-light);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0';
    letra.textContent=letters[i];
    var inp=document.createElement('input'); inp.className='fi'; inp.type='text'; inp.style.flex='1';
    inp.placeholder='Opción '+letters[i]; inp.value=op; inp.dataset.idx=i;
    row.appendChild(radio); row.appendChild(letra); row.appendChild(inp);
    div.appendChild(row);
  });
  var hint=document.createElement('div'); hint.style.cssText='font-size:11.5px;color:var(--muted);margin-top:6px';
  hint.innerHTML='Rellena las 4 opciones y selecciona la correcta con el radio.';
  div.appendChild(hint);
  renderCampoExplicacion(div, p);
  area.appendChild(div);
}

// ── Formulario V/F ────────────────────────────────────
function renderFormVF(area, p){
  var div=document.createElement('div');
  var correcto=p&&p.tipo==='vf'?p.correcto:0;
  div.innerHTML='<div class="fg"><label class="fl">¿Cuál es la respuesta correcta?</label>'+
    '<div style="display:flex;gap:12px;margin-top:6px">'+
      '<label style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:10px 16px;border-radius:var(--r);border:2px solid var(--border);flex:1">'+
        '<input type="radio" name="bqe-correct" value="0"'+(correcto===0?' checked':'')+' style="width:16px;height:16px"> ✅ Verdadero'+
      '</label>'+
      '<label style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:10px 16px;border-radius:var(--r);border:2px solid var(--border);flex:1">'+
        '<input type="radio" name="bqe-correct" value="1"'+(correcto===1?' checked':'')+' style="width:16px;height:16px"> ❌ Falso'+
      '</label>'+
    '</div></div>';
  renderCampoExplicacion(div, p);
  area.appendChild(div);
}

// ── Formulario CORTA ──────────────────────────────────
function renderFormCorta(area, p){
  var div=document.createElement('div');
  div.innerHTML=
    '<div class="fg"><label class="fl">Respuesta modelo <span style="color:var(--red)">*</span></label>'+
      '<textarea class="fta" id="bqe-resp-modelo" rows="4" placeholder="Escribe la respuesta correcta completa que servirá de guía para la corrección…">'+(p&&p.respuestaModelo?p.respuestaModelo:'')+'</textarea></div>'+
    '<div class="fg"><label class="fl">Palabras clave (separadas por comas) — para autocorrección orientativa</label>'+
      '<input class="fi" id="bqe-palabras" placeholder="palabra1, palabra2, concepto3…" value="'+(p&&p.palabrasClave?p.palabrasClave.join(', '):'')+'"></div>'+
    '<div class="alert al-w" style="font-size:12.5px;margin-top:8px">La corrección de respuesta corta es realizada por el profesor. Las palabras clave ayudan a detectar respuestas incompletas.</div>';
  renderCampoExplicacion(div, p);
  area.appendChild(div);
}

// ── Formulario DESARROLLO ─────────────────────────────
function renderFormDesarrollo(area, p){
  var rubricaItems=p&&p.rubrica?p.rubrica:[''];
  var div=document.createElement('div');

  var rubDiv=document.createElement('div'); rubDiv.className='fg';
  var rubLbl=document.createElement('label'); rubLbl.className='fl';
  rubLbl.textContent='Rúbrica de corrección (criterios y puntuación)';
  rubDiv.appendChild(rubLbl);

  var rubCont=document.createElement('div'); rubCont.id='bqe-rubrica-cont';
  function addRubricaItem(val){
    var row=document.createElement('div');
    row.style.cssText='display:flex;align-items:center;gap:7px;margin-bottom:6px';
    var inp=document.createElement('input'); inp.className='fi'; inp.value=val||''; inp.placeholder='Criterio y puntuación — ej: Cálculo correcto del ratio: 2 pts';
    var btnDel=document.createElement('button'); btnDel.className='btn btn-d btn-sm'; btnDel.textContent='✕';
    btnDel.onclick=function(){ row.remove(); };
    row.appendChild(inp); row.appendChild(btnDel); rubCont.appendChild(row);
  }
  rubricaItems.forEach(addRubricaItem);
  rubDiv.appendChild(rubCont);

  var btnAddRub=document.createElement('button'); btnAddRub.className='btn btn-g btn-sm'; btnAddRub.style.marginTop='6px';
  btnAddRub.textContent='+ Añadir criterio';
  btnAddRub.onclick=function(){ addRubricaItem(''); };
  rubDiv.appendChild(btnAddRub);
  div.appendChild(rubDiv);

  var respDiv=document.createElement('div'); respDiv.className='fg';
  respDiv.innerHTML='<label class="fl">Respuesta modelo / solución completa (solo visible para el profesor)</label>'+
    '<textarea class="fta" id="bqe-resp-modelo" rows="5" placeholder="Solución completa del ejercicio…">'+(p&&p.respuestaModelo?p.respuestaModelo:'')+'</textarea>';
  div.appendChild(respDiv);
  renderCampoExplicacion(div, p);
  area.appendChild(div);
}

// ── Formulario CÁLCULO FINANCIERO ─────────────────────
// ══════════════════════════════════════════════════════
//  CÁLCULO FINANCIERO — Nuevo modelo pedagógico
//
//  PROFESOR define (oculto al alumno):
//    · solDatos:    [{simbolo, descripcion, valor, unidad}]
//    · solFormula:  string con la fórmula
//    · solPasos:    [{desc, resultado, tolerancia, unidad}]
//    · solInterp:   string con la interpretación modelo
//
//  ALUMNO realiza (campos en blanco):
//    · Identifica y escribe los datos del problema
//    · Escribe la fórmula a aplicar
//    · Calcula cada paso y escribe el resultado
//    · Escribe su interpretación
//
//  Al CORREGIR:
//    · Datos: compara símbolo+valor con tolerancia
//    · Fórmula: comparación textual flexible
//    · Pasos: compara numéricamente con tolerancia
//    · Interpretación: el profesor la revisa (o se muestra la modelo)
// ══════════════════════════════════════════════════════

// ── Paleta de símbolos compartida ─────────────────────
var SYMS = ['₀','₁','₂','₃','₄','ₙ','¹','²','³','ⁿ','±','×','÷','√','∑','π','≤','≥','≠','€','%','→','∞','·'];

function insertSym(sym, targetId){
  var el = document.getElementById(targetId);
  if(!el) return;
  var pos = el.selectionStart||0;
  el.value = el.value.slice(0,pos) + sym + el.value.slice(pos);
  el.selectionStart = el.selectionEnd = pos + sym.length;
  el.dispatchEvent(new Event('input'));
  el.focus();
}

function mkSymPal(targetId){
  var pal = document.createElement('div');
  pal.style.cssText = 'display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px';
  SYMS.forEach(function(s){
    var btn = document.createElement('button');
    btn.className = 'sym-btn'; btn.textContent = s; btn.type = 'button';
    btn.onclick = function(){ insertSym(s, targetId); };
    pal.appendChild(btn);
  });
  return pal;
}

// ══════════════════════════════════════════════════════
//  EDITOR DE PREGUNTA DE CÁLCULO (profesor)
// ══════════════════════════════════════════════════════
function renderFormCalculo(area, p){
  var div = document.createElement('div');

  // Info pedagógica
  var info = document.createElement('div');
  info.style.cssText = 'padding:10px 14px;background:#f0fdf4;border-radius:var(--r);border-left:3px solid var(--green);margin-bottom:14px;font-size:13px;color:var(--green)';
  info.innerHTML = '<strong>🎓 Ejercicio de cálculo estructurado:</strong> Define el enunciado y la solución completa. '+
    'El alumno realizará cada parte (datos, fórmula, cálculo, interpretación) desde cero. '+
    'La solución queda oculta hasta que se corrige.';
  div.appendChild(info);

  // ── Sección 1: Datos del problema (solución) ─────────
  div.appendChild(mkSeccionTitulo('1. Datos del problema', 'El alumno deberá identificarlos y escribirlos'));

  var datosArr = p && p.solDatos ? JSON.parse(JSON.stringify(p.solDatos)) : [];
  var datosCont = document.createElement('div'); datosCont.id = 'bqe-datos-cont';

  function addDatoRow(d){
    var row = document.createElement('div');
    row.style.cssText = 'display:grid;grid-template-columns:90px 1fr 130px 90px 32px;gap:6px;margin-bottom:6px;align-items:center';
    var cabecera = ['Símbolo','Descripción','Valor numérico','Unidad',''];
    if(!datosCont.children.length){
      var hRow=document.createElement('div'); hRow.style.cssText='display:grid;grid-template-columns:90px 1fr 130px 90px 32px;gap:6px;margin-bottom:4px';
      cabecera.forEach(function(h){ var s=document.createElement('span'); s.style.cssText='font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);font-weight:600'; s.textContent=h; hRow.appendChild(s); });
      datosCont.appendChild(hRow);
    }
    var inpSim=document.createElement('input'); inpSim.className='fi'; inpSim.placeholder='I₀'; inpSim.value=d&&d.simbolo?d.simbolo:''; inpSim.style.fontFamily='IBM Plex Mono,monospace;font-weight:700';
    var inpDesc=document.createElement('input'); inpDesc.className='fi'; inpDesc.placeholder='Ej: Inversión inicial'; inpDesc.value=d&&d.descripcion?d.descripcion:'';
    var inpVal=document.createElement('input'); inpVal.className='fi'; inpVal.type='number'; inpVal.placeholder='10000'; inpVal.value=d&&d.valor!=null?d.valor:''; inpVal.step='any';
    var inpUnd=document.createElement('input'); inpUnd.className='fi'; inpUnd.placeholder='€'; inpUnd.value=d&&d.unidad?d.unidad:'€';
    var btnDel=document.createElement('button'); btnDel.className='btn btn-d btn-sm'; btnDel.textContent='✕'; btnDel.onclick=function(){ row.remove(); };
    [inpSim,inpDesc,inpVal,inpUnd,btnDel].forEach(function(el){ row.appendChild(el); });
    datosCont.appendChild(row);
  }
  if(datosArr.length) datosArr.forEach(addDatoRow); else { addDatoRow(null); }

  div.appendChild(datosCont);
  var btnAddDato=document.createElement('button'); btnAddDato.className='btn btn-g btn-sm'; btnAddDato.style.marginTop='4px';
  btnAddDato.innerHTML='+ Añadir dato'; btnAddDato.onclick=function(){ addDatoRow(null); };
  div.appendChild(btnAddDato);

  // ── Sección 2: Fórmula ────────────────────────────────
  div.appendChild(mkSeccionTitulo('2. Fórmula a aplicar', 'El alumno deberá escribirla; se compara con la tuya'));

  var fmId = 'bqe-formula';
  div.appendChild(mkSymPal(fmId));
  var fmInp = document.createElement('textarea'); fmInp.className='fta'; fmInp.rows=2; fmInp.id=fmId;
  fmInp.placeholder = 'Ej: VAN = −I₀ + FC₁/(1+k)¹ + FC₂/(1+k)²';
  fmInp.value = p && p.solFormula ? p.solFormula : '';
  var fmPrev = document.createElement('div'); fmPrev.className='formula-render';
  fmPrev.style.cssText='font-family:IBM Plex Mono,monospace;font-size:1rem;background:var(--navy);color:var(--gold-light);border-left:none;border-radius:var(--r);padding:10px 14px;margin-top:6px;min-height:40px';
  fmPrev.textContent = fmInp.value || 'Vista previa de la fórmula…';
  fmInp.oninput = function(){ fmPrev.textContent = this.value || 'Vista previa de la fórmula…'; };
  div.appendChild(fmInp); div.appendChild(fmPrev);

  // ── Sección 3: Pasos de cálculo ───────────────────────
  div.appendChild(mkSeccionTitulo('3. Procedimiento de cálculo', 'Define cada paso; el alumno introducirá el resultado de cada uno'));

  var pasosCont = document.createElement('div'); pasosCont.id = 'bqe-pasos-cont';
  var pasosArr = p && p.solPasos ? JSON.parse(JSON.stringify(p.solPasos)) : [];

  function addPasoCalculo(pa){
    var row = document.createElement('div');
    row.style.cssText = 'border:1px solid var(--border);border-radius:var(--r);padding:10px 12px;margin-bottom:8px;background:var(--surface)';

    var rHdr = document.createElement('div'); rHdr.style.cssText='display:flex;align-items:center;gap:8px;margin-bottom:8px';
    var numEl = document.createElement('div'); numEl.className='paso-num'; numEl.textContent=pasosCont.children.length+1;
    var lbl = document.createElement('span'); lbl.style.cssText='font-size:12px;font-weight:600;color:var(--muted);flex:1'; lbl.textContent='Paso '+(pasosCont.children.length+1);
    var btnDel = document.createElement('button'); btnDel.className='btn btn-d btn-sm'; btnDel.textContent='✕';
    btnDel.onclick=function(){ row.remove(); renumerarPasos(pasosCont); };
    rHdr.appendChild(numEl); rHdr.appendChild(lbl); rHdr.appendChild(btnDel);
    row.appendChild(rHdr);

    var grid = document.createElement('div'); grid.style.cssText='display:grid;grid-template-columns:1fr;gap:7px';

    var inpDesc=document.createElement('input'); inpDesc.className='fi'; inpDesc.placeholder='Descripción del paso — ej: Calcular el valor actual del FC₁: FC₁ / (1+k)¹';
    inpDesc.value = pa&&pa.desc ? pa.desc : '';

    var resRow=document.createElement('div'); resRow.style.cssText='display:grid;grid-template-columns:1fr 120px 90px 90px;gap:6px;align-items:center';
    var inpRes=document.createElement('input'); inpRes.className='fi'; inpRes.type='number'; inpRes.placeholder='Resultado correcto'; inpRes.value=pa&&pa.resultado!=null?pa.resultado:''; inpRes.step='any';
    var inpTol=document.createElement('input'); inpTol.className='fi'; inpTol.type='number'; inpTol.placeholder='Tolerancia'; inpTol.value=pa&&pa.tolerancia!=null?pa.tolerancia:1; inpTol.step='any';
    var inpUnd=document.createElement('input'); inpUnd.className='fi'; inpUnd.placeholder='Unidad'; inpUnd.value=pa&&pa.unidad?pa.unidad:'€';

    var resLbls=document.createElement('div'); resLbls.style.cssText='display:grid;grid-template-columns:1fr 120px 90px 90px;gap:6px';
    ['Resultado esperado','Tolerancia (±)','Unidad',''].forEach(function(h){
      var s=document.createElement('span'); s.style.cssText='font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em'; s.textContent=h; resLbls.appendChild(s);
    });
    [resLbls, inpDesc, resRow].forEach(function(el){ grid.appendChild(el); });
    [inpRes, inpTol, inpUnd].forEach(function(el){ resRow.appendChild(el); });
    row.appendChild(grid);
    pasosCont.appendChild(row);
  }

  if(pasosArr.length) pasosArr.forEach(addPasoCalculo); else addPasoCalculo(null);
  div.appendChild(pasosCont);
  var btnAddPaso=document.createElement('button'); btnAddPaso.className='btn btn-g btn-sm'; btnAddPaso.style.marginTop='4px';
  btnAddPaso.innerHTML='+ Añadir paso'; btnAddPaso.onclick=function(){ addPasoCalculo(null); };
  div.appendChild(btnAddPaso);

  // ── Sección 4: Interpretación ─────────────────────────
  div.appendChild(mkSeccionTitulo('4. Interpretación modelo', 'El alumno escribirá la suya; se muestra la tuya al corregir'));

  var interpId='bqe-interpretacion';
  var fInterp=document.createElement('textarea'); fInterp.className='fta'; fInterp.id=interpId; fInterp.rows=3;
  fInterp.placeholder='Ej: Como el VAN es positivo (>0), la inversión ES RENTABLE y crea valor para la empresa. Se debe ACEPTAR el proyecto.';
  fInterp.value = p && p.solInterp ? p.solInterp : '';
  div.appendChild(fInterp);

  renderCampoExplicacion(div, p);
  area.appendChild(div);
}

// ── Formulario PASO A PASO (contable) — mismo modelo ─
function renderFormFormulario(area, p){
  var div = document.createElement('div');

  var info=document.createElement('div');
  info.style.cssText='padding:10px 14px;background:#fef9ec;border-radius:var(--r);border-left:3px solid var(--amber);margin-bottom:14px;font-size:13px;color:var(--amber)';
  info.innerHTML='<strong>📐 Ejercicio de formulario contable:</strong> El alumno identificará los datos, escribirá el asiento y calculará cada resultado paso a paso.';
  div.appendChild(info);

  div.appendChild(mkSeccionTitulo('Asiento contable / fórmula de referencia (solución oculta)',''));
  var fmInp2=document.createElement('textarea'); fmInp2.className='fta'; fmInp2.id='bqe-formula'; fmInp2.rows=3;
  fmInp2.placeholder='Ej: DEBE: (600) Compras 5.000€ | (472) IVA 1.050€  ||  HABER: (572) Banco 2.420€ | (400) Proveedores 3.630€';
  fmInp2.value = p && p.solFormula ? p.solFormula : '';
  div.appendChild(fmInp2);

  div.appendChild(mkSeccionTitulo('Pasos de cálculo (solución oculta)',''));
  var pasosCont2=document.createElement('div'); pasosCont2.id='bqe-pasos-cont';
  var pasosArr2 = p&&p.solPasos ? JSON.parse(JSON.stringify(p.solPasos)):[];

  function addPasoForm(pa){
    var row=document.createElement('div');
    row.style.cssText='display:grid;grid-template-columns:1fr 120px 80px 80px 32px;gap:6px;margin-bottom:6px;align-items:center;padding:8px 10px;border:1px solid var(--border);border-radius:var(--r)';
    var numEl=document.createElement('div'); numEl.className='paso-num'; numEl.style.cssText='width:22px;height:22px;border-radius:50%;background:var(--navy);color:var(--gold-light);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0'; numEl.textContent=pasosCont2.children.length+1;
    var inpD=document.createElement('input'); inpD.className='fi'; inpD.placeholder='Descripción del paso'; inpD.value=pa&&pa.desc?pa.desc:'';
    var inpR=document.createElement('input'); inpR.className='fi'; inpR.type='number'; inpR.placeholder='Resultado'; inpR.value=pa&&pa.resultado!=null?pa.resultado:''; inpR.step='any';
    var inpT=document.createElement('input'); inpT.className='fi'; inpT.type='number'; inpT.placeholder='±'; inpT.value=pa&&pa.tolerancia!=null?pa.tolerancia:1; inpT.step='any';
    var inpU=document.createElement('input'); inpU.className='fi'; inpU.placeholder='€'; inpU.value=pa&&pa.unidad?pa.unidad:'€';
    var btnDel=document.createElement('button'); btnDel.className='btn btn-d btn-sm'; btnDel.textContent='✕'; btnDel.onclick=function(){ row.remove(); };
    [numEl,inpD,inpR,inpT,inpU,btnDel].forEach(function(el){ row.appendChild(el); });
    pasosCont2.appendChild(row);
  }
  if(pasosArr2.length) pasosArr2.forEach(addPasoForm); else addPasoForm(null);
  div.appendChild(pasosCont2);
  var btnAP=document.createElement('button'); btnAP.className='btn btn-g btn-sm'; btnAP.style.marginTop='4px';
  btnAP.innerHTML='+ Añadir paso'; btnAP.onclick=function(){ addPasoForm(null); };
  div.appendChild(btnAP);

  div.appendChild(mkSeccionTitulo('Interpretación modelo (oculta)',''));
  var fInterp2=document.createElement('textarea'); fInterp2.className='fta'; fInterp2.id='bqe-interpretacion'; fInterp2.rows=3;
  fInterp2.placeholder='Solución y explicación completa del asiento…';
  fInterp2.value=p&&p.solInterp?p.solInterp:'';
  div.appendChild(fInterp2);

  renderCampoExplicacion(div, p);
  area.appendChild(div);
}

// ══════════════════════════════════════════════════════
//  MAPA CONCEPTUAL — Editor profesor + Vista alumno
// ══════════════════════════════════════════════════════
function renderFormMapa(area, p){
  var nodos = (p && p.nodos) ? JSON.parse(JSON.stringify(p.nodos)) : [
    {id:'n1', texto:'Concepto central', oculto:false, x:50, y:15},
    {id:'n2', texto:'Concepto A',       oculto:true,  x:20, y:60},
    {id:'n3', texto:'Concepto B',       oculto:true,  x:80, y:60},
  ];
  var conexiones = (p && p.conexiones) ? JSON.parse(JSON.stringify(p.conexiones)) : [
    {de:'n1', a:'n2', etiqueta:'incluye'},
    {de:'n1', a:'n3', etiqueta:'relaciona'},
  ];

  function renderEditor(){
    area.innerHTML = '';
    var info = document.createElement('div');
    info.style.cssText = 'padding:10px 14px;background:#f0f4ff;border-radius:var(--r);font-size:12.5px;color:#3730a3;margin-bottom:14px';
    info.innerHTML = '<strong>🗺 Mapa conceptual</strong> — Define los nodos y conexiones. Los nodos <em>ocultos</em> son los que el alumno deberá rellenar.';
    area.appendChild(info);

    var titNodos = document.createElement('div');
    titNodos.style.cssText = 'font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:8px';
    titNodos.textContent = 'Nodos del mapa';
    area.appendChild(titNodos);

    nodos.forEach(function(nodo, idx){
      var row = document.createElement('div');
      row.style.cssText = 'display:grid;grid-template-columns:1fr 90px 30px;gap:7px;margin-bottom:7px;align-items:center';
      var inp = document.createElement('input'); inp.className='fi';
      inp.value = nodo.texto; inp.placeholder = 'Texto del nodo';
      inp.oninput = function(){ nodo.texto = this.value; };
      var sel = document.createElement('select'); sel.className='fs'; sel.style.cssText='font-size:12px;padding:4px 6px';
      sel.innerHTML = '<option value="visible">Visible</option><option value="oculto">Oculto ✏️</option>';
      sel.value = nodo.oculto ? 'oculto' : 'visible';
      sel.onchange = function(){ nodo.oculto = (this.value==='oculto'); };
      var btnDel = document.createElement('button');
      btnDel.style.cssText = 'background:var(--red-bg);color:var(--red);border:none;border-radius:6px;padding:5px 8px;cursor:pointer;font-size:13px';
      btnDel.textContent = '✕';
      btnDel.onclick = (function(i){ return function(){ nodos.splice(i,1); renderEditor(); }; })(idx);
      row.appendChild(inp); row.appendChild(sel); row.appendChild(btnDel);
      area.appendChild(row);
    });

    var btnAddNodo = document.createElement('button'); btnAddNodo.className='btn btn-g btn-sm';
    btnAddNodo.style.cssText='width:100%;margin-bottom:16px'; btnAddNodo.textContent='+ Añadir nodo';
    btnAddNodo.onclick = function(){
      nodos.push({id:'n'+Date.now(), texto:'Nuevo nodo', oculto:true, x:50, y:50});
      renderEditor();
    };
    area.appendChild(btnAddNodo);

    var titConn = document.createElement('div');
    titConn.style.cssText='font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:8px';
    titConn.textContent='Conexiones entre nodos';
    area.appendChild(titConn);

    conexiones.forEach(function(con, idx){
      var row = document.createElement('div');
      row.style.cssText='display:grid;grid-template-columns:1fr 30px 1fr 1fr 30px;gap:7px;margin-bottom:7px;align-items:center;font-size:12px';
      function nodeSel(val, cb){
        var s=document.createElement('select'); s.className='fs'; s.style.cssText='font-size:12px;padding:4px 6px';
        nodos.forEach(function(n){ var o=document.createElement('option'); o.value=n.id; o.textContent=n.texto.slice(0,18); s.appendChild(o); });
        s.value=val; s.onchange=function(){ cb(this.value); }; return s;
      }
      var arrow=document.createElement('div'); arrow.textContent='→'; arrow.style.textAlign='center';
      var selDe=nodeSel(con.de, function(v){ con.de=v; });
      var selA =nodeSel(con.a,  function(v){ con.a=v;  });
      var inpEt=document.createElement('input'); inpEt.className='fi'; inpEt.placeholder='Etiqueta';
      inpEt.value=con.etiqueta||''; inpEt.style.fontSize='12px'; inpEt.oninput=function(){ con.etiqueta=this.value; };
      var btnDel=document.createElement('button');
      btnDel.style.cssText='background:var(--red-bg);color:var(--red);border:none;border-radius:6px;padding:5px 8px;cursor:pointer;font-size:13px';
      btnDel.textContent='✕';
      btnDel.onclick=(function(i){ return function(){ conexiones.splice(i,1); renderEditor(); }; })(idx);
      row.appendChild(selDe); row.appendChild(arrow); row.appendChild(selA); row.appendChild(inpEt); row.appendChild(btnDel);
      area.appendChild(row);
    });

    var btnAddCon=document.createElement('button'); btnAddCon.className='btn btn-g btn-sm';
    btnAddCon.style.cssText='width:100%;margin-bottom:16px'; btnAddCon.textContent='+ Añadir conexión';
    btnAddCon.onclick=function(){
      if(nodos.length<2){ alert('Añade al menos 2 nodos primero'); return; }
      conexiones.push({de:nodos[0].id, a:nodos[1].id, etiqueta:''});
      renderEditor();
    };
    area.appendChild(btnAddCon);

    var prevTit=document.createElement('div');
    prevTit.style.cssText='font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:8px';
    prevTit.textContent='Vista previa';
    area.appendChild(prevTit);
    area.appendChild(renderMapaSVG(nodos, conexiones, false, {}));

    area._getNodos = function(){ return nodos; };
    area._getConexiones = function(){ return conexiones; };
  }
  renderEditor();
}

function renderMapaSVG(nodos, conexiones, modoAlumno, respuestas, onRespuesta){
  var W=580, H=300, RADIO=34;
  var posiciones = {};
  nodos.forEach(function(n, i){
    var angle = (2*Math.PI*i/nodos.length) - Math.PI/2;
    var cx = n.x !== undefined ? (n.x/100)*W : W/2 + Math.cos(angle)*(W/2-70);
    var cy = n.y !== undefined ? (n.y/100)*H : H/2 + Math.sin(angle)*(H/2-50);
    posiciones[n.id] = {x:Math.max(RADIO+5,Math.min(W-RADIO-5,cx)), y:Math.max(RADIO+5,Math.min(H-RADIO-5,cy))};
  });
  var ns='http://www.w3.org/2000/svg';
  var svg=document.createElementNS(ns,'svg');
  svg.setAttribute('viewBox','0 0 '+W+' '+H);
  svg.style.cssText='width:100%;max-height:300px;border:1px solid var(--border);border-radius:var(--rl);background:#fafbff';
  var defs=document.createElementNS(ns,'defs');
  var mk=document.createElementNS(ns,'marker');
  mk.setAttribute('id','arr'); mk.setAttribute('markerWidth','8'); mk.setAttribute('markerHeight','8');
  mk.setAttribute('refX','6'); mk.setAttribute('refY','3'); mk.setAttribute('orient','auto');
  var mp=document.createElementNS(ns,'path'); mp.setAttribute('d','M0,0 L0,6 L8,3 z'); mp.setAttribute('fill','#1a2744');
  mk.appendChild(mp); defs.appendChild(mk); svg.appendChild(defs);

  conexiones.forEach(function(con){
    var p1=posiciones[con.de], p2=posiciones[con.a]; if(!p1||!p2) return;
    var dx=p2.x-p1.x, dy=p2.y-p1.y, len=Math.sqrt(dx*dx+dy*dy)||1;
    var ux=dx/len, uy=dy/len;
    var line=document.createElementNS(ns,'line');
    line.setAttribute('x1',p1.x+ux*RADIO); line.setAttribute('y1',p1.y+uy*RADIO);
    line.setAttribute('x2',p2.x-ux*(RADIO+8)); line.setAttribute('y2',p2.y-uy*(RADIO+8));
    line.setAttribute('stroke','#1a2744'); line.setAttribute('stroke-width','1.5');
    line.setAttribute('marker-end','url(#arr)');
    svg.appendChild(line);
    if(con.etiqueta){
      var mx=(p1.x+ux*RADIO+p2.x-ux*(RADIO+8))/2, my=(p1.y+uy*RADIO+p2.y-uy*(RADIO+8))/2;
      var tw=con.etiqueta.length*6+10;
      var bg=document.createElementNS(ns,'rect');
      bg.setAttribute('x',mx-tw/2); bg.setAttribute('y',my-9); bg.setAttribute('width',tw); bg.setAttribute('height',16);
      bg.setAttribute('rx',4); bg.setAttribute('fill','#e0e7ff'); svg.appendChild(bg);
      var lt=document.createElementNS(ns,'text');
      lt.setAttribute('x',mx); lt.setAttribute('y',my+4); lt.setAttribute('text-anchor','middle');
      lt.setAttribute('font-size','10'); lt.setAttribute('fill','#3730a3');
      lt.setAttribute('font-family','DM Sans,sans-serif'); lt.textContent=con.etiqueta; svg.appendChild(lt);
    }
  });

  nodos.forEach(function(nodo){
    var pos=posiciones[nodo.id]; if(!pos) return;
    var esOculto=modoAlumno && nodo.oculto;
    var resp=(respuestas||{})[nodo.id];
    var correcto=resp && resp.trim().toLowerCase()===nodo.texto.trim().toLowerCase();
    var g=document.createElementNS(ns,'g');
    var circle=document.createElementNS(ns,'circle');
    circle.setAttribute('cx',pos.x); circle.setAttribute('cy',pos.y); circle.setAttribute('r',RADIO);
    var fill=esOculto ? (resp?(correcto?'#dcfce7':'#fee2e2'):'#f9fafb') : '#1a2744';
    var stroke=esOculto ? (resp?(correcto?'#16a34a':'#dc2626'):'#9ca3af') : '#1a2744';
    circle.setAttribute('fill',fill); circle.setAttribute('stroke',stroke); circle.setAttribute('stroke-width','2');
    g.appendChild(circle);
    if(!esOculto){
      var words=nodo.texto.split(' '); var lines=[]; var line='';
      words.forEach(function(w){ if((line+w).length>11&&line){lines.push(line.trim());line='';} line+=w+' '; });
      if(line.trim()) lines.push(line.trim());
      var sy=pos.y-(lines.length-1)*7;
      lines.forEach(function(l,i){
        var t=document.createElementNS(ns,'text');
        t.setAttribute('x',pos.x); t.setAttribute('y',sy+i*14); t.setAttribute('text-anchor','middle');
        t.setAttribute('dominant-baseline','middle'); t.setAttribute('font-size','9');
        t.setAttribute('fill','#fff'); t.setAttribute('font-family','DM Sans,sans-serif'); t.setAttribute('font-weight','600');
        t.textContent=l; g.appendChild(t);
      });
    } else if(resp){
      var t=document.createElementNS(ns,'text');
      t.setAttribute('x',pos.x); t.setAttribute('y',pos.y); t.setAttribute('text-anchor','middle');
      t.setAttribute('dominant-baseline','middle'); t.setAttribute('font-size','9');
      t.setAttribute('fill',correcto?'#16a34a':'#dc2626'); t.setAttribute('font-family','DM Sans,sans-serif'); t.setAttribute('font-weight','700');
      t.textContent=resp.slice(0,14); g.appendChild(t);
    } else {
      var t=document.createElementNS(ns,'text');
      t.setAttribute('x',pos.x); t.setAttribute('y',pos.y); t.setAttribute('text-anchor','middle');
      t.setAttribute('dominant-baseline','middle'); t.setAttribute('font-size','20'); t.setAttribute('fill','#9ca3af');
      t.textContent='?'; g.appendChild(t);
    }
    if(modoAlumno && nodo.oculto && onRespuesta){
      g.style.cursor='pointer';
      g.onclick=(function(nid){ return function(){
        var val=prompt('¿Cuál es el concepto de este nodo?','');
        if(val!==null) onRespuesta(nid, val);
      }; })(nodo.id);
    }
    svg.appendChild(g);
  });
  return svg;
}

function renderEjercicioMapa(p, contenedor, onCorregir){
  contenedor.innerHTML='';
  var nodos=p.nodos||[]; var conexiones=p.conexiones||[];
  var respuestas={}; var ocultos=nodos.filter(function(n){ return n.oculto; });
  var svgWrap=document.createElement('div'); contenedor.appendChild(svgWrap);
  function refresh(){ svgWrap.innerHTML=''; svgWrap.appendChild(renderMapaSVG(nodos,conexiones,true,respuestas)); }

  var info=document.createElement('div');
  info.style.cssText='padding:10px 14px;background:#f0f4ff;border-radius:var(--r);font-size:13px;color:#3730a3;margin:12px 0';
  info.innerHTML='<strong>🗺 Mapa conceptual</strong> — Rellena los nodos marcados con <strong>?</strong>. Puedes pulsar sobre ellos en el mapa o escribir abajo.';
  contenedor.appendChild(info);

  var grid=document.createElement('div');
  grid.style.cssText='display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:9px;margin-bottom:14px';
  ocultos.forEach(function(nodo, i){
    var g=document.createElement('div'); g.style.cssText='background:var(--surface2);border-radius:var(--r);padding:10px';
    g.innerHTML='<div style="font-size:11px;color:var(--muted);margin-bottom:5px">Nodo '+(i+1)+' (?)</div>';
    var inp=document.createElement('input'); inp.className='fi'; inp.placeholder='Escribe el concepto...';
    inp.oninput=(function(nid){ return function(){ respuestas[nid]=this.value; refresh(); }; })(nodo.id);
    g.appendChild(inp); grid.appendChild(g);
  });
  contenedor.appendChild(grid);

  var btnCorr=document.createElement('button'); btnCorr.className='btn btn-p'; btnCorr.style.cssText='width:100%';
  btnCorr.textContent='✓ Comprobar mapa';
  btnCorr.onclick=function(){
    var ok=0;
    ocultos.forEach(function(n){ if((respuestas[n.id]||'').trim().toLowerCase()===n.texto.trim().toLowerCase()) ok++; });
    var pct=ocultos.length ? Math.round(ok/ocultos.length*100) : 100;
    refresh();
    var res=document.createElement('div');
    res.style.cssText='margin-top:12px;padding:12px 16px;border-radius:var(--r);font-weight:600;background:'+(pct>=70?'var(--green-bg)':'var(--red-bg)')+';color:'+(pct>=70?'var(--green)':'var(--red)');
    res.innerHTML='Resultado: <strong>'+ok+' / '+ocultos.length+'</strong> nodos correctos ('+pct+'%)';
    contenedor.appendChild(res);
    if(onCorregir) onCorregir(pct/10);
  };
  contenedor.appendChild(btnCorr);
  refresh();
}


function mkSeccionTitulo(titulo, sub){
  var div=document.createElement('div'); div.style.cssText='margin:14px 0 8px';
  div.innerHTML='<div style="font-size:13px;font-weight:700;color:var(--navy)">'+titulo+'</div>'+
    (sub?'<div style="font-size:11.5px;color:var(--muted);margin-top:2px">'+sub+'</div>':'');
  return div;
}

// ── Guardar calculo/formulario con nueva estructura ───
function guardarCalculoPregunta(tipo, editId, nuevaBase){
  if(tipo==='calculo'){
    // Datos
    var datos=[];
    document.querySelectorAll('#bqe-datos-cont>div:not(:first-child)').forEach(function(row){
      var inps=row.querySelectorAll('input');
      if(inps[0]&&inps[0].value.trim())
        datos.push({simbolo:inps[0].value.trim(),descripcion:inps[1].value.trim(),valor:parseFloat(inps[2].value)||0,unidad:inps[3].value.trim()});
    });
    nuevaBase.solDatos = datos;

    // Fórmula
    var fm=(document.getElementById('bqe-formula')||{value:''}).value.trim();
    if(!fm){ flash('Escribe la fórmula de la solución','#dc2626'); return false; }
    nuevaBase.solFormula = fm;

  } else if(tipo==='formulario'){
    nuevaBase.solFormula = (document.getElementById('bqe-formula')||{value:''}).value.trim();
  }

  // Pasos (ambos tipos)
  var pasos=[];
  document.querySelectorAll('#bqe-pasos-cont>div').forEach(function(row){
    var inps=row.querySelectorAll('input');
    // calculo: [desc, resultado, tolerancia, unidad] en grid
    // formulario: [numEl(div), desc, resultado, tolerancia, unidad]
    var descInp=null, resInp=null, tolInp=null, undInp=null;
    if(tipo==='calculo'){
      var allInps=row.querySelectorAll('input[type="text"],input:not([type]),input[type="number"]');
      descInp=allInps[0]; resInp=allInps[1]; tolInp=allInps[2]; undInp=allInps[3];
    } else {
      descInp=inps[0]; resInp=inps[1]; tolInp=inps[2]; undInp=inps[3];
    }
    if(descInp&&descInp.value.trim())
      pasos.push({desc:descInp.value.trim(),resultado:parseFloat(resInp&&resInp.value)||0,tolerancia:parseFloat(tolInp&&tolInp.value)||1,unidad:undInp?undInp.value.trim():'€'});
  });
  if(!pasos.length){ flash('Añade al menos un paso de cálculo','#dc2626'); return false; }
  nuevaBase.solPasos = pasos;
  nuevaBase.solInterp = (document.getElementById('bqe-interpretacion')||{value:''}).value.trim();
  return true;
}

// ══════════════════════════════════════════════════════
//  VISTA ALUMNO — Ejercicio de cálculo interactivo
// ══════════════════════════════════════════════════════
function renderEjercicioCalculo(p, contenedor, onCorregir, pesosCalculo, bloqueoFeedback){
  contenedor.innerHTML='';
  var datos = p.solDatos || [];
  var nPasos = (p.solPasos||[]).length;

  // Estado del alumno para esta pregunta
  var est = {
    datos: datos.map(function(){ return {simbolo:'',valor:''}; }),
    formula: '',
    pasos: (p.solPasos||[]).map(function(){ return ''; }),
    interpretacion: '',
    corregido: false
  };

  var wrap = document.createElement('div');

  // ── PASO 1: Datos ─────────────────────────────────────
  var sec1=mkSeccionAlumno('1','📋 Identifica los datos del problema',
    'Lee el enunciado y anota cada dato con su símbolo, valor y unidad.');

  if(datos.length > 0){
    // El profesor definió los datos — el alumno los rellena guiado
    var datosGrid=document.createElement('div'); datosGrid.style.cssText='display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;margin-top:10px';
    datos.forEach(function(d,i){
      var chip=document.createElement('div');
      chip.style.cssText='background:var(--surface);border:2px solid var(--border);border-radius:var(--r);padding:10px 12px;transition:border-color .2s';
      chip.id='alu-dato-'+i;
      chip.innerHTML='<div style="font-size:11px;color:var(--muted);margin-bottom:6px">'+d.descripcion+'</div>'+
        '<div style="display:flex;align-items:center;gap:6px">'+
          '<input class="fi" placeholder="Símbolo" style="width:60px;font-family:IBM Plex Mono,monospace;font-weight:700;font-size:12px" id="alu-dato-sim-'+i+'">'+
          '<span style="color:var(--muted)">=</span>'+
          '<input class="fi" type="number" placeholder="Valor" step="any" style="flex:1" id="alu-dato-val-'+i+'">'+
          '<input class="fi" placeholder="Un." style="width:50px;font-size:12px" id="alu-dato-und-'+i+'">'+
        '</div>';
      datosGrid.appendChild(chip);
    });
    sec1.appendChild(datosGrid);
  } else {
    // Sin datos predefinidos — campo libre para que el alumno los identifique
    var datosLibres=document.createElement('div'); datosLibres.id='alu-datos-libres-wrap';
    var btnAddDatoAlu=document.createElement('button'); btnAddDatoAlu.className='btn btn-g btn-sm'; btnAddDatoAlu.style.cssText='margin-bottom:8px';
    btnAddDatoAlu.textContent='+ Añadir dato identificado';
    var datosLibresList=document.createElement('div'); datosLibresList.id='alu-datos-libres';
    function addDatoLibre(){
      var i=datosLibresList.children.length;
      var row=document.createElement('div'); row.style.cssText='display:flex;align-items:center;gap:7px;margin-bottom:7px';
      row.innerHTML='<input class="fi alu-dato-libre-sim" placeholder="Símbolo" style="width:70px;font-family:IBM Plex Mono,monospace;font-weight:700">'+
        '<span style="color:var(--muted);font-size:14px">=</span>'+
        '<input class="fi alu-dato-libre-val" type="number" placeholder="Valor" step="any" style="flex:1">'+
        '<input class="fi alu-dato-libre-und" placeholder="Unidad" style="width:60px">'+
        '<input class="fi alu-dato-libre-desc" placeholder="¿Qué representa?" style="flex:2">'+
        '<button onclick="this.parentElement.remove()" style="background:var(--red-bg);color:var(--red);border:none;border-radius:6px;padding:5px 8px;cursor:pointer">✕</button>';
      datosLibresList.appendChild(row);
    }
    btnAddDatoAlu.onclick=addDatoLibre;
    addDatoLibre(); // uno por defecto
    datosLibres.appendChild(datosLibresList);
    datosLibres.appendChild(btnAddDatoAlu);
    sec1.appendChild(datosLibres);
  }
  wrap.appendChild(sec1);

  // ── PASO 2: Fórmula ───────────────────────────────────
  var fmAluId = 'alu-formula-'+p.id;
  var sec2=mkSeccionAlumno('2','📐 Escribe la fórmula a aplicar',
    'Indica qué fórmula vas a utilizar para resolver el ejercicio.');
  sec2.appendChild(mkSymPal(fmAluId));
  var fmAlu=document.createElement('textarea'); fmAlu.className='fta'; fmAlu.id=fmAluId; fmAlu.rows=2;
  fmAlu.placeholder='Escribe aquí la fórmula matemática a aplicar…';
  var fmAluPrev=document.createElement('div'); fmAluPrev.className='formula-render';
  fmAluPrev.style.cssText='font-family:IBM Plex Mono,monospace;font-size:.95rem;background:var(--surface2);border-left:3px solid var(--border);border-radius:0 var(--r) var(--r) 0;padding:10px 14px;margin-top:6px;min-height:36px;color:var(--muted)';
  fmAluPrev.textContent='Tu fórmula aparecerá aquí…';
  fmAlu.oninput=function(){ fmAluPrev.textContent=this.value||'Tu fórmula aparecerá aquí…'; fmAluPrev.style.color=this.value?'var(--text)':'var(--muted)'; };
  sec2.appendChild(fmAlu); sec2.appendChild(fmAluPrev);
  wrap.appendChild(sec2);

  // ── PASO 3: Cálculo paso a paso ───────────────────────
  var sec3=mkSeccionAlumno('3','🔢 Realiza el cálculo paso a paso',
    'Resuelve cada paso mostrando tu operación y el resultado obtenido.');

  if((p.solPasos||[]).length === 0){
    // Sin pasos predefinidos — área libre de cálculo con pasos que el alumno añade
    var calcLibreWrap=document.createElement('div'); calcLibreWrap.id='alu-calc-libre-wrap';
    var calcLibreList=document.createElement('div'); calcLibreList.id='alu-calc-libre';
    function addPasoLibre(){
      var i=calcLibreList.children.length;
      var box=document.createElement('div'); box.className='paso-box'; box.style.marginBottom='8px';
      var hdr=document.createElement('div'); hdr.style.cssText='display:flex;align-items:center;gap:8px;margin-bottom:8px';
      var numEl=document.createElement('div'); numEl.className='paso-num'; numEl.textContent=i+1;
      var lbl=document.createElement('span'); lbl.style.cssText='font-size:12px;font-weight:600;color:var(--muted);flex:1'; lbl.textContent='Paso '+(i+1);
      var btnDel=document.createElement('button'); btnDel.className='btn btn-d btn-sm'; btnDel.textContent='✕';
      btnDel.onclick=function(){ box.remove(); calcLibreList.querySelectorAll('.paso-num').forEach(function(n,j){ n.textContent=j+1; }); };
      hdr.appendChild(numEl); hdr.appendChild(lbl); hdr.appendChild(btnDel);
      box.appendChild(hdr);
      var row=document.createElement('div'); row.style.cssText='display:flex;align-items:center;gap:10px;flex-wrap:wrap';
      var opEl=document.createElement('textarea'); opEl.className='fta'; opEl.rows=1; opEl.placeholder='Escribe tu operación o desarrollo…'; opEl.style.flex='1';
      var resWrap=document.createElement('div'); resWrap.style.cssText='display:flex;align-items:center;gap:6px;flex-shrink:0';
      resWrap.innerHTML='<span style="font-size:13px;font-weight:600;color:var(--muted)">=</span>';
      var resInp=document.createElement('input'); resInp.className='calc-input'; resInp.type='number'; resInp.step='any'; resInp.placeholder='Resultado';
      var undInp=document.createElement('input'); undInp.className='fi'; undInp.placeholder='€'; undInp.style.cssText='width:50px;font-family:IBM Plex Mono,monospace';
      resWrap.appendChild(resInp); resWrap.appendChild(undInp);
      row.appendChild(opEl); row.appendChild(resWrap);
      box.appendChild(row);
      calcLibreList.appendChild(box);
    }
    addPasoLibre();
    var btnAddPasoLibre=document.createElement('button'); btnAddPasoLibre.className='btn btn-g btn-sm'; btnAddPasoLibre.style.marginTop='6px';
    btnAddPasoLibre.textContent='+ Añadir paso'; btnAddPasoLibre.onclick=addPasoLibre;
    calcLibreWrap.appendChild(calcLibreList);
    calcLibreWrap.appendChild(btnAddPasoLibre);
    sec3.appendChild(calcLibreWrap);
  }

  (p.solPasos||[]).forEach(function(paso,i){
    var pasoBox=document.createElement('div'); pasoBox.className='paso-box'; pasoBox.id='alu-paso-box-'+i;
    var pHdr=document.createElement('div'); pHdr.style.cssText='display:flex;align-items:center;gap:10px;margin-bottom:10px';
    var numEl=document.createElement('div'); numEl.className='paso-num'; numEl.textContent=i+1;
    var descEl=document.createElement('div'); descEl.style.cssText='flex:1;font-size:13.5px;font-weight:500'; descEl.textContent=paso.desc;
    pHdr.appendChild(numEl); pHdr.appendChild(descEl);
    pasoBox.appendChild(pHdr);

    var inputRow=document.createElement('div'); inputRow.style.cssText='display:flex;align-items:center;gap:10px;flex-wrap:wrap';
    var opEl=document.createElement('textarea'); opEl.className='fta'; opEl.rows=1; opEl.id='alu-paso-op-'+i;
    opEl.placeholder='Escribe aquí tu operación o desarrollo…'; opEl.style.flex='1';
    var resWrap=document.createElement('div'); resWrap.style.cssText='display:flex;align-items:center;gap:6px;flex-shrink:0';
    resWrap.innerHTML='<span style="font-size:13px;font-weight:600;color:var(--muted)">=</span>';
    var resInp=document.createElement('input'); resInp.className='calc-input'; resInp.type='number'; resInp.step='any'; resInp.id='alu-paso-res-'+i; resInp.placeholder='Resultado';
    var undEl=document.createElement('span'); undEl.style.cssText='font-size:13px;color:var(--muted);font-family:IBM Plex Mono,monospace'; undEl.textContent=paso.unidad||'€';
    var feedEl=document.createElement('span'); feedEl.id='alu-paso-feed-'+i; feedEl.style.cssText='font-size:1.1rem;margin-left:4px';
    resWrap.appendChild(resInp); resWrap.appendChild(undEl); resWrap.appendChild(feedEl);
    inputRow.appendChild(opEl); inputRow.appendChild(resWrap);
    pasoBox.appendChild(inputRow);
    sec3.appendChild(pasoBox);
  });
  wrap.appendChild(sec3);

  // ── PASO 4: Interpretación ────────────────────────────
  var sec4=mkSeccionAlumno('4','💬 Interpreta el resultado',
    'Explica qué significa el resultado obtenido y qué decisión se debería tomar.');
  var interpAlu=document.createElement('textarea'); interpAlu.className='fta'; interpAlu.id='alu-interp-'+p.id; interpAlu.rows=3;
  interpAlu.placeholder='Escribe tu interpretación del resultado: ¿qué significa? ¿qué decisión implica?…';
  sec4.appendChild(interpAlu);
  wrap.appendChild(sec4);

  // ── Botón corregir ────────────────────────────────────
  var btnCorr=document.createElement('button'); btnCorr.className='btn btn-p';
  btnCorr.style.cssText='width:100%;padding:12px;font-size:15px;margin-top:16px';
  if(bloqueoFeedback){
    btnCorr.innerHTML='🔒 Bloqueado: entrega primero la actividad';
    btnCorr.disabled=true; btnCorr.style.opacity='0.5'; btnCorr.style.cursor='not-allowed';
    btnCorr.dataset.bloqueoCalculo='1';
    btnCorr._onCorregirRef=function(){ corregirCalculo(p, wrap, onCorregir, pesosCalculo); };
  } else {
    btnCorr.innerHTML='✓ Corregir ejercicio';
    btnCorr.onclick=function(){ corregirCalculo(p, wrap, onCorregir, pesosCalculo); };
  }
  wrap.appendChild(btnCorr);

  contenedor.appendChild(wrap);
}

function mkSeccionAlumno(num, titulo, sub){
  var sec=document.createElement('div'); sec.style.cssText='margin-bottom:20px';
  var hdr=document.createElement('div'); hdr.style.cssText='display:flex;align-items:center;gap:10px;margin-bottom:8px';
  var numEl=document.createElement('div');
  numEl.style.cssText='width:30px;height:30px;border-radius:8px;background:var(--navy);color:var(--gold-light);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0';
  numEl.textContent=num;
  var titDiv=document.createElement('div');
  titDiv.innerHTML='<div style="font-size:14px;font-weight:700">'+titulo+'</div>'+
    (sub?'<div style="font-size:12px;color:var(--muted);margin-top:1px">'+sub+'</div>':'');
  hdr.appendChild(numEl); hdr.appendChild(titDiv);
  sec.appendChild(hdr);
  return sec;
}

// ── Corrección automática ─────────────────────────────
function corregirCalculo(p, wrap, onCorregir, pesosCalculo){
  // Pesos por defecto si no vienen de la actividad evaluable
  var pw = pesosCalculo || { datos:20, formula:20, calculo:40, interp:20 };
  var puntosDatos=0, puntosFormula=0, puntosCalculo=0, puntosInterp=0;
  var maxDatos=0, maxPasos=0;

  // ── 1. Datos ──────────────────────────────────────────
  (p.solDatos||[]).forEach(function(d,i){
    var simInp=document.getElementById('alu-dato-sim-'+i);
    var valInp=document.getElementById('alu-dato-val-'+i);
    var chip=document.getElementById('alu-dato-'+i);
    if(!chip) return;
    maxDatos++;
    var simOk = simInp && simInp.value.trim().replace(/\s/g,'')===d.simbolo.replace(/\s/g,'');
    var valNum = parseFloat(valInp&&valInp.value)||0;
    var tol = Math.abs(d.valor)*0.02+0.01;
    var valOk = Math.abs(valNum-d.valor)<=tol;
    var ok = simOk && valOk;
    if(ok) puntosDatos++;
    chip.style.border='2px solid '+(ok?'var(--green)':'var(--red)');
    chip.style.background=ok?'var(--green-bg)':'var(--red-bg)';
    if(!ok){
      var hint=document.createElement('div'); hint.style.cssText='font-size:11.5px;margin-top:6px;color:var(--green);font-weight:500';
      hint.innerHTML='✓ '+d.simbolo+' = '+d.valor+' '+d.unidad; chip.appendChild(hint);
    }
  });
  var pctDatos = maxDatos>0 ? puntosDatos/maxDatos : 0;

  // ── 2. Fórmula ───────────────────────────────────────
  var fmAlu=(document.getElementById('alu-formula-'+p.id)||{value:''}).value.trim();
  var fmProf=(p.solFormula||'').trim();
  function normFm(s){ return s.toLowerCase().replace(/\s+/g,'').replace(/[=\-+×÷]/g,''); }
  var fmOk = fmAlu.length>0 && p.solFormula &&
    (normFm(fmAlu)===normFm(fmProf)||fmProf.toLowerCase().includes(normFm(fmAlu).slice(0,6)));
  puntosFormula = (!p.solFormula || fmOk) ? 1 : 0; // si no hay fórmula definida, no penalizar
  var fmAluEl=document.getElementById('alu-formula-'+p.id);
  if(fmAluEl){
    fmAluEl.style.border='2px solid '+(fmOk||!p.solFormula?'var(--green)':'var(--red)');
    if(p.solFormula&&!fmOk){
      var fmHint=document.createElement('div'); fmHint.style.cssText='font-size:12px;margin-top:6px;padding:8px 10px;background:var(--green-bg);border-radius:var(--r);color:var(--green);font-family:IBM Plex Mono,monospace';
      fmHint.innerHTML='✓ Fórmula correcta: '+p.solFormula;
      fmAluEl.parentNode.insertBefore(fmHint,fmAluEl.nextSibling);
    }
  }

  // ── 3. Pasos de cálculo ───────────────────────────────
  (p.solPasos||[]).forEach(function(paso,i){
    maxPasos++;
    var resInp=document.getElementById('alu-paso-res-'+i);
    var feedEl=document.getElementById('alu-paso-feed-'+i);
    var box=document.getElementById('alu-paso-box-'+i);
    if(!resInp) return;
    var alumnoVal=parseFloat(resInp.value);
    var ok=!isNaN(alumnoVal)&&Math.abs(alumnoVal-paso.resultado)<=(paso.tolerancia||1);
    if(ok) puntosCalculo++;
    resInp.className='calc-input '+(ok?'ok':'ko');
    if(feedEl) feedEl.textContent=ok?'✅':'❌';
    if(!ok&&box){
      var pHint=document.createElement('div'); pHint.style.cssText='font-size:12px;margin-top:8px;padding:8px 10px;background:var(--green-bg);border-radius:var(--r);color:var(--green)';
      pHint.innerHTML='✓ Resultado correcto: <strong>'+paso.resultado+' '+(paso.unidad||'')+'</strong>';
      box.appendChild(pHint);
    }
  });
  var pctCalculo = maxPasos>0 ? puntosCalculo/maxPasos : 1;

  // ── 4. Interpretación ─────────────────────────────────
  var interpEl=document.getElementById('alu-interp-'+p.id);
  var notaInterp=null; // null = pendiente manual, 1 = ok, 0 = sin respuesta
  if(interpEl){
    var tieneRespInterp = interpEl.value && interpEl.value.trim().length>2;
    notaInterp = tieneRespInterp ? null : 0; // null = tiene texto pero requiere revisión manual
    if(p.solInterp){
      var interpHint=document.createElement('div');
      interpHint.style.cssText='margin-top:10px;padding:12px 14px;background:var(--green-bg);border-radius:var(--r);border-left:3px solid var(--green)';
      interpHint.innerHTML='<div style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--green);margin-bottom:4px">✓ Interpretación modelo</div>'+
        '<div style="font-size:13.5px;line-height:1.7">'+p.solInterp+'</div>';
      interpEl.parentNode.insertBefore(interpHint, interpEl.nextSibling);
    }
    // Campo de nota manual para la interpretación
    if(tieneRespInterp){
      var manualInterpWrap=document.createElement('div');
      manualInterpWrap.style.cssText='margin-top:8px;padding:9px 12px;background:var(--amber-bg);border-radius:var(--r);border-left:3px solid var(--amber);display:flex;align-items:center;gap:10px';
      var manualInterpLbl=document.createElement('div'); manualInterpLbl.style.cssText='font-size:12px;font-weight:600;color:var(--amber);flex:1';
      manualInterpLbl.textContent='✏️ Puntúa la interpretación:';
      var manualInterpInp=document.createElement('input'); manualInterpInp.type='number';
      manualInterpInp.min='0'; manualInterpInp.max='10'; manualInterpInp.step='0.5';
      manualInterpInp.style.cssText='width:60px;padding:4px 6px;border:1px solid var(--border);border-radius:6px;font-size:13px;font-weight:700;text-align:center;font-family:IBM Plex Mono,monospace';
      manualInterpInp.placeholder='0-10';
      manualInterpInp.id='calculo-interp-nota-'+p.id;
      manualInterpInp.onchange=function(){
        notaInterp=parseFloat(this.value)/10;
        actualizarResCalculo();
      };
      var de=document.createElement('span'); de.style.cssText='font-size:12px;color:var(--muted)'; de.textContent='/10';
      manualInterpWrap.appendChild(manualInterpLbl); manualInterpWrap.appendChild(manualInterpInp); manualInterpWrap.appendChild(de);
      interpEl.parentNode.insertBefore(manualInterpWrap, interpEl.nextSibling.nextSibling || null);
    }
  }

  // ── Resultado ponderado ───────────────────────────────
  var resBox=document.createElement('div');
  resBox.id='calc-res-box-'+p.id;
  resBox.style.cssText='margin-top:16px;padding:14px 18px;border-radius:var(--rl)';
  wrap.appendChild(resBox);

  function actualizarResCalculo(){
    var interpFinal = notaInterp!==null ? notaInterp : 0;
    var nota10 =
      (pctDatos    * pw.datos/100) +
      (puntosFormula * pw.formula/100) +
      (pctCalculo  * pw.calculo/100) +
      (interpFinal * pw.interp/100);
    nota10 = Math.max(0, Math.min(1, nota10));
    var pct = Math.round(nota10*100);
    var pendienteInterp = notaInterp===null;

    resBox.style.cssText='margin-top:16px;padding:14px 18px;border-radius:var(--rl);background:'+
      (pendienteInterp?'var(--amber-bg)':pct>=70?'var(--green-bg)':'var(--red-bg)')+';border:2px solid '+
      (pendienteInterp?'#fde68a':pct>=70?'#bbf7d0':'#fecaca');

    // Desglose por pasos
    var desglose=[
      {label:'1. Datos',     pct:Math.round(pctDatos*100),    peso:pw.datos},
      {label:'2. Fórmula',   pct:puntosFormula*100,           peso:pw.formula},
      {label:'3. Cálculo',   pct:Math.round(pctCalculo*100),  peso:pw.calculo},
      {label:'4. Interpretación', pct:notaInterp!==null?Math.round(notaInterp*100):null, peso:pw.interp},
    ];

    var desgloseHtml=desglose.map(function(d){
      var color=d.pct===null?'var(--amber)':d.pct>=70?'var(--green)':'var(--red)';
      return '<div style="display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid rgba(0,0,0,.06)">'+
        '<div style="flex:1;font-size:12px">'+d.label+'</div>'+
        '<div style="font-size:11px;color:var(--muted)">peso '+d.peso+'%</div>'+
        '<div style="font-size:13px;font-weight:700;color:'+color+';width:50px;text-align:right">'+
          (d.pct===null?'⏳ —':d.pct+'%')+'</div>'+
      '</div>';
    }).join('');

    resBox.innerHTML=
      '<div style="display:flex;align-items:center;gap:14px;margin-bottom:12px">'+
        '<div style="font-size:2.2rem;font-weight:800;color:'+(pendienteInterp?'var(--amber)':pct>=70?'var(--green)':'var(--red)')+'">'+
          (pendienteInterp?'⏳':''+pct+'%')+'</div>'+
        '<div style="flex:1">'+
          '<div style="font-size:14px;font-weight:600">'+(pendienteInterp?'Pendiente corrección interpretación':'Puntuación total')+'</div>'+
          (p.explicacion?'<div style="font-size:12px;font-style:italic;color:var(--muted);margin-top:2px">💡 '+p.explicacion+'</div>':'')+
        '</div>'+
      '</div>'+
      desgloseHtml;

    if(onCorregir) onCorregir(pendienteInterp?null:pct, nota10*100, 100, desglose);
  }

  actualizarResCalculo();
}



// ── Guardar pregunta extendida ────────────────────────
