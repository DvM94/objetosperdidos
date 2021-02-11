let characters = document.querySelector("#description")
characters.onkeyup=countCharacters
window.onload=()=>countCharacters()

function countCharacters(){document.querySelector("#character").textContent=characters.value.length}