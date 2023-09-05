document.addEventListener("DOMContentLoaded", function () {
    const blocklog = document.getElementById("block-log");
    const blockreg = document.getElementById("block-reg");
    const formlog = document.getElementById("form-log");
    const formreg = document.getElementById("form-reg");

    blocklog.addEventListener("click", function () {
            formlog.style.display = "block";
            formreg.style.display = "none";
        })

    blockreg.addEventListener("click", function () {
        formlog.style.display = "none";
        formreg.style.display = "block";
    })
});