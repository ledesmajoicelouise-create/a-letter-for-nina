const JAYJAY_HOUSE = 3; // Change this (1–4) to whichever house Jayjay is hiding in

const HOUSE_CLUES = {
  1: "Nobody's home in House 01, just a cozy mug on the table.",
  2: "House 02 is quiet too—maybe try another roof color?",
  3: "Wait... I hear someone inside House 03!",
  4: "Only a sleepy cat in House 04. Keep looking!"
};

const visitedHouses = new Set();

function showSection(sectionId) {
  const sections = ["intro", "village", "found", "letter", "ending"];
  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.toggle("hidden", id !== sectionId);
    }
  });
}

function startGame() {
  showSection("village");
}

function visitHouse(houseNumber) {
  visitedHouses.add(houseNumber);

  const counterEl = document.getElementById("counter");
  if (counterEl) {
    counterEl.textContent = `HOUSES VISITED: ${visitedHouses.size} / 4`;
  }

  const messageEl = document.getElementById("message");
  if (messageEl) {
    const clue = HOUSE_CLUES[houseNumber] || "Hmm, nobody here.";
    messageEl.innerHTML = `
      <p class="speaker">NINA</p>
      <p>${clue}</p>
    `;
  }

  if (houseNumber === JAYJAY_HOUSE) {
    setTimeout(() => {
      showSection("found");
    }, 650);
  }
}

function openLetter() {
  showSection("letter");
}

function finishGame() {
  showSection("ending");
}

// Gentle Web Audio API melody (no external audio file needed)
let audioCtx = null;
let musicInterval = null;
let musicPlaying = false;

const NOTES = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880.0, 783.99];
let noteIndex = 0;

function playNote(freq) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "triangle";
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.36);
}

function toggleMusic() {
  const btn = document.getElementById("musicButton");
  musicPlaying = !musicPlaying;

  if (musicPlaying) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx && AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    noteIndex = 0;
    playNote(NOTES[noteIndex]);
    musicInterval = setInterval(() => {
      noteIndex = (noteIndex + 1) % NOTES.length;
      playNote(NOTES[noteIndex]);
    }, 420);
    if (btn) btn.textContent = "♪ MUSIC: ON";
  } else {
    clearInterval(musicInterval);
    musicInterval = null;
    if (btn) btn.textContent = "♪ MUSIC: OFF";
  }
}