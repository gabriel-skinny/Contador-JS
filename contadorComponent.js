(() => {
  const BTN_REINICIAR = "btnReiniciar";
  const ID_CONTADOR = "contador";
  const VALOR_CONTADOR = 10;
  const PERIODO_INTERVALO = 1000;

  class ContadorComponent {
    constructor() {
      this.inicializar();
    }

    prepararContadorProxy() {
      const handler = {
          set: (currentContext, propertyKey, newValue) => {

              if(!currentContext.valor) {
                currentContext.efetuarParada()
              }

              currentContext[propertyKey] = newValue
              
              return true
          }
      }

      const contador = new Proxy({
        valor: VALOR_CONTADOR,
        efetuarParada: () => {}
      }, handler)

      return contador
    }

    atualizarTexto = ({ contadorElement, contador }) => () => {
      const indentificadorTexto = '$$contador'
      const textoPadrao = `Começando em <strong>${indentificadorTexto}</strong> segundos...`
      contadorElement.innerHTML = textoPadrao.replace(indentificadorTexto, contador.valor--)
    }

    agendarParadaContador({ contadorElement, idIntervalo}) {
      
      return () => {
        clearInterval(idIntervalo)

        contadorElement.innerHTML = ""
        this.desabilitarBotao(false)
      }
    }

    prepararBotao(elementoBotao, iniciarFn) {
      elementoBotao.addEventListener("click", iniciarFn.bind(this))

      return (valor = true) => {
        const atributo = "disabled"

        if(valor) {
          elementoBotao.setAttribute(atributo, valor)
          return;
        }   
        
        elementoBotao.removeAttribute(atributo)
      }
    }

    inicializar() {
      const contadorElement = document.getElementById(ID_CONTADOR);

      const contador = this.prepararContadorProxy()
      
      const argumentos = {
        contadorElement,
        contador
      }

      const fn = this.atualizarTexto(argumentos)

      const idIntervalo = setInterval(fn, PERIODO_INTERVALO)

      {
        const elementoBotao = document.getElementById(BTN_REINICIAR)
        const desabilitarBotao = this.prepararBotao(elementoBotao, this.inicializar)
        desabilitarBotao()


        const argumentos = { contadorElement, idIntervalo }
        const pararContadorFn = this.agendarParadaContador.apply({ desabilitarBotao }, [argumentos])
        contador.efetuarParada = pararContadorFn
      }
    } 
  }

  window.ContadorComponent = ContadorComponent
})()
 
