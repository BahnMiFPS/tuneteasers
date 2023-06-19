import React from "react"
import "./style.css"
import { Card, CardActionArea, CardMedia, Box } from "@mui/material"
import CheckIcon from "@mui/icons-material/Check"
import theme from "../../theme/theme"

const cardStyles = {
  width: "167px",
  backgroundColor: "none",
  position: "relative",
}

const cardImageStyles = {
  position: "relative",
}

const checkIconStyles = {
  position: "absolute",
  bottom: "8px",
  right: "8px",
  color: theme.palette.info.main,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  borderRadius: "50%",
  padding: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1,
}

function PlaylistCard({ id, image, name, handleCardClick, chosenCard }) {
  return (
    <Card style={cardStyles}>
      <CardActionArea onClick={() => handleCardClick(id)}>
        <CardMedia
          component="img"
          image={image}
          alt={name}
          style={cardImageStyles}
        />
        {chosenCard === id && (
          <Box style={checkIconStyles}>
            <CheckIcon fontSize="small" />
          </Box>
        )}
      </CardActionArea>
    </Card>
  )
}

export default PlaylistCard
