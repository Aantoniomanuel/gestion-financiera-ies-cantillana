
// ══════════════════════════════════════════════════════
//  DATOS REALES — Gestión Financiera IES Cantillana 26-27
//  Basados en: RD 1584/2011, Orden Junta Andalucía 11/03/2013
//  Estructura: DISTRIBUCIÓN_BLOQUES_G_FRA_26-27.docx
// ══════════════════════════════════════════════════════

var ROL = 'alumno'; // valor por defecto seguro; se fija al confirmar sesión con Supabase

// ── Diálogo de confirmación no bloqueante (reemplaza confirm()) ──
function gfConfirm(msg, labelOk, cb){
  var ov  = document.getElementById('gf-confirm-ov');
  var txt = document.getElementById('gf-confirm-msg');
  var yes = document.getElementById('gf-confirm-yes');
  var no  = document.getElementById('gf-confirm-no');
  if(!ov){ if(window.confirm(msg)) cb(); return; } // fallback si el overlay no existe aún
  txt.innerHTML = msg;
  yes.textContent = labelOk || 'Eliminar';
  ov.classList.add('open');
  function cleanup(){ ov.classList.remove('open'); yes.onclick=null; no.onclick=null; }
  yes.onclick = function(){ cleanup(); cb(); };
  no.onclick  = function(){ cleanup(); };
}

// ── Unidades (Bloques del módulo) ─────────────────────
var UNIDADES_KEY = 'gf_unidades';
function saveUNIDADES(){ localStorage.setItem(UNIDADES_KEY, JSON.stringify(UNIDADES)); }

var _UNIDADES_DEFAULT = [
  { id:'ud1', n:1, titulo:'Necesidades de Financiación',
    horas:22, prog:0, color:'#1a2744',
    desc:'Identificación y análisis de las necesidades financieras de la empresa. Fuentes de financiación propias y ajenas. Análisis empresarial para la toma de decisiones financieras.',
    temas:['Fuentes de financiación propias y ajenas','Coste de las fuentes de financiación','Análisis empresarial: ratios y diagnóstico','Ampliación de capital: procedimientos y cálculo','La estructura financiera óptima de la empresa']
  },
  { id:'ud2', n:2, titulo:'Clasifica y Evalúa Productos Financieros',
    horas:48, prog:0, color:'#1e3a5f',
    desc:'Clasificación y evaluación de productos y servicios financieros del mercado. Leyes simples y compuestas, rentas financieras, productos de activo y pasivo. Cálculo financiero aplicado.',
    temas:['Leyes financieras simples y compuestas','Rentas financieras: tipos y cálculo','El sistema financiero español: intermediarios','Productos financieros de activo: préstamos, hipotecas, leasing','Productos financieros de pasivo: depósitos, cuentas corrientes','Liquidación de cuentas corrientes y de crédito']
  },
  { id:'ud3', n:3, titulo:'Los Seguros',
    horas:14, prog:0, color:'#2d4a7a',
    desc:'Caracterización de la tipología de seguros y análisis de la actividad aseguradora. Contrato de seguro, primas y tratamiento fiscal.',
    temas:['La actividad aseguradora: marco legal','Elementos del contrato de seguro','Clasificación de seguros: personas, daños, responsabilidad civil','Seguros de ahorro y capitalización','Las primas: cálculo y componentes','Tratamiento fiscal de los seguros']
  },
  { id:'ud4', n:4, titulo:'Inversiones',
    horas:28, prog:0, color:'#1a6b4a',
    desc:'Selección de inversiones en activos financieros y económicos. Mercados financieros, valoración de activos, métodos de selección de inversiones (VAN, TIR). Simulación bursátil práctica.',
    temas:['Activos y mercados financieros: renta fija y variable','La Bolsa de Valores: funcionamiento y operativa','Valoración de activos financieros','Métodos de selección de inversiones: VAN, TIR, PRI','Rentabilidad y riesgo de las inversiones','Informes de inversión para empresa y uso personal']
  },
  { id:'ud5', n:5, titulo:'Presupuestos',
    horas:14, prog:0, color:'#7c3200',
    desc:'Integración de presupuestos parciales de las áreas funcionales de la empresa. Elaboración, control y análisis de desviaciones presupuestarias.',
    temas:['Tipos de presupuestos empresariales','Elaboración del presupuesto de tesorería','El presupuesto de explotación','Integración de presupuestos parciales','Control presupuestario y análisis de desviaciones','Aplicaciones informáticas de gestión presupuestaria']
  },
];

// Cargar desde localStorage si existe, si no usar los datos por defecto
var UNIDADES = (function(){
  try{
    var saved = JSON.parse(localStorage.getItem(UNIDADES_KEY)||'null');
    if(saved && saved.length) return saved;
  } catch(e){}
  return _UNIDADES_DEFAULT;
})();

// ── RA y CE oficiales (RD 1584/2011 + Orden Andalucía 11/03/2013) ─
var RA_CE_DATA = (function(){ var saved=JSON.parse(localStorage.getItem('gf_ra_ce')||'null'); /* Si saved tiene RA5 en ud5 (dato corrompido) forzar reset */ if(saved && saved.ud5 && saved.ud5.ra && saved.ud5.ra[0] && saved.ud5.ra[0].id==='RA5'){ localStorage.removeItem('gf_ra_ce'); saved=null; } return saved || {
  ud1: {
    ra: [
      { id:'RA1', nombre:'RA1 — Caracteriza las necesidades de financiación de la empresa, identificando las fuentes disponibles y sus características',
        ponderacion: 15,
        ce: [
          { id:'CE1.a', desc:'Se han identificado las necesidades de financiación de las empresas en función de su actividad y estructura', peso:20 },
          { id:'CE1.b', desc:'Se han diferenciado las fuentes de financiación propias y ajenas, internas y externas', peso:20 },
          { id:'CE1.c', desc:'Se han analizado las características de las principales fuentes de financiación del mercado', peso:20 },
          { id:'CE1.d', desc:'Se ha calculado el coste de las diferentes fuentes de financiación', peso:20 },
          { id:'CE1.e', desc:'Se han elaborado informes sobre la estructura financiera de la empresa y su adecuación a las necesidades', peso:20 },
        ]
      }
    ]
  },
  ud2: {
    ra: [
      { id:'RA2', nombre:'RA2 — Clasifica los productos y servicios financieros, analizando sus características y formas de contratación',
        ponderacion: 25,
        ce: [
          { id:'CE2.a', desc:'Se han identificado las organizaciones, entidades y tipos de empresas que operan en el sistema financiero', peso:15 },
          { id:'CE2.b', desc:'Se han precisado las instituciones financieras bancarias y no bancarias y sus principales características', peso:15 },
          { id:'CE2.c', desc:'Se han detallado los aspectos específicos de los productos y servicios existentes en el mercado', peso:20 },
          { id:'CE2.d', desc:'Se han reconocido las variables que intervienen en las operaciones de cada producto/servicio', peso:15 },
          { id:'CE2.e', desc:'Se han identificado los sujetos que intervienen en las operaciones con cada producto/servicio', peso:15 },
          { id:'CE2.f', desc:'Se han relacionado las ventajas e inconvenientes de los distintos productos y servicios financieros', peso:10 },
          { id:'CE2.g', desc:'Se ha determinado la documentación necesaria en la gestión de productos y servicios financieros', peso:10 },
        ]
      },
      { id:'RA3', nombre:'RA3 — Evalúa productos y servicios financieros del mercado, realizando los cálculos y elaborando los informes oportunos',
        ponderacion: 25,
        ce: [
          { id:'CE3.a', desc:'Se ha recogido información sobre productos y servicios a través de los diferentes canales disponibles', peso:10 },
          { id:'CE3.b', desc:'Se han efectuado las operaciones matemáticas necesarias para valorar cada producto (leyes simples y compuestas)', peso:20 },
          { id:'CE3.c', desc:'Se han calculado los gastos y comisiones devengados en cada producto', peso:15 },
          { id:'CE3.d', desc:'Se ha determinado el tratamiento fiscal de cada producto financiero', peso:10 },
          { id:'CE3.e', desc:'Se ha determinado el tipo de garantía exigido por cada producto', peso:10 },
          { id:'CE3.f', desc:'Se han realizado informes comparativos de costes financieros de productos de financiación', peso:15 },
          { id:'CE3.g', desc:'Se han comparado servicios y contraprestaciones de distintas entidades financieras', peso:10 },
          { id:'CE3.h', desc:'Se han comparado rentabilidades, ventajas e inconvenientes de formas de ahorro e inversión', peso:10 },
          { id:'CE3.i', desc:'Se han realizado los cálculos financieros utilizando aplicaciones informáticas específicas', peso:0 },
        ]
      }
    ]
  },
  ud3: {
    ra: [
      { id:'RA4', nombre:'RA4 — Caracteriza la tipología de seguros, analizando la actividad aseguradora',
        ponderacion: 10,
        ce: [
          { id:'CE4.a', desc:'Se ha identificado la legislación básica que regula la actividad aseguradora', peso:12 },
          { id:'CE4.b', desc:'Se han relacionado los riesgos y las condiciones de asegurabilidad', peso:12 },
          { id:'CE4.c', desc:'Se han identificado los elementos que conforman un contrato de seguro', peso:16 },
          { id:'CE4.d', desc:'Se han clasificado los tipos de seguros', peso:16 },
          { id:'CE4.e', desc:'Se han establecido las obligaciones de las partes en un contrato de seguro', peso:16 },
          { id:'CE4.f', desc:'Se han determinado los procedimientos de contratación y seguimiento de los seguros', peso:16 },
          { id:'CE4.g', desc:'Se han identificado las primas y sus componentes', peso:12 },
        ]
      }
    ]
  },
  ud4: {
    ra: [
      { id:'RA5', nombre:'RA5 — Selecciona inversiones en activos financieros o económicos, analizando sus características y realizando los cálculos oportunos',
        ponderacion: 30,
        ce: [
          { id:'CE5.a', desc:'Se ha reconocido la función de los activos financieros como forma de inversión y fuente de financiación', peso:10 },
          { id:'CE5.b', desc:'Se han clasificado los activos financieros por tipo de renta, entidad emisora y plazo', peso:10 },
          { id:'CE5.c', desc:'Se han distinguido el valor nominal, de emisión, de cotización y de reembolso para efectuar cálculos', peso:15 },
          { id:'CE5.d', desc:'Se ha determinado el importe en operaciones de compraventa de activos financieros con gastos y comisiones', peso:20 },
          { id:'CE5.e', desc:'Se han elaborado informes sobre alternativas de inversión en activos financieros para la empresa', peso:15 },
          { id:'CE5.f', desc:'Se han identificado las variables que influyen en una inversión económica', peso:15 },
          { id:'CE5.g', desc:'Se ha calculado e interpretado el VAN, TIR y otros métodos de selección de inversiones', peso:15 },
        ]
      }
    ]
  },
  ud5: {
    ra: [
      { id:'RA6', nombre:'RA6 — Integra los presupuestos parciales de las áreas funcionales y/o territoriales de la empresa, verificando la información que contienen',
        ponderacion: 20,
        ce: [
          { id:'CE6.a', desc:'Se han integrado los presupuestos de las distintas áreas en un presupuesto común', peso:15 },
          { id:'CE6.b', desc:'Se ha comprobado que la información está completa y en la forma requerida', peso:10 },
          { id:'CE6.c', desc:'Se ha contrastado el contenido de los presupuestos parciales', peso:15 },
          { id:'CE6.d', desc:'Se han verificado los cálculos aritméticos comprobando su corrección', peso:15 },
          { id:'CE6.e', desc:'Se ha valorado la importancia de elaborar en tiempo y forma la documentación presupuestaria', peso:10 },
          { id:'CE6.f', desc:'Se ha controlado la ejecución del presupuesto detectando desviaciones y sus causas', peso:20 },
          { id:'CE6.g', desc:'Se ha ordenado y archivado la información de forma que sea fácilmente localizable', peso:5 },
          { id:'CE6.h', desc:'Se han utilizado aplicaciones informáticas en la gestión de las tareas presupuestarias', peso:10 },
        ]
      }
    ]
  },
}; })();
function saveRACE(){ localStorage.setItem('gf_ra_ce', JSON.stringify(RA_CE_DATA)); }

// ── Actividades de aprendizaje (por Bloque) ───────────
var ACT_APRENDIZAJE = JSON.parse(localStorage.getItem('gf_act_aprend') || 'null') || {
  ud1: [
    { id:'aa1_1', tipo:'practica', titulo:'AA.1.1 · Boletín de Ejercicios', desc:'Ejercicios prácticos sobre fuentes de financiación y coste del capital' },
    { id:'aa1_2', tipo:'test',     titulo:'AA.1.2 · Test de Repaso',         desc:'Autoevaluación sobre las necesidades y fuentes de financiación empresarial' },
    { id:'aa1_3', tipo:'lectura',  titulo:'AA.1.3 · Mapa Conceptual',        desc:'Elaboración de mapa conceptual sobre la financiación empresarial' },
  ],
  ud2: [
    { id:'aa2_1', tipo:'practica', titulo:'AA.2-3.1 · Boletín de Ejercicios', desc:'Ejercicios de cálculo financiero: leyes simples, compuestas y rentas' },
    { id:'aa2_2', tipo:'test',     titulo:'AA.2-3.2 · Test de Repaso',         desc:'Test sobre el sistema financiero, productos de activo y pasivo' },
    { id:'aa2_3', tipo:'lectura',  titulo:'AA.2-3.3 · Mapa Conceptual',        desc:'Mapa conceptual de productos y servicios financieros' },
  ],
  ud3: [
    { id:'aa3_1', tipo:'practica', titulo:'AA.4.1 · Boletín de Ejercicios', desc:'Ejercicios sobre pólizas, primas y liquidación de siniestros' },
    { id:'aa3_2', tipo:'test',     titulo:'AA.4.2 · Test de Repaso',         desc:'Test sobre tipos de seguros y contrato de seguro' },
    { id:'aa3_3', tipo:'lectura',  titulo:'AA.4.3 · Mapa Conceptual',        desc:'Mapa conceptual de la actividad aseguradora' },
  ],
  ud4: [
    { id:'aa4_1', tipo:'practica', titulo:'AA.5.1 · Boletín de Ejercicios', desc:'Ejercicios de valoración de activos, VAN y TIR' },
    { id:'aa4_2', tipo:'test',     titulo:'AA.5.2 · Test de Repaso',         desc:'Test sobre activos financieros y mercados bursátiles' },
    { id:'aa4_3', tipo:'lectura',  titulo:'AA.5.3 · Mapa Conceptual',        desc:'Mapa conceptual de inversiones y mercados financieros' },
  ],
  ud5: [
    { id:'aa5_1', tipo:'practica', titulo:'AA.6.1 · Boletín de Ejercicios', desc:'Ejercicios de elaboración y análisis de presupuestos' },
    { id:'aa5_2', tipo:'test',     titulo:'AA.6.2 · Test de Repaso',         desc:'Test sobre tipos de presupuestos y control presupuestario' },
    { id:'aa5_3', tipo:'lectura',  titulo:'AA.6.3 · Mapa Conceptual',        desc:'Mapa conceptual de la planificación presupuestaria' },
  ],
};
function saveActAprend(){ localStorage.setItem('gf_act_aprend', JSON.stringify(ACT_APRENDIZAJE)); }

// ── Actividades evaluables (por Bloque) ───────────────
var ACT_EVAL = JSON.parse(localStorage.getItem('gf_act_eval') || 'null') || {
  ud1: [
    { id:'ae1_1', titulo:'AE.1.1 · Test Evaluable de la Unidad',           peso:15, fecha:'', ceVinculados:[{raId:'RA1',ceId:'CE1.a'},{raId:'RA1',ceId:'CE1.b'}] },
    { id:'ae1_2', titulo:'AE.1.2 · Caso Práctico: Ampliación de Capital',  peso:25, fecha:'', ceVinculados:[{raId:'RA1',ceId:'CE1.d'},{raId:'RA1',ceId:'CE1.e'}] },
    { id:'ae1_3', titulo:'AE.1.3 · Caso Práctico: Análisis Empresarial',   peso:25, fecha:'', ceVinculados:[{raId:'RA1',ceId:'CE1.c'},{raId:'RA1',ceId:'CE1.e'}] },
    { id:'ae1_4', titulo:'AE.1.4 · Examen de la Unidad',                   peso:35, fecha:'', ceVinculados:[{raId:'RA1',ceId:'CE1.a'},{raId:'RA1',ceId:'CE1.b'},{raId:'RA1',ceId:'CE1.c'},{raId:'RA1',ceId:'CE1.d'},{raId:'RA1',ceId:'CE1.e'}] },
  ],
  ud2: [
    { id:'ae2_1',  titulo:'AE.2-3.1 · Caso Práctico: El Sistema Financiero y los Intermediarios',     peso:8,  fecha:'', ceVinculados:[{raId:'RA2',ceId:'CE2.a'},{raId:'RA2',ceId:'CE2.b'}] },
    { id:'ae2_2',  titulo:'AE.2-3.2 · Examen: Sistema Financiero e Intermediarios',                   peso:8,  fecha:'', ceVinculados:[{raId:'RA2',ceId:'CE2.a'},{raId:'RA2',ceId:'CE2.b'},{raId:'RA2',ceId:'CE2.c'}] },
    { id:'ae2_3',  titulo:'AE.2-3.3 · Examen: Ley Simple y Compuesta',                                peso:10, fecha:'', ceVinculados:[{raId:'RA3',ceId:'CE3.b'},{raId:'RA3',ceId:'CE3.c'}] },
    { id:'ae2_4',  titulo:'AE.2-3.4 · Examen de Rentas',                                              peso:10, fecha:'', ceVinculados:[{raId:'RA3',ceId:'CE3.b'},{raId:'RA3',ceId:'CE3.c'}] },
    { id:'ae2_5',  titulo:'AE.2-3.5 · Liquidación de Cuenta Corriente',                               peso:8,  fecha:'', ceVinculados:[{raId:'RA3',ceId:'CE3.c'},{raId:'RA3',ceId:'CE3.i'}] },
    { id:'ae2_6',  titulo:'AE.2-3.6 · Informe: Búsqueda y Selección de Productos de Activo',          peso:12, fecha:'', ceVinculados:[{raId:'RA3',ceId:'CE3.e'},{raId:'RA3',ceId:'CE3.f'},{raId:'RA3',ceId:'CE3.g'}] },
    { id:'ae2_7',  titulo:'AE.2-3.7 · Liquidación de Cuenta de Crédito',                              peso:8,  fecha:'', ceVinculados:[{raId:'RA3',ceId:'CE3.c'},{raId:'RA3',ceId:'CE3.d'}] },
    { id:'ae2_8',  titulo:'AE.2-3.8 · Práctica: Préstamos, Hipotecas y Leasing',                      peso:12, fecha:'', ceVinculados:[{raId:'RA3',ceId:'CE3.b'},{raId:'RA3',ceId:'CE3.c'},{raId:'RA3',ceId:'CE3.e'}] },
    { id:'ae2_9',  titulo:'AE.2-3.9 · Informe: Búsqueda y Selección de Productos de Pasivo',          peso:12, fecha:'', ceVinculados:[{raId:'RA3',ceId:'CE3.f'},{raId:'RA3',ceId:'CE3.g'},{raId:'RA3',ceId:'CE3.h'}] },
    { id:'ae2_10', titulo:'AE.2-3.10 · Examen: Productos de Activo y Pasivo',                         peso:12, fecha:'', ceVinculados:[{raId:'RA2',ceId:'CE2.c'},{raId:'RA3',ceId:'CE3.b'},{raId:'RA3',ceId:'CE3.c'}] },
  ],
  ud3: [
    { id:'ae3_1', titulo:'AE.4.1 · Caso Práctico: Tipologías de Seguro', peso:25, fecha:'', ceVinculados:[{raId:'RA4',ceId:'CE4.c'},{raId:'RA4',ceId:'CE4.d'}] },
    { id:'ae3_2', titulo:'AE.4.2 · Caso Práctico: Pólizas de Seguro',    peso:35, fecha:'', ceVinculados:[{raId:'RA4',ceId:'CE4.e'},{raId:'RA4',ceId:'CE4.f'},{raId:'RA4',ceId:'CE4.g'}] },
    { id:'ae3_3', titulo:'AE.4.3 · Examen',                               peso:40, fecha:'', ceVinculados:[{raId:'RA4',ceId:'CE4.a'},{raId:'RA4',ceId:'CE4.b'},{raId:'RA4',ceId:'CE4.c'},{raId:'RA4',ceId:'CE4.d'}] },
  ],
  ud4: [
    { id:'ae4_1', titulo:'AE.5.1 · Caso Práctico: Compraventa de Activos para Empresa',  peso:20, fecha:'', ceVinculados:[{raId:'RA5',ceId:'CE5.c'},{raId:'RA5',ceId:'CE5.d'}] },
    { id:'ae4_2', titulo:'AE.5.2 · Informe: Activos Financieros para Uso Personal',       peso:20, fecha:'', ceVinculados:[{raId:'RA5',ceId:'CE5.a'},{raId:'RA5',ceId:'CE5.b'},{raId:'RA5',ceId:'CE5.e'}] },
    { id:'ae4_3', titulo:'AE.5.3 · Informe: Valoración y Selección de Inversiones',       peso:30, fecha:'', ceVinculados:[{raId:'RA5',ceId:'CE5.f'},{raId:'RA5',ceId:'CE5.g'}] },
    { id:'ae4_4', titulo:'AE.5.4 · Examen',                                               peso:30, fecha:'', ceVinculados:[{raId:'RA5',ceId:'CE5.a'},{raId:'RA5',ceId:'CE5.b'},{raId:'RA5',ceId:'CE5.c'},{raId:'RA5',ceId:'CE5.g'}] },
  ],
  ud5: [
    { id:'ae5_1', titulo:'AE.6.1 · Elaboración de Presupuesto de Tesorería', peso:30, fecha:'', ceVinculados:[{raId:'RA6',ceId:'CE6.a'},{raId:'RA6',ceId:'CE6.b'},{raId:'RA6',ceId:'CE6.d'}] },
    { id:'ae5_2', titulo:'AE.6.2 · Análisis de Presupuestos Erróneos',        peso:30, fecha:'', ceVinculados:[{raId:'RA6',ceId:'CE6.c'},{raId:'RA6',ceId:'CE6.f'}] },
    { id:'ae5_3', titulo:'AE.6.3 · Examen',                                   peso:40, fecha:'', ceVinculados:[{raId:'RA6',ceId:'CE6.a'},{raId:'RA6',ceId:'CE6.e'},{raId:'RA6',ceId:'CE6.f'}] },
  ],
};
function saveActEval(){ localStorage.setItem('gf_act_eval', JSON.stringify(ACT_EVAL)); }

// ── Glosario por unidad ───────────────────────────────
var GLOSARIO_DATA = JSON.parse(localStorage.getItem('gf_glosario') || 'null') || {
  ud1: [
    { id:'g1', termino:'Fuente de financiación', definicion:'Origen de los recursos financieros que utiliza la empresa para financiar sus inversiones y actividad.', editable:false },
    { id:'g2', termino:'Financiación propia', definicion:'', editable:true },
    { id:'g3', termino:'Financiación ajena', definicion:'', editable:true },
    { id:'g4', termino:'Coste del capital', definicion:'', editable:true },
    { id:'g5', termino:'Ampliación de capital', definicion:'Operación por la que una sociedad aumenta su capital social mediante la emisión de nuevas acciones.', editable:false },
  ],
  ud2: [
    { id:'h1', termino:'Sistema financiero', definicion:'Conjunto de instituciones, mercados e instrumentos financieros que canalizan el ahorro hacia la inversión.', editable:false },
    { id:'h2', termino:'Capitalización simple', definicion:'', editable:true },
    { id:'h3', termino:'Capitalización compuesta', definicion:'', editable:true },
    { id:'h4', termino:'Renta financiera', definicion:'Sucesión de capitales financieros que se perciben o entregan en distintos momentos del tiempo.', editable:false },
    { id:'h5', termino:'TAE', definicion:'', editable:true },
    { id:'h6', termino:'Leasing', definicion:'', editable:true },
  ],
  ud3: [
    { id:'i1', termino:'Póliza de seguro', definicion:'Documento que recoge las condiciones del contrato de seguro suscrito entre el asegurador y el tomador.', editable:false },
    { id:'i2', termino:'Prima', definicion:'', editable:true },
    { id:'i3', termino:'Riesgo asegurable', definicion:'', editable:true },
    { id:'i4', termino:'Siniestro', definicion:'Realización del riesgo cubierto por el seguro.', editable:false },
  ],
  ud4: [
    { id:'j1', termino:'Activo financiero', definicion:'Título o contrato que da derecho a recibir capitales futuros a cambio de una contraprestación presente.', editable:false },
    { id:'j2', termino:'VAN', definicion:'', editable:true },
    { id:'j3', termino:'TIR', definicion:'', editable:true },
    { id:'j4', termino:'Cotización bursátil', definicion:'', editable:true },
    { id:'j5', termino:'Renta fija', definicion:'Activo financiero que proporciona al inversor un rendimiento conocido de antemano.', editable:false },
    { id:'j6', termino:'Renta variable', definicion:'', editable:true },
  ],
  ud5: [
    { id:'k1', termino:'Presupuesto', definicion:'Previsión cuantificada de ingresos y gastos para un período futuro determinado.', editable:false },
    { id:'k2', termino:'Presupuesto de tesorería', definicion:'', editable:true },
    { id:'k3', termino:'Desviación presupuestaria', definicion:'', editable:true },
    { id:'k4', termino:'Control presupuestario', definicion:'Proceso de comparación entre los datos reales y los presupuestados para detectar desviaciones.', editable:false },
  ],
};
function saveGlosario(){ localStorage.setItem('gf_glosario', JSON.stringify(GLOSARIO_DATA)); }

var CONT_KEY = 'gf_cont_data';
var CONT_DATA = (function(){ try{ return JSON.parse(localStorage.getItem(CONT_KEY)||'{}'); }catch(e){ return {}; } })();
function saveCont(){ localStorage.setItem(CONT_KEY, JSON.stringify(CONT_DATA)); }

var CONT_MEDIA_KEY = 'gf_cont_media';
function getContMedia(){ try{ return JSON.parse(localStorage.getItem(CONT_MEDIA_KEY)||'{}'); }catch(e){ return {}; } }
function saveContMedia(id,b64){ try{ var m=getContMedia(); m[id]=b64; localStorage.setItem(CONT_MEDIA_KEY,JSON.stringify(m)); }catch(e){ flash('Archivo demasiado grande','#dc2626'); } }
function delContMedia(id){ try{ var m=getContMedia(); delete m[id]; localStorage.setItem(CONT_MEDIA_KEY,JSON.stringify(m)); }catch(e){} }

var BLOQUE_INFO = {
  texto:     { ico:'📝', label:'Texto / Explicación',   color:'var(--blue-bg)',   ctxt:'var(--blue)' },
  concepto:  { ico:'💡', label:'Concepto clave',         color:'var(--amber-bg)', ctxt:'var(--amber)' },
  imagen:    { ico:'🖼️', label:'Imagen',                 color:'var(--green-bg)', ctxt:'var(--green)' },
  video:     { ico:'🎬', label:'Vídeo (archivo)',         color:'#fdf2f8',         ctxt:'#9d174d' },
  youtube:   { ico:'▶️', label:'Vídeo YouTube/Vimeo',    color:'#fff1f2',         ctxt:'#be123c' },
  actividad: { ico:'✏️', label:'Actividad / Ejercicio',  color:'var(--surface2)', ctxt:'var(--muted)' },
};

var DB = {
  alumnos: JSON.parse(localStorage.getItem('gf_alumnos')||'[]'),
  eventos:  JSON.parse(localStorage.getItem('gf_eventos')||'[]'),
  ejercicios: JSON.parse(localStorage.getItem('gf_ejercicios')||'[]'),
  materiales: JSON.parse(localStorage.getItem('gf_materiales')||'[]'),
  notas: JSON.parse(localStorage.getItem('gf_notas')||'{}'),
};
function save(){ localStorage.setItem('gf_alumnos',JSON.stringify(DB.alumnos)); localStorage.setItem('gf_eventos',JSON.stringify(DB.eventos)); localStorage.setItem('gf_ejercicios',JSON.stringify(DB.ejercicios)); localStorage.setItem('gf_materiales',JSON.stringify(DB.materiales)); localStorage.setItem('gf_notas',JSON.stringify(DB.notas)); }
function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2); }

function flash(msg,color){ var el=document.getElementById('flash-msg'); el.textContent=msg; el.style.background=color||'var(--navy)'; el.classList.add('show'); setTimeout(function(){el.classList.remove('show');},3000); }

// ── NAVEGACIÓN ─────────────────────────────────────────
function goTo(id, btn){
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
  document.querySelectorAll('.nav-item,.nav-subitem,.nav-sub2').forEach(function(b){b.classList.remove('active');});
  var pg = document.getElementById('page-'+id);
  if(pg) pg.classList.add('active');
  if(btn) btn.classList.add('active');
  var renders = {
    dashboard:renderDashboard, calendario:renderCalendario,
    alumnos:renderAlumnos, evaluacion:renderEvaluacion, materiales:renderMateriales,
    banco:function(){setTimeout(initBanco,20);},
    test:function(){setTimeout(initTest,20);},
    bolsa:function(){setTimeout(initBolsa,20);}, 'conceptos-bolsa':function(){setTimeout(initConceptosBolsa,20);},
    kiosco:function(){setTimeout(initKiosco,20);},
    'sim-prestamos':   function(){loadSim('sim-prestamos');},
    'sim-pb':          function(){loadSim('sim-pb');},
    'sim-presupuestos':function(){loadSim('sim-presupuestos');},
    'sim-inversiones': function(){loadSim('sim-inversiones');},
    'sim-aef':         function(){loadSim('sim-aef');},
    'sim-seguros':     function(){loadSim('sim-seguros');},
    'actividades':     function(){renderActividades();},
    'mis-actividades': function(){renderMisActividades();},
    'perfil':          function(){if(window.renderPerfil)renderPerfil();}
  };
  UNIDADES.forEach(function(u){ renders[u.id]=function(){renderUD(u);}; });
  if(renders[id]) renders[id]();
}
function toggleGroup(id){
  var btn=document.getElementById('grp-'+id), sub=document.getElementById('sub-'+id);
  if(!btn||!sub)return;
  btn.classList.toggle('open'); sub.classList.toggle('open');
}
function showBolsaTab(tab){
  // If bolsa already init, just switch tab
  if(document.getElementById('bs-'+tab)) switchBTab(tab);
  else { setTimeout(function(){ switchBTab(tab); }, 80); }
}
function abrirIndicesBME(){
  window.open('https://www.bolsasymercados.es/es/bme-exchange/indices/resumen.html','_blank','noopener');
}

// ── ROL ────────────────────────────────────────────────
// ── getRol(): fuente de verdad del rol actual ─────────────────
function getRol(){
  if(typeof USUARIO_ACTUAL !== 'undefined' && USUARIO_ACTUAL && USUARIO_ACTUAL.rol)
    return USUARIO_ACTUAL.rol === 'docente' ? 'profesor' : 'alumno';
  return 'alumno';
}

// ── _aplicarRolVerificado(): llamada solo por actualizarUIConPerfil ──
function _aplicarRolVerificado(rolSupabase){
  var esDocente = (rolSupabase === 'docente');
  ROL = esDocente ? 'profesor' : 'alumno';
  var rbProf=document.getElementById('rb-prof'), rbAlu=document.getElementById('rb-alu');
  if(rbProf) rbProf.classList.toggle('active', esDocente);
  if(rbAlu)  rbAlu.classList.toggle('active', !esDocente);
  if(typeof USUARIO_ACTUAL !== 'undefined' && USUARIO_ACTUAL){
    var uName=document.getElementById('u-name'), uRole=document.getElementById('u-role'), uAvatar=document.getElementById('u-avatar');
    if(uName)   uName.textContent = USUARIO_ACTUAL.nombre || USUARIO_ACTUAL.email.split('@')[0];
    if(uRole)   uRole.textContent = esDocente ? 'Docente · Gestión Financiera' : 'Alumno · Gestión Financiera';
    if(uAvatar && USUARIO_ACTUAL.avatar_url && !uAvatar.querySelector('img'))
      uAvatar.innerHTML = '<img src="'+USUARIO_ACTUAL.avatar_url+'" style="width:100%;height:100%;border-radius:50%;object-fit:cover">';
  }
  ['sec-prof','nav-nuevo-bloque','nav-banco','nav-alumnos','nav-eval','nav-actividades','nav-materiales','btn-add-evento'].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.style.display = esDocente ? (el.tagName==='BUTTON'?'flex':'block') : 'none';
  });
  if(!esDocente){
    var rb=document.querySelector('.rol-btns');
    if(rb) rb.style.display='none';
    if(rbProf) rbProf.style.display='none';
    if(rbAlu)  rbAlu.style.display='none';
  }
  renderDashboard();
}

// ── setRol(): solo el docente puede usarla (previsualizar vista alumno) ──
function setRol(rolSolicitado){
  var rolReal = (typeof USUARIO_ACTUAL !== 'undefined' && USUARIO_ACTUAL) ? USUARIO_ACTUAL.rol : null;
  if(rolReal !== 'docente'){
    console.warn('[GF-Seguridad] setRol() denegado: solo el docente puede cambiar la vista.');
    return; // alumno no puede escalar rol desde consola ni desde UI
  }
  ROL = rolSolicitado;
  var rbProf=document.getElementById('rb-prof'), rbAlu=document.getElementById('rb-alu');
  if(rbProf) rbProf.classList.toggle('active', rolSolicitado==='profesor');
  if(rbAlu)  rbAlu.classList.toggle('active', rolSolicitado==='alumno');
  renderDashboard();
}

// ── MODAL ──────────────────────────────────────────────
function abrirModal(titulo, cuerpo, pie){ document.getElementById('modal-titulo').textContent=titulo; document.getElementById('modal-cuerpo').innerHTML=cuerpo; document.getElementById('modal-pie').innerHTML=pie; document.getElementById('modal').classList.add('open'); }
function cerrarModal(){ document.getElementById('modal').classList.remove('open'); }

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

// ── NOTIFICACIONES ────────────────────────────────────────
var _notifInterval = null;

async function checkNotificaciones(){
  if(!USUARIO_ACTUAL || USUARIO_ACTUAL.rol !== 'alumno') return;
  try{
    // Actividades pendientes (activas y no entregadas)
    var [{data:acts},{data:entregas}] = await Promise.all([
      supa.from('actividades').select('id,titulo,fecha_limite,created_at').eq('activa',true),
      supa.from('entregas').select('actividad_id,entregada_at').eq('alumno_id',USUARIO_ACTUAL.id)
    ]);
    acts = acts||[]; entregas = entregas||[];
    var entregaSet = new Set((entregas).filter(function(e){return e.entregada_at;}).map(function(e){return e.actividad_id;}));
    var pendientes = acts.filter(function(a){
      if(entregaSet.has(a.id)) return false;
      if(a.fecha_limite && new Date(a.fecha_limite) < new Date()) return false;
      return true;
    });

    // Eventos próximos (7 días)
    var en7 = new Date(); en7.setDate(en7.getDate()+7);
    var eventosProximos = DB.eventos.filter(function(e){
      var f = new Date(e.fecha); return f >= new Date() && f <= en7;
    });

    // Badge en "Mis actividades"
    var badge = document.getElementById('badge-mis-act');
    if(badge){
      if(pendientes.length > 0){
        badge.textContent = pendientes.length;
        badge.style.display = 'inline-flex';
      } else {
        badge.style.display = 'none';
      }
    }

    // Badge en calendario si hay eventos próximos
    var navCal = document.getElementById('ni-calendario');
    var badgeCal = document.getElementById('badge-cal');
    if(navCal && !badgeCal && eventosProximos.length > 0){
      var b = document.createElement('span');
      b.className = 'nav-badge';
      b.id = 'badge-cal';
      b.textContent = eventosProximos.length;
      navCal.appendChild(b);
    } else if(badgeCal){
      if(eventosProximos.length > 0){
        badgeCal.textContent = eventosProximos.length;
        badgeCal.style.display = 'inline-flex';
      } else {
        badgeCal.style.display = 'none';
      }
    }

    // Notificación emergente si hay actividad nueva (created_at < 24h y no vista)
    var vistas = JSON.parse(localStorage.getItem('gf_notif_vistas')||'[]');
    var nuevas = pendientes.filter(function(a){
      if(vistas.indexOf(a.id) >= 0) return false;
      var creada = new Date(a.created_at);
      var hace24h = new Date(); hace24h.setDate(hace24h.getDate()-1);
      return creada > hace24h;
    });
    if(nuevas.length > 0){
      nuevas.forEach(function(a){
        if(vistas.indexOf(a.id) < 0) vistas.push(a.id);
      });
      localStorage.setItem('gf_notif_vistas', JSON.stringify(vistas));
      mostrarNotifActividad(nuevas[0].titulo, nuevas.length);
    }

  } catch(err){ console.error('[Notif]', err); }
}

