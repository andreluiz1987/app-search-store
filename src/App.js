import React, { useEffect, useState } from "react";
import './css/custom.css'
import { facets as facetService, search as searchService, autocomplete as autocompleteService } from "./services/movies";
import { useNavigate } from 'react-router-dom';

function App() {
  const [facets, setFacets] = useState();
  const [movies, setMovies] = useState();
  const [moviesResponse, setMoviesResponse] = useState();
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [genres, setGenres] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    facetService("/facets?text=").then(response => setFacets(response.data));
  }, []);

  useEffect(() => {
    searchService(`/search?size=10&text=`).then(response => {
      setMoviesResponse(response.data)
      setMovies(response.data.movies)
    })
  }, []);

  const onSuggestionHanlder = () => {
    if (moviesResponse.suggestion != "") {
      searchService(`/search?size=10&text=${moviesResponse.suggestion}`).then(response => {
        setMoviesResponse(response.data)
        setMovies(response.data.movies)
      })
      facetService(`/facets?text=${moviesResponse.suggestion}`).then(response => {
        setFacets(response.data)
      })
      setText(moviesResponse.suggestion)
    }
  }

  const onShowMoreHandler = () => {
    var lastItem = movies[movies.length - 1]
    searchService(`/search?size=10&text=${text}&searchAfterScore=${lastItem?.search_after[0]}&searchAfterCode=${lastItem?.search_after[1]}`).then(response => {
      response.data.movies.forEach(element => {
        movies.push(element)
      });
      setMovies(movies.map((item, index) => ({ ...item, value: movies[index] })))
    })

  }

  const onChangeHandlerAutocomplete = (text) => {
    setText(text)
    autocompleteService(`/autocomplete?size=10&text=${text}`).then(response => {
      setSuggestions(response.data)
    })
  }

  const onClickMovie = (code) => { navigate(`/movies/${code}`, { replace: "/" })}

  const onChangeHandlerFacets = (filter, type) => {
    if (type == "genres") {
      if (genres.includes(filter)) {
        genres.pop(filter)
      } else {
        genres.push(filter)
      }
    }
    if (type == "certificates") {
      if (certificates.includes(filter)) {
        certificates.pop(filter)
      } else {
        certificates.push(filter)
      }
    }
    searchService(`/search?size=10&text=${text}&genres=${genres}&certificates=${certificates}`).then(response => {
      setMoviesResponse(response.data)
      setMovies(response.data.movies)
    })
    facetService(`/facets?text=${text}&genres=${genres}&certificates=${certificates}`).then(response => {
      setFacets(response.data)
    })
  }

  const onSearchSubmit = (e) => {
    e.preventDefault();
    var term = e.target[0].value
    setSuggestions([])
    setGenres([])
    setCertificates([])
    searchService(`/search?size=10&text=${term}`).then(response => {
      setMoviesResponse(response.data)
      setMovies(response.data.movies)
    })
    facetService(`/facets?text=${term}`).then(response => {
      setFacets(response.data)
    })
  }

  const onSuggestionHandler = (term) => {
    setSuggestions([])
    setText(term)
    searchService(`/search?size=10&text=${term}`).then(response => {
      setMoviesResponse(response.data)
      setMovies(response.data.movies)

    })
    facetService(`/facets?text=${term}`).then(response => {
      setFacets(response.data)
    })
  }

  const SuggestionWrapper = ({ suggestions }) => {
    return (
      <div>
        {
          suggestions?.map(suggestion => {
            return <div className="suggestion" onClick={() => onSuggestionHandler(suggestion)}>{suggestion}</div>
          })
        }
      </div>
    )
  }

  const onCheckFilterActive = (filter, type) => {
    if (type == 'genres' && genres.includes(filter.name)) {
      return true
    }
    if (type == 'certificates' && certificates.includes(filter.name)) {
      return true
    }
  }

  const FilterWrapper = ({ filters, type }) => {
    return (
      <div className="Filter">
        {
          filters?.map(filter => {
            var isChecked = onCheckFilterActive(filter, type)
            return <div>
              <label class="custom-control custom-checkbox">
                <input type="checkbox" checked={isChecked} onClick={() => onChangeHandlerFacets(filter.name, type)}
                  class="custom-control-input" />
                <div class="custom-control-label">{filter.name}
                  <b class="badge badge-pill badge-light float-right">
                    {filter.quantity}
                  </b> </div>
              </label>
            </div>
          })
        }
      </div>
    )
  }

  const MovieGridWrapper = ({ movies }) => {
    return (
      <div className="moviesGrid">
        {
          movies?.map(movie => {
            return <div>
              <figure onClick={() => onClickMovie(movie.code)} class="card card-product-grid" style={{ 'flex-direction': 'inherit', 'cursor': 'pointer' }}>
                <div>
                  <img src={movie?.avatar} style={{ 'width': '140px', 'height': '100%' }} /></div>
                <figcaption class="info-wrap">
                  <div class="fix-height" style={{ 'marginLeft': '10px', 'height': '100%' }} >
                    <strong>{movie?.title}</strong>
                    <div class="mt-2">
                      <span class="font-weight-bold">Rating: </span>
                      <span class="text-justify">{movie?.rating}</span>
                    </div>
                    <div class="mt-4">
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
                      <span class="font-weight-bold">Certificate:</span>
                      <span class="text-justify bold"> {movie?.certificate}</span>
                    </div>
                  </div>
                </figcaption>
              </figure></div>
          })
        }
      </div>
    )
  }

  const onSelectChange = (event) => {
    searchService(`/search?size=10&text=${text}&sort=${event.target.value}&genres=${genres}&certificates=${certificates}`).then(response => {
      setMoviesResponse(response.data)
      setMovies(response.data.movies)
    })
  }

  return (
    <div className="App">
      <header class="section-header">
        <section class="header-main border-bottom">
          <div class="container">
            <div class="row align-items-center">
              <div class="col-lg-2 col-4">
                <a class="brand-wrap" >
                  Search Store
                </a>
              </div>
              <div class="col-lg-6 col-sm-12">
                <form action="#" onSubmit={onSearchSubmit} class="search">
                  <div class="input-group w-100">
                    <input type="text" class="form-control input"
                      value={text}
                      onChange={e => onChangeHandlerAutocomplete(e.target.value)} placeholder="Search" />
                    <div class="input-group-append">
                      <button class="btn btn-primary" type="submit">
                        <i class="fa fa-search"></i>
                      </button>
                    </div>
                  </div>
                  <SuggestionWrapper suggestions={suggestions} />
                </form>
              </div>
            </div>
          </div>
        </section>
      </header>

      <section class="section-content padding-y">
        <div class="container">

          <div class="row">
            <aside class="col-md-3">

              <div class="card">
                <article class="filter-group">
                  <header class="card-header">
                    <a href="#" data-toggle="collapse" data-target="#collapse_1" aria-expanded="true" class="">
                      <i class="icon-control fa fa-chevron-down"></i>
                      <h6 class="title">Genre</h6>
                    </a>
                  </header>
                  <div class="filter-content collapse show" id="collapse_1">
                    <div class="card-body">
                      <FilterWrapper filters={facets?.agg_genre} type="genres" />
                    </div>
                  </div>
                </article>
                <article class="filter-group">
                  <header class="card-header">
                    <a href="#" data-toggle="collapse" data-target="#collapse_2" aria-expanded="true" class="">
                      <i class="icon-control fa fa-chevron-down"></i>
                      <h6 class="title">Certificate </h6>
                    </a>
                  </header>
                  <div class="filter-content collapse show" id="collapse_2">
                    <div class="card-body">
                      <FilterWrapper filters={facets?.agg_certificate} type="certificates" />
                    </div>
                  </div>
                </article>
              </div>

            </aside>
            <main class="col-md-9">

              <header class="border-bottom mb-4 pb-3">
                <div class="form-inline">
                  <span class="mr-md-auto">{moviesResponse?.total} Movies found </span>
                  <select class="mr-2 form-control" onChange={onSelectChange} defaultValue='most_popular'>
                    <option value="most_popular">Most Popular</option>
                    <option value="best_rating">Best Rating</option>
                  </select>
                </div>
                {
                  moviesResponse?.suggestion != "" &&
                  <span class="mr-md-auto">Did you mean
                <a href="#" onClick={() => onSuggestionHanlder()} class="mr-md-auto"> {moviesResponse?.suggestion}
                    </a>?</span>
                }

              </header>

              <div class="row">
                <div class="col-md-12">
                  <MovieGridWrapper movies={movies} />
                </div>
              </div>
              {moviesResponse?.total > 10 && <input class="btn btn-primary" onClick={e => onShowMoreHandler()} type="button" value="Show more" />}
            </main>

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

export default React.memo(App);
