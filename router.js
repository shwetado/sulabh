// var journey = require('journey');
// var router = new(journey.Router);
var geoSpatialRepository = require('./geoSpatialRepository.js').geoSpatialRepository;
var routes = {};

routes.getLoos = function(req, res) {
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var callBack = function (error, data){
        var response = {};
        response["locations"] = data;
        console.log("sending response.." + data);
        res.send(response);
    };
    geoSpatialRepository.find(latitude, longitude, 2, callBack);
}

routes.addLoo = function(req, res) {
    console.log("\n\n"+req.body.latitude + " " + req.body.longitude+"\n\n")
    var data = {
        "name": req.body.name,
        "coordinates": [req.body.latitude, req.body.longitude],
        "rating": req.body.rating,
        "operational": req.body.operational,
        "hygienic": req.body.hygienic,
        "free": req.body.free,
        "type": req.body.kind,
        "suitableFor": req.body.suitableFor
    }
    geoSpatialRepository.save(data);
    console.log("inserted data.."+ JSON.stringify(data));
    res.send("Added Successfully!!");
}

routes.updateLoo = function(req, res) {
    geoSpatialRepository.update(req.body);
    console.log("updated data.."+ JSON.stringify(req.body));
    res.send("Updated Successfully!!");
}

// require('http').createServer(function (request, response) {
//     var body = "";
//     request.addListener('data', function (chunk) { body += chunk });
//     request.addListener('end', function () {
        
//         router.handle(request, body, function (result) {
//             response.writeHead(result.status, result.headers);
//             response.end(result.body);
//         });
//     });
// }).listen(3000);

exports.routes = routes;