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
      ae.tiempoMin=tiempoMin; ae.password=password;
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
      tiempoMin:tiempoMin, password:password, pesosCalculo:pesosCalculo,
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
      }, act && act.pesosCalculo ? act.pesosCalculo : null);
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




