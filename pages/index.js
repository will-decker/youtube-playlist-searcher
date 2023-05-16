import { useState } from 'react';

export default function Search() {
  const [playlistId, setPlaylistId] = useState('');
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const handleSearch = async (event) => {
    event.preventDefault();
    setError(null); // Reset error state before a new search

    try {
      const response = await fetch(`/api/playlist?playlistId=${playlistId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch playlist items');
      }

      const data = await response.json();
      setVideos(data.items);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={playlistId}
          onChange={(e) => setPlaylistId(e.target.value)}
          placeholder="Playlist ID"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Search
        </button>
      </form>

      {error && <div className="text-red-500">{error}</div>}

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search within playlist"
        className="border p-2 mb-4 w-full"
      />

      <div>
        {videos
          .filter((video) =>
            video.snippet.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((video) => (
            <div key={video.id} className="mb-2">
              {video.snippet.title}
            </div>
          ))}
      </div>
    </div>
  );
}
