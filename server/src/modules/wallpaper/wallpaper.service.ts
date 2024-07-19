import config from '../../config/config';
import { IOptions, QueryResult } from '../paginate/paginate';
import { CreateWallpaperDto } from './dtos/createWallpaper.dto';
import { IWallpaperDoc } from './wallpaper.interface';
import Wallpaper from './wallpaper.model';

/**
 * Create a new Wallpaper
 * @param {CreateWallpaperDto} createWallpaperDto - Create Wallpaper DTO
 * @returns {Promise<IWallpaperDoc>}
 */
export const createWallpaper = async (createWallpaperDto: CreateWallpaperDto): Promise<IWallpaperDoc> => {
  let { labels, significantColorHexCodes, type, imageKey, previewKey } = createWallpaperDto;

  labels = labels.map((label) => label.toLowerCase());
  significantColorHexCodes = significantColorHexCodes.map((hexCode) => hexCode.toLowerCase());
  const category = imageKey.split('/')[0];
  const download_link = `https://${config.aws.s3.wallpaper_bucket}.s3.${config.aws.region}.amazonaws.com/${imageKey}`;
  const preview_link = `https://${config.aws.s3.wallpaper_preview_bucket}.s3.${config.aws.region}.amazonaws.com/${previewKey}`;

  let wallpaper = await Wallpaper.create({
    type,
    category,
    download_link,
    preview_link,
    labels,
    dominant_colors: significantColorHexCodes,
  });

  console.log(wallpaper);
  return wallpaper;
};

/**
 * Get a random shuffled feed of wallpapers with pagination
 * @param {IOptions} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const wallpaperFeed = async (options: IOptions = { page: 1, limit: 10 }): Promise<QueryResult> => {
  options.randomize = true;
  let wallpapers = await Wallpaper.paginate({}, options);
  return wallpapers;
};

/**
 * Query for wallpapers with pagination
 * @param {Object} filter - MongoDB filter
 * @param {IOptions} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryWallpaper = async (
  filter: Record<string, any>,
  options: IOptions = { page: 1, limit: 10 }
): Promise<QueryResult> => {
  let wallpapers = await Wallpaper.paginate(filter, options);
  return wallpapers;
};