function mostrarNotifActividad(titulo, total){
  var n = document.createElement('div');
  n.style.cssText = 'position:fixed;top:20px;right:20px;background:#fff;border:1px solid var(--border);border-left:4px solid var(--gold);border-radius:12px;padding:14px 16px;max-width:300px;box-shadow:0 8px 24px rgba(0,0,0,.15);z-index:9000;font-family:inherit;cursor:pointer;animation:slideInRight .3s ease';
  n.innerHTML = '<div style="font-size:11px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">📬 Nueva actividad</div>'+
    '<div style="font-size:13px;font-weight:600;color:var(--navy);margin-bottom:2px">'+titulo+'</div>'+
    (total>1?'<div style="font-size:12px;color:var(--muted)">+'+( total-1)+' más pendiente'+(total>2?'s':'')+'</div>':'')+
    '<div style="font-size:11px;color:var(--muted);margin-top:6px">Pulsa para verla →</div>';
  n.onclick = function(){ goTo('mis-actividades', document.getElementById('nav-mis-actividades')); n.remove(); };
  if(!document.getElementById('notif-act-style')){
    var s = document.createElement('style');
    s.id = 'notif-act-style';
    s.textContent = '@keyframes slideInRight{from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1}}';
    document.head.appendChild(s);
  }
  document.body.appendChild(n);
  setTimeout(function(){ if(n.parentNode) n.remove(); }, 6000);
}

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
  gfConfirm('¿Eliminar este evento?','Eliminar',function(){
    DB.eventos=DB.eventos.filter(function(e){ return e.id!==id; });
    save(); renderCalendario(); renderDashboard();
  });
}



// ── EJERCICIOS ─────────────────────────────────────────

// ── EVALUACIÓN ─────────────────────────────────────────
// ══════════════════════════════════════════════════════
//  SECCIÓN EVALUACIÓN — RA/CE + Import/Export Excel
// ══════════════════════════════════════════════════════

// Almacenamiento de ponderaciones editadas (separado de RA_CE_DATA)
var POND_KEY = 'gf_ponderaciones';
var POND = JSON.parse(localStorage.getItem(POND_KEY) || 'null') || null;
// Si no hay ponderaciones guardadas las generamos desde RA_CE_DATA
function initPond(){
  if(!POND) POND = {};
  // Añadir entradas que falten (ej: RA6 si el localStorage es antiguo)
  UNIDADES.forEach(function(u){
    var raList = (RA_CE_DATA[u.id]||{ra:[]}).ra;
    raList.forEach(function(ra){
      if(!POND[ra.id]){
        POND[ra.id] = { pct: ra.ponderacion || 0, ce:{} };
        (ra.ce||[]).forEach(function(ce){
          POND[ra.id].ce[ce.id] = ce.peso || 0;
        });
      }
    });
  });
  savePond();
}
function savePond(){ localStorage.setItem(POND_KEY, JSON.stringify(POND)); }

// Recoge todos los RA/CE en lista plana
function getAllRA(){
  var out = [];
  var seen = {}; // evitar duplicados por ID de RA
  UNIDADES.forEach(function(u){
    (RA_CE_DATA[u.id]||{ra:[]}).ra.forEach(function(ra){
      if(!seen[ra.id]){
        seen[ra.id] = true;
        out.push({ ud: u, ra: ra });
      }
    });
  });
  return out;
}

// Devuelve los RA que evalúan una UD concreta (propios + vinculados)
function getRADeUD(udId){
  var propios = (RA_CE_DATA[udId]||{ra:[]}).ra;
  var ud = UNIDADES.find(function(u){ return u.id===udId; });
  var vinculados = (ud && ud.raVinculados) ? ud.raVinculados : [];
  var out = propios.slice(); // copia de los propios
  var seen = {};
  propios.forEach(function(r){ seen[r.id]=true; });
  // Añadir los vinculados (buscándolos en su bloque de origen)
  vinculados.forEach(function(raId){
    if(seen[raId]) return;
    var allRA = [];
    UNIDADES.forEach(function(u){
      (RA_CE_DATA[u.id]||{ra:[]}).ra.forEach(function(ra){
        allRA.push(ra);
      });
    });
    var raObj = allRA.find(function(r){ return r.id===raId; });
    if(raObj){ out.push(raObj); seen[raId]=true; }
  });
  return out;
}

// ── Render principal de Evaluación ───────────────────
function renderEvaluacion(){
  var cont = document.getElementById('eval-cont');
  if(!cont) return;

  if(ROL !== 'profesor'){
    // Vista alumno — solo sus notas
    renderEvaluacionAlumno(cont);
    return;
  }

  initPond();
  cont.innerHTML = '';
  var wrap = document.createElement('div');

  // ── Pestañas ──
  var tabs = ['ra-ce','calificaciones'];
  var tabLabels = {'ra-ce':'📐 RA / CE y Ponderaciones', 'calificaciones':'📊 Libro de Calificaciones'};
  var tabBar = document.createElement('div');
  tabBar.className = 'bolsa-tabs';
  tabBar.style.marginBottom = '20px';
  tabs.forEach(function(t){
    var btn = document.createElement('button');
    btn.className = 'bolsa-tab' + (t==='ra-ce'?' active':'');
    btn.id = 'eval-tab-'+t;
    btn.textContent = tabLabels[t];
    btn.onclick = function(){
      document.querySelectorAll('.bolsa-tab[id^="eval-tab"]').forEach(function(b){ b.classList.remove('active'); });
      document.querySelectorAll('.eval-sec').forEach(function(s){ s.style.display='none'; });
      btn.classList.add('active');
      document.getElementById('eval-sec-'+t).style.display = 'block';
    };
    tabBar.appendChild(btn);
  });
  wrap.appendChild(tabBar);

  // ── SECCIÓN RA/CE ──
  var secRA = document.createElement('div');
  secRA.id = 'eval-sec-ra-ce';
  secRA.className = 'eval-sec';
  renderSeccionRACE(secRA);
  wrap.appendChild(secRA);

  // ── SECCIÓN CALIFICACIONES ──
  var secCal = document.createElement('div');
  secCal.id = 'eval-sec-calificaciones';
  secCal.className = 'eval-sec';
  secCal.style.display = 'none';
  renderSeccionCalificaciones(secCal);
  wrap.appendChild(secCal);

  cont.appendChild(wrap);
}

// ── Sección RA/CE ─────────────────────────────────────
function renderSeccionRACE(sec){
  sec.innerHTML = '';
  initPond();

  // Cabecera con botones import/export
  var hdr = document.createElement('div');
  hdr.style.cssText = 'display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:16px';
  hdr.innerHTML =
    '<div><div style="font-size:15px;font-weight:600">Resultados de Aprendizaje y Criterios de Evaluación</div>'+
    '<div style="font-size:12px;color:var(--muted);margin-top:2px">Configura los porcentajes. La suma de RA debe ser 100% del módulo. Cada CE debe sumar 100% dentro de su RA.</div></div>';
  var btnGroup = document.createElement('div');
  btnGroup.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap';

  // Botón importar — usa el input permanente del body
  var btnImport = document.createElement('button');
  btnImport.className = 'btn btn-g';
  btnImport.innerHTML = '⬆ Importar Excel';
  btnImport.onclick = function(){
    var inp = document.getElementById('excel-import-input');
    // Resetear para que dispare onchange aunque sea el mismo fichero
    inp.value = '';
    // Guardar referencia al sec actual en el input
    inp._sec = sec;
    inp.onchange = function(e){
      if(e.target.files && e.target.files[0]){
        importarRACEExcel(e.target.files[0], inp._sec);
      }
    };
    inp.click();
  };

  // Botón exportar Excel
  var btnExport = document.createElement('button');
  btnExport.className = 'btn btn-g';
  btnExport.innerHTML = '⬇ Exportar Excel';
  btnExport.onclick = exportarRACEExcel;

  // Botón descargar plantilla
  var btnPlantilla = document.createElement('button');
  btnPlantilla.className = 'btn btn-g';
  btnPlantilla.innerHTML = '📋 Descargar plantilla';
  btnPlantilla.onclick = descargarPlantillaExcel;

  btnGroup.appendChild(btnImport);
  btnGroup.appendChild(btnExport);
  btnGroup.appendChild(btnPlantilla);
  hdr.appendChild(btnGroup);
  sec.appendChild(hdr);

  // Validación global
  var allRA = getAllRA();
  var totalPctRA = allRA.reduce(function(s,item){
    return s + (parseFloat((POND[item.ra.id]||{pct:0}).pct)||0);
  }, 0);
  var validRA = Math.abs(totalPctRA - 100) < 0.01;

  var validBar = document.createElement('div');
  validBar.style.cssText = 'display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:var(--r);margin-bottom:16px;' +
    'background:'+(validRA?'var(--green-bg)':'var(--amber-bg)')+';color:'+(validRA?'var(--green)':'var(--amber)');
  validBar.innerHTML =
    '<span style="font-size:1.2rem">'+(validRA?'✅':'⚠️')+'</span>'+
    '<div style="flex:1;font-size:13px;font-weight:500">'+
      'Suma total de RA: <strong>'+totalPctRA.toFixed(1)+'%</strong> '+
      (validRA ? '— Correcto, suma 100%' : '— Debe sumar exactamente 100%')+
    '</div>'+
    '<button class="btn btn-p btn-sm" onclick="ponderacionAutomaticaRA()" style="font-size:12px">⚡ Ponderación automática</button>';
  sec.appendChild(validBar);

  // Tabla de RA y CE
  allRA.forEach(function(item){
    sec.appendChild(renderRACard(item.ud, item.ra, sec));
  });

  // ── Botón añadir nuevo RA ──────────────────────────
  var addSection = document.createElement('div');
  addSection.style.cssText = 'margin-top:16px;padding:16px;background:var(--surface2);border:2px dashed var(--border-md);border-radius:var(--rl);text-align:center';
  addSection.innerHTML =
    '<div style="font-size:13px;color:var(--muted);margin-bottom:10px">¿Necesitas añadir un nuevo Resultado de Aprendizaje con sus Criterios de Evaluación?</div>';
  var btnNuevoRA = document.createElement('button');
  btnNuevoRA.className = 'btn btn-p';
  btnNuevoRA.innerHTML = '+ Nuevo RA y CE';
  btnNuevoRA.onclick = function(){ abrirModalNuevoRA(sec); };
  addSection.appendChild(btnNuevoRA);
  sec.appendChild(addSection);
}

// ── Modal Nuevo RA/CE ──────────────────────────────────
function abrirModalNuevoRA(sec){
  // Seleccionar a qué bloque asignar el nuevo RA
  var udOpts = UNIDADES.map(function(u){
    return '<option value="'+u.id+'">B'+u.n+' — '+u.titulo+'</option>';
  }).join('');

  abrirModal('➕ Nuevo Resultado de Aprendizaje',
    '<div class="fg"><label class="fl">Bloque al que pertenece</label>'+
    '<select class="fs" id="nra-bloque">'+udOpts+'</select></div>'+
    '<div class="fg"><label class="fl">ID del RA <span style="color:var(--red)">*</span></label>'+
    '<input class="fi" id="nra-id" placeholder="Ej: RA7" maxlength="10"></div>'+
    '<div class="fg"><label class="fl">Nombre / descripción del RA <span style="color:var(--red)">*</span></label>'+
    '<input class="fi" id="nra-nombre" placeholder="Ej: RA7 — Realiza..."></div>'+
    '<div class="fg"><label class="fl">Ponderación en el módulo (%)</label>'+
    '<input class="fi" id="nra-pct" type="number" min="0" max="100" value="10"></div>'+
    '<hr style="border:none;border-top:1px solid var(--border);margin:14px 0">'+
    '<div style="font-size:13px;font-weight:600;margin-bottom:10px">Criterios de Evaluación</div>'+
    '<div id="nra-ce-lista"></div>'+
    '<button class="btn btn-g btn-sm" style="width:100%;margin-top:8px" onclick="addCERow()">+ Añadir CE</button>',
    '<button class="btn btn-g" onclick="cerrarModal()">Cancelar</button>'+
    '<button class="btn btn-p" onclick="guardarNuevoRA()">Guardar RA</button>'
  );
  // Añadir primer CE por defecto
  setTimeout(addCERow, 50);
  // Guardar referencia al sec para re-renderizar
  window._raSec = sec;
}

function addCERow(){
  var lista = document.getElementById('nra-ce-lista');
  if(!lista) return;
  var idx = lista.children.length + 1;
  var raId = (document.getElementById('nra-id')||{value:'RA?'}).value.trim() || 'RA?';
  var row = document.createElement('div');
  row.style.cssText = 'display:grid;grid-template-columns:100px 1fr 80px 30px;gap:7px;margin-bottom:7px;align-items:center';
  row.innerHTML =
    '<input class="fi nra-ce-id" placeholder="CE'+idx+'" value="'+raId+'.'+String.fromCharCode(96+idx)+'" style="font-family:IBM Plex Mono,monospace;font-size:12px">'+
    '<input class="fi nra-ce-desc" placeholder="Descripción del criterio...">'+
    '<input class="fi nra-ce-peso" type="number" min="0" max="100" value="'+(Math.round(100/Math.max(idx,1)))+'" placeholder="%">'+
    '<button onclick="this.parentElement.remove()" style="background:var(--red-bg);color:var(--red);border:none;border-radius:6px;padding:5px 8px;cursor:pointer;font-size:13px">✕</button>';
  lista.appendChild(row);
}

function guardarNuevoRA(){
  var udId = (document.getElementById('nra-bloque')||{value:'ud1'}).value;
  var raId = (document.getElementById('nra-id')||{value:''}).value.trim();
  var nombre = (document.getElementById('nra-nombre')||{value:''}).value.trim();
  var pct = parseFloat((document.getElementById('nra-pct')||{value:'10'}).value)||10;

  if(!raId){ flash('Introduce un ID para el RA','#dc2626'); return; }
  if(!nombre){ flash('Introduce un nombre para el RA','#dc2626'); return; }

  // Recoger CE
  var ceRows = document.querySelectorAll('#nra-ce-lista > div');
  var ceList = [];
  ceRows.forEach(function(row){
    var ceId = row.querySelector('.nra-ce-id').value.trim();
    var ceDesc = row.querySelector('.nra-ce-desc').value.trim();
    var cePeso = parseFloat(row.querySelector('.nra-ce-peso').value)||0;
    if(ceId && ceDesc) ceList.push({ id:ceId, desc:ceDesc, peso:cePeso });
  });
  if(!ceList.length){ flash('Añade al menos un Criterio de Evaluación','#dc2626'); return; }

  // Guardar en RA_CE_DATA
  if(!RA_CE_DATA[udId]) RA_CE_DATA[udId] = { ra: [] };
  RA_CE_DATA[udId].ra.push({ id:raId, nombre:nombre, ponderacion:pct, ce:ceList });
  saveRACE();

  // Guardar ponderación
  initPond();
  POND[raId] = { pct:pct, ce:{} };
  ceList.forEach(function(ce){ POND[raId].ce[ce.id] = ce.peso; });
  savePond();

  cerrarModal();
  flash('RA '+raId+' creado con '+ceList.length+' CE','#16a34a');

  // Re-renderizar sección
  if(window._raSec) renderSeccionRACE(window._raSec);
}

function renderRACard(u, ra, parentSec){
  initPond();
  var pond = POND[ra.id] || { pct: ra.ponderacion || 0, ce: {} };
  var ceList = ra.ce || [];

  // Suma CE
  var totalCE = ceList.reduce(function(s,ce){
    return s + (parseFloat((pond.ce||{})[ce.id])||0);
  }, 0);
  var validCE = ceList.length === 0 || Math.abs(totalCE - 100) < 0.01;

  var card = document.createElement('div');
  card.className = 'card';
  card.style.marginBottom = '12px';

  // Cabecera RA
  var raHdr = document.createElement('div');
  raHdr.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--navy);border-radius:var(--r);margin-bottom:10px';

  var raInfo = document.createElement('div');
  raInfo.style.cssText = 'flex:1;color:#fff;font-size:13px;font-weight:600';
  raInfo.textContent = ra.nombre + ' — UD' + u.n;

  var udBadge = document.createElement('span');
  udBadge.style.cssText = 'font-size:11px;background:rgba(255,255,255,.15);color:#fff;padding:2px 8px;border-radius:20px;flex-shrink:0';
  udBadge.textContent = u.titulo;

  // Input % del módulo
  var pctWrap = document.createElement('div');
  pctWrap.style.cssText = 'display:flex;align-items:center;gap:6px;flex-shrink:0';
  var pctLabel = document.createElement('span');
  pctLabel.style.cssText = 'font-size:11px;color:rgba(255,255,255,.6)';
  pctLabel.textContent = '% módulo:';
  var pctInput = document.createElement('input');
  pctInput.type = 'number';
  pctInput.min = '0'; pctInput.max = '100'; pctInput.step = '0.1';
  pctInput.value = pond.pct;
  pctInput.style.cssText = 'width:65px;padding:4px 7px;border-radius:6px;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.1);color:#fff;font-family:"DM Sans",sans-serif;font-size:13px;font-weight:700;text-align:center;outline:none';
  pctInput.oninput = function(){
    if(!POND[ra.id]) POND[ra.id]={pct:0,ce:{}};
    POND[ra.id].pct = parseFloat(this.value)||0;
    savePond();
    renderSeccionRACE(parentSec);
  };
  pctWrap.appendChild(pctLabel);
  pctWrap.appendChild(pctInput);

  // Botón editar nombre RA
  var btnEditRA = document.createElement('button');
  btnEditRA.style.cssText = 'background:rgba(255,255,255,.15);border:none;color:#fff;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:11px;flex-shrink:0';
  btnEditRA.textContent = '✎ Editar';
  btnEditRA.onclick = (function(udId, raId){ return function(){ abrirModalEditarRA(udId, raId, parentSec); }; })(u.id, ra.id);

  // Botón borrar RA
  var btnDelRA = document.createElement('button');
  btnDelRA.style.cssText = 'background:rgba(220,38,38,.4);border:none;color:#fff;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:11px;flex-shrink:0';
  btnDelRA.textContent = '✕ Borrar';
  btnDelRA.onclick = (function(udId, raId){ return function(){
    if(!confirm('¿Eliminar el RA '+raId+' y todos sus CE? Esta acción no se puede deshacer.')) return;
    RA_CE_DATA[udId].ra = RA_CE_DATA[udId].ra.filter(function(r){ return r.id !== raId; });
    saveRACE();
    delete POND[raId]; savePond();
    flash('RA '+raId+' eliminado','#16a34a');
    renderSeccionRACE(parentSec);
  }; })(u.id, ra.id);

  raHdr.appendChild(raInfo);
  raHdr.appendChild(udBadge);
  raHdr.appendChild(pctWrap);
  raHdr.appendChild(btnEditRA);
  raHdr.appendChild(btnDelRA);
  card.appendChild(raHdr);

  if(!ceList.length){
    var noCE = document.createElement('p');
    noCE.style.cssText = 'font-size:13px;color:var(--muted);padding:4px 0';
    noCE.textContent = 'Sin criterios de evaluación configurados.';
    card.appendChild(noCE);
    return card;
  }

  // Barra validación CE
  var ceBar = document.createElement('div');
  ceBar.style.cssText = 'display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:var(--r);margin-bottom:8px;font-size:12px;'+
    'background:'+(validCE?'var(--green-bg)':'var(--amber-bg)')+';color:'+(validCE?'var(--green)':'var(--amber)');
  ceBar.innerHTML =
    '<span>'+(validCE?'✅':'⚠️')+'</span>'+
    '<span style="flex:1">Suma CE: <strong>'+totalCE.toFixed(1)+'%</strong> '+(validCE?'— Correcto':'— Debe sumar 100%')+'</span>'+
    '<button class="btn btn-sm" style="font-size:11px;padding:4px 10px;background:var(--navy);color:#fff;border:none;border-radius:6px;cursor:pointer" onclick="ponderacionAutomaticaCE(\''+ra.id+'\')">⚡ Auto CE</button>';
  card.appendChild(ceBar);

  // Tabla CE
  var table = document.createElement('table');
  table.style.cssText = 'width:100%;border-collapse:collapse';
  var thead = document.createElement('thead');
  thead.innerHTML = '<tr>'+
    '<th style="width:80px">Criterio</th>'+
    '<th>Descripción</th>'+
    '<th style="width:110px;text-align:center">% dentro del RA</th>'+
  '</tr>';
  table.appendChild(thead);
  var tbody = document.createElement('tbody');
  ceList.forEach(function(ce){
    var cePct = (pond.ce||{})[ce.id] || 0;
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td style="font-family:\'IBM Plex Mono\',monospace;font-size:12px;font-weight:700;color:var(--navy)">'+ce.id+'</td>'+
      '<td style="font-size:13px;color:var(--muted)">'+ce.desc+'</td>'+
      '<td style="text-align:center;padding:6px 8px">';
    var ceInput = document.createElement('input');
    ceInput.type = 'number';
    ceInput.min = '0'; ceInput.max = '100'; ceInput.step = '0.1';
    ceInput.value = cePct;
    ceInput.style.cssText = 'width:70px;padding:5px 7px;border:1px solid var(--border-md);border-radius:6px;font-family:"DM Sans",sans-serif;font-size:13px;font-weight:600;text-align:center;outline:none;background:var(--surface)';
    ceInput.oninput = (function(raId, ceId){ return function(){
      if(!POND[raId]) POND[raId]={pct:0,ce:{}};
      if(!POND[raId].ce) POND[raId].ce={};
      POND[raId].ce[ceId] = parseFloat(this.value)||0;
      savePond();
      renderSeccionRACE(parentSec);
    }; })(ra.id, ce.id);
    var lastTd = tr.querySelector('td:last-child');
    lastTd.appendChild(ceInput);

    // Botones editar desc y borrar CE
    var tdAcc = document.createElement('td');
    tdAcc.style.cssText = 'text-align:center;padding:4px 6px;white-space:nowrap';
    var btnEditCE = document.createElement('button');
    btnEditCE.className = 'btn btn-g btn-sm';
    btnEditCE.style.fontSize = '11px';
    btnEditCE.textContent = '✎';
    btnEditCE.title = 'Editar descripción';
    btnEditCE.onclick = (function(udId, raId, ceId){ return function(){
      var nueva = prompt('Nueva descripción para '+ceId+':', ce.desc);
      if(nueva === null) return;
      var raObj = RA_CE_DATA[udId].ra.find(function(r){ return r.id===raId; });
      var ceObj = raObj && raObj.ce.find(function(c){ return c.id===ceId; });
      if(ceObj){ ceObj.desc = nueva.trim(); saveRACE(); renderSeccionRACE(parentSec); flash('CE actualizado','#16a34a'); }
    }; })(u.id, ra.id, ce.id);

    var btnDelCE = document.createElement('button');
    btnDelCE.className = 'btn btn-d btn-sm';
    btnDelCE.style.fontSize = '11px';
    btnDelCE.textContent = '✕';
    btnDelCE.title = 'Eliminar CE';
    btnDelCE.onclick = (function(udId, raId, ceId){ return function(){
      if(!confirm('¿Eliminar el criterio '+ceId+'?')) return;
      var raObj = RA_CE_DATA[udId].ra.find(function(r){ return r.id===raId; });
      if(raObj){ raObj.ce = raObj.ce.filter(function(c){ return c.id!==ceId; }); saveRACE(); renderSeccionRACE(parentSec); flash('CE eliminado','#16a34a'); }
    }; })(u.id, ra.id, ce.id);

    tdAcc.appendChild(btnEditCE);
    tdAcc.appendChild(btnDelCE);
    tr.appendChild(tdAcc);
    tbody.appendChild(tr);
  });

  // Botón añadir CE a este RA
  var trAdd = document.createElement('tr');
  var tdAdd = document.createElement('td');
  tdAdd.colSpan = 4;
  tdAdd.style.cssText = 'padding:8px 4px';
  var btnAddCE = document.createElement('button');
  btnAddCE.className = 'btn btn-g btn-sm';
  btnAddCE.style.cssText = 'width:100%;font-size:12px';
  btnAddCE.textContent = '+ Añadir CE a este RA';
  btnAddCE.onclick = (function(udId, raId){ return function(){
    var ceId = prompt('ID del nuevo CE (ej: CE'+raId.replace('RA','')+'.x):');
    if(!ceId) return;
    var ceDesc = prompt('Descripción del CE:');
    if(!ceDesc) return;
    var cePeso = parseFloat(prompt('Peso dentro del RA (%):', '0'))||0;
    var raObj = RA_CE_DATA[udId].ra.find(function(r){ return r.id===raId; });
    if(raObj){ raObj.ce.push({id:ceId.trim(), desc:ceDesc.trim(), peso:cePeso}); saveRACE(); renderSeccionRACE(parentSec); flash('CE '+ceId+' añadido','#16a34a'); }
  }; })(u.id, ra.id);
  tdAdd.appendChild(btnAddCE);
  trAdd.appendChild(tdAdd);
  tbody.appendChild(trAdd);

  table.appendChild(tbody);
  card.appendChild(table);
  return card;
}

