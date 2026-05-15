<script>
// ══════════════════════════════════════════════════════
//  DATOS REALES — Gestión Financiera IES Cantillana 26-27
//  Basados en: RD 1584/2011, Orden Junta Andalucía 11/03/2013
//  Estructura: DISTRIBUCIÓN_BLOQUES_G_FRA_26-27.docx
// ══════════════════════════════════════════════════════

var ROL = 'alumno'; // valor por defecto seguro; se fija al confirmar sesión con Supabase

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

