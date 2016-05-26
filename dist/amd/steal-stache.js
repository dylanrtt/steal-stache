/*steal-stache@3.0.0-pre.1#steal-stache*/
define(function (require, exports, module) {
    'format cjs';
    var getIntermediateAndImports = require('can-stache/src/intermediate_and_imports');
    var addBundles = require('./add-bundles');
    function template(imports, intermediate) {
        imports = JSON.stringify(imports);
        intermediate = JSON.stringify(intermediate);
        return 'define(' + imports + ',function(module, stache, mustacheCore){\n' + '\tvar renderer = stache(' + intermediate + ');\n' + '\treturn function(scope, options, nodeList){\n' + '\t\tvar moduleOptions = { module: module };\n' + '\t\tif(!(options instanceof mustacheCore.Options)) {\n' + '\t\t\toptions = new mustacheCore.Options(options || {});\n' + '\t\t}\n' + '\t\treturn renderer(scope, options.add(moduleOptions), nodeList);\n' + '\t};\n' + '});';
    }
    function translate(load) {
        var intermediateAndImports = getIntermediateAndImports(load.source);
        var commonDependencies = Promise.all([
            this.normalize('can-view-import', module.id),
            this.normalize('can-stache-bindings', module.id)
        ]);
        return Promise.all([
            addBundles(intermediateAndImports.dynamicImports, load.name),
            commonDependencies
        ]).then(function (results) {
            var imports = results[1];
            intermediateAndImports.imports.unshift.apply(intermediateAndImports.imports, imports);
            intermediateAndImports.imports.unshift('can-stache/src/mustache_core');
            intermediateAndImports.imports.unshift('can-stache');
            intermediateAndImports.imports.unshift('module');
            return template(intermediateAndImports.imports, intermediateAndImports.intermediate);
        });
    }
    module.exports = { translate: translate };
});