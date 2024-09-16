const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    blogID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

const commentModel = mongoose.model('comment',commentSchema);
module.exports = commentModel;