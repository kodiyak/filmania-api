import {
  TableContainer,
  Table as ChakraTable,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
} from "@chakra-ui/react";
import React from "react";
import TableRow from "../TableRow";
import { TableProps } from "../types";

export const Table = <T = any,>({ columns, items }: TableProps<T>) => {
  const TableHead: React.FC = () => {
    return (
      <>
        {columns.map((column, c) => (
          <Th key={`column.${c}.head`}>{column.label}</Th>
        ))}
      </>
    );
  };

  return (
    <TableContainer>
      <ChakraTable variant="striped">
        {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
        <Thead>
          <Tr>
            <TableHead />
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item, i) => (
            <TableRow
              key={`row.${i}`}
              item={item}
              columns={columns}
              index={i}
            />
          ))}
        </Tbody>
        <Tfoot>
          <Tr>
            <TableHead />
          </Tr>
        </Tfoot>
      </ChakraTable>
    </TableContainer>
  );
};

