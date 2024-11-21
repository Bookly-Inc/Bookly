import { useState } from 'react'
const albums = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1439902315629-cd882022cea0?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    songName: 'Song 1',
    artist: 'Artist 1',
    year: 2023,
  },
  {
    id: 2,
    image:
      'https://plus.unsplash.com/premium_photo-1688522734262-32fc76ecd5ec?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    songName: 'Song 2',
    artist: 'Artist 2',
    year: 2022,
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1531518326825-96490ddf2a89?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    songName: 'Song 3',
    artist: 'Artist 3',
    year: 2021,
  },
  {
    id: 4,
    image:
      'https://images.unsplash.com/photo-1531518326825-96490ddf2a89?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    songName: 'Song 4',
    artist: 'Artist 4',
    year: 2020,
  },
  {
    id: 5,
    image:
      'https://images.unsplash.com/photo-1531518326825-96490ddf2a89?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    songName: 'Song 5',
    artist: 'Artist 5',
    year: 2019,
  },
]

export default function MusicSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? albums.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === albums.length - 1 ? 0 : prev + 1))
  }
  return (
    <div className="bg-white py-2 rounded-lg">
      <div className="relative w-full">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentIndex * 60}%)` }}
          >
            {albums.map((album, index) => (
              <div
                className="flex-shrink-0 w-2/3 md:w-1/2 lg:w-2/5 mx-2 bg-white p-2 rounded-lg shadow-lg"
                key={album.id}
              >
                <div className="relative">
                  <img
                    src={album.image}
                    alt={album.songName}
                    className="w-full h-[150px] object-cover rounded-lg"
                  />
                  <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl bg-black bg-opacity-50 w-16 h-16 flex items-center justify-center rounded-full">
                    ▶
                  </button>
                </div>

                <div className="mt-1 text-centerl font-semibold text-gray-800">
                  {album.songName}
                </div>
                <div className="text-sm text-gray-600">
                  {album.artist} - {album.year}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
