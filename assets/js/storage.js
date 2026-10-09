/* Datos del prototipo: únicamente almacenamiento local. No enviar datos a servicios externos. */
window.AulaQRStorage={read(key){try{return JSON.parse(localStorage.getItem('aulaqr.v1.'+key))}catch(e){return null}},write(key,value){try{localStorage.setItem('aulaqr.v1.'+key,JSON.stringify(value));return true}catch(e){return false}}};
