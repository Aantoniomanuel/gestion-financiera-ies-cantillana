// ══════════════════════════════════════════════════════
//  SIMULADOR DE BOLSA
// ══════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════
//  SIMULADOR DE BOLSA v5 — Solo IBEX-35
// ══════════════════════════════════════════════════════
var BOLSA_KEY='gfin_bolsa_v5';
function bolsaLoad(){try{var s=localStorage.getItem(BOLSA_KEY);return s?JSON.parse(s):null;}catch(e){return null;}}
function bolsaSave(){try{localStorage.setItem(BOLSA_KEY,JSON.stringify({saldo:BOLSA.saldo,cartera:BOLSA.cartera,historial:BOLSA.historial}));}catch(e){}}
var _bs=bolsaLoad();
var BOLSA={saldo:_bs?_bs.saldo:50000,cartera:_bs?_bs.cartera:{},historial:_bs?_bs.historial:[],cots:{},tab:'mercado'};

// ── IBEX-35 (componentes principales) ─────────────────
var IBEX=[
  {t:'ITX.MC',  n:'Inditex',           s:'Textil',        cap:'Mega',  d:'Mayor grupo de moda del mundo. Propietario de Zara, Pull&Bear y Massimo Dutti. Cotiza desde 2001.'},
  {t:'SAN.MC',  n:'Banco Santander',   s:'Banca',         cap:'Mega',  d:'Uno de los 15 mayores bancos del mundo. Opera en 10 mercados clave con más de 150 millones de clientes.'},
  {t:'BBVA.MC', n:'BBVA',              s:'Banca',         cap:'Mega',  d:'Banco global con especial presencia en México y Turquía además de España. Líder europeo en banca digital.'},
  {t:'IBE.MC',  n:'Iberdrola',         s:'Energía',       cap:'Mega',  d:'Empresa líder mundial en energía renovable. Uno de los mayores productores de energía eólica del planeta.'},
  {t:'TEF.MC',  n:'Telefónica',        s:'Telecom',       cap:'Mega',  d:'Multinacional española de telecomunicaciones presente en Europa y América Latina. Marcas Movistar y O2.'},
  {t:'REP.MC',  n:'Repsol',            s:'Petróleo',      cap:'Grande', d:'Compañía energética integrada en exploración, producción, refino y marketing de petróleo y gas.'},
  {t:'AMS.MC',  n:'Amadeus IT',        s:'Tecnología',    cap:'Grande', d:'Proveedor global de soluciones tecnológicas para la industria del turismo y la aviación.'},
  {t:'ACS.MC',  n:'ACS',               s:'Construcción',  cap:'Grande', d:'Gran constructora española presente en más de 70 países en infraestructuras, energía y servicios.'},
  {t:'AENA.MC', n:'AENA',              s:'Infraestruc.',  cap:'Grande', d:'Primer operador de aeropuertos del mundo por número de pasajeros. Gestiona 46 aeropuertos en España.'},
  {t:'MAP.MC',  n:'MAPFRE',            s:'Seguros',       cap:'Grande', d:'Principal aseguradora española, líder en el mercado iberoamericano de seguros.'},
  {t:'GRF.MC',  n:'Grifols',           s:'Farmacia',      cap:'Mediana',d:'Multinacional española líder en hemoderivados. Presente en más de 100 países.'},
  {t:'MRL.MC',  n:'Merlin Properties', s:'Inmobiliario',  cap:'Mediana',d:'Mayor SOCIMI española. Gestiona oficinas, centros comerciales y parques logísticos.'},
  {t:'ACX.MC',  n:'Acerinox',          s:'Acero',         cap:'Mediana',d:'Fabricante de acero inoxidable con plantas en España, EE.UU., Sudáfrica y Malasia.'},
  {t:'ANA.MC',  n:'Acciona',           s:'Energía',       cap:'Mediana',d:'Grupo constructor y de energías renovables. Gestiona activos de agua, infraestructuras y energía.'},
  {t:'NTGY.MC', n:'Naturgy',           s:'Gas',           cap:'Grande', d:'Compañía energética española de gas y electricidad. Opera en más de 20 países.'},
  {t:'ELE.MC',  n:'Endesa',            s:'Electricidad',  cap:'Grande', d:'Principal empresa eléctrica española. Genera, distribuye y comercializa electricidad y gas.'},
  {t:'IAG.MC',  n:'IAG',               s:'Aerolíneas',    cap:'Grande', d:'Grupo aéreo dueño de Iberia, British Airways, Vueling y Aer Lingus.'},
  {t:'MEL.MC',  n:'Meliá Hotels',      s:'Turismo',       cap:'Mediana',d:'Una de las mayores cadenas hoteleras del mundo con presencia en más de 40 países.'},
  {t:'CABK.MC', n:'CaixaBank',         s:'Banca',         cap:'Grande', d:'Tercer banco de la zona euro por activos. Integró Bankia en 2021. Fuerte en banca minorista española.'},
  {t:'SAB.MC',  n:'Banco Sabadell',    s:'Banca',         cap:'Mediana',d:'Cuarto banco español por activos. Presente en España, Reino Unido (TSB) y otros mercados.'},
];

var bcache={},bctime={},BTTL=90000;
function bflash(msg,col){flash(msg,col);}
function fmt2(n,d){if(n==null)return'—';return n.toFixed(d!=null?d:2).replace(/\B(?=(\d{3})+(?!\d))/g,'.');}
function fmtM(n){if(!n)return'—';if(n>=1e12)return(n/1e12).toFixed(1)+'B';if(n>=1e9)return(n/1e9).toFixed(1)+'B';if(n>=1e6)return(n/1e6).toFixed(1)+'M';return fmt2(n,0);}

function sparkSVG(d,col,w,h){
  w=w||110;h=h||32;
  if(!d||d.length<2)return'';
  var mn=Math.min.apply(null,d),mx=Math.max.apply(null,d),r=mx-mn||1;
  var pts=d.map(function(v,i){return((i/(d.length-1))*w).toFixed(1)+','+((h-((v-mn)/r)*(h-4)-2)).toFixed(1);});
  return '<svg width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'"><polyline points="'+pts.join(' ')+'" fill="none" stroke="'+col+'" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>';
}

function barChartSVG(labels,vals,w,h){
  w=w||400;h=h||120;
  var mn=Math.min.apply(null,vals),mx=Math.max.apply(null,vals);
  var range=Math.max(Math.abs(mn),Math.abs(mx))||1;
  var bw=Math.floor((w-20)/vals.length)-4;
  var midY=h/2;
  var bars=vals.map(function(v,i){
    var bh=Math.abs(v)/range*(midY-8);
    var x=10+i*(bw+4);
    var y=v>=0?midY-bh:midY;
    var col=v>=0?'#15803d':'#b91c1c';
    return '<rect x="'+x+'" y="'+y+'" width="'+bw+'" height="'+bh+'" fill="'+col+'" rx="2" opacity="0.85"/>'+
      '<text x="'+(x+bw/2)+'" y="'+(h-2)+'" text-anchor="middle" font-size="8" fill="#6b7280">'+labels[i]+'</text>';
  }).join('');
  return '<svg width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'">'+
    '<line x1="10" y1="'+midY+'" x2="'+(w-10)+'" y2="'+midY+'" stroke="#e5e7eb" stroke-width="1"/>'+
    bars+'</svg>';
}

// Precios base reales (última actualización manual — sustituir periódicamente)
// ══════════════════════════════════════════════════════
//  MOTOR DE PRECIOS — 100% OFFLINE, SIN APIs EXTERNAS
//
//  Sistema determinista diario:
//  · Cada día genera exactamente los mismos precios
//  · Todos los alumnos ven los mismos precios ese día
//  · Los precios varían de forma realista día a día
//  · Basado en precios reales actualizados del IBEX-35
// ══════════════════════════════════════════════════════

// Precios de cierre reales de referencia (actualizar trimestralmente)
// Fuente: Bolsa de Madrid — Marzo 2025
var PRECIOS_REF = {
  ITX:48.20, SAN:5.12,  BBVA:9.82,  IBE:13.15, TEF:4.31,
  REP:14.92, AMS:71.40, ACS:44.20,  AENA:196.4,MAP:2.18,
  GRF:7.92,  MRL:9.22,  ACX:11.82,  ANA:148.2, NTGY:24.52,
  ELE:19.18, IAG:3.12,  MEL:5.84,   CABK:5.42, SAB:1.96
};

