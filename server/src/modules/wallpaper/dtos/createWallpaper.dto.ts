import { WallpaperType } from '../wallpaper.interface';

export interface CreateWallpaperDto {
  type: WallpaperType;
  imageKey: string;
  previewKey: string;
  labels: string[];
  significantColorHexCodes: string[];
}
