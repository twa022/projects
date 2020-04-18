
const ENTRIES_PER_PAGE = 2;

function displayPage( first ) {
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
