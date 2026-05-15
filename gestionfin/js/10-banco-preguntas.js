// ══════════════════════════════════════════════════════
//  BANCO DE PREGUNTAS + MOTOR DE TEST
//  Módulo Gestión Financiera · CFGS AF · IES Cantillana
// ══════════════════════════════════════════════════════

var BANCO_KEY = 'gf_banco_preguntas';
var TEST_HIST_KEY = 'gf_test_historial';

function getBanco(){ try{ return JSON.parse(localStorage.getItem(BANCO_KEY)||'[]'); }catch(e){ return []; } }
function saveBanco(arr){ localStorage.setItem(BANCO_KEY, JSON.stringify(arr)); }
function getTestHist(){ try{ return JSON.parse(localStorage.getItem(TEST_HIST_KEY)||'[]'); }catch(e){ return []; } }
function saveTestHist(arr){ localStorage.setItem(TEST_HIST_KEY, JSON.stringify(arr)); }

// Genera preguntas de ejemplo para cada unidad si el banco está vacío
function initBancoConEjemplos(){
  var banco = getBanco();
  if(banco.length) return;

  var ejemplos = [
    // ── BLOQUE 1: Necesidades de Financiación ────────────
    {id:uid2(),ud:'ud1',enunciado:'¿Cuál de las siguientes es una fuente de financiación PROPIA de la empresa?',tipo:'test',dificultad:'basica',
     opciones:['Préstamo bancario a largo plazo','Reservas generadas por beneficios','Emisión de obligaciones','Crédito de proveedores'],correcto:1,
     explicacion:'Las reservas son beneficios no distribuidos que se reinvierten en la empresa, constituyendo financiación propia interna.',
     ra:'RA1',ce:'CE1.b'},
    {id:uid2(),ud:'ud1',enunciado:'Una empresa que financia su maquinaria con un préstamo bancario está utilizando financiación:',tipo:'test',dificultad:'basica',
     opciones:['Propia interna','Propia externa','Ajena a largo plazo','Ajena a corto plazo'],correcto:2,
     explicacion:'Un préstamo bancario es financiación ajena (procede de terceros). Si su plazo supera un año, es a largo plazo.',
     ra:'RA1',ce:'CE1.b'},
    {id:uid2(),ud:'ud1',enunciado:'La ampliación de capital mediante emisión de nuevas acciones es una fuente de financiación propia externa.',tipo:'vf',dificultad:'basica',
     opciones:['Verdadero','Falso'],correcto:0,
     explicacion:'Correcto. Es propia porque no crea deuda con terceros, y externa porque los fondos provienen del exterior (nuevos accionistas).',
     ra:'RA1',ce:'CE1.b'},
    {id:uid2(),ud:'ud1',enunciado:'El leasing financiero desde el punto de vista de la empresa arrendataria se contabiliza como:',tipo:'test',dificultad:'media',
     opciones:['Un gasto corriente en la cuenta de resultados','Un activo y un pasivo financiero en el balance','Solo un pasivo financiero','Solo un activo no corriente'],correcto:1,
     explicacion:'En el leasing financiero, la empresa reconoce el bien como activo (derecho de uso) y la deuda con la entidad como pasivo financiero.',
     ra:'RA1',ce:'CE1.a'},
    {id:uid2(),ud:'ud1',enunciado:'¿Qué ratio mide la capacidad de la empresa para hacer frente a sus deudas a corto plazo con sus activos corrientes?',tipo:'test',dificultad:'media',
     opciones:['Ratio de endeudamiento','Ratio de liquidez corriente','Ratio de rentabilidad económica','Ratio de solvencia'],correcto:1,
     explicacion:'El ratio de liquidez corriente = Activo Corriente / Pasivo Corriente. Indica si la empresa puede pagar sus deudas a corto plazo.',
     ra:'RA1',ce:'CE1.c'},

    // ── BLOQUE 2-3: Sistema Financiero y Productos ───────
    {id:uid2(),ud:'ud2',enunciado:'El Banco de España es el organismo supervisor de:',tipo:'test',dificultad:'basica',
     opciones:['Las entidades de seguros','Las entidades de crédito y bancos','Los mercados de valores','Las sociedades gestoras de fondos'],correcto:1,
     explicacion:'El Banco de España supervisa y regula las entidades de crédito (bancos, cajas y cooperativas de crédito) en España.',
     ra:'RA2',ce:'CE2.a'},
    {id:uid2(),ud:'ud2',enunciado:'La CNMV (Comisión Nacional del Mercado de Valores) supervisa y controla los mercados de valores en España.',tipo:'vf',dificultad:'basica',
     opciones:['Verdadero','Falso'],correcto:0,
     explicacion:'Correcto. La CNMV es el organismo encargado de la supervisión e inspección de los mercados de valores españoles y de la actividad de cuantos intervienen en ellos.',
     ra:'RA2',ce:'CE2.a'},
    {id:uid2(),ud:'ud2',enunciado:'Si invierto 10.000 € al 4% de interés simple durante 3 años, ¿cuánto obtendré al final?',tipo:'test',dificultad:'basica',
     opciones:['10.400 €','11.200 €','11.248,64 €','10.040 €'],correcto:1,
     explicacion:'Interés simple: I = C × r × t = 10.000 × 0,04 × 3 = 1.200 €. Capital final = 10.000 + 1.200 = 11.200 €.',
     ra:'RA3',ce:'CE3.b'},
    {id:uid2(),ud:'ud2',enunciado:'Si invierto 5.000 € al 3% de interés compuesto anual durante 2 años, ¿cuál es el capital final?',tipo:'test',dificultad:'media',
     opciones:['5.300 €','5.304,50 €','5.309,45 €','5.315 €'],correcto:2,
     explicacion:'Capitalización compuesta: Cn = C0 × (1+r)^n = 5.000 × (1,03)² = 5.000 × 1,0609 = 5.304,50 €. (Opción correcta: 5.304,50 €)',
     ra:'RA3',ce:'CE3.b'},
    {id:uid2(),ud:'ud2',enunciado:'Una renta pospagable es aquella en la que los pagos se realizan al:',tipo:'test',dificultad:'basica',
     opciones:['Inicio de cada período','Final de cada período','Inicio del primer período únicamente','Mitad de cada período'],correcto:1,
     explicacion:'En una renta pospagable (u ordinaria) los pagos o cobros se producen al final de cada período. Es el tipo más habitual (hipotecas, alquileres...).',
     ra:'RA3',ce:'CE3.b'},
    {id:uid2(),ud:'ud2',enunciado:'La TAE (Tasa Anual Equivalente) permite comparar el coste o rendimiento real de productos financieros independientemente de su plazo.',tipo:'vf',dificultad:'basica',
     opciones:['Verdadero','Falso'],correcto:0,
     explicacion:'Correcto. La TAE homogeneiza los tipos de interés a base anual, incorporando las comisiones y gastos, lo que facilita la comparación entre productos.',
     ra:'RA3',ce:'CE3.c'},
    {id:uid2(),ud:'ud2',enunciado:'En una cuenta corriente bancaria, el banco es el __________ y el cliente es el __________.',tipo:'test',dificultad:'basica',
     opciones:['Prestatario / Prestamista','Prestamista / Prestatario','Tomador / Asegurado','Emisor / Suscriptor'],correcto:1,
     explicacion:'En los depósitos (cuenta corriente, ahorro), el cliente PRESTA dinero al banco (es prestamista) y el banco es el prestatario que debe devolver el dinero.',
     ra:'RA2',ce:'CE2.c'},
    {id:uid2(),ud:'ud2',enunciado:'El leasing se diferencia del renting principalmente en que:',tipo:'test',dificultad:'media',
     opciones:['El leasing incluye siempre mantenimiento y seguro','El leasing incluye opción de compra al final del contrato','El renting es siempre más caro','El leasing es solo para bienes inmuebles'],correcto:1,
     explicacion:'La principal diferencia es la opción de compra: el leasing la incluye al valor residual pactado; el renting generalmente no incluye opción de compra y es puramente un alquiler operativo.',
     ra:'RA3',ce:'CE3.e'},

    // ── BLOQUE 4: Los Seguros ──────────────────────────
    {id:uid2(),ud:'ud3',enunciado:'¿Cuál es la diferencia entre el tomador y el asegurado en un contrato de seguro?',tipo:'test',dificultad:'media',
     opciones:['Son siempre la misma persona','El tomador paga la prima; el asegurado es quien corre el riesgo cubierto','El asegurado paga la prima; el tomador recibe la indemnización','El tomador recibe siempre la indemnización'],correcto:1,
     explicacion:'El tomador contrata y paga la prima, pero puede ser diferente del asegurado (quien soporta el riesgo). El beneficiario es quien cobra la indemnización.',
     ra:'RA4',ce:'CE4.c'},
    {id:uid2(),ud:'ud3',enunciado:'La prima pura o prima de riesgo es la parte de la prima destinada a cubrir el coste esperado de los siniestros.',tipo:'vf',dificultad:'basica',
     opciones:['Verdadero','Falso'],correcto:0,
     explicacion:'Correcto. La prima total = Prima pura (coste del riesgo) + Recargos (gastos de gestión, comerciales y beneficio de la aseguradora).',
     ra:'RA4',ce:'CE4.g'},
    {id:uid2(),ud:'ud3',enunciado:'Un seguro de vida entera garantiza el pago de un capital al fallecimiento del asegurado __________ ocurra.',tipo:'test',dificultad:'basica',
     opciones:['Solo si ocurre antes de los 65 años','Solo si ocurre durante el período contratado','Cuando quiera que','Solo si es por causa natural'],correcto:2,
     explicacion:'El seguro de vida entera cubre el fallecimiento sea cuando sea, sin límite temporal. A diferencia del seguro de vida a término que solo cubre un período concreto.',
     ra:'RA4',ce:'CE4.d'},
    {id:uid2(),ud:'ud3',enunciado:'El principio indemnizatorio en los seguros de daños establece que la indemnización no puede superar el valor del daño real sufrido.',tipo:'vf',dificultad:'basica',
     opciones:['Verdadero','Falso'],correcto:0,
     explicacion:'Correcto. El seguro de daños no puede ser fuente de lucro: la indemnización compensa la pérdida pero no puede generar beneficio al asegurado.',
     ra:'RA4',ce:'CE4.e'},

    // ── BLOQUE 5: Inversiones ──────────────────────────
    {id:uid2(),ud:'ud4',enunciado:'Si el VAN de un proyecto de inversión es positivo, significa que el proyecto:',tipo:'test',dificultad:'basica',
     opciones:['Genera pérdidas','Es indiferente realizarlo o no','Genera valor para la empresa y debe aceptarse','Tiene una TIR inferior al coste del capital'],correcto:2,
     explicacion:'VAN > 0 indica que el proyecto genera más valor del que cuesta financiarlo: crea riqueza para la empresa y debe aceptarse.',
     ra:'RA5',ce:'CE5.g'},
    {id:uid2(),ud:'ud4',enunciado:'La TIR de un proyecto es la tasa de descuento que hace el VAN igual a cero.',tipo:'vf',dificultad:'basica',
     opciones:['Verdadero','Falso'],correcto:0,
     explicacion:'Correcto. La TIR (Tasa Interna de Retorno) es precisamente la tasa que iguala el VAN a cero. Si TIR > coste de capital, el proyecto es rentable.',
     ra:'RA5',ce:'CE5.g'},
    {id:uid2(),ud:'ud4',enunciado:'Las Letras del Tesoro son activos financieros de:',tipo:'test',dificultad:'basica',
     opciones:['Renta variable emitidos por el Estado','Renta fija emitidos por empresas privadas','Renta fija emitidos por el Estado a corto plazo','Renta variable emitidos por bancos'],correcto:2,
     explicacion:'Las Letras del Tesoro son valores de renta fija a corto plazo (3, 6, 9 y 12 meses) emitidos por el Estado español para financiar su deuda.',
     ra:'RA5',ce:'CE5.b'},
    {id:uid2(),ud:'ud4',enunciado:'Si una acción cotiza a 15 € y su valor nominal es 10 €, la prima de emisión sería de:',tipo:'test',dificultad:'media',
     opciones:['25 €','5 €','10 €','150%'],correcto:1,
     explicacion:'Prima de emisión = Precio de emisión − Valor nominal = 15 − 10 = 5 € por acción.',
     ra:'RA5',ce:'CE5.c'},
    {id:uid2(),ud:'ud4',enunciado:'La diversificación de una cartera de inversión tiene como objetivo principal:',tipo:'test',dificultad:'media',
     opciones:['Maximizar la rentabilidad esperada','Reducir el riesgo no sistemático o específico','Eliminar completamente el riesgo de mercado','Concentrar la inversión en los activos más rentables'],correcto:1,
     explicacion:'La diversificación reduce el riesgo específico (de cada empresa) combinando activos con baja correlación. El riesgo de mercado (sistemático) no puede eliminarse por diversificación.',
     ra:'RA5',ce:'CE5.f'},

    // ── BLOQUE 6: Presupuestos ─────────────────────────
    {id:uid2(),ud:'ud5',enunciado:'El presupuesto de tesorería recoge:',tipo:'test',dificultad:'basica',
     opciones:['Solo los gastos previstos del ejercicio','Las previsiones de cobros y pagos para determinar la liquidez futura','El resultado esperado del ejercicio','El balance de situación previsional'],correcto:1,
     explicacion:'El presupuesto de tesorería recoge todos los cobros y pagos previstos para un período, permitiendo anticipar posibles tensiones de liquidez.',
     ra:'RA6',ce:'CE6.a'},
    {id:uid2(),ud:'ud5',enunciado:'Una desviación presupuestaria desfavorable en costes significa que los costes reales han sido SUPERIORES a los presupuestados.',tipo:'vf',dificultad:'basica',
     opciones:['Verdadero','Falso'],correcto:0,
     explicacion:'Correcto. En costes, desviación desfavorable = coste real > coste presupuestado (gasto mayor al previsto). En ingresos sería al revés.',
     ra:'RA6',ce:'CE6.f'},
    {id:uid2(),ud:'ud5',enunciado:'El presupuesto de explotación incluye principalmente:',tipo:'test',dificultad:'basica',
     opciones:['Las inversiones en activos fijos','Los ingresos y gastos operativos previstos','Los cobros y pagos de tesorería','El endeudamiento financiero previsto'],correcto:1,
     explicacion:'El presupuesto de explotación recoge los ingresos por ventas y los gastos operativos previstos, obteniendo el resultado de explotación esperado.',
     ra:'RA6',ce:'CE6.a'},
  ];

  saveBanco(ejemplos);
}
function uid2(){ return 'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,6); }

// ══════════════════════════════════════════════════════
//  BANCO DE PREGUNTAS — Vista profesor
// ══════════════════════════════════════════════════════
var bancoBanco = [];       // cache en memoria
var bancoFiltroUD = 'todas';
var bancoFiltroDif = 'todas';
var bancoFiltroTipo = 'todas';

function initBanco(){
  initBancoConEjemplos();
  bancoBanco = getBanco();
  var root = document.getElementById('banco-root');
  if(!root) return;
  root.innerHTML = '';
  renderBancoVista(root);
}

function renderBancoVista(root){
  root.innerHTML = '';
  var ph = document.createElement('div'); ph.className='ph';
  ph.innerHTML =
    '<div><h1 class="pt">Banco de Preguntas</h1>'+
    '<p class="ps">Preguntas para test de repaso y evaluables · Gestión Financiera</p></div>'+
    '<button class="btn btn-p" onclick="abrirModalNuevaPreguntaExt()">+ Nueva pregunta</button>';
  root.appendChild(ph);

  // Stats
  var banco = getBanco();
  var statsRow = document.createElement('div'); statsRow.className='grid-s'; statsRow.style.marginBottom='1.5rem';
  var uds=['todas'].concat(UNIDADES.map(function(u){return u.id;}));
  var tiposCount = {test:0,vf:0};
  banco.forEach(function(p){ tiposCount[p.tipo]=(tiposCount[p.tipo]||0)+1; });
  [
    {l:'Total preguntas', v:banco.length, ico:'📋'},
    {l:'Test opción múltiple', v:tiposCount.test||0, ico:'🔘'},
    {l:'Verdadero / Falso', v:tiposCount.vf||0, ico:'✅'},
    {l:'Unidades cubiertas', v:new Set(banco.map(function(p){return p.ud;})).size, ico:'📚'},
  ].forEach(function(s){
    var sc=document.createElement('div'); sc.className='sc';
    sc.innerHTML='<div class="sl">'+s.ico+' '+s.l+'</div><div class="sn" style="font-size:20px">'+s.v+'</div>';
    statsRow.appendChild(sc);
  });
  root.appendChild(statsRow);

  // Filtros
  var filtros = document.createElement('div');
  filtros.style.cssText='display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px;align-items:center';
  filtros.innerHTML='<span style="font-size:12px;font-weight:600;color:var(--muted)">Filtrar:</span>';

  // Filtro UD
  var selUD=document.createElement('select'); selUD.className='fs'; selUD.style.cssText='width:auto;font-size:13px;padding:6px 10px';
  selUD.innerHTML='<option value="todas">Todas las unidades</option>'+
    UNIDADES.map(function(u){return '<option value="'+u.id+'">UD'+u.n+' · '+u.titulo+'</option>';}).join('');
  selUD.value=bancoFiltroUD;
  selUD.onchange=function(){ bancoFiltroUD=this.value; renderBancoPreguntasList(listaCont,getBanco()); };

  // Filtro dificultad
  var selDif=document.createElement('select'); selDif.className='fs'; selDif.style.cssText='width:auto;font-size:13px;padding:6px 10px';
  selDif.innerHTML='<option value="todas">Todas las dificultades</option>'+
    '<option value="basica">⭐ Básica</option><option value="media">⭐⭐ Media</option><option value="avanzada">⭐⭐⭐ Avanzada</option>';
  selDif.value=bancoFiltroDif;
  selDif.onchange=function(){ bancoFiltroDif=this.value; renderBancoPreguntasList(listaCont,getBanco()); };

  // Filtro tipo
  var selTipo=document.createElement('select'); selTipo.className='fs'; selTipo.style.cssText='width:auto;font-size:13px;padding:6px 10px';
  selTipo.innerHTML='<option value="todas">Todos los tipos</option>'+
    '<option value="test">Opción múltiple</option><option value="vf">Verdadero/Falso</option>';
  selTipo.value=bancoFiltroTipo;
  selTipo.onchange=function(){ bancoFiltroTipo=this.value; renderBancoPreguntasList(listaCont,getBanco()); };

  [selUD,selDif,selTipo].forEach(function(s){ filtros.appendChild(s); });
  root.appendChild(filtros);

  // Lista de preguntas
  var listaCont = document.createElement('div');
  root.appendChild(listaCont);
  renderBancoPreguntasList(listaCont, banco);
}

function renderBancoPreguntasList(cont, banco){
  var filtrado = banco.filter(function(p){
    if(bancoFiltroUD!=='todas' && p.ud!==bancoFiltroUD) return false;
    if(bancoFiltroDif!=='todas' && p.dificultad!==bancoFiltroDif) return false;
    if(bancoFiltroTipo!=='todas' && p.tipo!==bancoFiltroTipo) return false;
    return true;
  });

  cont.innerHTML='';
  if(!filtrado.length){
    cont.innerHTML='<div class="card" style="text-align:center;padding:2rem;color:var(--muted)">'+
      '<div style="font-size:2rem;margin-bottom:8px">📭</div>'+
      '<div>No hay preguntas con estos filtros.</div></div>';
    return;
  }

  var difColor={basica:'b-green',media:'b-amber',avanzada:'b-red'};
  var difLabel={basica:'⭐ Básica',media:'⭐⭐ Media',avanzada:'⭐⭐⭐ Avanzada'};
  var tipoLabel={test:'Opción múltiple',vf:'Verdadero/Falso'};

  filtrado.forEach(function(p){
    var udObj = UNIDADES.find(function(u){return u.id===p.ud;})||{n:'?',titulo:'?'};
    var card = document.createElement('div');
    card.className='card'; card.style.cssText='margin-bottom:10px;border-left:4px solid var(--navy)';

    var hdr = document.createElement('div');
    hdr.style.cssText='display:flex;align-items:flex-start;gap:10px;margin-bottom:10px';
    hdr.innerHTML=
      '<div style="flex:1">'+
        '<div style="font-size:14px;font-weight:500;line-height:1.5;margin-bottom:6px">'+p.enunciado+'</div>'+
        '<div style="display:flex;gap:6px;flex-wrap:wrap">'+
          '<span class="badge b-blue" style="font-size:10px">UD'+udObj.n+' · '+udObj.titulo+'</span>'+
          '<span class="badge b-gray" style="font-size:10px">'+tipoLabel[p.tipo]+'</span>'+
          '<span class="badge '+(difColor[p.dificultad]||'b-gray')+'" style="font-size:10px">'+difLabel[p.dificultad]+'</span>'+
          (p.ra?'<span class="badge b-purple" style="font-size:10px">'+p.ra+(p.ce?' · '+p.ce:'')+'</span>':'')+
        '</div>'+
      '</div>'+
      '<div style="display:flex;gap:5px;flex-shrink:0">'+
        '<button class="btn btn-g btn-sm" onclick="editarPregunta(\''+p.id+'\')">✎</button>'+
        '<button class="btn btn-d btn-sm" onclick="borrarPregunta(\''+p.id+'\')">✕</button>'+
      '</div>';

    // Opciones
    var opts = document.createElement('div');
    opts.style.cssText='display:flex;flex-wrap:wrap;gap:6px';
    p.opciones.forEach(function(op,i){
      var chip=document.createElement('span');
      chip.style.cssText='font-size:12.5px;padding:4px 10px;border-radius:20px;'+(i===p.correcto?'background:var(--green-bg);color:var(--green);font-weight:600':'background:var(--surface2);color:var(--muted)');
      chip.textContent=(i===p.correcto?'✓ ':'')+op;
      opts.appendChild(chip);
    });

    card.appendChild(hdr);
    card.appendChild(opts);

    if(p.explicacion){
      var exp=document.createElement('div');
      exp.style.cssText='margin-top:8px;font-size:12px;color:var(--muted);font-style:italic;padding:8px 10px;background:var(--surface2);border-radius:var(--r)';
      exp.innerHTML='💡 '+p.explicacion;
      card.appendChild(exp);
    }
    cont.appendChild(card);
  });
}

// ── Modal nueva/editar pregunta ───────────────────────
function abrirModalNuevaPregunta(pregId){
  var p = pregId ? getBanco().find(function(x){return x.id===pregId;})||null : null;

  var div = document.createElement('div');

  // Enunciado
  var fEnun=document.createElement('div'); fEnun.className='fg';
  fEnun.innerHTML='<label class="fl">Enunciado de la pregunta <span style="color:var(--red)">*</span></label>'+
    '<textarea class="fta" id="bq-enun" rows="3" placeholder="Escribe la pregunta aquí…">'+( p?p.enunciado:'')+'</textarea>';
  div.appendChild(fEnun);

  // Unidad + tipo + dificultad
  var row2=document.createElement('div'); row2.className='g3';
  row2.innerHTML=
    '<div class="fg"><label class="fl">Unidad</label>'+
      '<select class="fs" id="bq-ud">'+
        UNIDADES.map(function(u){ return '<option value="'+u.id+'"'+(p&&p.ud===u.id?' selected':'')+'>UD'+u.n+' · '+u.titulo+'</option>'; }).join('')+
      '</select></div>'+
    '<div class="fg"><label class="fl">Tipo</label>'+
      '<select class="fs" id="bq-tipo" onchange="actualizarOpcionesBQ()">'+
        '<option value="test"'+(p&&p.tipo==='test'?' selected':'')+'>Opción múltiple</option>'+
        '<option value="vf"'+(p&&p.tipo==='vf'?' selected':'')+'>Verdadero / Falso</option>'+
      '</select></div>'+
    '<div class="fg"><label class="fl">Dificultad</label>'+
      '<select class="fs" id="bq-dif">'+
        '<option value="basica"'+(p&&p.dificultad==='basica'?' selected':'')+'>⭐ Básica</option>'+
        '<option value="media"'+(p&&p.dificultad==='media'?' selected':'')+'>⭐⭐ Media</option>'+
        '<option value="avanzada"'+(p&&p.dificultad==='avanzada'?' selected':'')+'>⭐⭐⭐ Avanzada</option>'+
      '</select></div>';
  div.appendChild(row2);

  // RA/CE
  var rowRA=document.createElement('div'); rowRA.className='g2';
  rowRA.innerHTML=
    '<div class="fg"><label class="fl">RA vinculado (opcional)</label>'+
      '<input class="fi" id="bq-ra" placeholder="Ej: RA1" value="'+(p&&p.ra?p.ra:'')+'"></div>'+
    '<div class="fg"><label class="fl">CE vinculado (opcional)</label>'+
      '<input class="fi" id="bq-ce" placeholder="Ej: CE1.2" value="'+(p&&p.ce?p.ce:'')+'"></div>';
  div.appendChild(rowRA);

  // Contenedor de opciones
  var fOpts=document.createElement('div'); fOpts.className='fg';
  fOpts.innerHTML='<label class="fl">Opciones de respuesta <span style="color:var(--red)">*</span></label>';
  var optsBox=document.createElement('div'); optsBox.id='bq-opts-box';
  fOpts.appendChild(optsBox);
  div.appendChild(fOpts);

  // Explicación
  var fExp=document.createElement('div'); fExp.className='fg';
  fExp.innerHTML='<label class="fl">Explicación / feedback (se muestra al alumno al corregir)</label>'+
    '<textarea class="fta" id="bq-exp" rows="2" placeholder="Explica por qué la respuesta correcta es correcta…">'+(p&&p.explicacion?p.explicacion:'')+'</textarea>';
  div.appendChild(fExp);

  // Datos ocultos para edición
  if(pregId){ var hid=document.createElement('input'); hid.type='hidden'; hid.id='bq-edit-id'; hid.value=pregId; div.appendChild(hid); }

  document.getElementById('modal-titulo').textContent = pregId ? 'Editar pregunta' : 'Nueva pregunta';
  document.getElementById('modal-cuerpo').innerHTML='';
  document.getElementById('modal-cuerpo').appendChild(div);
  document.getElementById('modal-pie').innerHTML=
    '<button class="btn btn-g" onclick="cerrarModal()">Cancelar</button>'+
    '<button class="btn btn-p" onclick="guardarPregunta()">'+( pregId?'Guardar cambios':'Añadir pregunta')+'</button>';
  document.getElementById('modal').classList.add('open');
  document.getElementById('modal').querySelector('.modal').style.maxWidth='600px';

  // Poblar opciones con timeout
  setTimeout(function(){
    var tipo = p ? p.tipo : 'test';
    var correcto = p ? p.correcto : 0;
    var opciones = p ? p.opciones : ['','','',''];
    poblarOpcionesBQ(tipo, opciones, correcto);
  }, 40);
}

function actualizarOpcionesBQ(){
  var tipo = (document.getElementById('bq-tipo')||{value:'test'}).value;
  poblarOpcionesBQ(tipo, tipo==='vf'?['Verdadero','Falso']:['','','',''], 0);
}

function poblarOpcionesBQ(tipo, opciones, correcto){
  var box = document.getElementById('bq-opts-box');
  if(!box) return;
  box.innerHTML='';

  if(tipo==='vf'){
    ['Verdadero','Falso'].forEach(function(op,i){
      var row=document.createElement('div');
      row.style.cssText='display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--border)';
      var radio=document.createElement('input'); radio.type='radio'; radio.name='bq-correct'; radio.value=i;
      if(i===correcto) radio.checked=true;
      radio.style.cssText='width:16px;height:16px;flex-shrink:0;cursor:pointer';
      var lbl=document.createElement('span'); lbl.style.cssText='font-size:13px;font-weight:500';
      lbl.textContent=(i===0?'✅ ':'❌ ')+op;
      row.appendChild(radio); row.appendChild(lbl); box.appendChild(row);
    });
    var hint=document.createElement('div'); hint.style.cssText='font-size:11.5px;color:var(--muted);margin-top:5px';
    hint.textContent='Selecciona cuál es la respuesta correcta (Verdadero o Falso).';
    box.appendChild(hint);
  } else {
    var letters=['A','B','C','D'];
    opciones.forEach(function(op,i){
      var row=document.createElement('div');
      row.style.cssText='display:flex;align-items:center;gap:9px;padding:6px 0;border-bottom:1px solid var(--border)';
      var radio=document.createElement('input'); radio.type='radio'; radio.name='bq-correct'; radio.value=i;
      if(i===correcto) radio.checked=true;
      radio.title='Marcar como correcta';
      radio.style.cssText='width:16px;height:16px;flex-shrink:0;cursor:pointer';
      var letra=document.createElement('span');
      letra.style.cssText='width:24px;height:24px;border-radius:50%;background:var(--navy);color:var(--gold-light);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0';
      letra.textContent=letters[i];
      var inp=document.createElement('input'); inp.className='fi'; inp.type='text';
      inp.style.cssText='flex:1;font-size:13px;padding:6px 10px';
      inp.placeholder='Opción '+letters[i]+'…';
      inp.value=op;
      inp.dataset.idx=i;
      row.appendChild(radio); row.appendChild(letra); row.appendChild(inp);
      box.appendChild(row);
    });
    var hint2=document.createElement('div'); hint2.style.cssText='font-size:11.5px;color:var(--muted);margin-top:5px';
    hint2.innerHTML='Rellena las 4 opciones y <strong>selecciona el radio de la respuesta correcta</strong>.';
    box.appendChild(hint2);
  }
}

function guardarPregunta(){
  // Para mapa conceptual, guardar nodos y conexiones del editor
  var tipoActual = (document.getElementById('bq-tipo')||{value:'test'}).value;
  if(tipoActual === 'mapa'){
    var formArea = document.getElementById('bq-form-area');
    if(formArea && formArea._getNodos){
      window._mapaNodos = formArea._getNodos();
      window._mapaConexiones = formArea._getConexiones();
    }
  }
  var enun = (document.getElementById('bq-enun')||{value:''}).value.trim();
  if(!enun){ flash('Escribe el enunciado de la pregunta','#dc2626'); return; }
  var tipo = document.getElementById('bq-tipo').value;
  var radioSelec = document.querySelector('input[name="bq-correct"]:checked');
  if(!radioSelec){ flash('Selecciona la respuesta correcta','#dc2626'); return; }
  var correcto = parseInt(radioSelec.value);

  var opciones;
  if(tipo==='vf'){
    opciones=['Verdadero','Falso'];
  } else {
    opciones=[];
    document.querySelectorAll('#bq-opts-box input[data-idx]').forEach(function(inp){
      opciones[parseInt(inp.dataset.idx)] = inp.value.trim();
    });
    if(opciones.some(function(o){return !o;})){ flash('Rellena todas las opciones','#dc2626'); return; }
  }

  var banco = getBanco();
  var editId = (document.getElementById('bq-edit-id')||{value:''}).value;
  var nueva = {
    id: editId || uid2(),
    ud:          document.getElementById('bq-ud').value,
    enunciado:   enun,
    tipo:        tipo,
    dificultad:  document.getElementById('bq-dif').value,
    nodos:       tipo==='mapa' ? (window._mapaNodos||[]) : undefined,
    conexiones:  tipo==='mapa' ? (window._mapaConexiones||[]) : undefined,
    opciones:    opciones,
    correcto:    correcto,
    explicacion: (document.getElementById('bq-exp')||{value:''}).value.trim(),
    ra:          (document.getElementById('bq-ra')||{value:''}).value.trim(),
    ce:          (document.getElementById('bq-ce')||{value:''}).value.trim(),
  };

  if(editId){
    var idx = banco.findIndex(function(p){ return p.id===editId; });
    if(idx>=0) banco[idx]=nueva; else banco.push(nueva);
  } else {
    banco.push(nueva);
  }
  saveBanco(banco);
  cerrarModal();
  var root=document.getElementById('banco-root');
  if(root) renderBancoVista(root);
  flash((editId?'Pregunta actualizada':'Pregunta añadida al banco'),'#16a34a');
}

function editarPregunta(id){ abrirModalNuevaPreguntaExt(id); }
function borrarPregunta(id){
  if(!confirm('¿Eliminar esta pregunta del banco?')) return;
  var banco=getBanco().filter(function(p){return p.id!==id;}); saveBanco(banco);
  var root=document.getElementById('banco-root'); if(root) renderBancoVista(root);
  flash('Pregunta eliminada','#16a34a');
}

// ══════════════════════════════════════════════════════
//  MOTOR DE TEST — Configurador + Examen + Resultados
// ══════════════════════════════════════════════════════
var TEST = {
  config: null,    // configuración del test en curso
  preguntas: [],   // preguntas seleccionadas
  respuestas: {},  // {pregId: opcionIdx}
  inicio: null,    // timestamp
  fase: 'config',  // 'config' | 'examen' | 'resultado'
};

function initTest(){
  initBancoConEjemplos();
  var root = document.getElementById('test-root');
  if(!root) return;
  if(TEST.fase==='examen' && TEST.preguntas.length){
    renderExamen(root);
  } else if(TEST.fase==='resultado'){
    renderResultado(root);
  } else {
    TEST.fase='config';
    renderConfigTest(root);
  }
}

// ── Configurador ──────────────────────────────────────
function renderConfigTest(root){
  root.innerHTML='';
  var banco=getBanco();

  var ph=document.createElement('div'); ph.className='ph';
  ph.innerHTML='<div><h1 class="pt">🧠 Test de Repaso</h1>'+
    '<p class="ps">Configura tu test de práctica o evaluable</p></div>';
  root.appendChild(ph);

  // Historial reciente
  var hist=getTestHist().slice(0,3);
  if(hist.length){
    var histCard=document.createElement('div'); histCard.className='card'; histCard.style.marginBottom='1.5rem';
    histCard.innerHTML='<h3 style="font-size:14px;font-weight:600;margin-bottom:12px">📊 Últimos resultados</h3>';
    hist.forEach(function(h){
      var row=document.createElement('div');
      row.style.cssText='display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid var(--border)';
      var nota=h.nota>=5?'pos-text':h.nota>=0?'neg-text':'';
      row.innerHTML='<span style="font-size:12px;color:var(--muted);min-width:80px">'+new Date(h.fecha).toLocaleDateString('es-ES')+'</span>'+
        '<span style="font-size:13px;flex:1">'+h.modo+' · '+h.numPregs+' preg. · UDs: '+h.udsNombre+'</span>'+
        '<span class="'+nota+'" style="font-size:16px;font-weight:700">'+h.nota.toFixed(1)+'/10</span>';
      histCard.appendChild(row);
    });
    root.appendChild(histCard);
  }

  // Formulario de configuración
  var cfg=document.createElement('div');
  cfg.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;align-items:start';

  // Columna izquierda — selección de UDs
  var colL=document.createElement('div');
  var cardUDs=document.createElement('div'); cardUDs.className='card';
  cardUDs.innerHTML='<h3 style="font-size:14px;font-weight:600;margin-bottom:12px">1. Selecciona las unidades</h3>';
  var selectAll=document.createElement('label');
  selectAll.style.cssText='display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:2px solid var(--border);cursor:pointer;font-weight:600;font-size:13px;margin-bottom:4px';
  var chkAll=document.createElement('input'); chkAll.type='checkbox'; chkAll.id='test-cfg-all';
  chkAll.style.cssText='width:16px;height:16px;cursor:pointer';
  chkAll.onchange=function(){
    document.querySelectorAll('.test-ud-chk').forEach(function(c){ c.checked=chkAll.checked; });
    actualizarDisponiblesTest();
  };
  selectAll.appendChild(chkAll);
  selectAll.appendChild(document.createTextNode('Seleccionar todas las unidades'));
  cardUDs.appendChild(selectAll);

  UNIDADES.forEach(function(u){
    var nPregs=banco.filter(function(p){return p.ud===u.id;}).length;
    var lbl=document.createElement('label');
    lbl.style.cssText='display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--border);cursor:pointer';
    var chk=document.createElement('input'); chk.type='checkbox'; chk.className='test-ud-chk';
    chk.dataset.ud=u.id; chk.checked=true;
    chk.style.cssText='width:15px;height:15px;cursor:pointer';
    chk.onchange=actualizarDisponiblesTest;
    var txt=document.createElement('span'); txt.style.cssText='flex:1;font-size:13px';
    txt.innerHTML='<strong>UD'+u.n+'</strong> · '+u.titulo;
    var cnt=document.createElement('span'); cnt.style.cssText='font-size:11px;color:var(--muted)';
    cnt.textContent=nPregs+' pregs.';
    lbl.appendChild(chk); lbl.appendChild(txt); lbl.appendChild(cnt);
    cardUDs.appendChild(lbl);
  });
  chkAll.checked=true;
  colL.appendChild(cardUDs);

  // Columna derecha — parámetros
  var colR=document.createElement('div');
  var cardOpts=document.createElement('div'); cardOpts.className='card';
  cardOpts.innerHTML='<h3 style="font-size:14px;font-weight:600;margin-bottom:14px">2. Parámetros del test</h3>';

  // Nº de preguntas
  var fNP=document.createElement('div'); fNP.className='fg';
  fNP.innerHTML='<label class="fl">Número de preguntas</label>'+
    '<div style="display:flex;align-items:center;gap:10px">'+
    '<input class="fi" id="test-cfg-num" type="number" min="1" max="50" value="10" style="max-width:90px">'+
    '<span id="test-cfg-disp" style="font-size:12px;color:var(--muted)"></span></div>';
  cardOpts.appendChild(fNP);

  // Dificultad
  var fDif=document.createElement('div'); fDif.className='fg';
  fDif.innerHTML='<label class="fl">Dificultad</label>'+
    '<select class="fs" id="test-cfg-dif">'+
    '<option value="todas">Todas</option>'+
    '<option value="basica">⭐ Solo básicas</option>'+
    '<option value="media">⭐⭐ Solo medias</option>'+
    '<option value="avanzada">⭐⭐⭐ Solo avanzadas</option>'+
    '</select>';
  cardOpts.appendChild(fDif);

  // Tipo
  var fTipo=document.createElement('div'); fTipo.className='fg';
  fTipo.innerHTML='<label class="fl">Tipo de preguntas</label>'+
    '<select class="fs" id="test-cfg-tipo">'+
    '<option value="todas">Todos los tipos</option>'+
    '<option value="test">Solo opción múltiple</option>'+
    '<option value="vf">Solo V/F</option>'+
    '</select>';
  cardOpts.appendChild(fTipo);

  // Modo
  var fModo=document.createElement('div'); fModo.className='fg';
  fModo.innerHTML='<label class="fl">Modo</label>'+
    '<select class="fs" id="test-cfg-modo">'+
    '<option value="repaso">📖 Repaso (muestra respuesta correcta al terminar)</option>'+
    '<option value="evaluable">📋 Evaluable (solo nota final)</option>'+
    '</select>';
  cardOpts.appendChild(fModo);

  // Penalización
  var fPen=document.createElement('div'); fPen.className='fg';
  fPen.innerHTML=
    '<label class="fl">Penalización por respuesta incorrecta</label>'+
    '<select class="fs" id="test-cfg-pen">'+
    '<option value="0">Sin penalización</option>'+
    '<option value="0.25">−0,25 pts por error (estándar EBAU)</option>'+
    '<option value="0.33">−1/3 por error</option>'+
    '<option value="0.5">−0,5 pts por error</option>'+
    '<option value="1">−1 pto por error (penalización total)</option>'+
    '</select>'+
    '<div style="font-size:11.5px;color:var(--muted);margin-top:4px">Las preguntas en blanco no penalizan.</div>';
  cardOpts.appendChild(fPen);

  // Orden aleatorio
  var fRand=document.createElement('div'); fRand.className='fg';
  fRand.innerHTML='<label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px">'+
    '<input type="checkbox" id="test-cfg-rand" checked style="width:15px;height:15px"> Orden aleatorio de preguntas</label>';
  cardOpts.appendChild(fRand);

  colR.appendChild(cardOpts);

  // Botón empezar
  var btnStart=document.createElement('button');
  btnStart.className='btn btn-p'; btnStart.style.cssText='width:100%;padding:12px;font-size:15px;margin-top:14px';
  btnStart.textContent='▶ Comenzar test';
  btnStart.onclick=empezarTest;
  colR.appendChild(btnStart);

  cfg.appendChild(colL);
  cfg.appendChild(colR);
  root.appendChild(cfg);

  actualizarDisponiblesTest();
}

function actualizarDisponiblesTest(){
  var banco=getBanco();
  var udsSelec=[];
  document.querySelectorAll('.test-ud-chk:checked').forEach(function(c){ udsSelec.push(c.dataset.ud); });
  var disp=banco.filter(function(p){ return udsSelec.indexOf(p.ud)>=0; }).length;
  var el=document.getElementById('test-cfg-disp');
  if(el) el.textContent='('+disp+' disponibles)';
  var inpNum=document.getElementById('test-cfg-num');
  if(inpNum) inpNum.max=Math.max(1,disp);
}

function empezarTest(){
  var banco=getBanco();
  var udsSelec=[];
  document.querySelectorAll('.test-ud-chk:checked').forEach(function(c){ udsSelec.push(c.dataset.ud); });
  if(!udsSelec.length){ flash('Selecciona al menos una unidad','#dc2626'); return; }

  var num=parseInt((document.getElementById('test-cfg-num')||{value:10}).value)||10;
  var dif=(document.getElementById('test-cfg-dif')||{value:'todas'}).value;
  var tipo=(document.getElementById('test-cfg-tipo')||{value:'todas'}).value;
  var modo=(document.getElementById('test-cfg-modo')||{value:'repaso'}).value;
  var pen=parseFloat((document.getElementById('test-cfg-pen')||{value:'0'}).value)||0;
  var rand=(document.getElementById('test-cfg-rand')||{checked:true}).checked;

  var pool=banco.filter(function(p){
    if(udsSelec.indexOf(p.ud)<0) return false;
    if(dif!=='todas'&&p.dificultad!==dif) return false;
    if(tipo!=='todas'&&p.tipo!==tipo) return false;
    return true;
  });

  if(!pool.length){ flash('No hay preguntas con esa combinación de filtros','#dc2626'); return; }
  if(pool.length<num){ flash('Solo hay '+pool.length+' preguntas disponibles — se usarán todas','#92400e'); num=pool.length; }

  // Selección aleatoria
  var selec=pool.slice();
  if(rand){ for(var i=selec.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=selec[i]; selec[i]=selec[j]; selec[j]=t; } }
  selec=selec.slice(0,num);

  TEST.config={num:num,uds:udsSelec,dif:dif,tipo:tipo,modo:modo,pen:pen,rand:rand};
  TEST.preguntas=selec;
  TEST.respuestas={};
  TEST.inicio=Date.now();
  TEST.fase='examen';
  TEST.current=0;

  var root=document.getElementById('test-root');
  if(root) renderExamen(root);
}

// ── Examen ─────────────────────────────────────────────
function renderExamen(root){
  root.innerHTML='';
  var n=TEST.preguntas.length;
  var respondidas=Object.keys(TEST.respuestas).length;

  // Cabecera con progreso
  var bar=document.createElement('div');
  bar.style.cssText='position:sticky;top:0;background:var(--surface);border-bottom:1px solid var(--border);padding:12px 0 10px;z-index:10;margin-bottom:20px';
  var barInfo=document.createElement('div');
  barInfo.style.cssText='display:flex;align-items:center;justify-content:space-between;margin-bottom:8px';
  barInfo.innerHTML=
    '<div style="font-size:13px;font-weight:600">🧠 Test en curso</div>'+
    '<div style="font-size:13px;color:var(--muted)">'+respondidas+' / '+n+' respondidas</div>';
  var progBar=document.createElement('div');
  progBar.style.cssText='height:5px;background:var(--border);border-radius:3px;overflow:hidden';
  var progFill=document.createElement('div');
  progFill.style.cssText='height:100%;background:var(--navy);border-radius:3px;transition:width .3s;width:'+(respondidas/n*100)+'%';
  progBar.appendChild(progFill); bar.appendChild(barInfo); bar.appendChild(progBar);
  root.appendChild(bar);

  // Preguntas
  TEST.preguntas.forEach(function(p,idx){
    var udObj=UNIDADES.find(function(u){return u.id===p.ud;})||{n:'?',titulo:'?'};
    var resp=TEST.respuestas[p.id];
    var contestada=resp!=null;

    var card=document.createElement('div');
    card.style.cssText='border:1px solid '+(contestada?'var(--navy)':'var(--border)')+';border-radius:var(--rl);padding:18px 20px;margin-bottom:14px;transition:border-color .2s';
    card.id='test-card-'+p.id;

    // Número + UD
    var hdr=document.createElement('div');
    hdr.style.cssText='display:flex;align-items:center;gap:8px;margin-bottom:12px';
    hdr.innerHTML=
      '<span style="width:28px;height:28px;border-radius:50%;background:var(--navy);color:var(--gold-light);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">'+(idx+1)+'</span>'+
      '<span class="badge b-blue" style="font-size:10px">UD'+udObj.n+'</span>'+
      '<span class="badge b-gray" style="font-size:10px">'+(p.tipo==='vf'?'V/F':'4 opciones')+'</span>'+
      (contestada?'<span style="color:var(--green);font-size:12px;font-weight:600;margin-left:auto">✓ Respondida</span>':'');
    card.appendChild(hdr);

    // Enunciado
    var enun=document.createElement('div');
    enun.style.cssText='font-size:14.5px;font-weight:500;line-height:1.6;margin-bottom:14px';
    enun.textContent=p.enunciado;
    card.appendChild(enun);

    // Opciones
    var letters=['A','B','C','D'];
    p.opciones.forEach(function(op,i){
      var btn=document.createElement('button');
      var selected=(resp===i);
      btn.style.cssText='display:flex;align-items:center;gap:10px;width:100%;padding:10px 14px;border-radius:var(--r);margin-bottom:6px;text-align:left;cursor:pointer;font-family:"DM Sans",sans-serif;font-size:13.5px;transition:all .15s;'+
        (selected?'background:var(--navy);color:#fff;border:2px solid var(--navy);font-weight:600':'background:var(--surface2);color:var(--text);border:2px solid var(--border)');
      var letra=document.createElement('span');
      letra.style.cssText='width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;'+
        (selected?'background:var(--gold);color:var(--navy)':'background:var(--border);color:var(--muted)');
      letra.textContent=letters[i]||(i===0?'V':'F');
      btn.appendChild(letra);
      btn.appendChild(document.createTextNode(op));
      btn.onclick=(function(pregId,opIdx,card,enun,botones){ return function(){
        TEST.respuestas[pregId]=opIdx;
        // Re-render just this card's buttons
        botones.forEach(function(b,bi){
          var sel2=(bi===opIdx);
          b.style.background=sel2?'var(--navy)':'var(--surface2)';
          b.style.color=sel2?'#fff':'var(--text)';
          b.style.border=sel2?'2px solid var(--navy)':'2px solid var(--border)';
          b.style.fontWeight=sel2?'600':'';
          b.querySelector('span').style.background=sel2?'var(--gold)':'var(--border)';
          b.querySelector('span').style.color=sel2?'var(--navy)':'var(--muted)';
        });
        card.style.borderColor='var(--navy)';
        // Update progress bar
        var resp2=Object.keys(TEST.respuestas).length;
        var pf=document.querySelector('#test-root .prog-f2');
        if(pf) pf.style.width=(resp2/n*100)+'%';
        var pi=document.querySelector('#test-root .prog-info2');
        if(pi) pi.textContent=resp2+' / '+n+' respondidas';
      }; })(p.id,i,card,enun,[]);
      card.appendChild(btn);
    });

    // Guardar referencia a botones para el onclick
    var btns=card.querySelectorAll('button');
    btns.forEach(function(b,i){
      b.onclick=(function(pregId,opIdx,crd,bts){ return function(){
        TEST.respuestas[pregId]=opIdx;
        bts.forEach(function(bb,bi){
          var sel=(bi===opIdx);
          bb.style.background=sel?'var(--navy)':'var(--surface2)';
          bb.style.color=sel?'#fff':'var(--text)';
          bb.style.border=sel?'2px solid var(--navy)':'2px solid var(--border)';
          bb.style.fontWeight=sel?'600':'';
          bb.querySelector('span').style.background=sel?'var(--gold)':'var(--border)';
          bb.querySelector('span').style.color=sel?'var(--navy)':'var(--muted)';
        });
        crd.style.borderColor='var(--navy)';
        var resp2=Object.keys(TEST.respuestas).length;
        var pf=document.querySelector('.prog-fill-test');
        if(pf) pf.style.width=(resp2/n*100)+'%';
        var pi=document.querySelector('.prog-info-test');
        if(pi) pi.textContent=resp2+' / '+n+' respondidas';
      }; })(p.id,i,card,Array.from(btns));
    });

    root.appendChild(card);
  });

  // Botón entregar
  var footer=document.createElement('div');
  footer.style.cssText='position:sticky;bottom:0;background:var(--surface);border-top:1px solid var(--border);padding:14px 0;margin-top:8px;display:flex;align-items:center;gap:12px';
  footer.innerHTML='<span class="prog-info-test" style="font-size:13px;color:var(--muted);flex:1">'+
    respondidas+' / '+n+' respondidas</span>'+
    '<span style="font-size:12px;color:var(--muted)">Las preguntas en blanco no penalizan</span>';
  var btnEntregar=document.createElement('button');
  btnEntregar.className='btn btn-p'; btnEntregar.style.cssText='padding:10px 24px;font-size:14px';
  btnEntregar.textContent='📤 Entregar test';
  btnEntregar.onclick=function(){
    var respondidas2=Object.keys(TEST.respuestas).length;
    var enBlanco=n-respondidas2;
    var msg='¿Entregar el test?\n\n'+respondidas2+' preguntas respondidas\n'+enBlanco+' en blanco (no penalizan)\n\n¿Confirmar entrega?';
    if(!confirm(msg)) return;
    entregarTest();
  };
  footer.appendChild(btnEntregar);
  root.appendChild(footer);

  // Actualizar clases para el progreso
  var progFill2=root.querySelector('.prog-fill-test');
  if(!progFill2&&progFill){ progFill.className='prog-fill-test'; progFill.style.width=(respondidas/n*100)+'%'; }
}

// ── Corregir y mostrar resultado ──────────────────────
function entregarTest(){
  var pregs=TEST.preguntas;
  var resps=TEST.respuestas;
  var pen=TEST.config.pen;
  var n=pregs.length;

  var correctas=0,incorrectas=0,blanco=0;
  var detalle=[];

  pregs.forEach(function(p){
    var resp=resps[p.id];
    if(resp==null){ blanco++; detalle.push({p:p,resp:null,ok:false,bl:true}); }
    else if(resp===p.correcto){ correctas++; detalle.push({p:p,resp:resp,ok:true,bl:false}); }
    else { incorrectas++; detalle.push({p:p,resp:resp,ok:false,bl:false}); }
  });

  var puntosPorAcierto=10/n;
  var puntosTotal=correctas*puntosPorAcierto - incorrectas*pen*puntosPorAcierto;
  var nota=Math.max(0,Math.min(10,puntosTotal));

  // Guardar en historial
  var hist=getTestHist();
  var udNombres=TEST.config.uds.map(function(uid){ var u=UNIDADES.find(function(x){return x.id===uid;}); return u?'UD'+u.n:'?'; }).join(', ');
  hist.unshift({
    fecha:Date.now(), nota:nota, numPregs:n,
    correctas:correctas, incorrectas:incorrectas, blanco:blanco,
    modo:TEST.config.modo==='repaso'?'Repaso':'Evaluable',
    udsNombre:udNombres,
    penalizacion:pen
  });
  if(hist.length>20) hist=hist.slice(0,20);
  saveTestHist(hist);

  TEST.fase='resultado';
  TEST.detalle=detalle;
  TEST.nota=nota;
  TEST.correctas=correctas; TEST.incorrectas=incorrectas; TEST.blanco=blanco;

  var root=document.getElementById('test-root');
  if(root) renderResultado(root);
}

function renderResultado(root){
  root.innerHTML='';
  var nota=TEST.nota, n=TEST.preguntas.length;
  var notaColor=nota>=7?'var(--green)':nota>=5?'var(--amber)':'var(--red)';
  var notaLabel=nota>=7?'¡Aprobado!':nota>=5?'Aprobado justo':'Suspenso';

  // Tarjeta de resultado
  var resCard=document.createElement('div');
  resCard.className='card'; resCard.style.cssText='text-align:center;padding:2rem;margin-bottom:1.5rem;background:linear-gradient(135deg,var(--surface),var(--surface2))';
  resCard.innerHTML=
    '<div style="font-family:\'Playfair Display\',serif;font-size:3.5rem;font-weight:700;color:'+notaColor+';line-height:1">'+nota.toFixed(2)+'</div>'+
    '<div style="font-size:1rem;font-weight:700;color:'+notaColor+';margin:6px 0 16px">'+notaLabel+'</div>'+
    '<div style="display:flex;justify-content:center;gap:24px;flex-wrap:wrap">'+
      '<div><div style="font-size:1.4rem;font-weight:700;color:var(--green)">'+TEST.correctas+'</div><div style="font-size:12px;color:var(--muted)">Correctas</div></div>'+
      '<div><div style="font-size:1.4rem;font-weight:700;color:var(--red)">'+TEST.incorrectas+'</div><div style="font-size:12px;color:var(--muted)">Incorrectas</div></div>'+
      '<div><div style="font-size:1.4rem;font-weight:700;color:var(--muted)">'+TEST.blanco+'</div><div style="font-size:12px;color:var(--muted)">En blanco</div></div>'+
      '<div><div style="font-size:1.4rem;font-weight:700;color:var(--navy)">'+n+'</div><div style="font-size:12px;color:var(--muted)">Total</div></div>'+
    '</div>'+
    (TEST.config.pen>0?'<div style="font-size:12px;color:var(--muted);margin-top:12px;padding:8px 16px;background:var(--amber-bg);border-radius:var(--r);display:inline-block">Penalización aplicada: −'+TEST.config.pen+' por error</div>':'')+
    '<div style="display:flex;justify-content:center;gap:10px;margin-top:1.2rem">'+
      '<button class="btn btn-p" onclick="TEST.fase=\'config\';initTest()">🔄 Nuevo test</button>'+
      '<button class="btn btn-g" onclick="TEST.fase=\'config\';initTest()">⚙ Cambiar configuración</button>'+
    '</div>';
  root.appendChild(resCard);

  // Detalle pregunta a pregunta (solo en modo repaso)
  if(TEST.config.modo==='repaso' && TEST.detalle){
    var detCard=document.createElement('div'); detCard.className='card';
    detCard.innerHTML='<h3 style="font-size:14px;font-weight:600;margin-bottom:16px">Corrección detallada</h3>';

    TEST.detalle.forEach(function(item,idx){
      var p=item.p;
      var d=document.createElement('div');
      d.style.cssText='padding:14px 0;border-bottom:1px solid var(--border)';

      var icon=item.bl?'⬜':item.ok?'✅':'❌';
      var color=item.bl?'var(--muted)':item.ok?'var(--green)':'var(--red)';

      d.innerHTML=
        '<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px">'+
          '<span style="font-size:1.2rem;flex-shrink:0">'+icon+'</span>'+
          '<div style="flex:1"><div style="font-size:13.5px;font-weight:500;line-height:1.5">'+p.enunciado+'</div>'+
            '<div style="font-size:11.5px;color:var(--muted);margin-top:3px">'+
              (UNIDADES.find(function(u){return u.id===p.ud;})||{titulo:'?'}).titulo+
              (p.ra?' · '+p.ra:'')+
            '</div>'+
          '</div>'+
        '</div>';

      // Opciones con corrección visual
      var optsDiv=document.createElement('div');
      optsDiv.style.cssText='display:flex;flex-direction:column;gap:5px;margin-left:32px';
      p.opciones.forEach(function(op,i){
        var esCorrect=(i===p.correcto);
        var esElegida=(i===item.resp);
        var bg=esCorrect?'var(--green-bg)':esElegida&&!esCorrect?'var(--red-bg)':'var(--surface2)';
        var col=esCorrect?'var(--green)':esElegida&&!esCorrect?'var(--red)':'var(--muted)';
        var opEl=document.createElement('div');
        opEl.style.cssText='padding:6px 10px;border-radius:var(--r);font-size:13px;background:'+bg+';color:'+col+(esCorrect||esElegida?';font-weight:600':'');
        opEl.innerHTML=(esCorrect?'✓ ':'')+(esElegida&&!esCorrect?'✗ ':'')+op;
        optsDiv.appendChild(opEl);
      });
      d.appendChild(optsDiv);

      if(item.bl){
        var blEl=document.createElement('div');
        blEl.style.cssText='margin-left:32px;margin-top:6px;font-size:12px;color:var(--muted);font-style:italic';
        blEl.textContent='Pregunta en blanco — no penaliza.';
        d.appendChild(blEl);
      }

      if(p.explicacion){
        var expEl=document.createElement('div');
        expEl.style.cssText='margin:10px 32px 0;padding:8px 12px;background:var(--surface2);border-radius:var(--r);border-left:3px solid var(--navy);font-size:12.5px;color:var(--muted);line-height:1.5';
        expEl.innerHTML='💡 '+p.explicacion;
        d.appendChild(expEl);
      }

      detCard.appendChild(d);
    });
    root.appendChild(detCard);
  } else if(TEST.config.modo==='evaluable'){
    var evalNote=document.createElement('div'); evalNote.className='card';
    evalNote.innerHTML='<div style="text-align:center;padding:1rem;color:var(--muted);font-size:13px">'+
      '📋 Modo evaluable — la corrección detallada no está disponible en este modo.</div>';
    root.appendChild(evalNote);
  }
}


// ══════════════════════════════════════════════════════
//  BANCO EXTENDIDO — Tipos teórico-prácticos + Cálculo
// ══════════════════════════════════════════════════════

// Tipos de pregunta disponibles
var TIPOS_PREGUNTA = {
  test:      { label:'Opción múltiple',      ico:'🔘', grupo:'teorica',  color:'var(--blue-bg)',   ctxt:'var(--blue)' },
  vf:        { label:'Verdadero / Falso',     ico:'✅', grupo:'teorica',  color:'var(--green-bg)',  ctxt:'var(--green)' },
  corta:     { label:'Respuesta corta',       ico:'✏️', grupo:'teorica',  color:'var(--amber-bg)',  ctxt:'var(--amber)' },
  desarrollo:{ label:'Desarrollo / Análisis', ico:'📝', grupo:'teorica',  color:'var(--surface2)',  ctxt:'var(--muted)' },
  calculo:   { label:'Cálculo financiero',    ico:'🧮', grupo:'practica', color:'#f0fdf4',          ctxt:'var(--green)' },
  formulario:{ label:'Formulario paso a paso',ico:'📐', grupo:'practica', color:'#fef9ec',          ctxt:'var(--amber)' },
  mapa:      { label:'Mapa conceptual',       ico:'🗺', grupo:'practica', color:'#f0f4ff',          ctxt:'#3730a3' },
};

