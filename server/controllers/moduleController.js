/**
 * Module Controller — Lógica de negócio para módulos.
 */

import { readData, writeData, findModule, generateId } from '../shared/dataStore.js'; 

/** GET /api/modules */
export function getAll(req, res) {
  const data = readData();
  res.json(data.modules);
}

/** GET /api/modules/:id */
export function getById(req, res) {
  const data = readData();
  const index = data.modules.findIndex(m => String(m.id) === String(req.params.id));
  const module = data.modules[index];

  if (module) {
    // Ordenar módulos para calcular prev/next
    const sortedModules = [...data.modules].sort((a, b) => (a.order || 0) - (b.order || 0));
    const sortedIndex = sortedModules.findIndex(m => String(m.id) === String(module.id));

    const enrichedModule = {
      ...module,
      stageName: module.stageName || `Etapa ${module.order || sortedIndex + 1}`,
      stageOrder: module.order || sortedIndex + 1,
      prevModuleId: sortedIndex > 0 ? sortedModules[sortedIndex - 1].id : null,
      nextModuleId: sortedIndex < sortedModules.length - 1 ? sortedModules[sortedIndex + 1].id : null,
    };

    res.json(enrichedModule);
  } else {
    res.status(404).json({ error: 'Module not found' });
  }
}

/** POST /api/modules */
export function create(req, res) {
  const data = readData();
  const newModule = { ...req.body };

  newModule.id = generateId(data.modules);
  data.modules.push(newModule);

  if (writeData(data)) {
    res.status(201).json(newModule);
  } else {
    res.status(500).json({ error: 'Failed to save module' });
  }
}

/** PUT /api/modules/:id */
export function update(req, res) {
  const { data, module, index } = findModule(req.params.id);

  if (!module) {
    return res.status(404).json({ error: 'Module not found' });
  }

  const updatedModule = { ...req.body, id: module.id };
  data.modules[index] = updatedModule;

  if (writeData(data)) {
    res.json(updatedModule);
  } else {
    res.status(500).json({ error: 'Failed to update module' });
  }
}

/** DELETE /api/modules/:id */
export function remove(req, res) {
  const { data, module, index } = findModule(req.params.id);

  if (!module) {
    return res.status(404).json({ error: 'Module not found' });
  }

  data.modules.splice(index, 1);

  if (writeData(data)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to delete module' });
  }
}
