import { createContext, useEffect, useState } from "react";

export let TokenContext = createContext();

export default function TokenContextProvider(props) {
  const [token, setToken] = useState(localStorage.getItem("userToken"));
  const [role, setRole] = useState(localStorage.getItem("userRole"));
  // const [user, setUser] = useState(localStorage.getItem("user"))

  // headers based on current token
  const headers = {
    Authorization: "Bearer " + token
  };

  return (
    <TokenContext.Provider value={{ token, headers, setToken, role, setRole  }}>
      {props.children}
    </TokenContext.Provider>
  );
}
