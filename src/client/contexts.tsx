'use client'

import { createContext, useState } from "react";


export const OverlayContext = createContext({top: '-100%', setTop: (new_val: string) => {}});

export const OverlayContextProvider = ({ children }: {children:any}) => {
    const [top, setTop] = useState('-100%');
  
    return (
      <OverlayContext.Provider value={{top, setTop }}>
        {children}
      </OverlayContext.Provider>
    );
  };