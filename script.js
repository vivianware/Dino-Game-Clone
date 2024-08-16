import { updateGround, setupGround } from "./ground.js";
import { updateclouds, setupclouds } from "./clouds.js";
import { updateDino, setupDino, getDinoRect, setDinoLose } from "./dino.js";
import { updateCactus, setupCactus, getCactusRects } from "./cactus.js";

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;

const worldElem = document.querySelector("[data-world]");
const scoreElem = document.querySelector("[data-score]");
const startScreenElem = document.querySelector("[data-start-screen]");
const stopScreenElem = document.querySelector("[data-end-screen]");
const notificationElem = document.querySelector("#notification"); // Phần tử thông báo

setPixelToWorldScale();
window.addEventListener("resize", setPixelToWorldScale);
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    handleStart();
  }
}, { once: true });

let lastTime;
let speedScale;
let score;
let Highscore;

function update(time) {
  if (lastTime == null) {
    lastTime = time;
    window.requestAnimationFrame(update);
    return;
  }
  const delta = time - lastTime;

  updateclouds(delta, speedScale);
  updateGround(delta, speedScale);
  updateDino(delta, speedScale);
  updateCactus(delta, speedScale);
  updateSpeedScale(delta);
  updateScore(delta);
  if (checkLose()) return handleLose();

  lastTime = time;
  window.requestAnimationFrame(update);
}

function checkLose() {
  const dinoRect = getDinoRect();
  return getCactusRects().some(rect => isCollision(rect, dinoRect));
}

function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  );
}

function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE;
}

function updateScore(delta) {
  score += delta * 0.0178;
  scoreElem.textContent = Math.floor(score);

  if (Math.floor(score) >= 515) {
    showNotification("Congratulations! You've reached 515 points! You're skilled hacker I ever met");
  }
}

function showNotification(message) {
  const notificationText = document.querySelector("#notification-text");
  notificationText.textContent = message;
  notificationElem.style.display = "block"; // Hiển thị thông báo
}

function hideNotification() {
  notificationElem.style.display = "none"; // Ẩn thông báo
}

function handleStart() {
  lastTime = null;
  speedScale = 1;
  score = 0;
  Highscore = 1000;
  setupclouds();
  setupGround();
  setupDino();
  setupCactus();
  startScreenElem.classList.add("hide");
  hideNotification(); // Đảm bảo thông báo bị ẩn khi bắt đầu game
  window.requestAnimationFrame(update);
}

function handleLose() {
  setDinoLose();
  setTimeout(() => {
    document.addEventListener("keydown", (event) => {
      if (event.code === "Space") {
        handleStart();
      }
    }, { once: true });
    startScreenElem.classList.remove("hide");
  }, 100);
}

function setPixelToWorldScale() {
  let worldToPixelScale;
  if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
    worldToPixelScale = window.innerWidth / WORLD_WIDTH;
  } else {
    worldToPixelScale = window.innerHeight / WORLD_HEIGHT;
  }

  worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`;
  worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`;
}
