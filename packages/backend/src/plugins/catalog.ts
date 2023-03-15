import { Entity, ResourceEntity } from '@backstage/catalog-model';
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
  const rhacm = ManagedClusterProvider.fromConfig(env.config, {
    logger: env.logger,
  });

  builder.addProcessor(new ScaffolderEntitiesProcessor());
  builder.addEntityProvider(rhacm);
  builder.addProcessor(new OpenshiftResourceProcessor());
  builder.addPermissionRules(isInSystemRule);

  const { processingEngine, router } = await builder.build();
  await processingEngine.start();
  return router;
}
