import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Github, ExternalLink } from 'lucide-react';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/projects.php')
      .then(response => {
        setProjects(response.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
          DevShowcase
        </h1>
        <p className="text-gray-400 text-lg">Portfólio Profissional Full Stack</p>
      </header>

      {loading ? (
        <div className="flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(project => (
            <div key={project.id} className="bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 border border-gray-700 shadow-lg shadow-purple-900/20">
              {/* Placeholder para imagem */}
              <div className="h-48 bg-gray-700 bg-[url('https://source.unsplash.com/random/800x600/?technology,code')] bg-cover bg-center"></div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">{project.titulo}</h3>
                  {project.destaque === '1' && <span className="bg-purple-500 text-xs px-2 py-1 rounded-full text-white">Destaque</span>}
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{project.descricao}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tecnologias.split(',').map((tech, i) => (
                    <span key={i} className="text-xs font-medium bg-gray-900 text-purple-400 px-3 py-1 rounded-full border border-purple-500/30">
                      {tech.trim()}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 border-t border-gray-700 pt-4">
                  {project.link_github && (
                    <a href={project.link_github} target="_blank" className="flex items-center text-gray-400 hover:text-white transition-colors text-sm">
                      <Github className="w-4 h-4 mr-1" /> Repo
                    </a>
                  )}
                  {project.link_demo && (
                    <a href={project.link_demo} target="_blank" className="flex items-center text-purple-400 hover:text-purple-300 transition-colors text-sm">
                      <ExternalLink className="w-4 h-4 mr-1" /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}