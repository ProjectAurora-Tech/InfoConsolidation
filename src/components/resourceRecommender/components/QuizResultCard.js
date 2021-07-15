import { Button, Card, Header, Icon, Segment } from "semantic-ui-react";

import MediaQuery from "react-responsive";

import InfoCard from "components/infoCard/InfoCard";

import React from "react";
import _ from "underscore";

class CardContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trackNoResults: "enabled",
    };
  }
  // resourceMatch is a reusable function
  resourceMatch = (resources, searchArr) => {
    if (searchArr.includes("suicidal")) {
      searchArr.push("selfHarmm");
    }
    return _.filter(
      resources,
      (obj) => _.intersection(obj.tags, searchArr).length === 5
    );
  };
  filterResource = (allResources) => {
    const quizResultTags = this.props.quizResult; // the filtered tags from App.js
    var filterResults;
    if (quizResultTags.includes("nopreference")) {
      let search1 = quizResultTags.slice(0, 4).concat("walkIn");
      let search2 = quizResultTags.slice(0, 4).concat("online");
      let Match1 = this.resourceMatch(allResources, search1);
      let Match2 = this.resourceMatch(allResources, search2);
      filterResults = _.uniq(Match1.concat(Match2));
    } else {
      filterResults = this.resourceMatch(allResources, quizResultTags);
    }

    return filterResults;
  };

  render = () => {
    let resources = this.filterResource(this.props.resources);

    if (resources.length === 0) {
      return (
        <>
          <Segment placeholder>
            <Header icon>
              Sorry, no results found.
              <br />
              <br />
              Try a different search or filters.
            </Header>
          </Segment>
          <div className="parentDiv">
            <div className="leftcol">
              {" "}
              <Icon
                name="arrow left"
                size="big"
                onClick={this.props.backFromResult}
                disabled={false}
              />
            </div>
            <div className="center">
              <Button negative onClick={this.props.resetForm}>
                Start Over
              </Button>
            </div>
            <div className="rightcol"></div>
          </div>
        </>
      );
    }

    return (
      <>
        <MediaQuery minWidth={800}>
          <Segment basic>
            <Card.Group style={{ margin: "-.875em 1em 0.5em 6em" }}>
              {_.map(resources, (resource, index) => (
                <InfoCard key={index.toString()} {...resource} /> // spread the props
              ))}
            </Card.Group>
          </Segment>
        </MediaQuery>
        <MediaQuery maxWidth={799}>
          <Segment basic>
            <Card.Group>
              {_.map(resources, (resource, index) => (
                <InfoCard key={index.toString()} {...resource} />
              ))}
            </Card.Group>
          </Segment>
        </MediaQuery>

        {/* <Icon
                  name="arrow left"
                  size="big"
                  
                  disabled={false}
                />
        
        <Button negative>Negative Button</Button> */}

        <div className="parentDiv">
          <div className="leftcol">
            {" "}
            <Icon
              name="arrow left"
              size="big"
              onClick={this.props.backFromResult}
              disabled={false}
            />
          </div>
          <div className="center">
            <Button negative onClick={this.props.resetForm}>
              Start Over
            </Button>
          </div>
          <div className="rightcol"></div>
        </div>
      </>
    );
  };
}

export default CardContainer;
