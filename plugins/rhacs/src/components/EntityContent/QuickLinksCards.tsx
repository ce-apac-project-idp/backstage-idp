import React, { useContext } from 'react';
import { ItemCardHeader, ItemCardGrid, Link } from '@backstage/core-components';
import { CardMedia, Card } from '@material-ui/core';
import { RhacsContext } from './EntityRhacsContent';

export const QuickLinksCards = () => {
  const context = useContext(RhacsContext);

  return (
    <ItemCardGrid>
      <Card key="centralEndpoint">
        <Link
          to={`${context.centralEndpoint}/main/vulnerability-management/image/${context.imageSha}`}
        >
          <CardMedia>
            <ItemCardHeader title="RHACS Image Report >" />
          </CardMedia>
        </Link>
      </Card>
    </ItemCardGrid>
  );
};
