const board = document.getElementById("puzzle-board");
const piecesContainer = document.getElementById("pieces-container");
const resetBtn = document.getElementById("reset");
const progressFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");
const successAnimation = document.getElementById("success-animation");
const imgSrc = document.getElementById("imgSrc");

/* =======================
   DANH SÁCH ẢNH
======================= */
const images = [
  "./style/AnhGhep.jpg",
  "./style/AnhGhep2.jpg",
  "./style/AnhGhep3.jpg"
];

let currentImageIndex = 0;
const pieceCount = 4;
let selectedPiece = null;

/* SIZE ĐỘNG */
let boardWidth = 0;
let boardHeight = 0;
let pieceWidth = 0;
let pieceHeight = 0;

/* =======================
   INIT GAME
======================= */
loadImageAndStart();

/* =======================
   LOAD ẢNH & TÍNH SIZE
======================= */
function loadImageAndStart() {
  const img = new Image();
  img.src = images[currentImageIndex];
  imgSrc.src = images[currentImageIndex];

  img.onload = () => {
    calculateBoardSize(img);
    createBoard();
    createPieces();
    startGame();
  };
}

/* =======================
   TÍNH SIZE BOARD THEO ẢNH
======================= */
function calculateBoardSize(img) {
  const maxWidth = Math.min(window.innerWidth * 0.7, 500);
  const maxHeight = Math.min(window.innerHeight * 0.6, 400);

  let scale = Math.min(
    maxWidth / img.naturalWidth,
    maxHeight / img.naturalHeight
  );

  boardWidth = img.naturalWidth * scale;
  boardHeight = img.naturalHeight * scale;

  pieceWidth = boardWidth / pieceCount;
  pieceHeight = boardHeight / pieceCount;

  // board.style.width = `${boardWidth}px`;
  // board.style.height = `${boardHeight}px`;
}

/* =======================
   TẠO BOARD
======================= */
function createBoard() {
  board.innerHTML = "";

  for (let i = 0; i < pieceCount * pieceCount; i++) {
    const slot = document.createElement("div");
    slot.classList.add("slot");
    slot.dataset.index = i;

    slot.style.width = `${pieceWidth}px`;
    slot.style.height = `${pieceHeight}px`;

    slot.addEventListener("dragover", (e) => e.preventDefault());

    slot.addEventListener("drop", () => {
      if (!selectedPiece) return;

      if (slot.firstChild) {
        piecesContainer.appendChild(slot.firstChild);
      }

      slot.appendChild(selectedPiece);
      selectedPiece = null;

      updateProgress();
      checkWin();
    });

    board.appendChild(slot);
  }
}

/* =======================
   TRỘN
======================= */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/* =======================
   TẠO PIECE
======================= */
function createPieces() {
  piecesContainer.innerHTML = "";
  const imageSrc = images[currentImageIndex];

  const indices = shuffle([...Array(pieceCount * pieceCount).keys()]);

  indices.forEach((i) => {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.dataset.index = i;
    piece.draggable = true;

    const x = i % pieceCount;
    const y = Math.floor(i / pieceCount);

    piece.style.width = `${pieceWidth}px`;
    piece.style.height = `${pieceHeight}px`;
    piece.style.backgroundImage = `url(${imageSrc})`;
    piece.style.backgroundSize = `${boardWidth}px ${boardHeight}px`;
    piece.style.backgroundPosition = `-${x * pieceWidth}px -${y * pieceHeight}px`;

    piece.addEventListener("dragstart", () => {
      selectedPiece = piece;
    });

    piece.addEventListener("dragend", () => {
      selectedPiece = null;
    });

    piecesContainer.appendChild(piece);
  });
}

/* =======================
   PROGRESS
======================= */
function startGame() {
  updateProgress();
}

function updateProgress() {
  const slots = document.querySelectorAll(".slot");
  let correct = 0;

  slots.forEach((slot, i) => {
    const piece = slot.firstChild;
    if (piece && piece.dataset.index == i) correct++;
  });

  const percent = Math.round(
    (correct / (pieceCount * pieceCount)) * 100
  );

  progressFill.style.width = `${percent}%`;
  progressText.textContent = `${percent}%`;
}

function checkWin() {
  if (
    document.querySelectorAll(".slot > .piece").length ===
    pieceCount * pieceCount
  ) {
    setTimeout(showSuccessModal, 400);
  }
}

/* =======================
   MODAL
======================= */
function showSuccessModal() {
  successAnimation.classList.add("show");
}

function closeSuccessModal() {
  successAnimation.classList.remove("show");

  currentImageIndex++;
  if (currentImageIndex >= images.length) currentImageIndex = 0;

  loadImageAndStart();
}

/* =======================
   RESET (KHÔNG ĐỔI ẢNH)
======================= */
resetBtn.addEventListener("click", () => {
  loadImageAndStart();
});

/* =======================
   RESIZE
======================= */
window.addEventListener("resize", loadImageAndStart);
