import * as k8s from '@pulumi/kubernetes';

type CardanoNodeVolumesArgs = {
  base: string;
  namespace: string;
  provider: k8s.Provider;
};

export const cardanoNodeVolumes = (args: CardanoNodeVolumesArgs) => {
  const { base, namespace, provider } = args;

  const dataPVCName = `${base}-data-pvc`;
  const dataPVC = new k8s.core.v1.PersistentVolumeClaim(
    'cardano-node-data-pvc',
    {
      metadata: {
        name: dataPVCName,
        namespace,
      },
      spec: {
        accessModes: ['ReadWriteOnce'],
        resources: {
          requests: {
            storage: '100Gi',
          },
        },
      },
    },
    { provider }
  );

  const ipcPVCName = `${base}-ipc-pvc`;
  const ipcPVC = new k8s.core.v1.PersistentVolumeClaim(
    'cardano-node-ipc-pvc',
    {
      metadata: {
        name: ipcPVCName,
        namespace,
      },
      spec: {
        accessModes: ['ReadWriteOnce'],
        resources: {
          requests: {
            storage: '256Mi',
          },
        },
      },
    },
    { provider }
  );

  return {
    data: dataPVC,
    ipc: ipcPVC,
  };
};
