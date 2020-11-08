class PlatziReactive {
  // Dependecias
  deps = new Map();

  /*
    options:
      data() => { ... }
  */
  constructor({ data }) {
    const origen = data();

    const self = this;

    // $data = destino
    this.$data = new Proxy(origen, {
      get(target, name) {
        /* if (name in target) {
          return target[name];
        } */
        if (Reflect.has(target, name)) {
          self.track(target, name);
          return Reflect.get(target, name);
        }
        console.warn("La propiedad que intentas acceder no existe");
        return "";
      },
      set(target, name, value) {
        Reflect.set(target, name, value);
        self.trigger(target, name);
      }
    });

    this.mount();
  }

  mount() {
    document.querySelectorAll("*[p-text]").forEach(el => {
      this.pText(el, this.$data, el.getAttribute("p-text"));
    });

    document.querySelectorAll("*[p-model]").forEach(el => {
      const name = el.getAttribute("p-model");
      el.value = Reflect.get(this.$data, name);

      el.addEventListener("input", () => {
        this.pModel(el, this.$data, name);
      });
    });
  }

  track(target, name) {
    if (!this.deps.has(name)) {
      const effect = () => {
        document.querySelectorAll(`*[p-text=${name}]`).forEach(el => {
          this.pText(el, target, name);
        });
      };
      this.deps.set(name, effect);
    }
  }

  trigger(target, name) {
    const effect = this.deps.get(name);
    effect();
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
