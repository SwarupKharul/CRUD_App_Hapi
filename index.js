'use strict';

//Import Hapi
const Hapi = require('@hapi/hapi');

//Database configuration
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/CRUD_App', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected....'))
    .catch(err => console.log(err));

//Define Schema
let noteSchema = {
    title: String,
    important: Boolean,
    description: String
}

//Create Model
const Note = mongoose.model('Notes', noteSchema);

const init = async () => {

    //Server configuration
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: true
        }
    });

    //Heading
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return '<h1>Note CRUD App</h1>';
        }
    });

    //Create Note
    server.route({
        method: 'POST',
        path: '/api/note',
        handler: async (request, h) => {
            let info = request.payload;
            console.log(info);
            let newInfo = new Note(info);
            await newInfo.save((err, task) => {
                if (err) return console.log(err);
            })
            return h.response("Success");
        }
    });

    //Get list of Notes and filter the list using query parameters
    server.route({
        method: 'GET',
        path: '/api/notes',
        handler: async (request, h) => {
            let params = request.query
            let infos = await Note.find(params).lean();
            return h.response(infos);
        }
    });

    //Update Note
    server.route({
        method: 'PUT',
        path: '/api/note/{id}',
        handler: async (request, h) => {
            let params = request.params.id;
            let info = request.payload;
            let infos = await Note.updateOne({ _id: params }, info).lean();
            return h.response(infos);
        }
    });

    //Delete Note
    server.route({
        method: 'DELETE',
        path: '/api/note/{id}',
        handler: async (request, h) => {
            let params = request.params.id;
            let infos = await Note.remove({ _id: params });
            return h.response(infos);
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);

};

//Error handling
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();