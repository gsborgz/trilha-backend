COLDIGO.produto = new Object()

$(document).ready(function() {
    COLDIGO.produto.carregarMarcas = function() {
        $.ajax({
            type: "GET",
            url: path + "/marca/buscar",
            success: function(marcas) {
                if (!COLDIGO.empty(marcas)) {
                    $("#selMarca").html("")

                    let option = document.createElement("option")
                    option.setAttribute("value", "")
                    option.innerHTML = ("Escolha")
                    $("#selMarca").append(option)

                    for (const i in marcas) {
                        let option = document.createElement("option")
                        option.setAttribute("value", marcas[i].id)
                        option.innerHTML = (marcas[i].nome)
                        $("#selMarca").append(option)
                    }
                } else {
                    $("#selMarca").html("")

                    let option = document.createElement("option")
                    option.setAttribute("value", "")
                    option.innerHTML = ("Cadastre uma marca primeiro!")
                    $("#selMarca").append(option)
                    $("#selMarca").addClass("aviso")
                }
            },
            error: function(info) {
                COLDIGO.exibirAviso("Erro ao buscar as marcas: " + info.status + " - " + info.statusText)

                $("#selMarca").html("")
                let option = document.createElement("option")
                option.setAttribute("value", "")
                option.innerHTML = ("Erro ao carregar marcas!")
                $("#selMarca").append(option)
                $("#selMarca").addClass("aviso")
            }
        })
    }
    COLDIGO.produto.carregarMarcas()

    COLDIGO.produto.cadastrar = function() {
        let produto = new Object()
        produto.categoria = document.frmAddProduto.categoria.value
        produto.categoria = document.frmAddProduto.marcaId.value
        produto.categoria = document.frmAddProduto.modelo.value
        produto.categoria = document.frmAddProduto.capacidade.value
        produto.categoria = document.frmAddProduto.valor.value

        if (COLDIGO.empty(produto.categoria) || COLDIGO.empty(produto.marcaId) || COLDIGO.empty(produto.modelo) || COLDIGO.empty(produto.capacidade) || COLDIGO.empty(produto.valor)) {
            COLDIGO.exibirAviso("Preencha todos os campos!")
        } else {
            $.ajax({
                type: "POST",
                url: path + "/produto/inserir",
                data:JSON.stringify(produto),
                success: function (msg) {
                    COLDIGO.exibirAviso(msg)
                    $("#addProduto").trigger("reset")
                },
                error: function (info) {
                    COLDIGO.exibirAviso("Erro ao cadastrar um novo produto: " + info.status + " - " + info.statusText)
                }
            })
        }
    }
})