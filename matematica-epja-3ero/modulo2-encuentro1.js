"use strict";
/* Matemática EPJA, 3.er año, Módulo II, Encuentro 1. M2.01 + M2.02.
   Fuente de contenidos: libro MINERD, Módulo 2, páginas impresas 38-41.
   Matriz aprobada: CE-MAT1/IL-3 principal, IL-4 complementario.
   Evaluación de aprendizaje, no calificación oficial. */
(function(){
const id=x=>document.getElementById(x),KEY='epja_modulo2_encuentro1_v1';
const labels=['¿Qué sabemos?','Contenidos','Ejemplos','Práctica','Evaluación'];
const topics=[
 {title:'La igualdad y el equilibrio',page:'38',heading:'Una igualdad compara dos cantidades',desc:'El signo igual (=) expresa que ambos miembros representan el mismo valor. Una balanza equilibrada es una manera de observar esta relación. Una igualdad numérica también puede ser falsa: tener un signo igual no garantiza que sea verdadera.',formula:'8 + 4 = 12',tip:'No confundas = con una orden de calcular: es una comparación entre los dos lados.',q:'¿Cuál igualdad numérica es verdadera?',options:['7 + 5 = 12','7 + 5 = 13','7 + 5 = 10'],a:0,why:'7 + 5 y 12 tienen el mismo valor.'},
 {title:'Igualdades numéricas y algebraicas',page:'39',heading:'¿Qué cambia cuando aparecen letras?',desc:'Una igualdad numérica compara expresiones con números. Una igualdad algebraica contiene una o más letras. Al sustituir las letras por valores concretos, obtenemos una igualdad numérica que puede ser verdadera o falsa.',formula:'3x + 2y = 16',tip:'Para comprobar una igualdad sustituye todas las letras y calcula cada miembro por separado.',q:'Si x=4 e y=2, ¿qué ocurre con 3x+2y=16?',options:['Es verdadera: 12+4=16','Es falsa: 12+2=14','No puede comprobarse'],a:0,why:'3(4)+2(2)=12+4=16.'},
 {title:'Ecuación, identidad y solución',page:'40',heading:'No todas las igualdades con letras son iguales',desc:'Una ecuación es verdadera para ciertos valores de la incógnita, llamados soluciones. Una identidad es verdadera para todos los valores permitidos de sus variables. Una igualdad algebraica que no tiene solución tampoco es una identidad.',formula:'x − 9 = 3   |   2(x + 3) = 2x + 6',tip:'Comprueba varios valores, pero recuerda que una identidad general se justifica por una propiedad, por ejemplo la distributiva.',q:'¿Cuál de estas igualdades es una identidad?',options:['2(x+3)=2x+6','x−9=3','x+2=9'],a:0,why:'La distributiva demuestra 2(x+3)=2x+6 para todo x.'},
 {title:'Propiedades y ecuaciones equivalentes',page:'40–41',heading:'Conservar la igualdad al transformar',desc:'Si sumamos la misma cantidad a ambos miembros, la igualdad se conserva. También al multiplicarlos por una misma cantidad distinta de cero. Dos ecuaciones son equivalentes cuando tienen el mismo conjunto de soluciones. El libro incluye ejemplos de ecuaciones equivalentes y transformaciones en ambos miembros.',formula:'4x − 5 = 1  ⇔  4x = 6',tip:'Una operación debe realizarse en ambos miembros. Multiplicar por cero puede perder información y no es una transformación reversible.',q:'¿Qué operación transforma 4x−5=1 en 4x=6?',options:['Sumar 5 a ambos miembros','Sumar 5 solo al lado izquierdo','Multiplicar por cero'],a:0,why:'4x−5+5=1+5, por tanto 4x=6. Ambas tienen la misma solución, x=1.5.'}
];
const examples=[
 ['Balanza en equilibrio','En una balanza, una caja con masa desconocida x y un peso de 10 kg equilibran 14 kg. Se expresa x+10=14. Si x=4, los dos miembros valen 14 kg. La balanza visualiza por qué ambas cantidades deben coincidir.'],
 ['Compra de una comunidad','Se compran tres cuadernos a RD$80 y dos lápices a RD$25. El gasto es 3(80)+2(25)=290. Es una igualdad numérica verdadera: ambos lados representan RD$290.'],
 ['Comprobar una ecuación sin resolverla completamente','Una persona propone x=6 para la ecuación 2x+8=20. Sustituimos: 2(6)+8=12+8=20. Por tanto, 6 es solución. Si probamos x=5, obtenemos 18≠20.'],
 ['Identidad y reparto de materiales','Dos paquetes con (x+3) artículos cada uno contienen 2(x+3) artículos. También pueden contarse como 2x+6. La igualdad 2(x+3)=2x+6 es una identidad porque la distributiva la justifica para cualquier x.'],
 ['Transformación equivalente de una ecuación','En 4x−5=1, sumar 5 a ambos miembros produce 4x=6. Multiplicar la ecuación inicial por 4 produce 16x−20=4. Las tres ecuaciones tienen solución x=1.5. Las transformaciones modifican la escritura, no la solución.']
];
const questionsPractice=[
 ['Clasificar igualdades','Reconoce','¿Cuál es una igualdad numérica?', ['3+4=7','2x+1=7','x−2=0'],0,'No contiene letras: compara números.'],
 ['Clasificar igualdades','Aplica','¿Cuál es una igualdad algebraica?', ['5+5=10','2x+3=11','6=6'],1,'La letra x representa una cantidad.'],
 ['Clasificar igualdades','Analiza','La expresión 4+3=9 es:', ['Una igualdad numérica falsa','Una ecuación','Una identidad'],0,'Los dos miembros valen 7 y 9, respectivamente.'],
 ['Sustituir y comprobar','Reconoce','Para comprobar 2x+1=9 cuando x=4, primero debemos:', ['Sustituir x por 4','Sumar 4 solo a un miembro','Cambiar = por >'],0,'Sustituir significa usar el valor dado.'],
 ['Sustituir y comprobar','Aplica','Con x=3, la igualdad 5x−2=13 es:', ['Verdadera','Falsa','Imposible de comprobar'],0,'5(3)−2=13.'],
 ['Sustituir y comprobar','Analiza','En 3x+2y=16, con x=2 e y=3, obtenemos:', ['12=16, falsa','16=16, verdadera','10=16, falsa'],0,'3(2)+2(3)=6+6=12, no 16.'],
 ['Ecuaciones e identidades','Reconoce','¿Cuál es una ecuación con una incógnita?', ['x−4=8','9=9','4+6=10'],0,'Una ecuación tiene una incógnita y se cumple para ciertos valores.'],
 ['Ecuaciones e identidades','Aplica','¿Para qué valor x−9=3 es verdadera?', ['12','6','−12'],0,'12−9=3.'],
 ['Ecuaciones e identidades','Analiza','La igualdad 4(x+2)=4x+8 es:', ['Identidad','Ecuación con única solución','Igualdad numérica falsa'],0,'La distributiva la hace verdadera para cualquier x.'],
 ['Transformaciones equivalentes','Reconoce','Si A=B, ¿qué mantiene la igualdad?', ['Sumar 7 a ambos miembros','Sumar 7 solamente a A','Multiplicar A por 0 y no B'],0,'La misma suma preserva el equilibrio.'],
 ['Transformaciones equivalentes','Aplica','De 3x−4=8 obtenemos una equivalente al:', ['Sumar 4 a ambos lados: 3x=12','Sumar 4 solo al lado derecho','Restar 4 a ambos lados: 3x=4'],0,'Restituimos el equilibrio en ambos miembros.'],
 ['Transformaciones equivalentes','Transfiere','Dos rutas dan ecuaciones 5x=20 y x=4. ¿Qué relación tienen?', ['Son equivalentes','Sus soluciones son distintas','No tienen soluciones'],0,'Ambas tienen como solución el mismo valor, 4.']
];
const blocks=[
 {name:'B1 · Comunicación matemática',desc:'Clasificar y comunicar con lenguaje matemático preciso.',items:[
 ['Reconoce','¿Cuál símbolo expresa igualdad?',['=','≠','>'],0,'El símbolo = compara dos miembros.'],
 ['Aplica','¿Cuál descripción corresponde a 2x+3=11?',['Igualdad algebraica','Igualdad exclusivamente numérica','Operación sin igualdad'],0,'Contiene una incógnita y un signo igual.'],
 ['Analiza','En 4+6=11, ¿qué afirmación es correcta?',['Es una igualdad numérica falsa','Es una identidad','Es una ecuación lineal'],0,'10 no es igual a 11.'],
 ['Transfiere','Tres bolsas con n piezas cada una reúnen 21 piezas. ¿Cuál expresión comunica la situación?',['3n=21','n+3=21','21n=3'],0,'Tres grupos iguales se representan como 3n.']]},
 {name:'B2 · Razonamiento lógico',desc:'Distinguir afirmaciones verdaderas, ecuaciones e identidades.',items:[
 ['Reconoce','¿Qué caracteriza una identidad algebraica?',['Es verdadera para todos los valores admitidos','Tiene siempre una solución única','No contiene variables'],0,'Una identidad se cumple para todos los valores de su dominio.'],
 ['Aplica','¿Es x=7 solución de x+5=12?',['Sí','No','No puede comprobarse'],0,'7+5=12.'],
 ['Analiza','¿Qué sucede con 2(x+4)=2x+8?',['Es una identidad por la distributiva','Es verdadera solo para x=4','Es una igualdad numérica'],0,'Al desarrollar, ambos miembros coinciden para cualquier x.'],
 ['Transfiere','Un participante afirma que 3x=15 es verdad para cualquier x. ¿Cómo evaluarías su argumento?',['Es falso: solo se cumple cuando x=5','Es correcto: toda ecuación es identidad','Es falso: no tiene soluciones'],0,'Una ecuación puede tener una solución sin ser identidad.']]},
 {name:'B3 · Aplicación y comprobación',desc:'Sustituir y comprobar la validez de un modelo.',items:[
 ['Reconoce','¿Qué significa sustituir x por 2?',['Reemplazar cada x por 2','Sumar 2 al resultado','Eliminar el signo igual'],0,'Se usa el valor numérico de la variable.'],
 ['Aplica','Para x=3, ¿es cierta 4x+2=14?',['Sí','No, vale 12','No, vale 16'],0,'4(3)+2=14.'],
 ['Analiza','En 2x+3y=13, con x=2 e y=3, el lado izquierdo vale:',['13','10','9'],0,'2(2)+3(3)=4+9=13.'],
 ['Transfiere','Una tarifa de RD$150 por visita más RD$200 de inscripción da RD$650. ¿Cuántas visitas v satisfacen 150v+200=650?',['3','2','4'],0,'150(3)+200=650.']]},
 {name:'B4 · Argumentación y decisiones',desc:'Justificar transformaciones y respetar procedimientos alternativos.',items:[
 ['Reconoce','¿Qué debemos hacer con ambos miembros al sumar una cantidad para mantener una igualdad?',['Sumar la misma cantidad a ambos','Sumar cantidades distintas','Sumar solo al primero'],0,'Las mismas operaciones conservan el equilibrio.'],
 ['Aplica','¿Cuál ecuación es equivalente a x−6=4?',['x=10','x=−2','x=4'],0,'Sumar 6 a ambos miembros da x=10.'],
 ['Analiza','Al multiplicar por 3 ambos miembros de 2x=8, obtenemos:',['6x=24','6x=8','2x=24'],0,'Se multiplica cada lado por el mismo número no nulo.'],
 ['Transfiere','Dos grupos obtienen 4x=12 y x=3 a partir del mismo problema. ¿Cuál juicio es válido?',['Son equivalentes; ambas tienen solución 3','La primera no es una ecuación','No pueden representar el mismo problema'],0,'Al dividir ambos miembros por 4 se obtiene x=3.']]}];
const initial=()=>({stage:0,topic:0,practiceGroup:0,evalBlock:0,recall:'',prResponses:{},prAttempts:{},prHints:{},understanding:{},evalDraft:{},evalAttempts:[],proof:['',''],selfStudy:['','',''],studyDone:[false,false,false],visited:[true,false,false,false,false]});
let state=initial();try{const parsed=JSON.parse(localStorage.getItem(KEY)||'null');if(parsed&&typeof parsed==='object')state={...initial(),...parsed}}catch(e){}
if(!Array.isArray(state.selfStudy))state.selfStudy=['','',''];
if(!Array.isArray(state.studyDone))state.studyDone=[false,false,false];
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}};
const escape=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const opts=(q,name,saved)=>q.options.map((opt,i)=>`<label class="m2-choice"><input type="radio" name="${name}" value="${i}" ${saved===i?'checked':''}><span>${escape(opt)}</span></label>`).join('');
function initStyles(){const st=document.createElement('style');st.textContent=`
#m2e1[hidden]{display:none!important}#m2e1{margin:18px 0;color:#163052}
.m2-hero{background:linear-gradient(125deg,#213d7c,#446cab);color:#fff;border-radius:16px;padding:25px;margin-bottom:14px}
.m2-hero h2{color:#fff;margin:9px 0;font-size:1.42rem}.m2-hero p{line-height:1.55;color:#f4f7ff}
.m2-stage-nav,.m2-subnav{display:flex;gap:7px;flex-wrap:wrap;margin:12px 0}
.m2-stage,.m2-subnav button{flex:1 1 138px;min-height:45px;padding:10px;border:1px solid #8caacc;border-radius:9px;color:#1c447e;background:#f6f9ff;font-weight:700;cursor:pointer;line-height:1.4}
.m2-stage[aria-current="step"],.m2-subnav button[aria-selected="true"]{background:#234986;color:white;border-color:#234986}
.m2-card{background:white;border:1px solid #d5e1f0;padding:22px;border-radius:14px;margin:11px 0}.m2-card h3{margin:8px 0 14px;color:#19365e}
.m2-lesson{background:#f1f6fd;border-left:4px solid #254e93;padding:14px;border-radius:8px;line-height:1.65;margin:12px 0}
.m2-math{text-align:center;font-weight:800;font-size:1.2rem;background:#eaf2fe;border-radius:9px;padding:17px;margin:14px 0;overflow-wrap:anywhere}
.m2-lab{padding:16px;border:1px solid #c9d9ee;background:#f7faff;border-radius:10px;margin:14px 0}
.m2-lab label{display:block;font-weight:650;margin:12px 0 4px}.m2-lab input[type=range]{width:100%;accent-color:#244b91}
.m2-choice{display:flex!important;align-items:center;gap:9px;border:1px solid #c8d9f1;background:#fff;padding:11px;border-radius:8px;font-weight:500!important;margin:6px 0!important;cursor:pointer}
.m2-choice:has(input:checked){background:#e5f0ff;border-color:#3768a9}
.m2-feedback{background:#eef5ff;padding:12px;border-left:4px solid #2c568f;margin:10px 0;line-height:1.55}.m2-feedback.ok{border-color:#208267;background:#ecf9f4}.m2-feedback.bad{border-color:#ab7818;background:#fffae9}
.m2-action{display:flex;gap:10px;flex-wrap:wrap;margin:10px 0}.m2-action button{min-height:42px}
.m2-bar{height:9px;border-radius:7px;background:#dce5f3;overflow:hidden}.m2-bar span{display:block;height:100%;background:#2b8574}
.m2-table{width:100%;border-collapse:collapse}.m2-table th,.m2-table td{border-bottom:1px solid #dae4f0;padding:9px;text-align:left}
.m2-card textarea{display:block;width:100%;min-height:125px;margin:9px 0 12px;padding:11px;border:1px solid #abbfdc;border-radius:8px;font:inherit;box-sizing:border-box}
.m2-study{margin-top:18px}.m2-study-head{background:#eaf4ff;border:1px solid #bdd2e9;border-radius:12px;padding:18px}.m2-study-head h4{font-size:1.15rem;margin:9px 0}
.m2-study-task{background:white;border:1px solid #ccd9e8;border-radius:11px;padding:14px 17px;margin:12px 0}
.m2-study-task summary{cursor:pointer;font-weight:700;color:#173c75;line-height:1.55}
.m2-study-task[open] summary{padding-bottom:9px;border-bottom:1px solid #d9e1ea;margin-bottom:11px}
.m2-study-check{display:inline-flex!important;align-items:center;gap:8px;font-weight:600!important;margin:0!important}.m2-study-check input{width:19px;height:19px;accent-color:#2c7562}
.m2-controls{display:flex;gap:10px;margin-top:13px}.m2-controls button{flex:1}
.m2-badge{font-size:.78rem;font-weight:750;background:#dce9ff;color:#1d4780;padding:6px 9px;border-radius:20px}
.m2-muted{color:#536783;font-size:.87rem}.m2-question{border:1px solid #d5dfed;padding:15px;border-radius:10px;margin:13px 0}
.m2-question h4{color:#1b3c66;margin:5px 0 12px}.m2-question small{color:#496388}
@media(max-width:600px){.m2-card{padding:14px}.m2-hero{padding:17px}.m2-stage{flex:1 1 105px;font-size:.78rem;padding:7px}.m2-controls{flex-direction:column}}
`;document.head.appendChild(st)}
function nav(group,arr,current){return `<div class="m2-subnav" role="tablist" aria-label="Seleccionar ${group}">${arr.map((x,i)=>`<button type="button" data-m2-select="${group}:${i}" role="tab" aria-selected="${current===i}">${i+1}. ${escape(typeof x==='string'?x:x.title)}</button>`).join('')}</div>`}
function question(q,prefix,k,selected,hint,onEval=false){return `<div class="m2-question"><small>${escape(q[0]||q.level||'')}</small><h4>${escape(q[2]||q.q)}</h4>${opts({options:q[3]||q.options},prefix+'_'+k,selected)}${onEval?'':`<div class="m2-action"><button type="button" class="secondary" data-m2-hint="${k}">Ver pista</button><button type="button" data-m2-check="${k}">Comprobar</button></div><div id="m2feedback_${k}" class="m2-feedback" ${hint?'':'hidden'}>${escape(hint||'')}</div>`}</div>`}
function remember(){return `<span class="m2-badge">Paso 1 · ¿Qué sabemos?</span><h3>Recuperemos las expresiones del Módulo I</h3><p>En el módulo anterior utilizamos letras para representar cantidades. Ahora vamos a comparar expresiones y decidir cuándo representan valores iguales.</p><div class="m2-lesson"><b>Situación inicial:</b> una persona pagó RD$120 por dos artículos iguales. Si cada uno cuesta x pesos, escribe la relación <b>2x = 120</b>. ¿Qué tendría que valer x para que la igualdad se cumpla?</div><div class="m2-lab"><label for="m2recall">Explica con tus palabras qué es una variable y cómo comprobarías 2x=120.</label><textarea id="m2recall" placeholder="Recuerdo que una variable...">${escape(state.recall)}</textarea></div><p class="m2-muted">Autoevaluación inicial: no produce calificación y permite recuperar saberes de polinomios y operaciones.</p>`}
function interactiveLab(i){if(i===0)return `<div class="m2-lab"><h4>Laboratorio de balanza</h4><p>En el lado izquierdo hay <b>10+x</b> kilogramos y en el derecho, <b>14 kg</b>. Cambia x y observa cuándo se equilibran.</p><svg viewBox="0 0 300 115" width="100%" role="img" aria-label="Balanza con dos platillos, uno con 10+x y otro con 14 kilogramos"><line x1="150" y1="15" x2="150" y2="99" stroke="#7890af" stroke-width="5"/><line id="m2beam" x1="48" y1="36" x2="252" y2="36" stroke="#2c5d9d" stroke-width="7" stroke-linecap="round"/><path d="M48 38 L27 84 L69 84 Z" fill="#c9e1fb" stroke="#325c92"/><path d="M252 38 L231 84 L273 84 Z" fill="#c9e1fb" stroke="#325c92"/><text x="48" y="80" text-anchor="middle" font-size="16" font-weight="700" fill="#15345e" id="m2left">14</text><text x="252" y="80" text-anchor="middle" font-size="16" font-weight="700" fill="#15345e">14</text></svg><label for="m2balance">Cantidad x = <output id="m2balanceVal">4</output> kg</label><input type="range" id="m2balance" min="0" max="8" value="4" step="1"/><p class="m2-feedback" id="m2balanceFeedback" aria-live="polite">10+4=14: ambos lados tienen igual masa.</p></div>`;
if(i===1)return `<div class="m2-lab"><h4>Laboratorio de sustitución</h4><p>Comprueba si <b>3x+2y=16</b> para distintos valores.</p><label for="m2x">Valor de x: <output id="m2xval">4</output></label><input id="m2x" type="range" min="0" max="6" value="4"><label for="m2y">Valor de y: <output id="m2yval">2</output></label><input id="m2y" type="range" min="0" max="6" value="2"><p id="m2subFeedback" class="m2-feedback" aria-live="polite">3(4)+2(2)=16. La igualdad es verdadera.</p></div>`;
if(i===2)return `<div class="m2-lab"><h4>Explorador: ecuación o identidad</h4><label for="m2type">Selecciona una igualdad</label><select id="m2type" style="padding:11px;width:100%;border-radius:8px"><option value="a">x−9=3</option><option value="b">2(x+3)=2x+6</option><option value="c">5+4=10</option></select><label for="m2tryx">Prueba un valor de x: <output id="m2tryxvalue">12</output></label><input id="m2tryx" type="range" min="-2" max="16" step="1" value="12"><p id="m2typeFeedback" class="m2-feedback" aria-live="polite">Con x=12: 12−9=3. La ecuación se cumple.</p><p class="m2-muted">Experimenta con varios valores. Probar ejemplos ayuda a explorar, pero para justificar una identidad necesitas una propiedad matemática.</p></div>`;
return `<div class="m2-lab"><h4>Transformaciones equivalentes: paso a paso</h4><p>Partimos de <b>4x−5=1</b>. Selecciona una transformación reversible.</p><div class="m2-action"><button data-m2-transform="add" type="button" class="secondary">Sumar 5 a ambos lados</button><button data-m2-transform="mult" type="button" class="secondary">Multiplicar ambos lados por 4</button><button data-m2-transform="invalid" type="button" class="secondary">Sumar 5 solo a un lado</button></div><p id="m2transformResult" class="m2-feedback" aria-live="polite">Selecciona una acción para comprobar si conserva las soluciones.</p></div>`}
function contents(){const t=topics[state.topic],record=state.understanding[state.topic]||{};return `<span class="m2-badge">Paso 2 · Contenidos</span><h3>Igualdades, ecuaciones e identidades</h3><p class="m2-muted">Libro oficial del Módulo II: páginas impresas 38–41. Trabaja los conceptos en orden y compruébalos.</p>${nav('topic',topics,state.topic)}<div class="m2-lesson"><p><b>Subtema ${state.topic+1} · ${escape(t.title)}</b> · página ${t.page}</p><h3>${escape(t.heading)}</h3><p>${escape(t.desc)}</p><div class="m2-math" data-m2-math="${state.topic}">${escape(t.formula)}</div><p><b>Recuerda:</b> ${escape(t.tip)}</p></div>${interactiveLab(state.topic)}${question(['Comprueba que comprendiste','',t.q,t.options], 'm2under',state.topic,record.choice,record.feedback)}<p class="m2-muted">Estas comprobaciones permiten aprender y corregir, no forman parte de la calificación del encuentro.</p>`}
function examplesPage(){return `<span class="m2-badge">Paso 3 · Ejemplos</span><h3>Analiza cinco situaciones resueltas</h3><p>Relaciona cada caso con los subtemas del libro. Observa qué se compara, qué significa la incógnita y cómo se comprueba la igualdad.</p>${examples.map((x,i)=>`<article class="m2-lesson"><h4>Ejemplo ${i+1} · ${escape(x[0])}</h4><p>${escape(x[1])}</p></article>`).join('')}<div class="m2-lab"><b>Reflexiona:</b> ¿en cuál ejemplo se verifica una solución y en cuál se justifica una identidad general? Explica la diferencia antes de pasar a la práctica.</div>`}

