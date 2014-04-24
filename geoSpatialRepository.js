var geoSpatialRepository = {};
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/sulabh');

var Schema = mongoose.Schema;

var LocationSchema = new Schema({
    name: String,
    coordinates: [Number, Number],
    rating: Number,
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

geoSpatialRepository.save = function (data) {
    var location = new LocationModel(data);
    location.save(function (error, data) {});
}

geoSpatialRepository.remove = function(){
    LocationModel.remove({},function(){});
}

geoSpatialRepository.update = function(data){
    var callBack = function (err, location) {
        LocationModel.update( { _id: location._id} , data, function(err, data){});
    }
    LocationModel.findOne({coordinates: [data.coordinates[0], data.coordinates[1]]}, function(err, doc) {ø}).exec(callBack);
}

exports.LocationModel = LocationModel;
exports.geoSpatialRepository = geoSpatialRepository;