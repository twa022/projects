
const ENTRIES_PER_PAGE = 2;

function displayPage( first ) {
	let html = '';
	if ( first >= STORE.links.length ) {
		first = STORE.links.length - ENTRIES_PER_PAGE;
	}
	first = ( first < 0 ) ? 0 : first;

	for ( let i = first ; i < STORE.links.length && i < first + ENTRIES_PER_PAGE ; i++ ) {
		html +=
			`<div class="links-entry" data-idx=${i}>
				<h3><a href="${STORE.links[i].link}">${STORE.links[i].title} <i class="fas fa-external-link-alt"></i></a></h3>
				<p>${STORE.links[i].text}</p>
			</div>`;
	}
	$('.links-entries').html( html );
	displayNav( 'links', ENTRIES_PER_PAGE );
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
