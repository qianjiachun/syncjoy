import { encodeGamepadToInputState } from "@/utils";
import { computed, onMounted, onUnmounted, ref } from "vue";

export function useGamepad() {
  const gamepad = ref<Gamepad>();
  const inputState = computed(() => encodeGamepadToInputState(gamepad.value));
  const isSupported = computed(() => navigator && "getGamepads" in navigator);

  const updateGamepadState = () => {
    const _gamepad = navigator.getGamepads().find((g) => g && g.mapping === "standard");
    if (_gamepad && gamepad.value?.timestamp !== _gamepad.timestamp) {
      onInputCallback(encodeGamepadToInputState(_gamepad));
      gamepad.value = _gamepad;
    }
    requestAnimationFrame(updateGamepadState);
  };

  let onInputCallback: (inputState?: IGamepadInputState) => void = () => {};

  const onInput = (callback: (inputState?: IGamepadInputState) => void) => {
    onInputCallback = callback;
  };

  onMounted(() => {
    window.addEventListener("gamepadconnected", updateGamepadState);
    window.addEventListener("gamepaddisconnected", updateGamepadState);
  });

  onUnmounted(() => {
    window.removeEventListener("gamepadconnected", updateGamepadState);
    window.removeEventListener("gamepaddisconnected", updateGamepadState);
  });

  return { gamepad, inputState, isSupported, onInput };
}
