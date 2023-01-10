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
    return err;
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

type RhacsViolationSummary = {
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

export async function getViolationSummary(
  configApi: ConfigApi,
): Promise<RhacsViolationSummary> {
  try {
    const response = await requestBackend(configApi, {
      url: '/v1/alerts/summary/counts',
    });
    return response;
  } catch (err) {
    throw err;
  }
}
