import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import FilterListIcon from '@material-ui/icons/FilterList';
import JSONFile from './courseListExample.json'
import {List, ListItem, ListItemText, Drawer, Divider} from '@material-ui/core'
import {FormControl} from 'react-bootstrap'

const useStyless = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 300,
        maxHeight: '65vh',
        backgroundColor: theme.palette.background.paper,
        overflowY: 'auto',
        border: 0.1,
        borderRadius: 1,
        borderColor: 'black',
        borderStyle: 'solid',
        paddingTop: 0,
        paddingBottom: 0
    },
    nested: {
        paddingLeft: theme.spacing(4)
    },
    button: {
        width: '100%',
        maxWidth: 300
    },
    drawer: {
        width:300,
        flexShrink: 0
    },
    blueBack: {
        backgroundColor: 'black',
    },
    whiteText: {
        color: "white"
    },
    optionList: {
        paddingTop: 0
    }
}))

function createData(id, name, number, credits, avgGPA, instructor, hidden) {
  return {id, name, number, credits, avgGPA, instructor, hidden };
}

function descendingComparator(a, b, orderBy, desc) {
    if (a.hidden === true) {
        return -desc
    }
    if (b.hidden === true) {
        return desc;
    }
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
    ? (a, b) => descendingComparator(a, b, orderBy, -1)
    : (a, b) => -descendingComparator(a, b, orderBy, 1);
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

const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Course Name' },
  { id: 'number', numeric: true, disablePadding: false, label: 'Course Number' },
  { id: 'credits', numeric: true, disablePadding: false, label: 'Credits' },
  { id: 'avgGPA', numeric: true, disablePadding: false, label: 'Average GPA' },
  { id: 'instructor', numeric: false, disablePadding: false, label: 'Instructor' },
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const { numSelected, togDrawer } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          Course List
        </Typography>
      )}
        <Tooltip title="Filter list">
            <IconButton aria-label="filter list" onClick={togDrawer}>
            <FilterListIcon />
            </IconButton>
        </Tooltip>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function EnhancedTable() {
    const style = useStyless()
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [drawer, toggleDrawer] = useState(false)
    const [courseName, setName] = useState("");
    const [fromNum, setFromNum] = useState(0);
    const [toNum, setToNum] = useState(1000);
    const [avgGPAGreaterThan, setGreaterThan] = useState(0);
    const [hidden, setHidden] = useState(0);

    const inputSearch = (e) => {
        setName(e.target.value)
    }
    const inputFrom = (e) => {
        if (e.target.value !== "") setFromNum(parseInt(e.target.value));
        else setFromNum(0)
    }
    const inputTo = (e) => {
        if (e.target.value !== "") setToNum(parseInt(e.target.value));
        else setToNum(0)
    }
    const inputAVG = (e) => {
        if (e.target.value !== "") setGreaterThan(parseInt(e.target.value));
        else setGreaterThan(0)
    }

    const openDrawer = () => {
        toggleDrawer(true)
    }

    useEffect(() => {
        var hiddenCount = 0;
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].hidden === true) {
                hiddenCount++;
            }
        }
        setHidden(hiddenCount)
        // eslint-disable-next-line
    }, [courseName, fromNum, toNum, avgGPAGreaterThan])


    const rows = JSONFile.courses.map((item, index) => {
        var hidden = true;
        if (item.Subject.startsWith(courseName) && item.Number >= fromNum && item.Number <= toNum && item.avgGPA >= avgGPAGreaterThan) {
            hidden = false
        }
        return (createData(index, item.Subject, item.Number, item.Credits, item.avgGPA, item.Instructor, hidden))
    })

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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
  };

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

  const isSelected = (id) => selected.indexOf(id) !== -1;

  //const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} togDrawer={openDrawer}/>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {

                    if (row.hidden === true) {
                        return null
                    }
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
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
                      <TableCell align="left">{row.instructor}</TableCell>
                    </TableRow>
                  );
                })}
              {/* {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )} */}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length - hidden}
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
      <Drawer className={style.drawer} anchor='left' open={drawer} onClose={() => toggleDrawer(false)}>
            <List className={style.optionList}>
                <ListItem className={style.blueBack}>
                    <ListItemText className={style.whiteText} primary="Filter Options"/>
                </ListItem>
                <Divider />

                <ListItem>
                    <ListItemText primary="Department"/>
                </ListItem>
                <ListItem>
                    <FormControl value={courseName} onChange={inputSearch} />
                </ListItem>

                <Divider />

                <ListItem>
                    <ListItemText primary="From Course Number"/>
                </ListItem>
                <ListItem>
                    <FormControl value={fromNum} onChange={inputFrom} />
                </ListItem>

                <Divider />

                <ListItem>
                    <ListItemText primary="To Course Number"/>
                </ListItem>
                <ListItem>
                    <FormControl value={toNum} onChange={inputTo} />
                </ListItem>

                <Divider />

                <ListItem>
                    <ListItemText primary="Average GPA Greater Than"/>
                </ListItem>
                <ListItem>
                    <FormControl value={avgGPAGreaterThan} onChange={inputAVG} />
                </ListItem>
                
                <Divider />
            </List>
        </Drawer>
    </div>
  );
}