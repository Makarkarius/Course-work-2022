class Tree {
	constructor(elem) {
		let queue = new Queue();
		this.root = elem;

		for (let [, val] of elem.to) {
			let child = val;
			this.root.addChild(child);
			queue.push(child);
		}

		let leftSibling = null;
		let rightSibling = null;
		let leftNeighbor = null;
		while (!queue.isEmpty()) {
			let node = queue.pop();
			for (let [, val] of node.to) {
				let child = val;
				node.addChild(child);
				queue.push(child);
			}

			rightSibling = (!queue.isEmpty() && node.parent === queue.peek().parent) ? queue.peek() : null;
			node.setLeftSibling(leftSibling).setRightSibling(rightSibling).setLeftNeighbor(leftNeighbor);
			leftSibling = (!queue.isEmpty() && node.parent === queue.peek().parent) ? node : null;

			if (leftSibling != null) {
				leftNeighbor = leftSibling;
			} else {
				leftNeighbor = (!queue.isEmpty() && node.getLevel() === queue.peek().getLevel()) ? node : null;
			}
		}
	}

	callPost = (callback, context) => {
		let node = this.root;
		while (node.children && node.children.length > 0) {
			node = node.children[0];
		}
		while (node) {
			callback.apply(node, context);
			node = node.nextInPostorder();
		}
	};

	setX = (x) => {
		this.root.nodeElem.x(x ? x : 0);
		return this;
	};

	setY = (y) => {
		this.root.nodeElem.y(y ? y : 0);
		return this;
	};
}

class Queue {
	constructor(array = []) {
		this.queue = array;
	}

	isEmpty = () => {
		return this.queue.length === 0;
	}

	push = (item) => {
		this.queue.push(item);
	}

	pop = () => {
		if (this.queue.length > 0) {
			return this.queue.shift();
		} else {
			return null;
		}
	}

	peek = () => {
		if (this.queue.length > 0) {
			return this.queue[0];
		} else {
			return null;
		}
	}
}

let walker = {
	xAdjustment: 20,
	yAdjustment: 20,
	levelSeparation: 80,
	siblingSeparation: 60,
	subtreeSeparation: 80,
	nodeWidth: 27,
	nodeHeight: 27
};

walker.position = function position(tree) {
	tree.callPost(walker.firstWalk);
	walker.xAdjustment = tree.root.nodeElem.getAttr('x') - tree.root.preliminary;
	walker.yAdjustment = tree.root.nodeElem.getAttr('y');
	walker.secondWalk(tree.root, 0);
};

walker.firstWalk = function firstWalk() {
	if (!this.children || this.children.length === 0) {
		if (this.leftSibling) {
			this.preliminary = this.leftSibling.preliminary
				+ walker.siblingSeparation
				+ walker.nodeWidth;
		} else {
			this.preliminary = 0;
		}
	} else {
		let leftMost = this.children[0];
		let rightMost = this.children[this.children.length - 1];
		let middle = (leftMost.preliminary + rightMost.preliminary) / 2;
		if (this.leftSibling) {
			this.preliminary = this.leftSibling.preliminary
				+ walker.siblingSeparation
				+ walker.nodeWidth;
			this.modifier = this.preliminary - middle;
			walker.apportion(this);
		} else {
			this.preliminary = middle;
		}
	}
};

walker.apportion = function apportion(node) {
	let leftMost = node;
	let neighbor = node.leftNeighbor;
	let depth = 0;
	while (leftMost && neighbor) {
		let leftModifier = 0;
		let rightModifier = 0;
		let ancestorLeftMost = leftMost;
		let ancestorNeighbor = neighbor;
		for (let i = 0; i < depth; ++i) {
			ancestorLeftMost = ancestorLeftMost.parent;
			ancestorNeighbor = ancestorNeighbor.parent;
			rightModifier += ancestorLeftMost.modifier;
			leftModifier += ancestorNeighbor.modifier;
		}
		let moveDistance = neighbor.preliminary
			+ leftModifier
			+ walker.nodeWidth
			+ walker.subtreeSeparation
			- leftMost.preliminary
			- rightModifier;
		if (moveDistance > 0) {
			let tmp = node;
			let leftSiblings = 0;
			while (tmp && tmp !== ancestorNeighbor) {
				++leftSiblings;
				tmp = tmp.leftSibling;
			}
			if (tmp) {
				let portion = moveDistance / leftSiblings;
				tmp = node;
				while (tmp && tmp !== ancestorNeighbor) {
					tmp.preliminary = tmp.preliminary + moveDistance;
					tmp.modifier = tmp.modifier + moveDistance;
					moveDistance = moveDistance - portion;
					tmp = tmp.leftSibling;
				}
			} else {
				return;
			}
		}
		++depth;
		leftMost = node.getLeftMost(depth);
		if (leftMost) {
			neighbor = leftMost.leftNeighbor;
		}
	}
};

walker.secondWalk = function secondWalk(node, modifier) {
	node.nodeElem.x(walker.xAdjustment + node.preliminary
		+ modifier);
	node.nodeElem.y(walker.yAdjustment
		+ (node.getLevel() * walker.levelSeparation));
	node.nodeName.x(node.nodeElem.getPosition().x - node.nodeName.getWidth() / 2);
	node.nodeName.y(node.nodeElem.getPosition().y - node.nodeName.getHeight() / 2);

	if (node.nodeLine != null) {
		node.nodeLine.setAttr('points', [node.nodeElem.getPosition().x,
																						 node.nodeElem.getPosition().y,
																						 node.parent.nodeElem.getPosition().x,
																						 node.parent.nodeElem.getPosition().y]);
	}

	if (node.children && node.children.length > 0) {
		walker.secondWalk(node.children[0], modifier + node.modifier);
	}
	if (node.rightSibling) {
		walker.secondWalk(node.rightSibling, modifier);
	}
};
