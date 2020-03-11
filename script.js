"using strict";

/********************************
 *           GLOBALS            *
 ********************************/
let TIMER;

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
	let p;
	 /*
	try {
		let response = await fetch( "projects.json ");
		if ( !response.ok ) {
			generateStaticBanner();
		}
		p = await response.json();
		if ( !validateProjects( p ) ) {
			generateStaticBanner();
		}
		// Generate the projects cards to fill the banner
	} catch( e ) {
		generateStaticBanner();
	}
	*/
	let html = "";
	let per = 1;
	let width = $('body').width();
	if ( width >= 900 )
		per = 3;
	else if ( width >= 640 )
		per = 2;
	for ( let i = 0 ; i < 3 ; i++ ) {
		// Placeholder HTML to test the banner.
		html += `<a href="test.html" _idx=${i} _per=${per} class="banner-item width-${per} banner-item-${(i%2)? "even" : "odd"}"><p style="text-align:center;font-size: 2.0rem;color: white">${i}</p></a>`;
	}
	html += `<a href="projects.html" _idx=3 _per=${per} class="banner-item width-${per} banner-item-${(3%2)? "even" : "odd"}" style="text-align:center"><p style="text-align:center;font-size: 2.0rem;color: white">All Projects <i style="text-align:center;font-size: 2.0rem;color: white" class="fas fa-list"></i></p></a>`;
	$('.banner-slider').prepend(html);
 }

 function slideNext() {
	console.log('sliding to next');
	stopSlideshow();
	$('.banner-slider').animate(
		{ left: `-=${100/Number($('.banner-item:first-child').attr('_per'))}%` },
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
	$('.banner-item:first-child').before($('.banner-item:last-child'));
	$('.banner-slider').css({'left': `-${100/Number($('.banner-item:first-child').attr('_per'))}%`});
	$('.banner-slider').animate(
		{ left: `+=${100/Number($('.banner-item:first-child').attr('_per'))}%` },
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

function resizeHandler() {
	$(window).resize( function( event ) {
		let per = 1;
		let width = $('body').width();
		if ( width >= 900 )
			per = 3;
		else if ( width >= 640 )
			per = 2;
		for ( let i = 1 ; i < 4 ; i++ ) {
			$('.banner-item').removeClass(`width-${i}`);
		}
		$('.banner-item').addClass(`width-${per}`);
		$('.banner-item').attr('_per', `${per}`);
	});
}

function main() {
	// Activate all the event handlers
	$(hamburgerMenuHandler);
	$(bannerPrevHandler);
	$(bannerNextHandler);
	$(resizeHandler);

	generateBanner();

	startSlideshow();
}

main();