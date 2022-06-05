import * as k8s from '@pulumi/kubernetes';

type CarpVolumesArgs = {
  base: string;
  namespace: string;
  provider: k8s.Provider;
};

export const carpVolumes = (args: CarpVolumesArgs) => {
  const { base, namespace, provider } = args;

  const ipcPVCName = `${base}-ipc-pvc`;
  const ipcPVC = new k8s.core.v1.PersistentVolumeClaim(
    'carp-ipc-pvc',
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
    ipc: ipcPVC,
  };
};
