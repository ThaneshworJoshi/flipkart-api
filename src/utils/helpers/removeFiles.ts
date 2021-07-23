import fs from 'fs';
import path from 'path';
import { CategoryDocument } from '../../models/category.model';
import { ProductDocument } from '../../models/product.model';
import logger from '../logger';
/**
 * Remove files from system
 * @param {Array<string>|| string}images
 */
export const removeFiles = (images: Array<string> | string) => {
  if (!Array.isArray(images)) {
    images = [images];
  }
  images.forEach((imgName) => {
    fs.unlink(path.join(path.resolve(), '/uploads', imgName), (err) => {
      if (err) {
        logger.error(err.message);
      }
      return;
    });
  });
};

/**
 * Remove images
 * @param {array}images
 */
export const removeImages = (images: Array<object>) => {
  let imageName: Array<string> = [];

  images.forEach((img: object) => {
    //@ts-ignore
    imageName.push(img.img);
  });
  removeFiles(imageName);
};

/**
 * Remove image
 * @param {String} image
 */
export const removeImage = (image: string) => {
  removeFiles(image);
};
