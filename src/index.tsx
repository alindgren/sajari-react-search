import * as React from "react";
import { render } from "react-dom";
import { css } from "emotion";
import {
  Provider,
  Pipeline,
  Values,
  NoTracking,
  EVENT_SELECTION_UPDATED
} from "@sajari/sdk-react";
import { Interface, filter } from "./interface";

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

const values = new Values();
values.set({ count: "tag"});

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
