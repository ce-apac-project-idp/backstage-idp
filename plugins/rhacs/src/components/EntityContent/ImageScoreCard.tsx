import React, { useContext } from 'react';
import { InfoCard, Button } from '@backstage/core-components';
import {
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';

import { RhacsContext } from './EntityRhacsContent';

export function ImageScoreCard() {
  const { image } = useContext(RhacsContext);

  if (!image || !image.id) {
    return <CircularProgress />;
  }

  return (
    <InfoCard title="Image Scores">
      <List>
        <ListItem>
          <ListItemText>
            <b> Priority </b>{' '}
          </ListItemText>
          <Button color="secondary" variant="contained" to="">
            {image.priority}
          </Button>
        </ListItem>

        <ListItem>
          <ListItemText>
            <b> Top CVSS </b>{' '}
          </ListItemText>
          <Button color="secondary" variant="outlined" to="">
            {image.topCvss}
          </Button>
        </ListItem>

        <ListItem>
          <ListItemText>
            <b> Risk Score </b>{' '}
          </ListItemText>
          <Button color="default" variant="outlined" to="">
            {image.riskScore}
          </Button>
        </ListItem>

        <ListItem>
          <ListItemText>
            <b> CVEs </b>{' '}
          </ListItemText>
          <Button color="default" variant="outlined" to="">
            {image.cves}
          </Button>
        </ListItem>
      </List>
    </InfoCard>
  );
}
