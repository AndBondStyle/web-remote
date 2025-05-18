<script setup lang="ts">
import { useFullscreen, useGamepad, useScreenOrientation, useWindowSize } from "@vueuse/core"
import { computed, ref } from "vue"
import { theme } from "ant-design-vue"
import Joystick from "./Joystick.vue"

const { orientation } = useScreenOrientation()
const { width, height } = useWindowSize()
const { isFullscreen, enter: enterFullscreen } = useFullscreen()

const { isSupported: gamepadSupported, gamepads } = useGamepad()
const gamepad = computed(() => gamepads.value.find((g) => g.mapping === "standard"))
</script>

<template>
  <a-config-provider :theme="{ algorithm: theme.darkAlgorithm }">
    <div class="wrapper">
      <a-space class="options" direction="vertical">
        <a-typography-text>Orientation: {{ orientation }}</a-typography-text>
        <a-typography-text>Gamepad supported: {{ gamepadSupported }}</a-typography-text>
        <a-typography-text>Gamepads: {{ gamepads }}</a-typography-text>
        <a-typography-text>Size: {{ width }}x{{ height }}</a-typography-text>

        <a-button class="fullscreen" v-if="!isFullscreen" @click="enterFullscreen">
          FULLSCREEN
        </a-button>
      </a-space>
      <div class="gamepad">
        <Joystick></Joystick>
      </div>
    </div>
  </a-config-provider>
</template>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  background: #222;
}

.options {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.gamepad {
  background: rgba(0, 0, 0, 0.2);
  aspect-ratio: 1 / 1;
  position: relative;

  /* padding: 30px; */
  display: flex;
  justify-content: stretch;
  align-items: stretch;
}

@media screen and (orientation: landscape) {
  .wrapper {
    width: 100%;
    max-width: 1000px;
    max-height: 500px;
    flex-direction: row;
  }

  .gamepad {
    width: min(100dvh, 50dvw, 500px);
  }
}

@media screen and (orientation: portrait) {
  .wrapper {
    height: 100%;
    max-height: 1000px;
    max-width: 500px;
    flex-direction: column;
  }

  .gamepad {
    width: min(100dvw, 50dvh, 500px);
  }
}
</style>
