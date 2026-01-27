require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect(process.env.MONGO_URI).then(() => console.log('Database connesso')).catch(err => console.log(err));
app.get('/', (req, res) => res.send('Server in esecuzione'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server in ascolto sulla porta ${PORT}`));

app.use('/api/auth', require('./routes/auth'));

app.use('/api/veicoli', require('./routes/veicoli')); //collegamento rotte veicoli
app.use('/api/allarmi', require('./routes/allarmi')); //collegamento rotte allarmi