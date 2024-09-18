"use client";
import { useState, useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Play, Heart } from "lucide-react";
import Image from "next/image";
import SearchComp from "@/components/custom/search.comp";
import Logo from "@/components/custom/logo.comp";
import UserBtn from "@/components/custom/user.btn.comp";
import AuthBtn from "@/components/custom/auth.btn.comp";
import { MyLinks } from "@/db/defaults";

function formatPlayCount(count: string): string {
  const num = parseInt(count, 10);
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toString();
  }
}

function HomePageContent() {
  const [greeting, setGreeting] = useState("Welcome to Moozox!");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [topArtists, setTopArtists] = useState<ArtistTypes[]>([]);
  const [topPlayed, setTopPlayed] = useState<SongTypes[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchTopArtists = async () => {
      try {
        const response = await fetch("/api/get/artists");
        if (!response.ok) {
          throw new Error("Failed to fetch top artists");
        }
        const data = await response.json();
        setTopArtists(data);
      } catch (error) {
        console.error("Error fetching top artists:", error);
      }
    };

    const fetchTopPlayed = async () => {
      try {
        const response = await fetch("/api/get/songs");
        if (!response.ok) {
          throw new Error("Failed to fetch top songs");
        }
        const data = await response.json();
        setTopPlayed(data);
      } catch (error) {
        console.error("Error fetching top songs:", error);
      }
    };

    if (!topArtists.length) {
      fetchTopArtists();
    }
    if (!topPlayed.length) {
      fetchTopPlayed();
    }
  }, [topPlayed, topArtists]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    let initialGreeting;
    if (hour < 6) initialGreeting = "Enjoy some late-night tunes!";
    else if (hour < 12)
      initialGreeting = "Start your morning with some fresh tunes!";
    else if (hour < 18)
      initialGreeting = "Tune into the rhythm of the afternoon!";
    else if (hour < 22)
      initialGreeting = "Wind down with some evening melodies.";
    else initialGreeting = "Enjoy some late-night tunes!";
    setGreeting(initialGreeting);
  }, [currentTime]);

  return (
    <div className="p-6 space-y-8">
      <header className="flex justify-between items-center border-b">
        <div className="mb-2">
          <Logo />
          <p className="text-muted-foreground text-sm">{greeting}</p>
        </div>

        <div className="flex flex-row items-center justify-between gap-10">
          <SearchComp />
          {session?.user ? <UserBtn session={session} /> : <AuthBtn />}
        </div>
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Top Played Songs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topPlayed.slice(0, 12).map((song) => (
            <Card
              key={song.id}
              className="border-2 hover:bg-muted/60 transition-all duration-300 cursor-pointer shadow-xl"
            >
              <CardContent className="flex items-center p-4">
                <Image
                  src={song.img}
                  alt={song.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-md mr-4"
                />
                <div className="flex-grow">
                <CardTitle className="text-sm">
                    <span className="line-clamp-1">{song.name}</span>
                  </CardTitle>
                  <CardDescription>
                    {song.artists.length > 1
                      ? song.artists.map((artist, index) => (
                          <span key={artist.id}>
                            {index > 0 && ' & '}
                            {artist.name}
                          </span>
                        ))
                      : song.artists[0]?.name || 'Unknown Artist'}
                  </CardDescription>
                  <p className="text-xs text-primary">{formatPlayCount(song.playCount)} plays</p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-primary bg-muted hover:bg-black hover:text-primary"
                >
                  <Play className="h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Top Artists</h2>
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <div className="flex w-max space-x-4 p-4">
            {topArtists && topArtists.length > 0 ? (
              topArtists.map((artist) => (
                <Card
                  key={artist.id}
                  className="w-[150px] border-2 hover:bg-muted/60 transition-all duration-300 cursor-pointer"
                >
                  <CardHeader className="p-0">
                    <Image
                      src={artist.img}
                      alt={artist.name}
                      width={150}
                      height={100}
                      className="object-cover rounded-t-lg border"
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                  <CardTitle className="text-sm">
                    <span className="line-clamp-1">{artist.name}</span>
                  </CardTitle>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>Loading top artists...</p>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Explore Music</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topPlayed.slice(0, 30).map((song) => (
            <Card
              key={song.id}
              className="border-2 hover:bg-muted/60 transition-all duration-300 cursor-pointer"
            >
              <CardContent className="flex items-center p-4">
              <Image
                  src={song.img}
                  alt={song.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-md mr-4"
                />
                <div className="flex-grow">
                  <CardTitle className="text-sm">
                    <span className="line-clamp-1">{song.name}</span>
                  </CardTitle>
                  <CardDescription>
                    {song.artists.length > 1
                      ? song.artists.map((artist, index) => (
                          <span key={artist.id}>
                            {index > 0 && ' & '}
                            {artist.name}
                          </span>
                        ))
                      : song.artists[0]?.name || 'Unknown Artist'}
                  </CardDescription>
                  <p className="text-xs text-primary">{song.language.charAt(0).toUpperCase() + song.language.slice(1)}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-primary bg-muted hover:bg-black hover:text-primary"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-primary bg-muted hover:bg-black hover:text-primary"
                  >
                    <Play className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

    <footer className="mt-12 py-6 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} Saavn Media Limited. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <a href="/tos" className="text-sm text-gray-600 hover:text-primary">Terms of Service</a>
            <a href="/policy" className="text-sm text-gray-600 hover:text-primary">Privacy Policy</a>
            <a href={MyLinks.twitter} className="text-sm text-gray-600 hover:text-primary">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <SessionProvider>
      <HomePageContent />
    </SessionProvider>
  );
}
