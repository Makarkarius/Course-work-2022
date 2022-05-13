class TrieNode {
	constructor(char, parent, id) {
		this.to = new Map();
		this.go = new Map();
		this.link = null;
		this.up = null;

		this.char = char;
		this.parent = parent;
		this.isLeaf = false;

		this.num = -1;

		this.id = id;

		this.leftSibling = null;
		this.rightSibling = null;
		this.leftNeighbor = null;
		this.children = [];

		this.preliminary = 0;
		this.modifier = 0;
		this.level = 0;

		this.nodeBlock = generateNodeBlock(char, id);
		this.nodeElem = new Konva.Circle({
			radius: walker.nodeWidth,
			fill: '#181818',
			stroke: 'black',
			strokeWidth: 0,
			x: 0,
			y: 0
		});
		this.nodeLine = null;
		this.nodeLink = null;
		this.nodeGo = null;
		this.nodeName = new Konva.Text({
			text: this.char ? this.char : "root",
			x: 0,
			y: 0,
			fontSize: 24,
			fontFamily: "Arial",
			fill: "#F0F0F0",
			fontStyle: "600"
		});
	}

	nextInPostorder = () => {
		if (this.rightSibling) {
			let node = this.rightSibling;
			while (node.children && node.children.length >= 1) {
				node = node.children[0];
			}
			return node;
		} else {
			if (this.parent) {
				return this.parent;
			} else {
				return null;
			}
		}
	}

	addChild = (node) => {
		this.children.push(node);
		return this;
	}

	setLeftSibling = (node) => {
		this.leftSibling = node;
		return this;
	}

	setRightSibling = (node) => {
		this.rightSibling = node;
		return this;
	}

	setLeftNeighbor = (node) => {
		this.leftNeighbor = node;
		return this;
	}

	getLeftMost = (depth) => {
		if (depth <= 0) {
			return this;
		} else if (!this.children || this.children.length === 0) {
			return null;
		} else {
			let ancestor = this.children[0];
			let leftMost = ancestor.getLeftMost(depth - 1);
			while (!leftMost && ancestor.rightSibling) {
				ancestor = ancestor.rightSibling;
				leftMost = ancestor.getLeftMost(depth - 1);
			}
			return leftMost;
		}
	}

	getLevel = () => {
		if (this.level) {
			return this.level;
		} else {
			let level = 0;
			let node = this;
			while (node.parent) {
				++level;
				node = node.parent;
			}
			this.level = level;
			return level;
		}
	}
}

class AhoCorasick {
	constructor() {
		this.counter = 0;
		this.root = new TrieNode(null, null, this.counter++);
		this.words = [];
		this.actions = new ActionList();
	}

	addString = (str) => {
		this.actions.clear();

		let curr = this.root;
		this.actions.push(writeAdd, [curr, str]);

		for (let i = 0; i < str.length; ++i) {
			const char = str.charAt(i);

			if (i === 0) {
				this.actions.push(hlNode, [curr]);
			} else {
				this.actions.tail.push(hlNode, [curr]);
			}
			this.actions.push(writeFindLet, [curr, str, i]);

			let prev = null;
			for (let [ch, node] of curr.to) {
				this.actions.push(hlNode, [node]);
				this.actions.tail.push(uhlNode, [prev]);

				prev = node;
				if (ch === char) {
					this.actions.tail.push(writeFindLetMatch, [node, str, i]);
					break;
				} else {
					this.actions.tail.push(writeFindLetMism, [node, str, i]);
				}
			}

			if (!curr.to.has(char)) {
				const newNode = new TrieNode(char, curr, this.counter++);
				curr.to.set(char, newNode);

				this.actions.push(writeLetNotFound, [curr, str, i]);
				this.actions.push(drawNode, [curr, newNode]);
				this.actions.tail.push(writeLetNotFound, [curr, str, i]);
				if (i === str.length - 1) {
					this.actions.tail.push(hlNode, [newNode]);
				}
			}

			this.actions.tail.push(uhlNode, [curr]);
			this.actions.tail.push(uhlNode, [prev]);

			curr = curr.to.get(char);
			if (i === str.length - 1) {
				this.actions.push(markNode, [curr]);
				this.actions.tail.push(writeMark, [curr, str]);

				this.actions.push(uhlNode, [curr]);
				this.actions.tail.push(writeFinishAdd, [curr, str]);
			} else {
				// this.actions.tail.push(hlNode, [curr]);
			}
		}

		curr.num = this.words.length;
		this.words.push(str);
		curr.isLeaf = true;

		return this.actions;
	}

