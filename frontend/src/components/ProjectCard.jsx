import { Link } from 'react-router-dom';
import { ExternalLink, Github, FolderCode } from 'lucide-react';

export default function ProjectCard({ project }) {
  if (!project) return null;

  const techs = project.tecnologias
    ? project.tecnologias.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all hover:-translate-y-1 group">
      {/* Imagem de capa (se tiver) */}
      {project.imagem && (
        <div className="h-48 overflow-hidden">
          <img
            src={`http://localhost/devshowcase/backend/${project.imagem}`}
            alt={project.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-5 space-y-3">
        {/* Categoria */}
        {project.categoria && (
          <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full">
            {project.categoria}
          </span>
        )}

        {/* Título */}
        <h3 className="text-lg font-bold text-white">{project.titulo}</h3>

        {/* Descrição */}
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
          {project.descricao}
        </p>

        {/* Tecnologias */}
        {techs.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {techs.map((tech) => (
              <span
                key={tech}
                className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-3 pt-2">
          <Link
            to={`/projeto/${project.id}`}
            className="flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            <FolderCode size={16} />
            Detalhes
          </Link>

          {project.link_github && (
            <a
              href={project.link_github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Github size={16} />
              Código
            </a>
          )}

          {project.link_demo && (
            <a
              href={project.link_demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ExternalLink size={16} />
              Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
