const $ = id => document.getElementById(id);
const d = $('decision'), r = $('reason'), feedback = $('feedback');
const previous = AulaQRStorage.read('qr2');
if(previous){ d.value=previous.decision||''; r.value=previous.reason||''; }

// Una estimación didáctica: NO calcula la probabilidad de ruptura ni la entropía real.
function analyzeFictional(s){
  const len=[...s].length,low=s.toLocaleLowerCase('es');
  const patterns=/1234|2345|qwer|asdf|password|contrasena|contraseña|admin|infotep|equipo|2026|welcome|p@ssw0rd|abcd/i;
  const repeated=/(.)\1{2,}/u.test(s);
  const predictable=patterns.test(low)||repeated;
  const groups=[/[a-záéíóúñ]/i.test(s),/[A-ZÁÉÍÓÚÑ]/.test(s),/\d/.test(s),/[^\p{L}\p{N}\s]/u.test(s)].filter(Boolean).length;
  // Puntuación heurística, para comparar ejemplos en el aula únicamente.
  let score=Math.min(70,len*4)+Math.min(15,Math.max(0,groups-1)*5);
  if(len>=15)score+=15;
  if(predictable)score-=30;
  if(len<8)score=Math.min(score,25);
  score=Math.max(0,Math.min(100,Math.round(score)));
  const label=score<35?'Débil (ejemplo)':score<65?'Mejorable (ejemplo)':'Más resistente (ejemplo)';
  const observations=[
    len<15?'Longitud: '+len+' caracteres. Para contraseñas como factor único, toma 15 o más como referencia.':'Longitud: '+len+' caracteres; una longitud mayor ayuda frente a intentos de adivinación.',
    predictable?'Se detectaron patrones previsibles, como fechas, palabras comunes o repeticiones.':'No se detectaron algunos patrones comunes de este laboratorio; eso no asegura que sea impredecible.',
    groups>1?'Contiene varios tipos de caracteres; la diversidad no reemplaza longitud, unicidad ni aleatoriedad.':'Considera cómo se eligió el ejemplo: la imprevisibilidad importa más que imponer símbolos.',
    'No puede analizarse desde aquí si la clave se reutiliza o ha sido filtrada.'
  ];
  return {score,label,observations};
}
function renderAnalysis(){
  const text=$('probe').value,panel=$('strengthPanel');
  if(!text){panel.hidden=true;$('strengthFill').style.width='0%';$('strengthTrack').setAttribute('aria-valuenow','0');$('analysis').replaceChildren();return}
  const result=analyzeFictional(text);
  panel.hidden=false;
  $('strengthLabel').textContent=result.label;
  $('strengthScore').textContent=result.score+'/100 · indicador didáctico';
  $('strengthFill').style.width=result.score+'%';
  $('strengthFill').dataset.level=result.score<35?'low':result.score<65?'medium':'high';
  $('strengthTrack').setAttribute('aria-valuenow',String(result.score));
  $('analysis').replaceChildren(...result.observations.map(note=>{const li=document.createElement('li');li.textContent=note;return li}));
}
$('probe').addEventListener('input',renderAnalysis);
$('probe').addEventListener('change',renderAnalysis);
$('tryExample').addEventListener('click',()=>{$('probe').value='Equipo2026!';renderAnalysis();});
$('clearProbe').addEventListener('click',()=>{$('probe').value='';renderAnalysis();$('probe').focus()});

const words=['bosque','nube','cobre','rio','lago','mapa','tigre','puente','mango','faro','luna','campo','arena','taller','costa','valle'];
function rand(max){if(!globalThis.crypto?.getRandomValues)throw Error('Aleatoriedad segura no disponible');const range=4294967296,limit=range-range%max,a=new Uint32Array(1);do{crypto.getRandomValues(a)}while(a[0]>=limit);return a[0]%max}
function sample(chars){return chars[rand(chars.length)]}
$('mode').onchange=()=>{const phrase=$('mode').value==='phrase';$('length').min=phrase?4:15;$('length').max=phrase?7:40;$('length').value=phrase?5:20};
$('generate').onclick=()=>{try{
  const phrase=$('mode').value==='phrase',n=Number($('length').value);
  if(!Number.isInteger(n)||n<(phrase?4:15)||n>(phrase?7:40))throw Error('Longitud no válida');
  const pool='abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%*+-=?';
  $('generated').textContent=phrase?Array.from({length:n},()=>words[rand(words.length)]).join('-'):Array.from({length:n},()=>sample(pool)).join('');
  $('generatorNote').textContent=phrase?'Solo demostración didáctica: diccionario demasiado pequeño para secretos reales.':'Ejemplo aleatorio creado localmente con crypto.getRandomValues. No se guarda ni se transmite.';
}catch(e){$('generatorNote').textContent='No fue posible generar de manera segura: '+e.message}};
$('check').onclick=()=>{
  if(!d.value||!r.value.trim()){feedback.textContent='Selecciona una opción y justifica tu decisión.';return}
  const ok=AulaQRStorage.write('qr2',{decision:d.value,reason:r.value});
  feedback.textContent=(ok?'':'No se pudo guardar la respuesta. ')+(d.value==='b'?'Correcto: una contraseña diferente por servicio evita la reutilización; MFA añade protección.':'Vuelve a considerar el riesgo de reutilización: la mejor decisión es usar claves únicas y activar MFA.');
};
