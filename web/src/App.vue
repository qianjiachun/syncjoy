<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NNotificationProvider } from "naive-ui";
import { GlobalThemeOverrides } from "naive-ui/es/config-provider/src/interface";

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: "#3b82f6",
    primaryColorSuppl: "#3b82f6",
    primaryColorHover: "#4098FCFF",
    primaryColorPressed: "#3b82f6"
  }
};
</script>

<template>
  <NConfigProvider :theme-overrides="themeOverrides">
    <NMessageProvider>
      <NNotificationProvider>
        <RouterView></RouterView>
      </NNotificationProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<style scoped></style>
