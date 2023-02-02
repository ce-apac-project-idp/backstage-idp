import React, { createContext, useState, useMemo } from 'react';
import { Page, Content } from '@backstage/core-components';
import { Grid } from '@material-ui/core';

import { configApiRef, useApi } from '@backstage/core-plugin-api';

import { RiskiestComponentsCard } from './RiskiestComponents';
import { ImageSummaryCard } from './imageSummaryCard';
import { ImageScoreCard } from './ImageScoreCard';
import { QuickLinksCards } from './QuickLinksCards';
import {
  getCentralEndpoint,
  getImageContext,
  getImageFromRhacs,
} from '../../helpers/requests';
import { RhacsImage } from '../../helpers/types';

export const RhacsContext = createContext({
  centralEndpoint: '',
  imageReference: '',
  imageSha: '',
  imageOwner: '',
  imageName: '',
  image: {} as RhacsImage.RootObject,
});

export const EntityRhacsContent = () => {
  const configApi = useApi(configApiRef);
  const [context, setContext] = useState<{
    centralEndpoint: string;
    imageReference: string;
    imageSha: string;
    imageOwner: string;
    imageName: string;
    image: RhacsImage.RootObject;
  }>({
    centralEndpoint: '',
    imageReference: '',
    imageSha: '',
    imageOwner: '',
    imageName: '',
    image: {} as RhacsImage.RootObject,
  });

  useMemo(() => {
    (async () => {
      const centralEndpoint = await getCentralEndpoint(configApi);
      let imageInfo = await getImageContext(configApi);

      // TODO: delete this dummy
      if (!imageInfo.imageReference) {
        imageInfo = {
          imageReference: 'registry.redhat.io/rhceph/rhceph-5-rhel8',
          imageSha:
            'sha256:fc25524ccb0ea78526257778ab54bfb1a25772b75fcc97df98eb06a0e67e1bf6',
        };
      }
      const image = await getImageFromRhacs(configApi, imageInfo.imageSha);

      setContext({
        centralEndpoint: `https://${centralEndpoint}`,
        ...imageInfo,
        image,
      });
    })();
  }, [configApi]);

  return (
    <Page themeId="rhacs-entity">
      <RhacsContext.Provider value={context}>
        <Content>
          <Grid container direction="row">
            <Grid item xs={12}>
              <QuickLinksCards />
            </Grid>

            <Grid item xs={5}>
              <ImageSummaryCard />
            </Grid>

            <Grid item xs={3}>
              <ImageScoreCard />
            </Grid>

            <Grid item xs={4}>
              <RiskiestComponentsCard />
            </Grid>
          </Grid>
        </Content>
      </RhacsContext.Provider>
    </Page>
  );
};

export default EntityRhacsContent;
