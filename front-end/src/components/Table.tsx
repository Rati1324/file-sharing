import { TableContainer, Table as ChTable, Thead, Th, Tbody, Text, Tr, Td } from '@chakra-ui/react'
import React from 'react';

interface TableProps {
  columnNames: string[],
  rows: Array<any>,
}

const Table = ({ columnNames, rows}: TableProps) => {
  return (
    <TableContainer>
      <ChTable variant='simple'>
        <Thead>
          <Tr>
            {columnNames.map((colName: string) => (
              <Th key={colName}>{colName}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
        {rows && rows.length ?
          rows.map((row) => (
            <React.Fragment key={row.id}>{row.component}</React.Fragment>
          ))
          :
          <Tr>
            <Td>
              <Text fontSize="xl" fontWeight={700}>No files found</Text>
            </Td>
          </Tr>
        }
        </Tbody>
      </ChTable>
    </TableContainer>
  )
}

export default Table