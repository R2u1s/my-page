import type { IconType } from "react-icons";
import { SiJavascript, SiTypescript, SiReact, SiNestjs } from "react-icons/si";

export interface SkillInfo {
  name: string;
  icon: IconType;
  color: string;
}

export interface SkillsContent {
  summary: string[];
  stack: SkillInfo[];
}

export const skillsContent: SkillsContent = {
  summary: [
    "Опыт более 3-ех лет. Сейчас работаю в ООО «ИРЗ» на позиции Middle Fullstack разработчика.",
    "Мой стек технологий: Javascript, Typescript, React, Nest.js",
  ],
  stack: [
    { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
    { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
    { name: "React", icon: SiReact, color: "#61DAFB" },
    { name: "Nest.js", icon: SiNestjs, color: "#E0234E" },
  ],
};
