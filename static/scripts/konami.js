// deno-lint-ignore-file no-window no-window-prefix
const konamiCode = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

let konamiIndex = 0;

window.addEventListener("keydown", (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      konamiActivated();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

function konamiActivated() {
  // play a chiptune
  const audio = new Audio("/scripts/tloz-oot.mp3");
  audio.play();
  audio.volume = 0.5;

  setTimeout(() => {
    alert("A real gamer, eh? Enjoy my favorite tune.");
  }, 1000);
}
