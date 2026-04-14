<script setup lang="ts">
import { deepCopy, exportAsFile, getImageSizeMapFromConfig, openFilePicker } from "@/utils";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import Drager from "es-drager";
import { NButton, NColorPicker, NDivider, NDrawer, NDrawerContent, NDropdown, NForm, NFormItem, NInput, NInputNumber, useMessage } from "naive-ui";
import { useRouter } from "vue-router";
import { useLocalConfig } from "@/hooks/useLocalConfig";

const { defaultConfigs, saveLocalConfig, getLocalConfig } = useLocalConfig();
const config = ref<IGamepadConfig>(deepCopy(defaultConfigs[0]));
const imgSizeMap = ref<Map<string, { width: number; height: number }>>(new Map());
const router = useRouter();
const backgroundColor = ref("rgb(240,242,245)");
const draggingTime = ref(0);
const isShowDrawer = ref(false);
const currentSelectItem = ref<IGamepadConfigItem>();
const editingItem = ref({ gamepadImg: "", img: "", imgActive: "", scale: 1, angle: 0 });
const message = useMessage();
const actionOptions = ref([
  {
    label: "预设皮肤",
    key: "configs",
    children: [
      {
        label: "默认",
        key: "config-0"
      },
      {
        label: "SWITCH",
        key: "config-1"
      },
      {
        label: "XBOX",
        key: "config-2"
      },
      {
        label: "PS4",
        key: "config-3"
      },
      {
        label: "PS5",
        key: "config-4"
      }
    ]
  },
  {
    label: "导入皮肤",
    key: "import"
  },
  {
    label: "导出皮肤",
    key: "export"
  }
]);

const onSelectAction = (key: string | number) => {
  switch (key) {
    case "export":
      exportAsFile(config.value, "我的手柄.json");
      message.success("导出皮肤完毕，请注意保存");
      break;
    case "import":
      openFilePicker((data) => {
        if (!data.gamepad) {
          message.error("请导入正确的皮肤");
          return;
        }
        setConfig(data);
      });
      break;
    default:
      break;
  }
  if (key.toString().includes("config-")) {
    let configIndex = Number(key.toString().split("-")[1]);
    setConfig(defaultConfigs[configIndex]);
  }
};

const getItemProps = (item: IGamepadConfigItem) => {
  if (imgSizeMap.value.size === 0) return {};
  let img = item.img !== "" ? item.img : item.imgActive;
  const width = imgSizeMap.value.get(img)?.width || 0;
  const height = imgSizeMap.value.get(img)?.height || 0;
  return {
    top: item.top,
    left: item.left,
    width: width * item.scale,
    height: height * item.scale,
    equalProportion: true,
    boundary: true,
    rotatable: true,
    style: `background-image: url(${img});`
  };
};

const preventDefault = (e: any) => e.preventDefault();
const disableScroll = () => {
  draggingTime.value = new Date().getTime();
  window.addEventListener("touchmove", preventDefault, { passive: false });
  window.addEventListener("wheel", preventDefault, { passive: false });
};
const enableScroll = () => {
  draggingTime.value = new Date().getTime() - draggingTime.value;
  window.removeEventListener("touchmove", preventDefault);
  window.removeEventListener("wheel", preventDefault);
};

const getItemEvent = (item: IGamepadConfigItem) => {
  return {
    change: (e: any) => {
      let img = item.img !== "" ? item.img : item.imgActive;
      const width = imgSizeMap.value.get(img)?.width || 0;
      if (width) item.scale = Number((e.width / width).toFixed(4));
      item.left = e.left >= 0 ? e.left : 0;
      item.top = e.top >= 0 ? e.top : 0;
      item.angle = Number(e.angle.toFixed(2));
    },
    dragStart: () => disableScroll(),
    dragEnd: () => enableScroll(),
    resizeStart: () => disableScroll(),
    resizeEnd: () => enableScroll(),
    rotateStart: () => disableScroll(),
    rotateEnd: () => enableScroll(),
    click: () => {
      if (draggingTime.value > 200) return;
      editingItem.value = {
        gamepadImg: config.value.gamepad.img,
        img: item.img,
        imgActive: item.imgActive,
        scale: item.scale,
        angle: item.angle
      };
      currentSelectItem.value = item;
      isShowDrawer.value = true;
    }
  };
};

