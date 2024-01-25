export function mapGamepadToXbox360Controller(gamepad: Gamepad | undefined) {
  if (gamepad) {
    return {
      buttons: {
        a: gamepad.buttons[0].value,
        b: gamepad.buttons[1].value,
        x: gamepad.buttons[2].value,
        y: gamepad.buttons[3].value
      },
      bumper: {
        left: gamepad.buttons[4].value,
        right: gamepad.buttons[5].value
      },
      triggers: {
        left: gamepad.buttons[6].value,
        right: gamepad.buttons[7].value
      },
      stick: {
        left: {
          horizontal: gamepad.axes[0],
          vertical: gamepad.axes[1],
          button: gamepad.buttons[10].value
        },
        right: {
          horizontal: gamepad.axes[2],
          vertical: gamepad.axes[3],
          button: gamepad.buttons[11].value
        }
      },
      dpad: {
        up: gamepad.buttons[12].value,
        down: gamepad.buttons[13].value,
        left: gamepad.buttons[14].value,
        right: gamepad.buttons[15].value
      },
      back: gamepad.buttons[8].value,
      start: gamepad.buttons[9].value
    };
  }

  return null;
}

export function encodeGamepadToInputState(gamepad: Gamepad | undefined): IGamepadInputState | undefined {
  if (gamepad) {
    return [
      [gamepad.buttons[0].value, gamepad.buttons[1].value, gamepad.buttons[2].value, gamepad.buttons[3].value],
      [gamepad.buttons[4].value, gamepad.buttons[5].value],
      [gamepad.buttons[6].value, gamepad.buttons[7].value],
      [gamepad.buttons[8].value, gamepad.buttons[9].value],
      [Math.round(gamepad.axes[0] * 10000) / 10000, Math.round(gamepad.axes[1] * 10000) / 10000, gamepad.buttons[10].value],
      [Math.round(gamepad.axes[2] * 10000) / 10000, Math.round(gamepad.axes[3] * 10000) / 10000, gamepad.buttons[11].value],
      [gamepad.buttons[12].value, gamepad.buttons[13].value, gamepad.buttons[14].value, gamepad.buttons[15].value]
    ];
  }

  return undefined;
}

export function decodeInputStateToXbox360Controller(inputState: IGamepadInputState | undefined) {
  if (inputState) {
    return {
      buttons: {
        a: inputState[0][0],
        b: inputState[0][1],
        x: inputState[0][2],
        y: inputState[0][3]
      },
      bumper: {
        left: inputState[1][0],
        right: inputState[1][1]
      },
      triggers: {
        left: inputState[2][0],
        right: inputState[2][1]
      },
      stick: {
        left: {
          horizontal: inputState[4][0],
          vertical: inputState[4][1],
          button: inputState[4][2]
        },
        right: {
          horizontal: inputState[5][0],
          vertical: inputState[5][1],
          button: inputState[5][2]
        }
      },
      dpad: {
        up: inputState[6][0],
        down: inputState[6][1],
        left: inputState[6][2],
        right: inputState[6][3]
      },
      back: inputState[3][0],
      start: inputState[3][1]
    };
  }

  return undefined;
}

export function getImageSize(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = url;
  });
}

export function getKeyListInObject(obj: any, key: string): any[] {
  return Object.entries(obj).reduce((acc: any, [k, v]) => {
    if (k === key) {
      acc.push(v);
    }
    if (typeof v === "object") {
      acc.push(...getKeyListInObject(v, key));
    }
    return acc;
  }, []);
}

export const getFormatGamepadConfig = async (obj: IGamepadConfig, format?: "px" | "percent") => {
  const imageSize = await getImageSize(obj.gamepad.img);
  const newObj = JSON.parse(JSON.stringify(obj));

  function traverseAndConvert(item: any) {
    if (typeof item === "object" && item !== null) {
      for (let k in item) {
        if (typeof item[k] === "number" && (k === "top" || k === "left")) {
          let currentFormat = format;
          if (!currentFormat) {
            currentFormat = item[k] < 1 && item[k] > 0 ? "px" : "percent";
          }
          if (currentFormat === "px") {
            item[k] = Math.round(item[k] * (k === "top" ? imageSize.height : imageSize.width));
          } else if (currentFormat === "percent") {
            item[k] = item[k] / (k === "top" ? imageSize.height : imageSize.width);
          }
        } else {
          traverseAndConvert(item[k]);
        }
      }
    }
  }

  traverseAndConvert(newObj);

  return newObj;
};

export async function getImageSizeMapFromConfig(config: IGamepadConfig) {
  const list = [...getKeyListInObject(config, "img"), ...getKeyListInObject(config, "imgActive")];
  const _imgSizeMap: Map<string, { width: number; height: number }> = new Map();
  for (const url of list) {
    const size = await getImageSize(url).catch(() => {});
    if (size) _imgSizeMap.set(url, size);
  }
  return _imgSizeMap;
}

export function exportAsFile(data: any, fileName: string): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function handleFileSelect(event: Event, callback: (jsonData: any) => void): void {
  const input = event.target as HTMLInputElement;
  const files = input.files;

  if (files && files.length > 0) {
    const file = files[0];

    if (file.name.endsWith(".json")) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const jsonData = JSON.parse(content);

          // 调用回调函数处理读取到的 JSON 数据
          callback(jsonData);
        } catch (error) {
          console.error("Error parsing JSON file:", error);
        } finally {
          // 读取完文件后，删除<input type="file">元素
          if (input.parentNode) {
            input.parentNode.removeChild(input);
          }
        }
      };

      // 以文本形式读取文件内容
      reader.readAsText(file);
    } else {
      console.error("Invalid file type. Please select a .json file.");
    }
  } else {
    // 用户取消选择文件，删除<input type="file">元素
    if (input.parentNode) {
      input.parentNode.removeChild(input);
    }
  }
}

export function openFilePicker(callback: (jsonData: any) => void): void {
  // 创建一个<input type="file">元素
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.style.display = "none";
  fileInput.accept = ".json"; // 设置仅允许选择.json文件

  // 添加事件监听器
  fileInput.addEventListener("change", (event) => handleFileSelect(event, callback));

  // 将<input type="file">元素添加到页面中
  document.body.appendChild(fileInput);

  // 手动触发文件选择对话框
  fileInput.click();
}

export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
