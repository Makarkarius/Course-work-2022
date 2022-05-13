const drawNode = (parent, child, isReversed = false) => {
	if (isReversed) {
		hideNode(child);
		return;
	}

	nodeLayer.add(child.nodeElem);

	child.nodeName.x(child.nodeElem.getPosition().x - child.nodeName.getWidth() / 2);
	child.nodeName.y(child.nodeElem.getPosition().y - child.nodeName.getHeight() / 2);
	nodeLayer.add(child.nodeName);

	if (parent != null) {
		child.nodeLine = new Konva.Line({
			points: [child.nodeElem.getPosition().x,
				child.nodeElem.getPosition().y,
				parent.nodeElem.getPosition().x,
				parent.nodeElem.getPosition().y],
			stroke: 'black',
			strokeWidth: 3,
		})
		lineLayer.add(child.nodeLine);

		let table = parent.nodeBlock.getElementsByClassName("word-table")[0];
		let currTo = table.getElementsByClassName("to-" + child.char);

		if (currTo.length === 0) {
			let currLt = document.createElement("td");
			currLt.classList.add("letter-" + child.char);
			currLt.innerHTML = child.char;

			currTo = document.createElement("td");
			currTo.classList.add("to-" + child.char);
			currTo.innerHTML = child.id;

			let currGo = document.createElement("td");
			currGo.classList.add("go-" + child.char);

			table.getElementsByClassName("letter-row")[0].append(currLt);
			table.getElementsByClassName("to-row")[0].append(currTo);
			table.getElementsByClassName("go-row")[0].append(currGo);
		} else {
			currTo = currTo[0];

			currTo.innerHTML = child.id;
		}
	}
	let nodes = document.getElementById("nodes");
	nodes.append(child.nodeBlock);
}

const hideNode = (node) => {
	node.nodeName?.remove();
	node.nodeElem?.remove();
	node.nodeLine?.remove();
	let remove = [...document.getElementsByClassName("node-block")];
	remove[remove.length - 1]?.remove();

	let parent = node.parent;
	if (parent != null) {
		let table = parent.nodeBlock.getElementsByClassName("word-table")[0];

		table.getElementsByClassName("letter-" + node.char)[0].remove();
		table.getElementsByClassName("to-" + node.char)[0].remove();
		table.getElementsByClassName("go-" + node.char)[0].remove();
	}
}

const hlNode = (node, isReversed) => {
	if (isReversed) {
		uhlNode(node, false);
		return;
	}
	node?.nodeElem.setAttr('fill', '#FF5252');
	node?.nodeName.setAttr('fill', '#181818');
	node?.nodeBlock.classList.add("hlNode");

	document.getElementById("nodes").scrollTo({
		top: node?.nodeBlock.getBoundingClientRect().top,
		behavior: "smooth"
	});
}

const uhlNode = (node, isReversed) => {
	if (isReversed) {
		hlNode(node, false);
		return;
	}
	node?.nodeElem.setAttr('fill', '#181818')
	node?.nodeName.setAttr('fill', '#F0F0F0')
	node?.nodeBlock.classList.remove("hlNode");
}


const markNode = (node, isReversed) => {
	if (isReversed) {
		unmarkNode(node, false);
		return;
	}
	let mark = document.createElement("h3");
	mark.classList.add("node-mark");
	mark.innerHTML = "final";
	node.nodeBlock.append(mark);
}

const unmarkNode = (node, isReversed) => {
	if (isReversed) {
		markNode(node, false);
		return;
	}
	node.nodeBlock.getElementsByClassName("node-mark")[0]?.remove();
}


const addGo = (node, char, isReversed) => {
	if (isReversed) {
		removeGo(node, char, false);
		return;
	}
	let table = node.nodeBlock.getElementsByClassName("word-table")[0];
	let currGo = table.getElementsByClassName("go-" + char);

	if (currGo.length === 0) {
		let currLt = document.createElement("td");
		currLt.classList.add("letter-" + char);
		currLt.innerHTML = char;

		let currTo = document.createElement("td");
		currTo.classList.add("to-" + char);

		currGo = document.createElement("td");
		currGo.classList.add("go-" + char);
		currGo.innerHTML = node.go.get(char).id;

		table.getElementsByClassName("letter-row")[0].append(currLt);
		table.getElementsByClassName("to-row")[0].append(currTo);
		table.getElementsByClassName("go-row")[0].append(currGo);
	} else {
		currGo = currGo[0];
		currGo.innerHTML = node.go.get(char).id;
	}
}

