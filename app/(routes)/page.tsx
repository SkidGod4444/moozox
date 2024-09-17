"use client";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Play, Heart } from "lucide-react";
import Image from "next/image";
import SearchComp from "@/components/custom/search.comp";
import TypingAnimation from "@/components/magicui/typing-animation";

const topPlayedSongs = [
  { id: 1, name: "As It Was", artist: "Harry Styles", plays: 1243, imageUrl: "/placeholder.svg?height=60&width=60&text=Harry" },
  { id: 2, name: "Anti-Hero", artist: "Taylor Swift", plays: 1102, imageUrl: "/placeholder.svg?height=60&width=60&text=Taylor" },
  { id: 3, name: "Unholy", artist: "Sam Smith & Kim Petras", plays: 987, imageUrl: "/placeholder.svg?height=60&width=60&text=Sam" },
  { id: 4, name: "Bad Habit", artist: "Steve Lacy", plays: 879, imageUrl: "/placeholder.svg?height=60&width=60&text=Steve" },
  { id: 5, name: "About Damn Time", artist: "Lizzo", plays: 765, imageUrl: "/placeholder.svg?height=60&width=60&text=Lizzo" },
]
// const recentlyPlayed = [
//   { id: 1, name: "Bohemian Rhapsody", artist: "Queen", imageUrl: "/placeholder.svg?height=60&width=60&text=Queen" },
//   { id: 2, name: "Blinding Lights", artist: "The Weeknd", imageUrl: "/placeholder.svg?height=60&width=60&text=Weeknd" },
//   { id: 3, name: "Shape of You", artist: "Ed Sheeran", imageUrl: "/placeholder.svg?height=60&width=60&text=Ed" },
// ];

// const topArtists = [
//   { id: 1, name: "Taylor Swift", imageUrl: "/placeholder.svg?height=120&width=120&text=Taylor" },
//   { id: 2, name: "Drake", imageUrl: "/placeholder.svg?height=120&width=120&text=Drake" },
//   { id: 3, name: "Ariana Grande", imageUrl: "/placeholder.svg?height=120&width=120&text=Ariana" },
//   { id: 4, name: "The Weeknd", imageUrl: "/placeholder.svg?height=120&width=120&text=Weeknd" },
//   { id: 5, name: "Billie Eilish", imageUrl: "/placeholder.svg?height=120&width=120&text=Billie" },
// ];

const exploreSongs = [
  { id: 1, name: "Flowers", artist: "Miley Cyrus", genre: "Pop", imageUrl: "/placeholder.svg?height=60&width=60&text=Miley" },
  { id: 2, name: "Last Night", artist: "Morgan Wallen", genre: "Country", imageUrl: "/placeholder.svg?height=60&width=60&text=Morgan" },
  { id: 3, name: "Rich Flex", artist: "Drake & 21 Savage", genre: "Hip-Hop", imageUrl: "/placeholder.svg?height=60&width=60&text=Drake" },
  { id: 4, name: "Lift Me Up", artist: "Rihanna", genre: "R&B", imageUrl: "/placeholder.svg?height=60&width=60&text=Rihanna" },
  { id: 5, name: "Unstoppable", artist: "Sia", genre: "Pop", imageUrl: "/placeholder.svg?height=60&width=60&text=Sia" },
  { id: 6, name: "Shivers", artist: "Ed Sheeran", genre: "Pop", imageUrl: "/placeholder.svg?height=60&width=60&text=Ed" },
  { id: 7, name: "Calm Down", artist: "Rema & Selena Gomez", genre: "Afrobeats", imageUrl: "/placeholder.svg?height=60&width=60&text=Rema" },
  { id: 8, name: "I'm Good (Blue)", artist: "David Guetta & Bebe Rexha", genre: "Dance", imageUrl: "/placeholder.svg?height=60&width=60&text=Guetta" },
  { id: 9, name: "Snap", artist: "Rosa Linn", genre: "Indie", imageUrl: "/placeholder.svg?height=60&width=60&text=Rosa" },
  { id: 10, name: "Creepin'", artist: "Metro Boomin, The Weeknd & 21 Savage", genre: "Hip-Hop", imageUrl: "/placeholder.svg?height=60&width=60&text=Metro" },
  { id: 11, name: "Unholy", artist: "Sam Smith & Kim Petras", genre: "Pop", imageUrl: "/placeholder.svg?height=60&width=60&text=Sam" },
  { id: 12, name: "Anti-Hero", artist: "Taylor Swift", genre: "Pop", imageUrl: "/placeholder.svg?height=60&width=60&text=Taylor" },
  { id: 13, name: "Lift Me Up", artist: "Rihanna", genre: "R&B", imageUrl: "/placeholder.svg?height=60&width=60&text=Rihanna" },
  { id: 14, name: "As It Was", artist: "Harry Styles", genre: "Pop", imageUrl: "/placeholder.svg?height=60&width=60&text=Harry" },
  { id: 15, name: "About Damn Time", artist: "Lizzo", genre: "Pop", imageUrl: "/placeholder.svg?height=60&width=60&text=Lizzo" },
]


