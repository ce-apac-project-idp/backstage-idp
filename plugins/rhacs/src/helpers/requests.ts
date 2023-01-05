// @ts-nocheck
import { ConfigApi } from '@backstage/core-plugin-api';
import axios, { AxiosRequestConfig } from "axios";

const instance = axios.create({
  timeout: 1000,
})

async function request(configApi: ConfigApi, requestConfig: AxiosRequestConfig) {
  try {
    const baseUrl = configApi.getString('backend.baseUrl');
    const config = {
      baseURL: `${baseUrl}/api/rhacs`,
      method: 'get',
      ...requestConfig
    } as AxiosRequestConfig;

    const res = await instance.request(config)
    return res
  } catch(err) {
    return err
  }
}

export async function getViolationSummary(configApi: ConfigApi) {
  try {
    const response = await request(configApi, {
      url: '/v1/alerts/summary/counts'
    });
    return response
  } catch(err) {
    return err
  }
}