	link = (TrieNode, str, idx) => {
		this.actions.push(hlNode, [TrieNode]);

		this.actions.tail.push(writeLink, [TrieNode, str, idx]);

		if (TrieNode.link === null) {
			if (TrieNode === this.root || TrieNode.parent === this.root) {
				TrieNode.link = this.root;
			} else {
				TrieNode.link = this.go(this.link(TrieNode.parent, str, idx), TrieNode.char, str, idx);
			}
		}

		this.actions.push(hlLink, [TrieNode]);
		this.actions.tail.push(writeCalcLink, [TrieNode, str, idx]);

		this.actions.push(uhlLink, [TrieNode]);
		this.actions.tail.push(uhlNode, [TrieNode]);
		return TrieNode.link;
	}

	go = (TrieNode, char, str, idx) => {
		this.actions.tail.push(hlNode, [TrieNode]);

		if (!TrieNode.go.has(char)) {
			this.actions.tail.push(writeNoGo, [TrieNode, char, str, idx]);

			if (TrieNode.to.has(char)) {
				TrieNode.go.set(char, TrieNode.to.get(char));
			} else if (TrieNode === this.root) {
				TrieNode.go.set(char, this.root);
			} else {
				let currLink = this.link(TrieNode, str, idx);
				TrieNode.go.set(char, this.go(currLink, char));
				this.actions.tail.push(hlNode, [TrieNode]);
			}

			this.actions.push(addGo, [TrieNode, char]);
			this.actions.tail.push(writeCalcGo, [TrieNode, char, str, idx]);
		} else {
			this.actions.tail.push(writeIsGo, [TrieNode, char, str, idx]);
		}
		this.actions.tail.push(hlGo, [TrieNode, char]);

		this.actions.push(uhlNode, [TrieNode]);
		this.actions.tail.push(uhlGo, [TrieNode, char]);

		return TrieNode.go.get(char);
	}

	linkC = (TrieNode) => {
		if (TrieNode.link === null) {
			if (TrieNode === this.root || TrieNode.parent === this.root) {
				return  this.root;
			} else {
				return this.goC(this.linkC(TrieNode.parent), TrieNode.char);
			}
		}
		return TrieNode.link;
	}

	goC = (TrieNode, char) => {
		if (!TrieNode.go.has(char)) {
			if (TrieNode.to.has(char)) {
				return TrieNode.to.get(char);
			} else if (TrieNode === this.root) {
				return this.root;
			} else {
				let currLink = this.linkC(TrieNode);
				return this.goC(currLink, char);
			}
		}
		return TrieNode.go.get(char);
	}

	up = (TrieNode, pos) => {
		if (TrieNode.isLeaf) {
			this.actions.push(printRes, [pos - this.words[TrieNode.num].length + 1 + " " + this.words[TrieNode.num]]);
			this.actions.tail.push(writeNodeFound, [TrieNode]);
		}
		if (TrieNode.up === null) {
			let curr = this.linkC(TrieNode);
			if (curr === this.root) {
				TrieNode.up = this.root;
			} else {
				TrieNode.up = TrieNode.isLeaf ? curr : this.up(curr, pos);
			}
		}
		return TrieNode.up;
	}

	check = (TrieNode, pos) => {
		let curr = TrieNode;
		while (curr !== this.root) {
			curr = this.up(curr, pos);
		}
	}

	find = (str) => {
		this.actions.clear();
		this.actions.push(writeFind, [str]);

		let curr = this.root;
		for (let i = 0; i < str.length; ++i) {
			let char = str.charAt(i);

			this.actions.push(writeGo, [curr, str, i]);
			this.actions.tail.push(hlNode, [curr]);

			curr = this.go(curr, char, str, i);
			this.actions.tail.push(hlNode, [curr]);
			this.actions.push(writeCheck, [curr, str, i]);

			this.check(curr, i + 1);
		}
		this.actions.push(uhlNode, [curr]);
		this.actions.tail.push(writeFinishFind, [str]);

		return this.actions;
	}
}
