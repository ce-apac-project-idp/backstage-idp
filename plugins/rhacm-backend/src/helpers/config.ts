import { Config } from '@backstage/config';

const CLUSTERS_PATH = 'kubernetes.clusterLocatorMethods';
const HUB_TYPE = 'hub';

export const getHubClusterFromConfig = (config: Config) => {
  const hubCluster = config
  .getConfigArray(CLUSTERS_PATH)
  .flatMap(method => method.getOptionalConfigArray('clusters') || [])
  .find(
    cluster =>
      cluster.getString('type') === HUB_TYPE
  );
  if (!hubCluster) {
    throw new Error(`A cluster with type '${HUB_TYPE}' must be defined`)
  }
  return hubCluster;
};
