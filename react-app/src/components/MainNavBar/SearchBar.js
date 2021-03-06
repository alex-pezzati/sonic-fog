import React from 'react';

import { useDispatch } from 'react-redux';
import { setKeyWord } from '../../store/song';

import c from './MainNavBar.module.css';

const SearchBar = () => {
    const dispatch = useDispatch();

    const debounce = (callback, wait) => {
        let timeoutId = null;

        // This is what debouncedSearch is equal too. E gets passed into this as one of the args
        return (...args) => {
            window.clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => {
                callback.apply(null, args);
            }, wait);
        };
    };

    const search = async (e) => {
        e.preventDefault();
        const keyword = e.target.value;
        dispatch(setKeyWord(keyword));
    };
    const debouncedSearch = debounce(search, 250);

    return (
        <div className={c.search}>
            <form className={c.search__form} onSubmit={e => e.preventDefault()}>
                <input
                    className={c.search__input}
                    autoComplete={false}
                    onChange={(e) => debouncedSearch(e)}
                    placeholder="Search for Music!"
                    type="search"
                ></input>
                <button
                    className={c.search__submit}
                    onClick={(e) => e.preventDefault()}
                    type="submit"
                ></button>
            </form>
        </div>
    );
};

export default SearchBar;
