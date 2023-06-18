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

  sessionId: string | null;
  setSessionId: (sessionId: string) => void;

  isMuted: boolean;
  setIsMuted: (isMuted: boolean) => void;
};

const initialState: State = {
  apiUrl: import.meta.env.VITE_API_URL,

  user: null,
  setUser: () => {},

  sessionId: null,
  setSessionId: () => {},

  isMuted: false,
  setIsMuted: () => {},
};

const userReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_IS_MUTED":
      return { ...state, isMuted: action.payload };
    case "SET_SESSION_ID":
      return { ...state, sessionId: action.payload };
    default:
      return state;
  }
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const actions = {
    setUser: (user: User) => {
      dispatch({ type: "SET_USER", payload: user });
    },
    setIsMuted: (isMuted: boolean) => {
      dispatch({ type: "SET_IS_MUTED", payload: isMuted });
    },
    setSessionId: (sessionId: string) => {
      dispatch({ type: "SET_SESSION_ID", payload: sessionId });
    },
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
