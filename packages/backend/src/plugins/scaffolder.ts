import { CatalogClient } from '@backstage/catalog-client';
import { createRouter } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';
import { createBuiltinActions } from '@backstage/plugin-scaffolder-backend';
import { ScmIntegrations } from '@backstage/integration';
import { triggerDevsecopsPipelineAction } from './scaffolder/actions/triggerDevsecopsPipeline';
import { triggerClusterDeployPipelineAction } from './scaffolder/actions/triggerClusterDeployPipeline';
import { triggerMQPipelineAction } from './scaffolder/actions/triggerMQPipeline'
import { triggerACEDeployPipelineAction } from './scaffolder/actions/triggerACEDeployPipeline';
import { triggerDCDeployPipelineAction } from './scaffolder/actions/triggerDCDeployPipeline';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });
  const integrations = ScmIntegrations.fromConfig(env.config);

  const builtInActions = createBuiltinActions({
    integrations,
    catalogClient,
    config: env.config,
    reader: env.reader,
  });

  const actions = [
    ...builtInActions,
    triggerDevsecopsPipelineAction(),
    triggerClusterDeployPipelineAction(),
    triggerACEDeployPipelineAction(),
    triggerDCDeployPipelineAction(),
    triggerMQPipelineAction(),
  ];

  return await createRouter({
    actions,
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
    catalogClient,
    identity: env.identity,
  });
}
