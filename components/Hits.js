import { connectStateResults } from "react-instantsearch-dom";
import { Link } from "next/link";
import { useRouter } from "next/router";

function Hits({ searchState, searchResults }) {
  const router = useRouter();
  const validQuery = searchState.query?.length >= 3; // 3 is the minimum query length

  return (
    <>
      {searchResults?.hits.length === 0 && validQuery && (
        <p>No results found!</p>
      )}

      {searchResults?.hits.length > 0 && validQuery && (
        <>
          {searchResults.hits.map((hit, index) => {
            console.log(hit.permalink.split("/")[3]);

            let uri = hit.permalink.split("/")[3];
            return (
              //   <Link href={`/${uri}`} className={"card"}>
              <div
                tabIndex={index}
                key={hit.objectID}
                onClick={() => router.push(`/${uri}`)}
              >
                <p>{hit.post_title}</p>
              </div>
              //   </Link>
            );
          })}
        </>
      )}
    </>
  );
}

export default connectStateResults(Hits);
