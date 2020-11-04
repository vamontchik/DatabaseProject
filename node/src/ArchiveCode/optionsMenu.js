import React, {useState} from 'react'
import {Divider, makeStyles, Menu, Button, MenuItem, List, ListItem, ListItemText, Drawer} from '@material-ui/core'
import {FormControl} from 'react-bootstrap'

import DataTable from './tabularSchedule.js'

const sortOptions = ["Subject", "Number", "Credits", "avgGPA", "Instructor"]
const sortOptionsString = ["Department", "Course Number", "Credits", "Avg GPA", "Instructor"]

const sortDirections = ['asc', 'desc']
const sortDirectionsText = ['Ascending', 'Descending']

const useStyles = makeStyles((theme) => ({
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

export default function OptionsMenu() {
    const style = useStyles()

    const [sortBy, setSortBy] = useState('Subject')
    const [sortDir, setSortDir] = useState('asc')
    const [anchor, setAnchor] = useState(null)
    const [anchor2, setAnchor2] = useState(null)

    const [courseName, setName] = useState("");
    const [fromNum, setFromNum] = useState(0);
    const [toNum, setToNum] = useState(1000);
    const [avgGPAGreaterThan, setGreaterThan] = useState(0);

    const [drawer, toggleDrawer] = useState(false)

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

    const handleClose1 = () => {
        setAnchor(null)
    }
    const handleClose2 = () => {
        setAnchor2(null)
    }

    const handleClick1 = (event) => {
        setAnchor(event.currentTarget)
    }
    const handleClick2 = (event) => {
        setAnchor2(event.currentTarget)
    }

    const sortModel = [
        {
            field: sortBy,
            sort: sortDir
        }
    ]

    const filterModel = {
        from: fromNum,
        to: toNum,
        courseName: courseName,
        avgGPAgt: avgGPAGreaterThan
    }

    const sortItem = sortOptions.map((item) => {
        return(<MenuItem onClick={() => setSortBy(item)}>{sortOptionsString[sortOptions.indexOf(item)]}</MenuItem>)
    })
    const sortDirItems = sortDirections.map((item) => {
        return(<MenuItem onClick={() => setSortDir(item)}>{sortDirectionsText[sortDirections.indexOf(item)]}</MenuItem>)
    })

    return(
        <>
        <Button className={style.button} variant="contained" color="primary" onClick={() => toggleDrawer(true)}>{"Sort & Filter Options"}</Button>
        <Drawer className={style.drawer} anchor='left' open={drawer} onClose={() => toggleDrawer(false)}>
            <List className={style.optionList}>
                <ListItem className={style.blueBack}>
                    <ListItemText className={style.whiteText} primary="Sort Options"/>
                </ListItem>
                <Divider />
                <ListItem>
                    <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick1}>
                        {sortOptionsString[sortOptions.indexOf(sortBy)]}
                    </Button>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchor}
                        keepMounted
                        open={Boolean(anchor)}
                        onClose={handleClose1}
                    >
                        {sortItem}
                    </Menu>
                </ListItem>
                <ListItem>
                    <Button aria-controls="simple-menu2" aria-haspopup="true" onClick={handleClick2}>
                        {sortDirectionsText[sortDirections.indexOf(sortDir)]}
                    </Button>
                    <Menu
                        id="simple-menu2"
                        anchorEl={anchor2}
                        keepMounted
                        open={Boolean(anchor2)}
                        onClose={handleClose2}
                    >
                        {sortDirItems}
                    </Menu>
                </ListItem>
                <Divider />
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
        <DataTable sortModel={sortModel} filterModel={filterModel}/>
        </>
    )
}