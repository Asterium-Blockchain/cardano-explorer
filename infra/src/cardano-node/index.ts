import * as gcp from '@pulumi/gcp';
import * as k8s from '@pulumi/kubernetes';
import { Config } from '../config';
import { cardanoNodeService } from './service';
import { cardanoNodeVolumes } from './volumes';

type CardanoNodeModuleArgs = {
  provider: k8s.Provider;
  pool: gcp.container.NodePool;
};

export const cardanoNodeModule = (args: CardanoNodeModuleArgs) => {
  const { provider, pool } = args;

  const name = Config.cardanoNode.name;
  const namespace = new k8s.core.v1.Namespace(
    'cardano-node-namespace',
    {
      metadata: {
        name,
      },
    },
    { provider }
  );

  const volumes = cardanoNodeVolumes({
    base: name,
    namespace: name,
    provider,
  });

  const service = cardanoNodeService({
    namespace: name,
    volumes,
    pool,
    provider,
  });

  return {
    namespace,
    volumes,
    service,
  };
};
