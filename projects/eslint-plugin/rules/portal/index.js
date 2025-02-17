/**
 * SPDX-FileCopyrightText: © 2017 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: MIT
 */

module.exports = {
	'portal/deprecation': require('./lib/rules/deprecation'),
	'portal/no-explicit-extend': require('./lib/rules/no-explicit-extend'),
	'portal/no-global-fetch': require('./lib/rules/no-global-fetch'),
	'portal/no-loader-import-specifier': require('./lib/rules/no-loader-import-specifier'),
	'portal/no-metal-plugins': require('./lib/rules/no-metal-plugins'),
	'portal/no-react-dom-create-portal': require('./lib/rules/no-react-dom-create-portal'),
	'portal/no-react-dom-render': require('./lib/rules/no-react-dom-render'),
	'portal/no-side-navigation': require('./lib/rules/no-side-navigation'),
};
