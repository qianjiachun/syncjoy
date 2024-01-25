import { deepCopy } from "@/utils";

export function useLocalConfig() {
  const LOCAL_NAME = "local_config";
  const defaultConfigs: IGamepadConfig[] = [
    {
      gamepad: {
        img: "/assets/gamepad/default/gamepad.png"
      },
      buttons: {
        a: {
          scale: 1,
          left: 1047,
          top: 431,
          img: "/assets/gamepad/default/a.png",
          imgActive: "/assets/gamepad/default/a-active.png",
          angle: 0
        },
        b: {
          scale: 1,
          left: 1150,
          top: 345,
          img: "/assets/gamepad/default/b.png",
          imgActive: "/assets/gamepad/default/b-active.png",
          angle: 0
        },
        x: {
          scale: 1,
          left: 946,
          top: 349,
          img: "/assets/gamepad/default/x.png",
          imgActive: "/assets/gamepad/default/x-active.png",
          angle: 0
        },
        y: {
          scale: 1,
          left: 1050,
          top: 257,
          img: "/assets/gamepad/default/y.png",
          imgActive: "/assets/gamepad/default/y-active.png",
          angle: 0
        }
      },
      bumper: {
        left: {
          scale: 1,
          left: 146,
          top: 75,
          img: "/assets/gamepad/default/lb.png",
          imgActive: "/assets/gamepad/default/lb-active.png",
          angle: 0
        },
        right: {
          scale: 1,
          left: 992,
          top: 75,
          img: "/assets/gamepad/default/rb.png",
          imgActive: "/assets/gamepad/default/rb-active.png",
          angle: 0
        }
      },
      triggers: {
        left: {
          scale: 1,
          left: 167,
          top: 0,
          img: "/assets/gamepad/default/lt.png",
          imgActive: "/assets/gamepad/default/lt-active.png",
          angle: 0
        },
        right: {
          scale: 1,
          left: 990,
          top: 0,
          img: "/assets/gamepad/default/rt.png",
          imgActive: "/assets/gamepad/default/rt-active.png",
          angle: 0
        }
      },
      stick: {
        left: {
          scale: 1,
          left: 389,
          top: 517,
          img: "/assets/gamepad/default/stick.png",
          imgActive: "/assets/gamepad/default/stick-active.png",
          angle: 0
        },
        right: {
          scale: 1,
          left: 806,
          top: 517,
          img: "/assets/gamepad/default/stick.png",
          imgActive: "/assets/gamepad/default/stick-active.png",
          angle: 0
        }
      },
      dpad: {
        up: {
          scale: 1,
          left: 205,
          top: 281,
          img: "/assets/gamepad/default/up.png",
          imgActive: "/assets/gamepad/default/up-active.png",
          angle: 0
        },
        down: {
          scale: 1,
          left: 212,
          top: 401,
          img: "/assets/gamepad/default/down.png",
          imgActive: "/assets/gamepad/default/down-active.png",
          angle: 0
        },
        left: {
          scale: 1,
          left: 136,
          top: 349,
          img: "/assets/gamepad/default/left.png",
          imgActive: "/assets/gamepad/default/left-active.png",
          angle: 0
        },
        right: {
          scale: 1,
          left: 261,
          top: 349,
          img: "/assets/gamepad/default/right.png",
          imgActive: "/assets/gamepad/default/right-active.png",
          angle: 0
        }
      },
      back: {
        scale: 1,
        left: 332,
        top: 225,
        img: "/assets/gamepad/default/back.png",
        imgActive: "/assets/gamepad/default/back-active.png",
        angle: 0
      },
      start: {
        scale: 1,
        left: 968,
        top: 225,
        img: "/assets/gamepad/default/start.png",
        imgActive: "/assets/gamepad/default/start-active.png",
        angle: 0
      }
    },
    {
      gamepad: {
        img: "/assets/gamepad/switch/1.png"
      },
      buttons: {
        a: {
          scale: 1,
          left: 935,
          top: 279,
          img: "/assets/gamepad/switch/12.png",
          imgActive: "/assets/gamepad/switch/13.png",
          angle: 0
        },
        b: {
          scale: 1,
          left: 1026,
          top: 198,
          img: "/assets/gamepad/switch/8.png",
          imgActive: "/assets/gamepad/switch/9.png",
          angle: 0
        },
        x: {
          scale: 1,
          left: 840,
          top: 198,
          img: "/assets/gamepad/switch/4.png",
          imgActive: "/assets/gamepad/switch/5.png",
          angle: 0
        },
        y: {
          scale: 1,
          left: 935,
          top: 109,
          img: "/assets/gamepad/switch/6.png",
          imgActive: "/assets/gamepad/switch/7.png",
          angle: 0
        }
      },
      bumper: {
        left: {
          scale: 1,
          left: 142,
          top: 0,
          img: "/assets/gamepad/switch/2.png",
          imgActive: "/assets/gamepad/switch/3.png",
          angle: 0
        },
        right: {
          scale: 1,
          left: 852,
          top: 0,
          img: "/assets/gamepad/switch/10.png",
          imgActive: "/assets/gamepad/switch/11.png",
          angle: 0
        }
      },
      triggers: {
        left: {
          scale: 1,
          left: 157,
          top: 8,
          img: "/assets/gamepad/switch/26.png",
          imgActive: "/assets/gamepad/switch/27.png",
          angle: 0
        },
        right: {
          scale: 1,
          left: 1044,
          top: 9,
          img: "/assets/gamepad/switch/28.png",
          imgActive: "/assets/gamepad/switch/29.png",
          angle: 0
        }
      },
      stick: {
        left: {
          scale: 1,
          left: 219,
          top: 179,
          img: "/assets/gamepad/switch/22.png",
          imgActive: "/assets/gamepad/switch/23.png",
          angle: 0
        },
        right: {
          scale: 1,
          left: 735,
          top: 354,
          img: "/assets/gamepad/switch/22.png",
          imgActive: "/assets/gamepad/switch/23.png",
          angle: 0
        }
      },
      dpad: {
        up: {
          scale: 1,
          left: 429,
          top: 344,
          img: "/assets/gamepad/switch/14.png",
          imgActive: "/assets/gamepad/switch/15.png",
          angle: 0
        },
        down: {
          scale: 1,
          left: 429,
          top: 467,
          img: "/assets/gamepad/switch/14.png",
          imgActive: "/assets/gamepad/switch/15.png",
          angle: 0
        },
        left: {
          scale: 1,
          left: 365,
          top: 406,
          img: "/assets/gamepad/switch/14.png",
          imgActive: "/assets/gamepad/switch/15.png",
          angle: 0
        },
        right: {
          scale: 1,
          left: 492,
          top: 406,
          img: "/assets/gamepad/switch/14.png",
          imgActive: "/assets/gamepad/switch/15.png",
          angle: 0
        }
      },
      back: {
        scale: 1,
        left: 522,
        top: 226,
        img: "/assets/gamepad/switch/24.png",
        imgActive: "/assets/gamepad/switch/25.png",
        angle: 0
      },
      start: {
        scale: 1,
        left: 704,
        top: 226,
        img: "/assets/gamepad/switch/20.png",
        imgActive: "/assets/gamepad/switch/21.png",
        angle: 0
      }
    },
    {
      gamepad: {
        img: "/assets/gamepad/xbox/gamepad.png"
      },
      buttons: {
        a: {
          scale: 0.383,
          left: 538,
          top: 301,
          img: "/assets/gamepad/xbox/1.png",
          imgActive: "/assets/gamepad/xbox/2.png",
          angle: 0
        },
        b: {
          scale: 0.383,
          left: 588,
          top: 251,
          img: "/assets/gamepad/xbox/3.png",
          imgActive: "/assets/gamepad/xbox/4.png",
          angle: 0
        },
        x: {
          scale: 0.383,
          left: 487.99999999999994,
          top: 250.99999999999997,
          img: "/assets/gamepad/xbox/5.png",
          imgActive: "/assets/gamepad/xbox/6.png",
          angle: 0
        },
        y: {
          scale: 0.383,
          left: 536,
          top: 200,
          img: "/assets/gamepad/xbox/7.png",
          imgActive: "/assets/gamepad/xbox/8.png",
          angle: 0
        }
      },
      bumper: {
        left: {
          scale: 1,
          left: 107,
          top: 128,
          img: "",
          imgActive: "/assets/gamepad/xbox/b1.png",
          angle: 0
        },
        right: {
          scale: 1,
          left: 472.00000000000006,
          top: 128,
          img: "",
          imgActive: "/assets/gamepad/xbox/b2.png",
          angle: 0
        }
      },
      triggers: {
        left: {
          scale: 1,
          left: 151,
          top: 0,
          img: "",
          imgActive: "/assets/gamepad/xbox/t1.png",
          angle: 0
        },
        right: {
          scale: 1,
          left: 509,
          top: 0,
          img: "",
          imgActive: "/assets/gamepad/xbox/t2.png",
          angle: 0
        }
      },
      stick: {
        left: {
          scale: 1,
          left: 143,
          top: 238,
          img: "/assets/gamepad/xbox/stick.png",
          imgActive: "/assets/gamepad/xbox/stick1.png",
          angle: 0
        },
        right: {
          scale: 1,
          left: 430,
          top: 352,
          img: "/assets/gamepad/xbox/stick.png",
          imgActive: "/assets/gamepad/xbox/stick1.png",
          angle: 0
        }
      },
      dpad: {
        up: {
          scale: 1,
          left: 259,
          top: 346,
          img: "",
          imgActive: "/assets/gamepad/xbox/up.png",
          angle: 0
        },
        down: {
          scale: 1,
          left: 260,
          top: 402,
          img: "",
          imgActive: "/assets/gamepad/xbox/down.png",
          angle: 0
        },
        left: {
          scale: 1,
          left: 222,
          top: 382,
          img: "",
          imgActive: "/assets/gamepad/xbox/left.png",
          angle: 0
        },
        right: {
          scale: 1,
          left: 278,
          top: 383,
          img: "",
          imgActive: "/assets/gamepad/xbox/right.png",
          angle: 0
        }
      },
      back: {
        scale: 1.2727,
        left: 301,
        top: 260,
        img: "",
        imgActive: "/assets/gamepad/xbox/back.png",
        angle: 0
      },
      start: {
        scale: 1.2727,
        left: 409,
        top: 260,
        img: "",
        imgActive: "/assets/gamepad/xbox/start.png",
        angle: 0
      }
    },
    {
      gamepad: {
        img: "/assets/gamepad/ps4/base.png"
      },
      buttons: {
        a: {
          scale: 1,
          left: 626,
          top: 273,
          img: "",
          imgActive: "/assets/gamepad/ps4/1.png",
          angle: 0
        },
        b: {
          scale: 1,
          left: 682,
          top: 216,
          img: "",
          imgActive: "/assets/gamepad/ps4/3.png",
          angle: 0
        },
        x: {
          scale: 1,
          left: 568,
          top: 216,
          img: "",
          imgActive: "/assets/gamepad/ps4/4.png",
          angle: 0
        },
        y: {
          scale: 1,
          left: 624,
          top: 160,
          img: "",
          imgActive: "/assets/gamepad/ps4/2.png",
          angle: 0
        }
      },
      bumper: {
        left: {
          scale: 1,
          left: 109,
          top: 94,
          img: "",
          imgActive: "/assets/gamepad/ps4/b1.png",
          angle: 0
        },
        right: {
          scale: 1,
          left: 598,
          top: 94,
          img: "",
          imgActive: "/assets/gamepad/ps4/b2.png",
          angle: 0
        }
      },
      triggers: {
        left: {
          scale: 1,
          left: 109,
          top: -1,
          img: "",
          imgActive: "/assets/gamepad/ps4/t1.png",
          angle: 0
        },
        right: {
          scale: 1,
          left: 597,
          top: -1,
          img: "",
          imgActive: "/assets/gamepad/ps4/t2.png",
          angle: 0
        }
      },
      stick: {
        left: {
          scale: 1,
          left: 228,
          top: 309,
          img: "/assets/gamepad/ps4/stick1.png",
          imgActive: "/assets/gamepad/ps4/stick2.png",
          angle: 0
        },
        right: {
          scale: 1,
          left: 485,
          top: 309,
          img: "/assets/gamepad/ps4/stick1.png",
          imgActive: "/assets/gamepad/ps4/stick2.png",
          angle: 0
        }
      },
      dpad: {
        up: {
          scale: 1,
          left: 135,
          top: 181,
          img: "",
          imgActive: "/assets/gamepad/ps4/up.png",
          angle: 0
        },
        down: {
          scale: 1,
          left: 137,
          top: 255,
          img: "",
          imgActive: "/assets/gamepad/ps4/down.png",
          angle: 0
        },
        left: {
          scale: 1,
          left: 91,
          top: 225,
          img: "",
          imgActive: "/assets/gamepad/ps4/left.png",
          angle: 0
        },
        right: {
          scale: 1,
          left: 165,
          top: 225,
          img: "",
          imgActive: "/assets/gamepad/ps4/right.png",
          angle: 0
        }
      },
      back: {
        scale: 1,
        left: 226,
        top: 142,
        img: "",
        imgActive: "/assets/gamepad/ps4/start.png",
        angle: 0
      },
      start: {
        scale: 1,
        left: 552,
        top: 142,
        img: "",
        imgActive: "/assets/gamepad/ps4/start.png",
        angle: 0
      }
    },
    {
      gamepad: {
        img: "/assets/gamepad/ps5/base.png"
      },
      buttons: {
        a: {
          scale: 1,
          left: 644,
          top: 262,
          img: "/assets/gamepad/ps5/1.png",
          imgActive: "/assets/gamepad/ps5/2.png",
          angle: 0
        },
        b: {
          scale: 1,
          left: 703,
          top: 204,
          img: "/assets/gamepad/ps5/3.png",
          imgActive: "/assets/gamepad/ps5/4.png",
          angle: 0
        },
        x: {
          scale: 1,
          left: 583,
          top: 204,
          img: "/assets/gamepad/ps5/5.png",
          imgActive: "/assets/gamepad/ps5/6.png",
          angle: 0
        },
        y: {
          scale: 1,
          left: 643,
          top: 146,
          img: "/assets/gamepad/ps5/7.png",
          imgActive: "/assets/gamepad/ps5/8.png",
          angle: 0
        }
      },
      bumper: {
        left: {
          scale: 1,
          left: 93,
          top: 90,
          img: "",
          imgActive: "/assets/gamepad/ps5/b1.png",
          angle: 0
        },
        right: {
          scale: 1,
          left: 584,
          top: 91,
          img: "",
          imgActive: "/assets/gamepad/ps5/b2.png",
          angle: 0
        }
      },
      triggers: {
        left: {
          scale: 1,
          left: 119,
          top: 1,
          img: "",
          imgActive: "/assets/gamepad/ps5/t1.png",
          angle: 0
        },
        right: {
          scale: 1,
          left: 617,
          top: 1,
          img: "",
          imgActive: "/assets/gamepad/ps5/t2.png",
          angle: 0
        }
      },
      stick: {
        left: {
          scale: 1,
          left: 235,
          top: 288,
          img: "/assets/gamepad/ps5/stick1.png",
          imgActive: "/assets/gamepad/ps5/stick2.png",
          angle: 0
        },
        right: {
          scale: 1,
          left: 505,
          top: 288,
          img: "/assets/gamepad/ps5/stick1.png",
          imgActive: "/assets/gamepad/ps5/stick2.png",
          angle: 0
        }
      },
      dpad: {
        up: {
          scale: 1,
          left: 139,
          top: 163,
          img: "/assets/gamepad/ps5/up1.png",
          imgActive: "/assets/gamepad/ps5/up2.png",
          angle: 0
        },
        down: {
          scale: 1,
          left: 139,
          top: 246,
          img: "/assets/gamepad/ps5/down1.png",
          imgActive: "/assets/gamepad/ps5/down2.png",
          angle: 0
        },
        left: {
          scale: 1,
          left: 93,
          top: 209,
          img: "/assets/gamepad/ps5/left1.png",
          imgActive: "/assets/gamepad/ps5/left2.png",
          angle: 0
        },
        right: {
          scale: 1,
          left: 173,
          top: 209,
          img: "/assets/gamepad/ps5/right1.png",
          imgActive: "/assets/gamepad/ps5/right2.png",
          angle: 0
        }
      },
      back: {
        scale: 1,
        left: 219,
        top: 125,
        img: "",
        imgActive: "/assets/gamepad/ps5/back.png",
        angle: 0
      },
      start: {
        scale: 1,
        left: 595,
        top: 126,
        img: "",
        imgActive: "/assets/gamepad/ps5/start.png",
        angle: 0
      }
    }
  ];

  const saveLocalConfig = (config: IGamepadConfig) => {
    localStorage.setItem(LOCAL_NAME, JSON.stringify(config));
  };

  const getLocalConfig = (): IGamepadConfig => {
    const localConfig = localStorage.getItem(LOCAL_NAME);
    if (!localConfig) return deepCopy(defaultConfigs[0]);
    return JSON.parse(localConfig);
  };

  return { defaultConfigs, saveLocalConfig, getLocalConfig };
}
