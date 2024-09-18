import { NextRequest, NextResponse } from "next/server";
import { redisDB } from "@/db/redis";

// Function to fetch individual artist from the external API based on query
async function fetchArtistFromAPI(query: string) {
  const origin = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://moozox.devwtf.in';

  const response = await fetch(`${origin}/api/search/artists?query=${query}&page=1&limit=1`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch artist from the API');
  }

  return response.json();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  try {
    const allArtistsJson = await redisDB.lrange("topArtists", 0, -1);
    // If query exists, search for the specific artist
    if (query) {
      try {
        const artistsList = allArtistsJson.map((item) => {
          try {
            return typeof item === 'string' ? JSON.parse(item) as ArtistTypes : item as ArtistTypes;
          } catch (error) {
            console.error("Error parsing artist data from Redis:", error);
            return null;
          }
        }).filter(Boolean) as ArtistTypes[];

        // Search for the artist by query
        const artistData = artistsList.find((artist: ArtistTypes) =>
          artist.name.toLowerCase().includes(query.toLowerCase())
        );

        if (artistData) {
          return NextResponse.json(artistData);
        }

        // If artist not found in Redis, fetch from the external API
        const data = await fetchArtistFromAPI(query);
        if (data.success && data.data && Array.isArray(data.data.results)) {
          const results = data.data.results;

          if (results.length > 0) {
            const artist = results[0];
            const artistData: ArtistTypes = {
              id: artist.id,
              name: artist.name,
              img: artist.image[2]?.url || artist.image[1]?.url || "",
              url: artist.url
            };

            // Add artist to Redis if it doesn't already exist
            const artistExists = allArtistsJson.some(artistJson => {
              try {
                // Check if artistJson is already an object
                const artist = typeof artistJson === 'object' ? artistJson : JSON.parse(artistJson);
                return artist.id === artistData.id;
              } catch (error) {
                console.error("Error parsing artist JSON:", error);
                return false;
              }
            });

            if (!artistExists) {
              await redisDB.rpush("topArtists", JSON.stringify(artistData));
            }

            return NextResponse.json(artistData);
          } else {
            return NextResponse.json({ error: "No artists found" }, { status: 404 });
          }
        } else {
          return NextResponse.json({ error: "Unexpected data structure" }, { status: 500 });
        }
      } catch (error) {
        console.error("Error fetching or parsing artists data from Redis:", error);
        return NextResponse.json({ error: "Error fetching artists from Redis" }, { status: 500 });
      }
    } else {
      // If no query, return all artists stored in Redis as is
      try {
        const allArtistsJson = await redisDB.lrange("topArtists", 0, -1);
        return NextResponse.json(allArtistsJson);
      } catch (error) {
        console.error("Error fetching artists list from Redis:", error);
        return NextResponse.json({ error: "Error fetching artists from Redis" }, { status: 500 });
      }
    }
  } catch (error) {
    console.error("Error fetching or storing artist data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
