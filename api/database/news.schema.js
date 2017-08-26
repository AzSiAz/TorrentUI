const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema({
    title: String,
    date: Date,
    content: String,
    id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    private: Boolean
}, {
  timestamps: true
})

const News = mongoose.model('News', newsSchema, 'News')

module.exports = News
