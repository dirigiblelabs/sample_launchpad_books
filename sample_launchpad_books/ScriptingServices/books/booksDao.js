/* globals $ */
/* eslint-env node, dirigible */

var database = require('db/database');
var datasource = database.getDatasource();

// Create an entity
exports.create = function(entity) {
    var connection = datasource.getConnection();
    try {
        var sql = 'INSERT INTO BOOKS (BOOKID,BOOKISBN,BOOKTITLE,BOOKAUTHOR,BOOKEDITOR,BOOKPUBLISHER,BOOKFORMAT,BOOKPUBLICATIONDATE,BOOKPRICE) VALUES (?,?,?,?,?,?,?,?,?)';
        var statement = connection.prepareStatement(sql);
        var i = 0;
        var id = datasource.getSequence('BOOKS_BOOKID').next();
        statement.setInt(++i, id);
        statement.setString(++i, entity.bookisbn);
        statement.setString(++i, entity.booktitle);
        statement.setString(++i, entity.bookauthor);
        statement.setString(++i, entity.bookeditor);
        statement.setString(++i, entity.bookpublisher);
        statement.setString(++i, entity.bookformat);
        if (entity.bookpublicationdate !== null) {
            var js_date_bookpublicationdate =  new Date(Date.parse(entity.bookpublicationdate));
            statement.setDate(++i, js_date_bookpublicationdate);
        } else {
            statement.setDate(++i, null);
        }
        statement.setDouble(++i, entity.bookprice);
        statement.executeUpdate();
    	return id;
    } finally {
        connection.close();
    }
};

// Return a single entity by Id
exports.get = function(id) {
	var entity = null;
    var connection = datasource.getConnection();
    try {
        var sql = 'SELECT * FROM BOOKS WHERE BOOKID = ?';
        var statement = connection.prepareStatement(sql);
        statement.setInt(1, id);

        var resultSet = statement.executeQuery();
        if (resultSet.next()) {
            entity = createEntity(resultSet);
        }
    } finally {
        connection.close();
    }
    return entity;
};

// Return all entities
exports.list = function(limit, offset, sort, desc) {
    var result = [];
    var connection = datasource.getConnection();
    try {
        var sql = 'SELECT ';
        if (limit !== null && offset !== null) {
            sql += ' ' + datasource.getPaging().genTopAndStart(limit, offset);
        }
        sql += ' * FROM BOOKS';
        if (sort !== null) {
            sql += ' ORDER BY ' + sort;
        }
        if (sort !== null && desc !== null) {
            sql += ' DESC ';
        }
        if (limit !== null && offset !== null) {
            sql += ' ' + datasource.getPaging().genLimitAndOffset(limit, offset);
        }
        var statement = connection.prepareStatement(sql);
        var resultSet = statement.executeQuery();
        while (resultSet.next()) {
            result.push(createEntity(resultSet));
        }
    } finally {
        connection.close();
    }
    return result;
};

// Update an entity by Id
exports.update = function(entity) {
    var connection = datasource.getConnection();
    try {
        var sql = 'UPDATE BOOKS SET BOOKISBN = ?,BOOKTITLE = ?,BOOKAUTHOR = ?,BOOKEDITOR = ?,BOOKPUBLISHER = ?,BOOKFORMAT = ?,BOOKPUBLICATIONDATE = ?,BOOKPRICE = ? WHERE BOOKID = ?';
        var statement = connection.prepareStatement(sql);
        var i = 0;
        statement.setString(++i, entity.bookisbn);
        statement.setString(++i, entity.booktitle);
        statement.setString(++i, entity.bookauthor);
        statement.setString(++i, entity.bookeditor);
        statement.setString(++i, entity.bookpublisher);
        statement.setString(++i, entity.bookformat);
        if (entity.bookpublicationdate !== null) {
            var js_date_bookpublicationdate =  new Date(Date.parse(entity.bookpublicationdate));
            statement.setDate(++i, js_date_bookpublicationdate);
        } else {
            statement.setDate(++i, null);
        }
        statement.setDouble(++i, entity.bookprice);
        var id = entity.bookid;
        statement.setInt(++i, id);
        statement.executeUpdate();
    } finally {
        connection.close();
    }
};

// Delete an entity
exports.delete = function(entity) {
    var connection = datasource.getConnection();
    try {
    	var sql = 'DELETE FROM BOOKS WHERE BOOKID = ?';
        var statement = connection.prepareStatement(sql);
        statement.setString(1, entity.bookid);
        statement.executeUpdate();
    } finally {
        connection.close();
    }
};

// Return the entities count
exports.count = function() {
    var count = 0;
    var connection = datasource.getConnection();
    try {
    	var sql = 'SELECT COUNT(*) FROM BOOKS';
        var statement = connection.prepareStatement(sql);
        var rs = statement.executeQuery();
        if (rs.next()) {
            count = rs.getInt(1);
        }
    } finally {
        connection.close();
    }
    return count;
};

// Returns the metadata for the entity
exports.metadata = function() {
	var metadata = {
		name: 'books',
		type: 'object',
		properties: [
		{
			name: 'bookid',
			type: 'integer',
			key: 'true',
			required: 'true'
		},
		{
			name: 'bookisbn',
			type: 'string'
		},
		{
			name: 'booktitle',
			type: 'string'
		},
		{
			name: 'bookauthor',
			type: 'string'
		},
		{
			name: 'bookeditor',
			type: 'string'
		},
		{
			name: 'bookpublisher',
			type: 'string'
		},
		{
			name: 'bookformat',
			type: 'string'
		},
		{
			name: 'bookpublicationdate',
			type: 'date'
		},
		{
			name: 'bookprice',
			type: 'double'
		},
		]
	};
	return metadata;
};

// Create an entity as JSON object from ResultSet current Row
function createEntity(resultSet) {
    var result = {};
	result.bookid = resultSet.getInt('BOOKID');
    result.bookisbn = resultSet.getString('BOOKISBN');
    result.booktitle = resultSet.getString('BOOKTITLE');
    result.bookauthor = resultSet.getString('BOOKAUTHOR');
    result.bookeditor = resultSet.getString('BOOKEDITOR');
    result.bookpublisher = resultSet.getString('BOOKPUBLISHER');
    result.bookformat = resultSet.getString('BOOKFORMAT');
    if (resultSet.getDate('BOOKPUBLICATIONDATE') !== null) {
		result.bookpublicationdate = convertToDateString(new Date(resultSet.getDate('BOOKPUBLICATIONDATE').getTime()));
    } else {
        result.bookpublicationdate = null;
    }
    result.bookprice = resultSet.getDouble('BOOKPRICE');
    return result;
}

function convertToDateString(date) {
    var fullYear = date.getFullYear();
    var month = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth();
    var dateOfMonth = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return fullYear + '/' + month + '/' + dateOfMonth;
}
