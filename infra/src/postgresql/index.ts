import * as k8s from '@pulumi/kubernetes';
import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import * as postgresql from '@pulumi/postgresql';
import { Config } from '../config';

type PostgresqlModuleArgs = {
  provider: k8s.Provider;
  pool: gcp.container.NodePool;
};

export const postgresqlModule = (args: PostgresqlModuleArgs) => {
  const { provider, pool } = args;

  const name = Config.postgresql.name;
  const namespace = new k8s.core.v1.Namespace(
    'postgresql-namespace',
    {
      metadata: {
        name,
      },
    },
    { provider }
  );

  const release = new k8s.helm.v3.Release(
    'postgresql',
    {
      namespace: namespace.metadata.name,
      chart: 'postgresql',
      version: '0.2.3',
      repositoryOpts: {
        repo: 'https://cetic.github.io/helm-charts',
      },
      skipAwait: false,
      values: {
        postgresql: {
          username: Config.postgresql.username,
          password: Config.postgresql.password,
          database: Config.postgresql.database,
        },
        service: {
          name: name,
          type: 'LoadBalancer',
        },
        persistence: {
          enabled: true,
          size: '256Gi',
          accessModes: ['ReadWriteOnce'],
        },
        resources: {
          requests: {
            cpu: '1000m',
            memory: '4Gi',
          },
        },
        nodeSelector: {
          'cloud.google.com/gke-nodepool': pool.name,
        },
      },
    },
    { provider }
  );

  const service = k8s.core.v1.Service.get(
    'postgresql',
    pulumi.interpolate`${release.status.namespace}/${release.status.name}`
  );

  const pgProvider = new postgresql.Provider(
    'postgresql-provider',
    {
      host: service.status.loadBalancer.ingress[0].ip,
      database: Config.postgresql.database,
      databaseUsername: Config.postgresql.username,
      username: Config.postgresql.username,
      password: Config.postgresql.password,
      maxConnections: 0,
      sslmode: 'disable',
    },
    {
      dependsOn: [release],
    }
  );

  return {
    release,
    service,
    provider: pgProvider,
  };
};
