const SERVER_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_DEPLOYMENT_URL
    : process.env.REACT_APP_LOCAL_URL
const genresSelected = [
  "pop",
  "hip-hop",
  "r-n-b",
  "indie",
  "k-pop",
  "rock",
  "electronic",
  "dance",
  "latin",
  "reggae",
  "alternative",
  "country",
  "jazz",
  "blues",
  "soul",
  "funk",
  "edm",
  "classical",
  "folk",
  "metal",
]

const genresWithIndexes = genresSelected.map((genre, index) => ({
  index,
  name: genre,
}))

export { genresWithIndexes, SERVER_URL }
