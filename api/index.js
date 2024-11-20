require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const post_route = require('./routes/post');
const auth_route = require('./routes/auth');
const department_route = require('./routes/department');
const course_route = require('./routes/course');
const path = require('path');
const upload_profile_pic_route = require('./routes/upload_profile_picture');
const user_profile_route = require('./routes/user_profile');

const app = express();
const root = require('path').join(__dirname, 'public');
app.use(bodyParser.json());
app.use(express.static(root));
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/executives', express.static(path.join(__dirname, '../public/images/executives')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
    try {
        res.json({ message: 'Hello World!' });
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
})

app.use('/api/posts', post_route);
app.use('/api', auth_route);
app.use('/api', upload_profile_pic_route);
app.use('/api', user_profile_route);
app.use('/api/courses', course_route);
app.use('/api/departments', department_route);

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`server listening on port ${PORT}`));