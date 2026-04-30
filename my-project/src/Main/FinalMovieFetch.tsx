import { useContext, useEffect, useRef } from 'react';
import { movieContext } from '../Context/MovieContext';
import axios from 'axios';

const MOVIES_PER_PAGE = 16;
const MAX_DISCOVER_PAGES_PER_BATCH = 5;

const FinalMovieFetch = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const nextHomeDiscoverPage = useRef(1);
  const isFetchingRef = useRef(false);
  const finalContext = useContext(movieContext);
  if (!finalContext) throw new Error("Context not found");

  const {
    isOlder,
    loading,
    setloading,
    page,
    movieDetail,
    selectedGenre,
    selectedYear,
    setmovieDetail,
    setdisplayMode,
    mode
  } = finalContext;

  useEffect(() => {
    if (mode === "search") return;
    fetchMovies();
  }, [page, selectedGenre, selectedYear, isOlder, mode]);

  async function fetchMovies() {
    if (loading || isFetchingRef.current) return;

    isFetchingRef.current = true;
    setloading(true);
    const hasActiveFilter = selectedGenre.length > 0 || selectedYear !== null || isOlder;
    const nextDisplayMode = hasActiveFilter ? "filter" : "home";
    const shouldAppend = nextDisplayMode === "home" && page > 1;

    if (nextDisplayMode !== "home" || !shouldAppend) {
      nextHomeDiscoverPage.current = 1;
    }

    const getParams = (discoverPage: number) => {
      const params: any = {
        api_key: apiKey,
        page: discoverPage,
      };

      if (selectedGenre.length) {
        params.with_genres = selectedGenre.join(",");
      }

      if (isOlder) {
        params["primary_release_date.lte"] = "2022-01-01";
      } else if (selectedYear) {
        params.primary_release_year = selectedYear;
      }

      return params;
    };

    try {
      let movies: any[] = [];

      if (nextDisplayMode === "home") {
        const existingIds = new Set(shouldAppend ? movieDetail.map((m) => m.id) : []);
        let discoverPage = shouldAppend ? nextHomeDiscoverPage.current : 1;
        let totalPages = discoverPage;
        let pagesChecked = 0;

        while (
          movies.length < MOVIES_PER_PAGE &&
          discoverPage <= totalPages &&
          pagesChecked < MAX_DISCOVER_PAGES_PER_BATCH
        ) {
          const res = await axios.get(
            "https://api.themoviedb.org/3/discover/movie",
            { params: getParams(discoverPage) }
          );

          totalPages = res.data.total_pages ?? discoverPage;
          pagesChecked += 1;
          console.log(`TMDB returned: ${res.data.results.length} movies (page ${discoverPage})`);

          for (const movie of res.data.results) {
            if (!existingIds.has(movie.id)) {
              existingIds.add(movie.id);
              movies.push(movie);
            }

            if (movies.length === MOVIES_PER_PAGE) break;
          }

          discoverPage += 1;
        }

        nextHomeDiscoverPage.current = discoverPage;
      } else {
        const res = await axios.get(
          "https://api.themoviedb.org/3/discover/movie",
          { params: getParams(page) }
        );

        console.log(`TMDB returned: ${res.data.results.length} movies (page ${page})`);
        movies = res.data.results.slice(0, MOVIES_PER_PAGE);
      }

      const detailedMovies = await Promise.all(
        movies.map(async (movie: any) => {
          const detailRes = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie.id}`,
            { params: { api_key: apiKey } }
          );

          return {
            ...movie,
            runtime: detailRes.data.runtime,
          };
        })
      );

      setmovieDetail((prev: any[]) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const newMovies = shouldAppend
          ? detailedMovies.filter((m) => !existingIds.has(m.id))
          : detailedMovies;

        console.log(`Adding ${newMovies.length} new movies to context`);

        return shouldAppend
          ? [...prev, ...newMovies]
          : newMovies;
      });
      setdisplayMode(nextDisplayMode);

    } catch (error) {
      console.error("Fetch failed", error);
    } finally {
      isFetchingRef.current = false;
      setloading(false);
    }
  }

  return <div />;
};

export default FinalMovieFetch;