// Volatilidad anual histórica por acción (en %)
// Determina cuánto fluctúa cada acción día a día
var VOLATILIDAD = {
  ITX:22, SAN:28, BBVA:30, IBE:20, TEF:24,
  REP:26, AMS:25, ACS:28,  AENA:22,MAP:18,
  GRF:32, MRL:22, ACX:30,  ANA:28, NTGY:20,
  ELE:22, IAG:38, MEL:32,  CABK:28,SAB:30
};

// ── Generador de números pseudoaleatorios determinista ──
// Dado el mismo seed produce siempre la misma secuencia
function LCG(seed){
  // Linear Congruential Generator (parámetros Numerical Recipes)
  var s = seed >>> 0;
  return {
    next: function(){
      s = ((s * 1664525 + 1013904223) >>> 0);
      return s / 4294967296;
    }
  };
}

// Seed único por ticker + día del año (mismo resultado todo el día)
function seedDelDia(ticker){
  var d = new Date();
  var diaAnio = Math.floor((d - new Date(d.getFullYear(),0,0)) / 86400000);
  var tickerNum = ticker.split('').reduce(function(s,c){ return s*31 + c.charCodeAt(0); }, 7);
  return ((d.getFullYear() * 366 + diaAnio) * 997 + tickerNum) >>> 0;
}

// Genera la serie histórica de 60 días de forma determinista
// El último valor es el precio de hoy
function generarSerie(ticker, precioBase){
  var vol = (VOLATILIDAD[ticker] || 25) / 100;
  var volDiaria = vol / Math.sqrt(252); // volatilidad diaria

  // Serie histórica (59 días anteriores + hoy = 60 puntos)
  var serie = [precioBase];
  var rng = LCG(seedDelDia(ticker) + 99999); // seed fijo para historia

  for(var i = 1; i < 59; i++){
    var prev = serie[i-1];
    // Movimiento browniano geométrico: retorno diario normal
    var u1 = rng.next(), u2 = rng.next();
    // Box-Muller: genera distribución normal estándar
    var z = Math.sqrt(-2 * Math.log(Math.max(u1, 1e-10))) * Math.cos(2 * Math.PI * u2);
    var retorno = volDiaria * z;
    serie.push(parseFloat((prev * (1 + retorno)).toFixed(3)));
  }

  // Precio de HOY: determinista según el día actual
  var rngHoy = LCG(seedDelDia(ticker));
  var u1h = rngHoy.next(), u2h = rngHoy.next();
  var zHoy = Math.sqrt(-2 * Math.log(Math.max(u1h, 1e-10))) * Math.cos(2 * Math.PI * u2h);
  var retornoHoy = volDiaria * 0.7 * zHoy; // ±70% de volatilidad diaria típica
  var precioHoy = parseFloat((precioBase * (1 + retornoHoy)).toFixed(3));
  serie.push(precioHoy);

  return serie;
}

// Calcula datos de mercado realistas a partir de la serie
function calcDatos(ticker, serie){
  var p = serie[serie.length - 1];
  var prev = serie[serie.length - 2] || p;
  var chg = parseFloat((p - prev).toFixed(3));
  var pct = prev ? (chg / prev * 100) : 0;

  // Máx/Mín del día simulados (rango realista)
  var rngDia = LCG(seedDelDia(ticker) + 42);
  var rangoD = p * (VOLATILIDAD[ticker] || 25) / 100 / Math.sqrt(252) * 1.5;
  var maxH = parseFloat((p + rngDia.next() * rangoD).toFixed(3));
  var minH = parseFloat((p - rngDia.next() * rangoD).toFixed(3));

  // Máx/Mín 52 semanas desde la serie
  var max52 = Math.max.apply(null, serie) * 1.05;
  var min52 = Math.min.apply(null, serie) * 0.95;

  // Volumen simulado coherente con la capitalización
  var rngVol = LCG(seedDelDia(ticker) + 777);
  var volBase = { ITX:8e6, SAN:40e6, BBVA:35e6, IBE:25e6, TEF:30e6,
    REP:10e6, AMS:3e6, ACS:2e6, AENA:0.8e6, MAP:5e6,
    GRF:2e6, MRL:1e6, ACX:1.5e6, ANA:0.5e6, NTGY:4e6,
    ELE:6e6, IAG:15e6, MEL:3e6, CABK:20e6, SAB:18e6
  };
  var k = ticker.replace('.MC','');
  var vol = Math.floor((volBase[k] || 2e6) * (0.6 + rngVol.next() * 0.8));

  return {
    precio: p, cambio: chg, pct: pct,
    maxH: maxH, minH: minH,
    max52: parseFloat(max52.toFixed(3)),
    min52: parseFloat(min52.toFixed(3)),
    vol: vol, mktcap: null,
    moneda: 'EUR', prev: prev,
    spark: serie.slice(-30), // últimos 30 días para el gráfico
    fuente: 'simulado'
  };
}

// Función principal — ahora síncrona y sin llamadas externas
function fetchCot(t){
  // Caché: recalcular solo una vez por sesión (misma pestaña)
  if(bcache[t]) return Promise.resolve(bcache[t]);

  var k = t.replace('.MC','');
  var p0 = PRECIOS_REF[k] || 20;
  var serie = generarSerie(k, p0);
  var datos = calcDatos(t, serie);

  bcache[t] = datos;
  BOLSA.cots[t] = datos;
  return Promise.resolve(datos);
}

function bActStats(){
  var val=0;
  Object.keys(BOLSA.cartera).forEach(function(t){var c=BOLSA.cots[t];if(c)val+=c.precio*BOLSA.cartera[t].acciones;});
  var total=BOLSA.saldo+val,gan=total-50000;
  function s(id,txt){var el=document.getElementById(id);if(el)el.textContent=txt;}
  function sc(id,cls){var el=document.getElementById(id);if(el)el.className='bolsa-stat-val '+cls;}
  s('bs-saldo',fmt2(BOLSA.saldo)+' €');s('bs-cartera',fmt2(val)+' €');s('bs-total',fmt2(total)+' €');
  s('bs-gan',(gan>=0?'+':'')+fmt2(gan)+' €');sc('bs-gan',gan>=0?'green':'red');
}

// ── TAB: MERCADO ───────────────────────────────────────
// Cápsulas didácticas para lectura bursátil
var CAPSULAS_MERCADO=[
  {ico:'📖',t:'¿Qué es una cotización?',b:'La <strong>cotización</strong> es el precio al que se negocia una acción en cada momento. Sube cuando hay más compradores que vendedores, y baja en caso contrario. En el mercado continuo español la bolsa abre a las 9:00h y cierra a las 17:30h de lunes a viernes.'},
  {ico:'📊',t:'¿Qué es el volumen?',b:'El <strong>volumen</strong> indica cuántas acciones se han negociado en el día. Un precio que sube con alto volumen es una señal más fiable que uno que sube con poco volumen. Un volumen muy bajo puede indicar poca liquidez — es decir, dificultad para comprar o vender rápidamente.'},
  {ico:'📈',t:'¿Qué es la capitalización bursátil?',b:'Es el valor total de mercado de una empresa. Se calcula multiplicando el precio de la acción por el número total de acciones. Fórmula: <strong>Cap. = Precio × Nº acciones</strong>. Ejemplo: Inditex tiene ~3.100M acciones a 47€ → capitalización = 145.700 M€.'},
  {ico:'🔴🟢',t:'¿Qué significan las variaciones %?',b:'La variación diaria compara el precio actual con el cierre del día anterior. <strong>Verde/▲</strong> = sube respecto a ayer. <strong>Rojo/▼</strong> = baja. Fórmula: <strong>Variación = [(Precio hoy − Precio ayer) / Precio ayer] × 100</strong>. Ejemplo: Santander cierra a 4,80€ y hoy cotiza a 4,92€ → +2,5%.'},
  {ico:'📉',t:'Máximos y mínimos de 52 semanas',b:'El <strong>máximo/mínimo de 52 semanas</strong> muestra el rango de precios de la acción durante el último año. Si el precio actual está cerca del mínimo, puede parecer barato; si está cerca del máximo, puede estar caro. Son referencias útiles para contextualizar una cotización.'},
  {ico:'⚠️',t:'El riesgo antes de invertir',b:'Toda inversión conlleva riesgo. En bolsa se distingue el <strong>riesgo sistemático</strong> (afecta a todo el mercado, no se puede eliminar) y el <strong>riesgo específico</strong> (propio de una empresa, se reduce diversificando). Nunca inviertas dinero que no puedas permitirte perder.'},
];

