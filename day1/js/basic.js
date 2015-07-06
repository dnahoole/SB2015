// Melting image section
var idx = 0;
var sectList = [];

var sect1 = null;
var sect3 = null;
var sect4 = null;

var cbx0 = null;
var cbx1 = null;
var cbx2 = null;
var cbx3 = null;
var cbx4 = null;

function init() {
    sect1 = document.getElementById('sect1');
    sect3 = document.getElementById('sect3');
    sect4 = document.getElementById('sect4');
    
    cbx0 = document.getElementById("cbx0");
    cbx1 = document.getElementById("cbx1");
    cbx2 = document.getElementById("cbx2");
    cbx3 = document.getElementById("cbx3");
    cbx4 = document.getElementById("cbx4");

    window.setInterval("meltImage()", 3000); // animate
    sectList = document.getElementById("sect1").getElementsByTagName("img");
    
    cbx0.addEventListener("change", resizeSection, false);
    cbx1.addEventListener("change", resizeSection, false);
    cbx2.addEventListener("change", resizeSection, false);
    cbx3.addEventListener("change", resizeSection, false);
    cbx4.addEventListener("change", resizeSection, false);
}

function meltImage() {
    var node = sectList[idx % sectList.length];
    node.setAttribute("style", "opacity: 0");
    var node = sectList[++idx % sectList.length];
    node.setAttribute("style", "opacity: 1");
}

function resizeSection(e) {
    sect1.setAttribute("class", "section_content");
    sect2.setAttribute("class", "section_content");
    sect3.setAttribute("class", "section_content");
    sect4.setAttribute("class", "section_content");

    if (cbx1.checked) {
        sect1.setAttribute("class", "section_content_expand");
    }
    else if (cbx2.checked) {
        sect2.setAttribute("class", "section_content_expand");
    }
    else if (cbx3.checked) {
        sect3.setAttribute("class", "section_content_expand");
    }
    else if (cbx4.checked) {
        sect4.setAttribute("class", "section_content_expand");
    }
}

window.addEventListener("load", init, false);