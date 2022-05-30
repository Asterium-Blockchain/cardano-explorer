import * as k8s from '@pulumi/kubernetes';
import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import * as postgresql from '@pulumi/postgresql';
import { Config } from '../config';

type carpIndexerArgs = {
  base: string;
  namespace: string;
  pool: gcp.container.NodePool;
  provider: k8s.Provider;
  pgProvider: postgresql.Provider;
  volumes: {
    ipc: k8s.core.v1.PersistentVolumeClaim;
  };
  cardanoNodeService: k8s.core.v1.Service;
};

export const carpIndexer = (args: carpIndexerArgs) => {
  const { base, namespace, pool, provider, pgProvider, volumes, cardanoNodeService } = args;

  const name = `${base}-indexer`;
  const labels = {
    app: name,
  };

  const databaseUrl = pulumi.all([pgProvider.host]).apply(([host]) => {
    return `postgresql://${Config.postgresql.username}:${Config.postgresql.password}@${host}:${Config.postgresql.port}/${Config.carp.database}`;
  });

  const cardanoNodeTCP = pulumi.all([cardanoNodeService.spec.clusterIP]).apply(([ip]) => {
    return `TCP-CONNECT:${ip}:${Config.socat.port}`;
  });

  const statefulset = new k8s.apps.v1.StatefulSet(
    'carp-statefulset',
    {
      metadata: {
        name: name,
        labels: labels,
        namespace,
      },
      spec: {
        serviceName: name,
        replicas: 1,
        selector: {
          matchLabels: labels,
        },
        template: {
          metadata: {
            labels,
            namespace,
          },
          spec: {
            nodeSelector: {
              'cloud.google.com/gke-nodepool': pool.name,
            },
            volumes: [
              {
                name: volumes.ipc.metadata.name,
                persistentVolumeClaim: {
                  claimName: volumes.ipc.metadata.name,
                },
              },
            ],
            containers: [
              {
                name: `${name}-socket`,
                image: `alpine/socat:${Config.socat.version}`,
                args: ['-v', `UNIX-LISTEN:/ipc/node.socket,reuseaddr,fork`, cardanoNodeTCP],
                volumeMounts: [
                  {
                    name: volumes.ipc.metadata.name,
                    mountPath: '/ipc',
                  },
                ],
              },
              {
                name: name,
                image: `catrielmuller/carp:latest`,
                command: ['/bin/sh', '-c'],
                args: ['/app/migration up; /app/carp;'],
                ports: [],
                volumeMounts: [
                  {
                    name: volumes.ipc.metadata.name,
                    mountPath: '/ipc',
                  },
                ],
                env: [
                  {
                    name: 'NETWORK',
                    value: Config.cardanoNode.network,
                  },
                  {
                    name: 'SOCKET',
                    value: '/ipc/node.socket',
                  },
                  {
                    name: 'DATABASE_URL',
                    value: databaseUrl,
                  },
                  {
                    name: 'RUST_BACKTRACE',
                    value: 'full',
                  },
                ],
                // resources: {
                //   requests: {
                //     cpu: '500m',
                //     memory: '1Gi',
                //   },
                // },
              },
            ],
          },
        },
      },
    },
    { provider }
  );

  return {
    statefulset,
  };
};
