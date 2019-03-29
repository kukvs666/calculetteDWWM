/*
        ####################################################
        ####################################################
        #####                                          #####
        #####   Programme calculatrice champ unique    #####
        #####                                          #####
        #####   Auteur: Quentin GAUBERT                #####
        #####   Formation: DWWM 2019                   #####
        #####                                          #####
        ####################################################
        ####################################################

 

 C'est un script pour une calculatrice. Il n'y as qu'un seul champ 
 d'entrée (un <input/> HTML). L'utilisateur pour ainsi entrer une
 expression complète qui sera évalué par le script lors du clic
 sur le bouton. L'expression peut contenir (pour le moment) 
 les opérateurs +, -, /, *, et ^ (pour un exposant de la forme 2^3).
 Le script supporte les nombres à virgule. J'ai essayé de penser la 
 structure pour permettre de faire évoluer le programme facilement,
 je vous engage donc à essayer de rajouter des fonctionnalités. 
 (par exemple détecter la notation scientifique "2e6").

 */


// Pour construire les expréssion régulière suivante j'ai utiliser
// le site: https://regexr.com/ .

var parenthese = /\(\d+([\.]?\d+)?([\+\-\*\/\^]*\d+([\.]?\d+)?)*\)/g;
// => expression régulière pour détecter une série d'opération
// qui est entre parenthèses. Si des parenthèses sont incluses dans d'autre,
// c'est les plus incluses qui sont détectées.

var exposant = /\d+([\.]?\d+)?\^\d+/g;
// => expression régulière pour détecter une puissance sous la forme 2^3 
// deux puissance trois.

var multi_divi = /\d+([\.]?\d+)?[\*|\/]\d+([\.]?\d+)?/;
// => expression régulière pour détecter une multiplication ou une division.

var plus_moins = /\d+([\.]?\d+)?[\+|\-]\d+([\.]?\d+)?/;
// => expression régulière pour détecter une somme ou une différence.

var unique = /^\d+([\.]?\d+)?$/g;
// => expression régulière qui détecte si il n'y as qu'un seul nombre.



