import { createTemplateAction } from '@backstage/plugin-scaffolder-backend';
import { assertError } from '@backstage/errors';

export const triggerCRPipelineAction = () => {
  return createTemplateAction<{ repoURL: string; developerName: string; targetEnv: 'AWS' | 'Azure'; applicationName: string }>({
    id: 'ibm:call-cr-pipeline',
    schema: {
      input: {
        required: ['repoURL','developerName' , 'targetEnv', 'applicationName'],
        type: 'object',
        properties: {
        repoURL: {
            type: 'string',
             title: 'Target repo URL',
             description: 'The URL of the repo containing your Custom Resources',
              },
         developerName: {
            type: 'string',
            title: 'Developer Name',
            description: 'The developer name to associate resources with'
         },
          targetEnv: {
            type: 'string',
            enum: ['AWS', 'Azure'],
            title: 'Target Environment',
            description: 'The Cloud Environment to Deploy in',
          },
          applicationName: {
            type: 'string',
            title: 'Deployed Application Name',
            description: 'The name for the deployed application',
          },
        },
      },
    },
    async handler(ctx) {

        ctx.logger.info(`Calling build pipeline`)

        const pipelineEndpoint = 'http://el-backstage-cr-test-el-backstage.itzroks-666000qmn3-1jtmzt-6ccd7f378ae819553d37d5f2ee142bd6-0000.au-syd.containers.appdomain.cloud'

        const data = {
            'applicationName': ctx.input.applicationName,
            'targetEnv': ctx.input.targetEnv,
            'repoURL' : ctx.input.repoURL,
            'developerName': ctx.input.developerName
        };

        try {
            await fetch(pipelineEndpoint, {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                body: JSON.stringify(data)
    
            })

            ctx.logger.info(`Pipeline build started successfully`)
        } catch (e) {

            assertError(e)
            
            ctx.logger.warn(`Failed to start build pipeline for deployment ${ctx.input.applicationName}: ${e.message}`)

        };
    },
  });
};