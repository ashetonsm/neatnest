<script setup lang="ts">
import { onMounted, ref } from 'vue';

const props = defineProps<{
  size: number,
  color: string
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasBoundingRect = ref<any | null>(null)

const draw = (ctx: CanvasRenderingContext2D, e: any) => {
    if (canvasRef.value) {
        var pixelSize = (canvasRef.value.width / props.size)
        ctx.fillStyle = props.color

        const x = (e.pageX - canvasRef.value.offsetLeft)
        const y = (e.pageY - canvasRef.value.offsetTop)
        
        ctx.fillRect(
            Math.floor(x / pixelSize) * pixelSize, 
            Math.floor(y / pixelSize) * pixelSize, 
            pixelSize, 
            pixelSize)
    }
}

function fillPixel(e: any) {
    const context = canvasRef.value!.getContext('2d')
    draw(context!, e)
}

function adjustCanvasSize() {
    if (canvasRef.value) {
        // Make the width and height equal so it's a square
        canvasRef.value!.width = canvasRef.value!.offsetWidth
        canvasRef.value!.height = canvasRef.value!.offsetWidth

        // Fill the canvas with white again
        const context = canvasRef.value.getContext('2d')
        context!.fillStyle = "#FFFFFF"
        context!.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    }
}

onMounted(() => {
    alert("Warning: If you resize the window, your work will be lost!")
    // Adjust the canvas size when the window is resized so the pixels aren't placed incorrectly
    window.addEventListener("resize", adjustCanvasSize)

    if (canvasRef.value) {
        // Make the width and height equal so it's a square
        canvasRef.value.width = canvasRef.value.offsetWidth
        canvasRef.value.height = canvasRef.value.offsetWidth
        canvasBoundingRect.value = canvasRef.value.getBoundingClientRect()

        // Fill the canvas with white
        const context = canvasRef.value.getContext('2d')
        context!.fillStyle = "#FFFFFF"
        context!.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    }
})

</script>

<template>
    <canvas @click="fillPixel" ref="canvasRef"></canvas>
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

button, input {
    height: 35px;
    padding: 0 1em;
}

.color {
    width: 1em;
    border-radius: 100%;
}

.black {
    color: white;
    background-color: black;
}

.white {
    color: black;
    background-color: white;
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