const removeGo = (node, char, isReversed) => {
	if (isReversed) {
		addGo(node, char, false);
		return;
	}

	let table = node.nodeBlock.getElementsByClassName("word-table")[0];

	let currGo = table.getElementsByClassName("go-" + char)[0];
	let currTo = table.getElementsByClassName("to-" + char)[0];

	if (currTo.innerHTML.length === 0) {
		table.getElementsByClassName("letter-" + char)[0].remove();
		table.getElementsByClassName("to-" + char)[0].remove();
		table.getElementsByClassName("go-" + char)[0].remove();
	} else {
		currGo.innerHTML = "";
	}
}


const hlGo = (node, char, isReversed) => {
	if (isReversed) {
		uhlGo(node, char, false);
		return;
	}

	let fromPos = node.nodeElem.getPosition();
	let toPos = node.go.get(char).nodeElem.getPosition();
	node.nodeGo = new Konva.Arrow({
		points: [fromPos.x + walker.nodeWidth,
			fromPos.y,
			(fromPos.x + toPos.x) / 2 * 1.1,
			(fromPos.y + toPos.y) / 2 * 1.1,
			toPos.x + walker.nodeWidth,
			toPos.y],
		tension: 0.7,
		stroke: '#FF5252',
		strokeWidth: 2,
		fill: '#FF5252'
	});
	nodeLayer.add(node.nodeGo);
}

const uhlGo = (node, char, isReversed) => {
	if (isReversed) {
		hlGo(node, char, false);
		return;
	}

	node.nodeGo?.remove();
}

const hlLink = (node, isReversed) => {
	if (isReversed) {
		uhlLink(node);
		return;
	}

	let fromPos = node.nodeElem.getPosition();
	let toPos = node.link.nodeElem.getPosition();
	node.nodeLink = new Konva.Arrow({
		points: [fromPos.x,
			fromPos.y + walker.nodeWidth,
			(fromPos.x + toPos.x) / 2 * 1.1,
			(fromPos.y + toPos.y) / 2 * 1.1,
			toPos.x + walker.nodeWidth,
			toPos.y],
		tension: 0.7,
		stroke: '#FF5252',
		strokeWidth: 2,
		fill: '#FF5252'
	});
	nodeLayer.add(node.nodeLink);
}

const uhlLink = (node, isReversed) => {
	if (isReversed) {
		hlLink(node, false);
		return;
	}

	node.nodeLink?.remove();
}

const printRes = (str, isReversed) => {
	let result = document.getElementById("result");
	if (isReversed) {
		result.children[result.children.length - 1]?.remove();
		return;
	}

	let word = document.createElement("h3");
	word.classList.add("result");
	word.innerHTML = str;
	result.append(word);
}

const writeAdd = (node, str) => {
	let block = document.getElementById('info-block');
	block.innerHTML = "";
	let info = document.createElement("div");
	info.classList.add("info");
	info.innerHTML = `<h2>Word to add: ${str}</h2>
										<div class="info-text">
											<p>We want to add a word ${str} to our dictionary.</p>
											<p>So, let's visit the root and start building a Trie.</p>
										</div>`
	block.append(info);
}

const writeFindLet = (node, str, idx) => {
	let block = document.getElementById('info-block');
	block.innerHTML = "";
	let info = document.createElement("div");
	info.classList.add("info");
	info.innerHTML = `<h2>Word to add: ${getHlLet(str, idx)}</h2>
										<h2>Current node: ${node.id + " " + (node.char == null ? "root" : node.char)}</h2>
										<div class="info-text">
											<p>We need to find letter <r>${str.charAt(idx)}</r> among the current node 
											children or create a new node to build a trie.</p> 
											<p>Let's iterate over current node's
											children.</p>
										</div>`
	block.append(info);
}

const writeFindLetMatch = (node, str, idx) => {
	let block = document.getElementById('info-block');
	block.innerHTML = "";
	let info = document.createElement("div");
	info.classList.add("info");
	info.innerHTML = `<h2>Word to add: ${getHlLet(str, idx)}</h2>
										<h2>Current node: ${node.id + " " + (node.char == null ? "root" : node.char)}</h2>
										<div class="info-text">
											<p>We are visiting this node to find letter <r>${str.charAt(idx)}</r>.</p> 
											<p>As you can see, this node contains the letter which we need.</p>
											<p>Now we are visiting that node.<r>${str.charAt(idx)}</r>.</p>
										</div>`
	block.append(info);
}

