document.addEventListener("DOMContentLoaded", function () {
    const formlog = document.getElementById("form-log");
    const formreg = document.getElementById("form-reg");

    /* Intercambio de Formularios y Transición Suave */
    const blocklog = document.getElementById("block-log");
    const blockreg = document.getElementById("block-reg");
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

    /* Guardado de datos Formulario de Registro */
    formreg.addEventListener("submit", function (event) {
        event.preventDefault();
        const nombre = document.getElementById("nuser").value;
        const contraseña = document.getElementById("npass");
        const confcontraseña = document.getElementById("confpass");
        const email = document.getElementById("nemail").value;
        const telefono = document.getElementById("nphone").value;
        const usertypeselector = document.querySelectorAll('input[type="radio"][name="usertype"]');
        let usertype = null;
        let userdata = {};

        /* Obtener datos de Imput radio */
        usertypeselector.forEach(function (radio) {
            if (radio.checked) {
                usertype = radio.value;
            }
        })

        /* Confirmar contraseñas */
        if (contraseña.value !== confcontraseña.value) {
            alert("Las contraseñas no coinciden");
            contraseña.value = "";
            confcontraseña.value = "";
        } else {
            alert("Registrado Correctamente");
            /* Datos del Usuario */
            userdata = {
                nombre: nombre,
                email: email,
                telefono: telefono,
                tipousuario: usertype,
                contraseña: confcontraseña.value,
            };
            formreg.reset();
            formlog.classList.add('form-activo');
            formlog.classList.remove('form-inactivo');
            formreg.classList.remove('form-activo');
            formreg.classList.add('form-inactivo');
            barra.style.width = blocklog.offsetWidth + 'px';
            barra.style.transform = `translateX(${blocklog.offsetLeft}px)`;
        }
    })

    /* Confirmar Formulario de Login */
    formlog.addEventListener("submit", function (event) {
        event.preventDefault();
        const user = document.getElementById("usuario").value;
        const pass = document.getElementById("contraseña").value;

        if (user !== "" && pass !== "") {
            /* Confirmación provisoria */
            alert("Logueado Correctamente");
            localStorage.setItem("activeUser", user);
            /* localStorage.setItem("userType", usertype) */
            setTimeout(function () {
                window.location.href = "index.html";
            }, 2000);
        } else {
            alert("Usuario o Contraseña Incorrectos");
        }

    })
});

