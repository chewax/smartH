import errorHandler from '../errors/errorHandler.js';

export default class Controller {

    constructor (model) {
        this.model = model;
        this.errorHandler = errorHandler;
    }

    retrieve (req, res){
        this.model.findOne({_id:req.params._id})
            .then ( (result) => {res.status(200).json(result);} )
            .catch( (err) => {this.errorHandler.handleError(err, req, res); });
    }


    find (req, res){
        var query = {};
        if (req.query._id) query['_id'] = req.query._id;

        //TODO Add Pagination
        this.model.find(query)
            .then ( (result) => {res.status(200).json(result);} )
            .catch( (err) => {this.errorHandler.handleError(err, req, res); });

    }

    create (req, res) {
        var obj = new this.model(req.body);

        obj.save()
            .then ( (result) => {

                var final = {
                    message: 'Create Successful!',
                    data: result
                };

                res.status(200).json(final);
            })
            .catch( (err) => { this.errorHandler.handleError(err, req, res); });
    }

    delete (req, res) {
        this.model.findOneAndRemove({_id: req.params._id})
            .then ( (result) => {
                var final = {
                    message: 'Delete Successful!',
                    data: result
                };

                res.status(200).json(final);
            })
            .catch( (err) => {this.errorHandler.handleError(err, req, res); });
    }

    update (req, res) {
        // var element_id = req.params._id;
        // delete req.params._id;
        // var data = req.body;
        this.model.findOneAndUpdate({_id: req.params._id}, req.body)
            .then ( (result) => { res.status(200).json(result);} )
            .catch( (err) => { this.errorHandler.handleError(err, req, res); });
    }
}
