var assert = require("assert");

var locationsRepository = require("../geoSpatialRepository.js").geoSpatialRepository;
var LocationModel = require("../geoSpatialRepository.js").LocationModel;

var chai = require("chai"),
	should = chai.should(),
	expect = chai.expect,
	assert = chai.assert;

describe("finding one location from the database", function(){
    //setup
    var actual = {
        "name":"point",
        "coordinates":[20,20]
    };

    before(function(){
        locationsRepository.remove();
        locationsRepository.save(actual);
    });

    var expected = [actual];

    it("should find the data present in location repository", function() {
        //call
        locationsRepository.findAll(function(error, data) {
            //assertion
            expect(data.coordinates).deep.equals(expected.coordinates);
            expect(data.name).deep.equals(expected.name);
        });
    });
});

describe("finding multiple locations from database", function(){
    var data1 = {
        "name":"point",
        "coordinates":[20,20]
    };
    var data2 = {
        "name":"point",
        "coordinates":[42,72]
    };

    var expected = [data1,data2];

    before(function(){
        locationsRepository.remove();
        locationsRepository.save(data1);
        locationsRepository.save(data2);
    });

    it("should find the data present in location repository", function() {
            //call
        locationsRepository.findAll(function(error, data) {
            //assertion
            for(var i=0;i<data.length;i++){
                for(var j=0;j<data[i].coordinates;j++)
                    expect(data[i][j].coordinates).eql(expected[i][j].coordinates);
                expect(data[i].name).eql(expected[i].name);
            }
        });
    });
});

describe("finding locations within a particular radius", function(){

    //setup
    var actual = {
        "name":"point",
        "coordinates":[18.533333,73.866667]
    };

    before(function(){
        locationsRepository.remove();
        locationsRepository.save(actual);
    });

    var expected = [actual];

    var latitude = 18.527743700000000000;
    var longitude = 73.853300699999980000;
    var radius = 1.5;

    it("should give locations around 1.5km radius", function() {
        // call
        locationsRepository.find(latitude, longitude, radius, function(error, data) {
            // assertion
            expect(data.length).to.not.equal(0);
            for(var i=0;i<data.length;i++){
                for(var j=0;j < data[i].coordinates;j++)
                    expect(data[i][j].coordinates).eql(expected[i][j].coordinates);
                expect(data[i].name).eql(expected[i].name);
            }
        });
    });
});

describe("finding locations within a particular radius", function(){

    //setup
    var actual = {
        "name":"point",
        "coordinates":[18.533333,73.866667]
    };

    before(function(){
        locationsRepository.remove();
        locationsRepository.save(actual);
    });

    var expected = [actual];

    var latitude = 18.527743700000000000;
    var longitude = 73.853300699999980000;
    var radius = 1;

    it("should not give locations around 1km radius when not present", function() {
        // call
        locationsRepository.find(latitude, longitude, radius, function(error, data) {
            // assertion
            for(var i=0;i<data.length;i++){
                for(var j=0;j < data[i].coordinates;j++)
                    expect(data[i][j].coordinates).eql(expected[i][j].coordinates);
                expect(data[i].name).eql(expected[i].name);
            }
            expect(data.length).to.equal(0);
        });
    });
});

describe("updating a particular loo when already present", function(){
    // setup
    var oldLoo = {
        "name": "name",
        "coordinates": [50.00, 70.00],
        "rating": 4,
        "operational": true,
        "hygienic": true,
        "free": false,
        "type": "Western",
        "suitableFor": ["Men"]
    };

    before(function(){
        locationsRepository.remove();
        locationsRepository.save(oldLoo);
    });

    var newLoo = {
        "name": "newName",
        "coordinates": [50.00, 70.00],
        "rating": 4,
        "operational": true,
        "hygienic": true,
        "free": false,
        "type": "Indian",
        "suitableFor": ["Men"]
    };

    it("should update the given loo", function(){
        // call
        locationsRepository.update(newLoo);

        var callBack = function(error, data){
            for(var i=0;i<data.length;i++)
                // assert
                expect(data.name).to.equal(newLoo.name);
        }

        LocationModel.findOne({coordinates: [oldLoo.coordinates[0], oldLoo.coordinates[1]]}, 
            function(err, doc) {}).exec(callBack);
    })
})