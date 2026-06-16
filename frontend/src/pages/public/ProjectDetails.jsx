import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import api from '../../services/api';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/projects.php?id=${id}`)
      .then(res => setProject(res.data))
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-400 text-lg">Projeto não encontrado.</p>
        <Link to="/" className="text-purple-400 hover:text-purple-300 flex items-center gap-1">
          <ArrowLeft size={16} /> Voltar
        </Link>
      </div>
    );
  }

  const techs = project.tecnologias
    ? project.tecnologias.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pt-24">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-gray-400 hover:text-purple-400 transition-colors mb-8"
      >
        <ArrowLeft size={18} />
        Voltar
      </Link>

      <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
        {project.imagem && (
          <img
            src={`http://localhost/devshowcase/backend/${project.imagem}`}
            alt={project.titulo}
            className="w-full h-64 md:h-80 object-cover"
          />
        )}

        <div className="p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">{project.titulo}</h1>
              {project.categoria && (
                <span className="text-sm text-purple-400 mt-1 inline-block">
                  {project.categoria}
                </span>
              )}
            </div>
            {project.destaque == 1 && (
              <span className="bg-purple-500 text-xs px-3 py-1 rounded-full text-white shrink-0">
                Destaque
              </span>
            )}
          </div>

          <p className="text-gray-300 leading-relaxed whitespace-pre-line">
            {project.descricao}
          </p>

          {techs.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Tecnologias</h3>
              <div className="flex flex-wrap gap-2">
                {techs.map(tech => (
                  <span
                    key={tech}
                    className="text-sm bg-gray-700 text-purple-300 px-3 py-1 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4 border-t border-gray-700">
            {project.link_github && (
              <a
                href={project.link_github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                <Github size={18} />
                Código Fonte
              </a>
            )}
            {project.link_demo && (
              <a
                href={project.link_demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                <ExternalLink size={18} />
                Demo Online
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
