package br.com.coldigogeladeiras.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

import com.google.gson.Gson;
import java.sql.Connection;

import br.com.coldigogeladeiras.db.Conexao;
import br.com.coldigogeladeiras.jdbc.JDBCProdutoDAO;
import br.com.coldigogeladeiras.modelo.Produto;

@Path("produto")
public class ProdutoRest extends UtilRest {
	@POST
	@Path("/inserir")
	@Consumes("application/*")
	public Response inserir(String produtoParam) {
		try {
			Produto produto = new Gson().fromJson(produtoParam, Produto.class);
			
			Conexao con = new Conexao();
			Connection conexao = con.abrirConexao();
			
			JDBCProdutoDAO jdbcProduto = new JDBCProdutoDAO(conexao);
			
			boolean retorno = jdbcProduto.inserir(produto);
			
			String msg = "";
			
			if (retorno) {
				msg = "Produto cadastro com sucesso!";
			} else {
				msg = "Erro ao cadastrar produto.";
			}
			
			con.fecharConexao();
			
			return this.buildErrorResponse(msg);
		} catch(Exception e) {
			e.printStackTrace();
			return this.buildErrorResponse(e.getLocalizedMessage());
		}
	}
}