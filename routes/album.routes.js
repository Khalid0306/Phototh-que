const express = require ('express');
const router = express.Router();
const albumController = require('../controllers/album.controller');

router.get('/albums/create', albumController.createAlbumForm);
router.post('/albums/create', albumController.albumTreatement);

router.get('/albums', albumController.albums);

router.get('/showAlbum/:id', albumController.showAlbum);
router.post('/showAlbum/:id', albumController.addImage);

router.get('/showAlbum/:id/delete', albumController.deleteAlbum);
router.get('/showAlbum/:id/delete/:imageIndex', albumController.deleteImage);

module.exports = router;