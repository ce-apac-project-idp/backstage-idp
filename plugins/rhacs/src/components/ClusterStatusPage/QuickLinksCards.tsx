import React from 'react';
import {
  ItemCardHeader,
  ItemCardGrid,
  Link,
} from '@backstage/core-components';
import {
  Grid,
  Typography,
  CardMedia,
  Card,
} from '@material-ui/core';

const centralEndpoint='https://central-rhacs-operator.itzroks-671000wmfn-8vdu9o-6ccd7f378ae819553d37d5f2ee142bd6-0000.au-syd.containers.appdomain.cloud'

export const QuickLinksCards = () => {
  return (
    <Grid>
      <p />
      <Typography variant="h3"> Quick Links </Typography>
      <ItemCardGrid>
        <Card key={"centralEndpoint"}>
          <Link to={centralEndpoint}>
            <CardMedia>
              <ItemCardHeader title={"RHACS Console >"} />
            </CardMedia>
          </Link>
        </Card>
      </ItemCardGrid>
    </Grid>
  )
}
