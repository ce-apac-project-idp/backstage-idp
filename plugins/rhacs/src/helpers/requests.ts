import { ConfigApi } from '@backstage/core-plugin-api';
import axios, { AxiosRequestConfig } from 'axios';

const instance = axios.create({
  timeout: 1000,
});

async function requestBackend(
  configApi: ConfigApi,
  requestConfig: AxiosRequestConfig,
) {
  try {
    const baseUrl = configApi.getString('backend.baseUrl');
    const config = {
      baseURL: `${baseUrl}/api/rhacs`,
      method: 'get',
      ...requestConfig,
    } as AxiosRequestConfig;

    const res = await instance.request(config);
    return res.data;
  } catch (err) {
    return {
      status: 'error',
      message: err.message,
      detail: err,
    };
  }
}

export async function getCentralEndpoint(
  configApi: ConfigApi,
): Promise<string> {
  try {
    const response = await requestBackend(configApi, {
      url: '/v1/central',
    });
    return response;
  } catch (err) {
    throw err;
  }
}

export type RhacsViolationSummary = {
  groups: [
    {
      group: string;
      counts: [
        {
          severity: string;
          count: string;
        },
      ];
    },
  ];
};

export type RhacsAlert = {
  id: string,
  time: string,
  deployment: {
    "clusterName": string,
    "namespace": string,
    "name": string,
    "__typename": "Alert_Deployment"
  },
  policy: {
    name: string,
    severity: string,
    "__typename": "Policy"
  },
  "__typename": "Alert"
}

export async function getViolationSummary(
  configApi: ConfigApi,
): Promise<RhacsViolationSummary> {
  try {
    const response = await requestBackend(configApi, {
      url: '/v1/alerts/summary',
    });
    return response;
  } catch (err) {
    throw err;
  }
}

export async function getRecentAlerts(
  configApi: ConfigApi,
): Promise<RhacsAlert[]> {
  try {
    const response = await requestBackend(configApi, {
      url: '/v1/alerts/recent',
    }) as { data: {alerts: RhacsAlert[] }};

    return response.data.alerts;
  } catch (err) {
    throw err;
  }
}

export type ImageInfo = {
  imageReference: string
  imageSha: string
  imageOwner: string
  imageName: string
}

export async function getImageContext(
  configApi: ConfigApi,
): Promise<any> {
  try {
    const response = await requestBackend(configApi, {
      url: '/v1/imagecontext',
    }) as { data: ImageInfo };

    return response;
  } catch (err) {
    throw err;
  }
}

export async function getImageFromRhacs(
  configApi: ConfigApi,
  sha: string,
): Promise<any> {
  try {
    if (!sha || sha === 'undefined') {
      return Promise.resolve('dummy');
    }

    const response = await requestBackend(configApi, {
      url: `/v1/images/${sha}`,
      timeout: 2000  // 1000ms returns timeout I don't know why
    });

    return response;
  } catch (err) {
    throw err;
  }
}