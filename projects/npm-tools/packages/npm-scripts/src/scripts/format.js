/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

const fs = require('fs');

const formatJSP = require('../jsp/formatJSP');
const isJSP = require('../jsp/isJSP');
const prettier = require('../prettier');
const getMergedConfig = require('../utils/getMergedConfig');
const getPaths = require('../utils/getPaths');
const log = require('../utils/log');
const {SpawnError} = require('../utils/spawnSync');

const DEFAULT_OPTIONS = {
	check: false,
};

/**
 * File extensions that we want Prettier to process.
 */
const EXTENSIONS = ['.js', '.json', '.jsp', '.jspf', '.scss', '.ts', '.tsx'];

const IGNORE_FILE = '.prettierignore';

/**
 * Prettier wrapper.
 */
function format(options = {}) {
	const {check} = {
		...DEFAULT_OPTIONS,
		...options,
	};

	const globs = check
		? getMergedConfig('npmscripts', 'check')
		: getMergedConfig('npmscripts', 'fix');

	const paths = getPaths(globs, EXTENSIONS, IGNORE_FILE);

	if (!paths.length) {
		return;
	}

	const config = getMergedConfig('prettier');

	let checked = 0;
	let bad = 0;
	let fixed = 0;

	paths.forEach((filepath) => {
		checked++;

		try {
			// TODO: don't re-read file, run eslint on it too

			const source = fs.readFileSync(filepath, 'utf8');

			const prettierOptions = {
				...config,
				filepath,
			};

			let checkFormat;
			let format;

			if (isJSP(filepath)) {
				checkFormat = (source, prettierOptions) => {
					return source === formatJSP(source, prettierOptions);
				};
				format = formatJSP;
			} else {
				checkFormat = prettier.check;
				format = prettier.format;
			}

			if (!checkFormat(source, prettierOptions)) {
				if (check) {
					log(`${filepath}: BAD`);
					bad++;
				} else {
					fs.writeFileSync(filepath, format(source, prettierOptions));
					fixed++;
				}
			}
		} catch (error) {
			// Generally this means a syntax error.

			log(`${filepath}: ${error}`);
			bad++;
		}
	});

	const files = (count) => (count === 1 ? 'file' : 'files');
	const have = (count) => (count === 1 ? 'has' : 'have');

	const summary = [`Prettier checked ${checked} ${files(checked)}`];

	if (fixed) {
		summary.push(`fixed ${fixed} ${files(fixed)}`);
	}

	if (bad) {
		summary.push(`${bad} ${files(bad)} ${have(bad)} problems`);
		throw new SpawnError(summary.join(', '));
	} else {
		log(summary.join(', '));
	}
}

module.exports = format;
