'use client'

import { useState, useEffect } from 'react'
import PromptCard from './PromptCard'

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  )
}

const Feed = () => {

  const [posts, setPosts] = useState([])
  const [searchText, setSearchText] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [searchResults, setSearchResults] = useState([])

  const filterPrompts = (searchText) => {
    const regex = new RegExp(searchText, 'i'); // 'i' = case-insensitive search

    return posts.filter((post) => 
      regex.test(post.creator.username) ||
      regex.test(post.prompt) ||
      regex.test(post.tag)
    )
  }

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(setTimeout(() => {
      setSearchResults(filterPrompts(e.target.value));
    }, 500)); // search executes 500ms after user stops typing
  }

  const handleTagClick = (tag) => {
    setSearchText(tag);

    const searchResults = filterPrompts(tag);
    setSearchResults(searchResults);
  }

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/prompt');
      const data = await response.json();
      
      setPosts(data);
    }

    fetchPosts();
  }, [])
  

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input type='text' placeholder='Search for a tag or a username' required
          value={searchText} className='search_input peer' onChange={handleSearchChange} />
      </form>

      {searchText ? (
        <PromptCardList 
          data = {searchResults}
          handleTagClick = {handleTagClick}
        />
      ): (
        <PromptCardList 
          data = {posts}
          handleTagClick = {handleTagClick}
        />
      )}
      
    </section>
  )
}

export default Feed