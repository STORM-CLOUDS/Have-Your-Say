Ext.define('GeoPublic.controller.Participation.Discussion', {
	extend : 'Ext.app.Controller',
	// stores : ['Participation.EstadoCombo'], // getParticipationEstadoComboStore()
	// Ext.ComponentQuery.query('commentform toolbar button#gravar')
	refs : [{
		ref : 'mapa',
		selector : 'app-main-map-panel'
	}],
	init : function() {
		this.control({
			"commentform toolbar button#gravar" : {
				click : this.onButtonGravar
			},
			"discussion tool[type=search]" : {
				click : this.onCenterFeature
			},
			"discussion commentlist" : {
				beforeexpand : this.onCommentListBeforeExpand
			}
		});
	},
    onCommentListBeforeExpand : function(p, animate, eOpts) {
		// console.log('GeoPublic.controller.Participation.Discussion onOcorrenciaBeforeExpand');
		var o = p.up('discussion').idocorrencia;
		// console.debug(p);
		if (!p.loaded) {
			p.header.getEl().setStyle('cursor','default');
			ExtRemote.DXParticipacao.readComment(o, function(result, event) {
				if (result.success) {
					// console.log(result.data);
					// result.data é um array...
					// tenho que mudar cada componente do array...
					// "haquantotempo": {"hours":2,"minutes":41,"seconds":59}
					var aux = [];
					Ext.Array.each(result.data, function(rec, index, comments) {
						console.log(rec);
						var datacriacao = Ext.Date.parse(rec.datacriacao, 'c');
						var tempo = 'Há ';
						if (!rec.haquantotempo.days) {
							rec.haquantotempo.days = 0;
						}
						if (!rec.haquantotempo.hours) {
							rec.haquantotempo.hours = 0;
						}
						if (!rec.haquantotempo.minutes) {
							rec.haquantotempo.minutes = 0;
						}
						if (rec.haquantotempo.days > 0) {
							tempo += rec.haquantotempo.days + ' dias (' + Ext.Date.format(datacriacao, 'l') + '), às ' + Ext.Date.format(datacriacao, 'H:i');
						} else {
							if (rec.haquantotempo.hours > 0) {
								tempo += rec.haquantotempo.hours + ':' + rec.haquantotempo.minutes;
							} else {
								if (rec.haquantotempo.minutes > 0) {
									tempo += rec.haquantotempo.minutes + ' minutos';
									// tempo += rec.haquantotempo.seconds + ' segundos';
								} else {
									tempo += 'menos de 1 minuto';
								}
							}
						}
						aux.push(Ext.apply(rec, {
							tempo : tempo
						}));
					});
					// console.log(result.total);
					var start = new Date().getTime();

					p.update(aux);
					p.numcomments = parseInt(result.total);
					p.setTitle(p.numcomments + ' comentários');
					p.loaded = true;

					var end = new Date().getTime();
					var time = end - start;
					console.log('Execution time: ' + time);

				} else {
					console.log('Problemas na recuperação dos comentários');
				}
			});
		}
	},
    /*
    Este método é invocado pelo utilizador
     */
	onCenterFeature : function(tool, e) {
		// console.log(arguments);
		var ocorrencia = tool.up('panel').idocorrencia;
        var activity = tool.up('activitynew');
        if (activity.geodiscussao) {
            var feature = tool.up('panel').feature;
            //<debug>
            console.log('Discussion.onCenterFeature - Vai centrar na ocorrência ' + ocorrencia, feature);
            console.log('Mostrar ocorrência geográfica', ocorrencia);
            //</debug>
            if (feature) {
                var mapa = feature.layer.map;
                var layer = feature.layer;
                var control = mapa.getControlsBy("id", "selectCtrl")[0];
                if (control) {
                    control.unselectAll();
                    control.select(feature);
                    mapa.zoomToExtent(feature.geometry.getBounds(), closest = true);
                } else {
                    console.log('PROBLEMA: Não encontro o control no mapa');
                }
            }
        } else {
            //<debug>
            console.log('Mostrar ocorrência NÃO geográfica', ocorrencia);
            console.log('Informação que tenho: ', tool.up('panel'));
            //</debug>
            var informacao = activity.up('discussao-regulamento').down('#informacao-lhs');

            // Mostrar a nova redação, se existir...
            // O ideal seria só mostrar a ferramenta se existir uma proposta de redação
            var proposta = tool.up('panel').proposta;
            if (Ext.isDefined(proposta) && proposta.length > 0) {
                // Mostrar, sem deixar mexer
                var idsec = '#' + activity.up('discussao-regulamento').down('#secretaria').id;
                $(idsec).mergely('options', {autoupdate: true, change_timeout: 150});
                $(idsec).mergely('update');
                $(idsec).mergely('rhs', proposta);
                $(idsec).mergely('cm', 'rhs').setOption('readOnly', true);
                informacao.update('Redação proposta por: ' + tool.up('panel').nome );
            } else {
                informacao.update('');
            }
        }
	},
	onButtonGravar : function(button, e, options) {
		console.log('Gravar comentário');
		// console.log(button);

		var me = this;
		var d = button.up('discussion');
        var activity = d.up('activitynew');
		var fc = button.up('form').getForm();
		var params = fc.getValues(false, false, false, false);

        ExtRemote.DXParticipacao.createComment(params, function(result, event) {
			if (result.success) {
				// Ext.Msg.alert('Successo', 'O seu comentário foi registado. Obrigado pela participação.');
				// limpar o formulário!
				// fc.findField('comentario').setValue('');
				// reset() clear the field and removes the validation reminder
				fc.reset();
				var comboBox = button.up('form').down('combo');
				comboBox.clearValue();

				// console.log(result.data);
				// console.log(JSON.stringify(result.data));
				// console.log(result.data[0].id);

				var p = button.up('discussion').down('commentlist');
				// console.debug(p);

				// alterar a cor do feature em função da alteração do estado
				// se houve alteração do estado...
				var cor = '';
				var estadoTexto = '';

				if (params.idestado) {
					var novo = params.idestado;
                    // var estado = me.getParticipationEstadoComboStore().findRecord('id', novo);
                    var estadoStore = button.up('discussion').estadoStore;
                    var estado = estadoStore.findRecord('id', novo);
					cor = estado.get('color');
					estadoTexto = estado.get('estado');
					// Qual é a nova cor?
                    if (activity.geodiscussao) {
                        d.feature.attributes['color'] = cor;
                        d.feature.layer.drawFeature(d.feature);
                    }
					fc.findField('comentario').setValue('');
					// atualiza do estado no painel
					d.estado = estadoTexto;
					d.color = cor;
				} else {
					// Vai buscar o estado anterior ao painel...
					cor = d.color;
					estadoTexto = d.estado;
					console.log('Aproveitar estado guardado: ', d.color, d.estado);
				}
				// atualizar o form dos comentários
				// comboBox.setFieldStyle('color:green'); // muda a combo; não o label!
				comboBox.labelEl.setStyle('color', d.color);
				comboBox.setFieldLabel('Estado: ' + d.estado);
				if (p.loaded) {
					// junto este aos comentários existentes
					var tempo = 'Há menos de 1 minuto';
					// if (p.numcomments > 0) {
					p.data.push(Ext.apply(result.data[0], {
						tempo : tempo,
						estado: estadoTexto,
						color: cor
					}));
					p.update(p.data);
					// } else {
					// 	p.update(result.data[0]);
					// }
					p.numcomments = p.numcomments + 1;
					p.setTitle(p.numcomments + ' comentários');
				} else {
					// Abre os comentários
					p.expand(true);
				}


			} else {
				Ext.Msg.alert('Erro', 'Ocorreu um erro ao registar o seu comentário.');
			}
		});
	}
});
