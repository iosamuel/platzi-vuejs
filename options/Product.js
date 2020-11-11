app.component("product", {
  template: /* vue-html */ `
    <section class="product">
      <div class="product__thumbnails">
        <div
          v-for="(image, index) in product.images"
          :key="image.thumbnail"
          class="thumb"
          :class="{ active: activeImage === index }"
          :style="{ backgroundImage: 'url('+ image.thumbnail +')' }"
          @click="activeImage = index"
        ></div>
      </div>
      <div class="product__image">
        <img :src="product.images[activeImage].image" :alt="product.name" />
      </div>
    </section>
    <section class="description">
      <h4>{{ product.name.toUpperCase() }} {{ product.stock === 0 ? "😭" : "😎" }}</h4>
      <span class="badge new" v-if="product.new">Nuevo</span>
      <span class="badge offer" v-if="product.offer">Oferta</span>
      <p class="description__status" v-if="product.stock === 3">Quedan pocas unidades!</p>
      <p class="description__status" v-else-if="product.stock === 2">
        El producto esta por terminarse!
      </p>
      <p class="description__status" v-else-if="product.stock === 1">
        Ultima unidad disponible!
      </p>
      <p class="description__price">
        $ {{ new Intl.NumberFormat("es-CO").format(product.price) }}
      </p>
      <p class="description__content">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt atque dolorum
        corporis, reiciendis eaque temporibus quod magnam amet ea natus delectus? Aut placeat
        ipsam minus labore voluptas. Porro, vel aliquid!
      </p>
      <div class="discount">
        <span>Codigo de Descuento:</span>
        <input
          type="text"
          placeholder="Ingresa tu codigo"
          @keyup.enter="applyDiscount($event)"
        />
      </div>
      <button :disabled="product.stock === 0" @click="addToCart()">Agregar al carrito</button>
    </section>
  `,
  data() {
    return {
      product: {
        name: "Camara",
        price: 450_000,
        stock: 3,
        content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt
          atque dolorum corporis, reiciendis eaque temporibus quod magnam amet
          ea natus delectus? Aut placeat ipsam minus labore voluptas. Porro,
          vel aliquid!`,
        images: [
          {
            image: "./images/camara.jpg",
            thumbnail: "./images/camara-thumb.jpg"
          },
          {
            image: "./images/camara-2.jpg",
            thumbnail: "./images/camara-2-thumb.jpg"
          }
        ],
        offer: true,
        new: true,
        quantity: 1
      },
      activeImage: 0
    };
  },
  methods: {
    applyDiscount(event) {
      const discountCodeIndex = this.discountCodes.indexOf(event.target.value);
      if (discountCodeIndex >= 0) {
        this.product.price *= 50 / 100;
        this.discountCodes.splice(discountCodeIndex, 1);
      }
    },
    addToCart() {
      const prodIndex = this.cart.findIndex(prod => prod.name === this.product.name);
      if (prodIndex >= 0) {
        this.cart[prodIndex].quantity += 1;
      } else {
        this.cart.push(this.product);
      }
      this.product.stock -= 1;
    }
  }
});
