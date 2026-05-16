import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Trash2, Plus, Edit } from 'lucide-react';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({ titulo: '', descricao: '', tecnologias: '', link_github: '', link_demo: '', destaque: 0, status: 'ativo' });

  const fetchProjects = () => {
    api.get('/projects.php').then(res => setProjects(res.data));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects.php', formData);
      alert('Projeto salvo!');
      fetchProjects();
      setFormData({ titulo: '', descricao: '', tecnologias: '', link_github: '', link_demo: '', destaque: 0, status: 'ativo' });
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar.');
    }
  };

  const handleDelete = async (id) => {
    if(confirm('Tem certeza?')) {
      await api.delete('/projects.php', { data: { id } });
      fetchProjects();
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar Simples */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-white mb-8">Admin</h2>
        <nav className="flex-1 space-y-2">
          <a href="#" className="block py-2.5 px-4 rounded transition bg-purple-600 text-white">Projetos</a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Gerenciar Projetos</h1>
          <div className="bg-gray-800 px-6 py-3 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-sm">Total de Projetos</p>
            <p className="text-2xl font-bold text-white">{projects.length}</p>
          </div>
        </div>

        {/* Formulario Add */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center"><Plus className="mr-2" /> Novo Projeto</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Título" required value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} className="bg-gray-900 border border-gray-600 rounded p-3 text-white focus:outline-none focus:border-purple-500" />
            <input type="text" placeholder="Tecnologias (vírgula)" required value={formData.tecnologias} onChange={e => setFormData({...formData, tecnologias: e.target.value})} className="bg-gray-900 border border-gray-600 rounded p-3 text-white focus:outline-none focus:border-purple-500" />
            <textarea placeholder="Descrição" required value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} className="bg-gray-900 border border-gray-600 rounded p-3 text-white col-span-2 focus:outline-none focus:border-purple-500"></textarea>
            <input type="text" placeholder="Link GitHub" value={formData.link_github} onChange={e => setFormData({...formData, link_github: e.target.value})} className="bg-gray-900 border border-gray-600 rounded p-3 text-white focus:outline-none focus:border-purple-500" />
            <input type="text" placeholder="Link Demo Live" value={formData.link_demo} onChange={e => setFormData({...formData, link_demo: e.target.value})} className="bg-gray-900 border border-gray-600 rounded p-3 text-white focus:outline-none focus:border-purple-500" />
            <button type="submit" className="col-span-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded transition-colors">Cadastrar Projeto</button>
          </form>
        </div>

        {/* Tabela de Projetos */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-900 border-b border-gray-700 text-gray-400">
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
                  <td className="p-4"><span className="bg-green-900/50 text-green-400 text-xs px-2 py-1 rounded">{p.status}</span></td>
                  <td className="p-4 flex justify-end space-x-2">
                    <button className="p-2 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}