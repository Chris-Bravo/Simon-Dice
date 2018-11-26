const btnIniciar = document.getElementById("btnIniciar")
const yellow = document.getElementById("yellow")
const blue = document.getElementById("blue")
const green = document.getElementById("green")
const red = document.getElementById("red")
const ultimoNivel = 10

class Juego{
    constructor(){
        this.iniciar()
        this.generarSecuencia()
        setTimeout(this.siguienteNivel,500)
    }
    iniciar(){
        this.toggleBtnEmpezar()
        this.nivel = 1
        this.colores = {
            yellow,
            blue,
            green,
            red
        }
        this.elegirColor = this.elegirColor.bind(this)
        this.siguienteNivel = this.siguienteNivel.bind(this)
        this.iniciar = this.iniciar.bind(this)
    }
    toggleBtnEmpezar(){
        if(btnIniciar.classList.contains("hide")){
            btnIniciar.classList.remove("hide")
        }else{
            btnIniciar.classList.add("hide")
        }
    }
    generarSecuencia(){
        this.secuencia = new Array(ultimoNivel).fill(0).map(n => Math.floor(Math.random() * 4))
    }
    siguienteNivel(){
        this.subnivel = 0
        this.iluminarSecuencia()
        this.agregarEventosClick()
    }
    transformarNumeroColor(numero){
        switch(numero){
            case 0:
                return "yellow"
            case 1:
                return "blue"
            case 2:
                return "green"
            case 3:
                return "red"
        }
    }
    transformarColorNumero(color){
        switch(color){
            case "yellow":
                return 0
            case "blue":
                return 1
            case "green":
                return 2
            case "red":
                return 3
        }
    }
    iluminarSecuencia(){
        for (let i = 0; i < this.nivel; i++){
            const color = this.transformarNumeroColor(this.secuencia[i])
            setTimeout(() => this.iluminarColor(color), 1000 * i)
        }
    }
    iluminarColor(color){
        this.colores[color].classList.add("light","animations")
        setTimeout(() => this.apagarColor(color), 350)
    }

    apagarColor(color){
        this.colores[color].classList.remove("light","animations")
    }
    agregarEventosClick(){
        this.colores.yellow.addEventListener("click", this.elegirColor)
        this.colores.blue.addEventListener("click", this.elegirColor)
        this.colores.green.addEventListener("click", this.elegirColor)
        this.colores.red.addEventListener("click", this.elegirColor)
    }
    eliminarEventosClick(){
        this.colores.yellow.removeEventListener("click", this.elegirColor)
        this.colores.blue.removeEventListener("click", this.elegirColor)
        this.colores.green.removeEventListener("click", this.elegirColor)
        this.colores.red.removeEventListener("click", this.elegirColor)
    }
    elegirColor(ev){
        const nombreColor = ev.target.dataset.color
        const numeroColor = this.transformarColorNumero(nombreColor)
        this.iluminarColor(nombreColor)
        if (numeroColor === this.secuencia[this.subnivel]){
            this.subnivel++
            if(this.subnivel === this.nivel){
                this.nivel++
                this.eliminarEventosClick()
                if(this.nivel === (ultimoNivel + 1)){
                    this.ganoElJuego()
                }else{
                    swal("Muy bien",{
                        icon: "success",
                        buttons: false,
                        timer: 800
                    })
                    setTimeout(this.siguienteNivel, 1500)
                }
            }
        }else{
            this.perdioElJuego()
        }
    }
    ganoElJuego(){
        swal("Ganaste!","Felicitaciones, ganaste el juego!","success")
            .then(this.iniciar)
    }
    perdioElJuego(){
        swal("Perdiste!","Lo lamentamos, perdiste :(","error")
            .then(() => {
                this.eliminarEventosClick()
                this.iniciar()
            })
    }
}

function empezarJuego(){
    window.juego = new Juego()
}