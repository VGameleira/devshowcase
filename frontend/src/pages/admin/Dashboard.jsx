import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Trash2, Plus, Edit2, X, Check } from 'lucide-react';

const initialForm = {
  titulo: '',
  descricao: '',
  tecnologias: '',
  categoria: '',
  link_github: '',
  link_demo: '',
  destaque: 0,
  status: 'ativo',
};

export default function Dashboard() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({ ...initialForm });
  const [editingId, setEditingId] = useState(null);
  const [salvando, setSalvando] = useState(false);

  // Redireciona se não estiver autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  const fetchProjects = () => {
    api.get('/projects.php').then(res => setProjects(res.data)).catch(() => {});
  };

  useEffect(() => {
    if (isAuthenticated) fetchProjects();
  }, [isAuthenticated]);

  // Enquanto verifica autenticação, mostra loading
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent" />
      </div>
    );
  }

  // Só renderiza o dashboard se autenticado
  if (!isAuthenticated) return null;

  function handleEdit(project) {
    setEditingId(project.id);
    setFormData({
      titulo: project.titulo || '',
      descricao: project.descricao || '',
      tecnologias: project.tecnologias || '',
      categoria: project.categoria || '',
      link_github: project.link_github || '',
      link_demo: project.link_demo || '',
      destaque: project.destaque == 1 ? 1 : 0,
      status: project.status || 'ativo',
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setFormData({ ...initialForm });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);

    try {
      if (editingId) {
        await api.put('/projects.php', { id: editingId, ...formData });
      } else {
        await api.post('/projects.php', formData);
      }

      fetchProjects();
      cancelEdit();
    } catch (err) {
      alert('Erro ao salvar projeto.');
    } finally {
      setSalvando(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;
    try {
      await api.delete('/projects.php', { data: { id } });
      fetchProjects();
    } catch {
      alert('Erro ao excluir.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />

      <div className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Gerenciar Projetos</h1>
          <div className="bg-gray-800 px-6 py-3 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-sm">Total</p>
            <p className="text-2xl font-bold text-white">{projects.length}</p>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            {editingId ? <Edit2 className="mr-2" size={20} /> : <Plus className="mr-2" size={20} />}
            {editingId ? 'Editar Projeto' : 'Novo Projeto'}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Título"
              required
              value={formData.titulo}
              onChange={e => setFormData({ ...formData, titulo: e.target.value })}
              className="bg-gray-900 border border-gray-600 rounded p-3 text-white focus:outline-none focus:border-purple-500"
            />
            <input
              type="text"
              placeholder="Tecnologias (separadas por vírgula)"
              value={formData.tecnologias}
              onChange={e => setFormData({ ...formData, tecnologias: e.target.value })}
              className="bg-gray-900 border border-gray-600 rounded p-3 text-white focus:outline-none focus:border-purple-500"
            />
            <input
              type="text"
              placeholder="Categoria"
              value={formData.categoria}
              onChange={e => setFormData({ ...formData, categoria: e.target.value })}
              className="bg-gray-900 border border-gray-600 rounded p-3 text-white focus:outline-none focus:border-purple-500"
            />
            <select
              value={formData.destaque}
              onChange={e => setFormData({ ...formData, destaque: e.target.value })}
              className="bg-gray-900 border border-gray-600 rounded p-3 text-white focus:outline-none focus:border-purple-500"
            >
              <option value={0}>Normal</option>
              <option value={1}>Destaque</option>
            </select>
            <textarea
              placeholder="Descrição"
              required
              rows={3}
              value={formData.descricao}
              onChange={e => setFormData({ ...formData, descricao: e.target.value })}
              className="bg-gray-900 border border-gray-600 rounded p-3 text-white col-span-2 focus:outline-none focus:border-purple-500"
            />
            <input
              type="text"
              placeholder="Link GitHub"
              value={formData.link_github}
              onChange={e => setFormData({ ...formData, link_github: e.target.value })}
              className="bg-gray-900 border border-gray-600 rounded p-3 text-white focus:outline-none focus:border-purple-500"
            />
            <input
              type="text"
              placeholder="Link Demo"
              value={formData.link_demo}
              onChange={e => setFormData({ ...formData, link_demo: e.target.value })}
              className="bg-gray-900 border border-gray-600 rounded p-3 text-white focus:outline-none focus:border-purple-500"
            />

            <div className="col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={salvando}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors"
              >
                {salvando ? 'Salvando...' : editingId ? 'Atualizar Projeto' : 'Cadastrar Projeto'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabela */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-900 border-b border-gray-700 text-gray-400 text-sm">
              <tr>
                <th className="p-4">Título</th>
                <th className="p-4">Tecnologias</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {projects.map(p => (
                <tr key={p.id} className="hover:bg-gray-750 transition-colors">
                  <td className="p-4 font-medium text-white">{p.titulo}</td>
                  <td className="p-4 text-sm text-gray-400">{p.tecnologias}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded ${
                      p.status === 'ativo'
                        ? 'bg-green-900/50 text-green-400'
                        : 'bg-yellow-900/50 text-yellow-400'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-2 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {projects.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-gray-500 py-12">
                    Nenhum projeto cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
