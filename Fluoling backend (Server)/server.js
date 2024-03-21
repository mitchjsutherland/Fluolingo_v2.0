const express = require("express");

const app = express();

const { pool } = require("./dbConfig");

const bcrypt = require("bcrypt");

const session = require("express-session");

const flash = require("express-flash");

const bodyParser = require("body-parser");

const cors = require('cors');

const passport = require("passport");

const initialisePassport = require("./passportConfig");

app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your frontend origin
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

//necessary to maintain authentication across multiple requests

initialisePassport(passport);

//referencing env variable port used in a production or port 4000 in dev mode

const PORT = 4000; 

//middleware



//app.use(express.json());

//necessary to render ejs files

//use ejs as view engine

app.set("view engine", "ejs");

//allow data transfer from front end to a server

app.use(express.urlencoded({extended: false}));

app.use(bodyParser.json());

app.use(session({

  //usually kept in env variable used for data encryption

  secret: "secret",

  //should we save again our session if nothing has changed

  resave: false,

  //This option determines whether a session should be created for an unauthenticated user

  saveUninitialized: false

}));

//we allow the app to use this passport

app.use(passport.initialize());

app.use(passport.session());

app.use(flash());


//creating routes to all pages defined in views folder

//what happens when we get to the root directory of the app

app.get("/", (req, res) => {

  //it knows to look for the file (ejs file) in views folder

  res.render("index");

});
                          //if the user goes to this route first we're checking if

                          //they are already authenticated/logged in

app.get("/api/users/register", checkNotAuthenticated, (req, res) => {
  // User is not authenticated, send JSON response with error message
  res.status(401).json({ message: "Unauthorized" });
});

//do I have to pass req argument if not used?

app.get("/api/users/login", checkAuthenticated, (req, res) => {
  // User is not authenticated, send JSON response with error message
  res.status(401).json({ message: "Unauthorized" });
});

app.get("/api/users/dashboard", checkAuthenticated, async (req, res) => {
  

    // Send JSON response with the user data
    res.status(200).json({ success: true});
  
});

