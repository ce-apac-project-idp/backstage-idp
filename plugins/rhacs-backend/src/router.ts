import { errorHandler } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { getViolationSummary } from './utils/requests'

export interface RouterOptions {
  logger: Logger;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { config } = options;

  const router = Router();
  router.use(express.json());

  router.get(
    '/v1/alerts/summary/counts',
    ({}, response) => {
      return getViolationSummary(config)
        .then(resp => {
          return response.json(resp)
        })
        .catch(err => {
          return response.status(500).json({
            error: err.message
          })
        })
    },
  );

  router.use(errorHandler({ logClientErrors: true }));
  return router;
}
