//Buscador de objetospor título

document.querySelector("#search").onclick=()=>{
  search()
}

function search(){
  let title = document.querySelector("#title")
  fetch(`/objeto/lista/filtrar`,{
    method:"POST",
    body: JSON.stringify({title:title.value}),
    headers: {"Content-Type":"application/json"}
  })
    .then(res=>res.json())
    .then(list=>{showList(list)})
}

function showList(list){
  let cards = document.querySelector("#cards")
  while (cards.firstChild)
    cards.firstChild.remove()
  list.forEach(obj => {
    let div = document.createElement("div")
    div.classList.add("window","card")
    let img = document.createElement("img")
    img.classList.add("card-photo")
    img.src=obj.image
    let div2 = document.createElement("div")
    div2.classList.add("card-info")
    let p1 = document.createElement("p")
    p1.classList.add("card-info-tittle")
    p1.textContent=obj.title
    let p2 = document.createElement("p")
    p2.textContent=`${obj.location} | ${obj.date}`
    let p3 = document.createElement("p")
    p3.classList.add("card-info-description")
    p3.textContent=obj.description
    div2.appendChild(p1)
    div2.appendChild(p2)
    div2.appendChild(p3)
    div.appendChild(img)
    div.appendChild(div2)
    cards.appendChild(div)
  })
}