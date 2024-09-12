//Link del Json a consultar

let linkPrincipal = "https://pokeapi.co/api/v2/pokemon";
let listaDatos;

//-> LLama a ConsultarApi
//-> LLama a cicloElementosPokemon
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

// (1) -> requiere una url
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

//-> LLama a ConsultarApi
//-> Llama a busquedaPokemon
//-> LLama a crearElementosPokemon
//-> LLamar a capitalizar
//-> LLamar a crearCarouselImagenes
// -> LLamar a colorearCard
//-> LLamar a modificarElementoPokemon
async function cicloElementosPokemon() {
  listaDatos = await busquedaPokemon(linkPrincipal);
  for (let i = 0; i < listaDatos.length; i++) {
    crearElementosPokemon(i);
    let nombre = capitalizar(listaDatos[i].name);

    let objhabilidades = await consultarApi(listaDatos[i].url);
    let audio = objhabilidades.cries.latest;

    let types = objhabilidades.types;
    let textoTypes = obtenerTypes(types);

    let carouselimage = crearCarouselImagenes(objhabilidades.sprites, i);

    let idPokemon = objhabilidades.id;

    let species = await consultarApi(objhabilidades.species.url);
    let colorBackGround = species.color.name;

    colorearCard(i, colorBackGround);

    document.getElementById("gif-carga-" + i).style.display = "none";

    modificarElementoPokemon(
      nombre,
      carouselimage,
      audio,
      textoTypes,
      idPokemon,
      i
    );
  }
}
//No devuelve nada

//() -> recibe un indice
//-> Crea objetos en el Document
//-> Llama a capitalizar
//-> Llama a datosImportantes
//-> Llama a consultarApi
//-> Llama a pantallaFlotante
//-> Llama a isMobile
//-> Llama a autoCarousel
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

  let id = document.createElement("h7");
  id.className = "card-id";

  let textoCarta_1 = document.createElement("p");
  textoCarta_1.id = "card-text-1";
  textoCarta_1.className = "card-text parrafo";

  let btnAux = document.createElement("button");
  btnAux.className = "btn-aux-more";
  btnAux.textContent = "Ver mas...";

  divLocal.appendChild(divCarga);

  divCuerpo.appendChild(tituloCarta);
  divCuerpo.appendChild(id);
  divCuerpo.appendChild(textoCarta_1);

  divCuerpo.appendChild(btnAux);
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
    event.currentTarget.querySelector(".btn-aux-more").style.display = "none";

    event.currentTarget.classList.remove("div-local-seleccionado");
  });

  btnAux.addEventListener("click", (event) => {
    let lugar = event.target.parentNode.parentNode.parentNode.parentNode;
    let dblClickEvent = new MouseEvent("dblclick", {
      bubbles: true,
      cancelable: true,
    });
    lugar.dispatchEvent(dblClickEvent);
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

        let data = await consultarApi(i.url);
        let species = await consultarApi(data.species.url);
        let colorBackGround = species.color.name;
        localStorage.setItem("colorFondo", colorBackGround);
      }
    }
    if (
      event.target.className != "d-block w-100" &&
      event.target.className != "carousel-control-next-icon" &&
      event.target.className != "carousel-control-prev-icon"
    ) {
      let div = document.querySelector(".div-local-seleccionado");
      div.classList.remove("div-local-seleccionado");
      pantallaFlotante();
    }
  });

  divLocal.addEventListener("click", (event) => {
    if (
      event.target.className != "d-block w-100" &&
      event.target.className != "carousel-control-next-icon" &&
      event.target.className != "carousel-control-prev-icon"
    ) {
      if (isMobile()) {
        event.currentTarget.querySelector(".btn-aux-more").style.display =
          "block";
      }
      event.currentTarget.querySelector(".card-text").style.display = "block";
      event.currentTarget.classList.add("div-local-seleccionado");
      autoCarousel();
    }
  });
}
//No devuelve nada

