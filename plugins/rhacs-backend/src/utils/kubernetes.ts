import http from 'http';
import * as k8s from '@kubernetes/client-node';

type KubernetesResponse = {
  response: http.IncomingMessage;
  body: any;
};

type Route = {
  spec: {
    host: string;
  };
};

const kubeConfig = new k8s.KubeConfig();
kubeConfig.loadFromDefault();

const kubeCoreApi = kubeConfig.makeApiClient(k8s.CoreV1Api);
const kubeCRDApi = kubeConfig.makeApiClient(k8s.CustomObjectsApi);

function kubeErrorHandler(err: unknown) {
  if (err instanceof Error) {
    throw new Error(err.message);
  }
  throw new Error((err as KubernetesResponse).body.reason);
}

export async function getNamespace() {
  return kubeCoreApi.listNamespace();
}

export async function getCentralEndpoint() {
  try {
    const { body } = (await kubeCRDApi.getNamespacedCustomObject(
      'route.openshift.io',
      'v1',
      'rhacs-operator',
      'routes',
      'central',
    )) as { body: Route };

    return body.spec.host;
  } catch (err) {
    return kubeErrorHandler(err);
  }
}