const writeFindLetMism = (node, str, idx) => {
	let block = document.getElementById('info-block');
	block.innerHTML = "";
	let info = document.createElement("div");
	info.classList.add("info");
	info.innerHTML = `<h2>Word to add: ${getHlLet(str, idx)}</h2>
										<h2>Current node: ${node.id + " " + (node.char == null ? "root" : node.char)}</h2>
										<div class="info-text">
											<p>We are visiting this node to find letter <r>${str.charAt(idx)}</r>.</p> 
											<p>As you can see, this node doesn't contain the letter which we need.</p>
											<p>Now we continue sorting out nodes to find one with letter <r>${str.charAt(idx)}</r>.</p>
										</div>`
	block.append(info);
}

const writeLetNotFound = (node, str, idx) => {
	let block = document.getElementById('info-block');
	block.innerHTML = "";
	let info = document.createElement("div");
	info.classList.add("info");
	info.innerHTML = `<h2>Word to add: ${getHlLet(str, idx)}</h2>
										<h2>Current node: ${node.id + " " + (node.char == null ? "root" : node.char)}</h2>
										<div class="info-text">
											<p>We have already iterated over all the node's children, and we didn't find any node
											 with letter <r>${str.charAt(idx)}</r>.</p>
											 <p>So, we just create a new node and visit it to continue building the trie.</p>
										</div>`
	block.append(info);
}

const writeMark = (node, str) => {
	let block = document.getElementById('info-block');
	block.innerHTML = "";
	let info = document.createElement("div");
	info.classList.add("info");
	info.innerHTML = `<h2>Word to add: ${str}</h2>
										<h2>Current node: ${node.id + " " + (node.char == null ? "root" : node.char)}</h2>
										<div class="info-text">
											<p>Now we are stainding in the node with a last letter in the word. We have finished building
											Trie branch with word ${str}.</p>
											<p>All we need now is to mark this node as final.</p>
										</div>`
	block.append(info);
}

const writeFinishAdd = (node, str, isReversed) => {
	let dictionary = document.getElementById("dictionary")
	if (isReversed) {
		dictionary.children[dictionary.children.length - 1]?.remove();
	}
	let block = document.getElementById('info-block');
	block.innerHTML = "";
	let info = document.createElement("div");
	info.classList.add("info");
	info.innerHTML = `<h2>Word to add: ${str}</h2>
										<div class="info-text">
											<p>That's it! We have succesfully added word ${str} to the dictionary.</p>
										</div>`
	block.append(info);

	if (!isReversed) {
		document.getElementById("dictionary").innerHTML += `<h3>${str}</h3>`;
	}
}

const writeFind = (str) => {
	let block = document.getElementById('info-block');
	block.innerHTML = "";
	let info = document.createElement("div");
	info.classList.add("info");
	info.innerHTML = `<h2>Text to find in: ${str}</h2>
										<div class="info-text">
											<p>We want to find all entrances of word from our dictionary in the text.
											So, let's iterate over text symbols.</p>
											<p>Now we are going to use <r>Go</r> and <r>Link</r> to travel between Trie nodes.</p>
											<p>First we need to go into the Trie root.</p>
										</div>`
	block.append(info);
}

const writeGo = (node, str, idx) => {
	let block = document.getElementById('info-block');
	block.innerHTML = "";
	let info = document.createElement("div");
	info.classList.add("info");
	info.innerHTML = `<h2>Text to find in: ${getHlLet(str, idx)}</h2>
										<h2>Current node: ${node.id + " " + (node.char == null ? "root" : node.char)}</h2>
										<div class="info-text">
											<p>We are in the node ${node.id}.</p> 
											<p>Let's check if we have a machine transition 
											by char ${str.charAt(idx)}.</p>
											<p>I.e. go(node: ${node.id}, ${str.charAt(idx)})</p>
										</div>`
	block.append(info);
}

const writeNoGo = (node, char, str, idx) => {
	let block = document.getElementById('info-block');
	block.innerHTML = "";
	let info = document.createElement("div");
	info.classList.add("info");
	info.innerHTML = `<h2>Text to find in: ${getHlLet(str, idx)}</h2>
										<h2>Machine transition by ${char}</h2>
										<h2>Current node: ${node.id + " " + (node.char == null ? "root" : node.char)}</h2>
										<div class="info-text">
											<p>As we can see, there is no machine transition in this node by needed character.</p>
											<p>Now we have to calculate it: </p>
											<p>If current node has Trie transition (to array) by the needed character, we are simply
											creating a machine transition same as Trie transition.</p>
											<p>If current node is root, we create a machine transition to root.</p>
											<p>Else, we are creating a machine transition using machine transition by linked node and 
											current character. </p>
											<p>I.e. go(Node.link, char).</p>
										</div>`
	block.append(info);
}

