import { useState } from 'react';
import { Table, TableBody, TablePagination, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { StyledTableCell, StyledTableRow } from '../styles/styles';
import { Delete, PostAdd, Visibility, PlusOne, Tag } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { BlueButton } from '../ButtonStyled';

const WaybillTable = ({ columns, rows, handleAction }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  if (!columns || !Array.isArray(columns) || columns.length === 0) {
    return <h2>No data available</h2>
  }

  if (!rows || !Array.isArray(rows) || rows.length === 0) {
    return <h2>No data available</h2>
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <StyledTableRow>
              {columns && columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth}}
                >
                  {column.label}
                </StyledTableCell>
              ))}
              <StyledTableCell align='center'>
                Actions
              </StyledTableCell>
            </StyledTableRow>
          </TableHead>

          <TableBody>
            {Array.isArray(rows) && rows.length > 0 &&
            rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => {
              return (
                <StyledTableRow hover role='checkbox' tabIndex={-1} key={row.id || index}>
                  {columns && columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <StyledTableCell key={column.id} align={column.align}>
                        {
                          column.format && value !== undefined
                            ? column.format(value)
                            : value
                        }
                      </StyledTableCell>
                    );
                  })}
                  <StyledTableCell align='center'>
                    <IconButton onClick={() => handleAction('waybill', row.id)}><BlueButton>Waybill</BlueButton></IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              )
            })
            }
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 5));
          setPage(0);
        }}
      />
    </>
  )
};

export default WaybillTable;