const gamepadStyle = computed(() => {
  if (imgSizeMap.value.size === 0) return "";
  const gamepadSize = imgSizeMap.value.get(config.value.gamepad.img);
  if (!gamepadSize) return "";
  return `width:${gamepadSize.width}px;height:${gamepadSize.height}px;background-image: url(${config.value.gamepad.img});`;
});

const applyEditing = async () => {
  refreshImgSizeMap();
  isShowDrawer.value = false;
};

watch(
  () => editingItem.value,
  (newVal) => {
    if (!currentSelectItem.value) return;
    config.value.gamepad.img = newVal.gamepadImg;
    currentSelectItem.value.img = newVal.img;
    currentSelectItem.value.imgActive = newVal.imgActive;
    currentSelectItem.value.scale = newVal.scale;
    currentSelectItem.value.angle = newVal.angle;
  },
  { deep: true }
);

const refreshImgSizeMap = async () => {
  imgSizeMap.value = await getImageSizeMapFromConfig(config.value);
};

const setConfig = (newConfig: IGamepadConfig) => {
  config.value = deepCopy(newConfig);
  refreshImgSizeMap();
  message.success("已切换预设");
};

const saveSetting = () => {
  saveLocalConfig(config.value);
  router.push(`/`);
};

watch(
  () => backgroundColor.value,
  (value) => {
    document.body.style.backgroundColor = value;
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  document.body.style.backgroundColor = "";
});
onMounted(() => {
  config.value = getLocalConfig();
  refreshImgSizeMap();
});
</script>

