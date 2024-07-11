import { IOptions, QueryResult } from '../paginate/paginate';
import Wallpaper from './wallpaper.model';

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