// ── Modal editar nombre/ponderación de un RA ──────────
function abrirModalEditarRA(udId, raId, sec){
  var raObj = (RA_CE_DATA[udId]||{ra:[]}).ra.find(function(r){ return r.id===raId; });
  if(!raObj) return;
  abrirModal('✎ Editar RA: '+raId,
    '<div class="fg"><label class="fl">ID del RA</label>'+
    '<input class="fi" id="era-id" value="'+raObj.id+'" maxlength="10"></div>'+
    '<div class="fg"><label class="fl">Nombre / descripción</label>'+
    '<input class="fi" id="era-nombre" value="'+raObj.nombre.replace(/"/g,"&quot;")+'"></div>'+
    '<div class="fg"><label class="fl">Ponderación en el módulo (%)</label>'+
    '<input class="fi" id="era-pct" type="number" min="0" max="100" value="'+(raObj.ponderacion||0)+'"></div>',
    '<button class="btn btn-g" onclick="cerrarModal()">Cancelar</button>'+
    '<button class="btn btn-p" id="btn-era-save">Guardar cambios</button>'
  );
  window._raSec = sec;
  window._raEditUdId = udId;
  window._raEditRaId = raId;
  setTimeout(function(){
    var b=document.getElementById('btn-era-save');
    if(b) b.onclick=function(){ guardarEditarRA(window._raEditUdId, window._raEditRaId); };
  },30);
}

function guardarEditarRA(udId, raId){
  var nuevoId   = (document.getElementById('era-id')||{value:raId}).value.trim();
  var nuevoNom  = (document.getElementById('era-nombre')||{value:''}).value.trim();
  var nuevoPct  = parseFloat((document.getElementById('era-pct')||{value:'0'}).value)||0;
  if(!nuevoId || !nuevoNom){ flash('Rellena todos los campos','#dc2626'); return; }
  var raObj = RA_CE_DATA[udId].ra.find(function(r){ return r.id===raId; });
  if(!raObj) return;
  // Actualizar POND si cambia el ID
  if(nuevoId !== raId){
    POND[nuevoId] = POND[raId]; delete POND[raId]; savePond();
  }
  raObj.id = nuevoId; raObj.nombre = nuevoNom; raObj.ponderacion = nuevoPct;
  POND[nuevoId] = POND[nuevoId] || {}; POND[nuevoId].pct = nuevoPct;
  saveRACE(); savePond();
  cerrarModal();
  flash('RA actualizado','#16a34a');
  if(window._raSec) renderSeccionRACE(window._raSec);
}

// ── Ponderación automática aritmética ─────────────────
function ponderacionAutomaticaRA(){
  if(!confirm('¿Aplicar ponderación automática a todos los RA? Se repartirá el 100% de forma equitativa entre todos los RA del módulo.')) return;
  initPond();
  var allRA = getAllRA();
  var n = allRA.length;
  if(!n) return;
  var basePct = parseFloat((100/n).toFixed(1));
  var resto = parseFloat((100 - basePct*(n-1)).toFixed(1));
  allRA.forEach(function(item, i){
    if(!POND[item.ra.id]) POND[item.ra.id]={pct:0,ce:{}};
    POND[item.ra.id].pct = i === n-1 ? resto : basePct;
  });
  savePond();
  var sec = document.getElementById('eval-sec-ra-ce');
  if(sec) renderSeccionRACE(sec);
  flash('Ponderación aritmética aplicada — puedes modificarla manualmente','#16a34a');
}

function ponderacionAutomaticaCE(raId){
  initPond();
  var allRA = getAllRA();
  var item = allRA.find(function(x){ return x.ra.id===raId; });
  if(!item) return;
  var ceList = item.ra.ce || [];
  var n = ceList.length;
  if(!n) return;
  if(!confirm('¿Ponderación automática para los CE de '+raId+'? Se repartirá 100% de forma equitativa.')) return;
  if(!POND[raId]) POND[raId]={pct:0,ce:{}};
  if(!POND[raId].ce) POND[raId].ce={};
  var basePct = parseFloat((100/n).toFixed(1));
  var resto = parseFloat((100 - basePct*(n-1)).toFixed(1));
  ceList.forEach(function(ce,i){
    POND[raId].ce[ce.id] = i===n-1 ? resto : basePct;
  });
  savePond();
  var sec = document.getElementById('eval-sec-ra-ce');
  if(sec) renderSeccionRACE(sec);
  flash('CE de '+raId+' ponderados automáticamente','#16a34a');
}

// ── EXPORT EXCEL ──────────────────────────────────────
function exportarRACEExcel(){
  if(typeof XLSX === 'undefined'){ flash('Librería Excel no cargada aún, espera unos segundos','#dc2626'); return; }
  initPond();
  var allRA = getAllRA();
  var wsData = [
    ['UD','UD_Titulo','RA_ID','RA_Nombre','RA_%_Modulo','CE_ID','CE_Descripcion','CE_%_RA'],
    ['','','','','','','',''],
    ['== INSTRUCCIONES ==','','','','','','',''],
    ['• La suma de todos los RA_%_Modulo debe ser 100','','','','','','',''],
    ['• La suma de CE_%_RA dentro de cada RA debe ser 100','','','','','','',''],
    ['• No modificar las columnas UD, RA_ID, CE_ID','','','','','','',''],
    ['','','','','','','',''],
  ];

  allRA.forEach(function(item){
    var pond = POND[item.ra.id] || {pct:0,ce:{}};
    var ceList = item.ra.ce || [];
    if(!ceList.length){
      wsData.push([
        'UD'+item.ud.n, item.ud.titulo,
        item.ra.id, item.ra.nombre, pond.pct,
        '','',''
      ]);
    } else {
      ceList.forEach(function(ce,i){
        wsData.push([
          'UD'+item.ud.n, item.ud.titulo,
          item.ra.id, item.ra.nombre, i===0 ? pond.pct : '',
          ce.id, ce.desc, (pond.ce||{})[ce.id]||0
        ]);
      });
    }
  });

  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.aoa_to_sheet(wsData);

  // Estilos de ancho de columna
  ws['!cols'] = [
    {wch:6},{wch:28},{wch:8},{wch:40},{wch:14},{wch:8},{wch:50},{wch:12}
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'RA y CE');
  XLSX.writeFile(wb, 'RA_CE_GestionFinanciera.xlsx');
  flash('Excel exportado correctamente','#16a34a');
}

// ── PLANTILLA EXCEL ───────────────────────────────────
function descargarPlantillaExcel(){
  if(typeof XLSX === 'undefined'){ flash('Librería Excel no cargada aún, espera unos segundos','#dc2626'); return; }

  var wsData = [
    // Cabecera — 4 columnas simples
    ['RA_ID', 'RA_Descripcion', 'CE_ID', 'CE_Descripcion'],
    // Fila de ejemplo RA1
    ['RA1', 'Identifica la estructura y función del patrimonio empresarial', 'CE1.1', 'Identifica los elementos patrimoniales clasificándolos en activo, pasivo y neto patrimonial'],
    ['RA1', '',                                                              'CE1.2', 'Elabora inventarios ordenados y completos de los elementos patrimoniales'],
    ['RA1', '',                                                              'CE1.3', 'Formula la ecuación fundamental del patrimonio verificando su equilibrio'],
    ['RA1', '',                                                              'CE1.4', 'Construye el balance de situación a partir de los datos del inventario'],
    // Fila de ejemplo RA2
    ['RA2', 'Aplica el Plan General de Contabilidad en el registro de operaciones', 'CE2.1', 'Identifica la estructura y contenido del PGC 2007'],
    ['RA2', '', 'CE2.2', 'Clasifica las cuentas del PGC según sus grupos y subgrupos'],
    ['RA2', '', 'CE2.3', 'Aplica los principios contables en el registro de operaciones'],
    ['RA2', '', 'CE2.4', 'Utiliza el cuadro de cuentas para codificar operaciones económicas'],
  ];

  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.aoa_to_sheet(wsData);
  ws['!cols'] = [{wch:8}, {wch:55}, {wch:8}, {wch:65}];
  XLSX.utils.book_append_sheet(wb, ws, 'RA y CE');
  XLSX.writeFile(wb, 'Plantilla_RA_CE.xlsx');
  flash('Plantilla descargada — rellena y vuelve a importar','#16a34a');
}

// ── IMPORT EXCEL ──────────────────────────────────────
function importarRACEExcel(file, sec){
  if(!file) return;

  // Esperar hasta 5 segundos a que SheetJS cargue
  function intentar(intentos){
    if(typeof XLSX !== 'undefined'){
      procesarExcel(file, sec);
    } else if(intentos > 0){
      flash('Cargando librería Excel…','#92400e');
      setTimeout(function(){ intentar(intentos-1); }, 800);
    } else {
      flash('No se pudo cargar la librería Excel. Recarga la página e inténtalo de nuevo.','#dc2626');
    }
  }
  intentar(6);
}

function procesarExcel(file, sec){
  var reader = new FileReader();
  reader.onload = function(e){
    try{
      var wb   = XLSX.read(e.target.result, {type:'array'});
      var ws   = wb.Sheets[wb.SheetNames[0]];
      var rows = XLSX.utils.sheet_to_json(ws, {header:1, defval:''});

      // Localizar fila de cabecera buscando RA_ID
      var headerRow = -1;
      for(var i = 0; i < Math.min(rows.length, 10); i++){
        var first = String(rows[i][0]||'').trim().toUpperCase();
        if(first === 'RA_ID' || first === 'RA'){
          headerRow = i; break;
        }
      }
      if(headerRow < 0){
        flash('No se encontró la cabecera RA_ID. Usa la plantilla proporcionada.','#dc2626');
        return;
      }

      // Filtrar filas de datos (ignorar vacías y la cabecera)
      var dataRows = rows.slice(headerRow + 1).filter(function(r){
        return String(r[0]||'').trim() !== '' || String(r[2]||'').trim() !== '';
      });

      if(!dataRows.length){
        flash('El archivo no contiene datos de RA/CE.','#dc2626');
        return;
      }

      // Construir estructura RA → CE
      // La plantilla NO tiene unidad — asignamos todos los RA al primer UD
      // y luego el profesor los vincula desde Contenidos
      var raMap   = {};   // raId → { nombre, ceList }
      var raOrder = [];   // mantener orden de aparición

      dataRows.forEach(function(row){
        var raId   = String(row[0]||'').trim();
        var raNom  = String(row[1]||'').trim();
        var ceId   = String(row[2]||'').trim();
        var ceDesc = String(row[3]||'').trim();

        if(!raId && !ceId) return; // fila completamente vacía

        // Si el raId está vacío en esta fila, hereda el último raId conocido
        if(!raId){
          raId = raOrder.length ? raOrder[raOrder.length-1] : 'RA?';
        }

        if(!raMap[raId]){
          raMap[raId]   = { nombre: raNom || raId, ce: [] };
          raOrder.push(raId);
        } else if(raNom){
          raMap[raId].nombre = raNom; // actualizar si hay descripción más adelante
        }

        if(ceId){
          raMap[raId].ce.push({ id: ceId, desc: ceDesc || ceId, peso: 0 });
        }
      });

      if(!raOrder.length){
        flash('No se encontraron RA válidos en el archivo.','#dc2626');
        return;
      }

      // Resumen antes de confirmar
      var resumen = 'Resumen de la importación:\n\n';
      raOrder.forEach(function(raId){
        resumen += '• '+raId+': '+raMap[raId].nombre+'\n';
        resumen += '  '+raMap[raId].ce.length+' criterios de evaluación\n';
      });
      resumen += '\nTotal: '+raOrder.length+' RA y '+raOrder.reduce(function(s,id){ return s+raMap[id].ce.length; },0)+' CE\n\n';
      resumen += 'NOTA: Las ponderaciones se establecerán desde la web una vez importados.\n\n';
      resumen += '¿Importar y reemplazar la configuración actual de RA/CE?';

      if(!confirm(resumen)) return;

      // Distribuir RA a las unidades:
      // Asignamos cada RA a la unidad cuyo número coincida con el sufijo numérico del RA
      // (RA1 → UD1, RA2 → UD2...). Si no hay match, van a un UD "general" (ud1 como fallback).
      var newRACE = {};
      var newPOND = {};

      raOrder.forEach(function(raId){
        var numMatch = raId.match(/(\d+)/);
        var udNum    = numMatch ? parseInt(numMatch[1]) : 1;
        var udObj    = UNIDADES.find(function(u){ return u.n === udNum; }) || UNIDADES[0];
        var udId     = udObj ? udObj.id : 'ud1';

        if(!newRACE[udId]) newRACE[udId] = {ra:[]};

        var raObj = {
          id: raId,
          nombre: raMap[raId].nombre,
          ponderacion: 0,
          ce: raMap[raId].ce.map(function(ce){ return { id:ce.id, desc:ce.desc, peso:0 }; })
        };
        newRACE[udId].ra.push(raObj);

        // Ponderaciones a 0 — el profesor las fija desde la web
        newPOND[raId] = { pct: 0, ce: {} };
        raMap[raId].ce.forEach(function(ce){ newPOND[raId].ce[ce.id] = 0; });
      });

      // Aplicar
      Object.assign(RA_CE_DATA, newRACE);
      POND = newPOND;
      saveRACE(); savePond();
      renderSeccionRACE(sec);
      flash('✓ Importados '+raOrder.length+' RA y '+raOrder.reduce(function(s,id){ return s+raMap[id].ce.length; },0)+' CE — ahora establece las ponderaciones','#16a34a');

    } catch(err){
      flash('Error al leer el archivo: '+err.message,'#dc2626');
    }
  };
  reader.readAsArrayBuffer(file);
}

// ── LIBRO DE CALIFICACIONES ───────────────────────────
function renderSeccionCalificaciones(sec){
  // Mostrar spinner mientras se cargan alumnos desde Supabase
  sec.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:180px;color:#9ca3af;gap:10px">'+
    '<div style="width:20px;height:20px;border:2px solid #ccc;border-top-color:#1a2744;border-radius:50%;animation:spin .7s linear infinite"></div>'+
    'Cargando alumnos…</div>';

  supa.from('perfiles').select('id,nombre,email,avatar_url,grupo').eq('rol','alumno').order('nombre')
    .then(function(result){
      console.log('[GF-Calif] Supabase perfiles result:', result);
      console.log('[GF-Calif] error:', result.error, '| data:', result.data);
      var perfs = result.data || [];
      if(perfs.length){
        var mapaLocal = {};
        DB.alumnos.forEach(function(al){ mapaLocal[al.id]=al; });
        DB.alumnos = perfs.map(function(p){
          var local = mapaLocal[p.id] || {};
          return {
            id: p.id,
            nombre: p.nombre || local.nombre || '',
            apellidos: '',
            email: p.email || local.email || '',
            avatar_url: p.avatar_url || '',
            grupo: p.grupo || local.grupo || ''
          };
        });
        save();
      }
      console.log('[GF-Calif] DB.alumnos tras sync:', DB.alumnos.length, DB.alumnos);
      _renderCalifInner(sec);
    })
    .catch(function(err){
      console.error('[GF-Calif] catch error:', err);
      _renderCalifInner(sec);
    });
}

function _renderCalifInner(sec){
  sec.innerHTML='';
  initPond();

  if(!DB.alumnos.length){
    sec.innerHTML='<div class="card"><p style="color:var(--muted);font-size:14px;text-align:center;padding:2rem">Sin alumnos registrados. Los alumnos aparecen aquí cuando acceden a la app con su cuenta educativa (@g.educaand.es).</p></div>';
    return;
  }

  // Filtro de grupo
  var tieneGrp=DB.alumnos.some(function(a){return a.grupo;});
  if(tieneGrp && !document.getElementById('filtro-grupo-calif')){
    renderFiltroGrupoCalif(sec,function(){
      var s=document.getElementById('eval-sec-calificaciones');
      if(s) _renderCalifInner(s);
    });
  }
  // Recoger todas las actividades evaluables del módulo
  var todasActs=[];
  UNIDADES.forEach(function(u){
    (ACT_EVAL[u.id]||[]).forEach(function(ae){
      todasActs.push({ae:ae, ud:u});
    });
  });

  if(!todasActs.length){
    sec.innerHTML='<div class="card"><p style="color:var(--muted);font-size:14px;text-align:center;padding:2rem">No hay actividades evaluables configuradas. Crea actividades evaluables en los bloques del módulo.</p></div>';
    return;
  }

  var udTests = getUDTests(); // {udId:[{actId,nota,alumnoId,alumnoNombre,fecha,...}]}

  // Obtener última nota de un alumno para una actividad
  function getNotaAlumno(udId, actId, alId){
    var entries = (udTests[udId]||[]).filter(function(t){
      return t.actId===actId && (t.alumnoId===alId || (!t.alumnoId && !alId));
    });
    if(!entries.length) return null;
    // Devolver la más reciente
    return entries[entries.length-1].nota;
  }

  // Notas manuales del DB antiguo (compatibilidad)
  function getNotaManual(alId, ejId){
    return (DB.notas[alId]||{})[ejId]!=null ? (DB.notas[alId]||{})[ejId] : null;
  }

  // ── Cabecera con controles ──────────────────────────
  var ph = document.createElement('div'); ph.className='ph';
  var phLeft=document.createElement('div');
  phLeft.innerHTML='<h1 class="pt">Libro de Calificaciones</h1>'+
    '<p class="ps">Notas por actividad evaluable · Gestión Financiera</p>';
  var phBtns=document.createElement('div'); phBtns.style.cssText='display:flex;gap:8px;flex-wrap:wrap';

  // Filtro por bloque
  var selUD=document.createElement('select'); selUD.className='fs'; selUD.style.cssText='width:auto;font-size:13px';
  selUD.innerHTML='<option value="todas">Todos los bloques</option>'+
    UNIDADES.map(function(u){ return '<option value="'+u.id+'">B'+u.n+' · '+u.titulo.slice(0,20)+'</option>'; }).join('');

  var btnExcel=document.createElement('button'); btnExcel.className='btn btn-g';
  btnExcel.innerHTML='⬇ Exportar Excel'; btnExcel.onclick=function(){ exportarLibroExcel(todasActs, udTests); };

  var btnSeneca=document.createElement('button'); btnSeneca.className='btn btn-p';
  btnSeneca.style.cssText='background:#d4380d;border-color:#d4380d;color:#fff';
  btnSeneca.innerHTML='📤 Exportar Séneca (CSV)'; btnSeneca.onclick=function(){ exportarSeneca(todasActs, udTests); };

  phBtns.appendChild(selUD); phBtns.appendChild(btnExcel); phBtns.appendChild(btnSeneca);
  ph.appendChild(phLeft); ph.appendChild(phBtns);
  sec.appendChild(ph);

  // ── Stats rápidas ────────────────────────────────────
  var statsRow=document.createElement('div'); statsRow.className='grid-s'; statsRow.style.marginBottom='1.25rem';
  var totalActs=todasActs.length;
  var totalAlumnos=DB.alumnos.length;
  var notasRegistradas=0;
  DB.alumnos.forEach(function(al){
    todasActs.forEach(function(item){
      var n=getNotaAlumno(item.ud.id,item.ae.id,al.id); if(n!==null) notasRegistradas++;
    });
  });
  var totalCeldas=totalActs*totalAlumnos;
  var pctCompletado=totalCeldas?Math.round(notasRegistradas/totalCeldas*100):0;
  [{ico:'👥',label:'Alumnos',val:totalAlumnos},{ico:'📋',label:'Actividades',val:totalActs},
   {ico:'✅',label:'Notas registradas',val:notasRegistradas+'/'+totalCeldas},{ico:'📊',label:'Completado',val:pctCompletado+'%'}
  ].forEach(function(s){
    var sc=document.createElement('div'); sc.className='sc';
    sc.innerHTML='<div class="sl">'+s.ico+' '+s.label+'</div><div class="sn" style="font-size:18px">'+s.val+'</div>';
    statsRow.appendChild(sc);
  });
  sec.appendChild(statsRow);

  // ── Tabla principal ──────────────────────────────────
  var tableWrap=document.createElement('div'); tableWrap.className='card'; tableWrap.style.padding='0';
  var tw=document.createElement('div'); tw.className='tw';
  var table=document.createElement('table');

  function renderTabla(filtroUD){
    table.innerHTML='';
    var actsFiltradas = filtroUD==='todas' ? todasActs : todasActs.filter(function(item){ return item.ud.id===filtroUD; });
    if(!actsFiltradas.length){
      table.innerHTML='<tr><td style="text-align:center;padding:2rem;color:var(--muted)">Sin actividades evaluables en este bloque.</td></tr>';
      return;
    }

    // ── Thead ─────────────────────────────────────────
    var thead=document.createElement('thead');
    // Fila 1: bloques agrupados
    var trBloque=document.createElement('tr');
    var thEmpty=document.createElement('th');
    thEmpty.style.cssText='min-width:180px;position:sticky;left:0;background:var(--navy);z-index:3;color:#fff';
    thEmpty.textContent='Alumno/a';
    trBloque.appendChild(thEmpty);
    // Agrupar actividades por bloque
    var bloqueActual=null; var bloqueCount=0; var thBloqueEl=null;
    actsFiltradas.forEach(function(item,i){
      if(item.ud.id!==bloqueActual){
        if(thBloqueEl) thBloqueEl.colSpan=bloqueCount;
        bloqueActual=item.ud.id; bloqueCount=1;
        thBloqueEl=document.createElement('th');
        thBloqueEl.style.cssText='text-align:center;background:var(--navy);color:var(--gold-light);font-size:11px;padding:6px 8px;border-left:2px solid rgba(255,255,255,.2)';
        thBloqueEl.textContent='B'+item.ud.n+' · '+item.ud.titulo.slice(0,22);
        trBloque.appendChild(thBloqueEl);
      } else { bloqueCount++; }
      if(i===actsFiltradas.length-1 && thBloqueEl) thBloqueEl.colSpan=bloqueCount;
    });
    var thMediaBloque=document.createElement('th');
    thMediaBloque.style.cssText='text-align:center;background:var(--navy);color:var(--gold-light);font-size:11px;padding:6px 8px';
    thMediaBloque.textContent='Media';
    trBloque.appendChild(thMediaBloque);
    thead.appendChild(trBloque);

    // Fila 2: actividades
    var trActs=document.createElement('tr');
    var thAlumno=document.createElement('th');
    thAlumno.style.cssText='position:sticky;left:0;background:var(--surface2);z-index:2;font-size:11px;padding:6px 10px';
    thAlumno.textContent='';
    trActs.appendChild(thAlumno);
    actsFiltradas.forEach(function(item){
      var th=document.createElement('th');
      th.style.cssText='text-align:center;min-width:90px;font-size:10px;font-weight:600;padding:5px 6px;line-height:1.3;border-left:1px solid var(--border)';
      var tipoBadge={examen:'b-amber',caso:'b-blue',practica:'b-green',test:'b-purple',trabajo:'b-blue',otro:'b-gray'}[item.ae.tipo]||'b-gray';
      th.innerHTML='<span class="badge '+tipoBadge+'" style="font-size:9px;margin-bottom:2px;display:block">'+item.ae.tipo+'</span>'+
        '<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:85px;margin:0 auto">'+item.ae.titulo.slice(0,30)+'</div>'+
        '<div style="color:var(--muted);font-weight:400;margin-top:2px">'+item.ae.peso+'%</div>';
      trActs.appendChild(th);
    });
    var thMedia=document.createElement('th');
    thMedia.style.cssText='text-align:center;font-size:11px;padding:5px 8px;background:var(--surface2)';
    thMedia.textContent='Ponderada';
    trActs.appendChild(thMedia);
    thead.appendChild(trActs);
    table.appendChild(thead);

    // ── Tbody ─────────────────────────────────────────
    var tbody=document.createElement('tbody');
    var _ag=(typeof _filtroGrupoCalif!=='undefined'&&_filtroGrupoCalif)?
    DB.alumnos.filter(function(a){return (a.grupo||'')===_filtroGrupoCalif;}):DB.alumnos;
  _ag.forEach(function(al, ai){
      var tr=document.createElement('tr');
      tr.style.background=ai%2===0?'':'var(--surface2)';
      var tdNom=document.createElement('td');
      tdNom.style.cssText='font-weight:500;font-size:13px;position:sticky;left:0;background:'+(ai%2===0?'var(--surface)':'var(--surface2)')+';z-index:1;padding:7px 10px;white-space:nowrap';
      tdNom.innerHTML='<div>'+al.nombre+' '+al.apellidos+'</div>'+
        (al.email?'<div style="font-size:11px;color:var(--muted)">'+al.email+'</div>':'');
      tr.appendChild(tdNom);

      var sumPeso=0, sumNota=0;
      actsFiltradas.forEach(function(item){
        var nota=getNotaAlumno(item.ud.id, item.ae.id, al.id);
        if(nota===null) nota=getNotaManual(al.id, item.ae.id);
        var td=document.createElement('td');
        td.style.cssText='text-align:center;padding:5px 6px;border-left:1px solid var(--border)';

        if(nota!==null){
          var color=nota>=7?'var(--green)':nota>=5?'var(--navy)':'var(--red)';
          var bg=nota>=7?'var(--green-bg)':nota>=5?'':nota>=0?'var(--red-bg)':'';
          td.innerHTML='<span style="font-size:14px;font-weight:700;color:'+color+';background:'+bg+
            ';padding:2px 7px;border-radius:8px;font-family:IBM Plex Mono,monospace">'+nota.toFixed(1)+'</span>';
          sumPeso+=parseFloat(item.ae.peso)||0;
          sumNota+=nota*(parseFloat(item.ae.peso)||0);
        } else {
          // Campo editable para nota manual
          var inp=document.createElement('input');
          inp.type='number'; inp.min='0'; inp.max='10'; inp.step='0.1'; inp.value='';
          inp.placeholder='—';
          inp.style.cssText='width:56px;padding:3px 5px;border:1px solid var(--border);border-radius:6px;font-size:13px;text-align:center;background:var(--surface);font-family:IBM Plex Mono,monospace';
          inp.title='Introduce nota manual';
          inp.onchange=(function(udId,actId,alId,peso,sumP,sumN,tdMedia,al){
            return function(){
              var v=parseFloat(this.value);
              if(isNaN(v)||v<0||v>10){ this.value=''; return; }
              // Guardar en udTests
              var tests=getUDTests(); if(!tests[udId]) tests[udId]=[];
              tests[udId].push({actId:actId,nota:v,fecha:new Date().toLocaleDateString('es-ES'),alumnoId:alId,alumnoNombre:al.nombre+' '+al.apellidos,manual:true});
              saveUDTests(tests);
              // Actualizar visualización
              this.parentElement.innerHTML='<span style="font-size:14px;font-weight:700;color:'+(v>=7?'var(--green)':v>=5?'var(--navy)':'var(--red)')+';font-family:IBM Plex Mono,monospace;background:'+(v>=7?'var(--green-bg)':v>=5?'':'var(--red-bg)')+';padding:2px 7px;border-radius:8px">'+v.toFixed(1)+'</span>';
              flash('Nota guardada','#16a34a');
              renderTabla(selUD.value); // rerender para actualizar media
            };
          })(item.ud.id, item.ae.id, al.id, item.ae.peso, sumPeso, sumNota, null, al);
          td.appendChild(inp);
        }
        tr.appendChild(td);
      });

      // Media ponderada
      var tdMedia=document.createElement('td');
      tdMedia.style.cssText='text-align:center;font-weight:700;padding:5px 8px;background:'+(ai%2===0?'var(--surface2)':'var(--surface)');
      if(sumPeso>0){
        var media=sumNota/sumPeso;
        tdMedia.innerHTML='<span style="font-size:15px;font-weight:800;color:'+(media>=7?'var(--green)':media>=5?'var(--navy)':'var(--red)')+'">'+media.toFixed(2)+'</span>';
      } else {
        tdMedia.innerHTML='<span style="color:var(--muted)">—</span>';
      }
      tr.appendChild(tdMedia);
      tbody.appendChild(tr);
    });

    // Fila de medias por actividad
    var trMediaAct=document.createElement('tr');
    trMediaAct.style.cssText='background:var(--surface2);border-top:2px solid var(--border)';
    var tdLbl=document.createElement('td');
    tdLbl.style.cssText='font-weight:700;font-size:12px;padding:7px 10px;position:sticky;left:0;background:var(--surface2)';
    tdLbl.textContent='Media de la clase';
    trMediaAct.appendChild(tdLbl);
    actsFiltradas.forEach(function(item){
      var notas=[]; DB.alumnos.forEach(function(al){
        var n=getNotaAlumno(item.ud.id,item.ae.id,al.id)||getNotaManual(al.id,item.ae.id);
        if(n!==null) notas.push(n);
      });
      var td=document.createElement('td'); td.style.cssText='text-align:center;border-left:1px solid var(--border);padding:7px 6px';
      if(notas.length){
        var avg=notas.reduce(function(s,n){return s+n;},0)/notas.length;
        td.innerHTML='<div style="font-size:12px;font-weight:700;color:'+(avg>=7?'var(--green)':avg>=5?'var(--navy)':'var(--red)')+'">'+avg.toFixed(1)+'</div>'+
          '<div style="font-size:10px;color:var(--muted)">'+notas.length+'/'+DB.alumnos.length+'</div>';
      } else { td.innerHTML='<span style="color:var(--muted)">—</span>'; }
      trMediaAct.appendChild(td);
    });
    var tdMediaTotal=document.createElement('td'); tdMediaTotal.style.cssText='text-align:center;padding:7px 8px';
    trMediaAct.appendChild(tdMediaTotal);
    tbody.appendChild(trMediaAct);
    table.appendChild(tbody);
  }

  selUD.onchange=function(){ renderTabla(this.value); };
  renderTabla('todas');
  tw.appendChild(table); tableWrap.appendChild(tw); sec.appendChild(tableWrap);

  // ── Leyenda ──────────────────────────────────────────
  var leyenda=document.createElement('div');
  leyenda.style.cssText='display:flex;gap:12px;flex-wrap:wrap;margin-top:10px;font-size:12px;color:var(--muted)';
  leyenda.innerHTML=
    '<span style="background:var(--green-bg);color:var(--green);padding:2px 8px;border-radius:6px;font-weight:600">≥7 Notable/Sobresaliente</span>'+
    '<span style="background:var(--surface2);color:var(--navy);padding:2px 8px;border-radius:6px;font-weight:600">5–6.9 Aprobado</span>'+
    '<span style="background:var(--red-bg);color:var(--red);padding:2px 8px;border-radius:6px;font-weight:600">&lt;5 Suspenso</span>'+
    '<span style="color:var(--muted)">· Los campos vacíos permiten introducir nota manual</span>';
  sec.appendChild(leyenda);
}

function exportarLibroExcel(todasActs, udTests){
  if(typeof XLSX==='undefined'){ flash('Librería Excel no disponible','#dc2626'); return; }
  function getNotaAlumno(udId,actId,alId){
    var entries=(udTests[udId]||[]).filter(function(t){ return t.actId===actId&&(t.alumnoId===alId||!t.alumnoId); });
    return entries.length?entries[entries.length-1].nota:null;
  }
  var headers=['Alumno/a','Email'].concat(todasActs.map(function(item){ return item.ae.titulo+' ('+item.ae.peso+'%)'; })).concat(['Media ponderada']);
  var rows=[headers];
  DB.alumnos.forEach(function(al){
    var sumP=0,sumN=0;
    var row=[al.nombre+' '+al.apellidos, al.email||''];
    todasActs.forEach(function(item){
      var n=getNotaAlumno(item.ud.id,item.ae.id,al.id);
      row.push(n!==null?n:'');
      if(n!==null){ sumP+=parseFloat(item.ae.peso)||0; sumN+=n*(parseFloat(item.ae.peso)||0); }
    });
    row.push(sumP>0?parseFloat((sumN/sumP).toFixed(2)):'');
    rows.push(row);
  });
  // Fila media clase
  var mediaRow=['Media de la clase',''];
  todasActs.forEach(function(item){
    var notas=[]; DB.alumnos.forEach(function(al){ var n=getNotaAlumno(item.ud.id,item.ae.id,al.id); if(n!==null) notas.push(n); });
    mediaRow.push(notas.length?parseFloat((notas.reduce(function(s,n){return s+n;},0)/notas.length).toFixed(2)):'');
  });
  mediaRow.push(''); rows.push(mediaRow);

  var wb=XLSX.utils.book_new();
  var ws=XLSX.utils.aoa_to_sheet(rows);
  ws['!cols']=[{wch:24},{wch:24}].concat(todasActs.map(function(){return {wch:16};})).concat([{wch:14}]);
  XLSX.utils.book_append_sheet(wb,ws,'Calificaciones');

  // Hoja por RA
  var allRA=getAllRA();
  allRA.forEach(function(item){
    var actsRA=todasActs.filter(function(a){ return a.ae.ceVinculados&&a.ae.ceVinculados.some(function(cv){return cv.raId===item.ra.id;}); });
    if(!actsRA.length) return;
    var hRA=['Alumno/a'].concat(actsRA.map(function(a){return a.ae.titulo.slice(0,30);})).concat(['Media '+item.ra.id]);
    var rowsRA=[hRA];
    DB.alumnos.forEach(function(al){
      var sumP=0,sumN=0;
      var r=[al.nombre+' '+al.apellidos];
      actsRA.forEach(function(a){
        var n=getNotaAlumno(a.ud.id,a.ae.id,al.id);
        r.push(n!==null?n:'');
        if(n!==null){sumP+=parseFloat(a.ae.peso)||0;sumN+=n*(parseFloat(a.ae.peso)||0);}
      });
      r.push(sumP>0?parseFloat((sumN/sumP).toFixed(2)):'');
      rowsRA.push(r);
    });
    var wsRA=XLSX.utils.aoa_to_sheet(rowsRA);
    XLSX.utils.book_append_sheet(wb,wsRA,item.ra.id.slice(0,31));
  });

  var fecha=new Date().toISOString().slice(0,10);
  XLSX.writeFile(wb,'LibroCalificaciones_GestionFinanciera_'+fecha+'.xlsx');
  flash('Libro de calificaciones exportado','#16a34a');
}

// Mantener compatibilidad
function exportarCalificacionesExcel(){ exportarLibroExcel([], getUDTests()); }
function actualizarMediaFila(){}
function actualizarMediaCelda(){}

// ── EXPORTACIÓN SÉNECA ────────────────────────────────
// Genera un CSV compatible con la importación de calificaciones de Séneca (Junta de Andalucía)
// Formato: NIF;Apellidos;Nombre;Calificacion
// La calificación es la nota media ponderada del módulo redondeada al entero más cercano
// según la escala de Séneca para FP (1-10, o "PE" para pendiente, "NE" para no evaluado)
function exportarSeneca(todasActs, udTests){
  if(!DB.alumnos.length){
    flash('No hay alumnos registrados', '#dc2626');
    return;
  }

  // ── Diálogo de configuración ──────────────────────────
  var modal = document.createElement('div');
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem';

  var box = document.createElement('div');
  box.style.cssText='background:#fff;border-radius:14px;padding:1.5rem;max-width:520px;width:100%;box-shadow:0 8px 40px rgba(0,0,0,.25)';
  box.innerHTML=
    '<div style="font-family:Georgia,serif;font-size:1.1rem;font-weight:700;color:#1a2744;margin-bottom:.3rem">📤 Exportar a Séneca</div>'+
    '<div style="font-size:13px;color:#6b7280;margin-bottom:1.2rem">Genera el CSV para importar calificaciones en Séneca · Junta de Andalucía</div>'+

    // Módulo
    '<div style="margin-bottom:1rem">'+
      '<label style="display:block;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;margin-bottom:4px">Módulo profesional</label>'+
      '<input id="sen-modulo" type="text" value="Gestión Financiera" '+
        'style="width:100%;padding:8px 10px;border:1.5px solid #d1d5db;border-radius:8px;font-size:14px;outline:none" '+
        'placeholder="Nombre del módulo">'+
    '</div>'+

    // Convocatoria
    '<div style="margin-bottom:1rem">'+
      '<label style="display:block;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;margin-bottom:4px">Convocatoria</label>'+
      '<select id="sen-conv" style="width:100%;padding:8px 10px;border:1.5px solid #d1d5db;border-radius:8px;font-size:13px;background:#fff;outline:none">'+
        '<option value="OC">Ordinaria (junio)</option>'+
        '<option value="EX">Extraordinaria (septiembre)</option>'+
      '</select>'+
    '</div>'+

    // Redondeo
    '<div style="margin-bottom:1rem">'+
      '<label style="display:block;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;margin-bottom:4px">Redondeo de la nota final</label>'+
      '<select id="sen-redondeo" style="width:100%;padding:8px 10px;border:1.5px solid #d1d5db;border-radius:8px;font-size:13px;background:#fff;outline:none">'+
        '<option value="redondeo">Redondeo matemático (0.5 → sube)</option>'+
        '<option value="floor">Siempre truncar (2.9 → 2)</option>'+
        '<option value="ceil">Siempre subir (2.1 → 3)</option>'+
        '<option value="decimal">Dejar con 1 decimal (solo CSV interno)</option>'+
      '</select>'+
    '</div>'+

    // Sin nota
    '<div style="margin-bottom:1.2rem">'+
      '<label style="display:block;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;margin-bottom:4px">Alumnos sin nota</label>'+
      '<select id="sen-sinnota" style="width:100%;padding:8px 10px;border:1.5px solid #d1d5db;border-radius:8px;font-size:13px;background:#fff;outline:none">'+
        '<option value="PE">PE — Pendiente de evaluación</option>'+
        '<option value="NE">NE — No evaluado</option>'+
        '<option value="dejar">Dejar en blanco</option>'+
      '</select>'+
    '</div>'+

    // Info
    '<div style="background:#eff6ff;border-radius:8px;padding:10px 12px;font-size:12px;color:#1e40af;margin-bottom:1.2rem;line-height:1.6">'+
      '💡 <strong>Formato generado:</strong> <code>NIF;Apellidos;Nombre;Calificacion</code><br>'+
      'El separador es <strong>punto y coma (;)</strong>. Codificación <strong>UTF-8</strong>.<br>'+
      'Los alumnos sin NIF/NIE figurarán con el campo vacío — cúbrelos antes de importar.'+
    '</div>'+

    '<div style="display:flex;gap:8px;justify-content:flex-end">'+
      '<button id="sen-cancel" style="padding:8px 18px;border:1.5px solid #d1d5db;border-radius:8px;background:#fff;font-size:13px;font-weight:600;cursor:pointer;color:#374151">Cancelar</button>'+
      '<button id="sen-ok" style="padding:8px 22px;border:none;border-radius:8px;background:#d4380d;color:#fff;font-size:13px;font-weight:700;cursor:pointer">Generar CSV</button>'+
    '</div>';

  modal.appendChild(box);
  document.body.appendChild(modal);

  document.getElementById('sen-cancel').onclick = function(){ document.body.removeChild(modal); };
  modal.onclick = function(e){ if(e.target===modal) document.body.removeChild(modal); };

  document.getElementById('sen-ok').onclick = function(){
    var modulo   = document.getElementById('sen-modulo').value || 'Gestion Financiera';
    var conv     = document.getElementById('sen-conv').value;
    var redondeo = document.getElementById('sen-redondeo').value;
    var sinNota  = document.getElementById('sen-sinnota').value;

    // Calcular nota media ponderada por alumno
    function getNotaAlumnoSen(udId, actId, alId){
      var entries=(udTests[udId]||[]).filter(function(t){ return t.actId===actId&&(t.alumnoId===alId||!t.alumnoId); });
      if(!entries.length) return null;
      return entries[entries.length-1].nota;
    }

    function aplicarRedondeo(v){
      if(redondeo==='floor')   return Math.floor(v);
      if(redondeo==='ceil')    return Math.ceil(v);
      if(redondeo==='decimal') return parseFloat(v.toFixed(1));
      return Math.round(v); // redondeo matemático
    }

    // Cabecera CSV
    var lineas = [
      '# Séneca · Junta de Andalucía · Importación de calificaciones',
      '# Módulo: '+modulo,
      '# Convocatoria: '+(conv==='OC'?'Ordinaria':'Extraordinaria'),
      '# Generado: '+new Date().toLocaleDateString('es-ES'),
      '# Formato: NIF;Apellidos;Nombre;Calificacion',
      'NIF;Apellidos;Nombre;Calificacion'
    ];

    DB.alumnos.forEach(function(al){
      var sumPeso=0, sumNota=0;
      todasActs.forEach(function(item){
        var n = getNotaAlumnoSen(item.ud.id, item.ae.id, al.id);
        if(n===null) n = (DB.notas[al.id]||{})[item.ae.id]!=null ? (DB.notas[al.id]||{})[item.ae.id] : null;
        if(n!==null){
          sumPeso += parseFloat(item.ae.peso)||0;
          sumNota += n*(parseFloat(item.ae.peso)||0);
        }
      });

      var calificacion;
      if(sumPeso > 0){
        calificacion = String(aplicarRedondeo(sumNota/sumPeso));
      } else {
        calificacion = sinNota==='dejar' ? '' : sinNota;
      }

      // Escapar campos para CSV (punto y coma como separador)
      var nif       = (al.nif||al.dni||'').replace(/;/g,'');
      var apellidos = (al.apellidos||'').replace(/;/g,'');
      var nombre    = (al.nombre||'').replace(/;/g,'');

      lineas.push([nif, apellidos, nombre, calificacion].join(';'));
    });

    // Descargar CSV
    var csvContent = lineas.join('\r\n');
    var blob = new Blob(['\uFEFF'+csvContent], {type:'text/csv;charset=utf-8'});
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    var fecha= new Date().toISOString().slice(0,10);
    a.href   = url;
    a.download = 'Seneca_'+modulo.replace(/\s+/g,'_')+'_'+conv+'_'+fecha+'.csv';
    a.click();
    URL.revokeObjectURL(url);

    document.body.removeChild(modal);
    flash('✅ CSV Séneca generado · '+DB.alumnos.length+' alumnos','#16a34a');
  };
}
function setNota(alId,ejId,val){ if(!DB.notas[alId]) DB.notas[alId]={}; DB.notas[alId][ejId]=val===''?null:parseFloat(val); save(); }


// ── Vista alumno ──────────────────────────────────────
function renderEvaluacionAlumno(cont){
  cont.innerHTML = '<div class="card"><p style="color:var(--muted);font-size:14px;text-align:center;padding:2rem">Las calificaciones son visibles solo para el profesor. Consulta tus notas en cada unidad didáctica.</p></div>';
}



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
  gfConfirm('¿Eliminar este alumno?','Eliminar',function(){
    DB.alumnos = DB.alumnos.filter(function(a){ return a.id!==id; });
    save(); renderAlumnos(); renderDashboard();
  });
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

// Calcula el uso actual de localStorage en KB
function calcLocalStorageKB(){
  var total=0;
  try{ for(var k in localStorage){ if(localStorage.hasOwnProperty(k)) total+=((localStorage[k].length+k.length)*2); } }catch(e){}
  return Math.round(total/1024);
}

function leerArchivoMat(file){
  var info = document.getElementById('mat-file-info');
  var MAX_FILE = 3*1024*1024; // 3 MB por archivo (base64 infla ~33%)
  if(file.size > MAX_FILE){
    if(info) info.innerHTML = '<span style="color:var(--red)">Archivo demasiado grande (máx 3 MB). Usa un enlace externo para archivos mayores.</span>';
    _matFilePending = null; return;
  }
  // Avisar si el almacenamiento local ya está al límite
  var usoKB = calcLocalStorageKB();
  if(usoKB > 3500){
    if(info) info.innerHTML = '<span style="color:var(--amber)">⚠️ Almacenamiento local casi lleno ('+usoKB+' KB usados). Considera usar enlaces externos.</span>';
  }
  var reader = new FileReader();
  reader.onload = function(e){
    _matFilePending = { name:file.name, size:file.size, type:file.type, b64:e.target.result };
    if(info) info.innerHTML = '✅ <strong>'+file.name+'</strong> ('+Math.round(file.size/1024)+' KB) · Almacenamiento local: '+usoKB+' KB usados';
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
    }catch(e){
      flash('⚠️ No hay espacio en el navegador ('+calcLocalStorageKB()+' KB usados). Elimina recursos o usa enlaces externos.','#dc2626');
      return;
    }
    _matFilePending = null;
  } else {
    mat.url = (document.getElementById('mat-url')||{value:''}).value.trim();
  }
  DB.materiales.push(mat);
  save(); cerrarModal(); renderMateriales();
  flash('Recurso añadido al cuaderno','#16a34a');
}

