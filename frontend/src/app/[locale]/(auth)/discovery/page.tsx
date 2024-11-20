'use client'
import { useState, useEffect } from 'react'
import { useSprings, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import MusicSlider from '@/components/MusicSlider'

const useCachedBooks = (query: string) => {
  const [books, setBooks] = useState<any[]>([])
  const cacheKey = `books-cache-${query}`

  useEffect(() => {
    const cachedData = localStorage.getItem(cacheKey)
    if (cachedData) {
      setBooks(JSON.parse(cachedData))
    } else {
      fetchBooks(query)
    }
  }, [query])

  const fetchBooks = async (query: string) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`
    const res = await fetch(url)
    const data = await res.json()

    // Cache the response for 24 hours in localStorage
    localStorage.setItem(cacheKey, JSON.stringify(data.items))
    setBooks(data.items)
  }
  return books
}

export default function SwipeCard() {
  const [gone, setGone] = useState(new Set()) // Track swiped cards
  const [currentIndex, setCurrentIndex] = useState(0)
  const userPreferences = {
    author: 'John',
  }
  const query = `subject:${userPreferences.author}`
  const books = useCachedBooks(query)

  const [springs, api] = useSprings(1, (index) => ({
    x: 0,
    y: 0,
    scale: 1,
    rot: 0,
    opacity: 1,
    immediate: false,
  }))

  const bind = useDrag(
    ({ offset: [x, y], velocity, movement: [mx, my], memo = { x, y } }) => {
      api.start({
        x: mx,
        y: my,
        rot: mx / 100,
        scale: 1 - Math.min(Math.abs(mx) / 500, 0.3),
        opacity: 1 - Math.min(Math.abs(mx) / 500, 0.5),
      })

      if (velocity > 1) {
        handleNextCard()
      }

      return memo
    },
    { filterTaps: true },
  )

  const handleLike = () => {
    handleNextCard()
  }

  const handleDislike = () => {
    handleNextCard()
  }

  const handleNextCard = () => {
    setGone((prev) => new Set(prev).add(currentIndex))
    setCurrentIndex((prevIndex) => prevIndex + 1)
  }

  if (currentIndex > books.length - 1) {
    return (
      <div className="relative w-full h-[400px] flex items-center justify-center ">
        <div className="absolute text-xl text-center text-gray-500">
          No more books!
        </div>
      </div>
    )
  }

  const book = books[currentIndex]
  const truncatedText =
    book?.volumeInfo?.description?.length > 200
      ? book?.volumeInfo?.description.slice(0, 200) + '...'
      : book?.volumeInfo?.description
      ? book?.volumeInfo?.description
      : ''

  const rating = '4.5'

  return (
    <div className="card">
      <div className="relative h-[500px] flex items-center justify-center">
        <animated.div
          key={currentIndex}
          {...bind()}
          style={{
            transform: springs[0].x.to(
              (x) => `translate3d(${x}px, 0, 0) rotate(${springs[0].rot}deg)`,
            ),
            scale: springs[0].scale,
            opacity: springs[0].opacity,
          }}
          className="absolute w-[800px] h-[500px] bg-[#ef4a75] rounded-xl shadow-lg cursor-pointer transition-all duration-200"
        >
          {/* Two Column Layout */}
          <div className="flex w-full h-full">
            {/* First Column */}
            <div className="w-2/5 p-2">
              <img
                src={book?.volumeInfo?.imageLinks?.thumbnail.replace(
                  'zoom=1',
                  'zoom=4',
                )}
                alt={book.title}
                className=" w-full  h-full rounded-lg "
              />
            </div>

            {/* Second Column  */}
            <div className="w-3/5 p-2 ">
              <div className="bg-yellow-300  p-2 rounded-lg mb-1 min-h-60 ">
                <p className="text-gray-600 leading-relaxed text-lg break-words pb-4 ">
                  {truncatedText}
                </p>

                <div className="flex items-center space-x-2">
                  <span className="text-white text-xs p-1 bg-pink-300 rounded-lg">
                    ⭐ {rating} / 5 - Goodreads
                  </span>

                  <span className="text-white text-xs p-1 bg-pink-300 rounded-lg">
                    95 % liked this book - Google users
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex flex-wrap gap-2 mt-2">
                    {book?.volumeInfo?.categories.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-500 text-white text-xs font-semibold py-1 px-3 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <MusicSlider />
            </div>
          </div>
        </animated.div>
      </div>
      <div className=" pt-4 w-full flex justify-center px-8 gap-4">
        <button
          onClick={handleDislike}
          className="bg-red-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-red-600 transition"
        >
          Dislike
        </button>

        <button
          onClick={handleLike}
          className="bg-green-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-green-600 transition"
        >
          Like
        </button>
      </div>
    </div>
  )
}
