/* Aula QR EPJA — identidad declarada, no autenticación.
 * Datos mínimos transportados por hash, retirados de la URL al recibirlos.
 * sessionStorage solo en origen GitHub Pages; nunca guardar IDs ni datos sensibles.
 * NO usar esta verificación de interfaz para proteger notas o recursos privados.
 */
(function(){
 'use strict';
 const KEY='epja_identificacion_declarada_v1';
 const ROOT='/aula-qr/';
 const DESTINOS={Primero:'matematica-epja-1ero/',Segundo:'matematica-epja-2do/',Tercero:'matematica-epja-3ero/',Cuarto:'matematica-epja-4to/',Quinto:'matematica-epja-5to/'};
 const current=document.currentScript;
 const cursoEsperado=current&&current.dataset.curso;
 function urlCurso(c){return ROOT+DESTINOS[c]}
 function read(){
   try{
     const raw=sessionStorage.getItem(KEY);
     if(!raw)return null;
     const p=JSON.parse(raw);
     if(!valid(p))return null;
     return p;
   }catch(_){return null;}
 }
 function valid(p){
   return p&&typeof p.nombre==='string'&&p.nombre.trim().length>1&&p.nombre.length<=160&&
     typeof p.curso==='string'&&Object.prototype.hasOwnProperty.call(DESTINOS,p.curso)&&
     typeof p.seccion==='string'&&p.seccion.trim().length>0&&p.seccion.length<=20&&
     /^20[0-9]{2}-20[0-9]{2}$/.test(String(p.anio||''))&&p.v===1;
 }
 let participant=read();
 const hash=location.hash;
 if(hash.startsWith('#epja=')){
   try{
     const incoming=JSON.parse(decodeURIComponent(hash.slice('#epja='.length)));
     if(valid(incoming)){
       participant={v:1,nombre:incoming.nombre.trim(),curso:incoming.curso,seccion:incoming.seccion.trim(),anio:incoming.anio};
       sessionStorage.setItem(KEY,JSON.stringify(participant));
     }
   }catch(_){}
   // El nombre no debe permanecer visible en la barra de direcciones.
   try{history.replaceState(null,'',location.pathname+location.search)}catch(_){}
 }
 function addText(parent,tag,value,cls){
   const n=document.createElement(tag);
   if(cls)n.className=cls;
   n.textContent=value;parent.appendChild(n);return n;
 }
 function addLink(parent,text,url,cls){
   const a=document.createElement('a');a.href=url;a.textContent=text;
   if(cls)a.className=cls;parent.appendChild(a);return a;
 }
 function display(){
   if(!cursoEsperado)return;
   const main=document.querySelector('main');
   const header=document.querySelector('header');
   if(!main||!header)return;
   const b=document.createElement('section');
   b.className='epja-identity';
   b.setAttribute('aria-live','polite');
   if(!participant){
     b.classList.add('epja-identity-warning');
     addText(b,'strong','Antes de entrar al aula, identifícate en Prepara Canástica.');
     addText(b,'p','Esta pestaña no contiene una identificación de participante.','epja-identity-meta');
     addLink(b,'Ir a la portada institucional',ROOT+'prepara-canastica/','epja-identity-action');
     main.hidden=true;
   }else if(participant.curso!==cursoEsperado){
     b.classList.add('epja-identity-warning');
     addText(b,'strong','Estás en el aula de '+cursoEsperado+', pero seleccionaste '+participant.curso+'.');
     addText(b,'p',participant.nombre+' · '+participant.curso+' · sección '+participant.seccion+' · '+participant.anio,'epja-identity-meta');
     addLink(b,'Ir a mi aula de '+participant.curso,urlCurso(participant.curso),'epja-identity-action');
     main.hidden=true;
   }else{
     addText(b,'strong','Identificado como: '+participant.nombre);
     addText(b,'p',participant.curso+' · sección '+participant.seccion+' · año escolar '+participant.anio,'epja-identity-meta');
     addText(b,'p','Identificación declarada; no verifica identidad ni habilita calificaciones.','epja-identity-detail');
     addLink(b,'Cambiar participante',ROOT+'prepara-canastica/','epja-identity-change');
     main.hidden=false;
   }
   // Identificación correcta: bajo el emblema de grado, dentro de la portada.
   // Avisos por ausencia de identificación o curso incorrecto: visibles arriba.
   if(participant&&participant.curso===cursoEsperado){
     const emblema=document.querySelector('#portada .cover, .hero .graphic');
     if(emblema){
       b.classList.add('epja-identity-embedded');
       emblema.appendChild(b);
     }else{
       header.insertAdjacentElement('afterend',b);
     }
   }else{
     header.insertAdjacentElement('afterend',b);
   }
   document.body.classList.remove('epja-identity-loading');
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',display,{once:true});
 else display();
})();
