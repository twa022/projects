"using strict";

/********************************
 *           GLOBALS            *
 ********************************/

/** Maximum number of links to show per page */
const ENTRIES_PER_PAGE = 2;

/********************************
 *          FUNCTIONS           *
 ********************************/

/**
 * Display the links starting from a certain index with an option filter
 * @param {Number}  first      - The first index from the matching results to display
 * @param {String}  filter     - An optional search filter to apply
 * @param {Boolean} hasResults - Whether or not results have already been generated for the filter
 */
function displayLinks( first = 0, filter = "", hasResults = false ) {
	if ( !hasResults ) {
		if ( filter ) {
			performSearch( filter );
		} else {
			delete STORE.results;
		}
	}
	// list of the indices in STORE.blog that match the filter; or if no filter
	// just an array of the indices of the STORE.blog array (0..length - 1)
	const elems = ( STORE.hasOwnProperty( 'results' ) ) ? STORE.results : [...Array(STORE.links.length).keys()];
	if ( first >= elems.length ) {
		first = elems.length - 1;
	}
	first = ( first < 0 ) ? 0 : first;
	// Don't repaint the screen if not required
	if ( !searchRequiresDisplayUpdate( first ) ) {
		// But do repaint the nav buttons (the visible search results might not have changed, but the
		// whole search results array might have grown or shrunk...
		displayNav( 'links', ENTRIES_PER_PAGE );
		return;
	}
	let html = '';
	// Feedback if nothing found
	if ( elems.length === 0 ) {
		html += `<div class="no-results"> <p>No ${ ( filter || hasResults ) ? 'search results' : 'links'} found.</p> </div>`;
	}
	for ( let i = first ; i < elems.length && i < first + ENTRIES_PER_PAGE ; i++ ) {
		html +=
			`<div class="links-entry" data-idx=${elems[i]}>
				<h3><a href="${STORE.links[elems[i]].link}">${STORE.links[elems[i]].title} <i class="fas fa-external-link-alt"></i></a></h3>
				<p>${STORE.links[elems[i]].text}</p>
			</div>`;
	}
	$('.links-entries').html( html );
	displayNav( 'links', ENTRIES_PER_PAGE );
}

/**
 * Display the links with no filters
 */
function resetSearch() {
	displayLinks();
}

/**
 * Search the links for a certain term and display the matching results
 * @param {String} term - The search term to search the blog entries against
 */
function search( term = "" ) {
	displayLinks( 0, term );
}

/**
 * Display a certain page of the links with the filter currently in use
 * @param {Number} page - The page number (zero-indexed) to display
 */
function displayPage( page = 0 ) {
	displayLinks( page * ENTRIES_PER_PAGE, "", true );
}

/**
 * Perform a search of the links for the term provided and store the indices
 * that match in STORE.results
 * @param {String} term - The search term to search against
 * @sideeffects - STORE.results is updated with the indices that match this search
 */
function performSearch( term = "" ) {
	const terms = term.toLowerCase().split('/\s+');
	STORE.results = [];
	for ( let i = 0 ; i < STORE.links.length ; i++ ) {
		let match = terms.every( function( t ) {
			return STORE.links[i].title.toLowerCase().includes( t ) || STORE.links[i].text.toLowerCase().includes( t );
		});
		if ( match ) {
			STORE.results.push(i);
		}
	}
	console.log(`Searched for ${term}: elements matching: ${STORE.results}`);
}

/**
 * Main function run on page load. Activates all event handlers and displays the links from STORE
 */
async function main() {
	// Have to wait for this to finish since commonMain loads the STORE and we need it to populate the page
	await commonMain();

	// Certain common functions need to know the value of ENTRIES_PER_PAGE
	// Put it as a data attribute on the body element so it can be retrieved
	$('body').data('entries-per-page', ENTRIES_PER_PAGE );

	$(clearSearchHandler);
	$(gotoPageHandler);
	// Search field handlers
	$(clearSearchHandler);
	$(searchHandler);
	$(searchSubmitHandler);

	
	displayPage( 0 );
}

$(document).ready( function() { main() } );
