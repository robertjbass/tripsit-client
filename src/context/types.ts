import FBAuth from "firebase/auth";

export type Message = {
  agent: "user" | "assistant";
  message: string;
};

export type User = FBAuth.User | null;

export type Action = {
  type: any;
  payload?: any;
};
