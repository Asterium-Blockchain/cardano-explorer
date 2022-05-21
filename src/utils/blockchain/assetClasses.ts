import { ADA_HANDLE_POLICY_ID } from '@/constants';
import { Amount } from '@/types';
import { Assets, C } from 'lucid-cardano';
import { hex2a } from '../strings';

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
export const assetsToValue = (assets: Amount) => {
  const multiAsset = C.MultiAsset.new();
  const lovelace = assets.find((asset) => asset.unit === 'lovelace');
  const policies = [
    ...new Set(
      assets
        .filter((asset) => asset.unit !== 'lovelace')
        .map((asset) => asset.unit.slice(0, 56)),
    ),
  ];
  policies.forEach((policy) => {
    const policyAssets = assets.filter(
      (asset) => asset.unit.slice(0, 56) === policy,
    );
    const assetsValue = C.Assets.new();
    policyAssets.forEach((asset) => {
      assetsValue.insert(
        C.AssetName.new(Buffer.from(asset.unit.slice(56), 'hex')),
        C.BigNum.from_str(asset.quantity),
      );
    });
    multiAsset.insert(
      C.ScriptHash.from_bytes(Buffer.from(policy, 'hex')),
      assetsValue,
    );
  });
  const value = C.Value.new(
    C.BigNum.from_str(lovelace ? lovelace.quantity : '0'),
  );
  if (assets.length > 1 || !lovelace) value.set_multiasset(multiAsset);
  return value;
};

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

export const findAdaHandles = (assets: Assets): string[] => {
  const adaHandles = [];
  const assetClasses = Object.keys(assets);
  for (const assetClass of assetClasses) {
    if (assetClass.startsWith(ADA_HANDLE_POLICY_ID)) {
      adaHandles.push(hex2a(assetClass.split('.')[1]));
    }
  }
  return adaHandles;
};
