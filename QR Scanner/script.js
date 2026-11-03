
const fileInput = document.getElementById("fileInput");
const dropZone = document.getElementById("dropZone");
const browseBtn = document.getElementById("browseBtn");
const decodeBtn = document.getElementById("decodeBtn");
const removeBtn = document.getElementById("removeBtn");

const fileInfo = document.getElementById("fileInfo");
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const message = document.getElementById("message");

const sourceStage = document.getElementById("sourceStage");
const outputStage = document.getElementById("outputStage");
const sourceCaption = document.getElementById("sourceCaption");
const outputCaption = document.getElementById("outputCaption");
const decodedResults = document.getElementById("decodedResults");
const resultCount = document.getElementById("resultCount");
const dataCount = document.getElementById("dataCount");

const MAX_FILE_SIZE = 15 * 1024 * 1024;

let selectedFile = null;
let currentImageURL = null;
let imageElement = null;
let decodedText = "";
let decodedFormat = "";

const reader = new ZXing.BrowserMultiFormatReader();

const emptyOutput = `
  <div class="empty-state">
    <div class="scan-art">
      <span></span><span></span><span></span><span></span>
    </div>
    <span>Decoded preview will appear here</span>
  </div>
`;

const emptySource = `
  <div class="empty-state">
    <div class="empty-art">▧</div>
    <span>Your image will appear here</span>
  </div>
`;

function showMessage(text, type = "loading") {
  message.textContent = text;
  message.className = `message ${type}`;
  message.hidden = false;
}

function hideMessage() {
  message.hidden = true;
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function resetResults() {
  decodedText = "";
  decodedFormat = "";

  outputStage.innerHTML = emptyOutput;
  outputCaption.textContent = "Awaiting analysis";
  decodedResults.innerHTML = `
    <div class="no-results">
      <span>⌘</span>
      <p>Your extracted code data will show up here.</p>
    </div>
  `;

  resultCount.textContent = "0 CODES FOUND";
  dataCount.textContent = "NO DATA";
}

function resetScanner() {
  selectedFile = null;
  imageElement = null;

  if (currentImageURL) {
    URL.revokeObjectURL(currentImageURL);
    currentImageURL = null;
  }

  fileInput.value = "";
  fileInfo.hidden = true;
  decodeBtn.disabled = true;

  sourceStage.innerHTML = emptySource;
  sourceCaption.textContent = "Waiting for an image";

  resetResults();
  hideMessage();
}

function loadFile(file) {
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    showMessage("Please select a valid image file.", "error");
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    showMessage("This image exceeds the 15 MB upload limit.", "error");
    return;
  }

  if (currentImageURL) {
    URL.revokeObjectURL(currentImageURL);
  }

  selectedFile = file;
  currentImageURL = URL.createObjectURL(file);

  resetResults();
  hideMessage();

  fileName.textContent = file.name;
  fileSize.textContent = formatSize(file.size);
  fileInfo.hidden = false;
  decodeBtn.disabled = true;

  const preview = new Image();

  preview.onload = () => {
    if (selectedFile !== file) return;

    imageElement = preview;

    sourceStage.replaceChildren(preview);
    preview.alt = "Uploaded image preview";
    sourceCaption.textContent =
      `${preview.naturalWidth} × ${preview.naturalHeight} pixels`;

    decodeBtn.disabled = false;
  };

  preview.onerror = () => {
    if (selectedFile !== file) return;

    showMessage("Unable to read this image. Try another file.", "error");
    resetScanner();
  };

  preview.src = currentImageURL;
}

browseBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  fileInput.click();
});

dropZone.addEventListener("click", (event) => {
  if (event.target.closest("button")) return;
  fileInput.click();
});

dropZone.addEventListener("keydown", (event) => {
  if (event.target !== dropZone) return;

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    fileInput.click();
  }
});

fileInput.addEventListener("change", () => {
  loadFile(fileInput.files[0]);
});

["dragenter", "dragover"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.add("dragging");
  });
});

["dragleave", "dragend"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    if (!dropZone.contains(event.relatedTarget)) {
      dropZone.classList.remove("dragging");
    }
  });
});

dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropZone.classList.remove("dragging");

  const file = event.dataTransfer.files[0];
  if (file) loadFile(file);
});

removeBtn.addEventListener("click", resetScanner);

