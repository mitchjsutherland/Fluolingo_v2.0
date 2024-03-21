const LocalStrategy = require("passport-local").Strategy;

const { authenticate } = require("passport");

const {pool} = require("./dbConfig");

const bcrypt = require("bcrypt");

function initialise( passport){

    const authenticateUser = (email, password, done) => {

        pool.query(

            //first argument is SQL query

            `SELECT * FROM users WHERE email = $1`,

            //second argument array of variables we want to pass to query string

            [email],

            // callback function called after query is completed

            (err, results) => {

                if(err){


                    return done(err);

                }

                if (results.rows.length === 0) {
                    // Email is not registered
                    return done(null, false, { message: "Email is not registered" });
                }

                //if the user was found in the database

                if(results.rows.length > 0){

                    //results is array returned after querying database 

                    //we want first element of this array which is user object

                    const user = results.rows[0];

                    //check if password entered when loging in is the password assigned to the user

                    bcrypt.compare(password, user.password, (err, isMatch) => {

                        if(err){

                            return done(err);

                        }

                        //passwords match

                        if(isMatch){

                            //first parameter is for errors

                            //second parameter will store the user and return to session cookie

                            return done(null, user);

                        }

                        //passwords don't match

                        else{

                             return done(null, false, { message: "Password is incorrect"})    

                        }

                    }); //bcrypt.compare end

                }

                //the user wasn't found in the database

                else{

                    return done(null, false, {message: "Email is not registered"})

                }

            }

        ) // end of pool.query

    }

    passport.use(

        new LocalStrategy(
            
            {

            usernameField: "email",

            passwordField: "password"

            }
        
        ,   authenticateUser)

    );

    //take the user and store their id in session cookie?

    passport.serializeUser((user, done) => done(null, user.id));

    //this method uses that id to obtain the user and to them in session

    passport.deserializeUser((id, done) => {

        pool.query(

            `SELECT * FROM users WHERE id = $1`,
            
            [id],

            (err, results) => {

                if(err){

                    return done(err);

                }

                return done(null, results.rows[0]);
            }

        )

    }); //end of passport.deserializeUser

}

module.exports = initialise;