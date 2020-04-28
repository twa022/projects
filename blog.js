"using strict";const ENTRIES_PER_PAGE=2;function getEntriesHtml(elems,first,filter,hasResults){STORE.displayed=[];let html='';if(elems.length===0){html+=`<div class="no-results"> <p>No ${(filter||hasResults)?'search results':'blog entries'} found.</p> </div>`;}
for(let i=first;i<elems.length&&i<first+ENTRIES_PER_PAGE;i++){STORE.displayed.push(elems[i]);html+=`<div class="blog-entry">
				<h3>${STORE.blog[elems[i]].title}</h3>
				<img class="blog-img" src="${STORE.blog[elems[i]].image}" alt="${STORE.blog[elems[i]].title}">
				<div class="blog-text">${STORE.blog[elems[i]].text}</div>
			</div>`;}
return html;}
function performSearch(term=""){const terms=term.toLowerCase().split('/\s+');STORE.results=[];for(let i=0;i<STORE.blog.length;i++){let match=terms.every(function(t){return STORE.blog[i].title.toLowerCase().includes(t)||STORE.blog[i].text.toLowerCase().includes(t);});if(match){STORE.results.push(i);}}}
async function main(){await commonMain();STORE.entriesPerPage=ENTRIES_PER_PAGE;STORE.pagePrefix='blog';STORE.displayed=[];$('.menu').find('.blog-link').addClass('current-page-link');$(ownPageLinkHandler);$(gotoPageHandler);$(clearSearchHandler);$(searchHandler);$(searchSubmitHandler);displayPage(0);}
$(document).ready(function(){main()});