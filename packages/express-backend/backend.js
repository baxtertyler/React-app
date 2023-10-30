import express from "express";
import cors from "cors";
import userService from "./user-services.js";

const app = express();
const port = 8000;

const findUserById = (id) => {
    return userService.findUserById(id);
}

const findUserByName = (name) => { 
    return userService.findUserByName(name);
}

const findUserByJob = (job) => {
    return userService.findUserByJob(job);
}

const findUserByNameAndJob = (name, job) => {
    return userService.findUserByNameAndJob(name, job);
}

const getUsers = () => {
    return userService.getUsers();
}

const deleteUser = (id) => {
    return userService.deleteUser(id);
}

const generateID = () => {
    return Math.floor(Math.random() * 999999999).toString();
}

const addUser = (user) => {
    //user['id'] = generateID();
    return userService.addUser(user);
}

app.use(cors());

app.use(express.json());

app.get('/users/:id', (req, res) => {
    const id = req.params['_id'];
    findUserById(id)
        .then((user) => {
            res.status(201).json(user);
        })
        .catch(() => {
            res.status(404).json({ error: 'User not found'});
        })
});

app.get('/users', (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    if (name != undefined && job != undefined) {
        findUserByNameAndJob(name, job)
            .then((user) => {
                res.status(200).json(user);
            })
            .catch(() => {
                res.status(404).json({error: 'User not found'});
            });
    }
    if (name != undefined) {
        findUserByName(name)
            .then((user) => {
                res.status(200).json(user);
            })
            .catch(() => {
                res.status(404).json({error: 'User not found'});
            });
    }
    else if (job != undefined) {
        findUserByJob(job)
            .then((user) => {
                res.status(200).json(user);
            })
            .catch(() => {
                res.status(404).json({error: 'User not found'});
            });
    } else {
        getUsers()
            .then((users) => {
                res.status(200).json({users_list:users});
            })
            .catch((error) => {
                res.status(500).json({error});
            });
    }
});

app.post('/users', (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd)
        .then((user) => {
            res.status(201).json(user);
        })
        .catch(() => {
            res.status(404).json({error: 'User could not be added'});
        });
}); 

app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    deleteUser(id)
        .then(() => {
            res.status(203);
        })
        .catch(() => {
            res.status(404).json({error: 'User not found'});
        })
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});