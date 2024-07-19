import mongoose from 'mongoose';
import { toJSON } from '../toJSON';
import { paginate } from '../paginate';
import { IWallpaperDoc, IWallpaperModel, WallpaperType } from './wallpaper.interface';

const wallpaperSchema = new mongoose.Schema<IWallpaperDoc, IWallpaperModel>(
  {
    type: {
      type: String,
      enum: Object.values(WallpaperType),
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    download_link: {
      type: String,
      required: true,
    },
    preview_link: {
      type: String,
      required: true,
    },
    labels: {
      type: [String],
      required: true,
      default: [],
    },
    dominant_colors: {
      type: [String],
      required: true,
      default: [],
    },
    stats: {
      download_count: { type: Number, required: true, default: 0 },
      likes: { type: Number, required: true, default: 0 },
    },
  },
  { timestamps: true }
);

wallpaperSchema.plugin(toJSON);
wallpaperSchema.plugin(paginate);

const Wallpaper = mongoose.model<IWallpaperDoc, IWallpaperModel>('Wallpaper', wallpaperSchema);

export default Wallpaper;
