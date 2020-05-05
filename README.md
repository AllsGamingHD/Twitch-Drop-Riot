# Twitch-Drop-Riot

Bonjour,

Voici un bot permettant de créer des comptes riot/twitch automatiquement.

Fonctions du bot :

Création de comptes Twitch
Création de comptes Riot
Association des comptes Twitch/Riot
Vérificateur de validité de compte Riot
Visionneur vidéo pour obtenir un drop et optimiser pour regarder un live compatible drop 24h/24

Twitch : 
Le bot Twitch est à 95% automatique, due au captcha qui n'est pas solvable automatiquement.

Automatique : 
Création de compte, vérification du code par e-mail et follow au 3 catégorie les plus regardée actuellement sur Twitch.
Enregistrement des informations de connexion et cookies dans un fichier « twitch.txt »

Pas automatique : 
Résolution du captcha. (Peut-être automatisée avec un script payant disponible sur le net)

Riot :
Le bot riot est lui 100% automatique, grâce à l’anti-captcha les captchas sont eu résolu seul.
L’anti-captcha est payant il faut acheter une clé d’accès.

Automatique : 
Création d’un compte avec une e-mail choisi auparavant.
Il existe une technique pour créer plusieurs comptes sur un mail unique mais celle-ci restera privée.
Pas automatique :
N/A

Association des comptes Twitch/Riot :
Ici, tout est automatique aussi, le compte Twitch est déjà connecté avec les cookies enregistrés auparavant est donc ne nécessite pas de recevoir de nouveau un code par e-mail.
Le compte riot est associer si le compte Twitch n’est pas déjà associé à un autre compte, si un compte riot est déjà associé il passera au compte Twitch suivant.

Vérificateur de validité de compte Riot :
100% automatique ici aussi, il sert à vérifier que les compte Riot n’ont pas était banni/supprimée.
Il m’est arrivée que des personnes se retrouvent avec un compte qui soit plus valide… alors j’ai créé ce petit bot pour vérifier que le compte a bien été créer et soit toujours existant.

Visionneur vidéo :
Là aussi tous sont automatique à 100%, le fonctionnement reprend celui de l’association pour le chargement du compte, il récupère les cookies pour éviter une nouvelle connexion.
Ensuite le bot se chargent de checker les streamers s’ils sont en live, s’il est bien sur le bon jeu, si les drops sont activés sur son live, le son actif, le statut Twitch et un limiteur de bande passante pour réduire la qualité du live et aussi éviter la surcharge réseau/cpu/gpu inutile.
Vérification toutes les 5 minutes des étapes ci-dessus pour rester sur un live 24h/24 qui drops.

Quelques problèmes peuvent être rencontre à cause des pubs donc dès qu’un nouvel onglet est ouvert celui-ci est directement fermer. (1 onglet max par instance).
Des problèmes de plantage peuvent survenir si votre PC n’est pas assez puissant ou votre connexion est trop lente.
Il faut alors changer les timeouts des page.waitFor()

Aucune autre aide ne sera fournie, des connaissances en JavaScript/NodeJS sont nécessaire.
