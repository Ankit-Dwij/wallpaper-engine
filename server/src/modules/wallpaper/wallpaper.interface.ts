import { Document, Model } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export enum WallpaperCategory {
  NATURE = 'nature',
  FLOWERS = 'flowers',
  ANIMALS = 'animals',
}

export interface IWallpaper {
  title: string;
  category: WallpaperCategory;
  download_link: string;
  preview_image: string;
}

export interface IWallpaperDoc extends IWallpaper, Document {}

export interface IWallpaperModel extends Model<IWallpaperDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}