<template>
  <div ref="refSetting" class="w-full h-full">
    <div class="w-full fixed top-0 left-0 h-14 bg-white flex px-4 z-30 justify-between">
      <div class="flex items-center text-xl font-bold cursor-pointer" @click="router.push(`/`)">
        <span class="text-2xl">🎮</span><span class="ml-2 bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">SyncJoy</span>
      </div>
      <div class="flex justify-center items-center space-x-2 lg:space-x-4">
        <NDropdown trigger="click" :options="actionOptions" @select="onSelectAction">
          <NButton strong>更换皮肤</NButton>
        </NDropdown>
        <NButton type="primary" strong @click="saveSetting">保存设置</NButton>
      </div>
    </div>
    <div v-if="imgSizeMap.size !== 0" class="w-full h-full relative mt-14">
      <div class="absolute w-full h-full left-0 top-0 bg-no-repeat bg-[100%,100%]" :style="gamepadStyle"></div>
      <Drager class="absolute bg-no-repeat bg-[100%,100%]" v-bind="getItemProps(config.buttons.a)" v-on="getItemEvent(config.buttons.a)"></Drager>
      <Drager class="absolute bg-no-repeat bg-[100%,100%]" v-bind="getItemProps(config.buttons.b)" v-on="getItemEvent(config.buttons.b)"></Drager>
      <Drager class="absolute bg-no-repeat bg-[100%,100%]" v-bind="getItemProps(config.buttons.x)" v-on="getItemEvent(config.buttons.x)"></Drager>
      <Drager class="absolute bg-no-repeat bg-[100%,100%]" v-bind="getItemProps(config.buttons.y)" v-on="getItemEvent(config.buttons.y)"></Drager>
      <Drager class="absolute bg-no-repeat bg-[100%,100%]" v-bind="getItemProps(config.bumper.left)" v-on="getItemEvent(config.bumper.left)"></Drager>
      <Drager class="absolute bg-no-repeat bg-[100%,100%]" v-bind="getItemProps(config.bumper.right)" v-on="getItemEvent(config.bumper.right)"></Drager>
      <Drager class="absolute bg-no-repeat bg-[100%,100%]" v-bind="getItemProps(config.triggers.left)" v-on="getItemEvent(config.triggers.left)"></Drager>
      <Drager class="absolute bg-no-repeat bg-[100%,100%]" v-bind="getItemProps(config.triggers.right)" v-on="getItemEvent(config.triggers.right)"></Drager>
      <Drager class="absolute bg-no-repeat bg-[100%,100%]" v-bind="getItemProps(config.stick.left)" v-on="getItemEvent(config.stick.left)"></Drager>
      <Drager class="absolute bg-no-repeat bg-[100%,100%]" v-bind="getItemProps(config.stick.right)" v-on="getItemEvent(config.stick.right)"></Drager>
      <Drager class="absolute bg-no-repeat bg-[100%,100%]" v-bind="getItemProps(config.dpad.up)" v-on="getItemEvent(config.dpad.up)"></Drager>
      <Drager class="absolute bg-no-repeat bg-[100%,100%]" v-bind="getItemProps(config.dpad.down)" v-on="getItemEvent(config.dpad.down)"></Drager>
      <Drager class="absolute bg-no-repeat bg-[100%,100%]" v-bind="getItemProps(config.dpad.left)" v-on="getItemEvent(config.dpad.left)"></Drager>
      <Drager class="absolute bg-no-repeat bg-[100%,100%]" v-bind="getItemProps(config.dpad.right)" v-on="getItemEvent(config.dpad.right)"></Drager>
      <Drager class="absolute bg-no-repeat bg-[100%,100%]" v-bind="getItemProps(config.back)" v-on="getItemEvent(config.back)"></Drager>
      <Drager class="absolute bg-no-repeat bg-[100%,100%]" v-bind="getItemProps(config.start)" v-on="getItemEvent(config.start)"></Drager>
    </div>
    <NDrawer v-model:show="isShowDrawer" placement="right" resizable :default-width="360" :auto-focus="false" :show-mask="false" :mask-closable="false" style="box-shadow: -4px 0 15px rgba(0,0,0,0.1);">
      <NDrawerContent>
        <template #header>
          <span>编辑按键</span>
        </template>
        <NForm ref="refEditing" :model="editingItem">
          <NFormItem label="按钮图片地址">
            <NInput v-model:value="editingItem.img" placeholder="选填 支持各种格式(png/svg/jpg...)" />
            <img :style="`background-color: ${backgroundColor};`" class="w-8 lg:w-16 ml-2 lg:ml-4" :src="editingItem.img" />
          </NFormItem>
          <NFormItem label="按钮触发图片地址">
            <NInput v-model:value="editingItem.imgActive" placeholder="选填 支持各种格式(png/svg/jpg...)" />
            <img :style="`background-color: ${backgroundColor};`" class="w-8 lg:w-16 ml-2 lg:ml-4" :src="editingItem.imgActive" />
          </NFormItem>
          <NFormItem label="放大倍数">
            <NInputNumber class="w-full" :step="0.0001" v-model:value="editingItem.scale" />
          </NFormItem>
          <NFormItem label="旋转角度">
            <NInputNumber class="w-full" :step="0.1" v-model:value="editingItem.angle" />
          </NFormItem>
          <NDivider></NDivider>
          <NFormItem label="手柄图片地址" show-require-mark>
            <NInput v-model:value="editingItem.gamepadImg" required placeholder="请输入" />
            <img :style="`background-color: ${backgroundColor};`" class="w-8 lg:w-16 ml-2 lg:ml-4" :src="editingItem.gamepadImg" />
          </NFormItem>
          <NFormItem label="画布背景色" :required="false">
            <NColorPicker v-model:value="backgroundColor"></NColorPicker>
          </NFormItem>
        </NForm>
        <template #footer>
          <div class="flex space-x-2 lg:space-x-4">
            <NButton strong @click="isShowDrawer = false">取消</NButton>
            <NButton type="primary" strong @click="applyEditing">应用</NButton>
          </div>
        </template>
      </NDrawerContent>
    </NDrawer>
  </div>
</template>

<style scoped></style>
