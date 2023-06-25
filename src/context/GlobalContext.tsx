import React, { createContext, useReducer } from "react";
import { Action, User } from "@/context/types";

const getCachedItem = (key: string) => {
  const stringifiedState = localStorage.getItem("tripsitterState");
  const item = stringifiedState ? JSON.parse(stringifiedState)[key] : null;
  if (item) return item;
  else return null;
};

const updateCachedState = (state: State) => {
  localStorage.setItem("tripsitterState", JSON.stringify(state));
};

const apiUrl = import.meta.env.VITE_API_URL;

type State = {
  apiUrl: string;

  user: User;
  setUser: (user: User) => void;

  sessionId: string | null;
  setSessionId: (sessionId: string) => void;

  isMuted: boolean;
  setIsMuted: (isMuted: boolean) => void;

  showSettings: boolean;
  setShowSettings: (showSettings: boolean) => void;

  isInfinateConversation: boolean;
  setIsInfinateConversation: (isInfinateConversation: boolean) => void;

  systemMessage: string;
  setSystemMessage: (systemMessage: string) => void;
};

const initialState: State = {
  apiUrl,

  user: getCachedItem("user") || null,
  setUser: () => {},

  sessionId: null,
  setSessionId: () => {},

  isMuted: getCachedItem("isMuted") || true,
  setIsMuted: () => {},

  showSettings: false,
  setShowSettings: () => {},

  isInfinateConversation: getCachedItem("isInfinateConversation") || false,
  setIsInfinateConversation: () => {},

  systemMessage: "",
  setSystemMessage: () => {},
};

const userReducer = (state: State, action: Action) => {
  let newState: State = state;
  switch (action.type) {
    case "SET_USER":
      const user = action.payload;
      if (!user) {
        localStorage.removeItem("tripsitterState");
        return { apiUrl } as State;
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

    case "SET_SHOW_SETTINGS":
      newState = { ...state, showSettings: action.payload };
      return newState;

    case "SET_SYSTEM_MESSAGE":
      newState = { ...state, systemMessage: action.payload };
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
    setShowSettings: (showSettings: boolean) => {
      dispatch({ type: "SET_SHOW_SETTINGS", payload: showSettings });
    },
    setSystemMessage: (systemMessage: string) => {
      dispatch({ type: "SET_SYSTEM_MESSAGE", payload: systemMessage });
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
