class Controller {
	constructor() {
		this.actions = new ActionList();
		this.algo = new AhoCorasick();

		this.tree = new Tree(this.algo.root);
		this.tree.setX(canvasBlock.offsetWidth / 2);
		this.tree.setY(canvasBlock.offsetHeight * 0.05 + walker.nodeHeight);

		drawNode(null, this.algo.root, false);
	}

	algoAdd = (str) => {
		while (this.actions.isNext()) {
			this.nextStep();
		}
		this.actions.concat(this.algo.addString(str));
		this.tree = new Tree(this.algo.root);
		this.tree.setX(canvasBlock.offsetWidth / 2);
		this.tree.setY(canvasBlock.offsetHeight * 0.05 + walker.nodeHeight);
		walker.position(this.tree);
		this.currentStep();
	}

	algoFind = (str) => {
		while (this.actions.isNext()) {
			this.nextStep();
		}
		document.getElementById('result').innerHTML = `<h3>${str}</h3>`;
		this.actions.concat(this.algo.find(str));
		this.currentStep();
	}

	currentStep = () => {
		let action = this.actions.getCurrent();
		this.handleStep(action);
	}

	nextStep = () => {
		let action = this.actions.getNext();
		this.handleStep(action);
	}

	previousStep = () => {
		let action = this.actions.getCurrent();
		let prev = this.actions.getPrev();
		this.handleStep(action, true, prev);
	}

	handleStep = (action, isReversed = false, prev = null) => {
		if (action === null) {
			return;
		}
		if (this.actions.isNext()) {
			document.getElementById('next-step').removeAttribute('disabled');
		} else {
			document.getElementById('next-step').setAttribute('disabled', 'disabled');
		}

		if (this.actions.isPrev()) {
			document.getElementById('prev-step').removeAttribute('disabled');
		} else {
			document.getElementById('prev-step').setAttribute('disabled', 'disabled');
		}

		for (let act of action) {
			if (act.func === null) {
				continue;
			}
			console.log(act.func.name);
			act.func(...act.args, isReversed);
		}
		console.log("--------------------");

		if (isReversed) {
			for (let act of prev) {
				if (act.func === null) {
					continue;
				}

				// console.log(act.func.name);
				if (act.func.name.slice(0, 5) === "write") {
					// console.log(act.func.name);
					act.func(...act.args, isReversed);
					break;
				}
			}
		}
	}
}
