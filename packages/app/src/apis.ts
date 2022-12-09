import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
  ScmAuth,
} from '@backstage/integration-react';
import {
  configApiRef,
  discoveryApiRef,
  oauthRequestApiRef,
  createApiFactory,
  createApiRef,
  ApiRef,
  AnyApiFactory,
  OpenIdConnectApi,
  ProfileInfoApi,
  BackstageIdentityApi,
  SessionApi,
} from '@backstage/core-plugin-api';
import { OAuth2 } from '@backstage/core-app-api'

/**
 * TODO: move this to plugin
 */
export const ibmOIDCAuthApiRef: ApiRef<
  OpenIdConnectApi &      // to handle authentication
  ProfileInfoApi &        // to request user profile to IBM Verify
  BackstageIdentityApi &  // to associate the user profile with backstage identity
  SessionApi              // to handle session
  > = createApiRef({
  id: 'auth.ibm-verify-oidc-provider',
});

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }),
  ScmAuth.createDefaultApiFactory(),

  /**
   * TODO: move this to plugin
   */
  createApiFactory({
    api: ibmOIDCAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({discoveryApi, oauthRequestApi, configApi}) =>
      OAuth2.create({
        discoveryApi,
        oauthRequestApi,
        provider: {
          id: 'ibm-verify-oidc-provider',
          title: 'IBM Security Verify as authentication provider',
          icon: () => null,
        },
        environment: configApi.getOptionalString('auth.environment'),
        defaultScopes: [
          'openid',
          'profile',
          'email',
          'phone'
        ]
      })
  })
];
