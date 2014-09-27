Ext.define('DemoExtJs.model.Ocorrencia', {
	extend : 'Ext.data.Model',
	fields : [{
		name : 'id',
		type : 'int'
	}, {
		name : 'idplano',
		type : 'int'
	}, {
		name : 'idestado',
		type : 'int'
	}, {
		name : 'idtipoocorrencia',
		type : 'int'
	}, {
		name : 'titulo',
		type : 'string'
	}, {
		name : 'participacao',
		type : 'string'
	}, {
		name : 'geojson',
		type : 'string'
	}, {
		name : 'datacriacao',
		type : 'date'
	}, {
		name : 'datamodificacao',
		type : 'date'
	}, {
		name : 'numcomentarios',
		type : 'int'
	}, {
		name : 'color',
		type : 'string'
	}, {
		name : 'icon',
		type : 'string'
	}],
	proxy : {
		type : 'direct',
		// paramOrder : 'id',
		api : {
			create : 'ExtRemote.DXParticipacao.createOcorrencia',
			read : 'ExtRemote.DXParticipacao.readOcorrencia',
			update : 'ExtRemote.DXParticipacao.updateOcorrencia',
			destroy : 'ExtRemote.DXParticipacao.destroyOcorrencia'
		},
		reader : {
			type : 'json',
			root : 'data',
			messageProperty : 'message'
		},
		writer : {
			writeAllFields : false
		}
	}
}); 