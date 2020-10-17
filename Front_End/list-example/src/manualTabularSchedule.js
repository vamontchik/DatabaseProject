import React from 'react'
import JSONFile from './courseListExample.json'
import {IconButton, TableCell, Table, TableHead, Checkbox, TableRow, TableSortLabel, Toolbar, Tooltip, Switch, TableBody, Paper, TablePagination, FormControlLabel, TableContainer} from '@material-ui/core'
import FilterListIcon from '@material-ui/icons/FilterList'

function dataSchema(name, number, credits, avgGPA, instructor) {
    return {name, number, credits, avgGPA, instructor}
}

const rows = JSONFile.courses.map((item) => {
    return (dataSchema(item.Subject, item.Number, item.Credits, item.avgGPA, item.Instructor))
})

const headCell = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Course Name' },
    { id: 'number', numeric: true, disablePadding: true, label: 'Course Number' },
    { id: 'credits', numeric: true, disablePadding: false, label: 'Credits' },
    { id: 'avgGPA', numeric: true, disablePadding: false, label: 'Average GPA' },
    { id: 'instructor', numeric: false, disablePadding: true, label: 'Instructor' },
]

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
}
  
function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function DataHead() {
    return (
        <Toolbar>
            <h6>Nutrition</h6>
            <Tooltip title="Filter list">
                <IconButton aria-label="filter list">
                    <FilterListIcon />
                </IconButton>
            </Tooltip>
        </Toolbar>
    )
}

function DataHeadRow(props) {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCell.map((item) => (
                    <TableCell 
                    key={item.id}
                    align={item.numeric ? 'right' : 'left'}
                    padding={item.disablePadding ? 'none' : 'default'}
                    sortDirection={orderBy === item.id ? order : false}
                    >
                        <TableSortLabel
                        active={orderBy === item.id}
                        direction={orderBy === item.id ? order : 'asc'}
                        onClick={createSortHandler(item.id)}
                        >
                            {item.label}
                        </TableSortLabel>

                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

export default function DataTable(props) {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('name');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
        );
        }
        setSelected(newSelected);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    
    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };
    
    const isSelected = (name) => selected.indexOf(name) !== -1;
    
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <div>
          <Paper>
            <DataHead />
            <TableContainer>
              <Table
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
                aria-label="enhanced table"
              >
                <DataHeadRow
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {stableSort(rows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.name);
                      const labelId = `enhanced-table-checkbox-${index}`;
    
                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, row.name)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.name}
                          selected={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              inputProps={{ 'aria-labelledby': labelId }}
                            />
                          </TableCell>
                          <TableCell component="th" id={labelId} scope="row" padding="none">
                            {row.name}
                          </TableCell>
                          <TableCell align="right">{row.number}</TableCell>
                          <TableCell align="right">{row.credits}</TableCell>
                          <TableCell align="right">{row.avgGPA}</TableCell>
                          <TableCell align="right">{row.instructor}</TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Dense padding"
          />
        </div>
      );
}