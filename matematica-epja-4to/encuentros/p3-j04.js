/* AulaQR P3-J04. MINERD módulo III pp.44–47. */
(()=>{'use strict';
const E=(tag,t)=>{const n=document.createElement(tag);if(t!==undefined)n.textContent=t;return n};
const add=(r,tag,t)=>{const n=E(tag,t);r.append(n);return n};
const btn=(r,t,f)=>{const b=add(r,'button',t);b.type='button';b.onclick=f;return b};
const math=(r,t)=>add(r,'p','\\('+t+'\\)');
const heading=(r,t)=>add(r,'h3',t);
let quizSeq=0;function quiz(root,qs,final=false){const prefix='a4p3j04q'+(++quizSeq)+'-';let answers=new Map(),groups=[],feedback=[];const box=add(root,'div');qs.forEach((q,i)=>{const f=add(box,'fieldset');f.style.cssText='border:1px solid #d5e0ef;border-radius:10px;margin:12px 0;padding:12px;min-width:0';add(f,'legend',(i+1)+'. '+q[0]);let inputs=[];q[1].forEach((o,j)=>{const l=add(f,'label');l.style.cssText='display:flex;gap:10px;align-items:center;padding:8px 0';const x=add(l,'input');x.type='radio';x.name=prefix+i;x.value=j;l.append(document.createTextNode(o));inputs.push(x);x.onchange=()=>{answers.set(i,j);if(!final)feedback[i].textContent=(j===q[2]?'Correcto. ':'Revisa. ')+q[3];if(submit)submit.disabled=answers.size!==qs.length}});const p=add(f,'p','');p.setAttribute('aria-live','polite');feedback.push(p);groups.push(inputs)});let submit=null;if(final){const result=add(box,'p','');result.setAttribute('role','status');submit=btn(box,'Finalizar evaluación formativa',()=>{let score=0;qs.forEach((q,i)=>{const ok=answers.get(i)===q[2];if(ok)score++;feedback[i].textContent=(ok?'Correcto. ':'Respuesta: '+q[1][q[2]]+'. ')+q[3]+' · '+q[4];groups[i].forEach(x=>x.disabled=true)});result.textContent=score+'/'+qs.length+' respuestas correctas. '+(score>=Math.ceil(qs.length*.75)?'Buen avance; revisa tus errores.':'Repasa conceptos y vuelve a practicar.')+' Resultado formativo, no nota oficial.';submit.disabled=true});submit.disabled=true;btn(box,'Reintentar',()=>{box.remove();quiz(root,qs,true)})}}
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


















const pi=Math.PI,rad=a=>a*pi/180,fmt=x=>Number(x.toFixed(4)).toString(),arcLength=(r,a)=>r*rad(a),sectorArea=(r,a)=>r*arcLength(r,a)/2,ring=(R,r)=>pi*(R*R-r*r),segment=(r,a)=>r*r*(rad(a)-Math.sin(rad(a)))/2;
const O=[170,110],P=(a,R=80,c=O)=>[c[0]+R*Math.cos(rad(a)),c[1]-R*Math.sin(rad(a))];
function circle(s,c,R,fill='none',stroke='#2177a8'){shape(s,'circle',{cx:c[0],cy:c[1],r:R,fill,stroke,'stroke-width':2})}
function range(r,t,min,max,v,step,fn){const x=slider(r,t,min,max,v,fn);x.step=step;return x}
function sector(s,a,kind=0){if(a===0)return;if(a===360){circle(s,O,80,'#d9770633');return}shape(s,'path',{d:'M'+P(0).join(' ')+' A80 80 0 '+(a>180?1:0)+' 0 '+P(a).join(' ')+(kind?' Z':' L170 110 Z'),fill:'#d9770633',stroke:'#d97706','stroke-width':2})}
function elements(r){heading(r,'Compás virtual');let R=5,a=95,t=0,m=0;const s=graphic(r),o=add(r,'p');['Radio y diámetro','Cuerda y secante','Arco','Círculo'].forEach((v,i)=>btn(r,v,()=>{m=i;paint()}));range(r,'Radio (cm)',1,15,R,1,v=>{R=v;paint()});range(r,'Giro (°)',0,360,t,5,v=>{t=v;paint()});range(r,'Ángulo (°)',5,355,a,5,v=>{a=v;paint()});function paint(){s.replaceChildren();circle(s,O,80,m===3?'#51ade044':'none');const u=P(t),v=P(t+a),w=P(t+180);point(s,...O,'O');if(m===0){seg(s,w,u);seg(s,O,v,'#16805d');point(s,...u,'A');point(s,...v,'B');o.textContent='Radio '+R+' cm; diámetro '+2*R+' cm. Infinitos radios y diámetros.'}else if(m===1){const d=[v[0]-u[0],v[1]-u[1]],l=Math.hypot(...d),c=[(u[0]+v[0])/2,(u[1]+v[1])/2];seg(s,[c[0]-110*d[0]/l,c[1]-110*d[1]/l],[c[0]+110*d[0]/l,c[1]+110*d[1]/l],'#64748b','4 3');seg(s,u,v,'#7954a3');point(s,...u,'A');point(s,...v,'B');o.textContent='Cuerda '+fmt(2*R*Math.sin(rad(a)/2))+' cm. La recta que contiene la cuerda es secante; la cuerda máxima es el diámetro.'}else if(m===2){seg(s,O,u);seg(s,O,v);shape(s,'path',{d:'M'+u.join(' ')+' A80 80 0 '+(a>180?1:0)+' 0 '+v.join(' '),fill:'none',stroke:'#d97706','stroke-width':4});o.textContent='Arco antihorario '+a+'°: '+fmt(arcLength(R,a))+' cm.'}else o.textContent='Longitud de la frontera '+fmt(2*pi*R)+' cm; área interior '+fmt(pi*R*R)+' cm².';s.setAttribute('aria-label',o.textContent)}paint();math(r,'d=2r,\\quad L=2\\pi r,\\quad A=\\pi r^2');add(r,'p','Traza con compás real manteniendo apertura fija; mide ángulos con transportador. El dibujo en pantalla no tiene escala física.')}
function arcs(r){heading(r,'Arcos, grados y radianes');let R=1,a=95;const s=graphic(r),o=add(r,'p');range(r,'Radio (cm)',.5,10,R,.5,v=>{R=v;paint()});range(r,'Ángulo central (°)',0,360,a,1,v=>{a=v;paint()});function paint(){s.replaceChildren();circle(s,O,80);sector(s,a);seg(s,O,P(0));seg(s,O,P(a));point(s,...O,'O');o.textContent=a+'° = '+fmt(rad(a))+' rad; arco '+fmt(arcLength(R,a))+' cm; sector '+fmt(sectorArea(R,a))+' cm².'}paint();math(r,'s=\\frac{\\alpha\\pi r}{180}=r\\theta');add(r,'p','Para 95° el resultado es 95πr/180; verifica el radio de la figura auténtica antes de sustituir. Si r=1 cm y s=0.5 cm, θ=0.5 rad ≈28.65°.')}
function regions(r){heading(r,'Regiones circulares');let R=2,a=120,m=0;const s=graphic(r),o=add(r,'p');['Círculo','Semicírculo','Sector','Segmento'].forEach((v,i)=>btn(r,v,()=>{m=i;paint()}));range(r,'Radio (cm)',1,10,R,.5,v=>{R=v;paint()});range(r,'Ángulo (°)',0,360,a,5,v=>{a=v;paint()});function paint(){s.replaceChildren();circle(s,O,80,m===0?'#51ade044':'none');if(m)sector(s,m===1?180:a,m===3);point(s,...O,'O');o.textContent=['Círculo','Semicírculo','Sector','Segmento'][m]+': '+fmt([pi*R*R,pi*R*R/2,sectorArea(R,a),segment(R,a)][m])+' cm².'}paint();math(r,'A_{sector}=\\frac{\\alpha}{360^\\circ}\\pi r^2=\\frac{rs}{2}');add(r,'p','Sector: dos radios y arco. Segmento: cuerda y arco. Región circular es un concepto más amplio. Fórmula complementaria del segmento: r²(θ−sen θ)/2 con θ en radianes.')}
function washer(root,project=false){heading(root,project?'Tapa del depósito':'Arandela y material retirado');let R=project?.5:2,q=project?.2:.65;const unit=project?'m':'cm',s=graphic(root),o=add(root,'p');range(root,'Radio exterior ('+unit+')',project?.2:1,project?2:10,R,project?.1:.5,v=>{R=v;paint()});range(root,'Radio interior / exterior',0,.95,q,.05,v=>{q=v;paint()});function paint(){const inner=R*q;s.replaceChildren();circle(s,O,80,'#51ade044');if(q)circle(s,O,80*q,'white','#16805d');seg(s,O,P(0));seg(s,O,P(90,80*q),'#16805d');point(s,...O,'O');o.textContent='R='+fmt(R)+' '+unit+'; r='+fmt(inner)+' '+unit+'; disco '+fmt(pi*R*R)+' '+unit+'²; retirado '+fmt(pi*inner*inner)+' '+unit+'²; restante '+fmt(ring(R,inner))+' '+unit+'²; aprovechamiento '+fmt(100*(1-q*q))+'%.'}paint();math(root,'A=\\pi(R^2-r^2)');add(root,'p',project?'Modelo hipotético de tapa con abertura. Considera cierre seguro, higiene y resistencia; no es un diseño de ingeniería.':'Datos iniciales del módulo: R=2 cm, r=1.3 cm. El porcentaje no incluye recortes de la lámina ni reutilización del centro.')}
let seq=0;function lune(r){heading(r,'Lúnulas y campos visuales');let d=1;const s=graphic(r),o=add(r,'p');range(r,'Separación de centros / radio',0,2,d,.05,v=>{d=v;paint()});function paint(){s.replaceChildren();const A=[110,110],B=[110+60*d,110],id='a4j04mask'+(++seq),defs=document.createElementNS(s.namespaceURI,'defs'),mask=document.createElementNS(s.namespaceURI,'mask');mask.setAttribute('id',id);mask.setAttribute('maskUnits','userSpaceOnUse');mask.setAttribute('width','340');mask.setAttribute('height','230');shape(mask,'rect',{width:340,height:230,fill:'white'});shape(mask,'circle',{cx:B[0],cy:B[1],r:60,fill:'black'});defs.append(mask);s.append(defs);shape(s,'circle',{cx:A[0],cy:A[1],r:60,fill:'#d9770666',mask:'url(#'+id+')'});circle(s,A,60);circle(s,B,60,'none','#64748b');o.textContent=d===0?'Discos coincidentes: diferencia vacía.':d===2?'Discos tangentes: diferencia igual al disco salvo un punto.':'Lúnula esquemática: parte de un disco fuera del otro.'}paint();add(r,'p','La p.46 relaciona lúnulas con el eclipse lunar de 2019. El modelo no representa órbitas ni iluminación real.');figure(r,'Campo visual esquemático',s=>{circle(s,O,85,'#51ade022');circle(s,O,30,'#16805d44');label(s,135,115,'Central');label(s,190,65,'Periférica')},'Modelo conceptual de regiones central y periférica, no medición clínica. Consulta la figura original de p.47.')}
function numeric(r){let R=2,a=120,q=.5,m=0;const question=add(r,'p'),l=add(r,'label','Respuesta '),x=add(l,'input');x.type='number';x.step='any';const o=add(r,'p');['Longitud','Círculo','Arco','Sector','Corona','Radianes'].forEach((v,i)=>btn(r,v,()=>{m=i;paint()}));function paint(){question.textContent=['Radio '+R+' cm: longitud de circunferencia (cm).','Radio '+R+' cm: área (cm²).','Radio '+R+' cm y ángulo '+a+'°: arco (cm).','Radio '+R+' cm y ángulo '+a+'°: sector (cm²).','Corona R='+R+' cm, r='+fmt(R*q)+' cm: área (cm²).','Convierte '+a+'° a radianes.'][m]+' Redondea a dos decimales.';x.value='';o.textContent=''}btn(r,'Comprobar',()=>{if(!x.value.trim()){o.textContent='Escribe una respuesta.';return}const e=[2*pi*R,pi*R*R,arcLength(R,a),sectorArea(R,a),ring(R,R*q),rad(a)][m];o.textContent=(Math.abs(+x.value-e)<=.00500001?'Correcto. ':'Revisa. ')+['2πr','πr²','πrα/180','πr²α/360','π(R²−r²)','απ/180'][m]+' = '+fmt(e)});btn(r,'Otro ejercicio',()=>{R=1+Math.floor(Math.random()*10);a=15*(1+Math.floor(Math.random()*23));q=.25+.25*Math.floor(Math.random()*3);paint()});paint()}
const qs=[
['Circunferencia es:',['Frontera de puntos equidistantes','Región interior','Cualquier curva'],0,'Distingue círculo y frontera.','IL-1 / IL-17'],
['Número de diámetros',['Uno','Infinitos','Dos'],1,'Cada dirección por el centro.','IL-17'],
['Recta que contiene una cuerda',['Tangente','Exterior','Secante'],2,'Dos puntos de intersección.','IL-17'],
['Cuerda máxima',['Diámetro','Radio','Arco'],0,'Pasa por el centro.','IL-17'],
['Instrumento para conservar radio',['Transportador','Compás','Escuadra'],1,'Apertura fija.','IL-12'],
['r=1 cm, s=0.5 cm: ángulo en rad',['0.5','2','95'],0,'θ=s/r.','IL-10 / IL-13'],
['Semicírculo de diámetro 4 cm: área',['8π','4π','2π'],2,'Radio 2.','IL-10'],
['Sector 120°, r=1 cm: área',['π/3','2π/3','π'],0,'Un tercio.','IL-10'],
['Sector s=1.7 cm, r=1 cm: área',['1.7','0.85','3.4'],1,'rs/2 en cm².','IL-10'],
['Arandela R=2, r=1.3 cm: área',['2.31π','0.7π','5.69π'],0,'R²−r².','IL-10'],
['Segmento circular delimitado por:',['Dos radios y arco','Cuerda y arco','Dos diámetros'],1,'No es sector.','IL-17'],
['Verifica área de arandela:',['Suma discos','Solo diámetro exterior','Resta áreas y contrasta con simulador'],2,'Comprueba unidades.','IL-13']];
function rubric(r){heading(r,'Rúbrica interactiva');const lv=['Reconoce','Aplica','Analiza','Transfiere y justifica'],cs=[['Lenguaje y representación','Identifico elementos.','Rotulo figuras.','Distingo regiones.','Comunico propiedades y notación.','IL-1 / IL-17'],['Construcción','Reconozco instrumentos.','Trazo radios y ángulos.','Contrasto medidas.','Justifico construcciones.','IL-12'],['Cálculo','Identifico fórmulas.','Calculo arcos y áreas.','Comparo procedimientos.','Resuelvo y justifico problemas.','IL-10'],['Tecnología y colaboración','Identifico recursos.','Uso calculadora o simulador.','Contrasto con compañeros.','Defiendo decisiones con datos.','IL-13 / IL-17']];const ss=cs.map(c=>{const f=add(r,'fieldset');add(f,'legend',c[0]);const s=add(f,'select');s.append(new Option('Selecciona nivel',''));lv.forEach((v,i)=>s.append(new Option((i+1)+' · '+v,String(i))));c.slice(1,5).forEach((t,i)=>add(f,'p',(i+1)+' · '+t));add(f,'p',c[5]);return s});const o=add(r,'div'),b=btn(r,'Ver perfil',()=>{o.replaceChildren();cs.forEach((c,i)=>add(o,'p',c[0]+': '+lv[+ss[i].value]+' — '+c[1+Number(ss[i].value)]));add(o,'p','Registra una mejora y contrasta con compañero y docente. Sin nota oficial.')});b.disabled=true;ss.forEach(s=>s.onchange=()=>{b.disabled=ss.some(x=>x.value==='');o.replaceChildren()});btn(r,'Reiniciar',()=>{ss.forEach(s=>s.value='');b.disabled=true;o.replaceChildren()})}
const screens=[
r=>{heading(r,'¿Qué parte del disco se aprovecha?');add(r,'p','Observa una rueda, arandela y tapa. Distingue frontera, interior y material retirado.');elements(r);quiz(r,qs.slice(0,3))},
r=>subtopics(r,[['Elementos y compás',elements],['Arcos y radianes',arcs],['Regiones',regions],['Corona y arandela',p=>washer(p)],['Lúnulas y visión',lune],['Tapa del depósito',p=>washer(p,true)]]),
r=>subtopics(r,[['Arco de 95°',p=>{arcs(p);math(p,'s=95\\pi r/180');math(p,'r=1,\\ s=0.5\\Rightarrow\\theta=0.5\\,rad\\approx28.65^\\circ')}],['Semicírculo',p=>{figure(p,'Diámetro 4 cm',s=>sector(s,180),'Ejemplo complementario.');math(p,'A=\\pi(4/2)^2/2=2\\pi\\,cm^2')}],['Sector metálico',p=>{regions(p);math(p,'A=120\\pi/360=\\pi/3\\,cm^2');math(p,'A=1(1.7)/2=0.85\\,cm^2')}],['Arandela',p=>{washer(p);math(p,'A=\\pi(2^2-1.3^2)=2.31\\pi\\approx7.2571\\,cm^2')}],['Eclipse y visión',lune],['Depósito',p=>washer(p,true)]]),
r=>subtopics(r,[['Reconocer',p=>quiz(p,qs.slice(0,5))],['Aplicar',numeric],['Analizar',p=>{arcs(p);washer(p);add(p,'p','Resuelve las consignas auténticas de pp.45 y 47; verifica radio en la figura de 95° o deja expresión en r. Compara áreas mediante arco y ángulo.')}],['Transferir',p=>{washer(p,true);add(p,'p','Construye arandela con compás, rotula radios, diámetro y regiones. Calcula material útil y retirado. Verifica en calculadora o GeoGebra. Compara con un compañero.')}],['Autoestudio',p=>add(p,'p','120 min: 30 lectura pp.44–47; 50 construcción y problemas; 40 verificación, coevaluación y autoevaluación. Sin conexión: regla, compás, transportador y calculadora. Conserva evidencia manuscrita identificada.')]]),
r=>{heading(r,'Evaluación formativa');quiz(r,qs,true);rubric(r)}];
window.A4Lessons=Object.freeze({...window.A4Lessons,'P3-J04':function(root){root.replaceChildren();const tabs=add(root,'div');tabs.style.cssText='display:flex;flex-wrap:wrap;gap:8px;margin:12px 0';tabs.setAttribute('role','group');tabs.setAttribute('aria-label','Pantallas pedagógicas');const content=add(root,'div');const labels=['¿Qué sabemos?','Contenidos','Ejemplos','Práctica','Evaluación'];let active=0;const panels=screens.map((fn,i)=>{const p=E('div');p.className='card';p.hidden=i!==0;add(p,'h2',labels[i]);fn(p);content.append(p);return p});const buttons=labels.map((t,i)=>btn(tabs,(i+1)+' · '+t,()=>go(i)));const controls=add(root,'div');controls.style.cssText='display:flex;justify-content:space-between;gap:8px';const prev=btn(controls,'← Anterior',()=>go(active-1)),next=btn(controls,'Siguiente →',()=>go(active+1));function go(i){if(i<0||i>4)return;active=i;panels.forEach((p,j)=>p.hidden=j!==i);buttons.forEach((b,j)=>{b.className=j===i?'':'secondary';b.setAttribute('aria-pressed',String(j===i))});prev.disabled=i===0;next.disabled=i===4;if(window.MathJax?.typesetPromise)window.MathJax.typesetPromise([panels[i]]).catch(()=>{}); }go(0)}});






















})();