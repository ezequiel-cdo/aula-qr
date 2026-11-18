"use strict";
(function(){
 const Q=EPJA_P1_QUESTIONS, FINAL_KEY=EPJA_EXAM_STORAGE, DRAFT="epja_matematica_p1_borrador_v1";
 let draft={position:0,answers:Array(40).fill(null)}, selected=null;
 const el=id=>document.getElementById(id);
 const storage=()=>epjaGetFinals();
 function saveDraft(){try{localStorage.setItem(DRAFT,JSON.stringify(draft))}catch(e){alert("No se pudo guardar el avance en este dispositivo.")}}
 function loadDraft(){try{let t=JSON.parse(localStorage.getItem(DRAFT)||"null");if(t&&Array.isArray(t.answers)&&t.answers.length===40)draft=t}catch(e){}}
 function page(id){document.querySelectorAll("main > section").forEach(x=>x.hidden=x.id!==id);document.querySelectorAll("nav [data-go]").forEach(x=>x.setAttribute("aria-current","false"));scrollTo(0,0)}
 const html=String.raw`
 <section id="examP1" hidden>
 <p class="eyebrow">Módulo I · Primer período · Simulación no oficial</p><h1>Evaluación de práctica P1</h1>
 <div class="card"><div class="row"><strong id="examBlock"></strong><span id="examNum" class="pill"></span></div>
 <p id="examTag" class="muted small"></p><div class="progress"><span id="examBar"></span></div>
 <h2 id="examText" style="margin-top:20px"></h2><div id="examChoices" class="options"></div>
 <p id="examDone" class="small muted"></p><div class="row"><button id="examPrev" class="secondary">← Anterior</button><button id="examNext">Siguiente →</button></div></div>
 <div class="card"><h3>Navega por las 40 preguntas</h3><div id="examIndex" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(35px,1fr));gap:6px;margin:12px 0"></div>
 <div class="row"><button id="examStop" class="secondary">Salir y conservar borrador</button><button id="examSubmit">Finalizar evaluación</button></div>
 <p class="small muted">Durante el intento no se muestran respuestas correctas ni calificaciones. El progreso se guarda localmente.</p></div>
 </section>
 <section id="examResultP1" hidden><p class="eyebrow">Resultado simulado · Práctica local</p><h1>Tu evaluación P1</h1>
 <p class="small muted" id="examMeta"></p><div class="card"><h3>Registro de práctica por competencias</h3>
 <table><thead><tr><th>Bloque</th><th class="num">P1</th><th class="num">RP1</th></tr></thead><tbody id="examScores"></tbody></table>
 <div class="row"><strong>Promedio simulado</strong><strong class="score" id="examAverage">—</strong></div>
 <p class="small muted">RP1 permanece vacío. Las puntuaciones no constituyen calificaciones oficiales ni evaluación integral de competencias.</p></div>
 <div class="card"><h3>Diagnóstico por contenidos</h3><div id="examDiagnosis"></div></div>
 <div class="card"><h3>Corrección y explicaciones</h3><div id="examReview"></div></div>
 <div class="card"><div class="row"><button id="examToRecords" class="secondary">Mis registros</button>
 <button id="examRepeat">Nuevo intento</button><button id="examExport" class="secondary">Descargar evidencia JSON</button></div></div></section>
`;
 document.querySelector("main").insertAdjacentHTML("beforeend",html);
 const css=document.createElement("style");css.textContent=".exam-item{border-bottom:1px solid #dce3ef;padding:13px 0}.exam-item:last-child{border-bottom:0}.exam-good{color:#11663d}.exam-bad{color:#ab3055}.exam-mapbtn{padding:9px 1px;background:#e7efff;color:#203d7c}.exam-mapbtn.chosen{background:#217d6f;color:#fff}.exam-mapbtn.active{outline:3px solid #e6a52a;outline-offset:1px}";document.head.appendChild(css);
 function start(reset=false){if(reset){draft={position:0,answers:Array(40).fill(null)};saveDraft()}else loadDraft();page("examP1");render()}
 function render(){const idx=draft.position,q=Q[idx];el("examBlock").textContent=q[0]+" · Bloque de competencias";el("examNum").textContent=(idx+1)+" / 40";el("examTag").textContent=q[2]+" · "+q[1];el("examText").textContent=q[3];el("examBar").style.width=((idx+1)/40*100)+"%";
 el("examChoices").innerHTML=q[4].map((opt,i)=>'<label class="option"><input type="radio" name="examOption" value="'+i+'" '+(draft.answers[idx]===i?'checked':'')+'> '+String.fromCharCode(65+i)+'. '+opt+'</label>').join("");
 el("examChoices").querySelectorAll("input").forEach(b=>b.onchange=()=>{draft.answers[idx]=Number(b.value);saveDraft();render()});
 el("examDone").textContent=draft.answers.filter(x=>x!==null).length+" de 40 respondidas";el("examPrev").disabled=idx===0;el("examNext").disabled=idx===39;
 el("examIndex").innerHTML=Q.map((_,i)=>'<button class="exam-mapbtn '+(i===idx?'active ':'')+(draft.answers[i]!==null?'chosen':'')+'" data-i="'+i+'" aria-label="Pregunta '+(i+1)+'">'+(i+1)+'</button>').join("");
 el("examIndex").querySelectorAll("button").forEach(b=>b.onclick=()=>{draft.position=Number(b.dataset.i);saveDraft();render()})}
 function grade(ans){const score=[0,0,0,0],topic={};Q.forEach((q,i)=>{const correct=ans[i]===q[5];score[Number(q[0].slice(1))-1]+=correct?10:0;const t=topic[q[2]]||(topic[q[2]]={ok:0,n:0});t.n++;if(correct)t.ok++});return {score,avg:score.reduce((a,b)=>a+b,0)/4,topic}}
 function finish(){const n=draft.answers.filter(x=>x===null).length;if(!confirm(n?"Hay "+n+" preguntas sin responder que contarán como incorrectas. ¿Entregar?":"¿Entregar el intento y ver las correcciones?"))return;
 const a=draft.answers.slice(),g=grade(a),entry={id:(crypto.randomUUID?crypto.randomUUID():"p1-"+Date.now()),period:"P1",module:"I",kind:"simulacion_no_oficial",questionSet:"P1-v1",answers:a,score:g.score,average:g.avg,submittedLocalAt:new Date().toISOString(),receivedAtServer:null,status:"solo_local"};
 try{const arr=storage();arr.push(entry);epjaSaveFinals(arr)}catch(e){alert("No fue posible guardar este intento; permanecerá como borrador.");return}
 try{localStorage.removeItem(DRAFT)}catch(e){};draft={position:0,answers:Array(40).fill(null)};result(entry)}
 function exportJSON(data,name){const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1200)}
 function result(entry){selected=entry;const g=grade(entry.answers);page("examResultP1");el("examMeta").textContent="ID local "+entry.id+" · "+new Date(entry.submittedLocalAt).toLocaleString("es-DO")+" · No recibido por servidor";
 el("examScores").innerHTML=g.score.map((v,i)=>'<tr><td>C'+(i+1)+'</td><td class="num">'+v+'</td><td class="num">—</td></tr>').join("");el("examAverage").textContent=g.avg.toFixed(1)+"/100";
 el("examDiagnosis").innerHTML=Object.entries(g.topic).sort((a,b)=>a[1].ok/a[1].n-b[1].ok/b[1].n).map(([t,v])=>'<p><strong>'+t+'</strong>: '+v.ok+'/'+v.n+' · '+(v.ok===v.n?'Correctas en este intento':'Reforzar el tema')+'</p>').join("");
 el("examReview").innerHTML=Q.map((q,i)=>{const choice=entry.answers[i],ok=choice===q[5];return '<div class="exam-item"><b>'+(i+1)+'. '+q[0]+' · '+q[2]+'</b><p>'+q[3]+'</p><p class="'+(ok?'exam-good':'exam-bad')+'">Elegiste: '+(choice===null?'Sin responder':q[4][choice])+'</p><p><b>Correcta:</b> '+q[4][q[5]]+'</p><p class="small muted">'+q[6]+'</p></div>'}).join("")}
 el("examPrev").onclick=()=>{draft.position=Math.max(0,draft.position-1);saveDraft();render()};
 el("examNext").onclick=()=>{draft.position=Math.min(39,draft.position+1);saveDraft();render()};
 el("examStop").onclick=()=>go("evaluaciones");el("examSubmit").onclick=finish;
 el("examRepeat").onclick=()=>{if(confirm("¿Iniciar una nueva simulación de práctica?"))start(true)};
 el("examToRecords").onclick=()=>go("registros");
 el("examExport").onclick=()=>{if(selected)exportJSON({type:"evidencia_local_no_verificada",record:selected}, "epja-p1-"+selected.id+".json")};
 function showRecords(){const arr=storage().filter(e=>e.period==="P1"),last=arr.at(-1);el("resultRows").innerHTML=[1,2,3,4].map((n,i)=>'<tr><td>C'+n+'</td><td class="num">'+(last?last.score[i]:"—")+'</td><td class="num">—</td></tr>').join("");
 el("resultAverage").textContent=last?last.average.toFixed(1):"—";el("resultsNote").textContent=last?"Última simulación P1 guardada localmente · "+arr.length+" intentos. Sin recepción por servidor.":"No hay una simulación final P1 almacenada todavía.";
 const root=el("recordsHistory"),rows=storage().slice().reverse();const block=document.createElement("div");block.innerHTML='<h3>Evaluaciones finales (práctica)</h3>'+(rows.length?'<table><thead><tr><th>Período</th><th>Fecha local</th><th>Promedio</th></tr></thead><tbody>'+rows.map((e,i)=>'<tr><td><button class="secondary" data-try="'+(rows.length-1-i)+'">P1 · Ver</button></td><td>'+new Date(e.submittedLocalAt).toLocaleString("es-DO")+'</td><td>'+e.average.toFixed(1)+'</td></tr>').join("")+'</tbody></table>':'<p class="muted">Ninguna simulación final guardada.</p>');
 root.prepend(block);block.querySelectorAll("[data-try]").forEach(b=>b.onclick=()=>result(storage()[Number(b.dataset.try)]));
 el("recordsCount").textContent=state.attempts.length+storage().length;
 }
 const oldDraw=drawRecords;
 drawRecords=function(){oldDraw();if(selectedResultsPeriod==="P1")showRecords()};
 const oldEval=drawEvaluations;
 drawEvaluations=function(){oldEval();const card=document.getElementById("evalPeriods");const p1=card.querySelector("article");if(p1){const b=document.createElement("button");b.textContent="Iniciar simulación P1 · 40 preguntas →";b.onclick=()=>start(false);p1.appendChild(b);const p=p1.querySelector(".small.muted");if(p)p.textContent="Banco disponible: 40 preguntas en cuatro bloques. Corrección exclusivamente al finalizar."}};
 const oldExport=el("exportRecords").onclick;el("exportRecords").onclick=()=>exportJSON({exportedLocalAt:new Date().toISOString(),finals:storage(),shortPractices:state.attempts,notice:"Registros locales sin validación de servidor"},"epja-registros-completos.json");
 window.epjaExamStart=start;
})();