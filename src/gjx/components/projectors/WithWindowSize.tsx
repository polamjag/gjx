import React, { useEffect, useState } from "react";

interface WindowSize {
  width: number;
  height: number;
}

export const WindowSizeContext = React.createContext<WindowSize>({
  height: window?.top?.innerHeight ?? 0,
  width: window?.top?.innerWidth ?? 0,
});

export const WithWindowSize: React.FC<{}> = ({ children }) => {
  const [size, setSize] = useState<WindowSize>({
    height: window?.top?.innerHeight ?? 0,
    width: window?.top?.innerWidth ?? 0,
  });
  const updateWindowSizeInfo = () => {
    setSize({
      height: window?.top?.innerHeight ?? 0,
      width: window?.top?.innerWidth ?? 0,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", updateWindowSizeInfo);

    return () => {
      window.removeEventListener("resize", updateWindowSizeInfo);
    };
  }, []);

  return (
    <WindowSizeContext.Provider value={size}>
      {children}
    </WindowSizeContext.Provider>
  );
};
