//Link del Json a consultar
let linkPrincipal = "https://pokeapi.co/api/v2/pokemon";
let listaDatos;

//Primera funcion
//-> LLama a ConsultarApi (2)
//-> LLama a cicloElementosPokemon (3)
async function cargarPagina() {
  let pagina = await consultarApi(linkPrincipal);

  let contenido = document.getElementById("container");
  contenido.innerHTML = "";

  let btnGrupo = document.getElementById("btn-group");
  if (pagina.next == null) {
    btnGrupo.innerHTML =
      '<button type="button" id="btn-prev" onclick="anteriorPaginaPokemones()">Anterior</button>';
  }
  if (pagina.previous == null) {
    btnGrupo.innerHTML =
      '<button type="button" id="btn-next" onclick="siguientePaginaPokemones()">Siguiente</button>';
  }
  if (pagina.previous != null && pagina.next != null) {
    btnGrupo.innerHTML =
      '<button type="button" id="btn-prev" onclick="anteriorPaginaPokemones()">Anterior</button><button type="button" id="btn-next" onclick="siguientePaginaPokemones()" >Siguiente</button>';
  }

  await cicloElementosPokemon();
}
//No devuelve nada

// (2) Segunda Funcion -> requiere una url
//-> Usa fetch
async function consultarApi(url) {
  try {
    let objeto = await fetch(url);
    let completoJson = await objeto.json();

    return completoJson;
  } catch (error) {
    console.error(error);
  }
}
//Devuelve un .Json

// (3) Tercera Funcion
//-> LLama a ConsultarApi
//-> Llama a busquedaPokemon (12)
//-> LLama a crearElementosPokemon (4)
//-> LLamar a capitalizar (5)
//-> LLamar a obtenerHabilidades (6)
//-> LLamar a crearCarouselImagenes (7)
//-> LLamar a modificarElementoPokemon (8)
async function cicloElementosPokemon() {
  listaDatos = await busquedaPokemon(linkPrincipal);
  for (let i = 0; i < listaDatos.length; i++) {
    crearElementosPokemon(i);
    let nombre = capitalizar(listaDatos[i].name);

    let objhabilidades = await consultarApi(listaDatos[i].url);
    let audio = objhabilidades.cries.latest;
    let habilidades = objhabilidades.abilities;

    let descripcion = obtenerHabilidades(habilidades);

    let objImagenes = await consultarApi(objhabilidades.forms[0].url);
    let carouselimage = crearCarouselImagenes(objImagenes.sprites, i);

    document.getElementById("gif-carga-" + i).style.display = "none";

    modificarElementoPokemon(nombre, carouselimage, audio, descripcion, i);
  }
}
//No devuelve nada

// (4) Cuarta Funcion -> Indice de la carta
//-> Crea objetos en el Document
function crearElementosPokemon(indice) {
  let contenido = document.getElementById("container");

  let divLocal = document.createElement("div");
  divLocal.className = "card";
  divLocal.style.Width = "18rem";

  let divCarga = document.createElement("div");
  divCarga.id = "gif-carga-" + indice;
  divCarga.className = "gif-carga";
  divCarga.innerHTML = "<div class='lds-ripple'><div></div><div></div></div>";

  let divLinea = document.createElement("div");
  divLinea.className = "row g-0";

  let divColumna_1 = document.createElement("div");
  divColumna_1.className = "col-md-4 col-first";

  let audio = document.createElement("audio");
  audio.className = "audio-pokemon audio-pokemon-" + indice;

  let divColumna_2 = document.createElement("div");
  divColumna_2.className = "col-md-8";

  let divCuerpo = document.createElement("div");
  divCuerpo.className = "card-body";

  let tituloCarta = document.createElement("h5");
  tituloCarta.className = "card-title";

  let textoCarta_1 = document.createElement("p");
  textoCarta_1.id = "card-text-1";
  textoCarta_1.className = "card-text parrafo";

  divLocal.appendChild(divCarga);

  divCuerpo.appendChild(tituloCarta);
  divCuerpo.appendChild(textoCarta_1);
  divColumna_2.appendChild(divCuerpo);

  divColumna_1.appendChild(audio);

  divLinea.appendChild(divColumna_1);
  divLinea.appendChild(divColumna_2);
  divLocal.appendChild(divLinea);

  contenido.appendChild(divLocal);

  //Agregar algunos listeners para que sea mas interactivo
  divLocal.addEventListener("mouseover", () => {
    divLocal.style.cursor = "pointer";
  });

  divLocal.addEventListener("mouseleave", (event) => {
    event.currentTarget.querySelector(".card-text").style.display = "none";
  });

  divLocal.addEventListener("dblclick", async (event) => {
    let pokemon = event.currentTarget
      .querySelector(".card-title")
      .textContent.toLowerCase();
    for (let i of listaDatos) {
      if (i.name.toLowerCase() == pokemon) {
        localStorage.setItem("url", i.url);
        localStorage.setItem("nombre", capitalizar(i.name));
        localStorage.setItem(
          "carousel",
          event.currentTarget.querySelector(".col-md-4").innerHTML
        );
        localStorage.setItem(
          "texto1",
          event.currentTarget.querySelector("#card-text-1").innerHTML
        );
        let respuesta = await datosImportantes(i.url);
        localStorage.setItem("texto2", respuesta);
      }
    }
    if (
      event.target.className != "d-block w-100" &&
      event.target.className != "carousel-control-next-icon" &&
      event.target.className != "carousel-control-prev-icon"
    ) {
      pantallaFlotante();
    }
  });

  divLocal.addEventListener("click", (event) => {
    if (
      event.target.className != "d-block w-100" &&
      event.target.className != "carousel-control-next-icon" &&
      event.target.className != "carousel-control-prev-icon"
    ) {
      event.currentTarget.querySelector(".card-text").style.display = "block";
    }
  });
}
//No devuelve nada

