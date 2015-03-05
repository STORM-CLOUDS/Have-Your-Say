Ext.define('GeoPublic.store.Users.Sessao', {
    extend: 'Ext.data.Store',
    requires: [
        'GeoPublic.model.Users.Sessao'
    ],
    autoLoad: false, // só pode ler este store depois de ter um utilizador autenticado
    remoteSort: true, //enable remote filter
    remoteFilter: true, //enable remote sorting
    pageSize: 20,
    //autoSync: true, // if operating on model directly this will make double POSTs!
    model: 'GeoPublic.model.Users.Sessao'
});