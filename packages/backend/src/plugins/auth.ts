import {
  createRouter,
  getDefaultOwnershipEntityRefs,
  providers,
  defaultAuthProviderFactories,
} from '@backstage/plugin-auth-backend';
import { Router } from 'express';
import {
  DEFAULT_NAMESPACE,
  Entity,
  EntityRelation,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { PluginEnvironment } from '../types';

/**
 * It's better to use plural from for group name in Backstage
 * because 'owner' of an entity does not distinguish between user and group.
 *
 * For now, it only cares admin/developer
 */
function pluralizeGroupIds(groupsIds: string[] | undefined) {
  if (!groupsIds || !groupsIds.length) {
    return [];
  }

  return groupsIds.map(id => {
    if (id === 'admin') {
      return 'admins';
    } else if (id === 'developer') {
      return 'developers';
    }
    return id.replace(/ /g, '');
  });
}

function generateRelations(groupIds: string[]) {
  const relations: EntityRelation[] = [];
  groupIds.forEach(id => {
    relations.push({
      type: 'memberOf',
      targetRef: `group:default/${id}`,
    });
  });
  return relations;
}

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
        authHandler: async oidcResult => {
          /**
           * oidcResult {tokenset, userinfo}
           */
          const {
            userinfo: { email, email_verified, displayName },
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
            },
          };
        },
        signIn: {
          async resolver({ result, profile }, ctx) {
            /**
             * result // info from IBM verify
             * profile // profile from authHandler to be used for frontend
             */
            const { userinfo } = result;

            if (!profile.email) {
              throw new Error(
                'Login failed, user profile does not contain an email',
              );
            }

            const groupIds = pluralizeGroupIds(userinfo.groupIds as string[]);

            const userEntity = {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'User',
              metadata: {
                name: profile.email,
                namespace: DEFAULT_NAMESPACE,
                annotations: {
                  'ibm-verify/email': profile.email,
                  'ibm-verify/name': userinfo.name,
                  'ibm-verify/sub': userinfo.sub,
                },
              },
              spec: {
                profile,
                memberOf: groupIds,
              },
              // explicit relations as this user entity won't be on Backstage
              relations: generateRelations(groupIds),
            } as Entity;

            const ownershipRefs = getDefaultOwnershipEntityRefs(userEntity);

            return ctx.issueToken({
              claims: {
                sub: stringifyEntityRef(userEntity), // The user's identity
                ent: ownershipRefs, // A list of identities that the user claims ownership through
              },
            });
          },
        },
      }),
    },
  });
}
