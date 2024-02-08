const { ObjectId } = require('mongodb');
const Hash = require('../hash');

class User {
    db;

    constructor(database) {
        this.db = database;
    }

    setRoleWithWalletAddress = async (value, type = "admin", column = "address") => {
        try {
            if (!value) {
                console.error((column == "email" ? "Email" : "Wallet Address")+' must be required!');
                return;
            }
            if (!['user', 'admin', "artist"].includes(type)) { 
                console.log('Invalid type!')
                return;
            }
            let data = {
                isApproved: true
            };
            switch (type) {
                case "admin":
                    data.role = "ADMIN";
                    break;
                case "artist":
                    data.role = "ARTIST";
                    break;
                default:
                    data.role = "USER";
                    break;
            }

            const collection = this.db.collection('users');
            let options = {
                ethAddress: value
            }
            if(column == "email") {
                options = {
                    email: value
                }
            }
            const result = await collection.find({
            }).toArray();
            if (result.length) {
                const user = result.shift();
                const res = await collection.updateOne(
                    {
                        _id: new ObjectId(user._id)
                    },
                    {
                        $set: data
                    }
                )
                if (res.acknowledged) {
                    console.log('Data updates successfully!');
                }
            } else {
                console.log("No Data Found!")
            }
        } catch (e) {
            console.log(e);
        }
    }

    createOrUpdateUserByEmail = async (email, type = "user", canUpdate = false) => {
        try {
            if (!this.validateEmail(email)) { 
                console.error('Invalid email!');
                return;
             }
            if (!['user', 'admin', "artist"].includes(type)) { 
                console.error('Invalid role!');
                return;
            };
            let plainPassword = Hash.getRandomPassword();
            if(typeof canUpdate == "boolean") {
                canUpdate = canUpdate;
            } else {
                plainPassword = canUpdate;
                canUpdate = false;
            }
            let name = (email.split("@"))[0] || "";
            const password = await Hash.make(plainPassword);
            let data = {
                name,
                email,
                password,
                ethAddress: "",
                username: name.substring(0, 5)+(new Date()).getTime(),
                description: "",
                colors: [],
                accounts: [],
                socialLinks: {},
                isVarified: true,
                theme: "light",
                banner: null,
                image: null,
                authData: {},
                isApproved: true,
                canAdminApprove: false,
                isMarketplaceAdmin: false,
                rememberToken: "",
                status: true,
                createdBy: "",
                updatedBy: "",
                createdAt: new Date(),
                updatedAt: new Date()
            };
            switch (type) {
                case "admin":
                    data.role = "ADMIN";
                    break;
                case "artist":
                    data.role = "ARTIST";
                    break;
                default:
                    data.role = "USER";
                    break;
            }
            const collection = this.db.collection('users');
            const result = await collection.find({ email }).toArray();
            const user = result.length ? result.shift() : false;
            if (user) {
                if(canUpdate) {
                    const updateInputData = {
                        role: data.role,
                        isApproved: true,
                        isVarified: true,
                    }
                    if(!user.password) {
                        updateInputData.password = password;
                    }
                    const res = await collection.updateOne(
                        {
                            _id: new ObjectId(user._id)
                        },
                        {
                            $set: updateInputData
                        })
                    if (res.acknowledged) {
                        console.log(`${email} email is updated with ${type} role${!user.password ? ` and password is ${plainPassword}` : ""}!`);
                    }
                } else {
                    console.log("User already exist in the database!")
                }
            } else {
                const res = await collection.insertOne(data)
                if (res.insertedId.toString()) {
                    console.log(`New ${type} is created with ${email} email and password is ${plainPassword}`);
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    validateEmail(email) {
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailReg.test(email);
    }

}

module.exports = User;