import algoliasearch from "algoliasearch/lite";
import { InstantSearch } from "react-instantsearch-dom";
import Hits from "./Hits";
import SearchBox from "./SearchBox";

const searchClient = algoliasearch(
  "ST2FATTLQD",
  "e3989f2487ff2263feb433b1ec38bbab"
);

export default function SearchBar() {
  return (
    <>
      <InstantSearch
        searchClient={searchClient}
        indexName="practicesearchable_posts"
      >
        {/* Adding Search Box */}
        <SearchBox />
        {/* Adding Data */}
        <Hits />
      </InstantSearch>
    </>
  );
}
