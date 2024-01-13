require('dotenv').config()

const express = require("express");
const https = require("https");
// const request = require("request"); // Request not working on new Node.js and Express.
const bodyParser = require("body-parser");

const apiKey = process.env.API_KEY;
const userId = process.env.USER_ID;

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true})); // to get value from input field on html file.
app.use(express.static("public")); // to access the css files & images on public folder.

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = `https://us13.api.mailchimp.com/3.0/lists/${userId}`;

    const options = {
        method: "POST",
        auth: `akio:${apiKey}`
    }

    const request = https.request(url, options, function(response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res) {
    res.redirect("/")
})

app.listen(port, function() {
    console.log(`Server is running on port ${port}`);
})

