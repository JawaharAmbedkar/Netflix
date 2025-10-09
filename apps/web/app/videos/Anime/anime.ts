
export type Anime = {
    id: number;
    title: string;
    url: string;
    thumbnail: string;
};

export const anime: Anime[] = [
    {
        id:1,
        title: "One-Piece",
        url: "https://www.youtube.com/watch?v=1KMcoJBMWE4&ab_channel=Crunchyroll",
        thumbnail: "/thumbnails/One-Piece.jpeg"

    },
    {
        id:2,
        title: "Solo-Leveling",
        url: "https://www.youtube.com/watch?v=bssSj4cKsrI&ab_channel=Crunchyroll",
        thumbnail: "/thumbnails/solo-leveling.jpg"

    },
    {
        id:3,
        title: "Naruto",
        url: "https://www.youtube.com/watch?v=-G9BqkgZXRA&ab_channel=vizmedia",
        thumbnail: "/thumbnails/Naruto.jpg"

    },
    {
        id:4,
        title: "Dragon-ball-z",
        url: "https://www.youtube.com/watch?v=sxufB6DxXk0&ab_channel=RottenTomatoesTrailers",
        thumbnail: "/thumbnails/Dragon-Ball-z.jpg"

    },


];