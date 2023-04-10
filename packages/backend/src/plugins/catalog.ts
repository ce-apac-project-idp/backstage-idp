import { Entity, ResourceEntity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import {
  CatalogProcessor,
  CatalogProcessorCache,
  CatalogProcessorEmit,
  CatalogBuilder,
} from '@backstage/plugin-catalog-backend';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { ManagedClusterProvider } from '@internal/backstage-plugin-rhacm-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { isInSystemRule } from './permissionRules';

const RHACM_ENABLED = 'rhacm.enabled';

function isRHACMEnabled(config: Config): String {
  return config.getString(RHACM_ENABLED);
}

class OpenshiftResourceProcessor implements CatalogProcessor {
  getProcessorName(): string {
    return 'OpenshiftResourceProcessor';
  }

  async preProcessEntity(
    entity: Entity,
    _location: LocationSpec,
    _emit: CatalogProcessorEmit,
    originLocation: LocationSpec,
    _cache: CatalogProcessorCache,
  ): Promise<Entity> {
    if (entity.kind !== 'Resource') {
      return entity;
    }
    const resource = entity as ResourceEntity;
    if (resource.spec.type !== 'kubernetes-cluster') {
      return resource;
    }

    if (originLocation.type === 'rhacm-managed-cluster') {
      resource.metadata.annotations ||= {};
      resource.metadata.annotations['operate-first.cloud/logo-url'] =
        'https://upload.wikimedia.org/wikipedia/commons/3/3a/OpenShift-LogoType.svg';
    }
    return resource;
  }
}


export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);


  // RHACM Plugin should only be conditionally enabled. This can be provided as a ConfigMap
  // and read via the Config API.
  if (isRHACMEnabled(env.config) === "true") {
    console.log("RHACM Plugin Enabled...")
    const rhacm = ManagedClusterProvider.fromConfig(env.config, {
      logger: env.logger,
    });
    builder.addEntityProvider(rhacm);
    builder.addProcessor(new OpenshiftResourceProcessor());
    builder.addPermissionRules(isInSystemRule);
  } 

  builder.addProcessor(new ScaffolderEntitiesProcessor());


  const { processingEngine, router } = await builder.build();
  await processingEngine.start();
  return router;
}
