'use strict';

describe('ngData:DataTypes', function() {

    // load the ngData module
    beforeEach(module('ngData'));

    it('should exists after being injected', inject(function(DataTypes) {
        expect(DataTypes).to.exist;
    }));

    it('should be able to map common JS data types to their respective SQL data types', inject(function(DataTypes) {
        expect(DataTypes.String).to.be.equal('TEXT');

        expect(DataTypes.Boolean).to.be.equal('INTEGER');

        expect(DataTypes.Number).to.be.equal('REAL');

        expect(DataTypes.Date).to.be.equal('TEXT');

        expect(DataTypes.Object).to.be.equal('TEXT');
        expect(DataTypes.Array).to.be.equal('TEXT');

        expect(DataTypes.Blob).to.be.equal('BLOB');

    }));

});