async function renderMercado(){
  var cont=document.getElementById('bm-grid');if(!cont)return;
  cont.innerHTML='<div class="loading-row"><div class="spinner"></div> Calculando cotizaciones del IBEX-35…</div>';

  // fetchCot ahora es síncrona — carga instantánea sin red
  var html='';
  for(var i=0;i<IBEX.length;i++){
    var emp=IBEX[i],cot=await fetchCot(emp.t),pos=cot.pct>=0;
    html+='<div class="accion-card" onclick="abrirFicha(\''+emp.t+'\')">'+
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">'+
        '<div class="accion-ticker">'+emp.t.replace('.MC','')+'</div>'+
        '<span style="font-size:.63rem;background:var(--surface2);color:var(--muted);padding:2px 7px;border-radius:20px;font-family:\'IBM Plex Mono\',monospace">'+emp.s+'</span>'+
      '</div>'+
      '<div class="accion-nombre">'+emp.n+'</div>'+
      '<div style="display:flex;align-items:flex-end;justify-content:space-between">'+
        '<div>'+
          '<div class="accion-precio '+(pos?'pos-text':'neg-text')+'">'+fmt2(cot.precio)+' €</div>'+
          '<span class="accion-cambio '+(pos?'ac-pos':'ac-neg')+'">'+(pos?'▲':'▼')+' '+fmt2(Math.abs(cot.pct),2)+'%</span>'+
        '</div>'+
        '<div>'+sparkSVG(cot.spark,pos?'#15803d':'#b91c1c')+'</div>'+
      '</div>'+
      '<div style="font-size:.62rem;color:var(--dim);margin-top:5px;font-family:\'IBM Plex Mono\',monospace">Vol: '+fmtM(cot.vol)+' · '+emp.cap+'</div>'+
    '</div>';
  }
  cont.innerHTML=html;
  bActStats();
}

function abrirFicha(t){
  var emp=IBEX.find(function(e){return e.t===t;}),cot=BOLSA.cots[t];if(!emp||!cot)return;
  var pos=cot.pct>=0,tengo=BOLSA.cartera[t]?BOLSA.cartera[t].acciones:0,pm=BOLSA.cartera[t]?BOLSA.cartera[t].precioMedio:0;
  var plT=(cot.precio-pm)*tengo,plP=pm?((cot.precio-pm)/pm*100):0;
  var posHtml=tengo>0?
    '<div style="background:'+(plT>=0?'#f0fdf4':'#fef2f2')+';border:1px solid '+(plT>=0?'#bbf7d0':'#fecaca')+';border-radius:10px;padding:12px 14px;margin-bottom:14px">'+
      '<div style="font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin-bottom:8px">Tu posición actual</div>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:8px">'+
        '<div><div style="font-size:.62rem;color:var(--muted)">Acciones</div><div style="font-weight:700;font-size:1.1rem">'+tengo+'</div></div>'+
        '<div><div style="font-size:.62rem;color:var(--muted)">P. Medio compra</div><div style="font-weight:700;font-size:1.1rem">'+fmt2(pm)+' €</div></div>'+
        '<div><div style="font-size:.62rem;color:var(--muted)">Valor actual</div><div style="font-weight:700;font-size:1.1rem">'+fmt2(cot.precio*tengo)+' €</div></div>'+
      '</div>'+
      '<div style="display:flex;gap:16px;padding-top:8px;border-top:1px solid rgba(0,0,0,.06)">'+
        '<div><div style="font-size:.62rem;color:var(--muted)">P&L monetario</div><div class="'+(plT>=0?'pos-text':'neg-text')+'" style="font-weight:700;font-size:1.05rem">'+(plT>=0?'+':'')+fmt2(plT)+' €</div></div>'+
        '<div><div style="font-size:.62rem;color:var(--muted)">Rentabilidad %</div><div class="'+(plP>=0?'pos-text':'neg-text')+'" style="font-weight:700;font-size:1.05rem">'+(plP>=0?'▲':'▼')+fmt2(Math.abs(plP),2)+'%</div></div>'+
      '</div>'+
    '</div>':'';
  var html='<div class="ficha-ov" id="ficha-ov" onclick="if(event.target===this)document.getElementById(\'ficha-ov\').remove()">'+
    '<div class="ficha-box">'+
      '<div style="padding:20px 24px 0;display:flex;align-items:flex-start;justify-content:space-between;gap:10px">'+
        '<div>'+
          '<div style="font-family:\'IBM Plex Mono\',monospace;font-size:.68rem;color:var(--navy);font-weight:700;letter-spacing:1px;margin-bottom:3px">'+emp.t.replace('.MC','')+' · IBEX-35</div>'+
          '<div style="font-size:1.25rem;font-weight:800;margin-bottom:2px">'+emp.n+'</div>'+
          '<div style="font-size:.74rem;color:var(--muted)">'+emp.s+' · '+emp.cap+' capitalización</div>'+
        '</div>'+
        '<button onclick="document.getElementById(\'ficha-ov\').remove()" style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:6px 12px;cursor:pointer">✕</button>'+
      '</div>'+
      '<div style="padding:16px 24px 24px">'+
        '<div style="display:flex;align-items:flex-end;gap:12px;margin-bottom:10px">'+
          '<div class="'+(pos?'pos-text':'neg-text')+'" style="font-size:2rem;font-weight:800;letter-spacing:-1px">'+fmt2(cot.precio)+' €</div>'+
          '<span class="accion-cambio '+(pos?'ac-pos':'ac-neg')+'" style="margin-bottom:4px">'+(pos?'▲':'▼')+' '+fmt2(Math.abs(cot.cambio))+' ('+fmt2(Math.abs(cot.pct),2)+'%)</span>'+
        '</div>'+
        '<div style="margin-bottom:14px">'+sparkSVG(cot.spark,pos?'#15803d':'#b91c1c',520,48)+'</div>'+
        '<div class="fkv" style="margin-bottom:14px">'+
          '<div class="fkv-item"><div class="fkv-label">Cierre anterior</div><div class="fkv-val">'+fmt2(cot.prev)+' €</div></div>'+
          '<div class="fkv-item"><div class="fkv-label">Máx / Mín hoy</div><div class="fkv-val">'+fmt2(cot.maxH)+' / '+fmt2(cot.minH)+'</div></div>'+
          '<div class="fkv-item"><div class="fkv-label pos-text">Máx 52 semanas</div><div class="fkv-val pos-text">'+fmt2(cot.max52)+' €</div></div>'+
          '<div class="fkv-item"><div class="fkv-label neg-text">Mín 52 semanas</div><div class="fkv-val neg-text">'+fmt2(cot.min52)+' €</div></div>'+
          '<div class="fkv-item"><div class="fkv-label">Volumen</div><div class="fkv-val">'+fmtM(cot.vol)+'</div></div>'+
          '<div class="fkv-item"><div class="fkv-label">Capitalización</div><div class="fkv-val">'+fmtM(cot.mktcap)+'</div></div>'+
        '</div>'+
        '<div style="font-size:.82rem;color:var(--muted);line-height:1.6;margin-bottom:14px">'+emp.d+'</div>'+
        posHtml+
        '<div style="background:var(--surface2);border-radius:10px;padding:13px 15px">'+
          '<div style="font-size:.67rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin-bottom:9px">Ejecutar orden</div>'+
          '<div style="display:flex;gap:9px;align-items:flex-end;flex-wrap:wrap">'+
            '<div><div style="font-size:.64rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Nº acciones</div>'+
            '<input class="bolsa-input" id="fq" type="number" min="1" value="'+(tengo||10)+'"></div>'+
            '<button class="btn-buy" onclick="ejecutar(\''+t+'\',\'compra\')">Comprar</button>'+
            (tengo>0?'<button class="btn-sell" onclick="ejecutar(\''+t+'\',\'venta\')">Vender</button>':'')+
          '</div>'+
          '<div style="font-size:.7rem;color:var(--muted);margin-top:7px">Precio actual: <strong>'+fmt2(cot.precio)+' €</strong> · Saldo disponible: <strong>'+fmt2(BOLSA.saldo)+' €</strong>'+(tengo>0?' · Tienes: <strong>'+tengo+' acc.</strong>':'')+'</div>'+
        '</div>'+
      '</div>'+
    '</div></div>';
  var prev=document.getElementById('ficha-ov');if(prev)prev.remove();
  document.body.insertAdjacentHTML('beforeend',html);
}

