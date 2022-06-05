import * as gcp from '@pulumi/gcp';
import * as k8s from '@pulumi/kubernetes';
import { Config } from '../config';
import { getKubeconfig } from './kubeconfig';

export const googleKubernetesEngineModule = () => {
  // GKE Cluster
  const cluster = new gcp.container.Cluster('gke-cluster', {
    name: `${Config.name}-gke`,
    location: Config.gpc.location,
    initialNodeCount: 1,
    removeDefaultNodePool: true,
  });

  // GKE Cluster Node Pools
  const oauthScopes = [
    'https://www.googleapis.com/auth/compute',
    'https://www.googleapis.com/auth/devstorage.read_only',
    'https://www.googleapis.com/auth/logging.write',
    'https://www.googleapis.com/auth/monitoring',
  ];

  const primaryNodePool = new gcp.container.NodePool(
    'gke-primary-node-pool',
    {
      name: 'primary-node-pool',
      project: Config.gpc.project,
      cluster: cluster.name,
      initialNodeCount: 1,
      location: cluster.location,
      nodeConfig: {
        preemptible: true,
        machineType: Config.gke.machineType,
        oauthScopes,
      },
      management: {
        autoRepair: true,
        autoUpgrade: true,
      },
    },
    {
      dependsOn: [cluster],
    }
  );

  // Cardano Node Pool
  const cardanoNodePool = new gcp.container.NodePool(
    'gke-cardano-node-pool',
    {
      name: 'cardano-node-pool',
      project: Config.gpc.project,
      cluster: cluster.name,
      initialNodeCount: 1,
      location: cluster.location,
      nodeConfig: {
        preemptible: true,
        machineType: Config.cardanoNode.machineType,
        oauthScopes,
      },
      management: {
        autoRepair: true,
        autoUpgrade: true,
      },
    },
    {
      dependsOn: [cluster],
    }
  );

  const kubeconfig = getKubeconfig(cluster);

  const provider = new k8s.Provider(
    'gke-provider',
    {
      kubeconfig: kubeconfig,
    },
    {
      dependsOn: [primaryNodePool, cardanoNodePool],
    }
  );

  return {
    cluster,
    provider,
    kubeconfig,
    pools: {
      primary: primaryNodePool,
      cardano: cardanoNodePool,
    },
  };
};
