var secrets = require('../config/secrets');
var User = require('../models/user');
var Task = require('../models/task');
var mongoose = require('mongoose');
mongoose.connect(secrets.mongo_connection);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

module.exports = function(router) {

    router.route('/').options(function(req, res) {
        res.send("GET,POST,OPTIONS,PUT,DELETE");
        res.status(200);
        res.end();
    })
    router.route('/users')
        .get(function(req, res) {
            //where
            User.find(eval("(" + req.query.where + ")"))
                .sort(eval("(" + req.query.sort + ")"))
                .select(eval("(" + req.query.select + ")"))
                .skip(eval("(" + req.query.skip + ")"))
                .limit(eval("(" + req.query.limit + ")"))
                .exec(function(err, users) {
                    if(err){
                        res.status(404);
                        res.json({"message": "An error occurs while attempting to get userlist", "data": err});
                    }
                    else{
                        if(eval("(" + req.query.count + ")"))
                            users = users.length;
                        res.json({"message": "OK", "data":users});
                    }
                });

        })
        //add a user
        .post(function(req, res) {
            var user = new User();
            console.log(req.body);
            if(req.body.name && req.body.email){
                user.name=req.body.name;
                user.email =req.body.email ;
            }
            else{
                res.json({"message": "Name and email fields are required", "data": null});
                return;
            }

            user.save(function(err) {
                if (err) {
                    res.status(201);
                    res.json({"message": "An error occurs while attempting to add a user", "data": err.errmsg});
                }
                else
                    res.json({"message": "OK", "data": user});
            });
        })
        //handling options
        .options(function(req, res){
            res.writeHead(200);
            res.end();
        });

    // get a user
    router.route('/users/:id')
        .get(function(req, res) {
            User.findById(req.params.id, function(err, user) {
                if (err) {
                    res.status(404);
                    res.json({"message": "An error occurs while attempting to find user " + req.params.id, "data": err});
                }else
                    res.json({"message": "OK", "data": user});
            });


        })
        .put(function(req, res) {
            User.findById(req.params.id, function(err, user) {
                if (err) {
                    res.status(404);
                    res.json({
                        "message": "An error occurs while attempting to find user " + req.params.id,
                        "data": err
                    });
                    return;

                }
                if(req.body.name && req.body.email){
                    user.name=req.body.name;
                    user.email =req.body.email ;
                }

                // save the bear
                user.save(function(err) {
                    if (err) {
                        res.status(404);
                        res.json({
                            "message": "An error occurs while attempting to update user " + req.params.id,
                            "data": err
                        });
                    }else
                        res.json({"message": "OK", "data": user});
                });
            });

        })
        .delete(function(req, res) {

            User.remove({_id: req.params.id}, function(err, user) {
                if (err) {
                    res.status(404);
                    res.json({
                        "message": "An error occurs while attempting to delete user " + req.params.id,
                        "data": err
                    });
                }else
                    res.json({"message": "OK", "data": "user " +req.params.id + " deleted"});
            });

        });
    router.route('/tasks')

    //get tasks
        .get(function(req,res){
            Task.find(eval("(" + req.query.where + ")"))
                .sort(eval("(" + req.query.sort + ")"))
                .select(eval("(" + req.query.select + ")"))
                .skip(eval("(" + req.query.skip + ")"))
                .limit(eval("(" + req.query.limit + ")"))
                .exec(function(err, tasks) {
                    if(err){
                        res.status(404);
                        res.json({"message": "An error occurs while attempting to get userlist", "data": err});
                    }
                    else{
                        if(eval("(" + req.query.count + ")"))
                            tasks = tasks.length;
                        res.json({"message": "OK", "data":tasks});
                    }
                });
        })
        //add a task
        .post(function (req,res) {
            var task = new Task();
            if(req.body.name && req.body.deadline){
                task.name=req.body.name;
                task.deadline =req.body.deadline;
            }

            if(req.body.assignedUserName) task.assignedUserName = req.body.assignedUserName;
            if(req.body.assignedUser) task.assignedUser = req.body.assignedUser;
            if(req.body.completed) task.completed = eval("(" + req.body.completed + ")");
            if(req.body.description) task.description = req.body.description;

            task.save(function (err) {
                if (err) {
                    res.status(201);
                    res.json({"message": "An error occurs while attempting to get tasklist", "data": err});
                }

                else
                    res.json({"message": "OK", "data": task});

            })

        })
        .options(function(req, res) {
            res.writeHead(200);
            res.end();
        });

    router.route('/tasks/:id')
        .get(function(req, res) {
            Task.findById(req.params.id, function(err, task) {
                if (err) {
                    res.status(404);
                    res.json({
                        "message": "An error occurs while attempting to find task " + req.params.id,
                        "data": err
                    });
                }else
                    res.json({"message": "OK", "data": task});
            });
        })
        .put(function(req, res) {
            Task.findById(req.params.id, function(err, task) {
                if (err) {
                    res.status(404);
                    res.json({"message": "An error occurs while attempting to find task " + req.params.id, "data": err});
                    return;
                }
                if(req.body.name && req.body.deadline){
                    task.name=req.body.name;
                    task.deadline =req.body.deadline;
                }
                if(req.body.assignedUserName) task.assignedUserName = req.body.assignedUserName;
                if(req.body.assignedUser) task.assignedUser = req.body.assignedUser;
                if(req.body.completed) task.completed = eval("(" + req.body.completed + ")");
                if(req.body.description) task.description = req.body.description;

                // save the bear
                task.save(function(err) {
                    if (err) {
                        res.status(404);
                        res.json({
                            "message": "An error occurs while attempting to update task " + req.params.id,
                            "data": err
                        });
                    }else
                        res.json({"message": "OK", "data": task});
                });
            });

        })
        .delete(function(req, res) {

            Task.remove({_id: req.params.id}, function(err, task) {
                if (err) {res.send("GET,POST,OPTIONS,PUT,DELETE");
                    res.status(404);
                    res.json({
                        "message": "An error occurs while attempting to delete task " + req.params.id,
                        "data": err
                    });
                }else
                    res.json({"message": "OK", "data": "task " +req.params.id + " deleted"});
            });

        });

    return router;
}