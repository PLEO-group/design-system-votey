import {VoteyIllustrationRegistryEntries} from '../../angular/src/lib/votey-assets';

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

const illustrationRegistryByReactName = new Map(
    VoteyIllustrationRegistryEntries.map((entry) => {
        const relativePath = entry.path.replace(/^illustrations\//, '');
        const fileName = relativePath.substring(relativePath.lastIndexOf('/') + 1);
        const fileStem = fileName.replace('.svg', '');
        const category = relativePath.substring(0, relativePath.lastIndexOf('/'));
        const reactName = toPascalCase(fileStem);

        return [
            `${category}/${reactName}`,
            {
                angularRegistryName: entry.name,
                fileName,
                reactName,
            },
        ];
    })
);

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

const loadIllustrationAssets = () => {
    const assets = [];
    const rootPath = '../../dist/assets/react/illustrations/';
    const startIndex = rootPath.length;

    for (const path in illustrationModules) {
        const componentModule = illustrationModules[path];
        const relativePath = path.substring(startIndex).replace(/\\/g, '/');
        const fileName = relativePath.substring(relativePath.lastIndexOf('/') + 1);
        const name = fileName.replace('.tsx', '');
        const categoryPath = relativePath.substring(0, relativePath.lastIndexOf('/'));
        const publicNames = illustrationRegistryByReactName.get(
            `${categoryPath}/${name}`
        );

        if (!publicNames) {
            throw new Error(
                `Missing Angular Registry entry for illustration "${relativePath}".`
            );
        }

        assets.push({
            ...publicNames,
            name,
            category: categoryPath,
            type: 'illustration',
            Component: componentModule.default,
        });
    }
    return assets;
};

export const getIconList = () => loadIconAssets();
export const getIllustrationList = () => loadIllustrationAssets();
