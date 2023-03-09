import {
  createRouter,
  providers,
  defaultAuthProviderFactories,
  ProfileInfo,
} from '@backstage/plugin-auth-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import {
  DEFAULT_NAMESPACE,
  Entity,
  stringifyEntityRef,
} from '@backstage/catalog-model';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    discovery: env.discovery,
    tokenManager: env.tokenManager,
    providerFactories: {
      ...defaultAuthProviderFactories,

      // This replaces the default GitHub auth provider with a customized one.
      // The `signIn` option enables sign-in for this provider, using the
      // identity resolution logic that's provided in the `resolver` callback.
      //
      // This particular resolver makes all users share a single "guest" identity.
      // It should only be used for testing and trying out Backstage.
      //
      // If you want to use a production ready resolver you can switch to
      // the one that is commented out below, it looks up a user entity in the
      // catalog using the GitHub username of the authenticated user.
      // That resolver requires you to have user entities populated in the catalog,
      // for example using https://backstage.io/docs/integrations/github/org
      //
      // There are other resolvers to choose from, and you can also create
      // your own, see the auth documentation for more details:
      //
      //   https://backstage.io/docs/auth/identity-resolver
      github: providers.github.create({
        signIn: {
          resolver(_, ctx) {
            const userRef = 'user:default/guest'; // Must be a full entity reference
            return ctx.issueToken({
              claims: {
                sub: userRef, // The user's own identity
                ent: [userRef], // A list of identities that the user claims ownership through
              },
            });
          },
          // resolver: providers.github.resolvers.usernameMatchingUserEntityName(),
        },
      }),
      'ibm-verify-oidc-provider': providers.oidc.create({
        authHandler: async (oidcResult, ctx) => {
          /**
           * oidcResult {tokenset, userinfo}
           */
          const {
            userinfo: { email, email_verified, displayName, groupIds, name },
          } = oidcResult;

          if (!email_verified) {
            throw new Error(
              'Email for IBM Verify is not verified. Please setup IBM Verify account first and try again.',
            );
          }

          if (!email) {
            throw new Error(
              'User profile does not contain an email. Is scope set up properly?',
            );
          }

          return {
            profile: {
              email: email as string,
              displayName: displayName as string,
              groupIds: groupIds as string[],
              name: name as string,
            } as ProfileInfo,
          };
        },
        signIn: {
          resolver(info, ctx) {
            /**
             * info {
             *   result // info from IBM verify
             *   profile // profile from authHandler to be used for frontend
             * }
             */
            const {
              result: { userinfo },
            } = info;

            const userEntity = stringifyEntityRef({
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'User',
              metadata: {
                name: userinfo.sub as string,
                namespace: DEFAULT_NAMESPACE,
              },
              spec: {
                displayName: userinfo.displayName as string,
                email: userinfo.email as string,
                memberOf: userinfo.groupIds as string[],
              },
            });

            return ctx.issueToken({
              claims: {
                sub: userEntity, // The user's identity
                ent: [userEntity], // A list of identities that the user claims ownership through
              },
            });
          },
        },
      }),
    },
  });
}