const studyTasks=[{"title":"1 · Reconozco y clasifico","minutes":30,"lead":"Repasa las páginas 38–39, clasifica una igualdad numérica y otra algebraica y comprueba cada afirmación.","evidence":"Cuadro de igualdades numéricas y algebraicas","guide":"Igualdad numérica: 7 + 5 = 12. Compruebo: 12 = 12, verdadera.\nIgualdad algebraica: 3x + 2y = 16.\nElijo x = __ e y = __; sustituyo: __ = __.\nMi conclusión: __."},{"title":"2 · Construyo y compruebo","minutes":50,"lead":"Consulta las páginas 40–41. Comprueba la solución de x−9=3 y justifica la identidad 2(x+3)=2x+6.","evidence":"Ecuación, identidad y comprobación","guide":"Ecuación: x − 9 = 3.\nSumo 9 a ambos lados: x = __.\nCompruebo: __ − 9 = 3.\nIdentidad: 2(x + 3) = 2x + 6.\nPor distributiva: 2·x + 2·3 = 2x + 6.\nDiferencia: __."},{"title":"3 · Explico y mejoro","minutes":40,"lead":"Revisa una respuesta que hayas corregido. Explica qué aprendiste y compara con otra estrategia cuando sea posible.","evidence":"Reflexión y autoevaluación","guide":"Al principio creía que __.\nDespués de comprobar comprendí que __.\nMi duda principal fue __.\nUna estrategia distinta que valoré fue __.\nPara mejorar practicaré __."}];
function guidedStudy(){
 var completed=state.studyDone.filter(Boolean).length;
 var html='<section class="m2-study" aria-label="Guía de autoestudio de 120 minutos">'+
 '<div class="m2-study-head"><span class="m2-badge">Autoestudio guiado · 120 minutos</span>'+
 '<h4>Explora, comprueba y construye tu evidencia</h4>'+
 '<p>Completa una actividad a la vez. Las guías te orientan, pero debes escribir tus propios resultados y explicaciones.</p>'+
 '<p class="m2-muted">Revisadas: <b id="m2studyProgress">'+completed+' de 3</b>. El trabajo se conserva solo en este navegador; no se entrega automáticamente.</p></div>';
 studyTasks.forEach(function(task,i){
  html+='<details class="m2-study-task" '+(i===0?'open':'')+'><summary><b>'+
   escape(task.title)+'</b> · '+task.minutes+' minutos '+(state.studyDone[i]?'✓':'')+'</summary>'+
   '<p>'+escape(task.lead)+'</p><p><b>Evidencia:</b> '+escape(task.evidence)+'</p>'+
   '<label for="m2study'+i+'">'+escape(task.evidence)+'</label>'+
   '<textarea id="m2study'+i+'" data-m2-study="'+i+'" rows="6" placeholder="Describe tu procedimiento y comprueba los resultados.">'+escape(state.selfStudy[i]||'')+'</textarea>'+
   '<div class="m2-action"><button type="button" class="secondary" data-m2-starter="'+i+'">Insertar una guía para empezar</button>'+
   '<label class="m2-study-check"><input type="checkbox" data-m2-done="'+i+'" '+(state.studyDone[i]?'checked':'')+'> Revisé esta actividad</label></div>'+
   '<p class="m2-muted">No marques como revisado un trabajo con espacios pendientes o sin comprobación.</p></details>';
 });
 html+='<div class="m2-lab"><h4>Mi portafolio del encuentro</h4>'+
 '<p>Reúne el trabajo de las tres actividades y el avance de las prácticas. Revisa el borrador antes de compartirlo con la maestra.</p>'+
 '<button type="button" id="m2portfolio">Copiar mi evidencia</button>'+
 '<p class="m2-muted" id="m2portfolioFeedback" role="status" aria-live="polite"></p>'+
 '<p class="m2-muted"><b>Autoevaluación:</b> revisa tu proceso. <b>Coevaluación:</b> conversa tus resultados con otra persona cuando sea posible. <b>Heteroevaluación:</b> entrega tu evidencia por el medio indicado por la maestra.</p>'+
 '</div></section>';
 return html;
}
function portfolioText(){
 var count=questionsPractice.filter(function(q,i){return state.prAttempts[i]&&state.prAttempts[i].correct}).length;
 return ['Matemática EPJA · Tercero · Módulo II · Encuentro 1',
 'Borrador de autoestudio; no es una entrega oficial',
 'Prácticas comprobadas correctamente: '+count+' de 12'].concat(studyTasks.map(function(t,i){
 return '\n'+t.evidence+' ['+(state.studyDone[i]?'revisado':'en proceso')+']\n'+(state.selfStudy[i]||'[sin redactar]');
 })).join('\n');
}
function bindGuidedStudy(){
 root.querySelectorAll('[data-m2-starter]').forEach(function(button){
  button.onclick=function(){
   var i=Number(button.dataset.m2Starter),box=id('m2study'+i);
   if(box.value.trim()&&!window.confirm('Ya hay texto escrito. ¿Quieres reemplazarlo por la guía?'))return;
   box.value=studyTasks[i].guide;state.selfStudy[i]=box.value;state.studyDone[i]=false;
   var check=root.querySelector('[data-m2-done="'+i+'"]');if(check)check.checked=false;
   id('m2studyProgress').textContent=state.studyDone.filter(Boolean).length+' de 3';
   save();box.focus();
  };
 });
 root.querySelectorAll('[data-m2-study]').forEach(function(field){
  field.oninput=function(){
   var i=Number(field.dataset.m2Study);state.selfStudy[i]=field.value;state.studyDone[i]=false;
   var check=root.querySelector('[data-m2-done="'+i+'"]');if(check)check.checked=false;
   id('m2studyProgress').textContent=state.studyDone.filter(Boolean).length+' de 3';save();
  };
 });
 root.querySelectorAll('[data-m2-done]').forEach(function(checkbox){
  checkbox.onchange=function(){
   var i=Number(checkbox.dataset.m2Done);
   if(checkbox.checked&&(!String(state.selfStudy[i]||'').trim()||String(state.selfStudy[i]).includes('__'))){
    checkbox.checked=false;
    id('m2portfolioFeedback').textContent='Completa tu evidencia y los espacios pendientes antes de marcarla como revisada.';
    return;
   }
   state.studyDone[i]=checkbox.checked;save();
   id('m2studyProgress').textContent=state.studyDone.filter(Boolean).length+' de 3';
  };
 });
 var copy=id('m2portfolio');if(copy)copy.onclick=function(){
  var output=id('m2portfolioFeedback');
  if(navigator.clipboard&&navigator.clipboard.writeText){
   navigator.clipboard.writeText(portfolioText()).then(function(){output.textContent='Borrador copiado. Revísalo y entrégalo por el canal indicado.';},
    function(){output.textContent='No se pudo copiar. Conserva y copia manualmente las evidencias.';});
  }else{output.textContent='La copia automática no está disponible en este navegador.';}
 };
}

