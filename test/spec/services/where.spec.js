'use strict';

describe('$where', function() {

    beforeEach(module('ngData'));


    it('should be injectable', inject(function($where) {

        var builder = $where;

        expect(builder).to.exists;
    }));

    it('should be able to build expression given  plain condition object and sql expression',
        inject(function($where, SQL) {
            var condition = {
                name: 'john',
                age: 20
            };

            /*jshint quotmark:double*/
            expect($where(condition, SQL.expr()).toString())
                .to.equal("name = 'john' AND age = 20");
        }));

    it('should be able to build expression given  plain condition object',
        inject(function($where) {
            var condition = {
                name: 'john',
                age: 20
            };

            /*jshint quotmark:double*/
            expect($where(condition).toString())
                .to.equal("name = 'john' AND age = 20");
        }));

    it('should be able to build expression given conditions $gt,$gte,$lt,$in the condition object',
        inject(function($where) {
            var condition = {
                age: {
                    $gt: 20
                },
                name: 'john',
                height: {
                    $gte: 206
                },
                weight: {
                    $lt: 60
                },
                lives: {
                    $in: ['arusha', 'mbeya', 'iringa']
                }
            };
            /*jshint quotmark:double*/
            expect($where(condition).toString()).to
                .be.equal("age > 20 AND name = 'john' AND height >= 206 AND weight < 60 AND lives IN ('arusha','mbeya','iringa')");
        }));

    it('should be able to build expression given $or as a condition joiner', inject(function($where) {

        var condition = {
            $or: [{
                age: {
                    $gt: 20
                }
            }, {
                name: 'john'
            }, {
                height: {
                    $gte: 206
                }
            }, {
                weight: {
                    $lt: 60
                }
            }, {
                lives: {
                    $in: ['arusha', 'mbeya', 'iringa']
                }
            }]
        };

        /*jshint quotmark:double*/
        expect($where(condition).toString()).to.equal("age > 20 OR name = 'john' OR height >= 206 OR weight < 60 OR lives IN ('arusha','mbeya','iringa')");
    }));

    it('should be able to build expression when $and is given as condition joiner', inject(function($where) {
        var condition = {
            $and: [{
                age: {
                    $gt: 20
                }
            }, {
                name: 'john'
            }, {
                height: {
                    $gte: 206
                }
            }, {
                weight: {
                    $lt: 60
                }
            }, {
                lives: {
                    $in: ['arusha', 'mbeya', 'iringa']
                }
            }]
        };

        /*jshint quotmark:double*/
        expect($where(condition).toString()).to.equal("age > 20 AND name = 'john' AND height >= 206 AND weight < 60 AND lives IN ('arusha','mbeya','iringa')");
    }));

    it('should be able to build expression joined when given $or joiner and  $eq conditions outside the $or joiner', inject(function($where) {
        var condition = {
            $or: [{
                age: {
                    $gt: 20
                }
            }, {
                name: 'john'
            }],
            height: {
                $eq: 200
            },
            gender: {
                $eq: 'M'
            }
        };

        /*jshint quotmark:double*/
        expect($where(condition).toString()).to.equal("(age > 20 OR name = 'john') AND height = 200 AND gender = 'M'");
    }));

    it('should be able to build expression given joiner and other conditions outside the joiner', inject(function($where) {
        var condition = {
            $or: [{
                age: {
                    $gt: 20
                }
            }, {
                name: 'john'
            }],
            height: 200,
            gender: 'M'
        };

        /*jshint quotmark:double*/
        expect($where(condition).toString()).to.equal("(age > 20 OR name = 'john') AND height = 200 AND gender = 'M'");
    }));

    it('should be able to build and expression given three joiners', inject(function($where) {
        var condition = {
            $and: [{
                $or: [{
                    age: {
                        $gt: 20
                    }
                }, {
                    name: 'john'
                }]
            }, {
                $or: [{
                    height: 200
                }, {
                    gender: 'M'
                }]
            }]
        };

        /*jshint quotmark:double*/
        expect($where(condition).toString()).to.equal("(age > 20 OR name = 'john') AND (height = 200 OR gender = 'M')");
    }));

    it('should be able to build and expression given three joiners', inject(function($where) {
        var condition = {
            $or: [{
                $and: [{
                    age: {
                        $gt: 20
                    }
                }, {
                    name: 'john'
                }]
            }, {
                $and: [{
                    height: 200
                }, {
                    gender: 'M'
                }]
            }]
        };

        /*jshint quotmark:double*/
        expect($where(condition).toString()).to.equal("(age > 20 AND name = 'john') OR (height = 200 AND gender = 'M')");
    }));


    it('should be able to build and expression when given a plain object inside outer joiner', inject(function($where) {
        var condition = {
            $or: [{
                $and: [{
                    age: {
                        $gt: 20
                    }
                }, {
                    name: 'john'
                }]
            }, {
                $and: [{
                    height: 200
                }, {
                    gender: 'M'
                }]
            }, {
                weight: 20
            }]
        };

        /*jshint quotmark:double*/
        expect($where(condition).toString()).to.equal("(age > 20 AND name = 'john') OR (height = 200 AND gender = 'M') OR weight = 20");
    }));

});