function borrarMaterial(id){
  gfConfirm('¿Eliminar este recurso?','Eliminar',function(){
    DB.materiales = DB.materiales.filter(function(m){ return m.id!==id; });
    try{ var f=JSON.parse(localStorage.getItem('gf_mat_files')||'{}'); delete f[id]; localStorage.setItem('gf_mat_files',JSON.stringify(f)); }catch(e){}
    save(); renderMateriales();
  });
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


// ══════════════════════════════════════════════════════
//  SECCIÓN CONTENIDOS — Estructura del Módulo
//  Gestiona: bloques, unidades por bloque, temas y RA
//  NO toca la sección de Evaluación (RA_CE_DATA)
// ══════════════════════════════════════════════════════

// Estructura de bloques: cada bloque agrupa una o varias UDs
// Los bloques se derivan de UNIDADES pero con agrupación manual
// Guardamos la agrupación en localStorage
var BLOQUES_KEY = 'gf_bloques_estructura';

function getBloques(){
  try{ return JSON.parse(localStorage.getItem(BLOQUES_KEY)||'null'); } catch(e){ return null; }
}
function saveBloques(b){ localStorage.setItem(BLOQUES_KEY, JSON.stringify(b)); }

function initBloques(){
  // Si no hay estructura guardada, o está desactualizada, regenerarla
  var saved = getBloques();
  if(saved){
    // Validar que los udIds del primer bloque siguen existiendo en UNIDADES
    var primerUdId = saved[0] && saved[0].udIds && saved[0].udIds[0];
    if(primerUdId && UNIDADES.find(function(u){ return u.id===primerUdId; })){
      return saved; // datos válidos
    }
    // Datos obsoletos — regenerar
  }
  // Estructura por defecto: cada UNIDAD es un bloque, excepto ud2 que agrupa ud2+ud3
  // (refleja la distribución real del módulo)
  var bloques = [
    { id:'bloque1', titulo:'Bloque 1 · Necesidades de Financiación', color:'#1a2744', udIds:['ud1'] },
    { id:'bloque2', titulo:'Bloque 2-3 · Clasifica y Evalúa Productos Financieros', color:'#1e3a5f', udIds:['ud2'] },
    { id:'bloque3', titulo:'Bloque 4 · Los Seguros', color:'#2d4a7a', udIds:['ud3'] },
    { id:'bloque4', titulo:'Bloque 5 · Inversiones', color:'#1a6b4a', udIds:['ud4'] },
    { id:'bloque5', titulo:'Bloque 6 · Presupuestos', color:'#7c3200', udIds:['ud5'] },
  ];
  saveBloques(bloques);
  return bloques;
}

function initContenidos(){
  var root = document.getElementById('contenidos-root');
  if(!root) return;
  root.innerHTML = '';
  renderContenidos(root);
}

function renderContenidos(root){
  root.innerHTML = '';
  var bloques = initBloques();

  // ── Cabecera ──────────────────────────────────────────
  var ph = document.createElement('div'); ph.className='ph';
  var phLeft = document.createElement('div');
  phLeft.innerHTML =
    '<h1 class="pt">Estructura del Módulo</h1>'+
    '<p class="ps">Gestiona bloques, unidades didácticas, temas y vinculación con RA · El contenido de cada tema se edita desde los Bloques del módulo</p>';
  var phBtns = document.createElement('div'); phBtns.style.cssText='display:flex;gap:8px';
  var btnNuevoBloque = document.createElement('button'); btnNuevoBloque.className='btn btn-p';
  btnNuevoBloque.innerHTML='+ Nuevo bloque';
  btnNuevoBloque.onclick=function(){ abrirModalNuevoBloque(bloques, root); };
  phBtns.appendChild(btnNuevoBloque);
  ph.appendChild(phLeft); ph.appendChild(phBtns);
  root.appendChild(ph);

  // ── Stats ─────────────────────────────────────────────
  var totalUDs = UNIDADES.length;
  var totalHoras = UNIDADES.reduce(function(s,u){ return s+u.horas; },0);
  var allRA = getAllRA();
  var totalTemas = UNIDADES.reduce(function(s,u){ return s+(u.temas||[]).length; },0);

  var statsWrap = document.createElement('div'); statsWrap.className='grid-s'; statsWrap.style.marginBottom='1.5rem';
  [{ico:'🗂',label:'Bloques',val:bloques.length},{ico:'📚',label:'Unidades didácticas',val:totalUDs},
   {ico:'⏱',label:'Horas totales',val:totalHoras},{ico:'📝',label:'Temas',val:totalTemas},
   {ico:'🎯',label:'RA vinculados',val:allRA.length}
  ].forEach(function(s){
    var sc=document.createElement('div'); sc.className='sc';
    sc.innerHTML='<div class="sl">'+s.ico+' '+s.label+'</div><div class="sn" style="font-size:20px">'+s.val+'</div>';
    statsWrap.appendChild(sc);
  });
  root.appendChild(statsWrap);

  // ── Aviso pedagógico ──────────────────────────────────
  var aviso = document.createElement('div');
  aviso.style.cssText='padding:10px 14px;background:#f0f4ff;border-radius:var(--r);border-left:3px solid #3730a3;font-size:13px;color:#3730a3;margin-bottom:1.5rem';
  aviso.innerHTML='<strong>ℹ️ Recuerda:</strong> Aquí gestionas la estructura (bloques, unidades, temas y RA). Para añadir apuntes, fórmulas o vídeos a cada tema, ve a <strong>Bloques del módulo</strong> en el menú lateral.';
  root.appendChild(aviso);

  // ── Lista de bloques ──────────────────────────────────
  bloques.forEach(function(bloque, bIdx){
    root.appendChild(renderBloqueCard(bloque, bIdx, bloques, root));
  });
}

function renderBloqueCard(bloque, bIdx, bloques, root){
  var card = document.createElement('div'); card.className='card';
  card.style.cssText='margin-bottom:16px;border-left:5px solid '+bloque.color+';padding:0;overflow:visible';

  // ── Cabecera del bloque ───────────────────────────────
  var bHdr = document.createElement('div');
  bHdr.style.cssText='display:flex;align-items:center;gap:12px;padding:14px 16px;background:'+bloque.color+';border-radius:calc(var(--rl) - 1px) calc(var(--rl) - 1px) 0 0';

  var bTit = document.createElement('div'); bTit.style.cssText='flex:1;font-family:"Playfair Display",serif;font-size:15px;font-weight:700;color:#fff';
  bTit.textContent = bloque.titulo;

  var bBtns = document.createElement('div'); bBtns.style.cssText='display:flex;gap:6px';

  var btnEditBloque = document.createElement('button');
  btnEditBloque.style.cssText='background:rgba(255,255,255,.15);border:none;color:#fff;border-radius:7px;padding:5px 12px;cursor:pointer;font-size:12px;font-weight:600';
  btnEditBloque.textContent='✎ Editar bloque';
  btnEditBloque.onclick=(function(b,bi){ return function(){ abrirModalEditarBloque(b, bi, bloques, root); }; })(bloque, bIdx);

  var btnAddUD = document.createElement('button');
  btnAddUD.style.cssText='background:rgba(255,255,255,.2);border:none;color:#fff;border-radius:7px;padding:5px 12px;cursor:pointer;font-size:12px;font-weight:600';
  btnAddUD.textContent='+ UD';
  btnAddUD.onclick=(function(b,bi){ return function(){ abrirModalNuevaUD(b, bi, bloques, root); }; })(bloque, bIdx);

  var btnDelBloque = document.createElement('button');
  btnDelBloque.style.cssText='background:rgba(220,38,38,.4);border:none;color:#fff;border-radius:7px;padding:5px 10px;cursor:pointer;font-size:12px';
  btnDelBloque.textContent='✕';
  btnDelBloque.onclick=(function(bi){ return function(){
    if(!confirm('¿Eliminar este bloque? Las unidades didácticas que contiene permanecerán en el módulo pero sin bloque asignado.')) return;
    bloques.splice(bi, 1);
    saveBloques(bloques);
    renderContenidos(root);
  }; })(bIdx);

  bBtns.appendChild(btnEditBloque); bBtns.appendChild(btnAddUD); bBtns.appendChild(btnDelBloque);
  bHdr.appendChild(bTit); bHdr.appendChild(bBtns);
  card.appendChild(bHdr);

  // ── Unidades del bloque ───────────────────────────────
  var udsWrap = document.createElement('div'); udsWrap.style.cssText='padding:12px 16px';

  var udIds = bloque.udIds || [];
  if(!udIds.length){
    var empty = document.createElement('div');
    empty.style.cssText='font-size:13px;color:var(--muted);padding:12px 0;text-align:center';
    empty.textContent='Sin unidades didácticas. Pulsa "+ UD" para añadir una.';
    udsWrap.appendChild(empty);
  }

  udIds.forEach(function(udId, udIdx){
    var u = UNIDADES.find(function(x){ return x.id===udId; });
    if(!u) return;
    udsWrap.appendChild(renderUDEnBloque(u, udIdx, bloque, bIdx, bloques, root));
  });

  card.appendChild(udsWrap);
  return card;
}

function renderUDEnBloque(u, udIdx, bloque, bIdx, bloques, root){
  var raData = getRADeUD(u.id);
  var wrap = document.createElement('div');
  wrap.style.cssText='border:1px solid var(--border);border-radius:var(--r);padding:12px 14px;margin-bottom:10px;background:var(--surface)';

  // Cabecera UD
  var udHdr = document.createElement('div'); udHdr.style.cssText='display:flex;align-items:flex-start;gap:10px;margin-bottom:10px';

  var udNum = document.createElement('div');
  udNum.style.cssText='width:34px;height:34px;border-radius:8px;background:var(--navy);color:var(--gold-light);display:flex;align-items:center;justify-content:center;font-family:"Playfair Display",serif;font-size:15px;font-weight:700;flex-shrink:0';
  udNum.textContent = u.n;

  var udInfo = document.createElement('div'); udInfo.style.flex='1';
  udInfo.innerHTML=
    '<div style="font-size:14px;font-weight:700;color:var(--text)">'+u.titulo+'</div>'+
    '<div style="font-size:12px;color:var(--muted);margin-top:2px">'+u.horas+' horas · '+
      (raData.length ? raData.map(function(r){ return '<span style="background:#f0f4ff;color:#3730a3;padding:1px 6px;border-radius:10px;font-size:10px;font-weight:600;margin-right:3px">'+r.id+'</span>'; }).join('') : '<span style="color:var(--muted);font-size:11px">Sin RA vinculados</span>')+
    '</div>';

  var udBtns = document.createElement('div'); udBtns.style.cssText='display:flex;gap:5px;flex-shrink:0';

  var btnEditUD = document.createElement('button'); btnEditUD.className='btn btn-g btn-sm';
  btnEditUD.textContent='✎ Editar UD';
  btnEditUD.onclick=(function(uid){ return function(){ abrirModalEditarUDContenidos(uid, bloques, root); }; })(u.id);

  var btnRA = document.createElement('button'); btnRA.className='btn btn-g btn-sm';
  btnRA.style.cssText='background:'+(raData.length?'var(--green-bg)':'var(--amber-bg)')+';color:'+(raData.length?'var(--green)':'var(--amber)')+';border-color:'+(raData.length?'#bbf7d0':'#fde68a');
  btnRA.innerHTML='🎯 RA ('+raData.length+')';
  btnRA.onclick=(function(uid){ return function(){ abrirModalVincularRA(uid, bloques, root); }; })(u.id);

  var btnVerUD = document.createElement('button'); btnVerUD.className='btn btn-p btn-sm';
  btnVerUD.textContent='→ Ver bloque';
  btnVerUD.onclick=(function(uid){ return function(){ goTo(uid, null); }; })(u.id);

  var btnQuitarUD = document.createElement('button'); btnQuitarUD.className='btn btn-d btn-sm';
  btnQuitarUD.title='Quitar del bloque';
  btnQuitarUD.textContent='✕';
  btnQuitarUD.onclick=(function(bi,uidToRemove){ return function(){
    if(!confirm('¿Quitar esta UD del bloque? La UD no se elimina, solo se desvincula del bloque.')) return;
    bloques[bi].udIds = bloques[bi].udIds.filter(function(id){ return id!==uidToRemove; });
    saveBloques(bloques);
    renderContenidos(root);
  }; })(bIdx, u.id);

  [btnEditUD, btnRA, btnVerUD, btnQuitarUD].forEach(function(b){ udBtns.appendChild(b); });
  udHdr.appendChild(udNum); udHdr.appendChild(udInfo); udHdr.appendChild(udBtns);
  wrap.appendChild(udHdr);

  // Descripción
  if(u.desc){
    var descEl = document.createElement('div');
    descEl.style.cssText='font-size:12.5px;color:var(--muted);line-height:1.6;margin-bottom:10px;padding:8px 10px;background:var(--surface2);border-radius:var(--r)';
    descEl.textContent = u.desc;
    wrap.appendChild(descEl);
  }

  // Temas
  var temasHdr = document.createElement('div');
  temasHdr.style.cssText='display:flex;align-items:center;justify-content:space-between;margin-bottom:6px';
  temasHdr.innerHTML='<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)">📝 Temas ('+((u.temas||[]).length)+')</div>';

  var btnEditTemas = document.createElement('button'); btnEditTemas.className='btn btn-g btn-sm';
  btnEditTemas.style.fontSize='11px'; btnEditTemas.textContent='✎ Editar temas';
  btnEditTemas.onclick=(function(uid){ return function(){ abrirModalEditarTemas(uid, bloques, root); }; })(u.id);
  temasHdr.appendChild(btnEditTemas);
  wrap.appendChild(temasHdr);

  if(u.temas && u.temas.length){
    var temasWrap = document.createElement('div'); temasWrap.style.cssText='display:flex;flex-wrap:wrap;gap:5px';
    u.temas.forEach(function(t, i){
      var chip = document.createElement('span');
      chip.style.cssText='background:var(--surface2);border:1px solid var(--border);border-radius:20px;padding:3px 10px;font-size:11.5px;color:var(--muted)';
      chip.textContent=(i+1)+'. '+t;
      temasWrap.appendChild(chip);
    });
    wrap.appendChild(temasWrap);
  } else {
    var noTemas = document.createElement('div');
    noTemas.style.cssText='font-size:12px;color:var(--dim);font-style:italic';
    noTemas.textContent='Sin temas definidos. Pulsa "Editar temas" para añadir.';
    wrap.appendChild(noTemas);
  }

  return wrap;
}

// ── Modal: Nuevo bloque ───────────────────────────────
function abrirModalNuevoBloque(bloques, root){
  abrirModal('Nuevo bloque',
    '<div class="fg"><label class="fl">Título del bloque</label>'+
    '<input class="fi" id="nb-titulo" placeholder="Ej: Bloque 7 · Análisis Financiero"></div>'+
    '<div class="fg"><label class="fl">Color identificativo</label>'+
    '<input type="color" id="nb-color" value="#1a2744" style="width:60px;height:36px;border:none;border-radius:6px;cursor:pointer"></div>',
    '<button class="btn btn-g" onclick="cerrarModal()">Cancelar</button>'+
    '<button class="btn btn-p" onclick="guardarNuevoBloque()">Crear bloque</button>'
  );
  window._bloquesRef = bloques;
  window._contenidosRoot = root;
}

function guardarNuevoBloque(){
  var titulo = (document.getElementById('nb-titulo')||{value:''}).value.trim();
  var color  = (document.getElementById('nb-color')||{value:'#1a2744'}).value;
  if(!titulo){ flash('Introduce un título para el bloque','#dc2626'); return; }
  var bloques = window._bloquesRef;
  bloques.push({ id:'bloque'+Date.now(), titulo:titulo, color:color, udIds:[] });
  saveBloques(bloques);
  cerrarModal();
  renderContenidos(window._contenidosRoot);
  flash('Bloque creado','#16a34a');
}

// ── Modal: Editar bloque ──────────────────────────────
function abrirModalEditarBloque(bloque, bIdx, bloques, root){
  // Unidades disponibles para añadir al bloque
  var udsEnBloque = bloque.udIds || [];
  var udsDisponibles = UNIDADES.filter(function(u){
    return !bloques.some(function(b){ return b.udIds && b.udIds.includes(u.id) && b.id!==bloque.id; });
  });
  var udsLibres = UNIDADES.filter(function(u){
    return !bloques.some(function(b){ return b.udIds && b.udIds.includes(u.id); });
  });

  var checkUDs = UNIDADES.map(function(u){
    var enEsteBloque = udsEnBloque.includes(u.id);
    var enOtroBloque = !enEsteBloque && bloques.some(function(b){ return b.id!==bloque.id && b.udIds && b.udIds.includes(u.id); });
    return '<label style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);cursor:'+(enOtroBloque?'not-allowed':'pointer')+'">'+
      '<input type="checkbox" class="eb-ud-chk" value="'+u.id+'"'+(enEsteBloque?' checked':'')+(enOtroBloque?' disabled':'')+' style="width:15px;height:15px">'+
      '<div><div style="font-size:13px;font-weight:600'+(enOtroBloque?';color:var(--dim)':'')+'">'+'B'+u.n+' · '+u.titulo+'</div>'+
      '<div style="font-size:11px;color:var(--muted)">'+u.horas+'h'+(enOtroBloque?' · <em>En otro bloque</em>':'')+'</div></div>'+
    '</label>';
  }).join('');

  abrirModal('Editar bloque',
    '<div class="fg"><label class="fl">Título</label>'+
    '<input class="fi" id="eb-titulo" value="'+bloque.titulo+'"></div>'+
    '<div class="fg"><label class="fl">Color</label>'+
    '<input type="color" id="eb-color" value="'+bloque.color+'" style="width:60px;height:36px;border:none;border-radius:6px;cursor:pointer"></div>'+
    '<div class="fg"><label class="fl" style="margin-bottom:8px">Unidades didácticas incluidas</label>'+
    '<div style="max-height:220px;overflow-y:auto;border:1px solid var(--border);border-radius:var(--r);padding:4px 12px">'+checkUDs+'</div>'+
    '<div style="font-size:11.5px;color:var(--muted);margin-top:5px">Las UDs en otro bloque aparecen desactivadas.</div></div>',
    '<button class="btn btn-g" onclick="cerrarModal()">Cancelar</button>'+
    '<button class="btn btn-p" onclick="guardarEditarBloque()">Guardar</button>'
  );
  document.getElementById('modal').querySelector('.modal').style.maxWidth='600px';
  window._bloqueEditIdx = bIdx;
  window._bloquesRef = bloques;
  window._contenidosRoot = root;
}

function guardarEditarBloque(){
  var titulo = (document.getElementById('eb-titulo')||{value:''}).value.trim();
  var color  = (document.getElementById('eb-color')||{value:'#1a2744'}).value;
  if(!titulo){ flash('El bloque necesita un título','#dc2626'); return; }
  var udIds = [];
  document.querySelectorAll('.eb-ud-chk:checked').forEach(function(c){ udIds.push(c.value); });
  var bloques = window._bloquesRef;
  var bIdx = window._bloqueEditIdx;
  bloques[bIdx].titulo = titulo;
  bloques[bIdx].color  = color;
  bloques[bIdx].udIds  = udIds;
  saveBloques(bloques);
  cerrarModal();
  renderContenidos(window._contenidosRoot);
  flash('Bloque actualizado','#16a34a');
}

// ── Modal: Nueva UD dentro de un bloque ──────────────
function abrirModalNuevaUD(bloque, bIdx, bloques, root){
  // Mostrar UDs libres (no asignadas a ningún bloque)
  var udsLibres = UNIDADES.filter(function(u){
    return !bloques.some(function(b){ return b.udIds && b.udIds.includes(u.id); });
  });

  var optsLibres = udsLibres.length ?
    '<div style="font-size:12px;font-weight:600;color:var(--muted);margin-bottom:8px">Añadir UD existente (sin bloque asignado):</div>'+
    '<div style="max-height:150px;overflow-y:auto;border:1px solid var(--border);border-radius:var(--r);padding:4px 10px;margin-bottom:14px">'+
      udsLibres.map(function(u){
        return '<label style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);cursor:pointer">'+
          '<input type="radio" name="nud-existente" value="'+u.id+'" style="width:14px;height:14px">'+
          '<div><div style="font-size:13px;font-weight:600">B'+u.n+' · '+u.titulo+'</div>'+
          '<div style="font-size:11px;color:var(--muted)">'+u.horas+'h</div></div></label>';
      }).join('')+
    '</div>' : '';

  abrirModal('Añadir Unidad Didáctica al bloque',
    '<div style="font-size:13px;color:var(--muted);margin-bottom:14px">Bloque destino: <strong>'+bloque.titulo+'</strong></div>'+
    optsLibres+
    '<div style="font-size:12px;font-weight:600;color:var(--muted);margin-bottom:8px">O crear nueva UD:</div>'+
    '<div class="g2"><div class="fg"><label class="fl">Número</label>'+
    '<input class="fi" id="nud-n" type="number" min="1" max="30" placeholder="6"></div>'+
    '<div class="fg"><label class="fl">Horas</label>'+
    '<input class="fi" id="nud-horas" type="number" min="1" value="14"></div></div>'+
    '<div class="fg"><label class="fl">Título <span style="color:var(--red)">*</span></label>'+
    '<input class="fi" id="nud-titulo" placeholder="Ej: Análisis de inversiones"></div>'+
    '<div class="fg"><label class="fl">Descripción</label>'+
    '<textarea class="fta" id="nud-desc" rows="2" placeholder="Descripción breve..."></textarea></div>'+
    '<div class="fg"><label class="fl">Temas (uno por línea)</label>'+
    '<textarea class="fta" id="nud-temas" rows="4" placeholder="Concepto 1&#10;Concepto 2"></textarea></div>',
    '<button class="btn btn-g" onclick="cerrarModal()">Cancelar</button>'+
    '<button class="btn btn-p" onclick="guardarNuevaUDEnBloque()">Añadir al bloque</button>'
  );
  document.getElementById('modal').querySelector('.modal').style.maxWidth='600px';
  window._bloqueEditIdx = bIdx;
  window._bloquesRef = bloques;
  window._contenidosRoot = root;
}

function guardarNuevaUDEnBloque(){
  var bloques = window._bloquesRef;
  var bIdx    = window._bloqueEditIdx;
  var root    = window._contenidosRoot;

  // Opción A: añadir UD existente
  var existenteChk = document.querySelector('input[name="nud-existente"]:checked');
  if(existenteChk){
    var udId = existenteChk.value;
    if(!bloques[bIdx].udIds.includes(udId)){
      bloques[bIdx].udIds.push(udId);
      saveBloques(bloques);
    }
    cerrarModal();
    renderContenidos(root);
    flash('UD añadida al bloque','#16a34a');
    return;
  }

  // Opción B: crear nueva UD
  var n     = parseInt((document.getElementById('nud-n')||{value:''}).value);
  var horas = parseInt((document.getElementById('nud-horas')||{value:'14'}).value)||14;
  var titulo= (document.getElementById('nud-titulo')||{value:''}).value.trim();
  var desc  = (document.getElementById('nud-desc')||{value:''}).value.trim();
  var temas = (document.getElementById('nud-temas')||{value:''}).value.split('\n').map(function(t){ return t.trim(); }).filter(Boolean);

  if(!titulo){ flash('Introduce el título de la UD','#dc2626'); return; }
  if(!n||n<1){ flash('Introduce el número de la UD','#dc2626'); return; }
  if(UNIDADES.find(function(u){ return u.n===n; })){ flash('Ya existe una UD'+n,'#dc2626'); return; }

  var id = 'ud'+n;
  var newUD = { id:id, n:n, titulo:titulo, horas:horas, prog:0, desc:desc, temas:temas };
  UNIDADES.push(newUD);
  UNIDADES.sort(function(a,b){ return a.n-b.n; });

  // Añadir al bloque
  if(!bloques[bIdx].udIds) bloques[bIdx].udIds=[];
  bloques[bIdx].udIds.push(id);
  saveBloques(bloques);

  // Crear page div
  if(!document.getElementById('page-'+id)){
    var pageDiv=document.createElement('div'); pageDiv.className='page'; pageDiv.id='page-'+id;
    var inner=document.createElement('div'); inner.id='cont-'+id;
    pageDiv.appendChild(inner);
    var bolsaPage=document.getElementById('page-bolsa');
    if(bolsaPage) bolsaPage.parentNode.insertBefore(pageDiv, bolsaPage);
  }

  actualizarNavUnidades();
  cerrarModal();
  renderContenidos(root);
  renderDashboard();
  flash('UD'+n+' creada y añadida al bloque','#16a34a');
}

// ── Modal: Editar UD (título, horas, desc) ────────────
function abrirModalEditarUDContenidos(udId, bloques, root){
  var u = UNIDADES.find(function(x){ return x.id===udId; });
  if(!u) return;
  abrirModal('Editar UD'+u.n+' · '+u.titulo,
    '<div class="g2"><div class="fg"><label class="fl">Número</label>'+
    '<input class="fi" id="eud-n" type="number" value="'+u.n+'" disabled></div>'+
    '<div class="fg"><label class="fl">Horas</label>'+
    '<input class="fi" id="eud-horas" type="number" value="'+u.horas+'"></div></div>'+
    '<div class="fg"><label class="fl">Título</label>'+
    '<input class="fi" id="eud-titulo" value="'+u.titulo+'"></div>'+
    '<div class="fg"><label class="fl">Descripción</label>'+
    '<textarea class="fta" id="eud-desc" rows="3">'+u.desc+'</textarea></div>'+
    '<div class="fg"><label class="fl">Progreso (%)</label>'+
    '<input class="fi" id="eud-prog" type="number" min="0" max="100" value="'+u.prog+'"></div>',
    '<button class="btn btn-d btn-sm" style="margin-right:auto" onclick="eliminarUD(\''+udId+'\')">🗑 Eliminar UD</button>'+
    '<button class="btn btn-g" onclick="cerrarModal()">Cancelar</button>'+
    '<button class="btn btn-p" onclick="guardarEditarUDCont(\''+udId+'\')">Guardar</button>'
  );
  document.getElementById('modal').querySelector('.modal').style.maxWidth='560px';
  window._bloquesRef = bloques;
  window._contenidosRoot = root;
}

function guardarEditarUDCont(udId){
  var u = UNIDADES.find(function(x){ return x.id===udId; });
  if(!u){ flash('UD no encontrada','#dc2626'); return; }
  u.horas  = parseInt((document.getElementById('eud-horas')||{value:u.horas}).value)||u.horas;
  u.titulo = (document.getElementById('eud-titulo')||{value:u.titulo}).value.trim()||u.titulo;
  u.desc   = (document.getElementById('eud-desc')||{value:''}).value.trim();
  u.prog   = parseInt((document.getElementById('eud-prog')||{value:'0'}).value)||0;
  actualizarNavUnidades();
  cerrarModal();
  renderContenidos(window._contenidosRoot);
  renderDashboard();
  flash('UD actualizada','#16a34a');
}

function eliminarUD(udId){
  if(!confirm('¿Eliminar esta UD? Se eliminará del módulo y de todos los bloques.')) return;
  UNIDADES = UNIDADES.filter(function(u){ return u.id!==udId; });
  var bloques = window._bloquesRef;
  bloques.forEach(function(b){ b.udIds=(b.udIds||[]).filter(function(id){ return id!==udId; }); });
  saveBloques(bloques);
  delete RA_CE_DATA[udId]; saveRACE();
  actualizarNavUnidades();
  cerrarModal();
  renderContenidos(window._contenidosRoot);
  renderDashboard();
  flash('UD eliminada','#16a34a');
}

// ── Modal: Editar temas de una UD ─────────────────────
function abrirModalEditarTemas(udId, bloques, root){
  var u = UNIDADES.find(function(x){ return x.id===udId; });
  if(!u) return;
  var temasActuales = (u.temas||[]).join('\n');
  abrirModal('📋 Índice de contenidos · '+u.titulo,
    '<div style="font-size:12.5px;color:var(--muted);margin-bottom:8px">'+
    '<strong>Formato:</strong> Un tema por línea. Para añadir subapartados, empieza la línea con <code style="background:var(--surface2);padding:1px 5px;border-radius:4px">-</code> o con dos espacios.<br>'+
    '<span style="color:var(--dim)">Ejemplo: <em>1. Fuentes de financiación → - Propias → - Ajenas</em></span></div>'+
    '<textarea class="fta" id="eud-temas-txt" rows="12" style="font-size:13px;font-family:monospace">'+temasActuales+'</textarea>',
    '<button class="btn btn-g" onclick="cerrarModal()">Cancelar</button>'+
    '<button class="btn btn-p" onclick="guardarTemas(\''+udId+'\')">Guardar temas</button>'
  );
  document.getElementById('modal').querySelector('.modal').style.maxWidth='560px';
  window._bloquesRef = bloques;
  window._contenidosRoot = root;
}

function guardarTemas(udId){
  var u = UNIDADES.find(function(x){ return x.id===udId; });
  if(!u) return;
  var txt = (document.getElementById('eud-temas-txt')||{value:''}).value;
  u.temas = txt.split('\n').map(function(t){ return t.trim(); }).filter(Boolean);
  cerrarModal();
  saveUNIDADES();
  if(window._contenidosRoot) renderContenidos(window._contenidosRoot);
  renderUD(u);
  flash('Temas guardados ('+u.temas.length+')','#16a34a');
}

// ── Modal: Vincular RA a una UD ───────────────────────
function abrirModalVincularRA(udId, bloques, root){
  var u = UNIDADES.find(function(x){ return x.id===udId; });
  if(!u) return;
  initPond();
  var raActuales = getRADeUD(udId).map(function(r){ return r.id; });

  // Todos los RA del módulo con su bloque de origen
  var allRA = getAllRA();
  if(!allRA.length){
    abrirModal('Vincular RA',
      '<div class="alert al-w">No hay RA configurados en el módulo. Ve a <strong>Evaluación → RA/CE</strong> para crearlos primero.</div>',
      '<button class="btn btn-g" onclick="cerrarModal()">Cerrar</button>'
    );
    return;
  }

  var checkRA = allRA.map(function(item){
    var checked = raActuales.includes(item.ra.id);
    var pond = (POND[item.ra.id]||{pct:item.ra.ponderacion||0}).pct;
    return '<label style="display:flex;align-items:flex-start;gap:8px;padding:8px 0;border-bottom:1px solid var(--border);cursor:pointer">'+
      '<input type="checkbox" class="vra-chk" value="'+item.ra.id+'"'+(checked?' checked':'')+' style="margin-top:3px;width:15px;height:15px;flex-shrink:0">'+
      '<div>'+
        '<div style="font-size:13px;font-weight:600">'+item.ra.id+'</div>'+
        '<div style="font-size:12px;color:var(--muted);line-height:1.4">'+item.ra.nombre+'</div>'+
        '<div style="font-size:11px;color:var(--dim);margin-top:2px">'+item.ra.ce.length+' CE · '+pond+'% del módulo · definido en B'+item.ud.n+'</div>'+
      '</div>'+
    '</label>';
  }).join('');

  abrirModal('🎯 Vincular RA · '+u.titulo,
    '<div style="font-size:12.5px;color:var(--muted);margin-bottom:10px">Selecciona los RA que se trabajan en esta unidad. Los RA siguen gestionándose desde <strong>Evaluación</strong>.</div>'+
    '<div style="max-height:300px;overflow-y:auto;border:1px solid var(--border);border-radius:var(--r);padding:4px 12px">'+checkRA+'</div>',
    '<button class="btn btn-g" onclick="cerrarModal()">Cancelar</button>'+
    '<button class="btn btn-p" onclick="guardarVincularRA(\''+udId+'\')">Guardar vinculación</button>'
  );
  document.getElementById('modal').querySelector('.modal').style.maxWidth='580px';
  window._bloquesRef = bloques;
  window._contenidosRoot = root;
}

function guardarVincularRA(udId){
  var u = UNIDADES.find(function(x){ return x.id===udId; });
  if(!u) return;
  var seleccionados = [];
  document.querySelectorAll('.vra-chk:checked').forEach(function(c){ seleccionados.push(c.value); });

  // Separar: RA propios (definidos en RA_CE_DATA[udId]) vs vinculados
  var propios = (RA_CE_DATA[udId]||{ra:[]}).ra.map(function(r){ return r.id; });
  var vinculados = seleccionados.filter(function(id){ return !propios.includes(id); });
  u.raVinculados = vinculados;

  cerrarModal();
  saveUNIDADES();
  if(window._contenidosRoot) renderContenidos(window._contenidosRoot);
  renderUD(u);
  flash('Vinculación de RA actualizada','#16a34a');
}

function actualizarNavUnidades(){
  var subUd = document.getElementById('sub-ud');
  if(!subUd) return;

  // Asegurar page-divs para todas las UDs
  UNIDADES.forEach(function(u){
    if(!document.getElementById('page-'+u.id)){
      var pageDiv = document.createElement('div');
      pageDiv.className = 'page'; pageDiv.id = 'page-'+u.id;
      var inner = document.createElement('div'); inner.id = 'cont-'+u.id;
      pageDiv.appendChild(inner);
      var ref = document.getElementById('page-bolsa');
      if(ref) ref.parentNode.insertBefore(pageDiv, ref);
    }
  });

  // Reconstruir menú completo siempre desde UNIDADES
  subUd.innerHTML = '';
  UNIDADES.forEach(function(u){
    var btn = document.createElement('button');
    btn.className = 'nav-subitem';
    btn.dataset.ud = u.id;
    btn.textContent = 'B'+u.n+' · '+u.titulo.slice(0,26);
    btn.onclick = (function(uid){ return function(){ goTo(uid, this); }; })(u.id);
    subUd.appendChild(btn);
  });
}


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
  // Para mapa conceptual, guardar nodos y conexiones del editor (si el editor externo está cargado)
  var tipoActual = (document.getElementById('bq-tipo')||{value:'test'}).value;
  if(tipoActual === 'mapa'){
    var formArea = document.getElementById('bq-form-area');
    if(formArea && formArea._getNodos){
      window._mapaNodos = formArea._getNodos();
      window._mapaConexiones = formArea._getConexiones();
    } else {
      // El editor de mapa no está disponible en este contexto — abortar con aviso
      flash('El editor de mapas conceptuales no está disponible aquí. Usa el banco de preguntas extendido.','#dc2626');
      return;
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
  gfConfirm('¿Eliminar esta pregunta del banco?','Eliminar',function(){
    var banco=getBanco().filter(function(p){return p.id!==id;}); saveBanco(banco);
    var root=document.getElementById('banco-root'); if(root) renderBancoVista(root);
    flash('Pregunta eliminada','#16a34a');
  });
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

// Almacena los tests de aprendizaje lanzados/completados
var UD_TESTS_KEY = 'gf_ud_tests';
function getUDTests(){ try{ return JSON.parse(localStorage.getItem(UD_TESTS_KEY)||'{}'); }catch(e){ return {}; } }
function saveUDTests(obj){ localStorage.setItem(UD_TESTS_KEY, JSON.stringify(obj)); }

// ── Bloque Actividades de Aprendizaje (colLeft) ───────
function renderActAprendBlock(u, colLeft){
  var card = document.createElement('div');
  card.className = 'card'; card.style.marginBottom = '1.25rem';

  var hdr = document.createElement('div');
  hdr.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:12px';
  var tit = document.createElement('h3'); tit.style.cssText='font-size:14px;font-weight:600';
  tit.textContent = '📝 Actividades de Aprendizaje';
  hdr.appendChild(tit);
  if(ROL==='profesor'){
    var btnGroup = document.createElement('div'); btnGroup.style.cssText='display:flex;gap:5px';
    var btnBoletinTest = document.createElement('button'); btnBoletinTest.className='btn btn-g btn-sm';
    btnBoletinTest.textContent='🧠 Boletín test';
    btnBoletinTest.onclick=(function(uid){ return function(){ abrirModalBoletinAprend(uid,'test'); }; })(u.id);
    var btnBoletinDes = document.createElement('button'); btnBoletinDes.className='btn btn-g btn-sm';
    btnBoletinDes.textContent='✏️ Boletín desarrollo';
    btnBoletinDes.onclick=(function(uid){ return function(){ abrirModalBoletinAprend(uid,'desarrollo'); }; })(u.id);
    var btnBoletinMapa = document.createElement('button'); btnBoletinMapa.className='btn btn-g btn-sm';
    btnBoletinMapa.textContent='🗺️ Mapa conceptual';
    btnBoletinMapa.onclick=(function(uid){ return function(){ abrirModalBoletinAprend(uid,'mapa'); }; })(u.id);
    var btnNueva = document.createElement('button'); btnNueva.className='btn btn-p btn-sm';
    btnNueva.textContent='+ Añadir';
    btnNueva.onclick=(function(uid){ return function(){ editarActAprend(uid, null); }; })(u.id);
    [btnBoletinTest, btnBoletinDes, btnBoletinMapa, btnNueva].forEach(function(b){ btnGroup.appendChild(b); });
    hdr.appendChild(btnGroup);
  }
  card.appendChild(hdr);

  // Aviso
  var aviso=document.createElement('div');
  aviso.style.cssText='font-size:12px;color:var(--muted);margin-bottom:12px;padding:8px 12px;background:var(--surface2);border-radius:var(--r);border-left:3px solid var(--navy)';
  aviso.textContent='Actividades de libre repetición. No puntúan. Diseñadas para reforzar los contenidos.';
  card.appendChild(aviso);

  var actAprend = ACT_APRENDIZAJE[u.id] || [];
  var tipoIcon={test:'🧠',practica:'✏️',lectura:'📖',mapa:'🗺️',banco_test:'🎯',banco_desarrollo:'✏️',banco_calculo:'🧮',banco_mapa:'🗺️'};
  var tipoBadge={test:'b-blue',practica:'b-green',lectura:'b-amber',mapa:'b-purple',banco_test:'b-purple',banco_desarrollo:'b-blue',banco_calculo:'b-green',banco_mapa:'b-purple'};
  var tipoLabel={test:'Test autocorregible',practica:'Práctica',lectura:'Lectura',mapa:'Mapa conceptual',banco_test:'Boletín test',banco_desarrollo:'Boletín desarrollo',banco_calculo:'Cálculo del banco',banco_mapa:'Mapa conceptual'};

  if(!actAprend.length){
    var empty=document.createElement('p'); empty.style.cssText='font-size:13px;color:var(--muted)';
    empty.textContent='No hay actividades de aprendizaje configuradas.';
    card.appendChild(empty);
  } else {
    actAprend.forEach(function(a){
      var row=document.createElement('div');
      row.style.cssText='padding:10px 0;border-bottom:1px solid var(--border)';

      var top=document.createElement('div'); top.style.cssText='display:flex;align-items:flex-start;gap:10px';
      var ico=document.createElement('div'); ico.style.cssText='font-size:1.3rem;flex-shrink:0;margin-top:2px';
      ico.textContent=tipoIcon[a.tipo]||'📌';
      var info=document.createElement('div'); info.style.flex='1';
      info.innerHTML='<div style="display:flex;align-items:center;gap:7px;margin-bottom:3px;flex-wrap:wrap">'+
        '<div style="font-size:13.5px;font-weight:500">'+a.titulo+'</div>'+
        '<span class="badge '+(tipoBadge[a.tipo]||'b-gray')+'" style="font-size:10px">'+(tipoLabel[a.tipo]||a.tipo)+'</span>'+
        (a.obligatoria?'<span class="badge b-red" style="font-size:10px">🔴 Obligatoria</span>':'<span class="badge b-gray" style="font-size:10px">⚪ Opcional</span>')+
        '</div>'+
        (a.desc?'<div style="font-size:12px;color:var(--muted)">'+a.desc+'</div>':'');
      top.appendChild(ico); top.appendChild(info);

      // Historial badge
      var hist = a.historial||[];
      if(hist.length){
        var mejorNota=Math.max.apply(null,hist.map(function(h){return h.nota;}));
        var histBadge=document.createElement('div');
        histBadge.style.cssText='display:flex;gap:5px;flex-wrap:wrap;margin-top:5px;margin-bottom:2px';
        var b1=document.createElement('span'); b1.className='badge b-gray'; b1.style.fontSize='10px';
        b1.textContent='📈 '+hist.length+' intento'+(hist.length!==1?'s':'');
        var b2=document.createElement('span'); b2.className='badge '+(mejorNota>=5?'b-green':'b-red'); b2.style.fontSize='10px';
        b2.textContent='⭐ Mejor: '+mejorNota.toFixed(1)+'/10';
        var b3=document.createElement('span'); b3.className='badge b-blue'; b3.style.fontSize='10px';
        b3.textContent='🕐 Último: '+hist[0].fecha;
        histBadge.appendChild(b1); histBadge.appendChild(b2); histBadge.appendChild(b3);
        row.appendChild(histBadge);
      }

      var btnsRow = document.createElement('div');
      btnsRow.style.cssText = 'display:flex;gap:5px;flex-shrink:0;align-items:flex-start;flex-wrap:wrap;margin-top:4px';

      // Botón realizar (banco_test, banco_desarrollo o banco_calculo)
      if(a.tipo==='banco_test'||a.tipo==='banco_desarrollo'||a.tipo==='banco_calculo'||a.tipo==='banco_mapa'){
        var btnRealizar=document.createElement('button');
        btnRealizar.className='btn btn-p btn-sm'; btnRealizar.style.fontSize='12px';
        btnRealizar.textContent='▶ Realizar';
        btnRealizar.onclick=(function(act,uid){ return function(){ lanzarActividadAprendizaje(act,uid); }; })(a,u.id);
        btnsRow.appendChild(btnRealizar);
      }

      if(ROL==='profesor'){
        // Botón obligatoria
        var btnOblig = document.createElement('button');
        btnOblig.className = 'btn btn-sm';
        btnOblig.style.cssText = 'font-size:11px;background:'+(a.obligatoria?'var(--red-bg)':'var(--surface2)')+
          ';color:'+(a.obligatoria?'var(--red)':'var(--muted)')+
          ';border:1px solid '+(a.obligatoria?'#fecaca':'var(--border)');
        btnOblig.textContent = a.obligatoria ? '🔴 Obligatoria' : '⚪ Opcional';
        btnOblig.title = 'Marcar como obligatoria / opcional';
        btnOblig.onclick=(function(act,uid){ return function(e){
          e.stopPropagation();
          act.obligatoria = !act.obligatoria;
          saveActAprend();
          renderUD(UNIDADES.find(function(x){ return x.id===uid; }));
        }; })(a,u.id);
        btnsRow.appendChild(btnOblig);

        // Botón editar
        var btnEdit = document.createElement('button'); btnEdit.className='btn btn-g btn-sm';
        btnEdit.style.fontSize='11px'; btnEdit.textContent='✎';
        btnEdit.title='Editar actividad';
        btnEdit.onclick=(function(act,uid){ return function(e){
          e.stopPropagation(); editarActAprend(uid, act.id);
        }; })(a,u.id);
        btnsRow.appendChild(btnEdit);

        // Botón borrar
        var btnDel = document.createElement('button'); btnDel.className='btn btn-d btn-sm';
        btnDel.style.fontSize='11px'; btnDel.textContent='✕';
        btnDel.title='Eliminar actividad';
        btnDel.onclick=(function(act,uid){ return function(e){
          e.stopPropagation();
          if(!confirm('¿Eliminar esta actividad?')) return;
          ACT_APRENDIZAJE[uid]=(ACT_APRENDIZAJE[uid]||[]).filter(function(x){ return x.id!==act.id; });
          saveActAprend();
          renderUD(UNIDADES.find(function(x){ return x.id===uid; }));
        }; })(a,u.id);
        btnsRow.appendChild(btnDel);
      }

      top.appendChild(btnsRow);
      row.appendChild(top);
      card.appendChild(row);
    });
  }

  colLeft.appendChild(card);
}

// ── Bloque Actividades Evaluables (colRight) ──────────
function renderActEvalBlock(u, colRight){
  var card = document.createElement('div');
  card.className = 'card'; card.style.marginBottom = '1.25rem';

  // ── Cabecera ─────────────────────────────────────────
  var hdr = document.createElement('div');
  hdr.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:10px';
  var tit = document.createElement('h3'); tit.style.cssText='font-size:14px;font-weight:600';
  tit.textContent = '📊 Actividades Evaluables';
  hdr.appendChild(tit);
  if(ROL==='profesor'){
    var btnAdd = document.createElement('button'); btnAdd.className='btn btn-p btn-sm';
    btnAdd.textContent='+ Añadir';
    btnAdd.onclick=(function(uid){ return function(){ abrirModalEditarActEval(uid, null); }; })(u.id);
    hdr.appendChild(btnAdd);
  }
  card.appendChild(hdr);

  // ── Aviso ─────────────────────────────────────────────
  var aviso = document.createElement('div');
  aviso.style.cssText='font-size:12px;color:var(--red);margin-bottom:10px;padding:7px 11px;background:var(--red-bg);border-radius:var(--r)';
  aviso.textContent='Estas actividades son calificadas y contribuyen a la nota del RA.';
  card.appendChild(aviso);

  // ── Lista de actividades evaluables ──────────────────
  // Recalcular pesos antes de renderizar
  if((ACT_EVAL[u.id]||[]).length) calcPesosActEval(u.id);
  var actEvalPred = (ACT_EVAL[u.id]||[]);
  if(!actEvalPred.length){
    var empty = document.createElement('p');
    empty.style.cssText='font-size:13px;color:var(--muted);text-align:center;padding:1rem 0';
    empty.textContent='No hay actividades evaluables configuradas.';
    card.appendChild(empty);
  }

  var tipoBadgeMap = {examen:'b-amber',caso:'b-blue',informe:'b-blue',practica:'b-green',test:'b-purple',trabajo:'b-green',participacion:'b-purple',otro:'b-gray'};
  var tipoIcoMap   = {examen:'📋',caso:'📝',informe:'📄',practica:'✏️',test:'🧠',trabajo:'📁',participacion:'🙋',otro:'📌'};

  actEvalPred.forEach(function(ae){
    var row = document.createElement('div');
    row.style.cssText='padding:10px 0;border-bottom:1px solid var(--border)';

    // Fila principal
    var top = document.createElement('div');
    top.style.cssText='display:flex;align-items:flex-start;gap:8px;flex-wrap:wrap';

    var badge = document.createElement('span');
    badge.className='badge '+(tipoBadgeMap[ae.tipo]||'b-gray');
    badge.style.fontSize='10px';
    badge.textContent=(tipoIcoMap[ae.tipo]||'📌')+' '+(ae.tipo||'actividad');

    var titleEl = document.createElement('div');
    titleEl.style.cssText='font-size:13px;font-weight:500;flex:1;min-width:140px';
    titleEl.textContent=ae.titulo;

    var pesoEl = document.createElement('span');
    pesoEl.style.cssText='font-size:12px;font-weight:700;color:var(--navy);flex-shrink:0;background:var(--surface2);padding:2px 8px;border-radius:10px';
    pesoEl.textContent=(ae.peso||0)+'%';
    pesoEl.title='Peso calculado automáticamente según CE vinculados';

    top.appendChild(badge); top.appendChild(titleEl); top.appendChild(pesoEl);
    row.appendChild(top);

    // CE vinculados
    if(ae.ceVinculados&&ae.ceVinculados.length){
      var ceDiv=document.createElement('div'); ceDiv.style.cssText='display:flex;gap:4px;flex-wrap:wrap;margin-top:5px';
      ae.ceVinculados.forEach(function(cv){
        var c=document.createElement('span'); c.className='badge b-purple'; c.style.fontSize='10px';
        c.textContent=cv.ceId; ceDiv.appendChild(c);
      });
      row.appendChild(ceDiv);
    }

    // Fecha
    if(ae.fecha){
      var f=document.createElement('div'); f.style.cssText='font-size:11px;color:var(--muted);margin-top:3px';
      f.textContent='📅 Entrega: '+ae.fecha; row.appendChild(f);
    }

    // Programación de apertura
    if(ae.fechaApertura){
      var ahora = new Date();
      var apertura = new Date(ae.fechaApertura + (ae.horaApertura ? 'T'+ae.horaApertura : 'T00:00'));
      var yaVisible = ahora >= apertura;
      var apDiv = document.createElement('div'); apDiv.style.cssText='margin-top:5px';
      if(ROL==='profesor'){
        var apBadge = document.createElement('span');
        apBadge.style.cssText='font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;'+(yaVisible?'background:#dcfce7;color:#16a34a':'background:#fef3c7;color:#92400e');
        apBadge.textContent = yaVisible
          ? '✅ Visible desde '+ae.fechaApertura+(ae.horaApertura?' '+ae.horaApertura:'')
          : '🕐 Se abrirá el '+ae.fechaApertura+(ae.horaApertura?' a las '+ae.horaApertura:'');
        apDiv.appendChild(apBadge);
      } else {
        // Alumno: si no es visible, mostrar cuenta atrás; si sí, no mostrar nada extra
        if(!yaVisible){
          var diff = apertura - ahora;
          var dias = Math.floor(diff/86400000);
          var horas = Math.floor((diff%86400000)/3600000);
          var mins = Math.floor((diff%3600000)/60000);
          var ctDiv = document.createElement('div');
          ctDiv.style.cssText='display:flex;align-items:center;gap:6px;background:#fef3c7;border-radius:var(--r);padding:6px 10px';
          ctDiv.innerHTML='<span style="font-size:1rem">🔒</span>'+
            '<div><div style="font-size:11px;font-weight:700;color:#92400e">Disponible en</div>'+
            '<div style="font-size:13px;font-weight:700;color:#78350f">'+
            (dias>0?dias+'d ':'')+horas+'h '+mins+'min</div></div>';
          apDiv.appendChild(ctDiv);
          // Hide the launch button for students if not yet available
          row.dataset.bloqueada = '1';
        }
      }
      row.appendChild(apDiv);
    }

    // Descripción
    if(ae.desc){
      var d=document.createElement('div'); d.style.cssText='font-size:12px;color:var(--muted);margin-top:3px';
      d.textContent=ae.desc; row.appendChild(d);
    }

    // Indicador de entregas + botones (solo profesor)
    if(ROL==='profesor'){
      // Calcular cuántos alumnos han entregado esta actividad
      var udTests2 = getUDTests();
      var nAlumnos = DB.alumnos.length;
      var entregados = 0;
      if(nAlumnos){
        DB.alumnos.forEach(function(al){
          var entries = (udTests2[u.id]||[]).filter(function(t){
            return t.actId===ae.id && (t.alumnoId===al.id || !t.alumnoId);
          });
          if(entries.length) entregados++;
        });
      }

      // Barra de progreso de entregas
      var entregasWrap = document.createElement('div');
      entregasWrap.style.cssText = 'margin-top:8px;padding:8px 10px;background:var(--surface2);border-radius:var(--r)';
      var entregasHdr = document.createElement('div');
      entregasHdr.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:5px';
      var entregasLbl = document.createElement('div');
      entregasLbl.style.cssText = 'font-size:11px;font-weight:600;color:var(--muted)';
      entregasLbl.textContent = '📬 Entregas';
      var entregasCount = document.createElement('div');
      entregasCount.style.cssText = 'font-size:11px;font-weight:700;color:'+(nAlumnos&&entregados===nAlumnos?'var(--green)':entregados>0?'var(--amber)':'var(--muted)');
      entregasCount.textContent = nAlumnos ? entregados+' / '+nAlumnos+' alumnos' : 'Sin alumnos';
      entregasHdr.appendChild(entregasLbl); entregasHdr.appendChild(entregasCount);
      entregasWrap.appendChild(entregasHdr);

      if(nAlumnos){
        var barWrap = document.createElement('div');
        barWrap.style.cssText = 'height:5px;background:var(--border);border-radius:3px;overflow:hidden;margin-bottom:5px';
        var barFill = document.createElement('div');
        var pct = Math.round(entregados/nAlumnos*100);
        barFill.style.cssText = 'height:100%;width:'+pct+'%;border-radius:3px;background:'+(entregados===nAlumnos?'var(--green)':entregados>0?'var(--amber)':'var(--border)');
        barWrap.appendChild(barFill);
        entregasWrap.appendChild(barWrap);

        // Lista de quién ha entregado y quién no (desplegable)
        if(nAlumnos<=30){
          var entregasDetalle = document.createElement('div');
          entregasDetalle.style.cssText = 'overflow:hidden;max-height:0;transition:max-height .25s ease';
          var sinEntregar = []; var conEntregar = [];
          DB.alumnos.forEach(function(al){
            var entries=(udTests2[u.id]||[]).filter(function(t){ return t.actId===ae.id&&(t.alumnoId===al.id||!t.alumnoId); });
            if(entries.length){
              var ultimaNota=entries[entries.length-1].nota;
              conEntregar.push({al:al, nota:ultimaNota, fecha:entries[entries.length-1].fecha});
            } else { sinEntregar.push(al); }
          });

          var detHtml='';
          if(conEntregar.length){
            detHtml+='<div style="font-size:10px;font-weight:700;text-transform:uppercase;color:var(--green);margin-bottom:3px;margin-top:4px">✅ Entregado ('+conEntregar.length+')</div>';
            detHtml+=conEntregar.map(function(e){
              return '<div style="display:flex;align-items:center;gap:6px;padding:2px 0;font-size:12px">'+
                '<span style="flex:1">'+e.al.nombre+' '+e.al.apellidos+'</span>'+
                '<span style="font-family:IBM Plex Mono,monospace;font-size:11px;font-weight:700;color:'+(e.nota>=5?'var(--green)':'var(--red)')+'">'+e.nota.toFixed(1)+'</span>'+
                '<span style="font-size:10px;color:var(--muted)">'+e.fecha+'</span>'+
              '</div>';
            }).join('');
          }
          if(sinEntregar.length){
            detHtml+='<div style="font-size:10px;font-weight:700;text-transform:uppercase;color:var(--amber);margin-bottom:3px;margin-top:6px">⏳ Pendiente ('+sinEntregar.length+')</div>';
            detHtml+=sinEntregar.map(function(al){
              return '<div style="font-size:12px;color:var(--muted);padding:2px 0">'+al.nombre+' '+al.apellidos+'</div>';
            }).join('');
          }
          entregasDetalle.innerHTML=detHtml;
          entregasWrap.appendChild(entregasDetalle);

          // Toggle
          var toggleBtn = document.createElement('button');
          toggleBtn.style.cssText='background:none;border:none;font-size:10px;color:var(--muted);cursor:pointer;padding:0;text-decoration:underline;margin-top:2px';
          toggleBtn.textContent='Ver detalle';
          var isOpen=false;
          toggleBtn.onclick=function(){
            isOpen=!isOpen;
            entregasDetalle.style.maxHeight=isOpen?entregasDetalle.scrollHeight+'px':'0px';
            this.textContent=isOpen?'Ocultar detalle':'Ver detalle';
          };
          entregasWrap.appendChild(toggleBtn);
        }
      }
      row.appendChild(entregasWrap);

      var btnRow=document.createElement('div'); btnRow.style.cssText='display:flex;gap:5px;margin-top:7px';

      var btnEdit=document.createElement('button'); btnEdit.className='btn btn-g btn-sm';
      btnEdit.style.fontSize='11px'; btnEdit.textContent='✎ Editar';
      btnEdit.onclick=(function(aeid,uid){ return function(){
        abrirModalEditarActEval(uid, aeid);
      }; })(ae.id, u.id);
      btnRow.appendChild(btnEdit);

      var btnDel=document.createElement('button'); btnDel.className='btn btn-d btn-sm';
      btnDel.style.fontSize='11px'; btnDel.textContent='✕ Eliminar';
      btnDel.onclick=(function(aeid,uid){ return function(){
        if(!confirm('¿Eliminar esta actividad evaluable?')) return;
        ACT_EVAL[uid]=(ACT_EVAL[uid]||[]).filter(function(x){ return x.id!==aeid; });
        saveActEval(); renderUD(UNIDADES.find(function(x){ return x.id===uid; }));
      }; })(ae.id, u.id);
      btnRow.appendChild(btnDel);

      row.appendChild(btnRow);
    }

    // Badges banco / adjuntos
    if((ae.pregIds&&ae.pregIds.length)||(ae.adjuntos&&ae.adjuntos.length)||(ae.rubrica&&ae.rubrica.criterios&&ae.rubrica.criterios.length)||ae.tiempoMin||ae.password||ae.alumnoAdjuntos||ae.esGrupo){
      var extraBadges=document.createElement('div'); extraBadges.style.cssText='display:flex;gap:5px;margin-top:5px;flex-wrap:wrap';
      if(ae.pregIds&&ae.pregIds.length){
        var bp=document.createElement('span'); bp.className='badge b-purple'; bp.style.fontSize='10px';
        bp.textContent='🎯 '+ae.pregIds.length+' pregunta'+(ae.pregIds.length!==1?'s':''); extraBadges.appendChild(bp);
      }
      if(ae.adjuntos&&ae.adjuntos.length){
        var ba=document.createElement('span'); ba.className='badge b-blue'; ba.style.fontSize='10px';
        ba.textContent='📎 '+ae.adjuntos.length+' adjunto'+(ae.adjuntos.length!==1?'s':''); extraBadges.appendChild(ba);
      }
      row.appendChild(extraBadges);
    }

    // Nota alumno
    if(ROL==='alumno'){
      var nota=DB.notas['eval_'+ae.id];
      if(nota!=null){
        var notaEl=document.createElement('div');
        notaEl.style.cssText='font-size:12px;font-weight:700;color:'+(nota>=5?'var(--green)':'var(--red)')+';margin-top:4px';
        notaEl.textContent='Calificación: '+nota+'/10'; row.appendChild(notaEl);
      }
      // Launch button — only if activity is available
      var bloqueada = row.dataset.bloqueada==='1';
      if(!bloqueada && ae.pregIds && ae.pregIds.length){
        var btnIniciar=document.createElement('button'); btnIniciar.className='btn btn-p btn-sm';
        btnIniciar.style.cssText='margin-top:8px;width:100%;font-size:12px';
        btnIniciar.textContent='▶ Iniciar actividad';
        btnIniciar.onclick=(function(act,uid){ return function(){ lanzarActividadEvaluable(act,uid); }; })(ae,u.id);
        row.appendChild(btnIniciar);
      }
    }

    card.appendChild(row);
  });

  // Total ponderación
  if(actEvalPred.length){
    var total = actEvalPred.reduce(function(s,a){ return s+(parseFloat(a.peso)||0); },0);
    var totalEl = document.createElement('div');
    totalEl.style.cssText='font-size:12px;font-weight:700;text-align:right;margin-top:10px;padding:6px 10px;border-radius:var(--r);background:'+(Math.abs(total-100)<2?'var(--green-bg)':'var(--amber-bg)')+';color:'+(Math.abs(total-100)<2?'var(--green)':'var(--amber)');
    totalEl.innerHTML='⚖️ Peso total calculado: <strong>'+total.toFixed(1)+'%</strong>'+(Math.abs(total-100)<2?' ✓':' · ajusta los CE en Evaluación para que sume 100%');
    card.appendChild(totalEl);
  }

  colRight.appendChild(card);
}

// ══════════════════════════════════════════════════════
//  RENDER BLOQUE (UD) — versión completa
// ══════════════════════════════════════════════════════
function renderUD(u){
  var cont = document.getElementById('cont-'+u.id);
  if(!cont) return;
  cont.innerHTML = '';
  var root = document.createElement('div');

  // ── Cabecera ─────────────────────────────────────────
  var ph = document.createElement('div');
  ph.className = 'ph';
  ph.innerHTML =
    '<div><h1 class="pt">'+u.titulo+'</h1>'+
    '<p class="ps">'+u.horas+' horas · Módulo Gestión Financiera · CFGS AF</p></div>'+
    '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap" id="ud-ph-btns-'+u.id+'">'+
      '<div style="display:flex;align-items:center;gap:6px">'+
        '<div style="width:120px;height:6px;background:var(--border);border-radius:3px;overflow:hidden">'+
          '<div style="height:100%;width:'+u.prog+'%;background:var(--navy);border-radius:3px"></div>'+
        '</div>'+
        '<span style="font-size:12px;color:var(--muted)">'+u.prog+'% completado</span>'+
      '</div>'+
    '</div>';
  root.appendChild(ph);

  // Wire professor buttons after DOM
  if(ROL==='profesor'){
    var btnsDiv = document.getElementById('ud-ph-btns-'+u.id) || ph.querySelector('[id^="ud-ph-btns"]');
    if(!btnsDiv){
      btnsDiv = ph.querySelector('div:last-child');
    }
    [
      {label:'📝 Temas',  fn:function(){ abrirModalEditarTemas(u.id,null,null); }},
      {label:'🎯 RA/CE', fn:function(){ abrirModalVincularRA(u.id); }},
      {label:'✎ Editar', fn:function(){ abrirModalEditarUDContenidos(u.id, null, null); }}
    ].forEach(function(b){
      var btn=document.createElement('button'); btn.className='btn btn-g btn-sm';
      btn.textContent=b.label; btn.onclick=b.fn;
      btnsDiv.appendChild(btn);
    });
  }

  // ── Layout 2 columnas ─────────────────────────────────
  var grid = document.createElement('div');
  grid.style.cssText = 'display:grid;grid-template-columns:1fr 360px;gap:1.25rem;align-items:start';
  var colLeft  = document.createElement('div');
  var colRight = document.createElement('div');

  // ── COLUMNA IZQUIERDA ─────────────────────────────────

  // Descripción
  if(u.desc){
    colLeft.appendChild(mkCard(
      'Descripción',
      '<p style="font-size:14px;color:var(--muted);line-height:1.7">'+u.desc+'</p>',
      ROL==='profesor' ? '<button class="btn btn-g btn-sm" style="margin-top:10px" id="btn-edit-desc-'+u.id+'">✎ Editar descripción</button>' : ''
    ));
    if(ROL==='profesor'){
      setTimeout(function(){
        var bd=document.getElementById('btn-edit-desc-'+u.id);
        if(bd) bd.onclick=function(){ editarDescUD(u.id); };
      },10);
    }
  }

  // ── Índice de contenidos (DOM directo — mantiene onclick) ──
  var indiceCard = document.createElement('div');
  indiceCard.className='card'; indiceCard.style.marginBottom='1.25rem';
  var indiceHdr=document.createElement('div');
  indiceHdr.style.cssText='display:flex;align-items:center;justify-content:space-between;margin-bottom:10px';
  var indiceTit=document.createElement('h3'); indiceTit.style.cssText='font-size:14px;font-weight:600';
  indiceTit.textContent='📋 Índice de Contenidos'; indiceHdr.appendChild(indiceTit);
  if(ROL==='profesor'){
    var btnEditTemas=document.createElement('button'); btnEditTemas.className='btn btn-g btn-sm';
    btnEditTemas.textContent='✎ Editar';
    btnEditTemas.onclick=function(){ abrirModalEditarTemas(u.id,null,null); };
    indiceHdr.appendChild(btnEditTemas);
  }
  indiceCard.appendChild(indiceHdr);
  if(!(u.temas&&u.temas.length)){
    var noTemas=document.createElement('p'); noTemas.style.cssText='font-size:13px;color:var(--muted)';
    noTemas.textContent='Sin temas definidos.'; indiceCard.appendChild(noTemas);
  } else {
    var ni=0, currentSubsI=null;
    u.temas.forEach(function(t){
      var isSub=/^(\t| {2,}|- |\* )/.test(t);
      var texto=t.replace(/^(\t| {2,}|- |\* )/,'').trim();
      if(!isSub){
        ni++; currentSubsI=null;
        var row=document.createElement('div'); row.style.cssText='border-bottom:1px solid var(--border)';
        var rHdr=document.createElement('div');
        rHdr.style.cssText='display:flex;align-items:center;gap:10px;padding:9px 0;cursor:pointer;user-select:none';
        var numEl=document.createElement('div');
        numEl.style.cssText='width:22px;height:22px;border-radius:50%;background:var(--navy);color:var(--gold-light);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0';
        numEl.textContent=ni;
        var txEl=document.createElement('div'); txEl.style.cssText='font-size:13.5px;flex:1;font-weight:500'; txEl.textContent=texto;
        var linkEl=document.createElement('button'); linkEl.style.cssText='background:none;border:none;font-size:10px;color:var(--navy);cursor:pointer;opacity:.7;padding:0 4px;flex-shrink:0';
        linkEl.textContent='→'; linkEl.title='Ir al contenido de este tema';
        linkEl.onclick=(function(tema){ return function(e){ e.stopPropagation();
          // Find contenido groups and open the matching one
          var contGroups=document.querySelectorAll('[data-tema]');
          contGroups.forEach(function(g){ if(g.dataset.tema===tema){ g.click(); g.scrollIntoView({behavior:'smooth',block:'start'}); } });
        }; })(texto);
        var arrEl=document.createElement('span'); arrEl.style.cssText='font-size:10px;color:var(--muted)'; arrEl.textContent='▶';
        var subsDiv=document.createElement('div');
        subsDiv.style.cssText='overflow:hidden;max-height:0;transition:max-height .25s ease;padding-left:32px';
        rHdr.appendChild(numEl); rHdr.appendChild(txEl); rHdr.appendChild(linkEl); rHdr.appendChild(arrEl);
        rHdr.onclick=(function(sd,ar){ return function(){
          var open=sd.style.maxHeight!=='0px'&&sd.style.maxHeight!=='';
          sd.style.maxHeight=open?'0px':'500px'; ar.textContent=open?'▶':'▼';
        };})(subsDiv,arrEl);
        row.appendChild(rHdr); row.appendChild(subsDiv);
        currentSubsI=subsDiv; indiceCard.appendChild(row);
      } else if(currentSubsI){
        var sub=document.createElement('div');
        sub.style.cssText='font-size:12.5px;color:var(--muted);padding:5px 0;border-bottom:1px solid var(--border)';
        sub.textContent='· '+texto; currentSubsI.appendChild(sub);
      }
    });
  }
  colLeft.appendChild(indiceCard);

  // Contenido y desarrollo interactivo
  var contCard=document.createElement('div'); contCard.className='card'; contCard.style.marginBottom='1.25rem';
  var contHdr=document.createElement('div'); contHdr.style.cssText='display:flex;align-items:center;justify-content:space-between;margin-bottom:10px';
  var contTit=document.createElement('h3'); contTit.style.cssText='font-size:14px;font-weight:600'; contTit.textContent='📖 Contenido y Desarrollo';
  contHdr.appendChild(contTit);
  if(ROL==='profesor'){
    var btnEditCont=document.createElement('button'); btnEditCont.className='btn btn-p btn-sm';
    btnEditCont.textContent='✎ Editar contenidos';
    btnEditCont.onclick=(function(uid){ return function(){ editarContenidosUD(uid); }; })(u.id);
    contHdr.appendChild(btnEditCont);
  }
  contCard.appendChild(contHdr);
  var contBody=document.createElement('div'); contBody.id='ci-cont-'+u.id;
  renderContenidosInteractivos(u.id, contBody);
  contCard.appendChild(contBody);
  colLeft.appendChild(contCard);

  // Actividades de aprendizaje (colLeft)
  renderActAprendBlock(u, colLeft);

  // Actividades evaluables (colLeft — debajo de aprendizaje)
  renderActEvalBlock(u, colLeft);

  // ── COLUMNA DERECHA ───────────────────────────────────

  // ── RA y CE — tabla con porcentajes ──────────────────
  var raData = getRADeUD(u.id);
  if(raData.length){
    initPond();
    var raCard = document.createElement('div'); raCard.className='card'; raCard.style.marginBottom='1.25rem';
    var raHdr = document.createElement('div'); raHdr.style.cssText='display:flex;align-items:center;justify-content:space-between;margin-bottom:10px';
    var raTit = document.createElement('h3'); raTit.style.cssText='font-size:14px;font-weight:600';
    raTit.textContent='🎯 Resultados de Aprendizaje'; raHdr.appendChild(raTit);
    if(ROL==='profesor'){
      var btnEditRA=document.createElement('button'); btnEditRA.className='btn btn-g btn-sm';
      btnEditRA.textContent='✎ Editar RA/CE';
      btnEditRA.onclick=function(){ abrirModalVincularRA(u.id); };
      raHdr.appendChild(btnEditRA);
    }
    raCard.appendChild(raHdr);

    raData.forEach(function(ra){
      var raBloque = document.createElement('div'); raBloque.style.marginBottom='12px';
      // Cabecera RA: nombre + % del módulo
      var pond = POND[ra.id] || {};
      var pctModulo = pond.pct || 0;
      var raHead = document.createElement('div');
      raHead.style.cssText='display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--navy);border-radius:var(--r) var(--r) 0 0';
      var raIdEl=document.createElement('span'); raIdEl.style.cssText='font-family:IBM Plex Mono,monospace;font-size:11px;color:var(--gold-light);flex-shrink:0';
      raIdEl.textContent=ra.id;
      var raNomEl=document.createElement('div'); raNomEl.style.cssText='flex:1;font-size:13px;font-weight:600;color:#fff';
      raNomEl.textContent=ra.nombre;
      var raPctEl=document.createElement('span'); raPctEl.style.cssText='background:var(--gold);color:var(--navy);font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;flex-shrink:0';
      raPctEl.textContent=pctModulo+'% del módulo';
      raHead.appendChild(raIdEl); raHead.appendChild(raNomEl); raHead.appendChild(raPctEl);
      raBloque.appendChild(raHead);

      // Tabla CE
      if(ra.ce && ra.ce.length){
        var tw=document.createElement('div'); tw.style.cssText='overflow-x:auto;border:1px solid var(--border);border-top:none;border-radius:0 0 var(--r) var(--r)';
        var tbl=document.createElement('table'); tbl.style.cssText='width:100%;border-collapse:collapse';
        var thead=document.createElement('thead');
        thead.innerHTML='<tr style="background:var(--surface2)">'+
          '<th style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);padding:6px 10px;text-align:left;width:60px">CE</th>'+
          '<th style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);padding:6px 10px;text-align:left">Criterio de Evaluación</th>'+
          '<th style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);padding:6px 10px;text-align:center;width:60px">Peso</th>'+
        '</tr>';
        tbl.appendChild(thead);
        var tbody=document.createElement('tbody');
        ra.ce.forEach(function(ce){
          var pCE = (pond.ce && pond.ce[ce.id]) ? pond.ce[ce.id] : 0;
          var tr=document.createElement('tr'); tr.style.borderBottom='1px solid var(--border)';
          var td1=document.createElement('td'); td1.style.cssText='padding:7px 10px;font-size:12px;font-weight:700;color:var(--navy);font-family:IBM Plex Mono,monospace;white-space:nowrap'; td1.textContent=ce.id;
          var td2=document.createElement('td'); td2.style.cssText='padding:7px 10px;font-size:12.5px;color:var(--muted)'; td2.textContent=ce.desc;
          var td3=document.createElement('td'); td3.style.cssText='padding:7px 10px;text-align:center;font-size:12.5px;font-weight:700;color:var(--navy)'; td3.textContent=pCE+'%';
          tr.appendChild(td1); tr.appendChild(td2); tr.appendChild(td3); tbody.appendChild(tr);
        });
        tbl.appendChild(tbody); tw.appendChild(tbl); raBloque.appendChild(tw);
      }
      raCard.appendChild(raBloque);
    });
  }
  // Cuaderno de recursos
  var mats = DB.materiales.filter(function(m){ return m.unidad==='UD'+u.n; });
  var iconMat = {apunte:'📄',ejercicio:'✏️',examen:'📋',normativa:'⚖️',plantilla:'📊',video:'🎬',otro:'📎'};
  var matsHtml = mats.length ?
    mats.map(function(mat){
      var accion = '';
      if(mat.fileName){
        accion = '<button class="btn btn-g btn-sm" style="font-size:11px" id="btn-dl-'+mat.id+'">⬇ Descargar</button>';
      } else if(mat.url){
        accion = '<a href="'+mat.url+'" target="_blank" class="btn btn-g btn-sm" style="font-size:11px">Abrir ↗</a>';
      }
      return '<div style="display:flex;align-items:center;gap:9px;padding:8px 0;border-bottom:1px solid var(--border)">'+
        '<span style="font-size:1.1rem">'+(iconMat[mat.tipo]||'📎')+'</span>'+
        '<div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+mat.titulo+'</div>'+
        (mat.fileName?'<div style="font-size:11px;color:var(--muted)">'+mat.fileName+'</div>':'')+
        '</div>'+accion+
      '</div>';
    }).join('') :
    '<p style="font-size:13px;color:var(--muted)">Sin recursos añadidos.</p>';

  colRight.appendChild(mkCard(
    '📁 Cuaderno de Recursos', matsHtml,
    ROL==='profesor' ? '<button class="btn btn-g btn-sm" style="margin-top:10px;width:100%" onclick="abrirModalMaterial()">+ Añadir recurso</button>' : ''
  ));

  // Wire descargar buttons
  setTimeout(function(){
    mats.forEach(function(mat){
      if(mat.fileName){
        var btn=document.getElementById('btn-dl-'+mat.id);
        if(btn) btn.onclick=function(){ descargarArchivoMat(mat.id, mat.fileName); };
      }
    });
  },10);

  // Glosario
  colRight.appendChild(renderGlosarioBlock(u));

  // RA y CE (debajo de recursos y glosario)
  if(raData.length){
    colRight.appendChild(raCard);
  }

  grid.appendChild(colLeft);
  grid.appendChild(colRight);
  root.appendChild(grid);
  cont.appendChild(root);
}

// helper — mkCard si no existe
function mkCard(titulo, cuerpoHtml, pieHtml){
  var card = document.createElement('div');
  card.className = 'card'; card.style.marginBottom = '1.25rem';
  if(titulo){
    var h = document.createElement('h3');
    h.style.cssText = 'font-size:14px;font-weight:600;margin-bottom:10px';
    h.textContent = titulo;
    card.appendChild(h);
  }
  var body = document.createElement('div');
  body.innerHTML = cuerpoHtml||''; card.appendChild(body);
  if(pieHtml){
    var foot = document.createElement('div');
    foot.innerHTML = pieHtml; card.appendChild(foot);
  }
  return card;
}


// ── Cálculo automático de peso por actividad evaluable ──
// El peso de cada actividad = proporción del módulo que ocupan sus CE
// Si varios CE de un mismo RA están en distintas actividades, se reparte
function calcPesosActEval(udId){
  initPond();
  var acts = (ACT_EVAL[udId]||[]);
  if(!acts.length) return;

  // Para cada CE, contar cuántas actividades lo tienen vinculado
  var ceConteo = {}; // ceId -> número de actividades que lo vinculan
  acts.forEach(function(ae){
    (ae.ceVinculados||[]).forEach(function(cv){
      var key = cv.raId+'__'+cv.ceId;
      ceConteo[key] = (ceConteo[key]||0) + 1;
    });
  });

  // Asignar peso a cada actividad
  acts.forEach(function(ae){
    var pesoTotal = 0;
    (ae.ceVinculados||[]).forEach(function(cv){
      var pond = POND[cv.raId];
      if(!pond) return;
      var pctRA  = parseFloat(pond.pct)||0;           // % del RA en el módulo
      var pesoCE = parseFloat((pond.ce||{})[cv.ceId])||0; // % del CE dentro del RA
      var pesoAbsoluto = pctRA * pesoCE / 100;         // % absoluto del CE en el módulo
      var key = cv.raId+'__'+cv.ceId;
      var nActs = ceConteo[key]||1;
      pesoTotal += pesoAbsoluto / nActs;               // repartir entre actividades que comparten el CE
    });
    ae.peso = Math.round(pesoTotal * 10) / 10;
  });

  saveActEval();
}


// ── Modal Añadir / Editar Actividad Evaluable ─────────
function abrirModalEditarActEval(udId, actId){
  var u  = UNIDADES.find(function(x){ return x.id===udId; });
  var ae = actId ? (ACT_EVAL[udId]||[]).find(function(x){ return x.id===actId; }) : null;
  initPond();

  // Panel lateral deslizante
  var overlay = document.createElement('div');
  overlay.id = 'ae-editor-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:2000;display:flex;align-items:stretch;justify-content:flex-end';

  var panel = document.createElement('div');
  panel.style.cssText = 'width:min(760px,100vw);height:100%;background:var(--surface);display:flex;flex-direction:column;box-shadow:-8px 0 32px rgba(0,0,0,.15);overflow:hidden';

  function cerrarPanel(){ overlay.remove(); document.body.style.overflow=''; }

  // ── Header ───────────────────────────────────────────
  var ph = document.createElement('div');
  ph.style.cssText = 'display:flex;align-items:center;gap:12px;padding:16px 20px;background:var(--navy);flex-shrink:0';
  ph.innerHTML = '<div style="flex:1"><div style="font-family:serif;font-size:16px;font-weight:600;color:#fff">'+(ae?'✎ Editar':'+ Nueva')+' Actividad Evaluable</div>'+
    '<div style="font-size:12px;color:rgba(255,255,255,.5);margin-top:2px">'+u.titulo+'</div></div>';
  var btnX = document.createElement('button');
  btnX.style.cssText='background:rgba(255,255,255,.15);border:none;color:#fff;border-radius:8px;padding:7px 14px;cursor:pointer;font-size:13px';
  btnX.textContent='✕ Cerrar'; btnX.onclick=cerrarPanel;
  ph.appendChild(btnX); panel.appendChild(ph);

  // ── Pestañas ─────────────────────────────────────────
  var tabBar = document.createElement('div');
  tabBar.style.cssText = 'display:flex;border-bottom:2px solid var(--border);background:var(--surface2);flex-shrink:0';
  var tabs = [{id:'cfg',label:'⚙️ Configuración'},{id:'banco',label:'🎯 Banco de preguntas'},{id:'adjuntos',label:'📎 Adjuntos'},{id:'rubrica',label:'📊 Rúbrica'},{id:'grupos',label:'👥 Grupos'}];
  var tabActiva = 'cfg';
  var tabPanes = {};

  // ── Cuerpo scrollable ─────────────────────────────────
  var body = document.createElement('div');
  body.style.cssText = 'flex:1;overflow-y:auto;padding:20px';

  function switchTab(id){
    tabActiva = id;
    tabBar.querySelectorAll('button').forEach(function(b){
      var active = b.dataset.tab===id;
      b.style.borderBottom = active?'2px solid var(--navy)':'2px solid transparent';
      b.style.color = active?'var(--navy)':'var(--muted)';
      b.style.fontWeight = active?'700':'400';
      b.style.marginBottom = '-2px';
    });
    Object.keys(tabPanes).forEach(function(k){ tabPanes[k].style.display = k===id?'block':'none'; });
  }

  tabs.forEach(function(t){
    var btn = document.createElement('button');
    btn.style.cssText='background:none;border:none;border-bottom:2px solid transparent;padding:10px 16px;font-size:13px;cursor:pointer;color:var(--muted)';
    btn.textContent=t.label; btn.dataset.tab=t.id;
    btn.onclick=function(){ switchTab(t.id); };
    tabBar.appendChild(btn);
  });
  panel.appendChild(tabBar);

  // ══ PESTAÑA 1: CONFIGURACIÓN ══════════════════════════
  var paneConfig = document.createElement('div');
  tabPanes['cfg'] = paneConfig;

  var raData = getRADeUD(udId);
  var raceHtml = raData.length ? raData.map(function(ra){
    return '<div style="padding:5px 10px;background:var(--surface2);font-size:11px;font-weight:700;color:var(--navy)">'+ra.id+' — '+ra.nombre+'</div>'+
      (ra.ce||[]).map(function(ce){
        var checked = ae && ae.ceVinculados && ae.ceVinculados.some(function(cv){ return cv.ceId===ce.id; });
        return '<label style="display:flex;align-items:flex-start;gap:8px;padding:6px 14px;cursor:pointer;border-top:1px solid var(--border)">'+
          '<input type="checkbox" class="ae-ce-chk" data-raid="'+ra.id+'" data-ceid="'+ce.id+'"'+(checked?' checked':'')+' style="margin-top:2px;width:14px;height:14px">'+
          '<span style="font-size:12px"><strong style="font-family:IBM Plex Mono,monospace;color:var(--navy)">'+ce.id+'</strong> — '+ce.desc+'</span></label>';
      }).join('');
  }).join('') : '';

  var tiposOpts = ['examen','caso','informe','practica','test','trabajo','participacion','otro'].map(function(t){
    var lbl={examen:'📋 Examen',caso:'📝 Caso práctico',informe:'📄 Informe',practica:'✏️ Práctica',test:'🧠 Test',trabajo:'📁 Trabajo',participacion:'🙋 Participación',otro:'📌 Otro'}[t];
    return '<option value="'+t+'"'+(ae&&ae.tipo===t?' selected':'')+'>'+lbl+'</option>';
  }).join('');

  paneConfig.innerHTML =
    '<div class="fg"><label class="fl">Tipo <span style="color:var(--red)">*</span></label>'+
    '<select class="fs" id="ae-tipo" onchange="toggleGrupoConfig(this.value)">'+tiposOpts+'</select></div>'+
    '<div id="ae-grupo-config" style="display:'+(ae&&ae.tipo==='trabajo'?'block':'none')+';padding:10px 12px;background:#f0f4ff;border-radius:var(--r);border-left:3px solid #3730a3;margin-bottom:4px">'+
      '<div style="font-size:12px;font-weight:700;color:#3730a3;margin-bottom:8px">👥 Configuración de trabajo en grupo</div>'+
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">'+
        '<input type="checkbox" id="ae-es-grupo" style="width:15px;height:15px"'+(ae&&ae.esGrupo?' checked':'')+'>'+
        '<label for="ae-es-grupo" style="font-size:13px;cursor:pointer">Actividad en grupo</label>'+
      '</div>'+
      '<div class="g2">'+
        '<div class="fg"><label class="fl">Mínimo personas</label>'+
        '<input class="fi" id="ae-grupo-min" type="number" min="2" max="10" value="'+(ae&&ae.grupoMin?ae.grupoMin:2)+'"></div>'+
        '<div class="fg"><label class="fl">Máximo personas</label>'+
        '<input class="fi" id="ae-grupo-max" type="number" min="2" max="10" value="'+(ae&&ae.grupoMax?ae.grupoMax:4)+'"></div>'+
      '</div>'+
    '</div>'+
    '<div class="fg"><label class="fl">Título <span style="color:var(--red)">*</span></label>'+
    '<input class="fi" id="ae-titulo" value="'+(ae?ae.titulo:'')+'" placeholder="Ej: AE.1.1 · Examen de la Unidad"></div>'+
    '<div class="fg"><label class="fl">Descripción / instrucciones</label>'+
    '<textarea class="fta" id="ae-desc" rows="3">'+(ae&&ae.desc?ae.desc:'')+'</textarea></div>'+
    '<div class="g2">'+
      '<div class="fg"><label class="fl">Fecha de entrega</label>'+
      '<input class="fi" id="ae-fecha" type="date" value="'+(ae&&ae.fecha?ae.fecha:'')+'"></div>'+
    '</div>'+
    '<div style="background:var(--surface2);border:1px solid var(--border);border-radius:var(--r);padding:12px 14px;margin-bottom:8px">'+
      '<div style="font-size:12px;font-weight:700;color:var(--navy);margin-bottom:10px">🕐 Programar visibilidad para alumnos</div>'+
      '<div class="g2">'+
        '<div class="fg"><label class="fl">Disponible desde (fecha)</label>'+
        '<input class="fi" id="ae-apertura-fecha" type="date" value="'+(ae&&ae.fechaApertura?ae.fechaApertura:'')+'"></div>'+
        '<div class="fg"><label class="fl">Hora de apertura</label>'+
        '<input class="fi" id="ae-apertura-hora" type="time" value="'+(ae&&ae.horaApertura?ae.horaApertura:'')+'"></div>'+
      '</div>'+
      '<div style="font-size:11.5px;color:var(--muted);margin-top:6px">💡 Si no se indica fecha, la actividad es visible inmediatamente en cuanto se guarda. Si se programa, el alumno verá un contador de cuenta atrás.</div>'+
    '</div>'+
    '<div class="g2">'+
      '<div class="fg"><label class="fl">Penalización por error</label>'+
      '<select class="fs" id="ae-pen">'+
        '<option value="0"'+(ae&&(ae.penalizacion===0||ae.penalizacion===undefined||ae.penalizacion===null)?' selected':'')+'>Sin penalización</option>'+
        '<option value="0.25"'+(ae&&ae.penalizacion===0.25?' selected':'')+'>−0,25 por error (EBAU)</option>'+
        '<option value="0.33"'+(ae&&ae.penalizacion===0.33?' selected':'')+'>−1/3 por error</option>'+
        '<option value="0.5"'+(ae&&ae.penalizacion===0.5?' selected':'')+'>−0,5 por error</option>'+
      '</select></div>'+
    '</div>'+
    '<hr style="border:none;border-top:1px solid var(--border);margin:10px 0">'+
    '<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:8px">🎲 Orden y visualización de preguntas</div>'+
    '<div class="g2">'+
      '<div style="display:flex;align-items:center;gap:8px">'+
        '<input type="checkbox" id="ae-orden-aleatorio" style="width:15px;height:15px"'+(ae&&ae.ordenAleatorio?' checked':'')+'>'+
        '<label for="ae-orden-aleatorio" style="font-size:13px;cursor:pointer">🔀 Preguntas en orden aleatorio</label>'+
      '</div>'+
      '<div style="display:flex;align-items:center;gap:8px">'+
        '<input type="checkbox" id="ae-respuestas-aleatorias" style="width:15px;height:15px"'+(ae&&ae.respuestasAleatorias?' checked':'')+'>'+
        '<label for="ae-respuestas-aleatorias" style="font-size:13px;cursor:pointer">🔀 Opciones de respuesta aleatorias</label>'+
      '</div>'+
    '</div>'+
    '<div class="fg" style="margin-top:8px"><label class="fl">Modo de visualización</label>'+
      '<div style="display:flex;gap:8px;margin-top:4px">'+
        '<label style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:8px 12px;border-radius:var(--r);border:2px solid '+(ae&&ae.modoPantalla==='una'?'var(--navy)':'var(--border)')+';background:'+(ae&&ae.modoPantalla==='una'?'var(--navy)':'var(--surface2)')+';flex:1">'+
          '<input type="radio" name="ae-modo-pantalla" value="todas" id="ae-modo-todas"'+((!ae||ae.modoPantalla!=='una')?' checked':'')+' style="width:14px;height:14px">'+
          '<div><div style="font-size:12px;font-weight:600;color:'+(ae&&ae.modoPantalla==='una'?'#fff':'var(--text)')+'">Todas a la vez</div>'+
          '<div style="font-size:11px;color:'+(ae&&ae.modoPantalla==='una'?'rgba(255,255,255,.6)':'var(--muted)')+'">Scroll por el examen</div></div>'+
        '</label>'+
        '<label style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:8px 12px;border-radius:var(--r);border:2px solid '+(ae&&ae.modoPantalla==='una'?'var(--navy)':'var(--border)')+';background:'+(ae&&ae.modoPantalla==='una'?'var(--navy)':'var(--surface2)')+';flex:1">'+
          '<input type="radio" name="ae-modo-pantalla" value="una" id="ae-modo-una"'+(ae&&ae.modoPantalla==='una'?' checked':'')+' style="width:14px;height:14px">'+
          '<div><div style="font-size:12px;font-weight:600;color:'+(ae&&ae.modoPantalla==='una'?'#fff':'var(--text)')+'">Una por pantalla</div>'+
          '<div style="font-size:11px;color:'+(ae&&ae.modoPantalla==='una'?'rgba(255,255,255,.6)':'var(--muted)')+'">Navegar pregunta a pregunta</div></div>'+
        '</label>'+
      '</div>'+
    '</div>'+
    '<hr style="border:none;border-top:1px solid var(--border);margin:10px 0">'+
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">'+
      '<input type="checkbox" id="ae-manual" style="width:15px;height:15px"'+(ae&&ae.correccionManual?' checked':'')+'>'+
      '<label for="ae-manual" style="font-size:13px;cursor:pointer">✏️ Permitir corrección manual por el profesor</label>'+
    '</div>'+
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">'+
      '<input type="checkbox" id="ae-adjuntos-alumno" style="width:15px;height:15px"'+(ae&&ae.alumnoAdjuntos?' checked':'')+'>'+
      '<label for="ae-adjuntos-alumno" style="font-size:13px;cursor:pointer">📎 Permitir que el alumno adjunte documentos</label>'+
    '</div>'+
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">'+
      '<input type="checkbox" id="ae-antitrampas" style="width:15px;height:15px" onchange="toggleAntitrampasConfig()"'+(ae&&ae.antitrampas?' checked':'')+'>'+
      '<label for="ae-antitrampas" style="font-size:13px;cursor:pointer">🔍 Modo vigilancia — detectar cambios de pestaña/ventana</label>'+
    '</div>'+
    '<div id="ae-antitrampas-config" style="display:'+(ae&&ae.antitrampas?'block':'none')+';margin-left:23px;padding:8px 12px;background:#fef3c7;border-radius:var(--r);border-left:3px solid var(--amber);font-size:12px;margin-bottom:8px">'+
      '<div style="font-weight:600;color:var(--amber);margin-bottom:6px">⚠️ Vigilancia activa: el alumno será advertido si cambia de pestaña.</div>'+
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">'+
        '<label style="color:#92400e">Salidas permitidas antes de entregar automáticamente:</label>'+
        '<input type="number" id="ae-max-salidas" min="1" max="10" value="'+(ae&&ae.maxSalidas?ae.maxSalidas:3)+'" style="width:50px;padding:4px;border:1px solid var(--border);border-radius:6px;font-size:13px;text-align:center">'+
        '<span style="color:#92400e">(0 = sin límite)</span>'+
      '</div>'+
      '<div style="display:flex;align-items:center;gap:8px">'+
        '<input type="checkbox" id="ae-pantalla-completa" style="width:14px;height:14px"'+(ae&&ae.pantallaCompleta?' checked':'')+'>'+
        '<label for="ae-pantalla-completa" style="color:#92400e;cursor:pointer">Forzar pantalla completa al iniciar</label>'+
      '</div>'+
    '</div>'+
    '<div class="g2">'+
      '<div class="fg"><label class="fl">⏱ Tiempo límite</label>'+
        '<div style="display:flex;align-items:center;gap:6px">'+
          '<input class="fi" id="ae-tiempo" type="number" min="0" step="5" value="'+(ae&&ae.tiempoMin?ae.tiempoMin:0)+'" style="width:80px">'+
          '<span style="font-size:13px;color:var(--muted)">minutos (0 = sin límite)</span>'+
        '</div></div>'+
      '<div class="fg"><label class="fl">🔒 Contraseña de acceso</label>'+
        '<input class="fi" id="ae-password" type="text" placeholder="Dejar vacío = sin contraseña" value="'+(ae&&ae.password?ae.password:'')+'">'+
      '</div>'+
    '</div>'+
    '<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--surface2);border-radius:var(--r);margin:6px 0">'+
      '<input type="checkbox" id="ae-bloqueo-feedback" style="width:16px;height:16px;cursor:pointer;accent-color:var(--navy);flex-shrink:0" '+(ae&&ae.bloqueoFeedback?'checked':'')+'>'+
      '<div style="flex:1">'+
        '<div style="font-size:13px;font-weight:600">🔒 Bloquear Comprobar y Ver respuesta hasta entregar</div>'+
        '<div style="font-size:11px;color:var(--muted);margin-top:2px">El alumno no podrá comprobar respuestas hasta que entregue la actividad evaluable</div>'+
      '</div>'+
    '</div>'+
    '<div style="padding:8px 12px;background:var(--surface2);border-radius:var(--r);font-size:12px;color:var(--muted);margin:8px 0">'+
      'ℹ️ El <strong>peso</strong> se calcula automáticamente según los CE vinculados.</div>'+
    (raceHtml?
      '<div class="fg"><label class="fl">CE que evalúa esta actividad</label>'+
      '<div style="border:1px solid var(--border);border-radius:var(--r);max-height:220px;overflow-y:auto">'+raceHtml+'</div></div>'
      :'<div class="alert al-w" style="font-size:12px">Vincula RA/CE al bloque primero.</div>')+
    '<hr style="border:none;border-top:1px solid var(--border);margin:14px 0">'+
    '<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:10px">⚖️ Ponderación pasos de cálculo financiero</div>'+
    '<div style="font-size:12px;color:var(--muted);margin-bottom:10px">Si la actividad incluye ejercicios de cálculo, define el peso de cada paso (deben sumar 100%).</div>'+
    '<div class="g2">'+
      '<div class="fg"><label class="fl">1. Identificación de datos (%)</label>'+
      '<input class="fi" id="ae-w-datos" type="number" min="0" max="100" value="'+(ae&&ae.pesosCalculo?ae.pesosCalculo.datos:20)+'"></div>'+
      '<div class="fg"><label class="fl">2. Fórmula (%)</label>'+
      '<input class="fi" id="ae-w-formula" type="number" min="0" max="100" value="'+(ae&&ae.pesosCalculo?ae.pesosCalculo.formula:20)+'"></div>'+
    '</div>'+
    '<div class="g2">'+
      '<div class="fg"><label class="fl">3. Desarrollo del cálculo (%)</label>'+
      '<input class="fi" id="ae-w-calculo" type="number" min="0" max="100" value="'+(ae&&ae.pesosCalculo?ae.pesosCalculo.calculo:40)+'"></div>'+
      '<div class="fg"><label class="fl">4. Interpretación (%)</label>'+
      '<input class="fi" id="ae-w-interp" type="number" min="0" max="100" value="'+(ae&&ae.pesosCalculo?ae.pesosCalculo.interp:20)+'"></div>'+
    '</div>';

  // ══ PESTAÑA 2: BANCO DE PREGUNTAS ════════════════════
  var paneBanco = document.createElement('div');
  tabPanes['banco'] = paneBanco;
  paneBanco.style.display = 'none';

  var pregIdsActuales = (ae && ae.pregIds) ? ae.pregIds.slice() : [];

  (function buildBancoPane(){
    var banco = getBanco();
    var filtroUD = udId; var filtroTipo = 'todas';

    var info = document.createElement('div');
    info.style.cssText = 'font-size:12.5px;color:var(--muted);margin-bottom:12px;padding:8px 12px;background:var(--surface2);border-radius:var(--r)';
    info.textContent = 'Vincula preguntas del banco a esta actividad. Al realizarla el alumno verá estas preguntas y se autocorregirán.';
    paneBanco.appendChild(info);

    // Filtros
    var filtrosDiv = document.createElement('div'); filtrosDiv.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px';
    var selUD = document.createElement('select'); selUD.className='fs'; selUD.style.cssText='width:auto;font-size:12px';
    selUD.innerHTML='<option value="'+udId+'">Solo este bloque</option><option value="todas">Todos los bloques</option>'+
      UNIDADES.filter(function(uu){ return uu.id!==udId; }).map(function(uu){ return '<option value="'+uu.id+'">B'+uu.n+' · '+uu.titulo.slice(0,20)+'</option>'; }).join('');
    var selTipo = document.createElement('select'); selTipo.className='fs'; selTipo.style.cssText='width:auto;font-size:12px';
    selTipo.innerHTML='<option value="todas">Todos los tipos</option>'+
      Object.keys(TIPOS_PREGUNTA).map(function(t){ return '<option value="'+t+'">'+TIPOS_PREGUNTA[t].ico+' '+TIPOS_PREGUNTA[t].label+'</option>'; }).join('');
    filtrosDiv.appendChild(selUD); filtrosDiv.appendChild(selTipo);
    paneBanco.appendChild(filtrosDiv);

    var listaCont = document.createElement('div');
    paneBanco.appendChild(listaCont);

    function renderBancoEval(){
      listaCont.innerHTML='';
      var filtrado = banco.filter(function(p){
        var udOk = filtroUD==='todas'||p.ud===filtroUD;
        var tipoOk = filtroTipo==='todas'||p.tipo===filtroTipo;
        return udOk && tipoOk;
      });
      if(!filtrado.length){
        listaCont.innerHTML='<div style="text-align:center;padding:2rem;color:var(--muted);font-size:13px">Sin preguntas con estos filtros.</div>';
        return;
      }
      filtrado.forEach(function(p){
        var info2=TIPOS_PREGUNTA[p.tipo]||TIPOS_PREGUNTA.test;
        var udObj=UNIDADES.find(function(uu){ return uu.id===p.ud; })||{n:'?'};
        var row=document.createElement('label');
        row.style.cssText='display:flex;align-items:flex-start;gap:10px;padding:9px 0;border-bottom:1px solid var(--border);cursor:pointer';
        var chk=document.createElement('input'); chk.type='checkbox'; chk.className='ae-banco-chk';
        chk.value=p.id; chk.style.cssText='margin-top:3px;width:16px;height:16px;flex-shrink:0';
        chk.checked = pregIdsActuales.indexOf(p.id)>=0;
        chk.onchange=function(){
          if(this.checked){ pregIdsActuales.push(p.id); }
          else { pregIdsActuales = pregIdsActuales.filter(function(id){ return id!==p.id; }); }
          cntEl.textContent=pregIdsActuales.length+' seleccionada'+(pregIdsActuales.length!==1?'s':'');
        };
        var txt=document.createElement('div'); txt.style.flex='1';
        txt.innerHTML='<div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:3px">'+
          '<span style="background:'+info2.color+';color:'+info2.ctxt+';font-size:10px;padding:2px 7px;border-radius:20px;font-weight:600">'+info2.ico+' '+info2.label+'</span>'+
          '<span class="badge b-blue" style="font-size:10px">B'+udObj.n+'</span>'+
          (p.ra?'<span class="badge b-purple" style="font-size:10px">'+p.ra+'</span>':'')+
          '</div><div style="font-size:13px;line-height:1.4">'+p.enunciado+'</div>';
        row.appendChild(chk); row.appendChild(txt); listaCont.appendChild(row);
      });
    }

    selUD.onchange=function(){ filtroUD=this.value; renderBancoEval(); };
    selTipo.onchange=function(){ filtroTipo=this.value; renderBancoEval(); };

    var cntEl = document.createElement('div');
    cntEl.style.cssText='font-size:12px;font-weight:600;color:var(--navy);margin-bottom:8px';
    cntEl.textContent=pregIdsActuales.length+' seleccionada'+(pregIdsActuales.length!==1?'s':'');
    paneBanco.insertBefore(cntEl, filtrosDiv);

    renderBancoEval();

    // Exponer para guardar
    paneBanco._getPregIds = function(){ return pregIdsActuales; };
  })();

  // ══ PESTAÑA 3: ADJUNTOS ══════════════════════════════
  var paneAdj = document.createElement('div');
  tabPanes['adjuntos'] = paneAdj;
  paneAdj.style.display = 'none';

  var adjuntos = (ae && ae.adjuntos) ? JSON.parse(JSON.stringify(ae.adjuntos)) : [];

  (function buildAdjPane(){
    var info3 = document.createElement('div');
    info3.style.cssText='font-size:12.5px;color:var(--muted);margin-bottom:14px;padding:8px 12px;background:var(--surface2);border-radius:var(--r)';
    info3.innerHTML='Adjunta documentos, enunciados o el examen exportado del banco. Los adjuntos se guardan en el navegador.';
    paneAdj.appendChild(info3);

    var adjList = document.createElement('div'); adjList.id='ae-adj-list';
    paneAdj.appendChild(adjList);

    function renderAdjList(){
      adjList.innerHTML='';
      if(!adjuntos.length){
        var noAdj=document.createElement('div'); noAdj.style.cssText='font-size:13px;color:var(--muted);text-align:center;padding:1.5rem 0';
        noAdj.textContent='Sin adjuntos. Añade un archivo o enlace.'; adjList.appendChild(noAdj); return;
      }
      adjuntos.forEach(function(adj,i){
        var row=document.createElement('div'); row.style.cssText='display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)';
        var ico=document.createElement('span'); ico.style.fontSize='1.3rem';
        ico.textContent=adj.tipo==='enlace'?'🔗':adj.tipo==='html'?'📄':'📎';
        var info4=document.createElement('div'); info4.style.flex='1';
        info4.innerHTML='<div style="font-size:13px;font-weight:500">'+adj.nombre+'</div>'+
          (adj.tipo==='enlace'?'<div style="font-size:11px;color:var(--muted)">'+adj.url+'</div>':
           '<div style="font-size:11px;color:var(--muted)">'+adj.tipo.toUpperCase()+'</div>');
        var btnDl=document.createElement('button'); btnDl.className='btn btn-g btn-sm'; btnDl.style.fontSize='11px';
        btnDl.textContent=adj.tipo==='enlace'?'Abrir ↗':'⬇ Descargar';
        btnDl.onclick=(function(a){ return function(){
          if(a.tipo==='enlace'){ window.open(a.url,'_blank'); return; }
          var media=getContMedia();
          if(media[a.id]){
            var link=document.createElement('a'); link.href=media[a.id]; link.download=a.nombre; link.click();
          } else { flash('Archivo no encontrado en almacenamiento','#dc2626'); }
        }; })(adj);
        var btnRm=document.createElement('button'); btnRm.className='btn btn-d btn-sm'; btnRm.style.fontSize='11px'; btnRm.textContent='✕';
        btnRm.onclick=(function(idx){ return function(){
          if(!confirm('¿Eliminar este adjunto?')) return;
          var a=adjuntos[idx]; if(a.tipo!=='enlace') delContMedia(a.id);
          adjuntos.splice(idx,1); renderAdjList();
        }; })(i);
        row.appendChild(ico); row.appendChild(info4); row.appendChild(btnDl); row.appendChild(btnRm);
        adjList.appendChild(row);
      });
    }
    renderAdjList();

    // Añadir archivo
    var btnAddFile=document.createElement('button'); btnAddFile.className='btn btn-g btn-sm'; btnAddFile.style.marginTop='10px';
    btnAddFile.innerHTML='📎 Adjuntar archivo (PDF, Word, HTML...)';
    btnAddFile.onclick=function(){
      var inp=document.createElement('input'); inp.type='file'; inp.accept='.pdf,.doc,.docx,.html,.xlsx,.pptx,.txt,.png,.jpg';
      inp.onchange=function(e){
        var file=e.target.files[0]; if(!file) return;
        var reader=new FileReader();
        reader.onload=function(ev){
          var id='adj_'+Date.now();
          var tipo=file.name.split('.').pop().toLowerCase();
          saveContMedia(id, ev.target.result);
          adjuntos.push({id:id, nombre:file.name, tipo:tipo});
          renderAdjList(); flash('Archivo adjuntado','#16a34a');
        };
        reader.readAsDataURL(file);
      };
      inp.click();
    };

    // Añadir enlace
    var btnAddLink=document.createElement('button'); btnAddLink.className='btn btn-g btn-sm'; btnAddLink.style.cssText='margin-top:10px;margin-left:8px';
    btnAddLink.innerHTML='🔗 Añadir enlace';
    btnAddLink.onclick=function(){
      var url=prompt('URL del enlace:','https://');
      if(!url||!url.startsWith('http')) return;
      var nombre=prompt('Nombre del enlace:','Recurso externo');
      if(!nombre) return;
      adjuntos.push({id:'lnk_'+Date.now(), nombre:nombre, tipo:'enlace', url:url});
      renderAdjList(); flash('Enlace añadido','#16a34a');
    };

    paneAdj.appendChild(btnAddFile); paneAdj.appendChild(btnAddLink);
    paneAdj._getAdjuntos = function(){ return adjuntos; };
  })();

  // ══ PESTAÑA 4: RÚBRICA ═══════════════════════════════
  var paneRubrica = document.createElement('div');
  tabPanes['rubrica'] = paneRubrica;
  paneRubrica.style.display = 'none';

  // rubrica = { criterios: [{id, descripcion, peso, niveles:[{label,puntos,desc}]}] }
  var rubrica = (ae && ae.rubrica) ? JSON.parse(JSON.stringify(ae.rubrica)) : { criterios:[] };

  (function buildRubricaPane(){
    var info5 = document.createElement('div');
    info5.style.cssText='font-size:12.5px;color:var(--muted);margin-bottom:14px;padding:8px 12px;background:var(--surface2);border-radius:var(--r)';
    info5.innerHTML='Define los criterios de evaluación y sus niveles de logro. El peso total de los criterios debe sumar <strong>100%</strong>.';
    paneRubrica.appendChild(info5);

    var criteriosList = document.createElement('div'); criteriosList.id='rubrica-criterios-list';
    paneRubrica.appendChild(criteriosList);

    var btnAddCrit = document.createElement('button'); btnAddCrit.className='btn btn-g btn-sm';
    btnAddCrit.style.cssText='margin-top:10px;width:100%';
    btnAddCrit.innerHTML='+ Añadir criterio';
    btnAddCrit.onclick=function(){
      rubrica.criterios.push({
        id:'crit_'+Date.now(),
        descripcion:'Nuevo criterio',
        peso:10,
        niveles:[
          {label:'Excelente',  puntos:10, desc:''},
          {label:'Notable',    puntos:7,  desc:''},
          {label:'Aprobado',   puntos:5,  desc:''},
          {label:'Insuficiente',puntos:2, desc:''},
        ]
      });
      renderRubrica();
    };
    paneRubrica.appendChild(btnAddCrit);

    // Total peso
    var totalPesoEl = document.createElement('div');
    totalPesoEl.id='rubrica-total-peso';
    totalPesoEl.style.cssText='font-size:12px;font-weight:700;text-align:right;margin-top:10px';
    paneRubrica.appendChild(totalPesoEl);

    function renderRubrica(){
      criteriosList.innerHTML='';
      var totalPeso = rubrica.criterios.reduce(function(s,c){ return s+(parseFloat(c.peso)||0); },0);
      totalPesoEl.style.color = Math.abs(totalPeso-100)<1 ? 'var(--green)' : 'var(--amber)';
      totalPesoEl.textContent = 'Peso total: '+totalPeso.toFixed(0)+'%'+(Math.abs(totalPeso-100)<1?' ✓':' ⚠ (debe sumar 100%)');

      if(!rubrica.criterios.length){
        var noC = document.createElement('div');
        noC.style.cssText='font-size:13px;color:var(--muted);text-align:center;padding:1.5rem 0';
        noC.textContent='Sin criterios. Pulsa "+ Añadir criterio" para empezar.';
        criteriosList.appendChild(noC); return;
      }

      rubrica.criterios.forEach(function(crit, ci){
        var box = document.createElement('div');
        box.style.cssText='border:1px solid var(--border);border-radius:var(--r);margin-bottom:12px;overflow:hidden';

        // Cabecera del criterio
        var critHdr = document.createElement('div');
        critHdr.style.cssText='display:flex;align-items:center;gap:8px;padding:10px 12px;background:var(--navy)';
        var numEl=document.createElement('div');
        numEl.style.cssText='width:22px;height:22px;border-radius:50%;background:var(--gold);color:var(--navy);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0';
        numEl.textContent=ci+1;
        var descInp=document.createElement('input'); descInp.className='fi';
        descInp.style.cssText='flex:1;font-size:13px;font-weight:600;background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.2);color:#fff';
        descInp.value=crit.descripcion; descInp.placeholder='Descripción del criterio';
        descInp.oninput=function(){ crit.descripcion=this.value; };
        var pesoWrap=document.createElement('div'); pesoWrap.style.cssText='display:flex;align-items:center;gap:4px;flex-shrink:0';
        var pesoInp=document.createElement('input'); pesoInp.type='number'; pesoInp.min='0'; pesoInp.max='100'; pesoInp.step='1';
        pesoInp.value=crit.peso;
        pesoInp.style.cssText='width:52px;padding:4px 6px;border-radius:6px;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.1);color:#fff;font-size:13px;font-weight:700;text-align:center';
        pesoInp.oninput=function(){ crit.peso=parseFloat(this.value)||0; renderRubrica(); };
        var pesoLbl=document.createElement('span'); pesoLbl.style.cssText='font-size:12px;color:rgba(255,255,255,.6)';
        pesoLbl.textContent='%';
        var btnDelCrit=document.createElement('button');
        btnDelCrit.style.cssText='background:rgba(220,38,38,.4);border:none;color:#fff;border-radius:6px;padding:4px 8px;cursor:pointer;font-size:12px;flex-shrink:0';
        btnDelCrit.textContent='✕';
        btnDelCrit.onclick=(function(i){ return function(){ rubrica.criterios.splice(i,1); renderRubrica(); }; })(ci);
        pesoWrap.appendChild(pesoInp); pesoWrap.appendChild(pesoLbl);
        critHdr.appendChild(numEl); critHdr.appendChild(descInp); critHdr.appendChild(pesoWrap); critHdr.appendChild(btnDelCrit);
        box.appendChild(critHdr);

        // Niveles
        var nivelesWrap = document.createElement('div');
        nivelesWrap.style.cssText='padding:10px 12px;display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px';

        crit.niveles.forEach(function(niv, ni){
          var nivelBox=document.createElement('div');
          nivelBox.style.cssText='border:1px solid var(--border);border-radius:var(--r);padding:8px;background:var(--surface)';
          var nivHdr=document.createElement('div'); nivHdr.style.cssText='display:flex;align-items:center;gap:5px;margin-bottom:6px';
          var nivLabel=document.createElement('input'); nivLabel.className='fi';
          nivLabel.style.cssText='flex:1;font-size:11px;font-weight:700;padding:3px 6px';
          nivLabel.value=niv.label; nivLabel.placeholder='Nivel';
          nivLabel.oninput=function(){ niv.label=this.value; };
          var ptInp=document.createElement('input'); ptInp.type='number'; ptInp.min='0'; ptInp.max='10'; ptInp.step='0.5';
          ptInp.value=niv.puntos;
          ptInp.style.cssText='width:46px;padding:3px 5px;border:1px solid var(--border);border-radius:6px;font-size:12px;font-weight:700;text-align:center;font-family:IBM Plex Mono,monospace';
          ptInp.oninput=function(){ niv.puntos=parseFloat(this.value)||0; };
          var ptLbl=document.createElement('span'); ptLbl.style.cssText='font-size:10px;color:var(--muted)';
          ptLbl.textContent='pts';
          var btnDelNiv=document.createElement('button');
          btnDelNiv.style.cssText='background:none;border:none;color:var(--muted);cursor:pointer;font-size:12px;padding:0 2px';
          btnDelNiv.textContent='✕';
          btnDelNiv.onclick=(function(ci2,ni2){ return function(){
            rubrica.criterios[ci2].niveles.splice(ni2,1); renderRubrica();
          }; })(ci,ni);
          nivHdr.appendChild(nivLabel); nivHdr.appendChild(ptInp); nivHdr.appendChild(ptLbl); nivHdr.appendChild(btnDelNiv);
          var descTa=document.createElement('textarea'); descTa.className='fta'; descTa.rows=2;
          descTa.style.cssText='font-size:11px;resize:none';
          descTa.placeholder='Descripción del nivel de logro…'; descTa.value=niv.desc||'';
          descTa.oninput=function(){ niv.desc=this.value; };
          nivelBox.appendChild(nivHdr); nivelBox.appendChild(descTa);
          nivelesWrap.appendChild(nivelBox);
        });

        // Botón añadir nivel
        var btnAddNiv=document.createElement('div');
        btnAddNiv.style.cssText='border:1px dashed var(--border);border-radius:var(--r);padding:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--muted);font-size:12px;min-height:80px;transition:background .15s';
        btnAddNiv.textContent='+ Nivel';
        btnAddNiv.onmouseenter=function(){ this.style.background='var(--surface2)'; };
        btnAddNiv.onmouseleave=function(){ this.style.background=''; };
        btnAddNiv.onclick=(function(ci2){ return function(){
          rubrica.criterios[ci2].niveles.push({label:'Nuevo nivel',puntos:0,desc:''});
          renderRubrica();
        }; })(ci);
        nivelesWrap.appendChild(btnAddNiv);
        box.appendChild(nivelesWrap);
        criteriosList.appendChild(box);
      });
    }

    renderRubrica();
    paneRubrica._getRubrica = function(){ return rubrica; };
  })();

  // ══ PESTAÑA 5: GRUPOS ════════════════════════════════
  var paneGrupos = document.createElement('div');
  tabPanes['grupos'] = paneGrupos;
  paneGrupos.style.display = 'none';

  var grupos = (ae && ae.grupos) ? JSON.parse(JSON.stringify(ae.grupos)) : [];

  (function buildGruposPane(){
    var infoG = document.createElement('div');
    infoG.style.cssText='font-size:12.5px;color:var(--muted);margin-bottom:14px;padding:8px 12px;background:var(--surface2);border-radius:var(--r)';
    infoG.innerHTML='Crea los grupos de trabajo y asigna alumnos. Al registrar la calificación se aplicará automáticamente a todos los miembros del grupo.';
    paneGrupos.appendChild(infoG);

    if(!ae||!ae.esGrupo){
      var noGrupo=document.createElement('div');
      noGrupo.style.cssText='text-align:center;padding:2rem;color:var(--muted);font-size:13px';
      noGrupo.textContent='Activa "Actividad en grupo" en la pestaña Configuración para gestionar grupos.';
      paneGrupos.appendChild(noGrupo);
      return;
    }

    var gruposList=document.createElement('div'); gruposList.id='grupos-list';
    paneGrupos.appendChild(gruposList);

    var btnAddGrupo=document.createElement('button'); btnAddGrupo.className='btn btn-g btn-sm';
    btnAddGrupo.style.cssText='margin-top:10px;width:100%';
    btnAddGrupo.innerHTML='+ Crear nuevo grupo';
    btnAddGrupo.onclick=function(){
      grupos.push({id:'grp_'+Date.now(), nombre:'Grupo '+(grupos.length+1), miembros:[]});
      renderGrupos();
    };
    paneGrupos.appendChild(btnAddGrupo);

    function renderGrupos(){
      gruposList.innerHTML='';
      if(!grupos.length){
        var noG=document.createElement('div'); noG.style.cssText='font-size:13px;color:var(--muted);text-align:center;padding:1.5rem 0';
        noG.textContent='Sin grupos creados. Pulsa "+ Crear nuevo grupo".';
        gruposList.appendChild(noG); return;
      }
      grupos.forEach(function(g, gi){
        var box=document.createElement('div');
        box.style.cssText='border:1px solid var(--border);border-radius:var(--r);margin-bottom:10px;overflow:hidden';

        // Cabecera grupo
        var gHdr=document.createElement('div');
        gHdr.style.cssText='display:flex;align-items:center;gap:8px;padding:9px 12px;background:var(--navy)';
        var gNumEl=document.createElement('div');
        gNumEl.style.cssText='width:24px;height:24px;border-radius:50%;background:var(--gold);color:var(--navy);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0';
        gNumEl.textContent=gi+1;
        var gNameInp=document.createElement('input'); gNameInp.className='fi';
        gNameInp.style.cssText='flex:1;background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.2);color:#fff;font-weight:600';
        gNameInp.value=g.nombre; gNameInp.placeholder='Nombre del grupo';
        gNameInp.oninput=function(){ g.nombre=this.value; };
        var gDelBtn=document.createElement('button');
        gDelBtn.style.cssText='background:rgba(220,38,38,.4);border:none;color:#fff;border-radius:6px;padding:4px 8px;cursor:pointer;font-size:12px';
        gDelBtn.textContent='✕';
        gDelBtn.onclick=(function(i){ return function(){ grupos.splice(i,1); renderGrupos(); }; })(gi);
        gHdr.appendChild(gNumEl); gHdr.appendChild(gNameInp); gHdr.appendChild(gDelBtn);
        box.appendChild(gHdr);

        // Miembros
        var gBody=document.createElement('div'); gBody.style.cssText='padding:10px 12px';

        // Alumnos ya asignados
        var miembrosDiv=document.createElement('div'); miembrosDiv.style.cssText='display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px;min-height:28px';
        g.miembros.forEach(function(mid){
          var al=DB.alumnos.find(function(a){ return a.id===mid; });
          if(!al) return;
          var chip=document.createElement('div');
          chip.style.cssText='display:flex;align-items:center;gap:6px;background:var(--navy);color:#fff;padding:4px 10px;border-radius:20px;font-size:12px';
          chip.innerHTML='<span>👤 '+al.nombre+' '+al.apellidos+'</span>';
          var rmBtn=document.createElement('button');
          rmBtn.style.cssText='background:none;border:none;color:rgba(255,255,255,.6);cursor:pointer;font-size:13px;padding:0;line-height:1';
          rmBtn.textContent='×';
          rmBtn.onclick=(function(m,i){ return function(){ g.miembros.splice(g.miembros.indexOf(m),1); renderGrupos(); }; })(mid,gi);
          chip.appendChild(rmBtn); miembrosDiv.appendChild(chip);
        });
        if(!g.miembros.length){
          var emptyM=document.createElement('span'); emptyM.style.cssText='font-size:12px;color:var(--muted)';
          emptyM.textContent='Sin miembros asignados'; miembrosDiv.appendChild(emptyM);
        }
        gBody.appendChild(miembrosDiv);

        // Selector para añadir alumno
        var alumnosDisponibles=DB.alumnos.filter(function(al){
          return !grupos.some(function(gg){ return gg.miembros.indexOf(al.id)>=0; });
        });
        if(alumnosDisponibles.length){
          var addRow=document.createElement('div'); addRow.style.cssText='display:flex;gap:6px';
          var selAl=document.createElement('select'); selAl.className='fs'; selAl.style.cssText='flex:1;font-size:12px';
          selAl.innerHTML='<option value="">— Añadir alumno —</option>'+
            alumnosDisponibles.map(function(al){ return '<option value="'+al.id+'">'+al.nombre+' '+al.apellidos+'</option>'; }).join('');
          var btnAddAl=document.createElement('button'); btnAddAl.className='btn btn-p btn-sm'; btnAddAl.textContent='Añadir';
          btnAddAl.onclick=(function(sel,grp){ return function(){
            if(!sel.value) return;
            grp.miembros.push(sel.value);
            renderGrupos();
          }; })(selAl, g);
          addRow.appendChild(selAl); addRow.appendChild(btnAddAl);
          gBody.appendChild(addRow);
        } else if(!g.miembros.length){
          var noDisp=document.createElement('div'); noDisp.style.cssText='font-size:12px;color:var(--amber)';
          noDisp.textContent='⚠ No hay alumnos disponibles. Añade alumnos en la sección Mis Alumnos.';
          gBody.appendChild(noDisp);
        }

        box.appendChild(gBody);
        gruposList.appendChild(box);
      });
    }
    renderGrupos();
    paneGrupos._getGrupos = function(){ return grupos; };
  })();

  // Añadir panes al body
  Object.keys(tabPanes).forEach(function(k){ body.appendChild(tabPanes[k]); });
  panel.appendChild(body);

  // ── Footer ────────────────────────────────────────────
  var footer=document.createElement('div');
  footer.style.cssText='padding:14px 20px;border-top:1px solid var(--border);background:var(--surface2);flex-shrink:0;display:flex;justify-content:flex-end;gap:8px';
  var btnCancel=document.createElement('button'); btnCancel.className='btn btn-g'; btnCancel.textContent='Cancelar'; btnCancel.onclick=cerrarPanel;
  var btnSave=document.createElement('button'); btnSave.className='btn btn-p';
  btnSave.textContent=ae?'Guardar cambios':'Añadir actividad';
  btnSave.onclick=function(){ guardarActEvalModal(udId, actId, paneBanco._getPregIds(), paneAdj._getAdjuntos(), paneRubrica._getRubrica(), paneGrupos._getGrupos?paneGrupos._getGrupos():[]); };
  footer.appendChild(btnCancel); footer.appendChild(btnSave);
  panel.appendChild(footer);

  overlay.appendChild(panel);
  document.body.appendChild(overlay);
  document.body.style.overflow='hidden';
  switchTab('cfg');
}

function toggleGrupoConfig(tipo){
  var el = document.getElementById('ae-grupo-config');
  if(el) el.style.display = tipo==='trabajo' ? 'block' : 'none';
}

function toggleAntitrampasConfig(){
  var chk = document.getElementById('ae-antitrampas');
  var cfg = document.getElementById('ae-antitrampas-config');
  if(cfg) cfg.style.display = chk&&chk.checked ? 'block' : 'none';
}


function guardarActEvalModal(udId, actId, pregIds, adjuntos, rubrica, grupos){
  var titulo = (document.getElementById('ae-titulo')||{value:''}).value.trim();
  var tipo   = (document.getElementById('ae-tipo')||{value:'otro'}).value;
  var desc   = (document.getElementById('ae-desc')||{value:''}).value.trim();
  var fecha  = (document.getElementById('ae-fecha')||{value:''}).value;
  var fechaApertura = (document.getElementById('ae-apertura-fecha')||{value:''}).value;
  var horaApertura  = (document.getElementById('ae-apertura-hora')||{value:''}).value;
  var pen    = parseFloat((document.getElementById('ae-pen')||{value:'0'}).value)||0;
  var corrManual = (document.getElementById('ae-manual')||{checked:false}).checked;
  var tiempoMin = parseInt((document.getElementById('ae-tiempo')||{value:'0'}).value)||0;
  var password  = (document.getElementById('ae-password')||{value:''}).value.trim();
  var bloqueoFeedback = (document.getElementById('ae-bloqueo-feedback')||{checked:false}).checked;
  var pesosCalculo = {
    datos:   parseFloat((document.getElementById('ae-w-datos')||{value:'20'}).value)||20,
    formula: parseFloat((document.getElementById('ae-w-formula')||{value:'20'}).value)||20,
    calculo: parseFloat((document.getElementById('ae-w-calculo')||{value:'40'}).value)||40,
    interp:  parseFloat((document.getElementById('ae-w-interp')||{value:'20'}).value)||20,
  };
  var esGrupo  = (document.getElementById('ae-es-grupo')||{checked:false}).checked;
  var alumnoAdjuntos = (document.getElementById('ae-adjuntos-alumno')||{checked:false}).checked;
  var grupoMin = parseInt((document.getElementById('ae-grupo-min')||{value:'2'}).value)||2;
  var grupoMax = parseInt((document.getElementById('ae-grupo-max')||{value:'4'}).value)||4;
  var ordenAleatorio = (document.getElementById('ae-orden-aleatorio')||{checked:false}).checked;
  var respuestasAleatorias = (document.getElementById('ae-respuestas-aleatorias')||{checked:false}).checked;
  var modoPantalla = (document.querySelector('input[name="ae-modo-pantalla"]:checked')||{value:'todas'}).value;
  var antitrampas = (document.getElementById('ae-antitrampas')||{checked:false}).checked;
  var maxSalidas = parseInt((document.getElementById('ae-max-salidas')||{value:'3'}).value)||0;
  var pantallaCompleta = (document.getElementById('ae-pantalla-completa')||{checked:false}).checked;

  if(!titulo){ flash('Introduce el título de la actividad','#dc2626'); return; }

  var ceVinculados=[];
  document.querySelectorAll('.ae-ce-chk:checked').forEach(function(c){
    ceVinculados.push({raId:c.dataset.raid, ceId:c.dataset.ceid});
  });

  if(!ACT_EVAL[udId]) ACT_EVAL[udId]=[];

  if(actId){
    var ae = ACT_EVAL[udId].find(function(x){ return x.id===actId; });
    if(ae){
      ae.titulo=titulo; ae.tipo=tipo; ae.desc=desc; ae.fecha=fecha; ae.fechaApertura=fechaApertura; ae.horaApertura=horaApertura;
      ae.penalizacion=pen; ae.correccionManual=corrManual;
      ae.tiempoMin=tiempoMin; ae.password=password; ae.bloqueoFeedback=bloqueoFeedback;
      ae.pesosCalculo=pesosCalculo;
      ae.esGrupo=esGrupo; ae.grupoMin=grupoMin; ae.grupoMax=grupoMax;
      ae.alumnoAdjuntos=alumnoAdjuntos;
      ae.ordenAleatorio=ordenAleatorio; ae.respuestasAleatorias=respuestasAleatorias; ae.modoPantalla=modoPantalla;
      ae.antitrampas=antitrampas; ae.maxSalidas=maxSalidas; ae.pantallaCompleta=pantallaCompleta;
      ae.ceVinculados=ceVinculados;
      ae.pregIds = pregIds||[];
      ae.adjuntos = adjuntos||[];
      ae.rubrica = rubrica||{criterios:[]};
      ae.grupos = grupos||[];
      flash('Actividad actualizada','#16a34a');
    }
  } else {
    ACT_EVAL[udId].push({ id:uid2(), titulo:titulo, peso:0, tipo:tipo,
      desc:desc, fecha:fecha, fechaApertura:fechaApertura, horaApertura:horaApertura, penalizacion:pen, correccionManual:corrManual,
      tiempoMin:tiempoMin, password:password, bloqueoFeedback:bloqueoFeedback, pesosCalculo:pesosCalculo,
      esGrupo:esGrupo, grupoMin:grupoMin, grupoMax:grupoMax, grupos:[], alumnoAdjuntos:alumnoAdjuntos,
      ordenAleatorio:ordenAleatorio, respuestasAleatorias:respuestasAleatorias, modoPantalla:modoPantalla,
      antitrampas:antitrampas, maxSalidas:maxSalidas, pantallaCompleta:pantallaCompleta,
      ceVinculados:ceVinculados, pregIds:pregIds||[],
      adjuntos:adjuntos||[], rubrica:rubrica||{criterios:[]} });
    flash('Actividad añadida','#16a34a');
  }

  calcPesosActEval(udId);
  var ov=document.getElementById('ae-editor-overlay');
  if(ov){ ov.remove(); document.body.style.overflow=''; }
  renderUD(UNIDADES.find(function(u){ return u.id===udId; }));
}

// ══════════════════════════════════════════════════════
//  MODAL — Seleccionar preguntas del banco para actividad
// ══════════════════════════════════════════════════════
function abrirModalActBanco(udId, modo){
  var u=UNIDADES.find(function(x){ return x.id===udId; });
  var banco=getBanco();
  // Preguntas de esta unidad por defecto, pero permite ver todas
  var esEval=(modo==='evaluable');

  var overlay=document.createElement('div');
  overlay.id='modal-act-banco';
  overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:2000;display:flex;align-items:stretch;justify-content:flex-end';

  var panel=document.createElement('div');
  panel.style.cssText='width:min(680px,100vw);background:var(--surface);display:flex;flex-direction:column;box-shadow:-8px 0 32px rgba(0,0,0,.15)';

  // Header
  var ph=document.createElement('div');
  ph.style.cssText='padding:16px 20px;background:var(--navy);flex-shrink:0';
  ph.innerHTML='<div style="font-family:\'Playfair Display\',serif;font-size:16px;font-weight:600;color:#fff">'+
    (esEval?'Añadir actividad evaluable':'Añadir actividad de aprendizaje')+' desde el Banco</div>'+
    '<div style="font-size:12px;color:rgba(255,255,255,.5);margin-top:2px">'+
    (esEval?'Se asignará calificación numérica · UD'+u.n+' · '+u.titulo:'Libre repetición · UD'+u.n+' · '+u.titulo)+'</div>';

  var btnCerrar=document.createElement('button');
  btnCerrar.style.cssText='position:absolute;top:14px;right:14px;background:rgba(255,255,255,.15);border:none;color:#fff;border-radius:8px;padding:6px 12px;cursor:pointer';
  btnCerrar.textContent='✕';
  btnCerrar.onclick=function(){ overlay.remove(); document.body.style.overflow=''; };
  ph.style.position='relative'; ph.appendChild(btnCerrar);
  panel.appendChild(ph);

  // Configuración nombre + si evaluable: peso y CE
  var configZone=document.createElement('div');
  configZone.style.cssText='padding:14px 20px;border-bottom:1px solid var(--border);background:var(--surface2);flex-shrink:0';

  var cfgHtml='<div class="fg" style="margin-bottom:10px"><label class="fl">Nombre de la actividad <span style="color:var(--red)">*</span></label>'+
    '<input class="fi" id="act-banco-titulo" placeholder="Ej: Test de repaso UD'+u.n+'"></div>';

  if(esEval){
    cfgHtml+='<div class="g2">'+
      '<div class="fg"><label class="fl">Peso en la evaluación (%)</label>'+
        '<input class="fi" id="act-banco-peso" type="number" min="0" max="100" value="10"></div>'+
      '<div class="fg"><label class="fl">Fecha de entrega</label>'+
        '<input class="fi" id="act-banco-fecha" type="date"></div></div>'+
      // CE vinculados
      '<div class="fg"><label class="fl">CE que evalúa <span style="color:var(--red);font-size:11px">* obligatorio</span></label>'+
        '<div id="act-banco-race-box" style="border:1px solid var(--border-md);border-radius:var(--r);max-height:160px;overflow-y:auto"></div></div>';
  }

  cfgHtml+='<div class="fg"><label class="fl">Penalización por respuesta incorrecta</label>'+
    '<select class="fs" id="act-banco-pen">'+
    '<option value="0">Sin penalización</option>'+
    '<option value="0.25">−0,25 por error (estándar EBAU)</option>'+
    '<option value="0.33">−1/3 por error</option>'+
    '<option value="0.5">−0,5 por error</option>'+
    '</select></div>';

  configZone.innerHTML=cfgHtml;
  panel.appendChild(configZone);

  // Poblar CE si evaluable
  if(esEval){
    setTimeout(function(){
      var box=document.getElementById('act-banco-race-box');
      if(!box) return;
      var raData=(RA_CE_DATA[udId]||{ra:[]}).ra;
      if(!raData.length){ box.innerHTML='<div style="padding:10px;font-size:12px;color:var(--muted)">No hay RA/CE configurados. Ve a Evaluación → RA/CE.</div>'; return; }
      raData.forEach(function(ra){
        var raHdr=document.createElement('div'); raHdr.style.cssText='padding:5px 10px;background:var(--surface2);font-size:11px;font-weight:700;color:var(--navy)';
        raHdr.textContent=ra.id+' — '+ra.nombre;
        box.appendChild(raHdr);
        (ra.ce||[]).forEach(function(ce){
          var lbl=document.createElement('label'); lbl.style.cssText='display:flex;align-items:flex-start;gap:8px;padding:5px 14px;cursor:pointer;border-top:1px solid var(--border)';
          var chk=document.createElement('input'); chk.type='checkbox'; chk.className='act-banco-ce-chk';
          chk.dataset.raid=ra.id; chk.dataset.ceid=ce.id; chk.style.cssText='margin-top:2px;width:14px;height:14px';
          var txt=document.createElement('span'); txt.style.cssText='font-size:12px';
          txt.innerHTML='<strong style="font-family:IBM Plex Mono,monospace;color:var(--navy)">'+ce.id+'</strong> — '+ce.desc;
          lbl.appendChild(chk); lbl.appendChild(txt); box.appendChild(lbl);
        });
      });
    },50);
  }

  // Filtros + lista de preguntas
  var listZone=document.createElement('div');
  listZone.style.cssText='flex:1;overflow-y:auto;padding:14px 20px';

  var filtrosDiv=document.createElement('div'); filtrosDiv.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;align-items:center';
  filtrosDiv.innerHTML='<span style="font-size:12px;font-weight:600;color:var(--muted)">Filtrar:</span>';

  var selFUD=document.createElement('select'); selFUD.className='fs'; selFUD.style.cssText='width:auto;font-size:12px;padding:5px 8px';
  selFUD.innerHTML='<option value="'+udId+'">UD'+u.n+' (esta unidad)</option>'+
    '<option value="todas">Todas las unidades</option>'+
    UNIDADES.filter(function(uu){ return uu.id!==udId; }).map(function(uu){ return '<option value="'+uu.id+'">UD'+uu.n+'</option>'; }).join('');
  selFUD.onchange=function(){ renderListaBanco(listaCont, banco, this.value, selFTipo.value); };

  var selFTipo=document.createElement('select'); selFTipo.className='fs'; selFTipo.style.cssText='width:auto;font-size:12px;padding:5px 8px';
  selFTipo.innerHTML='<option value="todas">Todos los tipos</option>'+
    Object.keys(TIPOS_PREGUNTA).map(function(t){ return '<option value="'+t+'">'+TIPOS_PREGUNTA[t].ico+' '+TIPOS_PREGUNTA[t].label+'</option>'; }).join('');
  selFTipo.onchange=function(){ renderListaBanco(listaCont, banco, selFUD.value, this.value); };

  [selFUD,selFTipo].forEach(function(s){ filtrosDiv.appendChild(s); });
  listZone.appendChild(filtrosDiv);

  var listaCont=document.createElement('div');
  listZone.appendChild(listaCont);
  panel.appendChild(listZone);

  // Footer con contador y botón confirmar
  var footer=document.createElement('div');
  footer.style.cssText='padding:12px 20px;border-top:1px solid var(--border);background:var(--surface2);flex-shrink:0;display:flex;align-items:center;gap:10px';
  footer.innerHTML='<span id="act-banco-count" style="font-size:13px;color:var(--muted);flex:1">0 preguntas seleccionadas</span>';
  var btnConf=document.createElement('button'); btnConf.className='btn btn-p';
  btnConf.textContent='✓ Crear actividad';
  btnConf.onclick=function(){ crearActividadDesdeBanco(udId, modo); };
  footer.appendChild(btnConf);
  panel.appendChild(footer);

  overlay.appendChild(panel);
  document.body.appendChild(overlay);
  document.body.style.overflow='hidden';

  renderListaBanco(listaCont, banco, udId, 'todas');
}

function renderListaBanco(cont, banco, udFiltro, tipoFiltro){
  cont.innerHTML='';
  var filtrado=banco.filter(function(p){
    if(udFiltro!=='todas' && p.ud!==udFiltro) return false;
    if(tipoFiltro!=='todas' && p.tipo!==tipoFiltro) return false;
    return true;
  });

  if(!filtrado.length){
    cont.innerHTML='<div style="text-align:center;padding:2rem;color:var(--muted);font-size:13px">No hay preguntas con estos filtros.</div>';
    return;
  }

  var difColor={basica:'b-green',media:'b-amber',avanzada:'b-red'};
  filtrado.forEach(function(p){
    var info=TIPOS_PREGUNTA[p.tipo]||TIPOS_PREGUNTA.test;
    var udObj=UNIDADES.find(function(u){ return u.id===p.ud; })||{n:'?'};

    var row=document.createElement('label');
    row.style.cssText='display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);cursor:pointer';

    var chk=document.createElement('input'); chk.type='checkbox'; chk.className='act-banco-preg-chk';
    chk.value=p.id; chk.style.cssText='margin-top:3px;width:16px;height:16px;flex-shrink:0;cursor:pointer';
    chk.onchange=function(){
      var sel=document.querySelectorAll('.act-banco-preg-chk:checked').length;
      var cnt=document.getElementById('act-banco-count');
      if(cnt) cnt.textContent=sel+' pregunta'+(sel!==1?'s':'')+' seleccionada'+(sel!==1?'s':'');
    };

    var txt=document.createElement('div'); txt.style.flex='1';
    txt.innerHTML='<div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:4px">'+
      '<span style="background:'+info.color+';color:'+info.ctxt+';font-size:10px;padding:2px 7px;border-radius:20px;font-weight:600">'+info.ico+' '+info.label+'</span>'+
      '<span class="badge b-blue" style="font-size:10px">UD'+udObj.n+'</span>'+
      '<span class="badge '+(difColor[p.dificultad]||'b-gray')+'" style="font-size:10px">'+(p.dificultad||'')+'</span>'+
      (p.ra?'<span class="badge b-purple" style="font-size:10px">'+p.ra+'</span>':'')+
      '</div>'+
      '<div style="font-size:13px;line-height:1.4">'+p.enunciado+'</div>';

    row.appendChild(chk); row.appendChild(txt);
    cont.appendChild(row);
  });
}

function crearActividadDesdeBanco(udId, modo){
  var titulo=(document.getElementById('act-banco-titulo')||{value:''}).value.trim();
  if(!titulo){ flash('Introduce un nombre para la actividad','#dc2626'); return; }

  var pregIds=[];
  document.querySelectorAll('.act-banco-preg-chk:checked').forEach(function(c){ pregIds.push(c.value); });
  if(!pregIds.length){ flash('Selecciona al menos una pregunta del banco','#dc2626'); return; }

  var pen=parseFloat((document.getElementById('act-banco-pen')||{value:'0'}).value)||0;
  var esEval=(modo==='evaluable');

  var nueva={
    id:uid(),
    titulo:titulo,
    tipo: esEval?'banco_eval':'banco_test',
    esEvaluable: esEval,
    pregIds: pregIds,
    penalizacion: pen,
    ud: udId,
  };

  if(esEval){
    nueva.peso=(document.getElementById('act-banco-peso')||{value:'10'}).value;
    nueva.fecha=(document.getElementById('act-banco-fecha')||{value:''}).value;
    // CE vinculados
    var ceVinc=[];
    document.querySelectorAll('.act-banco-ce-chk:checked').forEach(function(c){
      ceVinc.push({raId:c.dataset.raid,ceId:c.dataset.ceid});
    });
    if(!ceVinc.length){ flash('Selecciona al menos un CE que evalúa esta actividad','#dc2626'); return; }
    nueva.ceVinculados=ceVinc;
    nueva.unidad='UD'+UNIDADES.find(function(u){ return u.id===udId; }).n;
  } else {
    nueva.desc='Test de repaso con '+pregIds.length+' preguntas del banco';
  }

  if(!ACT_APRENDIZAJE[udId]) ACT_APRENDIZAJE[udId]=[];
  ACT_APRENDIZAJE[udId].push(nueva);
  saveActAprend();

  var ov=document.getElementById('modal-act-banco');
  if(ov){ ov.remove(); document.body.style.overflow=''; }

  renderUD(UNIDADES.find(function(u){ return u.id===udId; }));
  flash('Actividad "'+ titulo+'" creada con '+pregIds.length+' preguntas','#16a34a');
}

// ══════════════════════════════════════════════════════
//  LANZAR ACTIVIDAD — Modal de realización
// ══════════════════════════════════════════════════════
function lanzarActividadAprendizaje(act, udId){
  var banco=getBanco();
  var pregs=banco.filter(function(p){ return act.pregIds.indexOf(p.id)>=0; });
  if(!pregs.length){ flash('No se encontraron preguntas en el banco para esta actividad','#dc2626'); return; }
  abrirModalActividad(act, pregs, false, udId);
}

function lanzarActividadEvaluable(act, udId){
  var banco=getBanco();
  var pregs=banco.filter(function(p){ return act.pregIds.indexOf(p.id)>=0; });
  if(!pregs.length){ flash('No se encontraron preguntas','#dc2626'); return; }
  // Comprobar contraseña si existe
  if(act.password && act.password.trim()){
    var intento=prompt('🔒 Esta actividad requiere contraseña de acceso:','');
    if(intento===null) return;
    if(intento.trim()!==act.password.trim()){ flash('Contraseña incorrecta','#dc2626'); return; }
  }
  abrirModalActividad(act, pregs, true, udId);
}

function abrirModalActividad(act, pregs, esEval, udId){
  var overlay=document.createElement('div');
  overlay.id='modal-actividad-run';
  overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:2000;display:flex;align-items:stretch;justify-content:center;padding:1rem';

  var panel=document.createElement('div');
  panel.style.cssText='background:var(--surface);border-radius:var(--rl);width:100%;max-width:760px;max-height:92vh;overflow-y:auto;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.2)';

  // Header
  var ph=document.createElement('div');
  ph.style.cssText='display:flex;align-items:center;gap:12px;padding:16px 20px;background:var(--navy);border-radius:var(--rl) var(--rl) 0 0;flex-shrink:0;position:sticky;top:0;z-index:1';
  ph.innerHTML='<div style="flex:1">'+
    '<div style="font-family:\'Playfair Display\',serif;font-size:16px;font-weight:600;color:#fff">'+act.titulo+'</div>'+
    '<div style="font-size:12px;color:rgba(255,255,255,.5);margin-top:2px">'+pregs.length+' preguntas'+
    (act.penalizacion>0?' · Penalización −'+act.penalizacion+' por error':' · Sin penalización')+
    (esEval?' · Actividad evaluable':' · Libre repetición')+'</div></div>'+
    (act.tiempoMin?'<div id="act-timer" style="background:rgba(255,255,255,.15);border-radius:8px;padding:6px 12px;font-family:IBM Plex Mono,monospace;font-size:14px;font-weight:700;color:#fff">⏱ --:--</div>':'')+
    '<button id="btn-entregar-header" style="background:#22c55e;border:none;color:#fff;border-radius:8px;padding:8px 16px;cursor:pointer;font-size:13px;font-weight:700;flex-shrink:0">📤 Entregar</button>'+
    '<button onclick="document.getElementById(\'modal-actividad-run\').remove();document.body.style.overflow=\'\'" '+
    'style="background:rgba(255,255,255,.15);border:none;color:#fff;border-radius:8px;padding:7px 14px;cursor:pointer;font-size:13px">✕</button>';
  panel.appendChild(ph);

  var body=document.createElement('div'); body.style.cssText='padding:20px;flex:1';

  var _bloquearFeedback = !!(act.bloqueoFeedback && esEval);
  body._bloquearFeedback = _bloquearFeedback;

  // Estado de respuestas
  var respuestas={};
  var corregido=false;

  // Aplicar orden aleatorio de preguntas
  if(act.ordenAleatorio){
    pregs = pregs.slice().sort(function(){ return Math.random()-.5; });
  }

  // Progreso
  var progWrap=document.createElement('div'); progWrap.style.cssText='margin-bottom:16px';
  var progBar=document.createElement('div'); progBar.style.cssText='height:5px;background:var(--border);border-radius:3px;overflow:hidden;margin-bottom:4px';
  var progFill=document.createElement('div'); progFill.style.cssText='height:100%;background:var(--navy);border-radius:3px;transition:width .3s;width:0%';
  progBar.appendChild(progFill);
  var progInfo=document.createElement('div'); progInfo.style.cssText='font-size:12px;color:var(--muted)';
  progInfo.textContent='0 / '+pregs.length+' respondidas';
  progWrap.appendChild(progBar); progWrap.appendChild(progInfo);
  body.appendChild(progWrap);

  if(_bloquearFeedback){
    var _bf=document.createElement('div');
    _bf.id='banner-bloqueo-feedback';
    _bf.style.cssText='background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:10px 14px;margin-bottom:12px;display:flex;align-items:center;gap:8px;font-size:13px;color:#92400e';
    _bf.innerHTML='<span style="font-size:1.1rem">🔒</span><div><strong>Modo evaluable:</strong> Los botones «Comprobar» están bloqueados. Entrega la actividad para ver la corrección.</div>';
    body.appendChild(_bf);
  }

  function actualizarProgreso(){
    var n=Object.keys(respuestas).length;
    progFill.style.width=(n/pregs.length*100)+'%';
    progInfo.textContent=n+' / '+pregs.length+' respondidas';
  }

  // Renderizar cada pregunta
  pregs.forEach(function(p,idx){
    var info=TIPOS_PREGUNTA[p.tipo]||TIPOS_PREGUNTA.test;
    var pCard=document.createElement('div');
    pCard.id='run-card-'+p.id;
    pCard.style.cssText='border:1px solid var(--border);border-radius:var(--rl);padding:16px 18px;margin-bottom:12px;transition:border-color .2s';

    // Cabecera pregunta
    var pHdr=document.createElement('div'); pHdr.style.cssText='display:flex;align-items:center;gap:8px;margin-bottom:10px';
    var numEl=document.createElement('div');
    numEl.style.cssText='width:28px;height:28px;border-radius:50%;background:var(--navy);color:var(--gold-light);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0';
    numEl.textContent=idx+1;
    var badgeEl=document.createElement('span');
    badgeEl.style.cssText='background:'+info.color+';color:'+info.ctxt+';font-size:10px;padding:2px 8px;border-radius:20px;font-weight:600';
    badgeEl.textContent=info.ico+' '+info.label;
    pHdr.appendChild(numEl); pHdr.appendChild(badgeEl);
    pCard.appendChild(pHdr);

    // Enunciado
    var enunEl=document.createElement('div'); enunEl.style.cssText='font-size:14px;font-weight:500;line-height:1.6;margin-bottom:12px';
    enunEl.textContent=p.enunciado;
    pCard.appendChild(enunEl);

    // Tipo calculo/formulario → usar renderEjercicioCalculo
    if(p.tipo==='mapa'){
      var mapaCont=document.createElement('div');
      pCard.appendChild(mapaCont);
      renderEjercicioMapa(p, mapaCont, function(pct){
        respuestas[p.id]={tipo:'mapa', pct:pct};
        actualizarProgreso();
        pCard.style.borderColor='var(--green)';
      });
    } else if(p.tipo==='calculo'||p.tipo==='formulario'){
      var calcCont=document.createElement('div');
      pCard.appendChild(calcCont);
      renderEjercicioCalculo(p, calcCont, function(pct, pts, max, desglose){
        respuestas[p.id]={tipo:'calculo', pct:pct, desglose:desglose};
        if(pct!==null) pCard.style.borderColor='var(--green)';
        else pCard.style.borderColor='var(--amber)';
        actualizarProgreso();
      }, act && act.pesosCalculo ? act.pesosCalculo : null, _bloquearFeedback);
    } else if(p.tipo==='test'||p.tipo==='vf'){
      // Opciones clicables
      var letters=['A','B','C','D'];
      var btns=[];
      var optsWrap=document.createElement('div'); optsWrap.style.cssText='display:flex;flex-direction:column;gap:7px';
      // Aplicar orden aleatorio de respuestas (manteniendo referencia al índice correcto)
      var opcionesConIndice = (p.opciones||[]).map(function(op,i){ return {op:op, idx:i}; });
      if(act.respuestasAleatorias && (p.tipo==='test')){
        opcionesConIndice = opcionesConIndice.slice().sort(function(){ return Math.random()-.5; });
      }
      opcionesConIndice.forEach(function(item, pos){
        var op=item.op; var i=item.idx;
        var btn=document.createElement('button');
        btn.style.cssText='display:flex;align-items:center;gap:10px;width:100%;padding:10px 14px;border-radius:var(--r);text-align:left;cursor:pointer;font-family:"DM Sans",sans-serif;font-size:13.5px;transition:all .15s;background:var(--surface2);color:var(--text);border:2px solid var(--border)';
        var letraEl=document.createElement('span');
        letraEl.style.cssText='width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;background:var(--border);color:var(--muted)';
        letraEl.textContent=p.tipo==='vf'?(pos===0?'V':'F'):letters[pos];
        btn.appendChild(letraEl); btn.appendChild(document.createTextNode(op));
        btn.dataset.realIdx = i; // store real index for correction
        btns.push({btn:btn, idx:i}); // store real index
        btn.onclick=function(){
          if(corregido) return;
          respuestas[p.id]={tipo:'opcion',val:i};
          btns.forEach(function(bobj){
            var b=bobj.btn||bobj; var bidx=bobj.idx!=null?bobj.idx:null;
            var sel = bidx!=null ? bidx===i : false;
            b.style.background=sel?'var(--navy)':'var(--surface2)';
            b.style.color=sel?'#fff':'var(--text)';
            b.style.border=sel?'2px solid var(--navy)':'2px solid var(--border)';
            b.querySelector('span').style.background=sel?'var(--gold)':'var(--border)';
            b.querySelector('span').style.color=sel?'var(--navy)':'var(--muted)';
          });
          pCard.style.borderColor='var(--navy)';
          actualizarProgreso();
        };
        optsWrap.appendChild(btn);
      });
      pCard.appendChild(optsWrap);

    } else if(p.tipo==='corta'||p.tipo==='desarrollo'){
      var ta=document.createElement('textarea'); ta.className='fta'; ta.rows=p.tipo==='desarrollo'?5:3;
      ta.placeholder=p.tipo==='desarrollo'?'Desarrolla tu respuesta completa aquí…':'Escribe tu respuesta aquí…';
      ta.oninput=function(){
        respuestas[p.id]={tipo:'texto',val:this.value.trim()};
        actualizarProgreso();
        pCard.style.borderColor=this.value.trim()?'var(--navy)':'var(--border)';
      };
      pCard.appendChild(ta);
    }

    if(modoPantalla==='una'){
      pCard.style.display = idx===0?'block':'none';
      pCards.push(pCard);
    }
    body.appendChild(pCard);
  });

  // Wire nav buttons for una mode
  if(modoPantalla==='una'){
    setTimeout(function(){
      var btnPrev=document.getElementById('preg-prev');
      var btnNext=document.getElementById('preg-next');
      if(btnPrev) btnPrev.onclick=function(){ if(pregActual>0) showPregunta(pregActual-1); };
      if(btnNext) btnNext.onclick=function(){
        if(pregActual<pregs.length-1){ showPregunta(pregActual+1); }
        else {
          // Last question — trigger submit
          var nResp=Object.keys(respuestas).length;
          if(nResp<pregs.length){
            if(!confirm('Quedan '+(pregs.length-nResp)+' preguntas sin responder. ¿Entregar igualmente?')) return;
          }
          if(!corregido){
            corregido=true;
            var adjAluFinal=body._adjAluCard?body._adjAluCard._getAdjuntos():[];
            corregirActividad(act, pregs, respuestas, body, esEval, udId, adjAluFinal);
            if(btnEntregar) btnEntregar.style.display='none';
            if(navUna) navUna.style.display='none';
          }
        }
      };
      showPregunta(0);
    }, 10);
  }

  // Sección adjuntos del alumno (si está habilitada)
  if(act.alumnoAdjuntos){
    var adjAluCard = document.createElement('div');
    adjAluCard.style.cssText='border:1px solid var(--border);border-radius:var(--rl);padding:14px 16px;margin-bottom:12px;background:var(--surface)';
    var adjAluHdr = document.createElement('div');
    adjAluHdr.style.cssText='font-size:14px;font-weight:600;margin-bottom:10px';
    adjAluHdr.textContent='📎 Adjunta tu trabajo / documentación';
    adjAluCard.appendChild(adjAluHdr);
    var adjAluList = document.createElement('div'); adjAluList.id='alu-adj-list';
    adjAluCard.appendChild(adjAluList);
    var adjAluFiles = []; // {nombre, id}
    function renderAluAdj(){
      adjAluList.innerHTML='';
      if(!adjAluFiles.length){
        var noAdj=document.createElement('div'); noAdj.style.cssText='font-size:13px;color:var(--muted)';
        noAdj.textContent='Sin archivos adjuntados todavía.'; adjAluList.appendChild(noAdj); return;
      }
      adjAluFiles.forEach(function(f,i){
        var row=document.createElement('div'); row.style.cssText='display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--border)';
        var ico=document.createElement('span'); ico.textContent='📄'; ico.style.fontSize='1.1rem';
        var nm=document.createElement('div'); nm.style.cssText='flex:1;font-size:13px'; nm.textContent=f.nombre;
        var rmBtn=document.createElement('button'); rmBtn.className='btn btn-d btn-sm'; rmBtn.style.fontSize='11px'; rmBtn.textContent='✕';
        rmBtn.onclick=(function(idx){ return function(){ adjAluFiles.splice(idx,1); renderAluAdj(); }; })(i);
        row.appendChild(ico); row.appendChild(nm); row.appendChild(rmBtn);
        adjAluList.appendChild(row);
      });
    }
    renderAluAdj();
    var btnAdjAlu=document.createElement('button'); btnAdjAlu.className='btn btn-g btn-sm'; btnAdjAlu.style.marginTop='8px';
    btnAdjAlu.innerHTML='📎 Adjuntar archivo';
    btnAdjAlu.onclick=function(){
      var inp=document.createElement('input'); inp.type='file'; inp.accept='.pdf,.doc,.docx,.xlsx,.pptx,.html,.jpg,.png,.txt';
      inp.onchange=function(e){
        var file=e.target.files[0]; if(!file) return;
        var reader=new FileReader();
        reader.onload=function(ev){
          var id='alu_adj_'+Date.now();
          saveContMedia(id, ev.target.result);
          adjAluFiles.push({nombre:file.name, id:id});
          renderAluAdj(); flash('Archivo adjuntado','#16a34a');
        };
        reader.readAsDataURL(file);
      };
      inp.click();
    };
    adjAluCard.appendChild(btnAdjAlu);
    // Store for submission
    adjAluCard._getAdjuntos = function(){ return adjAluFiles; };
    body._adjAluCard = adjAluCard;
    body.appendChild(adjAluCard);
  }

  // Botón entregar
  var btnEntregar=document.createElement('button');
  btnEntregar.className='btn btn-p';
  btnEntregar.style.cssText='width:100%;padding:12px;font-size:15px;margin-top:8px';
  btnEntregar.textContent='📤 Entregar actividad';
  if(modoPantalla==='una') btnEntregar.style.display='none'; // nav handles submit
  btnEntregar.onclick=function(){
    if(corregido) return;
    var nResp=Object.keys(respuestas).length;
    if(nResp<pregs.length){
      if(!confirm('Quedan '+(pregs.length-nResp)+' preguntas sin responder. ¿Entregar igualmente?')) return;
    }
    corregido=true;
    btnEntregar.style.display='none';
    if(navUna) navUna.style.display='none';
    var adjAluFinal = body._adjAluCard ? body._adjAluCard._getAdjuntos() : [];
    // Si hay tiempo restante y es evaluable: esperar a que acabe el tiempo
    if(act.tiempoMin && act.tiempoMin>0 && esEval && secondsLeft>0){
      window._pendingCorrection = {act:act, pregs:pregs, respuestas:respuestas, body:body, esEval:esEval, udId:udId, adjAluFinal:adjAluFinal};
      mostrarEsperaCorreccion(body, secondsLeft);
    } else {
      corregirActividad(act, pregs, respuestas, body, esEval, udId, adjAluFinal);
    }
  };
  body.appendChild(btnEntregar);

  panel.appendChild(body);

  // Wire header entregar button
  setTimeout(function(){
    var btnH = document.getElementById('btn-entregar-header');
    if(!btnH) return;
    btnH.onclick = function(){
      if(corregido) return;
      var nResp = Object.keys(respuestas).length;
      var msg = nResp < pregs.length
        ? 'Quedan '+(pregs.length-nResp)+' preguntas sin responder. ¿Entregar igualmente?'
        : '¿Confirmas que quieres entregar el examen ahora?';
      if(!confirm(msg)) return;
      corregido = true;
      btnH.style.background = '#6b7280';
      btnH.textContent = '✓ Entregado';
      btnH.disabled = true;
      if(btnEntregar) btnEntregar.style.display='none';
      if(navUna) navUna.style.display='none';
      var adjAluFinal = body._adjAluCard ? body._adjAluCard._getAdjuntos() : [];
      if(act.tiempoMin && act.tiempoMin>0 && esEval && secondsLeft>0){
        window._pendingCorrection = {act:act, pregs:pregs, respuestas:respuestas, body:body, esEval:esEval, udId:udId, adjAluFinal:adjAluFinal};
        mostrarEsperaCorreccion(body, secondsLeft);
      } else {
        corregirActividad(act, pregs, respuestas, body, esEval, udId, adjAluFinal);
      }
    };
  }, 50);

  overlay.appendChild(panel);
  document.body.appendChild(overlay);
  document.body.style.overflow='hidden';

  // ── Modo vigilancia antitrampas ────────────────────────
  if(act.antitrampas){
    // Solicitar pantalla completa
    if(act.pantallaCompleta){
      try{ document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen(); }catch(e){}
    }

    var salidasCount = 0;
    var maxSal = act.maxSalidas||0;
    var avisoEl = document.createElement('div');
    avisoEl.id = 'antitrampas-aviso';
    avisoEl.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px';
    avisoEl.innerHTML =
      '<div style="font-size:3rem">⚠️</div>'+
      '<div style="color:#fff;font-size:20px;font-weight:700;text-align:center">Se ha detectado un cambio de pestaña o ventana</div>'+
      '<div id="at-contador" style="color:#fde68a;font-size:15px;text-align:center"></div>'+
      '<button id="at-volver" style="background:#1a2744;color:#fff;border:none;border-radius:8px;padding:12px 28px;font-size:15px;cursor:pointer;font-weight:700">Volver al examen</button>';
    document.body.appendChild(avisoEl);

    // Contador visible en el panel
    var atBadge = document.createElement('div');
    atBadge.id = 'at-badge';
    atBadge.style.cssText = 'position:fixed;top:70px;right:16px;background:var(--amber-bg);color:var(--amber);border:1px solid #fde68a;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;z-index:3000';
    atBadge.textContent = '🔍 Vigilancia activa · 0 salidas';
    document.body.appendChild(atBadge);

    function detectarSalida(){
      if(document.hidden){
        salidasCount++;
        var atCont = document.getElementById('at-contador');
        var atVolver = document.getElementById('at-volver');
        var atAv = document.getElementById('antitrampas-aviso');
        if(atBadge) atBadge.textContent='🔍 Vigilancia activa · '+salidasCount+' salida'+(salidasCount!==1?'s':'');
        if(atBadge) atBadge.style.background='var(--red-bg)'; if(atBadge) atBadge.style.color='var(--red)';
        if(atCont){
          var msg='Salida nº '+salidasCount;
          if(maxSal>0) msg+=' de '+maxSal+' permitidas';
          atCont.textContent=msg;
        }
        if(atAv) atAv.style.display='flex';
        if(maxSal>0 && salidasCount>=maxSal){
          if(atVolver) atVolver.textContent='Tiempo agotado — entregando…';
          setTimeout(function(){
            if(!corregido){
              corregido=true;
              corregirActividad(act, pregs, respuestas, body, esEval, udId, []);
              if(btnEntregar) btnEntregar.style.display='none';
              flash('⚠️ Examen entregado automáticamente por superar las salidas permitidas','#dc2626');
            }
            if(atAv) atAv.style.display='none';
          }, 2000);
        } else {
          if(atVolver) atVolver.onclick=function(){ if(atAv) atAv.style.display='none'; };
        }
      }
    }

    document.addEventListener('visibilitychange', detectarSalida);
    document.addEventListener('fullscreenchange', function(){
      if(!document.fullscreenElement && act.pantallaCompleta && !corregido){
        try{ document.documentElement.requestFullscreen(); }catch(e){}
      }
    });

    // Limpiar al cerrar
    var origOvRemove = overlay.remove.bind(overlay);
    overlay.remove = function(){
      document.removeEventListener('visibilitychange', detectarSalida);
      if(document.fullscreenElement) try{ document.exitFullscreen(); }catch(e){}
      var av=document.getElementById('antitrampas-aviso'); if(av) av.remove();
      var ab=document.getElementById('at-badge'); if(ab) ab.remove();
      origOvRemove();
    };
  }

  // Arrancar temporizador si hay tiempo límite
  if(act.tiempoMin && act.tiempoMin > 0){
    var secondsLeft = act.tiempoMin * 60;
    var timerEl = document.getElementById('act-timer');
    var totalSeconds = secondsLeft;

    // Crear barra de progreso de tiempo visible bajo el header
    var timerBar = document.createElement('div');
    timerBar.style.cssText='height:5px;background:var(--border);flex-shrink:0;overflow:hidden';
    var timerFill = document.createElement('div');
    timerFill.style.cssText='height:100%;width:100%;background:#22c55e;transition:width 1s linear,background .5s';
    timerBar.appendChild(timerFill);
    // Insert after header (ph is first child)
    panel.insertBefore(timerBar, panel.children[1]);

    // Avisos ya lanzados (para no repetirlos)
    var avisosLanzados = {};

    function lanzarAviso(msg, color){
      var av = document.createElement('div');
      av.style.cssText='position:fixed;top:80px;left:50%;transform:translateX(-50%);'+
        'background:'+color+';color:#fff;padding:12px 24px;border-radius:10px;font-size:15px;'+
        'font-weight:700;z-index:9998;box-shadow:0 4px 16px rgba(0,0,0,.3);text-align:center;'+
        'animation:fadeInDown .3s ease';
      av.textContent=msg;
      document.body.appendChild(av);
      setTimeout(function(){ av.style.opacity='0'; av.style.transition='opacity .5s'; setTimeout(function(){ av.remove(); }, 500); }, 4000);
    }

    // Añadir keyframes si no existen
    if(!document.getElementById('timer-keyframes')){
      var ks=document.createElement('style'); ks.id='timer-keyframes';
      ks.textContent='@keyframes fadeInDown{from{opacity:0;transform:translateX(-50%) translateY(-10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}'+
        '@keyframes timerPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}';
      document.head.appendChild(ks);
    }

    var timerInterval = setInterval(function(){
      secondsLeft--;
      var m = Math.floor(secondsLeft/60);
      var s = secondsLeft % 60;
      var pct = secondsLeft/totalSeconds;

      // Actualizar barra
      timerFill.style.width = (pct*100)+'%';
      timerFill.style.background = pct>0.5?'#22c55e':pct>0.25?'#f59e0b':'#ef4444';

      // Actualizar texto en header
      if(timerEl){
        timerEl.textContent='⏱ '+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
        // Estilo según tiempo restante
        if(secondsLeft<=60){
          timerEl.style.background='rgba(220,38,38,.8)';
          timerEl.style.animation='timerPulse 1s infinite';
        } else if(secondsLeft<=180){
          timerEl.style.background='rgba(245,158,11,.7)';
          timerEl.style.animation='';
        }
      }

      // Avisos progresivos
      var mitad = Math.floor(totalSeconds/2);
      var cuarto = Math.floor(totalSeconds/4);
      if(totalSeconds>=600 && secondsLeft===mitad && !avisosLanzados['mitad']){
        avisosLanzados['mitad']=true;
        lanzarAviso('⏱ Te queda la mitad del tiempo ('+m+' min)', '#f59e0b');
      }
      if(secondsLeft===300 && totalSeconds>300 && !avisosLanzados['5min']){
        avisosLanzados['5min']=true;
        lanzarAviso('⚠️ ¡Solo quedan 5 minutos!', '#ef4444');
      }
      if(secondsLeft===60 && !avisosLanzados['1min']){
        avisosLanzados['1min']=true;
        lanzarAviso('🔴 ¡Último minuto! Revisa tus respuestas', '#dc2626');
      }
      if(secondsLeft===30 && !avisosLanzados['30s']){
        avisosLanzados['30s']=true;
        lanzarAviso('⏰ ¡30 segundos!', '#dc2626');
      }
      if(secondsLeft===10 && !avisosLanzados['10s']){
        avisosLanzados['10s']=true;
        lanzarAviso('💥 ¡10 segundos!', '#7f1d1d');
      }

      // Tiempo agotado
      if(secondsLeft<=0){
        clearInterval(timerInterval);
        if(timerEl){ timerEl.textContent='⏱ 00:00'; timerEl.style.animation=''; }
        timerFill.style.width='0%';
        var btnH2=document.getElementById('btn-entregar-header'); if(btnH2){ btnH2.style.background='#6b7280'; btnH2.textContent='\u2713 Entregado'; btnH2.disabled=true; }
        if(window._pendingCorrection){
          // Alumno ya entregó antes — ahora mostrar corrección
          var pc=window._pendingCorrection; window._pendingCorrection=null;
          var waitEl=document.getElementById('espera-correccion'); if(waitEl) waitEl.remove();
          corregirActividad(pc.act, pc.pregs, pc.respuestas, pc.body, pc.esEval, pc.udId, pc.adjAluFinal);
          lanzarAviso('\u23f1 Tiempo finalizado \u2014 ya puedes ver tu calificaci\u00f3n', '#16a34a');
        } else if(!corregido){
          corregido=true;
          var adjAluFinal=body._adjAluCard?body._adjAluCard._getAdjuntos():[];
          corregirActividad(act, pregs, respuestas, body, esEval, udId, adjAluFinal);
          if(btnEntregar) btnEntregar.style.display='none';
          if(navUna) navUna.style.display='none';
          lanzarAviso('\u23f1 Tiempo agotado \u2014 examen entregado', '#7f1d1d');
        }
      }
    }, 1000);

    // Limpiar al cerrar
    var origClose = overlay.remove.bind(overlay);
    overlay.remove = function(){
      clearInterval(timerInterval);
      var ks=document.getElementById('timer-keyframes'); if(ks) ks.remove();
      origClose();
    };
  }
}

// ── Pantalla de espera hasta fin del tiempo ───────────
function mostrarEsperaCorreccion(body, secsLeft){
  // Ocultar todas las tarjetas de preguntas
  body.querySelectorAll('[id^="run-card-"]').forEach(function(c){ c.style.display='none'; });

  var espera = document.createElement('div');
  espera.id = 'espera-correccion';
  espera.style.cssText='text-align:center;padding:3rem 2rem;';

  espera.innerHTML=
    '<div style="font-size:3.5rem;margin-bottom:16px">✅</div>'+
    '<div style="font-size:20px;font-weight:700;color:var(--navy);margin-bottom:8px">¡Examen entregado!</div>'+
    '<div style="font-size:14px;color:var(--muted);margin-bottom:24px">Tu examen ha sido guardado correctamente.<br>La corrección y calificación se mostrarán cuando finalice el tiempo para todos.</div>'+
    '<div style="font-size:13px;color:var(--muted);margin-bottom:8px">Tiempo restante hasta mostrar resultados:</div>'+
    '<div id="espera-countdown" style="font-family:IBM Plex Mono,monospace;font-size:2.5rem;font-weight:800;color:var(--navy);letter-spacing:.05em">--:--</div>'+
    '<div style="margin-top:20px;padding:10px 16px;background:var(--amber-bg);border-radius:var(--r);font-size:12.5px;color:var(--amber);border-left:3px solid var(--amber)">'+
      '⚠️ No cierres esta ventana. Los resultados aparecerán aquí automáticamente al acabar el tiempo.'+
    '</div>';

  body.appendChild(espera);

  // Actualizar countdown en la pantalla de espera
  var countdownEl = document.getElementById('espera-countdown');
  var waitInterval = setInterval(function(){
    secsLeft--;
    if(countdownEl){
      var m=Math.floor(secsLeft/60), s=secsLeft%60;
      countdownEl.textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
    }
    if(secsLeft<=0) clearInterval(waitInterval);
  }, 1000);
  if(countdownEl){
    var m0=Math.floor(secsLeft/60), s0=secsLeft%60;
    countdownEl.textContent=String(m0).padStart(2,'0')+':'+String(s0).padStart(2,'0');
  }
}


// ── Corrección de actividad ───────────────────────────
function corregirActividad(act, pregs, respuestas, body, esEval, udId, adjAlu){
  if(body && body._bloquearFeedback){
    body._bloquearFeedback=false;
    var _bbs=body.querySelectorAll?body.querySelectorAll('[data-bloqueo-calculo="1"]'):[];
    _bbs.forEach(function(btn){
      btn.disabled=false; btn.style.opacity=''; btn.style.cursor='';
      btn.innerHTML='✓ Corregir ejercicio';
      if(btn._onCorregirRef){btn.onclick=btn._onCorregirRef; btn.removeAttribute('data-bloqueo-calculo');}
    });
    var _bb=document.getElementById('banner-bloqueo-feedback');
    if(_bb) _bb.style.display='none';
  }

  var correctas=0, incorrectas=0, blanco=0, manualPending=0;
  var pen = act.penalizacion||0;
  var notasManual = {}; // pregId → nota manual 0-10

  pregs.forEach(function(p){
    var resp = respuestas[p.id];
    var card = document.getElementById('run-card-'+p.id);
    if(p.tipo==='calculo'||p.tipo==='formulario') return;

    if(!resp || resp.val===undefined || resp.val===''){
      blanco++;
      if(card) card.style.borderColor='var(--muted)';
      return;
    }

    if(p.tipo==='test'||p.tipo==='vf'){
      var ok=(resp.val===p.correcto);
      if(ok) correctas++; else incorrectas++;
      if(card) card.style.borderColor=ok?'var(--green)':'var(--red)';
      var btns=card?card.querySelectorAll('button'):[];
      btns.forEach(function(btn,i){
        var realIdx = btn.dataset.realIdx!=null ? parseInt(btn.dataset.realIdx) : i;
        var esCorr=(realIdx===p.correcto), esEleg=(realIdx===resp.val);
        btn.style.background=esCorr?'var(--green-bg)':esEleg&&!esCorr?'var(--red-bg)':'var(--surface2)';
        btn.style.color=esCorr?'var(--green)':esEleg&&!esCorr?'var(--red)':'var(--muted)';
        btn.style.border='2px solid '+(esCorr?'#bbf7d0':esEleg&&!esCorr?'#fecaca':'var(--border)');
        btn.style.fontWeight=esCorr||esEleg?'600':'';
      });
      if(p.explicacion&&card){
        var expEl=document.createElement('div');
        expEl.style.cssText='margin-top:10px;padding:9px 12px;background:var(--surface2);border-radius:var(--r);border-left:3px solid var(--navy);font-size:12.5px;color:var(--muted)';
        expEl.innerHTML='💡 '+p.explicacion; card.appendChild(expEl);
      }
    } else if(p.tipo==='corta'||p.tipo==='desarrollo'){
      if(card) card.style.borderColor='var(--amber)';
      if(p.respuestaModelo&&card){
        var modEl=document.createElement('div');
        modEl.style.cssText='margin-top:10px;padding:10px 12px;background:var(--green-bg);border-radius:var(--r);border-left:3px solid var(--green)';
        modEl.innerHTML='<div style="font-size:11px;font-weight:700;color:var(--green);text-transform:uppercase;margin-bottom:4px">✓ Respuesta modelo</div>'+
          '<div style="font-size:13px;line-height:1.6">'+p.respuestaModelo+'</div>';
        card.appendChild(modEl);
      }
      // Corrección manual si está activada y es evaluable
      if(esEval && act.correccionManual && ROL==='profesor' && card){
        manualPending++;
        var manualWrap=document.createElement('div');
        manualWrap.style.cssText='margin-top:10px;padding:10px 12px;background:var(--amber-bg);border-radius:var(--r);border-left:3px solid var(--amber);display:flex;align-items:center;gap:10px';
        var manualLbl=document.createElement('div'); manualLbl.style.cssText='font-size:12px;font-weight:600;color:var(--amber);flex:1';
        manualLbl.textContent='✏️ Corrección manual — asigna una nota a esta respuesta:';
        var manualInp=document.createElement('input'); manualInp.type='number';
        manualInp.min='0'; manualInp.max='10'; manualInp.step='0.5'; manualInp.value='';
        manualInp.style.cssText='width:60px;padding:4px 6px;border:1px solid var(--border);border-radius:6px;font-size:13px;font-weight:700;text-align:center;font-family:IBM Plex Mono,monospace';
        manualInp.placeholder='0-10';
        manualInp.dataset.pregid=p.id;
        manualInp.onchange=(function(pid){ return function(){
          notasManual[pid]=parseFloat(this.value);
          recalcularNota();
        }; })(p.id);
        var manualDe=document.createElement('span'); manualDe.style.cssText='font-size:12px;color:var(--muted)';
        manualDe.textContent='/10';
        manualWrap.appendChild(manualLbl); manualWrap.appendChild(manualInp); manualWrap.appendChild(manualDe);
        card.appendChild(manualWrap);
      } else {
        blanco++;
      }
    }
  });

  // Nota automática (test/vf)
  var testPregs=pregs.filter(function(p){ return p.tipo==='test'||p.tipo==='vf'; });
  var devPregs=pregs.filter(function(p){ return p.tipo==='corta'||p.tipo==='desarrollo'; });
  var totalPregs = pregs.filter(function(p){ return p.tipo!=='calculo'&&p.tipo!=='formulario'&&p.tipo!=='mapa'; });

  function calcNota(){
    if(!totalPregs.length) return null;  // adjAlu available for professor review
    var puntosTest = (correctas - (incorrectas*pen));
    var puntosTotal = puntosTest;
    // Sumar notas manuales de desarrollo (sobre 10 cada una, ponderadas)
    devPregs.forEach(function(p){
      if(notasManual[p.id]!=null) puntosTotal += notasManual[p.id]/10;
    });
    return Math.max(0, Math.min(10, (puntosTotal/totalPregs.length)*10));
  }

  // Bloque resultado
  var resWrap=document.createElement('div');
  resWrap.id='act-resultado-wrap';
  resWrap.style.cssText='margin-top:16px;padding:16px 18px;border-radius:var(--rl);background:var(--surface2);border:1px solid var(--border)';

  function recalcularNota(){
    var nota=calcNota();
    var hayManualPendiente = devPregs.some(function(p){ return notasManual[p.id]==null && act.correccionManual && ROL==='profesor'; });
    var colorFondo = nota===null?'var(--surface2)':nota>=5?'var(--green-bg)':'var(--red-bg)';
    var colorBorde = nota===null?'var(--border)':nota>=5?'#bbf7d0':'#fecaca';
    resWrap.style.background=colorFondo; resWrap.style.border='2px solid '+colorBorde;
    // Store adjuntos reference for display
    resWrap._adjAlu = adjAlu||[];

    var html='';
    if(nota!==null){
      html='<div style="font-size:2.5rem;font-weight:800;color:'+(nota>=5?'var(--green)':'var(--red)')+'">'+nota.toFixed(2)+
        '<span style="font-size:1.2rem">/10</span></div>';
    } else {
      html='<div style="font-size:1.5rem;font-weight:700;color:var(--amber)">Pendiente de corrección</div>';
    }
    html+='<div style="font-size:13px;margin-top:8px;display:flex;gap:14px;flex-wrap:wrap">'+
      (testPregs.length?'<span>✅ <strong>'+correctas+'</strong> correctas</span>'+
        '<span>❌ <strong>'+incorrectas+'</strong> incorrectas</span>'+
        '<span>⬜ <strong>'+blanco+'</strong> en blanco</span>'+
        (pen>0?'<span style="color:var(--amber)">Penalización −'+pen+'</span>':''):'')+'</div>';
    if(hayManualPendiente){
      html+='<div style="font-size:12px;color:var(--amber);margin-top:8px;font-weight:600">⚠️ Asigna notas a todas las respuestas de desarrollo para finalizar.</div>';
    }
    // Mostrar adjuntos del alumno al profesor
    if(adjAlu&&adjAlu.length&&ROL==='profesor'){
      html+='<div style="margin-top:10px;padding:10px 12px;background:var(--surface2);border-radius:var(--r)">'+
        '<div style="font-size:12px;font-weight:700;color:var(--navy);margin-bottom:6px">📎 Documentación adjuntada por el alumno:</div>'+
        adjAlu.map(function(f){
          var media=getContMedia();
          return '<div style="display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid var(--border)">'+
            '<span>📄</span><span style="flex:1;font-size:13px">'+f.nombre+'</span>'+
            (media[f.id]?'<a href="'+media[f.id]+'" download="'+f.nombre+'" class="btn btn-g btn-sm" style="font-size:11px">⬇ Descargar</a>':'')+
          '</div>';
        }).join('')+
      '</div>';
    }
    if(nota!==null && esEval && !hayManualPendiente){
      var grupoOpts2='';
      if(act.esGrupo && act.grupos && act.grupos.length){
        grupoOpts2='<select id="sel-grupo-cal" class="fs" style="font-size:13px;margin-bottom:6px;width:100%">'+
          '<option value="">— Sin grupo (individual) —</option>'+
          act.grupos.map(function(g){
            return '<option value="'+g.id+'">'+g.nombre+' ('+g.miembros.length+' miembros)</option>';
          }).join('')+
        '</select>';
      }
      html+='<div style="margin-top:12px">'+
        (grupoOpts2?'<div><label style="font-size:12px;font-weight:600;color:var(--navy);display:block;margin-bottom:4px">👥 Aplicar nota a grupo:</label>'+grupoOpts2+'</div>':'')+
        '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:6px">'+
          '<span style="font-size:13px;font-weight:600;color:var(--navy)">Calificación final:</span>'+
          '<input type="number" id="nota-final-input" min="0" max="10" step="0.1" value="'+nota.toFixed(2)+
          '" style="width:70px;padding:5px 8px;border:2px solid var(--navy);border-radius:8px;font-size:16px;font-weight:800;text-align:center;font-family:IBM Plex Mono,monospace">'+
          '<span style="font-size:13px;color:var(--muted)">/10</span>'+
          '<button id="btn-reg-cal" class="btn btn-p btn-sm">💾 Registrar calificación</button>'+
        '</div>'+
      '</div>';
    }
    resWrap.innerHTML=html;
  }

  recalcularNota();

  // Guardar intento en historial (actividades de aprendizaje, no evaluables)
  if(!esEval){
    var notaFinal = calcNota();
    if(notaFinal!==null){
      var udActObj = null;
      // Buscar la actividad en ACT_APRENDIZAJE
      Object.keys(ACT_APRENDIZAJE).forEach(function(uid){
        (ACT_APRENDIZAJE[uid]||[]).forEach(function(a){
          if(a.id===act.id) udActObj={uid:uid, act:a};
        });
      });
      if(udActObj){
        if(!udActObj.act.historial) udActObj.act.historial=[];
        udActObj.act.historial.unshift({
          fecha: new Date().toLocaleDateString('es-ES'),
          hora:  new Date().toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}),
          nota:  Math.round(notaFinal*10)/10,
          correctas: correctas,
          incorrectas: incorrectas,
          blanco: blanco,
          nPregs: pregs.length
        });
        if(udActObj.act.historial.length>10) udActObj.act.historial=udActObj.act.historial.slice(0,10);
        saveActAprend();
      }
    }
  }

  body.appendChild(resWrap);

  // ── Historial de intentos (actividades de aprendizaje) ──
  if(!esEval){
    var histActObj=null;
    Object.keys(ACT_APRENDIZAJE).forEach(function(uid){
      (ACT_APRENDIZAJE[uid]||[]).forEach(function(a){ if(a.id===act.id) histActObj=a; });
    });
    var hist = histActObj&&histActObj.historial ? histActObj.historial : [];
    if(hist.length>1){
      var histWrap=document.createElement('div');
      histWrap.style.cssText='margin-top:12px;border:1px solid var(--border);border-radius:var(--r);overflow:hidden';
      var histHdr=document.createElement('div');
      histHdr.style.cssText='display:flex;align-items:center;gap:10px;padding:9px 14px;background:var(--surface2);cursor:pointer;user-select:none';
      var mejorNota=Math.max.apply(null,hist.map(function(h){return h.nota;}));
      histHdr.innerHTML='<div style="font-size:13px;font-weight:600;flex:1">📈 Historial de intentos</div>'+
        '<span style="font-size:12px;color:var(--muted)">Mejor: <strong style="color:var(--navy)">'+mejorNota.toFixed(1)+'/10</strong> · '+hist.length+' intento'+(hist.length!==1?'s':'')+'</span>'+
        '<span id="hist-arrow" style="font-size:10px;color:var(--muted);transition:transform .2s">▼</span>';
      histWrap.appendChild(histHdr);

      var histBody=document.createElement('div');
      histBody.style.cssText='overflow:hidden;max-height:0;transition:max-height .3s ease';
      var histTable=document.createElement('div');

      hist.forEach(function(h,i){
        var row=document.createElement('div');
        row.style.cssText='display:grid;grid-template-columns:1fr auto auto auto auto;gap:0;padding:8px 14px;border-top:1px solid var(--border);align-items:center;font-size:13px;'+(i===0?'background:rgba(34,197,94,.05)':'');
        var fechaEl=document.createElement('div');
        fechaEl.style.cssText='color:var(--muted);font-size:12px';
        fechaEl.textContent=(i===0?'🕐 Ahora ('+h.hora+')':h.fecha+' '+h.hora);
        var notaEl=document.createElement('div');
        notaEl.style.cssText='font-weight:700;color:'+(h.nota>=5?'var(--green)':'var(--red)')+';text-align:right;margin-right:16px;font-family:IBM Plex Mono,monospace';
        notaEl.textContent=h.nota.toFixed(1)+'/10';
        var corrEl=document.createElement('div');
        corrEl.style.cssText='font-size:12px;color:var(--green);margin-right:10px';
        corrEl.textContent='✅ '+h.correctas;
        var incEl=document.createElement('div');
        incEl.style.cssText='font-size:12px;color:var(--red);margin-right:10px';
        incEl.textContent='❌ '+h.incorrectas;
        var blEl=document.createElement('div');
        blEl.style.cssText='font-size:12px;color:var(--muted)';
        blEl.textContent='⬜ '+h.blanco;
        if(h.nota===mejorNota&&i!==0){
          var star=document.createElement('span'); star.textContent=' ⭐'; star.title='Mejor intento';
          notaEl.appendChild(star);
        }
        row.appendChild(fechaEl); row.appendChild(notaEl);
        row.appendChild(corrEl); row.appendChild(incEl); row.appendChild(blEl);
        histTable.appendChild(row);
      });

      histBody.appendChild(histTable);
      histWrap.appendChild(histBody);
      body.appendChild(histWrap);

      var histOpen=false;
      histHdr.onclick=function(){
        histOpen=!histOpen;
        histBody.style.maxHeight=histOpen?histBody.scrollHeight+'px':'0px';
        var arr=document.getElementById('hist-arrow'); if(arr) arr.style.transform=histOpen?'rotate(180deg)':'';
      };
      // Auto-open
      setTimeout(function(){ histHdr.click(); },300);
    }
  }

  // ── Desglose pregunta a pregunta ─────────────────────
  var desgloseWrap = document.createElement('div');
  desgloseWrap.style.cssText='margin-top:16px';

  // Cabecera colapsable
  var desgloseHdr = document.createElement('div');
  desgloseHdr.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--navy);border-radius:var(--r);cursor:pointer;user-select:none';
  desgloseHdr.innerHTML=
    '<div style="font-size:13px;font-weight:700;color:#fff">📋 Desglose de respuestas</div>'+
    '<span id="desglose-arrow" style="color:rgba(255,255,255,.6);font-size:11px;transition:transform .25s">▼</span>';
  desgloseWrap.appendChild(desgloseHdr);

  var desgloseBody = document.createElement('div');
  desgloseBody.style.cssText='overflow:hidden;max-height:0;transition:max-height .3s ease';
  var desgloseInner = document.createElement('div');
  desgloseInner.style.cssText='border:1px solid var(--border);border-top:none;border-radius:0 0 var(--r) var(--r);overflow:hidden';

  var letters=['A','B','C','D'];

  pregs.forEach(function(p, idx){
    var resp = respuestas[p.id];
    var info = TIPOS_PREGUNTA[p.tipo]||TIPOS_PREGUNTA.test;
    var row = document.createElement('div');
    row.style.cssText='display:grid;grid-template-columns:28px 1fr 1fr 1fr;gap:0;border-bottom:1px solid var(--border);font-size:12.5px';

    // Número
    var numCell = document.createElement('div');
    numCell.style.cssText='padding:10px 8px;display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--muted);border-right:1px solid var(--border);background:var(--surface2)';
    numCell.textContent=idx+1;

    // Enunciado
    var enunCell = document.createElement('div');
    enunCell.style.cssText='padding:10px 12px;border-right:1px solid var(--border)';
    var tipoBadge=document.createElement('span');
    tipoBadge.style.cssText='background:'+info.color+';color:'+info.ctxt+';font-size:10px;padding:1px 6px;border-radius:10px;font-weight:600;margin-right:5px;white-space:nowrap';
    tipoBadge.textContent=info.ico+' '+info.label;
    enunCell.appendChild(tipoBadge);
    var enunTxt=document.createElement('span');
    enunTxt.style.cssText='color:var(--text);line-height:1.4';
    enunTxt.textContent=p.enunciado.slice(0,80)+(p.enunciado.length>80?'…':'');
    enunCell.appendChild(enunTxt);

    // Respuesta del alumno
    var alumnoCell = document.createElement('div');
    alumnoCell.style.cssText='padding:10px 12px;border-right:1px solid var(--border)';
    var alumnoTxt='—';
    var esCorrecta=false;
    var esBlanco=false;

    if(!resp||resp.val===undefined||resp.val===''){
      alumnoTxt='⬜ Sin respuesta'; esBlanco=true;
      alumnoCell.style.color='var(--muted)';
    } else if(p.tipo==='test'||p.tipo==='vf'){
      var letra=p.tipo==='vf'?(resp.val===0?'V':'F'):letters[resp.val]||'?';
      var textoResp=(p.opciones||[])[resp.val]||'';
      alumnoTxt=letra+') '+textoResp.slice(0,40)+(textoResp.length>40?'…':'');
      esCorrecta=(resp.val===p.correcto);
      alumnoCell.style.color=esCorrecta?'var(--green)':'var(--red)';
      alumnoCell.style.fontWeight='600';
    } else if(p.tipo==='corta'||p.tipo==='desarrollo'){
      alumnoTxt=(resp.val||'').slice(0,60)+((resp.val||'').length>60?'…':'');
      alumnoCell.style.color='var(--navy)';
    }
    alumnoCell.textContent=alumnoTxt;

    // Respuesta correcta + explicación
    var correctaCell = document.createElement('div');
    correctaCell.style.cssText='padding:10px 12px';

    if(p.tipo==='test'||p.tipo==='vf'){
      var letraCorr=p.tipo==='vf'?(p.correcto===0?'V':'F'):letters[p.correcto]||'?';
      var textoCorr=(p.opciones||[])[p.correcto]||'';
      var corrDiv=document.createElement('div');
      corrDiv.style.cssText='color:var(--green);font-weight:600;margin-bottom:'+(p.explicacion?'4px':'0');
      corrDiv.textContent='✓ '+letraCorr+') '+textoCorr.slice(0,40)+(textoCorr.length>40?'…':'');
      correctaCell.appendChild(corrDiv);
      if(p.explicacion){
        var expDiv=document.createElement('div');
        expDiv.style.cssText='font-size:11.5px;color:var(--muted);line-height:1.4';
        expDiv.textContent='💡 '+p.explicacion.slice(0,80)+(p.explicacion.length>80?'…':'');
        correctaCell.appendChild(expDiv);
      }
    } else if(p.tipo==='corta'||p.tipo==='desarrollo'){
      if(p.respuestaModelo){
        var modDiv=document.createElement('div');
        modDiv.style.cssText='color:var(--green);font-size:12px;line-height:1.4';
        modDiv.textContent='✓ '+p.respuestaModelo.slice(0,80)+(p.respuestaModelo.length>80?'…':'');
        correctaCell.appendChild(modDiv);
      } else {
        correctaCell.style.color='var(--muted)'; correctaCell.textContent='Corrección manual';
      }
    } else if(p.tipo==='calculo'){
      correctaCell.style.color='var(--muted)'; correctaCell.textContent='Ver desglose arriba';
    }

    // Color de fila
    if(!esBlanco && (p.tipo==='test'||p.tipo==='vf')){
      row.style.background = esCorrecta?'rgba(34,197,94,.04)':'rgba(239,68,68,.04)';
    }

    // Indicador izquierdo
    var indicator=document.createElement('div');
    indicator.style.cssText='position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:0;background:'+(esBlanco?'var(--muted)':esCorrecta?'var(--green)':'var(--red)');
    row.style.position='relative';
    row.appendChild(indicator);

    row.appendChild(numCell); row.appendChild(enunCell);
    row.appendChild(alumnoCell); row.appendChild(correctaCell);
    desgloseInner.appendChild(row);
  });

  // Cabecera de columnas
  var colHdr=document.createElement('div');
  colHdr.style.cssText='display:grid;grid-template-columns:28px 1fr 1fr 1fr;gap:0;background:var(--surface2);border-bottom:1px solid var(--border)';
  ['Nº','Pregunta','Tu respuesta','Respuesta correcta'].forEach(function(h){
    var c=document.createElement('div'); c.style.cssText='padding:6px 12px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);border-right:1px solid var(--border)';
    c.textContent=h; colHdr.appendChild(c);
  });
  desgloseInner.insertBefore(colHdr, desgloseInner.firstChild);
  desgloseBody.appendChild(desgloseInner);
  desgloseWrap.appendChild(desgloseBody);
  body.appendChild(desgloseWrap);

  // Toggle
  var desgloseOpen=false;
  desgloseHdr.onclick=function(){
    desgloseOpen=!desgloseOpen;
    desgloseBody.style.maxHeight=desgloseOpen?desgloseBody.scrollHeight+'px':'0px';
    var arr=document.getElementById('desglose-arrow'); if(arr) arr.style.transform=desgloseOpen?'rotate(180deg)':'';
    if(desgloseOpen) setTimeout(function(){ desgloseBody.style.maxHeight=desgloseBody.scrollHeight+'px'; },310);
  };
  // Abrir automáticamente al mostrar resultados
  setTimeout(function(){ desgloseHdr.click(); }, 200);

  // Wire the registrar button after DOM is ready
  setTimeout(function(){
    var btnReg = document.getElementById('btn-reg-cal');
    if(btnReg) btnReg.onclick = function(){
      var selGrupo=document.getElementById('sel-grupo-cal');
      var grupoId=selGrupo?selGrupo.value:'';
      registrarCalificacion(act.id, udId, grupoId);
    };
  }, 50);
}

