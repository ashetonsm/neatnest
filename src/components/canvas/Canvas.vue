<script setup lang="ts">
import { onMounted, ref } from "vue";

const props = defineProps<{
  size: number;
  color: string;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasBoundingRect = ref<any | null>(null);
const click = ref<boolean>(false);
const touch = ref<boolean>(false);
var pixelSize = 0;

const draw = (ctx: CanvasRenderingContext2D, e: any) => {
  if (canvasRef.value) {
    if (touch.value) {
      pixelSize = canvasRef.value.width / props.size;
      const x = e.touches[0].pageX - canvasBoundingRect.value.left;
      const y = e.touches[0].pageY - canvasBoundingRect.value.height;
      ctx.fillStyle = props.color;

      ctx.fillRect(
        Math.floor(x / pixelSize) * pixelSize,
        Math.floor(y / pixelSize) * pixelSize,
        pixelSize,
        pixelSize
      );
    } else {
      pixelSize = canvasRef.value.width / props.size;
      const x = e.pageX - canvasBoundingRect.value.left;
      const y = e.pageY - canvasBoundingRect.value.height;
      ctx.fillStyle = props.color;

      ctx.fillRect(
        Math.floor(x / pixelSize) * pixelSize,
        Math.floor(y / pixelSize) * pixelSize,
        pixelSize,
        pixelSize
      );
    }
  }
};

const prepareDraw = (ctx: CanvasRenderingContext2D, e: any) => {
  if (canvasRef.value) {
    draw(ctx, e);
  }
};

function mouseDown(e: any) {
  if (e.target == canvasRef.value) {
    if (e.type == "touchstart") {
      touch.value = true;
    } else {
      click.value = true;
    }
    return contextLoader(e);
  } else {
    return;
  }
}

function mouseUp() {
  return (click.value = false), (touch.value = false);
}

function contextLoader(e: any) {
  if (click.value) {
    prepareDraw(canvasRef.value!.getContext("2d")!, e);
  }
}

function touchContextLoader(e: any) {
  touch.value = true;
  prepareDraw(canvasRef.value!.getContext("2d")!, e);
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
    if (context) {
      context.fillStyle = "rgb(255, 255, 255)";
      context.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);
    }
  }
});
</script>

<template>
  <canvas
    @touchstart="mouseDown"
    @touchend="mouseUp"
    @mousemove="contextLoader"
    @touchmove="touchContextLoader"
    ref="canvasRef"
  ></canvas>
</template>
