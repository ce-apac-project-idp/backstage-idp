// @ts-nocheck

import axios, { AxiosRequestConfig } from "axios";
import { ConfigApi } from '@backstage/core-plugin-api';

const instance = axios.create({
  timeout: 1000,
})

async function request(configApi: ConfigApi, requestConfig: AxiosRequestConfig) {
  try {
    // const baseUrl = configApi.getString('backend.baseUrl');
    // const rhacsApiToken = configApi.getString('rhacs.token');
    const baseUrl = 'itzroks-671000wmfn-8vdu9o-6ccd7f378ae819553d37d5f2ee142bd6-0000.au-syd.containers.appdomain.cloud';
    const rhacsApiToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6Imp3dGswIiwidHlwIjoiSldUIn0.eyJhdWQiOlsiaHR0cHM6Ly9zdGFja3JveC5pby9qd3Qtc291cmNlcyNhcGktdG9rZW5zIl0sImV4cCI6MTcwNDI5MDczNCwiaWF0IjoxNjcyNzU0NzM0LCJpc3MiOiJodHRwczovL3N0YWNrcm94LmlvL2p3dCIsImp0aSI6IjhjNzkwNWUxLTcyNDUtNGE0NS04OTUyLWM0NDFkNGVmZTY2NyIsIm5hbWUiOiJERVZfVE9LRU4iLCJyb2xlcyI6WyJBZG1pbiJdfQ.IHktrDUcda3zbByd9mkDCaYqBNDNEpVzwykRcPIcBu3On4Q8SqI5vmeyOYuaLH4CgdLPgt3i3Cq29UvWpUKxANCZfG3UeZeYFAe9KXg-mi1QqpZaguuCcuS936h2yG0UMMplf3TgIHaEXml5Iwfnx-gIp0MFIWm1ipBB-yvDKC_UneBaXcJjapqqh2k-6kBzo3CjFjyuVJJ_-2IH1RxkLRYRWNK41jb6-oj550lYV4bEwEBI5q7UgW5VgQhFhLVcqE_4QQ6BMDFv0zpp6cO0ThZOPKtWtSPb5cZebZFL3x-Q9e_adUOFo0BSFZs5yDK3VFjtDuVPQ5OxrYL10xr0e-AAr8qjZJk4xP9A7XQWjN38sqN3sZluh8CzLX-j67mP0OeuGubNlk-vy5REg71wULqflrpXDO575eLK8ub_08xRJQwkBmCEBjIYi9etEyBSaPeTg2j0gZbJlvowTK7cIIaYPrwdgHudTQUynzftBm916WLfRgjUNMKp-hHtAJrZgXlxLkhGH_ubvpjEnPE51kxHXLLvyh5PztMmkhpq0Z1sdcvYfsdkSEzZvPUENifY_OJVeObJ7Gq0pow6PtH-JoaoBGvPjB2lxq5OQ4OatP4cYCzGLtLvYRS_-ME72cr4BQaw7XMpSiFGfKMTPNKGgGtiLtyUxuzbwdqKuZmq6og';

    const config = {
      baseURL: `https://central-rhacs-operator.${baseUrl}`,
      headers: {
        'Authorization': `Bearer ${rhacsApiToken}`
      },
      method: 'get',
      ...requestConfig
    } as AxiosRequestConfig;

    const res = await instance.request(config)
    return res.data

  } catch(err) {
    throw new Error(`request() - ${err}`)
  }
}

export async function getViolationSummary(configApi: ConfigApi) {
  try {
    const response = await request(configApi, {
      url: '/v1/alerts/summary/counts'
    });
    return response
  } catch(err) {
    throw new Error(err)
  }
}
