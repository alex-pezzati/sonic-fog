import React from 'react'

import {useDispatch} from 'react-redux'
import {setKeyWord} from '../../../store/song'


const SearchBar = () => {

  const dispatch = useDispatch()

  const debounce = (callback, wait) => {
    let timeoutId = null;

    // This is what debouncedSearch is equal too. E gets passed into this as one of the args
    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback.apply(null, args);
      }, wait);
    };

  }

  const search = async (e) => {
    const keyword = e.target.value
    dispatch(setKeyWord(keyword))
  }
  const debouncedSearch = debounce(search, 250)

  return (
    <div>
      <form onSubmit={e => e.preventDefault()}>
        <input
          type='search'
          placeholder='search for songs'
          onChange={e => debouncedSearch(e)}
        >
        </input>
      </form>
    </div>
  )
}

export default SearchBar
