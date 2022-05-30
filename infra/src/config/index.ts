import * as pulumi from '@pulumi/pulumi';

const GPCConfig = new pulumi.Config('gpc');
const PostgresqlConfig = new pulumi.Config('postgresql');

const name = 'cardano-explorer';

export const Config = {
  name: name,
  version: '0.0.1',
  gpc: {
    project: GPCConfig.require('project'),
    location: GPCConfig.require('zone'),
  },
  gke: {
    machineType: 'n2d-standard-2',
  },
  socat: {
    version: '1.7.4.3-r0',
    port: 3300,
  },
  cardanoNode: {
    name: `${name}-cardano-node`,
    service: `${name}-cardano-node-service`,
    machineType: 'n2d-standard-4',
    version: '1.34.1',
    network: 'mainnet',
  },
  postgresql: {
    name: `${name}-postgresql`,
    username: 'postgres',
    password: PostgresqlConfig.require('password'),
    database: 'postgres',
    port: 5432,
  },
  carp: {
    database: 'carp',
  },
};
