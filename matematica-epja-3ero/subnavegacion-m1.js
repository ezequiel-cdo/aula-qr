"use strict";
/* Navegacion pedagógica interior para el Modulo I, sin reescribir instrumentos ni claves de progreso.
 * P1-E01: cinco subtemas de contenido, cuatro destrezas + autoestudio, cuatro bloques + evidencia.
 * P1-E02...E10: conceptos del encuentro, cuatro grupos de práctica + autoestudio,
 * cuatro bloques de evidencia + entrega/reflexion. Los grupos B1-B4 siguen siendo orientativos. */
(function(){
  const selectMemory=new Map();
  const $=id=>document.getElementById(id);
  const namesE1=['Variables y relaciones','Cómo traducir','Conceptos algebraicos','Lenguaje algebraico','Patrones y exploración'];
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const style=document.createElement('style');
  style.textContent=`
  #learningScreen [hidden],#m1Body [hidden]{display:none!important}
  .epja-mini-tabs{display:flex;flex-wrap:wrap;gap:7px;margin:16px 0 18px;padding:11px;border:1px solid #d3dfef;background:#f3f7fd;border-radius:13px}
  .epja-mini-tabs button{font:inherit;font-size:clamp(.78rem,1.7vw,.9rem);font-weight:700;color:#254579;background:#fff;border:1px solid #a8c0df;border-radius:9px;padding:10px 12px;min-height:43px;flex:1 1 138px;cursor:pointer;line-height:1.4;text-align:center}
  .epja-mini-tabs button[aria-selected="true"]{background:#274985;border-color:#274985;color:#fff}
  .epja-mini-tabs button:focus-visible{outline:3px solid #f59e0b;outline-offset:2px}
  .epja-mini-intro{font-size:.9rem;line-height:1.6;color:#546780;margin:7px 0}
  .epja-mini-section{margin-top:10px}
  .epja-mini-meta{font-size:.74rem;font-weight:500;white-space:nowrap;opacity:.9;display:block}
  .epja-mini-endnote{font-size:.85rem;color:#556780;margin:12px 0}
  @media(max-width:540px){.epja-mini-tabs{gap:5px;padding:8px}.epja-mini-tabs button{flex:1 1 112px;min-height:46px;padding:9px 7px;font-size:.78rem}}
  `;
  document.head.appendChild(style);

  function createTabs(container,anchor,groups,key,description,progressFn){
    if(!groups.length)return;
    const nav=document.createElement('div');nav.className='epja-mini-tabs';nav.setAttribute('data-epja-subnav',key);nav.setAttribute('role','tablist');nav.setAttribute('aria-label',description);
    const intro=document.createElement('p');intro.className='epja-mini-intro';intro.textContent=description;
    anchor.before(intro,nav);
    const chosen=Math.max(0,Math.min(groups.length-1,selectMemory.get(key)||0));
    const buttons=groups.map((g,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('role','tab');b.textContent=(i+1)+'. '+g.name;b.addEventListener('click',()=>activate(i));nav.appendChild(b);return b});
    function activate(index){selectMemory.set(key,index);groups.forEach((g,i)=>g.elements.forEach(el=>el.hidden=i!==index));buttons.forEach((b,i)=>{b.setAttribute('aria-selected',i===index?'true':'false');b.tabIndex=i===index?0:-1});update();}
    function update(){if(!progressFn)return;const metrics=progressFn(groups);buttons.forEach((b,i)=>{let t=b.querySelector('span.epja-mini-meta');if(!t){t=document.createElement('span');t.className='epja-mini-meta';b.appendChild(t)}t.textContent=metrics[i]||''})}
    nav.addEventListener('keydown',ev=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(ev.key))return;ev.preventDefault();const i=selectMemory.get(key)||0;const nxt=ev.key==='Home'?0:ev.key==='End'?groups.length-1:(i+(ev.key==='ArrowLeft'?-1:1)+groups.length)%groups.length;activate(nxt);buttons[nxt].focus()});
    container.addEventListener('change',update);
    container.addEventListener('click',ev=>{if(ev.target.closest('[data-check],[data-check-practice],[data-hint]'))queueMicrotask(update)});
    activate(chosen);
  }

  function groupAnswerCount(groups){return groups.map(g=>{const names=new Set(),selected=new Set();g.elements.forEach(el=>el.querySelectorAll('input[type="radio"]').forEach(r=>{names.add(r.name);if(r.checked)selected.add(r.name)}));return names.size?selected.size+'/'+names.size+' respondidas':''})}

  function enhanceE1(root){
    if(!root||!root.children.length||root.querySelector('[data-epja-subnav]'))return;
    const kicker=root.querySelector(':scope > .learning-kicker');if(!kicker)return;
    const label=kicker.textContent||'';
    const num=(label.match(/Paso\s+(\d)/)||[])[1];
    if(num==='2'){
      const headings=[...root.querySelectorAll(':scope > h3')];if(headings.length<5)return;
      const groups=headings.map((head,i)=>{const el=document.createElement('section');el.className='epja-mini-section';el.setAttribute('aria-label',namesE1[i]||head.textContent);const elements=[];let p=head;while(p&&(!headings[i+1]||p!==headings[i+1])){elements.push(p);p=p.nextElementSibling}elements.forEach(n=>el.appendChild(n));return {name:namesE1[i]||head.textContent,elements:[el],node:el}});
      const first=kicker.nextElementSibling;groups.forEach(g=>root.appendChild(g.node));createTabs(root,groups[0].node,groups,'e1:2','Selecciona un subtema para estudiar su explicación y ejemplos.');
    }else if(num==='4'||num==='5'){
      const units=[...root.querySelectorAll(':scope > .learning-practice-unit')];if(units.length<5)return;
      const key='e1:'+num;
      const labels=num==='4'?['Constantes y variables','Interpretar expresiones','Edades y relaciones','Perímetros y modelos','Autoestudio · 120 min']:['B1 · Comunicación','B2 · Razonamiento','B3 · Aplicación','B4 · Contexto','Evidencias y entrega'];
      const groups=units.map((unit,i)=>({name:labels[i]||('Sección '+(i+1)),elements:[unit]}));
      if(num==='5'){
        // Mostrar el envío único y el informe final junto con las evidencias.
        const finalUnit=units[units.length-1];
        let next=finalUnit.nextElementSibling;
        while(next){const sibling=next.nextElementSibling;groups[4].elements.push(next);next=sibling}
      }
      const countPractice=gr=>gr.map(g=>{const tasks=g.elements[0].querySelectorAll('[data-practice]');if(!tasks.length)return 'Producción escrita';const ok=[...tasks].filter(t=>t.querySelector('.learning-feedback.good')).length;return ok+'/'+tasks.length+' logradas'});
      createTabs(root,units[0],groups,key,num==='4'?'Practica una destreza a la vez. Puedes pedir pistas y corregir tus respuestas.':'Responde por bloques de competencias. Se conserva un solo intento formativo para todo el encuentro.',num==='4'?countPractice:groupAnswerCount);
    }
  }
  function nFromTitle(){const s=$('encEyebrow')?.textContent||'';return Number((s.match(/Encuentro\s+(\d+)\s+de\s+10/)||[])[1]||0)}
  function enhanceM1(root){
    if(!root||!root.children.length||root.querySelector('[data-epja-subnav]'))return;
    const title=root.querySelector(':scope > .m1-kicker');if(!title)return;
    const n=nFromTitle();if(n<2||n>10)return;
    const step=Number((title.textContent.match(/Paso\s+(\d)/)||[])[1]);
    const key='m1:'+n+':'+step;
    if(step===2){
      const concepts=[...root.querySelectorAll(':scope > .m1-concept:not(details)')];if(!concepts.length)return;
      const defs=window.EPJA_M1_LECCIONES?.[n]?.concepts||[];
      const groups=concepts.map((c,i)=>({name:defs[i]?.[0]||('Subtema '+(i+1)),elements:[c]}));
      // El laboratorio de comprensión acompaña al subtema correspondiente.
      // La sección de referencias conserva solamente los vínculos curriculares.
      const oldLab=root.querySelector(':scope > .m1-mini');
      const align={2:1,3:0,4:3,5:0,6:1,7:2,8:0,9:0,10:3};
      if(oldLab)concepts[Math.min(3,align[n]??0)].appendChild(oldLab);
      // En P1-J02 cada explorador pertenece a su propio subtema, no a un panel suelto.
      if(n===2||n===4||n===5||n===6){
        const labs=[...root.querySelectorAll(':scope > .m1-poly-explorer')];
        labs.slice(0,4).forEach((lab,i)=>concepts[Math.min(i,concepts.length-1)].appendChild(lab));
      }
      const last=concepts.at(-1),extra=[];let cursor=last.nextElementSibling;
      while(cursor){const next=cursor.nextElementSibling;extra.push(cursor);cursor=next}
      if(extra.length)groups.push({name:'Referencias y notas de estudio',elements:extra});
      createTabs(root,concepts[0],groups,key,'Explora cada subtema con sus explicaciones, representaciones y actividades de comprensión.');
    }else if(step===4){
      const tasks=[...root.querySelectorAll(':scope > article.m1-practice[data-qid]')];if(tasks.length!==12)return;
      const bank=window.EPJA_M1_PREGUNTAS?.[n]?.practice||[];
      const groups=[];
      for(let i=0;i<4;i++){
        const subset=tasks.slice(i*3,i*3+3),skills=[...new Set(bank.slice(i*3,i*3+3).map(q=>q.skill))];
        const name=skills.slice(0,2).join(' y ')+(skills.length>2?'…':'');
        groups.push({name:name||('Destreza '+(i+1)),elements:subset});
      }
      const stud=(n===2||n===4||n===5||n===6)?root.querySelector(':scope > section.m1-poly-explorer'):null;
      const oldStud=stud||[...root.children].find(el=>el.matches('h3')&&el.textContent.startsWith('Autoestudio:'));
      if(oldStud){const rest=[];let el=oldStud;while(el){rest.push(el);el=el.nextElementSibling}groups.push({name:'Autoestudio · 120 min',elements:rest})}
      const getProgress=gr=>gr.map(g=>{const articles=g.elements.filter(el=>el.matches('article.m1-practice[data-qid]'));if(!articles.length)return 'Producción escrita';const completed=articles.filter(a=>a.querySelector('button[data-check]')?.textContent.includes('Volver a comprobar')||a.querySelector('.m1-feedback.m1-good')).length;return completed+'/'+articles.length+' logradas'});
      createTabs(root,tasks[0],groups,key,'Elige la destreza que deseas practicar. Recibirás pistas y retroalimentación.',getProgress);
    }else if(step===5){
      const blocks=[...root.querySelectorAll(':scope > div.m1-practice')];if(blocks.length<6)return;
      const names=['B1 · Comunicación','B2 · Razonamiento','B3 · Aplicación','B4 · Contexto'];
      const groups=blocks.slice(0,4).map((g,i)=>({name:names[i],elements:[g]}));
      groups.push({name:'Evidencias y entrega',elements:[...root.children].slice([...root.children].indexOf(blocks[4]))});
      createTabs(root,blocks[0],groups,key,'Responde cuatro reactivos por bloque. Al finalizar, entrega un único intento del encuentro.',groupAnswerCount);
    }
  }
  function scan(){enhanceE1($('learningScreen'));enhanceM1($('m1Body'))}
  const target=$('encuentro')||document.body;
  const watcher=new MutationObserver(scan);
  watcher.observe(target,{subtree:true,childList:true});
  scan();
  window.EPJA_SUBNAVEGACION_M1={version:'1.0',refresh:scan};
})();