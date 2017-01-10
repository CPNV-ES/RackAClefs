# Rack à clés

## Introduction

Durant les semaine d'examens, les enseignants de la filière informtique du CPNV utilisent fréquemment des
clés USB pour distribuer des données nécessaires à l'examen et/ou pour collecter le travail effectué par les
élèves. Cela donne lieu à passablement de manipulations dont on aimerait se passer.

Le but de ce projet est d'offrir une interface permettant de gérer un parc d'une quinzaine de clés USB à
travers plusieurs hubs USB multiports

![ExSys EX-1178](http://i.ebayimg.com/images/g/-rYAAOSwUuFW0Bm4/s-l1600.jpg)
## Description général

### Use case 1: Le secrétariat gère le stock de clés

#### Scénario: Consultation du stock
Le secrétariat – ou toute personne ayant accès – ouvre l'application et consulte le tableau, qui montre la liste
des clés du stock, avec pour chacune:
- Son état
    - Disponnible
    - Présente
    - Absente
    - Utilisée
- Le port du rack où elle se trouve (si l'état est Disponible ou Présente)
-  La personne qui l'a réservée (si l'état est Présente ou Utilisée)
- Son espace disponible

#### Scénario: Elimination du stock
Une clé est absente et introuvable, ou on n'arrive plus à la réinitialiser => le secrétariat l'élimine du stock

#### Scénario: Ajout au stock
Pour compenser les pertes, le secrétariat veut rajouter des clés dans le stock. Il met des clés vierges et
inconnues du système dans des ports libres et lance la procédure d'initialisation. Le système détecte les
nouvelles clés et les initialise.

### Use case 2: Un enseignant utilise des clés
#### Scénario: Réservation
Le prof définit une nouvelle réservation:
- Un nom (par exemple "ICT 431")
- Le nombre de clés voulues
- Le contenu de la clé. Uniquement des archives compressées

Lorsqu'il sauve la réservation, le système vérifie que le nombre de clés disponibles ainsi que l'espace restant
est suffisant pour satisfaire la demande.

Si tel est le cas, le système charge les clés et les marque comme Présente.

#### Scénario: Libération
Une fois l'examen terminé, le prof remet les clés dans le rack, retourne sur sa réservation, indique un dossier
dans lequel placer les données récupérées et lance la récupération. Le système recherche les clés de la
réservation dans le rack. Pour chaque clé trouvée, il transfère le contenu de la clé dans le dossier de
récupération et la réinitialise. Il libère ensuite la clé. Si toutes les clés de la réservation ont été libérées, la
réservation est marquée comme terminée.