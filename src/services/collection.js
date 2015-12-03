(function() {
    'use strict';

    /**
     * the documentation in this factory was borrowed from mongoose api
     */
    angular
        .module('ngData')
        .factory('Collection', function($q, inflector, Model, Query) {

            /**
             * @description Collection
             * @param {Object} options
             */
            function Collection(options) {
                this.name = options.name;

                this.tableName =
                    options.tableName ||
                    inflector.pluralize(options.name.toLowerCase());

                this.definition = options;
            }

            //table back this collection
            Collection.prototype.tableName;

            //name of collection
            Collection.prototype.name;

            //model definition
            Collection.prototype.definition;


            /**
             * @description initialize new model without persist it
             * @return {Object}      new model instance
             */
            Collection.prototype.new = function(data) {
                //instantiate new model
                var model = new Model(this.definition.properties);

                //set data
                if (data && _.isPlainObject(data)) {
                    _.forEach(data, function(value, key) {
                        if (_.has(model, key)) {
                            model[key] = value;
                        }
                    });
                }

                //return model instance
                return model;
            };


            /**
             * @description Shortcut for creating a new Document that is
             *              automatically saved to the db if valid.
             * @param {(Object|Array)} doc
             * @param {Function} callback
             * @return {type}
             */
            Collection.prototype.create = function(doc) {

                var query = new Query({
                    collection: this,
                    type: 'insert'
                });

                //TODO return error if no doc provided

                //TODO batch create
                //execute creates in parallel

                //handle single create
                if (doc) {
                    query.sql.values(doc);
                }

                //TODO execute query
                //TODO fetch created model if primary key is auto increment

                //return model instance

                return query;
            };


            /**
             * @description Updates documents in the database without
             *              returning them.
             * @param  {Object}   conditions
             * @param  {Object}   doc
             * @param  {Object}   options
             * @param  {Function} callback
             */
            Collection.prototype.update = function(conditions, doc) {

                var query = new Query({
                    collection: this,
                    type: 'update'
                });

                //set updated values
                query.sql.sets(doc);


                //TODO build condition
                //TODO return update response after execution

                return query;
            };


            /**
             * @description removes documents from the collection.
             * @param  {[Object]}   conditions
             * @return {Promise} which resolve with collection of models instance
             *                         removed
             */
            Collection.prototype.remove = function(conditions) {

                var find = this.find(conditions);

                var remove = new Query({
                    collection: this,
                    type: 'delete'
                });

                if (conditions && _.isPlainObject(conditions)) {
                    remove = remove.where(conditions);
                }

                //find documents and then delete
                return find.then(function(instances) {
                    return remove.then(function( /*response*/ ) {
                        return instances;
                    });
                });

            };


            /**
             * @description find documents
             * @param  {Object}   conditions valid mongodb query object
             * @param  {[Array|String]}   projections optional fields to return
             * @return {Promise} which resolve with collection of models instance
             */
            Collection.prototype.find = function(conditions, projections) {

                var query = new Query({
                        collection: this
                    })
                    .find(conditions, projections)
                    .then(function(instances) {

                        //map instances to model
                        if (instances) {
                            instances = _.map(instances, function(instance) {
                                return new Model(instance);
                            });
                        }

                        return instances;
                    });

                return query;
            };

            return Collection;
        });
}());