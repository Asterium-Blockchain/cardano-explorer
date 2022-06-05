import { googleKubernetesEngineModule } from './gke';
import { cardanoNodeModule } from './cardano-node';
import { postgresqlModule } from './postgresql';
import { carpModule } from './carp';

const googleKubernetesEngine = googleKubernetesEngineModule();

export const gkeClusterName = googleKubernetesEngine.cluster.name;
export const kubeconfig = googleKubernetesEngine.kubeconfig;

const cardanoNode = cardanoNodeModule({
  provider: googleKubernetesEngine.provider,
  pool: googleKubernetesEngine.pools.cardano,
});

export const cardanoNodeIp = cardanoNode.service.service.spec.clusterIP;

const postgresql = postgresqlModule({
  provider: googleKubernetesEngine.provider,
  pool: googleKubernetesEngine.pools.primary,
});

export const postgresqlHost = postgresql.release.name;
export const postgresqlExternalIp = postgresql.provider.host;

const carp = carpModule({
  provider: googleKubernetesEngine.provider,
  pgProvider: postgresql.provider,
  pool: googleKubernetesEngine.pools.primary,
  cardanoNodeService: cardanoNode.service.service,
});
