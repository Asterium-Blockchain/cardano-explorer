import { C } from 'lucid-cardano';

export function toADA(lovelace: string) {
  return (parseInt(lovelace, 10) / 1000000).toString();
}

export function getAddressStakeKey(addr: string) {
  if (addr.length !== 103) {
    return null;
  }

  const address = C.Address.from_bech32(addr);
  const base = C.BaseAddress.from_address(address);
  const stake = C.RewardAddress.new(address.network_id(), base!.stake_cred())
    .to_address()
    .to_bech32();
  return stake;
}

export function amountToAssets(
  amount: {
    unit: string;
    quantity: string;
  }[],
) {
  return amount.reduce(
    (acc, curr) => ({ ...acc, [curr.unit]: curr.quantity }),
    {},
  );
}

export function valueToAssets(value: string) {
  const parsedValue = C.Value.from_bytes(Buffer.from(value, 'hex'));
  const assets = [];
  assets.push({ unit: 'lovelace', quantity: parsedValue.coin().to_str() });
  const multiasset = parsedValue.multiasset();
  if (multiasset) {
    const policies = multiasset.keys();
    for (let j = 0; j < policies.len(); j++) {
      const policy = policies.get(j);
      const policyAssets = multiasset.get(policy);
      const assetNames = policyAssets!.keys();
      for (let k = 0; k < assetNames.len(); k++) {
        const policyAsset = assetNames.get(k);
        const quantity = policyAssets!.get(policyAsset);
        const asset =
          Buffer.from(policy.to_bytes()).toString('hex') +
          Buffer.from(policyAsset.name()).toString('hex');
        assets.push({
          unit: asset,
          quantity: quantity!.to_str(),
        });
      }
    }
  }
  return assets;
}
