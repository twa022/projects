"using strict";const ENTRIES_PER_PAGE=2;function getEntriesHtml(elems,first,hasResults){let html='';STORE.displayed=[];if(elems.length===0){html+=`<div class="no-results"> <p>No ${(filter||hasResults)?'search results':'links'} found.</p> </div>`;}else{for(let i=first;i<elems.length&&i<first+ENTRIES_PER_PAGE;i++){STORE.displayed.push(elems[i]);html+=`<div class="links-entry">
					<h3><a href="${STORE.links[elems[i]].link}">${STORE.links[elems[i]].title} <i class="fas fa-external-link-alt"></i></a></h3>
					<p>${STORE.links[elems[i]].text}</p>
				</div>`;}}
return html;}
function performSearch(term=""){const terms=term.toLowerCase().split('/\s+');STORE.results=[];for(let i=0;i<STORE.links.length;i++){let match=terms.every(function(t){return STORE.links[i].title.toLowerCase().includes(t)||STORE.links[i].text.toLowerCase().includes(t);});if(match){STORE.results.push(i);}}}
async function main(){await commonMain();STORE.pagePrefix='links';STORE.entriesPerPage=ENTRIES_PER_PAGE;STORE.displayed=[];$('.menu').find('.links-link').addClass('current-page-link');$(ownPageLinkHandler);$(gotoPageHandler);$(clearSearchHandler);$(searchHandler);$(searchSubmitHandler);displayPage(0);}
$(document).ready(function(){main()});