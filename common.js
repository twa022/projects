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
		html += `<a href="${STORE.projects[i].link}" _idx=${i} class="banner-item"
					style="color: ${STORE.projects[i].fontColor}">
					<div class="banner-item-bgnd" style="background-image: linear-gradient( to bottom, rgba(50, 50, 50, 0.8), rgba( 100, 100, 100, 0.4) ), url('${STORE.projects[i].image}');"></div>
					<div class="banner-item-text"><h2>${STORE.projects[i].title}</h2>${STORE.projects[i].summary}</div></a>`;
	}
	html += `<a href="projects.html" _idx=${STORE.projects.length} class="banner-item">
				<div class="banner-item-bgnd" style="background-image: linear-gradient( to bottom, rgba(50, 50, 50, 0.8), rgba( 100, 100, 100, 0.4) ), url('images/all_projects.png');"></div>
				<div class="banner-item-text"><h2>All Projects</h2> </div></a>`;
	$('.banner-slider').html(html);
}

async function generateBlog() {
	let html = "";
	for ( let i = 0 ; i < STORE.blog.length && i < MAX_BLOG_LINKS ; i++ ) {
		// Placeholder HTML to test the banner.
		html += `<div><a href="${STORE.blog[i].link}" _idx=${i}
					class="blog-link">
					<div><h3>${STORE.blog[i].title}</h3>${STORE.blog[i].text}</div></a></div>`;
	}
	if ( STORE.blog.length > MAX_BLOG_LINKS ) {
		html += `<div><a href="blog.html" _idx=${MAX_BLOG_LINKS}
		         class="blog-link">
		         <div><h3>All Blog Entries</h3></div></a></div>`;
	}
	$('.blog').append(html);
}

async function generateLinks() {
	let html = "";
	for ( let i = 0 ; i < STORE.links.length && i < MAX_LINKS ; i++ ) {
		// Placeholder HTML to test the banner.
		html += `<div><a href="${STORE.links[i].link}" _idx=${i} target="_blank rel="noopener"
					class="link">
					<div><h3>${STORE.links[i].title}</h3>${STORE.links[i].text}</div></a></div>`;
	}
	if ( STORE.links.length > MAX_LINKS ) {
		html += `<div><a href="links.html" _idx=${MAX_LINKS}"
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
	if ( restartSlideshow ) startSlideshow();
}

function slidePrev() {
	console.log('sliding to previous');
	let restartSlideshow = $('.btn-pause').find('i').attr('class').includes('fa-pause')
	stopSlideshow();
	let width = Number($('.banner-item:first-child').width());
	$('.banner-item:first-child').before($('.banner-item:last-child'));
	$('.banner-slider').css({'left': `${ -1 * width }px`} );
	$('.banner-slider').animate(
		{ left: `+=${width}` },
		1200, 
		function() { $('.banner-slider').css('left', '0%'); }
	);
	if ( restartSlideshow ) startSlideshow();
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
	let pad = Number($('header').css('padding-right').replace('px', ''));
	$(`.${className}`).css("right", ( $(window).width() - $('header').width() ) / 2 - pad );
	$(`.${className}`).fadeIn();
}

function overlayOut() {
	$('.overlay-box').fadeOut( function() { $('.overlay-layer').fadeOut(); } );
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
		let pad = Number($('header').css('padding-right').replace('px', ''));
		let rightOffset = ( $(window).width() - $('header').width() ) / 2 - pad;
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
