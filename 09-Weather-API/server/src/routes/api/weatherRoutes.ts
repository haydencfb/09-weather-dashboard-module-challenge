import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

router.post('/', (req, res) => {
      const cityName = req.body.cityName;
      WeatherService.getWeatherForCity(cityName).then((data: any) => {
        HistoryService.addCity(data[0].city);
        res.json(data);
      }).catch ((error) => {
      console.error(`Error saving the city to search history: ${error}`);
      res.status(500).send('Internal Server Error');
      })
});

router.get('/history', async (_req, res) => {
    HistoryService.getCities().then((data) => {
      return res.json(data);
    }).catch ((error) => {
    console.error(`Error saving the city to search history: ${error}`);
    res.status(500).send('Internal Server Error');
    })
});

router.delete('/history/:id', async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({error: 'City ID is required'});
  }
  HistoryService.removeCity(req.params.id).then(() => {
    res.json({success: 'City removed from history'});
  }).catch((error) => {
    res.status(500).json({error: `Error removing city from history: ${error}`});
  });
});

export default router;