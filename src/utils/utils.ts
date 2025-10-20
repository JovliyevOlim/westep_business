export const animationCreate = () => {
  if (typeof window !== "undefined") {
    import("wowjs").then((module) => {
      const WOW = module.default;
      new WOW.WOW({live: false}).init()
    });
  }
};

import { useEffect } from "react";

export const useWowAnimation = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("wowjs").then((module) => {
        const WOW = module.default;
        setTimeout(() => {
          new WOW({ live: false }).init();
        }, 100); // Adjust delay if necessary
      });
    }
  }, []);
};


export const setItem = <T>(name: string, data: T): void => {
  localStorage.setItem(name, JSON.stringify(data));
};

export const getItem = <T>(name: string): T | null => {
  const value = localStorage.getItem(name);
  return value ? JSON.parse(value) as T : null;
};


export const removeItem = (name: string): void => {
  localStorage.removeItem(name);
};