import React from "react";
import {
  TableRowProps as ChakraTableRowProps,
  TableCellProps,
} from "@chakra-ui/react";

export interface TableProps<T = any> {
  columns: ColumnProps<T>[];
  items: T[];
  _tr?: ChakraTableRowProps;
}

export interface ColumnProps<T> {
  label: string;
  render: (v: T, index: number) => React.ReactNode;
  isNumberic?: boolean;
  _td?: TableCellProps;
}

export interface TableRowProps<T> {
  item: T;
  columns: ColumnProps<T>[];
  index: number;
}
