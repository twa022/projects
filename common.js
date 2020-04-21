"using strict";

/********************************
 *           GLOBALS            *
 ********************************/
let TIMER;

let STORE;

const MAX_BLOG_LINKS = 3;

const MAX_LINKS = 3;

/********************************
 *          FUNCTIONS           *
 ********************************/

async function generateBio() {
	$('.bio-image').html(`<img src=${STORE.bio.image} alt="Ted Alff">`);
	$('.bio-text').html(STORE.bio.text);
}

async function generateBanner() {
	let html = "";
	for ( let i = 0 ; i < STORE.projects.length ; i++ ) {
		// Placeholder HTML to test the banner.
		html += `<a href="${STORE.projects[i].link}" data-idx=${i} class="banner-item"
					style="color: ${STORE.projects[i].fontColor}">
					<div class="banner-item-bgnd" style="background-image: linear-gradient( to bottom, rgba(50, 50, 50, 0.8), rgba( 100, 100, 100, 0.4) ), url('${STORE.projects[i].gallery[0].image}');"></div>
					<div class="banner-item-text"><h2>${STORE.projects[i].title}</h2>${STORE.projects[i].summary}</div></a>`;
	}
	html += `<a href="projects.html" data-idx=${STORE.projects.length} class="banner-item">
				<div class="banner-item-bgnd" style="background-image: linear-gradient( to bottom, rgba(50, 50, 50, 0.8), rgba( 100, 100, 100, 0.4) ), url('images/all_projects.png');"></div>
				<div class="banner-item-text"><h2>All Projects</h2> </div></a>`;
	$('.banner-slider').html(html);
}

async function generateBlog() {
	let html = "";
	for ( let i = 0 ; i < STORE.blog.length && i < MAX_BLOG_LINKS ; i++ ) {
		// Placeholder HTML to test the banner.
		html += `<div><a href="${STORE.blog[i].link}" data-idx=${i}
					class="blog-link">
					<div><h3>${STORE.blog[i].title}</h3>${STORE.blog[i].summary}</div></a></div>`;
	}
	if ( STORE.blog.length > MAX_BLOG_LINKS ) {
		html += `<div><a href="blog.html" data-idx=${MAX_BLOG_LINKS}
		         class="blog-link">
		         <div><h3>All Blog Entries</h3></div></a></div>`;
	}
	$('.blog').append(html);
}

async function generateLinks() {
	let html = "";
	for ( let i = 0 ; i < STORE.links.length && i < MAX_LINKS ; i++ ) {
		// Placeholder HTML to test the banner.
		html += `<div><a href="${STORE.links[i].link}" data-idx=${i} target="_blank rel="noopener"
					class="link">
					<div><h3>${STORE.links[i].title}</h3>${STORE.links[i].summary}</div></a></div>`;
	}
	if ( STORE.links.length > MAX_LINKS ) {
		html += `<div><a href="links.html" data-idx=${MAX_LINKS}"
		         class="link">
				 <div><h3>All Links</h3></div></a></div>`;
	}
	$('.links').append(html);
}

 function slideNext() {
	console.log('sliding to next');
	let restartSlideshow = $('.btn-pause').find('i').attr('class').includes('fa-pause')
	stopSlideshow();
	$('.banner-slider').animate(
		{ left: `-=${Number($('.banner-item:first-child').width())}px` },
		1200, 
		function() {
			$('.banner-item:last-child').after($('.banner-item:first-child'));
			$('.banner-slider').css({'left': '0%'});
		}
	);
	if ( restartSlideshow ) {
		startSlideshow();
	}
}

function slidePrev() {
	console.log('sliding to previous');
	const restartSlideshow = $('.btn-pause').find('i').attr('class').includes('fa-pause')
	stopSlideshow();
	const width = Number($('.banner-item:first-child').width());
	$('.banner-item:first-child').before($('.banner-item:last-child'));
	$('.banner-slider').css({'left': `${ -1 * width }px`} );
	$('.banner-slider').animate(
		{ left: `+=${width}` },
		1200, 
		function() { $('.banner-slider').css('left', '0%'); }
	);
	if ( restartSlideshow ) {
		startSlideshow();
	}
}

function startSlideshow() {
	console.log('Starting slideshow');
	TIMER = setInterval( function() { slideNext(); }, 10000 );
}

function stopSlideshow() {
	console.log('Stopping slideshow');
	clearInterval( TIMER );
}

function toggleSlideshow( start ) {
	if ( start ) {
		startSlideshow();
		slideNext();
	} else {
		stopSlideshow();
	}
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

function bannerNextHandler() {
	$('#banner-next').click( function( event ) {
		console.log('banner-next');
		slideNext();
	});
}

function bannerPrevHandler() {
	$('#banner-prev').click( function( event ) {
		console.log('banner-prev');
		slidePrev();
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

function pauseSlideshowHandler() {
	$('.btn-pause').click( function( event ) {
		event.stopPropagation();
		console.log( $('.btn-pause').find('i').attr('class') );
		toggleSlideshow( $('.btn-pause').find('i').attr('class').includes('fa-play') );
		$('.btn-pause').find('i').toggleClass('fa-pause');
		$('.btn-pause').find('i').toggleClass('fa-play');
	})
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
		if (event.keyCode === 13) {
			event.stopPropagation();
			event.preventDefault();
		}
		// Escape key should clear the field and reset the search.
		if (event.keyCode === 27) {
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
