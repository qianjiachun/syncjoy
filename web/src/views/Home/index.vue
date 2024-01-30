<script setup lang="ts">
import { NButton, NInput, NInputGroup, NInputGroupLabel, useMessage, useNotification } from "naive-ui";
import Description from "@/components/Description/index.vue";
import { h, ref } from "vue";
import { useRouter } from "vue-router";
import { useLocalConfig } from "@/hooks/useLocalConfig";
import copy from "copy-to-clipboard";
const router = useRouter();
const rid = ref("");
const message = useMessage();
const notification = useNotification();
const { getLocalConfig } = useLocalConfig();
const getRandomRid = (): string => {
  return String(Math.floor(Math.random() * 9000) + 1000);
};
const getUrl = () => {
  if (rid.value == ``) {
    message.error(`请输入房间名`);
    return;
  }
  if (rid.value.length > 20) {
    message.error(`房间名长度不能超过20`);
    return;
  }
  const queryConfig = JSON.stringify(getLocalConfig());
  copy(`${location.origin}/panel/${rid.value}?config=${queryConfig}`);
  notification.success({
    content: "已复制链接",
    meta: () =>
      h("div", null, [
        h("div", null, ["请粘贴至推流工具(OBS/直播伴侣)的", h("span", { class: "font-bold mb-1" }, "浏览器源")]),
        h("div", { class: "font-bold" }, "进入该房间的人可以看到每个人的手柄操作"),
        h("div", { style: "height: 1px;background-color: #e4e4e4;margin: 16px 0;" }),
        h("div", { class: "font-bold" }, "Q：为什么需要复制到推流工具中？"),
        h("div", { class: "mb-1" }, [
          h("div", null, "由于浏览器限制，当页面处于后台时，无法获取手柄输入，只有旧版本的chrome浏览器没有这个限制，所以建议放在推流工具中的浏览器源中"),
          h("div", null, "如果需要在浏览器中使用，请点击下方按钮")
        ]),
        h(
          NButton,
          {
            type: "success",
            size: "tiny",
            onClick: () => {
              notification.destroyAll();
              router.push({
                path: `/panel/${rid.value}`,
                query: {
                  config: queryConfig
                }
              });
            }
          },
          {
            default: () => "进入房间"
          }
        )
      ]),
    duration: 6000,
    keepAliveOnHover: true
  });
};
</script>

<template>
  <div class="w-full h-full max-w-6xl mx-auto">
    <div class="pt-20 flex flex-col-reverse lg:flex-row items-center">
      <div class="flex flex-col max-w-xl w-full mt-8 lg:mt-0">
        <span class="text-5xl lg:text-[3.5rem] leading-tight font-bold text-center lg:text-start">
          <span class="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">SyncJoy</span>
          <a href="https://github.com/qianjiachun/syncjoy" class="ml-2 inline-flex" target="_blank">
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2323" width="24" height="24">
              <path
                d="M512 42.666667A464.64 464.64 0 0 0 42.666667 502.186667 460.373333 460.373333 0 0 0 363.52 938.666667c23.466667 4.266667 32-9.813333 32-22.186667v-78.08c-130.56 27.733333-158.293333-61.44-158.293333-61.44a122.026667 122.026667 0 0 0-52.053334-67.413333c-42.666667-28.16 3.413333-27.733333 3.413334-27.733334a98.56 98.56 0 0 1 71.68 47.36 101.12 101.12 0 0 0 136.533333 37.973334 99.413333 99.413333 0 0 1 29.866667-61.44c-104.106667-11.52-213.333333-50.773333-213.333334-226.986667a177.066667 177.066667 0 0 1 47.36-124.16 161.28 161.28 0 0 1 4.693334-121.173333s39.68-12.373333 128 46.933333a455.68 455.68 0 0 1 234.666666 0c89.6-59.306667 128-46.933333 128-46.933333a161.28 161.28 0 0 1 4.693334 121.173333A177.066667 177.066667 0 0 1 810.666667 477.866667c0 176.64-110.08 215.466667-213.333334 226.986666a106.666667 106.666667 0 0 1 32 85.333334v125.866666c0 14.933333 8.533333 26.88 32 22.186667A460.8 460.8 0 0 0 981.333333 502.186667 464.64 464.64 0 0 0 512 42.666667"
                p-id="2324"
              ></path>
            </svg>
          </a>
        </span>

        <span class="text-4xl lg:text-[3.5rem] leading-tight font-bold text-[#3c3c43] text-center lg:text-start whitespace-pre-wrap lg:whitespace-nowrap">跨平台P2P虚拟手柄插件</span>
        <div class="flex items-center mt-8 flex-col lg:flex-row px-8 lg:px-0">
          <NInputGroup>
            <NInputGroupLabel size="large">房间名</NInputGroupLabel>
            <NInput size="large" placeholder="请输入房间名" round v-model:value="rid">
              <template #suffix>
                <NButton text color="gray" @click="rid = getRandomRid()">随机</NButton>
              </template>
            </NInput>
          </NInputGroup>
          <div class="flex space-x-2 mt-4 lg:mt-0 ml-0 lg:ml-4">
            <NButton size="large" type="info" round @click="getUrl">生成链接</NButton>
            <NButton size="large" type="error" round @click="router.push(`/setting`)">设置皮肤</NButton>
          </div>
        </div>
      </div>
      <div class="flex-1 flex justify-center items-center">
        <div class="w-72 h-72 lg:w-80 lg:h-80 relative flex justify-center items-center">
          <div class="rounded-full absolute w-[90%] h-[90%] bg-animation bg-gradient-to-tr from-red-500 to-blue-500 blur-[72px]"></div>
          <div class="text-[13rem] lg:text-[14rem] cursor-default select-none absolute text-center align-middle">🎮</div>
        </div>
      </div>
    </div>
    <div class="px-8 lg:px-0 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 mt-4">
      <Description emoji="🚀" title="高性能" description="使用Fastify服务端，完全响应式页面，微秒级检测，精简准确的数据传输方案"></Description>
      <Description emoji="🖥️" title="端对端" description="基于WebRTC技术(P2P)，实现多人多设备异网接近无延迟的数据同步，数据不通过服务器，信息安全"></Description>
      <Description emoji="✨" title="易使用" description="开箱即用，无需安装任何插件；内置多套预设，简单替换图片链接即可实现自定义皮肤，每个按键皆可独立替换，支持拖拽/调节尺寸/旋转"></Description>
    </div>
  </div>
</template>

<style scoped>
.bg-animation {
  background-size: 150% 150%;
  animation: gradient 3s ease infinite, rotate 3s linear infinite;
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
