import { Message } from "@/model/User";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessage?:boolean; //during sign up not req so optional
  messages?:Array<Message>;
}