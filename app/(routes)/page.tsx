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
import { Skeleton } from "@/components/ui/skeleton";
import BlurFade from "@/components/magicui/blur-fade";
import { IconDisc } from "@tabler/icons-react";

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

function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

function HomePageContent() {
  const [greeting, setGreeting] = useState("Welcome to Moozox!");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [topArtists, setTopArtists] = useState<ArtistTypes[]>([]);
  const [topPlayed, setTopPlayed] = useState<SongTypes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchTopArtists(), fetchTopPlayed()]);
      setIsLoading(false);
    };

    fetchData();
  }, []);

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

        <div className="flex flex-row items-center justify-between gap-6">
          <Button variant={"outline"} className="hidden md:flex">
            <IconDisc className="mr-2 size-5 text-primary"/>Mooz
          </Button>
          <div className="hidden md:block">
          <SearchComp />
          </div>
          {session?.user ? <UserBtn session={session} /> : <AuthBtn />}
        </div>
      </header>

      <section>
      <div className="flex md:hidden">
          <SearchComp />
          </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Top Played Songs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading
            ? Array(12).fill(0).map((_, index) => (
                <Card key={index} className="border-2 shadow-xl">
                  <CardContent className="flex items-center p-4">
                    <Skeleton className="w-16 h-16 rounded-md mr-4 flex-shrink-0" />
                    <div className="flex-grow min-w-0">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2 mb-2" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                    <Skeleton className="w-8 h-8 rounded-full flex-shrink-0 ml-2" />
                  </CardContent>
                </Card>
              ))
            : topPlayed.slice(0, 12).map((song, idx) => (
                <Card
                  key={song.id}
                  className="border-2 hover:bg-muted/60 transition-all duration-300 cursor-pointer shadow-xl"
                >
                  <CardContent className="flex items-center p-4">
                    <BlurFade key={song.img} delay={0.25 + idx * 0.05} inView>
                      <Image
                        src={song.img}
                        alt={song.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-md mr-4 flex-shrink-0"
                      />
                    </BlurFade>
                    <div className="flex-grow min-w-0 mr-2">
                      <CardTitle className="text-sm truncate">
                        {truncateText(song.name, 20)}
                      </CardTitle>
                      <CardDescription className="truncate">
                        {song.artists.length > 1
                          ? truncateText(song.artists.map(artist => artist.name).join(' & '), 20)
                          : truncateText(song.artists[0]?.name || 'Unknown Artist', 20)}
                      </CardDescription>
                      <p className="text-xs text-primary">{formatPlayCount(song.playCount)} plays</p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-primary bg-muted hover:bg-black hover:text-primary flex-shrink-0"
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
            {isLoading
              ? Array(10).fill(0).map((_, index) => (
                  <Card key={index} className="w-[150px] border-2">
                    <CardHeader className="p-0">
                      <Skeleton className="h-[100px] w-[150px]" />
                    </CardHeader>
                    <CardContent className="p-4">
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                ))
              : topArtists.map((artist, idx) => (
                  <Card
                    key={artist.id}
                    className="w-[150px] border-2 hover:bg-muted/60 transition-all duration-300 cursor-pointer"
                  >
                    <CardHeader className="p-0">
                      <BlurFade key={artist.img} delay={0.25 + idx * 0.05} inView>
                        <Image
                          src={artist.img}
                          alt={artist.name}
                          width={150}
                          height={100}
                          className="object-cover rounded-t-lg border"
                        />
                      </BlurFade>
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="text-sm truncate">
                        {truncateText(artist.name, 20)}
                      </CardTitle>
                    </CardContent>
                  </Card>
                ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Explore Music</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array(30).fill(0).map((_, index) => (
              <Card key={index} className="border-2">
                <CardContent className="flex items-center p-4">
                  <Skeleton className="w-16 h-16 rounded-md mr-4 flex-shrink-0" />
                  <div className="flex-grow min-w-0">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2 mb-2" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <div className="flex space-x-2 flex-shrink-0 ml-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-8 h-8 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))
          : topPlayed.slice(0, 30).map((song, idx) => (
              <Card
                key={song.id}
                className="border-2 hover:bg-muted/60 transition-all duration-300 cursor-pointer"
              >
                <CardContent className="flex items-center p-4">
                  <BlurFade key={song.img} delay={0.25 + idx * 0.05} inView>
                    <Image
                      src={song.img}
                      alt={song.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-md mr-4 flex-shrink-0"
                    />
                  </BlurFade>
                  <div className="flex-grow min-w-0 mr-2">
                    <CardTitle className="text-sm truncate">
                      {truncateText(song.name, 20)}
                    </CardTitle>
                    <CardDescription>
                      <div className="truncate">
                      {song.artists.length > 1
                        ? truncateText(song.artists.map(artist => artist.name).join(' & '), 26)
                        : truncateText(song.artists[0]?.name || 'Unknown Artist', 26)}
                      </div>
                    </CardDescription>
                    <p className="text-xs text-primary">{song.language.charAt(0).toUpperCase() + song.language.slice(1)}</p>
                  </div>
                  <div className="flex space-x-2 flex-shrink-0">
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
