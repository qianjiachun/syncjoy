<script setup lang="ts">
import { decodeInputStateToXbox360Controller, getFormatGamepadConfig, getImageSizeMapFromConfig } from "@/utils";
import { useElementSize } from "@vueuse/core";
import { computed, ref, watch } from "vue";

const props = defineProps<{
  config?: IGamepadConfig;
  inputState?: IGamepadInputState;
}>();

const config = ref<IGamepadConfig | undefined>(props.config);

const refGamepadWrap = ref<HTMLDivElement>();
const gamepadElementSize = useElementSize(refGamepadWrap);
const gamepadStyle = computed(() => {
  if (!config.value || imgSizeMap.value.size === 0 || !refGamepadWrap.value) return "";
  const gamepadSize = imgSizeMap.value.get(config.value.gamepad.img);
  if (!gamepadSize) return "";
  const height = (gamepadElementSize.width.value * gamepadSize.height) / gamepadSize.width;
  const width = (gamepadElementSize.height.value * gamepadSize.width) / gamepadSize.height;
  if (height > gamepadElementSize.height.value) {
    return `width: ${width}px;height: ${gamepadElementSize.height.value}px;`;
  } else {
    return `width: ${gamepadElementSize.width.value}px;height: ${height}px;`;
  }
});

const imgSizeMap = ref<Map<string, { width: number; height: number }>>(new Map());
const controller = computed(() => decodeInputStateToXbox360Controller(props.inputState));
const getItemStyle = (item: IGamepadConfigItem, value?: boolean | number) => {
  if (!config.value || imgSizeMap.value.size === 0) return "";
  let image = item.img !== "" ? item.img : item.imgActive;
  const gamepadSize = imgSizeMap.value.get(config.value.gamepad.img);
  const imgSize = imgSizeMap.value.get(image);
  if (!gamepadSize || !imgSize) return "";
  const { left, top, img, imgActive, angle } = item;
  const width = (100 * item.scale * imgSize.width) / gamepadSize.width;
  const height = (100 * item.scale * imgSize.height) / gamepadSize.height;
  const transform = `transform: rotate(${angle}deg);`;
  let bg = value === true || value === 1 ? `background-image: url(${imgActive});` : `background-image: url(${img});`;
  return `width:${width}%;height:${height}%;${bg};left:${left * 100}%;top:${top * 100}%;${transform}`;
};

const getTriggerOpacity = (value: any) => {
  if (!value) return "opacity: 0;";
  return `opacity: ${value};`;
};

const getStickPositionStyle = (value: any) => {
  if (!value) return "";
  const horizontal = Number(value.horizontal.toFixed(4));
  const vertical = Number(value.vertical.toFixed(4));
  // 上下偏移2%
  const marginLeft = horizontal * 2;
  const marginTop = vertical * 2;
  return `margin-left: ${marginLeft}%;margin-top: ${marginTop}%;`;
};

watch(
  () => props.config,
  async (value) => {
    if (!value) return;
    imgSizeMap.value = await getImageSizeMapFromConfig(value);
    config.value = await getFormatGamepadConfig(value, "percent");
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div v-if="config && controller" ref="refGamepadWrap" class="bg-transparent flex justify-center items-center">
    <div class="relative" :style="gamepadStyle">
      <div class="absolute w-full h-full left-0 top-0 bg-no-repeat bg-[100%,100%]" :style="`background-image: url(${config.gamepad.img});`"></div>
      <div class="absolute bg-[100%,100%] bg-no-repeat" :style="getItemStyle(config.buttons.a, controller.buttons.a)"></div>
      <div class="absolute bg-[100%,100%] bg-no-repeat" :style="getItemStyle(config.buttons.b, controller.buttons.b)"></div>
      <div class="absolute bg-[100%,100%] bg-no-repeat" :style="getItemStyle(config.buttons.x, controller.buttons.x)"></div>
      <div class="absolute bg-[100%,100%] bg-no-repeat" :style="getItemStyle(config.buttons.y, controller.buttons.y)"></div>
      <div class="absolute bg-[100%,100%] bg-no-repeat" :style="getItemStyle(config.bumper.left, controller.bumper.left)"></div>
      <div class="absolute bg-[100%,100%] bg-no-repeat" :style="getItemStyle(config.bumper.right, controller.bumper.right)"></div>
      <div class="absolute bg-[100%,100%] bg-no-repeat" :style="getItemStyle(config.triggers.left, controller.triggers.left)"></div>
      <div class="absolute bg-[100%,100%] bg-no-repeat" :style="getItemStyle(config.triggers.right, controller.triggers.right)"></div>
      <div class="absolute bg-[100%,100%] bg-no-repeat" :style="getItemStyle(config.dpad.up, controller.dpad.up)"></div>
      <div class="absolute bg-[100%,100%] bg-no-repeat" :style="getItemStyle(config.dpad.down, controller.dpad.down)"></div>
      <div class="absolute bg-[100%,100%] bg-no-repeat" :style="getItemStyle(config.dpad.left, controller.dpad.left)"></div>
      <div class="absolute bg-[100%,100%] bg-no-repeat" :style="getItemStyle(config.dpad.right, controller.dpad.right)"></div>
      <div class="absolute bg-[100%,100%] bg-no-repeat" :style="getItemStyle(config.back, controller.back)"></div>
      <div class="absolute bg-[100%,100%] bg-no-repeat" :style="getItemStyle(config.start, controller.start)"></div>
      <div class="absolute bg-[100%,100%] bg-no-repeat" :style="getItemStyle(config.stick.left, controller.stick.left.button) + getStickPositionStyle(controller.stick.left)"></div>
      <div class="absolute bg-[100%,100%] bg-no-repeat" :style="getItemStyle(config.stick.right, controller.stick.right.button) + getStickPositionStyle(controller.stick.right)"></div>
      <div
        class="absolute bg-[100%,100%] bg-no-repeat"
        :style="getItemStyle(config.triggers.left, controller.triggers.left) + `background-image: url(${config.triggers.left.imgActive});` + getTriggerOpacity(controller.triggers.left)"
      ></div>
      <div
        class="absolute bg-[100%,100%] bg-no-repeat"
        :style="getItemStyle(config.triggers.right, controller.triggers.right) + `background-image: url(${config.triggers.right.imgActive});` + getTriggerOpacity(controller.triggers.right)"
      ></div>
    </div>
  </div>
</template>

<style scoped></style>
