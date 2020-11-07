class PlatziReactive {
  /*
    options:
      data() => { ... }
  */
  constructor({ data }) {
    const origen = data();

    // $data = destino
    this.$data = new Proxy(origen, {
      get(target, name) {
        if (name in target) {
          return target[name];
        }
        console.warn("La propiedad que intentas acceder no existe");
        return "";
      },
      set() {}
    });

    this.mount();
  }

  mount() {
    document.querySelectorAll("*[p-text]").forEach(el => {
      this.pText(el, this.$data, el.getAttribute("p-text"));
    });
  }

  pText(el, target, name) {
    const content = target[name];
    el.innerText = content;
  }
}

var Platzi = {
  createApp(options) {
    return new PlatziReactive(options);
  }
};
