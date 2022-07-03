import { toADA } from '@/utils/crypto';
import { hex2a, truncateString } from '@/utils/strings';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Heading,
  Stat,
  StatNumber,
  Tag,
  Text,
} from '@chakra-ui/react';
import Link from '@/components/shared/Link';

interface TransactionInputProps {
  address: string;
  txIndex: number;
  amount: { quantity: string; unit: string }[];
  txHash?: string;
  datumHash?: string | null;
}

const TransactionInput: React.FC<TransactionInputProps> = ({
  address,
  txHash,
  txIndex,
  amount,
  datumHash,
}) => {
  const lovelace =
    amount.find(({ unit }) => unit === 'lovelace')?.quantity || '0';
  const filteredAmount = amount.filter(({ unit }) => unit !== 'lovelace');

  return (
    <Box border={'1px'} borderColor="gray.700" my={'2'} borderRadius={'md'}>
      <Box p="4">
        <Stat mb={'1'}>
          <StatNumber as="code">
            {toADA(lovelace)}
            <Text as="code" fontSize={'sm'} color="gray.400" ml={'1'}>
              ADA
            </Text>
          </StatNumber>
        </Stat>

        <Heading size={'sm'}>
          <Link href={`/address/${address}`}>
            {truncateString(address, 38, 'middle')}
          </Link>
          {datumHash && (
            <Tag colorScheme={'pink'} size="sm" ml={'2'}>
              Script
            </Tag>
          )}
        </Heading>

        {txHash && (
          <Text
            as="code"
            fontSize="xs"
            color={'gray.500'}
            mt="2"
            _hover={{ textDecor: 'underline' }}
          >
            <Link href={`/transaction/${txHash}`} alt mt="2">
              {truncateString(txHash, 38, 'middle')}#{txIndex}
            </Link>
          </Text>
        )}
      </Box>
      {filteredAmount.length > 0 && (
        <Accordion allowMultiple allowToggle>
          <AccordionItem borderBottom={'none'}>
            <div>
              <AccordionButton>
                <Text color={'gray.400'}>
                  <b>{filteredAmount.length}</b> native token
                  {filteredAmount.length !== 1 && 's'}
                </Text>
                <AccordionIcon color={'gray.500'} />
              </AccordionButton>
            </div>
            <AccordionPanel>
              {filteredAmount.map(({ quantity, unit }) => (
                <Badge key={unit} display="inline-block" m={'2'}>
                  <Link href={`/token/${unit}`} alt>
                    {quantity} {hex2a(unit.slice(56))}
                  </Link>
                </Badge>
              ))}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      )}
    </Box>
  );
};
export { TransactionInput };
