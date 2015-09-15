/**
 * @description Simple WEBSQL and cordova SQLITE ORM for ionic and angular applications
 * @version v0.1.0 - Tue Sep 08 2015 18:10:26
 * @link https://github.com/lykmapipo/ngData
 * @authors lykmapipo <lallyelias87@gmail.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name ngData
     * @description Simple WEBSQL and cordova SQLITE ORM 
     *              for ionic and angular applications
     */
    angular
        .module('ngData', [
            'ngCordova'
        ]);

}());

(function() {
    'use strict';

    /**
     * @ngdoc constant
     * @name ngDataTypes
     * @description provide common datatypes that can be used in WEBSQL and SQLITE
     *              databases. 
     */
    angular
        .module('ngData')
        .constant('DataTypes', {
            //borrowed from
            //https://github.com/AndrewJo/sails-sqlite3/blob/master/lib/utils.js#L232
            'string': 'TEXT',
            'text': 'TEXT',

            //integer data types
            'boolean': 'INTEGER',
            'int': 'INTEGER',
            'integer': 'INTEGER',

            //real data types
            'number': 'REAL',
            'float': 'REAL',
            'double': 'REAL',

            //text data types
            'date': 'TEXT',
            'datetime': 'TEXT',

            'object': 'TEXT',
            'json': 'TEXT',
            'array': 'TEXT',

            'binary': 'BLOB',
            'bytea': 'BLOB'

            //if data type is missed default to TEXT
        });
}());

(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name $database
     * @description database connection manager and provider
     */
    angular
        .module('ngData')
        .provider('$database', function() {
            /*jshint validthis:true*/
            var self = this;

            //database properties
            self.name = 'db';
            self.description = 'Database';
            self.version = '1.0.0';
            self.size = 4 * 1024 * 1024;

            //database connection reference
            self.connection = null;


            //provider implementation
            self.$get = ['$q', '$cordovaSQLite', function($q, $cordovaSQLite) {
                var DB = {};

                //connection magic getter and setter
                Object.defineProperty(DB, 'connection', {
                    get: function() {
                        return self.connection;
                    },
                    set: function(connection) {
                        self.connection = connection;
                    }
                });

                /**
                 * @description initialize database connection
                 * @return {Object} database connection
                 */
                DB.connect = function() {
                    //check if there is
                    //exsting database connection
                    if (self.connection) {
                        return;
                    }

                    //try to open SQLite database connection if we running
                    //on mobile device
                    if (window.cordova) {
                        self.connection = $cordovaSQLite.openDB({
                            name: self.name + '.db',
                            description: self.description,
                            version: self.version
                                // size: self.size
                        });
                    }

                    //otherwise open WebSQL database connection
                    else {
                        self.connection =
                            window.openDatabase(
                                self.name, self.version,
                                self.description, self.size
                            );
                    }
                };


                /**
                 * @description execute the given query
                 * @param  {String} query    SQL query to execute
                 * @param  {Object} bindings query bindings
                 * @return {Promise}         a promise that will resolve with the
                 *                             result of executed query
                 */
                DB.query = function(query, bindings) {
                    //ensure database connection exists
                    DB.connect();

                    return $cordovaSQLite
                        .execute(self.connection, query, bindings);
                };

                //export database
                return DB;
            }];
            /*jshint validthis:false*/
        });
}());


(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name Query
     * @description query builder based on squel
     * @see https://hiddentao.github.io/squel/
     */
    angular
        .module('ngData')
        .factory('Query', ['$database', function($database) {
            //create a local copy of squel
            //by cloning/copying a global squel
            var query = angular.copy(squel);

            //extend insert queries with `values(Array|Object)` builder
            query.cls.Insert.prototype.values = function(values) {
                //this refer to insert query context
                if (angular.isArray(values)) {
                    this.setFieldsRows(values);
                } else {
                    this.setFields(values);
                }
                return this;
            };

            //extending local squel with then executor
            query.cls.QueryBuilder.prototype.then = function( /*resolve, reject*/ ) {
                var self = this;

                var promise = $database.query(self.toString(), undefined).then();
                promise = promise.then.apply(promise, arguments);
                return promise;
            };

            //extending local squel with catch executor
            query.cls.QueryBuilder.prototype.catch = function( /*reject*/ ) {
                var promise = this.then();
                promise = promise.catch.apply(promise, arguments);
                return promise;
            };

            //export squel query builder
            return query;
        }]);
}());