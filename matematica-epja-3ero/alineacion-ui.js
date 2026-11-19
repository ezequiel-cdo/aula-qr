"use strict";
/* Presentación, no cálculo de notas: base documental del aula EPJA. */
(function(){
 const data=window.EPJA_ALINEACION;
 if(!data||!Array.isArray(data.encuentros)||data.encuentros.length!==37)throw new Error('No se cargó la alineación curricular de 37 encuentros');
 const $=id=>document.getElementById(id);
 const by=(m,n)=>data.encuentros.find(x=>x.modulo===m&&x.jornada===n);
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const pageLinks=(r)=>{
   if(r.modulo===1){
     if(!r.lecturas.length)return 'Sin capítulo específico de factorización en este libro; ampliación curricular por validar';
     return r.lecturas.map(x=>`<a href="modulo1-matematica.pdf#page=${x.inicio-35}" target="_blank" rel="noopener">${esc(x.etiqueta)} ↗</a>`).join(' · ');
   }
   if(!r.lecturas.length)return 'No hay lectura específica asignada';
   return r.lecturas.map(x=>`<span>${esc(x.etiqueta)} del libro oficial del Módulo ${['I','II','III','IV'][r.modulo-1]}</span>`).join(' · ');
 };
 const official=(id)=>data.catalogoCE[id];
 const ilText=(list)=>list.length?`<ul>${list.map(k=>`<li><b>${esc(k)}</b>: ${esc(data.catalogoIL[k].texto)}</li>`).join('')}</ul>`:'<p>No se propone un indicador adicional para esta jornada.</p>';
 const css=document.createElement('style');css.textContent=`
 .epja-align{background:#ffffff;border:1px solid #d5deed;border-radius:15px;padding:17px;margin:13px 0 16px;color:#1b3155}
 .epja-align h2,.epja-align h3{margin:4px 0 12px;color:#17365e}.epja-align p{line-height:1.6}
 .epja-align summary{cursor:pointer;font-weight:700;color:#234e86}.epja-align details{border-top:1px solid #e0e8f2;margin-top:11px;padding-top:10px}
 .epja-align ul{padding-left:20px;margin:8px 0}.epja-align li{margin:7px 0;line-height:1.5}
 .epja-align a{color:#20518a;font-weight:700}.epja-align .epja-note{font-size:.88rem;color:#5b6981}
 .epja-chip{font-size:.77rem;display:inline-block;padding:4px 9px;border-radius:20px;background:#eef3fa;color:#244c80;margin:3px 4px 3px 0}
 .epja-align .epja-published{color:#1f7159;font-weight:700}.epja-align .epja-planned{color:#866625;font-weight:700}
 .epja-route-goal{margin:8px 0;font-size:.87rem;line-height:1.45;color:#38516f}
 @media(max-width:590px){.epja-align{padding:13px}.epja-align h2{font-size:1.12rem}}
 `;document.head.appendChild(css);
 function descriptionModule(m){const d=data.modulos[String(m)];return `
 <p class="epja-note">Módulo ${['I','II','III','IV'][m-1]} · ${esc(d.encuentros)} encuentros</p>
 <h2>${esc(d.titulo)}</h2>
 <p><b>¿Para qué aprenderemos esto?</b> ${esc(d.proposito)}</p>
 <p><b>Situaciones que trabajaremos:</b> ${esc(d.situacion)}</p>
 <details><summary>Competencias específicas e indicadores prioritarios del módulo</summary>
 <p class="epja-note">Los propósitos son redacciones didácticas del aula. Las competencias específicas y los indicadores se transcriben del Registro de Evaluación. Los vínculos por módulo y encuentro son propuestas de la matriz aprobada, no calificaciones.</p>
 <h3>Competencias principales propuestas</h3><ul>${d.competenciasEspecificas.map(c=>`<li><b>${esc(c.id)} · ${esc(c.fundamental)}</b>: ${esc(c.texto)}</li>`).join('')}</ul>
 <h3>Indicadores prioritarios de este módulo</h3>${ilText(d.ilPrioritarios)}</details>`}
 function updateRoute(){const cards=$('periodCards');if(!cards)return;Array.from(cards.children).forEach((card,i)=>{if(i>=4)return;const d=data.modulos[String(i+1)];let p=card.querySelector('.epja-route-goal');if(!p){p=document.createElement('p');p.className='epja-route-goal';const heading=card.querySelector('h3');if(heading)heading.insertAdjacentElement('afterend',p);else card.prepend(p)}p.textContent=d.proposito;});}
 function drawModule(m){const area=$('encounterCards');if(!area)return;let panel=$('epjaModulePurpose');if(!panel){panel=document.createElement('section');panel.id='epjaModulePurpose';panel.className='epja-align';area.parentNode.insertBefore(panel,area)}panel.innerHTML=descriptionModule(m);
 const guide=document.querySelector('#lista>.notice');if(guide)guide.textContent=m===1?'Los diez encuentros de este módulo cuentan con sus cinco pestañas de aprendizaje, prácticas interactivas y evaluaciones formativas. Puedes regresar a cualquier encuentro habilitado.':'Cada encuentro presenta una guía de organización curricular y sus páginas de referencia. Las lecciones interactivas específicas de este módulo aún no están desarrolladas. Podrás regresar cuando estén disponibles.';
 const el=area.querySelectorAll('article');el.forEach(item=>{const text=item.querySelector('h3')?.textContent||'';const n=Number((text.match(/Encuentro\s+(\d+)/)||[])[1]);if(!n)return;const r=by(m,n);if(!r)return;let p=item.querySelector('.epja-reading-card');if(!p){p=document.createElement('p');p.className='epja-reading-card small';const sub=item.querySelector('p.small.muted');if(sub)sub.insertAdjacentElement('afterend',p);else item.appendChild(p)}p.innerHTML=`<b>Lectura:</b> ${pageLinks(r)} <span class="epja-note">· CE ${esc(r.cePrincipales.join(', '))} · IL ${esc(r.ilPrincipales.join(', '))}</span>`;});
 }
 function encounterPanel(r){return `
 <div class="epja-align" id="epjaEncounterAlign" role="group" aria-label="Referencias y propósitos curriculares del encuentro">
 <p class="epja-note"><b>Encuentro ${r.jornada}</b> · ${esc(r.fecha)} · ${esc(r.codigos.join(', '))}</p>
 <p><b>Aprenderás a:</b> ${esc(r.aprendizaje)}</p>
 <p><b>Libro de Matemática:</b> ${pageLinks(r)}</p>
 <p class="epja-note">${esc(r.nota)}</p>
 <details><summary>Ver competencias, indicadores y evidencias de este encuentro</summary>
 <p class="epja-note">Consulta docente y participante. La vinculación CE/IL procede de la matriz didáctica aprobada: distingue propuesta principal, complementaria y condicional.</p>
 <h3>Competencias específicas principales propuestas</h3><ul>${r.cePrincipales.map(id=>`<li><b>${esc(id)} · ${esc(official(id).fundamental)}</b>: ${esc(official(id).texto)}</li>`).join('')}</ul>
 <h3>Indicadores principales</h3>${ilText(r.ilPrincipales)}
 <h3>Indicadores complementarios</h3>${ilText(r.ilComplementarios)}
 <h3>Indicadores condicionales (solo si la evidencia los demuestra)</h3>${ilText(r.ilCondicionales)}
 <p><b>Conceptos:</b> ${esc(r.conceptos||'—')} · <b>Procedimientos:</b> ${esc(r.procedimientos||'—')}</p>
 <p><b>Evidencia prevista:</b> ${esc(r.evidencia)}</p>
 <p><b>Evaluación:</b> ${esc(r.evaluacion)}. Se integra la participación mediante ${esc(r.actores)}.</p>
 <p class="epja-note">Esta ficha no sustituye las explicaciones, la práctica ni la evaluación formativa. No asigna notas oficiales automáticamente.</p>
 </details></div>`}
 function drawEncounter(m,n){const r=by(m,n);if(!r)return;const section=$('encuentro');let panel=$('epjaEncounterAlign');if(panel)panel.remove();const div=document.createElement('div');div.innerHTML=encounterPanel(r);panel=div.firstElementChild;
 const h=$('encTitle');h.insertAdjacentElement('afterend',panel);
 // Mantener visible la ficha en las lecciones interactivas del módulo I, sin interferir con sus cinco pestañas.
 }
 const priorRender=render;
 render=function(){priorRender();updateRoute()};
 const priorOpenPeriod=openPeriod;
 openPeriod=function(i){priorOpenPeriod(i);drawModule(i+1)};
 const priorOpenEncounter=openEncounter;
 openEncounter=function(i,navigate=true,n=null){priorOpenEncounter(i,navigate,n);const label=$('encEyebrow').textContent;const m=label.match(/Encuentro\s+(\d+)\s+de/);if(m)drawEncounter(i+1,Number(m[1]));};
 updateRoute();
 // render() ya pudo ejecutarse antes de cargar este archivo; el encuentro inicial debe recibir su ficha.
 const initial=$('encEyebrow')?.textContent||'';const m=initial.match(/P([1-4]).*Encuentro\s+(\d+)\s+de/);if(m)drawEncounter(Number(m[1]),Number(m[2]));
 window.EPJA_ALINEACION_UI={modulePurpose:m=>data.modulos[String(m)].proposito,encounter:(m,n)=>by(m,n),refreshRoute:updateRoute};
})();