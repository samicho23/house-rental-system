/**
 * Property gallery HTTP layer.
 */
import type { Request, Response } from "express";
import { asyncHandler, parseId } from "../../utils";
import { galleryService } from "./gallery.service";

export const galleryController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json(await galleryService.list(parseId(req.params.propertyId)));
  }),

  add: asyncHandler(async (req: Request, res: Response) => {
    res.status(201).json(
      await galleryService.add(parseId(req.params.propertyId), req.user!, req.body)
    );
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await galleryService.remove(
      parseId(req.params.propertyId),
      parseId(req.params.photoId),
      req.user!
    );
    res.status(204).send();
  }),

  reorder: asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json(
      await galleryService.reorder(parseId(req.params.propertyId), req.user!, req.body)
    );
  }),
};
