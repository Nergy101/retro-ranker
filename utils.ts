import { createDefine } from "fresh";
import { CustomFreshState } from "./interfaces/state.ts";

export interface State extends CustomFreshState {}

export const define = createDefine<State>();
