/*
 * * @version: 4.0.0
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2026 Preline Labs Ltd.
 */

import { parse, formatHex, clampChroma } from "culori";

function oklchStringToHex(oklchStr: string): string {
	const color = parse(oklchStr);
	const safe = clampChroma(color, "oklch");

	return formatHex(safe);
}

function varToColor(
	name: string,
	scope?: Element,
): string | null {
	if (name.startsWith('#') || name.startsWith('rgba')) return name;

	const _scope = scope || document.documentElement;
	const raw = getComputedStyle(_scope).getPropertyValue(name).trim();

	return oklchStringToHex(raw);
}

export { varToColor };
