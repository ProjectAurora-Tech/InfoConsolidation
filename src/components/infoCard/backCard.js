import React from "react";
import { Card, Divider, Icon, Button, Popup, Grid } from "semantic-ui-react";
import "./InfoCard.css";
import { styles, isOpen } from "./InfoCard";

import _ from "underscore";
import moment from "moment";
import FeedbackModal from "components/feedbackModal/FeedbackModal";

const BackCard = (props) => {
  const { name, hours, phone, address, email, social, notes } = props;
  const phonelink = "tel://1-" + phone;
  const addresslink = "https://maps.google.com/?q=" + address;
  const emailLink = "mailto:" + email;
  const renderSocialButtons = (social) => {
    return (
      <>
        {social && social.website && (
          <Button
            circular
            color="grey"
            icon="world"
            onClick={() => window.open(social.website)}
          />
        )}
        {social && social.facebook && (
          <Button
            circular
            color="facebook"
            icon="facebook"
            onClick={() => window.open(social.facebook)}
          />
        )}
        {social && social.instagram && (
          <Button
            circular
            color="instagram"
            icon="instagram"
            onClick={() => window.open(social.instagram)}
          />
        )}
        {social && social.twitter && (
          <Button
            circular
            color="twitter"
            icon="twitter"
            onClick={() => window.open(social.twitter)}
          />
        )}
      </>
    );
  };

  const elements = [
    ["Phone", phonelink, phone],
    ["Address", addresslink, address],
    ["Email", emailLink, email],
    ["Social", null, true, renderSocialButtons(social)],
  ];

  const renderReportButton = () => {
    return (
      <div id="report-button">
        <FeedbackModal
          trigger={
            <Button basic icon floated="right" size="small">
              <Popup
                size="tiny"
                content="Report incorrect information"
                trigger={<Icon name="flag" />}
              />
            </Button>
          }
          subject={'Inaccurate information regarding "' + name + '"'}
        />
      </div>
    );
  };

  const _capitalize = (text) => {
    if (!text || text.length < 1) {
      return;
    } else {
      return text.charAt(0).toUpperCase() + text.slice(1);
    }
  };

  // phone email address and social icons are all using the same styling
  const GridElement = (...args) => {
    const [eleName, URLLink, itemName, fn] = args[0];
    if (itemName) {
      return (
        <Grid.Row key={`back-${eleName}`} style={styles.backRow}>
          <Grid.Column width={4} style={styles.backLabel}>
            {eleName}:
          </Grid.Column>
          <Grid.Column width={12}>
            <Card.Content key="back-contact" style={styles.infoCardSection}>
              <Card.Description>
                {fn
                  ? fn
                  : itemName && (
                      <a
                        href={URLLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {itemName}
                      </a>
                    )}
              </Card.Description>
            </Card.Content>
          </Grid.Column>
        </Grid.Row>
      );
    } else return null;
  };

  const renderHours = () => {
    if (!hours) {
      return;
    }
    if (hours.others) {
      return <Card.Description key="others">{hours.others}</Card.Description>;
    }
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    return days.map((dayInWeek, index) => {
      const hoursForDay = hours[dayInWeek];
      const isToday = index + 1 === moment().isoWeekday();
      const iconColor = isOpen(hours) ? "green" : "red";

      return (
        <div key={dayInWeek}>
          <div style={styles.hoursLabel}>
            {_capitalize(dayInWeek).slice(0, 3) + ": "}
          </div>
          <div style={styles.hours}>
            {!hoursForDay ? "Closed" : hoursForDay}
          </div>
          <div style={{ display: "inline-block" }}>
            {isToday && (
              <Icon
                name="circle"
                color={iconColor}
                size="small"
                style={{ marginLeft: 6 }}
              />
            )}
          </div>
        </div>
      );
    });
  };

  const renderNotes = () => {
    if (!notes) {
      return;
    }

    return (
      <Grid.Row key="back-notes" style={styles.backRow}>
        <Divider style={styles.divider} />
        <Card.Content style={styles.infoCardSection}>{notes}</Card.Content>
      </Grid.Row>
    );
  };

  return (
    <>
      <Card.Content
        key="back-header"
        style={_.extend(styles.backNameHeader, styles.infoCardSection)}
      >
        <Card.Header>
          {renderReportButton()}
          {name}
        </Card.Header>
      </Card.Content>
      <Card.Content key="back-content" style={styles.backHeader}>
        <Grid>
          {elements.map((ele) => GridElement(ele))}
          <Grid.Row key="back-hours" style={styles.backRow}>
            {hours ? <Divider style={styles.divider} /> : null}
            <Card.Content style={styles.infoCardSection}>
              {renderHours()}
            </Card.Content>
          </Grid.Row>
          {renderNotes()}
        </Grid>
      </Card.Content>
    </>
  );
};

export default BackCard;
