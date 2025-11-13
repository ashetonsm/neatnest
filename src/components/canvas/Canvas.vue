<script setup lang="ts">
import { onMounted, ref } from "vue";

const props = defineProps<{
  size: number;
  color: string;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasBoundingRect = ref<any | null>(null);
const click = ref<boolean>(false)
var pixelSize = 0

const draw = (ctx: CanvasRenderingContext2D, e: any) => {
  if (canvasRef.value) {
    pixelSize = canvasRef.value.width / props.size;
    const x = e.pageX - canvasRef.value.offsetLeft;
    const y = e.pageY - canvasRef.value.offsetTop;
    ctx.fillStyle = props.color;

    ctx.fillRect(
      Math.floor(x / pixelSize) * pixelSize,
      Math.floor(y / pixelSize) * pixelSize,
      pixelSize,
      pixelSize
    );
  }
};

const preview = (ctx: CanvasRenderingContext2D, e: any) => {
  if (canvasRef.value) {
    pixelSize = canvasRef.value.width / props.size;
    const x = e.pageX - canvasRef.value.offsetLeft;
    const y = e.pageY - canvasRef.value.offsetTop;

    var locationColor = ctx.getImageData(
      Math.floor(x / pixelSize) * pixelSize,
      Math.floor(y / pixelSize) * pixelSize,
      pixelSize,
      pixelSize
    );

    const r = locationColor.data[300].toString();
    const g = locationColor.data[301].toString();
    const b = locationColor.data[302].toString();

    // RGB of the moused over area
    const rgb = `rgb(${r}, ${g}, ${b})`;

    if (click.value == true) {
      draw(ctx, e)
    }
  }
};

function mouseDown() {
  return click.value = true
}

function mouseUp() {
  return click.value = false
}

function previewPixel(e: any) {
  preview(canvasRef.value!.getContext("2d")!, e);
}

function adjustCanvasSize() {
  if (canvasRef.value) {
    // Make the width and height equal so it's a square
    canvasRef.value!.width = canvasRef.value!.offsetWidth;
    canvasRef.value!.height = canvasRef.value!.offsetWidth;

    // Fill the canvas with white again
    const context = canvasRef.value.getContext("2d");
    context!.fillStyle = "rgb(255, 255, 255)";
    context!.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  }
}

onMounted(() => {
  alert("Warning: If you resize the window, your work will be lost!");
  // Adjust the canvas size when the window is resized so the pixels aren't placed incorrectly
  window.addEventListener("resize", adjustCanvasSize);
  window.addEventListener("mousedown", mouseDown);
  window.addEventListener("mouseup", mouseUp);

  if (canvasRef.value) {
    // Make the width and height equal so it's a square
    canvasRef.value.width = canvasRef.value.offsetWidth;
    canvasRef.value.height = canvasRef.value.offsetWidth;
    canvasBoundingRect.value = canvasRef.value.getBoundingClientRect();

    // Fill the canvas with white
    const context = canvasRef.value.getContext("2d");
    context!.fillStyle = "rgb(255, 255, 255)";
    context!.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  }
});
</script>

<template>
  <canvas @mousemove="previewPixel" ref="canvasRef"></canvas>
</template>

<style lang="css" scoped>
.navbar {
  padding: 1em;
  margin-bottom: 1em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: gray;
  border-radius: 3px;
}

button,
input {
  height: 35px;
  padding: 0 1em;
}

.color {
  width: 1em;
  border-radius: 100%;
}

.container {
  display: flex;
  width: 100%;
  align-content: center;
  align-items: center;
  justify-content: center;
}

canvas {
  border: 2px solid black;
  min-width: 300px;
  width: 25vw;
  max-width: 500px;
  min-height: 300px;
  height: 25vw;
  max-height: 500px;
}
</style>
