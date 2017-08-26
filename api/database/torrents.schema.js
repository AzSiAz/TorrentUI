const mongoose = require('mongoose')

const torrentSchema = new mongoose.Schema({
    hash: String,
    id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    private: { type: Boolean, default: false }
}, {
  timestamps: true
})

// torrentSchema.po

const Torrent = mongoose.model('Torrent', torrentSchema, 'Torrent')

module.exports = Torrent
