"using strict";

async function main() {
	// Activate all the event handlers
	await commonMain();
	$(bannerPrevHandler);
	$(bannerNextHandler);
	$(pauseSlideshowHandler);

	generateBanner();
	startSlideshow();

	generateBlog();
	generateLinks();
}

$(document).ready( function() { main() } );
