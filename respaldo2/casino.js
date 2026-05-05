const CARTAS = [
  {nombre: "A", valor: 11},
  {nombre: "2", valor: 2},
  {nombre: "3", valor: 3},
  {nombre: "4", valor: 4},
  {nombre: "5", valor: 5},
  {nombre: "6", valor: 6},
  {nombre: "7", valor: 7},
  {nombre: "8", valor: 8},
  {nombre: "9", valor: 9},
  {nombre: "10", valor: 10},
  {nombre: "J", valor: 10},
  {nombre: "Q", valor: 10},
  {nombre: "K", valor: 10}
]

const PALOS = ["♠", "♥", "♦", "♣"]

let baraja = []

function inicializarBaraja() {
  baraja = []
  for (let palo of PALOS) {
    for (let carta of CARTAS) {
      baraja.push({
        nombre: carta.nombre,
        valor: carta.valor,
        palo: palo
      })
    }
  }
  baraja.sort(() => Math.random() - 0.5)
}

function obtenerCartaAleatoria() {
  if (baraja.length === 0) inicializarBaraja()
  return baraja.pop()
}

function calcularValorMano(mano) {
  let valor = 0
  let ases = 0

  for (let carta of mano) {
    valor += carta.valor
    if (carta.nombre === "A") ases++
  }

  while (valor > 21 && ases > 0) {
    valor -= 10
    ases--
  }

  return valor
}

const btnPedir = document.getElementById("btn-pedir")
const btnPlantarse = document.getElementById("btn-plantarse")
const cartasJugadorDiv = document.getElementById("cartas-jugador")
const cartasBancaDiv = document.getElementById("cartas-banca")
const mensajeDiv = document.getElementById("mensaje")
const totalJugadorDiv = document.getElementById("total-jugador")

let manoJugador = []
let manoBanca = []
let gameOver = false

function obtenerRutaCarta(carta) {
  let palo = ""

  if (carta.palo === "♠") palo = "spades"
  if (carta.palo === "♥") palo = "hearts"
  if (carta.palo === "♦") palo = "diamonds"
  if (carta.palo === "♣") palo = "clubs"

  return `cartas/${carta.nombre}_${palo}.png`
}

function crearCartaHTML(carta) {
  const div = document.createElement("div")
  div.classList.add("carta")

  const img = document.createElement("img")
  img.src = obtenerRutaCarta(carta)
  img.classList.add("img-carta")

  div.appendChild(img)
  return div
}

// Carta oculta
function crearCartaOculta() {
  const div = document.createElement("div")
  div.classList.add("carta")

  const img = document.createElement("img")
  img.src = "cartas/reverso.png"
  img.classList.add("img-carta")

  div.appendChild(img)
  return div
}

function mostrarCarta(carta) {
  cartasJugadorDiv.appendChild(crearCartaHTML(carta))
}

function mostrarCartaBanca(carta) {
  cartasBancaDiv.appendChild(crearCartaHTML(carta))
}

// Revelar carta oculta SIEMPRE
function revelarCartaOculta() {
  const cartaOculta = document.getElementById("carta-oculta")
  if (cartaOculta) {
    cartaOculta.remove()
    mostrarCartaBanca(manoBanca[1])
  }
}

function mostrarMensaje(texto) {
  mensajeDiv.textContent = texto
  mensajeDiv.style.display = "block"
}

function actualizarTotalJugador() {
  const total = calcularValorMano(manoJugador)
  totalJugadorDiv.textContent = `Total: ${total}`
}

function startGame() {
  manoJugador = []
  manoBanca = []
  cartasJugadorDiv.innerHTML = ""
  cartasBancaDiv.innerHTML = ""
  mensajeDiv.style.display = "none"

  btnPedir.disabled = false
  btnPlantarse.disabled = false

  manoJugador.push(obtenerCartaAleatoria(), obtenerCartaAleatoria())
  manoBanca.push(obtenerCartaAleatoria(), obtenerCartaAleatoria())

  // Jugador
  manoJugador.forEach(mostrarCarta)

  // Banca
  mostrarCartaBanca(manoBanca[0])

  const cartaOculta = crearCartaOculta()
  cartaOculta.id = "carta-oculta"
  cartasBancaDiv.appendChild(cartaOculta)

  gameOver = false
  actualizarTotalJugador()
}

function reiniciarJuego() {
  inicializarBaraja()
  startGame()
}

btnPedir.addEventListener("click", () => {
  if (gameOver) return

  const carta = obtenerCartaAleatoria()
  manoJugador.push(carta)
  mostrarCarta(carta)
  actualizarTotalJugador()

  const valor = calcularValorMano(manoJugador)

  if (valor > 21) {
    revelarCartaOculta()

    mostrarMensaje("¡Te pasaste de 21! Perdiste.")
    gameOver = true
    btnPedir.disabled = true
    btnPlantarse.disabled = true
    setTimeout(reiniciarJuego, 3000)
  }
})

btnPlantarse.addEventListener("click", () => {
  if (gameOver) return

  gameOver = true
  btnPedir.disabled = true
  btnPlantarse.disabled = true

  revelarCartaOculta()

  let valorBanca = calcularValorMano(manoBanca)

  while (valorBanca < 17) {
    const carta = obtenerCartaAleatoria()
    manoBanca.push(carta)
    mostrarCartaBanca(carta)
    valorBanca = calcularValorMano(manoBanca)
  }

  const valorJugador = calcularValorMano(manoJugador)

  if (valorBanca > 21) {
    mostrarMensaje("¡La banca se pasó! Ganaste.")
  } else if (valorJugador > valorBanca) {
    mostrarMensaje("¡Ganaste!")
  } else if (valorJugador < valorBanca) {
    mostrarMensaje("¡Perdiste!")
  } else {
    mostrarMensaje("¡Empate!")
  }

  setTimeout(reiniciarJuego, 3000)
})

inicializarBaraja()
startGame()


document.getElementById('betBtn').addEventListener('click', async () => {
  const res = await fetch('/bet', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user: "Jugador",
      amount: 100
    })
  });

  const data = await res.json();

  document.getElementById('result').innerText = data.result;
});