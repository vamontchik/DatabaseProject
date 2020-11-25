db.createUser({
    user: 'root',
    pwd : 'example',
    roles : [
        { role : 'readWrite', db : 'cs411project_mongodb' }
    ]
})