import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Axios from 'axios';

const columns = [
  { id: '_id', label: '_id', minWidth: 170 },
  { id: 'name', label: 'Name', minWidth: 100 },
  {
    id: 'mobile',
    label: 'Mobile',
    minWidth: 170,
    align: 'right'
  },
  {
    id: 'email',
    label: 'Email',
    minWidth: 170,
    align: 'right'
  },
  {
    id: 'is_active',
    label: 'Active',
    minWidth: 170,
    align: 'right',
  },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

export default function StickyHeadTable() {
  const classes = useStyles();
  const [rows, setRow] = React.useState([])
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // component did mount
  useEffect(async () => {
    let { data } = await Axios.get(`http://cd769e363d6f.ngrok.io/api/v1/user?page_no=${page}&limit=${rowsPerPage}`);
    console.log(data.data.attributes.data)
    setRow(data.data.attributes.data);
  }, []);

  // our custom function
  const userPagination = async (event, something) => {
    let { data } = await Axios.get(`http://cd769e363d6f.ngrok.io/api/v1/user?page_no=${something}&limit=${rowsPerPage}`);
    setRow(data.data.attributes.data);
    setRowsPerPage(+rowsPerPage);
    setPage(something);
  }

  // it call whenever rowsperpage changes
  useEffect(() => {
    userPagination(rowsPerPage, 0)
}, [rowsPerPage]);

  // change rows per page
  const handleChangeRowsPerPage = async(event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 25, 100]} // we can set whatever we want
        component="div"
        count={29} // !! important ---> need to set total count of records
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={userPagination} // our custom function (NEXT, PREV) button
        onChangeRowsPerPage={handleChangeRowsPerPage} // rows per page function
      />
    </Paper>
  );
}

