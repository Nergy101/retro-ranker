import { Device } from "./device.model.ts";
import { User } from "./user.contract.ts";

export interface ReviewContract {
  id: string;
  created: string;
  updated: string;

  content: string;
  user: string;
  device: string;

  performance_rating: number;
  monitor_rating: number;
  audio_rating: number;
  controls_rating: number;
  misc_rating: number;
  connectivity_rating: number;
  overall_rating: number;

  expand: {
    user: User;
    device: Device;
  };
}
