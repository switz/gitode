var mongoose = require('mongoose');

RepositorySchema = new mongoose.Schema({
  name: String,
  user: String,
  project: String,
  location: String,
  private: Boolean,
  lastPush: Date,
  created: Date,
  diskSize: Number,
  allowPullRequests: Boolean
})

mongoose.model('Repository', RepositorySchema);