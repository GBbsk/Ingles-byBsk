/**
 * DataStore — Camada de acesso a dados (Model).
 * 
 * Responsável por ler e escrever no arquivo JSON que funciona
 * como banco de dados local. Usado tanto pelo servidor Express (dev)
 * quanto pelas Serverless Functions da Vercel (produção).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ---------- Resolução de Caminhos ----------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Resolve o caminho do ModuleData.json tentando múltiplas localizações
 * para funcionar tanto em dev local quanto no runtime da Vercel.
 */
function resolveDataFilePath() {
  const candidates = [
    path.resolve(__dirname, '..', '..', 'src', 'data', 'ModuleData.json'),
    path.resolve(process.cwd(), 'src', 'data', 'ModuleData.json'),
    path.resolve('/var/task', 'src', 'data', 'ModuleData.json'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  console.error('[DataStore] ModuleData.json não encontrado. Caminhos tentados:', candidates);
  return candidates[0]; // Fallback
}

const DATA_FILE_PATH = resolveDataFilePath();

// ---------- Leitura / Escrita ----------

const DEFAULT_DATA = {
  modules: [],
  admin: { username: 'admin', password: 'admin123' },
};

/**
 * Lê o arquivo JSON e retorna os dados parseados.
 * Em caso de erro, retorna a estrutura padrão.
 */
export function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('[DataStore] Erro ao ler dados:', error.message);
    return { ...DEFAULT_DATA };
  }
}

/**
 * Escreve dados no arquivo JSON.
 * @returns {boolean} true se gravou com sucesso
 */
export function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('[DataStore] Erro ao gravar dados:', error.message);
    return false;
  }
}

// ---------- Helpers de Busca ----------

/**
 * Encontra um módulo pelo ID.
 * @returns {{ module: object|null, index: number }}
 */
export function findModule(moduleId) {
  const data = readData();
  const id = parseInt(moduleId, 10);
  const index = data.modules.findIndex((m) => m.id === id);
  return {
    data,
    module: index !== -1 ? data.modules[index] : null,
    index,
  };
}

/**
 * Encontra uma aula dentro de um módulo.
 * @returns {{ module, lesson, moduleIndex, lessonIndex, data }}
 */
export function findLesson(moduleId, lessonId) {
  const { data, module, index: moduleIndex } = findModule(moduleId);
  if (!module) {
    return { data, module: null, lesson: null, moduleIndex: -1, lessonIndex: -1 };
  }

  const lid = parseInt(lessonId, 10);
  const lessons = module.lessons || [];
  const lessonIndex = lessons.findIndex((l) => l.id === lid);

  return {
    data,
    module,
    lesson: lessonIndex !== -1 ? lessons[lessonIndex] : null,
    moduleIndex,
    lessonIndex,
  };
}

/**
 * Gera um novo ID baseado no maior ID existente em um array de objetos.
 * @param {Array} items - Array de objetos com propriedade `id`
 * @param {number} [floor=0] - Valor mínimo do ID
 * @returns {number}
 */
export function generateId(items, floor = 0) {
  if (!items || items.length === 0) return floor + 1;
  const maxId = items.reduce((max, item) => Math.max(max, item.id || 0), floor);
  return maxId + 1;
}
