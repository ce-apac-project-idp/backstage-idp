import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import { ConfigApi } from '@backstage/core-plugin-api';
import { getCentralEndpoint } from './kubernetes'

export async function createAxiosInstance(configApi: ConfigApi) {
  const rhacsApiToken = configApi.getString('rhacs.token');

  const axiosConfig = {
    timeout: 2000,
    headers: {
      'Authorization': `Bearer ${rhacsApiToken}`
    }
  } as AxiosRequestConfig;

  if (process.env.NODE_ENV === 'development') {
    const centralEndpoint = await getCentralEndpoint()
    axiosConfig.baseURL = `https://${centralEndpoint}`;
  } else {
    axiosConfig.baseURL = 'https://central.rhacs-operator.svc:443';
  }

  return axios.create(axiosConfig)
}

export async function getViolationSummary(axios: AxiosInstance) {
  try {
    const response = await axios.request({
      url: '/v1/alerts/summary/counts'
    });
    return response.data
  } catch(err) {
    throw err
  }
}
