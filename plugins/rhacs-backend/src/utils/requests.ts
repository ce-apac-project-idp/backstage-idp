import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ConfigApi } from '@backstage/core-plugin-api';
import { getCentralEndpoint } from './kubernetes';

export async function createAxiosInstance(configApi: ConfigApi) {
  const rhacsApiToken = configApi.getString('rhacs.token');

  const axiosConfig = {
    timeout: 2000,
    headers: {
      Authorization: `Bearer ${rhacsApiToken}`,
    },
  } as AxiosRequestConfig;

  if (process.env.NODE_ENV === 'development') {
    const centralEndpoint = await getCentralEndpoint();
    axiosConfig.baseURL = `https://${centralEndpoint}`;
  } else {
    axiosConfig.baseURL = 'https://central.rhacs-operator.svc:443';
  }

  return axios.create(axiosConfig);
}

/**
 * Cluster-wide
 */
export async function getViolationSummary(instance: AxiosInstance) {
  try {
    const response = await instance.request({
      url: '/v1/alerts/summary/counts',
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getRecentAlerts(instance: AxiosInstance) {
  try {
    const response = await instance.request({
      url: '/api/graphql',
      params: {
        opname: 'mostRecentAlerts',
      },
      data: '{\n"operationName":"mostRecentAlerts",\n"variables":{"query":"Severity:CRITICAL_SEVERITY"},\n"query":"query mostRecentAlerts($query: String) {alerts: violations(query: $query pagination: {limit: 3, sortOption: {field: \\"Violation Time\\", reversed: true}}) {id time deployment {clusterName namespace name __typename } policy { name severity __typename}__typename}}"\n}',
    });

    return response.data;
  } catch (err) {
    throw err;
  }
}

/**
 * Image-specific
 */
export async function getImageReport(instance: AxiosInstance, sha: string) {
  try {
    const response = await instance.request({
      url: `/v1/images/${sha}`,
    });

    return response.data;
  } catch (err) {
    throw err;
  }
}
