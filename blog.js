"using strict";

/********************************
 *           GLOBALS            *
 ********************************/

/** Maximum number of blog entries to show per page */
const ENTRIES_PER_PAGE = 2;

/********************************
 *          FUNCTIONS           *
 ********************************/

/**
 */
function getEntriesHtml( elems, first, filter, hasResults ) {
	STORE.displayed = [];
	let html = '';
	// Feedback if nothing found
	if ( elems.length === 0 ) {
		html += `<div class="no-results"> <p>No ${ ( filter || hasResults ) ? 'search results' : 'blog entries'} found.</p> </div>`;
	}
	for ( let i = first ; i < elems.length && i < first + ENTRIES_PER_PAGE ; i++ ) {
		STORE.displayed.push(elems[i]);
		html +=
			`<div class="blog-entry" data-idx=${elems[i]}>
				<h3>${STORE.blog[elems[i]].title}</h3>
				<img class="blog-img" src="${STORE.blog[elems[i]].image}" alt="${STORE.blog[elems[i]].title}">
				<div class="blog-text">${STORE.blog[elems[i]].text}</div>
			</div>`;
	}
	return html;
}

/**
 * Perform a search of the blog entries for the term provided and store the indices
 * that match in STORE.results
 * @param {String} term - The search term to search against
 * @sideeffects - STORE.results is updated with the indices that match this search
 */
function performSearch( term = "" ) {
	const terms = term.toLowerCase().split('/\s+');
	STORE.results = [];
	for ( let i = 0 ; i < STORE.blog.length ; i++ ) {
		let match = terms.every( function( t ) {
			return STORE.blog[i].title.toLowerCase().includes( t ) || STORE.blog[i].text.toLowerCase().includes( t );
		});
		if ( match ) {
			STORE.results.push(i);
		}
	}
	console.log(`Searched for ${term}: elements matching: ${STORE.results}`);
}

/**
 * Main function run on page load. Activates all event handlers and displays the blog entries from STORE
 */
async function main() {
	// Have to wait for this to finish since commonMain loads the STORE and we need it to populate the page
	await commonMain();

	STORE.entriesPerPage = ENTRIES_PER_PAGE;
	STORE.pagePrefix = 'blog';
	STORE.displayed = [];
	
	$(clearSearchHandler);
	$(gotoPageHandler);
	// Search field handlers
	$(clearSearchHandler);
	$(searchHandler);
	$(searchSubmitHandler);

	displayPage( 0 );
}

$(document).ready( function() { main() } );
