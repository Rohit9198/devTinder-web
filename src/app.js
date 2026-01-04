const express = require('express');

const app = express();

app.get("/user", (req, res) => {
    res.send({ firstName: "Rohit", lastName: "Singh"});
});

app.listen(3000, () =>{
    console.log("Server is successfully listening on port 3000... ");
});