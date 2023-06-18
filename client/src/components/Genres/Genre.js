import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";

export default function Genre() {
  const handleCardClick = (genre) => {
    //dua genre ve server
    // generate question for that room
  };
  return (
    <Card sx={{ maxHeight: "120px", maxWidth: "120px" }}>
      <CardActionArea
        onClick={() => {
          handleCardClick("abc");
        }}
      >
        <CardMedia
          component="img"
          height="120"
          image="/static/images/cards/contemplative-reptile.jpg"
          alt="green iguana"
        />
      </CardActionArea>
    </Card>
  );
}
