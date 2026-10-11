/* ============================================================================
   ZYCORD JSX RUNTIME (React-Compatible Lightweight DOM & Component Engine)
   ============================================================================ */

const SVG_TAGS = new Set([
	"svg",
	"path",
	"circle",
	"rect",
	"line",
	"polyline",
	"polygon",
	"g",
	"defs",
	"linearGradient",
	"radialGradient",
	"stop",
	"clipPath",
	"mask"
]);

export function Fragment(props) {
	return props.children;
}

export function h(tag, props, ...children) {
	if (typeof tag === "function") {
		return tag({ ...(props || {}), children });
	}

	const isSvg = SVG_TAGS.has(tag);
	const el = isSvg
		? document.createElementNS("http://www.w3.org/2000/svg", tag)
		: document.createElement(tag);

	if (props) {
		for (const [key, val] of Object.entries(props)) {
			if (val === undefined || val === null || val === false || key === "children" || key === "key") {
				continue;
			}
			if (key === "className" || key === "class") {
				if (isSvg) el.setAttribute("class", String(val));
				else el.className = String(val);
			} else if (key === "dangerouslySetInnerHTML" && val && typeof val.__html === "string") {
				el.innerHTML = val.__html;
			} else if (key === "style" && typeof val === "object") {
				Object.assign(el.style, val);
			} else if (key.startsWith("on") && typeof val === "function") {
				const evt = key.slice(2).toLowerCase();
				el.addEventListener(evt, val);
			} else if (key === "ref" && typeof val === "function") {
				val(el);
			} else if (val === true) {
				el.setAttribute(key, "");
				if (key in el && !isSvg) {
					try { el[key] = true; } catch (_e) {}
				}
			} else {
				el.setAttribute(key, String(val));
			}
		}
	}

	const appendChild = (child) => {
		if (child === null || child === undefined || child === false || child === true) return;
		if (Array.isArray(child)) {
			child.forEach(appendChild);
		} else if (child instanceof Node) {
			el.appendChild(child);
		} else {
			el.appendChild(document.createTextNode(String(child)));
		}
	};

	children.forEach(appendChild);
	return el;
}

export function mountJSX(target, node) {
	if (!target) return null;
	target.innerHTML = "";
	if (Array.isArray(node)) {
		node.forEach((n) => {
			if (n instanceof Node) target.appendChild(n);
		});
	} else if (node instanceof Node) {
		target.appendChild(node);
	}
	return target;
}

export function replaceJSX(target, node) {
	if (!target || !target.parentNode) return null;
	const parent = target.parentNode;
	if (Array.isArray(node)) {
		const frag = document.createDocumentFragment();
		node.forEach((n) => {
			if (n instanceof Node) frag.appendChild(n);
		});
		parent.replaceChild(frag, target);
	} else if (node instanceof Node) {
		parent.replaceChild(node, target);
	}
	return node;
}
