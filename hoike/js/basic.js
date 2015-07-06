var idx = 0;
var sectList = [];

function init() {
    window.setInterval("meltImage()", 3000); // animate
    sectList = document.getElementById("sect1").getElementsByTagName("img");
}

function meltImage() {
    var node = sectList[idx % sectList.length];
    node.setAttribute("style", "opacity: 0");
    var node = sectList[++idx % sectList.length];
    node.setAttribute("style", "opacity: 1");
}

window.addEventListener("load", init, false);