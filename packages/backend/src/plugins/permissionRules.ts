// @ts-nocheck

import { createConditionFactory } from '@backstage/plugin-permission-node';
import { createCatalogPermissionRule } from '@backstage/plugin-catalog-backend/alpha';
import type { Entity } from '@backstage/catalog-model';
import { z } from 'zod';

export const isInSystemRule = createCatalogPermissionRule({
  name: 'IS_IN_SYSTEM',
  description: 'Checks if an entity is part of the system provided',
  resourceType: 'catalog-entity',
  paramsSchema: z.object({
    systemRef: z
      .string()
      .describe('SystemRef to check the resource is part of'),
  }),
  apply: (resource: Entity, { systemRef }) => {
    if (!resource.relations) {
      return false;
    }
    return resource.relations
      .filter(relation => relation.type === 'partOf')
      .some(relation => relation.targetRef === systemRef);
  },
  toQuery: ({ systemRef }) => ({
    key: 'relations.partOf',
    values: [systemRef],
  }),
});

export const isInSystem = createConditionFactory(isInSystemRule);
