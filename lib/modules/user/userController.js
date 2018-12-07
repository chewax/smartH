(function () {
    'use strict';

    let model = require('./userModel');
    let Controller = require('../core/lib/controller');
    let utils = require("../core/utils");

    class UserController extends Controller {

        create(req, res) {
            //Antes de dejar que el super cree el usuario le hasheo el password.
            req.body.credentials.password = utils.hashPasswordSync(req.body.credentials.password);
            super.create(req, res);
        }

        find (req, res){

            var query = {};
            if (req.query._id) query["_id"] = req.query._id;
            if (req.query.dni) query["dni"] = req.query.dni;
            if (req.query.first_name) query["firstName"] = req.query.first_name;

            //TODO Add Pagination
            this.model.find(query)
                .then ( (result) => { res.status(200).json(result)} )
                .catch( (err) => {this.errorHandler.handleError(err, req, res) })

        }

        update (req, res) {
          if (req.body.credentials.password) req.body.credentials.password = utils.hashPasswordSync(req.body.credentials.password);
            this.model.findOneAndUpdate({_id: req.params._id}, req.body)
                .then ( (result) => { res.status(200).json(result)} )
                .catch( (err) => { this.errorHandler.handleError(err, req, res) })
        }
    }

    module.exports = new UserController(model);

}).call(this);