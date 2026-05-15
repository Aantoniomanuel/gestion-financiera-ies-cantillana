// ── ONBOARDING ALUMNO ────────────────────────────────
(function(){

var OB_STEPS = [
  {
    target: null, // pantalla de bienvenida, sin spotlight
    emoji: '👋',
    title: '¡Bienvenido a GestiónFin!',
    body: 'Esta es tu plataforma de Gestión Financiera del IES Cantillana. En un par de minutos te enseñamos todo lo que necesitas saber para empezar.',
    pos: 'center'
  },
  {
    target: 'ni-dashboard',
    emoji: '🏠',
    title: 'Inicio',
    body: 'Desde aquí tienes un resumen de todo: calendario próximo, acceso rápido a los bloques y tu progreso en los simuladores.',
    pos: 'right'
  },
  {
    target: 'ni-calendario',
    emoji: '📅',
    title: 'Calendario',
    body: 'Aquí aparecen los eventos del módulo: entregas, exámenes y actividades. Tu profesor los publicará con antelación.',
    pos: 'right'
  },
  {
    target: 'grp-ud',
    emoji: '📖',
    title: 'Bloques del módulo',
    body: 'Aquí están los 6 bloques de contenido del módulo. Cada uno incluye teoría, conceptos clave, vídeos y actividades. Pulsa para desplegar.',
    pos: 'right'
  },
  {
    target: 'grp-sims',
    emoji: '🧮',
    title: 'Simuladores',
    body: 'Practica de forma interactiva con simuladores de bolsa, préstamos, productos bancarios, presupuestos e inversiones. Cuanto más practiques, mejor.',
    pos: 'right'
  },
  {
    target: 'ns-bolsa',
    emoji: '📊',
    title: 'Simulador de Bolsa',
    body: 'Compra y vende acciones reales del IBEX 35 con dinero virtual. Aprende a interpretar cotizaciones, rentabilidades y el riesgo de mercado.',
    pos: 'right',
    openGroup: 'sims'
  },
  {
    target: 'nav-actividades',
    emoji: '📝',
    title: 'Actividades evaluables',
    body: 'Aquí aparecen las actividades que tu profesor ha activado para entrega. Tendrás un plazo y se calificarán dentro del módulo.',
    pos: 'right',
    showForRol: 'alumno'  // solo si el nav está visible
  },
  {
    target: null,
    emoji: '🚀',
    title: '¡Todo listo!',
    body: 'Ya conoces la plataforma. Empieza por el bloque que te indique tu profesor. ¡Buena suerte con Gestión Financiera!',
    pos: 'center'
  }
];

var obStep = 0;
var obActive = false;

function obStart(){
  if(localStorage.getItem('gf_ob_done_v1')) return;
  obActive = true;
  obStep = 0;
  document.getElementById('ob-overlay').style.display = 'block';
  setTimeout(function(){
    document.getElementById('ob-overlay').style.opacity = '1';
    obRender();
  }, 80);
}

function obEnd(){
  obActive = false;
  localStorage.setItem('gf_ob_done_v1','1');
  var ov = document.getElementById('ob-overlay');
  var sp = document.getElementById('ob-spotlight');
  var card = document.getElementById('ob-card');
  ov.style.opacity = '0';
  setTimeout(function(){
    ov.style.display = 'none';
    sp.style.display = 'none';
    card.style.display = 'none';
  }, 350);
}

function obGetVisibleStep(dir){
  var idx = obStep;
  while(true){
    var s = OB_STEPS[idx];
    if(!s) return -1;
    // Si tiene target, comprobar que el elemento existe y es visible
    if(s.target){
      var el = document.getElementById(s.target);
      if(!el || el.offsetParent === null || el.style.display === 'none'){
        idx += dir;
        if(idx < 0) idx = 0;
        if(idx >= OB_STEPS.length) return OB_STEPS.length - 1;
        continue;
      }
    }
    return idx;
  }
}

function obRender(){
  var s = OB_STEPS[obStep];
  if(!s){ obEnd(); return; }

  // Abrir grupo si hace falta
  if(s.openGroup){
    var btn = document.getElementById('grp-'+s.openGroup);
    var sub = document.getElementById('sub-'+s.openGroup);
    if(btn && sub && !btn.classList.contains('open')){
      btn.classList.add('open'); sub.classList.add('open');
    }
  }

  var card = document.getElementById('ob-card');
  var sp   = document.getElementById('ob-spotlight');
  card.style.display = 'block';

  // Dots
  var dotsHtml = '<div class="ob-dots">';
  OB_STEPS.forEach(function(_, i){ dotsHtml += '<div class="ob-dot'+(i===obStep?' active':'')+'"></div>'; });
  dotsHtml += '</div>';

  var isLast = obStep === OB_STEPS.length - 1;
  var isFirst = obStep === 0;

  card.innerHTML =
    '<span class="ob-emoji">'+s.emoji+'</span>'+
    '<div class="ob-step">Paso '+(obStep+1)+' de '+OB_STEPS.length+'</div>'+
    '<div class="ob-title">'+s.title+'</div>'+
    '<div class="ob-body">'+s.body+'</div>'+
    '<div class="ob-btns">'+
      '<button class="ob-skip" onclick="obSkip()">Saltar tour</button>'+
      dotsHtml+
      (!isFirst ? '<button class="ob-prev" onclick="obPrev()">← Atrás</button>' : '')+
      '<button class="ob-next" onclick="obNext()">'+(isLast ? '¡Empezar! 🎉' : 'Siguiente →')+'</button>'+
    '</div>';

  if(s.pos === 'center' || !s.target){
    // Centrado en pantalla, sin spotlight
    sp.style.display = 'none';
    card.style.cssText = 'display:block;position:fixed;z-index:8002;background:#fff;border-radius:14px;padding:22px 24px 18px;max-width:340px;min-width:260px;box-shadow:0 8px 40px rgba(0,0,0,.28);font-family:sans-serif;transition:all .4s cubic-bezier(.4,0,.2,1);top:50%;left:50%;transform:translate(-50%,-50%)';
  } else {
    var el = document.getElementById(s.target);
    if(!el || el.style.display === 'none'){
      obStep += 1; obRender(); return;
    }
    var r = el.getBoundingClientRect();
    var pad = 6;
    sp.style.cssText = 'display:block;position:fixed;z-index:8001;border-radius:10px;box-shadow:0 0 0 9999px rgba(10,16,34,.72);transition:all .4s cubic-bezier(.4,0,.2,1);'+
      'left:'+(r.left-pad)+'px;top:'+(r.top-pad)+'px;width:'+(r.width+pad*2)+'px;height:'+(r.height+pad*2)+'px;pointer-events:none';

    // Posicionar card a la derecha o debajo del spotlight
    var cw = 300, ch = 200;
    var vw = window.innerWidth, vh = window.innerHeight;
    var cx, cy;
    if(s.pos === 'right' && r.right + cw + 20 < vw){
      cx = r.right + 16;
      cy = Math.min(r.top, vh - ch - 20);
    } else {
      cx = Math.min(r.left, vw - cw - 20);
      cy = r.bottom + 12;
      if(cy + ch > vh) cy = r.top - ch - 12;
    }
    cy = Math.max(10, cy);
    card.style.cssText = 'display:block;position:fixed;z-index:8002;background:#fff;border-radius:14px;padding:22px 24px 18px;max-width:300px;min-width:240px;box-shadow:0 8px 40px rgba(0,0,0,.28);font-family:sans-serif;transition:all .4s cubic-bezier(.4,0,.2,1);left:'+cx+'px;top:'+cy+'px';
  }
}

function obNext(){
  if(obStep >= OB_STEPS.length - 1){ obEnd(); return; }
  obStep++;
  obRender();
}
function obPrev(){
  if(obStep <= 0) return;
  obStep--;
  obRender();
}
function obSkip(){ obEnd(); }

// Exponer globalmente
window.obNext = obNext;
window.obPrev = obPrev;
window.obSkip = obSkip;
window.obStart = obStart;

// Lanzar el tour cuando el alumno hace login
var _origActualizar = window.actualizarUIConPerfil;
// El hook se instala después de que la función esté definida

})();


