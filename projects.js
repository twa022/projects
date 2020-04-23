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
 */
function getEntriesHtml( elems, first, hasResults ) {
	STORE.displayed = [];
	let html = '';
	for ( let i = first ; i < elems.length && i < first + ENTRIES_PER_PAGE ; i++ ) {
		const project = STORE.projects[elems[i]];
		STORE.displayed.push(elems[i]);
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
	return html;
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

function gallerySwipeLeftHander() {
	$('.gallery').on('swipeleft', function( event ) {
		galleryNext();
	});
}

function gallerySwipeRightHander() {
	$('.gallery').on('swiperight', function( event ) {
		galleryPrev();
	});
}

/**
 * Main function run on page load. Activates all event handlers and displays the projects from STORE
 */
async function main() {
	// Have to wait for this to finish since commonMain loads the STORE and we need it to populate the page
	await commonMain();

	STORE.entriesPerPage = ENTRIES_PER_PAGE;
	STORE.pagePrefix = 'projects';
	STORE.displayed = [];

	$('.menu').find('.projects-link').addClass('current-page-link');
	$(ownPageLinkHandler);

	displayPage( 0 );
	$(galleryHandler);
	$(galleryNextHandler);
	$(galleryPrevHandler);
	$(gallerySwipeLeftHander);
	$(gallerySwipeRightHander);
	$(gotoPageHandler);
	// Search field handlers
	$(clearSearchHandler);
	$(searchHandler);
	$(searchSubmitHandler);

}

$(document).ready( function() { main() } );
