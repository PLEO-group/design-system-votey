const illustrationModules = import.meta.glob('../../dist/assets/react/illustrations/**/*.tsx', {eager: true});
const iconSourceModules = import.meta.glob('../../assets/icons/**/*.svg', {
    eager: true,
    import: 'default',
    query: '?raw',
});

const toPascalCase = (value) => value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`)
    .join('');

const scopeSvgIds = (svg, scope) => {
    const ids = [...svg.matchAll(/\sid="([^"]+)"/g)]
        .map((match) => match[1]);

    return ids.reduce((scopedSvg, id) => {
        const scopedId = `${scope}-${id}`;

        return scopedSvg
            .replaceAll(`id="${id}"`, `id="${scopedId}"`)
            .replaceAll(`url(#${id})`, `url(#${scopedId})`)
            .replaceAll(`href="#${id}"`, `href="#${scopedId}"`);
    }, svg);
};

const loadIconAssets = () => Object.entries(iconSourceModules).map(([path, svg]) => {
    const relativePath = path
        .substring('../../assets/icons/'.length)
        .replace(/\\/g, '/');
    const fileName = path.substring(path.lastIndexOf('/') + 1);
    const fileStem = fileName.replace('.svg', '');
    const generatedName = toPascalCase(fileStem);
    const reactName = generatedName.startsWith('Icon')
        ? generatedName
        : `Icon${generatedName}`;

    return {
        angularRegistryName: fileStem
            .replace(/^icon_/, '')
            .replaceAll('_', '-')
            .replace(/-+/g, '-')
            .toLowerCase(),
        category: relativePath.substring(0, relativePath.lastIndexOf('/')),
        fileName,
        name: reactName,
        reactName,
        svg: scopeSvgIds(svg, fileStem),
        type: 'icon',
    };
});

const loadAssets = (modules, rootPath, type) => {
    const assets = [];
    const startIndex = rootPath.length;

    for (const path in modules) {
        const componentModule = modules[path];
        const relativePath = path.substring(startIndex).replace(/\\/g, '/');
        const fileName = relativePath.substring(relativePath.lastIndexOf('/') + 1);
        const name = fileName.replace('.tsx', '');
        const categoryPath = relativePath.substring(0, relativePath.lastIndexOf('/'));

        assets.push({
            name: name,
            category: categoryPath,
            type: type,
            Component: componentModule.default,
        });
    }
    return assets;
};

export const getIconList = () => loadIconAssets();
export const getIllustrationList = () => loadAssets(
    illustrationModules,
    '../../dist/assets/react/illustrations/',
    'illustration'
)
