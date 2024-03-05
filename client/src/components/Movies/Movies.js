import React, { useState, useEffect } from 'react';
import './Movies.css';
import { AddMovie, GetAllMovies } from '../../apicalls/movies';
import { Col, Row } from 'antd';

const Movies = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movieName, setMovieName] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [movies, setMovies] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await GetAllMovies();
        if (response.success) {
          setMovies(response.data);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }
    fetchMovies();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const movieData = {
      title: movieName,
      poster: posterUrl
    };
    try {
      const response = await AddMovie(movieData);
      if (response.success) {
        console.log("Movie added successfully");
        // Refresh movies list after adding a movie
        const updatedMovies = [...movies, movieData];
        setMovies(updatedMovies);
      }
    } catch (error) {
      console.error("Error adding movie:", error);
    }
    // Clear form values
    setMovieName('');
    setPosterUrl('');
    handleCloseModal(); // Close the modal after submission
  };

  return (
    <div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Movie</h2>
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="movieName">Title:</label>
                <input
                  type="text"
                  id="movieName"
                  placeholder="Enter Movie Name"
                  value={movieName}
                  onChange={(e) => setMovieName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="posterUrl">URL:</label>
                <input
                  type="text"
                  id="posterUrl"
                  placeholder="Enter Poster URL"
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <button type="submit">Submit</button>
                <button type="button" className="cancel-button" onClick={handleCloseModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="button-container">

        <input type="text" className="input" placeholder="Search for movies"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)} />
        <button className="add-movies-button" onClick={handleOpenModal}>Add Movies</button>
      </div>
      <h1 className="text-sm uppercase mb-2">Current Movies in Database & Add More by Button</h1>

      <div className="movies-container">
        <Row gutter={[20]} className="mt-2">
          {movies

            .filter((movie) =>
              movie.title.toLowerCase().includes(searchText.toLowerCase())
            )

            .map((movie) => (
            
                <Col span={4}>
                  <div
                    style={{ maxWidth: "190px" }}
                    className="card flex flex-col gap-3"
                  >
                    <div className="poster-container cursor-pointer" >
                      <img src={movie.poster} alt="" height={200} width={190} />
                    </div>
                    <div className="flex justify-center p-1">
                      <h1 className="text-md uppercase">{movie.title}</h1>
                    </div>
                  </div>
                </Col>
              ))
              
             }
        </Row>
      </div>
    </div>
  );
};

export default Movies;
