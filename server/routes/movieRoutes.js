const router = require("express").Router();
const Movie = require("../models/movieModel.js");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add-movie", authMiddleware, async (request, response) => {
  try {
    const newMovie = new Movie(request.body);
    await newMovie.save();
    return response.status(200).json({
      success: true,
      message: "Movie added successfully"
    });
  } catch (err) {
    response.status(500).json({
      success: false,
      message: err.message
    });
  }
});

router.get("/get-all-movies", authMiddleware, async (_, response) => {
  try {
    const movies = await Movie.find();
    return response.json({
      success: true,
      message: "Movies Fetched Successfully",
      data: movies
    });
  } catch (err) {
    return response.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;