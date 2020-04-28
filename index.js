"using strict";let TIMER;const SLIDESHOW_AUTOADVANCE_MS=10000;const MAX_BLOG_LINKS=3;const MAX_LINKS=3;async function generateBanner(){let html="";for(let i=0;i<STORE.projects.length;i++){html+=`<a href="${STORE.projects[i].link}" data-idx=${i} class="banner-item"
					style="color: ${STORE.projects[i].fontColor}">
					<div class="banner-item-bgnd" style="background-image: linear-gradient( to bottom, rgba(50, 50, 50, 0.8), rgba( 100, 100, 100, 0.4) ), url('${STORE.projects[i].gallery[0].image}');"></div>
					<div class="banner-item-text"><h2>${STORE.projects[i].title}</h2>${STORE.projects[i].summary}</div></a>`;}
html+=`<a href="projects.html" data-idx=${STORE.projects.length} class="banner-item">
				<div class="banner-item-bgnd" style="background-image: linear-gradient( to bottom, rgba(50, 50, 50, 0.8), rgba( 100, 100, 100, 0.4) ), url('images/all_projects.png');"></div>
				<div class="banner-item-text"><h2>All Projects</h2> </div></a>`;$('.banner-slider').html(html);}
async function generateBlog(){let html="";for(let i=0;i<STORE.blog.length&&i<MAX_BLOG_LINKS;i++){html+=`<div><a href="${STORE.blog[i].link}" data-idx=${i}
					class="blog-link">
					<div><h3>${STORE.blog[i].title}</h3>${STORE.blog[i].summary}</div></a></div>`;}
if(STORE.blog.length>MAX_BLOG_LINKS){html+=`<div><a href="blog.html" data-idx=${MAX_BLOG_LINKS}
		         class="blog-link">
		         <div><h3>All Blog Entries</h3></div></a></div>`;}
$('.blog').append(html);}
async function generateLinks(){let html="";for(let i=0;i<STORE.links.length&&i<MAX_LINKS;i++){html+=`<div><a href="${STORE.links[i].link}" data-idx=${i} target="_blank rel="noopener"
					class="link">
					<div><h3>${STORE.links[i].title}</h3>${STORE.links[i].summary}</div></a></div>`;}
if(STORE.links.length>MAX_LINKS){html+=`<div><a href="links.html" data-idx=${MAX_LINKS}"
		         class="link">
				 <div><h3>All Links</h3></div></a></div>`;}
$('.links').append(html);}
function slideNext(){let restartSlideshow=STORE.slideshowPlaying;stopSlideshow();$('.banner-slider').animate({left:`-=${Number($('.banner-item:first-child').width())}px`},ANIMATION_TIME_MS,function(){$('.banner-item:last-child').after($('.banner-item:first-child'));$('.banner-slider').css({'left':'0%'});});if(restartSlideshow){startSlideshow();}}
function slidePrev(){let restartSlideshow=STORE.slideshowPlaying;stopSlideshow();const width=Number($('.banner-item:first-child').width());$('.banner-item:first-child').before($('.banner-item:last-child'));$('.banner-slider').css({'left':`${-1*width }px`});$('.banner-slider').animate({left:`+=${width}`},ANIMATION_TIME_MS,function(){$('.banner-slider').css('left','0%');});if(restartSlideshow){startSlideshow();}}
function startSlideshow(){STORE.slideshowPlaying=true;TIMER=setInterval(function(){slideNext();},SLIDESHOW_AUTOADVANCE_MS);}
function stopSlideshow(){STORE.slideshowPlaying=false;clearInterval(TIMER);}
function toggleSlideshow(){if(!STORE.slideshowPlaying){startSlideshow();slideNext();}else{stopSlideshow();}}
function bannerNextHandler(){$('#banner-next').click(function(event){slideNext();});}
function bannerPrevHandler(){$('#banner-prev').click(function(event){slidePrev();});}
function pauseSlideshowHandler(){$('.btn-pause').click(function(event){event.stopPropagation();toggleSlideshow();$('.btn-pause').find('i').toggleClass('fa-pause').toggleClass('fa-play');})}
function slideshowSwipeLeftHandler(){$('.banner').on('swipeleft',function(event){slideNext();});}
function slideshowSwipeRightHandler(){$('.banner').on('swiperight',function(event){slidePrev();});}
function handleVisibility(){if(document.visibilityState==='hidden'){STORE.slideshowResumeOnVisible=STORE.slideshowPlaying;stopSlideshow();}else if(STORE.slideshowResumeOnVisible){startSlideshow();}}
async function main(){await commonMain();$('.menu').find('.home-link').addClass('current-page-link');$(ownPageLinkHandler);document.addEventListener('visibilitychange',()=>handleVisibility());$(bannerPrevHandler);$(bannerNextHandler);$(pauseSlideshowHandler);$(slideshowSwipeLeftHandler);$(slideshowSwipeRightHandler);generateBanner();startSlideshow();generateBlog();generateLinks();}
$(document).ready(function(){main()});