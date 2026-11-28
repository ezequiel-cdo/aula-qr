/* AulaQR P4-J07. MINERD módulo IV pp.50–51. */
(()=>{'use strict';
const E=(tag,t)=>{const n=document.createElement(tag);if(t!==undefined)n.textContent=t;return n};
const add=(r,tag,t)=>{const n=E(tag,t);r.append(n);return n};
const btn=(r,t,f)=>{const b=add(r,'button',t);b.type='button';b.onclick=f;return b};
const math=(r,t)=>add(r,'p','\\('+t+'\\)');
const heading=(r,t)=>add(r,'h3',t);
let quizSeq=0;function quiz(root,qs,final=false){const prefix='a4p4j07q'+(++quizSeq)+'-';let answers=new Map(),groups=[],feedback=[];const box=add(root,'div');qs.forEach((q,i)=>{const f=add(box,'fieldset');f.style.cssText='border:1px solid #d5e0ef;border-radius:10px;margin:12px 0;padding:12px;min-width:0';add(f,'legend',(i+1)+'. '+q[0]);let inputs=[];q[1].forEach((o,j)=>{const l=add(f,'label');l.style.cssText='display:flex;gap:10px;align-items:center;padding:8px 0';const x=add(l,'input');x.type='radio';x.name=prefix+i;x.value=j;l.append(document.createTextNode(o));inputs.push(x);x.onchange=()=>{answers.set(i,j);if(!final)feedback[i].textContent=(j===q[2]?'Correcto. ':'Revisa. ')+q[3];if(submit)submit.disabled=answers.size!==qs.length}});const p=add(f,'p','');p.setAttribute('aria-live','polite');feedback.push(p);groups.push(inputs)});let submit=null;if(final){const result=add(box,'p','');result.setAttribute('role','status');submit=btn(box,'Finalizar evaluación formativa',()=>{let score=0;qs.forEach((q,i)=>{const ok=answers.get(i)===q[2];if(ok)score++;feedback[i].textContent=(ok?'Correcto. ':'Respuesta: '+q[1][q[2]]+'. ')+q[3]+' · '+q[4];groups[i].forEach(x=>x.disabled=true)});result.textContent=score+'/'+qs.length+' respuestas correctas. '+(score>=Math.ceil(qs.length*.75)?'Buen avance; revisa tus errores.':'Repasa conceptos y vuelve a practicar.')+' Resultado formativo, no nota oficial.';submit.disabled=true});submit.disabled=true;btn(box,'Reintentar',()=>{box.remove();quiz(root,qs,true)})}}
function slider(r,t,min,max,v,fn){const l=add(r,'label',t+' ');l.style.display='block';const out=add(l,'output',v);const x=add(l,'input');x.type='range';x.min=min;x.max=max;x.value=v;x.style.cssText='width:100%;display:block';x.oninput=()=>{out.textContent=x.value;fn(+x.value)};return x}
function graphic(r){const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 340 230');s.setAttribute('role','img');s.style.cssText='width:100%;max-width:540px;display:block;margin:auto';r.append(s);return s}
function shape(s,tag,attrs,t){const n=document.createElementNS(s.namespaceURI,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));if(t)n.textContent=t;s.append(n)}
function point(s,x,y,t){shape(s,'circle',{cx:x,cy:y,r:4,fill:'#2177a8'});shape(s,'text',{x:x+8,y:y-8,fill:'#20365f','font-size':13},t)}
function subtopics(root,items){
 const nav=add(root,'div');nav.style.cssText='display:flex;flex-wrap:wrap;gap:8px;margin:12px 0';nav.setAttribute('role','group');nav.setAttribute('aria-label','Subtemas');
 const status=add(root,'p');status.setAttribute('aria-live','polite');status.className='small muted';
 const body=add(root,'div'),panels=items.map(([title,render])=>{const p=add(body,'section');p.style.cssText='padding:8px 0';heading(p,title);render(p);return p});
 const buttons=items.map(([title],i)=>btn(nav,title,()=>go(i)));let active=0;
 const controls=add(root,'div');controls.style.cssText='display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;margin:16px 0';
 const prev=btn(controls,'← Subtema anterior',()=>go(active-1)),next=btn(controls,'Siguiente subtema →',()=>go(active+1));
 function go(i){if(i<0||i>=items.length)return;active=i;panels.forEach((p,j)=>p.hidden=j!==i);buttons.forEach((b,j)=>{b.className=i===j?'':'secondary';b.setAttribute('aria-pressed',String(i===j))});status.textContent='Subtema '+(i+1)+' de '+items.length+' · '+items[i][0];prev.disabled=i===0;next.disabled=i===items.length-1;if(window.MathJax?.typesetPromise)window.MathJax.typesetPromise([panels[i]]).catch(()=>{});}
 go(0);
}
function figure(r,title,draw,caption){const f=add(r,'figure');f.style.cssText='margin:16px 0;padding:12px;border:1px solid #d5e0ef;border-radius:12px;background:#f8fbff';const s=graphic(f);s.setAttribute('aria-label',title);draw(s);const c=add(f,'figcaption',caption);c.className='small muted';}
function seg(s,a,b,color='#2177a8',dash=''){shape(s,'line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],stroke:color,'stroke-width':2,'stroke-dasharray':dash})}
function label(s,x,y,t,color='#20365f'){shape(s,'text',{x,y,fill:color,'font-size':13},t)}
function poly(s,ps){shape(s,'polygon',{points:ps.map(p=>p.join(',')).join(' '),fill:'#51ade022',stroke:'#2177a8','stroke-width':2})}
function arc(s,p,u,v,rad,color='#c47717'){let a=Math.atan2(u[1]-p[1],u[0]-p[0]),b=Math.atan2(v[1]-p[1],v[0]-p[0]);let d=(b-a+2*Math.PI)%(2*Math.PI);if(d>Math.PI){[a,b]=[b,a];d=2*Math.PI-d}shape(s,'path',{d:'M'+(p[0]+rad*Math.cos(a))+' '+(p[1]+rad*Math.sin(a))+' A'+rad+' '+rad+' 0 0 1 '+(p[0]+rad*Math.cos(a+d))+' '+(p[1]+rad*Math.sin(a+d)),stroke:color,'stroke-width':2,fill:'none'});}























const pi=Math.PI,rad=a=>a*pi/180,deg=a=>a*180/pi,sin=a=>Math.sin(rad(a)),cos=a=>Math.cos(rad(a)),fmt=x=>Number(x.toFixed(4)).toString(),clamp=x=>Math.max(-1,Math.min(1,x));
function sas(b,c,A){const a=Math.hypot(c-b*cos(A),b*sin(A)),B=deg(Math.atan2(b*sin(A),c-b*cos(A)));return {a,b,c,A,B,C:180-A-B}}
function asa(c,A,B){const C=180-A-B;return C>0&&A>0&&B>0&&c>0?{a:c*sin(A)/sin(C),b:c*sin(B)/sin(C),c,A,B,C}:null}
function sss(a,b,c){if(Math.min(a,b,c)<=0||a+b<=c||a+c<=b||b+c<=a)return null;const A=deg(Math.acos(clamp((b*b+c*c-a*a)/(2*b*c)))),B=deg(Math.acos(clamp((a*a+c*c-b*b)/(2*a*c))));return {a,b,c,A,B,C:180-A-B}}
function ssa(a,b,A){if(a<=0||b<=0||A<=0||A>=180)return [];const u=b*sin(A)/a;if(u>1+1e-12)return [];const B=Math.abs(u-1)<1e-12?90:deg(Math.asin(clamp(u)));return [...new Set([B,180-B])].filter(B=>B>0&&180-A-B>1e-9).map(B=>({a,b,c:a*sin(180-A-B)/sin(A),A,B,C:180-A-B}))}
function summary(q){return q?'a='+fmt(q.a)+'; b='+fmt(q.b)+'; c='+fmt(q.c)+'; A='+fmt(q.A)+'°; B='+fmt(q.B)+'°; C='+fmt(q.C)+'°.':'No existe triángulo válido.'}
function draw(s,q){s.replaceChildren();if(!q){label(s,55,110,'No existe triángulo válido');return}const ps=[[0,0],[q.c,0],[q.b*cos(q.A),q.b*sin(q.A)]],xs=ps.map(p=>p[0]),min=Math.min(...xs),max=Math.max(...xs),K=Math.min(235/(max-min),145/ps[2][1]),P=ps.map(([x,y])=>[170+(x-(min+max)/2)*K,190-y*K]);poly(s,P);P.forEach((p,i)=>{point(s,...p,'ABC'[i]);arc(s,p,P[(i+1)%3],P[(i+2)%3],12);const u=P[(i+1)%3],v=P[(i+2)%3];label(s,(u[0]+v[0])/2-10,(u[1]+v[1])/2-8,'abc'[i]+'='+fmt(q['abc'[i]]))});s.setAttribute('aria-label',summary(q))}
function lab(r,m){const titles={sas:'LAL: dos lados y ángulo comprendido',asa:'ALA: dos ángulos y un lado',sss:'LLL: tres lados',ssa:'LLA: caso ambiguo'};heading(r,titles[m]);let a=m==='ssa'?7:5,b=m==='ssa'?10:2,c=3,A=30,B=45;const s=graphic(r),s2=graphic(r),o=add(r,'p');o.setAttribute('role','status');if(m==='sss'||m==='ssa')slider(r,'Lado a',1,15,a,v=>{a=v;paint()});if(m!=='asa')slider(r,'Lado b',1,15,b,v=>{b=v;paint()});if(m!=='ssa')slider(r,'Lado c',1,15,c,v=>{c=v;paint()});if(m!=='sss')slider(r,'Ángulo A (°)',10,170,A,v=>{A=v;paint()});if(m==='asa')slider(r,'Ángulo B (°)',10,170,B,v=>{B=v;paint()});function paint(){const list=m==='ssa'?ssa(a,b,A):[m==='sas'?sas(b,c,A):m==='asa'?asa(c,A,B):sss(a,b,c)].filter(Boolean);draw(s,list[0]);s2.hidden=list.length!==2;if(list.length===2)draw(s2,list[1]);o.textContent=list.length+' solución(es). '+(list.map(summary).join(' | ')||'Revisa existencia y datos.')+(m==='ssa'?' sen B='+fmt(b*sin(A)/a):'')}paint();math(r,m==='sas'?'a^2=b^2+c^2-2bc\\cos A':m==='sss'?'\\cos A=\\frac{b^2+c^2-a^2}{2bc}':m==='ssa'?'\\operatorname{sen} B=\\frac{b\\operatorname{sen} A}{a}':'\\frac a{\\operatorname{sen} A}=\\frac b{\\operatorname{sen} B}=\\frac c{\\operatorname{sen} C}');add(r,'p',m==='ssa'?'Si sen B>1 no existe triángulo. Prueba B y 180°−B, conserva solo A+B<180°. Si B=90°, las dos opciones coinciden.':'Comprueba suma angular de 180°, lados positivos y desigualdad triangular.')}
function authentic(r){heading(r,'Ejemplos y actividades pp.50–51');figure(r,'Ejemplo 1',s=>draw(s,asa(sin(105)/sin(30),30,45)),'A=30°, B=45°, a=1 según la operación impresa. b=√2≈1.4142; C=105°.');math(r,'b=\\frac{\\operatorname{sen}45^\\circ}{\\operatorname{sen}30^\\circ}=\\sqrt2');figure(r,'Ejemplo 2 corregido',s=>draw(s,sas(2,3,30)),'b=2, c=3, A=30°. a≈1.6148, no 2.61 como figura en el texto.');math(r,'a=\\sqrt{13-6\\sqrt3}');add(r,'p','Actividad p.51: A=30°, B=45°, C=105°. La longitud del lado dado en la figura no está confirmada: consulta la imagen impresa antes de hallar a.');add(r,'p','Lados 13 y 10, ángulo de 115° opuesto a 10: imposible. El mayor ángulo debe oponerse al mayor lado; 13 sen115°/10≈1.1782>1.');add(r,'p','Rampa especial: recupera a,c,A de la figura impresa; no disponibles en la extracción textual. Usa LLA intercambiando b y c y sus ángulos. No constituye especificación de construcción.')}
function pencils(r){heading(r,'Experimento de los dos lápices · p.51');let b=12,c=15,A=60;const s=graphic(r),o=add(r,'p');slider(r,'Lápiz 1 (cm)',5,20,b,v=>{b=v;paint()});slider(r,'Lápiz 2 (cm)',5,20,c,v=>{c=v;paint()});slider(r,'Ángulo comprendido (°)',10,170,A,v=>{A=v;paint()});function paint(){const q=sas(b,c,A);draw(s,q);o.textContent='Separación de extremos: '+fmt(q.a)+' cm.'}paint();add(r,'p','Coloca los lápices con extremo común, mide longitudes y ángulo, calcula separación y verifica con regla. Si el lado buscado se llama c, renombra el ángulo comprendido C y usa c²=a²+b²−2ab cos C. Registra diferencia absoluta y explica errores de medición.')}
function triangulation(r){heading(r,'Proyecto IV · Distancia inaccesible');let c=20,A=55,B=65;const s=graphic(r),o=add(r,'p');slider(r,'Base AB (m)',5,50,c,v=>{c=v;paint()});slider(r,'Ángulo A (°)',10,80,A,v=>{A=v;paint()});slider(r,'Ángulo B (°)',10,80,B,v=>{B=v;paint()});function paint(){const q=asa(c,A,B);draw(s,q);o.textContent='AC='+fmt(q.b)+' m; BC='+fmt(q.a)+' m; distancia perpendicular a recta AB='+fmt(q.b*sin(A))+' m.'}paint();add(r,'p','Datos hipotéticos. Selecciona dos puntos seguros, mide base y ángulos hacia un objetivo común; repite, registra unidades y contrasta. No cruces zonas peligrosas. Continúa investigación de mareas p.51: usa datos documentados o modelo hipotético identificado, formula una conjetura y contrasta con los datos.')}
function numeric(r){let m=0,b=8,c=10,A=60,B=45;const q=add(r,'p'),l=add(r,'label','Respuesta '),x=add(l,'input'),o=add(r,'p');x.type='number';x.step='any';['Lado por cosenos','Ángulo por cosenos','Lado por senos','Ángulo restante','Número de soluciones LLA'].forEach((z,i)=>btn(r,z,()=>{m=i;paint()}));function paint(){q.textContent=['b='+b+', c='+c+', A='+A+'°: hallar a.','a=5, b='+b+', c='+c+': hallar A (°).','c='+c+', A='+A+'°, B='+B+'°: hallar a.','A='+A+'°, B='+B+'°: hallar C.','a='+b+', b='+c+', A='+A+'°: número de triángulos posibles.'][m]+' Redondea a dos decimales.';x.value='';o.textContent=''}btn(r,'Comprobar',()=>{if(!x.value.trim()){o.textContent='Escribe una respuesta.';return}const e=[sas(b,c,A).a,sss(5,b,c).A,asa(c,A,B).a,180-A-B,ssa(b,c,A).length][m];o.textContent=(Math.abs(+x.value-e)<=.00500001?'Correcto. ':'Revisa. ')+['√(b²+c²−2bc cos A)','arccos((b²+c²−a²)/(2bc))','c sen A/sen C','180°−A−B','Prueba ambos ángulos suplementarios'][m]+' = '+fmt(e)});btn(r,'Otro ejercicio',()=>{b=6+Math.floor(Math.random()*5);c=b+1+Math.floor(Math.random()*3);A=[30,45,60,75][Math.floor(Math.random()*4)];B=30+Math.floor(Math.random()*4)*10;paint()});paint()}
const qs=[['El lado a se opone a:',['A','B','C'],0,'Convención de notación.','IL-9'],['Dos ángulos y un lado:',['Pitágoras siempre','Ley de senos','No se puede'],1,'ALA o AAL.','IL-9'],['Dos lados y ángulo comprendido:',['Solo seno','Solo tangente','Ley de cosenos'],2,'LAL.','IL-9'],['b=2,c=3,A=30°: a≈',['1.6148','2.61','5'],0,'√(13−6√3).','IL-9'],['A=30°, B=45°, a=1: b',['0.5','√2','2'],1,'Ley de senos.','IL-9'],['Lado 10 opuesto a 115°, otro lado 13:',['Dos soluciones','Una solución','Ninguna'],2,'El mayor ángulo se opone al mayor lado.','IL-10'],['Caso LLA puede tener:',['0, 1 o 2 soluciones','Siempre 1','Siempre 2'],0,'Comprueba ambos ángulos.','IL-10'],['a=7,b=10,A=30°: soluciones',['Una','Dos','Ninguna'],1,'sen B=5/7; ambos ángulos son válidos.','IL-9'],['Tres lados 2,3,6:',['Válido','Rectángulo','No válido'],2,'2+3<6.','IL-10'],['Si A=90°, ley de cosenos:',['Pitágoras','Ley de senos solamente','No definida'],0,'cos90°=0.','IL-9'],['Base AB conocida y ángulos A,B:',['No basta','Permite calcular AC y BC','Solo permite hallar área'],1,'Ley de senos.','IL-10'],['En una medición real:',['Inventar datos','Omitir unidades','Repetir y contrastar'],2,'Verifica incertidumbre.','IL-13'],['Para verificar con software:',['Contrastar ángulos y lados','Solo mirar','Cambiar datos'],0,'Verificación independiente.','IL-13'],['En el proyecto de mareas:',['Todo modelo es exacto','Contrastar con datos y declarar supuestos','Usar como pronóstico seguro'],1,'Modelo educativo.','IL-13']];
function rubric(r){heading(r,'Rúbrica interactiva');const lv=['Reconoce','Aplica','Analiza','Transfiere y justifica'],cs=[['Leyes trigonométricas','Identifico lados y ángulos.','Aplico una ley.','Selecciono la ley según datos.','Justifico soluciones y caso ambiguo.','IL-9'],['Modelado geométrico','Reconozco triángulos.','Represento datos.','Verifico existencia y medidas.','Modelo distancias y explico supuestos.','IL-10'],['Tecnología','Reconozco recursos.','Uso calculadora.','Contrasto simulador y cálculo.','Verifico resultados independientemente.','IL-13'],['Colaboración y aplicación','Identifico una situación.','Registro mediciones.','Comparo procedimientos.','Argumento límites y respeto aportes.','IL-10 / IL-13']];const ss=cs.map(c=>{const f=add(r,'fieldset');add(f,'legend',c[0]);const s=add(f,'select');s.append(new Option('Selecciona nivel',''));lv.forEach((v,i)=>s.append(new Option((i+1)+' · '+v,String(i))));c.slice(1,5).forEach((t,i)=>add(f,'p',(i+1)+' · '+t));add(f,'p',c[5]);return s});const o=add(r,'div'),b=btn(r,'Ver perfil',()=>{o.replaceChildren();cs.forEach((c,i)=>add(o,'p',c[0]+': '+lv[+ss[i].value]+' — '+c[1+Number(ss[i].value)]));add(o,'p','Registra una mejora; contrasta con compañero y docente. Sin nota oficial.')});b.disabled=true;ss.forEach(s=>s.onchange=()=>{b.disabled=ss.some(x=>x.value==='');o.replaceChildren()});btn(r,'Reiniciar',()=>{ss.forEach(s=>s.value='');b.disabled=true;o.replaceChildren()})}
const screens=[r=>{heading(r,'¿Cómo medir una distancia inaccesible?');triangulation(r);quiz(r,qs.slice(0,3))},r=>subtopics(r,[['Notación y ley de senos',p=>lab(p,'asa')],['Ley de cosenos LAL',p=>lab(p,'sas')],['Ley de cosenos LLL',p=>lab(p,'sss')],['Caso ambiguo LLA',p=>lab(p,'ssa')],['Experimento instrumental',pencils],['Triangulación',triangulation]]),r=>subtopics(r,[['Ejemplos curriculares',authentic],['Caso ambiguo',p=>lab(p,'ssa')],['Lápices',pencils],['Distancias',triangulation]]),r=>subtopics(r,[['Reconocer',p=>quiz(p,qs.slice(0,8))],['Aplicar',numeric],['Construir y verificar',p=>{pencils(p);add(p,'p','GeoGebra: A=(0,0), B=(3,0), C=(2*cos(30°),2*sin(30°)), Polygon(A,B,C), Distance(B,C). Comprueba el ejemplo corregido. Sin conexión: regla, transportador y calculadora.')}],['Transferir',triangulation],['Autoestudio',p=>add(p,'p','120 min: 30 lectura pp.50–51; 50 resolución de casos, experimento de lápices y triangulación; 40 contraste, investigación de mareas, coevaluación y autoevaluación. Conserva evidencias manuscritas identificadas.')]]),r=>{heading(r,'Evaluación formativa');quiz(r,qs,true);rubric(r)}];
window.A4Lessons=Object.freeze({...window.A4Lessons,'P4-J07':function(root){root.replaceChildren();const tabs=add(root,'div');tabs.style.cssText='display:flex;flex-wrap:wrap;gap:8px;margin:12px 0';tabs.setAttribute('role','group');tabs.setAttribute('aria-label','Pantallas pedagógicas');const content=add(root,'div');const labels=['¿Qué sabemos?','Contenidos','Ejemplos','Práctica','Evaluación'];let active=0;const panels=screens.map((fn,i)=>{const p=E('div');p.className='card';p.hidden=i!==0;add(p,'h2',labels[i]);fn(p);content.append(p);return p});const buttons=labels.map((t,i)=>btn(tabs,(i+1)+' · '+t,()=>go(i)));const controls=add(root,'div');controls.style.cssText='display:flex;justify-content:space-between;gap:8px';const prev=btn(controls,'← Anterior',()=>go(active-1)),next=btn(controls,'Siguiente →',()=>go(active+1));function go(i){if(i<0||i>4)return;active=i;panels.forEach((p,j)=>p.hidden=j!==i);buttons.forEach((b,j)=>{b.className=j===i?'':'secondary';b.setAttribute('aria-pressed',String(j===i))});prev.disabled=i===0;next.disabled=i===4;if(window.MathJax?.typesetPromise)window.MathJax.typesetPromise([panels[i]]).catch(()=>{}); }go(0)}});


























})();