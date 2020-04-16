
const ENTRIES_PER_PAGE = 2;

function displayLinks( first ) {
	let html = '';
	if ( first >= STORE.links.length ) first = STORE.links.length - ENTRIES_PER_PAGE;
	if ( first < 0 ) first = 0;

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

function searchLinksHander() {
	$('#links-search-field').on('change', function( event ) {
		console.log(`searching for ${$('#links-search-field').val()}`);
	});
}

function clearSearchHandler() {
	$('#clear-field').click( function( event ) {
		$('#links-search-field').val('');
	});
}

async function main() {
	await commonMain();
	$('body').data('entries-per-page', ENTRIES_PER_PAGE );

	$(searchLinksHander);
	$(clearSearchHandler);
	$(gotoPageHandler);
	
	displayLinks( 0 );
}

$(document).ready( function() { main() } );
