Ext.define('DemoExtJs.store.Sessao', {
    extend: 'Ext.data.Store',
    requires: [
        'DemoExtJs.model.Sessao'
    ],
    autoLoad: false, // só pode ler este store depois de ter um utilizador autenticado
    remoteSort:true, //enable remote filter
    remoteFilter:true, //enable remote sorting
    pageSize: 5,
    //autoSync: true, // if operating on model directly this will make double POSTs!
    model: 'DemoExtJs.model.Sessao'
    // storeId: 'Sessao' // If store Id matches it's class name, may be skipped.
});