import { createTemplateAction } from '@backstage/plugin-scaffolder-backend';
import { assertError } from '@backstage/errors';

export const triggerBuildPipelineAction = () => {
  return createTemplateAction<{ targetEnv: 'AWS' | 'Azure'; deploymentName: string }>({
    id: 'ibm:call-build-pipeline',
    schema: {
      input: {
        required: ['targetEnv', 'deploymentName'],
        type: 'object',
        properties: {
          targetEnv: {
            type: 'string',
            enum: ['AWS', 'Azure'],
            title: 'Target Environment',
            description: 'The Cloud Environment to Deploy in',
          },
          deploymenName: {
            type: 'string',
            title: 'Deployed Resource Name',
            description: 'The name for the deployed Resource',
          },
        },
      },
    },
    async handler(ctx) {

        ctx.logger.info(`Calling build pipeline`)

        const pipelineEndpoint = 'http://el-backstage-test-el-backstage.itzroks-666000qmn3-1jtmzt-6ccd7f378ae819553d37d5f2ee142bd6-0000.au-syd.containers.appdomain.cloud'

        const data = {
            'deploymentName': ctx.input.deploymentName,
            'targetEnv': ctx.input.targetEnv
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
            
            ctx.logger.warn(`Failed to start build pipeline for deployment ${ctx.input.deploymentName}: ${e.message}`)

        };
    },
  });
};