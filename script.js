let data = {
  startDate: "2024-02-14",
  secretLetter: {
    unlockDate: "2026-02-14",
    content: "Mi amor, gracias por existir 💖",
  },
  memories: [],
  pets: [],
  hotPassword: "1234",
};

const timeline = document.getElementById("timeline");
const petsSection = document.getElementById("petsSection");
const letterContent = document.getElementById("letterContent");
const importInput = document.getElementById("importInput");

init();

function init() {
  updateCounter();
  renderLetter();
  renderMemories();
  createHearts();
}

function updateCounter() {
  const start = new Date(data.startDate);
  const today = new Date();
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  document.getElementById("daysCounter").innerText = `${diff} días juntos 💕`;
}

function renderLetter() {
  const today = new Date();
  const unlock = new Date(data.secretLetter.unlockDate);
  if (today >= unlock) {
    letterContent.innerText = data.secretLetter.content;
  } else {
    const diff = Math.ceil((unlock - today) / (1000 * 60 * 60 * 24));
    letterContent.innerText = `🔒 Se desbloquea en ${diff} días`;
  }
}

function openAddModal() {
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function saveMemory() {
  const type = document.getElementById("memoryType").value;
  const file = document.getElementById("memoryFile").files[0];
  const date = document.getElementById("memoryDate").value;
  const desc = document.getElementById("memoryDesc").value;

  if (!file) return alert("Sube una imagen o video");

  const reader = new FileReader();
  reader.onload = function (e) {
    const newMemory = {
      id: Date.now(),
      type: file.type.startsWith("video") ? "video" : "image",
      date,
      desc,
      file: e.target.result,
    };

    if (type === "pet") {
      data.pets.push(newMemory);
    } else {
      data.memories.push(newMemory);
    }

    renderMemories();
    closeModal();
  };
  reader.readAsDataURL(file);
}

function renderMemories() {
  timeline.innerHTML = "";
  petsSection.innerHTML = "";

  data.memories.forEach((m) => {
    timeline.appendChild(createCard(m));
  });

  data.pets.forEach((m) => {
    petsSection.appendChild(createCard(m));
  });
}

function createCard(m) {
  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `
        ${
          m.type === "image"
            ? `<img src="${m.file}">`
            : `<video src="${m.file}" controls></video>`
        }
        <p>${m.desc}</p>
        <small>${m.date}</small>
    `;
  return div;
}

function exportData() {
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "nuestro_universo.json";
  link.click();
}

importInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function (ev) {
    data = JSON.parse(ev.target.result);
    init();
  };
  reader.readAsText(file);
});

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

function openHot() {
  document.getElementById("hotSection").classList.remove("hidden");
}

function checkHot() {
  const pass = document.getElementById("hotPassword").value;
  if (pass === data.hotPassword) {
    document.getElementById("hotContentArea").innerHTML =
      "<p>Contenido privado 🔥</p>";
  } else {
    alert("Contraseña incorrecta");
  }
}

function createHearts() {
  const container = document.getElementById("heartsContainer");
  setInterval(() => {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.style.left = Math.random() * 100 + "%";
    heart.innerText = "💖";
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
  }, 500);
}
