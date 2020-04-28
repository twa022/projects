"using strict";

/********************************
 *           GLOBALS            *
 ********************************/

/** Stored variables and data for the page loaded from the store.json file */
let STORE;
/** How long slideshow animations should last in milliseconds */
const ANIMATION_TIME_MS = 1200;
/** Keycode for the escape key */
const KEYPRESS_ESC = 27;
/** Keycode for the enter key */
const KEYPRESS_ENTER = 13;

/********************************
 *          FUNCTIONS           *
 ********************************/

/**
 * Generate the bio from the STORE and update the page
 * (Bio is not displayed by default)
 */
async function generateBio() {
	$('.bio-image').html(`<img src=${STORE.bio.image} alt="Ted Alff">`);
	$('.bio-text').html(STORE.bio.text);
}

/**
 * Load the STORE variable from the json file
 * @param {String} file - The json to load
 */
async function loadStore( file ) {
	try {
		let response = await fetch( file );
		if ( !response.ok ) { 
			console.log( `response.ok is not okay!`);
			return;
		}
		STORE = await response.json();
	} catch ( e ) {
		console.log( 'Caught an error ' + e.message );
		STORE = null;
		return;
	}
}

/**
 * Display the overlay layer and the overlay box that has the class specified
 * @param {String} className - a class identifier for the overlay box to be displayed
 */
function overlayBoxIn( className ) {
	$('.overlay-layer').fadeIn();
	$('.hamburger-menu').fadeOut();
	const pad = Number($('header').css('padding-right').replace('px', ''));
	$(`.${className}`).css("right", ( $(window).width() - $('header').width() ) / 2 - pad );
	$(`.${className}`).fadeIn();
}

/**
 * Close the overlay box and layer
 */
function overlayOut() {
	$('.overlay-box').fadeOut( function() { $('.overlay-layer').fadeOut(); } );
}

/**
 * Display page navigation links
 * @param {String} page - the page prefix of the current page -- The key in STORE that corresponds to the page's data
 * @param {Number} entriesPerPage - The number of entries to display per page
 */
function displayNav() {
	let html = '';
	const elems = ( STORE.hasOwnProperty( 'results' ) ) ? STORE.results : [...Array(STORE[STORE.pagePrefix].length).keys()];
	console.log( `Elems: ${elems}: ${elems.length}` );
	// If there are zero or one pages, we don't need the nav buttons
	if ( STORE.numPages <= 1 ) {
		$('.page-nav').addClass('no-display');
		$('.entries').addClass('last-child-no-border-bottom');
		return;
	} else {
		$('.page-nav').removeClass('no-display');
		$('.entries').removeClass('last-child-no-border-bottom');
	}
	const curFirstIdx = STORE.displayed[0];
	console.log( `STORE.currentPage: ${STORE.currentPage}, STORE.numPages: ${STORE.numPages}` );
	const btnsToDisplay = ( $( window ).width() < 450 ) ? 1 : 2;
	const first = ( STORE.currentPage - btnsToDisplay > 0 ) ? STORE.currentPage - btnsToDisplay : 0;
	let last = STORE.currentPage + btnsToDisplay;
	if ( last - first < btnsToDisplay * 2 ) {
		last = first + btnsToDisplay * 2;
	}
	if ( last >= STORE.numPages ) {
		last = STORE.numPages - 1;
	}
	if ( first > 0 ) {
		html += `<li><button class="btn-page-nav nav-first-page" aria-label="first-page"><i class="fas fa-angle-double-left"></i></button></li> `;
	}
	if ( STORE.numPages > 1 && STORE.currentPage != 0 ) {
		html += `<li><button class="btn-page-nav nav-prev-page" aria-label="previous-page"><i class="fas fa-angle-left"></i></button></li> `;
	}
	for ( let i = first ; i <= last ; i++ ) {
		if ( i === STORE.currentPage ) {
			html += `<li><button class="btn-page-nav current-page" disabled>${i + 1}</i></button></li> `;
		} else {
			html += `<li><button class="btn-page-nav">${i + 1}</i></button></li> `;
		}
	}
	if ( STORE.numPages > 1 && STORE.currentPage < STORE.numPages - 1 ) {
		html += `<li><button class="btn-page-nav nav-next-page" aria-label="Next Page"><i class="fas fa-angle-right"></i></button></li> `;
		html += `<li><button class="btn-page-nav nav-last-page" aria-label="Last Page"><i class="fas fa-angle-double-right"></i></button></li> `;
	}
	
	$('.page-nav').find('ul').html( html );
}

