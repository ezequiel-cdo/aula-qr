/* Evaluación V2.2. Preguntas inéditas para transferir los criterios practicados. */
const questions=[
{area:'Criterios técnicos',question:'Una política de práctica exige mínimo 15 caracteres. ¿Cuál ejemplo cumple la longitud?',options:['Rio-Verde-2026!','Sol7!','Mesa123'],correct:0,why:'Rio-Verde-2026! tiene al menos 15 caracteres. Cumplir longitud no garantiza que sea impredecible.'},
{area:'Criterios técnicos',question:'Se exige al menos una mayúscula, una minúscula, un número y un símbolo. ¿Cuál ejemplo cumple esas cuatro categorías?',options:['casaverde2026','CasaVerde2026!','CASAVERDE!'],correct:1,why:'CasaVerde2026! contiene las cuatro categorías. La composición por sí sola no garantiza robustez.'},
{area:'Criterios técnicos',question:'Un ejemplo cumple longitud y símbolos, pero contiene una palabra y una fecha fácilmente asociables con la persona. ¿Qué debes concluir?',options:['Es seguro porque pasó la lista de verificación','La fecha basta para hacerlo aleatorio','Cumple algunos requisitos, pero mantiene un patrón previsible'],correct:2,why:'El cumplimiento de una política no equivale a resistencia: la predictibilidad es un riesgo independiente.'},
{area:'Criterios técnicos',question:'Si la longitud mínima configurada cambia de 12 a 16, ¿qué sucede con una clave ficticia de 14 caracteres?',options:['Deja de cumplir el criterio de longitud, aunque su texto no cambie','Automáticamente contiene menos símbolos','Se convierte en una clave filtrada'],correct:0,why:'La conformidad con un requisito seleccionado cambia; el texto y sus demás propiedades no cambian.'},
{area:'Análisis y aplicación',question:'Dos claves ficticias cumplen las cuatro categorías. Una es corta y repetitiva; la otra es larga y generada al azar. ¿Cuál afirmación es mejor?',options:['Ambas son igual de resistentes por cumplir las categorías','La segunda puede ser más resistente porque longitud y generación importan','El símbolo obliga a que ambas tengan la misma resistencia'],correct:1,why:'La longitud y la forma de generación son importantes. Las categorías son apenas una parte del análisis.'},
{area:'Análisis y aplicación',question:'Una clave no contiene símbolos, pero es larga, única y generada aleatoriamente. ¿Qué interpretación es apropiada?',options:['Es necesariamente débil sin símbolos','Debe reutilizarse para poder recordarla','Puede ser robusta; exigir símbolos no es una regla universal'],correct:2,why:'Una contraseña robusta no depende necesariamente de imponer todos los tipos de caracteres.'},
{area:'Análisis y aplicación',question:'Al evaluar una contraseña ficticia, el laboratorio muestra “robustez alta”. ¿Qué sigue siendo desconocido?',options:['Si ya fue expuesta o reutilizada en servicios reales','Su número de caracteres','Si contiene números'],correct:0,why:'Un analizador local heurístico no verifica filtraciones, reutilización ni aleatoriedad real.'},
{area:'Decisiones responsables',question:'Una cuenta secundaria sufre una filtración y la contraseña se usaba también en el correo. ¿Qué conviene hacer?',options:['Esperar al cambio programado','Cambiar credenciales afectadas y reutilizadas y reforzar MFA','Añadir un símbolo a la misma clave compartida'],correct:1,why:'La exposición requiere actuar sobre las cuentas afectadas; las claves únicas y MFA limitan daños.'},
{area:'Decisiones responsables',question:'Recibes un mensaje que pide contraseña y código MFA mediante un enlace inesperado. ¿Qué acción es prudente?',options:['Enviar el código porque MFA es seguro','Abrir el enlace y probar con una clave falsa del trabajo','No compartir datos; acceder al servicio mediante un canal conocido'],correct:2,why:'El phishing también puede solicitar códigos MFA. Verifica el acceso por un canal confiable.'},
{area:'Decisiones responsables',question:'Debes gestionar 20 cuentas distintas. ¿Qué estrategia favorece autonomía y protección?',options:['Un gestor confiable, contraseñas únicas y MFA cuando esté disponible','Una sola contraseña compleja para todo','Contraseñas cortas cambiadas cada semana'],correct:0,why:'La unicidad, el gestor y MFA facilitan una práctica sostenible y responsable.'}
];
const quiz=document.getElementById('quiz'),holder=document.getElementById('questions'),out=document.getElementById('result'),progress=document.getElementById('assessmentProgress');
const storageKey='qr3-integral-v2';
let finished=false;
function buildQuestions(){
  questions.forEach((item,i)=>{
    const field=document.createElement('fieldset'),legend=document.createElement('legend');
    legend.textContent=(i+1)+'. ['+item.area+'] '+item.question;
    field.append(legend);
    item.options.forEach((option,j)=>{
      const label=document.createElement('label'),radio=document.createElement('input');
      radio.type='radio';radio.name='question'+i;radio.value=String(j);radio.required=true;
      label.append(radio,document.createTextNode(' '+option));field.append(label);
    });holder.append(field);
  });
}
function updateProgress(){
  const form=new FormData(quiz),answered=questions.filter((_,i)=>form.has('question'+i)).length;
  progress.textContent=answered+' de '+questions.length+' respondidas';
}
function resultPanel(record,saved){
  out.hidden=false;out.replaceChildren();
  const h=document.createElement('h2');h.textContent='Resultado: '+record.score+' / '+questions.length;out.append(h);
  const p=document.createElement('p');p.textContent=saved?'Evaluación guardada localmente en este dispositivo.':'Advertencia: no se pudo guardar el resultado localmente.';out.append(p);
  const grouped={};
  questions.forEach((q,i)=>{
    (grouped[q.area]??={total:0,correct:0}).total++;
    if(record.answers[i]===q.correct)grouped[q.area].correct++;
  });
  for(const [area,stats] of Object.entries(grouped)){const p=document.createElement('p');p.textContent=area+': '+stats.correct+' de '+stats.total+' correctas';out.append(p)}
  const heading=document.createElement('h3');heading.textContent='Revisión final de respuestas';out.append(heading);
  const list=document.createElement('ol');
  questions.forEach((q,i)=>{
    const li=document.createElement('li'),your=document.createElement('p'),correct=document.createElement('p'),why=document.createElement('p');
    your.textContent='Tu respuesta: '+q.options[record.answers[i]]+(record.answers[i]===q.correct?' (correcta)':' (incorrecta)');
    correct.textContent='Criterio correcto: '+q.options[q.correct];why.textContent=q.why;
    li.append(your,correct,why);list.append(li);
  });out.append(list);
  const note=document.createElement('p');note.textContent='El resultado es un indicador formativo, no una certificación. No se ha enviado al facilitador.';out.append(note);
}
function lockQuestions(){
  finished=true;quiz.querySelectorAll('input,button[type="submit"]').forEach(x=>x.disabled=true);
}
buildQuestions();
quiz.addEventListener('change',updateProgress);
const previous=AulaQRStorage.read(storageKey);
if(previous&&previous.version===2&&Array.isArray(previous.answers)&&previous.answers.length===questions.length&&previous.answers.every(x=>Number.isInteger(x)&&x>=0&&x<=2)){
  previous.answers.forEach((choice,i)=>{
    const radio=quiz.querySelector('input[name="question'+i+'"][value="'+choice+'"]');
    if(radio)radio.checked=true;
  });
  updateProgress();lockQuestions();
  resultPanel(previous,true);
}
quiz.addEventListener('submit',event=>{
  event.preventDefault();
  if(finished)return;
  const form=new FormData(quiz);
  const answers=questions.map((_,i)=>form.has('question'+i)?Number(form.get('question'+i)):null);
  if(answers.some(x=>x===null)){out.hidden=false;out.textContent='Responde todas las situaciones antes de finalizar.';return}
  const score=answers.filter((x,i)=>x===questions[i].correct).length;
  const record={version:2,answers,score,total:questions.length};
  const saved=AulaQRStorage.write(storageKey,record);
  lockQuestions();updateProgress();resultPanel(record,saved);
});
