const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");

// GET /api/profile/view
profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const user = req.user; // decoded user from JWT
    res.json(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// PATCH /api/profile/edit
profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    // Update allowed fields
    Object.keys(req.body).forEach(key => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
