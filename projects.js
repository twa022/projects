"using strict";

/********************************
 *           GLOBALS            *
 ********************************/

/** Maximum number of projects to show per page */
const ENTRIES_PER_PAGE = 2;

/********************************
 *          FUNCTIONS           *
 ********************************/

/**
 * Display the projects starting from a certain index with an option filter
 * @param {Number}  first      - The first index from the matching results to display
 * @param {String}  filter     - An optional search filter to apply
 * @param {Boolean} hasResults - Whether or not results have already been generated for the filter
 */
function displayProjects( first = 0, filter = "", hasResults = false ) {
	if ( !hasResults ) {
		if ( filter ) {
			performSearch( filter );
		} else {
			delete STORE.results;
		}
	}
	// list of the indices in STORE.blog that match the filter; or if no filter
	// just an array of the indices of the STORE.blog array (0..length - 1)
	const elems = ( STORE.hasOwnProperty( 'results' ) ) ? STORE.results : [...Array(STORE.projects.length).keys()];
	if ( first >= elems.length ) {
		first = elems.length - 1;
	}
	first = ( first < 0 ) ? 0 : first;
	// Don't repaint the screen if not required
	if ( !searchRequiresDisplayUpdate( first ) ) {
		// But do repaint the nav buttons (the visible search results might not have changed, but the
		// whole search results array might have grown or shrunk...
		displayNav( 'projects', ENTRIES_PER_PAGE );
		return;
	}
	let html = '';
	// Feedback if nothing found
	if ( elems.length === 0 ) {
		html += `<div class="no-results"> <p>No ${ ( filter || hasResults ) ? 'search results' : 'projects'} found.</p> </div>`;
	}
			
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

/**
 * Display the projects with no filters
 */
function resetSearch() {
	displayProjects();
}

/**
 * Search the projects for a certain term and display the matching results
 * @param {String} term - The search term to search the blog entries against
 */
function search( term = "" ) {
	displayProjects( 0, term );
}

/**
 * Display a certain page of the projects with the filter currently in use
 * @param {Number} page - The page number (zero-indexed) to display
 */
function displayPage( page = 0 ) {
	displayProjects( page * ENTRIES_PER_PAGE, "", true );
}

/**
 * Perform a search of the projects for the term provided and store the indices
 * that match in STORE.results
 * @param {String} term - The search term to search against
 * @sideeffects - STORE.results is updated with the indices that match this search
 */
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

/**
 * Generate the gallery slideshow for a project
 * @param {Number} id - The project id (STORE.projects.id from store.json)
 */
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

/**
 * Advance the slideshow gallery to the next slide.
 */
function galleryNext() {
	console.log('sliding to next');
	$('.gallery-slider').animate(
		{ left: `-=${Number($('.gallery-item:first-child').width())}px` },
		ANIMATION_TIME_MS, 
		function() {
			$('.gallery-item:last-child').after($('.gallery-item:first-child'));
			$('.gallery-slider').css({'left': '0%'});
		}
	);
}

/**
 * Advance the slideshow gallery to the previous slide.
 */
function galleryPrev() {
	console.log('sliding to previous');
	const width = Number($('.gallery-item:first-child').width());
	$('.gallery-item:first-child').before($('.gallery-item:last-child'));
	$('.gallery-slider').css({'left': `${ -1 * width }px`} );
	$('.gallery-slider').animate(
		{ left: `+=${width}` },
		ANIMATION_TIME_MS, 
		function() { $('.gallery-slider').css('left', '0%'); }
	);
}

/********************************
 *        EVENT HANDLERS        *
 ********************************/

/**
 * Event handler when the project image is clicked to display the project gallery.
 * Generates the gallery and displays it as an overlay box
 */
function galleryHandler() {
	$('.projects-entries').on('click', 'img', function( event ) {
		event.stopPropagation();
		try {
			generateGallery( $(this).closest('.projects-entry').data('id') );
			overlayBoxIn( 'gallery' );
		} catch ( e ) { };
	})
}

/**
 * Event handler when the next slide button on the gallery is activated
 * Advances the slideshow to the next slide.
 */
function galleryNextHandler() {
	$('#gallery-next').click( function( event ) {
		console.log('gallery-next');
		galleryNext();
	});
}

/**
 * Event handler when the previous slide button on the gallery is activated
 * Advances the slideshow to the previous slide.
 */
function galleryPrevHandler() {
	$('#gallery-prev').click( function( event ) {
		console.log('gallery-prev');
		galleryPrev();
	});
}

/**
 * Main function run on page load. Activates all event handlers and displays the projects from STORE
 */
async function main() {
	// Have to wait for this to finish since commonMain loads the STORE and we need it to populate the page
	await commonMain();

	// Certain common functions need to know the value of ENTRIES_PER_PAGE
	// Put it as a data attribute on the body element so it can be retrieved
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
