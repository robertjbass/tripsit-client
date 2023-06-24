import FBAuth from "firebase/auth";
import React, { createContext, useReducer } from "react";

type User = FBAuth.User | null;

type Action = {
  type: any;
  payload?: any;
};

type State = {
  apiUrl: string;

  user: User;
  setUser: (user: User) => void;

  sessionId: string | null;
  setSessionId: (sessionId: string) => void;

  isMuted: boolean;
  setIsMuted: (isMuted: boolean) => void;

  isInfinateConversation: boolean;
  setIsInfinateConversation: (isInfinateConversation: boolean) => void;
};

const getCachedItem = (key: string) => {
  const stringifiedState = localStorage.getItem("tripsitterState");
  const item = stringifiedState ? JSON.parse(stringifiedState)[key] : null;
  if (item) return item;
  else return null;
};

const updateCachedState = (state: State) => {
  localStorage.setItem("tripsitterState", JSON.stringify(state));
};

const initialState: State = {
  apiUrl: import.meta.env.VITE_API_URL,

  user: getCachedItem("user") || null,
  setUser: () => {},

  sessionId: null,
  setSessionId: () => {},

  isMuted: getCachedItem("isMuted") || false,
  setIsMuted: () => {},

  isInfinateConversation: getCachedItem("isInfinateConversation") || false,
  setIsInfinateConversation: () => {},
};

const userReducer = (state: State, action: Action) => {
  let newState: State = state;
  switch (action.type) {
    case "SET_USER":
      const user = action.payload;
      if (!user) {
        localStorage.removeItem("tripsitterState");
        return {} as State;
      }

      newState = { ...state, user };
      updateCachedState(newState);
      return newState;

    case "SET_IS_MUTED":
      newState = { ...state, isMuted: action.payload };
      updateCachedState(newState);
      return newState;

    case "SET_SESSION_ID":
      newState = { ...state, sessionId: action.payload };
      updateCachedState(newState);
      return newState;

    case "SET_IS_INFANATE_CONVERSATION":
      newState = { ...state, isInfinateConversation: action.payload };
      updateCachedState(newState);
      return newState;

    default:
      return newState;
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
    setIsInfinateConversation: (isInfinateConversation: boolean) => {
      dispatch({
        type: "SET_IS_INFANATE_CONVERSATION",
        payload: isInfinateConversation,
      });
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