function ejecutar(t,tipo){
  var q=parseInt((document.getElementById('fq')||{}).value||0);if(!q||q<1){bflash('Nº de acciones inválido','#dc2626');return;}
  var cot=BOLSA.cots[t];if(!cot)return;
  var p=cot.precio,total=p*q,emp=IBEX.find(function(e){return e.t===t;});
  if(tipo==='compra'){
    if(total>BOLSA.saldo){bflash('Saldo insuficiente: necesitas '+fmt2(total)+' €','#dc2626');return;}
    BOLSA.saldo-=total;
    if(!BOLSA.cartera[t])BOLSA.cartera[t]={nombre:emp?emp.n:t,acciones:0,precioMedio:0};
    var car=BOLSA.cartera[t],ant=car.acciones*car.precioMedio;
    car.acciones+=q;car.precioMedio=(ant+total)/car.acciones;
    bflash('✓ COMPRA: '+q+' × '+(emp?emp.n:t)+' = '+fmt2(total)+' €','#15803d');
  }else{
    var pos=BOLSA.cartera[t];if(!pos||pos.acciones<q){bflash('No tienes suficientes acciones','#dc2626');return;}
    var ben=(p-pos.precioMedio)*q,rent=ben/(pos.precioMedio*q)*100;
    BOLSA.saldo+=total;pos.acciones-=q;if(pos.acciones===0)delete BOLSA.cartera[t];
    bflash('✓ VENTA: '+fmt2(total)+' € | Benef: '+(ben>=0?'+':'')+fmt2(ben)+' € ('+fmt2(rent,1)+'%)',ben>=0?'#15803d':'#dc2626');
  }
  BOLSA.historial.unshift({ts:new Date().toLocaleString('es-ES'),tipo:tipo,t:t,n:emp?emp.n:t,q:q,p:p,total:total,ben:tipo==='venta'?(p-(BOLSA.cartera[t]?BOLSA.cartera[t].precioMedio:p))*q:0});
  bolsaSave();
  var fov=document.getElementById('ficha-ov');if(fov)fov.remove();
  bActStats();
  if(document.getElementById('bc-body'))renderCartera();
}

// ── TAB: CARTERA ───────────────────────────────────────
var CAPSULAS_CARTERA=[
  {ico:'⚖️',t:'Diversificación: no pongas todos los huevos en una cesta',b:'La diversificación consiste en repartir la inversión entre distintas empresas y sectores. Si tienes el 100% en una sola empresa y va mal, pierdes todo. Con 10 empresas de sectores distintos, el riesgo específico de cada una queda reducido significativamente.'},
  {ico:'📐',t:'El peso de cada posición',b:'El <strong>peso</strong> de una acción en cartera es el porcentaje que representa sobre el total. Ejemplo: si tienes una cartera de 10.000€ y 3.000€ son de Inditex, el peso de Inditex es el 30%. Se recomienda que ninguna posición supere el 20-25% para no concentrar demasiado riesgo.'},
  {ico:'📅',t:'Precio medio de compra',b:'Si compras acciones de la misma empresa en distintos momentos, tu <strong>precio medio</strong> es el coste promedio ponderado. Ejemplo: compras 10 acciones a 5€ y 10 más a 7€ → precio medio = (50+70)/20 = 6€. Esta técnica de compras escalonadas se llama <em>Dollar Cost Averaging</em>.'},
  {ico:'🔄',t:'¿Cuándo vender?',b:'No hay una respuesta única. Algunos inversores venden cuando alcanzan un objetivo de rentabilidad (ej: +15%). Otros venden cuando la empresa cambia fundamentalmente. Lo importante es tener una estrategia clara desde el principio y no vender por pánico ni por euforia.'},
];

function renderCartera(){
  var body=document.getElementById('bc-body'),res=document.getElementById('bc-resumen');
  if(!body)return;
  var keys=Object.keys(BOLSA.cartera);
  if(!keys.length){
    if(res)res.innerHTML='<div style="text-align:center;padding:2rem;color:var(--muted)"><div style="font-size:2rem;margin-bottom:10px">📭</div><div style="font-size:14px;font-weight:500">Cartera vacía</div><div style="font-size:13px;margin-top:5px">Ve al Mercado y compra tus primeras acciones del IBEX-35</div></div>';
    body.innerHTML='';
    return;
  }
  var totInv=0,totVal=0;
  keys.forEach(function(t){var pos=BOLSA.cartera[t],cot=BOLSA.cots[t]||{precio:pos.precioMedio};totInv+=pos.precioMedio*pos.acciones;totVal+=cot.precio*pos.acciones;});
  var totPL=totVal-totInv,totPLp=totInv?(totPL/totInv*100):0;
  if(res)res.innerHTML=
    '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin-bottom:16px">'+
      '<div class="sc"><div class="sl">Inversión total</div><div class="sn" style="font-size:19px">'+fmt2(totInv)+' €</div></div>'+
      '<div class="sc"><div class="sl">Valor actual</div><div class="sn" style="font-size:19px;color:var(--'+(totVal>=totInv?'green':'red')+')">'+fmt2(totVal)+' €</div></div>'+
      '<div class="sc"><div class="sl">P&L total €</div><div class="sn '+(totPL>=0?'pos-text':'neg-text')+'" style="font-size:19px">'+(totPL>=0?'+':'')+fmt2(totPL)+' €</div></div>'+
      '<div class="sc"><div class="sl">Rentabilidad</div><div class="sn '+(totPLp>=0?'pos-text':'neg-text')+'" style="font-size:19px">'+(totPLp>=0?'▲':'▼')+fmt2(Math.abs(totPLp),2)+'%</div></div>'+
      '<div class="sc"><div class="sl">Saldo libre</div><div class="sn blue" style="font-size:19px">'+fmt2(BOLSA.saldo)+' €</div></div>'+
    '</div>';
  body.innerHTML=keys.map(function(t){
    var pos=BOLSA.cartera[t],cot=BOLSA.cots[t]||{precio:pos.precioMedio,pct:0};
    var val=cot.precio*pos.acciones,coste=pos.precioMedio*pos.acciones,pl=val-coste,plp=coste?(pl/coste*100):0;
    var peso=totVal?(val/totVal*100):0;
    return '<tr>'+
      '<td><div style="font-family:\'IBM Plex Mono\',monospace;font-size:.7rem;font-weight:700;color:var(--navy)">'+t.replace('.MC','')+'</div><div style="font-size:.82rem;margin-top:1px">'+pos.nombre+'</div></td>'+
      '<td style="text-align:right;font-family:\'IBM Plex Mono\',monospace">'+pos.acciones+'</td>'+
      '<td style="text-align:right;font-family:\'IBM Plex Mono\',monospace">'+fmt2(pos.precioMedio)+' €</td>'+
      '<td style="text-align:right;font-family:\'IBM Plex Mono\',monospace;font-weight:600" class="'+(cot.pct>=0?'pos-text':'neg-text')+'">'+fmt2(cot.precio)+' €</td>'+
      '<td style="text-align:right;font-weight:600">'+fmt2(val)+' €</td>'+
      '<td style="text-align:right" class="'+(pl>=0?'pos-text':'neg-text')+'">'+(pl>=0?'+':'')+fmt2(pl)+' €</td>'+
      '<td style="text-align:right" class="'+(plp>=0?'pos-text':'neg-text')+'">'+(plp>=0?'▲':'▼')+fmt2(Math.abs(plp),2)+'%</td>'+
      '<td style="text-align:right;color:var(--muted);font-size:.78rem">'+fmt2(peso,1)+'%</td>'+
      '<td><button class="btn-sell" style="font-size:.7rem;padding:5px 10px" onclick="venderTodo(\''+t+'\')">Vender</button></td>'+
    '</tr>';
  }).join('');
}
function venderTodo(t){
  var pos=BOLSA.cartera[t];if(!pos)return;
  var cot=BOLSA.cots[t]||{precio:pos.precioMedio};
  var total=cot.precio*pos.acciones,ben=(cot.precio-pos.precioMedio)*pos.acciones,rent=ben/(pos.precioMedio*pos.acciones)*100;
  if(!confirm('Vender las '+pos.acciones+' acciones de '+pos.nombre+'\nPrecio: '+fmt2(cot.precio)+' €\nTotal: '+fmt2(total)+' €\nBeneficio: '+(ben>=0?'+':'')+fmt2(ben)+' € ('+fmt2(rent,1)+'%)'))return;
  BOLSA.saldo+=total;
  BOLSA.historial.unshift({ts:new Date().toLocaleString('es-ES'),tipo:'venta',t:t,n:pos.nombre,q:pos.acciones,p:cot.precio,total:total,ben:ben});
  delete BOLSA.cartera[t];
  bolsaSave();bActStats();renderCartera();
  bflash('✓ Vendido '+pos.nombre+' · '+(ben>=0?'+':'')+fmt2(ben)+' €',ben>=0?'#15803d':'#dc2626');
}

