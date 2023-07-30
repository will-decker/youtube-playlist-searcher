const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

export default async function handler(req, res) {
  const { playlistId, pageToken } = req.query;
  const token = pageToken === undefined ? '' : pageToken;
  console.log(token)
  try {
    const fetchURL = `${YOUTUBE_API_URL}/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}&pageToken=${token}`;
    console.log(fetchURL)
    const response = await fetch(fetchURL);
    console.log(`res:${response}`)
    console.log(response)
    if (!response.ok) {
      throw new Error('Failed to fetch playlist items');
    }

    const data = await response.json();
    console.log(data)
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}