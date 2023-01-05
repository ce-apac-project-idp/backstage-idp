import http from 'http'

const k8s = require('@kubernetes/client-node');

const kubeConfig = new k8s.KubeConfig();
kubeConfig.loadFromDefault();

const kubeApi = kubeConfig.makeApiClient(k8s.CoreV1Api);

type KubernetesResponse = {
  response: http.IncomingMessage
  body: any
}
function kubeResponseHandler(data: KubernetesResponse) {
  return data.body
}

function kubeErrorHandler(err: unknown) {
  if (err instanceof Error) {
    throw new Error(err.message)
  }
  throw new Error((err as KubernetesResponse).body.reason)
}

export async function getCentral() {
  try {
    const response = await kubeApi.readNamespacedEndpoints('central', 'rhacs-operator')
    return kubeResponseHandler(response)
  } catch(err) {
    return kubeErrorHandler(err)
  }
}



