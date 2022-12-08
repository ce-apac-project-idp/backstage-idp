/*

import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import LayoutWrapper from './shared/LayoutWrapper';
import {
  EntityConsumedApisCard,
  EntityProvidedApisCard,
} from '@backstage/plugin-api-docs';
import {
  EntityDependsOnComponentsCard,
  EntityDependsOnResourcesCard,
  EntityHasSubcomponentsCard,
  EntityLayout,
  EntitySwitch,
} from '@backstage/plugin-catalog';
import {
  isGithubActionsAvailable,
  EntityGithubActionsContent,
} from '@backstage/plugin-github-actions';
import { EntityTechdocsContent } from '@backstage/plugin-techdocs';
import {
  Direction,
  EntityCatalogGraphCard,
} from '@backstage/plugin-catalog-graph';
import {
  EntityArgoCDOverviewCard,
  isArgocdAvailable,
} from '@roadiehq/backstage-plugin-argo-cd';
import { EntityGithubInsightsContent } from '@roadiehq/backstage-plugin-github-insights';
import {
  DependabotAlertsWidget,
  EntitySecurityInsightsContent,
  SecurityInsightsWidget,
} from '@roadiehq/backstage-plugin-security-insights';
import { EntityPrometheusAlertCard } from '@roadiehq/backstage-plugin-prometheus';
import { EntityAdrContent, isAdrAvailable } from '@backstage/plugin-adr';
import { EntityKubernetesContent } from '@backstage/plugin-kubernetes';
import OverviewWrapper from './shared/OverviewWrapper';
import { HorizontalScrollGrid, StatusOK } from '@backstage/core-components';
import StatusCard from './shared/StatusCard';
import { hasLinks, isType } from './shared/utils';

import DeploymentStatusCard from '../DeploymentStatusCard/DeploymentStatusCard';
import LinkTiles from '../LinkTiles/LinkTiles';

const component = (
  <LayoutWrapper>
    <EntityLayout.Route path="/" title="Overview">
      <OverviewWrapper>
        <Grid item xs={12}>
          <Typography variant="h4" component="h2">
            Component metrics
          </Typography>
          <Typography variant="body1">
            Basic indicators of component health and scorecards
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <HorizontalScrollGrid>
            <StatusCard
              title="CI/CD"
              deepLink={{ title: 'View more', link: 'ci-cd' }}
            >
              <Typography variant="h1" component="div">
                <StatusOK />
              </Typography>
              <Typography variant="subtitle2" component="div">
                Healthy, synced and passing
              </Typography>
            </StatusCard>
            <StatusCard
              title="Security issues"
              deepLink={{ title: 'View more', link: 'security-insights' }}
            >
              <Typography variant="h1" component="div">
                0
              </Typography>
              <Typography variant="subtitle2" component="div">
                No issues found
              </Typography>
            </StatusCard>
            <EntitySwitch>
              <EntitySwitch.Case if={isType(['service', 'operator'])}>
                <DeploymentStatusCard />
                <StatusCard
                  title="Alerts"
                  deepLink={{ title: 'View more', link: 'kubernetes' }}
                >
                  <Typography variant="h1" component="div">
                    0
                  </Typography>
                  <Typography variant="subtitle2" component="div">
                    No alerts firing
                  </Typography>
                </StatusCard>
              </EntitySwitch.Case>
            </EntitySwitch>
            <div style={{ margin: 12, minWidth: 400 }}>
              <DependabotAlertsWidget />
            </div>
            <div style={{ margin: 12, minWidth: 311, display: 'flex' }}>
              <SecurityInsightsWidget />
            </div>
          </HorizontalScrollGrid>
        </Grid>
        <EntitySwitch>
          <EntitySwitch.Case if={hasLinks}>
            <Grid item xs={12}>
              <Typography variant="h4" component="h2">
                Quick actions
              </Typography>
              <Typography variant="body1">
                Self service, quick access and links to learn more about this
                component
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <LinkTiles />
            </Grid>
          </EntitySwitch.Case>
        </EntitySwitch>
      </OverviewWrapper>
    </EntityLayout.Route>

    <EntityLayout.Route path="/ci-cd" title="CI/CD">
      <Grid container>
        <EntitySwitch>
          <EntitySwitch.Case if={isArgocdAvailable}>
            <Grid item xs={12}>
              <EntityArgoCDOverviewCard />
            </Grid>
          </EntitySwitch.Case>
        </EntitySwitch>
        <EntitySwitch>
          <EntitySwitch.Case if={isGithubActionsAvailable}>
            <Grid item xs={12}>
              <EntityGithubActionsContent />
            </Grid>
          </EntitySwitch.Case>
        </EntitySwitch>
      </Grid>
    </EntityLayout.Route>

    <EntityLayout.Route
      if={isType(['service', 'operator'])}
      path="/kubernetes"
      title="Openshift"
    >
      <EntityKubernetesContent refreshIntervalMs={30000} />
    </EntityLayout.Route>

    <EntityLayout.Route path="/security-insights" title="Security Insights">
      <EntitySecurityInsightsContent />
    </EntityLayout.Route>

    <EntityLayout.Route path="/code-insights" title="Code Insights">
      <EntityGithubInsightsContent />
    </EntityLayout.Route>

    <EntityLayout.Route path="/docs" title="Docs">
      <EntityTechdocsContent />
    </EntityLayout.Route>

    <EntityLayout.Route if={isAdrAvailable} path="/adrs" title="ADRs">
      <EntityAdrContent />
    </EntityLayout.Route>

    <EntityLayout.Route path="/relations" title="Relations">
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} md={6} container spacing={3} alignItems="stretch">
          <Grid item xs={12}>
            <EntityDependsOnComponentsCard variant="gridItem" />
          </Grid>
          <Grid item xs={12}>
            <EntityDependsOnResourcesCard variant="gridItem" />
          </Grid>
          <Grid item xs={12}>
            <EntityHasSubcomponentsCard variant="gridItem" />
          </Grid>
          <Grid item xs={12}>
            <EntityProvidedApisCard />
          </Grid>
          <Grid item xs={12}>
            <EntityConsumedApisCard />
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <EntityCatalogGraphCard
            variant="gridItem"
            direction={Direction.TOP_BOTTOM}
            height={900}
          />
        </Grid>
      </Grid>
    </EntityLayout.Route>
    <EntityLayout.Route path="/monitoring" title="Monitoring">
      <EntityPrometheusAlertCard />
    </EntityLayout.Route>
  </LayoutWrapper>
);

export default component;

*/
export {}
