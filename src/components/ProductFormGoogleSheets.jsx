import React, { useState } from 'react';

// Substitua pela URL do seu Apps Script publicado!
const API_URL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhnbsqgBJfY-Zp_av6fxrDtYZqtsw0e7vdVdMS8_t72RCXrMoNXkElgn9Z75Sni-HyJYUmA__v5EfKSM0N71u_zuXZZCdHYKgUHEmeBOt5x_sG-CHxD9vLyF8EOKdYB3RKripKKcuvfhDGVDjCQpYJdiGQNzPozSRVQhe_YWQAHpUy2BFM0KKLy3-6chsWWwz6GrHjoGUUr_c48e2UHvd22Y3WD-PJC0XnUYbHHLzQBJqlXJnLkHB1RXDyLYOcMuqVPSsFO9jCcsnlR0GzczDkp6MNPEA&lib=MmuZ0w-l6mqNrEA1PjjoVOJqxAu1lDCeo';

export default function ProductFormGoogleSheets({ produtoParaEditar, aoSalvar }) {
  const [form, setForm] = useState({
    id: produtoParaEditar?.id || '',
    nome: produtoParaEditar?.nome || '',
    preco: produtoParaEditar?.preco || '',
    categoria: produtoParaEditar?.categoria || '',
    imagem: produtoParaEditar?.imagem || '',
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form };
    if (!payload.id) delete payload.id;
    try {
      const resp = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const result = await resp.json();
      alert(result.success ? 'Produto salvo com sucesso!' : 'Erro ao salvar produto');
      if (aoSalvar) aoSalvar(result);
      if (!form.id) setForm({ id: '', nome: '', preco: '', categoria: '', imagem: '' });
    } catch (err) {
      alert('Erro ao salvar produto');
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>{form.id ? 'Editar Produto' : 'Adicionar Produto'}</h2>
      <input
        name="nome"
        placeholder="Nome"
        value={form.nome}
        onChange={handleChange}
        required
        style={{ width: '100%', marginBottom: 8 }}
      />
      <input
        name="preco"
        placeholder="Preço"
        value={form.preco}
        onChange={handleChange}
        required
        style={{ width: '100%', marginBottom: 8 }}
      />
      <input
        name="categoria"
        placeholder="Categoria"
        value={form.categoria}
        onChange={handleChange}
        required
        style={{ width: '100%', marginBottom: 8 }}
      />
      <input
        name="imagem"
        placeholder="URL da Imagem"
        value={form.imagem}
        onChange={handleChange}
        style={{ width: '100%', marginBottom: 8 }}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Salvando...' : (form.id ? 'Salvar Alterações' : 'Adicionar Produto')}
      </button>
    </form>
  );
}
