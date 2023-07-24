const router = require('express').Router();
const { Url, joiUrlSchema } = require('../models/Url');
const validate = require('../middleware/validate');

router.get('/', async (req, res) => {
  try {
    const urls = await Url.find();
    res.status(200).json(urls);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get('/:id', validate('id'), async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);
    if (!url) return res.status(404).json('url does not exists');
    res.status(200).json(url);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post('/', validate(joiUrlSchema), async (req, res) => {
  try {
    let miniURL;
    if (req.body.customUrl) miniURL = await Url.generateCustomURL(req.body.customLink);
    else miniURL = await Url.generateMiniURL(req.body.customLength);

    req.body.miniURL = miniURL.url;
    req.body.collision = miniURL.collision;

    // add short url to value object
    url = new Url(req.body);
    await url.save();
    res.status(200).json(url);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.put('/:id', validate('id'), validate(joiUrlSchema), async (req, res) => {
  try {
    const url = await Url.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!url) return res.status(404).json('url does not exist');
    res.status(200).json(url);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.delete('/:id', validate('id'), async (req, res) => {
  try {
    const url = await Url.findByIdAndRemove(req.params.id);
    if (!url) return res.status(404).json('url does not exists');
    res.status(200).json(url);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