// (1) -> str para capitalizar
function capitalizar(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
//Devuelve String primera en Mayuscula

// (1) -> lista con las habilidades
function obtenerTypes(lista) {
  let div = document.createElement("div");

  for (let type of lista) {
    let span = document.createElement("span");
    span.className = "type-" + type.type.name;
    span.classList.add("type-pokemon");
    span.textContent = type.type.name;
    div.appendChild(span);
  }

  return div.innerHTML;
}
//Devuelve String con las habilidades de la lista

// (2) -> (Objeto que contiene url de las imagenes , indice de las imagenes )
function crearCarouselImagenes(NoImagenes, indice) {
  let divCarousel = document.createElement("div");
  divCarousel.className = "carousel slide carousel-fade";
  divCarousel.id = "carouselExampleFade-" + indice;

  let carouselInner = document.createElement("div");
  carouselInner.className = "carousel-inner";

  let contador = 0;
  for (let srcImagen in NoImagenes) {
    if (srcImagen == "other") {
      NoImagenes[srcImagen] =
        NoImagenes[srcImagen][["official-artwork"]]["front_default"];
    }
    if (
      NoImagenes[srcImagen] != null &&
      typeof NoImagenes[srcImagen] != "object"
    ) {
      carouselItem = document.createElement("div");
      if (srcImagen == "other") {
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
    "<span class='carousel-control-next-icon' aria-hidden='true'></span><span class='visually-hidden'>Next</span>";

  divCarousel.appendChild(btn1);
  divCarousel.appendChild(btn2);

  return divCarousel;
}
// Devuelve un div con el carrousel de imagen

// (6) -> Informacion en general ( nombre, carrousel, audio, descripcion, indice de la carta)
////-> Llama a obtenerObjetosHtml
function modificarElementoPokemon(
  nombre,
  carouselimagen,
  audio,
  textoTypes,
  idPokemon,
  indice
) {
  let [objTitulo, objPokemon, objImagen, objAudio, objDescripcion] =
    obtenerObjetosHtml(indice);

  objTitulo.textContent = nombre;
  objPokemon.textContent = "#" + idPokemon;
  objImagen.appendChild(carouselimagen);
  objAudio.src = audio;
  objDescripcion.innerHTML = textoTypes;
}
//No devuelve nada

// (1) -> indice de la carta
function obtenerObjetosHtml(indice) {
  let elementos = document.querySelectorAll(".card");
  let elementoParticular = elementos[indice];

  let objTitulo = elementoParticular.querySelector(".card-title");
  let objPokemon = elementoParticular.querySelector(".card-id");
  let objImagen = elementoParticular.querySelector(".col-md-4");
  let objAudio = elementoParticular.querySelector(".audio-pokemon");
  let objDescripcion = elementoParticular.querySelector(".parrafo");

  return [objTitulo, objPokemon, objImagen, objAudio, objDescripcion];
}
// Devuelve un array con los objetos html de la carta

// (2) -> (Indice de la card, color que se le aplica en texto)
//-> Llama a mapColorToHex
function colorearCard(indice, color) {
  let elementos = document.querySelectorAll(".card");
  let elementoParticular = elementos[indice];

  elementoParticular.style.backgroundColor = mapColorToHex(color);
}
//No devuelve nada

// (1) -> (color en texto que se le va a aplicar)
//-> Llama a mapColorToHex
function colorearCardWindow(color) {
  let elementoParticular = document
    .querySelector(".window-notice")
    .querySelector(".carousel-float");
  elementoParticular.style.backgroundColor = mapColorToHex(color);
}

// (1) -> Color en texto
function mapColorToHex(color) {
  // Mapeo de colores a sus códigos hexadecimales más claros y pastel
  // Mapeo de colores a sus códigos hexadecimales para que se asemejen más a los de la imagen
  // Mapeo de colores a sus códigos RGBA para que sean translúcidos
  const colorMap = {
    black: "rgba(109, 109, 109, 0.4)", // Negro grisáceo, 80% opaco
    blue: "rgba(118, 189, 254, 0.4)", // Azul claro y brillante, 80% opaco
    brown: "rgba(214, 124, 84, 0.4)", // Marrón cálido, 80% opaco
    gray: "rgba(189, 195, 199, 0.4)", // Gris suave, 80% opaco
    green: "rgba(72, 208, 176, 0.4)", // Verde vibrante, 80% opaco
    pink: "rgba(247, 120, 180, 0.4)", // Rosa intenso, 80% opaco
    purple: "rgba(159, 91, 186, 0.4)", // Púrpura vibrante, 80% opaco
    red: "rgba(251, 108, 108, 0.4)", // Rojo vivo, 80% opaco
    white: "rgba(255, 255, 255, 0.4)", // Blanco, 80% opaco
    yellow: "rgba(255, 216, 111, 0.4)", // Amarillo cálido, 80% opaco
  };
  return colorMap[color] || "rgba(255, 255, 255, 0.4)"; // Color blanco por defecto con transparencia
}
//devuelve el codifgo del color

//-> consultarApi
//-> cargarPagina
async function siguientePaginaPokemones() {
  let pagina = await consultarApi(linkPrincipal);
  linkPrincipal = pagina.next;
  cargarPagina();
}
// No devuelve nada

//-> consultarApi
//-> cargarPagina
async function anteriorPaginaPokemones() {
  let pagina = await consultarApi(linkPrincipal);
  linkPrincipal = pagina.previous;
  cargarPagina();
}
// No devuelve nada

// (1) -> LinkPrincipal
//-> Llama a consultarApi
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

// (1) -> link de habilidades del pokemon
//-> Llama a consultarApi
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

//-> Llama a corregirCarousel
//-> Llama a colorearCardWindow
//-> Llama a autocarousel
function pantallaFlotante() {
  document.querySelector(".window-notice").style.display = "flex";

  //Elementos que se mandan de la otra pagina
  let nombre = localStorage.getItem("nombre");

  let carousel = corregirCarousel();
  let texto1 = localStorage.getItem("texto1");
  let texto2 = localStorage.getItem("texto2");

  document.querySelector(".carousel-float").innerHTML = carousel;
  document.querySelector(".card-title-float").textContent = nombre;
  document.querySelector(".text1-float").innerHTML = texto1;

  document.querySelector(".text-body-secondary-float").innerHTML = texto2;

  let div = document.querySelector(".window-notice");
  div.querySelector(".carousel-inner").addEventListener("click", () => {
    div.querySelector(".audio-pokemon").play();
  });
  div.classList.add("div-local-seleccionado");

  colorearCardWindow(localStorage.getItem("colorFondo"));

  autoCarousel();
}
//No devuelve nada

function isMobile() {
  return (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/BlackBerry/i)
  );
}
//Devuelve un booleano

//-> Llama a isMobile
//-> Llama a autocarousel
function autoCarousel() {
  try {
    let divLocal = document.querySelector(".div-local-seleccionado");

    if (isMobile()) {
      let clickEvent = new MouseEvent("click");
      divLocal
        .querySelector(".carousel-control-next")
        .dispatchEvent(clickEvent);

      setTimeout(() => {
        autoCarousel();
      }, 3000);
    }
  } catch (error) {
    console.error("Error basico" + error);
  }
}
//No devuelve nada

function corregirCarousel() {
  let div = document.createElement("div");
  div.innerHTML = localStorage.getItem("carousel");
  let divCarousel = div.querySelector(".carousel-fade");
  let btn1 = div.querySelector(".carousel-control-prev");
  let btn2 = div.querySelector(".carousel-control-next");

  divCarousel.id = "float-pokemon";
  btn1.setAttribute("data-bs-target", "#float-pokemon");
  btn2.setAttribute("data-bs-target", "#float-pokemon");

  return div.innerHTML;
}
// Devuelve un div que es el carousel corregido

//Add Event Listeners
document.getElementById("pokemon-input").addEventListener("change", () => {
  cargarPagina();
});

document.getElementById("search-btn").addEventListener("click", () => {
  cargarPagina();
});

document.querySelector("#btn-close").addEventListener("click", () => {
  localStorage.clear();
  document.querySelector(".window-notice").style.display = "none";
  document
    .querySelector(".window-notice")
    .classList.remove("div-local-seleccionado");
});

document.querySelector("h1").addEventListener("click", () => {
  linkPrincipal = "https://pokeapi.co/api/v2/pokemon";
  cargarPagina();
});

// Mostrar el modal automáticamente cuando la página cargue
window.addEventListener("load", function () {
  var tourModal = new bootstrap.Modal(document.getElementById("tourModal"));
  tourModal.show();
});

//primeraVezPagina();
cargarPagina();
