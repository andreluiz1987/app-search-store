import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { searchMLT as searchMLTService, searchByCode as searchService } from "../services/movies";
import '../css/custom.css'
import { useNavigate } from 'react-router-dom';

function Movie() {
    const navigate = useNavigate();
    const { code } = useParams();
    const [movies, setMovies] = useState();
    const [movie, setMovie] = useState();

    useEffect(() => {
        searchMLTService(`/mlt?code=${code}`).then(response => {
            setMovies(response.data.movies)
        })
    }, []);

    useEffect(() => {
        searchService(`/${code}`).then(response => {
            setMovie(response.data)
        })
    }, []);

    const onClickHome = () => { navigate(`/`, { replace: "/" })}

    const RecommendationGridWrapper = ({ movies }) => {
        return (
            <div className="moviesGrid" class="mt-4">
                {
                    movies?.map(movie => {
                        return <div class="ml-4" style={{ 'float': 'right' }} >
                            <figure style={{ 'cursor': 'pointer' }}>
                                <div>
                                    <img src={movie?.avatar} style={{ 'width': '140px', 'height': '100%' }} /></div>
                                <figcaption class="info-wrap">
                                    <div class="fix-height" >
                                        <strong>{movie?.title}</strong>
                                        <div class="mt-2">
                                            <span class="font-weight-bold">Rating: </span>
                                            <span class="text-justify">{movie?.rating}</span>
                                        </div>
                                    </div>
                                </figcaption>
                            </figure>
                        </div>
                    })
                }
            </div>
        )
    }

    return (
        <div className="App">
            <header class="section-header">
                <section class="header-main border-bottom">
                    <div class="container">
                        <div class="row align-items-center">
                            <div class="col-lg-2 col-4">
                                <a class="brand-wrap"  style={{ 'cursor': 'pointer' }} onClick={()=>onClickHome()}>
                                    Search Store
                                </a>
                            </div>
                            <div class="col-lg-6 col-sm-12">
                                <form action="#" class="search">
                                    <div class="input-group w-100">
                                        <input type="text" class="form-control input"
                                            disabled placeholder="Search" />
                                        <div class="input-group-append">
                                            <button class="btn btn-primary" type="submit">
                                                <i class="fa fa-search"></i>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </header>
            <section class="section-content padding-y">
                <div class="container">
                    <div class="row">
                        <aside class="col-md-2">
                            <div>
                                <img src={movie?.avatar} style={{ 'width': '140px', 'height': '100%' }} />
                            </div>
                        </aside>
                        <main class="col-md-10">
                            <div class="fix-height" >
                                <h1>
                                <strong>{movie?.title}</strong></h1>
                            </div>
                            <div class="mt-1">
                                <span class="font-weight-bold">Overview: </span>
                                <span class="text-justify">{movie?.description}</span>
                            </div>
                            <div class="mt-1">
                                <span class="font-weight-bold">Cast:</span>
                                <span class="text-justify bold"> {movie?.actors?.join(", ")}</span>
                            </div>
                            <div class="mt-1">
                                <span class="font-weight-bold">Genre:</span>
                                <span class="text-justify bold"> {movie?.genre?.join(", ")}</span>
                            </div>
                            <div class="mt-1">
                                <span class="font-weight-bold">Director: </span>
                                <span class="text-justify">{movie?.director}</span>
                            </div>
                            <div class="mt-2">
                                <span class="font-weight-bold">Rating: </span>
                                <span class="text-justify">{movie?.rating}</span>
                            </div>
                            <div class="mt-1">
                                <span class="font-weight-bold">Runtime: </span>
                                <span class="text-justify">{movie?.runtime}</span>
                            </div>
                       </main>
                
                    <div class="row">
                        <div class="mt-5">
                            <h2>Recommedation</h2>
                            <RecommendationGridWrapper movies={movies} />
                        </div>
                    </div>
                </div>
                </div>
            </section>

            <footer class="section-footer border-top padding-y">
                <div class="container">
                    <p class="float-md-right">
                        &copy; Copyright 2021 All rights reserved
                  </p>
                    <p>
                        <a href="#">Terms and conditions</a>
                    </p>
                </div>
            </footer>


        </div>
    );
}


export default Movie;