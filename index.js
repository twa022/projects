"using strict";

/********************************
 *           GLOBALS            *
 ********************************/

/** Slideshow timer -- used to auto-advance the slideshow */
let TIMER;

/** Time to wait to auto-advance the slideshow in milliseconds */
const SLIDESHOW_AUTOADVANCE_MS = 10000;

/** Maximum number of blog summaries to display on the home page */
const MAX_BLOG_LINKS = 3;

/** Maximum number of links to display on the home page */
const MAX_LINKS = 3;

/********************************
 *          FUNCTIONS           *
 ********************************/

/**
 * Generate and fill the projects slideshow banner
 */
async function generateBanner() {
	let html = "";
	for ( let i = 0 ; i < STORE.projects.length ; i++ ) {
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

/**
 * Generate and fill the blog summaries
 */
async function generateBlog() {
	let html = "";
	for ( let i = 0 ; i < STORE.blog.length && i < MAX_BLOG_LINKS ; i++ ) {
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

/**
 * Generate and fill the links summaries
 */
async function generateLinks() {
	let html = "";
	for ( let i = 0 ; i < STORE.links.length && i < MAX_LINKS ; i++ ) {
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


/**
 * Advance the projects banner slideshow to the next slide
 */
function slideNext() {
	console.log('sliding to next');
	let restartSlideshow = STORE.slideshowPlaying;
	stopSlideshow();
	$('.banner-slider').animate(
		{ left: `-=${Number($('.banner-item:first-child').width())}px` },
		ANIMATION_TIME_MS, 
		function() {
			$('.banner-item:last-child').after($('.banner-item:first-child'));
			$('.banner-slider').css({'left': '0%'});
		}
	);
	if ( restartSlideshow ) {
		startSlideshow();
	}
}

/**
 * Advance the projects banner slideshow to the previous slide
 */
function slidePrev() {
	console.log('sliding to previous');
	let restartSlideshow = STORE.slideshowPlaying;
	stopSlideshow();
	const width = Number($('.banner-item:first-child').width());
	$('.banner-item:first-child').before($('.banner-item:last-child'));
	$('.banner-slider').css({'left': `${ -1 * width }px`} );
	$('.banner-slider').animate(
		{ left: `+=${width}` },
		ANIMATION_TIME_MS, 
		function() { $('.banner-slider').css('left', '0%'); }
	);
	if ( restartSlideshow ) {
		startSlideshow();
	}
}

/**
 * Start the projects banner slideshow and auto advance the slides every
 * SLIDESHOW_AUTOADVANCE_MS / 1000 seconds
 */
function startSlideshow() {
	STORE.slideshowPlaying = true;
	TIMER = setInterval( function() { slideNext(); }, SLIDESHOW_AUTOADVANCE_MS );
}

/**
 * Stop the projects banner slideshow (disable autoadvance)
 */
function stopSlideshow() {
	STORE.slideshowPlaying = false;
	clearInterval( TIMER );
}

/**
 * Toggle the projects banner slideshow (play if stopped, stop if playing)
 */
function toggleSlideshow() {
	if ( !STORE.slideshowPlaying ) {
		startSlideshow();
		console.log('Starting slideshow');
		slideNext();
	} else {
		console.log('Stopping slideshow');
		stopSlideshow();
	}
}

/********************************
 *        EVENT HANDLERS        *
 ********************************/

/**
 * Event handler when the next slide button on the projects banner is activated
 * Advances the slideshow to the next slide.
 */
function bannerNextHandler() {
	$('#banner-next').click( function( event ) {
		console.log('banner-next');
		slideNext();
	});
}

/**
 * Event handler when the previous slide button on the projects banner is activated
 * Advances the slideshow to the previous slide.
 */
function bannerPrevHandler() {
	$('#banner-prev').click( function( event ) {
		console.log('banner-prev');
		slidePrev();
	});
}

/**
 * Event handler when the pause/play button on the projects banner slideshow is pressed
 */
function pauseSlideshowHandler() {
	$('.btn-pause').click( function( event ) {
		event.stopPropagation();
		toggleSlideshow();
		$('.btn-pause').find('i').toggleClass('fa-pause').toggleClass('fa-play');
	})
}

function slideshowSwipeLeftHandler() {
	$('.banner').on('swipeleft', function( event ) {
		slideNext();
	});
}

function slideshowSwipeRightHandler() {
	$('.banner').on('swiperight', function( event ) {
		slidePrev();
	});
}

function handleVisibility() {
	if (document.visibilityState === 'hidden') {
		console.log('Pausing slideshow while page not visible');
		STORE.slideshowResumeOnVisible = STORE.slideshowPlaying;
		stopSlideshow();
	} else if ( STORE.slideshowResumeOnVisible ) {
		console.log('Resuming slideshow');
		startSlideshow();
	}
}

/**
 * Main function run on page load. Activates all event handlers and displays the projects banner,
 * blog summaries, and links summaries from STORE
 */
async function main() {
	// Have to wait for this to finish since commonMain loads the STORE and we need it to populate the page
	await commonMain();

	$('.menu').find('.home-link').addClass('current-page-link');
	$(ownPageLinkHandler);

	document.addEventListener('visibilitychange', () => handleVisibility());

	$(bannerPrevHandler);
	$(bannerNextHandler);
	$(pauseSlideshowHandler);
	$(slideshowSwipeLeftHandler);
	$(slideshowSwipeRightHandler);

	generateBanner();
	startSlideshow();

	generateBlog();
	generateLinks();
}

$(document).ready( function() { main() } );
