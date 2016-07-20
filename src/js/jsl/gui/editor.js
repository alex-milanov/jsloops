'use strict';

import d from '../../iblokz/dom';

class Editor {
	constructor(dom) {
		this.dom = (dom instanceof HTMLElement) ? dom : d.findOne(dom);
	}
	init() {
		const between = (a, b, c) => (a < b) && (b < c);

		// const icons = cursor.prepIcons({
		// 	hand: '\uf256',
		// 	resizeH: '\uf07e',
		// 	resizeV: '\uf07d'
		// });

		const editor = this;

		d.on(this.dom, 'mousemove', ev => {
			if (
				(between(0, (editor.dom.clientWidth - ev.offsetX), 7))
				&& (between(0, (editor.dom.clientHeight - ev.offsetY), 7))
			) editor.dom.style.cursor = 'se-resize';
			else if (between(0, (editor.dom.clientWidth - ev.offsetX), 7))
				editor.dom.style.cursor = 'ew-resize';
			else if (between(0, (editor.dom.clientHeight - ev.offsetY), 7))
				editor.dom.style.cursor = 'ns-resize';
			else
				editor.dom.style.cursor = 'default';
		});
	}
	refresh() {

	}
}

export default Editor;
