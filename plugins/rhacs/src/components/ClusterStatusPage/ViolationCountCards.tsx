// @ts-nocheck

import React, {createContext, useContext, useEffect, useState} from 'react';
import {
  Button,
  ItemCardHeader,
  ItemCardGrid,
} from '@backstage/core-components';
import {
  Grid,
  Typography,
  CardContent,
  CardMedia,
  Card,
  CardActions, makeStyles,
} from '@material-ui/core';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import useDebounce from 'react-use/lib/useDebounce';

import { getViolationSummary } from "../../helpers/requests";

import { configApiRef, useApi} from "@backstage/core-plugin-api";

const response = {
  "groups": [
    {
      "group": "",
      "counts": [
        {
          "severity": "LOW_SEVERITY",
          "count": "215"
        },
        {
          "severity": "MEDIUM_SEVERITY",
          "count": "157"
        },
        {
          "severity": "HIGH_SEVERITY",
          "count": "155"
        },
        {
          "severity": "CRITICAL_SEVERITY",
          "count": "2"
        }
      ]
    }
  ]
}

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

const centralEndpoint='https://central-rhacs-operator.itzroks-671000wmfn-8vdu9o-6ccd7f378ae819553d37d5f2ee142bd6-0000.au-syd.containers.appdomain.cloud'

const useStyles = makeStyles(styles);

export const ViolationCountCards = () => {
  const configApi = useApi(configApiRef);
  const classes = useStyles();

  const [summary, setSummary] = useState<>([]);

  const [{ loading, error }, refresh] = useAsyncFn(
    async() => {
      const response = await getViolationSummary(configApi);
      // const data = response.groups[0].counts

      // if (!data) {
      //   return null;
      // }

      console.log(response)
      setSummary(response.data.groups[0].counts)
    }
  );

  useDebounce(refresh, 10);

  if (error) {
    console.log(error)
  }

  //
  // useEffect(() => {
  //   const res = getViolationSummary(configApi)
  //   console.log(res)
  // })

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
              <Button color="primary" to={`${centralEndpoint}/main/violations?s[Severity]=${value.severity}`}>
                Details
              </Button>
            </CardActions>
          </Card>
        ))}
      </ItemCardGrid>
    </Grid>
  )
}
