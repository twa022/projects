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
		// Advance the banner to the next card
	});
}

function bannerPrevHandler() {
	$('#banner-next').click( function( event ) {
		// Scroll the banner to the previous card
	});
}

function main() {
	// Activate all the event handlers
	$(hamburgerMenuHandler);
	$(bannerPrevHandler);
	$(bannerNextHandler);
}

main();