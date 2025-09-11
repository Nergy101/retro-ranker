export interface ReviewContract {
  id: string;
  content: string;
  device: string;
  user: string;
  performance_rating: number;
  monitor_rating: number;
  audio_rating: number;
  controls_rating: number;
  misc_rating: number;
  connectivity_rating: number;
  overall_rating: number;
  created: string;
  updated: string;
  expand?: {
    user?: {
      id: string;
      nickname: string;
    };
  };
}
