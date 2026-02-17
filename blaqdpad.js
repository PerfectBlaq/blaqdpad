"use strict";
const canvas = document.querySelector(".cnv-layer");
// workspace is the container of my canvas and div.img-layer element in HTML
const workspace = document.querySelector(".checkboard");
// getting the rectangle properties of the workspace
const rectProp = workspace.getBoundingClientRect();
canvas.width = rectProp.width;
canvas.height = rectProp.height;
// Declaring tools and tool state && getting elements from the DOM
let activeTool = "select";
const selectTool = document.querySelector(".select");
const importTool = document.querySelector(".import");
const pencilTool = document.querySelector(".pencil");
const newCanva = document.querySelector(".new-file");
const download = document.querySelector(".download");
const inputImg = document.getElementById("input");
const imgLayer = document.querySelector(".img-layer");
// Initializing tool state based on active tool
selectTool.addEventListener("click", () => {
  activeTool = "select";
  canvas.style.pointerEvents = "none";
  //   selectTool.style.backgroundColor = "blanchedalmond";
});
pencilTool.addEventListener("click", () => {
  activeTool = "pencil";
  canvas.style.pointerEvents = "auto";
  //   pencilTool.style.backgroundColor = "blanchedalmond";
});
//Import && Select Tool
let isDragging = false;
let startX = 0;
let startY = 0;
let imgStartLeft = 0;
let imgStartTop = 0;
let selectedImg = null;
importTool.addEventListener("click", () => {
  inputImg.click();
});
inputImg.addEventListener("change", () => {
  const file = inputImg.files[0];
  inputImg.value = "";
  if (!file) return;
  const imgUrl = URL.createObjectURL(file);
  const img = document.createElement("img");
  img.src = imgUrl;
  img.classList.add("img-file");
  img.draggable = false;
  imgLayer.appendChild(img);
  selectedImg = img;
  img.addEventListener("mousedown", (e) => {
    if (activeTool !== "select") return;
    e.preventDefault();
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    imgStartLeft = img.offsetLeft;
    imgStartTop = img.offsetTop;
  });
});
document.addEventListener("mousemove", (e) => {
  if (!selectedImg || !isDragging) return;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  selectedImg.style.left = imgStartLeft + dx + "px";
  selectedImg.style.top = imgStartTop + dy + "px";
});
document.addEventListener("mouseup", () => {
  isDragging = false;
});
//Pencil Tool
const context = canvas.getContext("2d");
let isDrawing = false;
canvas.addEventListener("mousedown", (e) => {
  if (activeTool !== "pencil") return;
  isDrawing = true;
  context.beginPath();
  context.moveTo(e.offsetLeft, e.offsetTop);
  context.lineWidth = 3;
});
canvas.addEventListener("mousemove", (e) => {
  if (activeTool !== "pencil" || !isDrawing) return;
  context.lineTo(e.offsetX, e.offsetY);
  context.stroke();
});
canvas.addEventListener("mouseup", () => {
  isDrawing = false;
});
//New Canvas
newCanva.addEventListener("click", () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  imgLayer.innerHTML = "";
  activeTool = "select";
  isDragging = "false";
  selectedImg = null;
  activeTool = "select";
  canvas.style.pointerEvents = "none";
});
//Download Tool
download.addEventListener("click", () => {
  const exportcnv = document.createElement("canvas");
  const exportcnvctx = exportcnv.getContext("2d");
  exportcnv.height = canvas.height;
  exportcnv.width = canvas.width;

  const downloadImg = document.querySelectorAll("img");
  downloadImg.forEach((img) => {
    exportcnvctx.drawImage(
      img,
      img.offsetLeft,
      img.offsetTop,
      img.width,
      img.height,
    );
  });
  exportcnvctx.drawImage(canvas, 0, 0);

  // const link = document.createElement("a");
  const link = document.getElementById("download-link");
  link.download = "blaqdpad.png";
  link.href = exportcnv.toDataURL("image/png");
  link.click();
});
