<script setup lang="ts">
import { useGamepad } from "@/hooks/useGamepad";
import { computed, onMounted, ref, watch } from "vue";
import Gamepad from "@/components/Gamepad/index.vue";
import { useRoute } from "vue-router";
import { useSignalling } from "@/hooks/useSignalling";
const { inputState, onInput } = useGamepad();
const route = useRoute();
const localConfig = ref<IGamepadConfig>();
const remoteGamepads = ref<Record<string, IRemoteGamepad>>({});
const signalling = useSignalling();

const validRemoteGamepads = computed(() => {
  return Object.values(remoteGamepads.value).filter((gamepad) => gamepad.config);
});

signalling.onMessage((message) => {
  const data = JSON.parse(message) as IMessage<IGamepadInputState | IGamepadConfig | string>;
  switch (data.type) {
    case "input":
      handleMessageInput(data as IMessage<IGamepadInputState>);
      break;
    case "need_config":
      handleMessageNeedConfig(data as IMessage<string>);
      break;
    case "config":
      handleMessageConfig(data as IMessage<IGamepadConfig>);
      break;
    default:
      break;
  }
});

signalling.onUserLeave((uid) => {
  delete remoteGamepads.value[uid];
});

const handleMessageInput = (message: IMessage<IGamepadInputState>) => {
  if (message.uid === signalling.myUid.value) return;
  if (!remoteGamepads.value[message.uid]) {
    remoteGamepads.value[message.uid] = {
      uid: message.uid,
      inputState: message.data
    };
  } else {
    if (!remoteGamepads.value[message.uid].config && localConfig.value) {
      const data: IMessage<string> = {
        type: "need_config",
        uid: signalling.myUid.value,
        data: message.uid
      };
      signalling.sendMessage(JSON.stringify(data));
    }
    remoteGamepads.value[message.uid].inputState = message.data;
  }
};

const handleMessageNeedConfig = (message: IMessage<string>) => {
  if (message.data === signalling.myUid.value && localConfig.value) {
    const data: IMessage<IGamepadConfig> = {
      type: "config",
      uid: signalling.myUid.value,
      data: localConfig.value
    };
    signalling.sendMessage(JSON.stringify(data));
  }
};

const handleMessageConfig = (message: IMessage<IGamepadConfig>) => {
  if (message.uid === signalling.myUid.value) return;
  if (!remoteGamepads.value[message.uid]) {
    remoteGamepads.value[message.uid] = {
      uid: message.uid,
      config: message.data
    };
  } else {
    remoteGamepads.value[message.uid].config = message.data;
  }
};

onInput((value) => {
  if (!value) return;
  const data: IMessage<IGamepadInputState> = {
    type: "input",
    uid: signalling.myUid.value,
    data: value
  };
  signalling.sendMessage(JSON.stringify(data));
});
watch(
  () => signalling.isServerConnected.value,
  (value) => {
    if (!value) return;
    const rid = route.params.rid;
    if (rid && typeof rid === "string" && rid !== "") {
      signalling.joinRoom(rid as string);
    }
  }
);
onMounted(() => {
  const config = route.query.config;
  if (config) {
    try {
      localConfig.value = JSON.parse(config as string);
    } catch (error) {
      console.error(error);
    }
  }
});
</script>

<template>
  <div :style="`grid-template-columns: repeat(${validRemoteGamepads.length + (localConfig ? 1 : 0)}, minmax(0, 1fr));`" class="w-full h-full grid gap-4">
    <div class="w-full h-full flex justify-center items-center text-4xl lg:text-5xl text-gray-400 text-nowrap" v-if="(!localConfig || !inputState) && validRemoteGamepads.length === 0">
      请输入任意手柄按键
    </div>
    <Gamepad class="w-full h-full" :inputState="inputState" :config="localConfig"></Gamepad>
    <Gamepad v-for="item in remoteGamepads" :key="item.uid" class="w-full h-full" :inputState="item.inputState" :config="item.config"></Gamepad>
  </div>
</template>
