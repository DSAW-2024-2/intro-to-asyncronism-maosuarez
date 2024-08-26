let linkPrincipal = "https://pokeapi.co/api/v2/pokemon";

async function consultarApi(url) {
  try {
    let objeto = await fetch(url);
    let completoJson = await objeto.json();

    return completoJson;
  } catch (error) {
    console.error(error);
  }
}

async function cicloElementosPokemon() {
  let info = await consultarApi(linkPrincipal);
  listaDatos = info.results;
  for (let i = 0; i < listaDatos.length; i++) {
    crearElementosPokemon(i);
    let nombre = capitalizar(listaDatos[i].name);

    let objhabilidades = await consultarApi(listaDatos[i].url);
    let audio = objhabilidades.cries.latest;
    let habilidades = objhabilidades.abilities;

    let descripcion = obtenerHabilidades(habilidades);
    let adicional = "Experiencia base = " + objhabilidades.base_experience;

    let objImagenes = await consultarApi(objhabilidades.forms[0].url);
    let carouselimage = crearCarouselImagenes(objImagenes.sprites, i);

    document.getElementById("gif-carga-" + i).style.display = "none";

    modificarElementoPokemon(
      nombre,
      carouselimage,
      audio,
      descripcion,
      adicional,
      i
    );
  }
}

function capitalizar(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function crearElementosPokemon(indice) {
  let contenido = document.getElementById("contenido");

  let divLocal = document.createElement("div");
  divLocal.className = "card mb-3";
  divLocal.style.maxWidth = "540px";

  let divCarga = document.createElement("div");
  divCarga.id = "gif-carga-" + indice;
  divCarga.innerHTML = "<div class='lds-ripple'><div></div><div></div></div>";

  let divLinea = document.createElement("div");
  divLinea.className = "row g-0";

  let divColumna_1 = document.createElement("div");
  divColumna_1.className = "col-md-4";

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

  let textoCarta_2 = document.createElement("p");
  textoCarta_2.id = "card-text-2";
  textoCarta_2.className = "card-text";

  let textoPequeño = document.createElement("small");
  textoPequeño.className = "text-body-secondary";

  divLocal.appendChild(divCarga);

  textoCarta_2.appendChild(textoPequeño);
  divCuerpo.appendChild(tituloCarta);
  divCuerpo.appendChild(textoCarta_1);
  divCuerpo.appendChild(textoCarta_2);
  divColumna_2.appendChild(divCuerpo);

  divColumna_1.appendChild(audio);

  divLinea.appendChild(divColumna_1);
  divLinea.appendChild(divColumna_2);
  divLocal.appendChild(divLinea);

  contenido.appendChild(divLocal);
}

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

function modificarElementoPokemon(
  nombre,
  carouselimagen,
  audio,
  descripcion,
  adicional,
  indice
) {
  let [objTitulo, objImagen, objAudio, objDescripcion, objAdicional] =
    obtenerObjetosHtml(indice);

  objTitulo.textContent = nombre;
  objImagen.appendChild(carouselimagen);
  objAudio.src = audio;
  objDescripcion.innerHTML = descripcion;
  objAdicional.textContent = adicional;
}

function obtenerObjetosHtml(indice) {
  let elementos = document.querySelectorAll(".card");
  let elementoParticular = elementos[indice];

  let objTitulo = elementoParticular.querySelector(".card-title");
  let objImagen = elementoParticular.querySelector(".col-md-4");
  let objAudio = elementoParticular.querySelector(".audio-pokemon");
  let objDescripcion = elementoParticular.querySelector(".parrafo");
  let objAdicional = elementoParticular.querySelector(".text-body-secondary");

  return [objTitulo, objImagen, objAudio, objDescripcion, objAdicional];
}

async function siguientePaginaPokemones() {
  let pagina = await consultarApi(linkPrincipal);
  linkPrincipal = pagina.next;
  cargarPagina();
}

async function anteriorPaginaPokemones() {
  let pagina = await consultarApi(linkPrincipal);
  linkPrincipal = pagina.previous;
  cargarPagina();
}

async function cargarPagina() {
  let pagina = await consultarApi(linkPrincipal);

  let contenido = document.getElementById("contenido");
  contenido.innerHTML = "";

  let btnGrupo = document.getElementById("btn-grupo");
  if (pagina.next == null) {
    btnGrupo.innerHTML =
      '<button type="button" id="btn-prev" onclick="anteriorPaginaPokemones()" class="btn btn-light">Anterior</button>';
  }
  if (pagina.previous == null) {
    btnGrupo.innerHTML =
      '<button type="button" id="btn-next" onclick="siguientePaginaPokemones()" class="btn btn-light">Siguiente</button>';
  }
  if (pagina.previous != null && pagina.next != null) {
    btnGrupo.innerHTML =
      '<button type="button" id="btn-prev" onclick="anteriorPaginaPokemones()" class="btn btn-light">Anterior</button><button type="button" id="btn-next" onclick="siguientePaginaPokemones()" class="btn btn-light">Siguiente</button>';
  }

  cicloElementosPokemon();
}

function obtenerHabilidades(lista) {
  let texto = "Algunas habilidades:<br/>";

  for (let habilidad of lista) {
    texto += `- ${habilidad.ability.name}<br/>`;
  }

  return texto;
}

cargarPagina();
