# DevShowcase

**Plataforma de Portfólio para Desenvolvedores**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org/)
[![PHP](https://img.shields.io/badge/PHP-7.4-777BB4?logo=php)](https://php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-5.7-4479A1?logo=mysql)](https://www.mysql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Aplicação full-stack para desenvolvedores exibirem seus projetos profissionalmente. Interface pública com grid de projetos em cards e painel administrativo para CRUD completo.

### Funcionalidades

- Listagem pública de projetos com cards, tags e badges de destaque
- Dashboard admin com estatísticas e CRUD completo
- Controle de status (ativo/inativo)

### Como usar

```bash
git clone https://github.com/VGameleira/devshowcase.git
cd devshowcase
# Frontend
cd frontend && npm install && npm run dev
# Backend
mysql -u root -p < backend/db.sql
cd backend && php -S localhost:8000
```

---

MIT License — Veja [LICENSE](LICENSE).

**Vinícius dos Santos Gameleira** — [@VGameleira](https://github.com/VGameleira)
