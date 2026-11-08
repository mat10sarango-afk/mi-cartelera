// Hook PostToolUse: formatea con Prettier el archivo que Claude Code acaba de crear o editar.
// Solo formatea archivos de código. Nunca bloquea: ante cualquier error termina con código 0.
const fs = require('node:fs');
const path = require('node:path');

const EXTENSIONES = new Set(['.ts', '.tsx', '.js', '.json', '.css']);

async function main() {
  const entrada = JSON.parse(fs.readFileSync(0, 'utf8'));
  const archivo = entrada?.tool_input?.file_path;
  if (typeof archivo !== 'string') return;
  if (!EXTENSIONES.has(path.extname(archivo).toLowerCase())) return;

  // Usa el Prettier instalado en el proyecto, no uno global
  const raiz = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const prettier = require(require.resolve('prettier', { paths: [raiz] }));

  const config = (await prettier.resolveConfig(archivo)) ?? {};
  const original = fs.readFileSync(archivo, 'utf8');
  const formateado = await prettier.format(original, { ...config, filepath: archivo });
  if (formateado !== original) fs.writeFileSync(archivo, formateado);
}

main()
  .catch(() => {})
  .finally(() => process.exit(0));