// ── TAB: P&L ───────────────────────────────────────────
var CAPSULAS_PL=[
  {ico:'📊',t:'¿Qué es el P&L?',b:'P&L viene del inglés <em>Profit & Loss</em> (Ganancias y Pérdidas). Es la diferencia entre lo que pagaste por tus acciones y lo que valen ahora. <strong>P&L = Valor actual − Coste de compra</strong>. Si es positivo, estás ganando. Si es negativo, estás perdiendo (aunque no es definitivo hasta que vendas).'},
  {ico:'💹',t:'P&L realizado vs no realizado',b:'El <strong>P&L no realizado</strong> (o latente) es la ganancia o pérdida de posiciones que aún tienes abiertas — todavía no has vendido. El <strong>P&L realizado</strong> es el resultado definitivo de operaciones ya cerradas (vendidas). Solo tributas por el P&L realizado.'},
  {ico:'📐',t:'Rentabilidad: cómo calcularla',b:'La rentabilidad expresa el resultado como porcentaje de lo invertido. <strong>Rentabilidad % = [(Precio venta − Precio compra) / Precio compra] × 100</strong>. Ejemplo: compraste a 10€ y vendes a 12€ → rentabilidad = +20%. Si además cobras dividendos de 0,50€ → rentabilidad total = +25%.'},
  {ico:'📅',t:'La importancia del tiempo',b:'La rentabilidad anualizada permite comparar inversiones de distinta duración. Si ganaste un 20% en 2 años, tu rentabilidad anual es aproximadamente un 9,5%. Esta distinción es fundamental: un +20% en 1 mes es extraordinario; en 10 años, modesto.'},
];

function renderPL(){
  var cont=document.getElementById('bpl-cont');if(!cont)return;
  var keys=Object.keys(BOLSA.cartera);
  // Calcular datos globales
  var totInv=0,totVal=0;
  var posData=keys.map(function(t){
    var pos=BOLSA.cartera[t],cot=BOLSA.cots[t]||{precio:pos.precioMedio};
    var inv=pos.precioMedio*pos.acciones,val=cot.precio*pos.acciones,pl=val-inv,plp=inv?(pl/inv*100):0;
    totInv+=inv;totVal+=val;
    return {t:t,n:pos.nombre,inv:inv,val:val,pl:pl,plp:plp};
  });
  var totPL=totVal-totInv,totPLp=totInv?(totPL/totInv*100):0;
  // P&L realizado (historial ventas)
  var realizado=BOLSA.historial.filter(function(h){return h.tipo==='venta';}).reduce(function(s,h){return s+(h.ben||0);},0);

  var html='';
  // Resumen tarjetas
  html+='<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-bottom:20px">'+
    '<div class="sc"><div class="sl">P&L no realizado</div><div class="sn '+(totPL>=0?'pos-text':'neg-text')+'" style="font-size:18px">'+(totPL>=0?'+':'')+fmt2(totPL)+' €</div><div style="font-size:11px;color:var(--muted);margin-top:3px">'+(totPLp>=0?'▲':'▼')+fmt2(Math.abs(totPLp),2)+'%</div></div>'+
    '<div class="sc"><div class="sl">P&L realizado</div><div class="sn '+(realizado>=0?'pos-text':'neg-text')+'" style="font-size:18px">'+(realizado>=0?'+':'')+fmt2(realizado)+' €</div><div style="font-size:11px;color:var(--muted);margin-top:3px">Ventas cerradas</div></div>'+
    '<div class="sc"><div class="sl">P&L total</div><div class="sn '+(totPL+realizado>=0?'pos-text':'neg-text')+'" style="font-size:18px">'+(totPL+realizado>=0?'+':'')+fmt2(totPL+realizado)+' €</div></div>'+
    '<div class="sc"><div class="sl">Patrimonio total</div><div class="sn blue" style="font-size:18px">'+fmt2(BOLSA.saldo+totVal)+' €</div></div>'+
  '</div>';

  if(!keys.length&&!BOLSA.historial.length){
    html+='<div class="card" style="text-align:center;padding:2rem;color:var(--muted)">Sin operaciones todavía. Comienza comprando acciones en el Mercado.</div>';
  } else {
    // Gráfico de barras por posición
    if(posData.length){
      html+='<div class="card" style="margin-bottom:14px"><div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:12px">P&L por posición abierta</div>'+
        '<div style="overflow-x:auto">'+barChartSVG(posData.map(function(d){return d.t.replace('.MC','');}),posData.map(function(d){return d.pl;}),Math.max(400,posData.length*60),110)+'</div>'+
        // Detalle tabla
        '<div class="tw" style="margin-top:14px"><table><thead><tr>'+
          '<th>Empresa</th><th style="text-align:right">Invertido</th><th style="text-align:right">Valor actual</th>'+
          '<th style="text-align:right">P&L €</th><th style="text-align:right">P&L %</th>'+
        '</tr></thead><tbody>'+
        posData.map(function(d){
          return '<tr><td style="font-weight:500">'+d.n+'<span style="font-size:.7rem;color:var(--muted);margin-left:6px;font-family:\'IBM Plex Mono\',monospace">'+d.t.replace('.MC','')+'</span></td>'+
            '<td style="text-align:right;color:var(--muted)">'+fmt2(d.inv)+' €</td>'+
            '<td style="text-align:right;font-weight:500">'+fmt2(d.val)+' €</td>'+
            '<td style="text-align:right" class="'+(d.pl>=0?'pos-text':'neg-text')+'">'+(d.pl>=0?'+':'')+fmt2(d.pl)+' €</td>'+
            '<td style="text-align:right" class="'+(d.plp>=0?'pos-text':'neg-text')+'">'+(d.plp>=0?'▲':'▼')+fmt2(Math.abs(d.plp),2)+'%</td>'+
          '</tr>';
        }).join('')+'</tbody></table></div></div>';
    }
    // Historial de ventas realizadas
    var ventas=BOLSA.historial.filter(function(h){return h.tipo==='venta';});
    if(ventas.length){
      html+='<div class="card" style="margin-bottom:14px"><div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:12px">Operaciones cerradas (P&L realizado)</div>'+
        '<div class="tw"><table><thead><tr><th>Fecha</th><th>Empresa</th><th style="text-align:right">Acc.</th><th style="text-align:right">P.Venta</th><th style="text-align:right">Total</th><th style="text-align:right">Beneficio</th></tr></thead><tbody>'+
        ventas.slice(0,20).map(function(v){
          return '<tr><td style="font-size:.74rem;color:var(--muted);font-family:\'IBM Plex Mono\',monospace">'+v.ts+'</td>'+
            '<td style="font-weight:500">'+v.n+'</td>'+
            '<td style="text-align:right;font-family:\'IBM Plex Mono\',monospace">'+v.q+'</td>'+
            '<td style="text-align:right;font-family:\'IBM Plex Mono\',monospace">'+fmt2(v.p)+' €</td>'+
            '<td style="text-align:right;font-weight:500">'+fmt2(v.total)+' €</td>'+
            '<td style="text-align:right" class="'+((v.ben||0)>=0?'pos-text':'neg-text')+'">'+(v.ben!=null?(v.ben>=0?'+':'')+fmt2(v.ben)+' €':'—')+'</td>'+
          '</tr>';
        }).join('')+'</tbody></table></div></div>';
    }
  }

  // Cápsulas didácticas
  html+=renderCapsulas(CAPSULAS_PL,'P&L y rentabilidades');
  cont.innerHTML=html;
}

// ── CÁPSULAS DIDÁCTICAS ────────────────────────────────
function renderCapsulas(caps,titulo){
  return '<div style="margin-top:20px"><div style="font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:10px">💡 Conceptos didácticos — '+titulo+'</div>'+
    '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:9px">'+
    caps.map(function(cap,i){
      return '<div class="con-card" id="cap-'+titulo.replace(/\s/g,'')+i+'" onclick="this.classList.toggle(\'open\')">'+
        '<div class="con-hdr"><span style="font-size:1.3rem">'+cap.ico+'</span><div style="font-size:.88rem;font-weight:600;flex:1">'+cap.t+'</div>'+
        '<span style="font-size:.65rem;color:var(--navy);font-family:\'IBM Plex Mono\',monospace">+ ver</span></div>'+
        '<div class="con-body">'+cap.b+'</div>'+
      '</div>';
    }).join('')+'</div></div>';
}

