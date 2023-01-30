import React, { createContext, useEffect, useState } from 'react';
import {
  Page,
  Content,
  Link,
} from '@backstage/core-components';
import {
  Grid,
} from '@material-ui/core';

import { configApiRef, useApi } from '@backstage/core-plugin-api';

import { RiskiestComponentsCard } from "./RiskiestComponents";
import { CvesCard } from "./CvesCard";
import { ImageDetailCard } from "./ImageDetailCard";
import { QuickLinksCards } from "./QuickLinksCards";
import { getCentralEndpoint } from '../../helpers/requests';


export const RhacsContext = createContext({
  centralEndpoint: 'https://',
});

export const EntityRhacsContent = () => {
  const configApi = useApi(configApiRef);
  const [central, setCentral] = useState('');

  useEffect(() => {
    (async () => {
      const centralEndpoint = await getCentralEndpoint(configApi);
      setCentral(`https://${centralEndpoint}`);
    })();
  }, [configApi]);

  return (
    <Page themeId="rhacs-entity">
      <RhacsContext.Provider value={{ centralEndpoint: central }}>
        <Content>
          <Grid container direction="row" >
              <Grid item xs={12}>
                <QuickLinksCards />
              </Grid>

              <Grid item xs={5}>
                <ImageDetailCard />
              </Grid>

              <Grid item>
                <CvesCard />
              </Grid>

              <Grid item xs={5}>
                <RiskiestComponentsCard />
              </Grid>

          </Grid>
        </Content>
      </RhacsContext.Provider>
    </Page>
  );
};

export default EntityRhacsContent;
