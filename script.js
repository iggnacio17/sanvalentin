let data = JSON.parse(localStorage.getItem("memories")) || [];
let filter = "all";
let fabOpen = false;

/* Guardar */
function saveData() {
  localStorage.setItem("memories", JSON.stringify(data));
}

/* Render */
function render() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  data.forEach((item) => {
    if (filter === "fav" && !item.fav) return;
    if (filter !== "all" && filter !== "fav" && item.type !== filter) return;

    const card = document.createElement("div");
    card.className = "card";

    if (item.type === "note") {
      card.innerHTML = `<div style="padding:10px">${item.content}</div>`;
    } else {
      card.innerHTML = `<img src="${item.content}" onclick="openModal('${item.content}')">`;
    }

    const footer = document.createElement("div");
    footer.className = "card-footer";

    footer.innerHTML = `
      <span>${item.date || ""}</span>

      <div style="display:flex; gap:8px;">
        <span onclick="toggleFav(${item.id})">
          ${item.fav ? "❤️" : "🤍"}
        </span>

        <span onclick="deleteItem(${item.id})" style="cursor:pointer;">
          🗑️
        </span>
      </div>
    `;

    card.appendChild(footer);
    gallery.appendChild(card);
  });
}

/* Filtros */
function setFilter(f) {
  filter = f;
  render();
}

/* Favorito */
function toggleFav(id) {
  const item = data.find((x) => x.id === id);
  item.fav = !item.fav;
  saveData();
  render();
}

/* Modal imagen */
function openModal(src) {
  const modal = document.getElementById("imageModal");
  modal.style.display = "flex";
  document.getElementById("modalImg").src = src;
}

function closeModal() {
  document.getElementById("imageModal").style.display = "none";
}

/* Modal añadir */
function openAdd() {
  document.getElementById("addModal").style.display = "flex";
}

function closeAdd() {
  document.getElementById("addModal").style.display = "none";
}

function openNote() {
  document.getElementById("typeSelect").value = "note";
  openAdd();
}

/* Guardar item */
function saveItem() {
  const type = document.getElementById("typeSelect").value;
  const file = document.getElementById("memoryFile").files[0];
  const text = document.getElementById("memoryText").value;
  const date = document.getElementById("memoryDate").value;

  if (type === "note") {
    data.push({
      id: Date.now(),
      type: "note",
      content: text,
      date,
      fav: false,
    });
    saveData();
    render();
    closeAdd();
    return;
  }

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      data.push({
        id: Date.now(),
        type,
        content: e.target.result,
        date,
        fav: false,
      });
      saveData();
      render();
      closeAdd();
    };
    reader.readAsDataURL(file);
  }
}

/* FAB */
function toggleFab() {
  fabOpen = !fabOpen;
  document.getElementById("fabMenu").classList.toggle("show", fabOpen);
}

/* Cámara */
function takePhoto() {
  document.getElementById("cameraInput").click();
}

document.getElementById("cameraInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    data.push({
      id: Date.now(),
      type: "photo",
      content: ev.target.result,
      date: new Date().toISOString().split("T")[0],
      fav: false,
    });
    saveData();
    render();
  };
  reader.readAsDataURL(file);
});

/* Exportar */
function exportData() {
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "recuerdos.json";
  a.click();
}

/* Importar */
function importData() {
  document.getElementById("importFile").click();
}

document.getElementById("importFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (ev) => {
    data = JSON.parse(ev.target.result);
    saveData();
    render();
  };
  reader.readAsText(file);
});

/* Corazones */
function createHearts() {
  const container = document.getElementById("hearts");
  for (let i = 0; i < 20; i++) {
    const h = document.createElement("div");
    h.innerText = "❤";
    h.style.position = "absolute";
    h.style.left = Math.random() * 100 + "vw";
    h.style.top = Math.random() * 100 + "vh";
    h.style.color = "#F57799";
    h.style.opacity = 0.3;
    container.appendChild(h);
  }
}

function deleteItem(id) {
  if (!confirm("¿Eliminar este recuerdo? 😢")) return;

  data = data.filter((item) => item.id !== id);

  saveData();
  render();
}

createHearts();
render();
