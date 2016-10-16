var mongoose = require('mongoose'); //adding mongoose library
var bcrypt = require('bcrypt-nodejs'); //library to hash a password
var crypto = require('crypto');
var Schema = mongoose.Schema;


/* the user schema attribute / characteristics / fields */
var UserSchema = new Schema({
	email : {type: String, unique:true, lowercase:true},
	password: String,


	profile: {
		name: {type: String, default: ''},
		picture: {type: String, default: ''}
	},

	address: String,
	history: [{
		date: Date,
		paid: {type: Number, default:0},
		// item: {type: Schema.Types.ObjectId, ref: ''}

	}]

  });

/* Hash the password before saving it to the database */

UserSchema.pre('save', function(next) {
	var user = this; // 'this' is referring to the userSchema
	
	if(!user.isModified('password')) return next();
	
	bcrypt.genSalt(10, function(err, salt) {
		
		if (err) return next(err);
		
		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if (err) return next(err);
			user.password = hash;
			next();

		});


	});

});

/* compare password in the database and the one that the user type in */
UserSchema.methods.comparePassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.gravatar = function(size) {
	if(!this.size) size = 200;
	if(!this.email) return 'https://gravatar.com/avatar/?s' + size + '&d=retro'; //calling gravatar api
	var md5 = crypto.createHash('md5').update(this.email).digest('hex');
	return 'https://gravatar.com/avatar/' +md5 + '?s' +size + '&d=retro'; //returning a default gravatar if no gravatar is set
};


module.exports = mongoose.model('User', UserSchema);