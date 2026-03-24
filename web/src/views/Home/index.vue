<script setup lang="ts">
import { NButton, NInput, NInputGroup, NInputGroupLabel, useMessage, useNotification } from "naive-ui";
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
  <div class="w-full h-screen bg-[#f8f9fa] flex flex-col justify-center items-center relative selection:bg-blue-500 selection:text-white">
    <!-- 顶部装饰条，强化红蓝 Switch 元素 -->
    <div class="absolute top-0 left-0 w-full h-2 flex">
      <div class="h-full w-1/2 bg-red-500"></div>
      <div class="h-full w-1/2 bg-blue-500"></div>
    </div>

    <!-- Github 链接 -->
    <a href="https://github.com/qianjiachun/syncjoy" class="absolute top-6 right-8 text-gray-400 hover:text-gray-800 transition-colors z-20" target="_blank">
      <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2323" width="32" height="32" fill="currentColor">
        <path d="M512 42.666667A464.64 464.64 0 0 0 42.666667 502.186667 460.373333 460.373333 0 0 0 363.52 938.666667c23.466667 4.266667 32-9.813333 32-22.186667v-78.08c-130.56 27.733333-158.293333-61.44-158.293333-61.44a122.026667 122.026667 0 0 0-52.053334-67.413333c-42.666667-28.16 3.413333-27.733333 3.413334-27.733334a98.56 98.56 0 0 1 71.68 47.36 101.12 101.12 0 0 0 136.533333 37.973334 99.413333 99.413333 0 0 1 29.866667-61.44c-104.106667-11.52-213.333333-50.773333-213.333334-226.986667a177.066667 177.066667 0 0 1 47.36-124.16 161.28 161.28 0 0 1 4.693334-121.173333s39.68-12.373333 128 46.933333a455.68 455.68 0 0 1 234.666666 0c89.6-59.306667 128-46.933333 128-46.933333a161.28 161.28 0 0 1 4.693334 121.173333A177.066667 177.066667 0 0 1 810.666667 477.866667c0 176.64-110.08 215.466667-213.333334 226.986666a106.666667 106.666667 0 0 1 32 85.333334v125.866666c0 14.933333 8.533333 26.88 32 22.186667A460.8 460.8 0 0 0 981.333333 502.186667 464.64 464.64 0 0 0 512 42.666667" p-id="2324"></path>
      </svg>
    </a>

    <!-- 主体内容区，采用上下结构紧凑布局 -->
    <div class="max-w-5xl w-full px-8 flex flex-col items-center relative z-10 -mt-10">
      
      <!-- 顶部：大号视觉元素与漂浮装饰 -->
      <div class="relative flex justify-center items-center mb-6 lg:mb-8 w-48 h-48 lg:w-80 lg:h-80 mt-8 lg:mt-0">
        <!-- 背景光晕 -->
        <div class="rounded-full absolute w-[120%] h-[120%] bg-animation bg-gradient-to-tr from-red-500 to-blue-500 blur-[40px] lg:blur-[60px] opacity-60"></div>
        
        <!-- 漂浮的小游戏元素 (极度聚拢，针对移动端和桌面端分别微调) -->
        <div class="absolute top-12 left-2 lg:top-12 lg:left-18 text-2xl lg:text-4xl floating-item delay-100 opacity-80 select-none z-20">🕹️</div>
        <div class="absolute top-16 right-0 lg:top-16 lg:right-18 text-3xl lg:text-5xl floating-item delay-300 opacity-90 select-none z-20">👾</div>
        <div class="absolute bottom-6 left-0 lg:bottom-16 lg:left-22 text-xl lg:text-3xl floating-item delay-700 opacity-70 select-none z-20">🅰️</div>
        <div class="absolute bottom-2 right-4 lg:bottom-12 lg:right-0 text-2xl lg:text-4xl floating-item delay-500 opacity-80 select-none z-20">🏆</div>
        
        <!-- 主图标 -->
        <div class="text-[7rem] lg:text-[12rem] cursor-default select-none relative z-10 floating-animation drop-shadow-2xl">🎮</div>
      </div>

      <!-- 中部：标题与描述 -->
      <div class="text-center mb-10">
        <h1 class="text-5xl lg:text-7xl font-black mb-4 tracking-tight">
          <span class="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">SyncJoy</span>
        </h1>
        <p class="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">跨平台 P2P 虚拟手柄</p>
        <p class="text-gray-500 text-lg">无需安装 · 多人异网同步 · 自定义皮肤</p>
      </div>

      <!-- 底部：操作区，红蓝渐变风格卡片包裹 -->
      <div class="bg-white p-6 lg:p-8 rounded-3xl shadow-2xl border border-gray-100 w-full max-w-2xl relative overflow-hidden">
        <!-- 卡片顶部极细红蓝渐变边框 -->
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-blue-500"></div>
        
        <div class="flex flex-col lg:flex-row items-center gap-4">
          <div class="flex-1 w-full">
            <NInputGroup class="w-full">
              <NInputGroupLabel size="large" class="bg-gray-50 font-bold text-gray-700 border-r-0">房间名</NInputGroupLabel>
              <NInput size="large" placeholder="输入任意字符进入/创建房间" v-model:value="rid" class="text-lg font-medium font-mono" :style="{ '--n-border-hover': '1px solid #3b82f6', '--n-border-focus': '1px solid #3b82f6', '--n-box-shadow-focus': '0 0 0 2px rgba(59, 130, 246, 0.2)' }">
                <template #suffix>
                  <NButton text color="#6b7280" @click="rid = getRandomRid()" class="hover:text-blue-500 font-bold">随机</NButton>
                </template>
              </NInput>
            </NInputGroup>
          </div>
          <div class="flex w-full lg:w-auto gap-3">
            <NButton size="large" type="info" color="#3b82f6" class="flex-1 lg:flex-none font-bold text-base shadow-md shadow-blue-500/30" @click="getUrl">生成链接</NButton>
            <NButton size="large" type="error" color="#ef4444" class="flex-1 lg:flex-none font-bold text-base shadow-md shadow-red-500/30" @click="router.push(`/setting`)">设置皮肤</NButton>
          </div>
        </div>
      </div>
      
      <!-- 特性说明 (极简版，放置在卡片下方) -->
      <div class="flex flex-wrap justify-center gap-6 mt-12 text-sm font-medium text-gray-400">
        <div class="flex items-center gap-1.5"><span class="text-blue-500 text-lg">⚡</span> WebRTC 毫秒级延迟</div>
        <div class="flex items-center gap-1.5"><span class="text-red-500 text-lg">🎨</span> 每个按键皆可定制</div>
        <div class="flex items-center gap-1.5"><span class="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent text-lg">🔗</span> 支持推流工具浏览器源</div>
      </div>

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

@keyframes floating {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@keyframes floating-item {
  0% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(6px, -10px) rotate(5deg); }
  66% { transform: translate(-3px, -15px) rotate(-5deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

.floating-animation {
  animation: floating 4s ease-in-out infinite;
}

.floating-item {
  animation: floating-item 6s ease-in-out infinite;
}

.delay-100 { animation-delay: 0.1s; }
.delay-300 { animation-delay: 0.8s; }
.delay-500 { animation-delay: 1.5s; }
.delay-700 { animation-delay: 2.2s; }
</style>
