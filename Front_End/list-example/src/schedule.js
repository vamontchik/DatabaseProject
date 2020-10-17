import React, {useState} from 'react';
import {Button, Collapse, Drawer, List, ListItem, ListItemText, Menu, MenuItem, Divider} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import JSONFile from './courseListExample.json';
import {FormControl} from 'react-bootstrap'
import './schedule.css'

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

export default function ScheduleWrap() {
    const style = useStyles();

    //Container Related State
    const [anchor, setAnchor] = useState(null)
    const [anchor2, setAnchor2] = useState(null)
    const [drawer, setDrawer] = useState(false)

    //Sort Related State
    const [sortType, setSortType] = useState("Number")
    const [sortDirection, setSortDir] = useState(1)
    const sortTypeListString = ["Course Number", "Course Department", "Average GPA", "Credits"]
    const sortTypeList = ["Number", "Subject", "avgGPA", "Credits"]

    //Filter Related State
    const [courseName, setName] = useState("");
    const [fromNum, setFromNum] = useState(0);
    const [toNum, setToNum] = useState(1000);
    const [avgGPAGreaterThan, setGreaterThan] = useState(0)

    //Filter Related Methods
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

    //Handle Toggle Drawer
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawer(open)
    }

    //Handle Toggle Menu Options
    const handleClick1 = (event) => {
        setAnchor(event.currentTarget)
    }
    const handleClick2 = (event) => {
        setAnchor2(event.currentTarget)
    }
    const handleClose1 = () => {
        setAnchor(null)
    }
    const handleClose2 = () => {
        setAnchor2(null)
    }

    //Sort Operations
    const setSort = (type) => {
        setSortType(type)
        handleClose1()
    }

    const setDir = (index) => {
        var set = index
        if (set === 0) {
            set = set - 1
        }
        setSortDir(set)
        handleClose2()
    }

    //Sort 
    const sortItem = sortTypeList.map((item) => {
        return (<MenuItem onClick={() => setSort(item)}>{sortTypeListString[sortTypeList.indexOf(item)]}</MenuItem>)
    })

    const sortDirections = ["Descending", "Ascending"]

    const sortDirectionItem = sortDirections.map((item, index) => {
        return (<MenuItem onClick={() => {setDir(index)}}>{item}</MenuItem>)
    })

    //Options list for Drawer
    const optionsList =
            <List className={style.optionList}>
                <ListItem className={style.blueBack}>
                    <ListItemText className={style.whiteText} primary="Sort Options"/>
                </ListItem>
                <Divider />
                <ListItem>
                    <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick1}>
                        {sortTypeListString[sortTypeList.indexOf(sortType)]}
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
                        {sortDirection === -1 ?
                            sortDirections[0] : sortDirections[sortDirection]}
                    </Button>
                    <Menu
                        id="simple-menu2"
                        anchorEl={anchor2}
                        keepMounted
                        open={Boolean(anchor2)}
                        onClose={handleClose2}
                    >
                        {sortDirectionItem}
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
        

    return (
        <div id="bigCont">
            <h1>Course List</h1>
            <div>
                <Button className={style.button} variant="contained" color="primary" onClick={toggleDrawer(true)}>{"Sort & Filter Options"}</Button>
                <Drawer className={style.drawer} anchor='left' open={drawer} onClose={toggleDrawer(false)}>
                    {optionsList}
                </Drawer>
            </div>
            <div id="scheduleCont">
                <Schedule from={fromNum} to={toNum} avgGPA={avgGPAGreaterThan} Subject={courseName} sort={true} sortType={sortType} direction={sortDirection} />
            </div>
        </div>
    )
}

function Schedule(props) {
    const style = useStyles();
    const courseList = JSONFile.courses;

    if (props.sort) {
        courseList.sort((a, b) => (a[props.sortType] > b[props.sortType]) ? props.direction : -props.direction)
    }
    
    // eslint-disable-next-line
    const courses = courseList.map((item) => {
        if (item.Subject.startsWith(props.Subject) && item.Number >= props.from && item.Number <= props.to && item.avgGPA >= props.avgGPA) return (
        <ScheduleItem 
            course={item.Subject}
            number={item.Number}
            avgGPA={item.avgGPA}
            credits={item.Credits}
            instructor={item.Instructor}
        />
        )
    })
    return (
        <List className={style.root}>
            {courses}
        </List>
    )
}

function ScheduleItem(props) {
    const style = useStyles();
    const courseDepartment = props.course;
    const courseNumber = props.number;
    const avgGPA = props.avgGPA;
    const credits = props.credits;
    const instructor = props.instructor;
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(!open);
    }

    return (
        <>
        <ListItem button onClick={handleOpen}>
            <ListItemText primary={courseDepartment + " " + parseInt(courseNumber)} />
            {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                <ListItem className={style.nested}>
                    <ListItemText primary={"Instructor: " + instructor}/>
                </ListItem>
                <ListItem className={style.nested}>
                    <ListItemText primary={"Average GPA: " + avgGPA}/>
                </ListItem>
                <ListItem className={style.nested}>
                    <ListItemText primary={"Credits: " + credits}/>
                </ListItem>
                <ListItem className={style.nested}>
                    <Button variant="contained" color='primary'>Add to List</Button>
                </ListItem>
            </List>
        </Collapse>
        </>
    )
}