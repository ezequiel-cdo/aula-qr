"use strict";
/* Diagnóstico pedagógico de entrada a 3.er año EPJA. Autonomía y privacidad: almacenamiento local. */
(function(){
const KEY="epja_3ero_diagnostico_v1";
const AXES=[
 {id:"numeros",title:"Números y conjuntos",short:"Números",intro:"Los números naturales sirven para contar; los enteros incluyen negativos; los racionales pueden expresarse como fracciones; los irracionales no admiten esa representación. Todos ellos pertenecen a los reales.",example:"Un saldo de −RD$250 se expresa con un número entero negativo; 3/4 representa una parte de una unidad. Un número natural también es entero, racional y real.",worked:"¿Qué conjunto más pequeño contiene −8? Los enteros (ℤ), porque es negativo y no tiene parte fraccionaria.",caution:"La división por cero no está definida. Aquí ℕ incluye el cero.",tip:"Repasa clasificación, ubicación y significado de los números."},
 {id:"propiedades",title:"Propiedades de las operaciones",short:"Propiedades",intro:"Las propiedades conmutativa y asociativa funcionan en la suma y la multiplicación. La distributiva permite multiplicar una suma término por término.",example:"3(20+5)=3·20+3·5=60+15=75. Puedes usarla para calcular el costo de tres paquetes iguales.",worked:"7(10+2)=70+14=84. No se obtiene 70+2, porque el 7 multiplica a ambos sumandos.",caution:"Restar y dividir no son conmutativas en general; cambiar el orden puede alterar el resultado.",tip:"Practica la distributiva y explica qué operación se conserva."},
 {id:"signos",title:"Operaciones con signos",short:"Signos",intro:"En la suma de enteros con signos distintos, se comparan valores absolutos. En productos y cocientes, signos iguales dan positivo y signos diferentes dan negativo.",example:"Una deuda de RD$500 se representa como −500. Si abonas RD$180: −500+180=−320; todavía quedan RD$320 de deuda.",worked:"(−6)(−4)=24 porque el producto de dos negativos es positivo. En cambio, −6+−4=−10.",caution:"No uses la regla de multiplicación para resolver sumas de números negativos.",tip:"Distingue suma, resta, multiplicación y división de enteros."},
 {id:"fracciones",title:"Fracciones y números racionales",short:"Fracciones",intro:"Las fracciones representan partes y cantidades. Para sumar fracciones con denominadores diferentes, hay que expresar las partes con un denominador común.",example:"Si utilizas 1/2 de un saco y después 1/3, la cantidad total es 3/6+2/6=5/6 de saco.",worked:"2/3+1/6=4/6+1/6=5/6. Para multiplicar: 2/3·1/2=2/6=1/3.",caution:"No sumes directamente los denominadores: 1/2+1/3 no es 2/5.",tip:"Repasa equivalencias, denominador común y fracciones aplicadas a medidas."},
 {id:"potencias",title:"Potencias y sus leyes",short:"Potencias",intro:"Una potencia resume una multiplicación repetida. Al multiplicar potencias de igual base se suman exponentes; al dividirlas, se restan si la base es distinta de cero.",example:"Una superficie cuadrada de 5 metros de lado tiene 5²=25 m² de área.",worked:"x⁴·x³=x⁷. Al dividir x⁵/x²=x³ (para x ≠ 0). En cambio, x²+x³ no se convierte en x⁵.",caution:"La ley de suma de exponentes se aplica al producto de potencias de igual base, no a la suma.",tip:"Practica base, exponente y leyes con y sin letras."},
 {id:"raices",title:"Raíces cuadradas",short:"Raíces",intro:"La raíz cuadrada principal de un número no negativo es el número no negativo que, multiplicado por sí mismo, produce el radicando.",example:"Para construir un terreno cuadrado de 49 m², su lado mide √49=7 metros.",worked:"√72=√(36·2)=6√2. Como 6²·2=72, el resultado está simplificado.",caution:"√(a+b) no es, en general, √a+√b; y la raíz principal de 9 es 3, no ±3.",tip:"Repasa cuadrados perfectos y simplificación de raíces."},
 {id:"jerarquia",title:"Jerarquía de operaciones",short:"Jerarquía",intro:"Cuando una expresión contiene varias operaciones, primero se resuelven las agrupaciones, luego potencias y raíces, después multiplicaciones y divisiones y, por último, sumas y restas.",example:"Un negocio recibe RD$500 y paga 2 paquetes a RD$60: 500−2·60=500−120=380.",worked:"20−2·3²=20−2·9=20−18=2. No empieces por 20−2.",caution:"En operaciones del mismo nivel, resuelve de izquierda a derecha.",tip:"Resuelve expresiones mixtas y anota cada paso con orden."}
];
/* Una pregunta por nivel didáctico (1–4) en cada eje. Medida breve, no certificación. */
const BANK={
 numeros:[
  ["¿Cuál es el conjunto más pequeño que contiene −7?",["Naturales (ℕ)","Enteros (ℤ)","Irracionales"],1,"−7 pertenece a los enteros, pero no a los naturales."],
  ["¿Cuál de estos números es racional y no entero?",["2/5","−2","0"],0,"2/5 es racional porque es una fracción, pero no es entero."],
  ["Un saldo cambia de −RD$120 a RD$80. ¿Cuánto aumentó?",["RD$40","RD$200","RD$−200"],1,"80−(−120)=200 pesos."],
  ["¿Qué afirmación es correcta sobre √2?",["Es racional porque tiene raíz","Es irracional, pero real","No pertenece a los números reales"],1,"√2 es un número real irracional."],
 ],
 propiedades:[
  ["¿Qué propiedad permite cambiar 4+7 por 7+4?",["Asociativa","Conmutativa","Distributiva"],1,"La conmutativa cambia el orden de sumandos."],
  ["¿Cuánto es 4(10+3)?",["43","52","17"],1,"4·10+4·3=52."],
  ["¿Qué expresión es equivalente a 5(x+2)?",["5x+2","x+10","5x+10"],2,"El 5 multiplica a x y a 2."],
  ["Una persona escribe 12−(7−2)=(12−7)−2. ¿Es correcto?",["Sí, la resta es asociativa","No: 7 es distinto de 3","Solo si todos son positivos"],1,"12−5=7, mientras que 5−2=3."],
 ],
 signos:[
  ["¿Cuánto es −4 + (−3)?",["−7","7","−1"],0,"Al sumar dos negativos, se suman los valores absolutos y se mantiene el signo −."],
  ["Calcula (−6)·4.",["24","−24","−10"],1,"Signos distintos en multiplicación dan negativo."],
  ["Tenías una deuda de RD$300 y abonas RD$120. ¿Cuál es el saldo?",["−RD$420","RD$180","−RD$180"],2,"−300+120=−180; aún hay una deuda de RD$180."],
  ["¿Qué resultado tiene −24÷(−6)+ (−5)?",["−9","−1","9"],1,"−24÷−6=4; luego 4−5=−1."],
 ],
 fracciones:[
  ["¿Cuál fracción representa la mitad?",["1/2","1/3","2/5"],0,"1/2 significa una de dos partes iguales."],
  ["Calcula 1/2+1/3.",["2/5","5/6","1/6"],1,"3/6+2/6=5/6."],
  ["De 12 litros de agua se usa 3/4. ¿Cuántos litros se usan?",["9 litros","16 litros","3 litros"],0,"12·3/4=9 litros."],
  ["Si 2/3 de un terreno equivale a 8 tareas, ¿cuántas tareas tiene el terreno completo?",["10 tareas","12 tareas","16 tareas"],1,"8÷(2/3)=8·3/2=12."],
 ],
 potencias:[
  ["¿Cuánto es 3²?",["6","9","8"],1,"3²=3·3=9."],
  ["Simplifica x²·x³.",["x⁵","x⁶","2x⁵"],0,"La base es la misma: 2+3=5."],
  ["¿Cuál es el área de un huerto cuadrado de 8 m de lado?",["16 m²","64 m²","32 m²"],1,"Área=8²=64 m²."],
  ["Con a≠0, simplifica (a³)²/a⁴.",["a²","a⁵","a¹⁰"],0,"(a³)²=a⁶; a⁶/a⁴=a²."],
 ],
 raices:[
  ["¿Cuánto es √36?",["6","−6","18"],0,"La raíz cuadrada principal de 36 es 6."],
  ["Un cuadrado tiene 81 m² de área. ¿Cuánto mide su lado?",["40,5 m","9 m","18 m"],1,"√81=9 metros."],
  ["Simplifica √50.",["25√2","5√2","10√5"],1,"√50=√(25·2)=5√2."],
  ["¿Cuál afirmación es verdadera?",["√(9+16)=√9+√16","√(9+16)=5","√9=±3 como raíz principal"],1,"√25=5, no 3+4; √9 principal es 3."],
 ],
 jerarquia:[
  ["Calcula 6+2·5.",["40","16","30"],1,"Primero 2·5=10 y luego 6+10=16."],
  ["Calcula (6+2)·5.",["16","40","30"],1,"Los paréntesis van primero: 8·5=40."],
  ["Un negocio tiene RD$500 y paga 3 productos a RD$60. ¿Cuánto queda?",["RD$320","RD$1,320","RD$440"],0,"500−3·60=500−180=320."],
  ["Calcula 18−2(3²−5)÷4.",["16","4","8"],0,"Potencia: 9; paréntesis:4; 2·4÷4=2; 18−2=16."],
 ]
};
/* Nuevas preguntas, diferentes de las del primer diagnóstico. */
const IMPROVE={
 numeros:[["¿Qué conjunto mínimo contiene −3?",["Enteros","Naturales","Irracionales"],0,"−3 es entero negativo."],["¿Cuál número es irracional?",["−8","3/4","√5"],2,"√5 es irracional y real."]],
 propiedades:[["2(5+4) equivale a:",["10+4","10+8","2+9"],1,"La distributiva multiplica los dos sumandos."],["¿La resta es conmutativa?",["Siempre","No, en general","Solo con números grandes"],1,"Por ejemplo 8−3 no es 3−8."]],
 signos:[["−5+2 es:",["−3","7","3"],0,"Se restan 5 y 2 y se mantiene el signo del mayor valor absoluto."],["(−4)(−7) es:",["−28","28","11"],1,"Producto de dos negativos: positivo."]],
 fracciones:[["1/4+1/2 es:",["2/6","3/4","1/8"],1,"1/2 equivale a 2/4: 1/4+2/4=3/4."],["¿Cuánto es la mitad de 18?",["36","9","6"],1,"18·1/2=9."]],
 potencias:[["2⁴ vale:",["8","16","6"],1,"2·2·2·2=16."],["b⁶/b², b≠0, es:",["b⁴","b³","b⁸"],0,"6−2=4."]],
 raices:[["√64 es:",["8","±8","32"],0,"La raíz principal es 8."],["√27 simplificada es:",["9√3","3√3","√9+√3"],1,"√27=√(9·3)=3√3."]],
 jerarquia:[["7+3·2 es:",["20","13","10"],1,"Primero se multiplica 3·2=6."],["(8−3)² es:",["13","25","10"],1,"Primero el paréntesis: 5²=25."]]
};
const defaultData=()=>({answers:{},attempts:[],followups:[],focus:[],active:"review",axis:"numeros",mode:"start",updated:null});
let state=defaultData();
function read(){try{const p=JSON.parse(localStorage.getItem(KEY)||"null");if(p&&typeof p==="object")state=Object.assign(defaultData(),p)}catch(e){state=defaultData()}}
function save(){state.updated=new Date().toISOString();try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){const a=document.getElementById("dgSave");if(a)a.textContent="No fue posible guardar este avance. Revisa el almacenamiento del navegador."}}
function $(id){return document.getElementById(id)}
const escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const label=(correct)=>correct<=1?"Refuerzo prioritario":correct===2?"En desarrollo":correct===3?"Base funcional":"Transferencia inicial";
function axisScore(result,id){return result.scores[id]||0}
function grade(answers){const scores={};for(const a of AXES){scores[a.id]=BANK[a.id].reduce((n,q,i)=>n+(answers[a.id+"_"+i]===q[2]?1:0),0)}return scores}
function category(scores){const v=Object.values(scores),weak=v.filter(x=>x<=1).length,developing=v.filter(x=>x===2).length;
if(weak>=2)return "Refuerzo prioritario en varios fundamentos";
if(weak||developing>=3)return "Base en desarrollo con refuerzos específicos";
if(v.every(x=>x>=3))return "Base funcional para iniciar Álgebra";
return "Base en desarrollo"}
const last=()=>state.attempts.at(-1);
const css=document.createElement("style");css.textContent=`
.dg-header{background:linear-gradient(110deg,#213c79,#4764a6);color:white;border-radius:18px;padding:23px}.dg-header h1{color:white}.dg-header p{color:#e4ecff}
.dg-nav{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}.dg-nav button{flex:1;min-width:130px}.dg-nav button[aria-current="page"]{background:#24437f;color:white}
.dg-panel{background:white;border:1px solid #d6dfed;border-radius:15px;padding:20px;margin:12px 0}.dg-panel h2{font-size:1.24rem}.dg-axis{padding:16px;border:1px solid #d8e1f0;border-radius:13px;margin:12px 0;background:#fff}.dg-axis h3{color:#203e7c}
.dg-example{padding:14px;background:#eff4ff;border-left:4px solid #385b9a;border-radius:9px;margin:12px 0}.dg-caution{padding:12px;background:#fff7e8;border-left:4px solid #d49b43;border-radius:8px;margin:11px 0}
.dg-tabs{display:flex;flex-wrap:wrap;gap:7px}.dg-tabs button{font-size:.87rem;padding:8px 11px}.dg-tabs button[aria-current="true"]{background:#24437f;color:white}
.dg-item{padding:17px 0;border-bottom:1px solid #e0e7f1}.dg-item:last-child{border-bottom:0}.dg-choice{display:block;padding:10px 12px;border:1px solid #d4def0;border-radius:9px;margin:7px 0;cursor:pointer}.dg-choice:has(input:checked){background:#edf3ff;border-color:#4063a0}.dg-choice input{accent-color:#24437f;margin-right:8px}
.dg-level{font-size:.76rem;color:#65738e;font-weight:700}.dg-results{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.dg-results>div{border:1px solid #d5dfed;border-radius:11px;padding:14px;background:#fff}.dg-meter{height:9px;border-radius:10px;background:#e2e8f3;overflow:hidden}.dg-meter span{display:block;height:100%;background:#38826f}.dg-muted{color:#5e6981;font-size:.88rem}.dg-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:15px}.dg-actions button{flex:1;min-width:180px}.dg-status{font-weight:750}.dg-tag{display:inline-block;background:#eef4ff;color:#214380;border-radius:20px;padding:4px 9px;font-size:.8rem}
@media(max-width:650px){.dg-results{grid-template-columns:1fr}.dg-panel{padding:14px}.dg-nav button{min-width:125px}}
`;document.head.appendChild(css);
const root=document.createElement("section");root.id="diagnostico";root.hidden=true;root.innerHTML=`<div class="dg-header"><p class="eyebrow" style="color:#ffc9e6">ANTES DEL MÓDULO I · TERCER AÑO EPJA</p><h1>Descubre lo que ya sabes</h1><p>Repasa los conocimientos matemáticos que usarás durante el año, realiza una prueba diagnóstica y recibe actividades para fortalecer los temas que necesites.</p><span class="dg-tag">Sin calificación oficial · Puedes repetir y mejorar</span></div><div class="dg-nav" id="dgMainNav"></div><p class="dg-muted" id="dgSave" aria-live="polite">Tus respuestas se guardan mientras trabajas.</p><div id="dgContent"></div><div class="dg-actions"><button class="secondary" type="button" id="dgGoHome">Terminar diagnóstico y volver a la portada →</button></div>`;
document.querySelector("main").appendChild(root);
$("dgGoHome").onclick=()=>go("portada");
function nav(){const items=[{id:"review",name:"Repaso con ejemplos"},{id:"test",name:"Prueba diagnóstica"},{id:"results",name:"Mi diagnóstico"},{id:"improve",name:"Plan de mejora"}];$("dgMainNav").innerHTML=items.map(it=>`<button type="button" class="secondary" data-dg-mode="${it.id}" aria-current="${state.active===it.id?"page":"false"}">${it.name}</button>`).join("");$("dgMainNav").querySelectorAll("button").forEach(b=>b.onclick=()=>selectMode(b.dataset.dgMode))}
function selectMode(m){state.active=m;save();render()}
function review(){const a=AXES.find(x=>x.id===state.axis)||AXES[0];return `<div class="dg-panel"><h2>Fundamentos que conviene recordar</h2><p>Este repaso recupera ideas de grados anteriores. Puedes estudiar primero o realizar la prueba para descubrir qué necesitas reforzar.</p><div class="dg-tabs">${AXES.map(x=>`<button type="button" class="secondary" data-dg-axis="${x.id}" aria-current="${x.id===a.id}">${x.short}</button>`).join("")}</div><div class="dg-axis"><h3>${a.title}</h3><p>${a.intro}</p><div class="dg-example"><strong>Ejemplo de la vida cotidiana</strong><p>${a.example}</p></div><div class="dg-example"><strong>Ejemplo resuelto y explicado</strong><p>${a.worked}</p></div><div class="dg-caution"><strong>Atención a un error frecuente</strong><p>${a.caution}</p></div><p><strong>¿Qué conviene practicar?</strong> ${a.tip}</p></div><div class="dg-actions"><button type="button" id="dgNextAxis" class="secondary">Siguiente contenido</button><button type="button" id="dgToTest">Realizar la prueba diagnóstica →</button></div><p><a href="repaso-aritmetica.html" target="_blank" rel="noopener" style="font-weight:750;color:#234887">Abrir laboratorio completo de aritmética y preálgebra (con ejemplos, calculadoras y prácticas) ↗</a></p><p class="dg-muted">El laboratorio es un recurso complementario de estudio; la prueba que organiza tu perfil diagnóstico está aquí, en el Aula Virtual.</p></div>`}
function test(){const total=AXES.length*4;const filled=Object.keys(state.answers).filter(k=>state.answers[k]!==null&&state.answers[k]!==undefined).length;return `<div class="dg-panel"><h2>Prueba diagnóstica del grado</h2><p>28 preguntas: siete ejes y cuatro niveles de dificultad pedagógica (Reconoce, Aplica, Analiza y Transfiere). Responde según lo que sabes; no necesitas hacerlo perfecto.</p><p class="dg-status">${filled} de ${total} respuestas marcadas · 1 pregunta por nivel y por eje</p><p class="dg-muted">Para que el diagnóstico inicial sea útil, la corrección se muestra después de entregar el intento. No se exige matrícula ni cuenta de Google.</p><div class="dg-tabs">${AXES.map((a,i)=>`<button type="button" class="secondary" data-dg-axis="${a.id}" aria-current="${a.id===state.axis}">${i+1}. ${a.short}</button>`).join("")}</div><div id="dgQuestions">${testAxis()}</div><div class="dg-actions"><button type="button" class="secondary" id="dgPrevTopic">← Eje anterior</button><button type="button" id="dgNextTopic">Siguiente eje →</button></div><div class="dg-actions"><button id="dgFinish" type="button">Finalizar mi diagnóstico</button></div></div>`}
function testAxis(){const a=AXES.find(x=>x.id===state.axis)||AXES[0];return `<h3>${a.title}</h3>`+BANK[a.id].map((q,i)=>`<div class="dg-item"><div class="dg-level">Nivel ${i+1}: ${["Reconoce","Aplica","Analiza","Transfiere"][i]}</div><p><strong>${i+1}. ${escape(q[0])}</strong></p>${q[1].map((o,j)=>`<label class="dg-choice"><input type="radio" name="dg_${a.id}_${i}" value="${j}" ${state.answers[a.id+"_"+i]===j?"checked":""}>${escape(o)}</label>`).join("")}</div>`).join("")}
function results(){const rec=last();if(!rec)return `<div class="dg-panel"><h2>Tu diagnóstico aparecerá aquí</h2><p>Primero responde y entrega la prueba de 28 preguntas.</p><button id="dgBeginTest">Comenzar diagnóstico</button></div>`;
 const low=AXES.filter(a=>axisScore(rec,a.id)<=2);const good=AXES.filter(a=>axisScore(rec,a.id)>=3);
 const levelScore=[0,1,2,3].map(i=>AXES.reduce((sum,a)=>sum+(rec.answers[a.id+"_"+i]===BANK[a.id][i][2]?1:0),0));
 const levels=['Reconoce','Aplica','Analiza','Transfiere'];
 const levelSection='<h3>Desempeño por dificultad de las preguntas</h3><div class="dg-results">'+levels.map((name,i)=>'<div><b>Nivel '+(i+1)+' · '+name+'</b><p>'+levelScore[i]+' de 7 respuestas correctas</p><div class="dg-meter"><span style="width:'+(levelScore[i]*100/7)+'%"></span></div></div>').join('')+'</div>';
 const revision='<details class="dg-panel"><summary><b>Revisar las 28 respuestas y explicaciones</b></summary>'+AXES.map(a=>'<h3>'+a.title+'</h3>'+BANK[a.id].map((q,i)=>{const x=rec.answers[a.id+"_"+i],ok=x===q[2];return '<p><b>'+escape(q[0])+'</b><br>Tu respuesta: '+escape(q[1][x]||'Sin responder')+' · '+(ok?'Correcta':'Para revisar')+'<br>Respuesta correcta: '+escape(q[1][q[2]])+'<br><span class="dg-muted">'+escape(q[3])+'</span></p>'}).join('')).join('')+'</details>';
 return `<div class="dg-panel"><h2>Tu perfil diagnóstico inicial</h2><p class="dg-muted">Último intento: ${new Date(rec.at).toLocaleString("es-DO")} · Intentos guardados: ${state.attempts.length}</p><h3>${escape(category(rec.scores))}</h3><p>Respondiste correctamente ${rec.correct} de 28 preguntas. Este resultado orienta el aprendizaje; no certifica un nivel de dominio real ni sustituye la observación del facilitador.</p><div class="dg-results">${AXES.map(a=>{const n=axisScore(rec,a.id);return `<div><b>${a.title}</b><p>${n}/4 · ${label(n)}</p><div class="dg-meter"><span style="width:${n*25}%"></span></div><p class="dg-muted">${n<=2?"Recomendación: repasar este eje y realizar una comprobación de mejora.":"Continúa aplicando este contenido en situaciones nuevas."}</p><button type="button" class="secondary" data-dg-review="${a.id}">Repasar este eje</button></div>`}).join("")}</div>${levelSection}${revision}<div class="dg-panel" style="padding:12px;margin-top:16px"><strong>Orientación para continuar</strong><p>${low.length?"Necesitas reforzar: "+low.map(a=>a.title).join(", ")+".":"Las respuestas muestran una base funcional en los siete ejes. Puedes iniciar el Módulo I y regresar al repaso cuando lo necesites."}</p>${good.length?`<p class="dg-muted">Ejes con al menos tres aciertos: ${good.map(a=>a.short).join(", ")}.</p>`:""}</div><div class="dg-actions"><button type="button" id="dgToImprove">${low.length?"Realizar actividades y prueba de mejora →":"Consultar el plan de práctica →"}</button><button type="button" class="secondary" id="dgRetryInitial">Hacer otro diagnóstico inicial</button><button type="button" class="secondary" id="dgExport">Guardar copia de mis resultados</button></div><p class="dg-muted">La clasificación por eje procede de solo cuatro preguntas. Los cuatro niveles indican complejidad de las tareas, no una escala oficial de dominio.</p></div>`}
function improve(){const rec=last();if(!rec)return `<div class="dg-panel"><h2>Plan de mejora</h2><p>Realiza primero la prueba inicial para identificar qué contenidos necesitas trabajar más.</p><button id="dgBeginTest">Ir a la prueba</button></div>`;
 const axes=AXES.filter(a=>axisScore(rec,a.id)<=2);if(!axes.length)return `<div class="dg-panel"><h2>Tu plan de consolidación</h2><p>Has respondido correctamente al menos tres preguntas en cada eje. Te recomendamos continuar con el Módulo I, y utilizar el repaso como consulta cuando lo necesites.</p><button type="button" id="dgBackResult" class="secondary">Consultar mi perfil</button></div>`;
 const recent=state.followups.filter(f=>f.initialId===rec.id);
 return `<div class="dg-panel"><h2>Refuerzo según tus respuestas</h2><p>Tu plan se concentra en <strong>${axes.length} eje(s)</strong> con dos aciertos o menos. Estudia los ejemplos y realiza una <strong>segunda comprobación, con preguntas distintas</strong>, para observar tu mejora.</p><div class="dg-results">${axes.map(a=>`<div><h3>${a.title}</h3><p>${a.tip}</p><p class="dg-muted">Diagnóstico inicial: ${axisScore(rec,a.id)}/4</p><button type="button" class="secondary" data-dg-review="${a.id}">Revisar explicación y ejemplo</button>${recent.filter(f=>f.axis===a.id).length?`<p class="dg-muted">Última comprobación: ${recent.filter(f=>f.axis===a.id).at(-1).score}/2</p>`:""}</div>`).join("")}</div><h3 style="margin-top:22px">Comprobación de mejora</h3><p class="dg-muted">Dos preguntas nuevas por cada eje a reforzar. Sus resultados se registran por separado del diagnóstico inicial.</p><div class="dg-tabs">${axes.map(a=>`<button type="button" class="secondary" data-dg-fup="${a.id}" aria-current="${state.focus===a.id}">${a.short}</button>`).join("")}</div><div id="dgImproveQuestions">${improveAxis(axes)}</div></div>`}
function improveAxis(axes){const axis=axes.find(a=>a.id===state.focus)||axes[0];if(!axis)return "";return `<div class="dg-axis"><h3>${axis.title}</h3>${IMPROVE[axis.id].map((q,i)=>`<div class="dg-item"><p><strong>${i+1}. ${escape(q[0])}</strong></p>${q[1].map((opt,j)=>`<label class="dg-choice"><input type="radio" name="dg_fu_${axis.id}_${i}" value="${j}">${escape(opt)}</label>`).join("")}</div>`).join("")}<button type="button" id="dgFinishImprove">Comprobar mi mejora</button><div id="dgImproveResponse" aria-live="polite"></div></div>`}
function wire(){const root=$("dgContent");root.querySelectorAll("[data-dg-axis]").forEach(b=>b.onclick=()=>{state.axis=b.dataset.dgAxis;save();render()});root.querySelectorAll("[data-dg-review]").forEach(b=>b.onclick=()=>{state.axis=b.dataset.dgReview;selectMode("review")});
 const t=$("dgToTest");if(t)t.onclick=()=>selectMode("test");const b=$("dgBeginTest");if(b)b.onclick=()=>selectMode("test");
 const next=$("dgNextAxis");if(next)next.onclick=()=>{state.axis=AXES[(AXES.findIndex(a=>a.id===state.axis)+1)%7].id;save();render()};
 if(state.active==="test"){
  root.querySelectorAll('#dgQuestions input[type="radio"]').forEach(i=>i.onchange=()=>{const key=i.name.slice(3);state.answers[key]=Number(i.value);save();const x=root.querySelector(".dg-status");if(x)x.textContent=Object.keys(state.answers).filter(k=>state.answers[k]!=null).length+" de 28 respuestas marcadas"});
  $("dgPrevTopic").onclick=()=>{const j=AXES.findIndex(a=>a.id===state.axis);state.axis=AXES[(j+6)%7].id;save();render()};
  $("dgNextTopic").onclick=()=>{const j=AXES.findIndex(a=>a.id===state.axis);state.axis=AXES[(j+1)%7].id;save();render()};
  $("dgFinish").onclick=()=>{const completed=AXES.every(a=>BANK[a.id].every((_,i)=>Number.isInteger(state.answers[a.id+"_"+i])));if(!completed){alert("Completa las 28 preguntas. Puedes cambiar de eje con los botones superiores.");return}
   if(!confirm("¿Finalizar la prueba diagnóstica y consultar tus resultados?"))return;
   const scores=grade(state.answers),rec={id:"D-"+Date.now(),at:new Date().toISOString(),scores,correct:Object.values(scores).reduce((a,b)=>a+b,0),answers:Object.assign({},state.answers),type:"diagnostico_orientativo"};state.attempts.push(rec);state.answers={};state.focus="";selectMode("results")};
 }
 const improveBtn=$("dgToImprove");if(improveBtn)improveBtn.onclick=()=>selectMode("improve");const retry=$("dgRetryInitial");if(retry)retry.onclick=()=>{state.axis="numeros";selectMode("test")};
 const back=$("dgBackResult");if(back)back.onclick=()=>selectMode("results");
 const exportBtn=$("dgExport");if(exportBtn)exportBtn.onclick=()=>{const blob=new Blob([JSON.stringify({module:"diagnostico_grado",exportedLocalAt:new Date().toISOString(),attempts:state.attempts,followups:state.followups,notice:"Resultados orientativos locales sin validación docente"},null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="epja-diagnostico-grado.json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1200)};
 root.querySelectorAll("[data-dg-fup]").forEach(b=>b.onclick=()=>{state.focus=b.dataset.dgFup;save();render()});
 const finish=$("dgFinishImprove");if(finish)finish.onclick=()=>{const axis=state.focus||AXES.find(a=>axisScore(last(),a.id)<=2)?.id;if(!axis)return;const values=IMPROVE[axis].map((q,i)=>root.querySelector('input[name="dg_fu_'+axis+'_'+i+'"]:checked'));if(values.some(x=>!x)){alert("Responde las dos preguntas para comprobar tu mejora.");return}const given=values.map(v=>Number(v.value)),score=given.reduce((sum,v,i)=>sum+(v===IMPROVE[axis][i][2]?1:0),0),record={axis,at:new Date().toISOString(),initialId:last().id,score,outOf:2,answers:given};state.followups.push(record);save();const box=$("dgImproveResponse");box.replaceChildren();const title=document.createElement("h3");title.textContent="Comprobación de mejora: "+score+" de 2 respuestas correctas";box.appendChild(title);const p=document.createElement("p");p.textContent=score===2?"Buen avance en esta comprobación. Continúa aplicando este tema en nuevos problemas.":score===1?"Hay avance parcial. Revisa el ejemplo y practica otro caso.":"Conviene continuar con el repaso acompañado del facilitador.";box.appendChild(p);IMPROVE[axis].forEach((q,i)=>{const p=document.createElement("p");p.textContent=(i+1)+". "+(given[i]===q[2]?"Correcta. ":"Para revisar. ")+q[3];box.appendChild(p)});const goBtn=document.createElement("button");goBtn.className="secondary";goBtn.textContent="Volver al plan de mejora";goBtn.onclick=()=>render();box.appendChild(goBtn)};
}
function render(){if(root.hidden)return;nav();if(state.active==="review")$("dgContent").innerHTML=review();else if(state.active==="test")$("dgContent").innerHTML=test();else if(state.active==="results")$("dgContent").innerHTML=results();else $("dgContent").innerHTML=improve();wire()}
const originalGo=go;go=function(id){originalGo(id);if(id==="diagnostico"){read();render()}};
/* En Inicio y Mi ruta, los CTA están en el HTML principal. */
const priorDrawRecords=drawRecords;
drawRecords=function(){
 priorDrawRecords();
 read();
 const box=document.createElement("div");box.className="card";
 const heading=document.createElement("h3");heading.textContent="Diagnóstico de entrada al grado";box.appendChild(heading);
 const record=last();const detail=document.createElement("p");
 detail.textContent=record?"Última prueba inicial: "+record.correct+" de 28 respuestas correctas. "+category(record.scores)+". Comprobaciones de mejora realizadas: "+state.followups.length+".":"Aún no has realizado tu diagnóstico inicial de los fundamentos de Matemática.";
 box.appendChild(detail);
 const button=document.createElement("button");button.className="secondary";button.textContent=record?"Consultar diagnóstico y plan de mejora":"Comenzar diagnóstico";
 button.onclick=()=>go("diagnostico");box.appendChild(button);
 const place=$("recordsHistory");if(place)place.prepend(box);
};
window.EPJA_DIAGNOSTICO={open:()=>go("diagnostico"),status:()=>({attempts:state.attempts.length,followups:state.followups.length})};
})();