function practice(){const g=state.practiceGroup,pr=questionsPractice.slice(3*g,3*g+3),titles=['Clasificar igualdades','Sustituir y comprobar','Ecuaciones e identidades','Transformaciones equivalentes'],correct=questionsPractice.filter((q,i)=>state.prAttempts[i]?.correct).length;return `<span class="m2-badge">Paso 4 · Práctica</span><h3>Desarrolla destrezas con pistas y correcciones</h3><p>12 actividades basadas en las páginas 38–41, adaptadas a situaciones nuevas. Puedes repetir cada una.</p><b>Destrezas logradas: ${correct} de 12</b><div class="m2-bar"><span style="width:${correct*100/12}%"></span></div>${nav('practice',titles,g)}<h4>${titles[g]}</h4>${pr.map((q,j)=>{const k=g*3+j;return question(q,'m2pr',k,state.prResponses[k],state.prAttempts[k]?.feedback)}).join('')}${guidedStudy()}`}
function assessment(){const b=blocks[state.evalBlock],latest=state.evalAttempts.at(-1);return `<span class="m2-badge">Paso 5 · Evaluación formativa</span><h3>Comprobación por bloques y dificultad</h3><p>16 situaciones nuevas en cuatro agrupaciones pedagógicas. No se muestra la corrección de estas respuestas hasta entregar el intento. No constituye una calificación oficial.</p><p><b>IL-3 principal:</b> justificar la validez de argumentos con ecuaciones de primer grado. <b>IL-4 complementario:</b> razonar la validez de ideas matemáticas.</p>${nav('eval',blocks.map(x=>x.name),state.evalBlock)}<h4>${escape(b.name)}</h4><p class="m2-muted">${escape(b.desc)}</p>${b.items.map((q,j)=>{const k=state.evalBlock*4+j;return `<article class="m2-question"><small>Nivel ${j+1} · ${escape(q[0])}</small><h4>${escape(q[1])}</h4>${opts({options:q[2]},'m2eval_'+k,state.evalDraft[k])}</article>`}).join('')}<p class="m2-muted">Respondidas: ${Object.keys(state.evalDraft).filter(k=>Number.isInteger(state.evalDraft[k])).length} de 16. Las respuestas se guardan mientras trabajas.</p>${state.evalBlock===3?`<div class="m2-lesson"><h4>Evidencias escritas para el facilitador</h4><label for="m2proof0">Explica por qué 2(x+3)=2x+6 es una identidad y x−9=3 es una ecuación.</label><textarea id="m2proof0" data-m2-proof="0">${escape(state.proof[0]||'')}</textarea><label for="m2proof1">Dos participantes transformaron 4x−5=1 de manera distinta. ¿Cómo comprobarías si sus ecuaciones son equivalentes? Justifica tu criterio y respeta la estrategia alternativa.</label><textarea id="m2proof1" data-m2-proof="1">${escape(state.proof[1]||'')}</textarea><p class="m2-muted">Estas respuestas requieren autoevaluación, coevaluación y heteroevaluación; no reciben puntuación automática.</p></div><div class="m2-action"><button type="button" id="m2submit">Entregar evaluación completa</button><button type="button" class="secondary" id="m2clear">Borrar respuestas no entregadas</button></div><div id="m2evalMsg" class="m2-feedback" hidden></div>`:''}${latest?report(latest):''}`}
function report(attempt){let scores=blocks.map((b,i)=>b.items.reduce((count,q,j)=>count+(attempt.answers[i*4+j]===q[3]?1:0),0));const levels=['Reconoce','Aplica','Analiza','Transfiere'];const levelScore=levels.map((_,j)=>blocks.reduce((sum,b,i)=>sum+(attempt.answers[i*4+j]===b.items[j][3]?1:0),0));return `<details class="m2-lesson" open><summary><b>Último intento: ${attempt.score} de 16 respuestas correctas</b></summary><p>Resultado formativo objetivo. Las evidencias escritas todavía requieren valoración docente.</p><table class="m2-table"><thead><tr><th>Bloque</th><th>Aciertos</th></tr></thead><tbody>${scores.map((x,i)=>`<tr><td>${escape(blocks[i].name)}</td><td>${x}/4</td></tr>`).join('')}</tbody></table><p><b>Por dificultad:</b> ${levels.map((l,i)=>`${l}: ${levelScore[i]}/4`).join(' · ')}</p><details><summary>Revisar las respuestas y explicaciones</summary>${blocks.map((b,i)=>`<h4>${escape(b.name)}</h4>${b.items.map((q,j)=>`<p><b>${escape(q[1])}</b><br>Tu respuesta: ${escape(q[2][attempt.answers[i*4+j]]||'Sin responder')} · Correcta: ${escape(q[2][q[3]])}<br><span class="m2-muted">${escape(q[4])}</span></p>`).join('')}`).join('')}</details><p class="m2-muted">Los bloques y los niveles son categorías de seguimiento pedagógico, no equivalen a la calificación oficial C1–C4. La interpretación de competencias requiere otras evidencias.</p></details>`}
const host=id('encuentro'),root=document.createElement('div');root.id='m2e1';root.hidden=true;root.innerHTML='<div class="m2-hero" id="m2hero"></div><p class="m2-muted">Tus respuestas se conservan en este navegador.</p><div class="m2-stage-nav" id="m2nav"></div><section class="m2-card" id="m2body" aria-live="polite"></section><div class="m2-controls"><button type="button" class="secondary" id="m2prev">← Paso anterior</button><button type="button" id="m2next">Siguiente paso →</button></div><p class="m2-muted">2 horas presenciales + 2 horas de autoestudio. Tiempos orientativos.</p>';
initStyles();host.querySelector('#backToList').closest('p').before(root);const otherCards=[...host.querySelectorAll(':scope > .card')];
const priorOpen=openEncounter;openEncounter=function(i,navigate=true,n=null){priorOpen(i,navigate,n);const match=id('encEyebrow').textContent.match(/Encuentro\s+(\d+)\s+de/);const isPilot=i===1&&Number(match?.[1])===1;root.hidden=!isPilot;otherCards.forEach(el=>{if(isPilot)el.hidden=true;else el.hidden=false});if(isPilot){draw();}};

