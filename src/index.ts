import express from 'express';
import bodyParser from 'body-parser';
import characterRoutes from './api/routes/characterRoutes';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/api/character', characterRoutes);

app.listen(port, () => {
	console.log(`API running on http://localhost:${port}`);
});
