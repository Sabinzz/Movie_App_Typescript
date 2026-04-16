import { Icon } from '@iconify/react'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { movieContext } from '../Context/MovieContext'
import FinalMovieFetch from '../Main/FinalMovieFetch'

interface filterProps {
  id: number
  name: string
}

const Filter = () => {
  const [genre, setgenre] = useState<filterProps[]>([])
  const [, seterror] = useState<boolean>(false)
  const contextYear = useContext(movieContext)
  if (!contextYear) throw new Error("shit Year")
  const { selectedYear, setselectedYear, isOlder, setisOlder } = contextYear

  const context = useContext(movieContext)
  if (!context) throw new Error("shit Genre")
  const { selectedGenre, setselectedGenre } = context

  useEffect(() => {
    const filterGenre = async () => {
      try {
        seterror(false)
        const res = await axios.get("https://api.themoviedb.org/3/genre/movie/list", {
          params: { api_key: '50e506c1eb5aff5ab14c27ea3bebb47e' }
        })
        setgenre(res.data.genres)
      } catch (error) {
        seterror(true)
      }
    }
    filterGenre()
  }, [])

  function handleGenreChange(id: number) {
    setselectedGenre((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const years = [2026, 2025, 2024, 2023, 2022]

  return (
    <div className='flex flex-col px-4 sm:px-10 pt-4 gap-4'>

      <hr className='border border-gray-900' />

      {/* Released */}
      <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3'>
        <h1 className='text-(--text) shrink-0'>Released:</h1>
        <div className='flex flex-wrap gap-x-4 gap-y-2'>
          {years.map((year) => (
            <div key={year} className='flex gap-2 items-center text-[15px]'>
              <input
                checked={selectedYear === year}
                onChange={() => { setselectedYear(year); setisOlder(false) }}
                name='Year-Radio'
                type="radio"
                id={String(year)}
              />
              <label htmlFor={String(year)} className='text-[#485C67]'>{year}</label>
            </div>
          ))}
          <div className='flex gap-2 items-center text-[15px]'>
            <input
              checked={isOlder}
              onChange={() => { setisOlder(true); setselectedYear(null) }}
              name='Year-Radio'
              type="radio"
              id='Older'
            />
            <label htmlFor="Older" className='text-[#485C67]'>Older</label>
          </div>
        </div>
      </div>

      <hr className='border border-gray-900' />

      {/* Genre */}
      <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 items-start'>
        <h1 className='text-(--text) shrink-0'>Genre:</h1>
        <div className='flex flex-wrap gap-x-3 gap-y-2 items-center'>
          {genre.map((genre) => (
            <div key={genre.id} className='flex gap-2 items-center'>
              <input
                checked={selectedGenre.includes(genre.id)}
                onChange={() => handleGenreChange(genre.id)}
                type="checkbox"
                name="genre"
                id={String(genre.id)}
              />
              <label className='text-[#485C67] text-sm sm:text-base' htmlFor={String(genre.id)}>
                {genre.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <hr className='border border-gray-900' />

      {/* Buttons */}
      <div className='flex gap-2 pb-2'>
        <FinalMovieFetch />
        <div className='relative group cursor-pointer'>
          <button className='group-hover:text-white bg-[#1D2C42] h-7 w-22 pl-5 text-(--elements) rounded-xl transition-colors duration-200'>
            Close
          </button>
          <Icon
            icon="charm:cross"
            className='group-hover:text-white absolute top-1 -translate-x-1 left-3 text-[#6C757D] transition-colors duration-200'
            fontSize={22}
          />
        </div>
      </div>

    </div>
  )
}

export default Filter