function switchBTab(tab){
  BOLSA.tab=tab;
  document.querySelectorAll('.bolsa-tab').forEach(function(b){b.classList.remove('active');});
  document.querySelectorAll('.bolsa-sec').forEach(function(s){s.classList.remove('active');});
  var btn=document.getElementById('bt-'+tab),sec=document.getElementById('bs-'+tab);
  if(btn)btn.classList.add('active');if(sec)sec.classList.add('active');
  if(tab==='mercado')renderMercado();
  if(tab==='cartera'){renderCartera();bActStats();}
  if(tab==='pl'){renderPL();}
}
function showBolsaTab(tab){
  if(document.getElementById('bs-'+tab))switchBTab(tab);
  else setTimeout(function(){switchBTab(tab);},80);
}
function resetBolsa(){
  if(!confirm('¿Reiniciar simulador? Volverás a 50.000 € y perderás toda la cartera e historial.'))return;
  BOLSA.saldo=50000;BOLSA.cartera={};BOLSA.historial=[];bolsaSave();initBolsa();bflash('Simulador reiniciado — 50.000 € disponibles','#1a2744');
}
function abrirIndicesBME(){
  window.open('https://www.bolsasymercados.es/es/bme-exchange/indices/resumen.html','_blank','noopener');
}

function initBolsa(){
  var root=document.getElementById('bolsa-root');if(!root)return;
  root.innerHTML=
    '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:18px">'+
      '<div>'+
        '<h1 style="font-size:20px;margin-bottom:2px">Simulador de Bolsa — IBEX-35</h1>'+
        '<div style="font-size:.75rem;color:var(--muted)">Capital virtual: 50.000 € · Cotizaciones reales del mercado español</div>'+
      '</div>'+
      '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">'+
        '<div style="display:flex;gap:8px;flex-wrap:wrap">'+
          '<div class="bolsa-stat"><div class="bolsa-stat-label">Saldo</div><div class="bolsa-stat-val blue" id="bs-saldo">'+fmt2(BOLSA.saldo)+' €</div></div>'+
          '<div class="bolsa-stat"><div class="bolsa-stat-label">Cartera</div><div class="bolsa-stat-val" id="bs-cartera">0,00 €</div></div>'+
          '<div class="bolsa-stat"><div class="bolsa-stat-label">Patrimonio</div><div class="bolsa-stat-val" id="bs-total">'+fmt2(BOLSA.saldo)+' €</div></div>'+
          '<div class="bolsa-stat"><div class="bolsa-stat-label">P&L</div><div class="bolsa-stat-val" id="bs-gan">0,00 €</div></div>'+
        '</div>'+
        '<button onclick="resetBolsa()" style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:6px 12px;font-size:.72rem;cursor:pointer;color:var(--muted)">🔄 Reiniciar</button>'+
      '</div>'+
    '</div>'+
    '<div class="bolsa-tabs">'+
      '<button class="bolsa-tab active" id="bt-mercado" onclick="switchBTab(\'mercado\')">📊 Mercado</button>'+
      '<button class="bolsa-tab" id="bt-cartera" onclick="switchBTab(\'cartera\')">💼 Cartera</button>'+
      '<button class="bolsa-tab" id="bt-pl" onclick="switchBTab(\'pl\')">📈 P&L</button>'+
    '</div>'+
    '<div class="bolsa-sec active" id="bs-mercado">'+
      '<div id="bm-grid" class="mercado-grid"></div>'+
      '<div id="bm-estado" style="font-size:.72rem;color:var(--muted);margin:8px 0 4px;font-family:\'IBM Plex Mono\',monospace"></div>'+
      '<div id="bm-capsulas"></div>'+
    '</div>'+
    '<div class="bolsa-sec" id="bs-cartera">'+
      '<div id="bc-resumen"></div>'+
      '<div class="card" style="padding:0;margin-top:10px"><div class="tw"><table><thead><tr>'+
        '<th>Empresa</th><th style="text-align:right">Acc.</th><th style="text-align:right">P.Compra</th>'+
        '<th style="text-align:right">P.Actual</th><th style="text-align:right">Valor</th>'+
        '<th style="text-align:right">P&L €</th><th style="text-align:right">P&L %</th>'+
        '<th style="text-align:right">Peso</th><th>Acción</th>'+
      '</tr></thead><tbody id="bc-body"></tbody></table></div></div>'+
      '<div id="bc-capsulas"></div>'+
    '</div>'+
    '<div class="bolsa-sec" id="bs-pl"><div id="bpl-cont"></div></div>';

  renderMercado().then(function(){
    var estado=document.getElementById('bm-estado');
    if(estado){
      var hoy=new Date();
      var dias=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
      estado.innerHTML='🟡 Simulación educativa · Precios del '+dias[hoy.getDay()]+
        ' '+hoy.getDate()+'/'+(hoy.getMonth()+1)+'/'+hoy.getFullYear()+
        ' · Mismos precios para todos los alumnos hoy';
    }
    var capsCont=document.getElementById('bm-capsulas');
    if(capsCont)capsCont.innerHTML=renderCapsulas(CAPSULAS_MERCADO,'Lectura bursátil');
    var capsCar=document.getElementById('bc-capsulas');
    if(capsCar)capsCar.innerHTML=renderCapsulas(CAPSULAS_CARTERA,'Gestión de cartera');
  });
}


// ── ÍNDICES — enlace directo a BME ────────────────────
// Los índices se abren directamente en bolsasymercados.es
// mediante abrirIndicesBME() para no ralentizar la app


// ── EL KIOSCO — acceso directo a medios económicos ───
// ── EL KIOSCO — DOM puro, sin concatenación de strings ────
var MEDIOS = [
  {n:'El Economista',     u:'https://www.eleconomista.es',              bg:'#003087', desc:'Economía, empresas y mercados'},
  {n:'Expansión',         u:'https://www.expansion.com',                bg:'#c0392b', desc:'Diario económico líder en España'},
  {n:'Cinco Días',        u:'https://cincodias.elpais.com',             bg:'#1a5276', desc:'Economía y negocios · El País'},
  {n:'Invertia',          u:'https://www.invertia.com',                 bg:'#117a65', desc:'Información bursátil en tiempo real'},
  {n:'El Confidencial',   u:'https://www.elconfidencial.com/mercados',  bg:'#1b2631', desc:'Mercados y análisis financiero'},
  {n:'Finanzas.com',      u:'https://www.finanzas.com',                 bg:'#6c3483', desc:'Noticias financieras y de inversión'},
  {n:'Bolsamanía',        u:'https://www.bolsamania.com',               bg:'#1f618d', desc:'Bolsa, fondos y mercados financieros'},
  {n:'Wall Street Journal',u:'https://www.wsj.com/finance',            bg:'#2c3e50', desc:'Referente global de economía y finanzas'},
  {n:'Financial Times',   u:'https://www.ft.com',                      bg:'#c9a84c', desc:'El diario económico más influyente del mundo'},
];

function initKiosco(){
  var root = document.getElementById('kiosco-root');
  if(!root) return;
  root.innerHTML = '';

  // Cabecera
  var header = document.createElement('div');
  header.style.cssText = 'background:var(--navy);border-radius:var(--rl);padding:1.5rem 1.75rem;margin-bottom:1.5rem;display:flex;align-items:center;gap:1rem';
  header.innerHTML = '<div style="font-size:2.2rem">🗞️</div><div><div style="font-family:\'Playfair Display\',serif;font-size:1.4rem;font-weight:700;color:#fff;margin-bottom:3px">El Kiosco</div><div style="font-size:.76rem;color:rgba(255,255,255,.5)">Los principales medios de economía y finanzas · Pulsa para acceder</div></div>';
  root.appendChild(header);

  // Subtítulo
  var sub = document.createElement('div');
  sub.style.cssText = 'font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:12px';
  sub.textContent = 'Prensa económica nacional e internacional';
  root.appendChild(sub);

  // Grid de periódicos
  var grid = document.createElement('div');
  grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px';

  MEDIOS.forEach(function(m){
    var a = document.createElement('a');
    a.href = m.u;
    a.target = '_blank';
    a.rel = 'noopener';
    a.style.cssText = 'text-decoration:none';

    var card = document.createElement('div');
    card.style.cssText = 'background:var(--surface);border:2px solid var(--border);border-radius:14px;overflow:hidden;cursor:pointer;transition:border-color .2s,transform .2s,box-shadow .2s;display:flex;flex-direction:column';
    card.addEventListener('mouseenter', function(){
      card.style.borderColor = m.bg;
      card.style.transform = 'translateY(-3px)';
      card.style.boxShadow = '0 8px 24px rgba(0,0,0,.12)';
    });
    card.addEventListener('mouseleave', function(){
      card.style.borderColor = '';
      card.style.transform = '';
      card.style.boxShadow = '';
    });

    // Cabecera de color
    var cabecera = document.createElement('div');
    cabecera.style.cssText = 'padding:18px 16px 14px;min-height:72px;display:flex;align-items:flex-end;background:'+m.bg;
    var tituloDiv = document.createElement('div');
    var h = document.createElement('div');
    h.style.cssText = 'font-size:1rem;font-weight:800;color:#fff;line-height:1.2;letter-spacing:-.3px';
    h.textContent = m.n;
    var sub2 = document.createElement('div');
    sub2.style.cssText = 'font-size:.68rem;color:rgba(255,255,255,.65);margin-top:3px;font-family:\'IBM Plex Mono\',monospace';
    sub2.textContent = 'EDICIÓN ONLINE';
    tituloDiv.appendChild(h);
    tituloDiv.appendChild(sub2);
    cabecera.appendChild(tituloDiv);

    // Cuerpo
    var body = document.createElement('div');
    body.style.cssText = 'padding:12px 14px;flex:1;display:flex;align-items:center;justify-content:space-between';
    var desc = document.createElement('div');
    desc.style.cssText = 'font-size:.78rem;color:var(--muted);line-height:1.4';
    desc.textContent = m.desc;
    var btn = document.createElement('div');
    btn.style.cssText = 'flex-shrink:0;margin-left:10px;color:#fff;border-radius:6px;padding:4px 10px;font-size:.72rem;font-weight:700;background:'+m.bg;
    btn.textContent = 'Leer ↗';
    body.appendChild(desc);
    body.appendChild(btn);

    card.appendChild(cabecera);
    card.appendChild(body);
    a.appendChild(card);
    grid.appendChild(a);
  });
  root.appendChild(grid);

  // Consejo didáctico
  var tip = document.createElement('div');
  tip.style.cssText = 'margin-top:1.5rem;background:var(--surface2);border-radius:var(--r);padding:14px 16px;font-size:.8rem;color:var(--muted);line-height:1.6';
  tip.innerHTML = '<strong>💡 Consejo didáctico:</strong> Acostúmbrate a leer la prensa económica a diario. Entender las noticias del mercado te ayudará a interpretar las variaciones del simulador. Busca noticias sobre empresas del IBEX-35 como Inditex, Santander o Iberdrola y reflexiona sobre cómo pueden afectar a su cotización.';
  root.appendChild(tip);
}

