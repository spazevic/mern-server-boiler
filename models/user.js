let bcrypt = require('bcryptjs')
let mongoose = require('mongoose')

// TODO: Create user schema
let userSchema = new mongoose.Schema({
	firstname: {
		type: String,
		required: true
	},
	lastname: String,
	email: {
		type: String,
		required: true,
		unique: true,
		minlength: 6
	},
	password: {
		type: String,
		required: true,
		minlength: 8
	},
	pic: String,
	admin: {
		type: Boolean,
		default: false
	}
})

userSchema.pre('save', function(next) {
	if (this.isNew) {
		this.password = bcrypt.hashSync(this.password, 12)
	}
	next()
})

userSchema.set('toJSON', {
	transform: (doc, user) => {
		delete user.password
		delete user.lastname
		delete user.__v
		return user
	}
})

userSchema.methods.validPassword = function (typedPassword) {
	return bcrypt.compareSync(typedPassword, this.password)
}

// TODO: Export user model
module.exports = mongoose.model('User', userSchema)