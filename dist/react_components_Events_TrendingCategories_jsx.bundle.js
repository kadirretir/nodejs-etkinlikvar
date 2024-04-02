"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunketkinlikvarnode"] = self["webpackChunketkinlikvarnode"] || []).push([["react_components_Events_TrendingCategories_jsx"],{

/***/ "./react/components/Events/TrendingCategories.jsx":
/*!********************************************************!*\
  !*** ./react/components/Events/TrendingCategories.jsx ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _events_module_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./events.module.css */ \"./react/components/Events/events.module.css\");\n\n\nfunction TrendingCategories(_ref) {\n  var popularCategories = _ref.popularCategories,\n    handleCategoryLeft = _ref.handleCategoryLeft;\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    className: \"container\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    className: \"row my-5\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    className: \"col-12\"\n  }, popularCategories !== null && Object.keys(popularCategories).length > 0 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"h2\", {\n    className: \"text-emphasis fs-5 py-1\"\n  }, \"Trend Kategoriler\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"hr\", null), popularCategories.map(function (category, id) {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), {\n      key: id\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"button\", {\n      onClick: function onClick() {\n        return handleCategoryLeft(category);\n      },\n      className: \"\".concat(_events_module_css__WEBPACK_IMPORTED_MODULE_1__[\"default\"].categoryButton),\n      type: \"button\"\n    }, category));\n  })))));\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TrendingCategories);\n\n//# sourceURL=webpack://etkinlikvarnode/./react/components/Events/TrendingCategories.jsx?");

/***/ })

}]);