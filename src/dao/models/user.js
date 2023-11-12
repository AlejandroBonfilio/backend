const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }, 
  role: {
    type: String,
    enum: ['admin', 'usuario', 'premium'],
    default: 'usuario',
  },
  documents: [
    {
      name: String,       
      reference: String,  
    }
  ],
  last_connection: { type: Date }
});

// Método para encriptar la contraseña antes de guardarla en la base de datos
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (err) {
    return next(err);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword, callback) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    callback(null, isMatch);
  } catch (err) {
    callback(err);
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
