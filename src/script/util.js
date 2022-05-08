const generateNodeBlock = (char, id) => {
	let nodeBlock = document.createElement("div");
	nodeBlock.classList.add("node-block");

	let name = document.createElement("h2");
	name.classList.add("node-name");
	name.innerHTML = id + " " + (char == null ? "root" : char);

	let table = generateLetterTable();

	nodeBlock.append(name);
	nodeBlock.append(table);

	return nodeBlock;
}

const generateLetterTable = () => {
	let table = document.createElement("table");
	table.classList.add("word-table");

	let firstRow = document.createElement("tr");
	firstRow.classList.add("letter-row");
	let secondRow = document.createElement("tr")
	secondRow.classList.add("to-row");
	let thirdRow = document.createElement("tr");
	thirdRow.classList.add("go-row");

	let emptyElem = document.createElement("td");
	emptyElem.innerHTML = "&nbsp;";

	firstRow.append(emptyElem);

	let secF = document.createElement("td");
	let thirdF = document.createElement("td");
	secF.innerHTML = "to:";
	secondRow.append(secF);
	thirdF.innerHTML = "go:";
	thirdRow.append(thirdF);

	table.append(firstRow);
	table.append(secondRow);
	table.append(thirdRow);
	return table;
}

const getHlLet = (str, idx) => {
	let res = "";
	for (let i = 0; i < str.length; ++i) {
		let ch = str.charAt(i);
		if (i === idx) {
			res += `<r>${ch}</r>`
		} else {
			res += ch;
		}
	}
	return res;
}

function validateAdd() {
	let inp = document.getElementById('add-input');
	let str = inp.value;

	if (str.length === 0) {
		alert("Please, enter at least one english letter!");
		return false;
	}
	for (let ch of str) {
		if (!(ch >= 'a' && ch <= 'z') && !(ch >= 'A' && ch <= 'Z')) {
			alert("Please use only english letters!");
			return false;
		}
	}
	return true;
}

function validateFind() {
	let inp = document.getElementById('find-input');
	let str = inp.value;

	if (str.length === 0) {
		alert("Please, enter at least one english letter!");
		return false;
	}
	for (let ch of str) {
		if (!(ch >= 'a' && ch <= 'z') && !(ch >= 'A' && ch <= 'Z') && !(ch === ' ')) {
			alert("Please use only english letters and spaces!");
			return false;
		}
	}
	return true;
}