const writeIsGo = (node, char, str, idx) => {
	let block = document.getElementById('info-block');
	block.innerHTML = "";
	let info = document.createElement("div");
	info.classList.add("info");
	info.innerHTML = `<h2>Text to find in: ${getHlLet(str, idx)}</h2>
										<h2>Machine transition by ${char}</h2>
										<h2>Current node: ${node.id + " " + (node.char == null ? "root" : node.char)}</h2>
										<div class="info-text">
											<p>There is already calculate machine transition by character ${char}.</p>
											<p>go(node: ${node.id}, ${char}) = ${node.go.get(char).id}</p>
											<p>We are simply using it to go further.</p>
										</div>`
	block.append(info);
}

const writeCalcGo = (node, char, str, idx) => {
	let block = document.getElementById('info-block');
	block.innerHTML = "";
	let info = document.createElement("div");
	info.classList.add("info");
	info.innerHTML = `<h2>Text to find in: ${getHlLet(str, idx)}</h2>
										<h2>Machine transition by ${char}</h2>
										<h2>Current node: ${node.id + " " + (node.char == null ? "root" : node.char)}</h2>
										<div class="info-text">
											<p>We have calculated machine transition in current node by character ${char}.</p>
											<p>go(node: ${node.id}, ${char}) = ${node.go.get(char).id}</p>
											<p>Now let's use it to go further.</p>
										</div>`
	block.append(info);
}

const writeLink = (node, str, idx) => {
	let block = document.getElementById('info-block');
	block.innerHTML = "";
	let info = document.createElement("div");
	info.classList.add("info");
	info.innerHTML = `<h2>Text to find in: ${getHlLet(str, idx)}</h2>
										<h2>Current node: ${node.id + " " + (node.char == null ? "root" : node.char)}</h2>
										<div class="info-text">
											<p>Now we have to calculate the suffix link from this node.</p>
											<p>If current node is root or its parent is root, we set the link to root.</p>
											<p>Else, we are using a machine transition using machine transition by current node's parent link and 
											a character in current node.</p>
											<p>I.e. go(Node.Parent.link, Node.char).</p>
										</div>`
	block.append(info);
}

const writeCalcLink = (node, str, idx) => {
	let block = document.getElementById('info-block');
	block.innerHTML = "";
	let info = document.createElement("div");
	info.classList.add("info");
	info.innerHTML = `<h2>Text to find in: ${getHlLet(str, idx)}</h2>
										<h2>Current node: ${node.id + " " + (node.char == null ? "root" : node.char)}</h2>
										<div class="info-text">
											<p>We have calculated link in current.</p>
											<p>link(node: ${node.id}) = ${node.link.id}</p>
											<p>Now let's use it to go further.</p>
										</div>`
	block.append(info);
}

const writeCheck = (node, str, idx) => {
	let block = document.getElementById('info-block');
	block.innerHTML = "";
	let info = document.createElement("div");
	info.classList.add("info");
	info.innerHTML = `<h2>Text to find in: ${getHlLet(str, idx)}</h2>
										<h2>Current node: ${node.id + " " + (node.char == null ? "root" : node.char)}</h2>
										<div class="info-text">
											<p>We have succesfully went over the machine transition to node ${node.id}.</p> 
											<p>Now we need to recursively go using suffix links to root from current node
											and check for final nodes.<p>
											<p>All of the nodes marked as final we will meet means 
											that we have found theese words entrances in the text.</p>
										</div>`
	block.append(info);
}

const writeNodeFound = (node) => {
	let block = document.getElementById('info-block');
	block.innerHTML = "";
	let info = document.createElement("div");
	info.classList.add("info");
	info.innerHTML = `<h2>Current node: ${node.id + " " + (node.char == null ? "root" : node.char)}</h2>
										<div class="info-text">
											<p>While traveling to the root of the Trie we have found a node ${node.id} marked as final.</p>
											<p>That means, that we have detected a word from a dictionary in the text.</p>
											<p>Let's print its entrance index and the word itself.</p>
										</div>`
	block.append(info);
}

const writeFinishFind = (str) => {
	let block = document.getElementById('info-block');
	block.innerHTML = "";
	let info = document.createElement("div");
	info.classList.add("info");
	info.innerHTML = `<h2>Text to find in: ${str}</h2>
										<div class="info-text">
											<p>We have succesfully iterated over the letters of the text.</p>
										</div>`
	block.append(info);
}