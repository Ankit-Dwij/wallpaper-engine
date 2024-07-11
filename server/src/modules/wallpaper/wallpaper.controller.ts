import { Request, Response } from 'express';
import { catchAsync, pick } from '../utils';
import { IOptions } from '../paginate/paginate';
import * as wallpaperService from './wallpaper.service';

export const getWallpaperFeed = catchAsync(async (req: Request, res: Response) => {
  const options: IOptions = pick(req.query, ['limit', 'page']);
  const wallpapers = await wallpaperService.wallpaperFeed(options);
  res.send(wallpapers);
});

export const queryWallpaper = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['category', 'title']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await wallpaperService.queryWallpaper(filter, options);
  res.send(result);
});
