// context/LearningContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type View = "editor" | "materials" | "table" | "list";

interface LearningContextType {
  activeView: View;
  setActiveView: (view: View) => void;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export function LearningProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveView] = useState<View>("editor");

  return (
    <LearningContext.Provider value={{ activeView, setActiveView }}>
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error("useLearning must be used within a LearningProvider");
  }
  return context;
}
