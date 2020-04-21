
const ENTRIES_PER_PAGE = 2;

function displayBlogs( first = 0, filter = "", hasResults = false ) {
	if ( !hasResults ) {
		if ( filter ) {
			performSearch( filter );
		} else {
			delete STORE.results;
		}
	}
	const elems = ( STORE.hasOwnProperty( 'results' ) ) ? STORE.results : [...Array(STORE.blog.length).keys()];
	if ( first >= elems.length ) {
		first = elems.length - 1;
	}
	first = ( first < 0 ) ? 0 : first;
	let html = '';
	console.log( `first: ${first}, elems.length: ${elems.length}, first + ENTRIES_PER_PAGE: ${first + ENTRIES_PER_PAGE}` );
	for ( let i = first ; i < elems.length && i < first + ENTRIES_PER_PAGE ; i++ ) {
		console.log('adding to the results html');
		console.log(`${elems[i]}, ${STORE.blog[elems[i]].image}, ${STORE.blog[elems[i]].title}, ${STORE.blog[elems[i]].text}`);
		html +=
			`<div class="blog-entry" data-idx=${elems[i]}>
				<img class="blog-img" src="${STORE.blog[elems[i]].image}" alt="${STORE.blog[elems[i]].title}">
				<h3>${STORE.blog[elems[i]].title}</h3>
				<p>${STORE.blog[elems[i]].text}</p>
			</div>`;
	}
	console.log(`html: ${html}`);
	$('.blog-entries').html( html );
	displayNav( 'blog', ENTRIES_PER_PAGE );
}


function resetSearch() {
	displayBlogs();
}

function search( term = "" ) {
	displayBlogs( 0, term );
}

function displayPage( page = 0 ) {
	displayBlogs( page * ENTRIES_PER_PAGE, "", true );
}

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

async function main() {
	await commonMain();
	$('body').data('entries-per-page', ENTRIES_PER_PAGE );

	$(clearSearchHandler);
	$(gotoPageHandler);
	// Search field handlers
	$(clearSearchHandler);
	$(searchHandler);
	$(searchSubmitHandler);

	displayBlogs();
}

$(document).ready( function() { main() } );
