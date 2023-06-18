import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Box, CircularProgress, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";

import PlaylistCard from "./PlaylistCard";

const RowTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
}));

function PlaylistsRow({ title, url, handleCardClick, chosenCard, index }) {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getTrendingPlaylists() {
      try {
        const response = await axios.get(url);
        setPlaylists(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    }
    getTrendingPlaylists();
  }, [url]);

  return (
    <Grid container key={index}>
      <Grid item xs={12}>
        <RowTitle variant="h6">{title}</RowTitle>
      </Grid>
      <Grid item xs={12}>
        <Swiper
          slidesPerView={6}
          spaceBetween={30}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            0: { slidesPerView: 1 },
            300: { slidesPerView: 3 },
            600: { slidesPerView: 4 },
            900: { slidesPerView: 5 },
            1200: { slidesPerView: 6 },
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {playlists.map((playlist, index) => (
            <SwiperSlide
              style={{ background: "none", width: "150px" }}
              key={index}
            >
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
                <PlaylistCard
                  id={playlist.id}
                  image={playlist.image}
                  name={playlist.name}
                  handleCardClick={handleCardClick}
                  chosenCard={chosenCard}
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </Grid>
    </Grid>
  );
}

export default PlaylistsRow;
