
const ENTRIES_PER_PAGE = 2;

function displayBlog( first ) {
	let html = '';
	if ( first >= STORE.blog.length ) first = STORE.blog.length - ENTRIES_PER_PAGE;
	if ( first < 0 ) first = 0;

	for ( let i = first ; i < STORE.blog.length && i < first + ENTRIES_PER_PAGE ; i++ ) {
		html +=
			`<div class="blog-entry" _idx=${i}>
				<img class="blog-img" src="${STORE.blog[i].image}" alt="${STORE.blog[i].title}">
				<h3>${STORE.blog[i].title}</h3>
				<p>${STORE.blog[i].text}</p>
			</div>`;
	}
	$('.blog-entries').html( html );
	displayNav();
}

function displayNav() {
	let html = '';
	let currentPage = Number($('.blog-entry:first-child').attr('_idx')) / ENTRIES_PER_PAGE;
	let numPages = Math.ceil( STORE.blog.length / ENTRIES_PER_PAGE );
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

	$('.blog-page-nav').find('ul').html( html );
}
	
	

function searchBlogHander() {
	$('#blog-search-field').on('change', function( event ) {
		console.log(`searching for ${$('#blog-search-field').val()}`);
	});
}

function clearSearchHandler() {
	$('#clear-field').click( function( event ) {
		$('#blog-search-field').val('');
	});
}

function gotoPageHandler() {
	$('.blog-page-nav').on('click', 'a', function( event ) {
		event.preventDefault();
		let text = $(this).html();
		console.log( `text: "${text}"; ${text.localeCompare( "First" )}` );
		
		let pgnum = 0;
		if ( text.localeCompare("First") === 0 ) {
			pgnum = 0;
		} else if ( text.localeCompare("Last") === 0 ) {
			pgnum = Math.ceil( STORE.blog.length / ENTRIES_PER_PAGE ) - 1;
		} else {
			pgnum = Number( text ) - 1;
		}
		console.log( `pgnum: ${pgnum}` );
		displayBlog( pgnum * ENTRIES_PER_PAGE );
	});
}

async function main() {
	await commonMain();

	$(searchBlogHander);
	$(clearSearchHandler);
	$(gotoPageHandler);
	
	displayBlog( 0 );
}

main();
