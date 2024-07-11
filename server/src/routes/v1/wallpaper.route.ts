import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { wallpaperController, wallpaperValidation } from '../../modules/wallpaper';

const router: Router = express.Router();

router.route('/').get(validate(wallpaperValidation.queryWallpapers), wallpaperController.queryWallpaper);

router.route('/feed').get(wallpaperController.getWallpaperFeed);

export default router;

/**
 * @swagger
 * tags:
 *   name: Wallpaper
 *   description: APIs for managing wallpapers
 */

/**
 * @swagger
 * /wallpapers:
 *   get:
 *     summary: Query wallpapers
 *     description: Query wallpapers based on filter and pagination options.
 *     tags: [Wallpaper]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by wallpaper category
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by wallpaper title
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by query in the form of field:desc/asc (ex. title:asc)
 *       - in: query
 *         name: projectBy
 *         schema:
 *           type: string
 *         description: Project by query in the form of field:hide/include (ex. description:hide)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of wallpapers per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Wallpaper'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "400":
 *         $ref: '#/components/responses/NotFound'
 *       "500":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /wallpapers/feed:
 *   get:
 *     summary: Get wallpaper feed
 *     description: Retrieves a feed of wallpapers based on pagination options.
 *     tags: [Wallpaper]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of wallpapers per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Wallpaper'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "400":
 *         $ref: '#/components/responses/NotFound'
 *       "500":
 *         $ref: '#/components/responses/NotFound'
 */
