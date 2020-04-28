"using strict";let STORE;const ANIMATION_TIME_MS=1200;const KEYPRESS_ESC=27;const KEYPRESS_ENTER=13;async function generateBio(){$('.bio-image').html(`<img src=${STORE.bio.image} alt="Ted Alff">`);$('.bio-text').html(STORE.bio.text);}
async function loadStore(file){try{let response=await fetch(file);if(!response.ok){return;}
STORE=await response.json();}catch(e){STORE=null;return;}}
function overlayBoxIn(className){$('.overlay-layer').fadeIn();$('.hamburger-menu').fadeOut();const pad=Number($('header').css('padding-right').replace('px',''));$(`.${className}`).css("right",($(window).width()-$('header').width())/2-pad);$(`.${className}`).fadeIn();}
function overlayOut(){$('.overlay-box').fadeOut(function(){$('.overlay-layer').fadeOut();});}
function displayNav(){let html='';const elems=(STORE.hasOwnProperty('results'))?STORE.results:[...Array(STORE[STORE.pagePrefix].length).keys()];if(STORE.numPages<=1){$('.page-nav').addClass('no-display');$('.entries').addClass('last-child-no-border-bottom');return;}else{$('.page-nav').removeClass('no-display');$('.entries').removeClass('last-child-no-border-bottom');}
const curFirstIdx=STORE.displayed[0];const btnsToDisplay=($(window).width()<450)?1:2;const first=(STORE.currentPage-btnsToDisplay>0)?STORE.currentPage-btnsToDisplay:0;let last=STORE.currentPage+btnsToDisplay;if(last-first<btnsToDisplay*2){last=first+btnsToDisplay*2;}
if(last>=STORE.numPages){last=STORE.numPages-1;}
if(first>0){html+=`<li><button class="btn-page-nav nav-first-page" aria-label="first-page"><i class="fas fa-angle-double-left"></i></button></li> `;}
if(STORE.numPages>1&&STORE.currentPage!=0){html+=`<li><button class="btn-page-nav nav-prev-page" aria-label="previous-page"><i class="fas fa-angle-left"></i></button></li> `;}
for(let i=first;i<=last;i++){if(i===STORE.currentPage){html+=`<li><button class="btn-page-nav current-page" disabled>${i+1}</i></button></li> `;}else{html+=`<li><button class="btn-page-nav">${i+1}</i></button></li> `;}}
if(STORE.numPages>1&&STORE.currentPage<STORE.numPages-1){html+=`<li><button class="btn-page-nav nav-next-page" aria-label="Next Page"><i class="fas fa-angle-right"></i></button></li> `;html+=`<li><button class="btn-page-nav nav-last-page" aria-label="Last Page"><i class="fas fa-angle-double-right"></i></button></li> `;}
$('.page-nav').find('ul').html(html);}
function searchRequiresDisplayUpdate(first){const elems=(STORE.hasOwnProperty('results'))?STORE.results:[...Array(STORE[STORE.pagePrefix].length).keys()];let updateDisplay=((STORE.displayed.length===0&&elems.length!==0)||(elems.length!=STORE.displayed.length&&elems.length<=ENTRIES_PER_PAGE)||STORE[STORE.pagePrefix].length===0);let i=0;while(!updateDisplay&&i<elems.length&&i<first+ENTRIES_PER_PAGE){updateDisplay=STORE.displayed[i-first]!=elems[i];i++;}
return updateDisplay;}
function displayEntries(first=0,filter="",hasResults=false){if(!hasResults){if(filter){performSearch(filter);}else{delete STORE.results;}}
const elems=(STORE.hasOwnProperty('results'))?STORE.results:[...Array(STORE[STORE.pagePrefix].length).keys()];if(first>=elems.length){first=elems.length-1;}
first=(first<0)?0:first;if(elems.length===0){STORE.currentPage=0;}else{STORE.currentPage=Math.floor(first/STORE.entriesPerPage);}
STORE.numPages=Math.ceil(elems.length/STORE.entriesPerPage);if(!searchRequiresDisplayUpdate(first)){displayNav();return;}
$('.entries').html(getEntriesHtml(elems,first,filter,hasResults));displayNav();}
function resetSearch(){displayEntries();}
function search(term=""){displayEntries(0,term);}
function displayPage(pageNum=0){displayEntries(pageNum*STORE.entriesPerPage,"",true);}
function ownPageLinkHandler(){$('.menu').on('click','.current-page-link',function(event){event.preventDefault();overlayOut();})}
function hamburgerMenuHandler(){$('.hamburger').click(function(event){event.preventDefault();event.stopPropagation();overlayBoxIn('hamburger-menu');});}
function contactLinkHandler(){$('.contact-link').click(function(event){event.preventDefault();event.stopPropagation();overlayBoxIn('contact-overlay');});}
function bioLinkHandler(){$('.bio-link').click(function(event){event.preventDefault();event.stopPropagation();overlayBoxIn('bio');});}
function overlayOutHandler(){$('.overlay-layer').click(function(event){overlayOut();});}
function resizeHandler(){$(window).resize(function(event){const currentWidth=$(window).width();if(currentWidth===STORE.oldWidth){return;}
const rightOffset=(currentWidth-$('header').width())/2-STORE.headerPad;$('.overlay-box').css("right",rightOffset);if(currentWidth>450?STORE.oldWidth<=450:STORE.oldWidth>450){displayNav();}
STORE.oldWidth=currentWidth;});}
function gotoPageHandler(){$('.page-nav').on('click','.btn-page-nav',function(event){event.preventDefault();const elems=(STORE.hasOwnProperty('results'))?STORE.results:[...Array(STORE[STORE.pagePrefix].length).keys()];let pageNum;if($(this).hasClass('nav-first-page')){pageNum=0;}else if($(this).hasClass('nav-prev-page')){pageNum=STORE.currentPage-1;}else if($(this).hasClass('nav-next-page')){pageNum=STORE.currentPage+1;}else if($(this).hasClass('nav-last-page')){pageNum=STORE.numPages-1;}else{pageNum=Number($(this).html())-1;}
displayPage(pageNum);window.scrollTo(0,0);});}
function clearSearchHandler(){$('#clear-search').click(function(event){event.preventDefault();$('.search-field').val('');$('#clear-search').addClass('no-display');resetSearch();})}
function searchSubmitHandler(){$('.search-field').on('keydown',function(event){if(event.keyCode===KEYPRESS_ENTER){event.stopPropagation();event.preventDefault();}
if(event.keyCode===KEYPRESS_ESC){event.stopPropagation();event.preventDefault();$('.search-field').val('');$('#clear-search').addClass('no-display');resetSearch();}});}
function searchHandler(){$('.search-field').on('input',function(event){if(!$('.search-field').val()){$('#clear-search').addClass('no-display');resetSearch();return;}
$('#clear-search').removeClass('no-display');search($('.search-field').val());});}
async function commonMain(){$('.header-background').addClass((CSS.supports("backdrop-filter: blur(2px)"))?'header-background-blur':'header-background-cover');$(hamburgerMenuHandler);$(contactLinkHandler);$(bioLinkHandler);$(overlayOutHandler);$(resizeHandler);await loadStore('store.json');STORE.oldWidth=$(window).width();STORE.headerPad=Number($('header').css('padding-right').replace('px',''));generateBio();}