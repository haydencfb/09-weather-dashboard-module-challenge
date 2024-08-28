import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

router.post('/', (req, res) => {
    try {
      const cityName = req.body.cityName;
      WeatherService.getWeatherForCity(cityName).then(data => {
        HistoryService.addCity(cityName);
        res.json(data);
      });
    } catch (error) {
      console.error(`Error saving the city to search history: ${error}`);
      res.status(500).send('Internal Server Error');
    }
});

router.get('/history', async (_req, res) => {
  try {
    const history = await HistoryService.getCities();
    res.json(history);
  } catch (error) {
    console.error(error);
  }
});

// * BONUS TODO: DELETE city from search history
// router.delete('/history/:id', async (req, res) => {});

export default router;