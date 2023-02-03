import { errorHandler } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { getCentralEndpoint } from './utils/kubernetes';
import {
  createAxiosInstance,
  getRecentAlerts,
  getViolationSummary,
  getImageReport,
} from './utils/requests';
import { currentImage } from './imageController';

export interface RouterOptions {
  logger: Logger;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { config, logger } = options;

  const router = Router();
  const axiosInstance = await createAxiosInstance(config);

  router.use(express.json());

  /**
   * cluster-wide
   */
  router.get('/v1/central', ({}, response) => {
    return getCentralEndpoint()
      .then(resp => response.json(resp))
      .catch(err => {
        return response.status(500).json({
          error: err.message,
        });
      });
  });

  router.get('/v1/alerts/summary', ({}, response) => {
    return getViolationSummary(axiosInstance)
      .then(resp => response.json(resp))
      .catch(err => {
        return response.status(500).json({
          error: err.message,
        });
      });
  });

  router.get('/v1/alerts/recent', ({}, response) => {
    return getRecentAlerts(axiosInstance)
      .then(resp => response.json(resp))
      .catch(err => {
        return response.status(500).json({
          error: err.message,
        });
      });
  });

  /**
   * image-specific
   */
  router.get('/v1/imagecontext', ({}, response) => {
    /*
     * TODO:
     * This at the moment manages only one `image` for the developer repo catalog
     * Image for each (developer, app) should reside in DB so that RHACS know what to query in the catalog
     * */
    try {
      return response.json(currentImage.getImage());
    } catch (err) {
      return response.status(500).json({
        message: 'Could not get image information',
        error: err.message,
      });
    }
  });

  router.post('/v1/imagecontext', (request, response) => {
    try {
      logger.debug(`/v1/imagecontext ${request.body}`);
      const body = request.body;

      if (!body || Object.keys(body).length < 1) {
        return response.status(400).json({
          message:
            'Bad request. Please send { imageReference, imageSha, owner(optional), name(optional) }',
        });
      }
      currentImage.setImage(body.imageReference, body.imageSha);
      return response.status(200).json(currentImage.getImage());
    } catch (err) {
      return response.status(500).json({
        message: 'Could not deliver image reference to RHACS plugin',
        error: err.message,
      });
    }
  });

  router.get('/v1/images/:sha', (request, response, next) => {
    logger.debug(`/v1/imagecontext ${request.params}`);

    if (!request.params?.sha || request.params?.sha.length < 1) {
      next(new Error('Image ID (SHA) is missing in the request'));
    }

    return getImageReport(axiosInstance, request.params.sha)
      .then(resp => response.json(resp))
      .catch(err => {
        return response.status(500).json({
          error: err.message,
        });
      });
  });

  router.use(errorHandler({ logClientErrors: true }));
  return router;
}
