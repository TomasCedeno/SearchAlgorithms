
const btnInternal = document.getElementById("btnInternal")
const btnExternal = document.getElementById("btnExternal")
const btnIndices = document.getElementById("btnIndices")


btnInternal.addEventListener("click", () => {
    document.getElementById("home").style = "display: none;"
    document.getElementById("content").style = "display: flex;"
    document.getElementById("internalForm").style = "display: block;"

    let script = document.querySelector("script[src='external.js']");
    if (script) script.parentNode.removeChild(script);
    script = document.querySelector("script[src='indices.js']");
    if (script) script.parentNode.removeChild(script);
    
    const newScript = document.createElement('script');
    newScript.src = 'internal.js';
    newScript.type = "module"
    document.body.appendChild(newScript);

    document.getElementById("title").innerHTML = "Búsquedas Internas"

    document.getElementById("nameInput").style.display = "block"
    document.getElementById("lastNameInput").style.display = "block"
})

btnExternal.addEventListener("click", () => {
    document.getElementById("home").style = "display: none;"
    document.getElementById("content").style = "display: flex;"
    document.getElementById("externalForm").style = "display: block;"

    let script = document.querySelector("script[src='internal.js']");
    if (script) script.parentNode.removeChild(script);
    script = document.querySelector("script[src='indices.js']");
    if (script) script.parentNode.removeChild(script);
    
    const newScript = document.createElement('script');
    newScript.src = 'external.js';
    newScript.type = "module"
    document.body.appendChild(newScript);

    document.getElementById("title").innerHTML = "Búsquedas Externas"
})

btnIndices.addEventListener("click", () => {
    document.getElementById("home").style = "display: none;"
    document.getElementById("indices").style = "display: flex;"

    let script = document.querySelector("script[src='internal.js']");
    if (script) script.parentNode.removeChild(script);
    script = document.querySelector("script[src='external.js']");
    if (script) script.parentNode.removeChild(script);

    const newScript = document.createElement('script');
    newScript.src = 'indices.js';
    newScript.type = "module"
    document.body.appendChild(newScript);

    document.getElementById("title").innerHTML = "Indices"
})