
export type Video = {
  id: number;
  title: string;
  url: string;
  thumbnail: string;
};


export const videos: Video[] = [
  {
    id: 1,
    title: "Mindhunter",
    url: "https://www.youtube.com/watch?v=PHlJQCyqiaI&ab_channel=Netflix",
    thumbnail: "/thumbnails/mindhunter.jpg"

  },
  {
    id: 2,
    title: "House of Cards",
    url: "https://www.youtube.com/watch?v=8QnMmpfKWvo&ab_channel=Netflix",
    thumbnail: "/thumbnails/house-of-cards.jpg"
  },
  {
    id: 3,
    title: "Stranger Things",
    url: "https://www.youtube.com/watch?v=b9EkMc79ZSU&ab_channel=Netflix",
    thumbnail: "/thumbnails/strangerthings.jpg"
  },
  {
    id: 4,
    title: "Black Mirror",
    url: "https://www.youtube.com/watch?v=1iqra1ojEvM&ab_channel=Netflix",
    thumbnail: "/thumbnails/blackMirror.jpg"
  },
  {
    id: 6,
    title: "Wednesday",
    url: "https://www.youtube.com/watch?v=Di310WS8zLk&ab_channel=Netflix",
    thumbnail: "/thumbnails/Wednesday.jpg"
  }, {
    id: 5,
    title: "BreakingBad",
    url: "https://www.youtube.com/watch?v=1JLUn2DFW4w&ab_channel=Netflix",
    thumbnail: "/thumbnails/breakingbad.jpg"
  },
];