/**
 * Return whether or not a search requires the display to be updated
 * (If the new search would display the same search results as the current view, there's no point
 * to repainting which causes the element to flash)
 * @param {Number} first - The first index of the results that will be displayed
 * @return {Boolean} - Whether or not the displayed entries match the entries that would be displayed based on current results
 */
function searchRequiresDisplayUpdate( first ) {
	const elems = ( STORE.hasOwnProperty( 'results' ) ) ? STORE.results : [...Array(STORE[STORE.pagePrefix].length).keys()];
	let updateDisplay = ( ( STORE.displayed.length === 0 && elems.length !== 0 ) || ( elems.length != STORE.displayed.length && elems.length <= ENTRIES_PER_PAGE ) || STORE[STORE.pagePrefix].length === 0 );
	let i = 0 ;
	while ( !updateDisplay && i < elems.length && i < first + ENTRIES_PER_PAGE ) {
		console.log( `${STORE.displayed[i - first]}, ${elems[i]}` );
		updateDisplay = STORE.displayed[i - first] != elems[i];
		i++;
	}
	console.log(`updateDisplay: ${updateDisplay}`);
	return updateDisplay;
}

/**
 * Display the links starting from a certain index with an option filter
 * @param {Number}  first      - The first index from the matching results to display
 * @param {String}  filter     - An optional search filter to apply
 * @param {Boolean} hasResults - Whether or not results have already been generated for the filter
 */
function displayEntries( first = 0, filter = "", hasResults = false ) {
	if ( !hasResults ) {
		if ( filter ) {
			performSearch( filter );
		} else {
			delete STORE.results;
		}
	}
	// list of the indices in STORE[STORE.pagePrefix] that match the filter; or if no filter
	// just an array of the indices of the STORE[STORE.pagePrefix] array (0..length - 1)
	const elems = ( STORE.hasOwnProperty( 'results' ) ) ? STORE.results : [...Array(STORE[STORE.pagePrefix].length).keys()];
	if ( first >= elems.length ) {
		first = elems.length - 1;
	}
	first = ( first < 0 ) ? 0 : first;
	if ( elems.length === 0 ) {
		STORE.currentPage = 0;
	} else {
		STORE.currentPage = Math.floor( first / STORE.entriesPerPage );
	}
	STORE.numPages = Math.ceil( elems.length / STORE.entriesPerPage );

	// Don't repaint the screen if not required
	if ( !searchRequiresDisplayUpdate( first ) ) {
		// But do repaint the nav buttons (the visible search results might not have changed, but the
		// whole search results array might have grown or shrunk...
		displayNav();
		return;
	}
	$('.entries').html( getEntriesHtml( elems, first, filter, hasResults ) ); // This updates STORE.displayed
	displayNav();
}

/**
 * Display the links with no filters
 */
function resetSearch() {
	displayEntries();
}

/**
 * Search the links for a certain term and display the matching results
 * @param {String} term - The search term to search the blog entries against
 */
function search( term = "" ) {
	displayEntries( 0, term );
}

/**
 * Display a certain page of the links with the filter currently in use
 * @param {Number} page - The page number (zero-indexed) to display
 */
function displayPage( pageNum = 0 ) {
	displayEntries( pageNum * STORE.entriesPerPage, "", true );
}

/********************************
 *        EVENT HANDLERS        *
 ********************************/

/**
 * Event handler when the home link is clicked 
 * No need to reload the page since we're already on the home page
 */
function ownPageLinkHandler() {
	$('.menu').on('click', '.current-page-link', function( event ) {
		event.preventDefault();
		overlayOut();
	})
}

/**
 * Event handler when the hamburger menu button is pressed (smaller screen menu)
 * Displays the menu as an overlay
 */
function hamburgerMenuHandler() {
	$('.hamburger').click( function( event ) { 
		event.preventDefault();
		event.stopPropagation();
		overlayBoxIn( 'hamburger-menu');
	});
}

/**
 * Event handler when the contact link is clicked
 * Displays contact links as an overlay
 */
function contactLinkHandler() {
	$('.contact-link').click( function( event ) { 
		event.preventDefault();
		event.stopPropagation();
		overlayBoxIn( 'contact-overlay');
	});
}

/**
 * Event handler when the bio link is clicked
 * Displays the bio as an overlay
 */
function bioLinkHandler() {
	$('.bio-link').click( function( event ) { 
		event.preventDefault();
		event.stopPropagation();
		overlayBoxIn( 'bio' );
	});
}

