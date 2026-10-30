import React, { createContext, useState } from "react";

type propsPage = {
  isLogin: null | string;
  setLogin: React.Dispatch<React.SetStateAction<null | string>>;
};

export const authContext = createContext<propsPage | null>(null);

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLogin, setLogin] = useState<null | string>(()=>{return localStorage.getItem("tkn")});

  return (
    <authContext.Provider value={{ isLogin, setLogin }}>
      {children}
    </authContext.Provider>
  );
}