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
 */
function getEntriesHtml( elems, first, hasResults ) {
	let html = '';
	STORE.displayed = [];
	// Feedback if nothing found
	if ( elems.length === 0 ) {
		html += `<div class="no-results"> <p>No ${ ( filter || hasResults ) ? 'search results' : 'links'} found.</p> </div>`;
	} else {
		for ( let i = first ; i < elems.length && i < first + ENTRIES_PER_PAGE ; i++ ) {
			STORE.displayed.push(elems[i]);
			html +=
				`<div class="links-entry">
					<h3><a href="${STORE.links[elems[i]].link}">${STORE.links[elems[i]].title} <i class="fas fa-external-link-alt"></i></a></h3>
					<p>${STORE.links[elems[i]].text}</p>
				</div>`;
		}
	}
	return html;
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

	STORE.pagePrefix = 'links';
	STORE.entriesPerPage = ENTRIES_PER_PAGE;
	STORE.displayed = [];

	$('.menu').find('.links-link').addClass('current-page-link');
	$(ownPageLinkHandler);
	
	$(gotoPageHandler);
	// Search field handlers
	$(clearSearchHandler);
	$(searchHandler);
	$(searchSubmitHandler);

	displayPage( 0 );
}

$(document).ready( function() { main() } );
