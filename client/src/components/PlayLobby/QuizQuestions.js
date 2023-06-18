import React, { useEffect, useState } from "react";
import { Button, Grid, Stack, Typography, useTheme } from "@mui/material";
import socket from "../../app/socket";
import { useParams } from "react-router-dom";
import { Cancel, CheckCircle } from "@mui/icons-material";

function QuizQuestions({
  question,
  setCountDownTimer,
  countDownTimer,
  delayCountdown,
}) {
  const theme = useTheme();
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(null);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
  const [chosenAnswerIndex, setChosenAnswerIndex] = useState(null);
  const { roomId } = useParams();

  const handleQuestionButton = (index) => {
    setChosenAnswerIndex(index);
    socket.emit("chosen_answer", {
      answerIndex: index,
      roomId: parseInt(roomId),
    });
  };

  useEffect(() => {
    socket.on("correct_answer", (answerIndex) => {
      setIsCorrectAnswer(true);
      setCorrectAnswerIndex(answerIndex);
    });

    socket.on("wrong_answer", () => {
      setIsCorrectAnswer(false);
    });

    setIsCorrectAnswer(null);
    setCorrectAnswerIndex(null);
    setChosenAnswerIndex(null);
    return () => {
      socket.off("correct_answer");
      socket.off("wrong_answer");
    };
  }, [question]);

  return (
    <Stack>
      {question && (
        <>
          <Typography
            variant="h5"
            textAlign="center"
            color={theme.palette.info.main}
            padding={2}
          >
            {isCorrectAnswer !== null ? (
              <>
                <Typography
                  variant="h5"
                  textAlign="center"
                  color={theme.palette.text.primary}
                  component="span"
                >
                  Correct Answer:
                </Typography>{" "}
                {question.correctAnswer}
              </>
            ) : (
              question.question
            )}
          </Typography>

          <Grid container spacing={{ xs: 2, md: 3 }}>
            {question.options?.map((option, index) => {
              const isChosen = chosenAnswerIndex === index;
              const isCorrect = index === correctAnswerIndex;
              let backgroundColor = theme.palette.warning.main;
              let color = "white";
              let startIcon = null;
              if (isChosen && isCorrectAnswer === false) {
                backgroundColor = theme.palette.error.main;
                color = "black";
                startIcon = <Cancel />;
              } else if (isCorrect) {
                backgroundColor = theme.palette.success.main;
                color = "black";
                startIcon = <CheckCircle />;
              }

              return (
                <Grid item xs={12} sm={12} md={6} key={index}>
                  <Button
                    fullWidth
                    variant="contained"
                    disabled={
                      isCorrectAnswer !== null || delayCountdown !== null
                    }
                    style={{
                      backgroundColor,
                      color,
                    }}
                    startIcon={startIcon}
                    onClick={() => {
                      handleQuestionButton(index);
                    }}
                  >
                    <Typography
                      noWrap
                      overflow={"hidden"}
                      textOverflow={"ellipsis"}
                    >
                      {option}
                    </Typography>
                  </Button>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
    </Stack>
  );
}

export default QuizQuestions;
