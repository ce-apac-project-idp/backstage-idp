export interface Config {
  rhacm: {
    /**
     * Name of the cluster where the ACM(Advanced Cluster Management) operator is installed
     * @visiblity frontend
     */
    hub: string;
    /**
     * Name of the cluster where the ACM(Advanced Cluster Management) operator is installed
     * @visiblity frontend
     */
    clusterKind: string;
    /**
     * Name of the cluster where the ACM(Advanced Cluster Management) operator is installed
     * @visiblity frontend
     */
    clusterValue: string;
  };
}