function drawDetectedCode(result) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = imageElement.naturalWidth;
  canvas.height = imageElement.naturalHeight;

  ctx.drawImage(imageElement, 0, 0);

  const points = result.getResultPoints();

  if (points && points.length > 0) {
    const xs = points.map(point => point.getX());
    const ys = points.map(point => point.getY());

    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);

    const padding = Math.max(
      10,
      Math.min(canvas.width, canvas.height) * 0.025
    );

    const left = Math.max(0, minX - padding);
    const top = Math.max(0, minY - padding);
    const right = Math.min(canvas.width, maxX + padding);
    const bottom = Math.min(canvas.height, maxY + padding);

    ctx.strokeStyle = "#a78bfa";
    ctx.lineWidth = Math.max(3, canvas.width / 300);
    ctx.shadowColor = "#8b5cf6";
    ctx.shadowBlur = 12;

    // Draw a rectangle around the detected code.
    ctx.strokeRect(left, top, right - left, bottom - top);

    ctx.shadowBlur = 0;

    // Mark the decoder's detected points.
    points.forEach(point => {
      ctx.beginPath();
      ctx.arc(
        point.getX(),
        point.getY(),
        Math.max(4, canvas.width / 200),
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "#78e6bd";
      ctx.fill();
    });
  }

  outputStage.replaceChildren(canvas);
}

function addResultCard(text, format) {
  decodedResults.innerHTML = "";

  const card = document.createElement("article");
  card.className = "result-item";

  const header = document.createElement("div");
  header.className = "result-top";

  const type = document.createElement("span");
  type.className = "result-type";
  type.textContent = format.toUpperCase();

  const number = document.createElement("span");
  number.className = "result-number";
  number.textContent = "RESULT 01";

  header.append(type, number);

  const data = document.createElement("div");
  data.className = "result-data";
  data.textContent = text;

  const actions = document.createElement("div");
  actions.className = "result-actions";

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.className = "small-button";
  copyButton.textContent = "⧉ Copy data";

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(text);
      copyButton.textContent = "✓ Copied";
    } catch {
      // Fallback for browsers where clipboard access is unavailable.
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();

      const copied = document.execCommand("copy");
      textarea.remove();

      copyButton.textContent = copied ? "✓ Copied" : "Copy unavailable";
    }

    setTimeout(() => {
      copyButton.textContent = "⧉ Copy data";
    }, 1800);
  });

  actions.appendChild(copyButton);

  // Only create a clickable link for standard web URLs.
  try {
    const url = new URL(text.trim());

    if (url.protocol === "https:" || url.protocol === "http:") {
      const link = document.createElement("a");
      link.className = "small-button";
      link.href = url.href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "↗ Open URL";
      actions.appendChild(link);
    }
  } catch {
    // The decoded value is ordinary text, not a URL.
  }

  card.append(header, data, actions);
  decodedResults.appendChild(card);
}

decodeBtn.addEventListener("click", async () => {
  if (!imageElement || !selectedFile) return;

  decodeBtn.disabled = true;
  decodeBtn.querySelector("span").textContent = "Decoding...";
  showMessage("Analyzing your image...", "loading");

  resetResults();

  try {
    // Decode a barcode or QR code from the uploaded image.
    const result = await reader.decodeFromImageElement(imageElement);

    decodedText = result.getText();
    decodedFormat = result.getBarcodeFormat().toString();

    drawDetectedCode(result);
    addResultCard(decodedText, decodedFormat);

    resultCount.textContent = "1 CODE FOUND";
    dataCount.textContent = "1 RESULT";

    outputCaption.textContent =
      `Detected ${decodedFormat.toUpperCase()}`;

    showMessage("Code successfully decoded.", "success");
  } catch (error) {
    outputStage.innerHTML = emptyOutput;
    outputCaption.textContent = "No code detected";

    if (
      error instanceof ZXing.NotFoundException ||
      error.name === "NotFoundException"
    ) {
      showMessage(
        "No supported QR code or barcode was found. Try a clearer image with better lighting and a larger code.",
        "error"
      );
    } else {
      console.error("Decoding error:", error);
      showMessage(
        "Could not decode this image. Try another image or check your browser connection.",
        "error"
      );
    }
  } finally {
    decodeBtn.disabled = !imageElement;
    decodeBtn.querySelector("span").textContent = "Decode image";
  }
});
