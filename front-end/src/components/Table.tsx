import { TableContainer, Table as ChTable, Thead, Tr, Th, Tbody } from '@chakra-ui/react'
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const Table = ({ columnNames, rows }: { columnNames: string[], rows: Array<React.ReactElement>}) => {

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
            <React.Fragment key={uuidv4()}>{row}</React.Fragment>
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
    </TableContainer>
  )
}

export default Table