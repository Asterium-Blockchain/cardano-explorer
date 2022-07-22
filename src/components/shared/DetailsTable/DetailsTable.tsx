import { toADA } from '@/utils/crypto';
import {
  Badge,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Tr,
} from '@chakra-ui/react';
import Link from '../Link';

type Value = string | number | boolean;

export interface IRow {
  header: string;
  key: string;
  value?: Value;
  render?: () => JSX.Element;
  hide?: boolean;
  link?: string;
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
                  {!row.render && !row.link && (
                    <Text as="code">{row.value}</Text>
                  )}
                  {!row.render && row.link && (
                    <Link href={row.link}>{row.value}</Link>
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

export { DetailsTable };