// ── CONCEPTOS DE BOLSA — DOM puro ──────────────────────
var CBOLSA = [
  {ico:'🏛️', niv:'Básico',
   titulo:'¿Qué es la Bolsa de Valores?',
   cuerpo:'La <strong>Bolsa de Valores</strong> es un mercado organizado donde empresas y gobiernos captan financiación emitiendo títulos (acciones, bonos) y los inversores los compran y venden. En España, el mercado principal es la <strong>Bolsa de Madrid</strong>, gestionada por BME.<br><br>Funciones principales:<ul style="margin:8px 0 0 16px;line-height:1.8"><li><strong>Financiación empresarial</strong>: las empresas obtienen capital vendiendo acciones</li><li><strong>Liquidez</strong>: los inversores pueden convertir sus acciones en dinero fácilmente</li><li><strong>Fijación de precios</strong>: el precio justo lo establece el mercado</li><li><strong>Indicador económico</strong>: la bolsa refleja las expectativas de la economía</li></ul>',
   formula:'Capitalización bursátil = Precio de la acción × Nº total de acciones emitidas',
   ejemplo:'Inditex tiene 3.100 millones de acciones a 47€ → capitalización = 145.700 M€, la mayor empresa española por valor de mercado.'},
  {ico:'📜', niv:'Básico',
   titulo:'¿Qué es una acción?',
   cuerpo:'Una <strong>acción</strong> es un título que representa una fracción del capital social de una SA. Al comprarla te conviertes en accionista (copropietario).<br><br>Derechos:<ul style="margin:8px 0 0 16px;line-height:1.8"><li><strong>Dividendos</strong>: participar en los beneficios</li><li><strong>Voto</strong>: en la Junta General de Accionistas</li><li><strong>Suscripción preferente</strong>: en ampliaciones de capital</li><li><strong>Cuota de liquidación</strong>: si la empresa se disuelve</li></ul>',
   formula:'Rentabilidad por dividendo = (Dividendo por acción / Precio) × 100',
   ejemplo:'Telefónica paga 0,30€ de dividendo y cotiza a 4,10€. Rentabilidad = (0,30/4,10)×100 = 7,32% solo por dividendos.'},
  {ico:'💹', niv:'Básico',
   titulo:'Cotización y formación del precio',
   cuerpo:'La <strong>cotización</strong> es el precio de negociación en cada momento. Se forma por la ley de oferta y demanda.<br><br>Factores que influyen:<ul style="margin:8px 0 0 16px;line-height:1.8"><li><strong>Resultados empresariales</strong>: si la empresa gana más de lo esperado, sube</li><li><strong>Tipos de interés BCE</strong>: si suben, la bolsa suele bajar</li><li><strong>Coyuntura económica</strong>: PIB, inflación, desempleo</li><li><strong>Expectativas</strong>: la bolsa cotiza el futuro, no el presente</li></ul>',
   formula:'Variación % = [(Precio hoy − Precio ayer) / Precio ayer] × 100',
   ejemplo:'Santander cierra a 4,80€. Al día siguiente publica buenos resultados y cotiza a 4,92€. Variación = +2,5%.'},
  {ico:'📊', niv:'Básico',
   titulo:'El IBEX-35',
   cuerpo:'El <strong>IBEX-35</strong> es el principal índice bursátil español. Recoge las 35 empresas con mayor liquidez de la bolsa española, ponderadas por capitalización.<br><br>Datos clave:<ul style="margin:8px 0 0 16px;line-height:1.8"><li>Base: 3.000 puntos (29 dic 1989)</li><li>Revisión semestral (junio y diciembre)</li><li>Mayores pesos: Inditex, Santander, BBVA, Iberdrola</li><li>Horario: 9:00–17:30h días laborables</li></ul>',
   formula:'IBEX-35 = Σ(Capitalización_i × Factor_i) / Divisor_ajustado',
   ejemplo:'Si el IBEX sube de 10.500 a 10.815 puntos, ha subido un 3%. Un fondo indexado al IBEX habría ganado ese 3% menos comisiones.'},
  {ico:'💰', niv:'Intermedio',
   titulo:'Rentabilidad total de una inversión',
   cuerpo:'La <strong>rentabilidad</strong> mide el rendimiento en relación a lo invertido. Dos fuentes:<ul style="margin:8px 0 0 16px;line-height:1.8"><li><strong>Plusvalía</strong>: diferencia precio venta − precio compra</li><li><strong>Dividendos</strong>: pagos periódicos al accionista</li></ul><br>La <strong>rentabilidad anualizada</strong> permite comparar inversiones de distinta duración.',
   formula:'Rentabilidad total = [(P.Venta − P.Compra + Dividendos) / P.Compra] × 100',
   ejemplo:'Compras 100 acc. BBVA a 9€, vendes a 10,20€ y cobras 0,30€ dividendo. Rentabilidad = [(10,20−9+0,30)/9]×100 = +16,7%'},
  {ico:'⚠️', niv:'Intermedio',
   titulo:'Riesgo en bolsa: tipos y gestión',
   cuerpo:'Tipos principales de riesgo:<ul style="margin:8px 0 0 16px;line-height:1.8"><li><strong>Riesgo sistemático</strong>: afecta a toda la bolsa, no se puede eliminar (crisis, guerras, tipos de interés)</li><li><strong>Riesgo no sistemático</strong>: propio de una empresa, se reduce diversificando</li><li><strong>Riesgo de liquidez</strong>: no poder vender rápidamente</li><li><strong>Riesgo de divisa</strong>: pérdidas por cambio de moneda</li></ul>',
   formula:'Volatilidad anualizada = Desviación típica diaria × √252',
   ejemplo:'Tesla: volatilidad anual 60%. Coca-Cola: 18%. Tesla puede ganar (o perder) mucho más en poco tiempo. Mayor riesgo = mayor potencial de rentabilidad.'},
  {ico:'💼', niv:'Intermedio',
   titulo:'Diversificación de cartera',
   cuerpo:'Repartir la inversión para reducir el riesgo no sistemático. Formas de diversificar:<ul style="margin:8px 0 0 16px;line-height:1.8"><li><strong>Por sectores</strong>: banca, energía, tecnología, consumo...</li><li><strong>Por geografía</strong>: España, Europa, EE.UU., emergentes</li><li><strong>Por tamaño</strong>: blue chips y mid caps</li><li><strong>Por activo</strong>: acciones, bonos, inmuebles</li></ul>',
   formula:'Rentabilidad cartera = Σ (Peso_i × Rentabilidad_i)',
   ejemplo:'Cartera: 25% Santander + 25% Iberdrola + 25% Inditex + 25% AENA. Si la banca cae, energía y textil pueden compensar.'},
  {ico:'📋', niv:'Avanzado',
   titulo:'Análisis fundamental',
   cuerpo:'Estudia el valor intrínseco de una empresa para determinar si está infravalorada (compra) o sobrevalorada (venta).<br><br>Ratios clave:<ul style="margin:8px 0 0 16px;line-height:1.8"><li><strong>PER</strong>: veces que el precio recoge el beneficio anual</li><li><strong>P/VC</strong>: precio vs valor contable</li><li><strong>ROE</strong>: rentabilidad sobre recursos propios</li><li><strong>Deuda neta/EBITDA</strong>: nivel de endeudamiento</li></ul>',
   formula:'PER = Precio de la acción / Beneficio por acción (BPA)',
   ejemplo:'Iberdrola: BPA 0,55€, precio 12,30€. PER = 22,4x. Los inversores pagan 22 veces el beneficio anual. PER más bajo que el sector puede indicar que está barata.'},
  {ico:'📐', niv:'Avanzado',
   titulo:'Análisis técnico',
   cuerpo:'Predice movimientos de precios usando el historial de cotizaciones y volumen.<br><br>Herramientas básicas:<ul style="margin:8px 0 0 16px;line-height:1.8"><li><strong>Soporte</strong>: nivel donde aparecen compradores históricamente</li><li><strong>Resistencia</strong>: nivel donde aparecen vendedores</li><li><strong>Media móvil MM50/MM200</strong>: suaviza la tendencia</li><li><strong>RSI</strong>: &gt;70 sobrecomprado; &lt;30 sobrevendido</li></ul>',
   formula:'Media Móvil Simple 20d = Suma de los 20 últimos cierres / 20',
   ejemplo:'Repsol tiene soporte en 15€. Si baja de ese nivel puede caer más. Si MM200 cruza sobre MM50 (cruz dorada) es señal alcista.'},
  {ico:'📅', niv:'Avanzado',
   titulo:'Tipos de órdenes bursátiles',
   cuerpo:'Tipos principales:<ul style="margin:8px 0 0 16px;line-height:1.8"><li><strong>De mercado</strong>: ejecución inmediata al mejor precio. Garantiza ejecución, no precio</li><li><strong>Limitada</strong>: solo si alcanza el precio fijado. Controla precio, no garantiza ejecución</li><li><strong>Stop-loss</strong>: venta automática si el precio cae del límite. Limita pérdidas</li><li><strong>Take profit</strong>: vende al alcanzar el beneficio objetivo</li><li><strong>Trailing stop</strong>: stop que sigue al precio, protege ganancias</li></ul>',
   formula:'Pérdida máxima = (Precio compra − Stop-loss) × Nº acciones',
   ejemplo:'Compras Telefónica a 4,10€ con stop-loss en 3,90€. Si cae, venta automática limitando pérdida a 0,20€/acción.'},
  {ico:'🏦', niv:'Avanzado',
   titulo:'Fondos de inversión y ETFs',
   cuerpo:'Un <strong>fondo de inversión</strong> es un patrimonio colectivo gestionado por profesionales.<br><br>Un <strong>ETF</strong> es un fondo cotizado que replica un índice en tiempo real.<br><br>Diferencias:<ul style="margin:8px 0 0 16px;line-height:1.8"><li>Fondo tradicional: precio al cierre del día</li><li>ETF: cotiza en tiempo real como acción</li><li>ETF: comisiones más bajas (0,05–0,5% vs 1–2%)</li><li>Fondo activo: gestor elige acciones buscando batir al índice</li></ul>',
   formula:'Valor liquidativo = Patrimonio del fondo / Nº de participaciones',
   ejemplo:'ETF iShares IBEX 35: replica el IBEX con comisión del 0,33%. Si el IBEX sube 3%, el ETF sube ~3%. Un fondo activo cobra 1,5% y muchas veces no bate al índice.'},
  {ico:'🎯', niv:'Básico',
   titulo:'Estrategias de inversión',
   cuerpo:'Dos grandes estrategias:<br><br><strong>Buy &amp; Hold (largo plazo):</strong><ul style="margin:6px 0 8px 16px;line-height:1.8"><li>Compras y mantienes durante años</li><li>Menos estrés y menos impuestos</li><li>Aprovecha el interés compuesto</li></ul><strong>Trading activo:</strong><ul style="margin:6px 0 0 16px;line-height:1.8"><li>Operaciones frecuentes aprovechando movimientos cortos</li><li>Requiere más conocimiento y disciplina</li><li>Los costes se acumulan</li></ul>',
   formula:'Interés compuesto: Capital final = Capital inicial × (1 + r)^n',
   ejemplo:'10.000€ al 8% anual durante 20 años = 46.610€ con interés compuesto. Sin reinvertir beneficios (interés simple) = solo 26.000€.'},
];

