import React, { createContext, useReducer } from "react";

type Action = {
  type: any;
  payload?: any;
};

type User = { [key: string]: any } | null;
type State = {
  apiUrl: string;

  user: User;
  setUser: (user: User) => void;
};

const initialState: State = {
  apiUrl: import.meta.env.VITE_API_URL,

  user: null,
  setUser: () => {},
};

const userReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const setUser = (user: User) => {
    dispatch({ type: "SET_USER", payload: user });
  };

  const actions = {
    setUser,
  };

  const stateValues: State & typeof actions = {
    ...state,
    ...actions,
  };

  return (
    <GlobalContext.Provider value={stateValues}>
      {children}
    </GlobalContext.Provider>
  );
};
