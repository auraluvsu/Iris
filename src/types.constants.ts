import { CSSProperties, useContext } from "react";
import { PomodoroContextType } from "./utils/pomodoroContext";

import { createContext, Context } from "react";

export interface Backdrop {
  id: string;
  label: string;
  style: CSSProperties;
}

export const BACKDROPS: Backdrop[] = [
  {
    id: "default",
    label: "Default",
    style: { background: "var(--bg)" },
  },
  ...[
    "benjamin-voros-phIFdC6lA4E",
    "breno-machado-in9-n0JwgZ0",
    "cristina-gottardi-CSpjU6hYo_0",
    "daniel-leone-v7daTKlZzaw",
    "elias-var-T3JOkIJImeo",
    "jms-kFHz9Xh3PPU",
    "kalen-emsley-Bkci_8qcdvQ",
    "luca-bravo-zAjdgNXsMeg",
    "luca-micheli-ruWkmt3nU58",
    "nasa-Q1p7bh3SHj8",
    "pietro-de-grandi-T7K4aEPoGGk",
    "qingbao-meng-01_igFr7hd4",
    "ran-liwen-y8JAcW8i53M",
    "urban-vintage-78A265wPiO4",
  ].map(
    (file, i): Backdrop => ({
      id: `photo-${i + 1}`,
      label: `Photo ${i + 1}`,
      style: {
        backgroundImage: `url('/backdrops/${file}.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      },
    }),
  ),
];

export const Ctx = createContext<PomodoroContextType | null>(
  null,
) as Context<PomodoroContextType | null>;

export function usePomodoro(): PomodoroContextType {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePomodoro must be used within PomodoroProvider");
  return ctx;
}
