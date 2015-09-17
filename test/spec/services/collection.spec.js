'use strict';

describe('ngData:Collection', function() {

    beforeEach(module('ngData'));

    describe('Collection#new', function() {

        it('should be able to instantiate new model instance', inject(function($ngData) {
            var User = $ngData.model('Customer', {
                properties: {
                    name: {
                        type: String,
                        defaultsTo: faker.name.firstName()
                    },
                    code: {
                        type: String
                    }
                }
            });


            expect(User.new).to.exist;
            var user = User.new();
            expect(user).to.exist;

            expect(user).to.have.ownProperty('name');
            expect(user).to.have.ownProperty('code');

        }));

        it('should be able to instantiate new model instance with data', inject(function($ngData) {
            var User = $ngData.model('Customer', {
                properties: {
                    name: {
                        type: String,
                        defaultsTo: faker.name.findName()
                    },
                    code: {
                        type: String
                    }
                }
            });

            var _user = {
                name: faker.name.findName(),
                code: faker.random.uuid()
            };


            expect(User.new).to.exist;
            var user = User.new(_user);

            expect(user.name).to.be.equal(_user.name);
            expect(user.code).to.be.equal(_user.code);

        }));

    });

    it('should be able to create a new record and save it into the database');

    it('should be able to update the record in the database without returning them');

    it('should be able to remove the selected record from collection');

});