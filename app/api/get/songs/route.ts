import { NextRequest, NextResponse } from "next/server";
import { redisDB } from "@/db/redis";

// Function to fetch individual song from the external API based on query
async function fetchSongsFromApi(query: string) {
  const origin = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://moozox.devwtf.in';

  const response = await fetch(`${origin}/api/search/songs?query=${query}&page=1&limit=10`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch songs from the API');
  }

  return response.json();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  try {
    const allSongsJson = await redisDB.lrange("topPlayed", 0, -1);
    if (query) {
      try {
        const songsList = allSongsJson.map((item) => {
          try {
            return typeof item === 'string' ? JSON.parse(item) as SongTypes : item as SongTypes;
          } catch (error) {
            console.error("Error parsing songs data from Redis:", error);
            return null;
          }
        }).filter(Boolean) as SongTypes[];

        // Search for the song by query
        const songData = songsList.find((song: SongTypes) =>
          song.name.toLowerCase().includes(query.toLowerCase())
        );

        if (songData) {
          return NextResponse.json(songData);
        }

        // If song not found in Redis, fetch from the external API
        const data = await fetchSongsFromApi(query);
        if (data.success && data.data && Array.isArray(data.data.results)) {
          const results = data.data.results;

          if (results.length > 0) {
            const song = results[0];
            const songData: SongTypes = {
              id: song.id,
              name: song.name,
              img: song.image[2]?.url || song.image[1]?.url || "",
              year: song.year,
              releaseDate: song.releaseDate || "",
              duration: song.duration,
              label: song.label,
              playCount: song.playCount,
              language: song.language,
              url: song.url,
              artists: song.artists.primary.map((artist: { id: string; name: string; image: { url: string }[]; url: string }) => ({
                id: artist.id,
                name: artist.name,
                img: artist.image[2]?.url || artist.image[1]?.url || "",
                url: artist.url
              }))
            };

            // Add song to Redis if it doesn't already exist
            const songExists = allSongsJson.some(songJson => {
              try {
                // Check if songJson is already an object
                const song = typeof songJson === 'object' ? songJson : JSON.parse(songJson);
                return song.id === songData.id;
              } catch (error) {
                console.error("Error parsing song JSON:", error);
                return false;
              }
            });

            if (!songExists) {
              await redisDB.rpush("topPlayed", JSON.stringify(songData));
            }

            return NextResponse.json(songData);
          } else {
            return NextResponse.json({ error: "No songs found" }, { status: 404 });
          }
        } else {
          return NextResponse.json({ error: "Unexpected data structure" }, { status: 500 });
        }
      } catch (error) {
        console.error("Error fetching or parsing songs data from Redis:", error);
        return NextResponse.json({ error: "Error fetching songs from Redis" }, { status: 500 });
      }
    } else {
      // If no query, return all songs stored in Redis as is
      try {
        const allSongsJson = await redisDB.lrange("topPlayed", 0, -1);
        return NextResponse.json(allSongsJson);
      } catch (error) {
        console.error("Error fetching songs list from Redis:", error);
        return NextResponse.json({ error: "Error fetching songs from Redis" }, { status: 500 });
      }
    }
  } catch (error) {
    console.error("Error fetching or storing song data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