/**
 * Event handler when the overlay layer is clicked (fades out the overlay).
 * The overlay layer completely covers the page except the overlay box, so when an overlay
 * box is visible, clicking anywhere outside that box on the page will activate the handler.
 */
function overlayOutHandler() {
	$('.overlay-layer').click( function( event ) {
		overlayOut();
	});
}

/**
 * Event handler activated when the page is resized.
 * The overlays have to have their right offset dynamically calculated to position correctly
 */
function resizeHandler() {
	$(window).resize( function( event ) {
		const currentWidth = $(window).width();
		if ( currentWidth === STORE.oldWidth ) {
			return;
		}
		const rightOffset = ( currentWidth - $('header').width() ) / 2 - STORE.headerPad;
		$('.overlay-box').css("right", rightOffset );
		if ( currentWidth > 450 ? STORE.oldWidth <= 450 : STORE.oldWidth > 450 ) {
			displayNav();
		}
		STORE.oldWidth = currentWidth;
	});
}

/**
 * Event handler activated when a page navigation button is clicked.
 * Displays the requested page of the current search results
 */
function gotoPageHandler() {
	$('.page-nav').on('click', '.btn-page-nav', function( event ) {
		event.preventDefault();
		const elems = ( STORE.hasOwnProperty( 'results' ) ) ? STORE.results : [...Array(STORE[STORE.pagePrefix].length).keys()];
		let pageNum;
		if ( $(this).hasClass( 'nav-first-page' ) ) {
			pageNum = 0;
		} else if ( $(this).hasClass( 'nav-prev-page' ) ) {
			pageNum = STORE.currentPage - 1;
		} else if ( $(this).hasClass( 'nav-next-page' ) ) {
			pageNum = STORE.currentPage + 1;
		} else if ( $(this).hasClass( 'nav-last-page' ) ) {
			pageNum = STORE.numPages - 1;
		} else {
			pageNum = Number( $(this).html() ) - 1;
		}
		console.log( `pageNum: ${pageNum}` );
		displayPage( pageNum );
		window.scrollTo(0, 0);
	});
}

/**
 * Event handler when the clear search field button is clicked
 * (Clear the search field and reset the list of displayed quizzes to default (starts at index 0, no filter))
 */
function clearSearchHandler() {
	$('#clear-search').click( function( event ) {
		event.preventDefault();
		$('.search-field').val('');
		$('#clear-search').addClass('no-display');
		resetSearch();
	})
}

/**
 * Handle special keypresses in the search quiz list input
 */
function searchSubmitHandler() {
	$('.search-field').on('keydown', function( event ) {
		// Enter key should not submit the form
		if (event.keyCode === KEYPRESS_ENTER) {
			event.stopPropagation();
			event.preventDefault();
		}
		// Escape key should clear the field and reset the search.
		if (event.keyCode === KEYPRESS_ESC) {
			event.stopPropagation();
			event.preventDefault();
			$('.search-field').val('');
			$('#clear-search').addClass('no-display');
			resetSearch();
		}
	});
}

/**
 * Event handler when user enters / changes the search term in the quiz list search field.
 * Called any time the text in the input field changes
 */
function searchHandler() {
	$('.search-field').on('input', function( event ) {
		if ( ! $('.search-field').val() ) {
			$('#clear-search').addClass('no-display');
			resetSearch();
			return;
		}
		$('#clear-search').removeClass('no-display');
		console.log(`Searching for ${$('.search-field').val()}`);
		search( $('.search-field').val() );
	});
}

/**
 * Common function that should be run (and completed) before the page specific functions are run.
 * All pages that reference data from STORE should call await commonMain(); first before
 * referencing any data from STORE.
 */
async function commonMain() {
	// Firefox doesn't support the backdrop-filter CSS property yet; add alternate method of
	// obscuring the content behind the header on scroll.
	$('.header-background').addClass( ( CSS.supports("backdrop-filter: blur(2px)") ) ? 'header-background-blur' : 'header-background-cover' );
	// Activate all the event handlers
	$(hamburgerMenuHandler);
	$(contactLinkHandler);
	$(bioLinkHandler);
	$(overlayOutHandler);
	$(resizeHandler);

	await loadStore( 'store.json' );
	STORE.oldWidth = $( window ).width();
	STORE.headerPad = Number($('header').css('padding-right').replace('px', ''));

	console.log( STORE.projects[0].title );

	generateBio();
}
