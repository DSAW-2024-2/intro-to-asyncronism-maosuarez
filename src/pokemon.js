//Elementos que se mandan de la otra pagina
let link = localStorage.getItem("url");
let nombre = localStorage.getItem("nombre");
let carousel = localStorage.getItem("carousel");
let codigo = localStorage.getItem("codigo");
let texto1 = localStorage.getItem("texto1");
let texto2 = localStorage.getItem("texto2");

document.querySelector(".carousel").innerHTML = carousel;
document.querySelector(".card-title").textContent = nombre;
document.querySelector(".text1").innerHTML = texto1;

document.querySelector(".text-body-secondary").innerHTML = texto2;

document.querySelector(".btn-close").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "index.html";
});

//document.querySelector(".card").innerHTML = codigo;
