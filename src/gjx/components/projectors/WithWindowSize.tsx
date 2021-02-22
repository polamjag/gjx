import React, { useEffect, useState } from "react";

interface WindowSize {
  width: number;
  height: number;
}

export const WindowSizeContext = React.createContext<WindowSize>({
  height: window.top.innerHeight,
  width: window.top.innerWidth,
});

export const WithWindowSize: React.FC<{}> = ({ children }) => {
  const [size, setSize] = useState<WindowSize>({
    height: window.top.innerHeight,
    width: window.top.innerWidth,
  });
  const updateWindowSizeInfo = () => {
    setSize({
      height: window.top.innerHeight,
      width: window.top.innerWidth,
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
