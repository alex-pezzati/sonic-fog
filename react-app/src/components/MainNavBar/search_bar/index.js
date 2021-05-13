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
    // if (!keyword) return;

    // const res = await fetch(`/api/songs/${keyword}`)
    // const songs = await res.json()

    dispatch(setKeyWord(keyword))
    // console.log(songs)
  }
  const debouncedSearch = debounce(search, 500)

  // searchBar.addEventListener('keyup', debounce(async event => {
//     const keyword = searchBar.value
//     if (keyword === '') {
//       outerContainer.innerHTML = originalProducts
//       addMoreContentBtns()
//       return
//     }

//     const products = await fetch(`/api/products/keyword=${keyword}`)
//     const jsonProducts = await products.json()
//     dayOfListing.innerText = 'Search Results:'

//     if (jsonProducts.length === 0) {
//       searchError.classList.add('productList_searchError')
//       searchError.innerText = `Sorry, we couldn't find any products matching "${keyword}"`
//       return
//     }
//     for (let i = 0; i < jsonProducts.length; i++) {
//       const product = jsonProducts[i]
//     }
// }

  return (
    <div>
      <form>
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
