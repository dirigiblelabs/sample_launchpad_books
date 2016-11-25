/* eslint-env node, dirigible */

var repository = require('platform/repository');

const CONTROLLER_LOCATION = '/db/dirigible/registry/public/ScriptingServices/launchpad/extension/controller/BooksCtrl.js';

exports.getMenuItem = function() {
	return {
		name:"Books",
		link:"#/books"
	};
};

exports.getHomeItem = function() {
	return {
		image: "book",
		color: "green",
		path: "#/books",
		title: "Books",
		description: "Dirigible Books Sample",
		newTab: true
	};
};

exports.getRoute = function() {
	return {
		'location': '/books',
		'controller': 'BooksCtrl',
		'template': 'templates/books.html'
	};
};

exports.getController = function() {
	return repository.getResource(CONTROLLER_LOCATION).getTextContent();
};
