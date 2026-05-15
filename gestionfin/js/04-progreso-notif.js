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

