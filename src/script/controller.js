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
			$('#next-step').prop('disabled', false);
		} else {
			$('#next-step').prop('disabled', true);
		}

		if (this.actions.isPrev()) {
			$('#prev-step').prop('disabled', false);
		} else {
			$('#prev-step').prop('disabled', true);
		}

		for (let act of action) {
			if (act.func === null) {
				continue;
			}
			act.func(...act.args, isReversed);
		}

		if (isReversed) {
			for (let act of prev) {
				if (act.func === null) {
					continue;
				}

				console.log(act.func.name);
				if (act.func.name.slice(0, 5) === "write") {
					console.log(act.func.name);
					act.func(...act.args, isReversed);
					break;
				}
			}
		}
	}
}
