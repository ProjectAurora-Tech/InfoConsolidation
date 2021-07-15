import React from "react";
import { Card, Image, Label, Icon } from "semantic-ui-react";
import "./InfoCard.css";
import { styles, isOpen } from "./InfoCard";
import MediaQuery from "react-responsive";
import MediaQueryHelper from "static/MediaQueryHelper";
import _ from "underscore";
import defaultbackground from "./mountains.jpg";
import Tags from "static/Tags";
import moment from "moment";

const FrontCard = (props) => {
  const { logo, background, name, description, tags, hours } = props;

  const renderTag = (tag) => {
    const displayName = Tags.getDisplayNameForTag(tag);
    const color = Tags.getColorForTag(tag);
    const Top = Tags.getTopValue(tag);
    if (Top) {
      return (
        <Label
          as="a"
          key={displayName}
          style={_.extend(
            { backgroundColor: color, borderColor: color },
            styles.tag
          )}
        >
          {displayName}
        </Label>
      );
    }
  };
  const renderTodayHours = () => {
    // Check if resource is 24/7
    const isAllDay = tags.includes("allday");
    const isOpenNow = isOpen(hours);
    const iconColor = isOpenNow || isAllDay ? "green" : "red";
    const todayDay = moment().format("dddd").toLowerCase();
    if (isAllDay) {
      return (
        <Card.Meta>
          <Icon name="circle" color={iconColor} />
          Open 24 / 7
        </Card.Meta>
      );
    }
    if (hours[todayDay]) {
      return (
        <Card.Meta>
          <Icon name="circle" color={iconColor} />
          {isOpenNow ? " " + hours[todayDay] : " Closed"}
        </Card.Meta>
      );
    }
  };
  return (
    <>
      <MediaQuery
        key="front-mobile-image"
        minDeviceWidth={MediaQueryHelper.MIN_WIDTH_TABLET}
      >
        <Image
          src={background || defaultbackground}
          size="medium"
          key="front-image"
          style={styles.infoCardImageMobile}
        />
        {logo && <img className="banner-logo" alt="banner logo" src={logo} />}
      </MediaQuery>
      <Card.Content key="front-content" style={styles.infoCardFrontContent}>
        <Card.Header>{name}</Card.Header>
        <Card.Description>{description}</Card.Description>
      </Card.Content>
      <Card.Content key="front-extra" style={styles.infoCardFrontContent} extra>
        <Card.Meta style={{ marginBottom: 8 }}>
          {_.map(tags, (tag) => renderTag(tag))}
        </Card.Meta>
        {hours && renderTodayHours()}
      </Card.Content>
    </>
  );
};

export default FrontCard;
