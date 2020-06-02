import { store } from './store';
import { structure } from './structure';
import { DECORATOR_TYPES } from './decorators/createDecorator';

export const findPath = (Model: any, sourcePath: string, targetPath?: string) => {
  if (/^[\[\d\]]/.test(sourcePath)) {
    const [match] = sourcePath.match(/^(\[\d\])+\.?/);

    sourcePath = sourcePath.replace(match, '');
    targetPath = (targetPath || '') + match;
  }

  const { sourceKey, targetKey, handlers } = findEntity(Model, sourcePath);

  // console.log('sourceKey', sourceKey);
  // console.log('targetKey', targetKey);

  if (!targetKey) {
    return targetPath;
  }

  const [match] = sourcePath.match(new RegExp(`^${sourceKey}\\.?`));

  sourcePath = sourcePath.replace(match, '');
  targetPath = (targetPath || '') + match.replace(sourceKey, targetKey);

  // console.log('sourcePath', sourcePath);
  // console.log('targetPath', targetPath);

  const handler = handlers.find(({ type, options: [Constructor] }) => (
    type === DECORATOR_TYPES.TYPE ||
    store.has(Constructor)
  ));

  if (handler && sourcePath) {
    const { options: [Constructor] } = handler;

    return findPath(Constructor, sourcePath, targetPath);
  }

  return targetPath;
};

const findEntity = (Model: any, sourcePath: string) => {
  const { props } = store.get(Model);

  const sourceKeys = structure.parsePath(sourcePath);

  let sourceKey = '';

  // console.log('sourcePath', sourcePath);

  for (const key of sourceKeys) {
    const sourceKeyEsc = sourceKey.replace(/[\[\]]/g, match => '\\' + match);
    const [match] = sourcePath.match(new RegExp(`^${sourceKeyEsc}[\\.\\[]?${key}[\\]]?`));

    sourceKey = match;

    const entity = Object.entries(props).find(([key, { name }]) => name === sourceKey);

    if (entity) {
      const [targetKey, { handlers }] = entity;

      // console.log('sourceKey', sourceKey);

      return { sourceKey, targetKey, handlers };
    }
  }
};
