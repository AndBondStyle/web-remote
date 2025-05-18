<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from "vue"
import { TouchHandler, type Point } from "../core/TouchHandler.ts"

const refs = {
  stage: useTemplateRef("stage"),
  pad: useTemplateRef("pad"),
  input: useTemplateRef("input"),
  target: useTemplateRef("target"),
  feedback: useTemplateRef("feedback"),
}

const touchHandler = new TouchHandler()

let isParked = true

const callback = (pos: Point) => {
  // console.log("-->", pos)
  const rect = refs.pad.value!.getBoundingClientRect()
  const x = (rect.width * pos.x) / 2
  const y = (rect.height * pos.y) / 2
  const parked = pos.x == 0 && pos.y == 0

  const translate = `${x.toFixed(0)}px ${y.toFixed(0)}px`
  if (!parked) refs.input.value!.style.translate = translate
  refs.target.value!.style.translate = translate

  refs.stage.value!.classList.toggle("parked", parked)
  if (parked != isParked) {
    isParked = parked
    if (parked) navigator.vibrate([50])
  }
}

onMounted(() => {
  console.log("mounted")
  touchHandler.init(refs.stage.value!, callback)
  callback({ x: 0, y: 0 })
})

onBeforeUnmount(() => {
  console.log("beforeunmount")
  touchHandler.destroy()
})
</script>

<template>
  <div class="stage" ref="stage">
    <span class="pad" ref="pad"></span>

    <span class="line v dashed"></span>
    <span class="line h dashed"></span>

    <span class="input overlay" ref="input">
      <span class="line v"></span>
      <span class="line h"></span>
    </span>
    <span class="target overlay" ref="target">
      <span class="circle"></span>
    </span>
    <span class="feedback overlay" ref="feedback"></span>
  </div>
</template>

<style scoped>
.stage {
  /* position: absolute; */
  /* width: 100%; */
  /* height: 100%; */
  touch-action: none;
  flex: 1;
  overflow: hidden;
  position: relative;

  --margin: 25px;
}

.line {
  --width: 2px;

  position: absolute;
  border-width: 0;
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.2);
}

.line.h {
  width: 100%;
  height: var(--width);
  top: calc(50% - var(--width) / 2);
  border-top-width: var(--width);
}

.line.v {
  height: 100%;
  width: var(--width);
  left: calc(50% - var(--width) / 2);
  border-left-width: var(--width);
}

.line.dashed {
  border-style: dashed;
}

.stage:not(.parked) .input .line {
  transition: border-color 100ms ease-out;
}

.stage.parked .input .line {
  border-color: transparent;
  transition: border-color 500ms ease-out;
}

.pad {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  width: calc(100% - var(--margin) * 2);
  height: calc(100% - var(--margin) * 2);
  top: var(--margin);
  left: var(--margin);
  border-radius: 15px;
  /* outline: 15px solid rgba(255, 255, 255, 0.1); */
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
}

.input .line.v {
  --width: 2px;
  height: 300%;
  translate: 0 -50%;
}

.input .line.h {
  --width: 2px;
  width: 300%;
  translate: -50% 0;
}

.target {
  transition: translate 100ms;
}

.circle {
  --size: 30px;
  transform: translate(-50%, -50%);

  position: absolute;
  width: var(--size);
  height: var(--size);

  top: 50%;
  left: 50%;

  border-radius: 100%;
  border: 8px solid rgba(255, 255, 255, 0.6);
  /* transition: all 100ms; */
}
</style>