var conFiltroActivo = 'Todos';

function initConceptosBolsa(){
  var root = document.getElementById('conceptos-bolsa-root');
  if(!root) return;
  root.innerHTML = '';

  var wrap = document.createElement('div');
  wrap.style.maxWidth = '1100px';

  // Cabecera
  var ph = document.createElement('div');
  ph.innerHTML = '<h1 style="font-size:22px;font-family:\'Playfair Display\',serif;font-weight:600;margin-bottom:4px">Conceptos de Bolsa e Inversión</h1><p style="font-size:13px;color:var(--muted)">Todo lo que necesitas saber para invertir con criterio · Nivel CFGS Administración y Finanzas</p>';
  ph.style.marginBottom = '1.25rem';
  wrap.appendChild(ph);

  // Filtros
  var filtros = document.createElement('div');
  filtros.id = 'con-filtros';
  filtros.style.cssText = 'display:flex;gap:7px;flex-wrap:wrap;margin-bottom:18px';
  ['Todos','Básico','Intermedio','Avanzado'].forEach(function(nivel){
    var chip = document.createElement('span');
    chip.className = 'chip' + (nivel === 'Todos' ? ' on' : '');
    chip.textContent = nivel;
    chip.addEventListener('click', function(){
      conFiltroActivo = nivel;
      document.querySelectorAll('#con-filtros .chip').forEach(function(c){ c.classList.remove('on'); });
      chip.classList.add('on');
      renderListaConceptos(lista);
    });
    filtros.appendChild(chip);
  });
  wrap.appendChild(filtros);

  // Lista
  var lista = document.createElement('div');
  lista.id = 'con-lista';
  lista.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:11px';
  wrap.appendChild(lista);

  root.appendChild(wrap);
  renderListaConceptos(lista);
}

function renderListaConceptos(lista){
  lista.innerHTML = '';
  var nivCol = {Básico:['var(--green-bg)','var(--green)'], Intermedio:['var(--amber-bg)','var(--amber)'], Avanzado:['var(--red-bg)','var(--red)']};
  var items = conFiltroActivo === 'Todos' ? CBOLSA : CBOLSA.filter(function(c){ return c.niv === conFiltroActivo; });

  items.forEach(function(con, i){
    var cols = nivCol[con.niv] || ['var(--surface2)','var(--muted)'];
    var card = document.createElement('div');
    card.className = 'con-card';

    // Header
    var hdr = document.createElement('div');
    hdr.className = 'con-hdr';
    var ico = document.createElement('span');
    ico.style.fontSize = '1.5rem';
    ico.textContent = con.ico;
    var titleDiv = document.createElement('div');
    titleDiv.style.cssText = 'flex:1;font-size:.92rem;font-weight:700';
    titleDiv.textContent = con.titulo;
    var badge = document.createElement('span');
    badge.style.cssText = 'background:'+cols[0]+';color:'+cols[1]+';font-size:.62rem;padding:2px 9px;border-radius:20px;font-weight:600;font-family:\'IBM Plex Mono\',monospace;flex-shrink:0';
    badge.textContent = con.niv;
    hdr.appendChild(ico);
    hdr.appendChild(titleDiv);
    hdr.appendChild(badge);

    // Body
    var body = document.createElement('div');
    body.className = 'con-body';
    var cuerpo = document.createElement('div');
    cuerpo.innerHTML = con.cuerpo;
    body.appendChild(cuerpo);
    if(con.formula){
      var f = document.createElement('div');
      f.className = 'con-formula';
      f.innerHTML = '📐 <strong>Fórmula:</strong> ' + con.formula;
      body.appendChild(f);
    }
    if(con.ejemplo){
      var ej = document.createElement('div');
      ej.className = 'con-ejemplo';
      ej.innerHTML = '📌 <strong>Ejemplo práctico:</strong> ' + con.ejemplo;
      body.appendChild(ej);
    }

    card.appendChild(hdr);
    card.appendChild(body);
    card.addEventListener('click', function(){ card.classList.toggle('open'); });
    lista.appendChild(card);
  });
}


