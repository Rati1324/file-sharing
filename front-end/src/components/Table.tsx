import { Table as ChTable, Thead, Tr, Th, Stack, Text, Button, Tbody } from '@chakra-ui/react'
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const Table = ({ columnNames, rows }: { columnNames: string[], rows: Array<React.ReactElement>}) => {

  useEffect(() => {
    console.log(rows)
  }, [rows])
  return (
    <ChTable>
      <Thead>
        <Tr>
          {columnNames.map((colName) => (
            <Th key={colName}>{colName}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
      {rows && rows.length ?
        rows.map((row) => (
          <React.Fragment key={uuidv4}>{row}</React.Fragment>
          // <div key={uuidv4}>{row}</div>
          // <div key={uuidv4()}>hi</div>
        ))
        :
        // <Text fontSize="xl" fontWeight={700}>No files found</Text>
        null
      }
      {/* <Stack mt={20}>
        <input type="file"  onChange={setFileUploadHandler} />
        <Button onClick={uploadFileHandler}>Upload</Button>
      </Stack> */}
      </Tbody>
    </ChTable>
  )
}

export default Table