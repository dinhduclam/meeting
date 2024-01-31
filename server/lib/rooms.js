/* eslint-disable no-await-in-loop */
const bluebird = require('bluebird');
const genid = require('./genid');

const rooms = {};

exports.join = (id, userId) => {
    if (!rooms[id])
        rooms[id] = [];
    rooms[id].push(userId);
    return id;
};

exports.out = (id, userId) => {
    if (!rooms[id])
        return;
    rooms[id] = rooms[id].filter(e => e!= userId);
};

exports.getMembers = (id) => {
    return rooms[id];
}