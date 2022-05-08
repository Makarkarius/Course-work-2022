class ListNode {
	constructor(func, args = []) {
		this.value = new Array({
			func: func,
			args: args
		});
		this.prev = null;
		this.next = null;
	}

	push(func, args = []) {
		this.value.push({
			func: func,
			args: args
		})
	}
}

class ActionList {
	constructor() {
		this.head = null;
		this.tail = null;
		this.size = 0;
		this.current = null;
	}

	push = (func, args) => {
		let newNode = new ListNode(func, args);
		++this.size;

		if (this.head === null) {
			this.current = newNode;
			this.head = newNode;
			this.tail = newNode;
			return;
		}
		this.tail.next = newNode;
		newNode.prev = this.tail;
		this.tail = newNode;
	}

	concat = (list) => {
		if (list == null) {
			return;
		}

		if (this.head === null) {
			this.current = list.head;
			this.head = list.head;
			this.tail = list.tail;
			this.size = list.size;
			return;
		}

		this.tail.next = list.head;
		list.head.prev = this.tail;
		this.current = list.head;
		this.tail = list.tail;
		this.size += list.size;
	}

	getCurrent = () => {
		if (this.current == null) {
			return null;
		}
		return this.current.value;
	}

	getPrev = () => {
		if (this.current == null) {
			return null;
		}
		this.current = this.current.prev ? this.current.prev : this.current;
		return this.getCurrent();
	}

	getNext = () => {
		if (this.current == null) {
			return null;
		}
		this.current = this.current.next ? this.current.next : this.current;
		return this.getCurrent();
	}

	isNext = () => {
		if (this.current) {
			return this.current.next != null;
		}
		return false;
	}

	isPrev = () => {
		if (this.current) {
			return this.current.prev != null;
		}
		return false;
	}

	clear = () => {
		this.head = null;
		this.tail = null;
		this.current = null;
		this.size = 0;
	}
}
