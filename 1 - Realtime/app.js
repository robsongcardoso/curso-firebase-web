/**
 * Váriaveis usadas durante o desenvolvimento
 */
var CARD_CONTAINER = document.getElementsByClassName('card-container')[0];
var NOMES = ["Anderson", "Beatriz", "Caio", "Daniela", "Everton", "Fabiana", "Gabriel", "Hortencia", "Igor", "Joana"];
var cards = [];

/* 
 *firebase: objeto global
 *database(): metodo para acesso ao real time database.
 *ref(): url em string para referencia do caminho do banco
 */
var ref = firebase.database().ref('card');


/**
 * Botão para cria um card no card-contaier
 */
function criarCard() {
    var card = {
        nome: NOMES[Math.floor(Math.random() * NOMES.length - 1 )],
        idade: Math.floor(Math.random() * 22 + 18),
        curtidas: 0
    };
    /* set(): Metodo que cria dados na url passada 
        child(): acessa o no filho passado por parametro
    */

    /* ref.child(card.nome).set(card).then(() => {
        adicionaCardATela(card)
    }) */

    /* push(); cria um id unico e inseri os dados dentro desse uid */
    ref.push(card).then(snapshot => {
        adicionaCardATela(card, snapshot.key)
    })


//SAlva no bd firebase
 /*    firebase.database().ref('card/' + card.nome).set(card).then(() =>{
        adicionaCardATela(card)
    }) */

};

/**
 * Recebe a referencia do card e exclui do banco de dados
 * @param {String} id Id do card
 */
function deletar(id) {
    //var card = document.getElementById(id);
    //.set(null): Ao setar o nó como nulo ele é excluido do firebase
    //ref.child(id).set(null).then(() => {
    //    card.remove();
   // })

    //.remove() remove o nó pai e filhos em que o metodo é utilizado no bd
    ref.child(id).remove().then(() => {
        //Remove da view
        var card = document.getElementById(id);
            card.remove();
    })

    
};

/**
 * Incrementa o numero de curtidas
 * @param {String} id Id do card
 */
function curtir(id) {
     var card = document.getElementById(id);
     var count = card.getElementsByClassName('count-number')[0];
     // o sinal de + converte para number
     var countNumber =+count.innerText;
     countNumber = countNumber + 1;
    //.set(): Pode ser acessado diremente o objeto que quer atualizar e passar o valor atualizado
    //ou pode-se passar o objeto completo e atuializa-lo com os novos valores no campos correspondentes
     ref.child(id + '/curtidas').set(countNumber).then(() => {
         count.innerText = countNumber;
     })
};

/**
 * Decrementa o numero de curtidas
 * @param {String} id Id do card
 */
function descurtir(id) {
    var card = document.getElementById(id);
    var count = card.getElementsByClassName('count-number')[0];
    // o sinal de + converte para number
    var countNumber =+count.innerText;
    if (countNumber > 0) {
        countNumber = countNumber - 1;
        //update(): Recebe um objeto (e apenas um objeto) e atualiza apenas as propriedades desse objeto
        ref.child(id).update({curtidas: countNumber}).then(() => {
            count.innerText = countNumber;
        })
    }
    


};

/**
 * Espera o evento de que a DOM está pronta para executar algo
 */
document.addEventListener("DOMContentLoaded", function () {
    /* once(): retorna os dados lidos de uma url  
       snapshot: objeto retornado pela leitura*/
    ref.once('value').then(snapshot => {
        //Acessa um nó filho
        //console.log('child', snapshot.child('-LwUpgmRiwZfx-xjlHyN').val());
        //Checa se existe algo no snapshot
        //console.log('exixtes()', snapshot.exists());
        //se existe filho passado na url
        //console.log('hasChild()-Nome', snapshot.hasChild('-LwUpgmRiwZfx-xjlHyN/nome'))
       //console.log('hasChild()-Comentario', snapshot.hasChild('-LwUpgmRiwZfx-xjlHyN/comentario'))
        //se exixte algum filho no nó
        //console.log('hasChildren()', snapshot.child('-LwUpgmRiwZfx-xjlHyN').hasChildren())
        //numero de filhos no snapshot
        //console.log('numChildren()', snapshot.numChildren());

        //a chave desse snapshot/caminho
        //console.log('Chave', snapshot.key);
        snapshot.forEach(value => {
           //console.log('Chave', value.key)
            adicionaCardATela(value.val(), value.key)
        })
    })
});

/**
 * Adiciona card na tela
 * @param {Object} informacao Objeto contendo dados do card
 * @param {String} id UID do objeto inserido/consultado
 */
function adicionaCardATela(informacao, id) {
    /**
     * HEADER DO CARD
     */
    let header = document.createElement("h2");
    header.innerText = informacao.nome;
    header.classList.add('card-title');
    // ===================================

    /**
     * CONTENT DO CARD
     */
    let content = document.createElement("p");
    content.classList.add('card-text');
    content.innerText = informacao.idade + ' anos.';
    // ===================================

    /**
     * BOTÕES DO CARD
     */
    let inner = document.createElement("div");
    inner.classList.add('row')
    // Botão adicionar
    let button_add = document.createElement("button");
    button_add.classList.add('btn', 'btn-link', 'col-3');
    button_add.setAttribute('onclick', "curtir('" + id + "')");
    button_add.innerText = '+';
    inner.appendChild(button_add);

    // Contador de curtidas
    let counter = document.createElement("span");
    counter.innerHTML = informacao.curtidas;
    counter.classList.add('col-3', 'text-center', 'count-number');
    inner.appendChild(counter);

    // Botão de subtrair
    let button_sub = document.createElement("button");
    button_sub.classList.add('btn', 'btn-link', 'col-3');
    button_sub.setAttribute('onclick', "descurtir('" + id + "')");
    button_sub.innerText = '-';
    inner.appendChild(button_sub);
    // ===================================

    // Botão de excluir
    let button_del = document.createElement("button");
    button_del.classList.add('btn', 'btn-danger', 'col-3');
    button_del.setAttribute('onclick', "deletar('" + id + "')");
    button_del.innerText = 'x';
    inner.appendChild(button_del);
    // ===================================

    /**
     * CARD
     */
    let card = document.createElement("div");
    card.classList.add('card');
    card.id = id;
    let card_body = document.createElement("div");
    card_body.classList.add('card-body');
    // ===================================

    // popula card
    card_body.appendChild(header);
    card_body.appendChild(content);
    card_body.appendChild(inner);
    card.appendChild(card_body);

    // insere no container
    CARD_CONTAINER.appendChild(card);
}