export default function HomePage() {
  const [greeting, setGreeting] = useState("Good ...");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [topArtists, setTopArtists] = useState<ArtistTypes[]>([]);

  useEffect(() => {
    const fetchTopArtists = async () => {
      try {
        const response = await fetch('/api/search/artists?query=honeysingh');
        if (!response.ok) {
          throw new Error('Failed to fetch top artists');
        }
        const data = await response.json();
        if (data.success && data.data && data.data.results) {
          const artists = data.data.results.map((artist: { id: string; name: string; image: { url: string }[] }) => ({
            id: artist.id,
            name: artist.name,
            img: artist.image[2]?.url || artist.image[1]?.url || ''
          }));
          setTopArtists(artists);
        }
      } catch (error) {
        console.error('Error fetching top artists:', error);
      }
    };

    fetchTopArtists();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    let initialGreeting;
    if (hour < 12) initialGreeting = "Start your morning with some fresh tunes!";
else if (hour < 18) initialGreeting = "Tune into the rhythm of the afternoon!";
else initialGreeting = "Wind down with some evening melodies.";
    setGreeting(initialGreeting);
  }, [currentTime]);

  return (
    <div className="p-6 space-y-8">
      <header className="flex justify-between items-center border-b-2">
        <div className="mb-2">
        <TypingAnimation
      className="text-4xl md:text-5xl font-bold text-black dark:text-white text-start"
      text="Moozox"
    />
          <p className="text-primary text-sm">{greeting}</p>
        </div>
        
        <div className="flex flex-row items-center justify-between gap-10">
        <SearchComp/>
        <Avatar className="h-12 w-12">
          <AvatarImage src="/placeholder-user.jpg" alt="User" />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        </div>
      </header>


      <section>
        <h2 className="text-2xl font-semibold mb-4">Top Played Songs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topPlayedSongs.map((song) => (
            <Card key={song.id} className="border-2 hover:bg-muted/60 transition-all duration-300 cursor-pointer">
              <CardContent className="flex items-center p-4">
                <img src={song.imageUrl} alt={song.name} className="w-12 h-12 rounded-md mr-4" />
                <div className="flex-grow">
                  <CardTitle className="text-sm">{song.name}</CardTitle>
                  <CardDescription>{song.artist}</CardDescription>
                  <p className="text-xs text-primary">{song.plays} plays</p>
                </div>
                <Button size="icon" variant="ghost" className="text-primary bg-muted hover:bg-black hover:text-primary">
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
                <Card key={artist.id} className="w-[150px] border-2 hover:bg-muted/60 transition-all duration-300 cursor-pointer">
                  <CardHeader className="p-0">
                    <Image src={artist.img} alt={artist.name} width={150} height={100} className="object-cover rounded-t-lg border" />
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-sm truncate">{artist.name}</CardTitle>
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
          {exploreSongs.map((song) => (
            <Card key={song.id} className="border-2 hover:bg-muted/60 transition-all duration-300 cursor-pointer">
              <CardContent className="flex items-center p-4">
                <img src={song.imageUrl} alt={song.name} className="w-12 h-12 rounded-md mr-4" />
                <div className="flex-grow">
                  <CardTitle className="text-sm">{song.name}</CardTitle>
                  <CardDescription>{song.artist}</CardDescription>
                  <p className="text-xs text-primary">{song.genre}</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="icon" variant="ghost" className="text-primary bg-muted hover:bg-black hover:text-primary">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-primary bg-muted hover:bg-black hover:text-primary">
                    <Play className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
