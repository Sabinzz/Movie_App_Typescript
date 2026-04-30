import { Icon } from '@iconify/react';
import { useContext, useState } from 'react';
import Filter from './Filter';
import ShowMovie from './ShowMovie';
import { movieContext } from '../Context/MovieContext';

interface MovieDetailProps {
  movieDetail: any[];
  searchMovieName: string;
}

const ContentSection = ({ movieDetail, searchMovieName }: MovieDetailProps) => {
  const [filter, setfilter] = useState<boolean>(false);
  const contentContext = useContext(movieContext);

  if (!contentContext) {
    throw new Error('Content not found');
  }

  const { displayMode } = contentContext;

  const hasSearchTerm = !!searchMovieName?.trim();
  const isShowingSearchResults = displayMode === "search";
  const hasResults = Array.isArray(movieDetail) && movieDetail.length > 0;

  return (
    <div className='bg-(--bg) text-(--text) min-h-screen w-full'>
      
      <div className='flex justify-between px-10 pt-5'>
        
        <div>
          {/* 1. Popular Movies */}
          {displayMode === "home" && (
            <h1 className="text-(--text) text-xl">Popular Movies</h1>
          )}

          {/* 2. Search Results Heading */}
          {isShowingSearchResults && hasSearchTerm && (
            <h1 className="text-(--text) text-xl">
              {hasResults
                  ? `Search Results for: "${searchMovieName}"`
                  : `No results found for: "${searchMovieName}"`
              }
            </h1>
          )}

          {/* 3. Filter Mode */}
          {displayMode === "filter" && (
            <h1 className="text-(--text) text-xl">Browsing by Filter</h1>
          )}
        </div>

        {/* Filter Button - Always visible as you want */}
        <div
          onClick={() => setfilter(!filter)}
          className='h-7 cursor-pointer w-20 bg-[#141E2D] flex items-center pl-2 gap-1 hover:bg-[#1e2a3d] transition-colors'
        >
          <Icon className='text-zinc-200' fontSize={16} icon="mdi:filter" />
          <h1 className='text-zinc-200 text-sm'>FILTER</h1>
        </div>
      </div>

      {/* Filter Panel */}
      <div
        className={`px-2 overflow-hidden transition-all duration-300 ease-in-out ${
          filter ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <Filter />
      </div>

      {/* Movies */}
      <div>
        <ShowMovie movieDetail={movieDetail} />
      </div>
    </div>
  );
};

export default ContentSection;
