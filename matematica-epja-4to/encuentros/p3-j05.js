/* AulaQR P3-J05. MINERD módulo III pp.48–49. */
(()=>{'use strict';
const E=(tag,t)=>{const n=document.createElement(tag);if(t!==undefined)n.textContent=t;return n};
const add=(r,tag,t)=>{const n=E(tag,t);r.append(n);return n};
const btn=(r,t,f)=>{const b=add(r,'button',t);b.type='button';b.onclick=f;return b};
const math=(r,t)=>add(r,'p','\\('+t+'\\)');
const heading=(r,t)=>add(r,'h3',t);
let quizSeq=0;function quiz(root,qs,final=false){const prefix='a4p3j05q'+(++quizSeq)+'-';let answers=new Map(),groups=[],feedback=[];const box=add(root,'div');qs.forEach((q,i)=>{const f=add(box,'fieldset');f.style.cssText='border:1px solid #d5e0ef;border-radius:10px;margin:12px 0;padding:12px;min-width:0';add(f,'legend',(i+1)+'. '+q[0]);let inputs=[];q[1].forEach((o,j)=>{const l=add(f,'label');l.style.cssText='display:flex;gap:10px;align-items:center;padding:8px 0';const x=add(l,'input');x.type='radio';x.name=prefix+i;x.value=j;l.append(document.createTextNode(o));inputs.push(x);x.onchange=()=>{answers.set(i,j);if(!final)feedback[i].textContent=(j===q[2]?'Correcto. ':'Revisa. ')+q[3];if(submit)submit.disabled=answers.size!==qs.length}});const p=add(f,'p','');p.setAttribute('aria-live','polite');feedback.push(p);groups.push(inputs)});let submit=null;if(final){const result=add(box,'p','');result.setAttribute('role','status');submit=btn(box,'Finalizar evaluación formativa',()=>{let score=0;qs.forEach((q,i)=>{const ok=answers.get(i)===q[2];if(ok)score++;feedback[i].textContent=(ok?'Correcto. ':'Respuesta: '+q[1][q[2]]+'. ')+q[3]+' · '+q[4];groups[i].forEach(x=>x.disabled=true)});result.textContent=score+'/'+qs.length+' respuestas correctas. '+(score>=Math.ceil(qs.length*.75)?'Buen avance; revisa tus errores.':'Repasa conceptos y vuelve a practicar.')+' Resultado formativo, no nota oficial.';submit.disabled=true});submit.disabled=true;btn(box,'Reintentar',()=>{box.remove();quiz(root,qs,true)})}}
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



















const fmt=x=>Number(x.toFixed(4)).toString(),eps=1e-8;
function classify(R,r,d){if(d<eps)return Math.abs(R-r)<eps?6:5;if(d>R+r+eps)return 0;if(Math.abs(d-R-r)<eps)return 1;if(d>Math.abs(R-r)+eps)return 2;if(Math.abs(d-Math.abs(R-r))<eps)return 3;return 4}
const names=['Exteriores','Tangentes exteriores','Secantes','Tangentes interiores','Interiores no concéntricas','Concéntricas distintas','Coincidentes'],counts=['0','1','2','1','0','0','Infinitos'];
const rules=['d > R+r','d = R+r','|R−r| < d < R+r','d = |R−r| > 0','0 < d < |R−r|','d=0, R≠r','d=0, R=r'];
function intersections(R,r,d){const c=classify(R,r,d);if(![1,2,3].includes(c))return [];const x=(R*R-r*r+d*d)/(2*d),y=Math.sqrt(Math.max(0,R*R-x*x));return c===2?[[x,y],[x,-y]]:[[x,0]]}
function circle(s,p,R,stroke='#2177a8',fill='none'){shape(s,'circle',{cx:p[0],cy:p[1],r:R,stroke,fill,'stroke-width':2})}
function fit(circles){const minX=Math.min(...circles.map(c=>c[0]-c[2])),maxX=Math.max(...circles.map(c=>c[0]+c[2])),minY=Math.min(...circles.map(c=>c[1]-c[2])),maxY=Math.max(...circles.map(c=>c[1]+c[2])),k=Math.min(275/(maxX-minX),170/(maxY-minY));return {k,T:p=>[170+(p[0]-(minX+maxX)/2)*k,110-(p[1]-(minY+maxY)/2)*k]}}
function pair(s,R,r,d,show=true){s.replaceChildren();const {k,T}=fit([[0,0,R],[d,0,r]]),A=T([0,0]),B=T([d,0]);circle(s,A,R*k,'#2177a8','#51ade016');circle(s,B,r*k,'#c47717','#d9770616');seg(s,A,B,'#64748b','4 3');seg(s,A,T([0,R]),'#2177a8');seg(s,B,T([d,-r]),'#c47717');if(d<eps)point(s,...A,'A=B');else{point(s,...A,'A');point(s,...B,'B')}if(show)intersections(R,r,d).forEach((p,i)=>point(s,...T(p),i?'Q':'P'));label(s,14,218,'R='+fmt(R)+'; r='+fmt(r)+'; d='+fmt(d));}
function range(root,t,min,max,v,step,fn){const x=slider(root,t,min,max,v,fn);x.step=step;return x}
function explorer(root){heading(root,'Dos centros móviles · predice y comprueba');let R=5,r=3,d=6,show=false;const s=graphic(root),o=add(root,'p');o.setAttribute('role','status');const inputs=[];const presets=[[5,3,10],[5,3,8],[5,3,6],[5,3,2],[5,3,1],[5,3,0],[5,5,0]];function set(v){[R,r,d]=v;inputs.forEach((x,i)=>{x.value=v[i];x.previousElementSibling.textContent=v[i]});show=false;paint()}inputs.push(range(root,'Radio A (cm)',1,10,R,.5,v=>{R=v;show=false;paint()}),range(root,'Radio B (cm)',1,10,r,.5,v=>{r=v;show=false;paint()}),range(root,'Distancia entre centros (cm)',0,22,d,.5,v=>{d=v;show=false;paint()}));names.forEach((t,i)=>btn(root,t,()=>set(presets[i])));btn(root,'Comprobar clasificación',()=>{show=!show;paint()});function paint(){pair(s,R,r,d,show);const c=classify(R,r,d);o.textContent='R+r='+fmt(R+r)+'; |R−r|='+fmt(Math.abs(R-r))+'; d='+fmt(d)+'. '+(show?names[c]+' · '+rules[c]+' · puntos comunes: '+counts[c]+'.':'Predice la posición y los puntos comunes.');s.setAttribute('aria-label',o.textContent)}paint();math(root,'|R-r|\\le d\\le R+r');add(root,'p','La desigualdad caracteriza existencia de intersección, salvo que la coincidencia tenga infinitos puntos. Se distinguen seis posiciones habituales y, como caso límite adicional, circunferencias coincidentes. Circunferencias son fronteras, no discos.')}
function gallery(root){heading(root,'Clasificación argumentada');[[5,3,10],[5,3,8],[5,3,6],[5,3,2],[5,3,1],[5,3,0],[5,5,0]].forEach((v,i)=>figure(root,names[i],s=>pair(s,...v),names[i]+' · '+rules[i]+' · '+counts[i]+' puntos comunes.'))}
function proof(root){heading(root,'¿Pueden existir exactamente tres puntos comunes?');const s=graphic(root);pair(s,5,3,6);math(root,'x^2+y^2=R^2');math(root,'(x-d)^2+y^2=r^2');math(root,'2dx=R^2-r^2+d^2');add(root,'p','Si d>0, al restar ecuaciones se obtiene una única coordenada x. Al sustituir, y²=R²−x² admite cero, una o dos soluciones reales. Si d=0, radios distintos no se cortan; iguales coinciden. Por tanto, exactamente tres puntos comunes es imposible. Otra vía: tres puntos no colineales determinan una única circunferencia.');math(root,'x=\\frac{R^2-r^2+d^2}{2d},\\quad y=\\pm\\sqrt{R^2-x^2}')}
function tangent(root){heading(root,'Alineación de centros y punto de tangencia');let R=5,r=3,m=0;const s=graphic(root),o=add(root,'p');range(root,'Radio A',1,10,R,1,v=>{R=v;paint()});range(root,'Radio B',1,10,r,1,v=>{r=v;paint()});btn(root,'Tangencia exterior',()=>{m=0;paint()});btn(root,'Tangencia interior',()=>{m=1;paint()});function paint(){const d=m?Math.abs(R-r):R+r;pair(s,R,r,d);o.textContent=m&&R===r?'Radios iguales y d=0: coincidencia, no tangencia.':'d='+d+'; A, B y P están alineados. '+(m?'AP y BP tienen igual dirección desde P.':'P está entre A y B.')}paint();add(root,'p','Por igualdad en la desigualdad triangular, los tres puntos están alineados. En tangencia exterior d=R+r; en interior d=|R−r|>0. Construye con regla y compás y comprueba.')}
function triple(root){heading(root,'Tres circunferencias · ¿Es transitiva la tangencia?');let a=120;const s=graphic(root),o=add(root,'p');range(root,'Ángulo entre los centros exteriores visto desde B (°)',0,180,a,5,v=>{a=v;paint()});btn(root,'Caso de tres tangencias',()=>{a=60;const x=root.querySelector('input[type=range]');x.value=a;x.previousElementSibling.textContent=a;paint()});function paint(){s.replaceChildren();const A=[4,0],B=[0,0],C=[4*Math.cos(a*Math.PI/180),4*Math.sin(a*Math.PI/180)],v=[A,B,C],d=Math.hypot(A[0]-C[0],A[1]-C[1]),{k,T}=fit(v.map(p=>[...p,2]));v.forEach((p,i)=>{circle(s,T(p),2*k,['#2177a8','#16805d','#c47717'][i],'none');point(s,...T(p),['A','B','C'][i])});seg(s,T(A),T(B),'#64748b','4 3');seg(s,T(B),T(C),'#64748b','4 3');seg(s,T(A),T(C),'#64748b','4 3');o.textContent='AB=BC=4; AC='+fmt(d)+'. C1 tangente a C2 y C2 a C3. C1 y C3: '+names[classify(2,2,d)]+'.'}paint();math(root,'AC=8\\sin(\\alpha/2)');add(root,'p','Contraejemplo: ángulo 180°, AC=8>4: C1 y C3 exteriores. A 60° son tangentes. Por tanto, la tangencia no es transitiva. Construye los dos casos con compás, regla y transportador.')}
function field(root){heading(root,'Campo magnético · circunferencias concéntricas');let n=4;const s=graphic(root);range(root,'Número de líneas esquemáticas',2,7,n,1,paint);function paint(v=n){n=v;s.replaceChildren();for(let i=1;i<=n;i++)circle(s,[170,110],90*i/n,'#2177a8');point(s,170,110,'O');shape(s,'circle',{cx:170,cy:110,r:2,fill:'#20365f'});label(s,12,220,'Vista perpendicular al conductor')}paint();add(root,'p','En el modelo ideal de un conductor recto largo, las líneas de campo en un plano perpendicular son circunferencias concéntricas de radios distintos. No es una medición de intensidad ni una guía para experimentar con corriente eléctrica.')}
function pulley(root){heading(root,'Poleas · separación y contacto');let R=5,r=3,d=10;const s=graphic(root),o=add(root,'p');range(root,'Radio mayor',2,8,R,1,v=>{R=v;paint()});range(root,'Radio menor',1,6,r,1,v=>{r=v;paint()});range(root,'Distancia entre ejes',0,20,d,.5,v=>{d=v;paint()});function paint(){pair(s,R,r,d);o.textContent=names[classify(R,r,d)]+' · separación exterior d−(R+r)='+fmt(d-R-r)+'.'}paint();add(root,'p','Las ruedas de poleas coplanares separadas suelen representarse mediante circunferencias exteriores; una correa puede vincularlas sin que se toquen. Consulta la figura original p.49. El modelo no valida un mecanismo real ni sus holguras.')}
function thermal(root){heading(root,'Termografía · regiones idealizadas');let d=6;const s=graphic(root),o=add(root,'p');range(root,'Distancia entre zonas',0,12,d,.5,v=>{d=v;paint()});function paint(){pair(s,5,3,d);o.textContent=names[classify(5,3,d)]+' · '+counts[classify(5,3,d)]+' puntos comunes de las fronteras.'}paint();add(root,'p','Representamos dos contornos térmicos hipotéticos como circunferencias. No son datos de una cámara térmica; no permiten inferir temperatura ni diagnóstico. Distingue intersección de fronteras y solapamiento de regiones.')}
function openings(root){heading(root,'Proyecto · Dos aberturas de una tapa');let R=8,r=4,d=14;const s=graphic(root),o=add(root,'p');range(root,'Radio primera abertura (cm)',2,10,R,1,v=>{R=v;paint()});range(root,'Radio segunda abertura (cm)',1,8,r,1,v=>{r=v;paint()});range(root,'Separación de centros (cm)',0,25,d,.5,v=>{d=v;paint()});function paint(){pair(s,R,r,d);const gap=d-R-r;o.textContent='Posición: '+names[classify(R,r,d)]+'. '+(gap>0?'Separación entre bordes: '+fmt(gap)+' cm; área retirada si ambas están dentro de la tapa: '+fmt(Math.PI*(R*R+r*r))+' cm².':gap===0?'Contacto en un punto: no hay franja de material entre bordes.':'Discos solapados o contenidos: no sumar áreas sin descontar intersección.')}paint();add(root,'p','Modelo de distribución, no diseño estructural. Comprueba además que ambas aberturas quedan dentro de la tapa y que existen cierres adecuados. La separación geométrica no certifica resistencia ni higiene.')}
function practice(root){heading(root,'Práctica parametrizada');let R=5,r=3,d=6,m=0;const q=add(root,'p'),s=graphic(root),l=add(root,'label','Respuesta '),x=add(l,'input'),o=add(root,'p');x.type='text';['Clasificar','Puntos comunes','Distancia tangencia exterior','Distancia tangencia interior'].forEach((v,i)=>btn(root,v,()=>{m=i;paint()}));function paint(){pair(s,R,r,d,false);q.textContent=['Clasifica R='+R+', r='+r+', d='+d+'. Escribe el número de caso: '+names.map((t,i)=>(i+1)+' '+t).join('; '),'¿Cuántos puntos comunes? Escribe 0, 1, 2 o infinitos.','Calcula d para tangencia exterior.','Calcula d para tangencia interior (radios distintos).'][m];x.value='';o.textContent=''}btn(root,'Comprobar',()=>{if(!x.value.trim()){o.textContent='Escribe una respuesta.';return}const c=classify(R,r,d),e=[String(c+1),counts[c].toLowerCase(),String(R+r),R===r?'no existe':String(Math.abs(R-r))][m],a=x.value.trim().toLowerCase();o.textContent=(a===e?'Correcto. ':'Revisa. ')+['Caso '+(c+1)+': '+names[c]+' · '+rules[c],counts[c]+' puntos comunes', 'd=R+r='+e,R===r?'Radios iguales: no existe tangencia interior.':'d=|R−r|='+e][m]});btn(root,'Otro ejercicio',()=>{R=2+Math.floor(Math.random()*8);r=1+Math.floor(Math.random()*7);if(m===3&&R===r)r++;d=[0,Math.abs(R-r),R+r,Math.floor(Math.random()*20)][Math.floor(Math.random()*4)];paint()});paint()}
const qs=[
['R=5,r=3,d=10: posición',['Exteriores','Secantes','Tangentes'],0,'10>8.','IL-17'],
['R=5,r=3,d=8',['Interiores','Tangentes exteriores','Concéntricas'],1,'d=R+r.','IL-17'],
['R=5,r=3,d=6',['Exteriores','Coincidentes','Secantes'],2,'2<6<8.','IL-2'],
['R=5,r=3,d=2',['Tangentes interiores','Exteriores','Secantes'],0,'d=|R−r|>0.','IL-17'],
['R=5,r=3,d=1',['Secantes','Interiores no concéntricas','Tangentes'],1,'0<1<2.','IL-17'],
['R=5,r=3,d=0',['Coincidentes','Secantes','Concéntricas distintas'],2,'Centro común, radios distintos.','IL-17'],
['R=r=5,d=0: puntos comunes',['Infinitos','0','2'],0,'Coinciden.','IL-2'],
['¿Exactamente tres puntos comunes?',['Sí','No'],1,'Dos distintas tienen como máximo dos.','IL-2'],
['Centros y punto de tangencia',['No alineados','Siempre triángulo','Alineados'],2,'Igualdad triangular.','IL-2'],
['C1 tangente a C2 y C2 a C3 implica C1 tangente a C3',['No necesariamente','Siempre'],0,'Contraejemplo de centros alineados y radios iguales.','IL-2'],
['Campo ideal de conductor recto, vista perpendicular',['Secantes','Concéntricas','Coincidentes'],1,'Centro común en el conductor.','IL-17'],
['¿Cómo validar una clasificación digital?',['Solo mirar colores','Aumentar tamaño de pantalla','Comparar d, suma y diferencia de radios'],2,'Contrasta datos y criterio.','IL-13']];
function rubric(root){heading(root,'Rúbrica interactiva');const lv=['Reconoce','Aplica','Analiza','Transfiere y justifica'],cs=[['Representación','Identifico centros.','Rotulo radios y distancia.','Clasifico por desigualdades.','Comunico propiedades y casos límite.','IL-17'],['Razonamiento','Reconozco tangencia.','Aplico criterios.','Construyo contraejemplos.','Justifico máximo de intersecciones y no transitividad.','IL-2'],['Tecnología','Reconozco recursos.','Uso simulador.','Contrasto medidas y fórmulas.','Verifico modelos con datos independientes.','IL-13'],['Transferencia y colaboración','Identifico aplicaciones.','Represento una situación.','Comparo argumentos.','Justifico una decisión y sus límites respetando aportes.','IL-17 / IL-2']];const ss=cs.map(c=>{const f=add(root,'fieldset');add(f,'legend',c[0]);const s=add(f,'select');s.append(new Option('Selecciona nivel',''));lv.forEach((v,i)=>s.append(new Option((i+1)+' · '+v,String(i))));c.slice(1,5).forEach((t,i)=>add(f,'p',(i+1)+' · '+t));add(f,'p',c[5]);return s});const o=add(root,'div'),b=btn(root,'Ver perfil',()=>{o.replaceChildren();cs.forEach((c,i)=>add(o,'p',c[0]+': '+lv[+ss[i].value]+' — '+c[1+Number(ss[i].value)]));add(o,'p','Registra fortaleza y mejora; contrasta con compañero y docente. Sin nota oficial.')});b.disabled=true;ss.forEach(s=>s.onchange=()=>{b.disabled=ss.some(x=>x.value==='');o.replaceChildren()});btn(root,'Reiniciar',()=>{ss.forEach(s=>s.value='');b.disabled=true;o.replaceChildren()})}
const screens=[
r=>{heading(r,'¿Se tocan o se cortan?');add(r,'p','Recupera radio, diámetro y circunferencia de P3-J04. Observa ruedas, poleas y aberturas circulares. Predice posiciones antes de comprobar.');explorer(r);quiz(r,qs.slice(0,3))},
r=>subtopics(r,[['Distancia y radios',explorer],['Seis posiciones y coincidencia',gallery],['Intersecciones y demostración',proof],['Tangencia y alineación',tangent],['Tres circunferencias',triple],['Aplicaciones del entorno',p=>{field(p);pulley(p);thermal(p)}]]),
r=>subtopics(r,[['Campo magnético',field],['Poleas',pulley],['Tres puntos comunes',proof],['Construcción de tres circunferencias',triple],['Termografía',thermal],['Aberturas del depósito',openings]]),
r=>subtopics(r,[['Reconocer',p=>quiz(p,qs.slice(0,7))],['Aplicar',practice],['Argumentar',p=>{proof(p);triple(p);add(p,'p','Resuelve las consignas de p.49 y contrasta dos construcciones con regla y compás.')}],['Transferir',p=>{openings(p);add(p,'p','En GeoGebra construye A=(0,0), B=(6,0), Circle(A,5), Circle(B,3). Usa Intersect y modifica B. Contrasta clasificación por distancia. En papel dibuja los seis casos, el caso coincidente y dos contraejemplos de transitividad.')}],['Autoestudio',p=>add(p,'p','120 min: 30 lectura pp.48–49; 50 construcciones y problemas; 40 verificación, coevaluación y autoevaluación. Recursos: compás, regla, transportador, calculadora o GeoGebra. Conserva evidencias manuscritas identificadas.')]]),
r=>{heading(r,'Evaluación formativa');quiz(r,qs,true);rubric(r)}];
window.A4Lessons=Object.freeze({...window.A4Lessons,'P3-J05':function(root){root.replaceChildren();const tabs=add(root,'div');tabs.style.cssText='display:flex;flex-wrap:wrap;gap:8px;margin:12px 0';tabs.setAttribute('role','group');tabs.setAttribute('aria-label','Pantallas pedagógicas');const content=add(root,'div');const labels=['¿Qué sabemos?','Contenidos','Ejemplos','Práctica','Evaluación'];let active=0;const panels=screens.map((fn,i)=>{const p=E('div');p.className='card';p.hidden=i!==0;add(p,'h2',labels[i]);fn(p);content.append(p);return p});const buttons=labels.map((t,i)=>btn(tabs,(i+1)+' · '+t,()=>go(i)));const controls=add(root,'div');controls.style.cssText='display:flex;justify-content:space-between;gap:8px';const prev=btn(controls,'← Anterior',()=>go(active-1)),next=btn(controls,'Siguiente →',()=>go(active+1));function go(i){if(i<0||i>4)return;active=i;panels.forEach((p,j)=>p.hidden=j!==i);buttons.forEach((b,j)=>{b.className=j===i?'':'secondary';b.setAttribute('aria-pressed',String(j===i))});prev.disabled=i===0;next.disabled=i===4;if(window.MathJax?.typesetPromise)window.MathJax.typesetPromise([panels[i]]).catch(()=>{}); }go(0)}});























})();