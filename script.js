"using strict";

/********************************
 *           GLOBALS            *
 ********************************/


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
	 /*
	try {
		let response = await fetch( "projects.json ");
		if ( !response.ok ) {
			generateStaticBanner();
		}
		let p = await response.json();
		if ( !validateProjects( p ) ) {
			generateStaticBanner();
		}
		// Generate the projects cards to fill the banner
	} catch( e ) {
		generateStaticBanner();
	}
	*/
	let html = "";
	for ( let i = 0 ; i < 4 ; i++ ) {
		html += `<div _idx=${i} _per='3' class="banner-item third-width banner-item-${(i%2)? "even" : "odd"}"><p style="text-align:center;font-size: 2.0rem;color: white">${i}</p></div>`;
	}
	$('.banner-slider').prepend(html);
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
		$('.banner-slider').animate({
			left: `-=${100/Number($('.banner-item:first-child').attr('_per'))}%`
		}, 1200, function() {
			$('.banner-item:last-child').after($('.banner-item:first-child'));
			$('.banner-slider').css({'left': '0%'});
		} );
	});
}

function bannerPrevHandler() {
	$('#banner-prev').click( function( event ) {
		console.log('banner-prev');
		$('.banner-item:first-child').before($('.banner-item:last-child'));
		$('.banner-slider').css({'left': `-${100/Number($('.banner-item:first-child').attr('_per'))}%`});
	$('.banner-slider').animate({
			left: `+=${100/Number($('.banner-item:first-child').attr('_per'))}%`
		}, 1200, function() {
			$('.banner-slider').css('left', '0%');
		} );
	});
}

function main() {
	// Activate all the event handlers
	$(hamburgerMenuHandler);
	$(bannerPrevHandler);
	$(bannerNextHandler);

	generateBanner();
}

main();