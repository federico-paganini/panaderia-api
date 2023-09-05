/* Intercambio de Formularios y Transición Suave */
document.addEventListener("DOMContentLoaded", function () {
    const blocklog = document.getElementById("block-log");
    const blockreg = document.getElementById("block-reg");
    const formlog = document.getElementById("form-log");
    const formreg = document.getElementById("form-reg");
    const barra = document.querySelector('.barra');

    barra.style.width = blocklog.offsetWidth + 'px';
    barra.style.height = blocklog.offsetHeight + 'px';
    barra.style.transform = `translateX(${blocklog.offsetLeft}px)`;

    blocklog.addEventListener("click", function () {
        formlog.classList.add('form-activo');
        formlog.classList.remove('form-inactivo');
        formreg.classList.remove('form-activo');
        formreg.classList.add('form-inactivo');
        barra.style.width = this.offsetWidth + 'px';
        barra.style.transform = `translateX(${this.offsetLeft}px)`;
    })

    blockreg.addEventListener("click", function () {
        formreg.classList.add('form-activo');
        formreg.classList.remove('form-inactivo');
        formlog.classList.remove('form-activo');
        formlog.classList.add('form-inactivo');
        barra.style.width = this.offsetWidth + 'px';
        barra.style.transform = `translateX(${this.offsetLeft}px)`;
    })
});


