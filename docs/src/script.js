const pianoKeys = document.querySelectorAll(".piano-keys .key");
const volumeSlider = document.querySelector("#volume-control");
const keysCheck = document.querySelector("#keys-toggle");
const themeToggle = document.querySelector("#theme-toggle");
const langSelect = document.querySelector("#lang-select");
const htmlElement = document.documentElement;

let mappedKeys = [];
let currentVolume = 0.5;

const translations = {
  "en-US": {
    title: "Virtual Piano",
    volume: "Volume",
    keys: "Keys",
    language: "Language",
    themeLabel: "Toggle color theme",
  },
  "pt-BR": {
    title: "Piano Virtual",
    volume: "Volume",
    keys: "Teclas",
    language: "Idioma",
    themeLabel: "Alternar tema de cores",
  },
  "es-ES": {
    title: "Piano Virtual",
    volume: "Volumen",
    keys: "Teclas",
    language: "Idioma",
    themeLabel: "Cambiar tema de color",
  },
};

const playTune = (key) => {
  const audio = new Audio(`./src/tunes/${key}.wav`);
  audio.volume = currentVolume;
  audio.play();

  const clickedKey = document.querySelector(`[data-key="${key}"]`);
  if (!clickedKey) return;

  clickedKey.classList.add("active");
  setTimeout(() => {
    clickedKey.classList.remove("active");
  }, 150);
};

pianoKeys.forEach((key) => {
  const keyValue = key.dataset.key;
  mappedKeys.push(keyValue);

  // Pointerdown gives instant response on touchscreens and mouse clicks
  key.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    playTune(keyValue);
  });

  // Keyboard accessibility when focusing individual keys
  key.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      playTune(keyValue);
    }
  });
});

document.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  const pressedKey = e.key.toLowerCase();
  if (mappedKeys.includes(pressedKey)) {
    playTune(pressedKey);
  }
});

const handleVolume = (e) => {
  currentVolume = parseFloat(e.target.value);
};

const showHideKeys = () => {
  const isChecked = keysCheck.checked;
  keysCheck.setAttribute("aria-checked", String(isChecked));
  pianoKeys.forEach((key) => key.classList.toggle("hide", !isChecked));
};

const toggleTheme = () => {
  const currentTheme = htmlElement.getAttribute("data-theme");
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  htmlElement.setAttribute("data-theme", nextTheme);
};

const changeLanguage = (lang) => {
  const dictionary = translations[lang] || translations["en-US"];
  htmlElement.setAttribute("lang", lang);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dictionary[key]) {
      el.textContent = dictionary[key];
    }
  });

  themeToggle.setAttribute("aria-label", dictionary.themeLabel);
};

volumeSlider.addEventListener("input", handleVolume);
keysCheck.addEventListener("change", showHideKeys);
themeToggle.addEventListener("click", toggleTheme);
langSelect.addEventListener("change", (e) => changeLanguage(e.target.value));
