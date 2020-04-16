
const ENTRIES_PER_PAGE = 2;

function displayBlog( first ) {
	let html = '';
	if ( first >= STORE.blog.length ) first = STORE.blog.length - ENTRIES_PER_PAGE;
	if ( first < 0 ) first = 0;

	for ( let i = first ; i < STORE.blog.length && i < first + ENTRIES_PER_PAGE ; i++ ) {
		html +=
			`<div class="blog-entry" data-idx=${i}>
				<img class="blog-img" src="${STORE.blog[i].image}" alt="${STORE.blog[i].title}">
				<h3>${STORE.blog[i].title}</h3>
				<p>${STORE.blog[i].text}</p>
			</div>`;
	}
	$('.blog-entries').html( html );
	displayNav( 'blog', ENTRIES_PER_PAGE );
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

async function main() {
	await commonMain();
	$('body').data('entries-per-page', ENTRIES_PER_PAGE );

	$(searchBlogHander);
	$(clearSearchHandler);
	$(gotoPageHandler);
	
	displayBlog( 0 );
}

$(document).ready( function() { main() } );
