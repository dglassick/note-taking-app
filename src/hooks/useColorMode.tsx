"use client";
import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

const useColorMode = () => {
  const [tailwindColorMode, setTailwindColorMode] = useLocalStorage("color-theme", "light");

  useEffect(() => {
    const className = "dark";
    const bodyClass = window.document.body.classList;

    tailwindColorMode === "dark"
      ? bodyClass.add(className)
      : bodyClass.remove(className);
  }, [tailwindColorMode]);

  return [tailwindColorMode, setTailwindColorMode];
};

export default useColorMode;
