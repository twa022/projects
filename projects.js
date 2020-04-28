"using strict";const ENTRIES_PER_PAGE=2;function getEntriesHtml(elems,first,hasResults){STORE.displayed=[];let html='';for(let i=first;i<elems.length&&i<first+ENTRIES_PER_PAGE;i++){const project=STORE.projects[elems[i]];STORE.displayed.push(elems[i]);html+=`
		<div class="projects-entry" data-id="${project.id}">
			<div class="projects-name">
				<h3><a href="${project.link}">${project.title}</a></h3>
			</div>
			<div class="project-summary">
				<div class="project-image">
					<img src="${project.gallery[0].image}" alt="${project.gallery[0].alt} picture">
					<div class="entry-gallery-text">Click for Gallery</div>
				</div>
				${project.text}
			</div>
		</div>`}
return html;}
function performSearch(term=""){const terms=term.toLowerCase().split('/\s+');STORE.results=[];for(let i=0;i<STORE.projects.length;i++){let match=terms.every(function(t){return STORE.projects[i].title.toLowerCase().includes(t)||STORE.projects[i].text.toLowerCase().includes(t);});if(match){STORE.results.push(i);}}}
function generateGallery(id){let html='';const gallery=STORE.projects.find(e=>e.id===id).gallery;gallery.forEach(function(i){html+=`<div class="gallery-item">
					<img src="${i.image}" alt="${i.alt}">
					<div class="gallery-caption">${i.caption}</div>
			</div>`;});if(gallery.length<=1){$('.gallery .btn-arrow').addClass('no-display');}else{$('.gallery .btn-arrow').removeClass('no-display');}
$('.gallery-slider').html(html);}
function galleryNext(){$('.gallery-slider').animate({left:`-=${Number($('.gallery-item:first-child').width())}px`},ANIMATION_TIME_MS,function(){$('.gallery-item:last-child').after($('.gallery-item:first-child'));$('.gallery-slider').css({'left':'0%'});});}
function galleryPrev(){const width=Number($('.gallery-item:first-child').width());$('.gallery-item:first-child').before($('.gallery-item:last-child'));$('.gallery-slider').css({'left':`${-1*width }px`});$('.gallery-slider').animate({left:`+=${width}`},ANIMATION_TIME_MS,function(){$('.gallery-slider').css('left','0%');});}
function galleryHandler(){$('.projects-entries').on('click','img',function(event){event.stopPropagation();try{generateGallery($(this).closest('.projects-entry').data('id'));overlayBoxIn('gallery');}catch(e){};})}
function galleryNextHandler(){$('#gallery-next').click(function(event){galleryNext();});}
function galleryPrevHandler(){$('#gallery-prev').click(function(event){galleryPrev();});}
function gallerySwipeLeftHander(){$('.gallery').on('swipeleft',function(event){galleryNext();});}
function gallerySwipeRightHander(){$('.gallery').on('swiperight',function(event){galleryPrev();});}
async function main(){await commonMain();STORE.entriesPerPage=ENTRIES_PER_PAGE;STORE.pagePrefix='projects';STORE.displayed=[];STORE.projects.forEach(p=>p.id=cuid());$('.menu').find('.projects-link').addClass('current-page-link');$(ownPageLinkHandler);displayPage(0);$(galleryHandler);$(galleryNextHandler);$(galleryPrevHandler);$(gallerySwipeLeftHander);$(gallerySwipeRightHander);$(gotoPageHandler);$(clearSearchHandler);$(searchHandler);$(searchSubmitHandler);}
$(document).ready(function(){main()});