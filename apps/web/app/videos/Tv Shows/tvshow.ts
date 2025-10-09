
export type Tvshows = {
  id: number;
  title: string;
  url: string;
  thumbnail: string;
};

export const tvshows: Tvshows[] = [
  {
    id: 1,
    title: "Peaky Blinders",
    url: "https://www.youtube.com/watch?v=Ruyl8_PT_y8&ab_channel=Netflix",
    thumbnail: "/thumbnails/peaky-blinders.jpg"

  },
  {
    id: 2,
    title: "Ozark",
    url: "https://www.youtube.com/watch?v=5hAXVqrljbs&ab_channel=Netflix",
    thumbnail: "/thumbnails/ozark.jpg"
  },
  {
    id: 3,
    title: "You",
    url: "https://www.youtube.com/watch?v=v99ooSjCVhg&ab_channel=Netflix",
    thumbnail: "/thumbnails/you.jpeg"
  },
  {
    id: 4,
    title: "Dexter",
    url: "https://www.youtube.com/watch?v=YQeUmSD1c3g&ab_channel=DexteronParamount%2BwithShowtime",
    thumbnail: "/thumbnails/dexter.jpg"
  },
 
];