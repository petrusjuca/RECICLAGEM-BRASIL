/* ---------------- TELA INICIAL ---------------- */

function mostrar(tela) {
    document.querySelectorAll(".screen").forEach(s => s.style.display = "none");
    document.getElementById(tela).style.display = "flex";
}

setTimeout(() => mostrar("menu"), 1200);

function abrirMapa() { mostrar("mapa"); }

/* ---------------- FUNDOS ---------------- */

const fundos = {
    belem: "imagens/cidade_desenho.png",
    fortaleza: "imagens/fortaleza_desenho.png",
    rio: "imagens/rio_cristo_desenho.png"
};

/* ---------------- VARIÁVEIS ---------------- */

let pontuacao = 0;
let erros = 3;

/* ---------------- LIXOS DAS FASES ---------------- */

const lixosPorFase = {
    belem: [
        { img: "imagens/lixo_casca_acai.png", tipo: "organico" },
        { img: "imagens/lixo_garrafa_plastico.png", tipo: "plastico" },
        { img: "imagens/lata_metal.png", tipo: "metal" },
        { img: "imagens/papel_jornal.png", tipo: "papel" },
        { img: "imagens/vidro_quebrado.png", tipo: "vidro" }
    ],

    fortaleza: [
        { img: "imagens/coco_verde.png", tipo: "organico" },
        { img: "imagens/garrafa_pet.png", tipo: "plastico" },
        { img: "imagens/lata_refri.png", tipo: "metal" },
        { img: "imagens/papel_sorvete.png", tipo: "papel" },
        { img: "imagens/copo_vidro.png", tipo: "vidro" }
    ],

    rio: [
        { img: "imagens/lata_energetico.png", tipo: "metal" },
        { img: "imagens/garrafa_vidro.png", tipo: "vidro" },
        { img: "imagens/resto_comida.png", tipo: "organico" },
        { img: "imagens/folheto_turistico.png", tipo: "papel" },
        { img: "imagens/embalagem_biscoito.png", tipo: "plastico" }
    ]
};

/* ---------------- INICIAR FASE ---------------- */

function iniciarFase(nome) {
    faseAtual = nome;
    erros = 3;
    pontuacao = 0;
    document.getElementById("pontuacao").innerText = "Pontos: 0";
    document.getElementById("erros").innerText = "Erros restantes: 3";

    document.getElementById("fase").style.backgroundImage = `url('${fundos[nome]}')`;
    carregarLixos(nome);

    document.getElementById("parabens").style.display = "none";
    document.getElementById("gameover").style.display = "none";

    mostrar("fase");
}

/* ---------------- CARREGAR LIXOS ---------------- */

function carregarLixos(fase) {
    const area = document.getElementById("lixos");
    area.innerHTML = "";

    lixosPorFase[fase].forEach((lixo, i) => {
        const img = document.createElement("img");
        img.src = lixo.img;
        img.className = "lixo";
        img.style.left = (80 + i * 150) + "px";
        img.style.top = "150px";
        img.dataset.tipo = lixo.tipo;

        img.onmousedown = arrastar;
        area.appendChild(img);
    });
}

/* ---------------- ARRASTAR ---------------- */

let selecionado = null;

function arrastar(e) {
    selecionado = e.target;

    document.onmousemove = ev => {
        selecionado.style.left = (ev.pageX - 40) + "px";
        selecionado.style.top = (ev.pageY - 40) + "px";
    };

    document.onmouseup = verificarSolto;
}

/* ---------------- VERIFICAR LIXEIRA ---------------- */

function verificarSolto(ev) {
    const tipo = selecionado.dataset.tipo;
    const lixeiras = document.querySelectorAll(".lixeira");

    let acertou = false;

    lixeiras.forEach(l => {
        const r = l.getBoundingClientRect();
        const dentro =
            ev.clientX > r.left &&
            ev.clientX < r.right &&
            ev.clientY > r.top &&
            ev.clientY < r.bottom;

        if (dentro) {
            if (l.dataset.tipo === tipo) {
                acertou = true;
                selecionado.remove();
            }
        }
    });

    if (acertou) {
        pontuar(true);
        verificarConclusao();
    } else {
        pontuar(false);
    }

    document.onmousemove = null;
    document.onmouseup = null;
    selecionado = null;
}

/* ---------------- PONTUAÇÃO ---------------- */

function pontuar(acertou) {
    if (acertou) {
        pontuacao += 10;
    } else {
        erros--;
        document.getElementById("erros").innerText = "Erros restantes: " + erros;

        if (erros <= 0) {
            document.getElementById("gameover").style.display = "flex";
        }
    }

    document.getElementById("pontuacao").innerText = "Pontos: " + pontuacao;
}

/* ---------------- CONCLUSÃO ---------------- */

function verificarConclusao() {
    const lixoRestante = document.querySelectorAll(".lixo").length;

    if (lixoRestante === 0) {
        document.getElementById("parabens").style.display = "flex";
    }
}

/* ---------------- REINICIAR ---------------- */

function reiniciarFase() {
    iniciarFase(faseAtual);
}

function voltarMapa() {
    mostrar("mapa");
}
