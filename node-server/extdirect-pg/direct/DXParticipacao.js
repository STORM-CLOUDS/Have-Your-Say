var db = global.App.database;
var DXParticipacao = {
	/*
	 * 		api : {
	 create : 'ExtRemote.DXParticipacao.createPromotor',
	 read : 'ExtRemote.DXParticipacao.readPromotor'
	 update : 'ExtRemote.DXParticipacao.updatePromotor',
	 destroy : 'ExtRemote.DXParticipacao.destroyPromotor'
	 },
	 */
	createPromotor : function(params, callback, sessionID, request) {
		// falta proteger só para grupo admin
		/*
		 createPromotor:
		 {
		 id: 0,
		 designacao: 'Nova entidade',
		 email: 'info@entidade.pt',
		 site: 'http://www.entidade.pt',
		 dataregisto: null }
		 */
		console.log('Session ID = ' + sessionID, request.session.userid, request.session.groupid);
		console.log('createPromotor: ', params);
		var fields = [], values = [];
		// o primeiro parâmetro é a chave (garantido por paramOrder : 'id', em app/model/Promotor.js)
		// o id vem a 0, quando se insere um registo
		for (var key in params) {
			switch (key) {
				case "id":
					break;
				case "dataregisto":
					fields.push(key);
					values.push('now()');
					break;
				default:
					fields.push(key);
					values.push(params[key]);
					break;
			}
		}
		fields.push('datamodificacao');
		values.push('now()');
		fields.push('idutilizador');
		values.push(request.session.userid);
		var i = 0, buracos = [];
		for ( i = 1; i <= fields.length; i++) {
			buracos.push('$' + i);
		}
		var conn = db.connect();
		conn.query('INSERT INTO ppgis.promotor (' + fields.join() + ') VALUES (' + buracos.join() + ') RETURNING id', values, function(err, resultInsert) {
			db.disconnect(conn);
			if (err) {
				db.debugError(callback, err);
			} else {
				callback({
					success : true,
					message : 'Dados atualizados',
					data : resultInsert.rows
					// id : resultInsert.rows[0].id
				});
			}
		});
	},
	updatePromotor : function(params, callback, sessionID, request) {
		console.log('Session ID = ' + sessionID, request.session.userid, request.session.groupid);
		var fields = [], values = [], i = 0, id = 0;
		// o primeiro parâmetro é a chave (garantido por paramOrder : 'id', em app/model/Promotor.js)
		// Está a deixar alterar a dataregisto, mas depois a ideia é não deixar
		for (var key in params) {
			// if (i==0 && key == 'id') {
			if (i == 0) {
				id = params[key];
			} else {
				fields.push(key + '= $' + i);
				values.push(params[key]);
			}
			i = i + 1;
		}
		fields.push('datamodificacao = $' + i);
		values.push('now()');
		i = i + 1;
		fields.push('idutilizador = $' + i);
		values.push(request.session.userid);
		if (request.session.userid && request.session.groupid <= 1) {
			var conn = db.connect();
			conn.query('UPDATE ppgis.promotor SET ' + fields.join() + ' WHERE id = ' + id, values, function(err, result) {
				if (err) {
					console.log('UPDATE =' + sql + ' Error: ' + err);
					db.debugError(callback, err);
				} else {
					var sql = 'SELECT * FROM ppgis.promotor where id = ' + id;
					conn.query(sql, function(err, resultSelect) {
						db.disconnect(conn);
						if (err) {
							console.log('SQL=' + sql + ' Error: ', err);
							db.debugError(callback, err);
						} else {
							callback({
								success : true,
								message : 'Dados atualizados',
								data : resultSelect.rows
							});
						}
					});
				}
			});
		} else {
			callback({
				success : false,
				message : 'Utilizador sem permissão para alterar os dados.'
			});
		}
	},
	destroyPromotor : function(params, callback, sessionID, request) {
		// falta proteger só para grupo admin
		console.log('destroyPromotor: ', params.id);
		var conn = db.connect();
		var sql = 'delete FROM ppgis.promotor where id = ' + params.id;
		conn.query(sql, function(err, result) {
			db.disconnect(conn);
			if (err) {
				console.log('SQL=' + sql + ' Error: ', err);
				db.debugError(callback, err);
			} else {
				callback({
					success : true
				});
			}
		});
	},
	readPromotor : function(params, callback, sessionID, request) {
		console.log(params);
		// { userid: 31, page: 1, start: 0, limit: 5 }
		var userid = request.session.userid;
		var conn = db.connect();
		var sql = 'SELECT * FROM ppgis.promotor';
		conn.query(sql, function(err, result) {
			if (err) {
				console.log('SQL=' + sql + ' Error: ', err);
				db.debugError(callback, err);
			} else {
				//get totals for paging
				var totalQuery = 'SELECT count(*) as totals from ppgis.promotor';
				conn.query(totalQuery, function(err, resultTotalQuery) {
					if (err) {
						console.log('SQL=' + totalQuery + ' Error: ', err);
						db.debugError(callback, err);
					} else {
						db.disconnect(conn);
						//release connection
						console.log('Totais: ', result.rows.length, resultTotalQuery.rows[0].totals);
						callback({
							success : true,
							data : result.rows,
							total : resultTotalQuery.rows[0].totals // rowsTotal[0].totals
						});
					}
				});
			}
		});
	}
};

module.exports = DXParticipacao;
