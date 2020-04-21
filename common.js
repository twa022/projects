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

async function generateBio() {
	$('.bio-image').html(`<img src=${STORE.bio.image} alt="Ted Alff">`);
	$('.bio-text').html(STORE.bio.text);
}

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

function overlayBoxIn( className ) {
	$('.overlay-layer').fadeIn();
	$('.hamburger-menu').fadeOut();
	const pad = Number($('header').css('padding-right').replace('px', ''));
	$(`.${className}`).css("right", ( $(window).width() - $('header').width() ) / 2 - pad );
	$(`.${className}`).fadeIn();
}

function overlayOut() {
	$('.overlay-box').fadeOut( function() { $('.overlay-layer').fadeOut(); } );
}

function displayNav( page, entriesPerPage ) {
	let html = '';
	const elems = ( STORE.hasOwnProperty( 'results' ) ) ? STORE.results : [...Array(STORE[page].length).keys()];
	console.log( `Elems: ${elems}: ${elems.length}` );
	const curFirstIdx = Number($(`.${page}-entry:first-child`).data('idx'));
	const currentPage = Math.floor( elems.indexOf( curFirstIdx ) / entriesPerPage );
	const numPages = Math.ceil( elems.length / entriesPerPage );
	// If there are zero or one pages, we don't need the nav buttons
	if ( numPages <= 1 ) {
		$('.page-nav').addClass('no-display');
		$('.entries').addClass('last-child-no-border-bottom');
		return;
	} else {
		$('.page-nav').removeClass('no-display');
		$('.entries').removeClass('last-child-no-border-bottom');
	}
	console.log( `currentPage: ${currentPage}, numPages: ${numPages}` );
	const first = ( currentPage - 2 > 0 ) ? currentPage - 2 : 0;
	let last = currentPage + 2;
	if ( last - first < 4 ) {
		last = first + 4;
	}
	if ( last >= numPages ) {
		last = numPages - 1;
	}
	console.log(`"${$(`.${page}-entry:first-child`).data('idx')}" first: ${first} last ${last}`)
	if ( first > 0 ) {
		html += `<li><button class="btn-page-nav nav-first-page" aria-label="first-page"><i class="fas fa-angle-double-left"></i></button></li> `;
	}
	if ( numPages > 1 && currentPage != 0 ) {
		html += `<li><button class="btn-page-nav nav-prev-page" aria-label="previous-page"><i class="fas fa-angle-left"></i></button></li> `;
	}
	for ( let i = first ; i <= last ; i++ ) {
		if ( i === currentPage ) {
			html += `<li><button class="btn-page-nav current-page" disabled>${i + 1}</i></button></li> `;
		} else {
			html += `<li><button class="btn-page-nav">${i + 1}</i></button></li> `;
		}
	}
	if ( numPages > 1 && currentPage < numPages - 1 ) {
		html += `<li><button class="btn-page-nav nav-next-page" aria-label="Next Page"><i class="fas fa-angle-right"></i></button></li> `;
		html += `<li><button class="btn-page-nav nav-last-page" aria-label="Last Page"><i class="fas fa-angle-double-right"></i></button></li> `;
	}
	
	$('.page-nav').find('ul').html( html );
}

function searchRequiresDisplayUpdate( first ) {
	const page = $('body').data('page-prefix');
	const elems = ( STORE.hasOwnProperty( 'results' ) ) ? STORE.results : [...Array(STORE[page].length).keys()];
	let displayed = [];
	$(`.${page}-entry`).each( function() {
		displayed.push( $(this).data('idx') );
	});
	console.log( `displayed: ${displayed}` );
	let updateDisplay = ( STORE[page].length === 0 || ( elems.length === 0 && displayed.length != 0 ) );
	let i = 0 ;
	while ( !updateDisplay && i < elems.length && i < first + ENTRIES_PER_PAGE ) {
		console.log( `${displayed[i - first]}, ${elems[i]}` );
		if ( displayed[i - first] != elems[i] ) {
			updateDisplay = true;
		}
		i++;
	}
	console.log(`updateDisplay: ${updateDisplay}`);
	return updateDisplay;
}

/********************************
 *        EVENT HANDLERS        *
 ********************************/

function hamburgerMenuHandler() {
	$('.hamburger').click( function( event ) { 
		event.preventDefault();
		event.stopPropagation();
		overlayBoxIn( 'hamburger-menu');
	});
}

function homeLinkHandler() {
	$('.home-link').click( function( event ) {
		overlayOut();
	})
}

function contactLinkHandler() {
	$('.contact-link').click( function( event ) { 
		event.preventDefault();
		event.stopPropagation();
		overlayBoxIn( 'contact-overlay');
	});
}

function bioLinkHandler() {
	$('.bio-link').click( function( event ) { 
		event.preventDefault();
		event.stopPropagation();
		overlayBoxIn( 'bio' );
	});
}

function overlayOutHandler() {
	$('.overlay-layer').click( function( event ) {
		overlayOut();
	});
}

function resizeHandler() {
	$(window).resize( function( event ) {
		const pad = Number($('header').css('padding-right').replace('px', ''));
		const rightOffset = ( $(window).width() - $('header').width() ) / 2 - pad;
		$('.hamburger-menu').css("right", rightOffset );
		$('.contact').css("right", rightOffset );
		$('.bio').css("right", rightOffset );
		//$('.overlay-layer').click();
	});
}

function gotoPageHandler() {
	$('.page-nav').on('click', '.btn-page-nav', function( event ) {
		event.preventDefault();
		const page = $('body').data('page-prefix');
		console.log(`page: ${page}`);
		const entriesPerPage = Number( $('body').data('entries-per-page') );
		const elems = ( STORE.hasOwnProperty( 'results' ) ) ? STORE.results : [...Array(STORE[page].length).keys()];
		const currentPage = elems.indexOf(Number($(`.${page}-entry:first-child`).data('idx'))) / entriesPerPage;
		const numPages = Math.ceil( elems.length / entriesPerPage );
		let pageNum;
		if ( $(this).hasClass( 'nav-first-page' ) ) {
			pageNum = 0;
		} else if ( $(this).hasClass( 'nav-prev-page' ) ) {
			pageNum = currentPage - 1;
		} else if ( $(this).hasClass( 'nav-next-page' ) ) {
			pageNum = currentPage + 1;
		} else if ( $(this).hasClass( 'nav-last-page' ) ) {
			pageNum = numPages - 1;
		} else {
			pageNum = Number( $(this).html() ) - 1;
		}
		console.log( `pageNum: ${pageNum}` );
		displayPage( pageNum * entriesPerPage );
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


async function commonMain() {
	// Activate all the event handlers
	$(hamburgerMenuHandler);
	$(homeLinkHandler);
	$(contactLinkHandler);
	$(bioLinkHandler);
	$(overlayOutHandler);
	$(resizeHandler);

	await loadStore( 'store.json' );
	console.log( STORE.projects[0].title );

	generateBio();
}