// Lors du clic sur le bouton, la fonction calcul() est appelée.
function calcul() {

    let $input = document.getElementById("champ").value;
    // Je donne à $input la valeur du champ <input/> du HTML.

    $input = $input.replace(',', '.')
    // Si l'utilisateur a entré un nombre à virgule avec une virgule
    // au lieu d'un point, je la remplace par le point.. En 
    // programmation, 2.5 est un nombre décimale.
    // Alors que 2,5 signifie le nombre 2 puis le nombre 5.

    $input = $input.trim()
    // trim() permet de supprimer tout les espaces inutiles.
    // (3   +5 -3) devient (3+5-3)


    let resultat = priority($input);
    // Maintenant que mon $input est propre, je peut le donner à la
    // fonction priority() qui va faire le calcul en respectant les
    // priorité arthmétique. Le résultat sera stocké dans la variable
    // resultat.
    

    
    let index = resultat.indexOf('.')
    // Ici je cherche à savoir si la variable résultat contient un 
    // nombre entier ou un nombre à virgule. Si indexOf() renvoi -1,
    // c'est qu'il n'y as pas de point dans ma chaîne, et donc que 
    // c'est un nombre entier...
    if (index < 0){
        resultat = resultat;
        // ... dans ce cas mon nombre ne change pas.
    } else {
        // Dans le cas contraire (else veut dire sinon), je sépare les 
        // deux nombres (un de chaque coté de la virgule) pour tronquer
        // la partie décimale. J'utilise pour ça la méthode slice()
        // qui prend pour argument l'index de départ puis l'index de fin.
        resultat = resultat.split('.');
        resultat = resultat[0] + '.' + resultat[1].slice(0,3);
        // Notez qu'ici j'utilise la concaténation, c'est à dire 
        // l'opérateur + pour mettre les morceaux de chaîne de 
        // caractère les uns à la suite des autres.
    }

    $span = document.createElement("span");
    $span.setAttribute("id","resultat");
    $br = document.createElement("br");
    document.body.append($br);
    document.body.append($span);
    $span.textContent = $input + " = " + resultat;
    // Le morceau de code ci-dessus est là pour injecter le résultat
    // dans la page web.




    function priority(expression) {
        // fonction pour calculer selon les ordres de priorité. 
        // l'argument expression correspond au $input envoyer lors
        // de l'appel de la fonction.



        /*   ----------------------------------------------------------------
                    /\ 
                   //\\
                  //  \\        Attention, tout le long du programme, la
                 // || \\       variable expression doit rester une chaine
                //  ||  \\      de carractère, afin de pouvoir utiliser les
               //        \\     expression régulière.
              //    ||    \\
               ============
            -----------------------------------------------------------------
         */



        // Début de la boucle qui se répète tant que la variable 
        // expression contient autre chose qu'un nombre unique, qui 
        // correspond au résulat final.
        do {
            if (expression.match(parenthese) != null) {
                // Lire: "Si l'expression régulière parenthese est
                // dans la variable expression!"
                // Si oui alors on execute les lignes suivantes.

                expression = expression.replace(parenthese, function(correspondance, inutile, expression) {
                    // Ici on utilise la méthode javascript replace(). On 
                    // lui donne en agrument l'expression régulière parenthese,
                    // puis ce par quoi on veut la remplacer (ici la valeur de 
                    // retour de la fonction anonyme).


                    // Correspondance est le premier argument de la fonction.
                    // C'est le morceau de chaine de caractère qui correspond
                    // à la partie de je détecte avec mon expression régulière.

                    correspondance = correspondance.replace("(", "").replace(")", "")
                    // Ici je "nettoie" ma correspondance pour surprimer les 
                    // parenthèse qui ne sont plus utile.

                    return inside(correspondance);
                    // Enfin je retourne le résultat du calcul de ce qu'il y 
                    // avait à l'intérieur des parenthèses. Pour cela j'appel
                    // la fonction inside() en lui donnant ma correspondance en
                    // argument.
                });

            } else {
                // Sinon (si il n'y as pas de parenthèse), j'envoie directement
                // ma variable expression en argument de ma fonction inside()
                // pour effectuer le calcul.
                expression = inside(expression);
            }
        } while (expression.match(unique) === null);
        // while est la deuxième partie de la boucle. C'est à ce niveau que l'on 
        // test la condition de sortie de la boucle.

        return expression;
        // Si on sort de la boucle, c'est que le calcul est terminé. On peut donc 
        // retourner la valeur de la variable expression, qui sera injecter dans 
        // le code HTML
    }





    function inside(expression) {
        // La fonction inside va s'occuper de faire les calculs avec les différents
        // opérateurs mathématiques, par ordre de priorité (pour rappel: puissance, 
        // puis multiplication et division, puis addition et soustraction).

        // De nouveau une boucle do...while pour de le code soit éxécuté AU MOINS
        // UNE FOIS. De nouveau, à la fin de la boucle on teste si la variable 
        // expression contient un nombre unique. Si c'est le cas, c'est que tout 
        // les calculs ont été fait.
        do {

            if (expression.match(exposant) != null) {
                // Si on détecte un exposant ...
                expression = expression.replace(exposant, function(correspondance, inutile, text) {
                    // ... on  remplace cet exposant par le résultat de la fonction anonyme.

                    var values = correspondance.split("^");
                    // Grace à la méthode split() on sépare la chaîne x^y en un tableau qui 
                    // contient x et y. À ce moment values à pour valeur ['x', 'y']

                    return Math.pow(parseFloat(values[0]), parseInt(values[1])).toString()
                    // Math.pow correspond à la librairie Math qui possède une méthode
                    // pow() (power) qui peut effectuer le calcul d'une puissance.
                    // pow() attend deux arguments, deux nombres.
                    // Comme nos valeur x et y sont des chaînes de caractère, il faut 
                    // les transformer en nombres avec les fonctions parseInt et parseFloat, 
                    // respectivement pour un entier et un nombre à virgule.
                    // Le premier argument est le nombre (qui peut être à virgule) et le
                    // second est l'exposant (qui est obligatoirement un entier).
                    //
                    // Enfin avec la méthode .toString() je transforme le résultat en chaîne 
                    // caractère pour pouvoir l'intégrer au reste de mon expression.

                });
            } else if (expression.match(multi_divi) != null) {
                // Si on détecte une multiplication ou une division ...
                expression = expression.replace(multi_divi, function(correspondance, inutile, text) {
                    // ... on remplace par le calcul de cette dernière, toujours dans
                    // une fonction anonyme.

                    let values = correspondance.trim();
                    // On supprime les éventuels espaces.

                    let index = values.indexOf('/')
                    // Avec la méthode indexOf(), on test si le slash est dans la chaine.
                    // Si oui indexOf revoie l'index ou il se situe dans la chaine, sinon 
                    // il renvoie -1.

                    if (index < 0) {
                        // Si index vaut -1 c'est que / n'est pas dans la chaine,
                        // donc j'ai une multiplication.

                        values = values.split('*')
                        // Je sépare les deux nombres pour ensuite les multiplier 
                        // entre eux. Attention les élements d'un tableau sont 
                        // numéroté à partir de 0.

                        values = parseFloat(values[0]) * parseFloat(values[1])
                    } else {
                        // Sinon j'ai une division que j'éxécute de la même manière que la division.
                        values = values.split('/')
                        values = parseFloat(values[0]) / parseFloat(values[1])
                    }


                    return values.toString();
                    // Je retourne mon résultat en n'oubliant pas de le retransformer en chaine 
                    // de carractère.
                });


            } else if (expression.match(plus_moins) != null) {
                // Si on détecte une addition ou une soustraction...
                expression = expression.replace(plus_moins, function(correspondance, inutile, text) {
                    // ... on remplace par le calcul de cette dernière, toujours dans
                    // une fonction anonyme.

                    let values = correspondance.trim()
                    let index = values.indexOf('+')
                    // Avec la méthode indexOf(), on test si le + est dans la chaîne.
                    // Si oui indexOf revoie l'index ou il se situe dans la chaîne, sinon 
                    // il renvoie -1.

                    if (index < 0) {
                        // Si index vaut -1 c'est que + n'est pas dans la chaîne,
                        // donc j'ai une soustraction.
                        values = values.split('-')
                        // Je sépare les deux nombres pour ensuite faire la soustraction 
                        // entre eux. Attention les éléments d'un tableau sont 
                        // numérotés à partir de 0.

                        values = parseFloat(values[0]) - parseFloat(values[1])
                    } else {
                        // Sinon j'ai une addition que j'éxecute de la même manière que la soustraction.
                        values = values.split('+')
                        values = parseFloat(values[0]) + parseFloat(values[1])
                    }



                    return values.toString();
                    // Et on retourne la valeur de values, transformée en chaîne de caractère
                });
            }
        } while (expression.match(unique) === null);
        // Nous avons de nouveau une condition pour la boucle do...while, comme pour la fonction
        // priority, cette condition test si il ne reste qu'un nombre unique, ou si au contraire
        // il reste des opérations à effectuer 
        
        return expression;
        // On retourne la variable expression.

    }
}

/* 
 * N'hésitez pas à essayer d'améliorer le programme. il existe plein d'opérateur mathématiques
 * qui pourrait être ajoutés. N'hésitez pas non plus à corriger mes fautes de francais, je 
 * suis sûr qu'il y en as! ;) 
 */
