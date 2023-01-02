import React from 'react';
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


const centralEndpoint = "https://central-rhacs-operator.itzroks-666000qmn3-1jtmzt-6ccd7f378ae819553d37d5f2ee142bd6-0000.au-syd.containers.appdomain.cloud"
const summaryPath = "/v1/alerts/summary/counts"

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

const useStyles = makeStyles({
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
});

export const ViolationCountCards = () => {
  const classes = useStyles();

  // TODO: fetch
  const data = response.groups[0].counts

  if (!data) {
    return null;
  }

  return (
    <Grid>
      <Typography variant="h3"> Policy Violations by Severity </Typography>
      <ItemCardGrid>
        {data.map((value, index) => (
          <Card key={index}>
            <CardMedia>
              <ItemCardHeader
                title={value.severity.split('_')[0]}
                classes={{ root: classes[value.severity.toLowerCase()]
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
