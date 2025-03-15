document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("nav");

    menuToggle.addEventListener("click", function() {
        nav.style.display = nav.style.display === "flex" ? "none" : "flex";
    });

    const button = document.querySelector(".button");
    button.addEventListener("mouseover", function() {
        button.style.transform = "scale(1.05)";
    });

    button.addEventListener("mouseout", function() {
        button.style.transform = "scale(1)";
    });
});
