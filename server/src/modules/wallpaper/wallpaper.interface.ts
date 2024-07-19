import { Document, Model } from 'mongoose';
import { QueryResult } from '../paginate/paginate';
export interface IStats {
  download_count: number;
  likes: number;
}

export enum WallpaperType {
  WALLPAPER = 'wallpaper',
  LIVE_WALLPAPER = 'live_wallpaper',
  VIDEO_WALLPAPER = 'video_wallpaper',
}

export interface IWallpaper {
  type: WallpaperType;
  category: string;
  download_link: string;
  preview_link: string;
  labels: Array<string>;
  dominant_colors: Array<string>;
  stats: IStats;
}

export interface IWallpaperDoc extends IWallpaper, Document {}

export interface IWallpaperModel extends Model<IWallpaperDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}
