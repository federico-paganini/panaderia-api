document.addEventListener("DOMContentLoaded", function () {
    if(!localStorage.getItem("activeUser")) {
        window.location.href = "loginreg.html";
    } else {
        /* localStorage.getItem("userType") */
        /* Quitar opciones según tipo de usuario */
    }
});