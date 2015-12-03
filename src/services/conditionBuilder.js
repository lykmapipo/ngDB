(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name ngData.ConditionBuilder
     * @description build where conditions in ngData
     * @return {Function} condition builder function that is build the 
     * the sql condition expression and return it
     */

    angular
        .module('ngData')
        .factory('conditionBuilder', function(SQL) {

            var expression;

            /**
             * join the conditions in the given condition object based on the 
             * specified joiners in the condition object
             * @param  {Object} conditions
             */
            function _join(conditions) {
                // default expression joiner
                var joiner = 'and';
                // enclosing parenthes in order to obey algebra's laws
                var orEnclose = false;
                var andEnclose = false;

                if (_.has(conditions, '$and') || _.has(conditions, '$or')) {

                    _.forEach(conditions, function(value, key) {
                        if (key === '$and' || key === '$or') {
                            //iterate over the objects in the value array

                            if (_.has(conditions, '$and') && _.keysIn(conditions).length > 1) {
                                andEnclose = true;
                            }

                            if (_.has(conditions, '$or') && _.keysIn(conditions).length > 1) {
                                orEnclose = true;
                            }
                            /*jshint camelcase: false*/
                            if (orEnclose) {
                                expression.or_begin();
                            }

                            if (andEnclose) {
                                expression.and_begin();
                            }
                            /* jshint camelcase: true*/
                            _.forEach(value, function(val) {
                                //check if the inner objects are still joiners
                                if (_.has(val, '$and') || _.has(val, '$or')) {

                                    _.forEach(val, function(v, k) {
                                        if (k === '$and') {
                                            /*jshint camelcase: false*/
                                            expression.or_begin();
                                            /* jshint camelcase: true*/
                                            _.forEach(v, function(obj) {
                                                _buildSqlCondition(obj);
                                            });
                                            expression.end();

                                        } else if (k === '$or') {
                                            joiner = 'or';
                                            /*jshint camelcase: false*/
                                            expression.and_begin();
                                            /* jshint camelcase: true*/
                                            _.forEach(v, function(obj) {
                                                _buildSqlCondition(obj, joiner);
                                            });
                                            expression.end();
                                        } else {
                                            joiner = 'and';
                                            var conditionObject = {};
                                            conditionObject[k] = v;
                                            _buildSqlCondition(conditionObject, joiner);
                                        }
                                    });


                                } else if (key === '$or') {
                                    joiner = 'or';
                                    _buildSqlCondition(val, joiner);
                                } else {
                                    _buildSqlCondition(val);
                                }
                            });
                            // close the parenthes for the conditons
                            if (orEnclose || andEnclose) {
                                expression.end();
                            }

                        } else {
                            //harmonize primitive types to object
                            var conditionObject = {};
                            conditionObject[key] = value;
                            _buildSqlCondition(conditionObject);
                        }
                    });
                } else {
                    _buildSqlCondition(conditions);
                }
            }

            /**
             * build sql condition when given condition object and joiner
             * @param  {Object} conditionObject 
             * @param  {String} joiner          this is the join string that 
             *                                  will be used to join conditions
             */
            function _buildSqlCondition(conditionObject, joiner) {

                if (conditionObject && _.isPlainObject(conditionObject)) {

                    _.forEach(conditionObject, function(value, key) {
                        // check for primitive value and if it is an object 
                        // then we look inside for key value
                        if (_.isPlainObject(value)) {
                            _.forEach(value, function(val, condition) {
                                // initialize the values for IN condition
                                var values = '( ';
                                // initialize the variable for for loop
                                var i;

                                if (joiner === 'or') {
                                    if (condition === '$gt') {
                                        expression.or(key + ' > ' + val);
                                    } else if (condition === '$gte') {
                                        expression.or(key + ' >= ' + val);
                                    } else if (condition === '$lt') {
                                        expression.or(key + ' < ' + val);
                                    } else if (condition === '$lte') {
                                        expression.or(key + ' <= ' + val);
                                    } else if (condition === '$ne') {
                                        expression.or(key + ' <> ' + val);
                                    } else if (condition === '$eq') {
                                        expression.or(key + ' = ' + val);
                                    } else if (condition === '$in') {

                                        if (_.isArray(val)) {

                                            for (i = 0; i < val.length; i++) {

                                                if (i < val.length - 1) {
                                                    values +=
                                                        ('\"' + val[i] + '\"' + ',');
                                                } else {
                                                    values +=
                                                        ('\"' + val[i] + '\"' + ' )');
                                                }
                                            }
                                            expression.
                                            or(key + ' IN ' + values);
                                        }
                                    }

                                    // conditions for AND joiner
                                } else {
                                    if (condition === '$gt') {
                                        expression.and(key + ' > ' + val);
                                    } else if (condition === '$gte') {
                                        expression.and(key + ' >= ' + val);
                                    } else if (condition === '$lt') {
                                        expression.and(key + ' < ' + val);
                                    } else if (condition === '$lte') {
                                        expression.and(key + ' <= ' + val);
                                    } else if (condition === '$ne') {
                                        expression.and(key + ' <> ' + val);
                                    } else if (condition === '$eq') {
                                        expression.and(key + ' = ' + val);
                                    } else if (condition === '$in') {

                                        if (_.isArray(val)) {

                                            for (i = 0; i < val.length; i++) {

                                                if (i < val.length - 1) {
                                                    values +=
                                                        ('\"' + val[i] + '\"' + ',');
                                                } else {
                                                    values +=
                                                        ('\"' + val[i] + '\"' + ' )');
                                                }
                                            }
                                            expression.
                                            and(key + ' IN ' + values);
                                        }
                                    }

                                }

                            });
                            // for primitive values to object
                        } else {
                            if (joiner === 'or') {
                                expression.or(key + ' = ' + value);
                            } else {
                                expression.and(key + ' = ' + value);
                            }

                        }

                    });

                }
            }


            /**
             * [buildSqlExpression description]
             * @param  {[type]} conditions condition object specified in find or
             *                             where condition
             * @param  {[type]} sqlExpr    sql expression object
             * @return {Object}            SQL.expr() which will be used by find
             *                             and where condition to build the 
             *                             conditions
             */
            function buildSqlExpression(conditions, sqlExpr) {

                expression = sqlExpr || SQL.expr();

                _join(conditions);

                return expression;
            }


            return buildSqlExpression;
        });

}());
