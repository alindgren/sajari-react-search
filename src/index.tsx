import * as React from "react";
import { render } from "react-dom";
import { css } from "emotion";
import {
  Provider,
  Pipeline,
  Values,
  NoTracking,
  EVENT_SELECTION_UPDATED,
  EVENT_RESPONSE_UPDATED
} from "@sajari/sdk-react";
import { Interface, filter } from "./interface";

// takes the counts returned by Sajari and returns a 'dictionary' with the tag name as the key, and the value is the count
// sajari returns the colon separated list of tags as a key (e.g. "Computers:Culture:Technology")
function GetTagCounts(data) {
  var tagCounts = {};
  if (data === undefined) return tagCounts;

  Object.keys(data).map(function(objectKey, index) {
    var value = data[objectKey];
    var list = objectKey.split(";");
    list.forEach(function(i) {
      if (tagCounts[i] === undefined) tagCounts[i] = value;
      else tagCounts[i] = tagCounts[i] + value;
    });
  });

  return tagCounts;
}

const pipeline = new Pipeline(
  {
    project: "1529405364992493925",
    collection: "www-weizmann-usa-org"
  },
  "website",
  new NoTracking()
);

// duck punch pipeline.search in order to remove invalid filter
pipeline.origSearch = pipeline.search;
pipeline.search = function(values) {
  console.log("search()", values);
  if (values.filter === "(undefined)") {
    values.filter = "";
  }
  console.log("updated values", values);
  this.origSearch(values);
};

pipeline.listen(EVENT_RESPONSE_UPDATED, response => {
  if (response.isEmpty()) {
    // Empty response, could have been cleared via pipeline.clearResponse()
    console.log("empty response");
    return;
  }

  if (response.isError()) {
    // Error response, normally due to incorrect project/collection/pipeline
    // or transient errors contacting the server.
    console.error("error response:", response.getError());
    return;
  }

  console.log(response.getAggregates()["count.tag"]);
  console.log(GetTagCounts(response.getAggregates()["count.tag"]));

  response.getResults().forEach(result => {
    console.log(result);
  });
});

const values = new Values();
values.set({ count: "tag" });

values.set({ filter: () => filter.filter() });
filter.listen(EVENT_SELECTION_UPDATED, () => {
  values._emitUpdated();
  console.log("values", values);
  // only run search if the query string is non empty
  const query = values.get()["q"];
  if (query === undefined || query === "") {
    return;
  }
  pipeline.search(values.get());
});

const styles = css({
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
});

render(
  <Provider search={{ pipeline, values }}>
    <div className={styles}>
      <h1>My Test - Radio & Checkbox</h1>
      <Interface />
    </div>
  </Provider>,
  document.getElementById("root")
);
