import React from "react";
import { styled } from "@mui/material/styles";
import theme from "../../theme/theme";
import { Avatar } from "@mui/material";
import { deepOrange } from "@mui/material/colors";

const MessageRow = styled("div")`
  display: flex;
`;

const MessageRowRight = styled("div")`
  display: flex;
  justify-content: flex-end;
`;

const MessageBlue = styled("div")`
  position: relative;
  margin-left: 20px;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #6e51a3; /* Updated chat bubble background color */
  width: 60%;
  text-align: left;
  font: 400 0.9em "Open Sans", sans-serif;
  border: 1px solid #5a4483; /* Updated chat bubble border color */
  border-radius: 10px;
  &:after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-top: 15px solid #6e51a3; /* Updated chat bubble background color */
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    top: 0;
    left: -15px;
  }
  &:before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-top: 17px solid #5a4483; /* Updated chat bubble border color */
    border-left: 16px solid transparent;
    border-right: 16px solid transparent;
    top: -1px;
    left: -17px;
  }
`;

const MessageOrange = styled("div")`
  position: relative;
  margin-right: 20px;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #ff9800; /* Updated chat bubble background color */
  width: 60%;
  text-align: left;
  font: 400 0.9em "Open Sans", sans-serif;
  color: #fff; /* Set text color to white */
  border: 1px solid #f57c00; /* Updated chat bubble border color */
  border-radius: 10px;
  &:after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-top: 15px solid #ff9800; /* Updated chat bubble background color */
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    top: 0;
    right: -15px;
  }
  &:before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-top: 17px solid #f57c00; /* Updated chat bubble border color */
    border-left: 16px solid transparent;
    border-right: 16px solid transparent;
    top: -1px;
    right: -17px;
  }
`;

const MessageContent = styled("p")`
  padding: 0;
  margin: 0;
`;

const OrangeAvatar = styled(Avatar)`
  color: ${theme.palette.getContrastText(deepOrange[500])};
  background-color: ${deepOrange[500]};
  width: ${theme.spacing(4)};
  height: ${theme.spacing(4)};
`;

const DisplayName = styled("div")`
  margin-left: 20px;
`;

export const MessageLeft = (props) => {
  const message = props.message ? props.message : "...";
  const displayName = props.displayName ? props.displayName : "Unknown";
  const photoURL = props.photoURL ? props.photoURL : "dummy.js";

  return (
    <>
      <MessageRow>
        <OrangeAvatar alt={displayName} src={photoURL} />
        <div>
          <DisplayName>{displayName}</DisplayName>
          <MessageBlue>
            <div>
              <MessageContent>{message}</MessageContent>
            </div>
          </MessageBlue>
        </div>
      </MessageRow>
    </>
  );
};

export const MessageRight = (props) => {
  const message = props.message ? props.message : "...";

  return (
    <MessageRowRight>
      <MessageOrange>
        <MessageContent>{message}</MessageContent>
      </MessageOrange>
    </MessageRowRight>
  );
};
