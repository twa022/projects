
const ENTRIES_PER_PAGE = 2;

function displayLinks( first = 0, filter = "", hasResults = false ) {
	if ( !hasResults ) {
		if ( filter ) {
			performSearch( filter );
		} else {
			delete STORE.results;
		}
	}
	const elems = ( STORE.hasOwnProperty( 'results' ) ) ? STORE.results : [...Array(STORE.links.length).keys()];
	if ( first >= elems.length ) {
		first = elems.length - 1;
	}
	first = ( first < 0 ) ? 0 : first;
	let html = '';
	console.log( `first: ${first}, elems.length: ${elems.length}, first + ENTRIES_PER_PAGE: ${first + ENTRIES_PER_PAGE}` );
	for ( let i = first ; i < elems.length && i < first + ENTRIES_PER_PAGE ; i++ ) {
		console.log('adding to the results html');
		html +=
			`<div class="links-entry" data-idx=${elems[i]}>
				<h3><a href="${STORE.links[elems[i]].link}">${STORE.links[elems[i]].title} <i class="fas fa-external-link-alt"></i></a></h3>
				<p>${STORE.links[elems[i]].text}</p>
			</div>`;
	}
	console.log(`html: ${html}`);
	$('.links-entries').html( html );
	displayNav( 'links', ENTRIES_PER_PAGE );
}


function resetSearch() {
	displayLinks();
}

function search( term = "" ) {
	displayLinks( 0, term );
}

function displayPage( page = 0 ) {
	displayLinks( page * ENTRIES_PER_PAGE, "", true );
}

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

async function main() {
	await commonMain();
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
