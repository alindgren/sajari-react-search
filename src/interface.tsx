import * as React from "react";
import { css } from "emotion";
import {
  Response,
  Input,
  Results,
  Summary,
  Paginator,
  FilterProvider,
  Filter,
  CombineFilters,
  Checkbox,
  Tabs,
  Values
} from "@sajari/sdk-react";

//const values = new Values();

// Any change to values should reset the paginator back to page 1
/*
values.listen(EVENT_VALUES_UPDATED, (changes, set) => {
  if (!changes.page) {
    set({ page: "1" });
  }
});

tabsFilter.listen(EVENT_SELECTION_UPDATED, () => {
  if (values.get()["q"]) {
    values.emitUpdated();
    pipeline.search(values.get());
  }
});*/

const tabsFilter = new Filter(
  {
    All: "",
    Main: "domain='www.weizmann-usa.org'",
    Blog: "domain='curiosity.weizmann-usa.org'",
    Wonder: "domain='www.weizmann.ac.il'",
    Fundraise: "domain='fundraise.weizmann-usa.org'"
  },
  "All"
);
//values.set({ filter: () => tabsFilter.filter() });

const tabs = [
  { name: "All", display: "All" },
  { name: "Main", display: "Weizmann-USA" },
  { name: "Blog", display: "The Curiosity Blog" },
  { name: "Wonder", display: "Weizmann Wonder Wander + WeizmannCompass" },
  { name: "Fundraise", display: "Project-Based Fundraising" }
];

export const categoryFilter = new Filter(
  {},
  [],
  true
);

export const filter = CombineFilters([tabsFilter, categoryFilter]);

const Categories: React.SFC<{ filter: Filter }> = ({ filter }) => (
  <FilterProvider filter={filter}>
    <div>
      <h3>Tags</h3>
      <ul>
        <li>
          <Checkbox name="Alternative energy" /> <label>Alternative energy</label>
        </li>
        <li>
          <Checkbox name="Computers" /> <label>Computers</label>
        </li>
        <li>
          <Checkbox name="Physics" /> <label>Physics</label>
        </li>
        <li>
          <Checkbox name="Astrophysics" /> <label>Astrophysics</label>
        </li>
      </ul>
    </div>
  </FilterProvider>
);

export const Interface: React.SFC = () => (
  <div className={containerCSS}>
    <div className={leftColCSS}>
      <Categories filter={categoryFilter} />
    </div>
    <div className={rightColCSS}>
      <Input mode="typeahead" dropdownMode="suggestions" />
      <Response>
        <Tabs filter={tabsFilter} tabs={tabs} />
        <Summary />
        <Results />
        <Paginator />
      </Response>
    </div>
  </div>
);

const containerCSS = css({
  display: "flex",
  justifyContent: "space-between"
});

const leftColCSS = css({
  width: "200px",
  boxSizing: "border-box",
  paddingRight: "1rem"
});

const rightColCSS = css({
  width: "calc(100% - 200px)"
});
