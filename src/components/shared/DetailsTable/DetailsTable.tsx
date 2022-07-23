import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Tr,
} from '@chakra-ui/react';
import Link from '../Link';
import AdaText from './components/AdaText';

type Value = string;

export interface IRow {
  header: string;
  key: string;
  value?: Value;
  render?: () => JSX.Element;
  hide?: boolean;
  link?: string;
  isAda?: boolean;
}

interface DetailsTableProps {
  rows: IRow[];
}

const DetailsTable: React.FC<DetailsTableProps> = ({ rows }) => {
  return (
    <TableContainer
      border={'1px'}
      borderColor="gray.700"
      borderRadius={'md'}
      mt="8"
      borderBottom={'none'}
    >
      <Table>
        <Tbody>
          {rows.flatMap((row) =>
            row.hide ? (
              []
            ) : (
              <Tr key={row.key}>
                <Th>{row.header}</Th>
                <Td textAlign={'right'}>
                  {row.render && row.render()}
                  {!row.render && row.isAda && (
                    <AdaText lovelace={row.value || '0'} />
                  )}
                  {!row.render && !row.link && !row.isAda && (
                    <Text as="code">{row.value || ''}</Text>
                  )}
                  {!row.render && !row.isAda && row.link && (
                    <Link href={row.link}>{row.value || ''}</Link>
                  )}
                </Td>
              </Tr>
            ),
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default DetailsTable;
