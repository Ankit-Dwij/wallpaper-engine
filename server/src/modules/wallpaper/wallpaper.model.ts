import mongoose from 'mongoose';
import { toJSON } from '../toJSON';
import { paginate } from '../paginate';
import { IWallpaperDoc, IWallpaperModel, WallpaperCategory } from './wallpaper.interface';

const wallpaperSchema = new mongoose.Schema<IWallpaperDoc, IWallpaperModel>(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(WallpaperCategory),
      required: true,
    },
    download_link: {
      type: String,
      required: true,
    },
    preview_image: {
      type: String,
    },
  },
  { timestamps: true }
);

wallpaperSchema.plugin(toJSON);
wallpaperSchema.plugin(paginate);

const Wallpaper = mongoose.model<IWallpaperDoc, IWallpaperModel>('Wallpaper', wallpaperSchema);

export default Wallpaper;
