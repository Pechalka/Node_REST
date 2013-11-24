

var mysql      = require('mysql');
var mysqlUtilities = require('mysql-utilities');


var connection = mysql.createConnection({
	  host     : 'localhost',
	  database : 'gratify',
	  user     : 'root',
	  password : '123'
});

connection.connect();

// Mix-in for Data Access Methods and SQL Autogenerating Methods
mysqlUtilities.upgrade(connection);

// Mix-in for Introspection Methods
mysqlUtilities.introspection(connection);


connection.on('error', function(e) {
	console.log(e);
	connection.end();	
});

var readAll = function(table) {
	return function(q, cb) {
		var perPage = parseInt(q.perPage, 10);
		var page = parseInt(q.page, 10);

		delete q.page;
		delete q.perPage;
		
		var orderBy = '';
		if (q.sortField){
			q.sortDist = q.sortDist || 'asc';
			orderBy = ' ORDER BY ' + table + '.' + q.sortField + ' ' + q.sortDist;
			delete q.sortDist;
			delete q.sortField;
		}


		var where = connection.where(q);
		if (where!='') where = ' where ' + where; 
		var sql = 'SELECT * from ' 
				+ table + where
				+ orderBy
				+ ' LIMIT ' + (page-1)*perPage +  ', ' +  perPage ;

		console.log(sql);		 
		var result = {};
		connection.query(sql, function(e, rows){
			result.items = rows;
			connection.query('SELECT COUNT(*) as count FROM ' + table + where, function(e, rows){
				result.totalCount = rows[0]['count'];
				console.log(result);
				cb(null, result);	
			})
		});
	}
}

var read = function(table) {
	return function(id, cb) {
		var sql = 'SELECT * from ' + table + ' where id = ' + connection.escape(id) ;

		connection.query(sql, function(err, rows, fields) {
			if (err) {
				cb(err);
			}
			else {
				cb(null, rows[0]);
			}
		});
	}
}



var create = function(table){ 
	return function(data, cb) {
		//todo return obj
		var q = connection.query('INSERT INTO ' + table + ' SET ?', data, cb);
	}
}

var remove = function(table){
	return function(id, cb){
		var sql = 'DELETE from ' + table + ' where id = ' + connection.escape(id);
		connection.query(sql, cb);
	}
}

var update = function(table){
	//todo return obj
	return function(data, id, cb){
		connection.query('UPDATE ' + table + ' SET ? WHERE id = ' + connection.escape(id), data, cb);		
	}
}

module.exports = function(table){
	return {
		readAll : readAll(table),
		read : read(table),
		create : create(table),
		remove : remove(table),
		update : update(table)
	}
}