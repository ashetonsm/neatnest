<script setup lang="ts">
import { onMounted, ref } from "vue";

const props = defineProps<{
  size: number;
  color: string;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasBoundingRect = ref<any | null>(null);
const click = ref<boolean>(false);
var pixelSize = 0;

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
    if (click.value == true) {
      draw(ctx, e);
    }
  }
};

function mouseDown() {
  return (click.value = true);
}

function mouseUp() {
  return (click.value = false);
}

function previewPixel(e: any) {
  preview(canvasRef.value!.getContext("2d")!, e);
}

onMounted(() => {
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
