const startDate = new Date("2022-12-25");
let data = JSON.parse(localStorage.getItem("universeData")) || {
    memories: [],
    pets: [],
    secret: ""
};

function saveData() {
    localStorage.setItem("universeData", JSON.stringify(data));
}

function updateDays() {
    const today = new Date();
    const diff = Math.floor((today - startDate) / (1000*60*60*24));
    document.getElementById("daysCounter").innerText =
        diff + " días juntos desde 25 de diciembre de 2022 ❤️";
}

function openAddMemory() {
    document.getElementById("addModal").style.display = "flex";
}

function closeAdd() {
    document.getElementById("addModal").style.display = "none";
}

function saveMemory() {
    const file = document.getElementById("memoryFile").files[0];
    const date = document.getElementById("memoryDate").value;
    const desc = document.getElementById("memoryDesc").value;

    const reader = new FileReader();
    reader.onload = function(e) {
        data.memories.push({
            id: Date.now(),
            date,
            desc,
            file: e.target.result
        });
        saveData();
        renderMemories();
        closeAdd();
    }
    reader.readAsDataURL(file);
}

function renderMemories() {
    const container = document.getElementById("timeline");
    container.innerHTML = "";

    data.memories.sort((a,b)=> new Date(b.date)-new Date(a.date));

    data.memories.forEach(m => {
        const div = document.createElement("div");
        div.className = "memory";
        div.innerHTML = `
            <p>${m.date}</p>
            <img src="${m.file}" onclick="openModal('${m.file}')">
            <p>${m.desc}</p>
        `;
        container.appendChild(div);
    });
}

function openModal(src) {
    document.getElementById("modalImg").src = src;
    document.getElementById("imageModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("imageModal").style.display = "none";
}

function saveSecret() {
    data.secret = document.getElementById("secretLetter").value;
    saveData();
    renderSecret();
}

function renderSecret() {
    document.getElementById("secretLetter").value = data.secret;
}

function addPet() {
    const name = prompt("Nombre de la mascota:");
    if(!name) return;
    data.pets.push(name);
    saveData();
    renderPets();
}

function renderPets() {
    const container = document.getElementById("pets");
    container.innerHTML = "";
    data.pets.forEach(p=>{
        const div = document.createElement("div");
        div.innerHTML = "🐾 " + p;
        container.appendChild(div);
    });
}

function toggleDark() {
    document.body.classList.toggle("dark");
}

function exportData() {
    const blob = new Blob([JSON.stringify(data)], {type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "nuestro_universo.json";
    a.click();
}

function importData() {
    document.getElementById("importFile").click();
}

document.getElementById("importFile").addEventListener("change", function(e){
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(ev){
        data = JSON.parse(ev.target.result);
        saveData();
        renderMemories();
        renderPets();
        renderSecret();
    }
    reader.readAsText(file);
});

function openHot() {
    const pass = prompt("Contraseña 🔥");
    if(pass === "amor123") {
        alert("Bienvenido al rincón secreto 😈");
    } else {
        alert("Incorrecto");
    }
}

function createHearts() {
    const container = document.getElementById("hearts-container");
    for(let i=0;i<30;i++){
        const heart = document.createElement("div");
        heart.className="heart";
        heart.innerText="❤";
        heart.style.left = Math.random()*100+"vw";
        heart.style.fontSize = (10+Math.random()*30)+"px";
        heart.style.animationDuration = (5+Math.random()*10)+"s";
        container.appendChild(heart);
    }
}

updateDays();
renderMemories();
renderPets();
renderSecret();
createHearts();
