import { useEffect, useState } from 'react';
import api from '../../services/api';
import ProjectCard from '../../components/ProjectCard';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/projects.php')
      .then(response => {
        setProjects(response.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <header className="text-center mb-16 pt-16">
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
          VGameleira
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Desenvolvedor full stack apaixonado por transformar ideias em código.
          Aqui você encontra meus projetos, experiments e contribuições.
        </p>
      </header>

      {/* Projetos */}
      <section id="projetos">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
          <span className="w-1 h-6 bg-purple-500 rounded-full inline-block" />
          Projetos
        </h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent" />
          </div>
        ) : projects.length === 0 ? (
          <p className="text-gray-500 text-center py-20">Nenhum projeto encontrado ainda.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      {/* Contato */}
      <section id="contato" className="mt-24 mb-12 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Contato</h2>
        <p className="text-gray-400 mb-6">
          Quer trocar uma ideia ou colaborar em algum projeto?
        </p>
        <a
          href="mailto:vitor@gameleira.dev"
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          Enviar Email
        </a>
      </section>
    </div>
  );
}
