document.addEventListener('DOMContentLoaded', function(){
  initBancoConEjemplos();
  // El rol se aplica via _aplicarRolVerificado() cuando Supabase confirma la sesión.
  // No se presupone ningún rol aquí para evitar escalada de privilegios.
  renderDashboard();
  setTimeout(function(){ toggleGroup('ud'); }, 100);
});

var calcVisible=false;
function toggleCalcFinanciera(){
  calcVisible=!calcVisible;
  var ov=document.getElementById('calc-overlay');
  var fab=document.getElementById('calc-fab');
  if(calcVisible){
    ov.style.display='block';
    fab.style.transform='rotate(15deg)';
    if(!ov.innerHTML.trim()) renderCalcFinanciera(ov);
  } else {
    ov.style.display='none';
    fab.style.transform='';
  }
}

function renderCalcFinanciera(root){
  root.innerHTML='';

  // Cabecera
  var hdr=document.createElement('div');
  hdr.style.cssText='display:flex;align-items:center;gap:10px;padding:14px 16px;background:#1a2744;border-radius:16px 16px 0 0';
  hdr.innerHTML='<div style="flex:1;font-family:serif;font-size:15px;font-weight:600;color:#fff">Calculadora Financiera</div>'+
    '<button onclick="toggleCalcFinanciera()" style="background:rgba(255,255,255,.15);border:none;color:#fff;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:12px">✕</button>';
  root.appendChild(hdr);

  // Pestañas
  var tabs=['Básica','Interés','Préstamo','VAN/TIR','Rentab.'];
  var tabBar=document.createElement('div');
  tabBar.style.cssText='display:flex;overflow-x:auto;background:#f8fafc;border-bottom:1px solid #e2e8f0';
  var tabActiva=0;
  var panes=[];

  var body=document.createElement('div'); body.style.padding='16px';
  root.appendChild(tabBar); root.appendChild(body);

  function switchTab(i){
    tabActiva=i;
    tabBar.querySelectorAll('button').forEach(function(b,j){
      b.style.background=j===i?'#fff':'transparent';
      b.style.color=j===i?'#1a2744':'#64748b';
      b.style.borderBottom=j===i?'2px solid #1a2744':'2px solid transparent';
      b.style.fontWeight=j===i?'700':'400';
    });
    panes.forEach(function(p,j){ p.style.display=j===i?'block':'none'; });
  }

  tabs.forEach(function(t,i){
    var btn=document.createElement('button');
    btn.style.cssText='padding:8px 10px;border:none;font-size:11px;cursor:pointer;white-space:nowrap;border-bottom:2px solid transparent';
    btn.textContent=t; btn.onclick=function(){ switchTab(i); };
    tabBar.appendChild(btn);
  });

  // ── PANE 0: Básica ────────────────────────────────────
  var p0=document.createElement('div'); panes.push(p0);
  (function(){
    var display='0'; var expr='';
    var scr=document.createElement('div');
    scr.style.cssText='background:#1e293b;color:#c9a84c;font-family:monospace;font-size:22px;font-weight:700;padding:12px 14px;border-radius:8px;text-align:right;margin-bottom:10px;min-height:52px;word-break:break-all';
    scr.textContent='0';
    p0.appendChild(scr);
    var grid=document.createElement('div');
    grid.style.cssText='display:grid;grid-template-columns:repeat(4,1fr);gap:6px';
    var btns=[
      ['C','','','⌫'],['7','8','9','÷'],['4','5','6','×'],['1','2','3','-'],['0','.','=','+'],['%','√','x²','1/x']
    ];
    btns.forEach(function(row){
      row.forEach(function(k){
        var b=document.createElement('button');
        b.textContent=k;
        var isOp=['÷','×','-','+','='].includes(k);
        var isSpec=['C','⌫','%','√','x²','1/x'].includes(k);
        b.style.cssText='padding:12px 4px;border-radius:8px;border:1px solid #e2e8f0;font-size:15px;font-weight:'+(isOp||isSpec?'600':'400')+';cursor:pointer;background:'+(k==='='?'#1a2744':isOp?'#e0e7ff':isSpec?'#fef3c7':'#fff')+';color:'+(k==='='?'#c9a84c':isOp?'#3730a3':isSpec?'#92400e':'#1e293b');
        b.onmouseenter=function(){ this.style.opacity='.8'; };
        b.onmouseleave=function(){ this.style.opacity='1'; };
        b.onclick=function(){
          try{
            if(k==='C'){ display='0'; expr=''; }
            else if(k==='⌫'){ display=display.length>1?display.slice(0,-1):'0'; }
            else if(k==='='){ display=String(Math.round(eval(expr.replace(/÷/g,'/').replace(/×/g,'*').replace(/x²/g,'**2'))*1e10)/1e10); expr=''; }
            else if(k==='%'){ display=String(parseFloat(display)/100); }
            else if(k==='√'){ display=String(Math.round(Math.sqrt(parseFloat(display))*1e10)/1e10); }
            else if(k==='x²'){ display=String(parseFloat(display)**2); }
            else if(k==='1/x'){ display=String(Math.round((1/parseFloat(display))*1e10)/1e10); }
            else { if(display==='0'&&!['.','+','-','×','÷'].includes(k)) display=''; expr+=display+k; display='0'; if(['+','-','×','÷'].includes(k)){ expr=expr.slice(0,-1); display=String(eval(expr.replace(/÷/g,'/').replace(/×/g,'*'))||0); expr=display+k; display='0'; } else { display=k; expr=expr.slice(0,-1)+k; } }
          }catch(e){ display='Error'; }
          scr.textContent=display||'0';
        };
        grid.appendChild(b);
      });
    });
    p0.appendChild(grid);
  })();

  // ── PANE 1: Interés simple y compuesto ───────────────
  var p1=document.createElement('div'); panes.push(p1); p1.style.display='none';
  (function(){
    function mk(lbl,id,ph,val){
      var d=document.createElement('div'); d.style.marginBottom='8px';
      d.innerHTML='<label style="font-size:11px;font-weight:600;color:#64748b;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:.05em">'+lbl+'</label>'+
        '<input id="'+id+'" type="number" step="any" placeholder="'+ph+'" value="'+(val||'')+'" style="width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px">';
      return d;
    }
    p1.appendChild(mk('Capital inicial (€)','i-c','10000','10000'));
    p1.appendChild(mk('Tipo de interés anual (%)','i-r','5','5'));
    p1.appendChild(mk('Tiempo (años)','i-t','3','3'));
    var resDiv=document.createElement('div'); resDiv.style.cssText='margin:10px 0;padding:12px;background:#f8fafc;border-radius:8px;display:none';
    p1.appendChild(resDiv);
    var btnRow=document.createElement('div'); btnRow.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:4px';
    ['Simple','Compuesto'].forEach(function(tipo){
      var b=document.createElement('button'); b.textContent='Calcular '+tipo;
      b.style.cssText='padding:10px;border-radius:8px;border:1px solid #1a2744;background:'+(tipo==='Simple'?'#fff':'#1a2744')+';color:'+(tipo==='Simple'?'#1a2744':'#c9a84c')+';font-size:13px;font-weight:600;cursor:pointer';
      b.onclick=function(){
        var C=parseFloat(document.getElementById('i-c').value)||0;
        var r=parseFloat(document.getElementById('i-r').value)/100||0;
        var t=parseFloat(document.getElementById('i-t').value)||0;
        var Cf,I;
        if(tipo==='Simple'){ I=C*r*t; Cf=C+I; }
        else { Cf=C*Math.pow(1+r,t); I=Cf-C; }
        resDiv.style.display='block';
        resDiv.innerHTML='<div style="font-size:11px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">'+tipo+'</div>'+
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'+
          '<div style="background:#fff;border-radius:6px;padding:8px;border:1px solid #e2e8f0"><div style="font-size:10px;color:#94a3b8">Capital final</div><div style="font-size:18px;font-weight:700;color:#1a2744">'+Cf.toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2})+' €</div></div>'+
          '<div style="background:#fff;border-radius:6px;padding:8px;border:1px solid #e2e8f0"><div style="font-size:10px;color:#94a3b8">Intereses</div><div style="font-size:18px;font-weight:700;color:#16a34a">'+I.toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2})+' €</div></div>'+
          '</div>';
      };
      btnRow.appendChild(b);
    });
    p1.appendChild(btnRow);
  })();

  // ── PANE 2: Préstamo (cuota francesa) ─────────────────
  var p2=document.createElement('div'); panes.push(p2); p2.style.display='none';
  (function(){
    function mk(lbl,id,ph,val){
      var d=document.createElement('div'); d.style.marginBottom='8px';
      d.innerHTML='<label style="font-size:11px;font-weight:600;color:#64748b;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:.05em">'+lbl+'</label>'+
        '<input id="'+id+'" type="number" step="any" placeholder="'+ph+'" value="'+(val||'')+'" style="width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px">';
      return d;
    }
    p2.appendChild(mk('Capital prestado (€)','p-c','50000','50000'));
    p2.appendChild(mk('Tipo nominal anual (%)','p-r','4','4'));
    p2.appendChild(mk('Plazo (años)','p-t','10','10'));
    var resDiv=document.createElement('div'); resDiv.style.cssText='margin:10px 0;display:none';
    p2.appendChild(resDiv);
    var btn=document.createElement('button'); btn.textContent='Calcular cuota';
    btn.style.cssText='width:100%;padding:10px;border-radius:8px;border:none;background:#1a2744;color:#c9a84c;font-size:13px;font-weight:600;cursor:pointer;margin-top:4px';
    btn.onclick=function(){
      var C=parseFloat(document.getElementById('p-c').value)||0;
      var rA=parseFloat(document.getElementById('p-r').value)/100||0;
      var t=parseFloat(document.getElementById('p-t').value)||0;
      var n=t*12; var r=rA/12;
      var cuota=r?C*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):C/n;
      var totalPag=cuota*n; var totalInt=totalPag-C;
      resDiv.style.display='block';
      resDiv.innerHTML='<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">'+
        mkRes('Cuota mensual',cuota.toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2})+' €','#1a2744','#c9a84c')+
        mkRes('Total pagado',totalPag.toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2})+' €','#f8fafc','#1e293b')+
        mkRes('Total intereses',totalInt.toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2})+' €','#fef3c7','#92400e')+
        mkRes('Cuotas totales',n,'#f8fafc','#1e293b')+
      '</div>';
    };
    p2.appendChild(btn);
    function mkRes(lbl,val,bg,col){
      return '<div style="background:'+bg+';border-radius:6px;padding:8px;border:1px solid #e2e8f0">'+
        '<div style="font-size:10px;color:#94a3b8;margin-bottom:2px">'+lbl+'</div>'+
        '<div style="font-size:16px;font-weight:700;color:'+col+'">'+val+'</div></div>';
    }
  })();

  // ── PANE 3: VAN y TIR ─────────────────────────────────
  var p3=document.createElement('div'); panes.push(p3); p3.style.display='none';
  (function(){
    p3.innerHTML='<div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">Flujos de caja anuales</div>';
    var inv=document.createElement('div'); inv.style.marginBottom='8px';
    inv.innerHTML='<label style="font-size:11px;color:#64748b;display:block;margin-bottom:3px">Inversión inicial (-€)</label>'+
      '<input id="v-inv" type="number" step="any" value="10000" style="width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px">';
    p3.appendChild(inv);
    var tasa=document.createElement('div'); tasa.style.marginBottom='8px';
    tasa.innerHTML='<label style="font-size:11px;color:#64748b;display:block;margin-bottom:3px">Tasa de descuento (%)</label>'+
      '<input id="v-k" type="number" step="any" value="10" style="width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px">';
    p3.appendChild(tasa);
    var flujosCont=document.createElement('div'); flujosCont.id='v-flujos';
    p3.appendChild(flujosCont);
    var flujos=[3000,3500,4000,4500];
    function renderFlujos(){
      flujosCont.innerHTML='';
      flujos.forEach(function(f,i){
        var row=document.createElement('div'); row.style.cssText='display:flex;align-items:center;gap:6px;margin-bottom:6px';
        row.innerHTML='<span style="font-size:11px;color:#94a3b8;width:40px">Año '+(i+1)+'</span>'+
          '<input type="number" step="any" value="'+f+'" style="flex:1;padding:7px 8px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px">'+
          '<button style="background:#fee2e2;border:none;color:#dc2626;border-radius:6px;padding:5px 8px;cursor:pointer;font-size:11px">✕</button>';
        row.querySelector('input').onchange=function(){ flujos[i]=parseFloat(this.value)||0; };
        row.querySelector('button').onclick=function(){ flujos.splice(i,1); renderFlujos(); };
        flujosCont.appendChild(row);
      });
      var addBtn=document.createElement('button'); addBtn.textContent='+ Año';
      addBtn.style.cssText='font-size:11px;padding:5px 10px;border-radius:6px;border:1px dashed #cbd5e1;background:transparent;color:#64748b;cursor:pointer;margin-bottom:8px';
      addBtn.onclick=function(){ flujos.push(0); renderFlujos(); };
      flujosCont.appendChild(addBtn);
    }
    renderFlujos();
    var resDiv=document.createElement('div'); resDiv.style.display='none'; p3.appendChild(resDiv);
    var btn=document.createElement('button'); btn.textContent='Calcular VAN y TIR';
    btn.style.cssText='width:100%;padding:10px;border-radius:8px;border:none;background:#1a2744;color:#c9a84c;font-size:13px;font-weight:600;cursor:pointer';
    btn.onclick=function(){
      var I0=parseFloat(document.getElementById('v-inv').value)||0;
      var k=parseFloat(document.getElementById('v-k').value)/100||0;
      var van=-I0; flujos.forEach(function(f,i){ van+=f/Math.pow(1+k,i+1); });
      // TIR por bisección
      function npv(r){ var n=-I0; flujos.forEach(function(f,i){ n+=f/Math.pow(1+r,i+1); }); return n; }
      var lo=-0.999,hi=10,tir=null;
      for(var it=0;it<200;it++){ var mid=(lo+hi)/2; var v=npv(mid); if(Math.abs(v)<0.01){tir=mid;break;} v>0?lo=mid:hi=mid; } if(!tir&&Math.abs(lo-hi)<0.0001) tir=(lo+hi)/2;
      resDiv.style.display='block';
      var vanPos=van>=0;
      resDiv.innerHTML='<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px">'+
        '<div style="background:'+(vanPos?'#dcfce7':'#fee2e2')+';border-radius:8px;padding:10px;text-align:center">'+
          '<div style="font-size:10px;color:#94a3b8;margin-bottom:4px">VAN</div>'+
          '<div style="font-size:18px;font-weight:700;color:'+(vanPos?'#166534':'#991b1b')+'">'+van.toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2})+' €</div>'+
          '<div style="font-size:10px;font-weight:600;color:'+(vanPos?'#16a34a':'#dc2626')+';margin-top:4px">'+(vanPos?'✓ VIABLE':'✗ NO VIABLE')+'</div>'+
        '</div>'+
        '<div style="background:#f8fafc;border-radius:8px;padding:10px;text-align:center;border:1px solid #e2e8f0">'+
          '<div style="font-size:10px;color:#94a3b8;margin-bottom:4px">TIR</div>'+
          '<div style="font-size:18px;font-weight:700;color:#1a2744">'+(tir!==null?((tir*100).toFixed(2)+'%'):'N/A')+'</div>'+
          '<div style="font-size:10px;color:#64748b;margin-top:4px">Rentabilidad del proyecto</div>'+
        '</div>'+
      '</div>';
    };
    p3.appendChild(btn);
  })();

  // ── PANE 4: Rentabilidad ──────────────────────────────
  var p4=document.createElement('div'); panes.push(p4); p4.style.display='none';
  (function(){
    function mk(lbl,id,ph,val){
      var d=document.createElement('div'); d.style.marginBottom='8px';
      d.innerHTML='<label style="font-size:11px;font-weight:600;color:#64748b;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:.05em">'+lbl+'</label>'+
        '<input id="'+id+'" type="number" step="any" placeholder="'+ph+'" value="'+(val||'')+'" style="width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px">';
      return d;
    }
    p4.appendChild(mk('Precio de compra (€)','r-pc','1000','1000'));
    p4.appendChild(mk('Precio de venta (€)','r-pv','1250','1250'));
    p4.appendChild(mk('Dividendos / Rentas (€)','r-div','50','50'));
    p4.appendChild(mk('Período (años)','r-t','2','2'));
    var resDiv=document.createElement('div'); resDiv.style.cssText='margin:10px 0;display:none'; p4.appendChild(resDiv);
    var btn=document.createElement('button'); btn.textContent='Calcular rentabilidad';
    btn.style.cssText='width:100%;padding:10px;border-radius:8px;border:none;background:#1a2744;color:#c9a84c;font-size:13px;font-weight:600;cursor:pointer;margin-top:4px';
    btn.onclick=function(){
      var pc=parseFloat(document.getElementById('r-pc').value)||1;
      var pv=parseFloat(document.getElementById('r-pv').value)||0;
      var div=parseFloat(document.getElementById('r-div').value)||0;
      var t=parseFloat(document.getElementById('r-t').value)||1;
      var rTotal=(pv-pc+div)/pc*100;
      var rAnual=(Math.pow(1+rTotal/100,1/t)-1)*100;
      var plusvalia=(pv-pc)/pc*100;
      var rDiv=div/pc*100;
      resDiv.style.display='block';
      resDiv.innerHTML='<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">'+
        mkR('Rentabilidad total',rTotal.toFixed(2)+'%',rTotal>=0?'#dcfce7':'#fee2e2',rTotal>=0?'#166534':'#991b1b')+
        mkR('Rentabilidad anual',rAnual.toFixed(2)+'%','#f8fafc','#1a2744')+
        mkR('Plusvalía',plusvalia.toFixed(2)+'%','#f8fafc','#1a2744')+
        mkR('Rent. dividendos',rDiv.toFixed(2)+'%','#fef3c7','#92400e')+
      '</div>';
    };
    p4.appendChild(btn);
    function mkR(lbl,val,bg,col){
      return '<div style="background:'+bg+';border-radius:6px;padding:8px;border:1px solid #e2e8f0">'+
        '<div style="font-size:10px;color:#94a3b8;margin-bottom:2px">'+lbl+'</div>'+
        '<div style="font-size:16px;font-weight:700;color:'+col+'">'+val+'</div></div>';
    }
  })();

  panes.forEach(function(p){ body.appendChild(p); });
  switchTab(0);
}
