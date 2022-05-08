let canvasBlock = document.getElementById('canvas-block');
let height = canvasBlock.offsetHeight;
let width = canvasBlock.offsetWidth;
let stage = new Konva.Stage({
	container: 'canvas-block',
	width: width,
	height: height,
	draggable: true,
	centeredScaling: true
})
let lineLayer = new Konva.Layer();
let nodeLayer = new Konva.Layer();

stage.add(lineLayer);
stage.add(nodeLayer);

stage.on('dragmove', (e) => {
	e.evt.preventDefault();

	if (stage.getAbsolutePosition().x < -200) {
		stage.setAttr('x', -200);
	}
	if (stage.getAbsolutePosition().x > 200) {
		stage.setAttr('x', 200);
	}

	if (stage.getPosition().y < -walker.levelSeparation * 22 + canvasBlock.offsetHeight) {
		stage.setAttr('y', -walker.levelSeparation * 22 + canvasBlock.offsetHeight);
	}
	if (stage.getPosition().y > 0) {
		stage.setAttr('y', 0);
	}
});
