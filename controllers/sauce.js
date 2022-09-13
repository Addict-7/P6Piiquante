const Sauce = require('../models/Sauce')
const fs = require('fs');


exports.createSauce = (req, res, next) => {
    console.log(req.body);
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce ({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
        .catch(error => res.status(400).json({ error }))
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(400).json({ message: 'Non autorisé !'})
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Non autorisé !'});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.likeDislikesSauce = (req, res, next) => {
    
    let userId = req.body.userId;
    let likeStatus = req.body.like;
        
    if (likeStatus === 1) {
        Sauce.updateOne(
            { _id: req.params.id }, // selection de la bonne sauce
            {
                $inc:{likes: +1}, // augmente le nombre de likes
                $push:{usersLiked: userId} // ajoute l'utilisateur a la liste de ceux qui aiment la sauce
            }
        )
        .then(() => {
            // Si jamais l'utilisateur avait dislike la sauce, on enleve ce dislike
            Sauce.updateOne(
                {
                    _id: req.params.id,
                    usersDisliked: { $in: [userId] } // Selectionne seulement si l'utilisateur a dislike la sauce
                },
                {
                    $inc: { dislikes: -1 }, // Enleve un dislike
                    $pull: { usersDisliked: userId} // Enleve l'utilisateur de la liste de ceux qui ont dislike la sauce
                }
            )
        })
        .then(() => res.status(201).json({ message: 'Produit liké !'}))
        .catch(error => res.status(400).json({ error }))
    };
    // Enleve un like ou un dislike (on ne sait pas)
    if (likeStatus === 0) {
        Sauce.updateOne(
            {
                _id: req.params.id,
                usersLiked: { $in: [userId] } // Selectionne seulement si l'utilisateur a like la sauce
            },
            {
                $inc: { likes: -1 }, // Enleve un like
                $pull: { usersLiked: userId} // Enleve l'utilisateur de la liste de ceux qui ont aime la sauce
            }
        )
        .then(() => {
            Sauce.updateOne(
                {
                    _id: req.params.id,
                    usersDisliked: { $in: [userId] } // Selectionne seulement si l'utilisateur a dislike la sauce
                },
                {
                    $inc: { dislikes: -1 }, // Enleve un dislike
                    $pull: { usersDisliked: userId} // Enleve l'utilisateur de la liste de ceux qui ont dislike la sauce
                }
            )
        })
        .then(() => {
            res.status(201).json({ message: ['Like annulé !', 'Dislike annulé !'] });
        })
        .catch((error) => res.status(400).json({ error }));
    };
    // Sauce dislikee
    if (likeStatus === -1) {
        Sauce.updateOne(
            { _id: req.params.id }, // selection de la bonne sauce
            {
                $inc:{dislikes: +1}, // augmente le nombre de dislikes
                $push:{usersDisliked: userId} // ajoute l'utilisateur a la liste de ceux qui dislike la sauce
            }
        )
        .then(() => {
            // Si jamais l'utilisateur avait like la sauce, on enleve ce like
            Sauce.updateOne(
                {
                    _id: req.params.id,
                    usersLiked: { $in: [userId] } // Selectionne seulement si l'utilisateur a like la sauce
                },
                {
                    $inc: { likes: -1 }, // Enleve un dislike
                    $pull: { usersLiked: userId} // Enleve l'utilisateur de la liste de ceux qui ont dislike la sauce
                }
            )
        })
        .then(() => res.status(201).json({ message: 'Produit disliké !'}))
        .catch(error => res.status(400).json({ error }))
    };



/*    if (likeStatus === 1) {
        Sauce.updateOne({ _id: req.params.id }, { $inc:{likes:+1}, $push:{usersLiked:userId} })
        .then(() => res.status(201).json({ message: 'Sauce liké !'}))
        .catch(error => res.status(400).json({ error }))
    }
    if (likeStatus === 0) {
        Sauce.updateOne({ _id: req.params.id }, { $inc:{likes:-1}, $push: {usersLiked:userId} })
            .then(() => {return Sauce.updateOne({ _id: req.params.id },{ $inc: { dislikes: +1 }, $pull: {usersDisliked:userId}})})
            .then(() => {res.status(201).json({ message: ['Like annulé !', 'Dislike annulé !']})})
            .catch((error) => res.status(400).json({ error }));
    }
    if (likeStatus === -1) {
        Sauce.updateOne({ _id: req.params.id }, {$inc:{dislikes: -1},$push:{usersdisLiked:userId}})
    } */
}; 