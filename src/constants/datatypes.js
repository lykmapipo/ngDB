(function() {
    'use strict';

    /**
     * @ngdoc constant
     * @name ngDataTypes
     * @description common data types that can be used in WebSQL and SQLite
     *              and their corresponding JS types.
     */
    angular
        .module('ngData')
        .constant('DataTypes', {
            //map for JS to SQL data types

            //string datatypes
            'String': 'TEXT',

            //integer data types
            'Boolean': 'INTEGER',

            //real data types
            'Number': 'REAL',

            //text data types
            'Date': 'TEXT',

            'Object': 'TEXT',
            'Function': 'TEXT',
            'Array': 'TEXT',
            'Int8Array': 'TEXT',
            'Uint8Array': 'TEXT',
            'Uint8ClampedArray': 'TEXT',
            'Int16Array': 'TEXT',
            'Uint16Array': 'TEXT',
            'Int32Array': 'TEXT',
            'Uint32Array': 'TEXT',
            'Float32Array': 'TEXT',
            'Float64Array': 'TEXT',

            'Blob': 'BLOB'

            //if data type is missed default to TEXT
        });
}());
