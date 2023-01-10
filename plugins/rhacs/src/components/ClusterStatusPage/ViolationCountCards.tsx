import React, { useContext, useState } from 'react';
import {
  Button,
  ItemCardHeader,
  ItemCardGrid,
  WarningPanel,
} from '@backstage/core-components';
import {
  Grid,
  Typography,
  CardContent,
  CardMedia,
  Card,
  CardActions, makeStyles, CircularProgress,
} from '@material-ui/core';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import useDebounce from 'react-use/lib/useDebounce';

import { getViolationSummary } from "../../helpers/requests";

import { configApiRef, useApi} from "@backstage/core-plugin-api";
import { RhacsContext } from "./ClusterStatusPage";

const styles = {
  low_severity: {
    color: 'black',
    backgroundImage: 'linear-gradient(to bottom right, grey, white)'
  },
  medium_severity: {
    color: 'black',
    backgroundImage: 'linear-gradient(to bottom right, gold, white)'
  },
  high_severity: {
    color: 'black',
    backgroundImage: 'linear-gradient(to bottom right, orange, white)'
  },
  critical_severity: {
    color: 'black',
    backgroundImage: 'linear-gradient(to bottom right, red, pink)'
  }
};

const useStyles = makeStyles(styles);

export const ViolationCountCards = () => {
  const configApi = useApi(configApiRef);
  const classes = useStyles();

  const context = useContext(RhacsContext);

  const [summary, setSummary] = useState<{severity: string, count: string}[]>([]);

  const [{ loading, error }, refresh] = useAsyncFn(
    async() => {
      const data = await getViolationSummary(configApi);
      setSummary(data.groups[0].counts)
    },
    [],
    { loading: true }
  );

  useDebounce(refresh, 10);

  if (error) {
    return (
      <WarningPanel severity="warning" title={"Oops:" + error.toString()}/>
    )
  }

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Grid>
      <Typography variant="h3"> Policy Violations by Severity </Typography>
      <ItemCardGrid>
        {summary.map((value, index) => (
          <Card key={index}>
            <CardMedia>
              <ItemCardHeader
                title={value.severity.split('_')[0]}
                classes={{ root: classes[ value.severity.toLowerCase() as keyof typeof styles ]
              }}
              />
            </CardMedia>
            <CardContent>
              <Typography align="center">
                <Typography variant="h3">{`${value.count}`}</Typography> violations
              </Typography>
            </CardContent>
            <CardActions>
              <Button color="primary" to={`${context.centralEndpoint}/main/violations?s[Severity]=${value.severity}`}>
                Details
              </Button>
            </CardActions>
          </Card>
        ))}
      </ItemCardGrid>
    </Grid>
  )
}
