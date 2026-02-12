const startDate = new Date("2022-12-25");
let filter = "all";

let data = JSON.parse(localStorage.getItem("universeData")) || [];

function saveData(){
    localStorage.setItem("universeData", JSON.stringify(data));
}

function updateDays(){
    const today = new Date();
    const diff = Math.floor((today - startDate)/(1000*60*60*24));
    document.getElementById("daysCounter").innerText =
        diff + " días juntos ❤️";
}

function openAdd(){
    document.getElementById("addModal").style.display="flex";
}

function closeAdd(){
    document.getElementById("addModal").style.display="none";
}

function saveItem(){
    const type = document.getElementById("typeSelect").value;
    const file = document.getElementById("memoryFile").files[0];
    const text = document.getElementById("memoryText").value;
    const date = document.getElementById("memoryDate").value;

    if(type==="note"){
        data.push({id:Date.now(),type,date,content:text,fav:false});
        saveData(); render(); closeAdd(); return;
    }

    if(!file) return;

    const reader = new FileReader();
    reader.onload = function(e){
        data.push({
            id:Date.now(),
            type,
            date,
            content:e.target.result,
            fav:false
        });
        saveData(); render(); closeAdd();
    }
    reader.readAsDataURL(file);
}

function render(){
    const gallery = document.getElementById("gallery");
    gallery.innerHTML="";

    data.sort((a,b)=> new Date(b.date)-new Date(a.date));

    data.forEach(item=>{
        if(filter==="fav" && !item.fav) return;
        if(filter!=="all" && filter!=="fav" && item.type!==filter) return;

        const card = document.createElement("div");
        card.className="card";

        if(item.type==="note"){
            card.innerHTML=`<div style="padding:10px">${item.content}</div>`;
        }else{
            card.innerHTML=`<img src="${item.content}" onclick="openModal('${item.content}')">`;
        }

        const footer = document.createElement("div");
        footer.className="card-footer";

        footer.innerHTML=`
            <span class="date">${item.date || ""}</span>
            <span class="fav" onclick="toggleFav(${item.id})">
                ${item.fav ? "❤️" : "🤍"}
            </span>
        `;

        card.appendChild(footer);
        gallery.appendChild(card);
    });
}

function toggleFav(id){
    const item = data.find(x=>x.id===id);
    item.fav=!item.fav;
    saveData();
    render();
}

function setFilter(type){
    filter=type;
    render();
}

function openModal(src){
    document.getElementById("modalImg").src=src;
    document.getElementById("imageModal").style.display="flex";
}

function closeModal(){
    document.getElementById("imageModal").style.display="none";
}

function toggleDark(){
    document.body.classList.toggle("dark");
}

function exportData(){
    const blob = new Blob([JSON.stringify(data)],{type:"application/json"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="nuestro_universo.json";
    a.click();
}

function importData(){
    document.getElementById("importFile").click();
}

document.getElementById("importFile").addEventListener("change",function(e){
    const file=e.target.files[0];
    const reader=new FileReader();
    reader.onload=function(ev){
        data=JSON.parse(ev.target.result);
        saveData();
        render();
    }
    reader.readAsText(file);
});

function createHearts(){
    const container=document.getElementById("hearts-container");
    for(let i=0;i<25;i++){
        const heart=document.createElement("div");
        heart.className="heart";
        heart.innerText="❤";
        heart.style.left=Math.random()*100+"vw";
        heart.style.fontSize=(10+Math.random()*30)+"px";
        heart.style.animationDuration=(5+Math.random()*10)+"s";
        container.appendChild(heart);
    }
}

updateDays();
render();
createHearts();
