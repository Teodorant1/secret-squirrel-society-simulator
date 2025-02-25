import type { ThemeConfig } from "@/types/theme"

export const THEME_PRESETS: Record<string, ThemeConfig> = {
  cyberpunk: {
    name: "Cyberpunk",
    primary: "#00ff9f",
    background: "#000000",
    accent: "#ff00ff",
    animation: {
      background: {
        animate: {
          backgroundPosition: ["0% 0%", "100% 100%"],
          filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"],
        },
        transition: {
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        },
      },
      text: {
        animate: {
          textShadow: ["0 0 7px #00ff9f", "0 0 10px #00ff9f", "0 0 21px #00ff9f", "0 0 42px #00ff9f"],
        },
        transition: {
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
        },
      },
    },
  },
  got: {
    name: "Game of Thrones",
    primary: "#C41E3A",
    background: "#1a1a1a",
    accent: "#FFD700",
    animation: {
      background: {
        animate: {
          background: [
            "radial-gradient(circle at top left, #C41E3A22, transparent)",
            "radial-gradient(circle at bottom right, #FFD70022, transparent)",
          ],
        },
        transition: {
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        },
      },
    },
  },
  trump: {
    name: "Trump & Vance",
    primary: "#B22234",
    background: "#FFFFFF",
    accent: "#3C3B6E",
    animation: {
      background: {
        animate: {
          background: [
            "linear-gradient(45deg, #B2223422, transparent)",
            "linear-gradient(45deg, #3C3B6E22, transparent)",
          ],
        },
        transition: {
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        },
      },
    },
  },
  serbia: {
    name: "Serbia & Vucic",
    primary: "#0C4076",
    background: "#FFFFFF",
    accent: "#C6363C",
    animation: {
      background: {
        animate: {
          background: [
            "linear-gradient(to right, #0C407622, transparent)",
            "linear-gradient(to right, #C6363C22, transparent)",
          ],
        },
        transition: {
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        },
      },
    },
  },
  bond: {
    name: "James Bond",
    primary: "#000000",
    background: "#FFFFFF",
    accent: "#B8860B",
    animation: {
      background: {
        animate: {
          background: [
            "radial-gradient(circle at center, #00000022, transparent)",
            "radial-gradient(circle at center, #B8860B22, transparent)",
          ],
        },
        transition: {
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        },
      },
    },
  },
  woke: {
    name: "Social Justice",
    primary: "#FF69B4",
    background: "#FFFFFF",
    accent: "#9B59B6",
    animation: {
      background: {
        animate: {
          background: [
            "linear-gradient(to right, #FF69B422, #9B59B622, transparent)",
            "linear-gradient(to right, #9B59B622, #FF69B422, transparent)",
          ],
        },
        transition: {
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        },
      },
    },
  },
  wendigoon: {
    name: "Wendigoon",
    primary: "#800000",
    background: "#2A0F0F",
    accent: "#8B0000",
    animation: {
      background: {
        animate: {
          filter: ["brightness(1)", "brightness(0.8)"],
          background: [
            "radial-gradient(circle at center, #80000022, transparent)",
            "radial-gradient(circle at center, #8B000022, transparent)",
          ],
        },
        transition: {
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        },
      },
    },
  },
}

