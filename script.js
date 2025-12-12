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
let faseAtual = null;
let selecionado = null;   // lixo sendo arrastado

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

    const parabens = document.getElementById("parabens");
    const gameover = document.getElementById("gameover");
    if (parabens) parabens.style.display = "none";
    if (gameover) gameover.style.display = "none";

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
        img.style.left = (50 + i * 110) + "px";
        img.style.top = "140px";
        img.dataset.tipo = lixo.tipo;

        // mouse
        img.addEventListener("mousedown", iniciarArrasto);
        // touch (dedo)
        img.addEventListener("touchstart", iniciarArrasto);

        area.appendChild(img);
    });
}

/* ---------------- ARRASTAR (MOUSE + TOUCH) ---------------- */

function iniciarArrasto(ev) {
    selecionado = ev.target;

    if (ev.type === "touchstart") {
        ev.preventDefault(); // evita scroll enquanto arrasta
    }
}

function mover(ev) {
    if (!selecionado) return;

    let x, y;

    if (ev.type === "mousemove") {
        x = ev.pageX;
        y = ev.pageY;
    } else if (ev.type === "touchmove") {
        x = ev.touches[0].pageX;
        y = ev.touches[0].pageY;
        ev.preventDefault();
    }

    selecionado.style.left = (x - 40) + "px";
    selecionado.style.top = (y - 40) + "px";
}

function finalizarArrasto(ev) {
    if (!selecionado) return;
    verificarSolto(ev);
    selecionado = null;
}

/* eventos globais para acompanhar o arrasto */
document.addEventListener("mousemove", mover);
document.addEventListener("mouseup", finalizarArrasto);

document.addEventListener("touchmove", mover);
document.addEventListener("touchend", finalizarArrasto);

/* ---------------- VERIFICAR LIXEIRA ---------------- */

function verificarSolto(ev) {
    let x, y;

    if (ev.type.includes("mouse")) {
        x = ev.clientX;
        y = ev.clientY;
    } else if (ev.type.includes("touch")) {
        x = ev.changedTouches[0].clientX;
        y = ev.changedTouches[0].clientY;
    }

    const tipo = selecionado.dataset.tipo;
    const lixeiras = document.querySelectorAll(".lixeira");

    let acertou = false;

    lixeiras.forEach(l => {
        const r = l.getBoundingClientRect();
        const dentro =
            x > r.left &&
            x < r.right &&
            y > r.top &&
            y < r.bottom;

        if (dentro && l.dataset.tipo === tipo) {
            acertou = true;
            selecionado.remove();
        }
    });

    if (acertou) {
        pontuar(true);
        verificarConclusao();
    } else {
        pontuar(false);
    }
}

/* ---------------- PONTUAÇÃO ---------------- */

function pontuar(acertou) {
    if (acertou) {
        pontuacao += 10;
    } else {
        erros--;
        document.getElementById("erros").innerText = "Erros restantes: " + erros;

        if (erros <= 0) {
            const gameover = document.getElementById("gameover");
            if (gameover) gameover.style.display = "flex";
        }
    }

    document.getElementById("pontuacao").innerText = "Pontos: " + pontuacao;
}

/* ---------------- CONCLUSÃO ---------------- */

function verificarConclusao() {
    const lixoRestante = document.querySelectorAll(".lixo").length;

    if (lixoRestante === 0) {
        const parabens = document.getElementById("parabens");
        if (parabens) parabens.style.display = "flex";
    }
}

/* ---------------- REINICIAR ---------------- */

function reiniciarFase() {
    if (faseAtual) iniciarFase(faseAtual);
}

function voltarMapa() {
    mostrar("mapa");
}
