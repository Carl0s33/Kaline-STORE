import React, { useState, useEffect } from 'react';
import ProductFormGoogleSheets from './ProductFormGoogleSheets';

const API_URL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhnbsqgBJfY-Zp_av6fxrDtYZqtsw0e7vdVdMS8_t72RCXrMoNXkElgn9Z75Sni-HyJYUmA__v5EfKSM0N71u_zuXZZCdHYKgUHEmeBOt5x_sG-CHxD9vLyF8EOKdYB3RKripKKcuvfhDGVDjCQpYJdiGQNzPozSRVQhe_YWQAHpUy2BFM0KKLy3-6chsWWwz6GrHjoGUUr_c48e2UHvd22Y3WD-PJC0XnUYbHHLzQBJqlXJnLkHB1RXDyLYOcMuqVPSsFO9jCcsnlR0GzczDkp6MNPEA&lib=MmuZ0w-l6mqNrEA1PjjoVOJqxAu1lDCeo';

export default function ProductAdminPanelGoogleSheets() {
  const [produtos, setProdutos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);

  // Buscar produtos do Google Sheets
  function fetchProdutos() {
    setLoading(true);
    fetch(API_URL)
      .then(r => r.json())
      .then(data => {
        setProdutos(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    fetchProdutos();
  }, []);

  // Função para remover produto
  async function removerProduto(id) {
    if (!window.confirm('Tem certeza que deseja remover este produto?')) return;
    // Não existe DELETE nativo, então vamos enviar um POST especial
    try {
      const resp = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ id, deletar: true })
      });
      const result = await resp.json();
      if (result.success) {
        alert('Produto removido!');
        fetchProdutos();
      } else {
        alert('Erro ao remover produto');
      }
    } catch {
      alert('Erro ao remover produto');
    }
  }

  // Quando salvar, recarrega lista e limpa edição
  function aoSalvar() {
    fetchProdutos();
    setEditando(null);
  }

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 24 }}>
      <h1>Administração de Produtos</h1>
      <ProductFormGoogleSheets
        produtoParaEditar={editando}
        aoSalvar={aoSalvar}
      />
      <hr style={{ margin: '24px 0' }} />
      <h2>Produtos cadastrados</h2>
      {loading && <p>Carregando produtos...</p>}
      {!loading && produtos.length === 0 && <p>Nenhum produto cadastrado.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {produtos.map(produto => (
          <li key={produto.id} style={{
            border: '1px solid #eee',
            marginBottom: 12,
            padding: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 16
          }}>
            {produto.imagem && (
              <img src={produto.imagem} alt={produto.nome} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
            )}
            <div style={{ flex: 1 }}>
              <strong>{produto.nome}</strong><br />
              <span>Preço: R$ {produto.preco}</span><br />
              <span>Categoria: {produto.categoria}</span>
            </div>
            <button onClick={() => setEditando(produto)} style={{ marginRight: 8 }}>Editar</button>
            <button onClick={() => removerProduto(produto.id)} style={{ color: 'red' }}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
