import { Table as ChTable, Thead, Tr, Th, Stack, Text, Button } from '@chakra-ui/react'
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

type columnNames = string[];
type rows = Array<React.ReactElement>;

const Table = ({ columnNames, rows }: { columnNames: columnNames, rows: rows }) => {
  return (
    <ChTable>
      <Thead>
          <Tr>
            {columnNames.map((colName) => (
              <Th key={colName}>{colName}</Th>
            ))}
          </Tr>
      </Thead>
      {rows && rows.length ?
        rows.map((row) => (
          <React.Fragment key={uuidv4}>{row}</React.Fragment>
        ))
        :
        <Text fontSize="xl" fontWeight={700}>No files found</Text>
      }
      {/* <Stack mt={20}>
        <input type="file"  onChange={setFileUploadHandler} />
        <Button onClick={uploadFileHandler}>Upload</Button>
      </Stack> */}
    </ChTable>
  )
}

export default Table