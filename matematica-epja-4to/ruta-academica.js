/* AulaQR Cuarto Año — ruta académica productiva. Identidad declarada, no autenticación. */
(()=>{'use strict';
const $=id=>document.getElementById(id),main=document.querySelector('main'),nav=document.querySelector('nav');
const areas=['portada','encuadre','diagnostico','inicio','ruta','catalogo','lista','recuperacion','encuentro','evaluaciones','registros','cierre'];
const temas=['Geometría del triángulo','Polígonos','Áreas, volúmenes y circunferencias','Cónicas y trigonometría'];
const rom=['I','II','III','IV'];let plan=null,selected='P1',current=null;
const published=window.A4Lessons||Object.freeze({}); // Solo agregar entradas cuando la lección real esté publicada.
const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Santo_Domingo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).reduce((a,p)=>(a[p.type]=p.value,a),{});
const date=()=>{const t=today();return t.year+'-'+t.month+'-'+t.day};
const fmt=d=>new Intl.DateTimeFormat('es-DO',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(d+'T12:00:00Z'));
const el=(tag,txt,cls)=>{const n=document.createElement(tag);if(txt!=null)n.textContent=txt;if(cls)n.className=cls;return n};
const put=(id,txt)=>{$(id).textContent=txt};
const button=(txt,fn)=>{const b=el('button',txt,'secondary');b.type='button';b.onclick=fn;return b};
const validIdentity=()=>!main.hidden&&!document.body.classList.contains('epja-identity-loading')&&!!document.querySelector('#portada .epja-identity-embedded');
function identity(){
 const original=document.querySelector('#portada .epja-identity-embedded'),bar=$('a4Identity');bar.replaceChildren();
 if(!original)return;
 const copy=el('div',null,'epja-identity');const name=original.querySelector('strong'),meta=original.querySelector('.epja-identity-meta'),change=original.querySelector('.epja-identity-change');
 if(name)copy.append(el('strong',name.textContent));if(meta)copy.append(el('p',meta.textContent,'epja-identity-meta'));if(change){const a=el('a',change.textContent,'epja-identity-change');a.href=change.href;copy.append(a)}bar.append(copy);
}
function show(area){
 if(!areas.includes(area)||!validIdentity())return;
 if(!plan&&['inicio','ruta','catalogo','lista','recuperacion','encuentro','evaluaciones'].includes(area)){ $('loadError').hidden=false;return;}
 areas.forEach(x=>$(x).hidden=x!==area);document.body.dataset.area=area;
 nav.hidden=['portada','encuadre','diagnostico'].includes(area);$('a4Identity').hidden=area==='portada';
 const active=['lista','encuentro','catalogo','recuperacion','cierre'].includes(area)?'ruta':area;
 nav.querySelectorAll('button').forEach(b=>b.setAttribute('aria-current',b.dataset.go===active?'page':'false'));
 if(area==='inicio')home();if(area==='ruta')route();if(area==='catalogo')catalog();if(area==='recuperacion')recovery();if(area==='evaluaciones')evaluations();
 window.scrollTo(0,0);const h=$(area).querySelector('h1');if(h){h.tabIndex=-1;h.focus({preventScroll:true})}
}
const list=p=>plan.encuentros.filter(e=>e.periodo===p);
const ptitle=p=>p.id+' · Módulo '+rom[p.modulo-1];
function status(e){return published[e.id]?(e.fecha>date()?'Publicado · programado':'Lección disponible'):'Lección pendiente de publicación'}
function calendarState(e){return e.fecha>date()?'Programado':e.fecha===date()?'Fecha de hoy':'Fecha transcurrida'}
function currentLesson(){
 const d=date();return plan.encuentros.filter(e=>e.fecha<=d).at(-1)||null;
}
function recess(){const d=date();return plan.recesos.some(r=>{const end=new Date(r+'T12:00:00Z');end.setUTCDate(end.getUTCDate()+6);return r<=d&&d<=end.toISOString().slice(0,10)})}
function home(){
 current=currentLesson();const d=date(),p=current?plan.periodos.find(p=>p.id===current.periodo):plan.periodos[0];
 put('currentPeriod',ptitle(p)+' · '+temas[p.modulo-1]);put('periodDates',fmt(p.inicio)+' – '+fmt(p.cierre));
 put('currentStatus',!current?'Programado':d>plan.periodos.at(-1).cierre?'Calendario concluido':recess()?'Receso':'Calendario académico');
 put('todayLessonCaption',!current?'Las clases aún no han comenzado.':(recess()?'Último encuentro programado: ':'Encuentro correspondiente al calendario: ')+current.titulo+' · '+fmt(current.fecha)+' · '+status(current));
 $('continue').disabled=!current;$('continue').textContent=recess()?'Consultar encuentro anterior →':'La clase al día →';
}
function card(e,highlight=false){const a=el('article');if(highlight)a.classList.add('class-week');const r=el('div',null,'row');r.append(el('h3',e.id+' · '+e.titulo),el('span',status(e),'pill '+(published[e.id]?'live':'lock')));a.append(r,el('p',fmt(e.fecha)+' · '+calendarState(e),'muted small'),el('p','Páginas del módulo: '+e.paginas,'small'),button(published[e.id]?'Abrir encuentro →':'Consultar planificación →',()=>open(e)));return a}
function route(){
 const d=date(),root=$('periodCards');root.replaceChildren();
 for(const p of plan.periodos){const es=list(p.id),elapsed=es.filter(e=>e.fecha<=d).length,ready=es.filter(e=>published[e.id]).length,a=el('article');if(d>=p.inicio&&d<=p.cierre)a.classList.add('active');const row=el('div',null,'row');row.append(el('h3',ptitle(p)),el('span',d<p.inicio?'Programado':d>p.cierre?'Para repasar':'Período vigente','pill'));const progress=el('div',null,'progress'),fill=el('span');fill.style.width=100*elapsed/es.length+'%';progress.append(fill);a.append(row,el('p',temas[p.modulo-1]),el('p',fmt(p.inicio)+' – '+fmt(p.cierre),'muted small'),el('p',elapsed+'/'+es.length+' fechas alcanzadas · '+ready+'/'+es.length+' lecciones publicadas','small'),progress,el('p','Proyecto: '+p.proyecto,'small'),button('Ver encuentros →',()=>openPeriod(p.id)));root.append(a)}
}
function openPeriod(id){selected=id;const p=plan.periodos.find(x=>x.id===id),es=list(id),c=currentLesson();put('listPeriod',ptitle(p));put('listSummary',temas[p.modulo-1]+' · '+es.length+' encuentros programados');$('encounterCards').replaceChildren(...es.map(e=>card(e,!recess()&&c?.id===e.id)));show('lista')}
function open(e){selected=e.periodo;put('encEyebrow',e.periodo+' · '+e.id+' · '+fmt(e.fecha));put('encTitle',e.titulo);put('encHeadline',status(e));put('encDescription',e.objetivo);put('encCurricular','Páginas: '+e.paginas+' · '+e.competencias.join(', ')+' · '+e.indicadoresPropuestos.join(', ')+' (alineación prevista)');const host=$('a4Lesson');host.replaceChildren();host.hidden=!published[e.id];show('encuentro');if(published[e.id]){try{published[e.id](host)}catch(err){host.replaceChildren();host.hidden=true;put('encHeadline','No se pudo cargar la lección. Recarga la página.')}}}
function options(id){const s=$(id),old=s.value;s.replaceChildren(...plan.periodos.map(p=>new Option(ptitle(p),p.id)));s.value=plan.periodos.some(p=>p.id===old)?old:selected}
function recovery(){options('recPeriod');const es=list($('recPeriod').value).filter(e=>e.fecha<date());$('recCards').replaceChildren(...(es.length?es.map(e=>card(e)): [el('p','No hay encuentros anteriores en este período.')]))}
function catalog(){options('catalogPeriod');const seen=new Set(),cards=[];for(const e of list($('catalogPeriod').value)){if(e.codigos.length>2)continue;for(const code of e.codigos){if(seen.has(code))continue;seen.add(code);const a=el('article');a.append(el('h3',code+' · '+e.titulo),el('p','Páginas: '+e.paginas+' · '+e.indicadoresPropuestos.join(', '),'small'),button('Consultar encuentro →',()=>open(e)));cards.push(a)}}$('catalogCards').replaceChildren(...cards)}
function evaluations(){const root=$('evalPeriods');root.replaceChildren();for(const p of plan.periodos){const a=el('article'),e=list(p.id).find(e=>e.requierePDF);a.append(el('h3',ptitle(p)),el('p','Cierre previsto: '+fmt(p.cierre)),el('p','Evaluación y recepción PDF pendientes de implementación.','muted small'),button('Consultar planificación del cierre →',()=>open(e)));root.append(a)}}
document.addEventListener('DOMContentLoaded',async()=>{
 if(!validIdentity())return;identity();
 document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.go)));
 $('finishIntro').onclick=()=>show('portada');$('continue').onclick=()=>{if(current)open(current)};$('startLessonPilot').onclick=()=>{if(plan)open(plan.encuentros[0])};$('backToList').onclick=()=>openPeriod(selected);$('recPeriod').onchange=recovery;$('catalogPeriod').onchange=catalog;
 try{const r=await fetch('curriculo/planificacion-anual.json',{cache:'no-cache'});if(!r.ok)throw Error('HTTP '+r.status);const p=await r.json();if(p.encuentros?.length!==37||p.periodos?.length!==4||new Set(p.encuentros.map(e=>e.id)).size!==37)throw Error('Plan incompatible');plan=p;$('loadError').hidden=true;}
 catch(e){put('loadError','No se pudo cargar la planificación anual. Recarga la página para volver a intentarlo.');$('loadError').hidden=false;}
});
})();