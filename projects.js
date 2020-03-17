"using strict";

const ENTRIES_PER_PAGE = 2;

function generateGallery( id ) {
	let html = '';
	STORE.projects.find( e => Number(e.id) === Number(id) ).gallery.forEach( function( i ) {
		html += 
			`<div class="gallery-item">
					<img src="${i.image}" alt="${i.alt}">
					<p>${i.caption}</p>
			</div>`;
	});
	$('.gallery-slider').html( html );
}

function displayProjects( first=0 ) {
	let html = '';
	if ( first >= STORE.projects.length ) first = STORE.projects.length - ENTRIES_PER_PAGE;
	if ( first < 0 ) first = 0;

	for ( let i = first ; i < STORE.projects.length && i < first + ENTRIES_PER_PAGE ; i++ ) {
		let project = STORE.projects[i];
		html += `
		<div class="projects-entry" _id="${project.id}" _idx=${i}>
			<h3><a href="${project.link}">${project.title}</a></h3>
			<div class="project-summary">
				<div class="project-image">
					<img src="${project.gallery[0].image}" alt="${project.gallery[0].alt} picture">
					<div class="entry-gallery-text">Click for Gallery</div>
				</div>
				${project.text}
			</div>
		</div>`
	}
	$('.projects-entries').html( html );
	displayNav( 'projects', ENTRIES_PER_PAGE );
}

function galleryNext() {
	console.log('sliding to next');
	$('.gallery-slider').animate(
		{ left: `-=${Number($('.gallery-item:first-child').width())}px` },
		1200, 
		function() {
			$('.gallery-item:last-child').after($('.gallery-item:first-child'));
			$('.gallery-slider').css({'left': '0%'});
		}
	);
}

function galleryPrev() {
	console.log('sliding to previous');
	let width = Number($('.gallery-item:first-child').width());
	$('.gallery-item:first-child').before($('.gallery-item:last-child'));
	$('.gallery-slider').css({'left': `${ -1 * width }px`} );
	$('.gallery-slider').animate(
		{ left: `+=${width}` },
		1200, 
		function() { $('.gallery-slider').css('left', '0%'); }
	);
}

function galleryHandler() {
	$('.projects-entries').on('click', 'img', function( event ) {
		event.stopPropagation();
		try {
			generateGallery( $(this).closest('.projects-entry').attr('_id') );
			overlayBoxIn( 'gallery' );
		} catch ( e ) { };
	})
}

function galleryNextHandler() {
	$('#gallery-next').click( function( event ) {
		console.log('gallery-next');
		galleryNext();
	});
}

function galleryPrevHandler() {
	$('#gallery-prev').click( function( event ) {
		console.log('gallery-prev');
		galleryPrev();
	});
}

function gotoPageHandler() {
	$('.page-nav').on('click', 'a', function( event ) {
		event.preventDefault();
		let text = $(this).html();
		let pgnum = 0;
		if ( text.localeCompare("First") === 0 ) {
			pgnum = 0;
		} else if ( text.localeCompare("Last") === 0 ) {
			pgnum = Math.ceil( STORE.projects.length / ENTRIES_PER_PAGE ) - 1;
		} else {
			pgnum = Number( text ) - 1;
		}
		console.log( `pgnum: ${pgnum}` );
		displayProjects( pgnum * ENTRIES_PER_PAGE );
	});
}

async function main() {
	await commonMain();

	displayProjects();
	$(galleryHandler);
	$(galleryNextHandler);
	$(galleryPrevHandler);
	$(gotoPageHandler);
}

main();
