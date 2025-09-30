
export type Movies = {
    id: number;
    title: string;
    url: string;
    thumbnail: string;
};

export const movies: Movies[] = [
    {
        id: 1,
        title: "Interstellar",
        url: "https://www.youtube.com/watch?v=zSWdZVtXT7E&ab_channel=WarnerBros.UK%26Ireland",
        thumbnail: "/thumbnails/Interstellar"

    },
    {

        id: 2,
        title: "Oppenheimer",
        url: "https://www.youtube.com/watch?v=uYPbbksJxIg&ab_channel=UniversalPictures",
        thumbnail: "/thumbnails/Oppenheimer.jpg"
    },
    {
        id: 3,
        title: "Dark Knight",
        url: "https://www.youtube.com/watch?v=EXeTwQWrcwY&ab_channel=RottenTomatoesClassicTrailers",
        thumbnail: "/thumbnails/dark-knight.jpg"

    },
    {
        id: 4,
        title: "Avengers",
        url: "https://www.youtube.com/watch?v=6ZfuNTqbHE8&ab_channel=MarvelEntertainment",
        thumbnail: "/thumbnails/Avengers.jpg"

    },


];