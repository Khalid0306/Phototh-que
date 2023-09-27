const { rimraf } = require('rimraf');

const Album = require('../models/albumSchema');
const catchAsync = require('../helpers/catchAsync');

const path = require('path');
const fs = require('fs');

const albums = catchAsync(async (req, res) => {
   const albums = await Album.find();

    res.render('albums', {
         title: 'Mes albums',
         albums,
    }); 
});

const showAlbum = catchAsync(async (req, res) => {
    try {
        const idAlbum = req.params.id;
        const album = await Album.findById(idAlbum);

        res.render('album', {
            title: 'Mon album :',
            album,
            errors: req.flash('error'),
        }); 
    } catch (error) {
        res.redirect('/404');
    }

});

const addImage = catchAsync(async (req, res) => {

        const idAlbum = req.params.id;
        const album = await Album.findById(idAlbum);

        if (!req?.files?.image) {
            req.flash('error', 'Aucun fichier mis en ligne');
            res.redirect(`/showAlbum/${idAlbum}`);
            return
        }

        const image = req.files.image;

        if (image.mimetype != 'image/jpeg' && image.mimetype != 'image/png' ) {
            req.flash('error', 'Fichiers JPG et PNG accepté uniquement !');
            res.redirect(`/showAlbum/${idAlbum}`);
            return
        }

        //Pour gérer de maniére automatique la création de l'arborescence du ficher.
        const folderPath = path.join(__dirname, '../public/uploads', idAlbum);
        fs.mkdirSync(folderPath, { recursive: true });

        const imageName = image.name;

        const localpath = path.join(folderPath, imageName);

        await image.mv(localpath);

        album.images.push(imageName);
        await album.save();

        res.redirect(`/showAlbum/${idAlbum}`); 

});

const createAlbumForm = (req, res) => {
   
    res.render('new_album', {
         title: 'Nouvel album',
         errors: req.flash('error'),
    }); 
};

const albumTreatement = catchAsync(async (req, res) => {
    try {
        if (!req.body.albumTitle) {
            req.flash('error', "Le titre ne doit pas etre vide.");
            res.redirect('/albums/create');
            return;
        }
        await Album.create({
            title: req.body.albumTitle,
        });
    
        res.redirect('/albums');
    } catch (error) {
        req.flash('error',"Erreur lors de la création de l'album")
        res.redirect('/albums/create');
    } 
});

const deleteAlbum =  catchAsync(async (req, res) => {
    try {
        const idAlbum = req.params.id;
        
        const albumToDelete = await Album.findById(idAlbum);
        if (!albumToDelete) {
            return res.status(404).send('Album non trouvé');
        }

        await Album.findByIdAndDelete(idAlbum);

        const albumPath = path.join(__dirname, '../public/uploads', idAlbum);

        await rimraf(albumPath);

        res.redirect('/albums');
    } catch (error) {
        req.flash('error', 'Une erreur s\'est produite lors de la suppression de l\'album');
        res.redirect('/albums');
    }

});

const deleteImage =  catchAsync(async (req, res) => {

    const idAlbum = req.params.id;
    const album = await Album.findById(idAlbum);

    const imageIndex = req.params.imageIndex;
    const image = album.images[imageIndex];

    if (!image) {
        res.redirect(`/showAlbum/${idAlbum}`);
        return;
    }

    album.images.splice(imageIndex, 1);
    await album.save();

    const imagePath = path.join(__dirname, '../public/uploads', idAlbum, image );
    fs.unlinkSync(imagePath);

    res.redirect(`/showAlbum/${idAlbum}`);

});

// A rajouter Historique de consultation d'album affichage d'image (tips: modification de la bdd)

module.exports = {
    albums,
    showAlbum,
    addImage,
    createAlbumForm,
    albumTreatement,
    addImage,
    deleteAlbum,
    deleteImage,
};