const express = require('express');

const app = express();


app.use("/user", (req, res) => {
    res.send("HAHAHAHAHAHA");
});


//This will only handle GET call to /user
app.get("/user", (req, res) => {
    res.send({ firstName: "Rohit", lastName: "Singh"});
});
//This will match all the http method API calss to /test

app.post("/user", (req, res) => {
    // save data to DB
    res.send("Data successfully saved to the database!");
});

app.delete("/user", (req, res) => {
    res.send("Deleted successfully");
})
app.use("/test", (req, res) => {
    res.send("Hello from the server!");
});

app.listen(3000, () =>{
    console.log("Server is successfully listening on port 3000... ");
});