// bogus authentication zzz

db.auth('root','root_pw')

db = db.getSiblingDB('admin')

db.createUser({
    user: 'flask',
    pwd : 'flask_pw',
    roles : [
        { role : 'readWrite', db : 'mongodb_cs411project' }
    ]
})

// create the keys collection on init

db = db.getSiblingDB('mongodb_cs411project')

db.createCollection('keys')

