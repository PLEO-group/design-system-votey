const iconModules = import.meta.glob('../../dist/assets/react/icons/**/*.tsx', {eager: true});
const illustrationModules = import.meta.glob('../../dist/assets/react/illustrations/**/*.tsx', {eager: true});

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

export const getIconList = () => loadAssets(
    iconModules,
    '../../dist/assets/react/icons/',
    'icon'
);
export const getIllustrationList = () => loadAssets(
    illustrationModules,
    '../../dist/assets/react/illustrations/',
    'illustration'
)
