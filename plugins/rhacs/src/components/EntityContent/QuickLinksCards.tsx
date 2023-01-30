import React, { useContext } from 'react';
import { ItemCardHeader, ItemCardGrid, Link } from '@backstage/core-components';
import { Grid, Typography, CardMedia, Card } from '@material-ui/core';

export const QuickLinksCards = () => {
  return (
    <ItemCardGrid>
      <Card key="centralEndpoint">
        <Link to="http://google.com">
          <CardMedia>
            <ItemCardHeader title="RHACS Image Report >" />
          </CardMedia>
        </Link>
      </Card>
    </ItemCardGrid>
  );
};
