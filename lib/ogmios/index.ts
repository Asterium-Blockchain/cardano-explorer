import {
  createInteractionContext,
  createStateQueryClient,
  InteractionContext,
} from '@cardano-ogmios/client';

const context: InteractionContext = await createInteractionContext(
  (err) => {
    // TODO: Handle ogmios error
  },
  () => {
    // TODO: Handle closing
  },
  {
    connection: {
      port: process.env.OGMIOS_PORT ? JSON.parse(process.env.OGMIOS_PORT) : 443,
      host: process.env.OGMIOS_HOST || 'ogmios-api.mainnet.dandelion.link',
      tls: process.env.OGMIOS_USE_TLS !== 'False',
    },
  },
);

const stateQueryClient = await createStateQueryClient(context);

export { stateQueryClient };
