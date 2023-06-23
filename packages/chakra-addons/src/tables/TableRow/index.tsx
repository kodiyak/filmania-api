import { Td, Tr } from "@chakra-ui/react";
import React from "react";
import { TableRowProps } from "../types";

const TableRow: React.FC<TableRowProps<any>> = ({ columns, item, index }) => {
  return (
    <>
      <Tr>
        {columns.map((column, c) => (
          <Td {...column._td} key={`column.${c}`}>
            {column.render(item, index)}
          </Td>
        ))}
      </Tr>
    </>
  );
};

export default TableRow;