function registrarCalificacion(actId, udId, grupoId){
  var inp=document.getElementById('nota-final-input');
  var nota=inp?parseFloat(inp.value):null;
  if(nota===null||isNaN(nota)){ flash('Introduce una calificación válida','#dc2626'); return; }
  nota=Math.max(0,Math.min(10,nota));
  var tests=getUDTests();
  if(!tests[udId]) tests[udId]=[];
  var act=(ACT_EVAL[udId]||[]).find(function(a){ return a.id===actId; });
  var fecha=new Date().toLocaleDateString('es-ES');

  if(grupoId && act && act.grupos){
    // Registrar para todos los miembros del grupo
    var grp=act.grupos.find(function(g){ return g.id===grupoId; });
    if(grp && grp.miembros.length){
      grp.miembros.forEach(function(mid){
        var al=DB.alumnos.find(function(a){ return a.id===mid; });
        tests[udId].push({actId:actId, titulo:act.titulo,
          nota:nota, fecha:fecha, alumnoId:mid,
          alumnoNombre:al?al.nombre+' '+al.apellidos:'',
          grupoId:grupoId, grupoNombre:grp.nombre});
      });
      saveUDTests(tests);
      flash('✓ Calificación '+nota.toFixed(2)+'/10 registrada para '+grp.miembros.length+' miembros del '+grp.nombre,'#16a34a');
    }
  } else {
    // Registro individual
    tests[udId].push({actId:actId, titulo:act?act.titulo:'',
      nota:nota, fecha:fecha});
    saveUDTests(tests);
    flash('✓ Calificación '+nota.toFixed(2)+'/10 registrada','#16a34a');
  }

  var wrap=document.getElementById('act-resultado-wrap');
  if(wrap){
    var reg=document.createElement('div');
    reg.style.cssText='margin-top:8px;font-size:13px;font-weight:600;color:var(--green)';
    reg.textContent='✓ Calificación registrada: '+nota.toFixed(2)+'/10';
    wrap.appendChild(reg);
  }
}




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
  var bloquesVisibles = ROL==='profesor' ? bloques : bloques.filter(function(b){ return b.publicado; });
  if(!bloquesVisibles.length && ROL!=='profesor'){
    container.innerHTML='<div style="text-align:center;padding:1.5rem;color:var(--muted);font-size:13px">Sin contenido disponible todavía.</div>';
    return;
  }
  // Agrupar por temaRef
  var grupos=[]; var sinTema=[];
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
  initBancoConEjemplos();
  // El rol se aplica via _aplicarRolVerificado() cuando Supabase confirma la sesión.
  // No se presupone ningún rol aquí para evitar escalada de privilegios.
  renderDashboard();
  setTimeout(function(){ toggleGroup('ud'); }, 100);
});
