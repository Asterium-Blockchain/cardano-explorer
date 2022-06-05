import * as k8s from '@pulumi/kubernetes';
import * as gcp from '@pulumi/gcp';
import * as postgresql from '@pulumi/postgresql';
import { Config } from '../config';
import { carpVolumes } from './volumes';
import { carpIndexer } from './indexer';

type CarpModuleArgs = {
  provider: k8s.Provider;
  pgProvider: postgresql.Provider;
  pool: gcp.container.NodePool;
  cardanoNodeService: k8s.core.v1.Service;
};

export const carpModule = (args: CarpModuleArgs) => {
  const { provider, pgProvider, pool, cardanoNodeService } = args;

  const name = `${Config.name}-carp`;
  const namespace = new k8s.core.v1.Namespace(
    'carp-namespace',
    {
      metadata: {
        name,
      },
    },
    { provider }
  );

  const database = new postgresql.Database(
    'carp-database',
    {
      name: Config.carp.database,
      allowConnections: true,
      owner: Config.postgresql.username,
    },
    { provider: pgProvider }
  );

  const volumes = carpVolumes({
    base: name,
    namespace: name,
    provider,
  });

  const service = carpIndexer({
    base: name,
    namespace: name,
    pool,
    provider,
    pgProvider,
    volumes,
    cardanoNodeService,
  });

  return {
    namespace,
    database,
    service,
  };
};
