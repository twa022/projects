"using strict";

function displayProjects() {
	let html = '';
	STORE.projects.forEach( function( project ) {
		html += `
		<div class="project">
			<h3><a href="${project.link}">${project.title}</a></h3>
			<img src="${project.image}" alt="${project.title} picture">
			${project.text}
		</div>`
	});
	$('.projects').append( html );
}

async function main() {
	await commonMain();

	displayProjects();
}

main();
