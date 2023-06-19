import React, { useEffect, useState } from "react"
import axios from "axios"
import { Box, CircularProgress } from "@mui/material"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Grid as SwiperGrid } from "swiper"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "swiper/css/grid"
import Chip from "@mui/material/Chip" // Import the Chip component
import { SERVER_URL } from "../../api/requests"

function GenreChipsSwiper({
  genreList,
  setCurrentGenre,
  currentGenre,
  setGenreList,
  country,
  locale,
}) {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const getCategoriesURL = `${SERVER_URL}/api/categories?country=${country}&locale=${locale}`

    const getCategoriesByCountry = async () => {
      try {
        const response = await axios.get(getCategoriesURL)
        setGenreList(response.data.data.categories)
        setIsLoading(false)
      } catch (error) {
        console.error(error)
        setIsLoading(false)
      }
    }

    getCategoriesByCountry()
  }, [country, setGenreList])
  return (
    <Swiper
      slidesPerView={6}
      spaceBetween={5}
      navigation
      grid={{ rows: 2, fill: "row" }}
      breakpoints={{
        0: { slidesPerView: 1, grid: { rows: 1, fill: "row" } },
        300: { slidesPerView: 3, grid: { rows: 2, fill: "row" } },
        600: { slidesPerView: 4, grid: { rows: 2, fill: "row" } },
        900: { slidesPerView: 5, grid: { rows: 2, fill: "row" } },
        1200: { slidesPerView: 6, grid: { rows: 2, fill: "row" } },
      }}
      modules={[Pagination, Navigation, SwiperGrid]}
      className="mySwiper"
      id="genreSwiper"
    >
      {genreList.items
        ?.filter((genre) => genre.id !== null)
        .map((genre, index) => (
          <SwiperSlide style={{ background: "none" }} key={index}>
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignSelf: "flex-start",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Chip
                label={genre.name}
                onClick={() => {
                  setCurrentGenre(genre.id)
                  console.log(genre.id)
                }}
                color={currentGenre === genre.id ? "info" : "secondary"}
                key={index}
              />
            )}
          </SwiperSlide>
        ))}
    </Swiper>
  )
}

export default GenreChipsSwiper
