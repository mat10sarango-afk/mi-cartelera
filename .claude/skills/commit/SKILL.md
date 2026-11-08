---
name: commit
description: Crea un commit en formato Conventional Commits y en español a partir de los cambios en staging; úsala cuando quieras confirmar lo que ya agregaste con git add.
disable-model-invocation: true
---

# Commit

1. Lee los cambios en staging con `git diff --staged`.
2. Si no hay nada en staging, avisa al usuario y detente. Nunca hagas `git add` por tu cuenta.
3. Si los cambios incluyen `.env`, `.env.local` o algo que parezca una clave (tokens, `service_role`, API keys de TMDB, contraseñas, cadenas largas o JWT), detente y avisa al usuario sin hacer el commit.
4. Escribe el mensaje en formato Conventional Commits con uno de estos tipos: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`. Debe estar en español y tener como máximo 72 caracteres (ejemplo: `docs: agregar estado inicial del proyecto`).
5. Si los cambios implementan un ticket del backlog, incluye su id en el mensaje (ejemplo: `feat: T-03 funcion pura de cabe`). Un commit corresponde a un solo ticket.
6. Muestra el mensaje al usuario y haz el commit con `git commit -m "<mensaje>"`. Nunca hagas `git push`.
