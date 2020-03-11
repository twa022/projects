"using strict";

/********************************
 *           GLOBALS            *
 ********************************/
let TIMER;

let STORE;

/********************************
 *          FUNCTIONS           *
 ********************************/

 function validateProjects( p ) {
	 return true;
 }

 function generateStaticBanner() {
	return true;
 }

async function generateBanner() {
	let html = "";
	for ( let i = 0 ; i < STORE.projects.length ; i++ ) {
		// Placeholder HTML to test the banner.
		html += `<a href="${STORE.projects[i].link}" _idx=${i}
					style="color: ${STORE.projects[i].fontColor}" 
					class="banner-item" _class="banner-item-${(i%2)? "even" : "odd"}">
					<div class="banner-item-bgnd" style="background-image: linear-gradient( to bottom, rgba(50, 50, 50, 0.8), rgba( 100, 100, 100, 0.4) ), url('${STORE.projects[i].image}');"></div>
					<div class="banner-item-text"><h2>${STORE.projects[i].title}</h2>${STORE.projects[i].text}</div></a>`;
	}
	html += `<a href="projects.html" _idx=${STORE.projects.length} 
				class="banner-item" _class="banner-item-${(3%2)? "even" : "odd"}">
				<div class="banner-item-bgnd" style="background-image: linear-gradient( to bottom, rgba(50, 50, 50, 0.8), rgba( 100, 100, 100, 0.4) ), url('images/all_projects.png');"></div>
				<div class="banner-item-text"><h2>All Projects</h2> </div></a>`;
	$('.banner-slider').html(html);
 }

 function slideNext() {
	console.log('sliding to next');
	stopSlideshow();
	$('.banner-slider').animate(
		{ left: `-=${Number($('.banner-item:first-child').width())}px` },
		1200, 
		function() {
			$('.banner-item:last-child').after($('.banner-item:first-child'));
			$('.banner-slider').css({'left': '0%'});
		}
	);
	startSlideshow();
}

function slidePrev() {
	console.log('sliding to previous');
	stopSlideshow();
	let width = Number($('.banner-item:first-child').width());
	$('.banner-item:first-child').before($('.banner-item:last-child'));
	$('.banner-slider').css({'left': `${ -1 * width }px`} );
	$('.banner-slider').animate(
		{ left: `+=${width}` },
		1200, 
		function() { $('.banner-slider').css('left', '0%'); }
	);
	startSlideshow();
}

function startSlideshow() {
	TIMER = setInterval( function() { slideNext(); }, 10000 );
}

function stopSlideshow() {
	clearInterval( TIMER );
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

/********************************
 *        EVENT HANDLERS        *
 ********************************/

function hamburgerMenuHandler() {
	$('.menu').click( function( event ) { 
		event.preventDefault();
		// slide out menu
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

async function main() {
	// Activate all the event handlers
	$(hamburgerMenuHandler);
	$(bannerPrevHandler);
	$(bannerNextHandler);

	await loadStore( 'store.json' );
	console.log( STORE.projects[0].title );

	generateBanner();

	startSlideshow();
}

main();