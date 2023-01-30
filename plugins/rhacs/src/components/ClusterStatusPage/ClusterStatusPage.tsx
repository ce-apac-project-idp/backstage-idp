import React, { createContext, useEffect, useState } from 'react';

import { SearchContextProvider } from '@backstage/plugin-search-react';
import {
  Page,
  Header,
  HeaderLabel,
  HeaderTabs,
  Content,
} from '@backstage/core-components';

import { ViolationCountCards } from './ViolationCountCards';
import { RecentAlertsCard } from './RecentAlertsCard'
import { QuickLinksCards } from './QuickLinksCards';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { getCentralEndpoint } from '../../helpers/requests';


export const RhacsContext = createContext({
  centralEndpoint: 'https://',
});

export const ClusterStatusPage = () => {
  const configApi = useApi(configApiRef);

  const [selectedTab, setSelectedTab] = useState<number>(2);
  const [central, setCentral] = useState('');

  useEffect(() => {
    (async () => {
      const centralEndpoint = await getCentralEndpoint(configApi);
      setCentral(`https://${centralEndpoint}`);
    })();
  }, [configApi]);

  return (
    <SearchContextProvider>
      <Page themeId="rhacs-dashboard">
        <Header title="RHACS Summary">
          <HeaderLabel label="Owner" value="ce-apac" />
          <HeaderLabel label="Lifecycle" value="experimental" />
        </Header>
        <HeaderTabs
          selectedIndex={selectedTab}
          onChange={index => setSelectedTab(index)}
          tabs={[
            {
              id: '1',
              label: 'overview',
            },
          ]}
        />
        <RhacsContext.Provider value={{ centralEndpoint: central }}>
          <Content>
            <ViolationCountCards />
            <br />
            <RecentAlertsCard />
            <QuickLinksCards />
          </Content>
        </RhacsContext.Provider>
      </Page>
    </SearchContextProvider>
  );
};

export default ClusterStatusPage;
