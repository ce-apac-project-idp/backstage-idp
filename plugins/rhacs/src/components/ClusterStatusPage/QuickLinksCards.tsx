import React, { useContext } from 'react';
import { ItemCardHeader, ItemCardGrid, Link } from '@backstage/core-components';
import { Grid, Typography, CardMedia, Card } from '@material-ui/core';
import { RhacsContext } from './ClusterStatusPage';

export const QuickLinksCards = () => {
  const context = useContext(RhacsContext);

  return (
    <Grid>
      <p />
      <Typography variant="h3"> Quick Links </Typography>
      <ItemCardGrid>
        <Card key="centralEndpoint">
          <Link to={context.centralEndpoint}>
            <CardMedia>
              <ItemCardHeader title="RHACS Console >" />
            </CardMedia>
          </Link>
        </Card>
      </ItemCardGrid>
    </Grid>
  );
};
