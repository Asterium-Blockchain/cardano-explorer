import { ProtocolParamsProps } from '@/pages/protocol-parameters';
import {
  Container,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Tr,
} from '@chakra-ui/react';

const ProtocolParams: React.FC<ProtocolParamsProps> = ({ protocolParams }) => {
  return (
    <Container maxW={'container.xl'}>
      <Heading size={'md'} mt="12" textAlign={'center'}>
        Cardano protocol parameters
      </Heading>
      <TableContainer
        border={'1px'}
        borderColor="gray.600"
        borderRadius={'md'}
        mt={'8'}
        mb="16"
      >
        <Table>
          <Tbody>
            {Object.entries(protocolParams)
              .filter(([k, v]) => !!k && !!v)
              .map(([key, value]) => (
                <Tr key={key}>
                  <Th>{key}</Th>

                  <Td textAlign={'right'}>
                    <Text as="code">{value as string}</Text>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export { ProtocolParams };
