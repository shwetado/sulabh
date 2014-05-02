var geoSpatialRepository = {};
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/sulabh');

var Schema = mongoose.Schema;

var LocationSchema = new Schema({
    name: String,
    coordinates: [Number, Number],
    rating: {
        sumOfRatings: Number,
        numOfRatings: Number
    },
    operational: Boolean,
    hygienic: Boolean,
    free: Boolean,
    type: String,
    suitableFor: [String, String, String, String, String]
}, { versionKey: false });

var LocationModel = mongoose.model('locations', LocationSchema);

geoSpatialRepository.findAll = function(callBack) {
    LocationModel.find({}).exec(callBack);
}

geoSpatialRepository.find = function(latitude, longitude, radius, callBack) {
    var miles = radius * 0.62137;
    LocationModel.find({
        coordinates:{
            $geoWithin:{
                $centerSphere:
                    [[latitude,longitude], miles/3959]
            }
        }
    }).exec(callBack);
}

geoSpatialRepository.save = function (params) {
    var data = {
        "name": params.name,
        "coordinates": [params.coordinates[0], params.coordinates[1]],
        "rating": {
            "sumOfRatings": params.rating,
            "numOfRatings": 1
        },
        "operational": params.operational,
        "hygienic": params.hygienic,
        "free": params.free,
        "type": params.type,
        "suitableFor": params.suitableFor
    }
    var location = new LocationModel(data);
    location.save(function (error, data) {});
}

geoSpatialRepository.remove = function(){
    LocationModel.remove({},function(){});
}

geoSpatialRepository.update = function(params){
    var callBack = function (err, location) {
        var updatedData = {
            "name": params.name,
            "coordinates": [params.coordinates[0], params.coordinates[1]],
            "rating": {
                "sumOfRatings":((parseInt(location.rating.sumOfRatings) + parseInt(params.rating))),
                "numOfRatings": (location.rating.numOfRatings + 1)
            },
            "operational": params.operational,
            "hygienic": params.hygienic,
            "free": params.free,
            "type": params.type,
            "suitableFor": params.suitableFor
        }
        LocationModel.update( { _id: location._id} , updatedData, function(err, data){});
    }
    LocationModel.findOne({coordinates: [params.coordinates[0], params.coordinates[1]]}, function(err, doc) {}).exec(callBack);
}

exports.LocationModel = LocationModel;
exports.geoSpatialRepository = geoSpatialRepository;