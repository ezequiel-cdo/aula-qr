const $ = id => document.getElementById(id);
const d = $('decision'), r = $('reason'), feedback = $('feedback');
const previous = AulaQRStorage.read('qr2');
if(previous){ d.value=previous.decision||''; r.value=previous.reason||''; }

// Una estimación didáctica: NO calcula la probabilidad de ruptura ni la entropía real.
function analyzeFictional(s){
  const len=[...s].length,low=s.toLocaleLowerCase('es');
  const pattern=/1234|2345|qwer|asdf|password|contrasena|contraseña|admin|infotep|equipo|2026|welcome|p@ssw0rd|abcd/i;
  const predictable=pattern.test(low)||/(.)\1{2,}/u.test(s);
  const categories=[/[a-záéíóúñ]/.test(s),/[A-ZÁÉÍÓÚÑ]/.test(s),/\d/.test(s),/[^\p{L}\p{N}\s]/u.test(s)].filter(Boolean).length;
  let score=Math.min(70,len*4)+Math.min(15,Math.max(0,categories-1)*5);
  if(len>=15)score+=15;
  if(predictable)score-=30;
  if(len<8)score=Math.min(score,25);
  score=Math.max(0,Math.min(100,Math.round(score)));
  return {score,label:score<35?'Débil (ejemplo)':score<65?'Mejorable (ejemplo)':'Más resistente (ejemplo)',predictable,len};
}
const criteria=[
  ['ruleLength','Longitud mínima',v=>[...v].length>=Number($('minimum').value)],
  ['ruleLower','Contiene minúsculas',v=>/[a-záéíóúñ]/.test(v)],
  ['ruleUpper','Contiene mayúsculas',v=>/[A-ZÁÉÍÓÚÑ]/.test(v)],
  ['ruleDigit','Contiene números',v=>/\d/.test(v)],
  ['ruleSymbol','Contiene símbolos',v=>/[^\p{L}\p{N}\s]/u.test(v)],
  ['rulePattern','Evita patrones previsibles detectables',v=>!(/1234|2345|qwer|asdf|password|contrasena|contraseña|admin|infotep|equipo|2026|welcome|p@ssw0rd|abcd/i.test(v)||/(.)\1{2,}/u.test(v))]
];
function renderAnalysis(){
  const value=$('probe').value, panel=$('strengthPanel'), summary=$('criteriaSummary');
  const min=$('minimum');
  const chosenMin=Math.max(8,Math.min(40,Math.trunc(Number(min.value)||15)));
  min.value=String(chosenMin);
  if(!value){
    panel.hidden=true;
    $('emptyHint').hidden=false;
    $('strengthFill').style.width='0%';
    $('strengthTrack').setAttribute('aria-valuenow','0');
    $('analysis').replaceChildren();
    summary.textContent='';
    $('adaptiveComment').textContent='';
    return;
  }
  panel.hidden=false;
  $('emptyHint').hidden=true;
  const result=analyzeFictional(value);
  const checked=criteria.filter(([id])=>$(id).checked).map(([,label,predicate])=>({label,passed:predicate(value)}));
  const passed=checked.filter(x=>x.passed),failed=checked.filter(x=>!x.passed);
  const count=checked.length;
  summary.textContent=count?'Cumple '+passed.length+' de '+count+' criterios seleccionados.':'Ningún criterio seleccionado: configura tu política para comparar.';
  $('strengthLabel').textContent='Robustez orientativa: '+(result.score<35?'Baja':result.score<65?'Media':'Alta');
  $('strengthScore').textContent=result.score+'/100 · estimación didáctica';
  $('strengthFill').style.width=result.score+'%';
  $('strengthFill').dataset.level=result.score<35?'low':result.score<65?'medium':'high';
  $('strengthTrack').setAttribute('aria-valuenow',String(result.score));
  let comment='';
  if(!count){
    comment='No hay requisitos seleccionados. La barra solo presenta una estimación heurística independiente.';
  }else if(failed.length){
    comment='Cumple '+passed.length+' de '+count+' criterios elegidos. ';
    comment+='Debes revisar: '+failed.map(x=>x.label.toLowerCase()).join(', ')+'. ';
    if(passed.length)comment+='Cumple: '+passed.map(x=>x.label.toLowerCase()).join(', ')+'. ';
  }else{
    comment='Cumple los '+count+' criterios seleccionados. ';
    comment+='Esto solo indica conformidad con esta política de práctica, no seguridad garantizada. ';
  }
  if(result.predictable)comment+='Se observan patrones previsibles: conviene evitarlos incluso si otras reglas se cumplen. ';
  comment+='La robustez estimada es '+(result.score<35?'baja':result.score<65?'media':'alta')+'; no se puede verificar aquí si la clave ha sido filtrada o reutilizada.';
  $('adaptiveComment').textContent=comment;
  $('analysis').replaceChildren(...checked.map(x=>{
    const li=document.createElement('li');
    li.textContent=(x.passed?'Cumple: ':'No cumple: ')+x.label+(x.label==='Longitud mínima'?' ('+result.len+' de '+chosenMin+' caracteres)':'');
    li.className=x.passed?'rule-pass':'rule-fail';
    return li;
  }));
}
$('probe').addEventListener('input',renderAnalysis);
$('probe').addEventListener('change',renderAnalysis);
$('criteria').addEventListener('change',renderAnalysis);
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
