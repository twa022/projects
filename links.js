
const ENTRIES_PER_PAGE = 2;

function displayLinks( first ) {
	let html = '';
	if ( first >= STORE.links.length ) first = STORE.links.length - ENTRIES_PER_PAGE;
	if ( first < 0 ) first = 0;

	for ( let i = first ; i < STORE.links.length && i < first + ENTRIES_PER_PAGE ; i++ ) {
		html +=
			`<div class="links-entry" _idx=${i}>
				<h3><a href="${STORE.links[i].link}">${STORE.links[i].title} <i class="fas fa-external-link-alt"></i></a></h3>
				<p>${STORE.links[i].text}</p>
			</div>`;
	}
	$('.links-entries').html( html );
	displayNav();
}

function displayNav() {
	let html = '';
	let currentPage = Number($('.links-entry:first-child').attr('_idx')) / ENTRIES_PER_PAGE;
	let numPages = Math.ceil( STORE.links.length / ENTRIES_PER_PAGE );
	let first = currentPage - 2;
	if ( first < 0 ) first = 0;
	let last = currentPage + 2;
	if ( last - first < 4 ) last = first + 4;
	if ( last >= numPages ) last = numPages - 1;
	if ( first > 0 ) html += `<li><a href='#' style="text-decoration: underline">First</a></li> `;
	for ( let i = first ; i <= last ; i++ ) {
		if ( i === currentPage ) {
			html += `<li><a>${i + 1}</a></li> `;
		} else {
			html += `<li><a href='#' style="text-decoration: underline">${i + 1}</a></li> `;
		}
	}
	if ( last < numPages - 1 ) html += `<li><a href='#' style="text-decoration: underline">Last</a></li>`;

	$('.links-page-nav').find('ul').html( html );
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

function gotoPageHandler() {
	$('.links-page-nav').on('click', 'a', function( event ) {
		event.preventDefault();
		let text = $(this).html();
		console.log( `text: "${text}"; ${text.localeCompare( "First" )}` );
		
		let pgnum = 0;
		if ( text.localeCompare("First") === 0 ) {
			pgnum = 0;
		} else if ( text.localeCompare("Last") === 0 ) {
			pgnum = Math.ceil( STORE.links.length / ENTRIES_PER_PAGE ) - 1;
		} else {
			pgnum = Number( text ) - 1;
		}
		console.log( `pgnum: ${pgnum}` );
		displayLinks( pgnum * ENTRIES_PER_PAGE );
	});
}

async function main() {
	await commonMain();

	$(searchLinksHander);
	$(clearSearchHandler);
	$(gotoPageHandler);
	
	displayLinks( 0 );
}

main();
