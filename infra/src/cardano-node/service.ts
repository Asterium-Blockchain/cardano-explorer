import * as k8s from '@pulumi/kubernetes';
import * as gcp from '@pulumi/gcp';
import { Config } from '../config';

type cardanoNodeServiceArgs = {
  namespace: string;
  pool: gcp.container.NodePool;
  provider: k8s.Provider;
  volumes: {
    data: k8s.core.v1.PersistentVolumeClaim;
    ipc: k8s.core.v1.PersistentVolumeClaim;
  };
};

export const cardanoNodeService = (args: cardanoNodeServiceArgs) => {
  const { namespace, pool, provider, volumes } = args;

  const name = Config.cardanoNode.service;
  const labels = {
    app: name,
  };
  const statefulset = new k8s.apps.v1.StatefulSet(
    'cardano-node-statefulset',
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
                name: volumes.data.metadata.name,
                persistentVolumeClaim: {
                  claimName: volumes.data.metadata.name,
                },
              },
              {
                name: volumes.ipc.metadata.name,
                persistentVolumeClaim: {
                  claimName: volumes.ipc.metadata.name,
                },
              },
            ],
            containers: [
              {
                name: name,
                image: `inputoutput/cardano-node:${Config.cardanoNode.version}`,
                ports: [
                  {
                    containerPort: 3000,
                  },
                ],
                volumeMounts: [
                  {
                    name: volumes.data.metadata.name,
                    mountPath: '/data',
                  },
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
                ],
                resources: {
                  requests: {
                    cpu: '2000m',
                    memory: '12Gi',
                  },
                },
              },
              {
                name: `${name}-socket`,
                image: `alpine/socat:${Config.socat.version}`,
                args: [
                  '-v',
                  `TCP-LISTEN:${Config.socat.port},reuseaddr,fork`,
                  'UNIX-CONNECT:/ipc/node.socket',
                ],
                ports: [
                  {
                    containerPort: Config.socat.port,
                  },
                ],
                volumeMounts: [
                  {
                    name: volumes.ipc.metadata.name,
                    mountPath: '/ipc',
                  },
                ],
              },
            ],
          },
        },
      },
    },
    { provider }
  );

  const service = new k8s.core.v1.Service(
    'cardano-node-service',
    {
      metadata: {
        name: name,
        labels,
        namespace,
      },
      spec: {
        selector: labels,
        type: 'ClusterIP',
        ports: [
          {
            protocol: 'TCP',
            port: Config.socat.port,
            targetPort: Config.socat.port,
          },
        ],
      },
    },
    { provider }
  );

  return {
    statefulset,
    service,
  };
};
