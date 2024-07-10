const User=  require('../models/userModel');

const userController ={
    users: (req, res) => {
        User.findAll((err, results) => {
        if (err) {
            return res.status(500).send('Error finding user');
        }
            res.status(200).json(results);
        });
    },
    find:(req,res)=>{
        const {id}=req.params;
        User.findUser(id,(err,result)=>{
            if (err) {
                return res.status(500).send('Error finding particular user!');
            }
                res.status(200).json(result);
        })
    },
    delete:(req,res)=>{
        const {id}=req.params;
        User.deleteUser(id,(err,result)=>{
            if (err) {
                return res.status(500).send('Error finding particular user!');
            }
            res.status(200).send('User deleted!!');    
        })
    },

    postData:(req, res) => {
        const {name,email,bloodgroup,gender}=req.body;
        console.log(name);
        console.log(gender);
        console.log(bloodgroup);
        User.AddUser([name,email,gender,bloodgroup],(err,result)=>{
            if (err) {
                return res.status(500).send('Error Adding a particular user!');
            }
            res.status(200).json('User added!');    
        });
    },
    PatchInfo:(req,res)=>{
        const{id}=req.params;
        const fields = req.body;
        User.UpdatePartially(id, fields, (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).send('Error updating user');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('User not found');
        }
        res.status(200).send('User updated');
        });
    },
    PutInfo:(req,res)=>{
        const {id}=req.params;
        const fields =req.body;
        User.UpdatePartiall(id, fields, (err, result) => {
            if (err) {
                console.error('Error updating user:', err);
                return res.status(500).send('Error updating user');
            }
            if (result.affectedRows === 0) {
                // login request
                const {name,email,bloodgroup,gender}=req.body;
                console.log(name);
                console.log(gender);
                console.log(bloodgroup);
                User.AddUser([name,email,gender,bloodgroup],(err,result)=>{
                    if (err) {
                        return res.status(500).send('Error Adding a particular user!');
                    }
                    res.status(200).json('User added!');    
                });
                    }
            res.status(200).send('User updated');
        });
    }
}
module.exports = userController;

