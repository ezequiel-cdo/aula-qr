const quiz=document.getElementById('quiz');
const out=document.getElementById('result');
const key=['b','c','a','b'];
const explanations=[
  '1. Unicidad: las credenciales filtradas no deben abrir otras cuentas.',
  '2. Phishing: no compartir contraseñas ni códigos; acceder por rutas verificadas.',
  '3. Autonomía: gestor de claves únicas y MFA.',
  '4. Incidente: cambiar credenciales expuestas y revisar sesiones y accesos.'
];
let done=false;
function renderResult(record,saved){
  out.hidden=false;
  out.replaceChildren();
  const heading=document.createElement('h2');
  heading.textContent='Resultado: '+record.score+'/'+key.length;
  out.append(heading);
  const status=document.createElement('p');
  status.textContent=saved?'Resultado guardado en este dispositivo.':'Advertencia: no fue posible guardar el resultado.';
  out.append(status);
  const details=document.createElement('ul');
  explanations.forEach(explanation=>{
    const item=document.createElement('li');
    item.textContent=explanation;
    details.append(item);
  });
  out.append(details);
}
function showCompleted(record){
  done=true;
  record.answers.forEach((choice,i)=>{
    const selected=quiz.querySelector('input[name="q'+(i+1)+'"][value="'+choice+'"]');
    if(selected)selected.checked=true;
  });
  quiz.querySelectorAll('input,button[type="submit"]').forEach(el=>el.disabled=true);
  renderResult(record,true);
}
const previous=AulaQRStorage.read('qr3');
if(previous && Array.isArray(previous.answers) && previous.answers.length===key.length &&
  previous.answers.every((v,i)=>['a','b','c'].includes(v)) &&
  Number.isInteger(previous.score) && previous.score>=0 && previous.score<=key.length){
  showCompleted(previous);
}
quiz.addEventListener('submit',event=>{
  event.preventDefault();
  if(done)return;
  const form=new FormData(quiz);
  const answers=key.map((_,i)=>form.get('q'+(i+1)));
  if(answers.some(v=>!v)){out.hidden=false;out.textContent='Completa todas las respuestas.';return}
  const score=answers.reduce((total,value,i)=>total+(value===key[i]?1:0),0);
  const record={answers,score,total:key.length};
  const saved=AulaQRStorage.write('qr3',record);
  done=true;
  quiz.querySelectorAll('input,button[type="submit"]').forEach(el=>el.disabled=true);
  renderResult(record,saved);
});
