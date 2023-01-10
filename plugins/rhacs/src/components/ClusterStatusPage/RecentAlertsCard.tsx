import React, { useContext, useState } from 'react';
import {
  WarningPanel,
  Table,
  Link,
  StatusError,
  TableColumn,
} from '@backstage/core-components';
import {
  Grid,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import useDebounce from 'react-use/lib/useDebounce';

import { RhacsAlert, getRecentAlerts } from '../../helpers/requests';

import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { RhacsContext } from './ClusterStatusPage';

const columns: TableColumn[] = [
  {
    title: 'Severity',
    field: 'severity',
    cellStyle: {
      width: "1%",
      color: "red"
    },
  },
  {
    title: 'Policy',
    field: 'policy',
    cellStyle: {
      width: "30%",
    },
  },
  {
    title: 'Cluster',
    field: 'cluster',
    type: 'string',
    cellStyle: {
    },
  },
  {
    title: 'Deployment',
    field: 'deploy',
    type: 'string',
    cellStyle: {
    },
  },
  {
    title: 'Time',
    field: 'time',
    type: 'datetime',
    cellStyle: {
    },
  },
];

type RefinedAlert = {
  time: string
  cluster: string
  deploy: string
  policy: JSX.Element
  severity: JSX.Element
}


export const RecentAlertsCard = () => {
  const configApi = useApi(configApiRef);
  const context = useContext(RhacsContext);

  const [alerts, setAlerts] = useState<RefinedAlert[]>(
    [],
  );

  function refineData(data: RhacsAlert[]): RefinedAlert[] {
    return data.map(alert => {
      return {
        time: alert.time,
        cluster: alert.deployment.clusterName,
        deploy: alert.deployment.name,
        policy: <Link to={`${context.centralEndpoint}/main/violations/${alert.id}`}> {alert.policy.name} </Link>,
        severity: <StatusError> Critical </StatusError>,
      }
    })
  }

  const [{ loading, error }, refresh] = useAsyncFn(
    async () => {
      const data = await getRecentAlerts(configApi);
      setAlerts(refineData(data));
    },
    [],
    { loading: true },
  );

  useDebounce(refresh, 10);

  if (error) {
    return (
      <WarningPanel severity="warning" title={`Oops: ${error.toString()}`} />
    );
  }

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Grid>
      <Typography variant="h3"> Most recent violations with critical severity</Typography>
      <Table
        options={{ paging: false }}
        data={alerts}
        columns={columns}
        title=""
      />
    </Grid>
  );
};
