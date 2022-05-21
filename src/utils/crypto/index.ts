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
