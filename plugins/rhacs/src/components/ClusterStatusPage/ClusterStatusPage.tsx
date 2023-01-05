// @ts-nocheck

import React, { useState } from 'react';
import { SearchContextProvider } from '@backstage/plugin-search-react';
import {
  Page,
  Header,
  HeaderLabel,
  HeaderTabs,
  Content,
} from '@backstage/core-components';

import { ViolationCountCards } from "./ViolationCountCards"
import { QuickLinksCards } from "./QuickLinksCards"
import { configApiRef, useApi} from "@backstage/core-plugin-api";

export const ClusterStatusPage = () => {
  const configApi = useApi(configApiRef);


  const [selectedTab, setSelectedTab] = useState<number>(2);

  return (
    <SearchContextProvider>
      <Page themeId="rhacs-dashboard">
        <Header title={"RHACS Summary"}>
          <HeaderLabel label="Owner" value="ce-apac" />
          <HeaderLabel label="Lifecycle" value="experimental" />
        </Header>
        <HeaderTabs
          selectedIndex={selectedTab}
          onChange={(index) => setSelectedTab(index)}
          tabs={[{
            id: '1',
            label: 'overview'
          }]}
        />
        <Content>
          <ViolationCountCards />
          {/*<Grid>*/}
          {/*  <div style={containerStyle}>*/}
          {/*    <InfoCard title="RHACS Summary" noPadding>*/}
          {/*      <Table*/}
          {/*        options={{*/}
          {/*          search: false,*/}
          {/*          paging: false,*/}
          {/*          toolbar: false,*/}
          {/*        }}*/}
          {/*        data={data}*/}
          {/*        columns={columns}*/}
          {/*      />*/}
          {/*    </InfoCard>*/}
          {/*  </div>*/}
          {/*</Grid>*/}
          <QuickLinksCards />
        </Content>
      </Page>
    </SearchContextProvider>
  )
}

export default ClusterStatusPage;
