let cont = new Controller();
let addSubmit = document.getElementById('add-input-submit');
let findSubmit = document.getElementById('find-input-submit');

document.getElementById('next-step').addEventListener('click', () => {
	cont.nextStep();
});

document.getElementById('prev-step').addEventListener('click', () => {
	cont.previousStep();
});

document.getElementById("reset").addEventListener('click', () => {
	document.getElementById("nodes").innerHTML = "";
	lineLayer.removeChildren();
	nodeLayer.removeChildren();
	document.getElementById('info-block').innerHTML = "";
	document.getElementById('dictionary').innerHTML = "";
	document.getElementById('result').innerHTML = "";

	document.getElementById('next-step').setAttribute('disabled', 'disabled');
	document.getElementById('prev-step').setAttribute('disabled', 'disabled');
	addSubmit.removeAttribute("disabled");
	cont = new Controller();
});

addSubmit.addEventListener('click', (e) => {
	let inp = document.getElementById('add-input');

	if (validateAdd(inp.value)) {
		cont.algoAdd(inp.value.toLowerCase());
		inp.value = "";
	}
	e.preventDefault();
})

findSubmit.addEventListener('click', (e) => {
	let inp = document.getElementById('find-input');

	if (validateFind(inp.value)) {
		addSubmit.setAttribute("disabled", "disabled");
		cont.algoFind(inp.value);
		inp.value = "";
	}
	e.preventDefault();
})

window.addEventListener("resize", () => {
	requestAnimationFrame(() => {
		height = canvasBlock.offsetHeight;
		width = window.innerWidth / 2;
		stage.setSize({height, width});
		cont.tree.setX(canvasBlock.offsetWidth / 2);
		cont.tree.setY(canvasBlock.offsetHeight * 0.05 + walker.nodeHeight);
		walker.position(cont.tree);
	})
});
