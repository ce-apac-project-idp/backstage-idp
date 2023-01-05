import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const rhacsPlugin = createPlugin({
  id: 'rhacs',
  routes: {
    root: rootRouteRef,
  },
});

export const RhacsPage = rhacsPlugin.provide(
  createRoutableExtension({
    name: 'RhacsPage',
    component: () =>
      import('./components/ClusterStatusPage').then(m => m.ClusterStatusPage),
    mountPoint: rootRouteRef,
  }),
);
