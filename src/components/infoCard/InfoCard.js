import React, { useState } from "react";
import { Button, Card, Icon } from "semantic-ui-react";
import "./InfoCard.css";

import BackCard from "./backCard";
import FrontCard from "./frontCard";

import ReactGA from "react-ga";
import moment from "moment";

ReactGA.initialize("UA-139413334-1");

// export isOpen function for front and back card
export const isOpen = (hours) => {
  const todayDay = moment().format("dddd").toLowerCase();
  if (hours[todayDay]) {
    const hoursString = hours[todayDay];
    const [openString, closeString] = hoursString.split("-");

    const todayOpen = moment(openString, "h:mma");
    const todayClose = moment(closeString, "h:mma");
    return moment().isBetween(todayOpen, todayClose);
  } else {
    return false;
  }
};

function InfoCard(props) {
  const [side, setSide] = useState("front");
  const { name } = props;

  const onContactButtonClick = () => {
    ReactGA.event({
      category: "User",
      action: "Clicked View Details: " + name,
    });
    setSide("back");
  };

  const onCloseButtonClick = () => {
    setSide("front");
  };

  return (
    <Card style={styles.infoCard}>
      {side === "front" ? (
        <>
          <FrontCard {...props} />
          <div className="bottom-button">
            <Button attached="bottom" basic onClick={onContactButtonClick}>
              <Icon name="angle right" /> View Details
            </Button>
          </div>
        </>
      ) : (
        <>
          <BackCard {...props} />
          <div className="bottom-button">
            <Button attached="bottom" basic onClick={onCloseButtonClick}>
              <Icon name="angle right" /> See Less
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}

export const styles = {
  infoCard: {
    borderRadius: 10,
  },

  infoCardImage: {
    objectFit: "cover",
    height: 200,
    width: "100%",
  },
  infoCardImageMobile: {
    objectFit: "cover",
    height: 80,
    width: "100%",
    opacity: 0.5,
  },
  infoCardFrontContent: {
    border: "none",
  },
  infoCardLast: {
    flexGrow: 1,
    border: "none",
    padding: 0,
  },
  tag: {
    padding: "6px 8px 6px 8px",
    color: "white",
    borderRadius: 10,
    marginTop: 4,
  },
  backRow: {
    padding: "8px 10px 8px 10px",
    wordBreak: "break-word",
    color: "#666666",
    width: "100%",
  },
  backLabel: {
    padding: 0,
  },
  backHeader: {
    border: "none",
  },
  backNameHeader: {
    padding: "14px 10px 14px 10px",
  },
  reportButton: {
    backgroundColor: "blue",
  },
  hoursLabel: {
    width: 35,
    marginRight: 40,
    display: "inline-block",
    color: "#666666",
  },
  hours: {
    display: "inline-block",
    color: "#666666",
  },
  divider: {
    width: "100%",
    margin: "0px 0px 8px 0px",
  },
};

export default InfoCard;