app.post("/api/users/userData", async (req, res) => {
  try {
    // Extract email from query parameters or route parameters
    const userEmail = req.body.email;

    //console.log(req);
    console.log(req.body);

    // Check if userEmail is provided and handle the case if it's missing
    if (!userEmail) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    // Execute SQL query to retrieve user from the database
    const userQueryResult = await pool.query('SELECT * FROM users WHERE email = $1', [req.body.email]);

    // Check if the user exists in the database
    if (userQueryResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Extract the user from the result object
    const user = userQueryResult.rows[0];

    console.log(user);

    // Send JSON response with the user data
    res.status(200).json({ success: true, user: user });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve user data' });
  }
});

app.post("/api/users/logout", (req, res) => {
  req.logout(() => {
    res.json({ success: true, redirect: "http://localhost:5173/" });
  });
});


app.get("/api/words", (req,res) => {

  pool.query(

    `SELECT * FROM questions`,

    (err, results) => {

      if(err){

        throw err;

      }

      const words = results.rows.map(row => ({
        english_search_term: row.vocabulary_word_en,
        correct_answer: {
          french: row.french_correct,
          czech: row.czech_correct,
          turkish: row.turkish_correct
        },
        incorrect_answers: {
          french: [row.french_false_1, row.french_false_2, row.french_false_3],
          czech: [row.czech_false_1, row.czech_false_2, row.czech_false_3],
          turkish: [row.turkish_false_1, row.turkish_false_2, row.turkish_false_3]
        }
      }));

      res.json(words); // Send the words data as JSON response
    }
  );
});


app.get("/api/words/english", (req,res) => {

  pool.query(

    //`SELECT vocabulary_word_en, czech_correct, french_correct, turkish_correct  FROM questions`,

    `SELECT vocabulary_word_en FROM questions`,

    (err, results) => {

      if(err){

        throw err;

      }

      //const words = results.rows.map(row => [row.vocabulary_word_en, row.french_correct, row.czech_correct,row.turkish_correct]);

      const words = results.rows.map(row => row.vocabulary_word_en);


      console.log(words)

      res.json(words);

    }

  );

});

app.get("/api/words/french", (req,res) => {

  pool.query(

    //`SELECT vocabulary_word_en, czech_correct, french_correct, turkish_correct  FROM questions`,

    `SELECT french_correct FROM questions`,

    (err, results) => {

      if(err){

        throw err;

      }

      //const words = results.rows.map(row => [row.vocabulary_word_en, row.french_correct, row.czech_correct,row.turkish_correct]);

      const words = results.rows.map(row => row.french_correct);


      console.log(words)

      res.json(words);

    }

  );

});

app.get("/api/words/turkish", (req,res) => {

  pool.query(

    //`SELECT vocabulary_word_en, czech_correct, french_correct, turkish_correct  FROM questions`,

    `SELECT turkish_correct FROM questions`,

    (err, results) => {

      if(err){

        throw err;

      }

      //const words = results.rows.map(row => [row.vocabulary_word_en, row.french_correct, row.czech_correct,row.turkish_correct]);

      const words = results.rows.map(row => row.turkish_correct);


      console.log(words)

      res.json(words);

    }

  );

});

app.get("/api/words/czech", (req,res) => {

  pool.query(

    //`SELECT vocabulary_word_en, czech_correct, french_correct, turkish_correct  FROM questions`,

    `SELECT czech_correct FROM questions`,

    (err, results) => {

      if(err){

        throw err;

      }

      //const words = results.rows.map(row => [row.vocabulary_word_en, row.french_correct, row.czech_correct,row.turkish_correct]);

      const words = results.rows.map(row => row.czech_correct);


      console.log(words)

      res.json(words);

    }

  );

});



//define register route

app.post("/api/users/register", async (req,res) => {

  console.log(req.body);

  let { name, email, password, confirmPassword } = req.body;


  //any registration errors are gonna be pushed to this initially empty array

  let errors = [];

  console.log({

    name,

    email,

    password,

    confirmPassword

  });

  if (!name || !email || !password || !confirmPassword) {

    errors.push({ message: "Please enter all fields" });

  }

  

  if (password !== confirmPassword) {

    errors.push({ message: "Passwords do not match" });

  }

  

  if (password?.length < 6) {

    errors.push({ message: "Password should be at least 6 characters" });

  }

  // If there are errors 

  if (errors.length > 0) {

    // re-render the register page with error messages

    //bad request due to inocrrect or missing information submitted in the form

    return res.status(400).json({errors});
    
    //res.render("register", { errors });

  } 

  // If there are no errors, you can proceed with user registration
  
  else {
    
    //console.log("Registration successful!");

    let hashedPassword = await bcrypt.hash(password, 10);

    console.log(hashedPassword);

    //making sure new user registers with unique email address

    pool.query(

      `SELECT * FROM users

      WHERE email = $1`, [email], (err, results) => {

        if(err){

          throw err;

        }

        console.log(results.rows);

        if(results.rows.length > 0){

          errors.push({message: "Email already registered"});

          return res.status(400).json({errors});

        }

        //there's no user with this email in the database so can be registered

        else{

          pool.query(

            `INSERT INTO users (name, email, password)
            
             VALUES ($1, $2, $3) 

             RETURNING id, password`, [name, email, hashedPassword], 
             
             (err, results) => {

              if(err){

                throw err;

              }

              //pass a flash message to redirect page

              return res.status(200).json({message: "Registration successful"});

              //req.flash("success_msg", "You are now registered. Please log in.");

              //res.redirect("/users/login");

             }

          )

        }

      }

    );
    
  }

});

app.post(
  "/api/users/login",
  passport.authenticate("local", { session: true }),
  (req, res) => {
    // Successful authentication, send JSON response with success message

    const userEmail = req.body.email; // Extract email from request body
    console.log(userEmail);
    const redirectUrl = `http://localhost:5173/users/dashboard/${encodeURIComponent(userEmail)}`;
    //const redirectUrl = "http://localhost:5173/users/dashboard/"

    res.json({ success: true, email: userEmail });
  },
  (err, req, res, next) => {
    // Failed authentication, send JSON response with error message
    res.status(401).json({ success: false, message: err.message });
  }
);




function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    const userEmail = req.user.email;
    const url = `http://localhost:5173/users/dashboard/${userEmail}`;
    const redirectUrl = `http://localhost:5173/users/dashboard/${encodeURIComponent(userEmail)}`;

    return res.status(200).json({ message: "Authorised", url: url, userEmail: userEmail, redirect: redirectUrl });

    return next(); // User is authenticated, proceed to the next middleware
  }
  // User is not authenticated, send JSON response with error message
  return res.status(401).json({ message: "Unauthorized" });
}

function checkNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next(); // User is not authenticated, proceed to the next middleware
  }
  // User is authenticated, send JSON response with  message
  const userEmail = req.user.email;
  const redirectUrl = `http://localhost:5173/users/dashboard/${encodeURIComponent(userEmail)}`;

  return res.status(200).json({ message: "Authorised", redirect: redirectUrl });
}


app.listen(PORT, () =>{

  console.log(`Server running on port ${PORT}`);

});