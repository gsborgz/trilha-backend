COLDIGO.produto = new Object();

$(document).ready(function() {
    const path = COLDIGO.PATH;

    COLDIGO.produto.carregarMarcas = function(id) {
        let select;
        if (id !== undefined) {
            select = "#selMarcaEdicao";
        } else {
            select = "#marcas_id";
        }

        $.ajax({
            type: "GET",
            url: path + "/marca/buscar",
            success: function(marcas) {
                if (!COLDIGO.empty(marcas)) {
                    $(select).html("")

                    let option = document.createElement("option")
                    option.setAttribute("value", "")
                    option.innerHTML = ("Escolha")
                    $(select).append(option)

                    for (const i in marcas) {
                        let option = document.createElement("option")
                        option.setAttribute("value", marcas[i].id)

                        if (id !== undefined && id == marcas[i].id) {
                            option.setAttribute("selected", "selected");
                        }

                        option.innerHTML = (marcas[i].nome)
                        $(select).append(option)
                    }
                } else {
                    $(select).html("")

                    let option = document.createElement("option")
                    option.setAttribute("value", "")
                    option.innerHTML = ("Cadastre uma marca primeiro!")
                    $(select).append(option)
                    $(select).addClass("aviso")
                }
            },
            error: function(info) {
                COLDIGO.exibirAviso("Erro ao buscar as marcas: " + info.status + " - " + info.statusText)

                $(select).html("")
                let option = document.createElement("option")
                option.setAttribute("value", "")
                option.innerHTML = ("Erro ao carregar marcas!")
                $(select).append(option)
                $(select).addClass("aviso")
            }
        })
    }

    COLDIGO.produto.cadastrar = function() {
        let produto = new Object()
        produto.categoria = document.frmAddProduto.categoria.value
        produto.marcas_id = document.frmAddProduto.marcas_id.value
        produto.modelo = document.frmAddProduto.modelo.value
        produto.capacidade = document.frmAddProduto.capacidade.value
        produto.valor = document.frmAddProduto.valor.value

        if (COLDIGO.empty(produto.categoria)) {
            COLDIGO.exibirAviso("Selecione uma categoria!")
        } else if (COLDIGO.empty(produto.marcas_id)) {
            COLDIGO.exibirAviso("Selecione uma marca!")
        } else if (COLDIGO.empty(produto.modelo)) {
            COLDIGO.exibirAviso("Informe o modelo!")
        } else if (COLDIGO.empty(produto.capacidade)) {
            COLDIGO.exibirAviso("Informe a capacidade!")
        } else if (COLDIGO.empty(produto.valor)) {
            COLDIGO.exibirAviso("Informe o valor!")
        } else {
            $.ajax({
                type: "POST",
                url: path + "/produto/inserir",
                data:JSON.stringify(produto),
                success: function (msg) {
                    COLDIGO.exibirAviso(msg);
                    $("#addProduto").trigger("reset");
                    COLDIGO.produto.buscar();
                },
                error: function (info) {
                    COLDIGO.exibirAviso("Erro ao cadastrar um novo produto: " + info.status + " - " + info.statusText);
                }
            })
        }
    }

    COLDIGO.produto.buscar = function() {
        let valorBusca = $("#campoBuscaProduto").val()

        $.ajax({
            type: "GET",
            url: path + "/produto/buscar",
            data: "valorBusca=" + valorBusca, 
            success: function(dados) {
                dados = JSON.parse(dados);
                $('#listaProdutos').html(COLDIGO.produto.exibir(dados));
            },
            error: function(info) {
                COLDIGO.exibirAviso("Erro ao consultar os contatos: " + info.status + " - " + info.statusText);
            }
        })
    }

    COLDIGO.produto.exibir = function(listaDeProdutos) {
    	let tabela = `
            <table>
                <tr>
                    <th>Categoria</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Cap.(1)</th>
                    <th>Valor</th>
                    <th class='acoes'>Ações</th>
                </tr>
        `;

        if (listaDeProdutos != undefined && listaDeProdutos.length > 0) {
            for (produto of listaDeProdutos) {
                tabela += `
                    <tr>
                        <td>${produto.categoria}</td>
                        <td>${produto.marcaNome}</td>
                        <td>${produto.modelo}</td>
                        <td>${produto.capacidade}</td>
                        <td>R$ ${COLDIGO.formatarDinheiro(produto.valor)}</td>
                        <td>
                            <a onclick='COLDIGO.produto.exibirEdicao(${produto.id})'><img src='/coldigoGeladeiras/imgs/edit.png' alt='Editar registro'></a>
                            <a onclick='COLDIGO.produto.excluir(${produto.id})'><img src='/coldigoGeladeiras/imgs/delete.png' alt='Excluir registro'></a>
                        </td>
                    </tr>
                `;
            }
        } else if (listaDeProdutos == "") {
            tabela += "<tr><td colspan='6'>Nenhum registro encontrado</td></tr>";
        }

        tabela += "</table>"
        	
        return tabela;
    }

    COLDIGO.produto.excluir = function(id) {
        $.ajax({
            type: "DELETE",
            url: COLDIGO.PATH + "/produto/excluir/" + id,
            success: function(msg) {
                COLDIGO.exibirAviso(msg);
                COLDIGO.produto.buscar();
            },
            error: function(info) {
                COLDIGO.exibirAviso(`Erro ao excluir produto ${info.status} - ${info.statusText}`);
            }
        });
    }

    COLDIGO.produto.exibirEdicao = function(id){
        $.ajax({
            type: "GET",
            url: COLDIGO.PATH + "/produto/buscarPorId",
            data: { id },
            success: function(produto) {
                console.log(produto.id);

                document.frmEditarProduto.idProduto.value = produto.id;
                document.frmEditarProduto.modelo.value = produto.modelo;
                document.frmEditarProduto.capacidade.value = produto.capacidade;
                document.frmEditarProduto.valor.value = produto.valor;

                let selCategoria = document.getElementById('selCategoriaEdicao');
                
                for (let i = 0; i < selCategoria.length; i++) {
                    if (selCategoria.options[i].value == produto.categoria) {
                        selCategoria.options[i].setAttribute("selected", "selected");
                    } else {
                        selCategoria.options[i].removeAttribute("selected");
                    }
                }

                COLDIGO.produto.carregarMarcas(produto.marcas_id);

                let modalEditarProduto = {
                    title: "Editar Produto",
                    height: 400,
                    width: 550,
                    modal: true,
                    buttons: {
                        "Salvar": function() {
                            COLDIGO.produto.editar();
                        },
                        "Cancelar": function() {
                            $(this).dialog("close");
                        }
                    },
                    close: function() {

                    }
                };

                $("#modalEditarProduto").dialog(modalEditarProduto);
            },
            error: function(info) {
                COLDIGO.exibirAviso(`Erro ao buscar produto para edição: ${info.status} - ${info.statusText}`);
            }
        });
    }

    COLDIGO.produto.editar = function() {
        const { idProduto, categoria, marcaId, modelo, capacidade, valor } = document.frmEditarProduto;

        let produto = {};
        produto.id = parseInt(idProduto.value);
        produto.categoria = parseInt(categoria.value);
        produto.marcas_id = parseInt(marcaId.value);
        produto.modelo = modelo.value;
        produto.capacidade = parseInt(capacidade.value);
        produto.valor = parseFloat(valor.value);

        console.log(produto);

        $.ajax({
            type: "PUT",
            url: path + "/produto/alterar",
            data: JSON.stringify(produto),
            success: function(msg) {
                COLDIGO.exibirAviso(msg);
                COLDIGO.produto.buscar();
                $("#modalEditarProduto").dialog("close");
            },
            error: function(info) {
                COLDIGO.exibirAviso(`Erro ao editar produto: ${info.status} - ${info.statusText}`);
            }
        });
    }

    COLDIGO.produto.carregarMarcas();
    COLDIGO.produto.buscar();
})