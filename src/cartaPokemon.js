//Elementos que se mandan de la otra pagina
let link = localStorage.getItem("url");
let nombre = localStorage.getItem("nombre");
let codigo = localStorage.getItem("codigo");

document.querySelector(".card").innerHTML = codigo;
