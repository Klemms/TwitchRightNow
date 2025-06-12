const loadApp = () => {
    import('./main');
};

if (import.meta.env.VITE_REACT_DEVTOOLS === 'true') {
    // @ts-expect-error This package doesn't have any types
    import('react-devtools-core')
        .then((module) => {
            module.initialize();
            module.connectToDevTools({
                host: 'localhost',
                port: 8097,
                isAppActive: () => !!window.APP_READY,
            });
        })
        .finally(() => loadApp());
} else {
    loadApp();
}
