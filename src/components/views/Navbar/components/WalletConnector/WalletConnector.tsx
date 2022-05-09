import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { BiWalletAlt } from 'react-icons/bi';

import { SUPPORTED_WALLETS } from '@/constants';
import useWallet from '@/hooks/useWallet';
import { WalletName } from '@/store/createWalletSlice';
import { capitalizeFirstLetter, truncateString } from '@/utils/strings';
import Image from 'next/image';
import { useCallback, useEffect, useMemo } from 'react';

const WalletConnector = () => {
  const { connectWallet, walletLoading, address, walletName } = useWallet();

  const connectWalletWithName = useCallback(
    (walletName: WalletName) => () => {
      connectWallet(walletName);
    },
    [connectWallet],
  );

  const availableWallets = useMemo(
    () => SUPPORTED_WALLETS.filter((w) => w !== walletName),
    [walletName],
  );

  useEffect(() => {
    const cached = localStorage.getItem('asterium-wallet-name');
    if (cached) {
      connectWalletWithName(cached as WalletName)();
    }
  }, [connectWalletWithName]);

  return (
    <Menu closeOnSelect={false}>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} py="2" w={20}>
        <Icon
          as={BiWalletAlt}
          w="7"
          h="7"
          mt={1}
          color={address ? 'green.400' : 'gray.500'}
        />
      </MenuButton>

      <MenuList>
        {address && walletName && (
          <MenuGroup title="Connected wallet">
            <MenuItem>
              <Box mr="3" alignItems={'center'} display="flex">
                <Image
                  src={`/icons/wallets/${walletName}.svg`}
                  alt={walletName}
                  width={20}
                  height={20}
                />
              </Box>
              <Text as="code">{truncateString(address, 12, 'middle')}</Text>
            </MenuItem>
          </MenuGroup>
        )}
        <MenuGroup title="Supported wallets">
          {availableWallets.map((wallet) => (
            <MenuItem key={wallet} onClick={connectWalletWithName(wallet)}>
              <Box mr={'3'} display="flex" alignItems={'center'}>
                <Image
                  src={`/icons/wallets/${wallet}.svg`}
                  alt={wallet}
                  width={20}
                  height={20}
                />
              </Box>
              {walletLoading === wallet ? (
                <Spinner />
              ) : (
                capitalizeFirstLetter(wallet)
              )}
            </MenuItem>
          ))}
        </MenuGroup>
      </MenuList>
    </Menu>
  );
};

export default WalletConnector;
