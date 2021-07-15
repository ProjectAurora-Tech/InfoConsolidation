import "./CardContainer.css";

import { Card, Header, Segment } from "semantic-ui-react";

import Fuse from "fuse.js";
import InfoCard from "components/infoCard/InfoCard";
import React from "react";
import ReactGA from "react-ga";
import Tags from "static/Tags";
import _ from "underscore";

ReactGA.initialize("UA-139413334-1");

class CardContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trackNoResults: "enabled",
    };
  }

  filterResource = (allResources) => {
    // Filtering: OR within the same category, AND between categories

    // Check if filter is empty
    const activeFilters = _.omit(
      this.props.filter,
      function (filters, category) {
        return filters.length <= 0;
      }
    );

    // No filters applied, return everything
    if (_.isEmpty(activeFilters)) {
      return allResources;
    }

    let categoryMatches = _.map(activeFilters, (filters) => {
      //console.log(activeFilters, "activeFilters"); {cost: ["free","paid"], Accessibility:[]}
      //console.log(filters, "filters in categoryMatch");
      return _.filter(allResources, (resource) => {
        //console.log(resource, "resource in categoryMatches"); // return all resources
        return _.intersection(resource.tags, filters).length > 0;
        // intersection(multiple arrays)
      });
    });

    const categoryWithNames = _.map(categoryMatches, (category) => {
      //console.log(categoryMatches, "categoryMatches"); //nested array that contain value object that matches the tags
      return _.map(category, (resource) => {
        //console.log(category, "category in catwithNames"); // return array of value object that matches the selection == resources in render
        //console.log(resource, "resource in catwithNames"); // return each value object that matches the selection
        return resource.name;
      });
    });
    //console.log(categoryWithNames, "named category"); // nested array that contain resource name
    const commonNames = _.intersection(...categoryWithNames);
    //console.log(commonNames, "commonNames"); // array of filtered result (string value of resource name)

    // We know categoryMatches is not empty, access it to get resources in object format
    // return object that includes the commonNames
    return _.filter(categoryMatches[0], (resource) => {
      //console.log(resource, "resource in filter and catmatches");
      return _.indexOf(commonNames, resource.name) >= 0;
    });
  }; // end of filterResource function

  searchResource = (allResources) => {
    if (!this.props.searchText) {
      // Empty search string
      return allResources;
    }

    // When searching, search by tag's display name
    const resourcesForSearch = allResources.map((resource) => {
      return _.extend(resource, {
        tagsDisplayNames: resource.tags.map((tag) =>
          Tags.getDisplayNameForTag(tag)
        ),
      });
    });

    const options = {
      keys: ["name", "tagsDisplayNames"],
      threshold: 0.15,
    };
    const fuse = new Fuse(resourcesForSearch, options);
    const tempItems = fuse.search(this.props.searchText);
    const searchedPlaced = tempItems.map((x) => x.item);
    return searchedPlaced;
  };

  render = () => {
    let resources = this.filterResource(this.props.resources); // tag search
    //console.log(resources, "resouces in render first"); // return array of value object based on filter tags
    resources = this.searchResource(resources); // if no textsearch then same as tag search
    //console.log(resources, "resouces in render second"); // return array of value object based on filter tags or searchText
    if (resources.length === 0) {
      if (this.state.trackNoResults === "enabled") {
        ReactGA.event({
          category: "No Reults",
          action: "No Results Found Based On Filters/Search",
        });
        this.setState({ trackNoResults: "disabled" }); // TODO: this triggers a warning about how setState should not be called in render
      }

      return (
        <Segment placeholder>
          <Header icon>
            Sorry, no results found.
            <br />
            <br />
            Try a different search or filters.
          </Header>
        </Segment>
      );
    }

    return (
      <Segment basic>
        <Card.Group>
          {_.map(resources, (resource, index) => (
            <InfoCard key={index.toString()} {...resource} /> // spread each found resource to infoCard for display
          ))}
        </Card.Group>
      </Segment>
    );
  };
}

export default CardContainer;
