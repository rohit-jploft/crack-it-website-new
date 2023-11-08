import React, { createContext, useState } from "react";
export const ModelContext = createContext();

export const ModelProvider = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <ModelContext.Provider
      value={{
        open,
        setOpen,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
};
