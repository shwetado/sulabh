var geoSpatialRepository = {};
var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:u-A9ee4gIvrf@$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGOBD_DB_PORT/');

// Set up our DB API globals.
var Db         = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server     = require('mongodb').Server;
var BSON       = require('mongodb').BSON;
var ObjectID   = require('mongodb').ObjectID;

// Main DB provider object
geoSpatialRepository = function(host, port, user, pass) {
    this.db = new Db(process.env.OPENSHIFT_APP_NAME, new Server(host, port, { auto_reconnect: true }, {}));
    this.db.open(function(error, db){
        db.authenticate(user, pass, function(error, result) {});
    });
};


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

geoSpatialRepository.prototype.findAll = function(callBack) {
    LocationModel.find({}).exec(callBack);
}

geoSpatialRepository.prototype.find = function(latitude, longitude, radius, callBack) {
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

geoSpatialRepository.prototype.save = function (data) {
    var location = new LocationModel(data);
    location.save(function (error, data) {});
}

geoSpatialRepository.prototype.remove = function(){
    LocationModel.remove({},function(){});
}

geoSpatialRepository.prototype.update = function(data){
    var callBack = function (err, location) {
        LocationModel.update( { _id: location._id} , data, function(err, data){});
    }
    LocationModel.findOne({coordinates: [data.coordinates[0], data.coordinates[1]]}, function(err, doc) {ø}).exec(callBack);
}

exports.LocationModel = LocationModel;
exports.geoSpatialRepository = geoSpatialRepository;