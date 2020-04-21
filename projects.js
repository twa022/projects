"using strict";

const ENTRIES_PER_PAGE = 2;

function displayProjects( first = 0, filter = "", hasResults = false ) {
	if ( !hasResults ) {
		if ( filter ) {
			performSearch( filter );
		} else {
			delete STORE.results;
		}
	}
	const elems = ( STORE.hasOwnProperty( 'results' ) ) ? STORE.results : [...Array(STORE.projects.length).keys()];
	if ( first >= elems.length ) {
		first = elems.length - 1;
	}
	first = ( first < 0 ) ? 0 : first;
	if ( !searchRequiresDisplayUpdate( first ) ) {
		return;
	}
	let html = '';
	for ( let i = first ; i < elems.length && i < first + ENTRIES_PER_PAGE ; i++ ) {
		const project = STORE.projects[elems[i]];
		html += `
		<div class="projects-entry" data-id="${project.id}" data-idx=${i}>
			<div class="projects-name">
				<h3><a href="${project.link}">${project.title}</a></h3>
			</div>
			<div class="project-summary">
				<div class="project-image">
					<img src="${project.gallery[0].image}" alt="${project.gallery[0].alt} picture">
					<div class="entry-gallery-text">Click for Gallery</div>
				</div>
				${project.text}
			</div>
		</div>`
	}
	$('.projects-entries').html( html );
	displayNav( 'projects', ENTRIES_PER_PAGE );
}


function resetSearch() {
	displayProjects();
}

function search( term = "" ) {
	displayProjects( 0, term );
}

function displayPage( page = 0 ) {
	displayProjects( page * ENTRIES_PER_PAGE, "", true );
}

function performSearch( term = "" ) {
	const terms = term.toLowerCase().split('/\s+');
	STORE.results = [];
	for ( let i = 0 ; i < STORE.projects.length ; i++ ) {
		let match = terms.every( function( t ) {
			return STORE.projects[i].title.toLowerCase().includes( t ) || STORE.projects[i].text.toLowerCase().includes( t );
		});
		if ( match ) {
			STORE.results.push(i);
		}
	}
	console.log(`Searched for ${term}: elements matching: ${STORE.results}`);
}


function generateGallery( id ) {
	let html = '';
	const gallery = STORE.projects.find( e => Number(e.id) === Number(id) ).gallery;
	gallery.forEach( function( i ) {
		html += 
			`<div class="gallery-item">
					<img src="${i.image}" alt="${i.alt}">
					<div class="gallery-caption">${i.caption}</div>
			</div>`;
	});
	if ( gallery.length <= 1 ) {
		$('.gallery .btn-arrow').addClass('no-display');
	} else {
		$('.gallery .btn-arrow').removeClass('no-display');
	}
	$('.gallery-slider').html( html );
}

function galleryNext() {
	console.log('sliding to next');
	$('.gallery-slider').animate(
		{ left: `-=${Number($('.gallery-item:first-child').width())}px` },
		1200, 
		function() {
			$('.gallery-item:last-child').after($('.gallery-item:first-child'));
			$('.gallery-slider').css({'left': '0%'});
		}
	);
}

function galleryPrev() {
	console.log('sliding to previous');
	const width = Number($('.gallery-item:first-child').width());
	$('.gallery-item:first-child').before($('.gallery-item:last-child'));
	$('.gallery-slider').css({'left': `${ -1 * width }px`} );
	$('.gallery-slider').animate(
		{ left: `+=${width}` },
		1200, 
		function() { $('.gallery-slider').css('left', '0%'); }
	);
}

function galleryHandler() {
	$('.projects-entries').on('click', 'img', function( event ) {
		event.stopPropagation();
		try {
			generateGallery( $(this).closest('.projects-entry').data('id') );
			overlayBoxIn( 'gallery' );
		} catch ( e ) { };
	})
}

function galleryNextHandler() {
	$('#gallery-next').click( function( event ) {
		console.log('gallery-next');
		galleryNext();
	});
}

function galleryPrevHandler() {
	$('#gallery-prev').click( function( event ) {
		console.log('gallery-prev');
		galleryPrev();
	});
}

async function main() {
	await commonMain();
	$('body').data('entries-per-page', ENTRIES_PER_PAGE );

	displayPage();
	$(galleryHandler);
	$(galleryNextHandler);
	$(galleryPrevHandler);
	$(gotoPageHandler);
	// Search field handlers
	$(clearSearchHandler);
	$(searchHandler);
	$(searchSubmitHandler);

}

$(document).ready( function() { main() } );
