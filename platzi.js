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
        /* if (name in target) {
          return target[name];
        } */
        if (Reflect.has(target, name)) {
          return Reflect.get(target, name);
        }
        console.warn("La propiedad que intentas acceder no existe");
        return "";
      },
      set(target, name, value) {
        console.log("Cambiando", name, "a", value);
        Reflect.set(target, name, value);
      }
    });

    this.mount();
  }

  mount() {
    document.querySelectorAll("*[p-text]").forEach(el => {
      this.pText(el, this.$data, el.getAttribute("p-text"));
    });

    document.querySelectorAll("*[p-model]").forEach(el => {
      const attr = el.getAttribute("p-model");
      el.value = Reflect.get(this.$data, attr);

      el.addEventListener("input", () => {
        this.pModel(el, this.$data, attr);
      });
    });
  }

  pText(el, target, name) {
    const content = Reflect.get(target, name);
    el.innerText = content;
  }

  pModel(el, target, name) {
    Reflect.set(target, name, el.value);
  }
}

var Platzi = {
  createApp(options) {
    return new PlatziReactive(options);
  }
};