const m2FormulaLatex=[
 '8+4=12',
 '3x+2y=16',
 String.raw`x-9=3\quad\mid\quad 2(x+3)=2x+6`,
 String.raw`4x-5=1\iff 4x=6`
];
let m2MathLoading=false;
function drawM2Formula(){
 const area=root.querySelector('[data-m2-math]');
 if(!area||typeof window.katex==='undefined')return;
 try{window.katex.render(m2FormulaLatex[Number(area.dataset.m2Math)],area,{throwOnError:false,displayMode:true,output:'htmlAndMathml'})}catch(_){}
}
function loadM2Formula(){
 if(window.katex){drawM2Formula();return}
 if(m2MathLoading)return;
 m2MathLoading=true;
 const css=document.createElement('link');css.rel='stylesheet';css.href='https://cdn.jsdelivr.net/npm/katex@0.16.25/dist/katex.min.css';document.head.appendChild(css);
 const js=document.createElement('script');js.src='https://cdn.jsdelivr.net/npm/katex@0.16.25/dist/katex.min.js';js.async=true;
 js.onload=drawM2Formula;js.onerror=()=>{m2MathLoading=false};document.head.appendChild(js);
}

function draw(){if(root.hidden)return;id('m2hero').innerHTML='<span class="m2-badge">P2 · Encuentro 1 de 10</span><h2>Igualdades, ecuaciones e identidades</h2><p>Aprenderás a distinguir igualdades, ecuaciones e identidades, comprobar soluciones y justificar transformaciones que conservan el equilibrio.</p><p>7 de noviembre de 2026 · Contenidos M2.01 y M2.02 · Libro oficial Módulo II, pp. 38–41</p>';id('m2nav').innerHTML=labels.map((name,i)=>`<button class="m2-stage" type="button" data-m2-stage="${i}" aria-current="${state.stage===i?'step':'false'}">${i+1}. ${name}</button>`).join('');id('m2body').innerHTML=[remember,contents,examplesPage,practice,assessment][state.stage]();id('m2prev').disabled=state.stage===0;id('m2next').textContent=state.stage===4?'Volver al inicio ↺':'Siguiente paso →';bind();if(state.stage===1)loadM2Formula()}
function step(n){state.stage=Math.max(0,Math.min(4,n));state.visited[state.stage]=true;save();draw();root.scrollIntoView({block:'start'})}
id('m2prev').onclick=()=>step(state.stage-1);id('m2next').onclick=()=>step(state.stage===4?0:state.stage+1);
function bind(){root.querySelectorAll('[data-m2-stage]').forEach(b=>b.onclick=()=>step(Number(b.dataset.m2Stage)));
root.querySelectorAll('[data-m2-select]').forEach(b=>b.onclick=()=>{const [name,n]=b.dataset.m2Select.split(':');if(name==='topic')state.topic=Number(n);if(name==='practice')state.practiceGroup=Number(n);if(name==='eval')state.evalBlock=Number(n);save();draw()});
if(state.stage===0){id('m2recall').oninput=e=>{state.recall=e.target.value;save()}}
if(state.stage===1){const t=state.topic,k=String(t);const radios=root.querySelectorAll('input[name="m2under_'+t+'"]');radios.forEach(r=>r.onchange=()=>{const rec=state.understanding[k]||{};rec.choice=Number(r.value);state.understanding[k]=rec;save()});const check=root.querySelector('[data-m2-check]');if(check)check.onclick=()=>{let r=state.understanding[k]||{};if(!Number.isInteger(r.choice)){r.feedback='Selecciona una respuesta.'}else r.feedback=r.choice===topics[t].a?'¡Correcto! '+topics[t].why:'Revisa la explicación: '+topics[t].why+' Puedes intentarlo otra vez.';state.understanding[k]=r;save();const div=id('m2feedback_'+t);div.hidden=false;div.className='m2-feedback '+(r.choice===topics[t].a?'ok':'bad');div.textContent=r.feedback};const hint=root.querySelector('[data-m2-hint]');if(hint)hint.onclick=()=>{const div=id('m2feedback_'+t);div.hidden=false;div.textContent='Pista: '+topics[t].tip};wireLabs(t)}
if(state.stage===3){const g=state.practiceGroup;questionsPractice.slice(g*3,g*3+3).forEach((q,j)=>{const k=g*3+j;root.querySelectorAll('input[name="m2pr_'+k+'"]')?.forEach(r=>r.onchange=()=>{state.prResponses[k]=Number(r.value);save()});const hint=root.querySelector('[data-m2-hint="'+k+'"]');if(hint)hint.onclick=()=>{const div=id('m2feedback_'+k);div.hidden=false;div.textContent='Pista: '+q[4]};const check=root.querySelector('[data-m2-check="'+k+'"]');if(check)check.onclick=()=>{const choice=state.prResponses[k];const prior=state.prAttempts[k]||{attempts:0};if(!Number.isInteger(choice)){prior.feedback='Selecciona una respuesta.'}else{prior.attempts++;prior.correct=choice===q[4];prior.feedback=prior.correct?'¡Correcto! '+q[5]:'Revisa: '+q[5]+' Puedes elegir otra opción.'}state.prAttempts[k]=prior;save();const d=id('m2feedback_'+k);d.hidden=false;d.className='m2-feedback '+(prior.correct?'ok':'bad');d.textContent=prior.feedback;id('m2body').querySelector('.m2-bar span').style.width=(questionsPractice.filter((_,i)=>state.prAttempts[i]?.correct).length*100/12)+'%'}});bindGuidedStudy()}
if(state.stage===4){const g=state.evalBlock;root.querySelectorAll('input[name^="m2eval_"]').forEach(inp=>inp.onchange=()=>{state.evalDraft[Number(inp.name.replace('m2eval_',''))]=Number(inp.value);save()});root.querySelectorAll('[data-m2-proof]').forEach(x=>x.oninput=()=>{state.proof[Number(x.dataset.m2Proof)]=x.value;save()});const sub=id('m2submit');if(sub)sub.onclick=()=>{const missing=Array.from({length:16},(_,i)=>i).filter(i=>!Number.isInteger(state.evalDraft[i]));const msg=id('m2evalMsg');if(missing.length){msg.hidden=false;msg.textContent='Faltan '+missing.length+' respuestas. Visita los cuatro bloques y completa las preguntas antes de entregar.';return}let score=0;blocks.forEach((block,i)=>block.items.forEach((q,j)=>{if(state.evalDraft[i*4+j]===q[3])score++}));state.evalAttempts.push({date:new Date().toISOString(),score,answers:{...state.evalDraft},proof:state.proof.slice()});state.evalDraft={};save();draw()};const clear=id('m2clear');if(clear)clear.onclick=()=>{state.evalDraft={};save();draw()}}
}
function wireLabs(t){if(t===0){id('m2balance').oninput=()=>{const n=Number(id('m2balance').value);id('m2balanceVal').textContent=n;id('m2left').textContent=10+n;const equal=n===4;id('m2balanceFeedback').textContent='10+'+n+'='+(10+n)+' kg y el otro lado tiene 14 kg. '+(equal?'La igualdad es verdadera: balanza equilibrada.':(10+n<14?'El lado izquierdo tiene menos masa.':'El lado izquierdo tiene más masa.'));id('m2beam').setAttribute('stroke',equal?'#278369':'#b87928')}}
if(t===1){const change=()=>{const x=Number(id('m2x').value),y=Number(id('m2y').value),v=3*x+2*y;id('m2xval').textContent=x;id('m2yval').textContent=y;id('m2subFeedback').textContent='3('+x+')+2('+y+')='+v+'. '+(v===16?'Es verdadera: coincide con 16.':'Es falsa para estos valores: no coincide con 16.')};id('m2x').oninput=change;id('m2y').oninput=change}
if(t===2){
 const explore=()=>{
  const choice=id('m2type').value,x=Number(id('m2tryx').value);id('m2tryxvalue').textContent=x;
  let msg='';
  if(choice==='a')msg='Con x='+x+': '+x+'−9='+(x-9)+'. '+(x===12?'La ecuación es verdadera.':'La ecuación es falsa para este valor. Solo x=12 es solución.');
  if(choice==='b')msg='Con x='+x+': 2('+(x+3)+')='+(2*(x+3))+' y 2('+x+')+6='+(2*x+6)+'. Coinciden. La propiedad distributiva demuestra la identidad para cualquier x.';
  if(choice==='c')msg='5+4=9 y 9 no es 10. Esta igualdad es falsa, independientemente del valor de x.';
  id('m2typeFeedback').textContent=msg;
 };id('m2type').onchange=explore;id('m2tryx').oninput=explore;explore();
}
if(t===3){root.querySelectorAll('[data-m2-transform]').forEach(b=>b.onclick=()=>{id('m2transformResult').textContent=({add:'Sumar 5 a ambos miembros: 4x−5+5=1+5, luego 4x=6. Solución: x=1.5.',mult:'Multiplicar ambos miembros por 4: 16x−20=4. Solución: x=1.5.',invalid:'Incorrecto: sumar solo a un miembro rompe el equilibrio y no conserva las soluciones.'})[b.dataset.m2Transform]})}}
const previousRecords=drawRecords;drawRecords=function(){previousRecords();const panel=document.createElement('div');panel.className='card';panel.innerHTML='<h3>Módulo II · Encuentro 1</h3><p id="m2record"></p><button type="button" class="secondary" id="m2return">Abrir el encuentro de igualdades y ecuaciones</button>';id('recordsHistory').prepend(panel);const l=state.evalAttempts.at(-1),p=questionsPractice.filter((_,i)=>state.prAttempts[i]?.correct).length;panel.querySelector('#m2record').textContent='Prácticas logradas: '+p+'/12. '+(l?'Última evaluación: '+l.score+'/16. Intentos: '+state.evalAttempts.length+'.':'Aún no has entregado la evaluación.')+' Los resultados son formativos, no notas oficiales.';panel.querySelector('#m2return').onclick=()=>openEncounter(1,true,0)};
window.EPJA_M2_E01={open:()=>openEncounter(1,true,0),status:()=>({practice:questionsPractice.filter((_,i)=>state.prAttempts[i]?.correct).length,evalAttempts:state.evalAttempts.length}),verify:()=>({topics:topics.length,examples:examples.length,practice:questionsPractice.length,evaluation:blocks.reduce((n,b)=>n+b.items.length,0),blocks:blocks.length})};
})();