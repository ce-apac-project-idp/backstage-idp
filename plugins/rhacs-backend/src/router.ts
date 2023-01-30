import { errorHandler } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { getCentralEndpoint } from './utils/kubernetes';
import {createAxiosInstance, getRecentAlerts, getViolationSummary} from './utils/requests';

export interface RouterOptions {
  logger: Logger;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { config } = options;

  const router = Router();
  const axiosInstance = await createAxiosInstance(config);

  router.use(express.json());

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

  router.post('/v1/images', (request, response) => {
    console.log('RHACS /v1/image', request.body)
    // TODO: update contexts;

    return Promise.resolve(true)
      .then(resp => response.json(resp))
      .catch(err => {
        return response.status(500).json({
          message: 'Could not deliver image reference to RHACS plugin',
          error: err.message,
        });
      });
  });

  router.use(errorHandler({ logClientErrors: true }));
  return router;
}