// (5) Quinta Funcion -> str para capitalizar
function capitalizar(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
//Devuelve String primera en Mayuscula

// (6) Sexta Funcion -> lista con las habilidades
function obtenerHabilidades(lista) {
  let texto = "Algunas habilidades:<br/>";

  for (let habilidad of lista) {
    texto += `- ${habilidad.ability.name}<br/>`;
  }

  return texto;
}
//Devuelve String con las habilidades de la lista

// (7) Septima Funcion -> (Objeto que contiene url de las imagenes , indice de las imagenes )
function crearCarouselImagenes(NoImagenes, indice) {
  let divCarousel = document.createElement("div");
  divCarousel.className = "carousel slide carousel-fade";
  divCarousel.id = "carouselExampleFade-" + indice;
  divCarousel.style.background = "#bfbfbf";

  let carouselInner = document.createElement("div");
  carouselInner.className = "carousel-inner";

  let contador = 0;
  for (let srcImagen in NoImagenes) {
    if (NoImagenes[srcImagen] != null) {
      carouselItem = document.createElement("div");
      if (srcImagen == "front_default") {
        carouselItem.className = "carousel-item active";
      } else {
        carouselItem.className = "carousel-item";
      }

      let image = document.createElement("img");
      image.src = NoImagenes[srcImagen];
      image.className = "d-block w-100";

      image.addEventListener("click", function () {
        document.querySelector(".audio-pokemon-" + indice).play();
      });

      carouselItem.appendChild(image);
      carouselInner.appendChild(carouselItem);

      contador++;
    }
  }

  divCarousel.appendChild(carouselInner);

  btn1 = document.createElement("button");
  btn1.className = "carousel-control-prev";
  btn1.type = "button";
  btn1.setAttribute("data-bs-target", "#carouselExampleFade-" + indice);
  btn1.setAttribute("data-bs-slide", "prev");
  btn1.innerHTML =
    "<span class='carousel-control-prev-icon' aria-hidden='true'></span><span class='visually-hidden'>Previous</span>";

  btn2 = document.createElement("button");
  btn2.className = "carousel-control-next";
  btn2.type = "button";
  btn2.setAttribute("data-bs-target", "#carouselExampleFade-" + indice);
  btn2.setAttribute("data-bs-slide", "next");
  btn2.innerHTML =
    "<span class='carousel-control-next-icon' aria-hidden='true'></span><span class='visually-hidden'>Previous</span>";

  divCarousel.appendChild(btn1);
  divCarousel.appendChild(btn2);

  return divCarousel;
}
// Devuelve un div con el carrousel de imagen

// (8) Octava Funcion -> Informacion en general ( nombre, carrousel, audio, descripcion, indice de la carta)
//-> obtenerObjetosHtml (9)
function modificarElementoPokemon(
  nombre,
  carouselimagen,
  audio,
  descripcion,
  indice
) {
  let [objTitulo, objImagen, objAudio, objDescripcion] =
    obtenerObjetosHtml(indice);

  objTitulo.textContent = nombre;
  objImagen.appendChild(carouselimagen);
  objAudio.src = audio;
  objDescripcion.innerHTML = descripcion;
}
//No devuelve nada

// (9) Novena Funcion -> indice de la carta
function obtenerObjetosHtml(indice) {
  let elementos = document.querySelectorAll(".card");
  let elementoParticular = elementos[indice];

  let objTitulo = elementoParticular.querySelector(".card-title");
  let objImagen = elementoParticular.querySelector(".col-md-4");
  let objAudio = elementoParticular.querySelector(".audio-pokemon");
  let objDescripcion = elementoParticular.querySelector(".parrafo");

  return [objTitulo, objImagen, objAudio, objDescripcion];
}
// Devuelve un array con los objetos html de la carta

// (10) decima Funcion -> siguiente pagina
//-> consultarApi
//-> cargarPagina
async function siguientePaginaPokemones() {
  let pagina = await consultarApi(linkPrincipal);
  linkPrincipal = pagina.next;
  cargarPagina();
}
// No devuelve nada

// (11) onceaba Funcion -> pagina anterior
//-> consultarApi
//-> cargarPagina
async function anteriorPaginaPokemones() {
  let pagina = await consultarApi(linkPrincipal);
  linkPrincipal = pagina.previous;
  cargarPagina();
}
// No devuelve nada

// (12) doceaba Funcion -> LinkPrincipal
async function busquedaPokemon(linkParametro) {
  textoBusqueda = document.getElementById("pokemon-input").value;
  listaPokemonesCrear = [];
  linkSimulado = linkParametro;

  let divCarga = document.createElement("div");
  divCarga.id = "gif-carga";
  divCarga.innerHTML = "<div class='lds-ripple'><div></div><div></div></div>";
  document.getElementById("container").appendChild(divCarga);
  if (textoBusqueda != "") {
    while (listaPokemonesCrear.length < 20) {
      let info = await consultarApi(linkSimulado);
      for (let posibleObj of info.results) {
        if (
          posibleObj.name.toLowerCase().includes(textoBusqueda.toLowerCase())
        ) {
          listaPokemonesCrear.push(posibleObj);
        }
      }
      if (info.next) {
        linkSimulado = info.next;
      } else {
        break;
      }
    }
    document.getElementById("container").innerHTML = "";
    return listaPokemonesCrear;
  } else {
    let info = await consultarApi(linkParametro);
    document.getElementById("container").innerHTML = "";
    return info.results;
  }
}
// Devuelve un array con los objetos json de los pokemones buscados

// (13) Treceaba Funcion -> link de habilidades del pokemon
// consultarApi
async function datosImportantes(linkPokemon) {
  let datos = await consultarApi(linkPokemon);

  texto = [
    "Peso: " + datos.weight,
    "Altura: " + datos.height,
    "Experiencia Base: " + datos.base_experience,
    "Id: " + datos.id,
  ];
  let respuesta = document.createElement("div");
  for (let carac of texto) {
    let peque = document.createElement("small");
    peque.textContent = carac;

    respuesta.appendChild(peque);
    respuesta.appendChild(document.createElement("br"));
  }

  return respuesta.innerHTML;
}
// Devuelve un array con los datos importantes del pokemon

//(14) Catorceaba Funcion
function pantallaFlotante() {
  document.querySelector(".window-notice").style.display = "flex";

  //Elementos que se mandan de la otra pagina
  let nombre = localStorage.getItem("nombre");
  let carousel = localStorage.getItem("carousel");
  let texto1 = localStorage.getItem("texto1");
  let texto2 = localStorage.getItem("texto2");

  document.querySelector(".carousel-float").innerHTML = carousel;
  document.querySelector(".card-title-float").textContent = nombre;
  document.querySelector(".text1-float").innerHTML = texto1;

  document.querySelector(".text-body-secondary-float").innerHTML = texto2;
}

//Add Event Listener
document.getElementById("pokemon-input").addEventListener("change", () => {
  cargarPagina();
});

document.getElementById("search-btn").addEventListener("click", () => {
  cargarPagina();
});
document.querySelector(".btn-close").addEventListener("click", () => {
  localStorage.clear();
  document.querySelector(".window-notice").style.display = "none";
});

cargarPagina();
