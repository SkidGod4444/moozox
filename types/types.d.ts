type ArtistTypes = {
  id: number;
  name: string;
  img: string;
  url: string;
};

type SongTypes = {
  id: number;
  name: string;
  img: string;
  year: string;
  releaseDate: string;
  duration: number;
  label: string;
  playCount: string;
  language: string;
  url: string;
  artists: ArtistTypes[];
}