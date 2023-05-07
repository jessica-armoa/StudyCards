
/*Elementos del DOM*/
const select_estudiar = document.getElementById("op-estudiar");
const card = document.getElementById('card');
const btn_anterior = document.getElementById('anterior');
const btn_girar = document.getElementById('girar');
const btn_siguiente = document.getElementById('siguiente');
const add_tema = document.getElementById('add-tema');

const ventanaEmergente = document.getElementById('ventana-emergente');
const guardarTemaBtn = document.getElementById('guardar-tema');
const cancelarTemaBtn = document.getElementById('cancelar-tema');
const leftSection = document.getElementById('left');
const rightSection = document.getElementById('right');
const inputTituloHoja = document.getElementById('titulo-hoja');


/*Variables generales*/
let btn_girar_boolean = false;
let btn_anterior_boolean = false;
let btn_siguiente_boolean = false;
let pregunta_actual = 0;
let tema_actual = "ProgramacionWebInicial";
let diccionario = {};
let temas;
let values;//Datos actuales dependiendo del tema elegido
let datos;//datos que trae el fetch en cada nueva consulta
let clickAggTema = false;

let NAME_SHEET = "ProgramacionWebInicial";

llamadaAPI(iniciar,NAME_SHEET);

/*Funciones*/
function llamadaAPI(callback,name_sheet) {
  // Parsed Format
  fetch(`https://sheet.best/api/sheets/1e99f153-90ed-4f36-8578-634c8957c494/tabs/${name_sheet}`)
    .then((response) => response.json())
    .then((data) => {
      datos = data;
      values = datos.slice();
      console.log(values)
      console.log(values[2]['Pregunta']);
      diccionario[name_sheet] = datos;
      localStorage.setItem("diccionario", JSON.stringify(diccionario));
      diccionario = JSON.parse(localStorage.getItem("diccionario"));
      console.log("Diccionario");
      console.log(diccionario);

      temas = Object.keys(diccionario);
      console.log("Todos los temas");
      console.log(temas);

      //Guardando valores actuales
      values = datos.slice();
      console.log(values);
      ordenado = values.slice();
      desordenado = values.slice();
      callback();
    })
    .catch((error) => {
      console.error(error);
    });
}

function iniciar(){
  actualizarTemas();
  reiniciarCard();
}

function reiniciarCard(){
  pregunta_actual = 0;
  card.textContent = values[pregunta_actual]["Pregunta"];
}

function actualizarTemas(){
  console.log("Click en actualizar temas " + clickAggTema);
  // Seleccionar todos los elementos a eliminar
  const elementosAEliminar = leftSection.querySelectorAll('.tema');

  // Recorrer la lista de elementos y eliminarlos uno por uno
  elementosAEliminar.forEach(function (elemento) {
    elemento.remove();
  });

  //Nuevos temas
  temas = Object.keys(diccionario);
  console.log(diccionario);
  console.log("temas");
  console.log(temas);
  const primerTema = temas[0];
  const ultimoTema = temas.length>1 ? temas[temas.length-1] : '';
  console.log('primerTema: ' + primerTema,'ultimoTema: '+ultimoTema);
  temas.forEach(tema => {
    const nuevoTema = document.createElement('p');
    nuevoTema.textContent = formatTema(tema);
    nuevoTema.classList.add('tema');
    // Agrega la clase 'tema_actual' al primer elemento del array
    console.log('tema === ultimoTema', tema === ultimoTema);
    console.log('clickAggTema',clickAggTema)

    console.log('segundo ifff', tema === ultimoTema && clickAggTema)
    if (tema === primerTema && !clickAggTema){
      nuevoTema.classList.add('tema_actual');
    }
    else if (tema === ultimoTema && clickAggTema) {
      nuevoTema.classList.add('tema_actual');
      clickAggTema = false;
    }

    leftSection.insertBefore(nuevoTema, add_tema);

    nuevoTema.addEventListener('click', () => {
      // Quita la clase 'tema_actual' de todos los elementos 'p' en la sección izquierda
      document.querySelectorAll('.tema').forEach(elem => elem.classList.remove('tema_actual'));
      // Agrega la clase 'tema_actual' al elemento 'p' clickeado
      nuevoTema.classList.add('tema_actual');
      //Actualizar temas y card
      values = diccionario[tema];
      console.log("Flascards actuales: ");
      console.log(values);
      ordenado = values.slice();
      desordenado = values.slice();
      reiniciarCard();
    });
  });
}

function formatTema(nameSheet){
  // Divide el string en palabras utilizando una expresión regular
  const palabras = nameSheet.match(/[A-Z][a-z]+/g);
  if (!palabras || palabras.length === 0) {
    // Devuelve el string original en mayúsculas
    return nameSheet;
  }
  // Une las palabras con espacios y mayúsculas iniciales
  const resultado = palabras.map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1)).join(' ');
  return resultado;
}

//Listeners

document.addEventListener("DOMContentLoaded", () => {
  if (!values) {
    card.textContent = "Agregue un tema para estudiar"
  }

  ventanaEmergente.style.display = "none";
});

select_estudiar.addEventListener("change", function() {
  console.log("El valor seleccionado es: " + select_estudiar.value);
  desordenado.sort(() => { return Math.random() - 0.5 });
  values = select_estudiar.value == "leer-desordenado" ? desordenado : ordenado;
  console.log(values);
  btn_girar_boolean = false;
  reiniciarCard();
});

btn_girar.addEventListener('click', () => {
  btn_girar_boolean = !btn_girar_boolean;
  card.textContent = btn_girar_boolean? values[pregunta_actual]["Respuesta"] : values[pregunta_actual]["Pregunta"];
});

btn_anterior.addEventListener('click', () => {
  btn_anterior_boolean = !btn_anterior_boolean;
  pregunta_actual = pregunta_actual==0? values.length-1 : pregunta_actual-1;
  card.textContent = values[pregunta_actual]["Pregunta"];
});

btn_siguiente.addEventListener('click', () => {
  btn_siguiente_boolean = !btn_siguiente_boolean;
  pregunta_actual = pregunta_actual == values.length-1 ? 0 : pregunta_actual + 1;
  card.textContent = values[pregunta_actual]["Pregunta"];
});

add_tema.addEventListener('click', function () {
  clickAggTema = true;
  console.log("Click en evento " + clickAggTema);
  ventanaEmergente.style.display = 'block';
  leftSection.classList.add('blur');
  rightSection.classList.add('blur');
});

guardarTemaBtn.addEventListener('click', function () {
  let nuevoTema = inputTituloHoja.value;
  console.log(nuevoTema);
  llamadaAPI(iniciar,nuevoTema);

  ventanaEmergente.style.display = 'none';
  leftSection.classList.remove('blur');
  rightSection.classList.remove('blur');
});

cancelarTemaBtn.addEventListener('click', function () {
  ventanaEmergente.style.display = 'none';
  leftSection.classList.remove('blur');
  rightSection.classList.remove('blur');
});



